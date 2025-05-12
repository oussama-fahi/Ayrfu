package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.PositionRequest;
import com.uddan.ayrfu.dto.response.PositionResponse;
import com.uddan.ayrfu.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/positions")
@Tag(name = "Position API", description = "APIs for position management")
public class PositionController {

    private static final Logger logger = LoggerFactory.getLogger(PositionController.class);
    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new position", description = "Creates a new job position with the provided details")
    public ResponseEntity<PositionResponse> createPosition(@Valid @RequestBody PositionRequest positionRequest) {
        logger.info("Request to create position with title: {}", positionRequest.getTitle());
        PositionResponse createdPosition = positionService.createPosition(positionRequest);
        return new ResponseEntity<>(createdPosition, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get position by ID", description = "Retrieves a position by its ID")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable Long id) {
        logger.info("Request to get position with ID: {}", id);
        PositionResponse position = positionService.getPositionById(id);
        return ResponseEntity.ok(position);
    }

    @GetMapping
    @Operation(summary = "Get all positions", description = "Retrieves all positions, including inactive ones")
    public ResponseEntity<List<PositionResponse>> getAllPositions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get all positions, page: {}, size: {}", page, size);
        List<PositionResponse> positions = positionService.getAllPositions(page, size);
        return ResponseEntity.ok(positions);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active positions", description = "Retrieves all active positions")
    public ResponseEntity<List<PositionResponse>> getAllActivePositions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get all active positions, page: {}, size: {}", page, size);
        List<PositionResponse> activePositions = positionService.getAllActivePositions(page, size);
        return ResponseEntity.ok(activePositions);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Update a position", description = "Updates a position with the provided details")
    public ResponseEntity<PositionResponse> updatePosition(
            @PathVariable Long id,
            @Valid @RequestBody PositionRequest positionRequest) {
        logger.info("Request to update position with ID: {}", id);
        PositionResponse updatedPosition = positionService.updatePosition(id, positionRequest);
        return ResponseEntity.ok(updatedPosition);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Activate a position", description = "Activates a position by its ID")
    public ResponseEntity<PositionResponse> activatePosition(@PathVariable Long id) {
        logger.info("Request to activate position with ID: {}", id);
        PositionResponse position = positionService.activatePosition(id);
        return ResponseEntity.ok(position);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Deactivate a position", description = "Deactivates a position by its ID")
    public ResponseEntity<PositionResponse> deactivatePosition(@PathVariable Long id) {
        logger.info("Request to deactivate position with ID: {}", id);
        PositionResponse position = positionService.deactivatePosition(id);
        return ResponseEntity.ok(position);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a position", description = "Deletes a position by its ID")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        logger.info("Request to delete position with ID: {}", id);
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search positions by criteria", description = "Searches positions based on the provided criteria")
    public ResponseEntity<List<PositionResponse>> searchPositions(
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String workModel,
            @RequestParam(required = false) Set<String> languages) {

        logger.info("Request to search positions with criteria - Technology: {}, Location: {}, Experience Level: {}, Work Model: {}, Languages: {}",
                technology, location, experienceLevel, workModel, languages);
        List<PositionResponse> matchingPositions = positionService.findPositionsMatchingCriteria(
                technology, location, experienceLevel, workModel, languages);
        return ResponseEntity.ok(matchingPositions);
    }

    @GetMapping("/recommended")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Get recommended positions", description = "Retrieves positions recommended for the current candidate")
    public ResponseEntity<List<PositionResponse>> getRecommendedPositions() {
        logger.info("Request to get recommended positions for current candidate");
        List<PositionResponse> recommendedPositions = positionService.getRecommendedPositions();
        return ResponseEntity.ok(recommendedPositions);
    }
}