package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;

public class ConversationMessageResponse {
    private Long id;
    private UserBasicResponse sender;
    private String content;
    private String attachmentUrl;
    private String attachmentName;
    private boolean read;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

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

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
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
        private boolean read;
        private LocalDateTime sentAt;
        private LocalDateTime readAt;

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

        public Builder read(boolean read) {
            this.read = read;
            return this;
        }

        public Builder sentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public Builder readAt(LocalDateTime readAt) {
            this.readAt = readAt;
            return this;
        }

        public ConversationMessageResponse build() {
            ConversationMessageResponse response = new ConversationMessageResponse();
            response.setId(this.id);
            response.setSender(this.sender);
            response.setContent(this.content);
            response.setAttachmentUrl(this.attachmentUrl);
            response.setAttachmentName(this.attachmentName);
            response.setRead(this.read);
            response.setSentAt(this.sentAt);
            response.setReadAt(this.readAt);
            return response;
        }
    }
}