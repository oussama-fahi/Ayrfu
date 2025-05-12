package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class PositionResponse {
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
    private Integer matchScore = 0;

    // Default constructor
    public PositionResponse() {
    }

    // All-args constructor
    public PositionResponse(Long id, String title, String description, String technology, String location,
                            Set<String> languages, String experienceLevel, String workModel, boolean active,
                            LocalDateTime createdAt, LocalDateTime updatedAt, Integer matchScore) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.technology = technology;
        this.location = location;
        this.languages = languages != null ? languages : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.workModel = workModel;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.matchScore = matchScore != null ? matchScore : 0;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<String> getLanguages() {
        return languages;
    }

    public void setLanguages(Set<String> languages) {
        this.languages = languages != null ? languages : new HashSet<>();
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getWorkModel() {
        return workModel;
    }

    public void setWorkModel(String workModel) {
        this.workModel = workModel;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore != null ? matchScore : 0;
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PositionResponse that = (PositionResponse) o;
        return active == that.active &&
                Objects.equals(id, that.id) &&
                Objects.equals(title, that.title) &&
                Objects.equals(description, that.description) &&
                Objects.equals(technology, that.technology) &&
                Objects.equals(location, that.location) &&
                Objects.equals(languages, that.languages) &&
                Objects.equals(experienceLevel, that.experienceLevel) &&
                Objects.equals(workModel, that.workModel) &&
                Objects.equals(createdAt, that.createdAt) &&
                Objects.equals(updatedAt, that.updatedAt) &&
                Objects.equals(matchScore, that.matchScore);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, technology, location, languages, experienceLevel,
                workModel, active, createdAt, updatedAt, matchScore);
    }

    @Override
    public String toString() {
        return "PositionResponse{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", technology='" + technology + '\'' +
                ", location='" + location + '\'' +
                ", languages=" + languages +
                ", experienceLevel='" + experienceLevel + '\'' +
                ", workModel='" + workModel + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", matchScore=" + matchScore +
                '}';
    }

    // Builder pattern
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
        private Integer matchScore = 0;

        private Builder() {
        }

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
            this.languages = languages;
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

        public Builder matchScore(Integer matchScore) {
            this.matchScore = matchScore;
            return this;
        }

        public PositionResponse build() {
            return new PositionResponse(id, title, description, technology, location, languages,
                    experienceLevel, workModel, active, createdAt, updatedAt, matchScore);
        }
    }
}