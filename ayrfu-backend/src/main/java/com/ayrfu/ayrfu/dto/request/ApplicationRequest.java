package com.ayrfu.ayrfu.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApplicationRequest {

    @NotNull(message = "Position ID is required")
    private Long positionId;

    @Size(max = 1000, message = "Cover letter must be less than 1000 characters")
    private String coverLetter;

    public ApplicationRequest() {
    }

    public ApplicationRequest(Long positionId, String coverLetter) {
        this.positionId = positionId;
        this.coverLetter = coverLetter;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long positionId;
        private String coverLetter;

        public Builder positionId(Long positionId) {
            this.positionId = positionId;
            return this;
        }

        public Builder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public ApplicationRequest build() {
            return new ApplicationRequest(positionId, coverLetter);
        }
    }
}