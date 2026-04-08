package com.ayrfu.ayrfu.service;

import com.ayrfu.ayrfu.dto.request.AdminCreationRequest;
import com.ayrfu.ayrfu.dto.request.CandidateProfileRequest;
import com.ayrfu.ayrfu.dto.request.ClientProfileRequest;
import com.ayrfu.ayrfu.dto.response.CandidateResponse;
import com.ayrfu.ayrfu.dto.response.ClientResponse;
import com.ayrfu.ayrfu.dto.response.UserResponse;
import com.ayrfu.ayrfu.entity.User;

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