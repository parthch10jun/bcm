'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  ServerIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

interface CriticalActivity {
  id: string;
  name: string;
  rto: string;
  rpo: string;
  mao: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface ThirdPartySupplier {
  id: string;
  name: string;
  service: string;
  isCritical: boolean;
  bcpStatus: 'Verified' | 'Pending' | 'Missing' | 'N/A';
}

export default function ScopeDependencyPage() {
  const router = useRouter();
  const [hasExclusions, setHasExclusions] = useState(false);
  const [exclusionText, setExclusionText] = useState('');
  const [justificationText, setJustificationText] = useState('');

  // Mock data - In real app, this would come from BIA
  const criticalActivities: CriticalActivity[] = [
    { id: '1', name: 'Customer Inquiry Handling', rto: '2 hrs', rpo: '1 hr', mao: '4 hrs', impact: 'Critical' },
    { id: '2', name: 'Issue Resolution', rto: '4 hrs', rpo: '2 hrs', mao: '8 hrs', impact: 'High' },
    { id: '3', name: 'Account Management', rto: '8 hrs', rpo: '4 hrs', mao: '24 hrs', impact: 'Medium' }
  ];

  const dependencies = {
    people: ['CS Managers (5)', 'CS Representatives (25)', 'Team Leads (3)'],
    applications: ['CRM System', 'Ticketing System', 'Knowledge Base'],
    infrastructure: ['Contact Center', 'Telephony System', 'Workstations'],
    data: ['Customer Database', 'Service Logs', 'SLA Reports']
  };

  const [suppliers, setSuppliers] = useState<ThirdPartySupplier[]>([
    { id: '1', name: 'CloudTel Inc.', service: 'Telephony', isCritical: true, bcpStatus: 'Verified' },
    { id: '2', name: 'DataHost Solutions', service: 'CRM Hosting', isCritical: true, bcpStatus: 'Pending' },
    { id: '3', name: 'TechSupport Corp', service: 'IT Helpdesk', isCritical: false, bcpStatus: 'N/A' }
  ]);

  const toggleSupplierCritical = (id: string) => {
    setSuppliers(prev => prev.map(s => 
      s.id === id ? { ...s, isCritical: !s.isCritical, bcpStatus: !s.isCritical ? 'Pending' : 'N/A' } : s
    ));
  };

  const handleClose = () => {
    router.push('/it-dr-plans');
  };

  const handleBack = () => {
    router.push('/it-dr-plans/create');
  };

  const handleNext = () => {
    router.push('/it-dr-plans/create/activation');
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully');
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getBcpStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Missing': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                BCP: Customer Service Operations
              </h1>
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
                    step === 2 ? 'bg-gray-900 text-white' :
                    step < 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < 2 ? '✓' : step}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 2 of 12: Scope & Dependency Confirmation</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          {/* Critical Activities Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Critical Activities (Auto-populated from BIA)
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-sm border border-blue-200">
                  <InformationCircleIcon className="h-3 w-3" />
                  Imported from BIA
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[40%]">Activity Name</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[15%]">RTO</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[15%]">RPO</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[15%]">MAO</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[15%]">Impact</th>
                  </tr>
                </thead>
                <tbody className="bg-blue-50/30 divide-y divide-blue-100">
                  {criticalActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-blue-50/50">
                      <td className="px-4 py-2 text-xs text-gray-900">{activity.name}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{activity.rto}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{activity.rpo}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{activity.mao}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getImpactBadgeColor(activity.impact)}`}>
                          {activity.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scope Exclusions Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasExclusions}
                  onChange={(e) => setHasExclusions(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-xs font-medium text-gray-700">Add scope exclusions</span>
              </label>

              {hasExclusions && (
                <div className="mt-3 space-y-3 pl-6">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Describe what is excluded from this BCP
                    </label>
                    <textarea
                      value={exclusionText}
                      onChange={(e) => setExclusionText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Describe exclusions..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Provide justification for exclusions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={justificationText}
                      onChange={(e) => setJustificationText(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Explain why these items are excluded..."
                    />
                  </div>
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm">
                    <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-[10px]">Exclusions require approval from BCM Manager</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dependencies Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Dependencies (Auto-populated from BIA)
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-sm border border-blue-200">
                  <InformationCircleIcon className="h-3 w-3" />
                  Imported from BIA
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {/* People Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UserGroupIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">People</span>
                  </div>
                  <ul className="space-y-1">
                    {dependencies.people.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applications Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ComputerDesktopIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Applications</span>
                  </div>
                  <ul className="space-y-1">
                    {dependencies.applications.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Infrastructure Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ServerIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Infrastructure</span>
                  </div>
                  <ul className="space-y-1">
                    {dependencies.infrastructure.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Data / Records Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleStackIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Data / Records</span>
                  </div>
                  <ul className="space-y-1">
                    {dependencies.data.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Dependencies Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Third-Party Dependencies
                  </h2>
                  <span className="inline-flex px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] font-medium rounded-sm border border-red-200">
                    Required
                  </span>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm">
                  <PlusIcon className="h-3 w-3" />
                  Add Supplier
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Mark critical third-party suppliers for BCP verification</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[30%]">Supplier</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[30%]">Service</th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[15%]">Critical?</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider w-[25%]">BCP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs text-gray-900">{supplier.name}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{supplier.service}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={supplier.isCritical}
                          onChange={() => toggleSupplierCritical(supplier.id)}
                          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getBcpStatusBadge(supplier.bcpStatus)}`}>
                          {supplier.bcpStatus === 'Verified' && <CheckCircleIcon className="h-3 w-3" />}
                          {supplier.bcpStatus === 'Pending' && <ExclamationTriangleIcon className="h-3 w-3" />}
                          {supplier.bcpStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {suppliers.some(s => s.isCritical && s.bcpStatus === 'Pending') && (
              <div className="px-4 py-2 bg-amber-50 border-t border-amber-200">
                <div className="flex items-center gap-2 text-amber-700">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-[10px]">Critical suppliers require BCP evidence within 30 days</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleBack}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
            >
              Next: Activation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

