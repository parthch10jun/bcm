'use client';

import { useState, useEffect } from 'react';
import {
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export interface AuditTrailEntry {
  id: number;
  action: string;
  actionType: 'CREATE' | 'UPDATE' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'ASSIGN' | 'STATUS_CHANGE' | 'FIELD_EDIT';
  performedBy: string;
  performedByRole?: string;
  performedAt: string;
  fromStatus?: string;
  toStatus?: string;
  fieldChanges?: FieldChange[];
  comments?: string;
  metadata?: any;
}

export interface FieldChange {
  fieldName: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
  changeType: 'ADDED' | 'MODIFIED' | 'REMOVED';
}

interface AuditTrailProps {
  assessmentId: number;
  entries?: AuditTrailEntry[];
  loading?: boolean;
}

export default function AuditTrail({ assessmentId, entries = [], loading = false }: AuditTrailProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());
  const [auditEntries, setAuditEntries] = useState<AuditTrailEntry[]>(entries);

  useEffect(() => {
    if (entries.length === 0 && !loading) {
      // Load audit trail from backend
      loadAuditTrail();
    } else {
      setAuditEntries(entries);
    }
  }, [assessmentId, entries, loading]);

  const loadAuditTrail = async () => {
    try {
      // In real implementation, fetch from backend
      // const response = await fetch(`/api/risk-assessments/${assessmentId}/audit-trail`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockEntries: AuditTrailEntry[] = [
        {
          id: 1,
          action: 'Risk Assessment Created',
          actionType: 'CREATE',
          performedBy: 'John Smith',
          performedByRole: 'Risk Manager',
          performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          toStatus: 'DRAFT',
          comments: 'Initial risk assessment created for Location Risk category'
        },
        {
          id: 2,
          action: 'Threat Assessments Updated',
          actionType: 'FIELD_EDIT',
          performedBy: 'John Smith',
          performedByRole: 'Risk Manager',
          performedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          fieldChanges: [
            {
              fieldName: 'likelihood',
              fieldLabel: 'Likelihood (Earthquake)',
              oldValue: 'UNLIKELY',
              newValue: 'POSSIBLE',
              changeType: 'MODIFIED'
            },
            {
              fieldName: 'impact',
              fieldLabel: 'Impact (Earthquake)',
              oldValue: 'MINOR',
              newValue: 'MAJOR',
              changeType: 'MODIFIED'
            }
          ]
        },
        {
          id: 3,
          action: 'Treatment Plans Added',
          actionType: 'UPDATE',
          performedBy: 'John Smith',
          performedByRole: 'Risk Manager',
          performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          comments: 'Added 3 treatment plans for high-risk threats'
        },
        {
          id: 4,
          action: 'Submitted for Review',
          actionType: 'SUBMIT',
          performedBy: 'John Smith',
          performedByRole: 'Risk Manager',
          performedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          fromStatus: 'DRAFT',
          toStatus: 'UNDER_REVIEW',
          comments: 'Assessment completed and submitted for review'
        },
        {
          id: 5,
          action: 'Assigned to Reviewer',
          actionType: 'ASSIGN',
          performedBy: 'System',
          performedByRole: 'Automated',
          performedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          comments: 'Assigned to Sarah Johnson for review'
        },
        {
          id: 6,
          action: 'Approved',
          actionType: 'APPROVE',
          performedBy: 'Sarah Johnson',
          performedByRole: 'Risk Reviewer',
          performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fromStatus: 'UNDER_REVIEW',
          toStatus: 'APPROVED',
          comments: 'Risk assessment approved. All threat evaluations are comprehensive and treatment plans are appropriate.'
        }
      ];
      
      setAuditEntries(mockEntries);
    } catch (error) {
      console.error('Failed to load audit trail:', error);
    }
  };

  const toggleExpand = (entryId: number) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'CREATE':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'UPDATE':
      case 'FIELD_EDIT':
        return <PencilIcon className="h-5 w-5 text-yellow-600" />;
      case 'APPROVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'REJECT':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'SUBMIT':
        return <ArrowPathIcon className="h-5 w-5 text-blue-600" />;
      case 'ASSIGN':
        return <UserIcon className="h-5 w-5 text-purple-600" />;
      case 'STATUS_CHANGE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'CREATE':
        return 'bg-blue-50 border-blue-200';
      case 'UPDATE':
      case 'FIELD_EDIT':
        return 'bg-yellow-50 border-yellow-200';
      case 'APPROVE':
        return 'bg-green-50 border-green-200';
      case 'REJECT':
        return 'bg-red-50 border-red-200';
      case 'SUBMIT':
        return 'bg-blue-50 border-blue-200';
      case 'ASSIGN':
        return 'bg-purple-50 border-purple-200';
      case 'STATUS_CHANGE':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'None';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading audit trail...</div>
      </div>
    );
  }

  if (auditEntries.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-sm bg-gray-50">
        <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600">No audit trail entries yet</p>
        <p className="text-xs text-gray-500 mt-2">Activity history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Entries */}
        <div className="space-y-6">
          {auditEntries.map((entry, index) => {
            const isExpanded = expandedEntries.has(entry.id);
            const hasDetails = entry.fieldChanges && entry.fieldChanges.length > 0;

            return (
              <div key={entry.id} className="relative pl-14">
                {/* Icon */}
                <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                  {getActionIcon(entry.actionType)}
                </div>

                {/* Content */}
                <div className={`border rounded-sm p-4 ${getActionColor(entry.actionType)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-gray-900">{entry.action}</h4>
                        {entry.fromStatus && entry.toStatus && (
                          <span className="text-xs text-gray-600">
                            ({entry.fromStatus} → {entry.toStatus})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {entry.performedBy}
                          {entry.performedByRole && (
                            <span className="ml-1 text-gray-500">({entry.performedByRole})</span>
                          )}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatDate(entry.performedAt)}
                        </span>
                      </div>
                      {entry.comments && (
                        <p className="mt-2 text-sm text-gray-700 italic">"{entry.comments}"</p>
                      )}
                    </div>

                    {hasDetails && (
                      <button
                        onClick={() => toggleExpand(entry.id)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Field Changes */}
                  {hasDetails && isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Field Changes:</h5>
                      <div className="space-y-2">
                        {entry.fieldChanges!.map((change, idx) => (
                          <div key={idx} className="bg-white bg-opacity-50 rounded p-2 text-xs">
                            <div className="font-medium text-gray-900">{change.fieldLabel}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-red-600 line-through">{formatValue(change.oldValue)}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-green-600 font-medium">{formatValue(change.newValue)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 text-center">
          {auditEntries.length} audit trail {auditEntries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>
    </div>
  );
}

