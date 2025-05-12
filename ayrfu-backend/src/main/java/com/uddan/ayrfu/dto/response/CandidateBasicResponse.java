package com.uddan.ayrfu.dto.response;

import java.util.Set;

public record CandidateBasicResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        Set<String> technologies,
        Set<String> languages,
        String experienceLevel
) {
    // Builder pattern for records
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private Set<String> technologies;
        private Set<String> languages;
        private String experienceLevel;

        private Builder() {
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

        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder technologies(Set<String> technologies) {
            this.technologies = technologies;
            return this;
        }

        public Builder languages(Set<String> languages) {
            this.languages = languages;
            return this;
        }

        public Builder experienceLevel(String experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public CandidateBasicResponse build() {
            return new CandidateBasicResponse(id, fullName, email, phoneNumber, technologies, languages, experienceLevel);
        }
    }
}