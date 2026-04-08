package com.ayrfu.ayrfu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class ClientProfileRequest {

    @Size(max = 100, message = "Company name must be less than 100 characters")
    private String companyName;

    @Size(max = 100, message = "Contact person must be less than 100 characters")
    private String contactPerson;

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
    public ClientProfileRequest() {
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
}
