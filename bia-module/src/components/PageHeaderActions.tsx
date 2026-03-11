'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { BellIcon } from '@heroicons/react/24/outline';
import { UserProfileSwitcher } from './UserProfileSwitcher';

/**
 * PageHeaderActions Component
 * 
 * Provides consistent header actions across all pages:
 * - Notification bell with unread count badge
 * - User profile switcher
 * 
 * Usage:
 * <PageHeaderActions />
 */
export const PageHeaderActions: React.FC = () => {
  const router = useRouter();
  const { unreadCount } = useUserProfile();

  return (
    <div className="flex items-center gap-2">
      {/* Notification Bell */}
      <button
        onClick={() => router.push('/notifications')}
        className="relative px-2.5 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors flex items-center justify-center"
        title="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* User Profile Switcher */}
      <UserProfileSwitcher />
    </div>
  );
};

