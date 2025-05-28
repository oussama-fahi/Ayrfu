package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;

public record MessagesReadResponse(
        int count,
        LocalDateTime updatedAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int count;
        private LocalDateTime updatedAt;

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