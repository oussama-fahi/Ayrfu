package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.ServiceRequest;
import com.uddan.ayrfu.entity.ServiceRequestMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestMessageRepository extends JpaRepository<ServiceRequestMessage, Long> {

    List<ServiceRequestMessage> findByServiceRequestOrderBySentAtAsc(ServiceRequest serviceRequest);
}