package com.bcm.repository;

import com.bcm.entity.BiaDependentPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Dependent People
 */
@Repository
public interface BiaDependentPersonRepository extends JpaRepository<BiaDependentPerson, Long> {

    /**
     * Find all people dependencies for a specific BIA
     */
    @Query("SELECT d FROM BiaDependentPerson d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    List<BiaDependentPerson> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all BIAs that depend on a specific person
     */
    @Query("SELECT d FROM BiaDependentPerson d WHERE d.user.id = :userId AND d.isDeleted = false")
    List<BiaDependentPerson> findByUserId(@Param("userId") Long userId);

    /**
     * Find critical people for a BIA
     */
    @Query("SELECT d FROM BiaDependentPerson d WHERE d.biaRecord.id = :biaId AND d.isCritical = true AND d.isDeleted = false")
    List<BiaDependentPerson> findCriticalByBiaId(@Param("biaId") Long biaId);

    /**
     * Count people dependencies for a BIA
     */
    @Query("SELECT COUNT(d) FROM BiaDependentPerson d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);
}

