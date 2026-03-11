package com.bcm.service;

import com.bcm.dto.CreateVitalRecordRequest;
import com.bcm.dto.UpdateVitalRecordRequest;
import com.bcm.dto.VitalRecordDTO;
import com.bcm.entity.VitalRecord;
import com.bcm.enums.VitalRecordStatus;
import com.bcm.repository.VitalRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Vital Records
 */
@Service
@Slf4j
public class VitalRecordService {

    @Autowired
    private VitalRecordRepository vitalRecordRepository;

    /**
     * Get all vital records
     */
    public List<VitalRecordDTO> getAllVitalRecords() {
        log.info("Fetching all vital records");
        return vitalRecordRepository.findAllActive().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vital record by ID
     */
    public VitalRecordDTO getVitalRecordById(Long id) {
        log.info("Fetching vital record with ID: {}", id);
        VitalRecord vitalRecord = vitalRecordRepository.findByIdActive(id)
                .orElseThrow(() -> new IllegalArgumentException("Vital record not found with ID: " + id));
        return convertToDTO(vitalRecord);
    }

    /**
     * Get vital records by status
     */
    public List<VitalRecordDTO> getVitalRecordsByStatus(VitalRecordStatus status) {
        log.info("Fetching vital records with status: {}", status);
        return vitalRecordRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vital records by record type
     */
    public List<VitalRecordDTO> getVitalRecordsByType(String recordType) {
        log.info("Fetching vital records with type: {}", recordType);
        return vitalRecordRepository.findByRecordType(recordType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search vital records by name
     */
    public List<VitalRecordDTO> searchVitalRecords(String searchTerm) {
        log.info("Searching vital records with term: {}", searchTerm);
        return vitalRecordRepository.searchByName(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new vital record
     */
    @Transactional
    public VitalRecordDTO createVitalRecord(CreateVitalRecordRequest request) {
        log.info("Creating new vital record: {}", request.getRecordName());

        // Validate record name uniqueness
        if (vitalRecordRepository.existsByRecordNameIgnoreCaseAndIsDeletedFalse(request.getRecordName())) {
            throw new IllegalArgumentException("Vital record with name '" + request.getRecordName() + "' already exists");
        }

        VitalRecord vitalRecord = VitalRecord.builder()
                .recordName(request.getRecordName())
                .status(request.getStatus() != null ? request.getStatus() : VitalRecordStatus.ACTIVE)
                .recordType(request.getRecordType())
                .location(request.getLocation())
                .description(request.getDescription())
                .recoveryPointObjective(request.getRecoveryPointObjective())
                .owner(request.getOwner())
                .technicalContact(request.getTechnicalContact())
                .backupFrequency(request.getBackupFrequency())
                .storageFormat(request.getStorageFormat())
                .retentionPeriod(request.getRetentionPeriod())
                .notes(request.getNotes())
                .build();

        VitalRecord savedVitalRecord = vitalRecordRepository.save(vitalRecord);
        log.info("Created vital record with ID: {}", savedVitalRecord.getId());
        return convertToDTO(savedVitalRecord);
    }

    /**
     * Update an existing vital record
     */
    @Transactional
    public VitalRecordDTO updateVitalRecord(Long id, UpdateVitalRecordRequest request) {
        log.info("Updating vital record with ID: {}", id);

        VitalRecord vitalRecord = vitalRecordRepository.findByIdActive(id)
                .orElseThrow(() -> new IllegalArgumentException("Vital record not found with ID: " + id));

        // Update fields if provided
        if (request.getRecordName() != null) {
            // Check for duplicate name (excluding current record)
            if (!request.getRecordName().equalsIgnoreCase(vitalRecord.getRecordName()) &&
                vitalRecordRepository.existsByRecordNameIgnoreCaseAndIsDeletedFalse(request.getRecordName())) {
                throw new IllegalArgumentException("Vital record with name '" + request.getRecordName() + "' already exists");
            }
            vitalRecord.setRecordName(request.getRecordName());
        }
        if (request.getStatus() != null) {
            vitalRecord.setStatus(request.getStatus());
        }
        if (request.getRecordType() != null) {
            vitalRecord.setRecordType(request.getRecordType());
        }
        if (request.getLocation() != null) {
            vitalRecord.setLocation(request.getLocation());
        }
        if (request.getDescription() != null) {
            vitalRecord.setDescription(request.getDescription());
        }
        if (request.getRecoveryPointObjective() != null) {
            vitalRecord.setRecoveryPointObjective(request.getRecoveryPointObjective());
        }
        if (request.getOwner() != null) {
            vitalRecord.setOwner(request.getOwner());
        }
        if (request.getTechnicalContact() != null) {
            vitalRecord.setTechnicalContact(request.getTechnicalContact());
        }
        if (request.getBackupFrequency() != null) {
            vitalRecord.setBackupFrequency(request.getBackupFrequency());
        }
        if (request.getStorageFormat() != null) {
            vitalRecord.setStorageFormat(request.getStorageFormat());
        }
        if (request.getRetentionPeriod() != null) {
            vitalRecord.setRetentionPeriod(request.getRetentionPeriod());
        }
        if (request.getNotes() != null) {
            vitalRecord.setNotes(request.getNotes());
        }

        VitalRecord updatedVitalRecord = vitalRecordRepository.save(vitalRecord);
        log.info("Updated vital record with ID: {}", id);
        return convertToDTO(updatedVitalRecord);
    }

    /**
     * Delete a vital record (soft delete)
     */
    @Transactional
    public void deleteVitalRecord(Long id) {
        log.info("Deleting vital record with ID: {}", id);

        VitalRecord vitalRecord = vitalRecordRepository.findByIdActive(id)
                .orElseThrow(() -> new IllegalArgumentException("Vital record not found with ID: " + id));

        vitalRecord.setIsDeleted(true);
        vitalRecordRepository.save(vitalRecord);
        log.info("Deleted vital record with ID: {}", id);
    }

    /**
     * Get statistics
     */
    public VitalRecordStatistics getStatistics() {
        long totalRecords = vitalRecordRepository.findAllActive().size();
        long activeRecords = vitalRecordRepository.countByStatus(VitalRecordStatus.ACTIVE);
        long archivedRecords = vitalRecordRepository.countByStatus(VitalRecordStatus.ARCHIVED);

        return VitalRecordStatistics.builder()
                .totalRecords(totalRecords)
                .activeRecords(activeRecords)
                .archivedRecords(archivedRecords)
                .build();
    }

    /**
     * Convert entity to DTO
     */
    private VitalRecordDTO convertToDTO(VitalRecord vitalRecord) {
        return VitalRecordDTO.builder()
                .id(vitalRecord.getId())
                .recordName(vitalRecord.getRecordName())
                .status(vitalRecord.getStatus())
                .recordType(vitalRecord.getRecordType())
                .location(vitalRecord.getLocation())
                .description(vitalRecord.getDescription())
                .recoveryPointObjective(vitalRecord.getRecoveryPointObjective())
                .owner(vitalRecord.getOwner())
                .technicalContact(vitalRecord.getTechnicalContact())
                .backupFrequency(vitalRecord.getBackupFrequency())
                .storageFormat(vitalRecord.getStorageFormat())
                .retentionPeriod(vitalRecord.getRetentionPeriod())
                .notes(vitalRecord.getNotes())
                .createdAt(vitalRecord.getCreatedAt())
                .createdBy(vitalRecord.getCreatedBy())
                .updatedAt(vitalRecord.getUpdatedAt())
                .updatedBy(vitalRecord.getUpdatedBy())
                .version(vitalRecord.getVersion())
                .build();
    }

    /**
     * Statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class VitalRecordStatistics {
        private long totalRecords;
        private long activeRecords;
        private long archivedRecords;
    }
}

