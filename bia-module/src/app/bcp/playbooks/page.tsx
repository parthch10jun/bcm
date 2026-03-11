'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const mockPlaybooks = [
  {
    id: 'PB-001',
    name: 'Cyberattack Response Playbook',
    type: 'Incident Response',
    status: 'Active',
    version: '2.1',
    lastUpdated: '2025-11-10',
    usedInScenarios: 3,
    phases: 5,
    steps: 24,
    owner: 'Sarah Johnson - CISO'
  },
  {
    id: 'PB-002',
    name: 'Power Outage Recovery Playbook',
    type: 'Infrastructure',
    status: 'Active',
    version: '1.5',
    lastUpdated: '2025-10-15',
    usedInScenarios: 2,
    phases: 4,
    steps: 18,
    owner: 'Ahmed Al-Mansouri - Facilities'
  },
  {
    id: 'PB-003',
    name: 'Pandemic Business Continuity Playbook',
    type: 'Health & Safety',
    status: 'Active',
    version: '3.0',
    lastUpdated: '2025-09-20',
    usedInScenarios: 1,
    phases: 6,
    steps: 32,
    owner: 'Mohammed Hassan - HR'
  },
  {
    id: 'PB-004',
    name: 'Supply Chain Disruption Playbook',
    type: 'Operations',
    status: 'Under Review',
    version: '1.2',
    lastUpdated: '2025-11-05',
    usedInScenarios: 1,
    phases: 4,
    steps: 16,
    owner: 'Fatima Al-Rashid - Procurement'
  },
  {
    id: 'PB-005',
    name: 'Natural Disaster Response Playbook',
    type: 'Emergency Response',
    status: 'Draft',
    version: '0.9',
    lastUpdated: '2025-11-18',
    usedInScenarios: 0,
    phases: 5,
    steps: 28,
    owner: 'Khalid bin Salman - Operations'
  },
  {
    id: 'PB-006',
    name: 'Data Breach Response Playbook',
    type: 'Incident Response',
    status: 'Active',
    version: '2.3',
    lastUpdated: '2025-10-25',
    usedInScenarios: 2,
    phases: 5,
    steps: 22,
    owner: 'Sarah Johnson - CISO'
  }
];

export default function BCPPlaybooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPlaybooks = mockPlaybooks.filter(playbook => {
    const matchesSearch = playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || playbook.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || playbook.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockPlaybooks.length,
    active: mockPlaybooks.filter(p => p.status === 'Active').length,
    draft: mockPlaybooks.filter(p => p.status === 'Draft').length,
    totalSteps: mockPlaybooks.reduce((sum, p) => sum + p.steps, 0),
    avgSteps: Math.round(mockPlaybooks.reduce((sum, p) => sum + p.steps, 0) / mockPlaybooks.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-50 border-green-200';
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
              <h1 className="text-2xl font-semibold text-gray-900">Business Continuity Planning</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage scenarios, test execution, incident response, and playbooks
              </p>
            </div>
            <Link
              href="/bcp/playbooks/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Playbook
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
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
          >
            <BookOpenIcon className="mr-2 h-4 w-4 text-gray-900" />
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
                <BookOpenIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Playbooks</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
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
                <p className="text-xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-50 rounded-sm flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Draft</p>
                <p className="text-xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <DocumentDuplicateIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Steps</p>
                <p className="text-xl font-semibold text-gray-900">{stats.totalSteps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-teal-50 rounded-sm flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Avg Steps</p>
                <p className="text-xl font-semibold text-gray-900">{stats.avgSteps}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search playbooks by name, ID, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Types</option>
                <option value="Incident Response">Incident Response</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Health & Safety">Health & Safety</option>
                <option value="Operations">Operations</option>
                <option value="Emergency Response">Emergency Response</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaybooks.map((playbook) => (
            <div key={playbook.id} className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                    <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Link href={`/bcp/playbooks/${playbook.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                      {playbook.name}
                    </Link>
                    <p className="text-[10px] text-gray-500">{playbook.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(playbook.status)}`}>
                  {playbook.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900 font-medium">{playbook.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Version:</span>
                  <span className="text-gray-900 font-medium">v{playbook.version}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Phases:</span>
                  <span className="text-gray-900 font-medium">{playbook.phases}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Steps:</span>
                  <span className="text-gray-900 font-medium">{playbook.steps}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Used in Scenarios:</span>
                  <span className="text-gray-900 font-medium">{playbook.usedInScenarios}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900 font-medium">{playbook.lastUpdated}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[10px] text-gray-500">Owner</p>
                  <p className="text-xs text-gray-900">{playbook.owner}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/bcp/playbooks/${playbook.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
                >
                  <BookOpenIcon className="h-3 w-3" />
                  View
                </Link>
                <button className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-50 transition-colors">
                  <PencilIcon className="h-3 w-3" />
                </button>
                <button className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-50 transition-colors">
                  <DocumentDuplicateIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

