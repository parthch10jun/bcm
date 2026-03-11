'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentTextIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/date-utils';

interface RiskFilter {
  impact?: string;
  likelihood?: string;
}

interface RiskAssessmentRecordsProps {
  riskFilter: RiskFilter | null;
  onClearFilter: () => void;
  assessments?: any[]; // Real assessments from API
  loading?: boolean;
  onRefresh?: () => void;
}

interface RiskAssessment {
  id: string;
  name: string;
  type: 'Asset-centric' | 'Location-centric' | 'Service-centric' | 'Department-centric' | 'Vendor-centric';
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Under Review';
  lastModified: string;
  owner: string;
  impact?: string;
  likelihood?: string;
}

// Mock data for risk assessments
const mockAssessments: RiskAssessment[] = [
  {
    id: '1',
    name: 'IT Infrastructure Risk Assessment 2024',
    type: 'Asset-centric',
    highRisks: 3,
    mediumRisks: 8,
    lowRisks: 12,
    status: 'Completed',
    lastModified: '2024-01-15',
    owner: 'John Smith',
    impact: 'Major',
    likelihood: 'Likely'
  },
  {
    id: '2',
    name: 'Bengaluru Office Security Assessment',
    type: 'Location-centric',
    highRisks: 2,
    mediumRisks: 5,
    lowRisks: 8,
    status: 'In Progress',
    lastModified: '2024-01-14',
    owner: 'Sarah Johnson',
    impact: 'Moderate',
    likelihood: 'Possible'
  },
  {
    id: '3',
    name: 'Customer Service Operations Risk Review',
    type: 'Service-centric',
    highRisks: 1,
    mediumRisks: 6,
    lowRisks: 15,
    status: 'Under Review',
    lastModified: '2024-01-13',
    owner: 'Mike Chen',
    impact: 'Minor',
    likelihood: 'Unlikely'
  },
  {
    id: '4',
    name: 'Finance Department Risk Analysis',
    type: 'Department-centric',
    highRisks: 4,
    mediumRisks: 7,
    lowRisks: 9,
    status: 'Completed',
    lastModified: '2024-01-12',
    owner: 'Lisa Wang',
    impact: 'Severe',
    likelihood: 'Possible'
  },
  {
    id: '5',
    name: 'Third-Party Vendor Risk Assessment',
    type: 'Vendor-centric',
    highRisks: 2,
    mediumRisks: 9,
    lowRisks: 11,
    status: 'Draft',
    lastModified: '2024-01-11',
    owner: 'David Brown',
    impact: 'Major',
    likelihood: 'Likely'
  }
];

export default function RiskAssessmentRecords({ riskFilter, onClearFilter, assessments = [], loading = false, onRefresh }: RiskAssessmentRecordsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Use real assessments if provided, otherwise fall back to mock data
  const dataSource = assessments.length > 0 ? assessments : mockAssessments;

  // Filter assessments based on search term, filters, and heat map selection
  const filteredAssessments = useMemo(() => {
    return dataSource.filter(assessment => {
      const name = assessment.assessmentName || assessment.name || '';
      const owner = assessment.assessorName || assessment.owner || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || assessment.status === statusFilter;
      const matchesType = !typeFilter || (assessment.contextType || assessment.type) === typeFilter;
      
      const matchesRiskFilter = !riskFilter || 
        (assessment.impact === riskFilter.impact && assessment.likelihood === riskFilter.likelihood);

      return matchesSearch && matchesStatus && matchesType && matchesRiskFilter;
    });
  }, [dataSource, searchTerm, statusFilter, typeFilter, riskFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeChipClass = (type: string) => {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    switch (type) {
      case 'Asset-centric':
        return `${baseClass} bg-purple-100 text-purple-800 border-purple-200`;
      case 'Location-centric':
        return `${baseClass} bg-blue-100 text-blue-800 border-blue-200`;
      case 'Service-centric':
        return `${baseClass} bg-green-100 text-green-800 border-green-200`;
      case 'Department-centric':
        return `${baseClass} bg-orange-100 text-orange-800 border-orange-200`;
      case 'Vendor-centric':
        return `${baseClass} bg-red-100 text-red-800 border-red-200`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading risk assessments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Risk Assessment Records
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Manage and review all risk assessment activities
            </p>
          </div>
          <div className="text-xs text-gray-500">
            {filteredAssessments.length} of {dataSource.length} records
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-3">
        {/* Active Risk Filter Display */}
        {riskFilter && (
          <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-sm">
            <span className="text-xs text-blue-800">
              <strong>Active Filter:</strong> {riskFilter.impact} Impact, {riskFilter.likelihood} Likelihood
            </span>
            <button
              onClick={onClearFilter}
              className="text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm text-xs bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-40 px-2.5 py-1.5 border border-gray-300 rounded-sm bg-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full sm:w-40 px-2.5 py-1.5 border border-gray-300 rounded-sm bg-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="">All Types</option>
            <option value="PROCESS">Process</option>
            <option value="LOCATION">Location</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="APPLICATION">Application</option>
            <option value="PEOPLE">People</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Assessment Name
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Context
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Threats
              </th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Assessor
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssessments.map((assessment) => {
              const name = assessment.assessmentName || assessment.name || '';
              const contextName = assessment.contextName || '';
              const type = assessment.contextType || assessment.type || '';
              const owner = assessment.assessorName || assessment.owner || '';
              const status = assessment.status || 'DRAFT';
              const riskLevel = assessment.overallRiskLevel || 'MEDIUM';

              // Calculate threat count
              const threats = assessment.threatAssessments || [];
              const threatCount = threats.length;

              return (
              <tr key={assessment.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-3 py-3">
                  <button
                    onClick={() => router.push(`/risk-assessment/${assessment.id}`)}
                    className="text-xs font-medium text-gray-900 hover:text-blue-600 text-left transition-colors duration-150"
                  >
                    {name}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-600">{contextName}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {type}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="text-xs font-semibold text-gray-900">{threatCount}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                    riskLevel === 'CRITICAL' || riskLevel === 'VERY_HIGH' ? 'bg-red-100 text-red-800 border-red-200' :
                    riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-green-100 text-green-800 border-green-200'
                  }`}>
                    {riskLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                    status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                    status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-600">{owner}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-500">{formatDate(assessment.assessmentDate || assessment.updatedAt || assessment.lastModified)}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => router.push(`/risk-assessment/${assessment.id}`)}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                      title="View Report"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-green-600 transition-colors duration-150"
                      title="Generate PDF"
                    >
                      <DocumentTextIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                      title="Delete"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="text-gray-300 text-5xl mb-3">📊</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            No Risk Assessments Found
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {riskFilter || searchTerm || statusFilter || typeFilter
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first risk assessment.'}
          </p>
          {(!riskFilter && !searchTerm && !statusFilter && !typeFilter) && (
            <button className="px-3 py-1.5 text-xs rounded-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-150">
              Create New Assessment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
