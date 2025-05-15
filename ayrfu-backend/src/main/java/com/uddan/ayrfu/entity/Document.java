package com.uddan.ayrfu.entity;

import com.uddan.ayrfu.enumeration.DocumentType;
import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document extends BaseEntity {

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Column
    private String contentType;

    @Column
    private long fileSize;

    @Column
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    // Default constructor
    public Document() {
    }

    // All-args constructor
    public Document(String fileName, String filePath, String contentType, long fileSize,
                    DocumentType documentType, String description, User uploadedBy, Client client) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.documentType = documentType;
        this.description = description;
        this.uploadedBy = uploadedBy;
        this.client = client;
    }

    // Getters and Setters
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    // Builder pattern implementation
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fileName;
        private String filePath;
        private String contentType;
        private long fileSize;
        private DocumentType documentType;
        private String description;
        private User uploadedBy;
        private Client client;

        Builder() {
        }

        public Builder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public Builder filePath(String filePath) {
            this.filePath = filePath;
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

        public Builder uploadedBy(User uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        public Builder client(Client client) {
            this.client = client;
            return this;
        }

        public Document build() {
            return new Document(fileName, filePath, contentType, fileSize, documentType, description, uploadedBy, client);
        }
    }
}