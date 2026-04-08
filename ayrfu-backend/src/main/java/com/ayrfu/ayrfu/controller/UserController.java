package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.request.AdminCreationRequest;
import com.ayrfu.ayrfu.dto.request.CandidateProfileRequest;
import com.ayrfu.ayrfu.dto.request.ClientProfileRequest;
import com.ayrfu.ayrfu.dto.response.CandidateResponse;
import com.ayrfu.ayrfu.dto.response.ClientResponse;
import com.ayrfu.ayrfu.dto.response.UserResponse;
import com.ayrfu.ayrfu.entity.User;
import com.ayrfu.ayrfu.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Create a new user", description = "Creates a new user with the provided information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> createUser(
            @Parameter(description = "User to be created", required = true)
            @Valid @RequestBody User user) {
        logger.info("Request to create user with email: {}", user.getEmail());
        UserResponse createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/super-users")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Create a new super user", description = "Creates a new super user with the provided information (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Super user created successfully",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> createSuperUser(
            @Parameter(description = "Super user to be created", required = true)
            @Valid @RequestBody User user) {
        logger.info("Request to create super user with email: {}", user.getEmail());
        UserResponse createdUser = userService.createSuperUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Update a user", description = "Updates an existing user with the provided information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> updateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated user data", required = true)
            @Valid @RequestBody User user) {
        logger.info("Request to update user with ID: {}", id);
        UserResponse updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Delete a user", description = "Deletes a user by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long id) {
        logger.info("Request to delete user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER') or @authService.userHasRole(authentication.principal.user, 'ROLE_ADMIN') or @authService.userHasRole(authentication.principal.user, 'ROLE_SUPER_USER') or authentication.principal.id == #id")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires appropriate permissions")
    })
    public ResponseEntity<UserResponse> getUserById(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long id) {
        logger.info("Request to get user with ID: {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get user by email", description = "Retrieves a user by their email address")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role")
    })
    public ResponseEntity<UserResponse> getUserByEmail(
            @Parameter(description = "User email", required = true)
            @PathVariable String email) {
        logger.info("Request to get user with email: {}", email);
        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get all users", description = "Retrieves a list of all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of users retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role")
    })
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.info("Request to get all users");
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Activate user", description = "Activates a user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User activated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> activateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long id) {
        logger.info("Request to activate user with ID: {}", id);
        UserResponse activatedUser = userService.activateUser(id);
        return ResponseEntity.ok(activatedUser);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Deactivate user", description = "Deactivates a user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deactivated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> deactivateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long id) {
        logger.info("Request to deactivate user with ID: {}", id);
        UserResponse deactivatedUser = userService.deactivateUser(id);
        return ResponseEntity.ok(deactivatedUser);
    }

    @PatchMapping("/{userId}/roles/{roleId}/add")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Add role to user", description = "Adds a role to a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role added successfully"),
            @ApiResponse(responseCode = "404", description = "User or role not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> addRoleToUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "Role ID", required = true)
            @PathVariable Long roleId) {
        logger.info("Request to add role {} to user {}", roleId, userId);
        UserResponse updatedUser = userService.addRoleToUser(userId, roleId);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{userId}/roles/{roleId}/remove")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Remove role from user", description = "Removes a role from a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role removed successfully"),
            @ApiResponse(responseCode = "404", description = "User or role not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> removeRoleFromUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "Role ID", required = true)
            @PathVariable Long roleId) {
        logger.info("Request to remove role {} from user {}", roleId, userId);
        UserResponse updatedUser = userService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get users by role", description = "Retrieves all users with a specific role")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role")
    })
    public ResponseEntity<List<UserResponse>> getUsersByRole(
            @Parameter(description = "Role ID", required = true)
            @PathVariable Long roleId) {
        logger.info("Request to get users with role ID: {}", roleId);
        List<UserResponse> users = userService.getUsersByRole(roleId);
        return ResponseEntity.ok(users);
    }

    // Profile management endpoints

    @GetMapping("/profile/candidate")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's candidate profile", description = "Retrieves the candidate profile of the current authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Candidate profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CandidateResponse.class))),
            @ApiResponse(responseCode = "404", description = "Candidate profile not found")
    })
    public ResponseEntity<CandidateResponse> getCurrentUserCandidateProfile() {
        logger.info("Request to get candidate profile for current user");
        CandidateResponse candidateProfile = userService.getCurrentUserCandidateProfile();
        return ResponseEntity.ok(candidateProfile);
    }

    @PutMapping("/profile/candidate")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user's candidate profile", description = "Updates or creates the candidate profile of the current authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Candidate profile updated successfully",
                    content = @Content(schema = @Schema(implementation = CandidateResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<CandidateResponse> updateCurrentUserCandidateProfile(
            @Valid @RequestBody CandidateProfileRequest profileRequest) {
        logger.info("Request to update candidate profile for current user");
        CandidateResponse updatedProfile = userService.updateCurrentUserCandidateProfile(profileRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/profile/client")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's client profile", description = "Retrieves the client profile of the current authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ClientResponse.class))),
            @ApiResponse(responseCode = "404", description = "Client profile not found")
    })
    public ResponseEntity<ClientResponse> getCurrentUserClientProfile() {
        logger.info("Request to get client profile for current user");
        ClientResponse clientProfile = userService.getCurrentUserClientProfile();
        return ResponseEntity.ok(clientProfile);
    }

    @PutMapping("/profile/client")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user's client profile", description = "Updates or creates the client profile of the current authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client profile updated successfully",
                    content = @Content(schema = @Schema(implementation = ClientResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ClientResponse> updateCurrentUserClientProfile(
            @Valid @RequestBody ClientProfileRequest profileRequest) {
        logger.info("Request to update client profile for current user");
        ClientResponse updatedProfile = userService.updateCurrentUserClientProfile(profileRequest);
        return ResponseEntity.ok(updatedProfile);
    }
    @PostMapping("/admin")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Create a new admin", description = "Creates a new super user (super only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "user created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires Super User role")
    })
    public ResponseEntity<UserResponse> createAdmin(@Valid @RequestBody AdminCreationRequest request) {
        logger.info("Request to create admin with email: {}", request.getEmail());
        UserResponse createdAdmin = userService.createAdmin(request);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @PostMapping("/super-admin")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Create a new super admin", description = "Creates a new super admin user (super only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Super admin created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires Super user role")
    })
    public ResponseEntity<UserResponse> createSuperAdmin(@Valid @RequestBody AdminCreationRequest request) {
        logger.info("Request to create super admin with email: {}", request.getEmail());
        request.setSuperUser(true); // Force super user flag to true
        UserResponse createdSuperAdmin = userService.createAdmin(request);
        return new ResponseEntity<>(createdSuperAdmin, HttpStatus.CREATED);
    }
}