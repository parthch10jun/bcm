package com.bcm.controller;

import com.bcm.dto.NotificationDTO;
import com.bcm.entity.Notification;
import com.bcm.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Notifications
 * Handles workflow notifications for users
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get notifications for a user (frontend format)
     * GET /api/notifications?userId={userId}&role={role}
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @RequestParam Long userId,
            @RequestParam(required = false) String role) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        List<NotificationDTO> dtos = notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get all notifications for a user
     * GET /api/notifications/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for a user
     * GET /api/notifications/unread/{userId}
     */
    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count for a user
     * GET /api/notifications/unread-count/{userId}
     */
    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Mark notification as read (frontend format)
     * POST /api/notifications/{id}/mark-read
     */
    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all notifications as read for a user (frontend format)
     * POST /api/notifications/mark-all-read?userId={userId}
     */
    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark notification as read
     * POST /api/notifications/mark-read/{notificationId}
     */
    @PostMapping("/mark-read/{notificationId}")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read for a user
     * POST /api/notifications/mark-all-read/{userId}
     */
    @PostMapping("/mark-all-read/{userId}")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Archive notification
     * POST /api/notifications/archive/{notificationId}
     */
    @PostMapping("/archive/{notificationId}")
    public ResponseEntity<Notification> archiveNotification(@PathVariable Long notificationId) {
        Notification notification = notificationService.archiveNotification(notificationId);
        return ResponseEntity.ok(notification);
    }

    /**
     * Delete notification
     * DELETE /api/notifications/{notificationId}
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}

