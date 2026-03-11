package com.bcm.repository;

import com.bcm.entity.Notification;
import com.bcm.entity.Notification.NotificationStatus;
import com.bcm.entity.Notification.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Notifications
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all active notifications
     */
    @Query("SELECT n FROM Notification n WHERE n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findAllActive();

    /**
     * Find notifications by user ID
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findByUserId(@Param("userId") Long userId);

    /**
     * Find unread notifications by user ID
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.status = 'UNREAD' AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);

    /**
     * Find notifications by user ID and status
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.status = :status AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") NotificationStatus status);

    /**
     * Find notifications by type
     */
    @Query("SELECT n FROM Notification n WHERE n.notificationType = :type AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findByType(@Param("type") NotificationType type);

    /**
     * Find notifications by entity
     */
    @Query("SELECT n FROM Notification n WHERE n.entityType = :entityType AND n.entityId = :entityId AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findByEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);

    /**
     * Find expired notifications
     */
    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt < :now AND n.isDeleted = false")
    List<Notification> findExpiredNotifications(@Param("now") LocalDateTime now);

    /**
     * Count unread notifications by user ID
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.status = 'UNREAD' AND n.isDeleted = false")
    Long countUnreadByUserId(@Param("userId") Long userId);

    /**
     * Count notifications by user ID and status
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.status = :status AND n.isDeleted = false")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") NotificationStatus status);

    /**
     * Find recent notifications (last N days)
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.sentAt >= :since AND n.isDeleted = false ORDER BY n.sentAt DESC")
    List<Notification> findRecentByUserId(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}

