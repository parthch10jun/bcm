'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface Procedure {
  id: string;
  title: string;
  description: string;
  owner: string;
  estimatedTime: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  procedures: Procedure[];
  isExpanded: boolean;
}

export default function ResponseProceduresPage() {
  const router = useRouter();

  const [phases, setPhases] = useState<Phase[]>([
    {
      id: '1', name: 'Before Incident', description: 'Preparedness activities and preventive measures',
      icon: '🛡️', color: 'bg-blue-50 border-blue-200', isExpanded: true,
      procedures: [
        { id: '1a', title: 'Review emergency contact list', description: 'Verify all contacts are current and accessible', owner: 'BCM Coordinator', estimatedTime: '30 min' },
        { id: '1b', title: 'Check backup systems status', description: 'Verify backup systems are operational', owner: 'IT Manager', estimatedTime: '1 hr' }
      ]
    },
    {
      id: '2', name: 'At Time of Incident', description: 'Immediate response actions when incident occurs',
      icon: '⚡', color: 'bg-red-50 border-red-200', isExpanded: true,
      procedures: [
        { id: '2a', title: 'Activate emergency notification', description: 'Send alerts to all stakeholders via call tree', owner: 'Incident Commander', estimatedTime: '15 min' },
        { id: '2b', title: 'Assess initial impact', description: 'Determine scope and severity of disruption', owner: 'BCM Manager', estimatedTime: '30 min' },
        { id: '2c', title: 'Initiate crisis communication', description: 'Brief leadership and key stakeholders', owner: 'Communications Lead', estimatedTime: '20 min' }
      ]
    },
    {
      id: '3', name: 'During Recovery', description: 'Recovery operations to restore critical functions',
      icon: '🔄', color: 'bg-amber-50 border-amber-200', isExpanded: false,
      procedures: [
        { id: '3a', title: 'Execute recovery procedures', description: 'Follow documented recovery steps for each system', owner: 'Recovery Team Lead', estimatedTime: '4 hrs' },
        { id: '3b', title: 'Coordinate with vendors', description: 'Engage critical suppliers for support', owner: 'Vendor Manager', estimatedTime: '2 hrs' }
      ]
    },
    {
      id: '4', name: 'Resumption to BAU', description: 'Return to normal business operations',
      icon: '✅', color: 'bg-green-50 border-green-200', isExpanded: false,
      procedures: [
        { id: '4a', title: 'Validate systems operational', description: 'Confirm all systems functioning normally', owner: 'IT Manager', estimatedTime: '2 hrs' },
        { id: '4b', title: 'Stand down recovery teams', description: 'Release recovery resources and close incident', owner: 'Incident Commander', estimatedTime: '1 hr' },
        { id: '4c', title: 'Document lessons learned', description: 'Capture improvement opportunities', owner: 'BCM Coordinator', estimatedTime: '3 hrs' }
      ]
    }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/scenarios');
  const handleNext = () => router.push('/it-dr-plans/create/checklists');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const togglePhase = (phaseId: string) => {
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, isExpanded: !p.isExpanded } : p));
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
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  step === 5 ? 'bg-gray-900 text-white' : step < 5 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < 5 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 5 of 12: Response Procedures</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Response & Recovery Procedures</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Define procedures for each phase of incident response</p>
            </div>
            <div className="divide-y divide-gray-200">
              {phases.map((phase) => (
                <div key={phase.id} className={phase.isExpanded ? phase.color : ''}>
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{phase.icon}</span>
                      <div className="text-left">
                        <span className="text-xs font-medium text-gray-900">{phase.name}</span>
                        <p className="text-[10px] text-gray-500">{phase.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{phase.procedures.length} procedures</span>
                      {phase.isExpanded ? <ChevronUpIcon className="h-4 w-4 text-gray-400" /> : <ChevronDownIcon className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>
                  {phase.isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="space-y-2 ml-7">
                        {phase.procedures.map((proc, idx) => (
                          <div key={proc.id} className="bg-white border border-gray-200 rounded-sm p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 font-mono">{idx + 1}.</span>
                                  <span className="text-xs font-medium text-gray-900">{proc.title}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 ml-4">{proc.description}</p>
                                <div className="flex items-center gap-3 mt-2 ml-4">
                                  <span className="text-[10px] text-gray-500">Owner: <span className="text-gray-700">{proc.owner}</span></span>
                                  <span className="text-[10px] text-gray-500">Est: <span className="text-gray-700">{proc.estimatedTime}</span></span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><PencilIcon className="h-3.5 w-3.5" /></button>
                                <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><TrashIcon className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm">
                          <PlusIcon className="h-3 w-3" /> Add Procedure
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Checklists</button>
          </div>
        </div>
      </div>
    </div>
  );
}

