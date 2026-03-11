'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ValidationItem {
  id: string;
  section: string;
  requirement: string;
  status: 'Passed' | 'Warning' | 'Failed';
  message: string;
}

interface Approver {
  id: string;
  name: string;
  role: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string | null;
  comments: string | null;
}

export default function ReviewPage() {
  const router = useRouter();

  const [validations] = useState<ValidationItem[]>([
    { id: '1', section: 'Plan Details', requirement: 'Plan name and ownership defined', status: 'Passed', message: 'All required fields completed' },
    { id: '2', section: 'Scope', requirement: 'Critical activities linked to BIA', status: 'Passed', message: '3 critical activities linked' },
    { id: '3', section: 'Activation', requirement: 'Activation triggers defined', status: 'Passed', message: '2 triggers configured' },
    { id: '4', section: 'Scenarios', requirement: 'At least one scenario selected', status: 'Passed', message: '4 scenarios selected' },
    { id: '5', section: 'Procedures', requirement: 'All phases have procedures', status: 'Warning', message: 'Resumption phase has only 3 procedures' },
    { id: '6', section: 'Resources', requirement: 'Recovery teams assigned', status: 'Passed', message: '3 teams with 7 members' },
    { id: '7', section: 'Workspace', requirement: 'Alternate workspace selected', status: 'Passed', message: '3 workspaces configured' },
    { id: '8', section: 'Communications', requirement: 'Call tree defined', status: 'Passed', message: '5 contacts in call tree' },
    { id: '9', section: 'Testing', requirement: 'Test schedule configured', status: 'Warning', message: '1 overdue test needs attention' },
    { id: '10', section: 'Compliance', requirement: 'All requirements met', status: 'Passed', message: 'Plan meets BCM guidelines' }
  ]);

  const [approvers, setApprovers] = useState<Approver[]>([
    { id: '1', name: 'Sarah Johnson', role: 'BCM Manager', status: 'Pending', date: null, comments: null },
    { id: '2', name: 'Mohammed Al-Faisal', role: 'Department Head', status: 'Pending', date: null, comments: null },
    { id: '3', name: 'Executive Committee', role: 'Final Approval', status: 'Pending', date: null, comments: null }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/testing');
  const handleNext = () => router.push('/it-dr-plans/create/summary');
  const handleSaveDraft = () => alert('Draft saved successfully');
  const handleSubmitForApproval = () => {
    alert('BCP submitted for approval');
    router.push('/it-dr-plans/create/summary');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'Warning': return <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />;
      case 'Failed': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const passedCount = validations.filter(v => v.status === 'Passed').length;
  const warningCount = validations.filter(v => v.status === 'Warning').length;
  const failedCount = validations.filter(v => v.status === 'Failed').length;

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
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 11 ? 'bg-gray-900 text-white' : step < 11 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 11 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 11 of 12: Review & Approval</span></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Validation Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-sm p-3 text-center">
              <div className="text-2xl font-semibold text-green-700">{passedCount}</div>
              <div className="text-[10px] text-green-600 uppercase">Passed</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 text-center">
              <div className="text-2xl font-semibold text-amber-700">{warningCount}</div>
              <div className="text-[10px] text-amber-600 uppercase">Warnings</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-sm p-3 text-center">
              <div className="text-2xl font-semibold text-red-700">{failedCount}</div>
              <div className="text-[10px] text-red-600 uppercase">Failed</div>
            </div>
          </div>

          {/* Validation Details */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Validation Results</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {validations.map((v) => (
                <div key={v.id} className="px-4 py-2 flex items-center gap-3">
                  {getStatusIcon(v.status)}
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{v.section}: {v.requirement}</div>
                    <div className="text-[10px] text-gray-500">{v.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Workflow */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Approval Workflow</h2>
            </div>
            <div className="p-4 space-y-2">
              {approvers.map((approver, idx) => (
                <div key={approver.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                  <span className="text-xs font-medium text-gray-400">{idx + 1}.</span>
                  <UserCircleIcon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{approver.name}</div>
                    <div className="text-[10px] text-gray-500">{approver.role}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <ClockIcon className="h-3 w-3" /> Pending
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleSubmitForApproval} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Submit for Approval</button>
          </div>
        </div>
      </div>
    </div>
  );
}

