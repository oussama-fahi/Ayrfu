package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.response.ApplicationResponse;
import com.uddan.ayrfu.dto.request.ApplicationRequest;
import com.uddan.ayrfu.enumeration.ApplicationStatus;
import com.uddan.ayrfu.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Application Management", description = "APIs for managing job applications")
public class ApplicationController {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/candidates/{candidateId}")
    @Operation(summary = "Create a new application", description = "Creates a new job application for a candidate")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Application created successfully",
                    content = @Content(schema = @Schema(implementation = ApplicationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or candidate has already applied"),
            @ApiResponse(responseCode = "404", description = "Candidate or position not found")
    })
    public ResponseEntity<ApplicationResponse> createApplication(
            @Parameter(description = "Candidate ID", required = true) @PathVariable Long candidateId,
            @Parameter(description = "Application details", required = true) @Valid @RequestBody ApplicationRequest applicationRequest) {

        logger.info("Request to create application for candidate ID: {}", candidateId);
        ApplicationResponse createdApplication = applicationService.createApplication(candidateId, applicationRequest);
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID", description = "Retrieves an application by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application found",
                    content = @Content(schema = @Schema(implementation = ApplicationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @Parameter(description = "Application ID", required = true) @PathVariable Long id) {

        logger.info("Request to get application with ID: {}", id);
        ApplicationResponse application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get all applications", description = "Retrieves a list of all applications")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role")
    })
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        logger.info("Request to get all applications");
        List<ApplicationResponse> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/candidates/{candidateId}")
    @Operation(summary = "Get applications by candidate", description = "Retrieves all applications for a specific candidate")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Candidate not found")
    })
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidate(
            @Parameter(description = "Candidate ID", required = true) @PathVariable Long candidateId) {

        logger.info("Request to get applications for candidate with ID: {}", candidateId);
        List<ApplicationResponse> applications = applicationService.getApplicationsByCandidate(candidateId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/positions/{positionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get applications by position", description = "Retrieves all applications for a specific position")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role"),
            @ApiResponse(responseCode = "404", description = "Position not found")
    })
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByPosition(
            @Parameter(description = "Position ID", required = true) @PathVariable Long positionId) {

        logger.info("Request to get applications for position with ID: {}", positionId);
        List<ApplicationResponse> applications = applicationService.getApplicationsByPosition(positionId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get applications by status", description = "Retrieves all applications with a specific status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByStatus(
            @Parameter(description = "Application status", required = true) @PathVariable ApplicationStatus status) {

        logger.info("Request to get applications with status: {}", status);
        List<ApplicationResponse> applications = applicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(applications);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Update application status", description = "Updates the status of an application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application status updated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN or SUPER_USER role"),
            @ApiResponse(responseCode = "404", description = "Application not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @Parameter(description = "Application ID", required = true) @PathVariable Long id,
            @Parameter(description = "New status", required = true) @RequestParam ApplicationStatus status) {

        logger.info("Request to update application with ID: {} to status: {}", id, status);
        ApplicationResponse updatedApplication = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete application", description = "Deletes an application by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Application deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden, requires ADMIN role"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<Void> deleteApplication(
            @Parameter(description = "Application ID", required = true) @PathVariable Long id) {

        logger.info("Request to delete application with ID: {}", id);
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}