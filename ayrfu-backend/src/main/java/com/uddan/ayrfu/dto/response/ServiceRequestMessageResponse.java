package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;

public class ServiceRequestMessageResponse {
    private Long id;
    private UserBasicResponse sender;
    private String content;
    private String attachmentUrl;
    private String attachmentName;
    private LocalDateTime sentAt;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserBasicResponse getSender() {
        return sender;
    }

    public void setSender(UserBasicResponse sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public String getAttachmentName() {
        return attachmentName;
    }

    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private UserBasicResponse sender;
        private String content;
        private String attachmentUrl;
        private String attachmentName;
        private LocalDateTime sentAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder sender(UserBasicResponse sender) {
            this.sender = sender;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder attachmentUrl(String attachmentUrl) {
            this.attachmentUrl = attachmentUrl;
            return this;
        }

        public Builder attachmentName(String attachmentName) {
            this.attachmentName = attachmentName;
            return this;
        }

        public Builder sentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public ServiceRequestMessageResponse build() {
            ServiceRequestMessageResponse response = new ServiceRequestMessageResponse();
            response.setId(this.id);
            response.setSender(this.sender);
            response.setContent(this.content);
            response.setAttachmentUrl(this.attachmentUrl);
            response.setAttachmentName(this.attachmentName);
            response.setSentAt(this.sentAt);
            return response;
        }
    }
}