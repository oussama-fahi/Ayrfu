package com.ayrfu.ayrfu.service.impl;

import com.ayrfu.ayrfu.dto.request.AdminCreationRequest;
import com.ayrfu.ayrfu.dto.request.CandidateProfileRequest;
import com.ayrfu.ayrfu.dto.request.ClientProfileRequest;
import com.ayrfu.ayrfu.dto.response.CandidateResponse;
import com.ayrfu.ayrfu.dto.response.ClientResponse;
import com.ayrfu.ayrfu.dto.response.UserResponse;
import com.ayrfu.ayrfu.entity.Candidate;
import com.ayrfu.ayrfu.entity.Client;
import com.ayrfu.ayrfu.entity.Role;
import com.ayrfu.ayrfu.entity.User;
import com.ayrfu.ayrfu.exception.BadRequestException;
import com.ayrfu.ayrfu.exception.ResourceNotFoundException;
import com.ayrfu.ayrfu.repository.CandidateRepository;
import com.ayrfu.ayrfu.repository.ClientRepository;
import com.ayrfu.ayrfu.repository.RoleRepository;
import com.ayrfu.ayrfu.repository.UserRepository;
import com.ayrfu.ayrfu.security.RoleConstants;
import com.ayrfu.ayrfu.security.UserDetailsImpl;
import com.ayrfu.ayrfu.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateRepository candidateRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           CandidateRepository candidateRepository,
                           ClientRepository clientRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.candidateRepository = candidateRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponse createAdmin(AdminCreationRequest request) {
        logger.info("Creating admin user with email: {}", request.getEmail());

        // Check for required admin privileges
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();
            User adminUser = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!isAdmin(adminUser)) {
                throw new BadRequestException("Only administrators can create admin users");
            }
        } else {
            throw new BadRequestException("Authentication required");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Set up roles
        Set<Role> roles = new HashSet<>();

        // Add ADMIN role
        Role adminRole = roleRepository.findByName(RoleConstants.ROLE_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("ADMIN role not found"));
        roles.add(adminRole);

        // Add SUPER_USER role if specified
        if (request.isSuperUser()) {
            Role superUserRole = roleRepository.findByName(RoleConstants.ROLE_SUPER_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("SUPER_USER role not found"));
            roles.add(superUserRole);
        }

        // Create user
        User user = User.builder()
                .userName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("Admin user created with ID: {}", savedUser.getId());

        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse createUser(User user) {
        logger.info("Creating new user with email: {}", user.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long id, User user) {
        logger.info("Updating user with ID: {}", id);
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        existingUser.setUserName(user.getUserName());

        // Only update email if it's different and not already in use
        if (!existingUser.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new BadRequestException("Email already in use");
            }
            existingUser.setEmail(user.getEmail());
        }

        // Only update password if provided
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        existingUser.setActive(user.isActive());

        User updatedUser = userRepository.save(existingUser);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        logger.info("Deleting user with ID: {}", id);
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        logger.info("Getting user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        logger.info("Getting user with email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        logger.info("Getting all users");
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserResponse activateUser(Long id) {
        logger.info("Activating user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(true);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public UserResponse deactivateUser(Long id) {
        logger.info("Deactivating user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(false);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public UserResponse addRoleToUser(Long userId, Long roleId) {
        logger.info("Adding role with ID: {} to user with ID: {}", roleId, userId);

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Check if current user is an admin (only admins can assign SUPER_USER role)
        Role roleToAdd = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        if (RoleConstants.ROLE_SUPER_USER.equals(roleToAdd.getName()) && !isAdmin(currentUser)) {
            throw new BadRequestException("Only administrators can assign the SUPER_USER role");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.addRole(roleToAdd);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public UserResponse removeRoleFromUser(Long userId, Long roleId) {
        logger.info("Removing role with ID: {} from user with ID: {}", roleId, userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        // Prevent removing the last role
        if (user.getRoles().size() <= 1) {
            throw new BadRequestException("Cannot remove the last role from a user");
        }

        user.removeRole(role);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(Long roleId) {
        logger.info("Getting users with role ID: {}", roleId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        List<User> users = userRepository.findByRolesContaining(role);
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CandidateResponse updateCurrentUserCandidateProfile(CandidateProfileRequest profileRequest) {
        logger.info("Updating candidate profile for current user");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Check if user has CANDIDATE role
        if (!userHasRole(currentUser, RoleConstants.ROLE_CANDIDATE)) {
            // Add CANDIDATE role to the user
            Role candidateRole = roleRepository.findByName(RoleConstants.ROLE_CANDIDATE)
                    .orElseThrow(() -> new ResourceNotFoundException("CANDIDATE role not found"));
            currentUser.addRole(candidateRole);
            userRepository.save(currentUser);
        }

        // Get or create candidate profile
        Candidate candidate = currentUser.getCandidate();
        if (candidate == null) {
            candidate = new Candidate();
            candidate.setUser(currentUser);
        }

        // Update candidate profile fields
        if (profileRequest.getFullName() != null) {
            candidate.setFullName(profileRequest.getFullName());
            // Also update user name to keep in sync
            currentUser.setUserName(profileRequest.getFullName());
            userRepository.save(currentUser);
        }

        if (profileRequest.getEmail() != null) {
            // Only update email if it's different and not already in use by another user
            if (!candidate.getEmail().equals(profileRequest.getEmail())) {
                if (candidateRepository.existsByEmailAndIdNot(profileRequest.getEmail(), candidate.getId())) {
                    throw new BadRequestException("Email already in use by another candidate");
                }
                candidate.setEmail(profileRequest.getEmail());
            }
        }

        if (profileRequest.getPhoneNumber() != null) {
            candidate.setPhoneNumber(profileRequest.getPhoneNumber());
        }

        if (profileRequest.getAddress() != null) {
            candidate.setAddress(profileRequest.getAddress());
        }

        if (profileRequest.getDateOfBirth() != null) {
            candidate.setDateOfBirth(profileRequest.getDateOfBirth());
        }

        if (profileRequest.getGender() != null) {
            candidate.setGender(profileRequest.getGender());
        }

        if (profileRequest.getTechnologies() != null && !profileRequest.getTechnologies().isEmpty()) {
            candidate.setTechnologies(profileRequest.getTechnologies());
        }

        if (profileRequest.getLanguages() != null && !profileRequest.getLanguages().isEmpty()) {
            candidate.setLanguages(profileRequest.getLanguages());
        }

        if (profileRequest.getExperienceLevel() != null) {
            candidate.setExperienceLevel(profileRequest.getExperienceLevel());
        }

        if (profileRequest.getPreferredLocation() != null) {
            candidate.setPreferredLocation(profileRequest.getPreferredLocation());
        }

        if (profileRequest.getPreferredWorkModel() != null) {
            candidate.setPreferredWorkModel(profileRequest.getPreferredWorkModel());
        }

        // Save candidate profile
        Candidate updatedCandidate = candidateRepository.save(candidate);

        return mapToCandidateResponse(updatedCandidate);
    }

    @Override
    public ClientResponse updateCurrentUserClientProfile(ClientProfileRequest profileRequest) {
        logger.info("Updating client profile for current user");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Check if user has CLIENT role
        if (!userHasRole(currentUser, RoleConstants.ROLE_CLIENT)) {
            // Add CLIENT role to the user
            Role clientRole = roleRepository.findByName(RoleConstants.ROLE_CLIENT)
                    .orElseThrow(() -> new ResourceNotFoundException("CLIENT role not found"));
            currentUser.addRole(clientRole);
            userRepository.save(currentUser);
        }

        // Get or create client profile
        Client client = currentUser.getClient();
        if (client == null) {
            client = new Client();
            client.setUser(currentUser);
        }

        // Update client profile fields
        if (profileRequest.getCompanyName() != null) {
            client.setCompanyName(profileRequest.getCompanyName());
        }

        if (profileRequest.getContactPerson() != null) {
            client.setContactPerson(profileRequest.getContactPerson());
            // Also update user name to keep in sync
            currentUser.setUserName(profileRequest.getContactPerson());
            userRepository.save(currentUser);
        }

        if (profileRequest.getEmail() != null) {
            // Only update email if it's different and not already in use by another client
            if (!client.getEmail().equals(profileRequest.getEmail())) {
                if (clientRepository.existsByEmailAndIdNot(profileRequest.getEmail(), client.getId())) {
                    throw new BadRequestException("Email already in use by another client");
                }
                client.setEmail(profileRequest.getEmail());
            }
        }

        if (profileRequest.getPhoneNumber() != null) {
            client.setPhoneNumber(profileRequest.getPhoneNumber());
        }

        if (profileRequest.getIndustry() != null) {
            client.setIndustry(profileRequest.getIndustry());
        }

        if (profileRequest.getCompanySize() != null) {
            client.setCompanySize(profileRequest.getCompanySize());
        }

        if (profileRequest.getRequirements() != null) {
            client.setRequirements(profileRequest.getRequirements());
        }

        // Save client profile
        Client updatedClient = clientRepository.save(client);

        return mapToClientResponse(updatedClient);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCurrentUserCandidateProfile() {
        logger.info("Getting candidate profile for current user");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Get candidate profile if exists
        Candidate candidate = currentUser.getCandidate();
        if (candidate == null) {
            throw new ResourceNotFoundException("Candidate profile not found for current user");
        }

        return mapToCandidateResponse(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getCurrentUserClientProfile() {
        logger.info("Getting client profile for current user");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Get client profile if exists
        Client client = currentUser.getClient();
        if (client == null) {
            throw new ResourceNotFoundException("Client profile not found for current user");
        }

        return mapToClientResponse(client);
    }

    @Override
    public boolean isSuperUser(User user) {
        return userHasRole(user, RoleConstants.ROLE_SUPER_USER);
    }

    @Override
    public boolean isAdmin(User user) {
        return userHasRole(user, RoleConstants.ROLE_ADMIN);
    }

    @Override
    public UserResponse createSuperUser(User user) {
        logger.info("Creating super user with email: {}", user.getEmail());

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Check if current user is an admin
        if (!isAdmin(currentUser)) {
            throw new BadRequestException("Only administrators can create super users");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Add SUPER_USER role
        Role superUserRole = roleRepository.findByName(RoleConstants.ROLE_SUPER_USER)
                .orElseThrow(() -> new ResourceNotFoundException("SUPER_USER role not found"));
        user.addRole(superUserRole);

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }


    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }


    private boolean userHasRole(User user, String roleName) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }


    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getUserName())
                .email(user.getEmail())
                .active(user.isActive())
                .roles(user.getRoles())
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
