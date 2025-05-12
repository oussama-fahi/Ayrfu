package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.response.CandidateBasicResponse;
import com.uddan.ayrfu.dto.response.PositionBasicResponse;
import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.ApplicationStatus;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ApplicationRepository;
import com.uddan.ayrfu.repository.CandidateRepository;
import com.uddan.ayrfu.repository.PositionRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  CandidateRepository candidateRepository,
                                  PositionRepository positionRepository,
                                  UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.positionRepository = positionRepository;
        this.userRepository=userRepository;
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
    @Transactional
    public ApplicationResponse withdrawApplication(Long id) {
        logger.info("Withdrawing application with ID: {}", id);

        User currentUser = getCurrentUser();
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        // Verify that the application belongs to the current user
        if (currentUser.getCandidate() == null || !application.getCandidate().equals(currentUser.getCandidate())) {
            throw new BadRequestException("You can only withdraw your own applications");
        }

        // Update status to WITHDRAWN
        application.setStatus(ApplicationStatus.REJECTED);
        Application updatedApplication = applicationRepository.save(application);

        return mapToApplicationResponse(updatedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        logger.info("Getting applications for current logged-in candidate");

        // Get current authenticated user
        User currentUser = getCurrentUser();

        // Get candidate profile
        Candidate candidate = currentUser.getCandidate();
        if (candidate == null) {
            throw new BadRequestException("Current user does not have a candidate profile");
        }

        List<Application> applications = applicationRepository.findByCandidate(candidate);

        return applications.stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    // Helper method to get current user (if not already defined)
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
    public List<ApplicationResponse> getAllApplications(int page, int size) {
        logger.info("Getting all applications, page: {}, size: {}", page, size);

        Page<Application> applications = applicationRepository.findAll(PageRequest.of(page, size));

        return applications.getContent().stream()
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

        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + positionId));

        return applicationRepository.findByPosition(position).stream()
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

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        applicationRepository.delete(application);
    }

    // Mapping methods
    private ApplicationResponse mapToApplicationResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidate(mapToCandidateBasicResponse(application.getCandidate()))
                .position(mapToPositionBasicResponse(application.getPosition()))
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getAppliedAt()) // We can use appliedAt as updatedAt initially
                .build();
    }

    private CandidateBasicResponse mapToCandidateBasicResponse(Candidate candidate) {
        return CandidateBasicResponse.builder()
                .id(candidate.getId())
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .technologies(candidate.getTechnologies())
                .languages(candidate.getLanguages())
                .experienceLevel(candidate.getExperienceLevel())
                .build();
    }

    private PositionBasicResponse mapToPositionBasicResponse(Position position) {
        return PositionBasicResponse.builder()
                .id(position.getId())
                .title(position.getTitle())
                .technology(position.getTechnology())
                .location(position.getLocation())
                .experienceLevel(position.getExperienceLevel())
                .workModel(position.getWorkModel())
                .build();
    }
}