package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.request.CandidateRequest;
import com.uddan.ayrfu.dto.response.*;
import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.enumeration.ApplicationStatus;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ApplicationRepository;
import com.uddan.ayrfu.repository.CandidateRepository;
import com.uddan.ayrfu.repository.PositionRepository;
import com.uddan.ayrfu.service.CandidateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CandidateServiceImpl implements CandidateService {

    private static final Logger logger = LoggerFactory.getLogger(CandidateServiceImpl.class);

    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;
    private final ApplicationRepository applicationRepository;

    public CandidateServiceImpl(
            CandidateRepository candidateRepository,
            PositionRepository positionRepository,
            ApplicationRepository applicationRepository
    ){
        this.candidateRepository = candidateRepository;
        this.positionRepository = positionRepository;
        this.applicationRepository = applicationRepository;
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public CandidateResponse createCandidate(CandidateRequest candidateRequest) {
        logger.info("Creating new candidate with email: {}", candidateRequest.getEmail());

        // Check if candidate with email already exists
        if (candidateRepository.existsByEmail(candidateRequest.getEmail())) {
            throw new BadRequestException("Candidate with email " + candidateRequest.getEmail() + " already exists");
        }

        Candidate candidate = Candidate.builder()
                .fullName(candidateRequest.getFullName())
                .email(candidateRequest.getEmail())
                .phoneNumber(candidateRequest.getPhoneNumber())
                .address(candidateRequest.getAddress())
                .dateOfBirth(candidateRequest.getDateOfBirth())
                .gender(candidateRequest.getGender())
                .technologies(candidateRequest.getTechnologies())
                .languages(candidateRequest.getLanguages())
                .experienceLevel(candidateRequest.getExperienceLevel())
                .preferredLocation(candidateRequest.getPreferredLocation())
                .preferredWorkModel(candidateRequest.getPreferredWorkModel())
                .build();

        Candidate savedCandidate = candidateRepository.save(candidate);
        logger.info("Candidate created with ID: {}", savedCandidate.getId());

        return mapToCandidateResponse(savedCandidate);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        logger.info("Fetching candidate with ID: {}", id);

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + id));

        return mapToCandidateResponse(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidateByEmail(String email) {
        logger.info("Fetching candidate with email: {}", email);

        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with email: " + email));

        return mapToCandidateResponse(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates(int page, int size) {
        logger.info("Fetching all candidates, page: {}, size: {}", page, size);

        Page<Candidate> candidates = candidateRepository.findAll(PageRequest.of(page, size));

        return candidates.getContent().stream()
                .map(this::mapToCandidateResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CandidateResponse updateCandidate(Long id, CandidateRequest candidateRequest) {
        logger.info("Updating candidate with ID: {}", id);

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + id));

        // Check if email is being changed and if the new email is already in use
        if (!candidate.getEmail().equals(candidateRequest.getEmail()) &&
                candidateRepository.existsByEmail(candidateRequest.getEmail())) {
            throw new BadRequestException("Email " + candidateRequest.getEmail() + " is already in use");
        }

        candidate.setFullName(candidateRequest.getFullName());
        candidate.setEmail(candidateRequest.getEmail());
        candidate.setPhoneNumber(candidateRequest.getPhoneNumber());
        candidate.setAddress(candidateRequest.getAddress());
        candidate.setDateOfBirth(candidateRequest.getDateOfBirth());
        candidate.setGender(candidateRequest.getGender());
        candidate.setTechnologies(candidateRequest.getTechnologies());
        candidate.setLanguages(candidateRequest.getLanguages());
        candidate.setExperienceLevel(candidateRequest.getExperienceLevel());
        candidate.setPreferredLocation(candidateRequest.getPreferredLocation());
        candidate.setPreferredWorkModel(candidateRequest.getPreferredWorkModel());

        Candidate updatedCandidate = candidateRepository.save(candidate);
        logger.info("Candidate updated with ID: {}", updatedCandidate.getId());

        return mapToCandidateResponse(updatedCandidate);
    }

    @Override
    @Transactional
    public void deleteCandidate(Long id) {
        logger.info("Deleting candidate with ID: {}", id);

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + id));

        candidateRepository.delete(candidate);

        logger.info("Candidate deleted with ID: {}", id);
    }

    @Override
    @Transactional
    public String uploadCandidateCV(Long candidateId, MultipartFile file) {
        logger.info("Uploading CV for candidate with ID: {}", candidateId);

        try {
            Candidate candidate = candidateRepository.findById(candidateId)
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + candidateId));

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Validate file type
            if (!isValidFileType(fileExtension)) {
                throw new BadRequestException("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
            }

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update candidate with CV path
            candidate.setCvPath(filename);
            candidateRepository.save(candidate);

            logger.info("CV uploaded for candidate with ID: {}", candidateId);

            return filename;
        } catch (IOException e) {
            logger.error("Failed to upload CV file", e);
            throw new BadRequestException("Failed to upload CV file: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCandidateApplications(Long candidateId) {
        logger.info("Fetching applications for candidate with ID: {}", candidateId);

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + candidateId));

        List<Application> applications = applicationRepository.findByCandidate(candidate);

        return applications.stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isOwnProfile(Long candidateId, Long userId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + candidateId));

        return candidate.getUser() != null && candidate.getUser().getId().equals(userId);
    }

    @Override
    public boolean isOwnEmail(String email, String userEmail) {
        return email.equals(userEmail);
    }

    /**
     * Validate file type for CV uploads
     */
    private boolean isValidFileType(String fileExtension) {
        return fileExtension.equalsIgnoreCase(".pdf") ||
                fileExtension.equalsIgnoreCase(".doc") ||
                fileExtension.equalsIgnoreCase(".docx");
    }

    /**
     * Maps a Candidate entity to a CandidateResponse DTO
     */
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

    /**
     * Maps a Candidate entity to a CandidateBasicResponse DTO
     */
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

    /**
     * Maps a Position entity to a PositionBasicResponse DTO
     */
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

    // The full CandidateResponse mapping remains for other methods
    private CandidateResponse mapToCandidateResponse(Candidate candidate) {
        return CandidateResponse.builder()
                .id(candidate.getId())
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .address(candidate.getAddress())
                .dateOfBirth(candidate.getDateOfBirth())
                .gender(candidate.getGender())
                .technologies(candidate.getTechnologies())
                .languages(candidate.getLanguages())
                .experienceLevel(candidate.getExperienceLevel())
                .preferredLocation(candidate.getPreferredLocation())
                .preferredWorkModel(candidate.getPreferredWorkModel())
                .cvPath(candidate.getCvPath())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }
}