package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByClientOrderByCreatedAtDesc(Client client);

    List<ServiceRequest> findByStatusOrderByCreatedAtDesc(String status);
}