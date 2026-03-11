package com.bcm.service;

import com.bcm.entity.RiskCategory;
import com.bcm.entity.RiskCategoryThreat;
import com.bcm.entity.Threat;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.repository.RiskCategoryRepository;
import com.bcm.repository.RiskCategoryThreatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service for RiskCategory management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskCategoryService {

    private final RiskCategoryRepository riskCategoryRepository;
    private final RiskCategoryThreatRepository riskCategoryThreatRepository;
    private final ThreatService threatService;

    /**
     * Get all risk categories
     */
    @Transactional(readOnly = true)
    public List<RiskCategory> getAllRiskCategories() {
        log.info("Fetching all risk categories");
        List<RiskCategory> categories = riskCategoryRepository.findByIsDeletedFalseOrderByDisplayOrderAsc();
        
        // Initialize lazy collections
        categories.forEach(category -> category.getRiskCategoryThreats().size());
        
        return categories;
    }

    /**
     * Get active risk categories only
     */
    @Transactional(readOnly = true)
    public List<RiskCategory> getActiveRiskCategories() {
        log.info("Fetching active risk categories");
        List<RiskCategory> categories = riskCategoryRepository.findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAsc();
        
        // Initialize lazy collections
        categories.forEach(category -> category.getRiskCategoryThreats().size());
        
        return categories;
    }

    /**
     * Get risk category by ID
     */
    @Transactional(readOnly = true)
    public RiskCategory getRiskCategoryById(Long id) {
        log.info("Fetching risk category with ID: {}", id);
        RiskCategory category = riskCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk category not found with id: " + id));
        
        if (category.getIsDeleted()) {
            throw new RuntimeException("Risk category has been deleted");
        }
        
        // Initialize lazy collections
        category.getRiskCategoryThreats().size();
        
        return category;
    }

    /**
     * Get risk category by code
     */
    @Transactional(readOnly = true)
    public RiskCategory getRiskCategoryByCode(RiskCategoryCode code) {
        log.info("Fetching risk category with code: {}", code);
        RiskCategory category = riskCategoryRepository.findByCodeAndIsDeletedFalse(code)
                .orElseThrow(() -> new RuntimeException("Risk category not found with code: " + code));
        
        // Initialize lazy collections
        category.getRiskCategoryThreats().size();
        
        return category;
    }

    /**
     * Create a new risk category
     */
    @Transactional
    public RiskCategory createRiskCategory(RiskCategory riskCategory) {
        log.info("Creating new risk category: {}", riskCategory.getName());
        
        // Check for duplicate code
        if (riskCategoryRepository.existsByCodeAndIsDeletedFalse(riskCategory.getCode())) {
            throw new RuntimeException("Risk category with code '" + riskCategory.getCode() + "' already exists");
        }
        
        RiskCategory saved = riskCategoryRepository.save(riskCategory);
        log.info("Risk category created successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update an existing risk category
     */
    @Transactional
    public RiskCategory updateRiskCategory(Long id, RiskCategory categoryDetails) {
        log.info("Updating risk category with ID: {}", id);
        
        RiskCategory category = getRiskCategoryById(id);
        
        // Check for duplicate code (excluding current record)
        RiskCategory existingWithCode = riskCategoryRepository.findByCodeAndIsDeletedFalse(categoryDetails.getCode())
                .orElse(null);
        if (existingWithCode != null && !existingWithCode.getId().equals(id)) {
            throw new RuntimeException("Risk category with code '" + categoryDetails.getCode() + "' already exists");
        }
        
        category.setCode(categoryDetails.getCode());
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setDisplayOrder(categoryDetails.getDisplayOrder());
        category.setIsActive(categoryDetails.getIsActive());
        
        RiskCategory updated = riskCategoryRepository.save(category);
        log.info("Risk category updated successfully");
        return updated;
    }

    /**
     * Assign threats to a risk category
     */
    @Transactional
    public void assignThreats(Long riskCategoryId, Set<Long> threatIds) {
        log.info("Assigning threats to risk category ID: {}", riskCategoryId);
        
        RiskCategory category = getRiskCategoryById(riskCategoryId);
        
        // Remove existing mappings
        category.getRiskCategoryThreats().clear();
        riskCategoryRepository.save(category);
        
        // Add new mappings
        for (Long threatId : threatIds) {
            Threat threat = threatService.getThreatById(threatId);
            
            RiskCategoryThreat mapping = RiskCategoryThreat.builder()
                    .riskCategory(category)
                    .threat(threat)
                    .isDefaultSelected(false)
                    .build();
            
            category.getRiskCategoryThreats().add(mapping);
        }
        
        riskCategoryRepository.save(category);
        log.info("Threats assigned successfully");
    }

    /**
     * Delete a risk category (soft delete)
     */
    @Transactional
    public void deleteRiskCategory(Long id) {
        log.info("Deleting risk category with ID: {}", id);
        
        RiskCategory category = getRiskCategoryById(id);
        
        // Check if there are any risk assessments using this category
        // TODO: Add check when RiskAssessment service is implemented
        
        category.setIsDeleted(true);
        riskCategoryRepository.save(category);
        log.info("Risk category deleted successfully");
    }

    /**
     * Initialize default risk categories (called on application startup)
     */
    @Transactional
    public void initializeRiskCategories() {
        log.info("Initializing default risk categories");
        
        int displayOrder = 1;
        for (RiskCategoryCode code : RiskCategoryCode.values()) {
            if (!riskCategoryRepository.existsByCodeAndIsDeletedFalse(code)) {
                RiskCategory category = RiskCategory.builder()
                        .code(code)
                        .name(code.getDisplayName())
                        .description(code.getDescription())
                        .displayOrder(displayOrder++)
                        .isActive(true)
                        .build();
                riskCategoryRepository.save(category);
                log.info("Created risk category: {}", code);
            }
        }
        
        log.info("Default risk categories initialized successfully");
    }

    /**
     * Search risk categories by name
     */
    @Transactional(readOnly = true)
    public List<RiskCategory> searchRiskCategories(String searchTerm) {
        log.info("Searching risk categories with term: {}", searchTerm);
        List<RiskCategory> categories = riskCategoryRepository.searchByName(searchTerm);
        
        // Initialize lazy collections
        categories.forEach(category -> category.getRiskCategoryThreats().size());
        
        return categories;
    }
}

