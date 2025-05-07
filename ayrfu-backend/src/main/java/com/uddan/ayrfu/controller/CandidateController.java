package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.dto.request.CandidateRequest;
import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.response.CandidateResponse;
import com.uddan.ayrfu.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService){
        this.candidateService=candidateService;
    }

    @PostMapping
    @Operation(summary = "Create a new candidate", description = "Creates a new candidate with the provided details")
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CandidateRequest candidateRequest) {
        CandidateResponse createdCandidate = candidateService.createCandidate(candidateRequest);
        return new ResponseEntity<>(createdCandidate, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get candidate by ID", description = "Retrieves a candidate by its ID")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable Long id) {
        CandidateResponse candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get candidate by email", description = "Retrieves a candidate by its email")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnEmail(#email, authentication.principal.username)")
    public ResponseEntity<CandidateResponse> getCandidateByEmail(@PathVariable String email) {
        CandidateResponse candidate = candidateService.getCandidateByEmail(email);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all candidates", description = "Retrieves all candidates")
    public ResponseEntity<List<CandidateResponse>> getAllCandidates() {
        List<CandidateResponse> candidates = candidateService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a candidate", description = "Updates a candidate with the provided details")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest candidateRequest) {
        CandidateResponse updatedCandidate = candidateService.updateCandidate(id, candidateRequest);
        return ResponseEntity.ok(updatedCandidate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a candidate", description = "Deletes a candidate by its ID")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload candidate CV", description = "Uploads a CV for a candidate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<String> uploadCandidateCV(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String cvPath = candidateService.uploadCandidateCV(id, file);
        return ResponseEntity.ok(cvPath);
    }

    @PostMapping("/{id}/applications")
    @Operation(summary = "Apply for a position", description = "Submits an application for a position by a candidate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<ApplicationResponse> applyForPosition(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequest applicationRequest) {
        ApplicationResponse application = candidateService.applyForPosition(id, applicationRequest);
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/applications")
    @Operation(summary = "Get candidate applications", description = "Retrieves all applications submitted by a candidate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @candidateService.isOwnProfile(#id, authentication.principal.id)")
    public ResponseEntity<List<ApplicationResponse>> getCandidateApplications(@PathVariable Long id) {
        List<ApplicationResponse> applications = candidateService.getCandidateApplications(id);
        return ResponseEntity.ok(applications);
    }
}
