package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class PositionRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;

    @NotBlank(message = "Technology is required")
    @Size(max = 100, message = "Technology must be less than 100 characters")
    private String technology;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;

    @NotEmpty(message = "At least one language is required")
    private Set<String> languages = new HashSet<>();

    @NotBlank(message = "Experience level is required")
    @Size(max = 50, message = "Experience level must be less than 50 characters")
    private String experienceLevel;

    @NotBlank(message = "Work model is required")
    @Size(max = 50, message = "Work model must be less than 50 characters")
    private String workModel;

    public PositionRequest() {
    }

    public PositionRequest(String title, String description, String technology, String location,
                           Set<String> languages, String experienceLevel, String workModel) {
        this.title = title;
        this.description = description;
        this.technology = technology;
        this.location = location;
        this.languages = languages != null ? languages : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.workModel = workModel;
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

        public PositionRequest build() {
            return new PositionRequest(title, description, technology, location,
                    languages, experienceLevel, workModel);
        }
    }
}
