package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.Objects;

public class MarkMessagesReadRequest {
    @NotEmpty(message = "Message IDs cannot be empty")
    private List<Long> messageIds;

    public MarkMessagesReadRequest() {
    }

    public MarkMessagesReadRequest(List<Long> messageIds) {
        this.messageIds = messageIds;
    }

    public List<Long> getMessageIds() {
        return messageIds;
    }

    public void setMessageIds(List<Long> messageIds) {
        this.messageIds = messageIds;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MarkMessagesReadRequest that = (MarkMessagesReadRequest) o;
        return Objects.equals(messageIds, that.messageIds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageIds);
    }

    @Override
    public String toString() {
        return "MarkMessagesReadRequest{" +
                "messageIds=" + messageIds +
                '}';
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<Long> messageIds;

        private Builder() {
        }

        public Builder messageIds(List<Long> messageIds) {
            this.messageIds = messageIds;
            return this;
        }

        public MarkMessagesReadRequest build() {
            return new MarkMessagesReadRequest(messageIds);
        }
    }
}