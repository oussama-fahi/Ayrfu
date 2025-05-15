package com.uddan.ayrfu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "contact_person", nullable = false)
    private String contactPerson;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column
    private String industry;

    @Column(name = "company_size")
    private String companySize;

    @Column(length = 1000)
    private String requirements;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getClient() != this) {
            user.setClient(this);
        }
    }

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

    // Builder pattern
    public static ClientBuilder builder() {
        return new ClientBuilder();
    }

    public static class ClientBuilder {
        private final Client client = new Client();

        public ClientBuilder user(User user) {
            client.setUser(user);
            return this;
        }

        public ClientBuilder companyName(String companyName) {
            client.setCompanyName(companyName);
            return this;
        }

        public ClientBuilder contactPerson(String contactPerson) {
            client.setContactPerson(contactPerson);
            return this;
        }

        public ClientBuilder email(String email) {
            client.setEmail(email);
            return this;
        }

        public ClientBuilder phoneNumber(String phoneNumber) {
            client.setPhoneNumber(phoneNumber);
            return this;
        }

        public ClientBuilder industry(String industry) {
            client.setIndustry(industry);
            return this;
        }

        public ClientBuilder companySize(String companySize) {
            client.setCompanySize(companySize);
            return this;
        }

        public ClientBuilder requirements(String requirements) {
            client.setRequirements(requirements);
            return this;
        }

        public Client build() {
            return client;
        }
    }
}