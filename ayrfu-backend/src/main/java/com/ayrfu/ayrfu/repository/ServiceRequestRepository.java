package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Client;
import com.ayrfu.ayrfu.entity.ServiceRequest;
import com.ayrfu.ayrfu.enumeration.ServiceRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByClient(Client client);
    Page<ServiceRequest> findByClient(Client client, Pageable pageable);
    List<ServiceRequest> findByStatus(ServiceRequestStatus status);
    Page<ServiceRequest> findByStatus(ServiceRequestStatus status, Pageable pageable);
}