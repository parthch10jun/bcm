'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PlusIcon, Bars3Icon, TrashIcon } from '@heroicons/react/24/outline';

interface ChecklistItem {
  id: string;
  task: string;
  owner: string;
  estimatedTime: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  name: string;
  phase: string;
  items: ChecklistItem[];
}

export default function ChecklistsPage() {
  const router = useRouter();

  const [checklists, setChecklists] = useState<Checklist[]>([
    {
      id: '1', name: 'Initial Response Checklist', phase: 'At Time of Incident',
      items: [
        { id: '1a', task: 'Confirm incident severity', owner: 'Incident Commander', estimatedTime: '5 min', completed: false },
        { id: '1b', task: 'Activate call tree', owner: 'BCM Coordinator', estimatedTime: '10 min', completed: false },
        { id: '1c', task: 'Notify executive leadership', owner: 'BCM Manager', estimatedTime: '15 min', completed: false },
        { id: '1d', task: 'Secure affected systems', owner: 'IT Security', estimatedTime: '30 min', completed: false }
      ]
    },
    {
      id: '2', name: 'IT Systems Recovery Checklist', phase: 'During Recovery',
      items: [
        { id: '2a', task: 'Activate backup systems', owner: 'IT Manager', estimatedTime: '1 hr', completed: false },
        { id: '2b', task: 'Verify data integrity', owner: 'DBA', estimatedTime: '2 hrs', completed: false },
        { id: '2c', task: 'Restore network connectivity', owner: 'Network Admin', estimatedTime: '1 hr', completed: false }
      ]
    },
    {
      id: '3', name: 'BAU Resumption Checklist', phase: 'Resumption to BAU',
      items: [
        { id: '3a', task: 'Validate all systems operational', owner: 'IT Manager', estimatedTime: '2 hrs', completed: false },
        { id: '3b', task: 'Confirm staff availability', owner: 'HR Manager', estimatedTime: '1 hr', completed: false },
        { id: '3c', task: 'Close incident ticket', owner: 'Incident Commander', estimatedTime: '30 min', completed: false }
      ]
    }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/response');
  const handleNext = () => router.push('/it-dr-plans/create/resources');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Before Incident': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'At Time of Incident': return 'bg-red-50 text-red-700 border-red-200';
      case 'During Recovery': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resumption to BAU': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 6 ? 'bg-gray-900 text-white' : step < 6 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 6 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 6 of 12: Recovery Checklists</span></div>
          </div>
        </div>

        {/* Checklists */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recovery Checklists</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Create and manage recovery checklists for each phase</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                <PlusIcon className="h-3 w-3" /> Add Checklist
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">{checklist.name}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${getPhaseColor(checklist.phase)}`}>{checklist.phase}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{checklist.items.length} items</span>
                  </div>
                  <div className="space-y-1.5">
                    {checklist.items.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-sm border border-gray-100 group">
                        <Bars3Icon className="h-3.5 w-3.5 text-gray-300 cursor-grab" />
                        <span className="text-[10px] text-gray-400 w-4">{idx + 1}.</span>
                        <span className="text-xs text-gray-700 flex-1">{item.task}</span>
                        <span className="text-[10px] text-gray-500">{item.owner}</span>
                        <span className="text-[10px] text-gray-400">{item.estimatedTime}</span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600"><TrashIcon className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-gray-700"><PlusIcon className="h-3 w-3" /> Add Item</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Resources</button>
          </div>
        </div>
      </div>
    </div>
  );
}

