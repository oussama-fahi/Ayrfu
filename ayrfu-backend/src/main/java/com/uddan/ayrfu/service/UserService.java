package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.AdminCreationRequest;
import com.uddan.ayrfu.dto.request.CandidateProfileRequest;
import com.uddan.ayrfu.dto.request.ClientProfileRequest;
import com.uddan.ayrfu.dto.response.CandidateResponse;
import com.uddan.ayrfu.dto.response.ClientResponse;
import com.uddan.ayrfu.dto.response.UserResponse;
import com.uddan.ayrfu.entity.User;

import java.util.List;

public interface UserService {
    UserResponse createUser(User user);

    UserResponse createAdmin(AdminCreationRequest request);

    UserResponse updateUser(Long id, User user);

    void deleteUser(Long id);

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();

    boolean existsByEmail(String email);

    UserResponse activateUser(Long id);

    UserResponse deactivateUser(Long id);

    UserResponse addRoleToUser(Long userId, Long roleId);

    UserResponse removeRoleFromUser(Long userId, Long roleId);

    List<UserResponse> getUsersByRole(Long roleId);

    CandidateResponse updateCurrentUserCandidateProfile(CandidateProfileRequest profileRequest);

    ClientResponse updateCurrentUserClientProfile(ClientProfileRequest profileRequest);

    CandidateResponse getCurrentUserCandidateProfile();

    ClientResponse getCurrentUserClientProfile();
    UserResponse createSuperUser(User user);
    boolean isSuperUser(User user);
    boolean isAdmin(User user);
}