'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { biaService, BiaRecord } from '@/services/biaService';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Pagination from '@/components/Pagination';
import AIAgent from '@/components/AIAgent';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  EyeIcon,
  ChartBarIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

// Helper to get current fiscal year (assuming fiscal year starts in April)
function getCurrentFiscalYear(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  // If before April, fiscal year is previous year
  const fiscalYear = month < 3 ? year : year + 1;
  return `FY${fiscalYear}`;
}

// Demo BIA data
const DEMO_BIAS: BiaRecord[] = [
  {
    id: 1,
    biaName: 'IT Project Management - Business Impact Analysis',
    biaTargetId: 1,
    biaTargetType: 'PROCESS',
    biaType: 'PROCESS',
    status: 'APPROVED',
    finalRtoHours: 4,
    finalRpoHours: 2,
    finalCriticality: 'HIGH',
    biaCoordinator: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fiscalYear: 'FY2025',
    version: 3,
    versionLabel: 'FY2025-3',
    isLatestVersion: true
  },
  {
    id: 2,
    biaName: 'Customer Service Department - BIA',
    biaTargetId: 2,
    biaTargetType: 'ORGANIZATIONAL_UNIT',
    biaType: 'DEPARTMENT',
    status: 'IN_PROGRESS',
    finalRtoHours: 8,
    finalRpoHours: 4,
    finalCriticality: 'MEDIUM',
    biaCoordinator: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fiscalYear: 'FY2025',
    version: 1,
    versionLabel: 'FY2025-1',
    isLatestVersion: true
  },
  {
    id: 3,
    biaName: 'Data Center - Critical Infrastructure BIA',
    biaTargetId: 3,
    biaTargetType: 'LOCATION',
    biaType: 'LOCATION',
    status: 'PENDING_APPROVAL',
    finalRtoHours: 2,
    finalRpoHours: 1,
    finalCriticality: 'CRITICAL',
    biaCoordinator: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fiscalYear: 'FY2025',
    version: 5,
    versionLabel: 'FY2025-5',
    isLatestVersion: true
  }
];

export default function BiaRecordsPage() {
  const router = useRouter();
  const { currentUser } = useUserProfile();
  const [bias, setBias] = useState<BiaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTargetType, setSelectedTargetType] = useState<string>('');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      loadBias();
    }
  }, [currentUser, isDemoMode]);

  const loadBias = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // If demo mode is enabled, use demo data
      if (isDemoMode) {
        console.log('🎬 Demo mode enabled - using demo BIA data');
        setBias(DEMO_BIAS);
        setError(null);
        setLoading(false);
        return;
      }

      const data = await biaService.getAll();

      // Filter BIAs based on user role
      const filteredData = filterBiasByRole(data, currentUser.role, currentUser.id);
      setBias(filteredData);
      setError(null);
    } catch (err) {
      console.error('Error loading BIAs:', err);
      // Use demo data as fallback
      console.log('Using demo BIA data as fallback');
      setBias(DEMO_BIAS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Role-based filtering logic
  const filterBiasByRole = (allBias: BiaRecord[], role: string, userId: string): BiaRecord[] => {
    switch (role) {
      case 'CHAMPION':
        // Champions see BIAs where they are the champion (assignee)
        // In a real implementation, this would filter by championId field
        return allBias; // For now, show all - will be filtered by backend

      case 'SME':
        // SMEs only see BIAs assigned to them (delegatee)
        // In a real implementation, this would filter by smeId/delegateeId field
        return allBias.filter(bia =>
          bia.status === 'DRAFT' || bia.status === 'IN_PROGRESS'
        );

      case 'DIVISION_HEAD':
      case 'BCM_VERIFIER':
      case 'APPROVER':
        // Approvers only see BIAs pending their approval
        return allBias.filter(bia =>
          bia.status === 'PENDING_APPROVAL' || bia.status === 'APPROVED' || bia.status === 'REJECTED'
        );

      default:
        // BCM Manager (admin) sees everything
        return allBias;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this BIA?')) {
      return;
    }

    try {
      await biaService.delete(id);
      await loadBias();
    } catch (err) {
      console.error('Error deleting BIA:', err);
      alert('Failed to delete BIA');
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...bias];

    if (searchTerm) {
      filtered = filtered.filter(bia =>
        bia.biaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bia.biaCoordinator?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(bia => bia.status === selectedStatus);
    }

    if (selectedTargetType) {
      filtered = filtered.filter(bia => bia.biaTargetType === selectedTargetType);
    }

    if (selectedCriticality) {
      filtered = filtered.filter(bia => bia.finalCriticality === selectedCriticality);
    }

    return filtered;
  };

  const filteredBias = applyFilters();

  // Pagination
  const totalPages = Math.ceil(filteredBias.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBias = filteredBias.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedTargetType, selectedCriticality]);

  // KPI Calculations
  const totalBias = bias.length;
  const draftBias = bias.filter(b => b.status === 'DRAFT').length;
  const inProgressBias = bias.filter(b => b.status === 'IN_PROGRESS').length;
  const approvedBias = bias.filter(b => b.status === 'APPROVED').length;
  const pendingApprovalBias = bias.filter(b => b.status === 'PENDING_APPROVAL').length;
  const criticalBias = bias.filter(b => b.finalCriticality === 'CRITICAL' || b.finalCriticality === 'HIGH').length;
  const completedBias = bias.filter(b => b.finalRtoHours && b.finalRpoHours && b.finalCriticality).length;

  // Target type breakdown
  const targetTypeCounts = bias.reduce((acc, bia) => {
    const type = bia.biaTargetType || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTargetTypes = Object.entries(targetTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING_APPROVAL':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCriticalityBadgeColor = (criticality?: string) => {
    // Minimal color palette - all gray for enterprise look
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTargetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PROCESS: 'Process',
      ORGANIZATIONAL_UNIT: 'Org Unit',
      ASSET: 'Asset',
      LOCATION: 'Location',
      SERVICE: 'Service',
      VENDOR: 'Vendor',
      VITAL_RECORD: 'Vital Record',
    };
    return labels[type] || type;
  };

  // Check if user can create BIAs
  const canCreateBIA = currentUser?.role === 'CHAMPION' || !currentUser?.role; // BCM Manager (no specific role) can also create

  // Get role-specific page title and description
  const getRoleBasedTitle = () => {
    switch (currentUser?.role) {
      case 'CHAMPION':
        return {
          title: 'My Department\'s BIAs',
          description: 'Manage BIAs for your department, delegate to SMEs, and submit for approval'
        };
      case 'SME':
        return {
          title: 'My BIA Tasks',
          description: 'Complete BIAs assigned to you by Champions'
        };
      case 'DIVISION_HEAD':
        return {
          title: 'BIAs Pending Review',
          description: 'Review and approve BIAs submitted by Champions'
        };
      case 'BCM_VERIFIER':
        return {
          title: 'BIAs Pending Verification',
          description: 'Verify BIAs approved by Division Heads'
        };
      case 'APPROVER':
        return {
          title: 'BIAs Pending Final Approval',
          description: 'Final approval for verified BIAs'
        };
      default:
        return {
          title: 'BIA Control Tower',
          description: 'Organization-wide BIA management and campaign initiation'
        };
    }
  };

  const { title: pageTitle, description: pageDescription } = getRoleBasedTitle();

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading BIAs...</p>
        </div>
      </div>
    );
  }

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
                  Business Impact Analysis
                </h1>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {pageDescription}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* BCM Manager: Launch Campaign Button */}
                {!currentUser?.role && (
                  <button
                    onClick={() => {
                      alert('Launch BIA Campaign feature coming soon');
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    <RocketLaunchIcon className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </button>
                )}

                {/* Create BIA Button */}
                {canCreateBIA && (
                  <>
                    <button
                      onClick={() => router.push('/bia-records/new')}
                      className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      New BIA
                    </button>
                    <button
                      onClick={() => router.push('/bia-records/new-aia')}
                      className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      New AIA (Technical BIA)
                    </button>
                  </>
                )}

                {/* Demo BIA Button - Opens pre-filled wizard */}
                <button
                  onClick={() => router.push('/bia-records/new?demo=true')}
                  className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  🎬 Demo BIA
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 sm:px-8 space-y-6">
            {/* Records View */}
        {/* Role-Based KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          {/* BCM Manager: Show comprehensive stats (4 cards) */}
          {!currentUser?.role && (
            <>
              {/* Total BIAs */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total BIAs</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{totalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">records</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Approved</span>
                        <span className="font-medium text-green-600">{approvedBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">In Progress</span>
                        <span className="font-medium text-blue-600">{inProgressBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Draft</span>
                        <span className="font-medium text-gray-600">{draftBias}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Analysis */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical Analysis</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{criticalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">critical</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Critical</span>
                        <span className="font-medium text-red-600">{bias.filter(b => b.finalCriticality === 'CRITICAL').length}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">High</span>
                        <span className="font-medium text-orange-600">{bias.filter(b => b.finalCriticality === 'HIGH').length}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Medium/Low</span>
                        <span className="font-medium text-gray-600">{bias.filter(b => b.finalCriticality === 'MEDIUM' || b.finalCriticality === 'LOW').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Approval */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Approval</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{pendingApprovalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">BIAs</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs awaiting approval from reviewers
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Completion Rate</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {totalBias > 0 ? Math.round((completedBias / totalBias) * 100) : 0}%
                      </p>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium text-green-600">{completedBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">In Progress</span>
                        <span className="font-medium text-blue-600">{inProgressBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Draft</span>
                        <span className="font-medium text-gray-600">{draftBias}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Champion: Show department-focused stats (4 cards) */}
          {currentUser?.role === 'CHAMPION' && (
            <>
              {/* My BIAs */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">My BIAs</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{totalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">records</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Approved</span>
                        <span className="font-medium text-green-600">{approvedBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">In Progress</span>
                        <span className="font-medium text-blue-600">{inProgressBias}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Draft</span>
                        <span className="font-medium text-gray-600">{draftBias}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Review */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Review</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{pendingApprovalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">to review</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs submitted by SMEs awaiting your review
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Analysis */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical Analysis</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{criticalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">critical</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Critical</span>
                        <span className="font-medium text-red-600">{bias.filter(b => b.finalCriticality === 'CRITICAL').length}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">High</span>
                        <span className="font-medium text-orange-600">{bias.filter(b => b.finalCriticality === 'HIGH').length}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Medium/Low</span>
                        <span className="font-medium text-gray-600">{bias.filter(b => b.finalCriticality === 'MEDIUM' || b.finalCriticality === 'LOW').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Types */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Target Types</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{Object.keys(targetTypeCounts).length}</p>
                      <span className="ml-1 text-xs text-gray-500">types</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      {topTargetTypes.slice(0, 3).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">{getTargetTypeLabel(type)}</span>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SME: Simple task-focused KPIs (4 cards) */}
          {currentUser?.role === 'SME' && (
            <>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Assigned</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{totalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">tasks</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs assigned to you for completion
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-blue-600">{inProgressBias}</p>
                      <span className="ml-1 text-xs text-gray-500">working</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs currently being worked on
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{draftBias}</p>
                      <span className="ml-1 text-xs text-gray-500">to start</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs not yet started
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Completed</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-green-600">{completedBias}</p>
                      <span className="ml-1 text-xs text-gray-500">done</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs submitted for review
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Approvers: Simple approval inbox KPIs (4 cards) */}
          {(currentUser?.role === 'DIVISION_HEAD' || currentUser?.role === 'BCM_VERIFIER' || currentUser?.role === 'APPROVER') && (
            <>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Awaiting Your Approval</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{pendingApprovalBias}</p>
                      <span className="ml-1 text-xs text-gray-500">BIAs</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      Review and approve/reject submitted BIAs
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Approved</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-green-600">{approvedBias}</p>
                      <span className="ml-1 text-xs text-gray-500">BIAs</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs you have approved
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-red-600">{bias.filter(b => b.status === 'REJECTED').length}</p>
                      <span className="ml-1 text-xs text-gray-500">BIAs</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BIAs requiring rework
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Reviewed</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{approvedBias + bias.filter(b => b.status === 'REJECTED').length}</p>
                      <span className="ml-1 text-xs text-gray-500">BIAs</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      Total BIAs you've reviewed
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters - Consistent sizing, full width */}
        <div className="bg-white border border-gray-200 rounded-sm mb-4">
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {/* Search */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search BIAs..."
                    className="block w-full h-[30px] pl-7 pr-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Target Type Filter */}
              <div>
                <select
                  value={selectedTargetType}
                  onChange={(e) => setSelectedTargetType(e.target.value)}
                  className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                >
                  <option value="">All Target Types</option>
                  <option value="PROCESS">Process</option>
                  <option value="ORGANIZATIONAL_UNIT">Org Unit</option>
                  <option value="ASSET">Asset</option>
                  <option value="LOCATION">Location</option>
                  <option value="SERVICE">Service</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="VITAL_RECORD">Vital Record</option>
                </select>
              </div>

              {/* Criticality Filter */}
              <div>
                <select
                  value={selectedCriticality}
                  onChange={(e) => setSelectedCriticality(e.target.value)}
                  className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                >
                  <option value="">All Criticalities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[70px]">
                    Version
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                    {currentUser?.role === 'SME' ? 'Process Name' : 'BIA Name'}
                  </th>
                  {/* BCM Manager and Champion see more details */}
                  {(currentUser?.role === 'CHAMPION' || !currentUser?.role) && (
                    <>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[90px]">
                        Target Type
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                        Criticality
                      </th>
                    </>
                  )}
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[130px]">
                    {currentUser?.role === 'SME' ? 'BIA Status' : 'Status'}
                  </th>
                  {/* Champion sees assigned to column */}
                  {currentUser?.role === 'CHAMPION' && (
                    <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                      Assigned To
                    </th>
                  )}
                  {/* SME sees assigned by column */}
                  {currentUser?.role === 'SME' && (
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Assigned By
                    </th>
                  )}
                  {/* Approvers see submitted by column */}
                  {(currentUser?.role === 'DIVISION_HEAD' || currentUser?.role === 'BCM_VERIFIER' || currentUser?.role === 'APPROVER') && (
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                  )}
                  {/* BCM Manager sees all columns */}
                  {!currentUser?.role && (
                    <>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                        RTO / RPO
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        Champion
                      </th>
                    </>
                  )}
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBias.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-xs text-gray-500">
                        {searchTerm || selectedStatus || selectedTargetType || selectedCriticality
                          ? 'No BIAs match your filters'
                          : currentUser?.role === 'SME'
                            ? 'No BIAs assigned to you yet.'
                            : currentUser?.role === 'CHAMPION'
                            ? 'No BIAs yet. Create your first BIA to get started.'
                            : (currentUser?.role === 'DIVISION_HEAD' || currentUser?.role === 'BCM_VERIFIER' || currentUser?.role === 'APPROVER')
                            ? 'No BIAs pending your approval.'
                            : 'No BIAs yet. Launch a campaign to get started.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedBias.map((bia) => (
                    <tr
                      key={bia.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // Navigate to edit page for DRAFT or IN_PROGRESS BIAs
                        if (bia.status === 'DRAFT' || bia.status === 'IN_PROGRESS') {
                          router.push(`/bia-records/new?edit=${bia.id}`);
                        } else {
                          // Navigate to view page for other statuses
                          router.push(`/bia-records/${bia.id}`);
                        }
                      }}
                    >
                      {/* Version - First Column */}
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        {bia.versionLabel ? (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {bia.versionLabel}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">-</span>
                        )}
                      </td>

                      {/* BIA Name / Process Name */}
                      <td className="px-3 py-2 w-[200px]">
                        <div className="text-xs font-medium text-gray-900 truncate">{bia.biaName}</div>
                        <div className="text-[10px] text-gray-500">ID: {bia.id}</div>
                      </td>

                      {/* Target Type (BCM Manager & Champion only) */}
                      {(currentUser?.role === 'CHAMPION' || !currentUser?.role) && (
                        <td className="px-3 py-2 text-xs text-gray-500 text-center">
                          {bia.biaTargetType ? getTargetTypeLabel(bia.biaTargetType) : '-'}
                        </td>
                      )}

                      {/* Criticality (BCM Manager & Champion only) */}
                      {(currentUser?.role === 'CHAMPION' || !currentUser?.role) && (
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          {bia.finalCriticality ? (
                            <span className={`inline-flex items-center justify-center w-[70px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getCriticalityBadgeColor(bia.finalCriticality)}`}>
                              {bia.finalCriticality}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-[70px] text-xs text-gray-500">-</span>
                          )}
                        </td>
                      )}

                      {/* Status */}
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center w-[120px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeColor(bia.status)}`}>
                          {bia.status === 'IN_PROGRESS' && <ClockIcon className="h-3 w-3 mr-1" />}
                          {bia.status === 'APPROVED' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                          {bia.status === 'PENDING_APPROVAL' && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
                          {bia.status === 'REJECTED' && <XCircleIcon className="h-3 w-3 mr-1" />}
                          {bia.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Assigned To (Champion only) */}
                      {currentUser?.role === 'CHAMPION' && (
                        <td className="px-3 py-2 text-xs text-gray-900 text-center">
                          {bia.biaCoordinator || <span className="text-gray-500">-</span>}
                        </td>
                      )}

                      {/* Assigned By (SME only) */}
                      {currentUser?.role === 'SME' && (
                        <td className="px-3 py-2 text-xs text-gray-900">
                          {bia.biaCoordinator || <span className="text-gray-500">-</span>}
                        </td>
                      )}

                      {/* Submitted By (Approvers only) */}
                      {(currentUser?.role === 'DIVISION_HEAD' || currentUser?.role === 'BCM_VERIFIER' || currentUser?.role === 'APPROVER') && (
                        <td className="px-3 py-2 text-xs text-gray-900">
                          {bia.biaCoordinator || <span className="text-gray-500">-</span>}
                        </td>
                      )}

                      {/* RTO/RPO & Champion (BCM Manager only) */}
                      {!currentUser?.role && (
                        <>
                          <td className="px-3 py-2 text-xs text-gray-900 text-center">
                            {bia.finalRtoHours !== undefined && bia.finalRpoHours !== undefined ? (
                              <div>
                                <div>RTO: {bia.finalRtoHours}h</div>
                                <div className="text-[10px] text-gray-500">RPO: {bia.finalRpoHours}h</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900">
                            {bia.biaCoordinator || <span className="text-gray-500">-</span>}
                          </td>
                        </>
                      )}

                      {/* Role-Based Actions */}
                      <td className="px-3 py-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-2">
                          {/* Champion Actions */}
                          {currentUser?.role === 'CHAMPION' && (
                            <>
                              {(bia.status === 'DRAFT' || bia.status === 'IN_PROGRESS') && (
                                <button
                                  onClick={() => router.push(`/bia-records/new?edit=${bia.id}`)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              )}
                              {bia.status === 'DRAFT' && (
                                <button
                                  onClick={() => alert('Assign to SME modal coming soon')}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Assign"
                                >
                                  <UserGroupIcon className="h-4 w-4" />
                                </button>
                              )}
                              {(bia.status === 'PENDING_APPROVAL' || bia.status === 'APPROVED' || bia.status === 'REJECTED') && (
                                <button
                                  onClick={() => router.push(`/bia-records/${bia.id}`)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="View"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}

                          {/* SME Actions */}
                          {currentUser?.role === 'SME' && (
                            <>
                              {(bia.status === 'DRAFT' || bia.status === 'IN_PROGRESS' || bia.status === 'REJECTED') && (
                                <button
                                  onClick={() => router.push(`/bia-records/new?edit=${bia.id}`)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              )}
                              {(bia.status === 'PENDING_APPROVAL' || bia.status === 'APPROVED') && (
                                <button
                                  onClick={() => router.push(`/bia-records/${bia.id}`)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="View"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}

                          {/* Approver Actions */}
                          {(currentUser?.role === 'DIVISION_HEAD' || currentUser?.role === 'BCM_VERIFIER' || currentUser?.role === 'APPROVER') && (
                            <button
                              onClick={() => router.push(`/bia-records/${bia.id}`)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Review"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          )}

                          {/* BCM Manager Actions (full control) */}
                          {!currentUser?.role && (
                            <>
                              <button
                                onClick={() => router.push(`/bia-records/${bia.id}`)}
                                className="text-gray-600 hover:text-gray-900"
                                title="View"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/bia-records/${bia.id}/edit`)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(bia.id!)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredBias.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
          </div>
        </main>
      </div>

      {/* AI Agent */}
      <AIAgent context="bia" />
    </div>
  );
}
