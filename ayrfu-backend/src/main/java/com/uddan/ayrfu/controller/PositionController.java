package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.PositionRequest;
import com.uddan.ayrfu.dto.response.PositionResponse;
import com.uddan.ayrfu.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    private final PositionService positionService;

    public PositionController(PositionService positionService){
        this.positionService=positionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new position", description = "Creates a new job position with the provided details")
    public ResponseEntity<PositionResponse> createPosition(@Valid @RequestBody PositionRequest positionRequest) {
        PositionResponse createdPosition = positionService.createPosition(positionRequest);
        return new ResponseEntity<>(createdPosition, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get position by ID", description = "Retrieves a position by its ID")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable Long id) {
        PositionResponse position = positionService.getPositionById(id);
        return ResponseEntity.ok(position);
    }

    @GetMapping
    @Operation(summary = "Get all positions", description = "Retrieves all positions, including inactive ones")
    public ResponseEntity<List<PositionResponse>> getAllPositions() {
        List<PositionResponse> positions = positionService.getAllPositions();
        return ResponseEntity.ok(positions);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active positions", description = "Retrieves all active positions")
    public ResponseEntity<List<PositionResponse>> getAllActivePositions() {
        List<PositionResponse> activePositions = positionService.getAllActivePositions();
        return ResponseEntity.ok(activePositions);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Update a position", description = "Updates a position with the provided details")
    public ResponseEntity<PositionResponse> updatePosition(
            @PathVariable Long id,
            @Valid @RequestBody PositionRequest positionRequest) {
        PositionResponse updatedPosition = positionService.updatePosition(id, positionRequest);
        return ResponseEntity.ok(updatedPosition);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Activate a position", description = "Activates a position by its ID")
    public ResponseEntity<Void> activatePosition(@PathVariable Long id) {
        positionService.activatePosition(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Deactivate a position", description = "Deactivates a position by its ID")
    public ResponseEntity<Void> deactivatePosition(@PathVariable Long id) {
        positionService.deactivatePosition(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Delete a position", description = "Deletes a position by its ID")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
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

        List<PositionResponse> matchingPositions = positionService.findPositionsMatchingCriteria(
                technology, location, experienceLevel, workModel, languages);
        return ResponseEntity.ok(matchingPositions);
    }
}