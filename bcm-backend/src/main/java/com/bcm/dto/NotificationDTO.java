package com.bcm.dto;

import com.bcm.entity.Notification;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for Notification responses matching frontend interface
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    private String id;
    private String biaId;
    private String biaName;
    private String biaType;
    private String workflowStage;
    private String workflowStatus;
    private String assignedAt;
    private String dueDate;
    private String priority;
    private String actionRequired;
    private String assignedBy;
    private String actionUrl;
    private Boolean isRead;

    /**
     * Convert Notification entity to DTO
     */
    public static NotificationDTO fromEntity(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId().toString())
                .biaId(notification.getEntityId() != null ? notification.getEntityId().toString() : null)
                .biaName(notification.getTitle())
                .biaType(notification.getEntityType() != null ? notification.getEntityType() : "Process")
                .workflowStage(extractWorkflowStage(notification))
                .workflowStatus(extractWorkflowStatus(notification))
                .assignedAt(notification.getSentAt() != null ? notification.getSentAt().toString() : LocalDateTime.now().toString())
                .dueDate(notification.getExpiresAt() != null ? notification.getExpiresAt().toString() : null)
                .priority(mapPriority(notification.getPriority()))
                .actionRequired(notification.getMessage())
                .assignedBy(extractAssignedBy(notification))
                .actionUrl(notification.getActionUrl())
                .isRead(notification.getStatus() == Notification.NotificationStatus.READ)
                .build();
    }

    /**
     * Map notification priority to frontend format
     */
    private static String mapPriority(Notification.NotificationPriority priority) {
        if (priority == null) return "MEDIUM";
        
        switch (priority) {
            case URGENT:
            case HIGH:
                return "HIGH";
            case LOW:
                return "LOW";
            case NORMAL:
            default:
                return "MEDIUM";
        }
    }

    /**
     * Extract workflow stage from notification type
     */
    private static String extractWorkflowStage(Notification notification) {
        if (notification.getNotificationType() == null) return "COMPLETE";
        
        switch (notification.getNotificationType()) {
            case BIA_ASSIGNED:
                return "COMPLETE";
            case BIA_SUBMITTED:
                return "REVIEW";
            case APPROVAL_REQUIRED:
                return "VERIFICATION";
            case APPROVED:
                return "APPROVAL";
            case REJECTED:
            case CHANGES_REQUESTED:
                return "COMPLETE";
            default:
                return "COMPLETE";
        }
    }

    /**
     * Extract workflow status from notification type
     */
    private static String extractWorkflowStatus(Notification notification) {
        if (notification.getNotificationType() == null) return "DRAFT";
        
        switch (notification.getNotificationType()) {
            case BIA_ASSIGNED:
                return "DRAFT";
            case BIA_SUBMITTED:
                return "SUBMITTED";
            case APPROVAL_REQUIRED:
                return "IN_REVIEW";
            case APPROVED:
                return "APPROVED";
            case REJECTED:
                return "REJECTED";
            case CHANGES_REQUESTED:
                return "CHANGES_REQUESTED";
            default:
                return "DRAFT";
        }
    }

    /**
     * Extract assigned by from notification message
     */
    private static String extractAssignedBy(Notification notification) {
        // Extract from message if available
        String message = notification.getMessage();
        if (message != null && message.contains(" by ")) {
            String[] parts = message.split(" by ");
            if (parts.length > 1) {
                return parts[1].trim();
            }
        }
        return null;
    }
}

