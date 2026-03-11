'use client';

import React, { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useRouter } from 'next/navigation';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const { currentUser, notifications, removeNotification, markAsRead, markAllAsRead } = useUserProfile();
  const router = useRouter();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate to action URL if provided, otherwise to BIA record
    const url = notification.actionUrl || `/bia-records/${notification.biaId}`;
    router.push(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'INITIATE':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETE':
        return 'bg-purple-100 text-purple-800';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFICATION':
        return 'bg-indigo-100 text-indigo-800';
      case 'APPROVAL':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getDaysUntilDue = (dueDateString?: string) => {
    if (!dueDateString) return null;
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesPriority = filterPriority === 'ALL' || notification.priority === filterPriority;
    const matchesStage = filterStage === 'ALL' || notification.workflowStage === filterStage;
    const matchesSearch = searchTerm === '' || 
      notification.biaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.actionRequired.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPriority && matchesStage && matchesSearch;
  });

  const priorityCounts = {
    HIGH: notifications.filter(n => n.priority === 'HIGH').length,
    MEDIUM: notifications.filter(n => n.priority === 'MEDIUM').length,
    LOW: notifications.filter(n => n.priority === 'LOW').length
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Notifications</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {currentUser?.profileType === 'MAKER' ? 'BIAs assigned to you for completion' : 'BIAs pending your review or approval'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.filter(n => !n.isRead).length > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                Mark All Read
              </button>
            )}
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
              {notifications.filter(n => !n.isRead).length} Unread
            </span>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Pending</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{notifications.length}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase">High Priority</p>
            <p className="mt-1 text-xl font-semibold text-red-600">{priorityCounts.HIGH}</p>
          </div>
          <div className="bg-white border border-yellow-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-yellow-600 uppercase">Medium Priority</p>
            <p className="mt-1 text-xl font-semibold text-yellow-600">{priorityCounts.MEDIUM}</p>
          </div>
          <div className="bg-white border border-green-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-green-600 uppercase">Low Priority</p>
            <p className="mt-1 text-xl font-semibold text-green-600">{priorityCounts.LOW}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="ALL">All Stages</option>
              <option value="INITIATE">Initiate</option>
              <option value="COMPLETE">Complete</option>
              <option value="REVIEW">Review</option>
              <option value="VERIFICATION">Verification</option>
              <option value="APPROVAL">Approval</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
              <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No notifications</h3>
              <p className="text-xs text-gray-500">
                {searchTerm || filterPriority !== 'ALL' || filterStage !== 'ALL'
                  ? 'No notifications match your filters'
                  : 'You have no pending actions at this time'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const daysUntilDue = getDaysUntilDue(notification.dueDate);
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
              const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 2;

              return (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-sm p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                    notification.isRead ? 'border-gray-200 opacity-75' : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{notification.biaName}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getStageColor(notification.workflowStage)}`}>
                          {notification.workflowStage}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{notification.actionRequired}</p>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{getTimeAgo(notification.assignedAt)}</span>
                        </div>
                        {notification.assignedBy && (
                          <span>Assigned by: {notification.assignedBy}</span>
                        )}
                        {notification.dueDate && (
                          <span className={isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : ''}>
                            Due: {isOverdue ? `${Math.abs(daysUntilDue!)} days overdue` : `in ${daysUntilDue} days`}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="ml-4 px-2 py-1 text-[10px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

