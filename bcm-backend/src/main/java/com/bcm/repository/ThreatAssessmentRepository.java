package com.bcm.repository;

import com.bcm.entity.ThreatAssessment;
import com.bcm.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ThreatAssessment entity
 */
@Repository
public interface ThreatAssessmentRepository extends JpaRepository<ThreatAssessment, Long> {

    /**
     * Find all threat assessments for a specific risk assessment
     */
    @Query("SELECT ta FROM ThreatAssessment ta WHERE ta.riskAssessment.id = :riskAssessmentId AND ta.isDeleted = false")
    List<ThreatAssessment> findByRiskAssessmentId(@Param("riskAssessmentId") Long riskAssessmentId);

    /**
     * Find threat assessments by risk level
     */
    @Query("SELECT ta FROM ThreatAssessment ta WHERE ta.riskLevel = :riskLevel AND ta.isDeleted = false")
    List<ThreatAssessment> findByRiskLevel(@Param("riskLevel") RiskLevel riskLevel);

    /**
     * Find high-risk threat assessments for a specific risk assessment
     */
    @Query("SELECT ta FROM ThreatAssessment ta WHERE ta.riskAssessment.id = :riskAssessmentId AND ta.riskLevel = 'HIGH' AND ta.isDeleted = false")
    List<ThreatAssessment> findHighRiskByRiskAssessmentId(@Param("riskAssessmentId") Long riskAssessmentId);

    /**
     * Count threat assessments by risk level for a specific risk assessment
     */
    @Query("SELECT COUNT(ta) FROM ThreatAssessment ta WHERE ta.riskAssessment.id = :riskAssessmentId AND ta.riskLevel = :riskLevel AND ta.isDeleted = false")
    long countByRiskAssessmentIdAndRiskLevel(@Param("riskAssessmentId") Long riskAssessmentId, @Param("riskLevel") RiskLevel riskLevel);

    /**
     * Find all threat assessments for a specific threat across all RAs
     */
    @Query("SELECT ta FROM ThreatAssessment ta WHERE ta.threat.id = :threatId AND ta.isDeleted = false")
    List<ThreatAssessment> findByThreatId(@Param("threatId") Long threatId);
}

