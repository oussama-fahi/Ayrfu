package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.request.CandidateRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.response.CandidateResponse;
import com.uddan.ayrfu.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidates", description = "Candidate management API endpoints")
public class CandidateController {

    private static final Logger logger = LoggerFactory.getLogger(CandidateController.class);
    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService){
        this.candidateService = candidateService;
    }

    @PostMapping
    @Operation(summary = "Create a new candidate", description = "Creates a new candidate with the provided details")
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CandidateRequest candidateRequest) {
        logger.info("Request to create candidate");
        CandidateResponse createdCandidate = candidateService.createCandidate(candidateRequest);
        return new ResponseEntity<>(createdCandidate, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get candidate by ID", description = "Retrieves a candidate by its ID")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable Long id) {
        logger.info("Request to get candidate with ID: {}", id);
        CandidateResponse candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get candidate by email", description = "Retrieves a candidate by its email")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnEmail(#email, authentication.principal.username)")
    public ResponseEntity<CandidateResponse> getCandidateByEmail(@PathVariable String email) {
        logger.info("Request to get candidate with email: {}", email);
        CandidateResponse candidate = candidateService.getCandidateByEmail(email);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all candidates", description = "Retrieves all candidates")
    public ResponseEntity<List<CandidateResponse>> getAllCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get all candidates, page: {}, size: {}", page, size);
        List<CandidateResponse> candidates = candidateService.getAllCandidates(page, size);
        return ResponseEntity.ok(candidates);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a candidate", description = "Updates a candidate with the provided details")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest candidateRequest) {
        logger.info("Request to update candidate with ID: {}", id);
        CandidateResponse updatedCandidate = candidateService.updateCandidate(id, candidateRequest);
        return ResponseEntity.ok(updatedCandidate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a candidate", description = "Deletes a candidate by its ID")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        logger.info("Request to delete candidate with ID: {}", id);
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload candidate CV", description = "Uploads a CV for a candidate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<String> uploadCandidateCV(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        logger.info("Request to upload CV for candidate with ID: {}", id);
        String cvPath = candidateService.uploadCandidateCV(id, file);
        return ResponseEntity.ok(cvPath);
    }


    @GetMapping("/{id}/applications")
    @Operation(summary = "Get candidate applications", description = "Retrieves all applications submitted by a candidate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<List<ApplicationResponse>> getCandidateApplications(@PathVariable Long id) {
        logger.info("Request to get applications for candidate with ID: {}", id);
        List<ApplicationResponse> applications = candidateService.getCandidateApplications(id);
        return ResponseEntity.ok(applications);
    }
}