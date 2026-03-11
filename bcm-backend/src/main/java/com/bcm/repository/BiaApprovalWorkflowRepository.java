package com.bcm.repository;

import com.bcm.entity.BiaApprovalWorkflow;
import com.bcm.entity.BiaApprovalWorkflow.ApprovalStatus;
import com.bcm.entity.BiaApprovalWorkflow.StageName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Approval Workflow (Sequential approval chain)
 */
@Repository
public interface BiaApprovalWorkflowRepository extends JpaRepository<BiaApprovalWorkflow, Long> {

    /**
     * Find all active approval workflows
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.isDeleted = false ORDER BY w.bia.id, w.stageNumber")
    List<BiaApprovalWorkflow> findAllActive();

    /**
     * Find approval workflow stages by BIA ID
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.bia.id = :biaId AND w.isDeleted = false ORDER BY w.stageNumber")
    List<BiaApprovalWorkflow> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find specific stage for a BIA
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.bia.id = :biaId AND w.stageNumber = :stageNumber AND w.isDeleted = false")
    Optional<BiaApprovalWorkflow> findByBiaIdAndStageNumber(@Param("biaId") Long biaId, @Param("stageNumber") Integer stageNumber);

    /**
     * Find current pending stage for a BIA
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.bia.id = :biaId AND w.status = 'PENDING' AND w.isDeleted = false ORDER BY w.stageNumber")
    Optional<BiaApprovalWorkflow> findCurrentPendingStage(@Param("biaId") Long biaId);

    /**
     * Find approval workflows by approver ID
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.approver.id = :approverId AND w.isDeleted = false ORDER BY w.notifiedAt DESC")
    List<BiaApprovalWorkflow> findByApproverId(@Param("approverId") Long approverId);

    /**
     * Find pending approvals for a user
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.approver.id = :approverId AND w.status = 'PENDING' AND w.isDeleted = false ORDER BY w.notifiedAt DESC")
    List<BiaApprovalWorkflow> findPendingApprovalsByApproverId(@Param("approverId") Long approverId);

    /**
     * Find approval workflows by stage name
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.stageName = :stageName AND w.isDeleted = false ORDER BY w.notifiedAt DESC")
    List<BiaApprovalWorkflow> findByStageName(@Param("stageName") StageName stageName);

    /**
     * Find approval workflows by status
     */
    @Query("SELECT w FROM BiaApprovalWorkflow w WHERE w.status = :status AND w.isDeleted = false ORDER BY w.notifiedAt DESC")
    List<BiaApprovalWorkflow> findByStatus(@Param("status") ApprovalStatus status);

    /**
     * Check if all stages are approved for a BIA
     */
    @Query("SELECT CASE WHEN COUNT(w) = 0 THEN true ELSE false END FROM BiaApprovalWorkflow w WHERE w.bia.id = :biaId AND w.status != 'APPROVED' AND w.isDeleted = false")
    Boolean areAllStagesApproved(@Param("biaId") Long biaId);

    /**
     * Count pending approvals for a user
     */
    @Query("SELECT COUNT(w) FROM BiaApprovalWorkflow w WHERE w.approver.id = :approverId AND w.status = 'PENDING' AND w.isDeleted = false")
    Long countPendingApprovalsByApproverId(@Param("approverId") Long approverId);

    /**
     * Find next stage number for a BIA
     */
    @Query("SELECT MAX(w.stageNumber) FROM BiaApprovalWorkflow w WHERE w.bia.id = :biaId AND w.isDeleted = false")
    Optional<Integer> findMaxStageNumberByBiaId(@Param("biaId") Long biaId);
}

