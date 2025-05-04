package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    //List<Candidate> findByAppliedPosition(Position position);
    Optional<Candidate> findByEmail(String email);
    boolean existsByEmail(String email);
}

