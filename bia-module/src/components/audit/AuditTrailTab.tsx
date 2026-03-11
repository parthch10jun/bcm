'use client';

import { useState, useEffect } from 'react';
import { auditService } from '@/services/auditService';
import { AuditEntry, AuditModule, formatActionType, getActionTypeColor } from '@/types/audit';
import {
  ClockIcon,
  UserIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface AuditTrailTabProps {
  module: AuditModule;
  recordId: string;
}

export default function AuditTrailTab({ module, recordId }: AuditTrailTabProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [filterActionType, setFilterActionType] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAuditTrail();
  }, [module, recordId]);

  const loadAuditTrail = async () => {
    try {
      setLoading(true);
      const data = await auditService.getRecordAudit(module, recordId);
      setEntries(data);
    } catch (error) {
      console.error('Error loading audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filterActionType && entry.actionType !== filterActionType) return false;
    if (filterUser && !entry.performedBy.userName.toLowerCase().includes(filterUser.toLowerCase())) return false;
    return true;
  });

  const uniqueUsers = Array.from(new Set(entries.map(e => e.performedBy.userName)));

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDateTime(dateString);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Audit Trail</h2>
            <p className="mt-0.5 text-xs text-gray-500">Complete history of all changes to this record</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-sm ${
                showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-3.5 w-3.5 mr-1" />
              Filter
            </button>
            <button
              onClick={loadAuditTrail}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
                <select
                  value={filterActionType}
                  onChange={(e) => setFilterActionType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="SUBMIT">Submit</option>
                  <option value="REVIEW">Review</option>
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                  <option value="SEND_BACK">Send Back</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">User</label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Users</option>
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  setFilterActionType('');
                  setFilterUser('');
                }}
                className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="text-center py-8">
            <ArrowPathIcon className="h-6 w-6 text-gray-400 animate-spin mx-auto" />
            <p className="mt-2 text-xs text-gray-500">Loading audit trail...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-xs font-medium text-gray-900">No audit entries found</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredEntries.map((entry, idx) => (
                <li key={entry.id}>
                  <div className="relative pb-8">
                    {idx !== filteredEntries.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          entry.actionType === 'CREATE' ? 'bg-green-500' :
                          entry.actionType === 'UPDATE' ? 'bg-blue-500' :
                          entry.actionType === 'DELETE' ? 'bg-red-500' :
                          entry.actionType === 'APPROVE' ? 'bg-green-500' :
                          entry.actionType === 'REJECT' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}>
                          <UserIcon className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getActionTypeColor(entry.actionType)}`}>
                              {formatActionType(entry.actionType)}
                            </span>
                            <span className="text-xs font-medium text-gray-900">{entry.performedBy.userName}</span>
                          </div>
                          <p className="text-xs text-gray-600">{entry.description}</p>
                          {(entry.fieldName || entry.oldValue || entry.newValue) && (
                            <button
                              onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                              className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                              {expandedEntry === entry.id ? (
                                <>
                                  <ChevronUpIcon className="h-3 w-3 mr-1" />
                                  Hide details
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="h-3 w-3 mr-1" />
                                  Show details
                                </>
                              )}
                            </button>
                          )}
                          {expandedEntry === entry.id && (
                            <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-sm text-xs space-y-1">
                              {entry.fieldName && (
                                <div><span className="font-medium">Field:</span> {entry.fieldName}</div>
                              )}
                              {entry.oldValue && (
                                <div><span className="font-medium">Old Value:</span> {entry.oldValue}</div>
                              )}
                              {entry.newValue && (
                                <div><span className="font-medium">New Value:</span> {entry.newValue}</div>
                              )}
                              {entry.ipAddress && (
                                <div><span className="font-medium">IP Address:</span> {entry.ipAddress}</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-gray-500">
                          <div>{formatRelativeTime(entry.timestamp)}</div>
                          <div className="text-[10px] text-gray-400">{formatDateTime(entry.timestamp)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

