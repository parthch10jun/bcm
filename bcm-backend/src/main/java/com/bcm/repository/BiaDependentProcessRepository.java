package com.bcm.repository;

import com.bcm.entity.BiaDependentProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Dependent Processes
 */
@Repository
public interface BiaDependentProcessRepository extends JpaRepository<BiaDependentProcess, Long> {

    /**
     * Find all process dependencies for a specific BIA
     */
    @Query("SELECT d FROM BiaDependentProcess d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    List<BiaDependentProcess> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all BIAs that depend on a specific process
     */
    @Query("SELECT d FROM BiaDependentProcess d WHERE d.process.id = :processId AND d.isDeleted = false")
    List<BiaDependentProcess> findByProcessId(@Param("processId") Long processId);

    /**
     * Find required process dependencies for a BIA
     */
    @Query("SELECT d FROM BiaDependentProcess d WHERE d.biaRecord.id = :biaId AND d.dependencyType = 'REQUIRED' AND d.isDeleted = false")
    List<BiaDependentProcess> findRequiredByBiaId(@Param("biaId") Long biaId);

    /**
     * Count process dependencies for a BIA
     */
    @Query("SELECT COUNT(d) FROM BiaDependentProcess d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);
}

