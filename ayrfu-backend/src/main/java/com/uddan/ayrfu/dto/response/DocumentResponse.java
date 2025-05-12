package com.uddan.ayrfu.dto.response;

import java.time.LocalDateTime;

public class DocumentResponse {
    private Long id;
    private String filename;
    private String documentType;
    private String description;
    private Long size;
    private LocalDateTime uploadedAt;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String filename;
        private String documentType;
        private String description;
        private Long size;
        private LocalDateTime uploadedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder filename(String filename) {
            this.filename = filename;
            return this;
        }

        public Builder documentType(String documentType) {
            this.documentType = documentType;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder size(Long size) {
            this.size = size;
            return this;
        }

        public Builder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }

        public DocumentResponse build() {
            DocumentResponse response = new DocumentResponse();
            response.setId(this.id);
            response.setFilename(this.filename);
            response.setDocumentType(this.documentType);
            response.setDescription(this.description);
            response.setSize(this.size);
            response.setUploadedAt(this.uploadedAt);
            return response;
        }
    }
}