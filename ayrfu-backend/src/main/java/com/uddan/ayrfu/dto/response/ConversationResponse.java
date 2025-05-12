package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;

public class ConversationResponse {
    private Long id;
    private String title;
    private String type;
    private String lastMessage;
    private LocalDateTime lastMessageDate;
    private int unreadCount;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageDate() {
        return lastMessageDate;
    }

    public void setLastMessageDate(LocalDateTime lastMessageDate) {
        this.lastMessageDate = lastMessageDate;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String type;
        private String lastMessage;
        private LocalDateTime lastMessageDate;
        private int unreadCount;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder lastMessage(String lastMessage) {
            this.lastMessage = lastMessage;
            return this;
        }

        public Builder lastMessageDate(LocalDateTime lastMessageDate) {
            this.lastMessageDate = lastMessageDate;
            return this;
        }

        public Builder unreadCount(int unreadCount) {
            this.unreadCount = unreadCount;
            return this;
        }

        public ConversationResponse build() {
            ConversationResponse response = new ConversationResponse();
            response.setId(this.id);
            response.setTitle(this.title);
            response.setType(this.type);
            response.setLastMessage(this.lastMessage);
            response.setLastMessageDate(this.lastMessageDate);
            response.setUnreadCount(this.unreadCount);
            return response;
        }
    }
}