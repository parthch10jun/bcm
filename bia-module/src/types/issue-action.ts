// Issue & Action Management Types

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'ON_HOLD';
export type IssuePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IssueImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
export type IssueModule = 'BIA' | 'RA' | 'BCP' | 'CM' | 'TESTING' | 'AUDIT' | 'OTHERS';

export type ActionType = 'CORRECTIVE' | 'PREVENTIVE';
export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  headName?: string;
  headEmail?: string;
}

export interface Issue {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  module: IssueModule;
  businessUnit: string; // Business Unit name or ID
  businessUnitId?: string;
  priority: IssuePriority;
  impact?: IssueImpact;
  status: IssueStatus;

  // Related record from module
  relatedRecordId?: string;
  relatedRecordTitle?: string;

  // Assignment - supports multiple assignees
  assignedTo: string[];
  assignedToEmails?: string[];
  raisedBy: string;
  raisedByEmail?: string;

  // Dates
  dueDate: string;
  createdDate: string;
  closedDate?: string;

  // Related actions
  actions: Action[];

  // Tracking
  onHoldReason?: string;

  // Attachments
  attachments?: Attachment[];

  // Audit
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export interface ProgressNote {
  id: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  type: 'CREATED' | 'STATUS_CHANGE' | 'EDIT' | 'NOTE_ADDED' | 'ATTACHMENT_ADDED';
  description: string;
  oldValue?: string;
  newValue?: string;
  createdBy: string;
  createdAt: string;
}

export interface Action {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  actionType: ActionType; // Preventive or Corrective
  status: ActionStatus;
  priority?: IssuePriority;

  // Assignment
  owner: string;
  ownerEmail?: string;

  // Dates
  targetDate: string;
  completionDate?: string;

  // Progress tracking
  progressNotes: ProgressNote[];

  // Attachments
  attachments?: Attachment[];

  // Timeline/Audit
  timeline?: TimelineEntry[];

  // Parent issue reference
  issueId: string;

  // Audit
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard statistics
export interface IssueActionStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  completedIssues: number;
  closedIssues: number;
  onHoldIssues: number;
  overdueIssues: number;

  totalActions: number;
  openActions: number;
  inProgressActions: number;
  completedActions: number;
  closedActions: number;
  overdueActions: number;

  // By priority
  criticalIssues: number;
  highPriorityIssues: number;

  // By module
  issuesByModule: { module: string; count: number }[];

  // By business unit
  issuesByBusinessUnit: { businessUnit: string; count: number }[];
  overdueIssuesByBusinessUnit: { businessUnit: string; count: number }[];

  // By action type
  preventiveActions: number;
  correctiveActions: number;
  actionsByType: { type: ActionType; count: number }[];
}

// Filter options
export interface IssueFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  module?: IssueModule[];
  businessUnit?: string[];
  assignee?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface ActionFilters {
  status?: ActionStatus[];
  actionType?: ActionType[];
  owner?: string;
  issueId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

// Status configuration for UI - per specification colors
// Open = Blue, In Progress = Yellow, Completed = Green, Closed = Grey, On Hold = Purple
export const IssueStatusConfig: Record<IssueStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  OPEN: { label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  COMPLETED: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  CLOSED: { label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  ON_HOLD: { label: 'On Hold', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
};

export const ActionStatusConfig: Record<ActionStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  OPEN: { label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  COMPLETED: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  CLOSED: { label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
};

// Priority colors per specification: Low = grey, Medium = blue, High = orange, Critical = red
export const PriorityConfig: Record<IssuePriority, { label: string; color: string; bgColor: string; borderColor: string }> = {
  CRITICAL: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  HIGH: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  MEDIUM: { label: 'Medium', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  LOW: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' }
};

export const ImpactConfig: Record<IssueImpact, { label: string; color: string; bgColor: string; borderColor: string }> = {
  SEVERE: { label: 'Severe', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  HIGH: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  LOW: { label: 'Low', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
};

export const ModuleConfig: Record<IssueModule, { label: string; color: string; bgColor: string }> = {
  BIA: { label: 'BIA', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  RA: { label: 'Risk Assessment', color: 'text-red-700', bgColor: 'bg-red-50' },
  BCP: { label: 'BCP', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  CM: { label: 'Crisis Management', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  TESTING: { label: 'Testing', color: 'text-green-700', bgColor: 'bg-green-50' },
  AUDIT: { label: 'Audit', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  OTHERS: { label: 'Others', color: 'text-gray-700', bgColor: 'bg-gray-50' }
};

export const ActionTypeConfig: Record<ActionType, { label: string; color: string; bgColor: string; borderColor: string }> = {
  PREVENTIVE: { label: 'Preventive', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  CORRECTIVE: { label: 'Corrective', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
};

