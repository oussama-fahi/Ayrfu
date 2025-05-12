package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for Document upload requests
 */
public class DocumentRequest {

    @NotBlank
    private String documentType;

    private String description;

    // No need for file info here since it will be passed as MultipartFile separately

    public DocumentRequest() {
    }

    public DocumentRequest(String documentType, String description) {
        this.documentType = documentType;
        this.description = description;
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
}