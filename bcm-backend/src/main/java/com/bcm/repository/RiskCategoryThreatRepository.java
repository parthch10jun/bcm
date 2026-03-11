package com.bcm.repository;

import com.bcm.entity.RiskCategoryThreat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RiskCategoryThreat junction table
 */
@Repository
public interface RiskCategoryThreatRepository extends JpaRepository<RiskCategoryThreat, Long> {

    /**
     * Find all threats for a specific risk category
     */
    @Query("SELECT rct FROM RiskCategoryThreat rct WHERE rct.riskCategory.id = :riskCategoryId AND rct.isDeleted = false")
    List<RiskCategoryThreat> findByRiskCategoryId(@Param("riskCategoryId") Long riskCategoryId);

    /**
     * Find all risk categories for a specific threat
     */
    @Query("SELECT rct FROM RiskCategoryThreat rct WHERE rct.threat.id = :threatId AND rct.isDeleted = false")
    List<RiskCategoryThreat> findByThreatId(@Param("threatId") Long threatId);

    /**
     * Delete all mappings for a risk category
     */
    void deleteByRiskCategoryId(Long riskCategoryId);

    /**
     * Check if mapping exists
     */
    @Query("SELECT CASE WHEN COUNT(rct) > 0 THEN true ELSE false END FROM RiskCategoryThreat rct " +
           "WHERE rct.riskCategory.id = :riskCategoryId AND rct.threat.id = :threatId AND rct.isDeleted = false")
    boolean existsByRiskCategoryIdAndThreatId(@Param("riskCategoryId") Long riskCategoryId, @Param("threatId") Long threatId);
}

