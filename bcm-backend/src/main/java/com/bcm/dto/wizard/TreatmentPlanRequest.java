package com.bcm.dto.wizard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating/updating Risk Treatment Plans
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentPlanRequest {
    
    private Long threatAssessmentId;
    private String treatmentOption;  // ACCEPT, MITIGATE, TRANSFER, AVOID
    private String actionDescription;
    private String actionOwner;
    private LocalDate targetDate;
    private String status;  // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
}

