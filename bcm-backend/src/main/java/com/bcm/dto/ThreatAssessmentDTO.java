package com.bcm.dto;

import com.bcm.enums.LikelihoodLevel;
import com.bcm.enums.RiskImpactLevel;
import com.bcm.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for ThreatAssessment to avoid lazy loading issues
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreatAssessmentDTO {
    private Long id;
    private Long riskAssessmentId;
    
    // Threat information
    private Long threatId;
    private String threatName;
    private String threatDescription;
    
    // Risk assessment
    private LikelihoodLevel likelihood;
    private RiskImpactLevel impact;
    private Integer riskScore;
    private RiskLevel riskLevel;
    
    // Controls
    private String existingControls;
    private String controlEffectiveness;
    
    // Residual risk
    private String residualLikelihood;
    private String residualImpact;
    private Integer residualRiskScore;
    private String residualRiskLevel;
    
    // Additional fields
    private Boolean isSelected;
    private String velocity;
    private String vulnerability;
    private String treatmentOption;
}

