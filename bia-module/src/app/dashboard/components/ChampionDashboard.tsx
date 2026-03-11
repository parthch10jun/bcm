'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Link from 'next/link';
import BIADelegationModal from '@/components/BIADelegationModal';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import DepartmentBIACharts from './widgets/DepartmentBIACharts';
import DepartmentMetricsCards from './widgets/DepartmentMetricsCards';
import DepartmentActivityFeed from './widgets/DepartmentActivityFeed';
import {
  PlusIcon,
  UserPlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  ChartBarSquareIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

interface BIARecord {
  id: number;
  biaName: string;
  biaTargetType: string;
  biaTargetName: string;
  status: string;
  workflowStage: string;
  workflowStatus: string;
  assignedTo?: string;
  assignedToId?: number;
  smeId?: number;
  smeName?: string;
  championId?: number;
  championName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Champion Dashboard
 * 
 * Shows:
 * - My Department's BIAs (all BIAs where Champion is assigned)
 * - Initiate BIA button
 * - Assign to SME functionality
 * - Review submitted BIAs
 * - Submit for Official Approval
 */
type ViewMode = 'dashboard' | 'table';

export default function ChampionDashboard() {
  const { currentUser } = useUserProfile();
  const [biaRecords, setBiaRecords] = useState<BIARecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [selectedBia, setSelectedBia] = useState<BIARecord | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  useEffect(() => {
    fetchMyBIAs();
  }, [currentUser]);

  const fetchMyBIAs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call filtered by championId
      const response = await fetch(`http://localhost:8080/api/bias?championId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setBiaRecords(data);
      } else {
        // Use sample data for demonstration
        setBiaRecords(getSampleBIAs());
      }
    } catch (error) {
      console.error('Error fetching BIAs:', error);
      // Use sample data for demonstration
      setBiaRecords(getSampleBIAs());
    } finally {
      setLoading(false);
    }
  };

  const getSampleBIAs = (): BIARecord[] => {
    const champId = currentUser?.id ? parseInt(currentUser.id) : undefined;
    const champName = currentUser?.fullName;
    return [
      { id: 1, biaName: 'Finance Operations BIA', biaTargetType: 'DEPARTMENT', biaTargetName: 'Finance Department', status: 'ACTIVE', workflowStage: 'REVIEW', workflowStatus: 'SUBMITTED', assignedTo: 'John Smith', assignedToId: 10, smeId: 10, smeName: 'John Smith', championId: champId, championName: champName, createdAt: '2025-11-01', updatedAt: '2025-11-20' },
      { id: 2, biaName: 'IT Infrastructure BIA', biaTargetType: 'INFRASTRUCTURE', biaTargetName: 'Data Center', status: 'ACTIVE', workflowStage: 'DATA_COLLECTION', workflowStatus: 'IN_PROGRESS', assignedTo: 'Alice Wong', assignedToId: 11, smeId: 11, smeName: 'Alice Wong', championId: champId, championName: champName, createdAt: '2025-11-05', updatedAt: '2025-11-22' },
      { id: 3, biaName: 'Customer Service BIA', biaTargetType: 'PROCESS', biaTargetName: 'Customer Support', status: 'ACTIVE', workflowStage: 'DRAFT', workflowStatus: 'DRAFT', championId: champId, championName: champName, createdAt: '2025-11-15' },
      { id: 4, biaName: 'Supply Chain BIA', biaTargetType: 'PROCESS', biaTargetName: 'Procurement', status: 'ACTIVE', workflowStage: 'APPROVAL', workflowStatus: 'APPROVED', assignedTo: 'Bob Lee', assignedToId: 12, smeId: 12, smeName: 'Bob Lee', championId: champId, championName: champName, createdAt: '2025-10-15', updatedAt: '2025-11-10' },
      { id: 5, biaName: 'HR Systems BIA', biaTargetType: 'APPLICATION', biaTargetName: 'HRIS Platform', status: 'ACTIVE', workflowStage: 'DATA_COLLECTION', workflowStatus: 'IN_PROGRESS', assignedTo: 'Carol Davis', assignedToId: 13, smeId: 13, smeName: 'Carol Davis', championId: champId, championName: champName, createdAt: '2025-11-10', updatedAt: '2025-11-25' },
      { id: 6, biaName: 'Marketing Operations BIA', biaTargetType: 'DEPARTMENT', biaTargetName: 'Marketing', status: 'ACTIVE', workflowStage: 'REVIEW', workflowStatus: 'SUBMITTED', assignedTo: 'Dave Miller', assignedToId: 14, smeId: 14, smeName: 'Dave Miller', championId: champId, championName: champName, createdAt: '2025-11-08', updatedAt: '2025-11-24' }
    ];
  };

  const handleAssignToSME = (bia: BIARecord) => {
    setSelectedBia(bia);
    setShowDelegateModal(true);
  };

  const handleStartBIA = (biaId: number) => {
    // Navigate to wizard
    window.location.href = `/bia-records/${biaId}/edit`;
  };

  const handleReviewBIA = (biaId: number) => {
    // Navigate to review page
    window.location.href = `/bia-records/${biaId}/review`;
  };

  const handleSubmitForApproval = async (biaId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/bia-workflow/submit-for-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          championId: currentUser?.id
        })
      });

      if (response.ok) {
        alert('BIA submitted for official approval!');
        fetchMyBIAs();
      }
    } catch (error) {
      console.error('Error submitting BIA:', error);
      alert('Failed to submit BIA for approval');
    }
  };

  // Calculate statistics
  const stats = {
    total: biaRecords.length,
    draft: biaRecords.filter(b => b.workflowStatus === 'DRAFT').length,
    inProgress: biaRecords.filter(b => b.workflowStatus === 'IN_PROGRESS' || b.workflowStatus === 'SUBMITTED').length,
    pendingReview: biaRecords.filter(b => b.workflowStatus === 'SUBMITTED' && b.workflowStage === 'REVIEW').length,
    approved: biaRecords.filter(b => b.workflowStatus === 'APPROVED').length
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'DRAFT': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      'SUBMITTED': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Submitted' },
      'IN_REVIEW': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
    };

    const badge = badges[status] || badges['DRAFT'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Dashboard</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Business Impact Analyses assigned to you as Champion
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChartBarSquareIcon className="h-3.5 w-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TableCellsIcon className="h-3.5 w-3.5" />
                Table
              </button>
            </div>
            <Link
              href="/bia-records/new"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Initiate BIA
            </Link>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : viewMode === 'dashboard' ? (
          /* Dashboard View with Charts & Metrics */
          <div className="space-y-4">
            {/* Department Metrics Cards */}
            <DepartmentMetricsCards biaRecords={biaRecords} />

            {/* Charts Section */}
            <DepartmentBIACharts biaRecords={biaRecords} />

            {/* Activity Feed & Upcoming Tasks */}
            <DepartmentActivityFeed />
          </div>
        ) : (
          /* Table View */
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total BIAs</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Draft</p>
                <p className="mt-1 text-2xl font-semibold text-gray-600">{stats.draft}</p>
              </div>
              <div className="bg-white border border-blue-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">In Progress</p>
                <p className="mt-1 text-2xl font-semibold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="bg-white border border-yellow-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-yellow-600 uppercase tracking-wider">Pending Review</p>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">{stats.pendingReview}</p>
              </div>
              <div className="bg-white border border-green-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider">Approved</p>
                <p className="mt-1 text-2xl font-semibold text-green-600">{stats.approved}</p>
              </div>
            </div>

            {/* BIA Records Table */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-900">BIA Records</h3>
              </div>

              {biaRecords.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-gray-600">No BIAs assigned yet</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Click "Initiate BIA" to create your first BIA
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Process Name</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">BIA Status</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {biaRecords.map((bia) => (
                        <tr key={bia.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-900">{bia.biaName}</td>
                          <td className="px-3 py-2">{getStatusBadge(bia.workflowStatus)}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{bia.smeName || '(Champion)'}</td>
                          <td className="px-3 py-2 text-xs text-gray-500">{bia.updatedAt ? new Date(bia.updatedAt).toLocaleDateString() : '-'}</td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {bia.workflowStatus === 'DRAFT' && !bia.smeId && (
                                <>
                                  <button onClick={() => handleStartBIA(bia.id)} className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50" title="Start BIA">Start BIA</button>
                                  <button onClick={() => handleAssignToSME(bia)} className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100" title="Assign to SME"><UserPlusIcon className="h-3 w-3 mr-0.5" />Assign to SME</button>
                                </>
                              )}
                              {bia.workflowStatus === 'SUBMITTED' && bia.workflowStage === 'REVIEW' && (
                                <>
                                  <button onClick={() => handleReviewBIA(bia.id)} className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50" title="Review"><EyeIcon className="h-3 w-3 mr-0.5" />Review</button>
                                  <button onClick={() => handleSubmitForApproval(bia.id)} className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100" title="Submit for Official Approval"><PaperAirplaneIcon className="h-3 w-3 mr-0.5" />Submit for Approval</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delegate Modal */}
      <BIADelegationModal
        isOpen={showDelegateModal}
        onClose={() => {
          setShowDelegateModal(false);
          setSelectedBia(null);
        }}
        biaId={selectedBia?.id || 0}
        biaName={selectedBia?.biaName || ''}
        championId={currentUser?.id ? parseInt(currentUser.id) : 0}
        onSuccess={fetchMyBIAs}
      />
    </div>
  );
}

