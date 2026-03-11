package com.bcm.repository;

import com.bcm.entity.BiaTargetProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BiaTargetProcess entity
 * Manages the junction table between BIAs and their target processes
 */
@Repository
public interface BiaTargetProcessRepository extends JpaRepository<BiaTargetProcess, Long> {

    /**
     * Find all target processes for a specific BIA
     */
    List<BiaTargetProcess> findByBiaRecordId(Long biaId);

    /**
     * Find all BIAs that analyze a specific process
     */
    List<BiaTargetProcess> findByProcessId(Long processId);

    /**
     * Find the primary process for a BIA
     */
    Optional<BiaTargetProcess> findByBiaRecordIdAndIsPrimaryTrue(Long biaId);

    /**
     * Check if a process is already a target in a BIA
     */
    boolean existsByBiaRecordIdAndProcessId(Long biaId, Long processId);

    /**
     * Count how many processes are being analyzed by a BIA
     */
    @Query("SELECT COUNT(btp) FROM BiaTargetProcess btp WHERE btp.biaRecord.id = :biaId AND btp.isDeleted = false")
    long countByBiaRecordId(@Param("biaId") Long biaId);

    /**
     * Count how many BIAs analyze a specific process
     */
    @Query("SELECT COUNT(btp) FROM BiaTargetProcess btp WHERE btp.process.id = :processId AND btp.isDeleted = false")
    long countByProcessId(@Param("processId") Long processId);

    /**
     * Delete all target processes for a BIA
     */
    void deleteByBiaRecordId(Long biaId);

    /**
     * Find all target processes for a BIA (excluding soft-deleted)
     */
    @Query("SELECT btp FROM BiaTargetProcess btp WHERE btp.biaRecord.id = :biaId AND btp.isDeleted = false")
    List<BiaTargetProcess> findActiveBiaTargetProcesses(@Param("biaId") Long biaId);
}

