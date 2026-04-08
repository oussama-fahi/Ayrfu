package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Application;
import com.ayrfu.ayrfu.entity.Candidate;
import com.ayrfu.ayrfu.entity.Position;
import com.ayrfu.ayrfu.enumeration.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByCandidate(Candidate candidate);

    List<Application> findByPositionId(Long positionId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByCandidateAndPosition(Candidate candidate, Position position);

    boolean existsByCandidateIdAndPositionId(Long candidateId, Long positionId);
}
