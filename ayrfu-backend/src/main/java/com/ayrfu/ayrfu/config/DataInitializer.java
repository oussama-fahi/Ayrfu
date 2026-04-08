package com.ayrfu.ayrfu.config;

import com.ayrfu.ayrfu.entity.Role;
import com.ayrfu.ayrfu.entity.User;
import com.ayrfu.ayrfu.repository.RoleRepository;
import com.ayrfu.ayrfu.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Only run if no users exist
            if (userRepository.count() == 0) {
                System.out.println("Initializing database with test users...");

                // Find admin role
                Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("Admin role not found!"));

                // Create admin user
                User adminUser = new User();
                adminUser.setUserName("Admin User");
                adminUser.setEmail("admin@admin.com");
                // Encoding password with BCrypt encoder
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setActive(true);
                adminUser.setCreatedAt(LocalDateTime.now());
                adminUser.setUpdatedAt(LocalDateTime.now());

                // Set admin role
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);

                // Save user
                userRepository.save(adminUser);

                System.out.println("Created admin user:");
                System.out.println("Email: admin@admin.com");
                System.out.println("Password: admin123");
                System.out.println("BCrypt hash: " + adminUser.getPassword());
            } else {
                System.out.println("Database already contains users, skipping initialization");
            }
        };
    }
}
