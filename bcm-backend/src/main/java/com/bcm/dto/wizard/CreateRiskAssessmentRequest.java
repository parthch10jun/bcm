package com.bcm.dto.wizard;

import com.bcm.enums.RiskCategoryCode;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for creating a new Risk Assessment (Step 1)
 */
@Data
public class CreateRiskAssessmentRequest {
    private Long riskCategoryId;
    private RiskCategoryCode contextType;
    private Long contextId;
    private String contextName;
    private String assessmentName;
    private String description;
    private String assessorName;
    private String assessorEmail;
    private LocalDate assessmentDate;
    private String notes;
    private Integer riskThreshold;  // Optional, defaults to 12
}

