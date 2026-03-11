package com.bcm.entity;

import com.bcm.enums.TreatmentOption;
import com.bcm.enums.TreatmentPlanStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * RiskTreatmentPlan Entity - Treatment plans for high-risk threats
 * Defines actions to reduce residual risk below acceptable threshold
 */
@Entity
@Table(name = "risk_treatment_plans", indexes = {
    @Index(name = "idx_treatment_plans_threat_assessment", columnList = "threat_assessment_id"),
    @Index(name = "idx_treatment_plans_status", columnList = "status"),
    @Index(name = "idx_treatment_plans_owner", columnList = "action_owner")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskTreatmentPlan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "threat_assessment_id", nullable = false)
    @JsonIgnore
    private ThreatAssessment threatAssessment;

    @Enumerated(EnumType.STRING)
    @Column(name = "treatment_option", nullable = false, length = 50)
    private TreatmentOption treatmentOption;

    @Column(name = "action_description", columnDefinition = "TEXT")
    private String actionDescription;

    @Column(name = "action_owner", length = 255)
    private String actionOwner;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private TreatmentPlanStatus status = TreatmentPlanStatus.PLANNED;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "effectiveness_review", columnDefinition = "TEXT")
    private String effectivenessReview;
}

