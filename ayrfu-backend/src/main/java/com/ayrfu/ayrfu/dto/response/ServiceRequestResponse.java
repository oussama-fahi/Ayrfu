package com.ayrfu.ayrfu.dto.response;

import com.ayrfu.ayrfu.enumeration.ServiceRequestStatus;
import java.time.LocalDateTime;

public record ServiceRequestResponse(
        Long id,
        ClientBasicResponse client,
        ServiceBasicResponse service,
        String details,
        ServiceRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ClientBasicResponse client;
        private ServiceBasicResponse service;
        private String details;
        private ServiceRequestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder client(ClientBasicResponse client) {
            this.client = client;
            return this;
        }

        public Builder service(ServiceBasicResponse service) {
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

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ServiceRequestResponse build() {
            return new ServiceRequestResponse(id, client, service, details, status, createdAt, updatedAt);
        }
    }
}