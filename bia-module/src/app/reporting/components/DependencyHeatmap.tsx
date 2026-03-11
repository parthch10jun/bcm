'use client';

import { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CpuChipIcon,
  ServerIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

type IconType = typeof UserGroupIcon;

interface DependencyItem {
  name: string;
  riskCount: number;
  highRisks: number;
  spof: boolean;
}

interface CategoryData {
  category: string;
  icon?: IconType;
  dependencies: DependencyItem[];
}

// Sample heatmap data - risks per dependency
const heatmapData: { upstream: CategoryData[]; downstream: CategoryData[] } = {
  upstream: [
    { category: 'People', icon: UserGroupIcon, dependencies: [
      { name: 'IT Operations Team', riskCount: 3, highRisks: 1, spof: true },
      { name: 'Finance Team', riskCount: 2, highRisks: 0, spof: false },
      { name: 'Customer Service', riskCount: 1, highRisks: 0, spof: false }
    ]},
    { category: 'Applications', icon: CpuChipIcon, dependencies: [
      { name: 'SAP ERP', riskCount: 5, highRisks: 2, spof: true },
      { name: 'Salesforce CRM', riskCount: 2, highRisks: 1, spof: false },
      { name: 'Oracle Database', riskCount: 4, highRisks: 2, spof: true }
    ]},
    { category: 'Technology', icon: ServerIcon, dependencies: [
      { name: 'Primary Data Center', riskCount: 6, highRisks: 3, spof: true },
      { name: 'Network Infrastructure', riskCount: 4, highRisks: 2, spof: true },
      { name: 'Cloud Services (AWS)', riskCount: 2, highRisks: 0, spof: false }
    ]},
    { category: 'Vendors', icon: TruckIcon, dependencies: [
      { name: 'AWS Cloud Provider', riskCount: 3, highRisks: 1, spof: true },
      { name: 'Telecom Provider', riskCount: 2, highRisks: 1, spof: false },
      { name: 'Security Vendor', riskCount: 1, highRisks: 0, spof: false }
    ]},
    { category: 'Facilities', icon: BuildingOfficeIcon, dependencies: [
      { name: 'HQ Building', riskCount: 2, highRisks: 1, spof: false },
      { name: 'DR Site', riskCount: 1, highRisks: 0, spof: false }
    ]},
    { category: 'Data', icon: DocumentIcon, dependencies: [
      { name: 'Customer Database', riskCount: 4, highRisks: 2, spof: true },
      { name: 'Financial Records', riskCount: 3, highRisks: 1, spof: true },
      { name: 'Backup Systems', riskCount: 1, highRisks: 0, spof: false }
    ]}
  ],
  downstream: [
    { category: 'Internal Processes', dependencies: [
      { name: 'Financial Reporting', riskCount: 3, highRisks: 1, spof: false },
      { name: 'Payroll Processing', riskCount: 2, highRisks: 1, spof: false },
      { name: 'Inventory Management', riskCount: 2, highRisks: 0, spof: false }
    ]},
    { category: 'Customers', dependencies: [
      { name: 'Enterprise Clients', riskCount: 4, highRisks: 2, spof: false },
      { name: 'Retail Customers', riskCount: 2, highRisks: 1, spof: false }
    ]},
    { category: 'Regulatory', dependencies: [
      { name: 'SEC Reporting', riskCount: 3, highRisks: 2, spof: false },
      { name: 'GDPR Compliance', riskCount: 2, highRisks: 1, spof: false }
    ]},
    { category: 'SLA Reports', dependencies: [
      { name: 'Monthly SLA Report', riskCount: 1, highRisks: 0, spof: false },
      { name: 'Quarterly Review', riskCount: 1, highRisks: 0, spof: false }
    ]}
  ]
};

const getRiskColor = (riskCount: number, highRisks: number) => {
  if (highRisks >= 2) return 'bg-red-500';
  if (highRisks >= 1) return 'bg-orange-500';
  if (riskCount >= 3) return 'bg-yellow-500';
  if (riskCount >= 1) return 'bg-green-400';
  return 'bg-gray-200';
};

const getRiskBgColor = (riskCount: number, highRisks: number) => {
  if (highRisks >= 2) return 'bg-red-50 border-red-200';
  if (highRisks >= 1) return 'bg-orange-50 border-orange-200';
  if (riskCount >= 3) return 'bg-yellow-50 border-yellow-200';
  if (riskCount >= 1) return 'bg-green-50 border-green-200';
  return 'bg-gray-50 border-gray-200';
};

export default function DependencyHeatmap() {
  const [view, setView] = useState<'upstream' | 'downstream'>('upstream');

  // Calculate totals
  const upstreamTotal = heatmapData.upstream.reduce((acc, cat) => 
    acc + cat.dependencies.reduce((sum, d) => sum + d.riskCount, 0), 0);
  const downstreamTotal = heatmapData.downstream.reduce((acc, cat) => 
    acc + cat.dependencies.reduce((sum, d) => sum + d.riskCount, 0), 0);
  const spofCount = heatmapData.upstream.reduce((acc, cat) => 
    acc + cat.dependencies.filter(d => d.spof).length, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2">
            <ArrowUpIcon className="h-4 w-4 text-blue-600" />
            <p className="text-[10px] uppercase font-medium text-gray-500">Upstream Risks</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{upstreamTotal}</p>
          <p className="text-xs text-gray-500">Across {heatmapData.upstream.length} categories</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2">
            <ArrowDownIcon className="h-4 w-4 text-green-600" />
            <p className="text-[10px] uppercase font-medium text-gray-500">Downstream Risks</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{downstreamTotal}</p>
          <p className="text-xs text-gray-500">Across {heatmapData.downstream.length} categories</p>
        </div>
        <div className="bg-white border border-red-200 rounded-sm p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            <p className="text-[10px] uppercase font-medium text-gray-500">Single Points of Failure</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{spofCount}</p>
          <p className="text-xs text-red-500">Requires redundancy planning</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('upstream')}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm flex items-center gap-1 ${
            view === 'upstream' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          <ArrowUpIcon className="h-3 w-3" />
          Upstream Dependencies
        </button>
        <button
          onClick={() => setView('downstream')}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm flex items-center gap-1 ${
            view === 'downstream' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          <ArrowDownIcon className="h-3 w-3" />
          Downstream Dependencies
        </button>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          {view === 'upstream' ? 'Upstream' : 'Downstream'} Dependency Risk Heatmap
        </h3>

        <div className="space-y-4">
          {(view === 'upstream' ? heatmapData.upstream : heatmapData.downstream).map((category) => {
            const IconComponent = category.icon;
            return (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-2">
                {IconComponent && <IconComponent className="h-4 w-4 text-gray-500" />}
                <h4 className="text-xs font-medium text-gray-700">{category.category}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {category.dependencies.map((dep) => (
                  <div
                    key={dep.name}
                    className={`border rounded-sm p-3 ${getRiskBgColor(dep.riskCount, dep.highRisks)}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-medium text-gray-900">{dep.name}</p>
                      {dep.spof && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-600 text-white rounded">
                          SPOF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(dep.riskCount, dep.highRisks)}`} />
                      <span className="text-[10px] text-gray-600">
                        {dep.riskCount} risks ({dep.highRisks} high)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Risk Level Legend</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-[10px] text-gray-600">Critical (2+ high risks)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-[10px] text-gray-600">High (1 high risk)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-[10px] text-gray-600">Medium (3+ risks)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-[10px] text-gray-600">Low (1-2 risks)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

