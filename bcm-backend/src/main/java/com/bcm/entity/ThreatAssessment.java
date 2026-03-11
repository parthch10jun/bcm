package com.bcm.entity;

import com.bcm.enums.LikelihoodLevel;
import com.bcm.enums.RiskImpactLevel;
import com.bcm.enums.RiskLevel;
import com.bcm.enums.TreatmentOption;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * ThreatAssessment Entity - Individual threat evaluation within a risk assessment
 * Stores the likelihood, impact, and calculated risk level for each threat
 */
@Entity
@Table(name = "threat_assessments", indexes = {
    @Index(name = "idx_threat_assessments_ra", columnList = "risk_assessment_id"),
    @Index(name = "idx_threat_assessments_threat", columnList = "threat_id"),
    @Index(name = "idx_threat_assessments_risk_level", columnList = "risk_level")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatAssessment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "risk_assessment_id", nullable = false)
    @JsonIgnore
    private RiskAssessment riskAssessment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "threat_id", nullable = false)
    private Threat threat;

    // Inherent Risk (before controls)
    @Enumerated(EnumType.STRING)
    @Column(name = "likelihood", length = 50)
    private LikelihoodLevel likelihood;

    @Enumerated(EnumType.STRING)
    @Column(name = "impact", length = 50)
    private RiskImpactLevel impact;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", length = 50)
    private RiskLevel riskLevel;

    @Column(name = "risk_score")
    private Integer riskScore;

    // Existing Controls (V17 uses "current_controls")
    @Column(name = "current_controls", columnDefinition = "TEXT")
    private String existingControls;

    @Column(name = "control_effectiveness", length = 50)
    private String controlEffectiveness;

    // Residual Risk (after controls)
    @Column(name = "residual_likelihood", length = 50)
    private String residualLikelihood;

    @Column(name = "residual_impact", length = 50)
    private String residualImpact;

    @Column(name = "residual_risk_level", length = 50)
    private String residualRiskLevel;

    @Column(name = "residual_risk_score")
    private Integer residualRiskScore;

    // Additional Risk Factors
    @Column(name = "velocity", length = 50)
    private String velocity;  // How fast threat materializes: SLOW, MODERATE, FAST, IMMEDIATE

    @Column(name = "vulnerability", length = 50)
    private String vulnerability;  // Control weakness: LOW, MEDIUM, HIGH, CRITICAL

    // Treatment
    @Enumerated(EnumType.STRING)
    @Column(name = "treatment_option", length = 50)
    private TreatmentOption treatmentOption;

    // Mitigation fields (V17 schema)
    @Column(name = "mitigation_actions", columnDefinition = "TEXT")
    private String mitigationActions;

    @Column(name = "mitigation_owner", length = 255)
    private String mitigationOwner;

    @Column(name = "mitigation_deadline")
    private java.time.LocalDate mitigationDeadline;

    @Column(name = "mitigation_status", length = 50)
    private String mitigationStatus;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Selection flag for wizard
    @Column(name = "is_selected")
    @Builder.Default
    private Boolean isSelected = true;

    // Treatment Plans
    @OneToMany(mappedBy = "threatAssessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<RiskTreatmentPlan> treatmentPlans = new ArrayList<>();

    /**
     * Calculate and set risk level based on likelihood and impact
     */
    @PrePersist
    @PreUpdate
    protected void calculateRiskLevel() {
        // Calculate inherent risk
        if (likelihood != null && impact != null) {
            riskScore = likelihood.getScore() * impact.getScore();
            riskLevel = RiskLevel.fromScores(likelihood.getScore(), impact.getScore());
        }

        // Calculate residual risk if residual values are set
        if (residualLikelihood != null && residualImpact != null) {
            try {
                LikelihoodLevel resLikelihood = LikelihoodLevel.valueOf(residualLikelihood);
                RiskImpactLevel resImpact = RiskImpactLevel.valueOf(residualImpact);
                residualRiskScore = resLikelihood.getScore() * resImpact.getScore();
                residualRiskLevel = RiskLevel.fromScores(resLikelihood.getScore(), resImpact.getScore()).name();
            } catch (IllegalArgumentException e) {
                // If conversion fails, keep existing values
            }
        }
    }
}

