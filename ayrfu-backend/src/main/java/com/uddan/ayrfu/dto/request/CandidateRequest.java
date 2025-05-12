package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class CandidateRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
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

    // Default constructor
    public CandidateRequest() {
    }

    // All-args constructor
    public CandidateRequest(String fullName, String email, String phoneNumber, String address,
                            LocalDate dateOfBirth, String gender, Set<String> technologies,
                            Set<String> languages, String experienceLevel, String preferredLocation,
                            String preferredWorkModel) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.technologies = technologies != null ? new HashSet<>(technologies) : new HashSet<>();
        this.languages = languages != null ? new HashSet<>(languages) : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.preferredLocation = preferredLocation;
        this.preferredWorkModel = preferredWorkModel;
    }

    // Getters and setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Set<String> getTechnologies() {
        return new HashSet<>(technologies);
    }

    public void setTechnologies(Set<String> technologies) {
        this.technologies = technologies != null ? new HashSet<>(technologies) : new HashSet<>();
    }

    public Set<String> getLanguages() {
        return new HashSet<>(languages);
    }

    public void setLanguages(Set<String> languages) {
        this.languages = languages != null ? new HashSet<>(languages) : new HashSet<>();
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public String getPreferredWorkModel() {
        return preferredWorkModel;
    }

    public void setPreferredWorkModel(String preferredWorkModel) {
        this.preferredWorkModel = preferredWorkModel;
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CandidateRequest that = (CandidateRequest) o;
        return Objects.equals(fullName, that.fullName) &&
                Objects.equals(email, that.email) &&
                Objects.equals(phoneNumber, that.phoneNumber) &&
                Objects.equals(address, that.address) &&
                Objects.equals(dateOfBirth, that.dateOfBirth) &&
                Objects.equals(gender, that.gender) &&
                Objects.equals(technologies, that.technologies) &&
                Objects.equals(languages, that.languages) &&
                Objects.equals(experienceLevel, that.experienceLevel) &&
                Objects.equals(preferredLocation, that.preferredLocation) &&
                Objects.equals(preferredWorkModel, that.preferredWorkModel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fullName, email, phoneNumber, address, dateOfBirth, gender,
                technologies, languages, experienceLevel, preferredLocation, preferredWorkModel);
    }

    @Override
    public String toString() {
        return "CandidateRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender='" + gender + '\'' +
                ", technologies=" + technologies +
                ", languages=" + languages +
                ", experienceLevel='" + experienceLevel + '\'' +
                ", preferredLocation='" + preferredLocation + '\'' +
                ", preferredWorkModel='" + preferredWorkModel + '\'' +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
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

        private Builder() {
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
            this.technologies = technologies != null ? new HashSet<>(technologies) : new HashSet<>();
            return this;
        }

        public Builder languages(Set<String> languages) {
            this.languages = languages != null ? new HashSet<>(languages) : new HashSet<>();
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

        public CandidateRequest build() {
            return new CandidateRequest(fullName, email, phoneNumber, address, dateOfBirth, gender,
                    technologies, languages, experienceLevel, preferredLocation, preferredWorkModel);
        }
    }
}