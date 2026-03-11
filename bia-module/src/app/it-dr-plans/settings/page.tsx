'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ClockIcon,
  BellIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PencilIcon,
  DocumentTextIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'rbac' | 'sla' | 'notifications'>('rbac');

  const roles = [
    { role: 'DR Plan Owner', permissions: 'Full access to assigned plans', users: 12 },
    { role: 'DR Plan Approver', permissions: 'Approve/reject plans', users: 5 },
    { role: 'DR Plan Viewer', permissions: 'Read-only access', users: 45 },
    { role: 'System Administrator', permissions: 'Full system access', users: 3 }
  ];

  const slaThresholds = [
    { metric: 'Plan Creation to Approval', threshold: '5 business days', current: '3.2 days', status: 'On Track' },
    { metric: 'BIA Change to DR Update', threshold: '2 business days', current: '1.8 days', status: 'On Track' },
    { metric: 'Test Frequency', threshold: 'Every 6 months', current: 'Every 5.5 months', status: 'On Track' },
    { metric: 'Plan Review Cycle', threshold: 'Annual', current: '11 months', status: 'At Risk' }
  ];

  const notificationChannels = [
    { channel: 'Email', enabled: true, recipients: 'All stakeholders' },
    { channel: 'SMS', enabled: true, recipients: 'Approvers only' },
    { channel: 'In-App', enabled: true, recipients: 'All users' },
    { channel: 'Microsoft Teams', enabled: false, recipients: 'DBCM Team' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-700 border-green-300';
      case 'At Risk': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Breached': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Business Continuity Plans</h1>
            <p className="text-sm text-gray-500 mt-1">System configuration and preferences</p>
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
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <BellIcon className="mr-2 h-4 w-4 text-gray-400" />
                Notifications
              </Link>
              <Link
                href="/it-dr-plans/settings"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
              >
                <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-900" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            {/* Quick Access - Enabler Management */}
            <div className="mb-6">
              <Link
                href="/it-dr-plans/enablers"
                className="block bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-sm p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-sm flex items-center justify-center text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        Enabler Management
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Manage enabler types and continuity strategies
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Settings Tabs */}
            <div className="bg-white rounded-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('rbac')}
                    className={`px-6 py-3 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === 'rbac'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4" />
                      RBAC
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('sla')}
                    className={`px-6 py-3 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === 'sla'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      SLA Thresholds
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-6 py-3 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === 'notifications'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BellIcon className="h-4 w-4" />
                      Notification Channels
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* RBAC Tab */}
                {activeTab === 'rbac' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">Role-Based Access Control</h2>
                        <p className="mt-1 text-xs text-gray-500">Manage user roles and permissions</p>
                      </div>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors">
                        <UserGroupIcon className="h-4 w-4" />
                        Add Role
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Users</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {roles.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-3 text-xs text-gray-900 font-medium">{item.role}</td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.permissions}</td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.users}</td>
                              <td className="px-3 py-3 text-xs">
                                <button className="text-gray-600 hover:text-gray-900">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SLA Tab */}
                {activeTab === 'sla' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">SLA Thresholds</h2>
                        <p className="mt-1 text-xs text-gray-500">Configure service level agreement thresholds</p>
                      </div>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors">
                        <ClockIcon className="h-4 w-4" />
                        Add Threshold
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Current</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {slaThresholds.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-3 text-xs text-gray-900 font-medium">{item.metric}</td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.threshold}</td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.current}</td>
                              <td className="px-3 py-3 text-xs">
                                <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getStatusBadge(item.status)}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-xs">
                                <button className="text-gray-600 hover:text-gray-900">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">Notification Channels</h2>
                        <p className="mt-1 text-xs text-gray-500">Configure notification delivery channels</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {notificationChannels.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-3 text-xs text-gray-900 font-medium">{item.channel}</td>
                              <td className="px-3 py-3 text-xs">
                                <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                                  item.enabled 
                                    ? 'bg-green-100 text-green-700 border-green-300' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}>
                                  {item.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.recipients}</td>
                              <td className="px-3 py-3 text-xs">
                                <button className="text-gray-600 hover:text-gray-900">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
