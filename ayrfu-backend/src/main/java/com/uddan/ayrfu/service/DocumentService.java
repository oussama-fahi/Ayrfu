package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.response.DocumentResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(MultipartFile file, String documentType, String description);

    List<DocumentResponse> getClientDocuments();

    Resource loadDocumentAsResource(Long id);

    String getDocumentFilename(Long id);

    String getDocumentContentType(Long id);

    void deleteDocument(Long id);
}