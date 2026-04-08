package com.ayrfu.ayrfu.dto.response;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public record ServiceResponse(
        Long id,
        String title,
        String description,
        String benefits,
        String availability,
        Set<String> keywords,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public ServiceResponse {
        keywords = keywords != null ? keywords : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private String benefits;
        private String availability;
        private Set<String> keywords = new HashSet<>();
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder benefits(String benefits) {
            this.benefits = benefits;
            return this;
        }

        public Builder availability(String availability) {
            this.availability = availability;
            return this;
        }

        public Builder keywords(Set<String> keywords) {
            this.keywords = keywords != null ? keywords : new HashSet<>();
            return this;
        }

        public Builder active(boolean active) {
            this.active = active;
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

        public ServiceResponse build() {
            return new ServiceResponse(id, title, description, benefits, availability,
                    keywords, active, createdAt, updatedAt);
        }
    }
}