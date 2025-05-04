package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "positions")
@EntityListeners(AuditingEntityListener.class)
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String technology;

    @Column(nullable = false)
    private String location;

    @ElementCollection
    @CollectionTable(name = "position_languages", joinColumns = @JoinColumn(name = "position_id"))
    @Column(name = "language")
    private Set<String> languages = new HashSet<>();

    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;

    @Column(name = "work_model", nullable = false)
    private String workModel;

    @Column(nullable = false)
    private boolean active;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Default constructor
    public Position() {
    }

    // All-args constructor
    public Position(Long id, String title, String description, String technology, String location,
                    Set<String> languages, String experienceLevel, String workModel, boolean active,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.technology = technology;
        this.location = location;
        this.languages = languages != null ? languages : new HashSet<>();
        this.experienceLevel = experienceLevel;
        this.workModel = workModel;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
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

    // Builder implementation
    public static PositionBuilder builder() {
        return new PositionBuilder();
    }

    public static class PositionBuilder {
        private Long id;
        private String title;
        private String description;
        private String technology;
        private String location;
        private Set<String> languages = new HashSet<>();
        private String experienceLevel;
        private String workModel;
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PositionBuilder() {
        }

        public PositionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PositionBuilder title(String title) {
            this.title = title;
            return this;
        }

        public PositionBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PositionBuilder technology(String technology) {
            this.technology = technology;
            return this;
        }

        public PositionBuilder location(String location) {
            this.location = location;
            return this;
        }

        public PositionBuilder languages(Set<String> languages) {
            this.languages = languages;
            return this;
        }

        public PositionBuilder experienceLevel(String experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public PositionBuilder workModel(String workModel) {
            this.workModel = workModel;
            return this;
        }

        public PositionBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public PositionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PositionBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Position build() {
            return new Position(id, title, description, technology, location, languages,
                    experienceLevel, workModel, active, createdAt, updatedAt);
        }
    }
}