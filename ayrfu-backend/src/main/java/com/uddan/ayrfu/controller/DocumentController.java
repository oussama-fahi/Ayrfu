package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.DocumentRequest;
import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@Tag(name = "Document Management", description = "APIs for document management")
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload document", description = "Uploads a document")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false) String description) {
        logger.info("Request to upload document of type: {}", documentType);
        DocumentResponse uploadedDocument = documentService.uploadDocument(file, documentType, description);
        return new ResponseEntity<>(uploadedDocument, HttpStatus.CREATED);
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Get client documents", description = "Retrieves documents for the current client")
    public ResponseEntity<List<DocumentResponse>> getClientDocuments() {
        logger.info("Request to get documents for current client");
        List<DocumentResponse> documents = documentService.getClientDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Download document", description = "Downloads a specific document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        logger.info("Request to download document with ID: {}", id);
        Resource resource = documentService.loadDocumentAsResource(id);
        String filename = documentService.getDocumentFilename(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @GetMapping("/view/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "View document", description = "Views a specific document in the browser")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long id) {
        logger.info("Request to view document with ID: {}", id);
        Resource resource = documentService.loadDocumentAsResource(id);
        String contentType = documentService.getDocumentContentType(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete document", description = "Deletes a document")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        logger.info("Request to delete document with ID: {}", id);
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}