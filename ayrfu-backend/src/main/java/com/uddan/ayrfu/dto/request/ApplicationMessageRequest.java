package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApplicationMessageRequest {

    @NotNull
    private Long applicationId;

    @NotBlank
    private String content;

    public ApplicationMessageRequest() {
    }

    public ApplicationMessageRequest(Long applicationId, String content) {
        this.applicationId = applicationId;
        this.content = content;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}