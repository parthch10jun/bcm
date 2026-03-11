package com.bcm.dto.wizard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO for Step 5: Risk Summary
 * Returns heatmap data and threshold analysis
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskSummaryResponse {
    
    // Heatmap data
    private HeatmapData inherentRiskHeatmap;
    private HeatmapData residualRiskHeatmap;
    
    // Threshold analysis
    private ThresholdAnalysis thresholdAnalysis;
    
    // Threats by risk level
    private Map<String, List<ThreatSummary>> threatsByRiskLevel;
    
    // Overall statistics
    private Integer totalThreats;
    private Integer threatsAssessed;
    private Integer threatsWithTreatmentPlans;

    // Risk level counts
    private Integer assessedThreats;  // Alias for threatsAssessed
    private Integer highRiskCount;
    private Integer mediumRiskCount;
    private Integer lowRiskCount;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeatmapData {
        private List<HeatmapCell> cells;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class HeatmapCell {
            private Integer likelihood;  // 1-5
            private Integer impact;      // 1-5
            private Integer count;       // Number of threats in this cell
            private String riskLevel;    // LOW, MEDIUM, HIGH
            private List<String> threatNames;
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThresholdAnalysis {
        private Integer threshold;
        private Integer withinThresholdInherent;
        private Integer withinThresholdResidual;
        private Integer beyondThresholdInherent;
        private Integer beyondThresholdResidual;
        private Double riskReductionPercentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThreatSummary {
        private Long threatAssessmentId;
        private Long threatId;
        private String threatName;
        private String threatType;
        private Integer inherentScore;
        private String inherentRiskLevel;
        private Integer residualScore;
        private String residualRiskLevel;
        private String treatmentOption;
        private Boolean hasTreatmentPlan;
    }
}

