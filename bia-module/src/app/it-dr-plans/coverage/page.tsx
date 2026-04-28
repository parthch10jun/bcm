'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ServerIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Mock data for DR coverage
const mockCriticalSystems = [
  {
    id: 'SYS-001',
    name: 'Core Banking System',
    category: 'Application',
    tier: 'Tier 1',
    rto: '2h',
    rpo: '15min',
    coverageStatus: 'covered',
    drPlan: 'DR-APP-001',
    recoveryStrategy: 'Active-Active',
    lastTested: '2024-10-15',
    nextTestDue: '2024-12-15',
    dependencies: ['SYS-002', 'SYS-004', 'VND-001'],
    businessProcesses: ['Financial Reporting', 'Transaction Processing'],
  },
  {
    id: 'SYS-002',
    name: 'Primary Data Center',
    category: 'Infrastructure',
    tier: 'Tier 1',
    rto: '1h',
    rpo: '5min',
    coverageStatus: 'covered',
    drPlan: 'DR-INF-001',
    recoveryStrategy: 'Hot Site',
    lastTested: '2024-11-01',
    nextTestDue: '2025-01-01',
    dependencies: ['VND-002'],
    businessProcesses: ['All Core Operations'],
  },
  {
    id: 'SYS-003',
    name: 'Customer Database',
    category: 'Data',
    tier: 'Tier 1',
    rto: '2h',
    rpo: '15min',
    coverageStatus: 'partial',
    drPlan: 'DR-DATA-001 (Draft)',
    recoveryStrategy: 'Warm Site',
    lastTested: '2024-09-20',
    nextTestDue: '2024-11-20',
    dependencies: ['SYS-002'],
    businessProcesses: ['Customer Service', 'Sales'],
  },
  {
    id: 'SYS-004',
    name: 'Payment Gateway',
    category: 'Application',
    tier: 'Tier 1',
    rto: '4h',
    rpo: '30min',
    coverageStatus: 'not-covered',
    drPlan: null,
    recoveryStrategy: null,
    lastTested: null,
    nextTestDue: null,
    dependencies: ['VND-003', 'SYS-002'],
    businessProcesses: ['Payment Processing'],
  },
  {
    id: 'SYS-005',
    name: 'Email Server',
    category: 'Infrastructure',
    tier: 'Tier 2',
    rto: '8h',
    rpo: '1h',
    coverageStatus: 'covered',
    drPlan: 'DR-INF-002',
    recoveryStrategy: 'Warm Site',
    lastTested: '2024-10-10',
    nextTestDue: '2025-01-10',
    dependencies: ['SYS-002'],
    businessProcesses: ['Internal Communications'],
  },
  {
    id: 'SYS-006',
    name: 'File Share Server',
    category: 'Infrastructure',
    tier: 'Tier 2',
    rto: '12h',
    rpo: '4h',
    coverageStatus: 'partial',
    drPlan: 'DR-INF-003 (Draft)',
    recoveryStrategy: 'Cold Site',
    lastTested: null,
    nextTestDue: null,
    dependencies: ['SYS-002'],
    businessProcesses: ['Document Management'],
  },
  {
    id: 'SYS-007',
    name: 'Web Portal',
    category: 'Application',
    tier: 'Tier 1',
    rto: '4h',
    rpo: '1h',
    coverageStatus: 'not-covered',
    drPlan: null,
    recoveryStrategy: null,
    lastTested: null,
    nextTestDue: null,
    dependencies: ['SYS-002', 'SYS-003'],
    businessProcesses: ['Customer Self-Service'],
  },
  {
    id: 'SYS-008',
    name: 'Active Directory',
    category: 'Infrastructure',
    tier: 'Tier 1',
    rto: '1h',
    rpo: '15min',
    coverageStatus: 'covered',
    drPlan: 'DR-INF-004',
    recoveryStrategy: 'Active-Active',
    lastTested: '2024-11-05',
    nextTestDue: '2025-02-05',
    dependencies: [],
    businessProcesses: ['All Authentication Services'],
  },
];

const coverageStatusConfig = {
  covered: {
    label: 'Covered',
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
  partial: {
    label: 'Partial',
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
  },
  'not-covered': {
    label: 'Not Covered',
    icon: XCircleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
  },
};

export default function DRCoveragePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate statistics
  const totalSystems = mockCriticalSystems.length;
  const coveredSystems = mockCriticalSystems.filter(s => s.coverageStatus === 'covered').length;
  const partialSystems = mockCriticalSystems.filter(s => s.coverageStatus === 'partial').length;
  const notCoveredSystems = mockCriticalSystems.filter(s => s.coverageStatus === 'not-covered').length;
  const tier1Systems = mockCriticalSystems.filter(s => s.tier === 'Tier 1').length;
  const tier1Covered = mockCriticalSystems.filter(s => s.tier === 'Tier 1' && s.coverageStatus === 'covered').length;

  // Filter systems
  const filteredSystems = mockCriticalSystems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || system.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || system.coverageStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || system.category === categoryFilter;
    
    return matchesSearch && matchesTier && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DR Coverage Dashboard</h1>
              <p className="mt-1 text-xs text-gray-500">
                Enterprise critical and core infrastructure disaster recovery coverage
              </p>
            </div>
            <Link
              href="/it-dr-plans/new"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4" />
              Create DR Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Coverage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Systems */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500 tracking-wider">Total Critical Systems</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{totalSystems}</p>
              </div>
              <ServerIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          {/* Covered */}
          <div className="bg-green-50 border border-green-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-medium text-green-700 tracking-wider">Fully Covered</p>
                <p className="mt-1 text-2xl font-semibold text-green-900">{coveredSystems}</p>
                <p className="text-[10px] text-green-600">{Math.round((coveredSystems / totalSystems) * 100)}% coverage</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          {/* Partial */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-medium text-yellow-700 tracking-wider">Partial Coverage</p>
                <p className="mt-1 text-2xl font-semibold text-yellow-900">{partialSystems}</p>
                <p className="text-[10px] text-yellow-600">Draft plans</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          {/* Not Covered */}
          <div className="bg-red-50 border border-red-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-medium text-red-700 tracking-wider">Not Covered</p>
                <p className="mt-1 text-2xl font-semibold text-red-900">{notCoveredSystems}</p>
                <p className="text-[10px] text-red-600">Action required</p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tier 1 Coverage Metric */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-semibold text-gray-900">Tier 1 Critical Systems Coverage</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">All Tier 1 systems must have approved DR plans</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{tier1Covered}/{tier1Systems}</p>
              <p className="text-[10px] text-gray-500">{Math.round((tier1Covered / tier1Systems) * 100)}% covered</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-sm h-3 overflow-hidden">
            <div
              className={`h-full ${tier1Covered === tier1Systems ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${(tier1Covered / tier1Systems) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Search Systems
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="System ID or name..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Tier
              </label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Tiers</option>
                <option value="Tier 1">Tier 1 (Critical)</option>
                <option value="Tier 2">Tier 2 (Important)</option>
                <option value="Tier 3">Tier 3 (Standard)</option>
                <option value="Tier 4">Tier 4 (Non-Critical)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Coverage Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Status</option>
                <option value="covered">Fully Covered</option>
                <option value="partial">Partial Coverage</option>
                <option value="not-covered">Not Covered</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Categories</option>
                <option value="Application">Application</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Data">Data</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coverage Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    System ID
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    System Name
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    RTO/RPO
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Coverage Status
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    DR Plan
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Recovery Strategy
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Last Tested
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSystems.map(system => {
                  const statusConfig = coverageStatusConfig[system.coverageStatus as keyof typeof coverageStatusConfig];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={system.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-900">{system.id}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-xs text-gray-900">{system.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {system.businessProcesses.slice(0, 2).join(', ')}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-gray-700">{system.category}</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                          system.tier === 'Tier 1' ? 'bg-red-50 text-red-700 border-red-200' :
                          system.tier === 'Tier 2' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {system.tier}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-700">
                        {system.rto} / {system.rpo}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {system.drPlan ? (
                          <Link
                            href={`/it-dr-plans/${system.drPlan.split(' ')[0]}`}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {system.drPlan}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {system.recoveryStrategy ? (
                          <span className="text-xs text-gray-700">{system.recoveryStrategy}</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {system.lastTested ? (
                          <div>
                            <p className="text-xs text-gray-700">{system.lastTested}</p>
                            {system.nextTestDue && (
                              <p className="text-[10px] text-gray-500">Next: {system.nextTestDue}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not tested</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-right">
                        {system.coverageStatus === 'not-covered' ? (
                          <Link
                            href={`/it-dr-plans/new?system=${system.id}`}
                            className="text-xs text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1"
                          >
                            Create Plan
                            <ChevronRightIcon className="h-3 w-3" />
                          </Link>
                        ) : (
                          <Link
                            href={`/it-dr-plans/${system.drPlan?.split(' ')[0]}`}
                            className="text-xs text-gray-900 hover:text-gray-600 font-medium inline-flex items-center gap-1"
                          >
                            View
                            <ChevronRightIcon className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredSystems.length === 0 && (
            <div className="text-center py-12">
              <ServerIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No systems found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Action Required Alert */}
        {notCoveredSystems > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900">Action Required</h3>
                <p className="mt-1 text-xs text-red-700">
                  {notCoveredSystems} critical system{notCoveredSystems > 1 ? 's' : ''} {notCoveredSystems > 1 ? 'have' : 'has'} no DR coverage.
                  Create DR plans to ensure business continuity compliance.
                </p>
                <Link
                  href="/it-dr-plans/new"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900"
                >
                  Create DR Plan
                  <ChevronRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
