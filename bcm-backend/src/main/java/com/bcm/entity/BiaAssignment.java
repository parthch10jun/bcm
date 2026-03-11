package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing BIA assignment/delegation from Champion to SME
 * Tracks who assigned what to whom and the current status
 */
@Entity
@Table(name = "bia_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaAssignment extends BaseEntity {

    /**
     * BIA being assigned
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord bia;

    /**
     * Champion who assigned the BIA
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private User assignedBy;

    @Column(name = "assigned_by_name")
    private String assignedByName;

    /**
     * SME who receives the assignment
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id", nullable = false)
    private User assignedTo;

    @Column(name = "assigned_to_name")
    private String assignedToName;

    /**
     * Type of assignment
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", length = 50)
    private AssignmentType assignmentType = AssignmentType.DELEGATION;

    @Column(name = "assignment_reason", columnDefinition = "TEXT")
    private String assignmentReason;

    @Column(name = "assignment_notes", columnDefinition = "TEXT")
    private String assignmentNotes;

    /**
     * Assignment status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private AssignmentStatus status = AssignmentStatus.PENDING;

    /**
     * Timestamps
     */
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Assignment Type Enum
     */
    public enum AssignmentType {
        DELEGATION,      // Champion delegates to SME
        REASSIGNMENT,    // SME reassigns to another SME
        ESCALATION       // SME escalates back to Champion
    }

    /**
     * Assignment Status Enum
     */
    public enum AssignmentStatus {
        PENDING,         // Assignment created, waiting for SME to accept
        ACCEPTED,        // SME accepted the assignment
        IN_PROGRESS,     // SME is working on the BIA
        COMPLETED,       // SME completed and submitted to Champion
        REJECTED         // SME rejected the assignment
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
    }
}

