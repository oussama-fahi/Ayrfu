package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.response.DocumentResponse;
import com.ayrfu.ayrfu.enumeration.DocumentType;
import com.ayrfu.ayrfu.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document API", description = "APIs for document management")
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/clients/{clientId}")
    @PreAuthorize("hasRole('CLIENT') and @clientService.isOwnProfile(#clientId, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Upload client document", description = "Uploads a document for a client")
    public ResponseEntity<DocumentResponse> uploadClientDocument(
            @PathVariable Long clientId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam(value = "description", required = false) String description) {

        logger.info("Request to upload document for client with ID: {}", clientId);
        DocumentResponse uploadedDocument = documentService.uploadClientDocument(clientId, file, documentType, description);
        return new ResponseEntity<>(uploadedDocument, HttpStatus.CREATED);
    }

    @GetMapping("/clients/{clientId}")
    @PreAuthorize("hasRole('CLIENT') and @clientService.isOwnProfile(#clientId, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get client documents", description = "Retrieves all documents for a client")
    public ResponseEntity<List<DocumentResponse>> getClientDocuments(@PathVariable Long clientId) {
        logger.info("Request to get documents for client with ID: {}", clientId);
        List<DocumentResponse> documents = documentService.getClientDocuments(clientId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@documentService.isDocumentOwner(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get document by ID", description = "Retrieves a document by its ID")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        logger.info("Request to get document with ID: {}", id);
        DocumentResponse document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("@documentService.isDocumentOwner(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Download document", description = "Downloads a document by its ID")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        logger.info("Request to download document with ID: {}", id);

        Resource resource = documentService.downloadDocument(id);
        DocumentResponse document = documentService.getDocumentById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.fileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@documentService.isDocumentOwner(#id, authentication.principal.id) or hasRole('ADMIN')")
    @Operation(summary = "Delete document", description = "Deletes a document by its ID")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        logger.info("Request to delete document with ID: {}", id);
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}