package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.LoginRequest;
import com.uddan.ayrfu.dto.request.RegisterRequest;
import com.uddan.ayrfu.dto.response.JwtResponse;
import com.uddan.ayrfu.dto.response.UserResponse;
import com.uddan.ayrfu.entity.Role;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.RoleRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.JwtUtil;
import com.uddan.ayrfu.security.RoleConstants;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        logger.info("Authenticating user with email: {}", loginRequest.getEmail());

        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details from authentication
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Get user entity to check if account is active
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!user.isActive()) {
                logger.warn("Login attempt for inactive account: {}", loginRequest.getEmail());
                throw new BadRequestException("Account is not active. Please contact support.");
            }

            // Generate JWT token using user details
            String jwt = jwtUtils.generateToken(userDetails);

            logger.info("User authenticated successfully: {}", userDetails.getUsername());

            // Build and return JWT response
            return JwtResponse.builder()
                    .token(jwt)
                    .id(userDetails.getId())
                    .email(userDetails.getEmail())
                    .fullName(userDetails.getUsername())
                    .roles(userDetails.getRoles())
                    .build();
        } catch (BadRequestException e) {
            // Re-throw BadRequestException
            throw e;
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getEmail(), e);
            throw new BadRequestException("Invalid credentials");
        }
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        logger.info("Registering new user with email: {}", registerRequest.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Registration failed: Email already in use: {}", registerRequest.getEmail());
            throw new BadRequestException("Email is already in use");
        }

        // Validate password
        if (registerRequest.getPassword() == null || registerRequest.getPassword().length() < 8) {
            logger.warn("Registration failed: Password too short");
            throw new BadRequestException("Password must be at least 8 characters long");
        }

        // Encode the password
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        // Set up default roles
        Set<Role> roles = new HashSet<>();

        // If roles were specified in the request, assign them
        if (registerRequest.getRoles() != null && !registerRequest.getRoles().isEmpty()) {
            for (Role requestRole : registerRequest.getRoles()) {
                String roleName = requestRole.getName();

                // Only allow ROLE_CANDIDATE or ROLE_CLIENT for public registration
                if (RoleConstants.ROLE_CANDIDATE.equals(roleName) ||
                        RoleConstants.ROLE_CLIENT.equals(roleName)) {
                    Role role = roleRepository.findByName(roleName)
                            .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
                    roles.add(role);
                } else {
                    logger.warn("Registration failed: Attempted to assign unauthorized role: {}", roleName);
                    throw new BadRequestException("Cannot assign role: " + roleName + " during registration");
                }
            }
        } else {
            // If no role specified, default to CANDIDATE
            Role defaultRole = roleRepository.findByName(RoleConstants.ROLE_CANDIDATE)
                    .orElseThrow(() -> new BadRequestException("Default role not found"));
            roles.add(defaultRole);
        }

        // Create new user
        User user = User.builder()
                .userName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(encodedPassword)
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getId());

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            logger.error("Failed to get current user: No valid authentication found");
            throw new BadRequestException("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUserProfile(User updateRequest) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            logger.error("Failed to update profile: No valid authentication found");
            throw new BadRequestException("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update user profile (only allowed fields)
        if (updateRequest.getUserName() != null && !updateRequest.getUserName().isBlank()) {
            user.setUserName(updateRequest.getUserName());
        }

        // Only update password if provided
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            // Validate password
            if (updateRequest.getPassword().length() < 8) {
                logger.warn("Profile update failed: Password too short for user ID: {}", user.getId());
                throw new BadRequestException("Password must be at least 8 characters long");
            }
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        // Save updated user
        User updatedUser = userRepository.save(user);
        logger.info("User profile updated successfully for ID: {}", updatedUser.getId());

        return mapToUserResponse(updatedUser);
    }

    @Override
    public boolean userHasRole(User user, String roleName) {
        if (user == null || roleName == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    /**
     * Maps a User entity to a UserResponse DTO
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getUserName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}