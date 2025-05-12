package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ServiceRequestMessageRequest;
import com.uddan.ayrfu.dto.request.ServiceRequestRequest;
import com.uddan.ayrfu.dto.response.ServiceRequestMessageResponse;
import com.uddan.ayrfu.dto.response.ServiceRequestResponse;
import com.uddan.ayrfu.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/service-requests")
@Tag(name = "Service Request", description = "APIs for service request management")
public class ServiceRequestController {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestController.class);
    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Create service request", description = "Creates a new service request")
    public ResponseEntity<ServiceRequestResponse> createServiceRequest(
            @RequestParam("serviceId") Long serviceId,
            @RequestParam("description") String description,
            @RequestParam("urgency") String urgency,
            @RequestParam("preferredStartDate") String preferredStartDate,
            @RequestParam(value = "additionalInfo", required = false) String additionalInfo,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Request to create service request for service ID: {}", serviceId);
        ServiceRequestRequest request = new ServiceRequestRequest(
                serviceId, description, urgency, preferredStartDate, additionalInfo);

        ServiceRequestResponse createdRequest = serviceRequestService.createServiceRequest(request, file);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Get my requests", description = "Retrieves service requests for the current client")
    public ResponseEntity<List<ServiceRequestResponse>> getMyRequests() {
        logger.info("Request to get service requests for current client");
        List<ServiceRequestResponse> requests = serviceRequestService.getMyRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get request by ID", description = "Retrieves details of a specific service request")
    public ResponseEntity<ServiceRequestResponse> getRequestById(@PathVariable Long id) {
        logger.info("Request to get service request with ID: {}", id);
        ServiceRequestResponse request = serviceRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @PostMapping(value = "/messages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add request message", description = "Adds a message to a service request")
    public ResponseEntity<ServiceRequestMessageResponse> addRequestMessage(
            @RequestParam("requestId") Long requestId,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Request to add message to service request with ID: {}", requestId);
        ServiceRequestMessageRequest messageRequest = new ServiceRequestMessageRequest(requestId, content);
        ServiceRequestMessageResponse message = serviceRequestService.addRequestMessage(messageRequest, file);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Cancel request", description = "Cancels a service request")
    public ResponseEntity<ServiceRequestResponse> cancelRequest(@PathVariable Long id) {
        logger.info("Request to cancel service request with ID: {}", id);
        ServiceRequestResponse cancelledRequest = serviceRequestService.cancelRequest(id);
        return ResponseEntity.ok(cancelledRequest);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get all requests", description = "Retrieves all service requests")
    public ResponseEntity<List<ServiceRequestResponse>> getAllRequests() {
        logger.info("Request to get all service requests");
        List<ServiceRequestResponse> requests = serviceRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Update request status", description = "Updates the status of a service request")
    public ResponseEntity<ServiceRequestResponse> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        logger.info("Request to update status of service request with ID: {} to: {}", id, status);
        ServiceRequestResponse updatedRequest = serviceRequestService.updateRequestStatus(id, status);
        return ResponseEntity.ok(updatedRequest);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Assign request", description = "Assigns a service request to a user")
    public ResponseEntity<ServiceRequestResponse> assignRequest(
            @PathVariable Long id,
            @RequestBody @Valid Long assigneeId) {

        logger.info("Request to assign service request with ID: {} to user ID: {}", id, assigneeId);
        ServiceRequestResponse assignedRequest = serviceRequestService.assignRequest(id, assigneeId);
        return ResponseEntity.ok(assignedRequest);
    }
}