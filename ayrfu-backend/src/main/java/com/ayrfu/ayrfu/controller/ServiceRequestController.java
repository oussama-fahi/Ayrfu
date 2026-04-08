package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.request.ServiceRequestRequest;
import com.ayrfu.ayrfu.dto.response.ServiceRequestResponse;
import com.ayrfu.ayrfu.enumeration.ServiceRequestStatus;
import com.ayrfu.ayrfu.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/service-requests")
@Tag(name = "Service Request API", description = "APIs for service request management")
public class ServiceRequestController {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestController.class);
    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Create a new service request", description = "Creates a new service request from the current client")
    public ResponseEntity<ServiceRequestResponse> createServiceRequest(@Valid @RequestBody ServiceRequestRequest requestDto) {
        logger.info("Request to create service request for service ID: {}", requestDto.getServiceId());
        ServiceRequestResponse createdRequest = serviceRequestService.createServiceRequest(requestDto);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @serviceRequestService.isOwnRequest(#id, authentication.principal.id)")
    @Operation(summary = "Get service request by ID", description = "Retrieves a service request by its ID")
    public ResponseEntity<ServiceRequestResponse> getServiceRequestById(@PathVariable Long id) {
        logger.info("Request to get service request with ID: {}", id);
        ServiceRequestResponse request = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/clients/{clientId}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @clientService.isOwnProfile(#clientId, authentication.principal.id)")
    @Operation(summary = "Get service requests by client", description = "Retrieves all service requests for a specific client")
    public ResponseEntity<List<ServiceRequestResponse>> getServiceRequestsByClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get service requests for client with ID: {}", clientId);
        List<ServiceRequestResponse> requests = serviceRequestService.getServiceRequestsByClient(clientId, page, size);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Get current client's service requests", description = "Retrieves all service requests for the current authenticated client")
    public ResponseEntity<?> getCurrentClientServiceRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get service requests for current client");
        List<ServiceRequestResponse> requests = serviceRequestService.getCurrentClientServiceRequests(page, size);

        if (requests.isEmpty()) {
            return ResponseEntity.ok().body(new MessageResponse("You haven't requested any services yet."));
        }

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get service requests by status", description = "Retrieves all service requests with a specific status")
    public ResponseEntity<List<ServiceRequestResponse>> getServiceRequestsByStatus(
            @PathVariable ServiceRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get service requests with status: {}", status);
        List<ServiceRequestResponse> requests = serviceRequestService.getServiceRequestsByStatus(status, page, size);
        return ResponseEntity.ok(requests);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Update service request status", description = "Updates the status of a service request")
    public ResponseEntity<ServiceRequestResponse> updateServiceRequestStatus(
            @PathVariable Long id,
            @RequestParam ServiceRequestStatus status) {
        logger.info("Request to update service request with ID: {} to status: {}", id, status);
        ServiceRequestResponse updatedRequest = serviceRequestService.updateServiceRequestStatus(id, status);
        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @serviceRequestService.isOwnRequest(#id, authentication.principal.id))")
    @Operation(summary = "Delete service request", description = "Deletes a service request by ID")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable Long id) {
        logger.info("Request to delete service request with ID: {}", id);
        serviceRequestService.deleteServiceRequest(id);
        return ResponseEntity.noContent().build();
    }

    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}