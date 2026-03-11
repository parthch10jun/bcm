package com.bcm.repository;

import com.bcm.entity.BiaPeakTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for BIA Peak Times
 * 
 * Provides data access methods for managing peak times and critical deadlines
 * associated with BIA records.
 */
@Repository
public interface BiaPeakTimeRepository extends JpaRepository<BiaPeakTime, Long> {

    /**
     * Find all peak times for a specific BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of peak times
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.isDeleted = false ORDER BY pt.priority ASC, pt.peakRtoHours ASC")
    List<BiaPeakTime> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all active peak times for a specific BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of active peak times
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.isActive = true AND pt.isDeleted = false ORDER BY pt.priority ASC, pt.peakRtoHours ASC")
    List<BiaPeakTime> findActivePeakTimesByBiaId(@Param("biaId") Long biaId);

    /**
     * Find the most aggressive (lowest) peak RTO for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return the minimum peak RTO hours, or null if no peak times exist
     */
    @Query("SELECT MIN(pt.peakRtoHours) FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.isActive = true AND pt.isDeleted = false")
    Optional<Integer> findMostAggressivePeakRto(@Param("biaId") Long biaId);

    /**
     * Find all critical deadlines for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of critical deadlines
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.isCriticalDeadline = true AND pt.isDeleted = false ORDER BY pt.priority ASC")
    List<BiaPeakTime> findCriticalDeadlinesByBiaId(@Param("biaId") Long biaId);

    /**
     * Find peak times by deadline type
     * 
     * @param biaId the BIA record ID
     * @param deadlineType the deadline type
     * @return list of peak times matching the deadline type
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.deadlineType = :deadlineType AND pt.isDeleted = false")
    List<BiaPeakTime> findByBiaIdAndDeadlineType(@Param("biaId") Long biaId, @Param("deadlineType") BiaPeakTime.DeadlineType deadlineType);

    /**
     * Find peak times by recurrence type
     * 
     * @param biaId the BIA record ID
     * @param recurrenceType the recurrence type
     * @return list of peak times matching the recurrence type
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.recurrenceType = :recurrenceType AND pt.isDeleted = false")
    List<BiaPeakTime> findByBiaIdAndRecurrenceType(@Param("biaId") Long biaId, @Param("recurrenceType") BiaPeakTime.RecurrenceType recurrenceType);

    /**
     * Count active peak times for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return count of active peak times
     */
    @Query("SELECT COUNT(pt) FROM BiaPeakTime pt WHERE pt.biaRecord.id = :biaId AND pt.isActive = true AND pt.isDeleted = false")
    Long countActivePeakTimesByBiaId(@Param("biaId") Long biaId);

    /**
     * Delete all peak times for a BIA record (soft delete)
     * 
     * @param biaId the BIA record ID
     */
    @Query("UPDATE BiaPeakTime pt SET pt.isDeleted = true WHERE pt.biaRecord.id = :biaId")
    void softDeleteByBiaId(@Param("biaId") Long biaId);

    /**
     * Find a specific peak time by ID and BIA ID
     * 
     * @param id the peak time ID
     * @param biaId the BIA record ID
     * @return optional peak time
     */
    @Query("SELECT pt FROM BiaPeakTime pt WHERE pt.id = :id AND pt.biaRecord.id = :biaId AND pt.isDeleted = false")
    Optional<BiaPeakTime> findByIdAndBiaId(@Param("id") Long id, @Param("biaId") Long biaId);
}

