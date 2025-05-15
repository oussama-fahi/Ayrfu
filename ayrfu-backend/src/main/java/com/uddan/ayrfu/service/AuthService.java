package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.*;
import com.uddan.ayrfu.dto.response.*;
import com.uddan.ayrfu.entity.User;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);

    CandidateResponse registerCandidate(CandidateRegistrationRequest request);

    ClientResponse registerClient(ClientRegistrationRequest request);

    UserResponse createAdmin(AdminCreationRequest request);

    UserResponse getCurrentUser();

    UserResponse updateCurrentUserProfile(User userUpdateRequest);

    boolean userHasRole(User user, String roleName);
}