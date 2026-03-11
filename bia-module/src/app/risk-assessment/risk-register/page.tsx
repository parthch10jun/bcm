'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { riskAssessmentService, threatAssessmentService } from '@/services/riskAssessmentService';
import { RiskAssessment, ThreatAssessment, RiskLevel } from '@/types/risk-assessment';

interface RiskRegisterEntry {
  id: number;
  riskId: string;
  riskName: string;
  riskDescription: string;
  category: string;
  contextType: string;
  contextName: string;
  threatType: string;
  businessUnit: string;
  inherentLikelihood: number;
  inherentImpact: number;
  inherentRiskScore: number;
  inherentRiskLevel: RiskLevel;
  residualLikelihood?: number;
  residualImpact?: number;
  residualRiskScore?: number;
  residualRiskLevel?: string;
  existingControls: string;
  controlCount: number;
  controlEffectiveness: string;
  treatmentStatus: string;
  treatmentDueDate?: string;
  riskOwner: string;
  assessmentDate: string;
  nextReviewDate: string;
  reviewSlaStatus: 'ON_TRACK' | 'AT_RISK' | 'OVERDUE';
  assessmentId: number;
  threatAssessmentId: number;
}

export default function RiskRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [riskEntries, setRiskEntries] = useState<RiskRegisterEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    contextType: '',
    riskLevel: '',
    residualRiskLevel: '',
    treatmentStatus: '',
    controlEffectiveness: '',
    businessUnit: '',
    slaStatus: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'inherentRiskScore',
    direction: 'desc'
  });

  useEffect(() => {
    loadRiskRegister();
  }, []);

  const loadRiskRegister = async () => {
    try {
      setLoading(true);
      const assessments = await riskAssessmentService.getAll();
      
      // Flatten all threat assessments into risk register entries
      const entries: RiskRegisterEntry[] = [];
      
      for (const assessment of assessments) {
        if (assessment.threatAssessments && assessment.threatAssessments.length > 0) {
          for (const threat of assessment.threatAssessments) {
            // Calculate SLA status based on next review date
            const nextReview = (assessment as any).nextReviewDate;
            let slaStatus: 'ON_TRACK' | 'AT_RISK' | 'OVERDUE' = 'ON_TRACK';
            if (nextReview) {
              const daysUntilReview = Math.ceil((new Date(nextReview).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              if (daysUntilReview < 0) slaStatus = 'OVERDUE';
              else if (daysUntilReview <= 7) slaStatus = 'AT_RISK';
            }

            entries.push({
              id: threat.id,
              riskId: `RISK-${assessment.id}-${threat.id}`,
              riskName: threat.threat?.name || 'Unknown Threat',
              riskDescription: threat.threat?.description || '',
              category: assessment.riskCategory?.name || '',
              contextType: assessment.contextType || '',
              contextName: assessment.contextName || '',
              threatType: threat.threat?.threatType?.name || '',
              businessUnit: (assessment as any).businessUnit || 'Corporate',
              inherentLikelihood: threat.likelihoodScore || 0,
              inherentImpact: threat.impactScore || 0,
              inherentRiskScore: threat.riskScore || 0,
              inherentRiskLevel: threat.riskLevel || RiskLevel.LOW,
              residualLikelihood: threat.residualRiskScore ? Math.floor(threat.residualRiskScore / 5) : undefined,
              residualImpact: threat.residualRiskScore ? threat.residualRiskScore % 5 : undefined,
              residualRiskScore: threat.residualRiskScore,
              residualRiskLevel: threat.residualRiskLevel,
              existingControls: threat.currentControls || 'None',
              controlCount: (threat as any).controlCount || 0,
              controlEffectiveness: threat.controlEffectiveness || 'Not Assessed',
              treatmentStatus: (threat as any).treatmentStatus || 'Pending',
              treatmentDueDate: (threat as any).treatmentDueDate,
              riskOwner: assessment.assessor || 'Unassigned',
              assessmentDate: assessment.assessmentDate || assessment.createdAt,
              nextReviewDate: nextReview || '',
              reviewSlaStatus: slaStatus,
              assessmentId: assessment.id,
              threatAssessmentId: threat.id
            });
          }
        }
      }
      
      setRiskEntries(entries);
    } catch (error) {
      console.error('Failed to load risk register:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredEntries = useMemo(() => {
    let result = [...riskEntries];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(entry =>
        entry.riskId.toLowerCase().includes(term) ||
        entry.riskName.toLowerCase().includes(term) ||
        entry.riskDescription.toLowerCase().includes(term) ||
        entry.contextName.toLowerCase().includes(term) ||
        entry.riskOwner.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(entry => entry.category === filters.category);
    }

    // Context type filter
    if (filters.contextType) {
      result = result.filter(entry => entry.contextType === filters.contextType);
    }

    // Risk level filter
    if (filters.riskLevel) {
      result = result.filter(entry => entry.inherentRiskLevel === filters.riskLevel);
    }

    // Treatment status filter
    if (filters.treatmentStatus) {
      result = result.filter(entry => entry.treatmentStatus === filters.treatmentStatus);
    }

    // Control effectiveness filter
    if (filters.controlEffectiveness) {
      result = result.filter(entry => entry.controlEffectiveness === filters.controlEffectiveness);
    }

    // Business unit filter
    if (filters.businessUnit) {
      result = result.filter(entry => entry.businessUnit === filters.businessUnit);
    }

    // Residual risk level filter
    if (filters.residualRiskLevel) {
      result = result.filter(entry => entry.residualRiskLevel === filters.residualRiskLevel);
    }

    // SLA status filter
    if (filters.slaStatus) {
      result = result.filter(entry => entry.reviewSlaStatus === filters.slaStatus);
    }

    return result;
  }, [riskEntries, searchTerm, filters]);

  // Sorting logic
  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries];

    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof RiskRegisterEntry];
      const bValue = b[sortConfig.key as keyof RiskRegisterEntry];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredEntries, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToCSV = () => {
    const headers = [
      'Risk ID', 'Risk Name', 'Category', 'Context Type', 'Context Name', 'Threat Type',
      'Inherent Likelihood', 'Inherent Impact', 'Inherent Risk Score', 'Inherent Risk Level',
      'Residual Risk Score', 'Residual Risk Level', 'Existing Controls', 'Control Effectiveness',
      'Treatment Status', 'Risk Owner', 'Assessment Date', 'Next Review Date'
    ];

    const rows = sortedEntries.map(entry => [
      entry.riskId,
      entry.riskName,
      entry.category,
      entry.contextType,
      entry.contextName,
      entry.threatType,
      entry.inherentLikelihood,
      entry.inherentImpact,
      entry.inherentRiskScore,
      entry.inherentRiskLevel,
      entry.residualRiskScore || 'N/A',
      entry.residualRiskLevel || 'N/A',
      entry.existingControls,
      entry.controlEffectiveness,
      entry.treatmentStatus,
      entry.riskOwner,
      entry.assessmentDate,
      entry.nextReviewDate || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-register-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRiskLevelBadge = (level: RiskLevel) => {
    const styles: Record<string, string> = {
      [RiskLevel.VERY_HIGH]: 'bg-red-100 text-red-800 border-red-200',
      [RiskLevel.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [RiskLevel.LOW]: 'bg-green-100 text-green-800 border-green-200',
      [RiskLevel.VERY_LOW]: 'bg-green-50 text-green-700 border-green-100'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${styles[level] || styles[RiskLevel.LOW]}`}>
        {level}
      </span>
    );
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      contextType: '',
      riskLevel: '',
      residualRiskLevel: '',
      treatmentStatus: '',
      controlEffectiveness: '',
      businessUnit: '',
      slaStatus: ''
    });
    setSearchTerm('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0);

  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(riskEntries.map(e => e.category))].filter(Boolean);
  const uniqueContextTypes = [...new Set(riskEntries.map(e => e.contextType))].filter(Boolean);
  const uniqueTreatmentStatuses = [...new Set(riskEntries.map(e => e.treatmentStatus))].filter(Boolean);
  const uniqueControlEffectiveness = [...new Set(riskEntries.map(e => e.controlEffectiveness))].filter(Boolean);
  const uniqueBusinessUnits = [...new Set(riskEntries.map(e => e.businessUnit))].filter(Boolean);

  const getSlaStatusBadge = (status: 'ON_TRACK' | 'AT_RISK' | 'OVERDUE') => {
    const styles = {
      'ON_TRACK': 'bg-green-100 text-green-800',
      'AT_RISK': 'bg-amber-100 text-amber-800',
      'OVERDUE': 'bg-red-100 text-red-800'
    };
    const labels = {
      'ON_TRACK': 'On Track',
      'AT_RISK': 'At Risk',
      'OVERDUE': 'Overdue'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Statistics
  const stats = useMemo(() => {
    const total = filteredEntries.length;
    const critical = filteredEntries.filter(e => e.inherentRiskLevel === RiskLevel.VERY_HIGH).length;
    const high = filteredEntries.filter(e => e.inherentRiskLevel === RiskLevel.HIGH).length;
    const medium = filteredEntries.filter(e => e.inherentRiskLevel === RiskLevel.MEDIUM).length;
    const low = filteredEntries.filter(e => e.inherentRiskLevel === RiskLevel.LOW || e.inherentRiskLevel === RiskLevel.VERY_LOW).length;
    const withTreatment = filteredEntries.filter(e => e.treatmentStatus !== 'Pending').length;

    return { total, critical, high, medium, low, withTreatment };
  }, [filteredEntries]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Enterprise Risk Register</h1>
            <p className="mt-0.5 text-xs text-gray-500">Centralized repository of all identified risks across the organization</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/risk-assessment')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back
            </button>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1" />
              Export CSV
            </button>
            <button
              onClick={() => router.push('/risk-assessment/new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Statistics Bar */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Risks</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical</p>
            <p className="text-2xl font-semibold text-red-600 mt-2">{stats.critical}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">High</p>
            <p className="text-2xl font-semibold text-orange-600 mt-2">{stats.high}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Medium</p>
            <p className="text-2xl font-semibold text-yellow-600 mt-2">{stats.medium}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Low</p>
            <p className="text-2xl font-semibold text-green-600 mt-2">{stats.low}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">With Treatment</p>
            <p className="text-2xl font-semibold text-blue-600 mt-2">{stats.withTreatment}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Risk ID, name, description, context, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-1.5 border rounded-sm text-xs font-medium ${
                showFilters || activeFilterCount > 0
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-3.5 w-3.5 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-600 text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-3.5 w-3.5 mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-sm border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Context Type</label>
                <select
                  value={filters.contextType}
                  onChange={(e) => setFilters({ ...filters, contextType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {uniqueContextTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value={RiskLevel.VERY_HIGH}>Very High</option>
                  <option value={RiskLevel.HIGH}>High</option>
                  <option value={RiskLevel.MEDIUM}>Medium</option>
                  <option value={RiskLevel.LOW}>Low</option>
                  <option value={RiskLevel.VERY_LOW}>Very Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Treatment Status</label>
                <select
                  value={filters.treatmentStatus}
                  onChange={(e) => setFilters({ ...filters, treatmentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {uniqueTreatmentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Control Effectiveness</label>
                <select
                  value={filters.controlEffectiveness}
                  onChange={(e) => setFilters({ ...filters, controlEffectiveness: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Effectiveness</option>
                  {uniqueControlEffectiveness.map(eff => (
                    <option key={eff} value={eff}>{eff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Unit</label>
                <select
                  value={filters.businessUnit}
                  onChange={(e) => setFilters({ ...filters, businessUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Units</option>
                  {uniqueBusinessUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Residual Risk</label>
                <select
                  value={filters.residualRiskLevel}
                  onChange={(e) => setFilters({ ...filters, residualRiskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value={RiskLevel.VERY_HIGH}>Very High</option>
                  <option value={RiskLevel.HIGH}>High</option>
                  <option value={RiskLevel.MEDIUM}>Medium</option>
                  <option value={RiskLevel.LOW}>Low</option>
                  <option value={RiskLevel.VERY_LOW}>Very Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">SLA Status</label>
                <select
                  value={filters.slaStatus}
                  onChange={(e) => setFilters({ ...filters, slaStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All SLA</option>
                  <option value="ON_TRACK">On Track</option>
                  <option value="AT_RISK">At Risk</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Risk Register Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading risk register...</div>
              </div>
            ) : sortedEntries.length === 0 ? (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">No risks found</p>
                <p className="text-xs text-gray-500 mt-2">
                  {activeFilterCount > 0 ? 'Try adjusting your filters' : 'Create a risk assessment to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        onClick={() => handleSort('riskId')}
                        className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Risk ID</span>
                          <ChevronUpDownIcon className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('riskName')}
                        className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Risk Name</span>
                          <ChevronUpDownIcon className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Context
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Threat Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Business Unit
                      </th>
                      <th
                        onClick={() => handleSort('inherentRiskScore')}
                        className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <span>Inherent Risk</span>
                          <ChevronUpDownIcon className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Residual Risk
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Controls
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Treatment
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        SLA Status
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-3 py-3">
                          <span className="text-xs font-medium text-blue-600">{entry.riskId}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs font-medium text-gray-900">{entry.riskName}</div>
                          {entry.riskDescription && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.riskDescription}</div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">{entry.category}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-900">{entry.contextName}</div>
                          <div className="text-xs text-gray-500">{entry.contextType}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">{entry.threatType}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">{entry.businessUnit}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="text-xs font-semibold text-gray-900">
                              {entry.inherentLikelihood} × {entry.inherentImpact} = {entry.inherentRiskScore}
                            </div>
                            {getRiskLevelBadge(entry.inherentRiskLevel)}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {entry.residualRiskScore ? (
                            <div className="flex flex-col items-center space-y-1">
                              <div className="text-xs font-semibold text-gray-900">
                                {entry.residualLikelihood} × {entry.residualImpact} = {entry.residualRiskScore}
                              </div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {entry.residualRiskLevel}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Not assessed</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-600 line-clamp-2">{entry.existingControls}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Effectiveness: <span className="font-medium">{entry.controlEffectiveness}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                            entry.treatmentStatus === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            entry.treatmentStatus === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            entry.treatmentStatus === 'Planned' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {entry.treatmentStatus}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">{entry.riskOwner}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {getSlaStatusBadge(entry.reviewSlaStatus)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => router.push(`/risk-assessment/${entry.assessmentId}`)}
                              className="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                              title="View Assessment"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                              title="View Details"
                            >
                              <ChartBarIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        {/* Results Summary */}
        {!loading && sortedEntries.length > 0 && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Showing {sortedEntries.length} of {riskEntries.length} total risks
          </div>
        )}
      </div>
    </div>
  );
}

