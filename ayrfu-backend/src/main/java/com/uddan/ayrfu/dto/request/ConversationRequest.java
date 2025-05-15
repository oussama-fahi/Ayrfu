// Conversation Request
package com.uddan.ayrfu.dto.request;

public class ConversationRequest {
    private String subject;
    private Long recipientId;
    private String initialMessage;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getInitialMessage() {
        return initialMessage;
    }

    public void setInitialMessage(String initialMessage) {
        this.initialMessage = initialMessage;
    }
}

// Conversation Response


// Updated Message Request
