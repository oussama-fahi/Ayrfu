package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ClientRequest;
import com.uddan.ayrfu.dto.response.ClientResponse;
import com.uddan.ayrfu.service.ClientService;
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

@RestController
@RequestMapping("/api/clients")
@Tag(name = "Clients", description = "Client management API endpoints")
public class ClientController {

    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    @Operation(summary = "Create a new client", description = "Creates a new client with the provided details")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest clientRequest) {
        logger.info("Request to create client with email: {}", clientRequest.getEmail());
        ClientResponse createdClient = clientService.createClient(clientRequest);
        return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @clientService.isOwnProfile(#id, authentication.principal.id)")
    @Operation(summary = "Get client by ID", description = "Retrieves a client by its ID")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        logger.info("Request to get client with ID: {}", id);
        ClientResponse client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @clientService.isOwnEmail(#email, authentication.principal.username)")
    @Operation(summary = "Get client by email", description = "Retrieves a client by its email")
    public ResponseEntity<ClientResponse> getClientByEmail(@PathVariable String email) {
        logger.info("Request to get client with email: {}", email);
        ClientResponse client = clientService.getClientByEmail(email);
        return ResponseEntity.ok(client);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all clients", description = "Retrieves all clients")
    public ResponseEntity<List<ClientResponse>> getAllClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get all clients, page: {}, size: {}", page, size);
        List<ClientResponse> clients = clientService.getAllClients(page, size);
        return ResponseEntity.ok(clients);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN') or @clientService.isOwnProfile(#id, authentication.principal.id)")
    @Operation(summary = "Update a client", description = "Updates a client with the provided details")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequest clientRequest) {
        logger.info("Request to update client with ID: {}", id);
        ClientResponse updatedClient = clientService.updateClient(id, clientRequest);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a client", description = "Deletes a client by its ID")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        logger.info("Request to delete client with ID: {}", id);
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}