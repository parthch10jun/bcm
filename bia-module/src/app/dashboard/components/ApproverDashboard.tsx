'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface BIAForApproval {
  id: number;
  biaId: number;
  biaName: string;
  biaTargetType: string;
  biaTargetName: string;
  verifiedById: number;
  verifiedByName: string;
  verifiedAt: string;
  workflowStage: string;
  workflowStatus: string;
  stageNumber: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Approver Dashboard (Chief - Stage 3)
 * 
 * Shows:
 * - BIAs pending final approval at Stage 3 (Chief)
 * - Final approval/rejection functionality
 * - Completion notifications
 */
export default function ApproverDashboard() {
  const { currentUser } = useUserProfile();
  const [biasForApproval, setBiasForApproval] = useState<BIAForApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBIAsForApproval();
  }, [currentUser]);

  const fetchBIAsForApproval = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:8080/api/bia-approval/pending-approval?approverId=${currentUser?.id}&stage=3`);
      if (response.ok) {
        const data = await response.json();
        setBiasForApproval(data);
      } else {
        // Use sample data for demonstration
        setBiasForApproval(getSampleBIAsForApproval());
      }
    } catch (error) {
      console.error('Error fetching BIAs for approval:', error);
      // Use sample data for demonstration
      setBiasForApproval(getSampleBIAsForApproval());
    } finally {
      setLoading(false);
    }
  };

  const getSampleBIAsForApproval = (): BIAForApproval[] => [
    { id: 1, biaId: 301, biaName: 'Enterprise Data Center BIA', biaTargetType: 'INFRASTRUCTURE', biaTargetName: 'Primary Data Center', verifiedById: 20, verifiedByName: 'BCM Department', verifiedAt: '2025-11-24', workflowStage: 'FINAL_APPROVAL', workflowStatus: 'PENDING_APPROVAL', stageNumber: 3, priority: 'HIGH' },
    { id: 2, biaId: 302, biaName: 'Core Trading Platform BIA', biaTargetType: 'APPLICATION', biaTargetName: 'Trading System', verifiedById: 20, verifiedByName: 'BCM Department', verifiedAt: '2025-11-23', workflowStage: 'FINAL_APPROVAL', workflowStatus: 'PENDING_APPROVAL', stageNumber: 3, priority: 'HIGH' }
  ];

  const handleReviewBIA = (biaId: number) => {
    // Navigate to review page
    window.location.href = `/bia-records/${biaId}/approve`;
  };

  const handleApproveBIA = async (workflowId: number, biaId: number) => {
    const comments = prompt('Add final approval comments (optional):');
    
    try {
      const response = await fetch('http://localhost:8080/api/bia-approval/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          biaId,
          approverId: currentUser?.id,
          comments
        })
      });

      if (response.ok) {
        alert('BIA approved! The BIA is now complete and finalized.');
        fetchBIAsForApproval();
      }
    } catch (error) {
      console.error('Error approving BIA:', error);
      alert('Failed to approve BIA');
    }
  };

  const handleRejectBIA = async (workflowId: number, biaId: number) => {
    const reason = prompt('Provide reason for rejection:');
    if (!reason) return;

    const confirmed = confirm('Are you sure you want to reject this BIA? This will send it back to the Champion.');
    if (!confirmed) return;

    try {
      const response = await fetch('http://localhost:8080/api/bia-approval/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          biaId,
          approverId: currentUser?.id,
          reason
        })
      });

      if (response.ok) {
        alert('BIA rejected and sent back to Champion.');
        fetchBIAsForApproval();
      }
    } catch (error) {
      console.error('Error rejecting BIA:', error);
      alert('Failed to reject BIA');
    }
  };

  // Calculate statistics
  const stats = {
    total: biasForApproval.length,
    highPriority: biasForApproval.filter(b => b.priority === 'HIGH').length,
    overdue: biasForApproval.filter(b => {
      const daysSinceVerification = Math.ceil((new Date().getTime() - new Date(b.verifiedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceVerification > 1;
    }).length
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      'HIGH': { bg: 'bg-red-100', text: 'text-red-700' },
      'MEDIUM': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'LOW': { bg: 'bg-green-100', text: 'text-green-700' }
    };

    const badge = badges[priority] || badges['MEDIUM'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${badge.bg} ${badge.text}`}>
        {priority}
      </span>
    );
  };

  const getDaysSinceVerification = (verifiedAt: string) => {
    const days = Math.ceil((new Date().getTime() - new Date(verifiedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days > 1) return <span className="text-red-600">{days} days ago</span>;
    if (days === 0) return <span className="text-green-600">Today</span>;
    return <span className="text-gray-600">{days} day ago</span>;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">BIAs Pending Final Approval</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Chief Approver - Stage 3 Final Approval
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
              <ShieldCheckIcon className="h-3.5 w-3.5 mr-1" />
              {stats.total} Pending
            </span>
            {stats.overdue > 0 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-red-100 text-red-700">
                <ExclamationCircleIcon className="h-3.5 w-3.5 mr-1" />
                {stats.overdue} Overdue
              </span>
            )}
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Approval</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">High Priority</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.highPriority}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Overdue (&gt;1 day)</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        {/* BIAs Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-900">BIAs Awaiting Your Final Approval</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-xs text-gray-500">Loading BIAs...</p>
            </div>
          ) : biasForApproval.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-xs text-gray-600">No BIAs pending final approval</p>
              <p className="text-[10px] text-gray-500 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      BIA Name
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Verified By
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {biasForApproval.map((bia) => (
                    <tr key={bia.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {bia.biaName}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {bia.verifiedByName}
                      </td>
                      <td className="px-3 py-2">
                        {getPriorityBadge(bia.priority)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {getDaysSinceVerification(bia.verifiedAt)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleReviewBIA(bia.biaId)}
                            className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                            title="Review BIA"
                          >
                            <EyeIcon className="h-3 w-3 mr-0.5" />
                            Review
                          </button>
                          <button
                            onClick={() => handleApproveBIA(bia.id, bia.biaId)}
                            className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100"
                            title="Final Approval"
                          >
                            <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectBIA(bia.id, bia.biaId)}
                            className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100"
                            title="Reject BIA"
                          >
                            <XCircleIcon className="h-3 w-3 mr-0.5" />
                            Reject
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
      </div>
    </div>
  );
}

