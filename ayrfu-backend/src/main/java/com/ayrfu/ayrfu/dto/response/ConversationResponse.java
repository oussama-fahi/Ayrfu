package com.ayrfu.ayrfu.dto.response;

import java.time.LocalDateTime;

public record ConversationResponse(
        Long id,
        String subject,
        UserBasicResponse initiator,
        UserBasicResponse recipient,
        MessageResponse lastMessage,
        int unreadCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String subject;
        private UserBasicResponse initiator;
        private UserBasicResponse recipient;
        private MessageResponse lastMessage;
        private int unreadCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder initiator(UserBasicResponse initiator) {
            this.initiator = initiator;
            return this;
        }

        public Builder recipient(UserBasicResponse recipient) {
            this.recipient = recipient;
            return this;
        }

        public Builder lastMessage(MessageResponse lastMessage) {
            this.lastMessage = lastMessage;
            return this;
        }

        public Builder unreadCount(int unreadCount) {
            this.unreadCount = unreadCount;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ConversationResponse build() {
            return new ConversationResponse(id, subject, initiator, recipient, lastMessage,
                    unreadCount, createdAt, updatedAt);
        }
    }
}