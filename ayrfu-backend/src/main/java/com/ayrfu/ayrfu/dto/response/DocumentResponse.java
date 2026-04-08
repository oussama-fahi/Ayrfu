package com.ayrfu.ayrfu.dto.response;

import com.ayrfu.ayrfu.enumeration.DocumentType;
import java.time.LocalDateTime;

public record DocumentResponse(
        Long id,
        String fileName,
        String contentType,
        long fileSize,
        DocumentType documentType,
        String description,
        String uploadedByName,
        Long clientId,
        String clientCompanyName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String fileName;
        private String contentType;
        private long fileSize;
        private DocumentType documentType;
        private String description;
        private String uploadedByName;
        private Long clientId;
        private String clientCompanyName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public Builder contentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public Builder fileSize(long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder documentType(DocumentType documentType) {
            this.documentType = documentType;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder uploadedByName(String uploadedByName) {
            this.uploadedByName = uploadedByName;
            return this;
        }

        public Builder clientId(Long clientId) {
            this.clientId = clientId;
            return this;
        }

        public Builder clientCompanyName(String clientCompanyName) {
            this.clientCompanyName = clientCompanyName;
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

        public DocumentResponse build() {
            return new DocumentResponse(id, fileName, contentType, fileSize, documentType,
                    description, uploadedByName, clientId, clientCompanyName,
                    createdAt, updatedAt);
        }
    }
}