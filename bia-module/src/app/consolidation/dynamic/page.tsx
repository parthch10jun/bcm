'use client';

import { useState, useEffect } from 'react';
import { BIAConsolidation } from '@/types/bia';
import { 
  ChartBarIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  CogIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Mock data for dynamic consolidation
const mockBIARecords = [
  {
    id: 'bia-001',
    processName: 'Payroll Processing',
    department: 'Finance',
    service: 'HR Services',
    location: 'Gurugram',
    rto: 24,
    rpo: 4,
    mtpd: 72,
    criticalityTier: 'Tier 1',
    status: 'Approved'
  },
  {
    id: 'bia-002',
    processName: 'Customer Support',
    department: 'Operations',
    service: 'Customer Service',
    location: 'Mumbai',
    rto: 4,
    rpo: 1,
    mtpd: 24,
    criticalityTier: 'Tier 1',
    status: 'Approved'
  },
  {
    id: 'bia-003',
    processName: 'Order Processing',
    department: 'Operations',
    service: 'E-commerce Platform',
    location: 'Gurugram',
    rto: 8,
    rpo: 2,
    mtpd: 48,
    criticalityTier: 'Tier 2',
    status: 'Approved'
  },
  {
    id: 'bia-004',
    processName: 'Financial Reporting',
    department: 'Finance',
    service: 'Financial Services',
    location: 'Gurugram',
    rto: 48,
    rpo: 24,
    mtpd: 168,
    criticalityTier: 'Tier 2',
    status: 'Under Review'
  }
];

export default function DynamicConsolidationPage() {
  const [selectedView, setSelectedView] = useState<'department' | 'service' | 'location'>('department');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedBIAs, setSelectedBIAs] = useState<string[]>([]);
  const [consolidatedData, setConsolidatedData] = useState<any[]>([]);

  useEffect(() => {
    generateConsolidatedView();
  }, [selectedView, selectedFilter, selectedBIAs]);

  const generateConsolidatedView = () => {
    let filteredRecords = mockBIARecords;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => 
        selectedFilter === 'approved' ? record.status === 'Approved' :
        selectedFilter === 'tier1' ? record.criticalityTier === 'Tier 1' :
        selectedFilter === 'tier2' ? record.criticalityTier === 'Tier 2' :
        true
      );
    }

    // Apply specific BIA selection
    if (selectedBIAs.length > 0) {
      filteredRecords = filteredRecords.filter(record => selectedBIAs.includes(record.id));
    }

    // Group by selected view
    const grouped = filteredRecords.reduce((acc, record) => {
      const key = selectedView === 'department' ? record.department :
                  selectedView === 'service' ? record.service :
                  record.location;
      
      if (!acc[key]) {
        acc[key] = {
          name: key,
          processes: [],
          totalProcesses: 0,
          tier1Processes: 0,
          tier2Processes: 0,
          minRTO: Infinity,
          maxRTO: 0,
          avgRTO: 0,
          minMTPD: Infinity,
          maxMTPD: 0
        };
      }

      acc[key].processes.push(record);
      acc[key].totalProcesses++;
      
      if (record.criticalityTier === 'Tier 1') acc[key].tier1Processes++;
      if (record.criticalityTier === 'Tier 2') acc[key].tier2Processes++;
      
      acc[key].minRTO = Math.min(acc[key].minRTO, record.rto);
      acc[key].maxRTO = Math.max(acc[key].maxRTO, record.rto);
      acc[key].minMTPD = Math.min(acc[key].minMTPD, record.mtpd);
      acc[key].maxMTPD = Math.max(acc[key].maxMTPD, record.mtpd);

      return acc;
    }, {} as any);

    // Calculate averages
    Object.values(grouped).forEach((group: any) => {
      group.avgRTO = group.processes.reduce((sum: number, p: any) => sum + p.rto, 0) / group.processes.length;
    });

    setConsolidatedData(Object.values(grouped));
  };

  const getViewIcon = () => {
    switch (selectedView) {
      case 'department': return BuildingOfficeIcon;
      case 'service': return GlobeAltIcon;
      case 'location': return MapPinIcon;
      default: return ChartBarIcon;
    }
  };

  const ViewIcon = getViewIcon();

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dynamic BIA Consolidation</h1>
          <p className="mt-2 text-lg text-gray-600">Interactive business intelligence and strategic reporting</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Configure
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Consolidation Controls</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* View Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consolidate By</label>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as any)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="department">Department</option>
              <option value="service">Service</option>
              <option value="location">Location</option>
            </select>
          </div>

          {/* Filter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter By</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All BIA Records</option>
              <option value="approved">Approved Only</option>
              <option value="tier1">Tier 1 Critical</option>
              <option value="tier2">Tier 2 Important</option>
            </select>
          </div>

          {/* Specific BIA Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific BIAs</label>
            <select
              multiple
              value={selectedBIAs}
              onChange={(e) => setSelectedBIAs(Array.from(e.target.selectedOptions, option => option.value))}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              size={3}
            >
              {mockBIARecords.map(record => (
                <option key={record.id} value={record.id}>
                  {record.processName} ({record.department})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </div>

      {/* Consolidated Results */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <ViewIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Consolidated View by {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
            </h3>
          </div>
        </div>

        {consolidatedData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No data matches your current filters. Try adjusting your selection criteria.
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criticality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RTO Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MTPD Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recovery Capability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consolidatedData.map((group, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-500">{group.totalProcesses} processes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {group.processes.map((p: any) => p.processName).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {group.tier1Processes > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {group.tier1Processes} Tier 1
                          </span>
                        )}
                        {group.tier2Processes > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {group.tier2Processes} Tier 2
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {group.minRTO}h - {group.maxRTO}h
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {group.avgRTO.toFixed(1)}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {group.minMTPD}h - {group.maxMTPD}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        group.avgRTO <= 8 ? 'bg-green-100 text-green-800' :
                        group.avgRTO <= 24 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {group.avgRTO <= 8 ? 'Excellent' :
                         group.avgRTO <= 24 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Strategic Insights */}
      {consolidatedData.length > 0 && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Strategic Insights</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Most Critical {selectedView}</div>
              <div className="text-lg font-semibold text-gray-900">
                {consolidatedData.reduce((prev, current) => 
                  prev.tier1Processes > current.tier1Processes ? prev : current
                ).name}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Fastest Recovery</div>
              <div className="text-lg font-semibold text-gray-900">
                {consolidatedData.reduce((prev, current) => 
                  prev.avgRTO < current.avgRTO ? prev : current
                ).name}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Needs Attention</div>
              <div className="text-lg font-semibold text-gray-900">
                {consolidatedData.filter(g => g.avgRTO > 24).length} {selectedView}s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
