'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PlusIcon, CalendarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TestSchedule {
  id: string;
  type: 'Tabletop' | 'Walkthrough' | 'Simulation' | 'Full Exercise';
  frequency: string;
  lastTest: string | null;
  nextTest: string;
  status: 'Scheduled' | 'Overdue' | 'Completed';
}

export default function TestingPage() {
  const router = useRouter();

  const [testSchedule, setTestSchedule] = useState<TestSchedule[]>([
    { id: '1', type: 'Tabletop', frequency: 'Quarterly', lastTest: '2024-09-15', nextTest: '2024-12-15', status: 'Scheduled' },
    { id: '2', type: 'Walkthrough', frequency: 'Semi-Annual', lastTest: '2024-06-01', nextTest: '2024-12-01', status: 'Overdue' },
    { id: '3', type: 'Simulation', frequency: 'Annual', lastTest: '2024-03-20', nextTest: '2025-03-20', status: 'Scheduled' },
    { id: '4', type: 'Full Exercise', frequency: 'Annual', lastTest: null, nextTest: '2025-06-01', status: 'Scheduled' }
  ]);

  const [objectives] = useState([
    { id: '1', text: 'Validate call tree activation within 15 minutes', met: true },
    { id: '2', text: 'Confirm alternate site activation within RTO (4 hours)', met: true },
    { id: '3', text: 'Test data recovery procedures meet RPO (1 hour)', met: false },
    { id: '4', text: 'Verify communications with external stakeholders', met: true }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/communications');
  const handleNext = () => router.push('/it-dr-plans/create/review');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tabletop': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Walkthrough': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Simulation': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Full Exercise': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
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
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 10 ? 'bg-gray-900 text-white' : step < 10 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 10 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 10 of 12: Testing & Exercises</span></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Test Schedule */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Test Schedule</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Configure testing frequency and track test history</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                <PlusIcon className="h-3 w-3" /> Schedule Test
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">Test Type</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">Frequency</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">Last Test</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">Next Test</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testSchedule.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2"><span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${getTypeColor(test.type)}`}>{test.type}</span></td>
                      <td className="px-4 py-2 text-xs text-gray-600">{test.frequency}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{test.lastTest || '—'}</td>
                      <td className="px-4 py-2 text-xs text-gray-600 flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{test.nextTest}</td>
                      <td className="px-4 py-2"><span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${getStatusBadge(test.status)}`}>{test.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
              <span className="text-[10px] text-amber-700">requires annual BCP testing. 1 test is overdue.</span>
            </div>
          </div>

          {/* Test Objectives */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Test Objectives</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Define success criteria for BCP testing</p>
            </div>
            <div className="p-4 space-y-2">
              {objectives.map((obj) => (
                <div key={obj.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-sm">
                  {obj.met ? <CheckCircleIcon className="h-4 w-4 text-green-600" /> : <ClockIcon className="h-4 w-4 text-amber-500" />}
                  <span className="text-xs text-gray-700">{obj.text}</span>
                  <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded-sm ${obj.met ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{obj.met ? 'Met' : 'Pending'}</span>
                </div>
              ))}
              <button className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-gray-700"><PlusIcon className="h-3 w-3" /> Add Objective</button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

