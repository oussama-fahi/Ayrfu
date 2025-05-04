package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ServiceRequest;
import com.uddan.ayrfu.dto.response.ServiceResponse;
import com.uddan.ayrfu.service.ServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Service API", description = "APIs for service management")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService){
        this.serviceService=serviceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new service", description = "Creates a new service with the provided details")
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody ServiceRequest serviceRequest) {
        ServiceResponse createdService = serviceService.createService(serviceRequest);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID", description = "Retrieves a service by its ID")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Long id) {
        ServiceResponse service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping
    @Operation(summary = "Get all services", description = "Retrieves all services, including inactive ones")
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        List<ServiceResponse> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active services", description = "Retrieves all active services")
    public ResponseEntity<List<ServiceResponse>> getAllActiveServices() {
        List<ServiceResponse> activeServices = serviceService.getAllActiveServices();
        return ResponseEntity.ok(activeServices);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Update a service", description = "Updates a service with the provided details")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest serviceRequest) {
        ServiceResponse updatedService = serviceService.updateService(id, serviceRequest);
        return ResponseEntity.ok(updatedService);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Activate a service", description = "Activates a service by its ID")
    public ResponseEntity<Void> activateService(@PathVariable Long id) {
        serviceService.activateService(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Deactivate a service", description = "Deactivates a service by its ID")
    public ResponseEntity<Void> deactivateService(@PathVariable Long id) {
        serviceService.deactivateService(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a service", description = "Deletes a service by its ID")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search services by keywords", description = "Searches services based on the provided keywords")
    public ResponseEntity<List<ServiceResponse>> searchServicesByKeywords(@RequestParam Set<String> keywords) {
        List<ServiceResponse> matchingServices = serviceService.findServicesByKeywords(keywords);
        return ResponseEntity.ok(matchingServices);
    }

    @GetMapping("/prompt/search")
    @Operation(summary = "Search services by prompt", description = "Searches services based on a natural language prompt")
    public ResponseEntity<List<ServiceResponse>> searchServicesByPrompt(@RequestParam String prompt) {
        List<ServiceResponse> matchingServices = serviceService.findServicesMatchingPrompt(prompt);
        return ResponseEntity.ok(matchingServices);
    }
}