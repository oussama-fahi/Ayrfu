package com.ayrfu.ayrfu.entity;

import com.ayrfu.ayrfu.enumeration.ServiceRequestStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "service_requests")
public class ServiceRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(length = 2000)
    private String details;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceRequestStatus status = ServiceRequestStatus.PENDING;

    // Default constructor
    public ServiceRequest() {
    }

    // All-args constructor
    public ServiceRequest(Client client, Service service, String details, ServiceRequestStatus status) {
        this.client = client;
        this.service = service;
        this.details = details;
        this.status = status != null ? status : ServiceRequestStatus.PENDING;
    }

    // Getters and Setters
    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public ServiceRequestStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceRequestStatus status) {
        this.status = status != null ? status : ServiceRequestStatus.PENDING;
    }

    // Builder pattern implementation
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Client client;
        private Service service;
        private String details;
        private ServiceRequestStatus status = ServiceRequestStatus.PENDING;

        Builder() {
        }

        public Builder client(Client client) {
            this.client = client;
            return this;
        }

        public Builder service(Service service) {
            this.service = service;
            return this;
        }

        public Builder details(String details) {
            this.details = details;
            return this;
        }

        public Builder status(ServiceRequestStatus status) {
            this.status = status;
            return this;
        }

        public ServiceRequest build() {
            return new ServiceRequest(client, service, details, status);
        }
    }
}