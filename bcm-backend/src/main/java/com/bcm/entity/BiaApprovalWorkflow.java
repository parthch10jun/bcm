package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing the sequential approval workflow for BIA records
 * Stage 1: Reviewer (Division Head)
 * Stage 2: Verifier (BCM Department)
 * Stage 3: Approver (Chief of Department)
 */
@Entity
@Table(name = "bia_approval_workflow", uniqueConstraints = {
    @UniqueConstraint(name = "uk_bia_approval_stage", columnNames = {"bia_id", "stage_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaApprovalWorkflow extends BaseEntity {

    /**
     * BIA being approved
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord bia;

    /**
     * Sequential stage number (1, 2, 3)
     */
    @Column(name = "stage_number", nullable = false)
    private Integer stageNumber;

    /**
     * Stage name
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "stage_name", length = 100, nullable = false)
    private StageName stageName;

    @Column(name = "role_name")
    private String roleName;

    /**
     * Approver details
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "approver_name")
    private String approverName;

    @Column(name = "approver_email")
    private String approverEmail;

    /**
     * Approval status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    /**
     * Approval decision
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "decision", length = 50)
    private ApprovalDecision decision;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "decision_date")
    private LocalDateTime decisionDate;

    /**
     * Timestamps
     */
    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    /**
     * Stage Name Enum
     */
    public enum StageName {
        REVIEWER,    // Stage 1: Division Head
        VERIFIER,    // Stage 2: BCM Department
        APPROVER     // Stage 3: Chief of Department
    }

    /**
     * Approval Status Enum
     */
    public enum ApprovalStatus {
        PENDING,              // Waiting for approval
        APPROVED,             // Approved by this stage
        REJECTED,             // Rejected by this stage
        CHANGES_REQUESTED     // Changes requested by this stage
    }

    /**
     * Approval Decision Enum
     */
    public enum ApprovalDecision {
        APPROVE,             // Approve and move to next stage
        REJECT,              // Reject the BIA
        REQUEST_CHANGES      // Request changes from Champion/SME
    }
}

