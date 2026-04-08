package com.ayrfu.ayrfu.dto.response;

import com.ayrfu.ayrfu.enumeration.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        CandidateResponse candidate,
        PositionResponse position,
        LocalDateTime appliedAt,
        String coverLetter,
        ApplicationStatus status
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private CandidateResponse candidate;
        private PositionResponse position;
        private LocalDateTime appliedAt;
        private String coverLetter;
        private ApplicationStatus status;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder candidate(CandidateResponse candidate) {
            this.candidate = candidate;
            return this;
        }

        public Builder position(PositionResponse position) {
            this.position = position;
            return this;
        }

        public Builder appliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
            return this;
        }

        public Builder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public Builder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public ApplicationResponse build() {
            return new ApplicationResponse(id, candidate, position, appliedAt, coverLetter, status);
        }
    }
}