package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing workflow notifications for BIA assignments, approvals, and status changes
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    /**
     * Recipient user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_email")
    private String userEmail;

    /**
     * Notification type
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", length = 50, nullable = false)
    private NotificationType notificationType;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    /**
     * Related entity
     */
    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    /**
     * Action link
     */
    @Column(name = "action_url", length = 500)
    private String actionUrl;

    @Column(name = "action_label", length = 100)
    private String actionLabel;

    /**
     * Status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private NotificationStatus status = NotificationStatus.UNREAD;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 50)
    private NotificationPriority priority = NotificationPriority.NORMAL;

    /**
     * Timestamps
     */
    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    /**
     * Notification Type Enum
     */
    public enum NotificationType {
        BIA_ASSIGNED,           // BIA assigned to SME
        BIA_SUBMITTED,          // BIA submitted for review
        APPROVAL_REQUIRED,      // Approval action required
        APPROVED,               // BIA approved
        REJECTED,               // BIA rejected
        CHANGES_REQUESTED,      // Changes requested
        COMMENT_ADDED,          // New comment added
        DEADLINE_REMINDER       // Deadline reminder
    }

    /**
     * Notification Status Enum
     */
    public enum NotificationStatus {
        UNREAD,     // Not yet read
        READ,       // Read by user
        ARCHIVED    // Archived by user
    }

    /**
     * Notification Priority Enum
     */
    public enum NotificationPriority {
        LOW,
        NORMAL,
        HIGH,
        URGENT
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (sentAt == null) {
            sentAt = LocalDateTime.now();
        }
    }

    /**
     * Mark notification as read
     */
    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    /**
     * Archive notification
     */
    public void archive() {
        this.status = NotificationStatus.ARCHIVED;
        this.archivedAt = LocalDateTime.now();
    }
}

