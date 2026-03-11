'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  ServerIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  TruckIcon,
  CogIcon,
  UsersIcon,
  ScaleIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Sample dependency data
const SAMPLE_UPSTREAM_DEPENDENCIES = {
  people: [
    { id: 'p1', name: 'IT Operations Team', role: 'System Administration', minimumRequired: 3, isSPOF: false },
    { id: 'p2', name: 'Database Administrator', role: 'DBA', minimumRequired: 1, isSPOF: true },
    { id: 'p3', name: 'Network Engineer', role: 'Network Support', minimumRequired: 2, isSPOF: false }
  ],
  applications: [
    { id: 'a1', name: 'SAP ERP', rtoHours: 4, rpoHours: 1, isSPOF: true },
    { id: 'a2', name: 'Oracle Database', rtoHours: 2, rpoHours: 0.5, isSPOF: true },
    { id: 'a3', name: 'Microsoft Exchange', rtoHours: 8, rpoHours: 4, isSPOF: false }
  ],
  technology: [
    { id: 't1', name: 'Primary Data Center', type: 'Facility', rtoHours: 4, isSPOF: true },
    { id: 't2', name: 'Core Network Switch', type: 'Network', rtoHours: 2, isSPOF: true },
    { id: 't3', name: 'Backup Servers', type: 'Server', rtoHours: 8, isSPOF: false }
  ],
  vendors: [
    { id: 'v1', name: 'AWS Cloud Services', service: 'Cloud Infrastructure', contractedRto: 4, isSPOF: true },
    { id: 'v2', name: 'Verizon Telecom', service: 'Network Connectivity', contractedRto: 8, isSPOF: false }
  ],
  facilities: [
    { id: 'f1', name: 'Head Office', type: 'Primary', capacity: 500, isSPOF: false },
    { id: 'f2', name: 'DR Site', type: 'Backup', capacity: 200, isSPOF: false }
  ],
  data: [
    { id: 'd1', name: 'Customer Database', classification: 'Confidential', backupFreq: 'Hourly', isSPOF: true },
    { id: 'd2', name: 'Transaction Logs', classification: 'Critical', backupFreq: 'Real-time', isSPOF: true }
  ],
  supplierProcesses: [
    { id: 'sp1', name: 'Payment Gateway Processing', supplier: 'Stripe', sla: '99.99%', isSPOF: true }
  ]
};

const SAMPLE_DOWNSTREAM_DEPENDENCIES = {
  internalProcesses: [
    { id: 'ip1', name: 'Financial Reporting', rtoHours: 24, impact: 'Cannot generate financial reports' },
    { id: 'ip2', name: 'Customer Billing', rtoHours: 12, impact: 'Delayed invoicing' },
    { id: 'ip3', name: 'Inventory Management', rtoHours: 8, impact: 'Stock level inaccuracies' }
  ],
  customers: [
    { id: 'c1', segment: 'Enterprise Clients', count: 150, revenueImpact: 500000, slas: ['99.9% uptime', '4h response'] },
    { id: 'c2', segment: 'SMB Clients', count: 2500, revenueImpact: 250000, slas: ['99% uptime', '8h response'] }
  ],
  regulatory: [
    { id: 'r1', body: 'SEC', requirement: 'Financial Reporting', deadline: 'Quarterly', penalty: 'Fines up to $1M' },
    { id: 'r2', body: 'PCI DSS', requirement: 'Payment Data Security', deadline: 'Annual', penalty: 'Loss of certification' }
  ],
  slaReports: [
    { id: 's1', name: 'Monthly SLA Report', frequency: 'Monthly', deadline: '5th of month', recipients: 'Executive Team' },
    { id: 's2', name: 'Incident Report', frequency: 'As needed', deadline: '24h after incident', recipients: 'Board' }
  ]
};

interface BIADependenciesPanelProps {
  biaId: number;
  biaName: string;
  showRiskActions?: boolean;
  onCreateRisk?: (dependency: any) => void;
}

const CategoryIcon: Record<string, any> = {
  people: UserGroupIcon,
  applications: ComputerDesktopIcon,
  technology: ServerIcon,
  vendors: TruckIcon,
  facilities: BuildingOfficeIcon,
  data: DocumentIcon,
  supplierProcesses: CogIcon,
  internalProcesses: CogIcon,
  customers: UsersIcon,
  regulatory: ScaleIcon,
  slaReports: DocumentChartBarIcon
};

const CategoryLabels: Record<string, string> = {
  people: 'People',
  applications: 'Applications',
  technology: 'Technology Assets',
  vendors: 'Third-Party Vendors',
  facilities: 'Facilities',
  data: 'Data / Vital Records',
  supplierProcesses: 'Supplier Processes',
  internalProcesses: 'Internal Processes',
  customers: 'Customers / End-Users',
  regulatory: 'Regulatory Obligations',
  slaReports: 'Critical Reports / SLAs'
};

export default function BIADependenciesPanel({ biaId, biaName, showRiskActions = false, onCreateRisk }: BIADependenciesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    upstream: true,
    downstream: true
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const renderDependencyItem = (item: any, category: string) => (
    <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-white border border-gray-100 rounded-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-900">{item.name}</span>
          {item.isSPOF && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium bg-red-100 text-red-700 rounded">
              <ExclamationTriangleIcon className="h-3 w-3" />
              SPOF
            </span>
          )}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5">
          {item.role && <span>Role: {item.role}</span>}
          {item.rtoHours !== undefined && <span>RTO: {item.rtoHours}h</span>}
          {item.service && <span>Service: {item.service}</span>}
          {item.type && <span>Type: {item.type}</span>}
          {item.classification && <span>Classification: {item.classification}</span>}
          {item.segment && <span>Segment: {item.segment}</span>}
          {item.body && <span>Body: {item.body}</span>}
        </div>
      </div>
      {showRiskActions && (
        <button
          onClick={() => onCreateRisk?.(item)}
          className="px-2 py-1 text-[10px] font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100"
        >
          + Risk
        </button>
      )}
    </div>
  );

  const renderCategory = (category: string, items: any[], direction: 'upstream' | 'downstream') => {
    const Icon = CategoryIcon[category];
    const isExpanded = expandedCategories[`${direction}-${category}`];
    const spofCount = items.filter((i: any) => i.isSPOF).length;

    return (
      <div key={category} className="border border-gray-200 rounded-sm overflow-hidden">
        <button
          onClick={() => toggleCategory(`${direction}-${category}`)}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            <Icon className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">{CategoryLabels[category]}</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-600 rounded-full">{items.length}</span>
          </div>
          {spofCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-red-600">
              <ShieldExclamationIcon className="h-3 w-3" />
              {spofCount} SPOF
            </span>
          )}
        </button>
        {isExpanded && (
          <div className="p-2 space-y-1 bg-gray-50">
            {items.map(item => renderDependencyItem(item, category))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Upstream Dependencies */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <button
          onClick={() => toggleSection('upstream')}
          className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100"
        >
          <div className="flex items-center gap-2">
            {expandedSections.upstream ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            <ArrowUpIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Upstream Dependencies</span>
            <span className="text-xs text-blue-600">(What this process needs)</span>
          </div>
        </button>
        {expandedSections.upstream && (
          <div className="p-3 space-y-2">
            {Object.entries(SAMPLE_UPSTREAM_DEPENDENCIES).map(([category, items]) =>
              renderCategory(category, items, 'upstream')
            )}
          </div>
        )}
      </div>

      {/* Downstream Dependencies */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <button
          onClick={() => toggleSection('downstream')}
          className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100"
        >
          <div className="flex items-center gap-2">
            {expandedSections.downstream ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            <ArrowDownIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Downstream Dependencies</span>
            <span className="text-xs text-green-600">(Who depends on this process)</span>
          </div>
        </button>
        {expandedSections.downstream && (
          <div className="p-3 space-y-2">
            {Object.entries(SAMPLE_DOWNSTREAM_DEPENDENCIES).map(([category, items]) =>
              renderCategory(category, items, 'downstream')
            )}
          </div>
        )}
      </div>
    </div>
  );
}

