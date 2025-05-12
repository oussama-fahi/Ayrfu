package com.uddan.ayrfu.dto.response;

import com.uddan.ayrfu.entity.Role;

import java.util.Set;

public record JwtResponse(
        String token,
        String refreshToken,
        Long id,
        String fullName,
        String email,
        Set<Role> roles
) {
    // Builder pattern for records
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String refreshToken;
        private Long id;
        private String fullName;
        private String email;
        private Set<Role> roles;

        private Builder() {
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder roles(Set<Role> roles) {
            this.roles = roles;
            return this;
        }

        public JwtResponse build() {
            return new JwtResponse(token, refreshToken, id, fullName, email, roles);
        }
    }
}