package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.enumeration.ApplicationStatus;

import java.util.List;

public interface ApplicationService {
    ApplicationResponse createApplication(Long candidateId, ApplicationRequest applicationRequest);

    ApplicationResponse getApplicationById(Long id);

    List<ApplicationResponse> getAllApplications();

    List<ApplicationResponse> getApplicationsByCandidate(Long candidateId);

    List<ApplicationResponse> getApplicationsByPosition(Long positionId);

    List<ApplicationResponse> getApplicationsByStatus(ApplicationStatus status);

    ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status);

    void deleteApplication(Long id);
}
