package com.ayrfu.ayrfu.dto.response;

import java.time.LocalDateTime;

public record UserBasicResponse(
        Long id,
        String fullName,
        String email,
        String userType
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String fullName;
        private String email;
        private String userType;

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

        public Builder userType(String userType) {
            this.userType = userType;
            return this;
        }

        public UserBasicResponse build() {
            return new UserBasicResponse(id, fullName, email, userType);
        }
    }
}