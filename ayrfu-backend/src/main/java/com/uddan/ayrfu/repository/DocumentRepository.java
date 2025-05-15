package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByClient(Client client);

    Page<Document> findByClient(Client client, Pageable pageable);

    List<Document> findByUploadedBy(User user);

    Page<Document> findByUploadedBy(User user, Pageable pageable);

    List<Document> findByDocumentType(DocumentType documentType);

    Page<Document> findByDocumentType(DocumentType documentType, Pageable pageable);

    List<Document> findByClientAndDocumentType(Client client, DocumentType documentType);

    Page<Document> findByClientAndDocumentType(Client client, DocumentType documentType, Pageable pageable);

    Optional<Document> findByFilePath(String filePath);

    @Query("SELECT d FROM Document d WHERE LOWER(d.fileName) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<Document> findByFileNameContainingIgnoreCase(@Param("searchText") String searchText);

    @Query("SELECT d FROM Document d WHERE LOWER(d.description) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<Document> findByDescriptionContainingIgnoreCase(@Param("searchText") String searchText);

    @Query("SELECT d FROM Document d WHERE d.client = :client OR d.uploadedBy = :user")
    List<Document> findByClientOrUploadedBy(@Param("client") Client client, @Param("user") User user);

    long countByDocumentType(DocumentType documentType);

    long countByClient(Client client);

    long countByUploadedBy(User user);

    @Query("SELECT d FROM Document d WHERE d.client = :client ORDER BY d.createdAt DESC")
    List<Document> findRecentByClient(@Param("client") Client client, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE d.uploadedBy = :user ORDER BY d.createdAt DESC")
    List<Document> findRecentByUploadedBy(@Param("user") User user, Pageable pageable);

    List<Document> findByContentTypeIn(List<String> contentTypes);

    @Query("SELECT d FROM Document d WHERE d.fileSize >= :minSize AND d.fileSize <= :maxSize")
    List<Document> findByFileSizeRange(@Param("minSize") long minSize, @Param("maxSize") long maxSize);

    void deleteByClient(Client client);

    void deleteByUploadedBy(User user);
}