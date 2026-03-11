package com.bcm.repository;

import com.bcm.entity.RiskTreatmentPlan;
import com.bcm.enums.TreatmentPlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RiskTreatmentPlan entity
 */
@Repository
public interface RiskTreatmentPlanRepository extends JpaRepository<RiskTreatmentPlan, Long> {

    /**
     * Find all treatment plans for a specific threat assessment
     */
    List<RiskTreatmentPlan> findByThreatAssessmentIdAndIsDeletedFalse(Long threatAssessmentId);

    /**
     * Find all treatment plans for a risk assessment
     */
    @Query("SELECT tp FROM RiskTreatmentPlan tp " +
           "WHERE tp.threatAssessment.riskAssessment.id = :riskAssessmentId " +
           "AND tp.isDeleted = false")
    List<RiskTreatmentPlan> findByRiskAssessmentId(@Param("riskAssessmentId") Long riskAssessmentId);

    /**
     * Find treatment plans by status
     */
    List<RiskTreatmentPlan> findByStatusAndIsDeletedFalse(TreatmentPlanStatus status);

    /**
     * Find treatment plans by owner
     */
    List<RiskTreatmentPlan> findByActionOwnerAndIsDeletedFalse(String actionOwner);

    /**
     * Count treatment plans for a risk assessment
     */
    @Query("SELECT COUNT(tp) FROM RiskTreatmentPlan tp " +
           "WHERE tp.threatAssessment.riskAssessment.id = :riskAssessmentId " +
           "AND tp.isDeleted = false")
    long countByRiskAssessmentId(@Param("riskAssessmentId") Long riskAssessmentId);

    /**
     * Count treatment plans by status for a risk assessment
     */
    @Query("SELECT COUNT(tp) FROM RiskTreatmentPlan tp " +
           "WHERE tp.threatAssessment.riskAssessment.id = :riskAssessmentId " +
           "AND tp.status = :status " +
           "AND tp.isDeleted = false")
    long countByRiskAssessmentIdAndStatus(
        @Param("riskAssessmentId") Long riskAssessmentId,
        @Param("status") TreatmentPlanStatus status
    );
}

