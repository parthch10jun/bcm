'use client';

import { useState, useEffect, useMemo } from 'react';
import { auditService } from '@/services/auditService';
import { AuditEntry, AuditFilter, formatActionType, getActionTypeColor, formatModuleName } from '@/types/audit';
import {
  ClipboardDocumentListIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<AuditFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    loadEntries();
  }, [filter]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await auditService.getEntries(filter);
      setEntries(data);
    } catch (error) {
      console.error('Error loading audit entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchTerm ||
        entry.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.recordName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.performedBy.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [entries, searchTerm]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handleExport = () => {
    // In production, this would generate a CSV/Excel file
    alert('Export functionality will be implemented');
  };

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

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">System Audit Log</h1>
            <p className="mt-0.5 text-xs text-gray-500">Complete audit trail of all system activities</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1" />
              Export
            </button>
            <button
              onClick={loadEntries}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Entries</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{entries.length}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-blue-600 uppercase">Today</p>
            <p className="text-2xl font-semibold text-blue-900 mt-1">
              {entries.filter(e => {
                const today = new Date().toDateString();
                return new Date(e.timestamp).toDateString() === today;
              }).length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-green-600 uppercase">This Week</p>
            <p className="text-2xl font-semibold text-green-900 mt-1">
              {entries.filter(e => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(e.timestamp) >= weekAgo;
              }).length}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-purple-600 uppercase">Unique Users</p>
            <p className="text-2xl font-semibold text-purple-900 mt-1">
              {new Set(entries.map(e => e.performedBy.userId)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by record ID, user, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm text-sm"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-sm ${
              showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-1.5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Module</label>
                <select
                  value={filter.module || ''}
                  onChange={(e) => setFilter({ ...filter, module: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Modules</option>
                  <option value="BIA">BIA</option>
                  <option value="RISK_ASSESSMENT">Risk Assessment</option>
                  <option value="RISK_REGISTER">Risk Register</option>
                  <option value="TREATMENT_PLAN">Treatment Plan</option>
                  <option value="CONTROL_LIBRARY">Control Library</option>
                  <option value="VULNERABILITY_LIBRARY">Vulnerability Library</option>
                  <option value="THREAT_LIBRARY">Threat Library</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
                <select
                  value={filter.actionType || ''}
                  onChange={(e) => setFilter({ ...filter, actionType: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="SUBMIT">Submit</option>
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                  <option value="ESCALATE">Escalate</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={filter.dateFrom || ''}
                  onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filter.dateTo || ''}
                  onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setFilter({})}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Entries Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="text-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Loading audit entries...</p>
          </div>
        ) : paginatedEntries.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-900">No audit entries found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Module</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Record</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEntries.map((entry) => (
                  <>
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                        {formatDateTime(entry.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getActionTypeColor(entry.actionType)}`}>
                          {formatActionType(entry.actionType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {formatModuleName(entry.module)}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium text-gray-900">{entry.recordId}</div>
                        {entry.recordName && <div className="text-gray-500">{entry.recordName}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium text-gray-900">{entry.performedBy.userName}</div>
                        <div className="text-gray-500">{entry.performedBy.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {entry.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {(entry.fieldName || entry.oldValue || entry.newValue) && (
                          <button
                            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                          >
                            {expandedEntry === entry.id ? (
                              <>
                                <ChevronUpIcon className="h-3 w-3 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronDownIcon className="h-3 w-3 mr-1" />
                                Show
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedEntry === entry.id && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-gray-50">
                          <div className="text-xs space-y-2">
                            {entry.fieldName && (
                              <div>
                                <span className="font-medium text-gray-700">Field: </span>
                                <span className="text-gray-900">{entry.fieldName}</span>
                              </div>
                            )}
                            {entry.oldValue && (
                              <div>
                                <span className="font-medium text-gray-700">Old Value: </span>
                                <span className="text-gray-900">{entry.oldValue}</span>
                              </div>
                            )}
                            {entry.newValue && (
                              <div>
                                <span className="font-medium text-gray-700">New Value: </span>
                                <span className="text-gray-900">{entry.newValue}</span>
                              </div>
                            )}
                            {entry.ipAddress && (
                              <div>
                                <span className="font-medium text-gray-700">IP Address: </span>
                                <span className="text-gray-900">{entry.ipAddress}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-xs text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

