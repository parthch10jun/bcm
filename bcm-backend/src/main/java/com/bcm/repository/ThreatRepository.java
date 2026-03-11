package com.bcm.repository;

import com.bcm.entity.Threat;
import com.bcm.enums.EnablerTypeCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Threat entity
 */
@Repository
public interface ThreatRepository extends JpaRepository<Threat, Long> {

    /**
     * Find all non-deleted threats
     */
    List<Threat> findByIsDeletedFalseOrderByDisplayOrderAsc();

    /**
     * Find threats by threat type
     */
    @Query("SELECT t FROM Threat t WHERE t.threatType.id = :threatTypeId AND t.isDeleted = false ORDER BY t.displayOrder ASC")
    List<Threat> findByThreatTypeId(@Param("threatTypeId") Long threatTypeId);

    /**
     * Find threats by enabler type (via ThreatEnablerType junction table)
     */
    @Query("SELECT DISTINCT t FROM Threat t " +
           "JOIN t.threatEnablerTypes tet " +
           "WHERE tet.enablerType.code = :enablerTypeCode " +
           "AND t.isDeleted = false " +
           "ORDER BY t.displayOrder ASC")
    List<Threat> findByEnablerTypeCode(@Param("enablerTypeCode") EnablerTypeCode enablerTypeCode);

    /**
     * Find threats by risk category (via RiskCategoryThreat junction table)
     */
    @Query("SELECT DISTINCT t FROM Threat t " +
           "JOIN t.riskCategoryThreats rct " +
           "WHERE rct.riskCategory.id = :riskCategoryId " +
           "AND t.isDeleted = false " +
           "ORDER BY t.displayOrder ASC")
    List<Threat> findByRiskCategoryId(@Param("riskCategoryId") Long riskCategoryId);

    /**
     * Find threats applicable for a specific context (combines risk category and enabler types)
     */
    @Query("SELECT DISTINCT t FROM Threat t " +
           "JOIN t.riskCategoryThreats rct " +
           "JOIN t.threatEnablerTypes tet " +
           "WHERE rct.riskCategory.id = :riskCategoryId " +
           "AND tet.enablerType.code IN :enablerTypeCodes " +
           "AND t.isDeleted = false " +
           "ORDER BY t.displayOrder ASC")
    List<Threat> findApplicableThreats(
        @Param("riskCategoryId") Long riskCategoryId,
        @Param("enablerTypeCodes") List<EnablerTypeCode> enablerTypeCodes
    );

    /**
     * Search threats by name
     */
    @Query("SELECT t FROM Threat t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND t.isDeleted = false")
    List<Threat> searchByName(@Param("searchTerm") String searchTerm);

    /**
     * Check if threat exists by name (case-insensitive)
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Threat t WHERE LOWER(t.name) = LOWER(:name) AND t.isDeleted = false")
    boolean existsByNameIgnoreCase(@Param("name") String name);
}

