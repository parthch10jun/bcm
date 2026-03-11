/**
 * My Actions Service
 * Handles task management and workflow-generated actions
 */

import { Task, TaskFilter, TaskStats, TaskSortBy, TaskStatus } from '@/types/my-actions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mock data for development
const generateMockTasks = (): Task[] => {
  const now = new Date();
  
  return [
    {
      id: 'task-001',
      title: 'Review Risk Assessment #RA-0021 – Residual Risk Above Threshold',
      module: 'RISK_ASSESSMENT',
      recordId: 'RA-0021',
      recordName: 'Cybersecurity Risk Assessment 2024',
      taskType: 'REVIEW',
      priority: 'CRITICAL',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      assignedBy: { userId: 'user-2', userName: 'Sarah Johnson' },
      receivedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/risk-assessment/RA-0021',
      description: 'Residual risk rating exceeds acceptable threshold. Immediate review required.',
      metadata: { residualRiskRating: 'Very High', businessUnit: 'IT Operations' }
    },
    {
      id: 'task-002',
      title: 'Approve Treatment Plan for Threat: Cyber Attack – Due Today',
      module: 'TREATMENT_PLAN',
      recordId: 'TP-045',
      recordName: 'Cyber Attack Mitigation Plan',
      taskType: 'APPROVAL',
      priority: 'HIGH',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      assignedBy: { userId: 'user-3', userName: 'Mike Chen' },
      receivedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime()).toISOString(),
      actionUrl: '/risk-assessment/treatment-plans/TP-045',
      description: 'Treatment plan requires your approval before implementation.',
      metadata: { businessUnit: 'IT Security' }
    },
    {
      id: 'task-003',
      title: 'BIA for Finance Operations Assigned – Pending Completion',
      module: 'BIA',
      recordId: 'BIA-012',
      recordName: 'Finance Operations BIA',
      taskType: 'ASSIGNMENT',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      assignedBy: { userId: 'user-4', userName: 'David Wilson' },
      receivedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/bia-records/BIA-012',
      description: 'Complete BIA questionnaire for Finance Operations department.',
      metadata: { businessUnit: 'Finance' }
    },
    {
      id: 'task-004',
      title: 'Mitigation Action Overdue by 3 Days – Your Update Required',
      module: 'ACTION_TRACKER',
      recordId: 'ACT-089',
      recordName: 'Implement MFA for All Systems',
      taskType: 'UPDATE',
      priority: 'HIGH',
      status: 'OVERDUE',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      receivedDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/issues/ISS-023/actions/ACT-089',
      description: 'Action is overdue. Please provide status update.',
      metadata: { businessUnit: 'IT Security' }
    },
    {
      id: 'task-005',
      title: 'Risk Assessment Escalated Due to SLA Breach – Immediate Attention Needed',
      module: 'RISK_ASSESSMENT',
      recordId: 'RA-0018',
      recordName: 'Operational Risk Assessment Q3',
      taskType: 'ESCALATION',
      priority: 'CRITICAL',
      status: 'ESCALATED',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      assignedBy: { userId: 'system', userName: 'System' },
      receivedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/risk-assessment/RA-0018',
      description: 'SLA breach detected. Review has been pending for 5 days.',
      metadata: { slaBreachHours: 120, businessUnit: 'Operations' }
    },
    {
      id: 'task-006',
      title: 'Review Vulnerability Mapping Changes – Pending Review',
      module: 'MAPPING',
      recordId: 'MAP-034',
      recordName: 'Vulnerability to Threat Mapping Update',
      taskType: 'QUALITY_REVIEW',
      priority: 'MEDIUM',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      receivedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/libraries/mapping/MAP-034',
      description: 'Review recent changes to vulnerability-threat mappings.',
      metadata: {}
    },
    {
      id: 'task-007',
      title: 'Update Control Effectiveness Score – Periodic Review Assigned',
      module: 'CONTROL_LIBRARY',
      recordId: 'CTL-003',
      recordName: 'Incident Response Plan',
      taskType: 'PERIODIC_REVIEW',
      priority: 'LOW',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      receivedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/libraries/controls/CTL-003',
      description: 'Quarterly control effectiveness review is due.',
      metadata: { businessUnit: 'IT Operations' }
    },
    {
      id: 'task-008',
      title: 'BCP Test Execution – DR Test Q4 2024',
      module: 'BCP_TEST',
      recordId: 'TEST-005',
      recordName: 'DR Test Q4 2024',
      taskType: 'TESTING',
      priority: 'HIGH',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      receivedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/bcp/tests/TEST-005/execute',
      description: 'Execute scheduled disaster recovery test.',
      metadata: { businessUnit: 'IT Operations' }
    },
    {
      id: 'task-009',
      title: 'Issue Correction Required – Backup System Failure',
      module: 'ISSUE_TRACKER',
      recordId: 'ISS-023',
      recordName: 'Backup System Failure',
      taskType: 'CORRECTION',
      priority: 'CRITICAL',
      status: 'PENDING',
      assignedTo: { userId: 'user-1', userName: 'John Smith', userEmail: 'john.smith@company.com' },
      receivedDate: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/issues/ISS-023',
      description: 'Critical issue requires immediate correction.',
      metadata: { businessUnit: 'IT Infrastructure' }
    }
  ];
};

export const myActionsService = {
  /**
   * Get tasks for current user with filtering
   */
  getTasks: async (userId: string, filter?: TaskFilter): Promise<Task[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (filter?.module) queryParams.append('module', filter.module);
      if (filter?.taskType) queryParams.append('taskType', filter.taskType);
      if (filter?.priority) queryParams.append('priority', filter.priority);
      if (filter?.status) queryParams.append('status', filter.status);
      if (filter?.overdueOnly) queryParams.append('overdueOnly', 'true');

      const url = `${API_BASE_URL}/api/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return mock data for development
      let tasks = generateMockTasks();
      
      // Apply filters
      if (filter?.module) {
        tasks = tasks.filter(t => t.module === filter.module);
      }
      if (filter?.taskType) {
        tasks = tasks.filter(t => t.taskType === filter.taskType);
      }
      if (filter?.priority) {
        tasks = tasks.filter(t => t.priority === filter.priority);
      }
      if (filter?.status) {
        tasks = tasks.filter(t => t.status === filter.status);
      }
      if (filter?.overdueOnly) {
        const now = new Date();
        tasks = tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'COMPLETED');
      }
      
      return tasks;
    }
  },

  /**
   * Get task statistics for current user
   */
  getStats: async (userId: string): Promise<TaskStats> => {
    const tasks = await myActionsService.getTasks(userId);
    const now = new Date();
    
    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
      overdueTasks: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'COMPLETED').length,
      escalatedTasks: tasks.filter(t => t.status === 'ESCALATED').length,
      tasksByModule: {} as any,
      tasksByType: {} as any,
      tasksByPriority: {} as any
    };
  },

  /**
   * Update task status
   */
  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  /**
   * Dismiss a task
   */
  dismissTask: async (taskId: string): Promise<void> => {
    await myActionsService.updateTaskStatus(taskId, 'DISMISSED');
  }
};

