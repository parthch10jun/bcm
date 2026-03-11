/**
 * My Actions / Task Dashboard Type Definitions
 * Unified task management system for workflow-generated actions
 */

import { AuditModule } from './audit';

export type TaskType =
  | 'REVIEW'
  | 'APPROVAL'
  | 'UPDATE'
  | 'CORRECTION'
  | 'ESCALATION'
  | 'SLA_WARNING'
  | 'ASSIGNMENT'
  | 'COMPLETION'
  | 'QUALITY_REVIEW'
  | 'TESTING'
  | 'CALL_TREE_TEST'
  | 'PERIODIC_REVIEW';

export type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'OVERDUE'
  | 'ESCALATED'
  | 'COMPLETED'
  | 'DISMISSED';

export type TaskPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

export interface Task {
  id: string;
  title: string;
  module: AuditModule;
  recordId: string;
  recordName: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  assignedBy?: {
    userId: string;
    userName: string;
  };
  receivedDate: string; // ISO 8601
  dueDate: string; // ISO 8601
  completedDate?: string;
  actionUrl: string; // URL to navigate to the record
  description?: string;
  metadata?: {
    residualRiskRating?: string;
    businessUnit?: string;
    slaBreachHours?: number;
    relatedRecordId?: string;
    [key: string]: any;
  };
}

export interface TaskFilter {
  module?: AuditModule;
  taskType?: TaskType;
  priority?: TaskPriority;
  status?: TaskStatus;
  overdueOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
  businessUnit?: string;
  searchTerm?: string;
}

export type TaskSortBy =
  | 'OLDEST_FIRST'
  | 'NEWEST_FIRST'
  | 'HIGHEST_PRIORITY'
  | 'NEARING_SLA'
  | 'MODULE_AZ'
  | 'DUE_DATE';

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  escalatedTasks: number;
  tasksByModule: Record<AuditModule, number>;
  tasksByType: Record<TaskType, number>;
  tasksByPriority: Record<TaskPriority, number>;
}

// Helper function to format task type for display
export const formatTaskType = (taskType: TaskType): string => {
  const labels: Record<TaskType, string> = {
    REVIEW: 'Review',
    APPROVAL: 'Approval',
    UPDATE: 'Update',
    CORRECTION: 'Correction',
    ESCALATION: 'Escalation',
    SLA_WARNING: 'SLA Warning',
    ASSIGNMENT: 'Assignment',
    COMPLETION: 'Completion',
    QUALITY_REVIEW: 'Quality Review',
    TESTING: 'Testing',
    CALL_TREE_TEST: 'Call Tree Test',
    PERIODIC_REVIEW: 'Periodic Review'
  };
  return labels[taskType] || taskType;
};

// Helper function to get task type color
export const getTaskTypeColor = (taskType: TaskType): string => {
  const colors: Record<string, string> = {
    REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
    APPROVAL: 'bg-green-100 text-green-800 border-green-200',
    UPDATE: 'bg-purple-100 text-purple-800 border-purple-200',
    CORRECTION: 'bg-orange-100 text-orange-800 border-orange-200',
    ESCALATION: 'bg-red-100 text-red-800 border-red-200',
    SLA_WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DEFAULT: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[taskType] || colors.DEFAULT;
};

// Helper function to get priority color
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LOW: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[priority];
};

// Helper function to get status color
export const getTaskStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
    OVERDUE: 'bg-red-100 text-red-800 border-red-200',
    ESCALATED: 'bg-red-100 text-red-800 border-red-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    DISMISSED: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status];
};

// Helper function to check if task is overdue
export const isTaskOverdue = (dueDate: string, status: TaskStatus): boolean => {
  if (status === 'COMPLETED' || status === 'DISMISSED') return false;
  return new Date(dueDate) < new Date();
};

// Helper function to calculate days until due
export const getDaysUntilDue = (dueDate: string): number => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

