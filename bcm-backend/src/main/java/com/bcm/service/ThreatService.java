package com.bcm.service;

import com.bcm.entity.EnablerType;
import com.bcm.entity.Threat;
import com.bcm.entity.ThreatEnablerType;
import com.bcm.entity.ThreatType;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.repository.ThreatEnablerTypeRepository;
import com.bcm.repository.ThreatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for Threat management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatService {

    private final ThreatRepository threatRepository;
    private final ThreatEnablerTypeRepository threatEnablerTypeRepository;
    private final ThreatTypeService threatTypeService;
    private final EnablerTypeService enablerTypeService;

    /**
     * Get all threats
     */
    @Transactional(readOnly = true)
    public List<Threat> getAllThreats() {
        log.info("Fetching all threats");
        List<Threat> threats = threatRepository.findByIsDeletedFalseOrderByDisplayOrderAsc();
        
        // Initialize lazy collections
        threats.forEach(threat -> {
            threat.getThreatEnablerTypes().size();
            threat.getRiskCategoryThreats().size();
        });
        
        return threats;
    }

    /**
     * Get threat by ID
     */
    @Transactional(readOnly = true)
    public Threat getThreatById(Long id) {
        log.info("Fetching threat with ID: {}", id);
        Threat threat = threatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat not found with id: " + id));
        
        if (threat.getIsDeleted()) {
            throw new RuntimeException("Threat has been deleted");
        }
        
        // Initialize lazy collections
        threat.getThreatEnablerTypes().size();
        threat.getRiskCategoryThreats().size();
        
        return threat;
    }

    /**
     * Get threats by threat type
     */
    @Transactional(readOnly = true)
    public List<Threat> getThreatsByThreatType(Long threatTypeId) {
        log.info("Fetching threats for threat type ID: {}", threatTypeId);
        List<Threat> threats = threatRepository.findByThreatTypeId(threatTypeId);
        
        // Initialize lazy collections
        threats.forEach(threat -> threat.getThreatEnablerTypes().size());
        
        return threats;
    }

    /**
     * Get threats by enabler type code
     */
    @Transactional(readOnly = true)
    public List<Threat> getThreatsByEnablerType(EnablerTypeCode enablerTypeCode) {
        log.info("Fetching threats for enabler type: {}", enablerTypeCode);
        List<Threat> threats = threatRepository.findByEnablerTypeCode(enablerTypeCode);
        
        // Initialize lazy collections
        threats.forEach(threat -> threat.getThreatEnablerTypes().size());
        
        return threats;
    }

    /**
     * Get threats by risk category
     */
    @Transactional(readOnly = true)
    public List<Threat> getThreatsByRiskCategory(Long riskCategoryId) {
        log.info("Fetching threats for risk category ID: {}", riskCategoryId);
        List<Threat> threats = threatRepository.findByRiskCategoryId(riskCategoryId);
        
        // Initialize lazy collections
        threats.forEach(threat -> threat.getThreatEnablerTypes().size());
        
        return threats;
    }

    /**
     * Get applicable threats for a specific context
     * This is the KEY method that combines risk category and enabler types
     */
    @Transactional(readOnly = true)
    public List<Threat> getApplicableThreats(Long riskCategoryId, List<EnablerTypeCode> enablerTypeCodes) {
        log.info("Fetching applicable threats for risk category {} and enabler types {}", 
                riskCategoryId, enablerTypeCodes);
        
        if (enablerTypeCodes == null || enablerTypeCodes.isEmpty()) {
            log.warn("No enabler types provided, returning all threats for risk category");
            return getThreatsByRiskCategory(riskCategoryId);
        }
        
        List<Threat> threats = threatRepository.findApplicableThreats(riskCategoryId, enablerTypeCodes);
        
        // Initialize lazy collections
        threats.forEach(threat -> threat.getThreatEnablerTypes().size());
        
        log.info("Found {} applicable threats", threats.size());
        return threats;
    }

    /**
     * Create a new threat
     */
    @Transactional
    public Threat createThreat(Threat threat) {
        log.info("Creating new threat: {}", threat.getName());
        
        // Check for duplicate name
        if (threatRepository.existsByNameIgnoreCase(threat.getName())) {
            throw new RuntimeException("Threat with name '" + threat.getName() + "' already exists");
        }
        
        Threat saved = threatRepository.save(threat);
        log.info("Threat created successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update an existing threat
     */
    @Transactional
    public Threat updateThreat(Long id, Threat threatDetails) {
        log.info("Updating threat with ID: {}", id);
        
        Threat threat = getThreatById(id);
        
        // Check for duplicate name (excluding current record)
        Threat existingWithName = threatRepository.findById(id).orElse(null);
        if (!threatDetails.getName().equalsIgnoreCase(threat.getName()) && 
            threatRepository.existsByNameIgnoreCase(threatDetails.getName())) {
            throw new RuntimeException("Threat with name '" + threatDetails.getName() + "' already exists");
        }
        
        threat.setName(threatDetails.getName());
        threat.setDescription(threatDetails.getDescription());
        threat.setThreatType(threatDetails.getThreatType());
        threat.setDefaultLikelihood(threatDetails.getDefaultLikelihood());
        threat.setDefaultImpact(threatDetails.getDefaultImpact());
        threat.setVelocity(threatDetails.getVelocity());
        threat.setWarningTime(threatDetails.getWarningTime());
        threat.setRecoveryComplexity(threatDetails.getRecoveryComplexity());
        threat.setDisplayOrder(threatDetails.getDisplayOrder());
        
        Threat updated = threatRepository.save(threat);
        log.info("Threat updated successfully");
        return updated;
    }

    /**
     * Assign enabler types to a threat
     */
    @Transactional
    public void assignEnablerTypes(Long threatId, Set<Long> enablerTypeIds) {
        log.info("Assigning enabler types to threat ID: {}", threatId);

        Threat threat = getThreatById(threatId);

        // Remove existing mappings by deleting them directly
        threatEnablerTypeRepository.deleteByThreatId(threatId);

        // Add new mappings
        for (Long enablerTypeId : enablerTypeIds) {
            EnablerType enablerType = enablerTypeService.getEnablerTypeById(enablerTypeId);

            ThreatEnablerType mapping = ThreatEnablerType.builder()
                    .threat(threat)
                    .enablerType(enablerType)
                    .build();

            threatEnablerTypeRepository.save(mapping);
        }

        log.info("Enabler types assigned successfully");
    }

    /**
     * Delete a threat (soft delete)
     */
    @Transactional
    public void deleteThreat(Long id) {
        log.info("Deleting threat with ID: {}", id);
        
        Threat threat = getThreatById(id);
        
        // Check if there are any risk assessments using this threat
        if (!threat.getRiskCategoryThreats().isEmpty()) {
            log.warn("Threat has associated risk category mappings, removing them");
        }
        
        threat.setIsDeleted(true);
        threatRepository.save(threat);
        log.info("Threat deleted successfully");
    }

    /**
     * Search threats by name
     */
    @Transactional(readOnly = true)
    public List<Threat> searchThreats(String searchTerm) {
        log.info("Searching threats with term: {}", searchTerm);
        List<Threat> threats = threatRepository.searchByName(searchTerm);

        // Initialize lazy collections
        threats.forEach(threat -> threat.getThreatEnablerTypes().size());

        return threats;
    }

    /**
     * Create a new threat with enabler types
     */
    @Transactional
    public Threat createThreatWithEnablers(com.bcm.controller.ThreatController.CreateThreatRequest request) {
        log.info("Creating new threat with enablers: {}", request.getName());

        // Check for duplicate name
        if (threatRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Threat with name '" + request.getName() + "' already exists");
        }

        // Get threat type
        ThreatType threatType = threatTypeService.getThreatTypeById(request.getThreatTypeId());

        // Create threat
        Threat threat = Threat.builder()
                .name(request.getName())
                .description(request.getDescription())
                .threatType(threatType)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        // Handle isActive -> isDeleted conversion
        if (request.getIsActive() != null && !request.getIsActive()) {
            threat.setIsDeleted(true);
        }

        Threat saved = threatRepository.save(threat);

        // Assign enabler types if provided
        if (request.getEnablerTypeIds() != null && !request.getEnablerTypeIds().isEmpty()) {
            assignEnablerTypes(saved.getId(), Set.copyOf(request.getEnablerTypeIds()));
        }

        log.info("Threat created successfully with ID: {}", saved.getId());
        return getThreatById(saved.getId());
    }

    /**
     * Update an existing threat with enabler types
     */
    @Transactional
    public Threat updateThreatWithEnablers(Long id, com.bcm.controller.ThreatController.UpdateThreatRequest request) {
        log.info("Updating threat with ID: {}", id);

        Threat threat = getThreatById(id);

        // Check for duplicate name (excluding current record)
        if (request.getName() != null && !request.getName().equalsIgnoreCase(threat.getName()) &&
            threatRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Threat with name '" + request.getName() + "' already exists");
        }

        // Update basic fields
        if (request.getName() != null) {
            threat.setName(request.getName());
        }
        if (request.getDescription() != null) {
            threat.setDescription(request.getDescription());
        }
        if (request.getThreatTypeId() != null) {
            ThreatType threatType = threatTypeService.getThreatTypeById(request.getThreatTypeId());
            threat.setThreatType(threatType);
        }
        if (request.getDisplayOrder() != null) {
            threat.setDisplayOrder(request.getDisplayOrder());
        }

        // Handle isActive -> isDeleted conversion
        if (request.getIsActive() != null) {
            threat.setIsDeleted(!request.getIsActive());
        }

        threatRepository.save(threat);

        // Update enabler types if provided
        if (request.getEnablerTypeIds() != null) {
            assignEnablerTypes(id, Set.copyOf(request.getEnablerTypeIds()));
        }

        log.info("Threat updated successfully");
        return getThreatById(id);
    }
}

