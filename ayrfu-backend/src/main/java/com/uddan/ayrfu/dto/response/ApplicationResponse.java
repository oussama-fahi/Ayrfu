package com.uddan.ayrfu.dto.response;

import com.uddan.ayrfu.enumeration.ApplicationStatus;

import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        CandidateBasicResponse candidate,
        PositionBasicResponse position,
        ApplicationStatus status,
        String coverLetter,
        LocalDateTime appliedAt,
        LocalDateTime updatedAt
) {
    // Builder pattern for records
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private CandidateBasicResponse candidate;
        private PositionBasicResponse position;
        private ApplicationStatus status;
        private String coverLetter;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder candidate(CandidateBasicResponse candidate) {
            this.candidate = candidate;
            return this;
        }

        public Builder position(PositionBasicResponse position) {
            this.position = position;
            return this;
        }

        public Builder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public Builder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public Builder appliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ApplicationResponse build() {
            return new ApplicationResponse(id, candidate, position, status, coverLetter, appliedAt, updatedAt);
        }
    }
}