'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BellAlertIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface ReminderRule {
  id: string;
  name: string;
  triggerType: 'TREATMENT_DUE' | 'REVIEW_DUE' | 'APPROVAL_PENDING' | 'ASSESSMENT_OVERDUE';
  daysBeforeDue: number;
  enabled: boolean;
  recipients: string[];
}

interface EscalationRule {
  id: string;
  name: string;
  triggerType: 'TREATMENT_OVERDUE' | 'REVIEW_OVERDUE' | 'APPROVAL_OVERDUE';
  daysOverdue: number;
  escalateTo: 'MANAGER' | 'DBCM_TEAM' | 'EXECUTIVE' | 'CUSTOM';
  customRecipients?: string[];
  enabled: boolean;
}

export default function RemindersSettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    {
      id: '1',
      name: 'Treatment Plan Due Soon',
      triggerType: 'TREATMENT_DUE',
      daysBeforeDue: 7,
      enabled: true,
      recipients: ['Risk Owner', 'Treatment Owner']
    },
    {
      id: '2',
      name: 'Risk Review Due Soon',
      triggerType: 'REVIEW_DUE',
      daysBeforeDue: 14,
      enabled: true,
      recipients: ['Risk Owner', 'Risk Manager']
    },
    {
      id: '3',
      name: 'Approval Pending Reminder',
      triggerType: 'APPROVAL_PENDING',
      daysBeforeDue: 3,
      enabled: true,
      recipients: ['Approver']
    }
  ]);

  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([
    {
      id: '1',
      name: 'Treatment Plan Overdue - Level 1',
      triggerType: 'TREATMENT_OVERDUE',
      daysOverdue: 7,
      escalateTo: 'MANAGER',
      enabled: true
    },
    {
      id: '2',
      name: 'Treatment Plan Overdue - Level 2',
      triggerType: 'TREATMENT_OVERDUE',
      daysOverdue: 14,
      escalateTo: 'DBCM_TEAM',
      enabled: true
    },
    {
      id: '3',
      name: 'Treatment Plan Overdue - Level 3',
      triggerType: 'TREATMENT_OVERDUE',
      daysOverdue: 30,
      escalateTo: 'EXECUTIVE',
      enabled: true
    },
    {
      id: '4',
      name: 'Risk Review Overdue',
      triggerType: 'REVIEW_OVERDUE',
      daysOverdue: 7,
      escalateTo: 'MANAGER',
      enabled: true
    },
    {
      id: '5',
      name: 'Approval Overdue',
      triggerType: 'APPROVAL_OVERDUE',
      daysOverdue: 5,
      escalateTo: 'DBCM_TEAM',
      enabled: true
    }
  ]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation: await fetch('/api/reminder-settings', { method: 'POST', body: JSON.stringify({ reminderRules, escalationRules }) });
      alert('Reminder and escalation settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleReminderRule = (id: string) => {
    setReminderRules(reminderRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleEscalationRule = (id: string) => {
    setEscalationRules(escalationRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateReminderDays = (id: string, days: number) => {
    setReminderRules(reminderRules.map(rule => 
      rule.id === id ? { ...rule, daysBeforeDue: days } : rule
    ));
  };

  const updateEscalationDays = (id: string, days: number) => {
    setEscalationRules(escalationRules.map(rule => 
      rule.id === id ? { ...rule, daysOverdue: days } : rule
    ));
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TREATMENT_DUE': 'Treatment Plan Due',
      'REVIEW_DUE': 'Risk Review Due',
      'APPROVAL_PENDING': 'Approval Pending',
      'ASSESSMENT_OVERDUE': 'Assessment Overdue',
      'TREATMENT_OVERDUE': 'Treatment Plan Overdue',
      'REVIEW_OVERDUE': 'Risk Review Overdue',
      'APPROVAL_OVERDUE': 'Approval Overdue'
    };
    return labels[type] || type;
  };

  const getEscalationTargetLabel = (target: string) => {
    const labels: Record<string, string> = {
      'MANAGER': 'Direct Manager',
      'DBCM_TEAM': 'DBCM Team',
      'EXECUTIVE': 'Executive Leadership',
      'CUSTOM': 'Custom Recipients'
    };
    return labels[target] || target;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Reminders & Escalations</h1>
            <p className="mt-0.5 text-xs text-gray-500">Configure automated reminders and escalation rules</p>
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
                <BellAlertIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Automated Reminder Engine</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Configure when reminders are sent and how overdue items are escalated.
                    The system automatically checks for due dates and triggers notifications based on these rules.
                  </p>
                </div>
              </div>
            </div>

            {/* Reminder Rules */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-base font-semibold text-gray-900">Reminder Rules</h2>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Rule
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {reminderRules.map(rule => (
                  <div key={rule.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleReminderRule(rule.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              rule.enabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                rule.enabled ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">
                              Trigger: {getTriggerTypeLabel(rule.triggerType)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 ml-12 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Days Before Due</label>
                            <input
                              type="number"
                              value={rule.daysBeforeDue}
                              onChange={(e) => updateReminderDays(rule.id, parseInt(e.target.value))}
                              min="1"
                              max="90"
                              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Recipients</label>
                            <div className="flex flex-wrap gap-1">
                              {rule.recipients.map((recipient, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-sm text-xs bg-blue-100 text-blue-800">
                                  {recipient}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation Rules */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                  <h2 className="text-base font-semibold text-gray-900">Escalation Rules</h2>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Rule
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {escalationRules.map(rule => (
                  <div key={rule.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleEscalationRule(rule.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              rule.enabled ? 'bg-orange-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                rule.enabled ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">
                              Trigger: {getTriggerTypeLabel(rule.triggerType)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 ml-12 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Days Overdue</label>
                            <input
                              type="number"
                              value={rule.daysOverdue}
                              onChange={(e) => updateEscalationDays(rule.id, parseInt(e.target.value))}
                              min="1"
                              max="90"
                              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Escalate To</label>
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{getEscalationTargetLabel(rule.escalateTo)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation Hierarchy */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-base font-semibold text-gray-900">Escalation Hierarchy</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Direct Manager</div>
                    <div className="text-xs text-gray-600">First level escalation for overdue items</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-orange-50 border border-orange-200 rounded-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">DBCM Team</div>
                    <div className="text-xs text-gray-600">Second level escalation for persistent delays</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Executive Leadership</div>
                    <div className="text-xs text-gray-600">Final escalation for critical overdue items</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

