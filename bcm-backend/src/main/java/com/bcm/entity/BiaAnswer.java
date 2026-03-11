package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Answer Entity
 * 
 * Stores user responses to BIA questionnaire questions.
 * Each answer is linked to a specific BIA and a specific question.
 * 
 * The answer includes:
 * - The actual answer value (text, number, or selected option)
 * - A calculated score based on the answer
 * - Optional notes/justification
 */
@Entity
@Table(name = "bia_answers", 
    indexes = {
        @Index(name = "idx_answer_bia", columnList = "bia_id"),
        @Index(name = "idx_answer_question", columnList = "question_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_question", columnNames = {"bia_id", "question_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaAnswer extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the question
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private BiaQuestion question;

    /**
     * The actual answer value
     * - For MULTIPLE_CHOICE: the selected option value
     * - For NUMERIC: the number as string
     * - For TEXT: the text response
     * - For TIMEFRAME: the selected timeframe
     */
    @Column(name = "answer_value", columnDefinition = "TEXT")
    private String answerValue;

    /**
     * Calculated score for this answer
     * Used in RTO/RPO/Criticality calculation
     */
    @Column(name = "answer_score")
    private Integer answerScore;

    /**
     * Additional notes or justification for the answer
     */
    @Column(name = "answer_notes", columnDefinition = "TEXT")
    private String answerNotes;

    /**
     * Helper method to check if this answer has a score
     */
    public boolean hasScore() {
        return answerScore != null && answerScore > 0;
    }

    /**
     * Helper method to get weighted score
     */
    public Integer getWeightedScore() {
        if (answerScore == null || question == null || question.getWeight() == null) {
            return 0;
        }
        return answerScore * question.getWeight();
    }
}

