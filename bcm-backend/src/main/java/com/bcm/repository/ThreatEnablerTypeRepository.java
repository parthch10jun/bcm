package com.bcm.repository;

import com.bcm.entity.ThreatEnablerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ThreatEnablerType junction table
 */
@Repository
public interface ThreatEnablerTypeRepository extends JpaRepository<ThreatEnablerType, Long> {

    /**
     * Find all enabler types for a specific threat
     */
    @Query("SELECT tet FROM ThreatEnablerType tet WHERE tet.threat.id = :threatId AND tet.isDeleted = false")
    List<ThreatEnablerType> findByThreatId(@Param("threatId") Long threatId);

    /**
     * Find all threats for a specific enabler type
     */
    @Query("SELECT tet FROM ThreatEnablerType tet WHERE tet.enablerType.id = :enablerTypeId AND tet.isDeleted = false")
    List<ThreatEnablerType> findByEnablerTypeId(@Param("enablerTypeId") Long enablerTypeId);

    /**
     * Delete all mappings for a threat
     */
    void deleteByThreatId(Long threatId);

    /**
     * Check if mapping exists
     */
    @Query("SELECT CASE WHEN COUNT(tet) > 0 THEN true ELSE false END FROM ThreatEnablerType tet " +
           "WHERE tet.threat.id = :threatId AND tet.enablerType.id = :enablerTypeId AND tet.isDeleted = false")
    boolean existsByThreatIdAndEnablerTypeId(@Param("threatId") Long threatId, @Param("enablerTypeId") Long enablerTypeId);
}

