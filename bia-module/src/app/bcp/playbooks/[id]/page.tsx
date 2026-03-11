'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function PlaybookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playbookId = params.id as string;

  // Mock playbook data
  const playbook = {
    id: playbookId,
    name: 'Cyberattack Response Playbook',
    type: 'Cyberattack',
    version: 'v2.1',
    status: 'Active',
    owner: 'Sarah Johnson - CISO',
    lastUpdated: '2025-10-15',
    created: '2024-01-10',
    description: 'Comprehensive playbook for responding to and recovering from cyberattack incidents including ransomware, DDoS, and data breaches.',
    phases: [
      {
        id: 1,
        name: 'Detection & Assessment',
        duration: '30 minutes',
        steps: [
          'Identify the nature and scope of the cyberattack',
          'Assess impact on critical systems and data',
          'Determine attack vector and entry point',
          'Classify incident severity level'
        ]
      },
      {
        id: 2,
        name: 'Containment',
        duration: '1 hour',
        steps: [
          'Isolate affected systems from network',
          'Block malicious IP addresses and domains',
          'Disable compromised user accounts',
          'Preserve evidence for forensic analysis'
        ]
      },
      {
        id: 3,
        name: 'Eradication',
        duration: '2 hours',
        steps: [
          'Remove malware and malicious code',
          'Patch vulnerabilities exploited in attack',
          'Reset compromised credentials',
          'Verify system integrity'
        ]
      },
      {
        id: 4,
        name: 'Recovery',
        duration: '4 hours',
        steps: [
          'Restore systems from clean backups',
          'Gradually bring systems back online',
          'Monitor for signs of persistent threats',
          'Validate business operations resumption'
        ]
      },
      {
        id: 5,
        name: 'Post-Incident Review',
        duration: '1 week',
        steps: [
          'Conduct thorough incident analysis',
          'Document lessons learned',
          'Update security controls and procedures',
          'Brief stakeholders and management'
        ]
      }
    ],
    usageCount: 8,
    avgExecutionTime: '7.5 hours',
    successRate: '94%'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp/playbooks"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{playbook.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {playbook.type} • Version {playbook.version} • Last updated {playbook.lastUpdated}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                <DocumentDuplicateIcon className="h-4 w-4" />
                Duplicate
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-sm hover:bg-red-50 transition-colors">
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-xs text-gray-600">{playbook.description}</p>
            </div>

            {/* Phases */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Playbook Phases</h2>
              <div className="space-y-4">
                {playbook.phases.map((phase, index) => (
                  <div key={phase.id} className="border border-gray-200 rounded-sm p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-orange-700">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-gray-900">{phase.name}</h3>
                          <p className="text-[10px] text-gray-500">Duration: {phase.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {phase.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Status</label>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-sm">
                    {playbook.status}
                  </span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Owner</label>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-700">{playbook.owner}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Created</label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-700">{playbook.created}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Last Updated</label>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-700">{playbook.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Usage Statistics</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Times Used</label>
                  <span className="text-lg font-semibold text-gray-900">{playbook.usageCount}</span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Avg Execution Time</label>
                  <span className="text-lg font-semibold text-gray-900">{playbook.avgExecutionTime}</span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1">Success Rate</label>
                  <span className="text-lg font-semibold text-green-600">{playbook.successRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


