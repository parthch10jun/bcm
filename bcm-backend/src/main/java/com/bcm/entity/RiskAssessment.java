package com.bcm.entity;

import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * RiskAssessment Entity - Main entity for conducting risk assessments
 * Can be applied to different context types (Process, Location, Supplier, etc.)
 */
@Entity
@Table(name = "risk_assessments", indexes = {
    @Index(name = "idx_risk_assessments_status", columnList = "status"),
    @Index(name = "idx_risk_assessments_category", columnList = "risk_category_id"),
    @Index(name = "idx_risk_assessments_context", columnList = "context_type, context_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessment extends BaseEntity {

    @Column(name = "assessment_name", nullable = false, length = 255)
    private String assessmentName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "risk_category_id", nullable = false)
    private RiskCategory riskCategory;

    // Polymorphic reference to the context object being assessed
    @Enumerated(EnumType.STRING)
    @Column(name = "context_type", nullable = false, length = 50)
    private RiskCategoryCode contextType;

    @Column(name = "context_id", nullable = false)
    private Long contextId;

    @Column(name = "context_name", length = 255)
    private String contextName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private RiskAssessmentStatus status = RiskAssessmentStatus.DRAFT;

    @Column(name = "assessment_date")
    private LocalDate assessmentDate;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    @Column(name = "next_review_date")
    private LocalDate nextReviewDate;

    @Column(name = "assessor_name", length = 255)
    private String assessorName;

    @Column(name = "assessor_email", length = 255)
    private String assessorEmail;

    @Column(name = "reviewer_name", length = 255)
    private String reviewerName;

    @Column(name = "reviewer_email", length = 255)
    private String reviewerEmail;

    @Column(name = "executive_summary", columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    // Wizard tracking
    @Column(name = "risk_threshold")
    @Builder.Default
    private Integer riskThreshold = 12;  // Default threshold: L×I >= 12 requires treatment

    @Column(name = "completion_percentage")
    @Builder.Default
    private Integer completionPercentage = 0;

    @Column(name = "current_step")
    @Builder.Default
    private Integer currentStep = 1;

    // Individual threat assessments for this RA
    @OneToMany(mappedBy = "riskAssessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ThreatAssessment> threatAssessments = new ArrayList<>();
}

