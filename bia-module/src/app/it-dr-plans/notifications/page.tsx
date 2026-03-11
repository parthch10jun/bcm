'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'dr-plans' | 'bia-changes'>('all');

  const notifications = [
    {
      id: 1,
      type: 'dr-plan',
      title: 'DR Plan Approval Required',
      message: 'Primary Data Center Failover Plan requires your approval',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'bia-change',
      title: 'BIA Update Detected',
      message: 'Core Banking System criticality changed from Tier 2 to Tier 1',
      time: '5 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'dr-plan',
      title: 'Test Scheduled',
      message: 'DR test for Email System scheduled for next week',
      time: '1 day ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'dr-plan',
      title: 'Plan Updated',
      message: 'Ransomware Recovery Plan has been updated',
      time: '2 days ago',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'bia-change',
      title: 'New Dependency Added',
      message: 'Customer Portal now depends on Payment Gateway',
      time: '3 days ago',
      read: true,
      priority: 'medium'
    }
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'dr-plans') return notif.type === 'dr-plan';
    if (filter === 'bia-changes') return notif.type === 'bia-change';
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'medium': return <ClockIcon className="h-5 w-5 text-amber-600" />;
      case 'low': return <CheckCircleIcon className="h-5 w-5 text-gray-600" />;
      default: return <BellIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">IT Disaster Recovery Plans</h1>
            <p className="text-sm text-gray-500 mt-1">Alert configuration and notification settings</p>
          </div>
        </div>

        {/* Navigation - Segmented Control */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm">
              <Link
                href="/it-dr-plans"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-400" />
                BCP Plans
              </Link>
              <Link
                href="/it-dr-plans/runbooks"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <BookOpenIcon className="mr-2 h-4 w-4 text-gray-400" />
                Runbooks
              </Link>
              <Link
                href="/it-dr-plans/simulation"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <PlayIcon className="mr-2 h-4 w-4 text-gray-400" />
                Simulation
              </Link>
              <Link
                href="/it-dr-plans/notifications"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
              >
                <BellIcon className="mr-2 h-4 w-4 text-gray-900" />
                Notifications
              </Link>
              <Link
                href="/it-dr-plans/settings"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-400" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Total</div>
                <div className="text-2xl font-semibold text-gray-900">{notifications.length}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Unread</div>
                <div className="text-2xl font-semibold text-gray-900">{notifications.filter(n => !n.read).length}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">BCP Plans</div>
                <div className="text-2xl font-semibold text-gray-900">{notifications.filter(n => n.type === 'dr-plan').length}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">BIA Changes</div>
                <div className="text-2xl font-semibold text-gray-900">{notifications.filter(n => n.type === 'bia-change').length}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    filter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    filter === 'unread'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('dr-plans')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    filter === 'dr-plans'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  BCP Plans
                </button>
                <button
                  onClick={() => setFilter('bia-changes')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    filter === 'bia-changes'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  BIA Changes
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notif.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {getPriorityIcon(notif.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border uppercase ${getPriorityBadge(notif.priority)}`}>
                              {notif.priority}
                            </span>
                            {!notif.read && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{notif.message}</p>
                        <div className="flex items-center gap-4 text-[10px] text-gray-500">
                          <span>{notif.time}</span>
                          <span>•</span>
                          <span className="capitalize">{notif.type.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
