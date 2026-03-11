package com.bcm.repository;

import com.bcm.entity.ProcessVitalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Process-Vital Record junction table
 */
@Repository
public interface ProcessVitalRecordRepository extends JpaRepository<ProcessVitalRecord, Long> {

    /**
     * Find all vital records for a process
     */
    @Query("SELECT pvr FROM ProcessVitalRecord pvr WHERE pvr.process.id = :processId AND pvr.isDeleted = false")
    List<ProcessVitalRecord> findByProcessId(@Param("processId") Long processId);

    /**
     * Find all processes using a vital record
     */
    @Query("SELECT pvr FROM ProcessVitalRecord pvr WHERE pvr.vitalRecord.id = :vitalRecordId AND pvr.isDeleted = false")
    List<ProcessVitalRecord> findByVitalRecordId(@Param("vitalRecordId") Long vitalRecordId);

    /**
     * Check if a process-vital record link exists
     */
    @Query("SELECT CASE WHEN COUNT(pvr) > 0 THEN true ELSE false END FROM ProcessVitalRecord pvr WHERE pvr.process.id = :processId AND pvr.vitalRecord.id = :vitalRecordId AND pvr.isDeleted = false")
    boolean existsByProcessIdAndVitalRecordId(@Param("processId") Long processId, @Param("vitalRecordId") Long vitalRecordId);
}

