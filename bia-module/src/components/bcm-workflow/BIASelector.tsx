'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Sample BIA data for demonstration
const SAMPLE_BIAS = [
  {
    id: 1,
    biaName: 'Payment Processing System',
    status: 'APPROVED',
    businessFunction: 'Financial Operations',
    rtoHours: 4,
    rpoHours: 1,
    mtdHours: 24,
    criticality: 'CRITICAL',
    upstreamCount: 8,
    downstreamCount: 5,
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    biaName: 'Customer Portal',
    status: 'APPROVED',
    businessFunction: 'Customer Service',
    rtoHours: 8,
    rpoHours: 4,
    mtdHours: 48,
    criticality: 'HIGH',
    upstreamCount: 6,
    downstreamCount: 4,
    lastUpdated: '2024-01-10'
  },
  {
    id: 3,
    biaName: 'Core Banking System',
    status: 'APPROVED',
    businessFunction: 'Banking Operations',
    rtoHours: 2,
    rpoHours: 0.5,
    mtdHours: 12,
    criticality: 'CRITICAL',
    upstreamCount: 12,
    downstreamCount: 8,
    lastUpdated: '2024-01-20'
  },
  {
    id: 4,
    biaName: 'HR Management System',
    status: 'IN_PROGRESS',
    businessFunction: 'Human Resources',
    rtoHours: 24,
    rpoHours: 8,
    mtdHours: 72,
    criticality: 'MEDIUM',
    upstreamCount: 4,
    downstreamCount: 3,
    lastUpdated: '2024-01-18'
  },
  {
    id: 5,
    biaName: 'Supply Chain Management',
    status: 'APPROVED',
    businessFunction: 'Operations',
    rtoHours: 12,
    rpoHours: 4,
    mtdHours: 48,
    criticality: 'HIGH',
    upstreamCount: 10,
    downstreamCount: 6,
    lastUpdated: '2024-01-12'
  }
];

interface BIASelectorProps {
  selectedBiaId: number | null;
  onSelect: (bia: typeof SAMPLE_BIAS[0] | null) => void;
  filterApprovedOnly?: boolean;
}

export default function BIASelector({ selectedBiaId, onSelect, filterApprovedOnly = true }: BIASelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBias, setFilteredBias] = useState(SAMPLE_BIAS);

  useEffect(() => {
    let filtered = SAMPLE_BIAS;
    
    if (filterApprovedOnly) {
      filtered = filtered.filter(bia => bia.status === 'APPROVED');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(bia =>
        bia.biaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bia.businessFunction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBias(filtered);
  }, [searchTerm, filterApprovedOnly]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
            <CheckCircleIcon className="h-3 w-3" />
            Approved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-700 rounded-full">
            <ClockIcon className="h-3 w-3" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getCriticalityBadge = (criticality: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-700',
      HIGH: 'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700'
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${colors[criticality] || 'bg-gray-100 text-gray-700'}`}>
        {criticality}
      </span>
    );
  };

  const selectedBia = SAMPLE_BIAS.find(b => b.id === selectedBiaId);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search BIA records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* BIA List */}
      <div className="border border-gray-200 rounded-sm divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {filteredBias.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No BIA records found
          </div>
        ) : (
          filteredBias.map((bia) => (
            <div
              key={bia.id}
              onClick={() => onSelect(bia.id === selectedBiaId ? null : bia)}
              className={`p-3 cursor-pointer transition-colors ${
                bia.id === selectedBiaId
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{bia.biaName}</span>
                    {getCriticalityBadge(bia.criticality)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{bia.businessFunction}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(bia.status)}
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="font-medium">RTO:</span> {bia.rtoHours}h
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">RPO:</span> {bia.rpoHours}h
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3 text-blue-500" />
                  {bia.upstreamCount} upstream
                </span>
                <span className="flex items-center gap-1">
                  <ArrowDownIcon className="h-3 w-3 text-green-500" />
                  {bia.downstreamCount} downstream
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

