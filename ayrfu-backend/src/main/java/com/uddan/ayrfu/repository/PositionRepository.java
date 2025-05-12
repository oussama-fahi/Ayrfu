package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Position;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    Page<Position> findByActiveTrue(Pageable pageable);
    List<Position> findByActiveTrue();

    @Query("SELECT p FROM Position p WHERE " +
            "(:technology IS NULL OR p.technology = :technology) AND " +
            "(:location IS NULL OR p.location = :location) AND " +
            "(:experienceLevel IS NULL OR p.experienceLevel = :experienceLevel) AND " +
            "(:workModel IS NULL OR p.workModel = :workModel)")
    List<Position> findPositionsMatchingCriteria(
            @Param("technology") String technology,
            @Param("location") String location,
            @Param("experienceLevel") String experienceLevel,
            @Param("workModel") String workModel);
}