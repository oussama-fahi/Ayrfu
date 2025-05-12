package com.uddan.ayrfu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ServiceRequestRequest {

    @NotNull
    private Long serviceId;

    @NotBlank
    private String description;

    @NotBlank
    private String urgency;

    @NotBlank
    private String preferredStartDate;

    private String additionalInfo;

    public ServiceRequestRequest() {
    }

    public ServiceRequestRequest(Long serviceId, String description, String urgency, String preferredStartDate, String additionalInfo) {
        this.serviceId = serviceId;
        this.description = description;
        this.urgency = urgency;
        this.preferredStartDate = preferredStartDate;
        this.additionalInfo = additionalInfo;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
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

    public String getPreferredStartDate() {
        return preferredStartDate;
    }

    public void setPreferredStartDate(String preferredStartDate) {
        this.preferredStartDate = preferredStartDate;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
}