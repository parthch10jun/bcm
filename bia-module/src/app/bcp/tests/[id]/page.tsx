'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PlayIcon,
  CalendarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Mock test data
const mockTests: Record<string, any> = {
  'TEST-001': {
    id: 'TEST-001',
    name: 'Ransomware Attack Response Simulation',
    scenario: 'IRP-001',
    scenarioName: 'Ransomware Attack Response',
    type: 'Full Simulation',
    status: 'Completed',
    result: 'Passed',
    scheduledDate: '2025-10-15',
    completedDate: '2025-10-15',
    duration: '6h 45m',
    participants: 12,
    deviations: 2,
    coordinator: 'Sarah Johnson',
    description: 'Full-scale ransomware attack simulation testing incident detection, containment, eradication, and recovery procedures.',
    objectives: [
      'Validate ransomware detection capabilities within 15 minutes',
      'Test network isolation procedures for infected segments',
      'Verify backup restoration process for critical systems',
      'Assess communication protocols with stakeholders'
    ],
    findings: [
      { type: 'success', text: 'Detection time: 8 minutes (within target)' },
      { type: 'success', text: 'Network isolation completed in 12 minutes' },
      { type: 'warning', text: 'Backup restoration took 45 minutes longer than RTO' },
      { type: 'success', text: 'All stakeholders notified within 30 minutes' }
    ],
    phases: [
      { name: 'Detection & Analysis', duration: '45m', status: 'Passed' },
      { name: 'Containment', duration: '1h 15m', status: 'Passed' },
      { name: 'Eradication', duration: '2h 30m', status: 'Passed with Issues' },
      { name: 'Recovery', duration: '2h 15m', status: 'Passed' }
    ]
  },
  'TEST-002': {
    id: 'TEST-002',
    name: 'Data Breach Tabletop Exercise',
    scenario: 'IRP-002',
    scenarioName: 'Data Breach Containment',
    type: 'Tabletop',
    status: 'Scheduled',
    result: null,
    scheduledDate: '2025-12-20',
    completedDate: null,
    duration: null,
    participants: 8,
    deviations: 0,
    coordinator: 'Ahmed Al-Mansouri',
    description: 'Tabletop exercise to walk through data breach response procedures with key stakeholders.',
    objectives: [
      'Review data breach notification requirements',
      'Test forensic evidence collection procedures',
      'Validate legal and compliance communication channels',
      'Assess customer notification processes'
    ],
    findings: [],
    phases: []
  }
};

export default function TestDetailPage() {
  const params = useParams();
  const testId = params.id as string;
  const test = mockTests[testId] || mockTests['TEST-001'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getResultColor = (result: string | null) => {
    if (!result) return 'bg-gray-100 text-gray-700';
    switch (result) {
      case 'Passed': return 'bg-green-100 text-green-700';
      case 'Passed with Issues': return 'bg-amber-100 text-amber-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <Link href="/bcp/tests" className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Tests
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <BeakerIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">{test.name}</h1>
                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
                {test.result && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getResultColor(test.result)}`}>
                    {test.result}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">{test.description}</p>
            </div>
            {test.status === 'Scheduled' && (
              <Link
                href={`/bcp/tests/${testId}/execute`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700"
              >
                <PlayIcon className="h-4 w-4" />
                Start Test
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-6">
            {/* Test Info Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase font-medium">Scheduled</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{test.scheduledDate}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase font-medium">Duration</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{test.duration || 'Not started'}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase font-medium">Participants</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{test.participants}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span className="text-[10px] uppercase font-medium">Deviations</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{test.deviations}</p>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Objectives</h2>
              <ul className="space-y-2">
                {test.objectives.map((obj: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <ShieldCheckIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phases */}
            {test.phases.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Phases</h2>
                <div className="space-y-3">
                  {test.phases.map((phase: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500">Phase {idx + 1}</span>
                        <span className="text-sm font-medium text-gray-900">{phase.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600">{phase.duration}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                          phase.status === 'Passed' ? 'bg-green-100 text-green-700' :
                          phase.status === 'Passed with Issues' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Findings */}
            {test.findings.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Key Findings</h2>
                <div className="space-y-2">
                  {test.findings.map((finding: any, idx: number) => (
                    <div key={idx} className={`flex items-start gap-2 p-3 rounded-sm ${
                      finding.type === 'success' ? 'bg-green-50' :
                      finding.type === 'warning' ? 'bg-amber-50' : 'bg-red-50'
                    }`}>
                      {finding.type === 'success' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5" />
                      )}
                      <span className="text-sm text-gray-700">{finding.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-[10px] uppercase font-medium text-gray-500">Test ID</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">{test.id}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">{test.type}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-medium text-gray-500">Linked Scenario</dt>
                  <dd className="mt-0.5">
                    <Link href={`/bcp/scenarios/${test.scenario}`} className="text-sm text-blue-600 hover:text-blue-700">
                      {test.scenario} - {test.scenarioName}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-medium text-gray-500">Coordinator</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">{test.coordinator}</dd>
                </div>
                {test.completedDate && (
                  <div>
                    <dt className="text-[10px] uppercase font-medium text-gray-500">Completed</dt>
                    <dd className="text-sm text-gray-900 mt-0.5">{test.completedDate}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

