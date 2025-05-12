package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.uddan.ayrfu.enumeration.MessageType;

import java.util.Objects;

public class MessageRequest {
    @NotNull(message = "Message type is required")
    private MessageType type;

    @NotBlank(message = "Sender name is required")
    private String senderName;

    @NotBlank(message = "Sender email is required")
    private String senderEmail;

    private String senderPhone;

    @NotBlank(message = "Content is required")
    private String content;

    // Default constructor
    public MessageRequest() {
    }

    // All-args constructor
    public MessageRequest(MessageType type, String senderName, String senderEmail, String senderPhone, String content) {
        this.type = type;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderPhone = senderPhone;
        this.content = content;
    }

    // Getters and setters
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

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageRequest that = (MessageRequest) o;
        return type == that.type &&
                Objects.equals(senderName, that.senderName) &&
                Objects.equals(senderEmail, that.senderEmail) &&
                Objects.equals(senderPhone, that.senderPhone) &&
                Objects.equals(content, that.content);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, senderName, senderEmail, senderPhone, content);
    }

    @Override
    public String toString() {
        return "MessageRequest{" +
                "type=" + type +
                ", senderName='" + senderName + '\'' +
                ", senderEmail='" + senderEmail + '\'' +
                ", senderPhone='" + senderPhone + '\'' +
                ", content='" + content + '\'' +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private MessageType type;
        private String senderName;
        private String senderEmail;
        private String senderPhone;
        private String content;

        private Builder() {
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

        public MessageRequest build() {
            return new MessageRequest(type, senderName, senderEmail, senderPhone, content);
        }
    }
}