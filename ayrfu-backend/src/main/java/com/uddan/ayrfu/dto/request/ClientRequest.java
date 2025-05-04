package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClientRequest {
    @NotBlank(message = "Company name is required")
    @Size(max = 100, message = "Company name must be less than 100 characters")
    private String companyName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person must be less than 100 characters")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number must be less than 20 characters")
    private String phoneNumber;

    @Size(max = 50, message = "Industry must be less than 50 characters")
    private String industry;

    @Size(max = 50, message = "Company size must be less than 50 characters")
    private String companySize;

    @Size(max = 1000, message = "Requirements must be less than 1000 characters")
    private String requirements;

    // Default constructor
    public ClientRequest() {
    }

    // All-args constructor
    public ClientRequest(String companyName, String contactPerson, String email, String phoneNumber,
                         String industry, String companySize, String requirements) {
        this.companyName = companyName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.industry = industry;
        this.companySize = companySize;
        this.requirements = requirements;
    }

    // Getters and Setters
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

    // Builder implementation
    public static ClientRequestBuilder builder() {
        return new ClientRequestBuilder();
    }

    public static class ClientRequestBuilder {
        private String companyName;
        private String contactPerson;
        private String email;
        private String phoneNumber;
        private String industry;
        private String companySize;
        private String requirements;

        ClientRequestBuilder() {
        }

        public ClientRequestBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public ClientRequestBuilder contactPerson(String contactPerson) {
            this.contactPerson = contactPerson;
            return this;
        }

        public ClientRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ClientRequestBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public ClientRequestBuilder industry(String industry) {
            this.industry = industry;
            return this;
        }

        public ClientRequestBuilder companySize(String companySize) {
            this.companySize = companySize;
            return this;
        }

        public ClientRequestBuilder requirements(String requirements) {
            this.requirements = requirements;
            return this;
        }

        public ClientRequest build() {
            return new ClientRequest(companyName, contactPerson, email, phoneNumber,
                    industry, companySize, requirements);
        }
    }
}