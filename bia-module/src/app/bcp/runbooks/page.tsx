'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CommandLineIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  BoltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

// Mock data for runbooks
const cyberRunbooks = [
  {
    id: 'CRB-001',
    name: 'Ransomware Isolation Runbook',
    description: 'Step-by-step procedure for isolating ransomware-infected systems to prevent lateral movement',
    category: 'Containment',
    linkedIRP: 'IRP-001',
    irpName: 'Ransomware Attack Response',
    status: 'Ready',
    steps: 24,
    estimatedTime: '45 min',
    lastExecuted: '2025-11-15',
    executionResult: 'Success',
    automated: true,
    owner: 'SOC Lead',
    phase: 'Containment',
    criticality: 'Critical'
  },
  {
    id: 'CRB-002',
    name: 'Forensic Evidence Collection',
    description: 'Procedures for collecting and preserving digital evidence for incident investigation and legal proceedings',
    category: 'Investigation',
    linkedIRP: 'IRP-001',
    irpName: 'Ransomware Attack Response',
    status: 'Ready',
    steps: 32,
    estimatedTime: '2 hours',
    lastExecuted: '2025-10-20',
    executionResult: 'Success',
    automated: false,
    owner: 'Forensics Lead',
    phase: 'Detection & Analysis',
    criticality: 'High'
  },
  {
    id: 'CRB-003',
    name: 'Credential Reset Procedures',
    description: 'Mass credential reset workflow for compromised accounts including service accounts and privileged access',
    category: 'Eradication',
    linkedIRP: 'IRP-001',
    irpName: 'Ransomware Attack Response',
    status: 'Ready',
    steps: 18,
    estimatedTime: '1 hour',
    lastExecuted: '2025-11-01',
    executionResult: 'Success',
    automated: true,
    owner: 'IAM Team',
    phase: 'Eradication',
    criticality: 'Critical'
  },
  {
    id: 'CRB-004',
    name: 'SEBI/CERT-In Notification Runbook',
    description: 'Regulatory notification procedures for cyber incidents as per SEBI Circular and CERT-In guidelines',
    category: 'Compliance',
    linkedIRP: 'IRP-001',
    irpName: 'Ransomware Attack Response',
    status: 'Ready',
    steps: 12,
    estimatedTime: '30 min',
    lastExecuted: '2025-09-15',
    executionResult: 'Success',
    automated: false,
    owner: 'Compliance',
    phase: 'Post-Incident',
    criticality: 'Critical'
  },
  {
    id: 'CRB-005',
    name: 'DDoS Traffic Scrubbing',
    description: 'Procedures for activating CDN-based traffic scrubbing and rate limiting during DDoS attacks',
    category: 'Containment',
    linkedIRP: 'IRP-003',
    irpName: 'DDoS Attack Mitigation',
    status: 'Ready',
    steps: 16,
    estimatedTime: '20 min',
    lastExecuted: '2025-10-10',
    executionResult: 'Success',
    automated: true,
    owner: 'Network Security',
    phase: 'Containment',
    criticality: 'High'
  },
  {
    id: 'CRB-006',
    name: 'Data Breach Notification',
    description: 'Customer and regulatory notification procedures for data breach incidents per DPDP Act 2023',
    category: 'Compliance',
    linkedIRP: 'IRP-002',
    irpName: 'Data Breach Containment',
    status: 'Ready',
    steps: 20,
    estimatedTime: '2 hours',
    lastExecuted: null,
    executionResult: null,
    automated: false,
    owner: 'Legal & Compliance',
    phase: 'Post-Incident',
    criticality: 'Critical'
  },
  {
    id: 'CRB-007',
    name: 'Malware Eradication Checklist',
    description: 'Comprehensive checklist for removing malware from infected endpoints and validating clean state',
    category: 'Eradication',
    linkedIRP: 'IRP-004',
    irpName: 'Malware Outbreak Response',
    status: 'Draft',
    steps: 28,
    estimatedTime: '1.5 hours',
    lastExecuted: null,
    executionResult: null,
    automated: false,
    owner: 'Endpoint Security',
    phase: 'Eradication',
    criticality: 'High'
  },
  {
    id: 'CRB-008',
    name: 'Insider Threat Investigation',
    description: 'Investigation procedures for suspected insider threat incidents including evidence gathering and HR coordination',
    category: 'Investigation',
    linkedIRP: 'IRP-005',
    irpName: 'Insider Threat Response',
    status: 'Ready',
    steps: 22,
    estimatedTime: '3 hours',
    lastExecuted: '2025-08-20',
    executionResult: 'Partial',
    automated: false,
    owner: 'Security Ops',
    phase: 'Detection & Analysis',
    criticality: 'High'
  }
];

export default function CyberRunbooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRunbooks = cyberRunbooks.filter(rb => {
    const matchesSearch = rb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rb.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || rb.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || rb.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Containment': return 'bg-red-100 text-red-700 border-red-200';
      case 'Investigation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Eradication': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Compliance': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: cyberRunbooks.length,
    ready: cyberRunbooks.filter(r => r.status === 'Ready').length,
    automated: cyberRunbooks.filter(r => r.automated).length,
    avgSteps: Math.round(cyberRunbooks.reduce((sum, r) => sum + r.steps, 0) / cyberRunbooks.length)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back to IRP
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Cyber Runbooks</h1>
                <p className="text-sm text-gray-500 mt-1">Step-by-step procedures for incident response execution</p>
              </div>
            </div>
            <Link
              href="/bcp/runbooks/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800"
            >
              <CommandLineIcon className="h-4 w-4" />
              Create Runbook
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-sm">
                  <CommandLineIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Total Runbooks</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-sm">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.ready}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Ready</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-sm">
                  <CpuChipIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{stats.automated}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Automated</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-sm">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stats.avgSteps}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Avg Steps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search runbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="all">All Categories</option>
              <option value="Containment">Containment</option>
              <option value="Investigation">Investigation</option>
              <option value="Eradication">Eradication</option>
              <option value="Compliance">Compliance</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="all">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Runbooks Table */}
      <div className="px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Runbook</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Linked IRP</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Steps</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Last Executed</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRunbooks.map((rb) => (
                <tr key={rb.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600">{rb.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {rb.automated && (
                        <BoltIcon className="h-4 w-4 text-purple-500" title="Automated" />
                      )}
                      <div>
                        <Link href={`/bcp/runbooks/${rb.id}`} className="text-xs font-medium text-gray-900 hover:text-gray-700">
                          {rb.name}
                        </Link>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{rb.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-sm border ${getCategoryColor(rb.category)}`}>
                      {rb.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/bcp/scenarios/${rb.linkedIRP}`} className="text-xs text-blue-600 hover:text-blue-800">
                      {rb.linkedIRP}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-900">{rb.steps}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{rb.estimatedTime}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {rb.lastExecuted ? (
                      <div className="flex items-center gap-2">
                        {rb.executionResult === 'Success' && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                        {rb.executionResult === 'Partial' && <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />}
                        <span className="text-xs text-gray-600">{rb.lastExecuted}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-sm border ${getStatusColor(rb.status)}`}>
                      {rb.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/bcp/runbooks/${rb.id}`}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Link>
                      {rb.status === 'Ready' && (
                        <Link
                          href={`/bcp/runbooks/${rb.id}?execute=true`}
                          className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                        >
                          <PlayIcon className="h-3 w-3" />
                          Execute
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRunbooks.length === 0 && (
          <div className="text-center py-12">
            <CommandLineIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No runbooks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

