package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Question Entity
 * 
 * Master questionnaire for BIA impact analysis.
 * Questions are categorized by impact type (Financial, Operational, etc.)
 * and can be associated with specific timeframes (1Hr, 4Hr, 24Hr, etc.)
 * 
 * Each question has:
 * - A category (Financial, Operational, Reputational, Regulatory, Customer, Safety)
 * - A type (MULTIPLE_CHOICE, NUMERIC, TEXT, TIMEFRAME)
 * - A weight for RTO/RPO calculation
 * - Answer options (for multiple choice questions)
 */
@Entity
@Table(name = "bia_questions", indexes = {
    @Index(name = "idx_question_category", columnList = "question_category"),
    @Index(name = "idx_question_active", columnList = "is_active"),
    @Index(name = "idx_question_order", columnList = "display_order")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaQuestion extends BaseEntity {

    /**
     * Unique code for the question (e.g., "FIN_1HR", "OPS_4HR")
     */
    @Column(name = "question_code", unique = true, nullable = false, length = 50)
    private String questionCode;

    /**
     * The actual question text
     */
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    /**
     * Category of impact
     * Values: Financial, Operational, Reputational, Regulatory, Customer, Safety
     */
    @Column(name = "question_category", nullable = false, length = 100)
    private String questionCategory;

    /**
     * Type of question
     * Values: MULTIPLE_CHOICE, NUMERIC, TEXT, TIMEFRAME
     */
    @Column(name = "question_type", nullable = false, length = 50)
    private String questionType;

    /**
     * Impact timeframe (for timeframe-based questions)
     * Values: 1_HOUR, 4_HOURS, 24_HOURS, 3_DAYS, 1_WEEK
     */
    @Column(name = "impact_timeframe", length = 50)
    private String impactTimeframe;

    /**
     * Weight for RTO/RPO calculation
     * Higher weight = more important for determining RTO/RPO
     */
    @Column(name = "weight")
    @Builder.Default
    private Integer weight = 1;

    /**
     * Is this question active?
     */
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Display order (for sorting questions in the UI)
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    /**
     * Answer options (JSON format for multiple choice)
     * Example: [{"value": "None", "score": 0}, {"value": "Low", "score": 1}, ...]
     */
    @Column(name = "answer_options", columnDefinition = "TEXT")
    private String answerOptions;

    /**
     * Help text to guide users
     */
    @Column(name = "help_text", columnDefinition = "TEXT")
    private String helpText;

    /**
     * Helper method to check if this is a timeframe-based question
     */
    public boolean isTimeframeBased() {
        return impactTimeframe != null && !impactTimeframe.isEmpty();
    }

    /**
     * Helper method to check if this is a multiple choice question
     */
    public boolean isMultipleChoice() {
        return "MULTIPLE_CHOICE".equalsIgnoreCase(questionType);
    }

    /**
     * Helper method to get the timeframe in hours
     */
    public Integer getTimeframeHours() {
        if (impactTimeframe == null) {
            return null;
        }
        switch (impactTimeframe) {
            case "1_HOUR":
                return 1;
            case "4_HOURS":
                return 4;
            case "24_HOURS":
                return 24;
            case "3_DAYS":
                return 72;
            case "1_WEEK":
                return 168;
            default:
                return null;
        }
    }
}

