/**
 * Audit Trail Type Definitions
 * Unified audit framework for tracking all changes across BCM platform
 */

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'SUBMIT'
  | 'REVIEW'
  | 'APPROVE'
  | 'REJECT'
  | 'SEND_BACK'
  | 'ESCALATE'
  | 'COMPLETE'
  | 'REOPEN'
  | 'ASSIGN'
  | 'REASSIGN'
  | 'COMMENT'
  | 'ATTACH'
  | 'SLA_BREACH'
  | 'SLA_WARNING'
  | 'STATUS_CHANGE'
  | 'WORKFLOW_TRANSITION';

export type AuditModule =
  | 'BIA'
  | 'RISK_ASSESSMENT'
  | 'RISK_REGISTER'
  | 'TREATMENT_PLAN'
  | 'VULNERABILITY_LIBRARY'
  | 'THREAT_LIBRARY'
  | 'CONTROL_LIBRARY'
  | 'RISK_CATEGORY_LIBRARY'
  | 'ASSET_LIBRARY'
  | 'PEOPLE_LIBRARY'
  | 'LOCATION_LIBRARY'
  | 'VENDOR_LIBRARY'
  | 'PROCESS_LIBRARY'
  | 'ORGANIZATIONAL_UNIT_LIBRARY'
  | 'BCP'
  | 'BCP_SCENARIO'
  | 'BCP_TEST'
  | 'CRISIS_MANAGEMENT'
  | 'ISSUE_TRACKER'
  | 'ACTION_TRACKER'
  | 'SETTINGS'
  | 'SLA_CONFIG'
  | 'MAPPING'
  | 'SYSTEM';

export interface AuditEntry {
  id: string;
  actionType: AuditActionType;
  module: AuditModule;
  recordId: string;
  recordName?: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  timestamp: string; // ISO 8601 UTC
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  description?: string;
}

export interface AuditFilter {
  module?: AuditModule;
  actionType?: AuditActionType;
  recordId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface AuditStats {
  totalEntries: number;
  entriesByModule: Record<AuditModule, number>;
  entriesByAction: Record<AuditActionType, number>;
  recentActivity: AuditEntry[];
  topUsers: Array<{
    userId: string;
    userName: string;
    actionCount: number;
  }>;
}

// Helper function to format action type for display
export const formatActionType = (actionType: AuditActionType): string => {
  const labels: Record<AuditActionType, string> = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    SUBMIT: 'Submitted',
    REVIEW: 'Reviewed',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    SEND_BACK: 'Sent Back',
    ESCALATE: 'Escalated',
    COMPLETE: 'Completed',
    REOPEN: 'Reopened',
    ASSIGN: 'Assigned',
    REASSIGN: 'Reassigned',
    COMMENT: 'Commented',
    ATTACH: 'Attached File',
    SLA_BREACH: 'SLA Breached',
    SLA_WARNING: 'SLA Warning',
    STATUS_CHANGE: 'Status Changed',
    WORKFLOW_TRANSITION: 'Workflow Transition'
  };
  return labels[actionType] || actionType;
};

// Helper function to get action type color
export const getActionTypeColor = (actionType: AuditActionType): string => {
  const colors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800 border-green-200',
    UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200',
    SUBMIT: 'bg-purple-100 text-purple-800 border-purple-200',
    APPROVE: 'bg-green-100 text-green-800 border-green-200',
    REJECT: 'bg-red-100 text-red-800 border-red-200',
    SEND_BACK: 'bg-orange-100 text-orange-800 border-orange-200',
    ESCALATE: 'bg-red-100 text-red-800 border-red-200',
    SLA_BREACH: 'bg-red-100 text-red-800 border-red-200',
    SLA_WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DEFAULT: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[actionType] || colors.DEFAULT;
};

// Helper function to format module name for display
export const formatModuleName = (module: AuditModule): string => {
  const labels: Record<AuditModule, string> = {
    BIA: 'BIA',
    RISK_ASSESSMENT: 'Risk Assessment',
    RISK_REGISTER: 'Risk Register',
    TREATMENT_PLAN: 'Treatment Plan',
    VULNERABILITY_LIBRARY: 'Vulnerability Library',
    THREAT_LIBRARY: 'Threat Library',
    CONTROL_LIBRARY: 'Control Library',
    RISK_CATEGORY_LIBRARY: 'Risk Category Library',
    ASSET_LIBRARY: 'Asset Library',
    PEOPLE_LIBRARY: 'People Library',
    LOCATION_LIBRARY: 'Location Library',
    VENDOR_LIBRARY: 'Vendor Library',
    PROCESS_LIBRARY: 'Process Library',
    ORGANIZATIONAL_UNIT_LIBRARY: 'Organizational Unit Library',
    BCP: 'BCP',
    BCP_SCENARIO: 'BCP Scenario',
    BCP_TEST: 'BCP Test',
    CRISIS_MANAGEMENT: 'Crisis Management',
    ISSUE_TRACKER: 'Issue Tracker',
    ACTION_TRACKER: 'Action Tracker',
    SETTINGS: 'Settings',
    SLA_CONFIG: 'SLA Configuration',
    MAPPING: 'Mapping',
    SYSTEM: 'System'
  };
  return labels[module] || module;
};

