package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.*;
import com.uddan.ayrfu.dto.response.*;
import com.uddan.ayrfu.entity.*;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.*;
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
    private final CandidateRepository candidateRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           CandidateRepository candidateRepository,
                           ClientRepository clientRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.candidateRepository = candidateRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        logger.info("Authenticating user with email: {}", loginRequest.getEmail());

        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details from authentication
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

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
    }

    @Override
    @Transactional
    public CandidateResponse registerCandidate(CandidateRegistrationRequest request) {
        logger.info("Registering new candidate with email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already in use: {}", request.getEmail());
            throw new BadRequestException("Email is already in use");
        }

        // Encode the password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Create user with CANDIDATE role
        Role candidateRole = roleRepository.findByName(RoleConstants.ROLE_CANDIDATE)
                .orElseThrow(() -> new ResourceNotFoundException("CANDIDATE role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(candidateRole);

        User user = User.builder()
                .userName(request.getFullName())
                .email(request.getEmail())
                .password(encodedPassword)
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // Create candidate profile
        Candidate candidate = Candidate.builder()
                .user(savedUser)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .technologies(request.getTechnologies())
                .languages(request.getLanguages())
                .experienceLevel(request.getExperienceLevel())
                .preferredLocation(request.getPreferredLocation())
                .preferredWorkModel(request.getPreferredWorkModel())
                .build();

        Candidate savedCandidate = candidateRepository.save(candidate);

        logger.info("Candidate registered successfully with ID: {}", savedCandidate.getId());

        return mapToCandidateResponse(savedCandidate);
    }

    @Override
    @Transactional
    public ClientResponse registerClient(ClientRegistrationRequest request) {
        logger.info("Registering new client with email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already in use: {}", request.getEmail());
            throw new BadRequestException("Email is already in use");
        }

        // Encode the password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Create user with CLIENT role
        Role clientRole = roleRepository.findByName(RoleConstants.ROLE_CLIENT)
                .orElseThrow(() -> new ResourceNotFoundException("CLIENT role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(clientRole);

        User user = User.builder()
                .userName(request.getContactPerson())
                .email(request.getEmail())
                .password(encodedPassword)
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // Create client profile
        Client client = Client.builder()
                .user(savedUser)
                .companyName(request.getCompanyName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .requirements(request.getRequirements())
                .build();

        Client savedClient = clientRepository.save(client);

        logger.info("Client registered successfully with ID: {}", savedClient.getId());

        return mapToClientResponse(savedClient);
    }

    @Override
    @Transactional
    public UserResponse createAdmin(AdminCreationRequest request) {
        logger.info("Creating admin with email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Admin creation failed: Email already in use: {}", request.getEmail());
            throw new BadRequestException("Email is already in use");
        }

        // Encode the password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Set up roles based on whether it's a super user or regular admin
        Set<Role> roles = new HashSet<>();

        Role adminRole = roleRepository.findByName(RoleConstants.ROLE_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("ADMIN role not found"));
        roles.add(adminRole);

        if (request.isSuperUser()) {
            Role superUserRole = roleRepository.findByName(RoleConstants.ROLE_SUPER_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("SUPER_USER role not found"));
            roles.add(superUserRole);
        }

        // Create user
        User user = User.builder()
                .userName(request.getFullName())
                .email(request.getEmail())
                .password(encodedPassword)
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("Admin created successfully with ID: {}", savedUser.getId());

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUserProfile(User updateRequest) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Update user profile (only allowed fields)
        user.setUserName(updateRequest.getUserName());

        // Only update password if provided
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        // Save updated user
        User updatedUser = userRepository.save(user);

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

    // Mapper methods
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

    private CandidateResponse mapToCandidateResponse(Candidate candidate) {
        return CandidateResponse.builder()
                .id(candidate.getId())
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .address(candidate.getAddress())
                .dateOfBirth(candidate.getDateOfBirth())
                .gender(candidate.getGender())
                .technologies(candidate.getTechnologies())
                .languages(candidate.getLanguages())
                .experienceLevel(candidate.getExperienceLevel())
                .preferredLocation(candidate.getPreferredLocation())
                .preferredWorkModel(candidate.getPreferredWorkModel())
                .cvPath(candidate.getCvPath())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }

    private ClientResponse mapToClientResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .contactPerson(client.getContactPerson())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .industry(client.getIndustry())
                .companySize(client.getCompanySize())
                .requirements(client.getRequirements())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }




}
//    @Override
//    @Transactional
//    public UserResponse register(RegisterRequest registerRequest) {
//        logger.info("Registering new user with email: {}", registerRequest.getEmail());
//
//        // Check if email already exists
//        if (userRepository.existsByEmail(registerRequest.getEmail())) {
//            throw new BadRequestException("Email is already in use");
//        }
//
//        // Encode the password
//        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
//
//        // Set up default roles
//        Set<Role> roles = new HashSet<>();
//
//        // If roles were specified in the request, assign them
//        if (registerRequest.getRoles() != null && !registerRequest.getRoles().isEmpty()) {
//            for (Role requestRole : registerRequest.getRoles()) {
//                String roleName = requestRole.getName();
//
//                // Only allow ROLE_CANDIDATE or ROLE_CLIENT for public registration
//                if (RoleConstants.ROLE_CANDIDATE.equals(roleName) ||
//                        RoleConstants.ROLE_CLIENT.equals(roleName)) {
//                    Role role = roleRepository.findByName(roleName)
//                            .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
//                    roles.add(role);
//                } else {
//                    throw new BadRequestException("Cannot assign role: " + roleName + " during registration");
//                }
//            }
//        } else {
//            // If no role specified, default to CANDIDATE
//            Role defaultRole = roleRepository.findByName(RoleConstants.ROLE_CANDIDATE)
//                    .orElseThrow(() -> new BadRequestException("Default role not found"));
//            roles.add(defaultRole);
//        }
//
//        // Create new user
//        User user = User.builder()
//                .userName(registerRequest.getFullName())
//                .email(registerRequest.getEmail())
//                .password(encodedPassword)
//                .roles(roles)
//                .active(true)
//                .build();
//
//        User savedUser = userRepository.save(user);
//        logger.info("User registered successfully with ID: {}", savedUser.getId());
//
//        return mapToUserResponse(savedUser);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public UserResponse getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//
//        User user = userRepository.findById(userDetails.getId())
//                .orElseThrow(() -> new BadRequestException("User not found"));
//
//        return mapToUserResponse(user);
//    }
//
//
//
//    @Override
//    public boolean userHasRole(User user, String roleName) {
//        return user.getRoles().stream()
//                .anyMatch(role -> role.getName().equals(roleName));
//    }
//
//    /**
//     * Maps a User entity to a UserResponse DTO
//     */
//    private UserResponse mapToUserResponse(User user) {
//        return UserResponse.builder()
//                .id(user.getId())
//                .fullName(user.getUserName())
//                .email(user.getEmail())
//                .roles(user.getRoles())
//                .active(user.isActive())
//                .createdAt(user.getCreatedAt())
//                .updatedAt(user.getUpdatedAt())
//                .build();
//    }
//}