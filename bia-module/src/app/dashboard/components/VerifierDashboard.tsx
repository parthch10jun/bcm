'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface BIAForVerification {
  id: number;
  biaId: number;
  biaName: string;
  biaTargetType: string;
  biaTargetName: string;
  reviewedById: number;
  reviewedByName: string;
  reviewedAt: string;
  workflowStage: string;
  workflowStatus: string;
  stageNumber: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Verifier Dashboard (BCM Dept - Stage 2)
 * 
 * Shows:
 * - BIAs pending verification at Stage 2 (BCM Dept)
 * - Review functionality
 * - Approve / Request Changes actions
 * - Submit for Final Approval (to Chief)
 */
export default function VerifierDashboard() {
  const { currentUser } = useUserProfile();
  const [biasForVerification, setBiasForVerification] = useState<BIAForVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBIAsForVerification();
  }, [currentUser]);

  const fetchBIAsForVerification = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:8080/api/bia-approval/pending-verification?verifierId=${currentUser?.id}&stage=2`);
      if (response.ok) {
        const data = await response.json();
        setBiasForVerification(data);
      } else {
        // Use sample data for demonstration
        setBiasForVerification(getSampleBIAsForVerification());
      }
    } catch (error) {
      console.error('Error fetching BIAs for verification:', error);
      // Use sample data for demonstration
      setBiasForVerification(getSampleBIAsForVerification());
    } finally {
      setLoading(false);
    }
  };

  const getSampleBIAsForVerification = (): BIAForVerification[] => [
    { id: 1, biaId: 201, biaName: 'Treasury Operations BIA', biaTargetType: 'PROCESS', biaTargetName: 'Treasury Management', reviewedById: 10, reviewedByName: 'Division Head - Finance', reviewedAt: '2025-11-23', workflowStage: 'BCM_VERIFICATION', workflowStatus: 'PENDING_VERIFICATION', stageNumber: 2, priority: 'HIGH' },
    { id: 2, biaId: 202, biaName: 'Core Banking BIA', biaTargetType: 'APPLICATION', biaTargetName: 'Core Banking System', reviewedById: 11, reviewedByName: 'Division Head - IT', reviewedAt: '2025-11-22', workflowStage: 'BCM_VERIFICATION', workflowStatus: 'PENDING_VERIFICATION', stageNumber: 2, priority: 'HIGH' },
    { id: 3, biaId: 203, biaName: 'Compliance Reporting BIA', biaTargetType: 'PROCESS', biaTargetName: 'Regulatory Reporting', reviewedById: 12, reviewedByName: 'Division Head - Compliance', reviewedAt: '2025-11-21', workflowStage: 'BCM_VERIFICATION', workflowStatus: 'PENDING_VERIFICATION', stageNumber: 2, priority: 'MEDIUM' }
  ];

  const handleReviewBIA = (biaId: number) => {
    // Navigate to review page
    window.location.href = `/bia-records/${biaId}/approve`;
  };

  const handleVerifyBIA = async (workflowId: number, biaId: number) => {
    const comments = prompt('Add verification comments (optional):');
    
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
        alert('BIA verified and moved to final approval!');
        fetchBIAsForVerification();
      }
    } catch (error) {
      console.error('Error verifying BIA:', error);
      alert('Failed to verify BIA');
    }
  };

  const handleRequestChanges = async (workflowId: number, biaId: number) => {
    const comments = prompt('Describe the changes needed:');
    if (!comments) return;

    try {
      const response = await fetch('http://localhost:8080/api/bia-approval/request-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          biaId,
          reviewerId: currentUser?.id,
          comments
        })
      });

      if (response.ok) {
        alert('Change request sent back!');
        fetchBIAsForVerification();
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
      alert('Failed to request changes');
    }
  };

  // Calculate statistics
  const stats = {
    total: biasForVerification.length,
    highPriority: biasForVerification.filter(b => b.priority === 'HIGH').length,
    overdue: biasForVerification.filter(b => {
      const daysSinceReview = Math.ceil((new Date().getTime() - new Date(b.reviewedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceReview > 2;
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

  const getDaysSinceReview = (reviewedAt: string) => {
    const days = Math.ceil((new Date().getTime() - new Date(reviewedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days > 2) return <span className="text-red-600">{days} days ago</span>;
    if (days === 0) return <span className="text-green-600">Today</span>;
    return <span className="text-gray-600">{days} day{days > 1 ? 's' : ''} ago</span>;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">BIAs Pending Verification</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              BCM Department - Stage 2 Verification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-700">
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
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Verification</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">High Priority</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.highPriority}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Overdue (&gt;2 days)</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        {/* BIAs Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-900">BIAs Awaiting Your Verification</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-xs text-gray-500">Loading BIAs...</p>
            </div>
          ) : biasForVerification.length === 0 ? (
            <div className="p-8 text-center">
              <ShieldCheckIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-xs text-gray-600">No BIAs pending verification</p>
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
                      Reviewed By
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed
                    </th>
                    <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {biasForVerification.map((bia) => (
                    <tr key={bia.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {bia.biaName}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {bia.reviewedByName}
                      </td>
                      <td className="px-3 py-2">
                        {getPriorityBadge(bia.priority)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {getDaysSinceReview(bia.reviewedAt)}
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
                            onClick={() => handleVerifyBIA(bia.id, bia.biaId)}
                            className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100"
                            title="Verify & Approve"
                          >
                            <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                            Verify
                          </button>
                          <button
                            onClick={() => handleRequestChanges(bia.id, bia.biaId)}
                            className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-sm hover:bg-yellow-100"
                            title="Request Changes"
                          >
                            <ExclamationCircleIcon className="h-3 w-3 mr-0.5" />
                            Request Changes
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

