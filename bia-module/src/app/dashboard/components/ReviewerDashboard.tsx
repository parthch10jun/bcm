'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface BIAForReview {
  id: number;
  biaId: number;
  biaName: string;
  biaTargetType: string;
  biaTargetName: string;
  submittedById: number;
  submittedByName: string;
  submittedAt: string;
  workflowStage: string;
  workflowStatus: string;
  stageNumber: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Reviewer Dashboard (Division Head - Stage 1)
 * 
 * Shows:
 * - BIAs pending review at Stage 1 (Division Head)
 * - Read-only wizard view
 * - Approve / Request Changes actions
 * - Submit for Verification (to BCM Dept)
 */
export default function ReviewerDashboard() {
  const { currentUser } = useUserProfile();
  const [biasForReview, setBiasForReview] = useState<BIAForReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBIAsForReview();
  }, [currentUser]);

  const fetchBIAsForReview = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:8080/api/bia-approval/pending-review?reviewerId=${currentUser?.id}&stage=1`);
      if (response.ok) {
        const data = await response.json();
        setBiasForReview(data);
      } else {
        // Use sample data for demonstration
        setBiasForReview(getSampleBIAsForReview());
      }
    } catch (error) {
      console.error('Error fetching BIAs for review:', error);
      // Use sample data for demonstration
      setBiasForReview(getSampleBIAsForReview());
    } finally {
      setLoading(false);
    }
  };

  const getSampleBIAsForReview = (): BIAForReview[] => [
    { id: 1, biaId: 101, biaName: 'Payment Processing BIA', biaTargetType: 'PROCESS', biaTargetName: 'Payment Gateway', submittedById: 5, submittedByName: 'Emily Chen', submittedAt: '2025-11-24', workflowStage: 'DIVISION_REVIEW', workflowStatus: 'PENDING_REVIEW', stageNumber: 1, priority: 'HIGH' },
    { id: 2, biaId: 102, biaName: 'Customer Database BIA', biaTargetType: 'APPLICATION', biaTargetName: 'CRM System', submittedById: 6, submittedByName: 'Michael Brown', submittedAt: '2025-11-23', workflowStage: 'DIVISION_REVIEW', workflowStatus: 'PENDING_REVIEW', stageNumber: 1, priority: 'MEDIUM' },
    { id: 3, biaId: 103, biaName: 'Network Infrastructure BIA', biaTargetType: 'INFRASTRUCTURE', biaTargetName: 'Core Network', submittedById: 7, submittedByName: 'Sarah Wilson', submittedAt: '2025-11-22', workflowStage: 'DIVISION_REVIEW', workflowStatus: 'PENDING_REVIEW', stageNumber: 1, priority: 'HIGH' },
    { id: 4, biaId: 104, biaName: 'Inventory Management BIA', biaTargetType: 'PROCESS', biaTargetName: 'Warehouse Operations', submittedById: 8, submittedByName: 'James Lee', submittedAt: '2025-11-21', workflowStage: 'DIVISION_REVIEW', workflowStatus: 'PENDING_REVIEW', stageNumber: 1, priority: 'LOW' }
  ];

  const handleReviewBIA = (biaId: number) => {
    // Navigate to review page
    window.location.href = `/bia-records/${biaId}/approve`;
  };

  const handleApproveBIA = async (workflowId: number, biaId: number) => {
    const comments = prompt('Add approval comments (optional):');
    
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
        alert('BIA approved and moved to next stage!');
        fetchBIAsForReview();
      }
    } catch (error) {
      console.error('Error approving BIA:', error);
      alert('Failed to approve BIA');
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
        alert('Change request sent to Champion!');
        fetchBIAsForReview();
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
      alert('Failed to request changes');
    }
  };

  // Calculate statistics
  const stats = {
    total: biasForReview.length,
    highPriority: biasForReview.filter(b => b.priority === 'HIGH').length,
    overdue: biasForReview.filter(b => {
      const daysSinceSubmission = Math.ceil((new Date().getTime() - new Date(b.submittedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceSubmission > 3;
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

  const getDaysSinceSubmission = (submittedAt: string) => {
    const days = Math.ceil((new Date().getTime() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days > 3) return <span className="text-red-600">{days} days ago</span>;
    if (days === 0) return <span className="text-green-600">Today</span>;
    return <span className="text-gray-600">{days} day{days > 1 ? 's' : ''} ago</span>;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">BIAs Pending Review</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Division Head - Stage 1 Review
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
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
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Review</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">High Priority</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.highPriority}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Overdue (&gt;3 days)</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        {/* BIAs Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-900">BIAs Awaiting Your Review</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-xs text-gray-500">Loading BIAs...</p>
            </div>
          ) : biasForReview.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-xs text-gray-600">No BIAs pending review</p>
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
                      Submitted By
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {biasForReview.map((bia) => (
                    <tr key={bia.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {bia.biaName}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {bia.submittedByName}
                      </td>
                      <td className="px-3 py-2">
                        {getPriorityBadge(bia.priority)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {getDaysSinceSubmission(bia.submittedAt)}
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
                            title="Approve"
                          >
                            <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                            Approve
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

