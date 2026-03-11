package com.bcm.repository;

import com.bcm.entity.ThreatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ThreatType entity
 */
@Repository
public interface ThreatTypeRepository extends JpaRepository<ThreatType, Long> {

    /**
     * Find all non-deleted threat types
     */
    List<ThreatType> findByIsDeletedFalseOrderByDisplayOrderAsc();

    /**
     * Find threat type by name
     */
    Optional<ThreatType> findByNameAndIsDeletedFalse(String name);

    /**
     * Check if threat type exists by name (case-insensitive)
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM ThreatType t WHERE LOWER(t.name) = LOWER(:name) AND t.isDeleted = false")
    boolean existsByNameIgnoreCase(String name);
}

