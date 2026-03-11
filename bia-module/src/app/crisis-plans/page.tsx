'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
  UsersIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface CrisisPlan {
  id: string;
  name: string;
  scenario: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Active' | 'Archived';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  lastUpdated: string;
  nextReview: string;
  affectedLocations: number;
  affectedProcesses: number;
  teamSize: number;
  lastTested?: string;
  testResult?: 'Pass' | 'Partial' | 'Fail';
}

const mockPlans: CrisisPlan[] = [
  {
    id: 'CMP-001',
    name: 'Data Center Outage Response',
    scenario: 'Complete loss of primary data center',
    status: 'Approved',
    severity: 'Critical',
    owner: 'Sarah Johnson',
    lastUpdated: '2025-01-15',
    nextReview: '2025-04-15',
    affectedLocations: 3,
    affectedProcesses: 12,
    teamSize: 15,
    lastTested: '2024-12-10',
    testResult: 'Pass'
  },
  {
    id: 'CMP-002',
    name: 'Cyber Attack Response',
    scenario: 'Ransomware or major security breach',
    status: 'Approved',
    severity: 'Critical',
    owner: 'Mike Chen',
    lastUpdated: '2025-01-20',
    nextReview: '2025-04-20',
    affectedLocations: 5,
    affectedProcesses: 18,
    teamSize: 20,
    lastTested: '2025-01-05',
    testResult: 'Pass'
  },
  {
    id: 'CMP-003',
    name: 'Natural Disaster - Earthquake',
    scenario: 'Major earthquake affecting headquarters',
    status: 'In Review',
    severity: 'High',
    owner: 'David Lee',
    lastUpdated: '2025-02-01',
    nextReview: '2025-05-01',
    affectedLocations: 2,
    affectedProcesses: 8,
    teamSize: 12
  },
  {
    id: 'CMP-004',
    name: 'Pandemic Response',
    scenario: 'Widespread illness affecting workforce',
    status: 'Approved',
    severity: 'High',
    owner: 'Emily Davis',
    lastUpdated: '2024-12-15',
    nextReview: '2025-03-15',
    affectedLocations: 8,
    affectedProcesses: 25,
    teamSize: 18,
    lastTested: '2024-11-20',
    testResult: 'Partial'
  },
  {
    id: 'CMP-005',
    name: 'Supply Chain Disruption',
    scenario: 'Critical vendor failure',
    status: 'Draft',
    severity: 'Medium',
    owner: 'John Smith',
    lastUpdated: '2025-02-10',
    nextReview: '2025-05-10',
    affectedLocations: 4,
    affectedProcesses: 6,
    teamSize: 8
  }
];

export default function CrisisPlansPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const filteredPlans = mockPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.scenario.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || plan.status === statusFilter;
    const matchesSeverity = !severityFilter || plan.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Active': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Archived': return 'bg-gray-50 text-gray-500 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTestResultColor = (result?: string) => {
    switch (result) {
      case 'Pass': return 'text-green-600';
      case 'Partial': return 'text-yellow-600';
      case 'Fail': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
              Crisis Management Plans
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive crisis response plans with dependency mapping and team structures
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/crisis-plans/dependency-analysis"
              className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-sm hover:bg-red-50"
            >
              <ChartBarIcon className="h-4 w-4" />
              Dependency Analysis
            </Link>
            <Link
              href="/crisis-plans/new"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
            >
              <PlusIcon className="h-4 w-4" />
              Create Crisis Plan
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockPlans.length}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {mockPlans.filter(p => p.status === 'Approved').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Critical Severity</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {mockPlans.filter(p => p.severity === 'Critical').length}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Needs Review</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {mockPlans.filter(p => new Date(p.nextReview) < new Date(Date.now() + 30*24*60*60*1000)).length}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Test</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <Link href={`/crisis-plans/${plan.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {plan.id}
                      </Link>
                      <p className="text-xs text-gray-900 mt-0.5">{plan.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600">{plan.scenario}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getSeverityColor(plan.severity)}`}>
                      {plan.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {plan.affectedLocations}
                      </div>
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="h-3.5 w-3.5" />
                        {plan.affectedProcesses}
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-3.5 w-3.5" />
                        {plan.teamSize}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-900">{plan.owner}</p>
                  </td>
                  <td className="px-4 py-3">
                    {plan.lastTested ? (
                      <div>
                        <p className="text-xs text-gray-600">{plan.lastTested}</p>
                        <p className={`text-xs font-medium ${getTestResultColor(plan.testResult)}`}>
                          {plan.testResult}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Not tested</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/crisis-plans/${plan.id}`}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/crisis-plans/${plan.id}/edit`}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="More actions"
                        onClick={() => setOpenActionMenu(openActionMenu === plan.id ? null : plan.id)}
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-sm">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No crisis plans found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new crisis management plan.</p>
            <div className="mt-6">
              <Link
                href="/crisis-plans/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
              >
                <PlusIcon className="h-4 w-4" />
                Create Crisis Plan
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

