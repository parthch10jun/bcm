package com.bcm.repository;

import com.bcm.entity.BiaDependentVitalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Dependent Vital Records
 */
@Repository
public interface BiaDependentVitalRecordRepository extends JpaRepository<BiaDependentVitalRecord, Long> {

    /**
     * Find all vital record dependencies for a specific BIA
     */
    @Query("SELECT d FROM BiaDependentVitalRecord d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    List<BiaDependentVitalRecord> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all BIAs that depend on a specific vital record
     */
    @Query("SELECT d FROM BiaDependentVitalRecord d WHERE d.vitalRecord.id = :vitalRecordId AND d.isDeleted = false")
    List<BiaDependentVitalRecord> findByVitalRecordId(@Param("vitalRecordId") Long vitalRecordId);

    /**
     * Find required vital record dependencies for a BIA
     */
    @Query("SELECT d FROM BiaDependentVitalRecord d WHERE d.biaRecord.id = :biaId AND d.dependencyType = 'REQUIRED' AND d.isDeleted = false")
    List<BiaDependentVitalRecord> findRequiredByBiaId(@Param("biaId") Long biaId);

    /**
     * Count vital record dependencies for a BIA
     */
    @Query("SELECT COUNT(d) FROM BiaDependentVitalRecord d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);
}

