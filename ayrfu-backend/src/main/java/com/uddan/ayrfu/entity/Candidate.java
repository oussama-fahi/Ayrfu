package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "candidates")
public class Candidate extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column
    private String gender;

    @ElementCollection
    @CollectionTable(name = "candidate_technologies", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "technology")
    private Set<String> technologies = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "candidate_languages", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "language")
    private Set<String> languages = new HashSet<>();

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "preferred_location")
    private String preferredLocation;

    @Column(name = "preferred_work_model")
    private String preferredWorkModel;

    @Column(name = "cv_path")
    private String cvPath;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Application> applications = new HashSet<>();

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getCandidate() != this) {
            user.setCandidate(this);
        }
    }

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
        return technologies;
    }

    public void setTechnologies(Set<String> technologies) {
        this.technologies = technologies != null ? technologies : new HashSet<>();
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

    public String getCvPath() {
        return cvPath;
    }

    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
    }

    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications != null ? applications : new HashSet<>();
    }

    // Builder pattern
    public static CandidateBuilder builder() {
        return new CandidateBuilder();
    }

    public static class CandidateBuilder {
        private final Candidate candidate = new Candidate();

        public CandidateBuilder user(User user) {
            candidate.setUser(user);
            return this;
        }

        public CandidateBuilder fullName(String fullName) {
            candidate.setFullName(fullName);
            return this;
        }

        public CandidateBuilder email(String email) {
            candidate.setEmail(email);
            return this;
        }

        public CandidateBuilder phoneNumber(String phoneNumber) {
            candidate.setPhoneNumber(phoneNumber);
            return this;
        }

        public CandidateBuilder address(String address) {
            candidate.setAddress(address);
            return this;
        }

        public CandidateBuilder dateOfBirth(LocalDate dateOfBirth) {
            candidate.setDateOfBirth(dateOfBirth);
            return this;
        }

        public CandidateBuilder gender(String gender) {
            candidate.setGender(gender);
            return this;
        }

        public CandidateBuilder technologies(Set<String> technologies) {
            candidate.setTechnologies(technologies);
            return this;
        }

        public CandidateBuilder languages(Set<String> languages) {
            candidate.setLanguages(languages);
            return this;
        }

        public CandidateBuilder experienceLevel(String experienceLevel) {
            candidate.setExperienceLevel(experienceLevel);
            return this;
        }

        public CandidateBuilder preferredLocation(String preferredLocation) {
            candidate.setPreferredLocation(preferredLocation);
            return this;
        }

        public CandidateBuilder preferredWorkModel(String preferredWorkModel) {
            candidate.setPreferredWorkModel(preferredWorkModel);
            return this;
        }

        public CandidateBuilder cvPath(String cvPath) {
            candidate.setCvPath(cvPath);
            return this;
        }

        public Candidate build() {
            return candidate;
        }
    }
}