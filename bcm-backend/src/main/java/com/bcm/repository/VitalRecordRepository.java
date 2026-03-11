package com.bcm.repository;

import com.bcm.entity.VitalRecord;
import com.bcm.enums.VitalRecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Vital Record entity
 */
@Repository
public interface VitalRecordRepository extends JpaRepository<VitalRecord, Long> {

    /**
     * Find all non-deleted vital records
     */
    @Query("SELECT vr FROM VitalRecord vr WHERE vr.isDeleted = false")
    List<VitalRecord> findAllActive();

    /**
     * Find vital record by ID (non-deleted only)
     */
    @Query("SELECT vr FROM VitalRecord vr WHERE vr.id = :id AND vr.isDeleted = false")
    Optional<VitalRecord> findByIdActive(@Param("id") Long id);

    /**
     * Find vital records by status
     */
    @Query("SELECT vr FROM VitalRecord vr WHERE vr.status = :status AND vr.isDeleted = false")
    List<VitalRecord> findByStatus(@Param("status") VitalRecordStatus status);

    /**
     * Find vital records by record type
     */
    @Query("SELECT vr FROM VitalRecord vr WHERE vr.recordType = :recordType AND vr.isDeleted = false")
    List<VitalRecord> findByRecordType(@Param("recordType") String recordType);

    /**
     * Search vital records by name (case-insensitive)
     */
    @Query("SELECT vr FROM VitalRecord vr WHERE LOWER(vr.recordName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND vr.isDeleted = false")
    List<VitalRecord> searchByName(@Param("searchTerm") String searchTerm);

    /**
     * Check if vital record name already exists (case-insensitive)
     * Used for duplicate validation during bulk upload
     */
    @Query("SELECT CASE WHEN COUNT(vr) > 0 THEN true ELSE false END FROM VitalRecord vr WHERE LOWER(vr.recordName) = LOWER(:recordName) AND vr.isDeleted = false")
    boolean existsByRecordNameIgnoreCaseAndIsDeletedFalse(@Param("recordName") String recordName);

    /**
     * Count vital records by status
     */
    @Query("SELECT COUNT(vr) FROM VitalRecord vr WHERE vr.status = :status AND vr.isDeleted = false")
    long countByStatus(@Param("status") VitalRecordStatus status);

    /**
     * Count vital records by record type
     */
    @Query("SELECT COUNT(vr) FROM VitalRecord vr WHERE vr.recordType = :recordType AND vr.isDeleted = false")
    long countByRecordType(@Param("recordType") String recordType);
}

