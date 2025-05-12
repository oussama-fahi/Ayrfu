package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.Objects;

public class ApplicationRequest {
    @NotNull(message = "Position ID is required")
    private Long positionId;

    private String coverLetter;

    // Default constructor
    public ApplicationRequest() {
    }

    // All-args constructor
    public ApplicationRequest(Long positionId, String coverLetter) {
        this.positionId = positionId;
        this.coverLetter = coverLetter;
    }

    // Getters and setters
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

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplicationRequest that = (ApplicationRequest) o;
        return Objects.equals(positionId, that.positionId) &&
                Objects.equals(coverLetter, that.coverLetter);
    }

    @Override
    public int hashCode() {
        return Objects.hash(positionId, coverLetter);
    }

    @Override
    public String toString() {
        return "ApplicationRequest{" +
                "positionId=" + positionId +
                ", coverLetter='" + coverLetter + '\'' +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long positionId;
        private String coverLetter;

        private Builder() {
        }

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