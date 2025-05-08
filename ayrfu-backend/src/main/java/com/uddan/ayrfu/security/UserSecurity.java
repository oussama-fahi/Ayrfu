package com.uddan.ayrfu.security;

import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {
    private final UserRepository userRepository;

    @Autowired
    public UserSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        String currentUserEmail = authentication.getName();
        User user = userRepository.findById(userId).orElse(null);
        return user != null && user.getEmail().equals(currentUserEmail);
    }

    public boolean hasEmail(String email) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        String currentUserEmail = authentication.getName();
        return currentUserEmail.equals(email);
    }
}