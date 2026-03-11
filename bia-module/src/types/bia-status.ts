/**
 * BIA Status Aggregation Types
 * 
 * These types support the BIA status rollup from processes to organizational units.
 * This allows departments/units to show an aggregated view of their BIA completion status.
 */

/**
 * Individual Process BIA Status
 * Matches the backend BiaStatus enum
 */
export type ProcessBIAStatus = 
  | 'NOT_STARTED'   // No BIA initiated
  | 'DRAFT'         // BIA being drafted
  | 'IN_PROGRESS'   // BIA in progress
  | 'SUBMITTED'     // Submitted for approval
  | 'UNDER_REVIEW'  // Being reviewed
  | 'APPROVED'      // Completed and approved
  | 'REJECTED'      // Rejected, needs rework
  | 'ARCHIVED';     // Archived/historical

/**
 * Aggregated Unit BIA Status
 * Calculated based on the status of all processes in the unit
 */
export type UnitBIAStatus =
  | 'NOT_STARTED'        // All processes are not started
  | 'IN_PROGRESS'        // At least one process is in progress
  | 'COMPLETED'          // All processes are approved
  | 'REQUIRES_ATTENTION'; // At least one process is rejected

/**
 * Process summary for BIA status display
 */
export interface ProcessBIASummary {
  id: string;
  processName: string;
  processOwner?: string;
  biaStatus: ProcessBIAStatus;
  lastUpdated: string; // ISO date string
  rto?: number; // Recovery Time Objective in hours
  criticality?: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
}

/**
 * BIA Status breakdown by status type
 */
export interface BIAStatusBreakdown {
  notStarted: number;
  draft: number;
  inProgress: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  archived: number;
}

/**
 * Complete BIA status summary for an organizational unit
 */
export interface BIAStatusSummary {
  totalProcesses: number;
  statusBreakdown: BIAStatusBreakdown;
  overallStatus: UnitBIAStatus;
  completionPercentage: number; // 0-100
  processes: ProcessBIASummary[];
}

/**
 * Status display configuration
 */
export interface BIAStatusConfig {
  status: ProcessBIAStatus | UnitBIAStatus;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

/**
 * Status configurations for display
 */
export const PROCESS_BIA_STATUS_CONFIG: Record<ProcessBIAStatus, BIAStatusConfig> = {
  NOT_STARTED: {
    status: 'NOT_STARTED',
    label: 'Not Started',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: 'bg-gray-400',
    description: 'BIA has not been initiated for this process'
  },
  DRAFT: {
    status: 'DRAFT',
    label: 'Draft',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'bg-blue-500',
    description: 'BIA is being drafted'
  },
  IN_PROGRESS: {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'bg-blue-500',
    description: 'BIA is in progress'
  },
  SUBMITTED: {
    status: 'SUBMITTED',
    label: 'Submitted',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: 'bg-yellow-500',
    description: 'BIA has been submitted for approval'
  },
  UNDER_REVIEW: {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: 'bg-orange-500',
    description: 'BIA is being reviewed'
  },
  APPROVED: {
    status: 'APPROVED',
    label: 'Approved',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'bg-green-500',
    description: 'BIA has been completed and approved'
  },
  REJECTED: {
    status: 'REJECTED',
    label: 'Rejected',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'bg-red-500',
    description: 'BIA has been rejected and needs rework'
  },
  ARCHIVED: {
    status: 'ARCHIVED',
    label: 'Archived',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    icon: 'bg-gray-400',
    description: 'BIA has been archived'
  }
};

export const UNIT_BIA_STATUS_CONFIG: Record<UnitBIAStatus, BIAStatusConfig> = {
  NOT_STARTED: {
    status: 'NOT_STARTED',
    label: 'Not Started',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: 'bg-gray-400',
    description: 'No process BIAs have been started'
  },
  IN_PROGRESS: {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'bg-blue-500',
    description: 'Some process BIAs are in progress'
  },
  COMPLETED: {
    status: 'COMPLETED',
    label: 'Completed',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'bg-green-500',
    description: 'All process BIAs are approved'
  },
  REQUIRES_ATTENTION: {
    status: 'REQUIRES_ATTENTION',
    label: 'Requires Attention',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'bg-red-500',
    description: 'Some process BIAs require attention'
  }
};

/**
 * Calculate overall unit status based on process statuses
 */
export function calculateUnitBIAStatus(breakdown: BIAStatusBreakdown, totalProcesses: number): UnitBIAStatus {
  // If no processes, return NOT_STARTED
  if (totalProcesses === 0) {
    return 'NOT_STARTED';
  }

  // If any rejected, requires attention
  if (breakdown.rejected > 0) {
    return 'REQUIRES_ATTENTION';
  }

  // If all approved, completed
  if (breakdown.approved === totalProcesses) {
    return 'COMPLETED';
  }

  // If any in progress, draft, submitted, or under review
  if (breakdown.draft > 0 || breakdown.inProgress > 0 || breakdown.submitted > 0 || breakdown.underReview > 0) {
    return 'IN_PROGRESS';
  }

  // Otherwise, not started
  return 'NOT_STARTED';
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(breakdown: BIAStatusBreakdown, totalProcesses: number): number {
  if (totalProcesses === 0) return 0;
  
  // Only approved processes count as complete
  return Math.round((breakdown.approved / totalProcesses) * 100);
}

/**
 * Get status configuration for a given status
 */
export function getProcessStatusConfig(status: ProcessBIAStatus): BIAStatusConfig {
  return PROCESS_BIA_STATUS_CONFIG[status];
}

export function getUnitStatusConfig(status: UnitBIAStatus): BIAStatusConfig {
  return UNIT_BIA_STATUS_CONFIG[status];
}

