package com.uddan.ayrfu.entity;

import com.uddan.ayrfu.enumeration.ApplicationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "applications")
@EntityListeners(AuditingEntityListener.class)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @CreatedDate
    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "cover_letter", length = 1000)
    private String coverLetter;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING; // Default value

    // Default constructor
    public Application() {
    }

    // All-args constructor
    public Application(Long id, Candidate candidate, Position position,
                       LocalDateTime appliedAt, String coverLetter, ApplicationStatus status) {
        this.id = id;
        this.candidate = candidate;
        this.position = position;
        this.appliedAt = appliedAt;
        this.coverLetter = coverLetter;
        this.status = status != null ? status : ApplicationStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status != null ? status : ApplicationStatus.PENDING;
    }

    // Builder implementation
    public static ApplicationBuilder builder() {
        return new ApplicationBuilder();
    }

    public static class ApplicationBuilder {
        private Long id;
        private Candidate candidate;
        private Position position;
        private LocalDateTime appliedAt;
        private String coverLetter;
        private ApplicationStatus status = ApplicationStatus.PENDING; // Default value

        ApplicationBuilder() {
        }

        public ApplicationBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ApplicationBuilder candidate(Candidate candidate) {
            this.candidate = candidate;
            return this;
        }

        public ApplicationBuilder position(Position position) {
            this.position = position;
            return this;
        }

        public ApplicationBuilder appliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
            return this;
        }

        public ApplicationBuilder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public ApplicationBuilder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public Application build() {
            return new Application(id, candidate, position, appliedAt, coverLetter, status);
        }
    }
}