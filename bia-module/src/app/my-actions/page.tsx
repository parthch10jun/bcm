'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { myActionsService } from '@/services/myActionsService';
import { Task, TaskFilter, TaskSortBy, formatTaskType, getTaskTypeColor, getPriorityColor, getTaskStatusColor, getDaysUntilDue } from '@/types/my-actions';
import { formatModuleName } from '@/types/audit';
import {
  ClipboardDocumentListIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

export default function MyActionsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sortBy, setSortBy] = useState<TaskSortBy>('NEWEST_FIRST');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // In production, get userId from auth context
      const userId = 'user-1';
      const data = await myActionsService.getTasks(userId, filter);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      const matchesSearch = !searchTerm ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.recordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.recordId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case 'OLDEST_FIRST':
        result.sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime());
        break;
      case 'NEWEST_FIRST':
        result.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
        break;
      case 'HIGHEST_PRIORITY':
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'NEARING_SLA':
        result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'MODULE_AZ':
        result.sort((a, b) => formatModuleName(a.module).localeCompare(formatModuleName(b.module)));
        break;
      case 'DUE_DATE':
        result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
    }

    return result;
  }, [tasks, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'PENDING').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'COMPLETED').length,
      escalated: tasks.filter(t => t.status === 'ESCALATED').length,
      critical: tasks.filter(t => t.priority === 'CRITICAL' && t.status !== 'COMPLETED').length
    };
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    router.push(task.actionUrl);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Actions</h1>
            <p className="mt-0.5 text-xs text-gray-500">Tasks and workflow items requiring your attention</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadTasks}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-blue-600 uppercase">Pending</p>
                <p className="text-2xl font-semibold text-blue-900 mt-1">{stats.pending}</p>
              </div>
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-red-600 uppercase">Overdue</p>
                <p className="text-2xl font-semibold text-red-900 mt-1">{stats.overdue}</p>
              </div>
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-orange-600 uppercase">Escalated</p>
                <p className="text-2xl font-semibold text-orange-900 mt-1">{stats.escalated}</p>
              </div>
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-red-600 uppercase">Critical</p>
                <p className="text-2xl font-semibold text-red-900 mt-1">{stats.critical}</p>
              </div>
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
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
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as TaskSortBy)}
            className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
          >
            <option value="NEWEST_FIRST">Newest First</option>
            <option value="OLDEST_FIRST">Oldest First</option>
            <option value="HIGHEST_PRIORITY">Highest Priority</option>
            <option value="NEARING_SLA">Nearing SLA</option>
            <option value="DUE_DATE">Due Date</option>
            <option value="MODULE_AZ">Module A-Z</option>
          </select>

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
                <label className="block text-xs font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={filter.taskType || ''}
                  onChange={(e) => setFilter({ ...filter, taskType: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Types</option>
                  <option value="REVIEW">Review</option>
                  <option value="APPROVAL">Approval</option>
                  <option value="UPDATE">Update</option>
                  <option value="CORRECTION">Correction</option>
                  <option value="ESCALATION">Escalation</option>
                  <option value="SLA_WARNING">SLA Warning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filter.priority || ''}
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter.status || ''}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="ESCALATED">Escalated</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Show</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.overdueOnly || false}
                    onChange={(e) => setFilter({ ...filter, overdueOnly: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="ml-2 text-xs text-gray-700">Overdue Only</span>
                </label>
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

      {/* Tasks List */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="text-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Loading tasks...</p>
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-900">No tasks found</p>
            <p className="text-xs text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedTasks.map((task) => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              const isOverdue = daysUntilDue < 0;

              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getTaskTypeColor(task.taskType)}`}>
                          {formatTaskType(task.taskType)}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-sm border bg-gray-100 text-gray-700 border-gray-200">
                          {formatModuleName(task.module)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Record: <span className="font-medium text-gray-700">{task.recordId}</span></span>
                        <span>Received: {formatDate(task.receivedDate)}</span>
                        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          Due: {formatDate(task.dueDate)}
                          {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
                          {!isOverdue && daysUntilDue <= 1 && ' (Due soon)'}
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

