package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;



@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {


    Optional<Candidate> findByEmail(String email);


    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
    Optional<Candidate> findByUser(User user);
}

