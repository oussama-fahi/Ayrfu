package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ServiceRequestMessageRequest {

    @NotNull
    private Long requestId;

    @NotBlank
    private String content;

    public ServiceRequestMessageRequest() {
    }

    public ServiceRequestMessageRequest(Long requestId, String content) {
        this.requestId = requestId;
        this.content = content;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}