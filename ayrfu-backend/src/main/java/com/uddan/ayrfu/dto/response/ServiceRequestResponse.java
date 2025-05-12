package com.uddan.ayrfu.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ServiceRequestResponse {
    private Long id;
    private ServiceBasicResponse service;
    private ClientBasicResponse client;
    private String description;
    private String urgency;
    private LocalDate preferredStartDate;
    private String additionalInfo;
    private String notes;
    private String status;
    private UserBasicResponse assignedTo;
    private String documentPath;
    private String documentName;
    private List<ServiceRequestMessageResponse> messages = new ArrayList<>();
    private LocalDateTime requestedAt;
    private LocalDateTime updatedAt;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ServiceBasicResponse getService() {
        return service;
    }

    public void setService(ServiceBasicResponse service) {
        this.service = service;
    }

    public ClientBasicResponse getClient() {
        return client;
    }

    public void setClient(ClientBasicResponse client) {
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

    public UserBasicResponse getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(UserBasicResponse assignedTo) {
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

    public List<ServiceRequestMessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<ServiceRequestMessageResponse> messages) {
        this.messages = messages;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ServiceBasicResponse service;
        private ClientBasicResponse client;
        private String description;
        private String urgency;
        private LocalDate preferredStartDate;
        private String additionalInfo;
        private String notes;
        private String status;
        private UserBasicResponse assignedTo;
        private String documentPath;
        private String documentName;
        private List<ServiceRequestMessageResponse> messages = new ArrayList<>();
        private LocalDateTime requestedAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder service(ServiceBasicResponse service) {
            this.service = service;
            return this;
        }

        public Builder client(ClientBasicResponse client) {
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

        public Builder assignedTo(UserBasicResponse assignedTo) {
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

        public Builder messages(List<ServiceRequestMessageResponse> messages) {
            this.messages = messages;
            return this;
        }

        public Builder requestedAt(LocalDateTime requestedAt) {
            this.requestedAt = requestedAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ServiceRequestResponse build() {
            ServiceRequestResponse response = new ServiceRequestResponse();
            response.setId(this.id);
            response.setService(this.service);
            response.setClient(this.client);
            response.setDescription(this.description);
            response.setUrgency(this.urgency);
            response.setPreferredStartDate(this.preferredStartDate);
            response.setAdditionalInfo(this.additionalInfo);
            response.setNotes(this.notes);
            response.setStatus(this.status);
            response.setAssignedTo(this.assignedTo);
            response.setDocumentPath(this.documentPath);
            response.setDocumentName(this.documentName);
            response.setMessages(this.messages);
            response.setRequestedAt(this.requestedAt);
            response.setUpdatedAt(this.updatedAt);
            return response;
        }
    }
}