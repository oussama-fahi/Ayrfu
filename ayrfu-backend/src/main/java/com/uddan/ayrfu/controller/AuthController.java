package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.LoginRequest;
import com.uddan.ayrfu.dto.request.RegisterRequest;
import com.uddan.ayrfu.dto.response.JwtResponse;
import com.uddan.ayrfu.dto.response.UserResponse;
import com.uddan.ayrfu.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication API", description = "APIs for authentication and user management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService=authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates a user and returns a JWT token")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.login(loginRequest);
            System.out.println("jwt response : "+response.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("error : "+e.getMessage());
            e.printStackTrace(); // Add debugging
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    @PostMapping("/register")
    //@PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register", description = "Registers a new user with the provided details")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse userResponse = authService.register(registerRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Retrieves the current authenticated user's details")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse userResponse = authService.getCurrentUser();
        return ResponseEntity.ok(userResponse);
    }
}