package com.uddan.ayrfu.dto.response;

import com.uddan.ayrfu.enumeration.MessageType;
import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        MessageType type,
        String senderName,
        String senderEmail,
        String senderPhone,
        String content,
        LocalDateTime sentAt,
        boolean read,
        LocalDateTime readAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private MessageType type;
        private String senderName;
        private String senderEmail;
        private String senderPhone;
        private String content;
        private LocalDateTime sentAt;
        private boolean read;
        private LocalDateTime readAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder type(MessageType type) {
            this.type = type;
            return this;
        }

        public Builder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public Builder senderEmail(String senderEmail) {
            this.senderEmail = senderEmail;
            return this;
        }

        public Builder senderPhone(String senderPhone) {
            this.senderPhone = senderPhone;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder sentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public Builder read(boolean read) {
            this.read = read;
            return this;
        }

        public Builder readAt(LocalDateTime readAt) {
            this.readAt = readAt;
            return this;
        }

        public MessageResponse build() {
            return new MessageResponse(id, type, senderName, senderEmail, senderPhone,
                    content, sentAt, read, readAt);
        }
    }
}