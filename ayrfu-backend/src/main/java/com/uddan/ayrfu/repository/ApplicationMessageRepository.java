package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.ApplicationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationMessageRepository extends JpaRepository<ApplicationMessage, Long> {

    List<ApplicationMessage> findByApplicationOrderBySentAtAsc(Application application);
}