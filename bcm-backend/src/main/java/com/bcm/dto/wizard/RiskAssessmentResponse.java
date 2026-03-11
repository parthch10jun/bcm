package com.bcm.dto.wizard;

import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Risk Assessment responses
 * Avoids lazy loading issues by not including nested collections
 */
@Data
@Builder
public class RiskAssessmentResponse {
    private Long id;
    private String assessmentName;
    private String description;
    private RiskAssessmentStatus status;
    private RiskCategoryCode contextType;
    private Long contextId;
    private String contextName;
    private String assessorName;
    private String assessorEmail;
    private LocalDate assessmentDate;
    private String notes;
    private Integer riskThreshold;
    private Integer completionPercentage;
    private Integer currentStep;
    private String executiveSummary;
    private String recommendations;
    private String approverName;
    private String approverEmail;
    private LocalDate approvalDate;
    private String approvalComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

