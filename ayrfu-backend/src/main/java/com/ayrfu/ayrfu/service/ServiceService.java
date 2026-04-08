package com.ayrfu.ayrfu.service;

import com.ayrfu.ayrfu.dto.request.ServiceRequest;
import com.ayrfu.ayrfu.dto.response.ServiceResponse;

import java.util.List;
import java.util.Set;

public interface ServiceService {
    ServiceResponse createService(ServiceRequest serviceRequest);

    ServiceResponse getServiceById(Long id);

    List<ServiceResponse> getAllServices();

    List<ServiceResponse> getAllActiveServices();

    ServiceResponse updateService(Long id, ServiceRequest serviceRequest);

    void activateService(Long id);

    void deactivateService(Long id);

    void deleteService(Long id);

    List<ServiceResponse> findServicesByKeywords(Set<String> keywords);

    List<ServiceResponse> findServicesMatchingPrompt(String prompt);

}
