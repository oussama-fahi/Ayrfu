package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUserOrderByUploadedAtDesc(User user);

    List<Document> findByUserAndDocumentTypeOrderByUploadedAtDesc(User user, String documentType);
}