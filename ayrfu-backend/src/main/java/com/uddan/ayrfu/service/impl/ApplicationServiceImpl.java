package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.response.CandidateResponse;
import com.uddan.ayrfu.dto.response.PositionResponse;
import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.enumeration.ApplicationStatus;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ApplicationRepository;
import com.uddan.ayrfu.repository.CandidateRepository;
import com.uddan.ayrfu.repository.PositionRepository;
import com.uddan.ayrfu.service.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  CandidateRepository candidateRepository,
                                  PositionRepository positionRepository) {
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.positionRepository = positionRepository;
    }

    @Override
    public ApplicationResponse createApplication(Long candidateId, ApplicationRequest applicationRequest) {
        logger.info("Creating application for candidate ID: {} and position ID: {}", candidateId, applicationRequest.getPositionId());

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + candidateId));

        Position position = positionRepository.findById(applicationRequest.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + applicationRequest.getPositionId()));

        // Check if candidate has already applied for this position
        Optional<Application> existingApplication = applicationRepository.findByCandidateAndPosition(candidate, position);
        if (existingApplication.isPresent()) {
            throw new BadRequestException("Candidate has already applied for this position");
        }

        // Check if candidate has uploaded a CV
        if (candidate.getCvPath() == null || candidate.getCvPath().isEmpty()) {
            throw new BadRequestException("Candidate must upload a CV before applying");
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setPosition(position);
        application.setCoverLetter(applicationRequest.getCoverLetter());
        application.setStatus(ApplicationStatus.PENDING);

        Application savedApplication = applicationRepository.save(application);

        return mapToApplicationResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        logger.info("Getting application with ID: {}", id);

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        return mapToApplicationResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications() {
        logger.info("Getting all applications");

        return applicationRepository.findAll().stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByCandidate(Long candidateId) {
        logger.info("Getting applications for candidate with ID: {}", candidateId);

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + candidateId));

        return applicationRepository.findByCandidate(candidate).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByPosition(Long positionId) {
        logger.info("Getting applications for position with ID: {}", positionId);

        return applicationRepository.findByPositionId(positionId).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByStatus(ApplicationStatus status) {
        logger.info("Getting applications with status: {}", status);

        return applicationRepository.findByStatus(status).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status) {
        logger.info("Updating application with ID: {} to status: {}", id, status);

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);

        return mapToApplicationResponse(updatedApplication);
    }

    @Override
    public void deleteApplication(Long id) {
        logger.info("Deleting application with ID: {}", id);

        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }

        applicationRepository.deleteById(id);
    }

    // Mapping methods
    private ApplicationResponse mapToApplicationResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidate(mapToCandidateResponse(application.getCandidate()))
                .position(mapToPositionResponse(application.getPosition()))
                .appliedAt(application.getAppliedAt())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .build();
    }

    private CandidateResponse mapToCandidateResponse(Candidate candidate) {
        return CandidateResponse.builder()
                .id(candidate.getId())
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                // Map other fields as needed
                .build();
    }

    private PositionResponse mapToPositionResponse(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .title(position.getTitle())
                .technology(position.getTechnology())
                .location(position.getLocation())
                // Map other fields as needed
                .build();
    }
}