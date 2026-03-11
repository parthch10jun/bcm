package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for BIA Gap Analysis Results
 * 
 * Compares BIA requirements (RTO/RPO) against dependency capabilities
 * to identify gaps that need to be addressed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaGapAnalysisDTO {
    private Long biaId;
    private String biaName;
    
    // Requirements
    private Integer requiredRto;
    private Integer requiredRpo;
    private String requiredCriticality;
    
    // Overall gap status
    private Boolean hasGaps;
    private Integer totalGaps;
    private Integer criticalGaps;
    
    // Detailed gaps by category
    private List<GapDetail> assetGaps;
    private List<GapDetail> vendorGaps;
    private List<GapDetail> vitalRecordGaps;
    private List<GapDetail> peopleGaps;
    private List<GapDetail> processGaps;
    
    /**
     * Individual gap detail
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GapDetail {
        private String dependencyName;
        private String dependencyType;  // ASSET, VENDOR, VITAL_RECORD, PERSON, PROCESS
        private String gapType;  // RTO_GAP, RPO_GAP, CAPABILITY_GAP, AVAILABILITY_GAP
        private String severity;  // CRITICAL, HIGH, MEDIUM, LOW
        private Integer requirement;  // Required RTO/RPO
        private Integer capability;  // Actual capability
        private Integer gap;  // Difference (requirement - capability)
        private String description;
        private String recommendation;
    }
}

