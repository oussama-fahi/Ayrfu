package com.uddan.ayrfu.dto.request;

import com.uddan.ayrfu.enumeration.MessageType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
public class MessageRequest {

    @NotNull(message = "Message type is required")
    private MessageType type;

    @NotBlank(message = "Sender name is required")
    @Size(max = 100, message = "Sender name must be less than 100 characters")
    private String senderName;

    @NotBlank(message = "Sender email is required")
    @Email(message = "Sender email must be valid")
    @Size(max = 100, message = "Sender email must be less than 100 characters")
    private String senderEmail;

    @Size(max = 20, message = "Sender phone must be less than 20 characters")
    private String senderPhone;

    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content must be less than 2000 characters")
    private String content;

    public MessageRequest() {
    }

    public MessageRequest(MessageType type, String senderName, String senderEmail, String senderPhone, String content) {
        this.type = type;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderPhone = senderPhone;
        this.content = content;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private MessageType type;
        private String senderName;
        private String senderEmail;
        private String senderPhone;
        private String content;

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
