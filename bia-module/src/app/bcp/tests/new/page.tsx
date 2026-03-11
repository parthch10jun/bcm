'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BeakerIcon,
  CalendarIcon,
  PlayIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Sample BCP scenarios
const bcpScenarios = [
  { id: 'BCP-001', name: 'Cyberattack Response & Recovery', type: 'Cyberattack', severity: 'Critical', linkedBia: 'Payment Processing System' },
  { id: 'BCP-002', name: 'Power Outage Recovery', type: 'Power Outage', severity: 'High', linkedBia: 'Core Banking System' },
  { id: 'BCP-003', name: 'Pandemic Response Plan', type: 'Pandemic', severity: 'High', linkedBia: 'Customer Portal' },
  { id: 'BCP-004', name: 'Supply Chain Disruption', type: 'Supply Chain', severity: 'Medium', linkedBia: 'Supply Chain Management' }
];

function NewTestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get('scenario');
  const mode = searchParams.get('mode') || 'schedule';

  const [formData, setFormData] = useState({
    name: '',
    scenarioId: scenarioId || '',
    testType: 'tabletop',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    duration: '2',
    participants: '',
    objectives: '',
    scope: '',
    coordinator: ''
  });

  const selectedScenario = bcpScenarios.find(s => s.id === formData.scenarioId);

  useEffect(() => {
    if (selectedScenario && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: `${selectedScenario.name} - ${mode === 'initiate' ? 'Immediate' : 'Scheduled'} Test`,
        objectives: `Test the organization's ability to execute ${selectedScenario.name} procedures`,
        scope: `All systems and processes linked to ${selectedScenario.linkedBia}`
      }));
    }
  }, [selectedScenario, mode]);

  const handleSubmit = () => {
    console.log('Creating test:', { ...formData, mode });
    if (mode === 'initiate') {
      router.push(`/bcp/tests/TEST-NEW/execute`);
    } else {
      router.push('/bcp/tests');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/bcp/tests"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              Back
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === 'initiate' ? 'Initiate Test Now' : 'Schedule New Test'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {mode === 'initiate' 
                  ? 'Start a test exercise immediately from the selected BCP scenario'
                  : 'Schedule a future test exercise for the selected BCP scenario'
                }
              </p>
            </div>
          </div>
          {mode === 'initiate' && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <PlayIcon className="h-3 w-3" />
              Immediate Execution
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6">
          {/* BCP Scenario Selection */}
          <div>
            <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
              BCP Scenario *
            </label>
            <select
              value={formData.scenarioId}
              onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Select a BCP scenario...</option>
              {bcpScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.id} - {scenario.name} ({scenario.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Scenario Info */}
          {selectedScenario && (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-900">{selectedScenario.name}</p>
                  <p className="text-[10px] text-blue-700 mt-0.5">
                    Type: {selectedScenario.type} | Severity: {selectedScenario.severity}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-1">
                    Linked BIA: {selectedScenario.linkedBia}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Name */}
          <div>
            <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
              Test Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter test name..."
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Test Type & Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                Test Type *
              </label>
              <select
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="tabletop">Tabletop Exercise</option>
                <option value="walkthrough">Walkthrough Test</option>
                <option value="simulation">Full Simulation</option>
                <option value="functional">Functional Test</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                {mode === 'initiate' ? 'Start Time' : 'Scheduled Date'} *
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-24 px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Duration & Coordinator */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                Expected Duration (hours)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2"
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                Test Coordinator
              </label>
              <input
                type="text"
                value={formData.coordinator}
                onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                placeholder="Enter coordinator name..."
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
              Test Objectives
            </label>
            <textarea
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              placeholder="What are the key objectives for this test?"
              rows={3}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Scope */}
          <div>
            <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
              Test Scope
            </label>
            <textarea
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              placeholder="Define the scope of this test..."
              rows={3}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link
              href="/bcp/tests"
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!formData.scenarioId || !formData.name}
              className={`px-4 py-2 text-xs font-medium rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'initiate'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {mode === 'initiate' ? (
                <>
                  <PlayIcon className="h-4 w-4" />
                  Start Test Now
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  Schedule Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <NewTestPageContent />
    </Suspense>
  );
}
