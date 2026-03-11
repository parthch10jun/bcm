package com.bcm.service;

import com.bcm.entity.ThreatType;
import com.bcm.repository.ThreatTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for ThreatType management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatTypeService {

    private final ThreatTypeRepository threatTypeRepository;

    /**
     * Get all threat types
     */
    @Transactional(readOnly = true)
    public List<ThreatType> getAllThreatTypes() {
        log.info("Fetching all threat types");
        return threatTypeRepository.findByIsDeletedFalseOrderByDisplayOrderAsc();
    }

    /**
     * Get threat type by ID
     */
    @Transactional(readOnly = true)
    public ThreatType getThreatTypeById(Long id) {
        log.info("Fetching threat type with ID: {}", id);
        ThreatType threatType = threatTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat type not found with id: " + id));
        
        if (threatType.getIsDeleted()) {
            throw new RuntimeException("Threat type has been deleted");
        }
        
        return threatType;
    }

    /**
     * Create a new threat type
     */
    @Transactional
    public ThreatType createThreatType(ThreatType threatType) {
        log.info("Creating new threat type: {}", threatType.getName());
        
        // Check for duplicate name
        if (threatTypeRepository.existsByNameIgnoreCase(threatType.getName())) {
            throw new RuntimeException("Threat type with name '" + threatType.getName() + "' already exists");
        }
        
        ThreatType saved = threatTypeRepository.save(threatType);
        log.info("Threat type created successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update an existing threat type
     */
    @Transactional
    public ThreatType updateThreatType(Long id, ThreatType threatTypeDetails) {
        log.info("Updating threat type with ID: {}", id);
        
        ThreatType threatType = getThreatTypeById(id);
        
        // Check for duplicate name (excluding current record)
        ThreatType existingWithName = threatTypeRepository.findByNameAndIsDeletedFalse(threatTypeDetails.getName())
                .orElse(null);
        if (existingWithName != null && !existingWithName.getId().equals(id)) {
            throw new RuntimeException("Threat type with name '" + threatTypeDetails.getName() + "' already exists");
        }
        
        threatType.setName(threatTypeDetails.getName());
        threatType.setDescription(threatTypeDetails.getDescription());
        threatType.setDisplayOrder(threatTypeDetails.getDisplayOrder());
        
        ThreatType updated = threatTypeRepository.save(threatType);
        log.info("Threat type updated successfully");
        return updated;
    }

    /**
     * Delete a threat type (soft delete)
     */
    @Transactional
    public void deleteThreatType(Long id) {
        log.info("Deleting threat type with ID: {}", id);
        
        ThreatType threatType = getThreatTypeById(id);
        
        // Check if there are any threats using this type
        if (!threatType.getThreats().isEmpty()) {
            throw new RuntimeException("Cannot delete threat type that has associated threats");
        }
        
        threatType.setIsDeleted(true);
        threatTypeRepository.save(threatType);
        log.info("Threat type deleted successfully");
    }
}

