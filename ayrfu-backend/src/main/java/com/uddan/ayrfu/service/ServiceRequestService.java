package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ServiceRequestRequest;
import com.uddan.ayrfu.dto.response.ServiceRequestResponse;
import com.uddan.ayrfu.enumeration.ServiceRequestStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ServiceRequestService {


    @Transactional
    ServiceRequestResponse createServiceRequest(ServiceRequestRequest requestDto);

    @Transactional(readOnly = true)
    ServiceRequestResponse getServiceRequestById(Long id);

    @Transactional(readOnly = true)
    List<ServiceRequestResponse> getServiceRequestsByClient(Long clientId, int page, int size);

    @Transactional(readOnly = true)
    List<ServiceRequestResponse> getCurrentClientServiceRequests(int page, int size);

    @Transactional(readOnly = true)
    List<ServiceRequestResponse> getServiceRequestsByStatus(ServiceRequestStatus status, int page, int size);

    @Transactional
    ServiceRequestResponse updateServiceRequestStatus(Long id, ServiceRequestStatus status);

    @Transactional
    void deleteServiceRequest(Long id);

    boolean isOwnRequest(Long requestId, Long userId);
}