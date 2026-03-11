'use client';

import { useState } from 'react';
import { OrganizationSettings } from '@/components/OrganizationLogo';
import BIAConfiguration from '@/components/BIAConfiguration';
import OrganizationalChart from '@/components/OrganizationalChart';
import {
  CogIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ServerIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  KeyIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'organization' | 'bia-config' | 'bia-templates' | 'org-chart' | 'users' | 'system' | 'audit-log'>('organization');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleOrganizationSave = (settings: any) => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      console.log('Organization settings saved:', settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleBIAConfigSave = (config: any) => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      console.log('BIA configuration saved:', config);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleOrgChartSave = (orgData: any) => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      console.log('Organizational chart saved:', orgData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const tabs = [
    {
      id: 'organization',
      name: 'Organization',
      icon: BuildingOfficeIcon,
      description: 'Branding and company information'
    },
    {
      id: 'bia-config',
      name: 'BIA Config',
      icon: CogIcon,
      description: 'Configure impact analysis settings'
    },
    {
      id: 'bia-templates',
      name: 'Templates',
      icon: DocumentTextIcon,
      description: 'Manage BIA templates and field configurations'
    },
    {
      id: 'org-chart',
      name: 'Org Chart',
      icon: ChartBarIcon,
      description: 'Manage organizational structure'
    },
    {
      id: 'users',
      name: 'Users',
      icon: UsersIcon,
      description: 'Manage user access and permissions'
    },
    {
      id: 'system',
      name: 'System',
      icon: ServerIcon,
      description: 'System configuration and integrations'
    },
    {
      id: 'audit-log',
      name: 'Audit Log',
      icon: ClipboardDocumentListIcon,
      description: 'System audit trail and activity log'
    }
  ];

  const getSaveStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center text-yellow-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            Saving changes...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Changes saved successfully
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Error saving changes
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header - Matching Assets Library Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">System Admin</h1>
            <p className="mt-0.5 text-xs text-gray-500">Configure your BCM platform settings and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            {getSaveStatusMessage()}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Golf Saudi Green Theme */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-6 px-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs flex items-center flex-shrink-0 transition-colors duration-200`}
            >
              <tab.icon className="h-4 w-4 mr-1.5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">{/* Tab Content */}

          {activeTab === 'organization' && (
            <OrganizationSettings onSave={handleOrganizationSave} />
          )}

          {activeTab === 'bia-config' && (
            <BIAConfiguration onSave={handleBIAConfigSave} />
          )}

          {activeTab === 'bia-templates' && (
            <div className="bg-green-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-green-800">Template Management</div>
                  <div className="text-xs text-green-700 mt-0.5">
                    Access the full template management interface to create, edit, and configure BIA templates.
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.open('/settings/bia-templates', '_blank')}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <DocumentTextIcon className="h-3.5 w-3.5 inline mr-1.5" />
                  Open BIA Template Manager
                </button>
              </div>
            </div>
          )}

          {activeTab === 'org-chart' && (
            <OrganizationalChart onSave={handleOrgChartSave} />
          )}

          {activeTab === 'users' && (
            <div className="bg-gray-50 rounded-sm p-6 text-center border border-gray-200">
              <UsersIcon className="mx-auto h-10 w-10 text-gray-400" />
              <h4 className="mt-3 text-sm font-medium text-gray-900">User Management</h4>
              <p className="mt-1 text-xs text-gray-500">
                User management functionality will be available in the next release.
              </p>
              <div className="mt-4">
                <button className="px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                  Request Early Access
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4">
              {/* System Information */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">System Information</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Platform Version</label>
                    <p className="mt-0.5 text-xs text-gray-900">v1.0.0</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Last Updated</label>
                    <p className="mt-0.5 text-xs text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">ISO 22301 Compliance</label>
                    <p className="mt-0.5 text-xs text-green-600 font-medium">Compliant</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Database Status</label>
                    <p className="mt-0.5 text-xs text-green-600 font-medium">Connected</p>
                  </div>
                </div>
              </div>

              {/* Backup & Export */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Backup & Export</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-medium text-gray-900">Automatic Backups</h5>
                      <p className="text-xs text-gray-500">Daily automated backups of all BIA data</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-medium text-gray-900">Export Data</h5>
                      <p className="text-xs text-gray-500">Export all BIA records and configurations</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">OEM & Third-Party Integrations</h4>
                <p className="text-xs text-gray-500 mb-4">
                  Connect and manage external systems, security tools, and data sources including SIEM, XDR, ITSM, ITAM, Firewall, VPN, and BCP/DR tools.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3 text-center">
                    <p className="text-xl font-semibold text-green-700">18</p>
                    <p className="text-[10px] text-green-600 uppercase tracking-wider">Connected</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 text-center">
                    <p className="text-xl font-semibold text-amber-700">2</p>
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider">Pending</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 text-center">
                    <p className="text-xl font-semibold text-gray-500">6</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Available</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">All systems operational</span>
                  </div>
                  <button
                    onClick={() => router.push('/settings/integrations')}
                    className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                  >
                    Manage Integrations
                  </button>
                </div>
              </div>

              {/* License Management */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center mb-3">
                  <KeyIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">License Management</h4>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  View and manage platform license, entitlements, usage limits, and renewal information.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                    <p className="text-[10px] text-green-600 uppercase tracking-wider">Status</p>
                    <p className="text-sm font-semibold text-green-700">Active - Enterprise</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-sm p-3">
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider">Expires In</p>
                    <p className="text-sm font-semibold text-amber-700">44 Days</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/settings/license-management')}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                >
                  Manage License
                </button>
              </div>

              {/* Backup & Restore */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center mb-3">
                  <CloudArrowUpIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Backup & Restore</h4>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Configure scheduled backups, manage restore points, and recovery operations.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                    <p className="text-[10px] text-green-600 uppercase tracking-wider">Last Backup</p>
                    <p className="text-sm font-semibold text-green-700">2 hours ago</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Restore Points</p>
                    <p className="text-sm font-semibold text-gray-700">5 Available</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/settings/backup-restore')}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                >
                  Manage Backups
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit-log' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6 text-center">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-3 text-sm font-medium text-gray-900">System Audit Log</h4>
              <p className="mt-1 text-xs text-gray-500">
                View complete audit trail of all system activities and changes
              </p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/settings/audit-log')}
                  className="px-4 py-2 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                >
                  View Audit Log
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
