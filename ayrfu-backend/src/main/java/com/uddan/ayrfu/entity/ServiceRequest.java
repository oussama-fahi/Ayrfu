package com.uddan.ayrfu.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_requests")
@EntityListeners(AuditingEntityListener.class)
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String urgency;

    @Column(name = "preferred_start_date")
    private LocalDate preferredStartDate;

    @Column(name = "additional_info", length = 1000)
    private String additionalInfo;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "document_path")
    private String documentPath;

    @Column(name = "document_name")
    private String documentName;

    @OneToMany(mappedBy = "serviceRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceRequestMessage> messages = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public LocalDate getPreferredStartDate() {
        return preferredStartDate;
    }

    public void setPreferredStartDate(LocalDate preferredStartDate) {
        this.preferredStartDate = preferredStartDate;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getDocumentPath() {
        return documentPath;
    }

    public void setDocumentPath(String documentPath) {
        this.documentPath = documentPath;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public List<ServiceRequestMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ServiceRequestMessage> messages) {
        this.messages = messages;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void addMessage(ServiceRequestMessage message) {
        this.messages.add(message);
        message.setServiceRequest(this);
    }

    public void removeMessage(ServiceRequestMessage message) {
        this.messages.remove(message);
        message.setServiceRequest(null);
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Service service;
        private Client client;
        private String description;
        private String urgency;
        private LocalDate preferredStartDate;
        private String additionalInfo;
        private String notes;
        private String status;
        private User assignedTo;
        private String documentPath;
        private String documentName;
        private List<ServiceRequestMessage> messages = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder service(Service service) {
            this.service = service;
            return this;
        }

        public Builder client(Client client) {
            this.client = client;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder urgency(String urgency) {
            this.urgency = urgency;
            return this;
        }

        public Builder preferredStartDate(LocalDate preferredStartDate) {
            this.preferredStartDate = preferredStartDate;
            return this;
        }

        public Builder additionalInfo(String additionalInfo) {
            this.additionalInfo = additionalInfo;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder assignedTo(User assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public Builder documentPath(String documentPath) {
            this.documentPath = documentPath;
            return this;
        }

        public Builder documentName(String documentName) {
            this.documentName = documentName;
            return this;
        }

        public Builder messages(List<ServiceRequestMessage> messages) {
            this.messages = messages;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ServiceRequest build() {
            ServiceRequest request = new ServiceRequest();
            request.setId(this.id);
            request.setService(this.service);
            request.setClient(this.client);
            request.setDescription(this.description);
            request.setUrgency(this.urgency);
            request.setPreferredStartDate(this.preferredStartDate);
            request.setAdditionalInfo(this.additionalInfo);
            request.setNotes(this.notes);
            request.setStatus(this.status);
            request.setAssignedTo(this.assignedTo);
            request.setDocumentPath(this.documentPath);
            request.setDocumentName(this.documentName);
            request.setMessages(this.messages);
            request.setCreatedAt(this.createdAt);
            request.setUpdatedAt(this.updatedAt);
            return request;
        }
    }
}