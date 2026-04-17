'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Mock data for controls
const mockControls = [
  {
    id: 'CTL-001',
    name: 'Segregation of Duties - Financial Reporting',
    framework: 'COSO',
    category: 'Preventive',
    riskLevel: 'High',
    owner: 'Finance Department',
    lastTested: '2024-10-15',
    nextTest: '2024-12-15',
    status: 'Effective',
    designEffectiveness: 95,
    operationalEffectiveness: 92,
    testResults: { passed: 18, failed: 1, pending: 1 },
  },
  {
    id: 'CTL-002',
    name: 'Access Control - Critical Systems',
    framework: 'COBIT',
    category: 'Preventive',
    riskLevel: 'Critical',
    owner: 'IT Security',
    lastTested: '2024-11-01',
    nextTest: '2025-01-01',
    status: 'Partially Effective',
    designEffectiveness: 88,
    operationalEffectiveness: 75,
    testResults: { passed: 14, failed: 3, pending: 2 },
  },
  {
    id: 'CTL-003',
    name: 'Change Management Controls',
    framework: 'COBIT',
    category: 'Detective',
    riskLevel: 'Medium',
    owner: 'IT Operations',
    lastTested: '2024-10-20',
    nextTest: '2024-12-20',
    status: 'Effective',
    designEffectiveness: 90,
    operationalEffectiveness: 88,
    testResults: { passed: 16, failed: 0, pending: 1 },
  },
  {
    id: 'CTL-004',
    name: 'Vendor Risk Assessment',
    framework: 'COSO',
    category: 'Detective',
    riskLevel: 'High',
    owner: 'Procurement',
    lastTested: '2024-09-30',
    nextTest: '2024-11-30',
    status: 'Ineffective',
    designEffectiveness: 70,
    operationalEffectiveness: 55,
    testResults: { passed: 8, failed: 6, pending: 3 },
  },
  {
    id: 'CTL-005',
    name: 'Data Backup and Recovery',
    framework: 'COBIT',
    category: 'Corrective',
    riskLevel: 'Critical',
    owner: 'IT Infrastructure',
    lastTested: '2024-11-05',
    nextTest: '2025-01-05',
    status: 'Effective',
    designEffectiveness: 98,
    operationalEffectiveness: 96,
    testResults: { passed: 19, failed: 0, pending: 0 },
  },
  {
    id: 'CTL-006',
    name: 'Incident Response Procedures',
    framework: 'COSO',
    category: 'Corrective',
    riskLevel: 'High',
    owner: 'Security Operations',
    lastTested: '2024-10-25',
    nextTest: '2024-12-25',
    status: 'Partially Effective',
    designEffectiveness: 85,
    operationalEffectiveness: 78,
    testResults: { passed: 12, failed: 2, pending: 2 },
  },
];

const statusColors = {
  'Effective': 'bg-green-50 text-green-700 border-green-200',
  'Partially Effective': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Ineffective': 'bg-red-50 text-red-700 border-red-200',
};

const riskColors = {
  'Critical': 'text-red-600',
  'High': 'text-orange-600',
  'Medium': 'text-yellow-600',
  'Low': 'text-green-600',
};

export default function ControlTestingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Calculate summary statistics
  const totalControls = mockControls.length;
  const effectiveControls = mockControls.filter(c => c.status === 'Effective').length;
  const partiallyEffective = mockControls.filter(c => c.status === 'Partially Effective').length;
  const ineffectiveControls = mockControls.filter(c => c.status === 'Ineffective').length;
  const avgDesignEffectiveness = Math.round(
    mockControls.reduce((sum, c) => sum + c.designEffectiveness, 0) / totalControls
  );
  const avgOperationalEffectiveness = Math.round(
    mockControls.reduce((sum, c) => sum + c.operationalEffectiveness, 0) / totalControls
  );

  // Filter controls
  const filteredControls = mockControls.filter(control => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = frameworkFilter === 'all' || control.framework === frameworkFilter;
    const matchesStatus = statusFilter === 'all' || control.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || control.riskLevel === riskFilter;
    
    return matchesSearch && matchesFramework && matchesStatus && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Control Testing</h1>
              <p className="mt-1 text-xs text-gray-500">
                Control Design and Assessments Based on Industry Standards (COSO & COBIT)
              </p>
            </div>
            <Link
              href="/control-testing/new"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4" />
              New Control Test
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Assessment Summary */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-4 w-4 text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Assessment Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Controls */}
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-medium text-gray-500 tracking-wider">Total Controls</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{totalControls}</p>
                </div>
                <ShieldCheckIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Effective */}
            <div className="bg-green-50 border border-green-200 rounded-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-medium text-green-700 tracking-wider">Effective</p>
                  <p className="mt-1 text-2xl font-semibold text-green-900">{effectiveControls}</p>
                  <p className="text-[10px] text-green-600">{Math.round((effectiveControls / totalControls) * 100)}%</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            {/* Partially Effective */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-medium text-yellow-700 tracking-wider">Partially Effective</p>
                  <p className="mt-1 text-2xl font-semibold text-yellow-900">{partiallyEffective}</p>
                  <p className="text-[10px] text-yellow-600">{Math.round((partiallyEffective / totalControls) * 100)}%</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            {/* Ineffective */}
            <div className="bg-red-50 border border-red-200 rounded-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-medium text-red-700 tracking-wider">Ineffective</p>
                  <p className="mt-1 text-2xl font-semibold text-red-900">{ineffectiveControls}</p>
                  <p className="text-[10px] text-red-600">{Math.round((ineffectiveControls / totalControls) * 100)}%</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Control Effectiveness Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Design Effectiveness */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-900">Design Effectiveness</h3>
              <span className="text-xl font-bold text-gray-900">{avgDesignEffectiveness}%</span>
            </div>
            <div className="space-y-2">
              {mockControls.map(control => (
                <div key={control.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-16">{control.id}</span>
                  <div className="flex-1 bg-gray-100 rounded-sm h-5 overflow-hidden">
                    <div
                      className={`h-full ${
                        control.designEffectiveness >= 90 ? 'bg-green-500' :
                        control.designEffectiveness >= 75 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${control.designEffectiveness}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-700 w-10 text-right">{control.designEffectiveness}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Effectiveness */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-900">Operational Effectiveness</h3>
              <span className="text-xl font-bold text-gray-900">{avgOperationalEffectiveness}%</span>
            </div>
            <div className="space-y-2">
              {mockControls.map(control => (
                <div key={control.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-16">{control.id}</span>
                  <div className="flex-1 bg-gray-100 rounded-sm h-5 overflow-hidden">
                    <div
                      className={`h-full ${
                        control.operationalEffectiveness >= 90 ? 'bg-green-500' :
                        control.operationalEffectiveness >= 75 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${control.operationalEffectiveness}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-700 w-10 text-right">{control.operationalEffectiveness}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Search Controls
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Control ID or name..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
            </div>

            {/* Framework Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Framework
              </label>
              <select
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Frameworks</option>
                <option value="COSO">COSO</option>
                <option value="COBIT">COBIT</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Status</option>
                <option value="Effective">Effective</option>
                <option value="Partially Effective">Partially Effective</option>
                <option value="Ineffective">Ineffective</option>
              </select>
            </div>

            {/* Risk Filter */}
            <div>
              <label className="block text-[10px] uppercase font-medium text-gray-500 tracking-wider mb-1">
                Risk Level
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Risks</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Controls Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Control Name
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Framework
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Test Results
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Next Test
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredControls.map(control => (
                  <tr key={control.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-900">{control.id}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-xs text-gray-900">{control.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{control.owner}</p>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded-sm border border-blue-200">
                        {control.framework}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="text-xs text-gray-700">{control.category}</span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`text-xs font-medium ${riskColors[control.riskLevel]}`}>
                        {control.riskLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${statusColors[control.status]}`}>
                        {control.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-green-600">{control.testResults.passed} P</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-red-600">{control.testResults.failed} F</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{control.testResults.pending} Pending</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-500">
                      {control.nextTest}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-right">
                      <Link
                        href={`/control-testing/${control.id}`}
                        className="text-xs text-gray-900 hover:text-gray-600 font-medium inline-flex items-center gap-1"
                      >
                        View
                        <ChevronRightIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredControls.length === 0 && (
            <div className="text-center py-12">
              <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No controls found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
