package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic DTO for BIA Dependencies
 * Used for all BETH3V dependency types
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaDependencyDTO {
    private Long id;
    private Long biaId;
    private Long dependencyId;
    private String dependencyType;  // REQUIRED, IMPORTANT, OPTIONAL
    private String dependencyCategory;  // ASSET, PERSON, VENDOR, VITAL_RECORD, PROCESS
    private String dependencyName;
    private String notes;
    
    // Type-specific fields
    private String roleInBia;  // For people
    private Boolean isCritical;  // For people
    private String serviceProvided;  // For vendors
    
    // Capability fields (for gap analysis)
    private Integer capabilityRto;  // For assets, vendors
    private Integer capabilityRpo;  // For vital records
    private String capabilitySla;  // For vendors
}

