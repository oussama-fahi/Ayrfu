package com.uddan.ayrfu.dto.response;

import com.uddan.ayrfu.enumeration.MessageType;

import java.time.LocalDateTime;
import java.util.Objects;

public class MessageResponse {
    private Long id;
    private MessageType type;
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    private String content;
    private LocalDateTime sentAt;
    private boolean read;
    private LocalDateTime readAt;

    // Default constructor
    public MessageResponse() {
    }

    // All-args constructor
    public MessageResponse(Long id, MessageType type, String senderName, String senderEmail, String senderPhone,
                           String content, LocalDateTime sentAt, boolean read, LocalDateTime readAt) {
        this.id = id;
        this.type = type;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderPhone = senderPhone;
        this.content = content;
        this.sentAt = sentAt;
        this.read = read;
        this.readAt = readAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageResponse that = (MessageResponse) o;
        return read == that.read &&
                Objects.equals(id, that.id) &&
                type == that.type &&
                Objects.equals(senderName, that.senderName) &&
                Objects.equals(senderEmail, that.senderEmail) &&
                Objects.equals(senderPhone, that.senderPhone) &&
                Objects.equals(content, that.content) &&
                Objects.equals(sentAt, that.sentAt) &&
                Objects.equals(readAt, that.readAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, senderName, senderEmail, senderPhone, content, sentAt, read, readAt);
    }

    @Override
    public String toString() {
        return "MessageResponse{" +
                "id=" + id +
                ", type=" + type +
                ", senderName='" + senderName + '\'' +
                ", senderEmail='" + senderEmail + '\'' +
                ", senderPhone='" + senderPhone + '\'' +
                ", content='" + content + '\'' +
                ", sentAt=" + sentAt +
                ", read=" + read +
                ", readAt=" + readAt +
                '}';
    }

    // Builder pattern
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

        private Builder() {
        }

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
            return new MessageResponse(id, type, senderName, senderEmail, senderPhone, content, sentAt, read, readAt);
        }
    }
}