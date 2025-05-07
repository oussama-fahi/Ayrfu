package com.uddan.ayrfu.service;


import com.uddan.ayrfu.dto.request.LoginRequest;
import com.uddan.ayrfu.dto.request.RegisterRequest;
import com.uddan.ayrfu.dto.response.JwtResponse;
import com.uddan.ayrfu.dto.response.UserResponse;
import com.uddan.ayrfu.entity.User;


public interface AuthService {

    JwtResponse login(LoginRequest loginRequest);
    UserResponse register(RegisterRequest registerRequest);
    UserResponse getCurrentUser();
    UserResponse updateCurrentUserProfile(User updateRequest);
    boolean userHasRole(User user, String roleName);
}
