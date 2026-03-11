'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Link from 'next/link';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface BIAAssignment {
  id: number;
  biaId: number;
  biaName: string;
  biaTargetType: string;
  biaTargetName: string;
  assignedById: number;
  assignedByName: string;
  assignedAt: string;
  dueDate?: string;
  status: string;
  workflowStatus: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * SME Dashboard
 * 
 * Shows:
 * - BIAs assigned to this SME
 * - Start BIA wizard button
 * - Submit to Champion for Review functionality
 */
export default function SMEDashboard() {
  const { currentUser } = useUserProfile();
  const [assignments, setAssignments] = useState<BIAAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAssignments();
  }, [currentUser]);

  const fetchMyAssignments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:8080/api/bia-workflow/assignments?smeId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        // Use sample data for demonstration
        setAssignments(getSampleAssignments());
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // Use sample data for demonstration
      setAssignments(getSampleAssignments());
    } finally {
      setLoading(false);
    }
  };

  const getSampleAssignments = (): BIAAssignment[] => [
    { id: 1, biaId: 101, biaName: 'Payment Processing BIA', biaTargetType: 'PROCESS', biaTargetName: 'Payment Gateway', assignedById: 1, assignedByName: 'Sarah Johnson', assignedAt: '2025-11-20', dueDate: '2025-12-05', status: 'IN_PROGRESS', workflowStatus: 'DATA_COLLECTION', priority: 'HIGH' },
    { id: 2, biaId: 102, biaName: 'Customer Portal BIA', biaTargetType: 'APPLICATION', biaTargetName: 'Customer Portal', assignedById: 1, assignedByName: 'Sarah Johnson', assignedAt: '2025-11-18', dueDate: '2025-12-10', status: 'PENDING', workflowStatus: 'NOT_STARTED', priority: 'MEDIUM' },
    { id: 3, biaId: 103, biaName: 'Data Center BIA', biaTargetType: 'INFRASTRUCTURE', biaTargetName: 'Primary DC', assignedById: 2, assignedByName: 'Mike Chen', assignedAt: '2025-11-15', dueDate: '2025-11-28', status: 'IN_PROGRESS', workflowStatus: 'REVIEW', priority: 'HIGH' },
    { id: 4, biaId: 104, biaName: 'HR Operations BIA', biaTargetType: 'PROCESS', biaTargetName: 'Payroll Processing', assignedById: 1, assignedByName: 'Sarah Johnson', assignedAt: '2025-11-22', dueDate: '2025-12-15', status: 'PENDING', workflowStatus: 'NOT_STARTED', priority: 'LOW' },
    { id: 5, biaId: 105, biaName: 'Email System BIA', biaTargetType: 'APPLICATION', biaTargetName: 'Exchange Server', assignedById: 2, assignedByName: 'Mike Chen', assignedAt: '2025-11-10', status: 'COMPLETED', workflowStatus: 'APPROVED', priority: 'MEDIUM' }
  ];

  const handleStartBIA = (biaId: number) => {
    // Navigate to wizard
    window.location.href = `/bia-records/${biaId}/edit`;
  };

  const handleSubmitToChampion = async (assignmentId: number, biaId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/bia-workflow/submit-to-champion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          biaId,
          smeId: currentUser?.id
        })
      });

      if (response.ok) {
        alert('BIA submitted to Champion for review!');
        fetchMyAssignments();
      }
    } catch (error) {
      console.error('Error submitting BIA:', error);
      alert('Failed to submit BIA');
    }
  };

  // Calculate statistics
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS').length,
    completed: assignments.filter(a => a.status === 'COMPLETED').length,
    highPriority: assignments.filter(a => a.priority === 'HIGH').length
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'PENDING': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' },
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      'SUBMITTED': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Submitted' }
    };

    const badge = badges[status] || badges['PENDING'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getDaysRemaining = (dueDate?: string) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-600">Overdue</span>;
    if (days === 0) return <span className="text-yellow-600">Due today</span>;
    return <span className="text-gray-600">{days} days</span>;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My BIA Assignments</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              BIAs assigned to you for completion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
              {stats.pending} Pending
            </span>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Assigned</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-blue-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Pending</p>
            <p className="mt-1 text-2xl font-semibold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-white border border-green-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">High Priority</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.highPriority}</p>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-900">Assigned BIAs</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-xs text-gray-500">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-xs text-gray-600">No BIAs assigned yet</p>
              <p className="text-[10px] text-gray-500 mt-1">
                You'll see BIAs here when a Champion assigns them to you
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
                      Assigned By
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {assignment.biaName}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {assignment.assignedByName}
                      </td>
                      <td className="px-3 py-2">
                        {getPriorityBadge(assignment.priority)}
                      </td>
                      <td className="px-3 py-2">
                        {getStatusBadge(assignment.status)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {getDaysRemaining(assignment.dueDate)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(assignment.status === 'PENDING' || assignment.status === 'IN_PROGRESS') && (
                            <>
                              <button
                                onClick={() => handleStartBIA(assignment.biaId)}
                                className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                                title="Continue BIA"
                              >
                                <ClipboardDocumentCheckIcon className="h-3 w-3 mr-0.5" />
                                {assignment.status === 'PENDING' ? 'Start BIA' : 'Continue'}
                              </button>
                              <button
                                onClick={() => handleSubmitToChampion(assignment.id, assignment.biaId)}
                                className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100"
                                title="Submit to Champion"
                              >
                                <PaperAirplaneIcon className="h-3 w-3 mr-0.5" />
                                Submit to Champion
                              </button>
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
    </div>
  );
}

