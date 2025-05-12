package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;
import java.util.Objects;

public class MessagesReadResponse {
    private int count;
    private LocalDateTime updatedAt;

    // Default constructor
    public MessagesReadResponse() {
    }

    // All-args constructor
    public MessagesReadResponse(int count, LocalDateTime updatedAt) {
        this.count = count;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessagesReadResponse that = (MessagesReadResponse) o;
        return count == that.count && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(count, updatedAt);
    }

    @Override
    public String toString() {
        return "MessagesReadResponse{" +
                "count=" + count +
                ", updatedAt=" + updatedAt +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int count;
        private LocalDateTime updatedAt;

        private Builder() {
        }

        public Builder count(int count) {
            this.count = count;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public MessagesReadResponse build() {
            return new MessagesReadResponse(count, updatedAt);
        }
    }
}