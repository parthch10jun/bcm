'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  BoltIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  BeakerIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const mockIncidents = [
  {
    id: 'INC-001',
    title: 'Ransomware Attack on Finance Systems',
    type: 'Cyberattack',
    severity: 'Critical',
    status: 'Resolved',
    reportedDate: '2025-10-15 08:30',
    resolvedDate: '2025-10-17 14:45',
    duration: '54h 15m',
    affectedSystems: 8,
    impactedProcesses: 12,
    playbook: 'PB-001',
    coordinator: 'Sarah Johnson'
  },
  {
    id: 'INC-002',
    title: 'Data Center Power Failure',
    type: 'Infrastructure',
    severity: 'High',
    status: 'In Progress',
    reportedDate: '2025-11-18 14:20',
    resolvedDate: null,
    duration: '6h 30m',
    affectedSystems: 15,
    impactedProcesses: 18,
    playbook: 'PB-002',
    coordinator: 'Ahmed Al-Mansouri'
  },
  {
    id: 'INC-003',
    title: 'COVID-19 Outbreak in Operations Team',
    type: 'Health & Safety',
    severity: 'Medium',
    status: 'Monitoring',
    reportedDate: '2025-11-10 09:00',
    resolvedDate: null,
    duration: '8 days',
    affectedSystems: 0,
    impactedProcesses: 5,
    playbook: 'PB-003',
    coordinator: 'Mohammed Hassan'
  },
  {
    id: 'INC-004',
    title: 'Supplier Bankruptcy - Critical Vendor',
    type: 'Supply Chain',
    severity: 'High',
    status: 'Resolved',
    reportedDate: '2025-09-05 11:00',
    resolvedDate: '2025-09-20 16:30',
    duration: '15 days',
    affectedSystems: 3,
    impactedProcesses: 8,
    playbook: 'PB-004',
    coordinator: 'Fatima Al-Rashid'
  },
  {
    id: 'INC-005',
    title: 'Severe Weather - Office Evacuation',
    type: 'Natural Disaster',
    severity: 'Medium',
    status: 'Resolved',
    reportedDate: '2025-08-22 13:45',
    resolvedDate: '2025-08-23 10:00',
    duration: '20h 15m',
    affectedSystems: 0,
    impactedProcesses: 10,
    playbook: 'PB-005',
    coordinator: 'Khalid bin Salman'
  },
  {
    id: 'INC-006',
    title: 'Customer Data Breach - Unauthorized Access',
    type: 'Cyberattack',
    severity: 'Critical',
    status: 'Under Investigation',
    reportedDate: '2025-11-17 22:15',
    resolvedDate: null,
    duration: '1 day',
    affectedSystems: 4,
    impactedProcesses: 6,
    playbook: 'PB-006',
    coordinator: 'Sarah Johnson'
  }
];

export default function BCPIncidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || incident.type === typeFilter;
    const matchesSeverity = severityFilter === 'All' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || incident.status === statusFilter;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: mockIncidents.length,
    active: mockIncidents.filter(i => i.status === 'In Progress' || i.status === 'Under Investigation' || i.status === 'Monitoring').length,
    critical: mockIncidents.filter(i => i.severity === 'Critical').length,
    resolved: mockIncidents.filter(i => i.status === 'Resolved').length,
    avgResolutionTime: '2.5 days'
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
      case 'Resolved': return 'text-green-700 bg-green-50 border-green-200';
      case 'In Progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Under Investigation': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Monitoring': return 'text-amber-700 bg-amber-50 border-amber-200';
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
              <h1 className="text-2xl font-semibold text-gray-900">Business Continuity Planning</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage scenarios, test execution, incident response, and playbooks
              </p>
            </div>
            <Link
              href="/bcp/incidents/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Report Incident
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
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ClipboardDocumentCheckIcon className="mr-2 h-4 w-4" />
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
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
          >
            <ExclamationTriangleIcon className="mr-2 h-4 w-4 text-gray-900" />
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
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Incidents</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-50 rounded-sm flex items-center justify-center">
                <BoltIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Active</p>
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
                <p className="text-[10px] uppercase font-medium text-gray-500">Critical</p>
                <p className="text-xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Resolved</p>
                <p className="text-xl font-semibold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Avg Resolution</p>
                <p className="text-xl font-semibold text-gray-900">{stats.avgResolutionTime}</p>
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
                placeholder="Search incidents by title, ID, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="All">All Types</option>
                <option value="Cyberattack">Cyberattack</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Health & Safety">Health & Safety</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Natural Disaster">Natural Disaster</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{width: '30%'}} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th style={{width: '12%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th style={{width: '14%'}} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Coordinator</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-3 py-2.5">
                      <Link href={`/bcp/incidents/${incident.id}`} className="text-xs font-medium text-gray-900 hover:text-gray-700 truncate block">
                        {incident.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{incident.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center w-14 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center px-2 py-0.5 rounded-sm text-[10px] font-medium border whitespace-nowrap ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{incident.reportedDate}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{incident.duration}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">
                        {incident.affectedSystems}S / {incident.impactedProcesses}P
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-gray-700 truncate block">{incident.coordinator}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

