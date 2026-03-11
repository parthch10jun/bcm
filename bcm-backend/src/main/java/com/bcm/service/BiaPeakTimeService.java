package com.bcm.service;

import com.bcm.entity.BiaRecord;
import com.bcm.entity.BiaPeakTime;
import com.bcm.repository.BiaRecordRepository;
import com.bcm.repository.BiaPeakTimeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing BIA Peak Times
 * 
 * Handles CRUD operations for peak times and critical deadlines,
 * and calculates the most aggressive RTO for system suggestions.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BiaPeakTimeService {

    private final BiaPeakTimeRepository peakTimeRepository;
    private final BiaRecordRepository biaRecordRepository;

    /**
     * Create a new peak time for a BIA record
     * 
     * @param biaId the BIA record ID
     * @param peakTime the peak time to create
     * @return the created peak time
     */
    public BiaPeakTime createPeakTime(Long biaId, BiaPeakTime peakTime) {
        log.info("Creating peak time for BIA ID: {}", biaId);

        // Verify BIA exists
        BiaRecord biaRecord = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA record not found with ID: " + biaId));

        // Set the BIA record
        peakTime.setBiaRecord(biaRecord);

        // Set defaults
        if (peakTime.getIsActive() == null) {
            peakTime.setIsActive(true);
        }
        if (peakTime.getIsCriticalDeadline() == null) {
            peakTime.setIsCriticalDeadline(false);
        }
        if (peakTime.getPriority() == null) {
            peakTime.setPriority(1);
        }

        // Save peak time
        BiaPeakTime savedPeakTime = peakTimeRepository.save(peakTime);

        // Update BIA record with most aggressive peak RTO
        updateBiaRecordWithPeakRto(biaId);

        log.info("Created peak time with ID: {} for BIA ID: {}", savedPeakTime.getId(), biaId);
        return savedPeakTime;
    }

    /**
     * Update an existing peak time
     * 
     * @param biaId the BIA record ID
     * @param peakTimeId the peak time ID
     * @param updatedPeakTime the updated peak time data
     * @return the updated peak time
     */
    public BiaPeakTime updatePeakTime(Long biaId, Long peakTimeId, BiaPeakTime updatedPeakTime) {
        log.info("Updating peak time ID: {} for BIA ID: {}", peakTimeId, biaId);

        // Find existing peak time
        BiaPeakTime existingPeakTime = peakTimeRepository.findByIdAndBiaId(peakTimeId, biaId)
                .orElseThrow(() -> new RuntimeException("Peak time not found with ID: " + peakTimeId + " for BIA ID: " + biaId));

        // Update fields
        existingPeakTime.setPeakTimeName(updatedPeakTime.getPeakTimeName());
        existingPeakTime.setDescription(updatedPeakTime.getDescription());
        existingPeakTime.setPeakRtoHours(updatedPeakTime.getPeakRtoHours());
        existingPeakTime.setPeakRpoHours(updatedPeakTime.getPeakRpoHours());
        existingPeakTime.setRecurrenceType(updatedPeakTime.getRecurrenceType());
        existingPeakTime.setRecurrenceDetails(updatedPeakTime.getRecurrenceDetails());
        existingPeakTime.setStartDate(updatedPeakTime.getStartDate());
        existingPeakTime.setEndDate(updatedPeakTime.getEndDate());
        existingPeakTime.setStartTime(updatedPeakTime.getStartTime());
        existingPeakTime.setEndTime(updatedPeakTime.getEndTime());
        existingPeakTime.setIsCriticalDeadline(updatedPeakTime.getIsCriticalDeadline());
        existingPeakTime.setDeadlineType(updatedPeakTime.getDeadlineType());
        existingPeakTime.setBusinessJustification(updatedPeakTime.getBusinessJustification());
        existingPeakTime.setImpactIfMissed(updatedPeakTime.getImpactIfMissed());
        existingPeakTime.setPriority(updatedPeakTime.getPriority());
        existingPeakTime.setIsActive(updatedPeakTime.getIsActive());

        // Save updated peak time
        BiaPeakTime savedPeakTime = peakTimeRepository.save(existingPeakTime);

        // Update BIA record with most aggressive peak RTO
        updateBiaRecordWithPeakRto(biaId);

        log.info("Updated peak time ID: {} for BIA ID: {}", peakTimeId, biaId);
        return savedPeakTime;
    }

    /**
     * Delete a peak time (soft delete)
     * 
     * @param biaId the BIA record ID
     * @param peakTimeId the peak time ID
     */
    public void deletePeakTime(Long biaId, Long peakTimeId) {
        log.info("Deleting peak time ID: {} for BIA ID: {}", peakTimeId, biaId);

        // Find existing peak time
        BiaPeakTime peakTime = peakTimeRepository.findByIdAndBiaId(peakTimeId, biaId)
                .orElseThrow(() -> new RuntimeException("Peak time not found with ID: " + peakTimeId + " for BIA ID: " + biaId));

        // Soft delete
        peakTime.setIsDeleted(true);
        peakTimeRepository.save(peakTime);

        // Update BIA record with most aggressive peak RTO
        updateBiaRecordWithPeakRto(biaId);

        log.info("Deleted peak time ID: {} for BIA ID: {}", peakTimeId, biaId);
    }

    /**
     * Get all peak times for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of peak times
     */
    @Transactional(readOnly = true)
    public List<BiaPeakTime> getPeakTimesByBiaId(Long biaId) {
        log.debug("Fetching peak times for BIA ID: {}", biaId);
        return peakTimeRepository.findByBiaId(biaId);
    }

    /**
     * Get all active peak times for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of active peak times
     */
    @Transactional(readOnly = true)
    public List<BiaPeakTime> getActivePeakTimesByBiaId(Long biaId) {
        log.debug("Fetching active peak times for BIA ID: {}", biaId);
        return peakTimeRepository.findActivePeakTimesByBiaId(biaId);
    }

    /**
     * Get a specific peak time by ID
     * 
     * @param biaId the BIA record ID
     * @param peakTimeId the peak time ID
     * @return the peak time
     */
    @Transactional(readOnly = true)
    public BiaPeakTime getPeakTimeById(Long biaId, Long peakTimeId) {
        log.debug("Fetching peak time ID: {} for BIA ID: {}", peakTimeId, biaId);
        return peakTimeRepository.findByIdAndBiaId(peakTimeId, biaId)
                .orElseThrow(() -> new RuntimeException("Peak time not found with ID: " + peakTimeId + " for BIA ID: " + biaId));
    }

    /**
     * Get the most aggressive (lowest) peak RTO for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return the minimum peak RTO hours, or null if no peak times exist
     */
    @Transactional(readOnly = true)
    public Integer getMostAggressivePeakRto(Long biaId) {
        log.debug("Calculating most aggressive peak RTO for BIA ID: {}", biaId);
        Optional<Integer> minRto = peakTimeRepository.findMostAggressivePeakRto(biaId);
        return minRto.orElse(null);
    }

    /**
     * Get all critical deadlines for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return list of critical deadlines
     */
    @Transactional(readOnly = true)
    public List<BiaPeakTime> getCriticalDeadlinesByBiaId(Long biaId) {
        log.debug("Fetching critical deadlines for BIA ID: {}", biaId);
        return peakTimeRepository.findCriticalDeadlinesByBiaId(biaId);
    }

    /**
     * Update BIA record with the most aggressive peak RTO
     * This is called automatically when peak times are created, updated, or deleted
     * 
     * @param biaId the BIA record ID
     */
    private void updateBiaRecordWithPeakRto(Long biaId) {
        log.debug("Updating BIA record with most aggressive peak RTO for BIA ID: {}", biaId);

        // Get BIA record
        BiaRecord biaRecord = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA record not found with ID: " + biaId));

        // Get most aggressive peak RTO
        Integer mostAggressivePeakRto = getMostAggressivePeakRto(biaId);

        // Update BIA record
        biaRecord.setMostAggressivePeakRtoHours(mostAggressivePeakRto);

        // Calculate system suggested RTO
        Integer baselineMtpd = biaRecord.getBaselineMtpdHours();
        Integer systemSuggestedRto = null;

        if (baselineMtpd != null && mostAggressivePeakRto != null) {
            systemSuggestedRto = Math.min(baselineMtpd, mostAggressivePeakRto);
        } else if (baselineMtpd != null) {
            systemSuggestedRto = baselineMtpd;
        } else if (mostAggressivePeakRto != null) {
            systemSuggestedRto = mostAggressivePeakRto;
        }

        biaRecord.setSystemSuggestedRtoHours(systemSuggestedRto);

        // Check if current RTO is an override
        Integer finalRto = biaRecord.getFinalRtoHours();
        if (finalRto != null && systemSuggestedRto != null && finalRto > systemSuggestedRto) {
            biaRecord.setIsRtoOverride(true);
        } else {
            biaRecord.setIsRtoOverride(false);
            biaRecord.setRtoOverrideJustification(null);
        }

        // Save BIA record
        biaRecordRepository.save(biaRecord);

        log.debug("Updated BIA record with most aggressive peak RTO: {} hours, system suggested RTO: {} hours", 
                  mostAggressivePeakRto, systemSuggestedRto);
    }

    /**
     * Count active peak times for a BIA record
     * 
     * @param biaId the BIA record ID
     * @return count of active peak times
     */
    @Transactional(readOnly = true)
    public Long countActivePeakTimes(Long biaId) {
        return peakTimeRepository.countActivePeakTimesByBiaId(biaId);
    }
}

