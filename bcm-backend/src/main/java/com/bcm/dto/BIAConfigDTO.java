package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO for BIA Configuration Settings
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BIAConfigDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeFrame {
        private String id;
        private String label;
        private Integer valueInHours;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImpactCategory {
        private String id;
        private String name;
        private Map<Integer, String> severityDefinitions;
    }
    
    private List<TimeFrame> timeFrames;
    private List<ImpactCategory> impactCategories;
    private Integer criticalityThreshold;
    private List<String> rtoOptions;
    private List<String> rpoOptions;
}

