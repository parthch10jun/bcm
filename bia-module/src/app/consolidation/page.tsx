'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  CheckIcon,
  UserGroupIcon,
  ServerIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Import Department BIA precedence logic
import { DepartmentBIAPrecedence, BIADataPrecedence } from '@/types/department-bia';

// Comprehensive mock BIA records with dependencies (includes both Process and Department BIAs)
const mockBIARecords = [
  {
    id: 'bia-001',
    processName: 'Payroll Processing',
    department: 'Finance',
    location: 'Gurugram Head Office',
    rto: 4,
    rpo: 2,
    criticality: { tier: 'Tier 1 (Critical)', score: 32, color: 'red' },
    status: 'Approved',
    lastUpdated: new Date('2024-02-15'),
    owner: 'Jane Smith',
    dependencies: {
      upstreamProcesses: [
        { id: 'up-001', name: 'Employee Data Management', rto: 2 }
      ],
      downstreamProcesses: [
        { id: 'down-001', name: 'Tax Filing', rto: 8 },
        { id: 'down-002', name: 'Benefits Administration', rto: 12 }
      ],
      criticalPeople: [
        { id: 'p-001', name: 'Sarah Johnson', role: 'Payroll Manager', requiredRTO: 4 },
        { id: 'p-002', name: 'Rajesh Kumar', role: 'Finance Director', requiredRTO: 4 }
      ],
      criticalAssets: [
        { id: 'a-001', name: 'SAP Production Server', type: 'Application', requiredRTO: 4 },
        { id: 'a-002', name: 'Payroll Database', type: 'Database', requiredRTO: 4 },
        { id: 'a-003', name: 'HR Information System', type: 'Application', requiredRTO: 4 }
      ],
      criticalVendors: [
        { id: 'v-001', name: 'ADP Payroll Services', service: 'Payroll Processing', requiredRTO: 4 }
      ]
    }
  },
  {
    id: 'bia-002',
    processName: 'Customer Support',
    department: 'Operations',
    location: 'Mumbai Branch Office',
    rto: 2,
    rpo: 1,
    criticality: { tier: 'Tier 1 (Critical)', score: 40, color: 'red' },
    status: 'Approved',
    lastUpdated: new Date('2024-02-20'),
    owner: 'Priya Sharma',
    dependencies: {
      upstreamProcesses: [
        { id: 'up-002', name: 'Customer Database Sync', rto: 1 }
      ],
      downstreamProcesses: [
        { id: 'down-003', name: 'Escalation Management', rto: 4 },
        { id: 'down-004', name: 'Customer Feedback', rto: 24 }
      ],
      criticalPeople: [
        { id: 'p-003', name: 'Rajesh Kumar', role: 'Support Manager', requiredRTO: 2 },
        { id: 'p-004', name: 'Priya Sharma', role: 'Team Lead', requiredRTO: 2 }
      ],
      criticalAssets: [
        { id: 'a-004', name: 'Salesforce CRM', type: 'Application', requiredRTO: 2 },
        { id: 'a-005', name: 'Phone System', type: 'Infrastructure', requiredRTO: 2 }
      ],
      criticalVendors: [
        { id: 'v-002', name: 'Salesforce', service: 'CRM Platform', requiredRTO: 2 },
        { id: 'v-003', name: 'Telecom Provider', service: 'Phone Services', requiredRTO: 2 }
      ]
    }
  },
  {
    id: 'bia-003',
    processName: 'Financial Reporting',
    department: 'Finance',
    location: 'Gurugram Head Office',
    rto: 24,
    rpo: 4,
    criticality: { tier: 'Tier 2 (High)', score: 24, color: 'orange' },
    status: 'Approved',
    lastUpdated: new Date('2024-02-10'),
    owner: 'Mike Johnson',
    dependencies: {
      upstreamProcesses: [
        { id: 'up-003', name: 'Data Collection', rto: 12 },
        { id: 'up-004', name: 'Account Reconciliation', rto: 8 }
      ],
      downstreamProcesses: [
        { id: 'down-005', name: 'Regulatory Filing', rto: 48 },
        { id: 'down-006', name: 'Board Reporting', rto: 72 }
      ],
      criticalPeople: [
        { id: 'p-005', name: 'Mike Johnson', role: 'Finance Director', requiredRTO: 24 }
      ],
      criticalAssets: [
        { id: 'a-006', name: 'Financial Database', type: 'Database', requiredRTO: 24 },
        { id: 'a-007', name: 'Reporting Tools', type: 'Application', requiredRTO: 24 }
      ],
      criticalVendors: [
        { id: 'v-004', name: 'Oracle', service: 'Database Services', requiredRTO: 24 },
        { id: 'v-005', name: 'Ernst & Young', service: 'Audit Services', requiredRTO: 48 }
      ]
    }
  },
  {
    id: 'bia-004',
    processName: 'Order Processing',
    department: 'Sales',
    location: 'Gurugram Head Office',
    rto: 1,
    rpo: 0.5,
    criticality: { tier: 'Tier 1 (Critical)', score: 40, color: 'red' },
    status: 'Approved',
    lastUpdated: new Date('2024-02-25'),
    owner: 'Sarah Wilson',
    dependencies: {
      upstreamProcesses: [
        { id: 'up-005', name: 'Inventory Check', rto: 0.5 },
        { id: 'up-006', name: 'Credit Verification', rto: 1 }
      ],
      downstreamProcesses: [
        { id: 'down-007', name: 'Fulfillment', rto: 2 },
        { id: 'down-008', name: 'Invoicing', rto: 4 }
      ],
      criticalPeople: [
        { id: 'p-006', name: 'Sarah Wilson', role: 'Sales Manager', requiredRTO: 1 }
      ],
      criticalAssets: [
        { id: 'a-008', name: 'Order Management System', type: 'Application', requiredRTO: 1 },
        { id: 'a-009', name: 'Payment Gateway', type: 'Infrastructure', requiredRTO: 1 }
      ],
      criticalVendors: [
        { id: 'v-006', name: 'Payment Processor', service: 'Payment Processing', requiredRTO: 1 },
        { id: 'v-007', name: 'Shipping Partner', service: 'Logistics', requiredRTO: 2 }
      ]
    }
  },
  {
    id: 'bia-005',
    processName: 'Inventory Management',
    department: 'Operations',
    location: 'Mumbai Branch Office',
    rto: 8,
    rpo: 2,
    criticality: { tier: 'Tier 3 (Medium)', score: 16, color: 'yellow' },
    status: 'Under Review',
    lastUpdated: new Date('2024-03-01'),
    owner: 'David Brown',
    dependencies: {
      upstreamProcesses: [
        { id: 'up-007', name: 'Purchase Orders', rto: 4 },
        { id: 'up-008', name: 'Receiving', rto: 2 }
      ],
      downstreamProcesses: [
        { id: 'down-009', name: 'Stock Allocation', rto: 12 },
        { id: 'down-010', name: 'Reorder Processing', rto: 24 }
      ],
      criticalPeople: [
        { id: 'p-007', name: 'David Brown', role: 'Warehouse Manager', requiredRTO: 8 }
      ],
      criticalAssets: [
        { id: 'a-010', name: 'Warehouse Management System', type: 'Application', requiredRTO: 8 },
        { id: 'a-011', name: 'RFID Scanners', type: 'Equipment', requiredRTO: 8 }
      ],
      criticalVendors: [
        { id: 'v-008', name: 'Logistics Provider', service: 'Warehouse Services', requiredRTO: 8 },
        { id: 'v-009', name: 'RFID Vendor', service: 'Equipment Support', requiredRTO: 24 }
      ]
    }
  },
  // Department BIA Records (take precedence over process aggregation)
  {
    id: 'dept-bia-001',
    type: 'department',
    departmentName: 'Finance Department',
    departmentNodeId: 'dept-finance',
    department: 'Finance',
    location: 'Gurugram Head Office',
    rto: 6, // Department head decision (different from process aggregation)
    rpo: 0, // No RPO for department level
    mtpd: 48,
    criticality: { tier: 'Tier 1 (Critical)', score: 36, color: 'red' },
    status: 'Approved',
    lastUpdated: new Date('2024-03-05'),
    owner: 'CFO - Finance Director',
    processRollupReference: {
      processCount: 2,
      suggestedRTO: 4, // From Payroll + Financial Reporting
      suggestedCriticality: 'Tier 1 (Critical)'
    },
    dependencies: {
      upstreamProcesses: [],
      downstreamProcesses: [],
      criticalPeople: [
        { id: 'dp-001', name: 'CFO', role: 'Chief Financial Officer', requiredRTO: 6 },
        { id: 'dp-002', name: 'Finance Director', role: 'Finance Director', requiredRTO: 6 }
      ],
      criticalAssets: [
        { id: 'da-001', name: 'Financial Systems Infrastructure', type: 'Infrastructure', requiredRTO: 6 },
        { id: 'da-002', name: 'Finance Department Office', type: 'Facility', requiredRTO: 6 }
      ],
      criticalVendors: [
        { id: 'dv-001', name: 'Banking Partner', service: 'Banking Services', requiredRTO: 6 }
      ]
    }
  }
];

// Mock available resources data (for Resource Gap Analysis)
const mockAvailableResources = {
  people: [
    { role: 'Payroll Manager', available: 1 },
    { role: 'Finance Director', available: 1 },
    { role: 'Support Manager', available: 2 },
    { role: 'Team Lead', available: 3 },
    { role: 'Sales Manager', available: 1 },
    { role: 'Warehouse Manager', available: 1 },
    { role: 'IT Database Admin', available: 2 }
  ],
  applications: [
    { name: 'SAP Production Server', available: 1 },
    { name: 'Salesforce CRM', available: 1 },
    { name: 'Order Management System', available: 1 },
    { name: 'Financial Database', available: 1 },
    { name: 'HR Information System', available: 1 }
  ]
};

export default function ConsolidationPage() {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'gap-analysis' | 'conflicts' | 'master-list' | 'precedence'>('gap-analysis');
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    rtoRange: { min: '', max: '' },
    status: '',
    searchTerm: '',
    recordType: '' // 'process', 'department', or ''
  });

  // Toggle record selection
  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  // Select all filtered records
  const selectAllFiltered = () => {
    const filteredIds = filteredRecords.map(record => record.id);
    setSelectedRecords(filteredIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedRecords([]);
  };

  // Filter records based on filters
  const filteredRecords = useMemo(() => {
    return mockBIARecords.filter(record => {
      const matchesDepartment = !filters.department || record.department === filters.department;
      const matchesLocation = !filters.location || record.location === filters.location;
      const matchesStatus = !filters.status || record.status === filters.status;
      const matchesRecordType = !filters.recordType ||
        (filters.recordType === 'process' && !record.type) ||
        (filters.recordType === 'department' && record.type === 'department');

      const recordName = record.processName || record.departmentName || '';
      const matchesSearch = !filters.searchTerm ||
        recordName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesRTO = (!filters.rtoRange.min || record.rto >= parseInt(filters.rtoRange.min)) &&
                        (!filters.rtoRange.max || record.rto <= parseInt(filters.rtoRange.max));

      return matchesDepartment && matchesLocation && matchesStatus && matchesSearch && matchesRTO && matchesRecordType;
    });
  }, [filters]);

  // Get selected records data
  const selectedRecordsData = useMemo(() => {
    return mockBIARecords.filter(record => selectedRecords.includes(record.id));
  }, [selectedRecords]);

  // Calculate consolidated KPIs
  const consolidatedKPIs = useMemo(() => {
    const records = selectedRecordsData;

    const processesInScope = records.length;
    const tier1Processes = records.filter(r => r.criticality.tier.includes('Tier 1')).length;
    const averageRTO = records.length > 0 ?
      Math.round((records.reduce((sum, r) => sum + r.rto, 0) / records.length) * 10) / 10 : 0;

    // Calculate unique critical staff
    const allPeople = records.flatMap(r => r.dependencies.criticalPeople);
    const uniquePeople = new Set(allPeople.map(p => p.name));
    const totalCriticalStaff = uniquePeople.size;

    // Calculate unique critical applications
    const allApplications = records.flatMap(r => r.dependencies.criticalAssets.filter(a => a.type === 'Application'));
    const uniqueApplications = new Set(allApplications.map(a => a.name));
    const totalCriticalApplications = uniqueApplications.size;

    return {
      processesInScope,
      tier1Processes,
      averageRTO,
      totalCriticalStaff,
      totalCriticalApplications
    };
  }, [selectedRecordsData]);

  // Chart data for criticality distribution
  const criticalityChartData = useMemo(() => {
    const records = selectedRecordsData;
    const tierCounts = [
      { name: 'Tier 1', value: records.filter(r => r.criticality.tier.includes('Tier 1')).length, color: '#dc2626' },
      { name: 'Tier 2', value: records.filter(r => r.criticality.tier.includes('Tier 2')).length, color: '#f97316' },
      { name: 'Tier 3', value: records.filter(r => r.criticality.tier.includes('Tier 3')).length, color: '#f59e0b' },
      { name: 'Tier 4', value: records.filter(r => r.criticality.tier.includes('Tier 4')).length, color: '#10b981' },
      { name: 'Tier 5', value: records.filter(r => r.criticality.tier.includes('Tier 5')).length, color: '#6b7280' },
    ];

    return tierCounts;
  }, [selectedRecordsData]);

  // Department distribution for Tier 1 processes
  const departmentChartData = useMemo(() => {
    const tier1Records = selectedRecordsData.filter(r => r.criticality.tier.includes('Tier 1'));
    const departmentCounts = tier1Records.reduce((acc, record) => {
      acc[record.department] = (acc[record.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return Object.entries(departmentCounts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [selectedRecordsData]);

  // Recovery timeline data
  const timelineChartData = useMemo(() => {
    const records = selectedRecordsData.sort((a, b) => a.rto - b.rto);

    return records.map(r => ({
      name: r.processName || r.departmentName || 'Unknown',
      rto: r.rto,
      color: r.criticality.tier.includes('Tier 1') ? '#dc2626' :
             r.criticality.tier.includes('Tier 2') ? '#f97316' :
             r.criticality.tier.includes('Tier 3') ? '#f59e0b' : '#10b981'
    }));
  }, [selectedRecordsData]);

  // Resource Gap Analysis
  const resourceGapAnalysis = useMemo(() => {
    const records = selectedRecordsData;

    // Analyze people requirements
    const peopleRequirements = records.flatMap(r => r.dependencies.criticalPeople);
    const roleRequirements = peopleRequirements.reduce((acc, person) => {
      acc[person.role] = (acc[person.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peopleGaps = Object.entries(roleRequirements).map(([role, required]) => {
      const available = mockAvailableResources.people.find(p => p.role === role)?.available || 0;
      return {
        resourceType: role,
        required,
        available,
        gap: available - required
      };
    });

    // Analyze application requirements
    const appRequirements = records.flatMap(r => r.dependencies.criticalAssets.filter(a => a.type === 'Application'));
    const appCounts = appRequirements.reduce((acc, app) => {
      acc[app.name] = (acc[app.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const appGaps = Object.entries(appCounts).map(([name, required]) => {
      const available = mockAvailableResources.applications.find(a => a.name === name)?.available || 0;
      return {
        resourceType: name,
        required,
        available,
        gap: available - required
      };
    });

    return [...peopleGaps, ...appGaps];
  }, [selectedRecordsData]);

  // Dependency Conflict Analysis
  const dependencyConflicts = useMemo(() => {
    const conflicts: Array<{
      processName: string;
      processRTO: number;
      conflictingDependency: string;
      dependencyRTO: number;
    }> = [];

    selectedRecordsData.forEach(record => {
      record.dependencies.upstreamProcesses.forEach(upstream => {
        if (record.rto < upstream.rto) {
          conflicts.push({
            processName: record.processName || 'Unknown Process',
            processRTO: record.rto,
            conflictingDependency: upstream.name,
            dependencyRTO: upstream.rto
          });
        }
      });
    });

    return conflicts;
  }, [selectedRecordsData]);

  // Export functionality
  const exportReport = () => {
    const reportData = {
      kpis: consolidatedKPIs,
      selectedRecords: selectedRecordsData,
      resourceGaps: resourceGapAnalysis,
      conflicts: dependencyConflicts,
      generatedAt: new Date().toISOString()
    };

    // Create CSV content
    const csvHeaders = ['Process Name', 'Department', 'Location', 'RTO (hours)', 'Criticality', 'Status', 'Owner'];
    const csvContent = [
      csvHeaders.join(','),
      ...selectedRecordsData.map(record => [
        record.processName,
        record.department,
        record.location,
        record.rto,
        record.criticality.tier,
        record.status,
        record.owner
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bia-consolidation-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  BIA Consolidation
                </h1>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  Dynamic analysis and reporting of BIA records
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">
                  {selectedRecords.length} of {filteredRecords.length} selected
                </span>
                <button
                  onClick={exportReport}
                  disabled={selectedRecords.length === 0}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 sm:px-8 space-y-6">
            {/* Record Selection */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Select BIA Records for Analysis</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllFiltered}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Select All Filtered
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllSelections}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Filters - Consistent sizing */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">All Departments</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">All Locations</option>
                    <option value="Gurugram Head Office">Gurugram Head Office</option>
                    <option value="Mumbai Branch Office">Mumbai Branch Office</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.recordType}
                    onChange={(e) => setFilters(prev => ({ ...prev, recordType: e.target.value }))}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="process">Process BIA</option>
                    <option value="department">Department BIA</option>
                  </select>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="block w-full h-[30px] pl-7 pr-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Record Selection Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[40px]">
                        <input
                          type="checkbox"
                          checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                          onChange={() => selectedRecords.length === filteredRecords.length ? clearAllSelections() : selectAllFiltered()}
                          className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded-sm"
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[180px]">Name</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Department</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[140px]">Location</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[60px]">RTO</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Type</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Criticality</th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className={selectedRecords.includes(record.id) ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(record.id)}
                            onChange={() => toggleRecordSelection(record.id)}
                            className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded-sm"
                          />
                        </td>
                        <td className="px-3 py-3 w-[180px]">
                          <div className="text-xs font-medium text-gray-900 truncate">{record.processName || record.departmentName}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.department}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.location}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.rto}h</td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-[90px] px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-gray-50 text-gray-700 border-gray-200">
                            {record.type === 'department' ? 'Dept BIA' : 'Process BIA'}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-[90px] px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-gray-50 text-gray-700 border-gray-200">
                            {record.criticality.tier.replace(' (Critical)', '').replace(' (High)', '').replace(' (Medium)', '').replace(' (Low)', '').replace(' (Non-Critical)', '')}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center justify-center w-[100px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                            record.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            record.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consolidated KPI Cards */}
            {selectedRecords.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Processes in Scope</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{consolidatedKPIs.processesInScope}</p>
                    </div>
                    <div className="h-10 w-10 bg-gray-50 rounded-sm flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Tier 1 Processes</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">{consolidatedKPIs.tier1Processes}</p>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-sm flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Average RTO</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{consolidatedKPIs.averageRTO}h</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Critical Staff</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{consolidatedKPIs.totalCriticalStaff}</p>
                    </div>
                    <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Critical Apps</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{consolidatedKPIs.totalCriticalApplications}</p>
                    </div>
                    <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                      <ServerIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Visualizations */}
            {selectedRecords.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Processes by Criticality Tier</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={criticalityChartData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          stroke="#6b7280"
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          stroke="#6b7280"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {criticalityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Tier 1 Processes by Department</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {departmentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '12px'
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '10px' }}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Recovery Timeline */}
            {selectedRecords.length > 0 && (
              <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Recovery Timeline</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timelineChartData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        stroke="#6b7280"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        stroke="#6b7280"
                        label={{ value: 'RTO (hours)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="rto" radius={[4, 4, 0, 0]}>
                        {timelineChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Detailed Drill-Down Tables */}
            {selectedRecords.length > 0 && (
              <div className="border border-gray-200 rounded-sm bg-white hover:shadow-md transition-shadow duration-200">
                <div className="border-b border-gray-200 px-6 py-5">
                  {/* Elegant Center-Aligned Tab Switcher */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                      {[
                        { id: 'gap-analysis', name: 'Resource Gap Analysis', icon: UserGroupIcon },
                        { id: 'conflicts', name: 'Dependency Conflicts', icon: ExclamationTriangleIcon },
                        { id: 'precedence', name: 'Data Precedence', icon: ArrowsUpDownIcon },
                        { id: 'master-list', name: 'Master List', icon: TableCellsIcon }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                            {tab.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

          <div className="p-6">
            {activeTab === 'gap-analysis' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Resource Gap Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[200px]">Resource Type</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">Required Count</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">Available Count</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">Gap</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {resourceGapAnalysis.map((gap, index) => (
                        <tr key={index} className={gap.gap < 0 ? 'bg-red-50' : ''}>
                          <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">{gap.resourceType}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{gap.required}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{gap.available}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-center">
                            <span className={`inline-flex items-center justify-center w-[100px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${gap.gap < 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                              {gap.gap < 0 ? `${Math.abs(gap.gap)} shortage` : `${gap.gap} surplus`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'conflicts' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Dependency Conflict Analysis</h3>
                {dependencyConflicts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[180px]">Process</th>
                          <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Process RTO</th>
                          <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[180px]">Conflicting Dependency</th>
                          <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">Dependency RTO</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dependencyConflicts.map((conflict, index) => (
                          <tr key={index} className="bg-red-50">
                            <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">{conflict.processName}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs text-red-600 font-medium text-center">{conflict.processRTO}h</td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">{conflict.conflictingDependency}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs text-red-600 font-medium text-center">{conflict.dependencyRTO}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-green-600">
                    <CheckIcon className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-sm font-medium">No dependency conflicts found</p>
                    <p className="text-xs text-gray-500 mt-1">All process RTOs are properly aligned with their dependencies</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'precedence' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Precedence Rules</h3>

                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Precedence Hierarchy</h4>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-purple-100 text-purple-800 mr-3 border border-purple-200">
                        1st Priority
                      </span>
                      <strong>Department BIA</strong> - Always takes precedence when it exists
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-blue-100 text-blue-800 mr-3 border border-blue-200">
                        2nd Priority
                      </span>
                      <strong>Aggregated Process BIA</strong> - Used only when no Department BIA exists
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-800 mr-3 border border-gray-200">
                        Reference
                      </span>
                      <strong>Process Rollup</strong> - Shown during Department BIA creation for reference
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Group records by department to show precedence */}
                  {Object.entries(
                    selectedRecordsData.reduce((groups, record) => {
                      const dept = record.department;
                      if (!groups[dept]) groups[dept] = [];
                      groups[dept].push(record);
                      return groups;
                    }, {} as Record<string, any[]>)
                  ).map(([department, records]) => {
                    const departmentBIA = records.find(r => r.type === 'department');
                    const processBIAs = records.filter(r => !r.type || r.type === 'process');

                    return (
                      <div key={department} className="border border-gray-200 rounded-sm p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">{department}</h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Authoritative Source */}
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h5 className="text-xs font-medium text-purple-900 mb-2">
                              📋 Authoritative Data (Used in Reports)
                            </h5>
                            {departmentBIA ? (
                              <div className="bg-purple-50 border border-purple-200 rounded-sm p-3">
                                <div className="text-xs font-medium text-gray-900">{departmentBIA.departmentName}</div>
                                <div className="text-[10px] text-gray-600 mt-1">
                                  RTO: {departmentBIA.rto}h | {departmentBIA.criticality.tier} | {departmentBIA.status}
                                </div>
                                <div className="text-[10px] text-purple-700 mt-1">
                                  ✓ Department BIA takes precedence
                                </div>
                              </div>
                            ) : (
                              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                                <div className="text-xs font-medium text-gray-900">Aggregated from {processBIAs.length} processes</div>
                                <div className="text-[10px] text-gray-600 mt-1">
                                  RTO: {Math.max(...processBIAs.map(p => p.rto))}h |
                                  Highest: {processBIAs.reduce((highest, p) =>
                                    p.criticality.tier.includes('Tier 1') ? p.criticality.tier : highest, 'Tier 5'
                                  )}
                                </div>
                                <div className="text-[10px] text-blue-700 mt-1">
                                  ℹ️ Using process aggregation (no Department BIA exists)
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Reference Data */}
                          <div className="border-l-4 border-gray-400 pl-4">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">
                              📖 Reference Data (Information Only)
                            </h5>
                            {departmentBIA && processBIAs.length > 0 ? (
                              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                                <div className="text-xs font-medium text-gray-900">
                                  {processBIAs.length} constituent processes
                                </div>
                                <div className="text-[10px] text-gray-600 mt-1">
                                  Suggested RTO: {Math.max(...processBIAs.map(p => p.rto))}h
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1">
                                  💡 Shown during Department BIA creation
                                </div>
                              </div>
                            ) : departmentBIA ? (
                              <div className="text-[10px] text-gray-500 italic">
                                No process BIAs for reference
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-500 italic">
                                No Department BIA exists
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Process List */}
                        {processBIAs.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h6 className="text-[10px] font-medium text-gray-700 mb-2">Constituent Processes:</h6>
                            <div className="flex flex-wrap gap-2">
                              {processBIAs.map(process => (
                                <span key={process.id} className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                                  {process.processName} ({process.rto}h)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'master-list' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Master List of Selected Records</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[180px]">Process Name</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Department</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[140px]">Location</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[60px]">RTO</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[60px]">RPO</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Criticality</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedRecordsData.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 w-[180px]">
                            <div className="text-xs font-medium text-gray-900 truncate">{record.processName || record.departmentName}</div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.department}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.location}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.rto}h</td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.rpo}h</td>
                          <td className="px-3 py-3 whitespace-nowrap text-center">
                            <span className="inline-flex items-center justify-center w-[90px] px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-gray-50 text-gray-700 border-gray-200">
                              {record.criticality.tier.replace(' (Critical)', '').replace(' (High)', '').replace(' (Medium)', '').replace(' (Low)', '').replace(' (Non-Critical)', '')}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center justify-center w-[100px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                              record.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              record.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{record.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

            {/* No Selection State */}
            {selectedRecords.length === 0 && (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base font-medium text-gray-900 mb-2">Select BIA Records to Begin Analysis</h3>
                <p className="text-sm text-gray-500">Choose one or more BIA records from the table above to see consolidated analytics, visualizations, and detailed analysis.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
