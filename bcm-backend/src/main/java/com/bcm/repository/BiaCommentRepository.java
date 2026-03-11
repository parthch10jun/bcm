package com.bcm.repository;

import com.bcm.entity.BiaComment;
import com.bcm.entity.BiaComment.ChangeRequestStatus;
import com.bcm.entity.BiaComment.CommentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Comments
 */
@Repository
public interface BiaCommentRepository extends JpaRepository<BiaComment, Long> {

    /**
     * Find all active comments
     */
    @Query("SELECT c FROM BiaComment c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findAllActive();

    /**
     * Find comments by BIA ID
     */
    @Query("SELECT c FROM BiaComment c WHERE c.bia.id = :biaId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find comments by BIA ID (chronological order)
     */
    @Query("SELECT c FROM BiaComment c WHERE c.bia.id = :biaId AND c.isDeleted = false ORDER BY c.createdAt ASC")
    List<BiaComment> findByBiaIdChronological(@Param("biaId") Long biaId);

    /**
     * Find comments by creator ID
     */
    @Query("SELECT c FROM BiaComment c WHERE c.creator.id = :creatorId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findByCreatorId(@Param("creatorId") Long creatorId);

    /**
     * Find comments by type
     */
    @Query("SELECT c FROM BiaComment c WHERE c.commentType = :type AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findByType(@Param("type") CommentType type);

    /**
     * Find change requests by status
     */
    @Query("SELECT c FROM BiaComment c WHERE c.isChangeRequest = true AND c.changeRequestStatus = :status AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findChangeRequestsByStatus(@Param("status") ChangeRequestStatus status);

    /**
     * Find pending change requests by BIA ID
     */
    @Query("SELECT c FROM BiaComment c WHERE c.bia.id = :biaId AND c.isChangeRequest = true AND c.changeRequestStatus = 'PENDING' AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findPendingChangeRequestsByBiaId(@Param("biaId") Long biaId);

    /**
     * Find comments by BIA ID and type
     */
    @Query("SELECT c FROM BiaComment c WHERE c.bia.id = :biaId AND c.commentType = :type AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<BiaComment> findByBiaIdAndType(@Param("biaId") Long biaId, @Param("type") CommentType type);

    /**
     * Count comments by BIA ID
     */
    @Query("SELECT COUNT(c) FROM BiaComment c WHERE c.bia.id = :biaId AND c.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);

    /**
     * Count pending change requests by BIA ID
     */
    @Query("SELECT COUNT(c) FROM BiaComment c WHERE c.bia.id = :biaId AND c.isChangeRequest = true AND c.changeRequestStatus = 'PENDING' AND c.isDeleted = false")
    Long countPendingChangeRequestsByBiaId(@Param("biaId") Long biaId);
}

