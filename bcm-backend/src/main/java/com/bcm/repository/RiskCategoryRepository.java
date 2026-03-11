package com.bcm.repository;

import com.bcm.entity.RiskCategory;
import com.bcm.enums.RiskCategoryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for RiskCategory entity
 */
@Repository
public interface RiskCategoryRepository extends JpaRepository<RiskCategory, Long> {

    /**
     * Find all non-deleted risk categories
     */
    List<RiskCategory> findByIsDeletedFalseOrderByDisplayOrderAsc();

    /**
     * Find all active risk categories
     */
    List<RiskCategory> findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAsc();

    /**
     * Find risk category by code
     */
    Optional<RiskCategory> findByCodeAndIsDeletedFalse(RiskCategoryCode code);

    /**
     * Check if risk category exists by code
     */
    boolean existsByCodeAndIsDeletedFalse(RiskCategoryCode code);

    /**
     * Search risk categories by name
     */
    @Query("SELECT rc FROM RiskCategory rc WHERE LOWER(rc.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND rc.isDeleted = false")
    List<RiskCategory> searchByName(@Param("searchTerm") String searchTerm);
}

