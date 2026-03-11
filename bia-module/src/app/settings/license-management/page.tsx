'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PlusIcon,
  CloudArrowDownIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// License data
const licenseInfo = {
  organization: 'Bombay Stock Exchange Limited',
  licenseKey: 'BSE-CRP-ENT-2024-XXXX-XXXX-XXXX',
  edition: 'Enterprise',
  status: 'active',
  activatedOn: '15 Jan 2024',
  expiresOn: '14 Jan 2025',
  daysRemaining: 44,
  supportLevel: 'Premium 24x7',
  maintenanceExpiry: '14 Jan 2025'
};

const entitlements = [
  { id: 'bia', name: 'Business Impact Analysis', included: true, used: true, limit: 'Unlimited' },
  { id: 'dr-plans', name: 'IT DR Plans', included: true, used: true, limit: 'Unlimited' },
  { id: 'crisis-mgmt', name: 'Crisis Management', included: true, used: true, limit: 'Unlimited' },
  { id: 'call-trees', name: 'Call Trees & Notifications', included: true, used: true, limit: 'Unlimited' },
  { id: 'dr-simulation', name: 'DR Simulation & Testing', included: true, used: true, limit: 'Unlimited' },
  { id: 'integrations', name: 'OEM Integrations', included: true, used: true, limit: '50 connectors' },
  { id: 'api-access', name: 'REST API Access', included: true, used: true, limit: '100K calls/day' },
  { id: 'sso', name: 'SSO / SAML Integration', included: true, used: true, limit: 'Unlimited' },
  { id: 'audit-logs', name: 'Advanced Audit Logging', included: true, used: true, limit: '1 year retention' },
  { id: 'backup', name: 'Automated Backups', included: true, used: false, limit: 'Daily' },
];

const usageMetrics = {
  users: { current: 45, limit: 100, percentage: 45 },
  assets: { current: 1250, limit: 5000, percentage: 25 },
  biaRecords: { current: 89, limit: 500, percentage: 18 },
  drPlans: { current: 12, limit: 100, percentage: 12 },
  apiCalls: { current: 45200, limit: 100000, percentage: 45 },
  storage: { current: 2.4, limit: 10, percentage: 24, unit: 'GB' }
};

const licenseHistory = [
  { date: '15 Jan 2024', action: 'License Activated', details: 'Enterprise Edition - 100 Users', by: 'System Admin' },
  { date: '15 Jan 2024', action: 'Entitlements Updated', details: 'Added OEM Integration Pack', by: 'System Admin' },
  { date: '10 Jan 2024', action: 'License Key Generated', details: 'New license key issued', by: 'Ascent Support' },
  { date: '05 Jan 2024', action: 'Order Processed', details: 'PO #BSE-2024-001 confirmed', by: 'Procurement' },
];

export default function LicenseManagementPage() {
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'entitlements' | 'usage' | 'history'>('overview');

  const getExpiryColor = (days: number) => {
    if (days <= 30) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings" className="mr-4 p-1 hover:bg-gray-100 rounded-sm">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">License Management</h1>
              <p className="mt-0.5 text-xs text-gray-500">Manage your platform license, entitlements, and usage</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Export License Info
            </button>
            <button 
              onClick={() => setShowActivateModal(true)}
              className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Activate New License
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: KeyIcon },
              { id: 'entitlements', name: 'Entitlements', icon: ShieldCheckIcon },
              { id: 'usage', name: 'Usage & Limits', icon: ChartBarIcon },
              { id: 'history', name: 'History', icon: ClockIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* License Status Card */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-900 rounded-sm flex items-center justify-center mr-4">
                      <KeyIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">{licenseInfo.edition} License</h2>
                      <p className="text-xs text-gray-500">{licenseInfo.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm border bg-green-50 text-green-700 border-green-200">
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">License Key</p>
                  <p className="mt-1 text-xs font-mono text-gray-900">{licenseInfo.licenseKey}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Activated On</p>
                  <p className="mt-1 text-xs text-gray-900">{licenseInfo.activatedOn}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Expires On</p>
                  <p className="mt-1 text-xs text-gray-900">{licenseInfo.expiresOn}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Days Remaining</p>
                  <p className={`mt-1 text-sm font-semibold ${licenseInfo.daysRemaining <= 30 ? 'text-red-600' : licenseInfo.daysRemaining <= 60 ? 'text-amber-600' : 'text-green-600'}`}>
                    {licenseInfo.daysRemaining} days
                  </p>
                </div>
              </div>
            </div>

            {/* Expiry Warning */}
            {licenseInfo.daysRemaining <= 60 && (
              <div className={`p-4 rounded-sm border ${getExpiryColor(licenseInfo.daysRemaining)}`}>
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">License Expiring Soon</p>
                    <p className="text-xs mt-0.5">Your license will expire in {licenseInfo.daysRemaining} days. Contact your account manager to renew.</p>
                  </div>
                  <button className="ml-auto h-[32px] px-3 text-xs font-medium rounded-sm bg-white border border-current hover:bg-gray-50">
                    Request Renewal
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Licensed Users</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{usageMetrics.users.current}<span className="text-sm text-gray-400">/{usageMetrics.users.limit}</span></p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-gray-300" />
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${usageMetrics.users.percentage}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Assets Managed</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{usageMetrics.assets.current.toLocaleString()}<span className="text-sm text-gray-400">/{usageMetrics.assets.limit.toLocaleString()}</span></p>
                  </div>
                  <ServerStackIcon className="h-8 w-8 text-gray-300" />
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${usageMetrics.assets.percentage}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">API Calls Today</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{(usageMetrics.apiCalls.current / 1000).toFixed(1)}K<span className="text-sm text-gray-400">/100K</span></p>
                  </div>
                  <CpuChipIcon className="h-8 w-8 text-gray-300" />
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${usageMetrics.apiCalls.percentage}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Storage Used</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{usageMetrics.storage.current}<span className="text-sm text-gray-400">/{usageMetrics.storage.limit} GB</span></p>
                  </div>
                  <CloudArrowDownIcon className="h-8 w-8 text-gray-300" />
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${usageMetrics.storage.percentage}%` }} />
                </div>
              </div>
            </div>

            {/* Support & Maintenance */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Support & Maintenance</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Support Level</span>
                    <span className="text-xs font-medium text-gray-900">{licenseInfo.supportLevel}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Maintenance Expiry</span>
                    <span className="text-xs font-medium text-gray-900">{licenseInfo.maintenanceExpiry}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Software Updates</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700">
                      <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />Included
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-500">Priority Support</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700">
                      <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />Included
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">License Contacts</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Account Manager</span>
                    <span className="text-xs font-medium text-gray-900">Rahul Sharma</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Support Email</span>
                    <span className="text-xs font-medium text-blue-600">support@ascent-bcp.com</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Support Phone</span>
                    <span className="text-xs font-medium text-gray-900">+91 22 XXXX XXXX</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-500">Customer Portal</span>
                    <a href="#" className="text-xs font-medium text-blue-600 hover:underline">portal.ascent-bcp.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'entitlements' && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Licensed Features & Modules</h3>
              <span className="text-[10px] text-gray-500">{entitlements.filter(e => e.included).length} features included</span>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Feature / Module</th>
                  <th className="px-4 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Included</th>
                  <th className="px-4 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">In Use</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entitlements.map(ent => (
                  <tr key={ent.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-900">{ent.name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ent.included ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ent.used ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm bg-blue-50 text-blue-700 border border-blue-200">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm bg-gray-50 text-gray-500 border border-gray-200">Not Used</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{ent.limit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(usageMetrics).map(([key, metric]) => (
                <div key={key} className="bg-white border border-gray-200 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <span className={`text-xs font-medium ${metric.percentage >= 80 ? 'text-red-600' : metric.percentage >= 60 ? 'text-amber-600' : 'text-green-600'}`}>
                      {metric.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${metric.percentage >= 80 ? 'bg-red-500' : metric.percentage >= 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Current: {typeof metric.current === 'number' && metric.current > 1000 ? metric.current.toLocaleString() : metric.current}{(metric as any).unit ? ` ${(metric as any).unit}` : ''}</span>
                    <span className="text-xs text-gray-500">Limit: {typeof metric.limit === 'number' && metric.limit > 1000 ? metric.limit.toLocaleString() : metric.limit}{(metric as any).unit ? ` ${(metric as any).unit}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">License History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {licenseHistory.map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-start">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">{item.action}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-900">{item.date}</p>
                    <p className="text-[10px] text-gray-500">{item.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activate License Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowActivateModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-lg w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Activate New License</h3>
                <p className="text-xs text-gray-500 mt-0.5">Enter your new license key to activate or upgrade</p>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">License Key</label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                    className="w-full h-[36px] px-3 text-xs font-mono border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Organization Name</label>
                  <input
                    type="text"
                    defaultValue={licenseInfo.organization}
                    className="w-full h-[36px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Activating a new license will replace your current license. All existing data and configurations will be preserved.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button onClick={() => setShowActivateModal(false)} className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800">
                  Validate & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

