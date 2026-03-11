package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for BIA Question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaQuestionDTO {
    private Long id;
    private String questionCode;
    private String questionText;
    private String questionCategory;
    private String questionType;
    private String impactTimeframe;
    private Integer weight;
    private Boolean isActive;
    private Integer displayOrder;
    private String answerOptions;
    private String helpText;
}

