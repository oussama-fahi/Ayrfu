package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {

    List<Position> findByActiveTrue();

    @Query("SELECT p FROM Position p WHERE p.active = true AND " +
            "(:technology IS NULL OR p.technology = :technology) AND " +
            "(:location IS NULL OR p.location = :location) AND " +
            "(:experienceLevel IS NULL OR p.experienceLevel = :experienceLevel) AND " +
            "(:workModel IS NULL OR p.workModel = :workModel)")
    List<Position> findPositionsMatchingCriteria(
            @Param("technology") String technology,
            @Param("location") String location,
            @Param("experienceLevel") String experienceLevel,
            @Param("workModel") String workModel);

    @Query("SELECT p FROM Position p JOIN p.languages l WHERE p.active = true AND l IN :languages GROUP BY p HAVING COUNT(l) = :languageCount")
    List<Position> findPositionsWithAllLanguages(
            @Param("languages") Set<String> languages,
            @Param("languageCount") long languageCount);
}