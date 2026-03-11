package com.bcm.repository;

import com.bcm.entity.BiaAssignment;
import com.bcm.entity.BiaAssignment.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Assignments (Delegation tracking)
 */
@Repository
public interface BiaAssignmentRepository extends JpaRepository<BiaAssignment, Long> {

    /**
     * Find all active assignments
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findAllActive();

    /**
     * Find assignments by BIA ID
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.bia.id = :biaId AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find current active assignment for a BIA
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.bia.id = :biaId AND a.status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS') AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    Optional<BiaAssignment> findActiveAssignmentByBiaId(@Param("biaId") Long biaId);

    /**
     * Find assignments assigned by a user (Champion's assignments)
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.assignedBy.id = :userId AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findByAssignedById(@Param("userId") Long userId);

    /**
     * Find assignments assigned to a user (SME's assignments)
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.assignedTo.id = :userId AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findByAssignedToId(@Param("userId") Long userId);

    /**
     * Find pending assignments for a user
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.assignedTo.id = :userId AND a.status = 'PENDING' AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findPendingAssignmentsByUserId(@Param("userId") Long userId);

    /**
     * Find in-progress assignments for a user
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.assignedTo.id = :userId AND a.status IN ('ACCEPTED', 'IN_PROGRESS') AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findInProgressAssignmentsByUserId(@Param("userId") Long userId);

    /**
     * Find assignments by status
     */
    @Query("SELECT a FROM BiaAssignment a WHERE a.status = :status AND a.isDeleted = false ORDER BY a.assignedAt DESC")
    List<BiaAssignment> findByStatus(@Param("status") AssignmentStatus status);

    /**
     * Count assignments by assigned-to user
     */
    @Query("SELECT COUNT(a) FROM BiaAssignment a WHERE a.assignedTo.id = :userId AND a.isDeleted = false")
    Long countByAssignedToId(@Param("userId") Long userId);

    /**
     * Count pending assignments by assigned-to user
     */
    @Query("SELECT COUNT(a) FROM BiaAssignment a WHERE a.assignedTo.id = :userId AND a.status = 'PENDING' AND a.isDeleted = false")
    Long countPendingByAssignedToId(@Param("userId") Long userId);
}

