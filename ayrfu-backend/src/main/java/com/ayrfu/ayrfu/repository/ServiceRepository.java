package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();

    @Query("SELECT DISTINCT s FROM Service s JOIN s.keywords k WHERE s.active = true AND LOWER(k) IN :keywords")
    List<Service> findByKeywordsContaining(@Param("keywords") Set<String> keywords);

    @Query("SELECT s FROM Service s JOIN s.keywords k WHERE s.active = true AND LOWER(k) IN :keywords GROUP BY s ORDER BY COUNT(k) DESC")
    List<Service> findByKeywordsOrderByRelevance(@Param("keywords") Set<String> keywords);
}
