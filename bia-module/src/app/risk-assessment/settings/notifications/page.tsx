'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  BellIcon,
  CheckIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface NotificationSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'risk_assigned',
      category: 'Risk Assessment Workflow',
      name: 'Risk Assessment Assigned',
      description: 'When a risk assessment is assigned to you',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'risk_submitted',
      category: 'Risk Assessment Workflow',
      name: 'Risk Assessment Submitted',
      description: 'When a risk assessment is submitted for your review',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'approval_required',
      category: 'Risk Assessment Workflow',
      name: 'Approval Required',
      description: 'When your approval is required for a risk assessment',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'changes_requested',
      category: 'Risk Assessment Workflow',
      name: 'Changes Requested',
      description: 'When changes are requested on your risk assessment',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'risk_approved',
      category: 'Risk Assessment Workflow',
      name: 'Risk Assessment Approved',
      description: 'When your risk assessment is approved',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'risk_rejected',
      category: 'Risk Assessment Workflow',
      name: 'Risk Assessment Rejected',
      description: 'When your risk assessment is rejected',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'treatment_due',
      category: 'Treatment Plans',
      name: 'Treatment Plan Due Soon',
      description: 'When a treatment plan is due within 7 days',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'treatment_overdue',
      category: 'Treatment Plans',
      name: 'Treatment Plan Overdue',
      description: 'When a treatment plan is overdue',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'treatment_completed',
      category: 'Treatment Plans',
      name: 'Treatment Plan Completed',
      description: 'When a treatment plan is marked as completed',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'review_due',
      category: 'Reviews & Reminders',
      name: 'Risk Review Due',
      description: 'When a risk assessment review is due',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'escalation',
      category: 'Reviews & Reminders',
      name: 'Escalation Notification',
      description: 'When an overdue item is escalated to your manager',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'high_risk_identified',
      category: 'Risk Alerts',
      name: 'High/Critical Risk Identified',
      description: 'When a high or critical risk is identified in your area',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'control_ineffective',
      category: 'Risk Alerts',
      name: 'Control Effectiveness Alert',
      description: 'When a control is marked as ineffective',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'risk_threshold_exceeded',
      category: 'Risk Alerts',
      name: 'Risk Threshold Exceeded',
      description: 'When risk levels exceed defined thresholds',
      email: true,
      inApp: true,
      sms: true
    }
  ]);

  const handleToggle = (id: string, channel: 'email' | 'inApp' | 'sms') => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, [channel]: !setting[channel] }
        : setting
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation: await fetch('/api/notification-settings', { method: 'POST', body: JSON.stringify(settings) });
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const categories = Array.from(new Set(settings.map(s => s.category)));

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Notification Settings</h1>
            <p className="mt-0.5 text-xs text-gray-500">Configure your notification preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/risk-assessment')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="space-y-4">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-start">
                <BellIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Stay Informed</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Configure how you want to receive notifications for risk assessment activities.
                    You can choose to receive notifications via email, in-app alerts, or SMS.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings by Category */}
            {categories.map(category => (
              <div key={category} className="bg-white border border-gray-200 rounded-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900">{category}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {settings.filter(s => s.category === category).map(setting => (
                    <div key={setting.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{setting.description}</p>
                        </div>
                        <div className="flex items-center space-x-6 ml-6">
                          {/* Email Toggle */}
                          <div className="flex flex-col items-center">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mb-1" />
                            <button
                              onClick={() => handleToggle(setting.id, 'email')}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                setting.email ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  setting.email ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className="text-[10px] text-gray-500 mt-1">Email</span>
                          </div>

                          {/* In-App Toggle */}
                          <div className="flex flex-col items-center">
                            <BellIcon className="h-4 w-4 text-gray-400 mb-1" />
                            <button
                              onClick={() => handleToggle(setting.id, 'inApp')}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                setting.inApp ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  setting.inApp ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className="text-[10px] text-gray-500 mt-1">In-App</span>
                          </div>

                          {/* SMS Toggle */}
                          <div className="flex flex-col items-center">
                            <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400 mb-1" />
                            <button
                              onClick={() => handleToggle(setting.id, 'sms')}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                setting.sms ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  setting.sms ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className="text-[10px] text-gray-500 mt-1">SMS</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notification Schedule */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center mb-4">
                <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-base font-semibold text-gray-900">Notification Schedule</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours</label>
                  <p className="text-xs text-gray-600 mb-3">Don't send notifications during these hours (applies to email and SMS only)</p>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">From</label>
                      <input
                        type="time"
                        defaultValue="22:00"
                        className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">To</label>
                      <input
                        type="time"
                        defaultValue="08:00"
                        className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Digest mode: Combine multiple notifications into a daily summary</span>
                  </label>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

