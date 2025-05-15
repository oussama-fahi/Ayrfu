package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.enumeration.DocumentType;
import org.springframework.core.io.Resource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    @Transactional
    DocumentResponse uploadClientDocument(Long clientId, MultipartFile file, DocumentType documentType, String description);

    @Transactional
    DocumentResponse uploadSystemDocument(MultipartFile file, String description);

    @Transactional(readOnly = true)
    List<DocumentResponse> getClientDocuments(Long clientId);

    @Transactional(readOnly = true)
    DocumentResponse getDocumentById(Long id);

    @Transactional(readOnly = true)
    Resource downloadDocument(Long id);

    @Transactional
    void deleteDocument(Long id);

    boolean isDocumentOwner(Long documentId, Long userId);

    @Transactional(readOnly = true)
    List<DocumentResponse> getDocumentsByType(DocumentType documentType);

    @Transactional(readOnly = true)
    List<DocumentResponse> getDocumentsByUploader(Long userId);

    @Transactional(readOnly = true)
    List<DocumentResponse> getCurrentUserDocuments();
}