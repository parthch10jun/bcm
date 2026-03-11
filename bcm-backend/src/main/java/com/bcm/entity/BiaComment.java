package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing comments and feedback from reviewers, verifiers, and approvers
 * during the BIA workflow
 */
@Entity
@Table(name = "bia_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaComment extends BaseEntity {

    /**
     * BIA being commented on
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord bia;

    /**
     * Comment type
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "comment_type", length = 50, nullable = false)
    private CommentType commentType;

    @Column(name = "comment_text", columnDefinition = "TEXT", nullable = false)
    private String commentText;

    /**
     * Related workflow stage
     */
    @Column(name = "workflow_stage", length = 50)
    private String workflowStage;

    /**
     * Change Request Fields
     */
    @Column(name = "is_change_request")
    private Boolean isChangeRequest = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_request_status", length = 50)
    private ChangeRequestStatus changeRequestStatus;

    @Column(name = "addressed_at")
    private LocalDateTime addressedAt;

    @Column(name = "addressed_by")
    private String addressedBy;

    /**
     * Commenter details (from BaseEntity audit fields)
     * Note: created_by_id and created_by are inherited from BaseEntity
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User creator;

    /**
     * Comment Type Enum
     */
    public enum CommentType {
        REVIEW,           // Comment during review stage
        VERIFICATION,     // Comment during verification stage
        APPROVAL,         // Comment during approval stage
        GENERAL,          // General comment
        CHANGE_REQUEST    // Change request comment
    }

    /**
     * Change Request Status Enum
     */
    public enum ChangeRequestStatus {
        PENDING,      // Change request pending
        ADDRESSED,    // Change request addressed
        REJECTED      // Change request rejected
    }

    /**
     * Mark change request as addressed
     */
    public void addressChangeRequest(String addressedByUser) {
        this.changeRequestStatus = ChangeRequestStatus.ADDRESSED;
        this.addressedAt = LocalDateTime.now();
        this.addressedBy = addressedByUser;
    }

    /**
     * Reject change request
     */
    public void rejectChangeRequest(String rejectedByUser) {
        this.changeRequestStatus = ChangeRequestStatus.REJECTED;
        this.addressedAt = LocalDateTime.now();
        this.addressedBy = rejectedByUser;
    }
}

