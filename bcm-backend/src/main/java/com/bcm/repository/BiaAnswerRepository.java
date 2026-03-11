package com.bcm.repository;

import com.bcm.entity.BiaAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Answers
 */
@Repository
public interface BiaAnswerRepository extends JpaRepository<BiaAnswer, Long> {

    /**
     * Find all answers for a specific BIA
     */
    @Query("SELECT a FROM BiaAnswer a WHERE a.biaRecord.id = :biaId AND a.isDeleted = false")
    List<BiaAnswer> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find answer for a specific BIA and question
     */
    @Query("SELECT a FROM BiaAnswer a WHERE a.biaRecord.id = :biaId AND a.question.id = :questionId AND a.isDeleted = false")
    Optional<BiaAnswer> findByBiaIdAndQuestionId(@Param("biaId") Long biaId, @Param("questionId") Long questionId);

    /**
     * Find all answers for a specific question (across all BIAs)
     */
    @Query("SELECT a FROM BiaAnswer a WHERE a.question.id = :questionId AND a.isDeleted = false")
    List<BiaAnswer> findByQuestionId(@Param("questionId") Long questionId);

    /**
     * Find answers with scores for a specific BIA
     */
    @Query("SELECT a FROM BiaAnswer a WHERE a.biaRecord.id = :biaId AND a.answerScore IS NOT NULL AND a.isDeleted = false")
    List<BiaAnswer> findScoredAnswersByBiaId(@Param("biaId") Long biaId);

    /**
     * Calculate total weighted score for a BIA
     */
    @Query("SELECT COALESCE(SUM(a.answerScore * a.question.weight), 0) FROM BiaAnswer a WHERE a.biaRecord.id = :biaId AND a.answerScore IS NOT NULL AND a.isDeleted = false")
    Integer calculateTotalWeightedScore(@Param("biaId") Long biaId);

    /**
     * Delete all answers for a BIA
     */
    @Query("UPDATE BiaAnswer a SET a.isDeleted = true WHERE a.biaRecord.id = :biaId")
    void softDeleteByBiaId(@Param("biaId") Long biaId);
}

