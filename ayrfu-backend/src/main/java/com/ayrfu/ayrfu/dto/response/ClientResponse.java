package com.ayrfu.ayrfu.dto.response;

import java.time.LocalDateTime;

public record ClientResponse(
        Long id,
        String companyName,
        String contactPerson,
        String email,
        String phoneNumber,
        String industry,
        String companySize,
        String requirements,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String companyName;
        private String contactPerson;
        private String email;
        private String phoneNumber;
        private String industry;
        private String companySize;
        private String requirements;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder contactPerson(String contactPerson) {
            this.contactPerson = contactPerson;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder industry(String industry) {
            this.industry = industry;
            return this;
        }

        public Builder companySize(String companySize) {
            this.companySize = companySize;
            return this;
        }

        public Builder requirements(String requirements) {
            this.requirements = requirements;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ClientResponse build() {
            return new ClientResponse(id, companyName, contactPerson, email, phoneNumber,
                    industry, companySize, requirements, createdAt, updatedAt);
        }
    }
}
