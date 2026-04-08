package com.ayrfu.ayrfu.dto.response;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public record PositionResponse(
        Long id,
        String title,
        String description,
        String technology,
        String location,
        Set<String> languages,
        String experienceLevel,
        String workModel,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public PositionResponse {
        languages = languages != null ? languages : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private String technology;
        private String location;
        private Set<String> languages = new HashSet<>();
        private String experienceLevel;
        private String workModel;
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

        public Builder technology(String technology) {
            this.technology = technology;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
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

        public Builder workModel(String workModel) {
            this.workModel = workModel;
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

        public PositionResponse build() {
            return new PositionResponse(id, title, description, technology, location,
                    languages, experienceLevel, workModel, active,
                    createdAt, updatedAt);
        }
    }
}

