package com.ayrfu.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class ServiceRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;

    @Size(max = 1000, message = "Benefits must be less than 1000 characters")
    private String benefits;

    private String availability;

    @NotEmpty(message = "At least one keyword is required")
    private Set<String> keywords = new HashSet<>();

    public ServiceRequest() {
    }

    public ServiceRequest(String title, String description, String benefits,
                          String availability, Set<String> keywords) {
        this.title = title;
        this.description = description;
        this.benefits = benefits;
        this.availability = availability;
        this.keywords = keywords != null ? keywords : new HashSet<>();
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

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Set<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(Set<String> keywords) {
        this.keywords = keywords != null ? keywords : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private String benefits;
        private String availability;
        private Set<String> keywords = new HashSet<>();

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

        public ServiceRequest build() {
            return new ServiceRequest(title, description, benefits, availability, keywords);
        }
    }
}