package com.bcm.service;

import com.bcm.entity.BiaRecord;
import com.bcm.entity.Notification;
import com.bcm.entity.User;
import com.bcm.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing notifications
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Notify user that a BIA has been assigned to them
     */
    public Notification notifyBiaAssigned(User sme, BiaRecord bia, User champion) {
        log.info("Sending BIA assignment notification to user {}", sme.getId());

        Notification notification = Notification.builder()
                .user(sme)
                .userName(sme.getFullName())
                .userEmail(sme.getEmail())
                .notificationType(Notification.NotificationType.BIA_ASSIGNED)
                .title("New BIA Assignment")
                .message(String.format("You have been assigned a new BIA: %s by %s", 
                        bia.getBiaName(), champion.getFullName()))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId() + "/edit")
                .actionLabel("Start BIA")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.HIGH)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Notify Champion that SME has submitted BIA
     */
    public Notification notifyBiaSubmitted(User champion, BiaRecord bia, User sme) {
        log.info("Sending BIA submission notification to Champion {}", champion.getId());

        Notification notification = Notification.builder()
                .user(champion)
                .userName(champion.getFullName())
                .userEmail(champion.getEmail())
                .notificationType(Notification.NotificationType.BIA_SUBMITTED)
                .title("BIA Submitted for Review")
                .message(String.format("%s has submitted BIA: %s for your review", 
                        sme.getFullName(), bia.getBiaName()))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId() + "/review")
                .actionLabel("Review BIA")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.HIGH)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Notify approver that approval is required
     */
    public Notification notifyApprovalRequired(User approver, BiaRecord bia, String stageName) {
        log.info("Sending approval required notification to user {} for stage {}", approver.getId(), stageName);

        Notification notification = Notification.builder()
                .user(approver)
                .userName(approver.getFullName())
                .userEmail(approver.getEmail())
                .notificationType(Notification.NotificationType.APPROVAL_REQUIRED)
                .title("BIA Approval Required")
                .message(String.format("BIA: %s requires your approval as %s", 
                        bia.getBiaName(), stageName))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId() + "/approve")
                .actionLabel("Review & Approve")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.URGENT)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Notify user that BIA has been approved
     */
    public Notification notifyBiaApproved(User user, BiaRecord bia, String approverName) {
        log.info("Sending BIA approved notification to user {}", user.getId());

        Notification notification = Notification.builder()
                .user(user)
                .userName(user.getFullName())
                .userEmail(user.getEmail())
                .notificationType(Notification.NotificationType.APPROVED)
                .title("BIA Approved")
                .message(String.format("BIA: %s has been approved by %s", 
                        bia.getBiaName(), approverName))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId())
                .actionLabel("View BIA")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.NORMAL)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Notify user that BIA has been rejected
     */
    public Notification notifyBiaRejected(User user, BiaRecord bia, String approverName, String reason) {
        log.info("Sending BIA rejected notification to user {}", user.getId());

        Notification notification = Notification.builder()
                .user(user)
                .userName(user.getFullName())
                .userEmail(user.getEmail())
                .notificationType(Notification.NotificationType.REJECTED)
                .title("BIA Rejected")
                .message(String.format("BIA: %s has been rejected by %s. Reason: %s", 
                        bia.getBiaName(), approverName, reason))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId() + "/edit")
                .actionLabel("Revise BIA")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.URGENT)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Notify user that changes are requested
     */
    public Notification notifyChangesRequested(User user, BiaRecord bia, String approverName, String comments) {
        log.info("Sending changes requested notification to user {}", user.getId());

        Notification notification = Notification.builder()
                .user(user)
                .userName(user.getFullName())
                .userEmail(user.getEmail())
                .notificationType(Notification.NotificationType.CHANGES_REQUESTED)
                .title("BIA Changes Requested")
                .message(String.format("Changes requested for BIA: %s by %s. Comments: %s", 
                        bia.getBiaName(), approverName, comments))
                .entityType("BIA")
                .entityId(bia.getId())
                .actionUrl("/bia-records/" + bia.getId() + "/edit")
                .actionLabel("Make Changes")
                .status(Notification.NotificationStatus.UNREAD)
                .priority(Notification.NotificationPriority.HIGH)
                .sentAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadByUserId(userId);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        
        notification.markAsRead();
        return notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUserId(userId);
        unreadNotifications.forEach(Notification::markAsRead);
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Archive notification
     */
    public Notification archiveNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        
        notification.archive();
        return notificationRepository.save(notification);
    }

    /**
     * Get unread notification count for a user
     */
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notificationRepository.delete(notification);
    }
}

