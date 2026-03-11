package com.bcm.dto;

import com.bcm.enums.AssetStatus;
import com.bcm.enums.CriticalityTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Asset
 * 
 * IMPORTANT: The 'inheritedCriticality' field is calculated dynamically
 * based on the criticality of processes that depend on this asset.
 * It is NOT stored in the database!
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO {
    
    private Long id;
    private String assetName;
    private String description;
    private AssetStatus status;
    
    // Type and Category
    private Long assetTypeId;
    private String assetTypeName;
    private Long categoryId;
    private String categoryName;
    
    // Location
    private Long locationId;
    private String locationName;
    
    // Asset Details
    private String vendor;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String owner;
    private String technicalContact;
    private String notes;

    // Recovery Objectives (for BIA dependency gap analysis)
    /**
     * Recovery Time Objective in hours
     * Maximum acceptable time to restore asset after disruption
     */
    private Integer rtoHours;

    /**
     * Recovery Point Objective in hours
     * Maximum acceptable data loss window
     */
    private Integer rpoHours;

    /**
     * Asset-level criticality: CRITICAL, HIGH, MEDIUM, LOW
     * Independent of inherited process criticality
     */
    private String assetCriticality;
    
    // Audit Fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    
    // Computed Fields (NOT stored in database)
    
    /**
     * Inherited criticality from linked processes
     * This is the HIGHEST criticality of any process that depends on this asset
     */
    private CriticalityTier inheritedCriticality;
    
    /**
     * Criticality score (for sorting/filtering)
     */
    private Integer criticalityScore;
    
    /**
     * Number of processes that depend on this asset
     */
    private Long processCount;
    
    /**
     * Number of other assets this asset depends on
     */
    private Long dependencyCount;
    
    /**
     * Number of other assets that depend on this asset
     */
    private Long dependentCount;
    
    /**
     * Is this asset critical? (Tier 1 or Tier 2)
     */
    private Boolean isCritical;
}

