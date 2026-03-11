'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface ActivationTrigger {
  id: string;
  type: 'Time-Based' | 'Impact-Based' | 'Event-Based';
  condition: string;
  autoActivation: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
}

interface EscalationStep {
  id: string;
  name: string;
  role: string;
  timeframe: string;
  actions: string;
}

interface DecisionRow {
  id: string;
  action: string;
  low: string;
  medium: string;
  high: string;
  severe: string;
}

export default function ActivationEscalationPage() {
  const router = useRouter();

  const [triggers, setTriggers] = useState<ActivationTrigger[]>([
    { id: '1', type: 'Time-Based', condition: 'Service outage > 2 hours', autoActivation: true, severity: 'High' },
    { id: '2', type: 'Impact-Based', condition: '>50 customers affected', autoActivation: false, severity: 'Medium' }
  ]);

  const [escalationSteps, setEscalationSteps] = useState<EscalationStep[]>([
    { id: '1', name: 'Initial Assessment', role: 'Incident Responder', timeframe: 'Within 15 minutes', actions: 'Assess severity, document impact' },
    { id: '2', name: 'Team Lead Notification', role: 'Team Lead', timeframe: 'Within 30 minutes', actions: 'Approve/reject activation' },
    { id: '3', name: 'BCM Manager Escalation', role: 'BCM Manager', timeframe: 'Within 1 hour', actions: 'Notify stakeholders, assess resources' }
  ]);

  const [decisionMatrix, setDecisionMatrix] = useState<DecisionRow[]>([
    { id: '1', action: 'Activate BCP', low: 'Lead', medium: 'Manager', high: 'Crisis', severe: 'Exec' },
    { id: '2', action: 'Engage Alternate Site', low: 'Lead', medium: 'Manager', high: 'Manager', severe: 'Crisis' },
    { id: '3', action: 'Notify Regulators', low: '-', medium: 'Manager', high: 'Manager', severe: 'Exec' },
    { id: '4', action: 'Declare Major Incident', low: '-', medium: '-', high: 'Crisis', severe: 'Exec' }
  ]);

  const severityClassification = [
    { severity: 'Low', definition: 'Minimal impact, <10 users', escalation: 'Team Lead', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { severity: 'Medium', definition: 'Moderate impact, 10-50 users', escalation: 'BCM Manager', color: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
    { severity: 'High', definition: 'Significant impact, >50 users', escalation: 'Crisis Team', color: 'bg-orange-50 text-orange-700 border-orange-300' },
    { severity: 'Severe', definition: 'Critical/Regulatory breach', escalation: 'Executive', color: 'bg-red-50 text-red-700 border-red-300' }
  ];

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/scope');
  const handleNext = () => router.push('/it-dr-plans/create/scenarios');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const deleteTrigger = (id: string) => setTriggers(prev => prev.filter(t => t.id !== id));

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-300';
      case 'Severe': return 'bg-red-50 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">BCP: Customer Service Operations</h1>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                    step === 3 ? 'bg-gray-900 text-white' :
                    step < 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < 3 ? '✓' : step}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 3 of 12: Activation & Escalation Criteria</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          {/* Activation Triggers Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Activation Triggers</h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Define what events or conditions will activate this BCP</p>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                  <PlusIcon className="h-3 w-3" />
                  Add Trigger
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {triggers.map((trigger, idx) => (
                <div key={trigger.id} className="border border-gray-200 rounded-sm p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-900">Trigger {idx + 1}: {trigger.type}</span>
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getSeverityBadgeColor(trigger.severity)}`}>
                          {trigger.severity}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• Condition: {trigger.condition}</li>
                        <li>• Auto-activation: {trigger.autoActivation ? 'Yes' : 'No (requires approval)'}</li>
                      </ul>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteTrigger(trigger.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Classification Table */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Severity Classification</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[20%]">Severity</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[50%]">Definition</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[30%]">Escalation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {severityClassification.map((row) => (
                    <tr key={row.severity}>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${row.color}`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">{row.definition}</td>
                      <td className="px-4 py-2 text-xs text-gray-900">{row.escalation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200">
              <div className="flex items-center gap-2 text-amber-700">
                <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-[10px]">Requirement: Medium and High severity incidents must trigger regulator notification within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Escalation Workflow Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Escalation Workflow</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {escalationSteps.map((step, idx) => (
                  <div key={step.id}>
                    <div className="border border-gray-200 rounded-sm p-3 bg-white hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-medium text-gray-900">Step {idx + 1}: {step.name}</span>
                          <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                            <li>• Role: {step.role}</li>
                            <li>• Timeframe: {step.timeframe}</li>
                            <li>• Actions: {step.actions}</li>
                          </ul>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <PencilIcon className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {idx < escalationSteps.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm border border-gray-300">
                <PlusIcon className="h-3 w-3" />
                Add Escalation Step
              </button>
            </div>
          </div>

          {/* Decision Authority Matrix */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Decision Authority Matrix</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[36%]">Action</th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[16%]">Low</th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium text-yellow-700 uppercase tracking-wider w-[16%]">Medium</th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium text-orange-700 uppercase tracking-wider w-[16%]">High</th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium text-red-700 uppercase tracking-wider w-[16%]">Severe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {decisionMatrix.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2 text-xs text-gray-900">{row.action}</td>
                      <td className="px-4 py-2 text-center text-xs text-gray-600">{row.low}</td>
                      <td className="px-4 py-2 text-center text-xs text-gray-600">{row.medium}</td>
                      <td className="px-4 py-2 text-center text-xs text-gray-600">{row.high}</td>
                      <td className="px-4 py-2 text-center text-xs text-gray-600">{row.severe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-200">
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm">
                <PlusIcon className="h-3 w-3" />
                Add Decision Point
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              ← Back
            </button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              Save Draft
            </button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
              Next: Scenarios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

