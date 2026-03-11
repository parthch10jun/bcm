'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PlayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  FireIcon,
  ServerIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CommandLineIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

// Crisis Playbooks Data
const playbooks = [
  {
    id: 'CPB-001',
    name: 'Ransomware Attack Response',
    category: 'Cyber Attack',
    icon: LockClosedIcon,
    severity: 'Critical',
    status: 'Active',
    version: '3.2',
    lastUpdated: '2025-11-15',
    owner: 'Sarah Johnson - CISO',
    estimatedTime: '4-8 hours',
    phases: 6,
    steps: 42,
    testedDate: '2025-10-20',
    description: 'Comprehensive response procedure for ransomware incidents including isolation, containment, eradication, and recovery.',
    objectives: [
      'Isolate infected systems within 15 minutes',
      'Preserve forensic evidence',
      'Restore critical systems within RTO',
      'Notify stakeholders per communication plan'
    ]
  },
  {
    id: 'CPB-002',
    name: 'Data Breach Response',
    category: 'Data Security',
    icon: ShieldCheckIcon,
    severity: 'Critical',
    status: 'Active',
    version: '2.8',
    lastUpdated: '2025-11-10',
    owner: 'Ahmed Al-Mansouri - DPO',
    estimatedTime: '24-72 hours',
    phases: 8,
    steps: 56,
    testedDate: '2025-09-15',
    description: 'End-to-end data breach response including detection, containment, investigation, notification, and remediation.',
    objectives: [
      'Contain breach within 1 hour of detection',
      'Complete impact assessment within 24 hours',
      'Notify regulators within 72 hours if required',
      'Document all actions for compliance'
    ]
  },
  {
    id: 'CPB-003',
    name: 'DDoS Attack Mitigation',
    category: 'Network Security',
    icon: GlobeAltIcon,
    severity: 'High',
    status: 'Active',
    version: '2.5',
    lastUpdated: '2025-10-28',
    owner: 'Mohammed Hassan - Network Lead',
    estimatedTime: '1-4 hours',
    phases: 5,
    steps: 28,
    testedDate: '2025-10-05',
    description: 'Rapid response procedures for distributed denial of service attacks targeting organizational infrastructure.',
    objectives: [
      'Activate DDoS protection within 5 minutes',
      'Implement traffic filtering rules',
      'Coordinate with ISP/CDN providers',
      'Restore normal operations'
    ]
  },
  {
    id: 'CPB-004',
    name: 'Insider Threat Response',
    category: 'Insider Threat',
    icon: UserGroupIcon,
    severity: 'High',
    status: 'Active',
    version: '1.9',
    lastUpdated: '2025-10-20',
    owner: 'Fatima Al-Rashid - HR Security',
    estimatedTime: '2-24 hours',
    phases: 7,
    steps: 38,
    testedDate: '2025-08-22',
    description: 'Response procedures for suspected or confirmed insider threat incidents including investigation and containment.',
    objectives: [
      'Secure evidence without alerting subject',
      'Coordinate with HR and Legal',
      'Revoke access privileges appropriately',
      'Document chain of custody'
    ]
  },
  {
    id: 'CPB-005',
    name: 'Zero-Day Exploit Response',
    category: 'Vulnerability',
    icon: BugAntIcon,
    severity: 'Critical',
    status: 'Active',
    version: '2.1',
    lastUpdated: '2025-11-01',
    owner: 'Khalid bin Salman - Threat Intel',
    estimatedTime: '2-8 hours',
    phases: 6,
    steps: 35,
    testedDate: '2025-09-28',
    description: 'Rapid response for zero-day vulnerability exploitation including emergency patching and mitigation.',
    objectives: [
      'Assess exposure within 30 minutes',
      'Implement temporary mitigations',
      'Coordinate emergency patching',
      'Monitor for exploitation attempts'
    ]
  },
  {
    id: 'CPB-006',
    name: 'Critical Infrastructure Failure',
    category: 'Infrastructure',
    icon: ServerIcon,
    severity: 'Critical',
    status: 'Active',
    version: '3.0',
    lastUpdated: '2025-10-15',
    owner: 'David Wilson - Infrastructure',
    estimatedTime: '1-6 hours',
    phases: 5,
    steps: 32,
    testedDate: '2025-10-01',
    description: 'Response procedures for critical infrastructure failures including data centers, networks, and core systems.',
    objectives: [
      'Activate failover within RTO targets',
      'Assess root cause',
      'Restore primary systems',
      'Conduct post-incident review'
    ]
  }
];

export default function CrisisPlaybooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedPlaybook, setSelectedPlaybook] = useState<typeof playbooks[0] | null>(null);

  const categories = ['All', ...Array.from(new Set(playbooks.map(p => p.category)))];

  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch = playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || playbook.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <Link href="/crisis-management" className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Crisis Management
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Crisis Playbooks</h1>
              <p className="mt-1 text-sm text-gray-500">
                Standardized response procedures for cyber crisis scenarios
              </p>
            </div>
            <Link
              href="/crisis-management/playbooks/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4" />
              Create Playbook
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Playbooks</p>
                <p className="text-xl font-semibold text-gray-900">{playbooks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Active</p>
                <p className="text-xl font-semibold text-gray-900">{playbooks.filter(p => p.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-50 rounded-sm flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Critical Severity</p>
                <p className="text-xl font-semibold text-gray-900">{playbooks.filter(p => p.severity === 'Critical').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Avg Response Steps</p>
                <p className="text-xl font-semibold text-gray-900">{Math.round(playbooks.reduce((a, b) => a + b.steps, 0) / playbooks.length)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Playbooks Grid and Detail */}
        <div className="grid grid-cols-3 gap-6">
          {/* Playbooks List */}
          <div className="col-span-2 space-y-3">
            {filteredPlaybooks.map((playbook) => {
              const IconComponent = playbook.icon;
              return (
                <div
                  key={playbook.id}
                  onClick={() => setSelectedPlaybook(playbook)}
                  className={`bg-white border rounded-sm p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedPlaybook?.id === playbook.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-sm flex items-center justify-center flex-shrink-0 ${
                      playbook.severity === 'Critical' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        playbook.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium text-gray-500">{playbook.id}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${getSeverityColor(playbook.severity)}`}>
                          {playbook.severity}
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-100 text-green-700">
                          v{playbook.version}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{playbook.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{playbook.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          {playbook.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <DocumentTextIcon className="h-3 w-3" />
                          {playbook.phases} phases, {playbook.steps} steps
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <UserGroupIcon className="h-3 w-3" />
                          {playbook.owner.split(' - ')[0]}
                        </div>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="col-span-1">
            {selectedPlaybook ? (
              <div className="bg-white border border-gray-200 rounded-sm sticky top-6">
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${
                      selectedPlaybook.severity === 'Critical' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <selectedPlaybook.icon className={`h-5 w-5 ${
                        selectedPlaybook.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{selectedPlaybook.name}</h3>
                      <p className="text-[10px] text-gray-500">{selectedPlaybook.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/crisis-management/playbooks/${selectedPlaybook.id}/execute`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700"
                    >
                      <PlayIcon className="h-3.5 w-3.5" />
                      Execute
                    </Link>
                    <Link
                      href={`/crisis-management/playbooks/${selectedPlaybook.id}`}
                      className="px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-medium text-gray-500 mb-2">Details</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Version</dt>
                        <dd className="font-medium text-gray-900">v{selectedPlaybook.version}</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Last Updated</dt>
                        <dd className="font-medium text-gray-900">{selectedPlaybook.lastUpdated}</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Last Tested</dt>
                        <dd className="font-medium text-gray-900">{selectedPlaybook.testedDate}</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Est. Duration</dt>
                        <dd className="font-medium text-gray-900">{selectedPlaybook.estimatedTime}</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Owner</dt>
                        <dd className="font-medium text-gray-900">{selectedPlaybook.owner}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase font-medium text-gray-500 mb-2">Objectives</h4>
                    <ul className="space-y-2">
                      {selectedPlaybook.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircleIcon className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase font-medium text-gray-500 mb-2">Response Phases</h4>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">Total Phases</span>
                      <span className="font-medium text-gray-900">{selectedPlaybook.phases}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Total Steps</span>
                      <span className="font-medium text-gray-900">{selectedPlaybook.steps}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a playbook to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

