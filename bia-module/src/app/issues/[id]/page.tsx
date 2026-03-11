'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  PaperClipIcon,
  UserCircleIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { mockIssues } from '@/data/mockIssueActionData';
import { 
  IssueStatusConfig, 
  PriorityConfig, 
  ModuleConfig, 
  ImpactConfig,
  ActionStatus,
  ActionStatusConfig
} from '@/types/issue-action';

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  // Find the issue
  const issue = mockIssues.find(i => i.id === issueId);

  // Actions timeline filters
  const [actionStatusFilter, setActionStatusFilter] = useState<ActionStatus | 'ALL'>('ALL');
  const [actionOwnerFilter, setActionOwnerFilter] = useState<string>('ALL');
  const [actionSortBy, setActionSortBy] = useState<'date' | 'status'>('date');

  // Filter and sort actions - moved before early return to comply with hooks rules
  const filteredActions = useMemo(() => {
    if (!issue) return [];
    let filtered = [...issue.actions];

    if (actionStatusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === actionStatusFilter);
    }

    if (actionOwnerFilter !== 'ALL') {
      filtered = filtered.filter(a => a.owner === actionOwnerFilter);
    }

    // Sort
    if (actionSortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    return filtered;
  }, [issue, actionStatusFilter, actionOwnerFilter, actionSortBy]);

  // Get unique owners for filter
  const uniqueOwners = issue ? Array.from(new Set(issue.actions.map(a => a.owner))) : [];

  // Early return for not found - moved after all hooks
  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-4">The issue you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/issues" className="text-blue-600 hover:text-blue-700">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = IssueStatusConfig[issue.status];
  const priorityConfig = PriorityConfig[issue.priority];
  const moduleConfig = ModuleConfig[issue.module];
  const impactConfig = issue.impact ? ImpactConfig[issue.impact] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <HomeIcon className="h-4 w-4 mr-2" />
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <Link href="/issues" className="hover:text-blue-600">Issue and Action Management</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">Issue Details</span>
        </div>
      </div>

      {/* Header Strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-semibold text-gray-900">{issue.referenceNumber}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${priorityConfig.bgColor} ${priorityConfig.color} ${priorityConfig.borderColor}`}>
                  {priorityConfig.label}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{issue.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/issues/${issue.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Issue
              </button>
              <Link
                href={`/issues/${issue.id}/actions/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Action
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>
              
              <div className="space-y-4">
                {/* Module and Business Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Module</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium ${moduleConfig.bgColor} ${moduleConfig.color}`}>
                      {moduleConfig.label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Business Unit</label>
                    <p className="text-sm text-gray-900 font-medium">{issue.businessUnit}</p>
                  </div>
                </div>

                {/* Related Record */}
                {issue.relatedRecordId && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Related Record</label>
                    <Link
                      href={`#`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {issue.relatedRecordId} - {issue.relatedRecordTitle}
                    </Link>
                  </div>
                )}

                {/* Impact */}
                {impactConfig && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Impact</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium border ${impactConfig.bgColor} ${impactConfig.color} ${impactConfig.borderColor}`}>
                      {impactConfig.label}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <div
                    className="text-sm text-gray-900 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: issue.description }}
                  />
                </div>

                {/* Attachments */}
                {issue.attachments && issue.attachments.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Attachments</label>
                    <div className="space-y-2">
                      {issue.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100"
                        >
                          <PaperClipIcon className="h-4 w-4 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{attachment.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB • Uploaded by {attachment.uploadedBy}
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* On Hold Reason */}
                {issue.status === 'ON_HOLD' && issue.onHoldReason && (
                  <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
                    <label className="block text-xs font-medium text-purple-700 mb-1">On Hold Reason</label>
                    <p className="text-sm text-purple-900">{issue.onHoldReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* People and Dates Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">People and Dates</h3>

              <div className="space-y-4">
                {/* Raised By */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Raised By</label>
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{issue.raisedBy}</p>
                      {issue.raisedByEmail && (
                        <p className="text-xs text-gray-500">{issue.raisedByEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Assigned To</label>
                  <div className="space-y-2">
                    {issue.assignedTo.map((assignee, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignee}</p>
                          {issue.assignedToEmails && issue.assignedToEmails[index] && (
                            <p className="text-xs text-gray-500">{issue.assignedToEmails[index]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {/* Created Date */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Created Date</label>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(issue.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm font-medium ${
                        new Date(issue.dueDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(issue.status)
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {new Date(issue.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {new Date(issue.dueDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(issue.status) && (
                      <p className="text-xs text-red-500 mt-1">Overdue</p>
                    )}
                  </div>

                  {/* Closed Date */}
                  {issue.closedDate && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Closed Date</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(issue.closedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Timeline - Full Width */}
        <div className="mt-6 bg-white border border-gray-200 rounded-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Actions Timeline ({issue.actions.length})
              </h3>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-4 w-4 text-gray-400" />
                  <select
                    value={actionStatusFilter}
                    onChange={(e) => setActionStatusFilter(e.target.value as ActionStatus | 'ALL')}
                    className="text-sm border border-gray-300 rounded-sm px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <select
                  value={actionOwnerFilter}
                  onChange={(e) => setActionOwnerFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-sm px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Owners</option>
                  {uniqueOwners.map((owner) => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>

                <select
                  value={actionSortBy}
                  onChange={(e) => setActionSortBy(e.target.value as 'date' | 'status')}
                  className="text-sm border border-gray-300 rounded-sm px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredActions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No actions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActions.map((action) => {
                  const actionStatusConfig = ActionStatusConfig[action.status];
                  const actionPriorityConfig = action.priority ? PriorityConfig[action.priority] : null;
                  const isOverdue = new Date(action.targetDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(action.status);

                  return (
                    <div
                      key={action.id}
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/issues/${issue.id}/actions/${action.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{action.referenceNumber}</h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${actionStatusConfig.bgColor} ${actionStatusConfig.color} ${actionStatusConfig.borderColor}`}>
                              {actionStatusConfig.label}
                            </span>
                            {actionPriorityConfig && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${actionPriorityConfig.bgColor} ${actionPriorityConfig.color} ${actionPriorityConfig.borderColor}`}>
                                {actionPriorityConfig.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{action.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{action.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <UserCircleIcon className="h-4 w-4" />
                            <span>{action.owner}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              Due: {new Date(action.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                          {action.progressNotes.length > 0 && (
                            <span className="text-blue-600">
                              {action.progressNotes.length} note{action.progressNotes.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

