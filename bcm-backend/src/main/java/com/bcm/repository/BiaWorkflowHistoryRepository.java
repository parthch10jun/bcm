package com.bcm.repository;

import com.bcm.entity.BiaWorkflowHistory;
import com.bcm.entity.BiaWorkflowHistory.WorkflowAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for BIA Workflow History (Audit trail)
 */
@Repository
public interface BiaWorkflowHistoryRepository extends JpaRepository<BiaWorkflowHistory, Long> {

    /**
     * Find all active workflow history records
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findAllActive();

    /**
     * Find workflow history by BIA ID
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.bia.id = :biaId AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find workflow history by BIA ID (chronological order)
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.bia.id = :biaId AND h.isDeleted = false ORDER BY h.performedAt ASC")
    List<BiaWorkflowHistory> findByBiaIdChronological(@Param("biaId") Long biaId);

    /**
     * Find workflow history by action
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.action = :action AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findByAction(@Param("action") WorkflowAction action);

    /**
     * Find workflow history by user (performed by)
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.performedBy.id = :userId AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findByActionById(@Param("userId") Long userId);

    /**
     * Find workflow history by date range
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.performedAt BETWEEN :startDate AND :endDate AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find recent workflow history (last N days)
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.performedAt >= :since AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findRecentHistory(@Param("since") LocalDateTime since);

    /**
     * Find workflow history by BIA and action
     */
    @Query("SELECT h FROM BiaWorkflowHistory h WHERE h.bia.id = :biaId AND h.action = :action AND h.isDeleted = false ORDER BY h.performedAt DESC")
    List<BiaWorkflowHistory> findByBiaIdAndAction(@Param("biaId") Long biaId, @Param("action") WorkflowAction action);

    /**
     * Count workflow actions by BIA
     */
    @Query("SELECT COUNT(h) FROM BiaWorkflowHistory h WHERE h.bia.id = :biaId AND h.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);

    /**
     * Count workflow actions by user
     */
    @Query("SELECT COUNT(h) FROM BiaWorkflowHistory h WHERE h.performedBy.id = :userId AND h.isDeleted = false")
    Long countByActionById(@Param("userId") Long userId);
}

