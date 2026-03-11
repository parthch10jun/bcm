'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  FireIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AIAgent from '@/components/AIAgent';

// Mock data for Incident Response Scenarios
const mockScenarios = [
  {
    id: 'IRP-001',
    name: 'Ransomware Attack Response',
    type: 'Ransomware',
    severity: 'Critical',
    status: 'Active',
    criticality: 98,
    linkedProcesses: 15,
    linkedAssets: 12,
    lastTested: '2025-10-15',
    nextTest: '2026-01-15',
    owner: 'Sarah Johnson - CISO'
  },
  {
    id: 'IRP-002',
    name: 'Data Breach Containment',
    type: 'Data Breach',
    severity: 'Critical',
    status: 'Active',
    criticality: 95,
    linkedProcesses: 18,
    linkedAssets: 15,
    lastTested: '2025-09-20',
    nextTest: '2025-12-20',
    owner: 'Ahmed Al-Mansouri - Security Ops'
  },
  {
    id: 'IRP-003',
    name: 'DDoS Attack Mitigation',
    type: 'DDoS Attack',
    severity: 'High',
    status: 'Active',
    criticality: 88,
    linkedProcesses: 10,
    linkedAssets: 8,
    lastTested: '2025-08-10',
    nextTest: '2026-02-10',
    owner: 'Mohammed Hassan - Network Security'
  },
  {
    id: 'IRP-004',
    name: 'Insider Threat Response',
    type: 'Insider Threat',
    severity: 'High',
    status: 'Under Review',
    criticality: 82,
    linkedProcesses: 8,
    linkedAssets: 5,
    lastTested: '2025-07-05',
    nextTest: '2025-12-05',
    owner: 'Fatima Al-Rashid - SOC Lead'
  },
  {
    id: 'IRP-005',
    name: 'Zero-Day Exploit Response',
    type: 'Zero-Day',
    severity: 'Critical',
    status: 'Active',
    criticality: 92,
    linkedProcesses: 20,
    linkedAssets: 14,
    lastTested: '2025-11-01',
    nextTest: '2026-02-01',
    owner: 'Khalid bin Salman - Threat Intel'
  },
  {
    id: 'IRP-006',
    name: 'Phishing Campaign Response',
    type: 'Phishing',
    severity: 'Medium',
    status: 'Draft',
    criticality: 75,
    linkedProcesses: 6,
    linkedAssets: 4,
    lastTested: null,
    nextTest: '2026-03-01',
    owner: 'Lisa Chen - Security Awareness'
  }
];

export default function BCPPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredScenarios = mockScenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || scenario.type === typeFilter;
    const matchesSeverity = severityFilter === 'All' || scenario.severity === severityFilter;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const stats = {
    total: mockScenarios.length,
    active: mockScenarios.filter(s => s.status === 'Active').length,
    critical: mockScenarios.filter(s => s.severity === 'Critical').length,
    testsScheduled: mockScenarios.filter(s => s.nextTest).length,
    avgCriticality: Math.round(mockScenarios.reduce((sum, s) => sum + s.criticality, 0) / mockScenarios.length)
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Under Review': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Draft': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Incident Response Plan</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage scenarios, test execution, response procedures, and playbooks
              </p>
            </div>
            <Link
              href="/bcp/scenarios/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Scenario
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Segmented Control */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm max-w-4xl">
            <Link
              href="/bcp"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
            >
              <ClipboardDocumentCheckIcon className="mr-2 h-4 w-4 text-gray-900" />
              Scenarios
            </Link>
            <Link
              href="/bcp/playbooks"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Playbooks
            </Link>
            <Link
              href="/bcp/tests"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <BeakerIcon className="mr-2 h-4 w-4" />
              Tests
            </Link>
            <Link
              href="/bcp/incidents"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
              Incidents
            </Link>
            <Link
              href="/bcp/settings"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Cog6ToothIcon className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Scenarios</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 rounded-sm flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Active Plans</p>
                <p className="text-xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-50 rounded-sm flex items-center justify-center">
                <FireIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Critical Severity</p>
                <p className="text-xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <BeakerIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Tests Scheduled</p>
                <p className="text-xl font-semibold text-gray-900">{stats.testsScheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-50 rounded-sm flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Avg Criticality</p>
                <p className="text-xl font-semibold text-gray-900">{stats.avgCriticality}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search scenarios by name, ID, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Types</option>
                <option value="Cyberattack">Cyberattack</option>
                <option value="Power Outage">Power Outage</option>
                <option value="Pandemic">Pandemic</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Natural Disaster">Natural Disaster</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Scenario ID</th>
                  <th style={{width: '20%'}} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th style={{width: '12%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Criticality</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Linked</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Tested</th>
                  <th style={{width: '18%'}} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredScenarios.map((scenario) => (
                  <tr
                    key={scenario.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/bcp/scenarios/${scenario.id}`)}
                  >
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-medium text-blue-600 hover:text-blue-800">
                        {scenario.id}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-medium text-gray-900 truncate block">{scenario.name}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{scenario.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center w-14 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${getSeverityColor(scenario.severity)}`}>
                        {scenario.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center w-14 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(scenario.status)}`}>
                        {scenario.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${scenario.criticality >= 90 ? 'bg-red-600' : scenario.criticality >= 75 ? 'bg-orange-600' : scenario.criticality >= 50 ? 'bg-amber-600' : 'bg-green-600'}`}
                            style={{ width: `${scenario.criticality}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{scenario.criticality}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">
                        {scenario.linkedProcesses}P / {scenario.linkedAssets}A
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{scenario.lastTested || 'Not tested'}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-gray-700 truncate block">{scenario.owner}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Agent */}
      <AIAgent context="bcp" />
    </div>
  );
}
