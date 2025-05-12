package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.DocumentRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.DocumentService;
import com.uddan.ayrfu.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentServiceImpl.class);

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(MultipartFile file, String documentType, String description) {
        logger.info("Uploading document of type: {}", documentType);

        User currentUser = getCurrentUser();

        // Validate that the file is not empty
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        // Store the file
        String filePath = fileStorageService.storeFile(file);

        // Create document record
        Document document = new Document();
        document.setUser(currentUser);
        document.setFilename(file.getOriginalFilename());
        document.setFilePath(filePath);
        document.setDocumentType(documentType);
        document.setDescription(description);
        document.setContentType(file.getContentType());
        document.setSize(file.getSize());

        Document savedDocument = documentRepository.save(document);

        return mapToDocumentResponse(savedDocument);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getClientDocuments() {
        logger.info("Getting documents for current client");

        User currentUser = getCurrentUser();

        // Ensure user is a client
        if (currentUser.getClient() == null) {
            throw new BadRequestException("Current user is not a client");
        }

        List<Document> documents = documentRepository.findByUserOrderByUploadedAtDesc(currentUser);

        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadDocumentAsResource(Long id) {
        logger.info("Loading document with ID: {} as resource", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        // Check if user is authorized to access this document
        User currentUser = getCurrentUser();

        // User must be either the owner or have admin/superuser role
        if (!isUserAuthorizedForDocument(currentUser, document)) {
            throw new ResourceNotFoundException("Document not found with ID: " + id);
        }

        return fileStorageService.loadFileAsResource(document.getFilePath());
    }

    @Override
    @Transactional(readOnly = true)
    public String getDocumentFilename(Long id) {
        logger.info("Getting filename for document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        return document.getFilename();
    }

    @Override
    @Transactional(readOnly = true)
    public String getDocumentContentType(Long id) {
        logger.info("Getting content type for document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        return document.getContentType() != null ? document.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        logger.info("Deleting document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        // Check if user is authorized to delete this document
        User currentUser = getCurrentUser();

        // User must be either the owner or have admin role
        if (!isUserAuthorizedForDocument(currentUser, document)) {
            throw new ResourceNotFoundException("Document not found with ID: " + id);
        }

        // Delete from storage
        // Note: You might want to implement this in the FileStorageService

        // Delete from database
        documentRepository.delete(document);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isUserAuthorizedForDocument(User user, Document document) {
        // Check if user is the owner
        if (document.getUser().getId().equals(user.getId())) {
            return true;
        }

        // Check if user has ADMIN or SUPER_USER role
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));
    }

    private DocumentResponse mapToDocumentResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .filename(document.getFilename())
                .documentType(document.getDocumentType())
                .description(document.getDescription())
                .size(document.getSize())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}