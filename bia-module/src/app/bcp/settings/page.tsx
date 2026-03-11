'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function BCPSettingsPage() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [settings, setSettings] = useState({
    autoNotifications: true,
    testReminders: true,
    reminderDays: 30,
    escalationEnabled: true,
    escalationHours: 24,
    requireApproval: true,
    approvalLevels: 2,
    autoArchive: true,
    archiveDays: 365,
    complianceReporting: true,
    reportingFrequency: 'monthly'
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Business Continuity Planning</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage scenarios, test execution, incident response, and playbooks
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saveStatus === 'saved' ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Cog6ToothIcon className="h-4 w-4" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation - Segmented Control */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm max-w-4xl">
          <Link
            href="/bcp"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ClipboardDocumentCheckIcon className="mr-2 h-4 w-4" />
            Scenarios
          </Link>
          <Link
            href="/bcp/playbooks"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <BookOpenIcon className="mr-2 h-4 w-4" />
            Playbooks
          </Link>
          <Link
            href="/bcp/tests"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <BeakerIcon className="mr-2 h-4 w-4" />
            Tests
          </Link>
          <Link
            href="/bcp/incidents"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
            Incidents
          </Link>
          <Link
            href="/bcp/settings"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
          >
            <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-900" />
            Settings
          </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <BellIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500">Configure notification preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Auto-notifications</p>
                  <p className="text-[10px] text-gray-600">Automatically notify stakeholders of scenario updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoNotifications}
                  onChange={(e) => setSettings({ ...settings, autoNotifications: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Test reminders</p>
                  <p className="text-[10px] text-gray-600">Send reminders before scheduled tests</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.testReminders}
                  onChange={(e) => setSettings({ ...settings, testReminders: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              {settings.testReminders && (
                <div className="ml-4 p-3 bg-gray-50 rounded-sm">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Reminder Days Before Test
                  </label>
                  <input
                    type="number"
                    value={settings.reminderDays}
                    onChange={(e) => setSettings({ ...settings, reminderDays: parseInt(e.target.value) })}
                    className="w-32 px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Escalation */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-orange-50 rounded-sm flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Escalation</h2>
                <p className="text-xs text-gray-500">Configure incident escalation rules</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Enable escalation</p>
                  <p className="text-[10px] text-gray-600">Automatically escalate unresolved incidents</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.escalationEnabled}
                  onChange={(e) => setSettings({ ...settings, escalationEnabled: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              {settings.escalationEnabled && (
                <div className="ml-4 p-3 bg-gray-50 rounded-sm">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Escalation Threshold (Hours)
                  </label>
                  <input
                    type="number"
                    value={settings.escalationHours}
                    onChange={(e) => setSettings({ ...settings, escalationHours: parseInt(e.target.value) })}
                    className="w-32 px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Approval Workflow */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Approval Workflow</h2>
                <p className="text-xs text-gray-500">Configure approval requirements</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Require approval</p>
                  <p className="text-[10px] text-gray-600">Require approval before activating scenarios</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              {settings.requireApproval && (
                <div className="ml-4 p-3 bg-gray-50 rounded-sm">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Approval Levels
                  </label>
                  <select
                    value={settings.approvalLevels}
                    onChange={(e) => setSettings({ ...settings, approvalLevels: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value={1}>1 Level (Manager)</option>
                    <option value={2}>2 Levels (Manager + DBCM)</option>
                    <option value={3}>3 Levels (Manager + DBCM + VP)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Compliance & Reporting */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Compliance & Reporting</h2>
                <p className="text-xs text-gray-500">Configure compliance and reporting settings</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Auto-archive</p>
                  <p className="text-[10px] text-gray-600">Automatically archive old scenarios</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoArchive}
                  onChange={(e) => setSettings({ ...settings, autoArchive: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              {settings.autoArchive && (
                <div className="ml-4 p-3 bg-gray-50 rounded-sm">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Archive After (Days)
                  </label>
                  <input
                    type="number"
                    value={settings.archiveDays}
                    onChange={(e) => setSettings({ ...settings, archiveDays: parseInt(e.target.value) })}
                    className="w-32 px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              )}
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div>
                  <p className="text-xs font-medium text-gray-900">Compliance reporting</p>
                  <p className="text-[10px] text-gray-600">Generate automated compliance reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.complianceReporting}
                  onChange={(e) => setSettings({ ...settings, complianceReporting: e.target.checked })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
              </label>
              {settings.complianceReporting && (
                <div className="ml-4 p-3 bg-gray-50 rounded-sm">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Reporting Frequency
                  </label>
                  <select
                    value={settings.reportingFrequency}
                    onChange={(e) => setSettings({ ...settings, reportingFrequency: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

