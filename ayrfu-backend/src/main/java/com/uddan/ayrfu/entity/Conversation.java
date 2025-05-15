package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation extends BaseEntity {

    @Column(nullable = false)
    private String subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiator_id")
    private User initiator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    // Default constructor
    public Conversation() {
    }

    // All-args constructor
    public Conversation(String subject, User initiator, User recipient, List<Message> messages) {
        this.subject = subject;
        this.initiator = initiator;
        this.recipient = recipient;
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public User getInitiator() {
        return initiator;
    }

    public void setInitiator(User initiator) {
        this.initiator = initiator;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    public void addMessage(Message message) {
        this.messages.add(message);
        message.setConversation(this);
    }

    public void removeMessage(Message message) {
        this.messages.remove(message);
        message.setConversation(null);
    }

    // Builder pattern implementation
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String subject;
        private User initiator;
        private User recipient;
        private List<Message> messages = new ArrayList<>();

        Builder() {
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder initiator(User initiator) {
            this.initiator = initiator;
            return this;
        }

        public Builder recipient(User recipient) {
            this.recipient = recipient;
            return this;
        }

        public Builder messages(List<Message> messages) {
            this.messages = messages;
            return this;
        }

        public Conversation build() {
            return new Conversation(subject, initiator, recipient, messages);
        }
    }
}