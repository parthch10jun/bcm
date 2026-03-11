'use client';

import { useState } from 'react';
import Link from 'next/link';
import AIAgent from '@/components/AIAgent';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function RunbooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [enablerFilter, setEnablerFilter] = useState<string>('all');

  const runbooks = [
    {
      id: 'RB-001',
      name: 'People Displacement - Work from Home Activation',
      description: 'Step-by-step guide for activating remote work protocols during mass displacement',
      linkedBCPPlan: 'BCP-001',
      enablerType: 'Human Resources',
      strategy: 'Work from Home / Alternate Site',
      steps: 12,
      avgExecutionTime: '45 minutes',
      lastExecuted: '2024-11-10',
      executionStatus: 'Success',
      owner: 'John Smith',
      status: 'Active'
    },
    {
      id: 'RB-002',
      name: 'Building Evacuation - Alternate Facility Setup',
      description: 'Procedures for evacuating building and activating alternate facility',
      linkedBCPPlan: 'BCP-002',
      enablerType: 'Building',
      strategy: 'Alternate Facility Activation',
      steps: 8,
      avgExecutionTime: '30 minutes',
      lastExecuted: '2024-10-25',
      executionStatus: 'Success',
      owner: 'Sarah Johnson',
      status: 'Active'
    },
    {
      id: 'RB-003',
      name: 'Technology Failover - DR Site Activation',
      description: 'Runbook for failing over critical systems to disaster recovery site',
      linkedBCPPlan: 'BCP-003',
      enablerType: 'Technology',
      strategy: 'Failover to DR Site',
      steps: 15,
      avgExecutionTime: '60 minutes',
      lastExecuted: null,
      executionStatus: null,
      owner: 'Mike Chen',
      status: 'Draft'
    },
    {
      id: 'RB-004',
      name: 'Equipment Failure - Backup Deployment',
      description: 'Procedures for deploying backup equipment during critical failures',
      linkedBCPPlan: 'BCP-004',
      enablerType: 'Equipment',
      strategy: 'Backup Equipment Deployment',
      steps: 10,
      avgExecutionTime: '40 minutes',
      lastExecuted: '2024-09-15',
      executionStatus: 'Success',
      owner: 'David Wilson',
      status: 'Active'
    },
    {
      id: 'RB-005',
      name: 'Vendor Disruption - Alternate Vendor Activation',
      description: 'Runbook for activating alternate vendors during primary vendor disruption',
      linkedBCPPlan: 'BCP-005',
      enablerType: 'Vendors',
      strategy: 'Alternate Vendor Activation',
      steps: 7,
      avgExecutionTime: '25 minutes',
      lastExecuted: '2024-11-05',
      executionStatus: 'Success',
      owner: 'Emily Davis',
      status: 'Active'
    },
    {
      id: 'RB-006',
      name: 'Vital Records Loss - Backup Restoration',
      description: 'Procedures for restoring vital records from backup systems',
      linkedBCPPlan: 'BCP-006',
      enablerType: 'Vital Records',
      strategy: 'Backup Restoration',
      steps: 9,
      avgExecutionTime: '35 minutes',
      lastExecuted: null,
      executionStatus: null,
      owner: 'Robert Lee',
      status: 'Draft'
    }
  ];

  const filteredRunbooks = runbooks.filter(rb => {
    const matchesSearch = rb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rb.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rb.status === statusFilter;
    const matchesEnabler = enablerFilter === 'all' || rb.enablerType === enablerFilter;
    return matchesSearch && matchesStatus && matchesEnabler;
  });

  const stats = {
    total: runbooks.length,
    active: runbooks.filter(r => r.status === 'Active').length,
    draft: runbooks.filter(r => r.status === 'Draft').length,
    avgSteps: Math.round(runbooks.reduce((sum, r) => sum + r.steps, 0) / runbooks.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200';
      case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getExecutionIcon = (status: string | null) => {
    if (!status) return <ClockIcon className="h-4 w-4 text-gray-400" />;
    if (status === 'Success') return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
  };

  const getEnablerColor = (enablerType: string) => {
    switch (enablerType) {
      case 'Human Resources': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Building': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Technology': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Equipment': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Vendors': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Vital Records': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Business Continuity Plans</h1>
              <p className="text-sm text-gray-500 mt-1">Enabler-specific runbooks and procedures</p>
            </div>
            <Link
              href="/it-dr-plans/runbooks/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Runbook
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation - Segmented Control */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm">
            <Link
              href="/it-dr-plans"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-400" />
              BCP Plans
            </Link>
            <Link
              href="/it-dr-plans/runbooks"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
            >
              <BookOpenIcon className="mr-2 h-4 w-4 text-gray-900" />
              Runbooks
            </Link>
            <Link
              href="/it-dr-plans/simulation"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <PlayIcon className="mr-2 h-4 w-4 text-gray-400" />
              Simulation
            </Link>
            <Link
              href="/it-dr-plans/notifications"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <BellIcon className="mr-2 h-4 w-4 text-gray-400" />
              Notifications
            </Link>
            <Link
              href="/it-dr-plans/settings"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-400" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Runbooks</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="mt-1 text-xs text-gray-500">runbooks</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Active</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.active}</p>
            <p className="mt-1 text-xs text-gray-500">in production</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Draft</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.draft}</p>
            <p className="mt-1 text-xs text-gray-500">pending review</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Avg Steps</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.avgSteps}</p>
            <p className="mt-1 text-xs text-gray-500">per runbook</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 pb-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search runbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={enablerFilter}
                onChange={(e) => setEnablerFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="all">All Enablers</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Building">Building</option>
                <option value="Technology">Technology</option>
                <option value="Equipment">Equipment</option>
                <option value="Vendors">Vendors</option>
                <option value="Vital Records">Vital Records</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Runbooks Table */}
      <div className="px-6 pb-6">
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Runbook ID</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Enabler Type</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Linked BCP Plan</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Executed</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRunbooks.map((rb) => (
                <tr key={rb.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">{rb.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-900">{rb.name}</div>
                    <div className="text-xs text-gray-500">{rb.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getEnablerColor(rb.enablerType)}`}>
                      {rb.enablerType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-900">{rb.strategy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/it-dr-plans/${rb.linkedBCPPlan}`} className="text-xs text-gray-600 hover:text-gray-900">
                      {rb.linkedBCPPlan}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{rb.steps} steps</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{rb.avgExecutionTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getExecutionIcon(rb.executionStatus)}
                      <div className="text-xs text-gray-900">{rb.lastExecuted || 'Never'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getStatusColor(rb.status)}`}>
                      {rb.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <Link href={`/it-dr-plans/runbooks/${rb.id}`} className="text-gray-600 hover:text-gray-900 mr-4">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Agent */}
      <AIAgent context="it-dr" />
    </div>
  );
}
