package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for BIA Answer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaAnswerDTO {
    private Long id;
    private Long biaId;
    private Long questionId;
    private String answerValue;
    private Integer answerScore;
    private String answerNotes;
    
    // Embedded question details for convenience
    private BiaQuestionDTO question;
}

