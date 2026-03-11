'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  UserCircleIcon,
  DocumentTextIcon,
  LinkIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function CreateTabletopPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    linkedBCP: '',
    isLinked: false, // Default to standalone
    owner: '',
    description: '',
    scenarioType: '',
    plannedDate: '',
  });

  const bcpOptions = [
    { id: 'BCP-001', name: 'Customer Service Operations' },
    { id: 'BCP-002', name: 'IT Security Incident Response' },
    { id: 'BCP-003', name: 'Payment Processing' },
    { id: 'BCP-004', name: 'Data Center Operations' },
    { id: 'BCP-005', name: 'Supply Chain Management' },
  ];

  const owners = ['Sarah Chen', 'Michael Torres', 'Emily Wang', 'David Kim', 'Alex Johnson', 'Lisa Park'];

  const scenarioTypes = [
    { id: 'cyber', name: 'Cyber Attack', description: 'Ransomware, data breach, system compromise' },
    { id: 'natural', name: 'Natural Disaster', description: 'Earthquake, flood, fire, storm' },
    { id: 'pandemic', name: 'Pandemic/Health', description: 'Disease outbreak, workforce impact' },
    { id: 'supply', name: 'Supply Chain', description: 'Vendor failure, logistics disruption' },
    { id: 'regulatory', name: 'Regulatory Crisis', description: 'Compliance breach, audit failure' },
    { id: 'custom', name: 'Custom Scenario', description: 'Define your own scenario' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TT-${String(Date.now()).slice(-4)}`;
    router.push(`/testing/${newId}`);
  };

  const canSubmit = formData.title && formData.owner && formData.scenarioType && (!formData.isLinked || formData.linkedBCP);

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
              <div className="h-10 w-10 bg-purple-100 rounded-sm flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">New Tabletop Exercise</h1>
                <p className="text-xs text-gray-500">Discussion-based scenario walkthrough</p>
              </div>
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
              {/* Basic Info */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Exercise Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Q1 Cybersecurity Response Exercise"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Exercise Owner <span className="text-red-500">*</span></label>
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Planned Date</label>
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief overview of the exercise objectives..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Scenario Type */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Scenario Type <span className="text-red-500">*</span></h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Select the type of scenario for this exercise</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {scenarioTypes.map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, scenarioType: scenario.id })}
                        className={`p-3 rounded-sm border text-left transition-colors ${
                          formData.scenarioType === scenario.id
                            ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`text-xs font-medium ${formData.scenarioType === scenario.id ? 'text-gray-900' : 'text-gray-700'}`}>
                          {scenario.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">{scenario.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BCP Linkage (Optional) */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">BCP Linkage (Optional)</h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Optionally link this exercise to an existing BCP</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isLinked: false, linkedBCP: '' })}
                      className={`p-3 rounded-sm border text-left transition-colors ${
                        !formData.isLinked
                          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <DocumentTextIcon className={`h-4 w-4 ${!formData.isLinked ? 'text-gray-900' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${!formData.isLinked ? 'text-gray-900' : 'text-gray-600'}`}>
                          Standalone Exercise
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">Independent tabletop not linked to a BCP</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isLinked: true })}
                      className={`p-3 rounded-sm border text-left transition-colors ${
                        formData.isLinked
                          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <LinkIcon className={`h-4 w-4 ${formData.isLinked ? 'text-gray-900' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${formData.isLinked ? 'text-gray-900' : 'text-gray-600'}`}>
                          Link to BCP
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">Test a specific BCP plan</p>
                    </button>
                  </div>
                  {formData.isLinked && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Select BCP <span className="text-red-500">*</span></label>
                      <select
                        required={formData.isLinked}
                        value={formData.linkedBCP}
                        onChange={(e) => setFormData({ ...formData, linkedBCP: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="">Choose a BCP...</option>
                        {bcpOptions.map((bcp) => (
                          <option key={bcp.id} value={bcp.id}>{bcp.id} - {bcp.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  Create Exercise
                  <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Context & Help */}
          <div className="col-span-1 space-y-4">
            {/* What is a Tabletop */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900">What is a Tabletop Exercise?</h3>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  A tabletop exercise is a discussion-based session where team members walk through
                  a simulated scenario to validate response procedures and identify gaps in your
                  business continuity plans.
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
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.title ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.title ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.title ? 'text-gray-900' : 'text-gray-500'}`}>Exercise title</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.owner ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.owner ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.owner ? 'text-gray-900' : 'text-gray-500'}`}>Owner assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.scenarioType ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.scenarioType ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.scenarioType ? 'text-gray-900' : 'text-gray-500'}`}>Scenario type selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.plannedDate ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {formData.plannedDate ? <CheckCircleIcon className="h-3 w-3 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${formData.plannedDate ? 'text-gray-900' : 'text-gray-500'}`}>Date scheduled (optional)</span>
                </div>
              </div>
            </div>

            {/* Selected Scenario Info */}
            {formData.scenarioType && (
              <div className="bg-purple-50 border border-purple-200 rounded-sm">
                <div className="px-4 py-3 border-b border-purple-200">
                  <h3 className="text-xs font-semibold text-purple-900">Selected Scenario</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-purple-900">
                    {scenarioTypes.find(s => s.id === formData.scenarioType)?.name}
                  </p>
                  <p className="text-[10px] text-purple-700 mt-1">
                    {scenarioTypes.find(s => s.id === formData.scenarioType)?.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
              <h3 className="text-xs font-semibold text-amber-900 mb-2">Tips</h3>
              <ul className="text-[10px] text-amber-800 space-y-1.5">
                <li>• Keep exercises focused on 1-2 key objectives</li>
                <li>• Include stakeholders from all affected departments</li>
                <li>• Document lessons learned after each exercise</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
