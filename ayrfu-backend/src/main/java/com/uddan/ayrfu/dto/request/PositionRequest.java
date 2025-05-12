package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class PositionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Technology is required")
    private String technology;

    @NotBlank(message = "Location is required")
    private String location;

    private Set<String> languages = new HashSet<>();

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @NotBlank(message = "Work model is required")
    private String workModel;

    private boolean active = true;

    // Default constructor
    public PositionRequest() {
    }

    // All-args constructor
    public PositionRequest(String title, String description, String technology, String location,
                           Set<String> languages, String experienceLevel, String workModel, boolean active) {
        this.title = title;
        this.description = description;
        this.technology = technology;
        this.location = location;
        this.languages = languages != null ? languages : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.workModel = workModel;
        this.active = active;
    }

    // Getters and setters
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

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PositionRequest that = (PositionRequest) o;
        return active == that.active &&
                Objects.equals(title, that.title) &&
                Objects.equals(description, that.description) &&
                Objects.equals(technology, that.technology) &&
                Objects.equals(location, that.location) &&
                Objects.equals(languages, that.languages) &&
                Objects.equals(experienceLevel, that.experienceLevel) &&
                Objects.equals(workModel, that.workModel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, description, technology, location, languages, experienceLevel, workModel, active);
    }

    @Override
    public String toString() {
        return "PositionRequest{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", technology='" + technology + '\'' +
                ", location='" + location + '\'' +
                ", languages=" + languages +
                ", experienceLevel='" + experienceLevel + '\'' +
                ", workModel='" + workModel + '\'' +
                ", active=" + active +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private String technology;
        private String location;
        private Set<String> languages = new HashSet<>();
        private String experienceLevel;
        private String workModel;
        private boolean active = true;

        private Builder() {
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

        public PositionRequest build() {
            return new PositionRequest(title, description, technology, location, languages, experienceLevel, workModel, active);
        }
    }
}