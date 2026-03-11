package com.bcm.repository;

import com.bcm.entity.BiaQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Questions
 */
@Repository
public interface BiaQuestionRepository extends JpaRepository<BiaQuestion, Long> {

    /**
     * Find question by code
     */
    Optional<BiaQuestion> findByQuestionCodeAndIsDeletedFalse(String questionCode);

    /**
     * Find all active questions
     */
    @Query("SELECT q FROM BiaQuestion q WHERE q.isActive = true AND q.isDeleted = false ORDER BY q.displayOrder")
    List<BiaQuestion> findAllActive();

    /**
     * Find questions by category
     */
    @Query("SELECT q FROM BiaQuestion q WHERE q.questionCategory = :category AND q.isActive = true AND q.isDeleted = false ORDER BY q.displayOrder")
    List<BiaQuestion> findByCategory(@Param("category") String category);

    /**
     * Find questions by impact timeframe
     */
    @Query("SELECT q FROM BiaQuestion q WHERE q.impactTimeframe = :timeframe AND q.isActive = true AND q.isDeleted = false ORDER BY q.displayOrder")
    List<BiaQuestion> findByImpactTimeframe(@Param("timeframe") String timeframe);

    /**
     * Find all questions ordered by display order
     */
    @Query("SELECT q FROM BiaQuestion q WHERE q.isDeleted = false ORDER BY q.displayOrder")
    List<BiaQuestion> findAllOrdered();

    /**
     * Find all non-deleted questions
     */
    @Query("SELECT q FROM BiaQuestion q WHERE q.isDeleted = false")
    List<BiaQuestion> findAllNotDeleted();
}

