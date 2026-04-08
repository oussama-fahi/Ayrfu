package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.request.AdminCreationRequest;
import com.ayrfu.ayrfu.dto.request.CandidateRegistrationRequest;
import com.ayrfu.ayrfu.dto.request.ClientRegistrationRequest;
import com.ayrfu.ayrfu.dto.request.LoginRequest;
import com.ayrfu.ayrfu.dto.response.CandidateResponse;
import com.ayrfu.ayrfu.dto.response.ClientResponse;
import com.ayrfu.ayrfu.dto.response.JwtResponse;
import com.ayrfu.ayrfu.dto.response.UserResponse;
import com.ayrfu.ayrfu.entity.User;
import com.ayrfu.ayrfu.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API endpoints")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login request for user: {}", loginRequest.getEmail());
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    @PostMapping("/register/candidate")
    @Operation(summary = "Register Candidate", description = "Registers a new candidate user with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Candidate registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already in use")
    })
    public ResponseEntity<CandidateResponse> registerCandidate(@Valid @RequestBody CandidateRegistrationRequest request) {
        logger.info("Registration request for candidate: {}", request.getEmail());
        CandidateResponse response = authService.registerCandidate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register/client")
    @Operation(summary = "Register Client", description = "Registers a new client user with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Client registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already in use")
    })
    public ResponseEntity<ClientResponse> registerClient(@Valid @RequestBody ClientRegistrationRequest request) {
        logger.info("Registration request for client: {}", request.getEmail());
        ClientResponse response = authService.registerClient(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('SUPER_USER')")
    @Operation(summary = "Create Admin", description = "Creates a new admin user (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Admin created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already in use"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role")
    })
    public ResponseEntity<UserResponse> createAdmin(@Valid @RequestBody AdminCreationRequest request) {
        logger.info("Admin creation request for: {}", request.getEmail());
        UserResponse response = authService.createAdmin(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Retrieves the current authenticated user's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized, authentication required")
    })
    public ResponseEntity<UserResponse> getCurrentUser() {
        logger.info("Request to get current user profile");
        UserResponse userResponse = authService.getCurrentUser();
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user profile", description = "Updates basic profile information for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized, authentication required")
    })
    public ResponseEntity<UserResponse> updateCurrentUserProfile(@Valid @RequestBody User userUpdateRequest) {
        logger.info("Request to update current user profile");
        UserResponse updatedUser = authService.updateCurrentUserProfile(userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }
}