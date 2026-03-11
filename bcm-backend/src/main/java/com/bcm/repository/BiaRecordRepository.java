package com.bcm.repository;

import com.bcm.entity.BiaRecord;
import com.bcm.enums.BiaStatus;
import com.bcm.enums.BiaTargetType;
import com.bcm.enums.BiaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Records
 */
@Repository
public interface BiaRecordRepository extends JpaRepository<BiaRecord, Long> {

    /**
     * Find all non-deleted BIA records
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.isDeleted = false")
    List<BiaRecord> findAllActive();

    /**
     * Find BIA record by ID (non-deleted only)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.id = :id AND b.isDeleted = false")
    Optional<BiaRecord> findByIdActive(@Param("id") Long id);

    /**
     * Find BIAs by status
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.status = :status AND b.isDeleted = false")
    List<BiaRecord> findByStatus(@Param("status") BiaStatus status);

    /**
     * Find BIAs by type
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.biaType = :type AND b.isDeleted = false")
    List<BiaRecord> findByBiaType(@Param("type") BiaType type);

    /**
     * Find BIAs by target type (polymorphic)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.biaTargetType = :targetType AND b.isDeleted = false")
    List<BiaRecord> findByTargetType(@Param("targetType") BiaTargetType targetType);

    /**
     * Find BIA by target ID and type (polymorphic)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.biaTargetId = :targetId AND b.biaTargetType = :targetType AND b.isDeleted = false")
    List<BiaRecord> findByTarget(@Param("targetId") Long targetId, @Param("targetType") BiaTargetType targetType);

    /**
     * Find official BIA for a target
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.biaTargetId = :targetId AND b.biaTargetType = :targetType AND b.isOfficial = true AND b.isDeleted = false")
    Optional<BiaRecord> findOfficialByTarget(@Param("targetId") Long targetId, @Param("targetType") BiaTargetType targetType);

    /**
     * Find BIAs by organizational unit (legacy)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.organizationalUnit.id = :unitId AND b.isDeleted = false")
    List<BiaRecord> findByOrganizationalUnitId(@Param("unitId") Long unitId);

    /**
     * Find BIAs by process (legacy)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.process.id = :processId AND b.isDeleted = false")
    List<BiaRecord> findByProcessId(@Param("processId") Long processId);

    /**
     * Find official BIA for a process (legacy)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.process.id = :processId AND b.isOfficial = true AND b.isDeleted = false")
    Optional<BiaRecord> findOfficialByProcessId(@Param("processId") Long processId);

    /**
     * Find official BIA for an organizational unit (legacy)
     */
    @Query("SELECT b FROM BiaRecord b WHERE b.organizationalUnit.id = :unitId AND b.isOfficial = true AND b.isDeleted = false")
    Optional<BiaRecord> findOfficialByOrganizationalUnitId(@Param("unitId") Long unitId);

    /**
     * Find BIAs with gaps (those that have dependencies with capability issues)
     * This is a simplified query - actual gap detection is done in the service layer
     */
    @Query("SELECT DISTINCT b FROM BiaRecord b WHERE b.isDeleted = false AND b.finalRtoHours IS NOT NULL")
    List<BiaRecord> findBiasWithDefinedRto();

    /**
     * Count BIAs by status
     */
    @Query("SELECT COUNT(b) FROM BiaRecord b WHERE b.status = :status AND b.isDeleted = false")
    Long countByStatus(@Param("status") BiaStatus status);

    /**
     * Count BIAs by target type
     */
    @Query("SELECT COUNT(b) FROM BiaRecord b WHERE b.biaTargetType = :targetType AND b.isDeleted = false")
    Long countByTargetType(@Param("targetType") BiaTargetType targetType);
}

