'use client';

import React, { useState, useEffect } from 'react';
import { UserProfileSwitcher } from './UserProfileSwitcher';
import { usePathname, useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PlusIcon, ArrowUpTrayIcon, BellIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { myActionsService } from '@/services/myActionsService';

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useUserProfile();
  const [taskCount, setTaskCount] = useState(0);

  // Load task count
  useEffect(() => {
    const loadTaskCount = async () => {
      try {
        // In production, get userId from auth context
        const userId = 'user-1';
        const stats = await myActionsService.getStats(userId);
        setTaskCount(stats.pendingTasks + stats.overdueTasks);
      } catch (error) {
        console.error('Error loading task count:', error);
      }
    };

    loadTaskCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadTaskCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get page title and subtitle based on pathname
  const getPageInfo = () => {
    if (pathname === '/') return { title: 'Dashboard', subtitle: null };
    if (pathname.includes('/bia-records/new')) return { title: 'Create New BIA', subtitle: null };
    if (pathname.includes('/bia-records')) return { title: 'BIA Records', subtitle: null };
    if (pathname.includes('/consolidation')) return { title: 'Consolidation', subtitle: null };
    if (pathname.includes('/libraries/organizational-units')) return {
      title: 'Organizational Structure',
      subtitle: 'Self-referencing hierarchical organizational model'
    };
    if (pathname.includes('/libraries/processes')) return {
      title: 'Processes Library',
      subtitle: 'Manage operational processes and their business continuity requirements'
    };
    if (pathname.includes('/libraries/people')) return {
      title: 'People Library',
      subtitle: 'Human resources and key personnel management'
    };
    if (pathname.includes('/libraries/assets')) return {
      title: 'Assets Library',
      subtitle: 'Buildings, Equipment, Technology, and Vital Records (BETH3V Framework)'
    };
    if (pathname.includes('/libraries/vendors')) return {
      title: 'Vendors Library',
      subtitle: 'Third-party suppliers and service providers'
    };
    if (pathname.includes('/libraries/vital-records')) return {
      title: 'Vital Records Library',
      subtitle: 'Critical documents and information assets'
    };
    if (pathname.includes('/libraries')) return { title: 'Libraries', subtitle: null };
    if (pathname.includes('/risk-assessment')) return { title: 'Risk Assessment', subtitle: null };
    if (pathname.includes('/settings')) return { title: 'Settings', subtitle: null };
    if (pathname.includes('/notifications')) return { title: 'Notifications', subtitle: null };
    return { title: 'BCM Platform', subtitle: null };
  };

  // Get action buttons based on pathname
  const getActionButtons = () => {
    const isListPage = !pathname.includes('/new') && !pathname.includes('/edit') && !pathname.match(/\/\d+$/);

    if (!isListPage) return null;

    if (pathname === '/libraries/organizational-units') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/organizational-units/new')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Unit
          </button>
        </div>
      );
    }

    if (pathname === '/libraries/processes') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/processes/new')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Process
          </button>
        </div>
      );
    }

    if (pathname === '/libraries/assets') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/assets/bulk-upload')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push('/libraries/assets/new')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Asset
          </button>
        </div>
      );
    }

    if (pathname === '/libraries/vendors') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/vendors/bulk-upload')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push('/libraries/vendors/new')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Vendor
          </button>
        </div>
      );
    }

    if (pathname === '/libraries/vital-records') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/vital-records/bulk-upload')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push('/libraries/vital-records/new')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Record
          </button>
        </div>
      );
    }

    if (pathname === '/libraries/people') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/libraries/people/bulk-upload')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push('/libraries/people/sync-hrms')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            Sync HRMS
          </button>
        </div>
      );
    }

    return null;
  };

  const pageInfo = getPageInfo();
  const actionButtons = getActionButtons();

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 h-14 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{pageInfo.title}</h2>
        {pageInfo.subtitle && (
          <p className="text-[10px] text-gray-500 mt-0.5">{pageInfo.subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actionButtons}

        {/* My Actions */}
        <button
          onClick={() => router.push('/my-actions')}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm"
          title="My Actions"
        >
          <ClipboardDocumentListIcon className="h-5 w-5" />
          {taskCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-blue-600 rounded-full">
              {taskCount > 99 ? '99+' : taskCount}
            </span>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => router.push('/notifications')}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm"
          title="Notifications"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <UserProfileSwitcher />
      </div>
    </div>
  );
};

