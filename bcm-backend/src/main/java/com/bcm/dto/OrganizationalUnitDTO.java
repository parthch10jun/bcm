package com.bcm.dto;

import com.bcm.enums.UnitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for OrganizationalUnit
 * Used for API requests and responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationalUnitDTO {

    private Long id;
    private String unitCode;
    private String unitName;
    private String description;
    private Long parentUnitId;
    private String parentUnitName;
    private UnitType unitType;
    
    /**
     * BIA eligibility - automatically calculated based on whether unit is at operational level
     * This is read-only and should not be set by clients
     */
    private Boolean isBiaEligible;

    /**
     * Indicates if this unit is at the operational level (has no subordinate units)
     * This is the source of truth for BIA eligibility
     */
    private Boolean isLeafNode;
    
    private String unitHead;
    private String unitHeadEmail;
    private String unitHeadPhone;
    private String location;
    private Integer employeeCount;
    private Double annualBudget;
    
    /**
     * Criticality information (optional, can be calculated from processes)
     */
    private String criticalityTier;
    private Integer criticalityScore;
    
    /**
     * Full hierarchical path (e.g., "ACME Corp > Technology > IT Infrastructure")
     */
    private String fullPath;
    
    /**
     * Depth level in hierarchy (0 = top level)
     */
    private Integer level;
    
    /**
     * List of child unit IDs (for tree structure)
     */
    private List<Long> childUnitIds;
    
    /**
     * Number of child units
     */
    private Integer childCount;
    
    /**
     * Audit fields
     */
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private Boolean isDeleted;
    
    /**
     * Additional metadata
     */
    private Long version;
}

