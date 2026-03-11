package com.bcm.dto.wizard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO for Step 2: Context Overview
 * Returns BIA summary and linked enablers for the context object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContextOverviewResponse {
    
    // Context basic info
    private Long contextId;
    private String contextType;
    private String contextName;
    private String contextDescription;
    
    // BIA Summary (if available)
    private BiaSummary biaSummary;
    
    // Linked Enablers (BETH3V)
    private List<EnablerInfo> linkedEnabers;  // Note: Keep typo for backward compatibility with existing code
    
    // Dependent Processes
    private List<DependentProcessInfo> dependentProcesses;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BiaSummary {
        private Long biaId;
        private String mtpd;
        private String rto;
        private String criticality;
        private String owner;
        private Integer impactScore;
        private Map<String, String> peakTimes;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnablerInfo {
        private String enablerType;  // BUILDING, EQUIPMENT, TECHNOLOGY, PEOPLE, VENDOR, VITAL_RECORD
        private Long enablerId;
        private String enablerName;
        private String status;
        private String criticality;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DependentProcessInfo {
        private Long processId;
        private String processName;
        private String criticality;
        private String relationship;  // UPSTREAM, DOWNSTREAM
    }
}

