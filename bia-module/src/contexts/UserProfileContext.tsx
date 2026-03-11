'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'CHAMPION' | 'SME' | 'DIVISION_HEAD' | 'BCM_VERIFIER' | 'APPROVER';
export type UserProfileType = 'MAKER' | 'CHECKER';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileType: UserProfileType;
  department?: string;
  title?: string;
}

export interface BIANotification {
  id: string;
  biaId: string;
  biaName: string;
  biaType: string;
  workflowStage: string;
  workflowStatus: string;
  assignedAt: string;
  dueDate?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: string;
  assignedBy?: string;
  actionUrl?: string; // URL to navigate when notification is clicked
  isRead?: boolean; // Track read/unread status
}

interface UserProfileContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  notifications: BIANotification[];
  addNotification: (notification: BIANotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  switchProfile: (profileType: UserProfileType, specificRole?: UserRole) => void;
  refreshNotifications: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<BIANotification[]>([]);

  // Fetch notifications from backend
  const refreshNotifications = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:8080/api/notifications?userId=${currentUser.id}&role=${currentUser.role}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Keep existing notifications on error
    }
  };

  // Initialize with a default user (in production, this would come from authentication)
  useEffect(() => {
    const defaultUser: UserProfile = {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@golfsaudi.com',
      role: 'CHAMPION',
      profileType: 'MAKER',
      department: 'Operations',
      title: 'Business Continuity Manager'
    };
    setCurrentUser(defaultUser);
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (currentUser) {
      refreshNotifications();

      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const addNotification = (notification: BIANotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}/mark-read`, {
        method: 'POST'
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:8080/api/notifications/mark-all-read?userId=${currentUser?.id}`, {
        method: 'POST'
      });
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const switchProfile = (profileType: UserProfileType, specificRole?: UserRole) => {
    if (currentUser) {
      // If specific role provided, use it; otherwise default based on profile type
      let newRole: UserRole;
      if (specificRole) {
        newRole = specificRole;
      } else {
        newRole = profileType === 'MAKER' ? 'CHAMPION' : 'DIVISION_HEAD';
      }

      setCurrentUser({
        ...currentUser,
        profileType,
        role: newRole
      });

      // Update notifications based on role
      if (newRole === 'CHAMPION') {
        const championNotifications: BIANotification[] = [
          {
            id: 'notif-champion-001',
            biaId: 'bia-001',
            biaName: 'Customer Service Process BIA',
            biaType: 'Process',
            workflowStage: 'INITIATE',
            workflowStatus: 'DRAFT',
            assignedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'HIGH',
            actionRequired: 'Complete department profile and assign to SMEs',
            assignedBy: 'System'
          }
        ];
        setNotifications(championNotifications);
      } else if (newRole === 'SME') {
        const smeNotifications: BIANotification[] = [
          {
            id: 'notif-sme-001',
            biaId: 'bia-002',
            biaName: 'IT Infrastructure BIA',
            biaType: 'Process',
            workflowStage: 'COMPLETE',
            workflowStatus: 'SUBMITTED',
            assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'HIGH',
            actionRequired: 'Complete process-level impact analysis',
            assignedBy: 'John Smith (Champion)'
          }
        ];
        setNotifications(smeNotifications);
      } else if (newRole === 'DIVISION_HEAD') {
        const divisionHeadNotifications: BIANotification[] = [
          {
            id: 'notif-dh-001',
            biaId: 'bia-003',
            biaName: 'Finance Department BIA',
            biaType: 'Department',
            workflowStage: 'REVIEW',
            workflowStatus: 'IN_REVIEW',
            assignedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'MEDIUM',
            actionRequired: 'Review and approve or request changes',
            assignedBy: 'Robert Anderson'
          }
        ];
        setNotifications(divisionHeadNotifications);
      } else if (newRole === 'BCM_VERIFIER') {
        const bcmNotifications: BIANotification[] = [
          {
            id: 'notif-bcm-001',
            biaId: 'bia-004',
            biaName: 'Payroll Process BIA',
            biaType: 'Process',
            workflowStage: 'VERIFICATION',
            workflowStatus: 'IN_VERIFICATION',
            assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'HIGH',
            actionRequired: 'Verify completeness and compliance with BCM methodology',
            assignedBy: 'Division Head'
          }
        ];
        setNotifications(bcmNotifications);
      } else if (newRole === 'APPROVER') {
        const approverNotifications: BIANotification[] = [
          {
            id: 'notif-approver-001',
            biaId: 'bia-005',
            biaName: 'Operations Department BIA',
            biaType: 'Department',
            workflowStage: 'APPROVAL',
            workflowStatus: 'VERIFIED',
            assignedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'HIGH',
            actionRequired: 'Provide final approval',
            assignedBy: 'BCM Department'
          }
        ];
        setNotifications(approverNotifications);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <UserProfileContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
        switchProfile,
        refreshNotifications
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

