package com.ayrfu.ayrfu.service;

import com.ayrfu.ayrfu.dto.request.*;
import com.ayrfu.ayrfu.dto.response.*;
import com.ayrfu.ayrfu.entity.User;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);

    CandidateResponse registerCandidate(CandidateRegistrationRequest request);

    ClientResponse registerClient(ClientRegistrationRequest request);

    UserResponse createAdmin(AdminCreationRequest request);

    UserResponse getCurrentUser();

    UserResponse updateCurrentUserProfile(User userUpdateRequest);

    boolean userHasRole(User user, String roleName);
}