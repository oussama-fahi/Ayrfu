package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.DocumentType;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ClientRepository;
import com.uddan.ayrfu.repository.DocumentRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.DocumentService;
import com.uddan.ayrfu.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
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
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            ClientRepository clientRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService) {
        this.documentRepository = documentRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public DocumentResponse uploadClientDocument(Long clientId, MultipartFile file, DocumentType documentType, String description) {
        logger.info("Uploading document for client with ID: {}", clientId);

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Get client
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + clientId));

        // Validate file
        validateFile(file);

        try {
            // Store file
            String fileName = fileStorageService.storeFile(file);

            // Create document
            Document document = Document.builder()
                    .fileName(file.getOriginalFilename())
                    .filePath(fileName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .documentType(documentType)
                    .description(description)
                    .uploadedBy(currentUser)
                    .client(client)
                    .build();

            // Save document
            Document savedDocument = documentRepository.save(document);
            logger.info("Document uploaded successfully with ID: {}", savedDocument.getId());

            return mapToDocumentResponse(savedDocument);
        } catch (Exception e) {
            logger.error("Failed to upload document for client with ID: {}", clientId, e);
            throw new BadRequestException("Failed to upload document: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public DocumentResponse uploadSystemDocument(MultipartFile file, String description) {
        logger.info("Uploading system document");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Validate file
        validateFile(file);

        try {
            // Store file
            String fileName = fileStorageService.storeFile(file);

            // Create document
            Document document = Document.builder()
                    .fileName(file.getOriginalFilename())
                    .filePath(fileName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .documentType(DocumentType.OTHER)
                    .description(description)
                    .uploadedBy(currentUser)
                    .build();

            // Save document
            Document savedDocument = documentRepository.save(document);
            logger.info("System document uploaded successfully with ID: {}", savedDocument.getId());

            return mapToDocumentResponse(savedDocument);
        } catch (Exception e) {
            logger.error("Failed to upload system document", e);
            throw new BadRequestException("Failed to upload document: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getClientDocuments(Long clientId) {
        logger.info("Getting documents for client with ID: {}", clientId);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + clientId));

        List<Document> documents = documentRepository.findByClient(client);

        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(Long id) {
        logger.info("Getting document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        return mapToDocumentResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadDocument(Long id) {
        logger.info("Downloading document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        return fileStorageService.loadFileAsResource(document.getFilePath());
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        logger.info("Deleting document with ID: {}", id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        documentRepository.delete(document);
        logger.info("Document deleted with ID: {}", id);
    }

    @Override
    public boolean isDocumentOwner(Long documentId, Long userId) {
        logger.debug("Checking if user with ID: {} owns document with ID: {}", userId, documentId);

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

        // Check if user is uploader or client owner
        boolean isUploader = document.getUploadedBy() != null && document.getUploadedBy().getId().equals(userId);
        boolean isClientOwner = document.getClient() != null &&
                document.getClient().getUser() != null &&
                document.getClient().getUser().getId().equals(userId);

        return isUploader || isClientOwner;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByType(DocumentType documentType) {
        logger.info("Getting documents with type: {}", documentType);

        List<Document> documents = documentRepository.findByDocumentType(documentType);

        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByUploader(Long userId) {
        logger.info("Getting documents uploaded by user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Document> documents = documentRepository.findByUploadedBy(user);

        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getCurrentUserDocuments() {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Getting documents for current user with ID: {}", currentUser.getId());

        List<Document> documents = documentRepository.findByUploadedBy(currentUser);

        // If user is a client, also get documents associated with their client profile
        Client clientProfile = currentUser.getClient();
        if (clientProfile != null) {
            List<Document> clientDocuments = documentRepository.findByClient(clientProfile);
            // Add client documents that weren't already included
            clientDocuments.stream()
                    .filter(doc -> !documents.contains(doc))
                    .forEach(documents::add);
        }

        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new BadRequestException("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to upload empty file");
        }

        // Check file size (limit to 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum limit of 10MB");
        }

        // Validate file type (allow common document types)
        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("application/pdf") ||
                        contentType.equals("application/msword") ||
                        contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                        contentType.equals("application/vnd.ms-excel") ||
                        contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                        contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("text/plain"))) {
            throw new BadRequestException("Invalid file type. Only PDF, Word, Excel, JPG, PNG, and text files are allowed.");
        }
    }

    private DocumentResponse mapToDocumentResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .documentType(document.getDocumentType())
                .description(document.getDescription())
                .uploadedByName(document.getUploadedBy() != null ? document.getUploadedBy().getUserName() : null)
                .clientId(document.getClient() != null ? document.getClient().getId() : null)
                .clientCompanyName(document.getClient() != null ? document.getClient().getCompanyName() : null)
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }
}