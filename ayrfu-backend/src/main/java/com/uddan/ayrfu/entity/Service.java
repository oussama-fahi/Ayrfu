package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "services")
@EntityListeners(AuditingEntityListener.class)
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String benefits;

    @Column
    private String availability;

    @ElementCollection
    @CollectionTable(name = "service_keywords", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "keyword")
    private Set<String> keywords = new HashSet<>();

    @Column(nullable = false)
    private boolean active;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Default constructor
    public Service() {
    }

    // All-args constructor
    public Service(Long id, String title, String description, String benefits, String availability,
                   Set<String> keywords, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.benefits = benefits;
        this.availability = availability;
        this.keywords = keywords != null ? keywords : new HashSet<>();
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
    public static ServiceBuilder builder() {
        return new ServiceBuilder();
    }

    public static class ServiceBuilder {
        private Long id;
        private String title;
        private String description;
        private String benefits;
        private String availability;
        private Set<String> keywords = new HashSet<>();
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ServiceBuilder() {
        }

        public ServiceBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ServiceBuilder title(String title) {
            this.title = title;
            return this;
        }

        public ServiceBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ServiceBuilder benefits(String benefits) {
            this.benefits = benefits;
            return this;
        }

        public ServiceBuilder availability(String availability) {
            this.availability = availability;
            return this;
        }

        public ServiceBuilder keywords(Set<String> keywords) {
            this.keywords = keywords;
            return this;
        }

        public ServiceBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public ServiceBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ServiceBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Service build() {
            return new Service(id, title, description, benefits, availability,
                    keywords, active, createdAt, updatedAt);
        }
    }
}