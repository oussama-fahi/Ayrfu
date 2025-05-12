package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.enumeration.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidate(Candidate candidate);
    List<Application> findByPosition(Position position);
    List<Application> findByStatus(ApplicationStatus status);
    Optional<Application> findByCandidateAndPosition(Candidate candidate, Position position);
    Page<Application> findAll(Pageable pageable);
}
