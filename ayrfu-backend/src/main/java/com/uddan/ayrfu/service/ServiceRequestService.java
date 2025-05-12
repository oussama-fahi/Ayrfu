package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ServiceRequestMessageRequest;
import com.uddan.ayrfu.dto.request.ServiceRequestRequest;
import com.uddan.ayrfu.dto.response.ServiceRequestMessageResponse;
import com.uddan.ayrfu.dto.response.ServiceRequestResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServiceRequestService {

    ServiceRequestResponse createServiceRequest(ServiceRequestRequest requestDTO, MultipartFile file);

    List<ServiceRequestResponse> getMyRequests();

    ServiceRequestResponse getRequestById(Long id);

    ServiceRequestMessageResponse addRequestMessage(ServiceRequestMessageRequest messageRequest, MultipartFile file);

    ServiceRequestResponse cancelRequest(Long id);

    List<ServiceRequestResponse> getAllRequests();

    ServiceRequestResponse updateRequestStatus(Long id, String status);

    ServiceRequestResponse assignRequest(Long id, Long assigneeId);
}