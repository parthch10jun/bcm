'use client';

import { useState, useMemo } from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Mock data for dependency gap analysis
const mockDependencyData = [
  { id: 1, processName: 'Payment Processing', processRTO: 4, businessUnit: 'Finance', location: 'HQ', processCriticality: 'CRITICAL', assetName: 'SAP ERP System', assetRTO: 8, assetCriticality: 'CRITICAL' },
  { id: 2, processName: 'Payment Processing', processRTO: 4, businessUnit: 'Finance', location: 'HQ', processCriticality: 'CRITICAL', assetName: 'Oracle Database', assetRTO: 4, assetCriticality: 'CRITICAL' },
  { id: 3, processName: 'Customer Service', processRTO: 8, businessUnit: 'Operations', location: 'Branch A', processCriticality: 'HIGH', assetName: 'CRM Platform', assetRTO: 12, assetCriticality: 'HIGH' },
  { id: 4, processName: 'Customer Service', processRTO: 8, businessUnit: 'Operations', location: 'Branch A', processCriticality: 'HIGH', assetName: 'Email Server', assetRTO: 4, assetCriticality: 'MEDIUM' },
  { id: 5, processName: 'Order Management', processRTO: 12, businessUnit: 'Sales', location: 'HQ', processCriticality: 'HIGH', assetName: 'Inventory System', assetRTO: 24, assetCriticality: 'HIGH' },
  { id: 6, processName: 'Order Management', processRTO: 12, businessUnit: 'Sales', location: 'HQ', processCriticality: 'HIGH', assetName: 'Warehouse DB', assetRTO: 8, assetCriticality: 'MEDIUM' },
  { id: 7, processName: 'HR Operations', processRTO: 24, businessUnit: 'HR', location: 'HQ', processCriticality: 'MEDIUM', assetName: 'HRIS System', assetRTO: 48, assetCriticality: 'MEDIUM' },
  { id: 8, processName: 'HR Operations', processRTO: 24, businessUnit: 'HR', location: 'HQ', processCriticality: 'MEDIUM', assetName: 'Payroll Server', assetRTO: 24, assetCriticality: 'HIGH' },
  { id: 9, processName: 'IT Support', processRTO: 4, businessUnit: 'IT', location: 'HQ', processCriticality: 'CRITICAL', assetName: 'Ticketing System', assetRTO: 2, assetCriticality: 'HIGH' },
  { id: 10, processName: 'IT Support', processRTO: 4, businessUnit: 'IT', location: 'HQ', processCriticality: 'CRITICAL', assetName: 'Remote Access VPN', assetRTO: 8, assetCriticality: 'CRITICAL' },
  { id: 11, processName: 'Financial Reporting', processRTO: 48, businessUnit: 'Finance', location: 'HQ', processCriticality: 'MEDIUM', assetName: 'BI Dashboard', assetRTO: 72, assetCriticality: 'LOW' },
  { id: 12, processName: 'Marketing Campaigns', processRTO: 72, businessUnit: 'Marketing', location: 'Branch B', processCriticality: 'LOW', assetName: 'Marketing Automation', assetRTO: 48, assetCriticality: 'LOW' },
];

interface DependencyGapReportProps {
  className?: string;
}

export default function DependencyGapReport({ className = '' }: DependencyGapReportProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    businessUnit: '',
    location: '',
    processCriticality: '',
    assetCriticality: '',
    rtoMin: '',
    rtoMax: '',
    gapStatus: '' // 'aligned' | 'misaligned' | ''
  });

  // Calculate RTO gap for each dependency
  const dependenciesWithGap = useMemo(() => {
    return mockDependencyData.map(dep => ({
      ...dep,
      rtoGap: dep.assetRTO - dep.processRTO,
      isAligned: dep.assetRTO <= dep.processRTO
    }));
  }, []);

  // Apply filters
  const filteredDependencies = useMemo(() => {
    return dependenciesWithGap.filter(dep => {
      if (filters.businessUnit && dep.businessUnit !== filters.businessUnit) return false;
      if (filters.location && dep.location !== filters.location) return false;
      if (filters.processCriticality && dep.processCriticality !== filters.processCriticality) return false;
      if (filters.assetCriticality && dep.assetCriticality !== filters.assetCriticality) return false;
      if (filters.rtoMin && dep.processRTO < parseInt(filters.rtoMin)) return false;
      if (filters.rtoMax && dep.processRTO > parseInt(filters.rtoMax)) return false;
      if (filters.gapStatus === 'aligned' && !dep.isAligned) return false;
      if (filters.gapStatus === 'misaligned' && dep.isAligned) return false;
      return true;
    });
  }, [dependenciesWithGap, filters]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = filteredDependencies.length;
    const aligned = filteredDependencies.filter(d => d.isAligned).length;
    const misaligned = total - aligned;
    const avgGap = total > 0 ? filteredDependencies.reduce((sum, d) => sum + d.rtoGap, 0) / total : 0;
    const maxGap = total > 0 ? Math.max(...filteredDependencies.map(d => d.rtoGap)) : 0;
    return { total, aligned, misaligned, avgGap, maxGap };
  }, [filteredDependencies]);

  // Get unique values for filters
  const businessUnits = [...new Set(mockDependencyData.map(d => d.businessUnit))];
  const locations = [...new Set(mockDependencyData.map(d => d.location))];

  const formatRTO = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    alert(`Exporting to ${format.toUpperCase()}... (Demo)`);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-sm ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Dependency Gap Report</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">RTO alignment analysis between processes and dependent assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-2 py-1 text-[10px] font-medium rounded-sm border ${showFilters ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'} hover:bg-gray-50`}
          >
            <FunnelIcon className="h-3 w-3 mr-1" />
            Filters
            {showFilters ? <ChevronUpIcon className="h-3 w-3 ml-1" /> : <ChevronDownIcon className="h-3 w-3 ml-1" />}
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="inline-flex items-center px-2 py-1 text-[10px] font-medium rounded-sm border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
            Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center px-2 py-1 text-[10px] font-medium rounded-sm border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
            PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3 p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          <p className="text-[10px] text-gray-500">Total Dependencies</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-green-600">{stats.aligned}</p>
          <p className="text-[10px] text-gray-500">Aligned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-600">{stats.misaligned}</p>
          <p className="text-[10px] text-gray-500">Misaligned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{stats.avgGap.toFixed(1)}h</p>
          <p className="text-[10px] text-gray-500">Avg Gap</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-amber-600">{formatRTO(stats.maxGap)}</p>
          <p className="text-[10px] text-gray-500">Max Gap</p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50/30">
          <div className="grid grid-cols-7 gap-3">
            <select
              value={filters.businessUnit}
              onChange={(e) => setFilters(f => ({ ...f, businessUnit: e.target.value }))}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">All Business Units</option>
              {businessUnits.map(bu => <option key={bu} value={bu}>{bu}</option>)}
            </select>
            <select
              value={filters.location}
              onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select
              value={filters.processCriticality}
              onChange={(e) => setFilters(f => ({ ...f, processCriticality: e.target.value }))}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Process Criticality</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select
              value={filters.assetCriticality}
              onChange={(e) => setFilters(f => ({ ...f, assetCriticality: e.target.value }))}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Asset Criticality</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Min RTO"
                value={filters.rtoMin}
                onChange={(e) => setFilters(f => ({ ...f, rtoMin: e.target.value }))}
                className="w-16 px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <span className="text-xs text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.rtoMax}
                onChange={(e) => setFilters(f => ({ ...f, rtoMax: e.target.value }))}
                className="w-16 px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <select
              value={filters.gapStatus}
              onChange={(e) => setFilters(f => ({ ...f, gapStatus: e.target.value }))}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">All Status</option>
              <option value="aligned">Aligned Only</option>
              <option value="misaligned">Misaligned Only</option>
            </select>
            <button
              onClick={() => setFilters({ businessUnit: '', location: '', processCriticality: '', assetCriticality: '', rtoMin: '', rtoMax: '', gapStatus: '' })}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Process</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Business Unit</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase">Process RTO</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Dependent Asset</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase">Asset RTO</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase">RTO Gap</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDependencies.map((dep) => (
              <tr key={dep.id} className={`hover:bg-gray-50 ${!dep.isAligned ? 'bg-red-50/30' : ''}`}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-xs font-medium text-gray-900">{dep.processName}</div>
                  <div className="text-[10px] text-gray-500">{dep.processCriticality}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{dep.businessUnit}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-center font-medium text-gray-900">{formatRTO(dep.processRTO)}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-xs font-medium text-gray-900">{dep.assetName}</div>
                  <div className="text-[10px] text-gray-500">{dep.assetCriticality}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-center font-medium text-gray-900">{formatRTO(dep.assetRTO)}</td>
                <td className={`px-3 py-2 whitespace-nowrap text-xs text-center font-medium ${dep.rtoGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {dep.rtoGap > 0 ? '+' : ''}{dep.rtoGap}h
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  {dep.isAligned ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Aligned
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      Misaligned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

