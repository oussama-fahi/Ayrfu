package com.ayrfu.ayrfu.dto.request;

public class ServiceRequestRequest {
    private Long serviceId;
    private String details;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}