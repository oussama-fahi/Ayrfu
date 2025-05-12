package com.uddan.ayrfu.dto.request;

import java.util.Objects;

public class ClientProfileRequest {
    private String companyName;
    private String contactPerson;
    private String email;
    private String phoneNumber;
    private String industry;
    private String companySize;
    private String requirements;

    // Default constructor
    public ClientProfileRequest() {
    }

    // All-args constructor
    public ClientProfileRequest(String companyName, String contactPerson, String email, String phoneNumber,
                                String industry, String companySize, String requirements) {
        this.companyName = companyName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.industry = industry;
        this.companySize = companySize;
        this.requirements = requirements;
    }

    // Getters and setters
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
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

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClientProfileRequest that = (ClientProfileRequest) o;
        return Objects.equals(companyName, that.companyName) &&
                Objects.equals(contactPerson, that.contactPerson) &&
                Objects.equals(email, that.email) &&
                Objects.equals(phoneNumber, that.phoneNumber) &&
                Objects.equals(industry, that.industry) &&
                Objects.equals(companySize, that.companySize) &&
                Objects.equals(requirements, that.requirements);
    }

    @Override
    public int hashCode() {
        return Objects.hash(companyName, contactPerson, email, phoneNumber, industry, companySize, requirements);
    }

    @Override
    public String toString() {
        return "ClientProfileRequest{" +
                "companyName='" + companyName + '\'' +
                ", contactPerson='" + contactPerson + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", industry='" + industry + '\'' +
                ", companySize='" + companySize + '\'' +
                ", requirements='" + requirements + '\'' +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String companyName;
        private String contactPerson;
        private String email;
        private String phoneNumber;
        private String industry;
        private String companySize;
        private String requirements;

        private Builder() {
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

        public ClientProfileRequest build() {
            return new ClientProfileRequest(companyName, contactPerson, email, phoneNumber, industry, companySize, requirements);
        }
    }
}