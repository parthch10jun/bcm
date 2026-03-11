package com.bcm.dto.wizard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Risk Treatment Plan responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentPlanResponse {
    
    private Long id;
    private Long threatAssessmentId;
    private Long threatId;
    private String threatName;
    private String treatmentOption;
    private String actionDescription;
    private String actionOwner;
    private LocalDate targetDate;
    private String status;
    private LocalDate completionDate;
    private String effectivenessReview;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

