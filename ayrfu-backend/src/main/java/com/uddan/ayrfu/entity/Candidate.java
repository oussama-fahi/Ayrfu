package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "candidates")
@EntityListeners(AuditingEntityListener.class)
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Application> applications = new HashSet<>();

    // Default constructor
    public Candidate() {
    }

    // All-args constructor
    public Candidate(Long id, String fullName, String email, String phoneNumber, String address,
                     LocalDate dateOfBirth, String gender, Set<String> technologies, Set<String> languages,
                     String experienceLevel, String preferredLocation, String preferredWorkModel,
                     String cvPath, LocalDateTime createdAt, LocalDateTime updatedAt, Set<Application> applications) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.technologies = technologies != null ? technologies : new HashSet<>();
        this.languages = languages != null ? languages : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.preferredLocation = preferredLocation;
        this.preferredWorkModel = preferredWorkModel;
        this.cvPath = cvPath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.applications = applications != null ? applications : new HashSet<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications != null ? applications : new HashSet<>();
    }

    public void addApplication(Application application) {
        applications.add(application);
        application.setCandidate(this);
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setCandidate(null);
    }

    public static CandidateBuilder builder() {
        return new CandidateBuilder();
    }

    public static class CandidateBuilder {
        private Long id;
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
        private String cvPath;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Set<Application> applications = new HashSet<>();

        CandidateBuilder() {
        }

        public CandidateBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CandidateBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public CandidateBuilder email(String email) {
            this.email = email;
            return this;
        }

        public CandidateBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public CandidateBuilder address(String address) {
            this.address = address;
            return this;
        }

        public CandidateBuilder dateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public CandidateBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public CandidateBuilder technologies(Set<String> technologies) {
            this.technologies = technologies;
            return this;
        }

        public CandidateBuilder languages(Set<String> languages) {
            this.languages = languages;
            return this;
        }

        public CandidateBuilder experienceLevel(String experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public CandidateBuilder preferredLocation(String preferredLocation) {
            this.preferredLocation = preferredLocation;
            return this;
        }

        public CandidateBuilder preferredWorkModel(String preferredWorkModel) {
            this.preferredWorkModel = preferredWorkModel;
            return this;
        }

        public CandidateBuilder cvPath(String cvPath) {
            this.cvPath = cvPath;
            return this;
        }

        public CandidateBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CandidateBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public CandidateBuilder applications(Set<Application> applications) {
            this.applications = applications;
            return this;
        }

        public Candidate build() {
            return new Candidate(id, fullName, email, phoneNumber, address, dateOfBirth, gender,
                    technologies, languages, experienceLevel, preferredLocation,
                    preferredWorkModel, cvPath, createdAt, updatedAt, applications);
        }
    }
}