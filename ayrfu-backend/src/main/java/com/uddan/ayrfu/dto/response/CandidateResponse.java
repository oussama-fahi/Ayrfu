package com.uddan.ayrfu.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public record CandidateResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        String address,
        LocalDate dateOfBirth,
        String gender,
        Set<String> technologies,
        Set<String> languages,
        String experienceLevel,
        String preferredLocation,
        String preferredWorkModel,
        String cvPath,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public CandidateResponse {
        technologies = technologies != null ? technologies : new HashSet<>();
        languages = languages != null ? languages : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String address;
        private LocalDate dateOfBirth;
        private String gender;
        private Set<String> technologies = new HashSet<>();
        private Set<String> languages = new HashSet<>();
        private String experienceLevel;
        private String preferredLocation;
        private String preferredWorkModel;
        private String cvPath;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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

        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder dateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public Builder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public Builder technologies(Set<String> technologies) {
            this.technologies = technologies != null ? technologies : new HashSet<>();
            return this;
        }

        public Builder languages(Set<String> languages) {
            this.languages = languages != null ? languages : new HashSet<>();
            return this;
        }

        public Builder experienceLevel(String experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public Builder preferredLocation(String preferredLocation) {
            this.preferredLocation = preferredLocation;
            return this;
        }

        public Builder preferredWorkModel(String preferredWorkModel) {
            this.preferredWorkModel = preferredWorkModel;
            return this;
        }

        public Builder cvPath(String cvPath) {
            this.cvPath = cvPath;
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

        public CandidateResponse build() {
            return new CandidateResponse(id, fullName, email, phoneNumber, address, dateOfBirth, gender,
                    technologies, languages, experienceLevel, preferredLocation,
                    preferredWorkModel, cvPath, createdAt, updatedAt);
        }
    }
}

