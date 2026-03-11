package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing the complete audit trail of BIA workflow state transitions
 * Tracks every action taken on a BIA from initiation to final approval
 */
@Entity
@Table(name = "bia_workflow_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaWorkflowHistory extends BaseEntity {

    /**
     * BIA being tracked
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord bia;

    /**
     * Workflow transition
     */
    @Column(name = "from_stage", length = 50)
    private String fromStage;

    @Column(name = "to_stage", length = 50, nullable = false)
    private String toStage;

    @Column(name = "from_status", length = 50)
    private String fromStatus;

    @Column(name = "to_status", length = 50, nullable = false)
    private String toStatus;

    /**
     * Action details
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "workflow_action", length = 100, nullable = false)
    private WorkflowAction action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    private User performedBy;

    @Column(name = "performed_by_name")
    private String performedByName;

    @Column(name = "performed_by_role", length = 100)
    private String performedByRole;

    /**
     * Action metadata
     */
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;  // JSON for additional data

    /**
     * Timestamp
     */
    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    /**
     * Workflow Action Enum
     */
    public enum WorkflowAction {
        INITIATED,           // BIA initiated by Champion
        ASSIGNED,            // BIA assigned to SME
        DELEGATED,           // BIA delegated to SME
        ACCEPTED,            // SME accepted assignment
        SUBMITTED,           // SME submitted to Champion
        REVIEWED,            // Champion reviewed SME's work
        APPROVED,            // Approved by reviewer/verifier/approver
        REJECTED,            // Rejected by reviewer/verifier/approver
        CHANGES_REQUESTED,   // Changes requested
        REASSIGNED,          // Reassigned to different SME
        COMPLETED            // BIA workflow completed
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (performedAt == null) {
            performedAt = LocalDateTime.now();
        }
    }
}

