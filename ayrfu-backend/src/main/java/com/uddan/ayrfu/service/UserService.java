package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.response.UserResponse;
import com.uddan.ayrfu.entity.User;
import java.util.List;

public interface UserService {

    UserResponse createUser(User user);

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
}