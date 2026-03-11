package com.bcm.repository;

import com.bcm.entity.RiskAssessment;
import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RiskAssessment entity
 */
@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {

    /**
     * Find all non-deleted risk assessments
     */
    List<RiskAssessment> findByIsDeletedFalseOrderByCreatedAtDesc();

    /**
     * Find risk assessments by status
     */
    List<RiskAssessment> findByStatusAndIsDeletedFalseOrderByCreatedAtDesc(RiskAssessmentStatus status);

    /**
     * Find risk assessments by risk category
     */
    @Query("SELECT ra FROM RiskAssessment ra WHERE ra.riskCategory.id = :riskCategoryId AND ra.isDeleted = false ORDER BY ra.createdAt DESC")
    List<RiskAssessment> findByRiskCategoryId(@Param("riskCategoryId") Long riskCategoryId);

    /**
     * Find risk assessments by context type
     */
    List<RiskAssessment> findByContextTypeAndIsDeletedFalseOrderByCreatedAtDesc(RiskCategoryCode contextType);

    /**
     * Find risk assessments for a specific context object
     */
    @Query("SELECT ra FROM RiskAssessment ra WHERE ra.contextType = :contextType AND ra.contextId = :contextId AND ra.isDeleted = false ORDER BY ra.createdAt DESC")
    List<RiskAssessment> findByContext(@Param("contextType") RiskCategoryCode contextType, @Param("contextId") Long contextId);

    /**
     * Find latest risk assessment for a specific context object
     */
    @Query("SELECT ra FROM RiskAssessment ra WHERE ra.contextType = :contextType AND ra.contextId = :contextId AND ra.isDeleted = false ORDER BY ra.assessmentDate DESC LIMIT 1")
    RiskAssessment findLatestByContext(@Param("contextType") RiskCategoryCode contextType, @Param("contextId") Long contextId);

    /**
     * Search risk assessments by name
     */
    @Query("SELECT ra FROM RiskAssessment ra WHERE LOWER(ra.assessmentName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND ra.isDeleted = false")
    List<RiskAssessment> searchByName(@Param("searchTerm") String searchTerm);

    /**
     * Count risk assessments by status
     */
    @Query("SELECT COUNT(ra) FROM RiskAssessment ra WHERE ra.status = :status AND ra.isDeleted = false")
    long countByStatus(@Param("status") RiskAssessmentStatus status);

    /**
     * Count total risk assessments
     */
    @Query("SELECT COUNT(ra) FROM RiskAssessment ra WHERE ra.isDeleted = false")
    long countTotal();
}

