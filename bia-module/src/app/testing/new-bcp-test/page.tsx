'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BeakerIcon,
  UserCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

// Mock BCP data with their scenarios and strategies
const bcpOptions = [
  {
    id: 'BCP-001',
    name: 'Customer Service Operations',
    status: 'Approved',
    lastTested: '2024-06-15',
    scenarios: ['System Outage', 'Cyber Attack', 'Pandemic'],
  },
  {
    id: 'BCP-002',
    name: 'IT Security Incident Response',
    status: 'Approved',
    lastTested: '2024-08-20',
    scenarios: ['Data Breach', 'Ransomware', 'DDoS Attack'],
  },
  {
    id: 'BCP-003',
    name: 'Payment Processing',
    status: 'Approved',
    lastTested: '2024-05-10',
    scenarios: ['Payment Gateway Failure', 'Fraud Detection', 'Regulatory Audit'],
  },
  {
    id: 'BCP-004',
    name: 'Data Center Operations',
    status: 'Approved',
    lastTested: '2024-09-01',
    scenarios: ['Power Outage', 'Hardware Failure', 'Natural Disaster'],
  },
  {
    id: 'BCP-005',
    name: 'Supply Chain Management',
    status: 'Draft',
    lastTested: null,
    scenarios: ['Vendor Failure', 'Logistics Disruption', 'Material Shortage'],
  },
];

const owners = ['Sarah Chen', 'Michael Torres', 'Emily Wang', 'David Kim', 'Alex Johnson', 'Lisa Park'];

export default function ScheduleBCPTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    linkedBCP: '',
    owner: '',
    description: '',
    plannedDate: '',
  });

  const selectedBCP = bcpOptions.find(b => b.id === formData.linkedBCP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `BCP-T-${String(Date.now()).slice(-4)}`;
    router.push(`/testing/${newId}/plan`);
  };

  const canSubmit = formData.linkedBCP && formData.owner;

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/testing" className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowLeftIcon className="h-3 w-3" />
              Back
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-sm flex items-center justify-center">
                <BeakerIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Schedule BCP Test</h1>
                <p className="text-xs text-gray-500">Create a test linked to an approved Business Continuity Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="px-6 pb-4">
          <div className="flex items-center text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-medium">1</div>
              <span className="text-gray-900 font-medium">Create</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">2</div>
              <span className="text-gray-500">Plan</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">3</div>
              <span className="text-gray-500">Approve</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">4</div>
              <span className="text-gray-500">Execute</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">5</div>
              <span className="text-gray-500">Report</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">6</div>
              <span className="text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - 2 Column Layout */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BCP Selection */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Select BCP to Test <span className="text-red-500">*</span></h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Choose an approved BCP to validate through testing</p>
                </div>
                <div className="p-4 space-y-3">
                  {bcpOptions.filter(b => b.status === 'Approved').map((bcp) => (
                    <label
                      key={bcp.id}
                      className={`relative flex items-start p-4 border rounded-sm cursor-pointer transition-colors ${
                        formData.linkedBCP === bcp.id
                          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="linkedBCP"
                        value={bcp.id}
                        checked={formData.linkedBCP === bcp.id}
                        onChange={(e) => setFormData({ ...formData, linkedBCP: e.target.value })}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-900">{bcp.id}</span>
                            <span className="text-xs text-gray-600">- {bcp.name}</span>
                          </div>
                          {formData.linkedBCP === bcp.id && (
                            <CheckCircleIcon className="h-5 w-5 text-gray-900" />
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClipboardDocumentListIcon className="h-3 w-3" />
                            {bcp.scenarios.length} scenarios
                          </span>
                          <span>Last tested: {bcp.lastTested || 'Never'}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Test Details */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Test Details</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Test Owner <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          required
                          value={formData.owner}
                          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        >
                          <option value="">Select owner...</option>
                          {owners.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Target Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          value={formData.plannedDate}
                          onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Test Objective</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the purpose and goals of this test..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/testing')}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-sm transition-colors ${
                    canSubmit
                      ? 'text-white bg-gray-900 hover:bg-gray-800'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  Create & Start Planning
                  <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Context & Help */}
          <div className="col-span-1 space-y-4">
            {/* What is a BCP Test */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900">What is a BCP Test?</h3>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  A BCP Test validates your Business Continuity Plan by simulating a disruption scenario.
                  You&apos;ll select a scenario and strategy from the linked BCP, define success criteria,
                  and capture results during execution.
                </p>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900">Setup Progress</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.linkedBCP ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.linkedBCP ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.linkedBCP ? 'text-gray-900' : 'text-gray-500'}`}>BCP selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.owner ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.owner ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.owner ? 'text-gray-900' : 'text-gray-500'}`}>Owner assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.plannedDate ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.plannedDate ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.plannedDate ? 'text-gray-900' : 'text-gray-500'}`}>Date scheduled (optional)</span>
                </div>
              </div>
            </div>

            {/* Selected BCP Info */}
            {selectedBCP && (
              <div className="bg-blue-50 border border-blue-200 rounded-sm">
                <div className="px-4 py-3 border-b border-blue-200">
                  <h3 className="text-xs font-semibold text-blue-900">Selected BCP</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-blue-900">{selectedBCP.name}</p>
                  <p className="text-[10px] text-blue-700 mt-2">Available scenarios:</p>
                  <ul className="mt-1 space-y-1">
                    {selectedBCP.scenarios.map((s, i) => (
                      <li key={i} className="text-[10px] text-blue-800 flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-400 rounded-full" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">Next Steps</h3>
              <ol className="text-[10px] text-gray-600 space-y-1.5 list-decimal list-inside">
                <li>Select scenario & strategy from BCP</li>
                <li>Choose processes to test</li>
                <li>Define success criteria</li>
                <li>Schedule & assign team</li>
                <li>Submit for approval</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

