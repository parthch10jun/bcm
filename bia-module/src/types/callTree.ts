export interface Contact {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  primaryPhone: string;
  secondaryPhone?: string;
  workEmail: string;
  personalEmail?: string;
  location: string;
  isKeyPersonnel: boolean;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CallTreeNode {
  id: string;
  contactId: string;
  contact: Contact;
  children: CallTreeNode[];
  escalationRules: {
    timeoutMinutes: number;
    escalateToId?: string;
    alternateContactId?: string;
  };
  callInstructions?: string;
  priority: number; // Order of calling within the same level
}

export interface CallTree {
  id: string;
  name: string;
  description: string;
  purpose: string;
  applicableScenarios: string[];
  
  // Tree structure
  rootNodes: CallTreeNode[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivated?: Date;
  
  // Configuration
  maxCallAttempts: number;
  defaultTimeoutMinutes: number;
  escalationPolicy: 'Automatic' | 'Manual';
  
  // Status
  status: 'Active' | 'Inactive' | 'Under Review';
  approvedBy?: string;
  approvedDate?: Date;
  nextReviewDate: Date;
}

export interface CallTreeActivation {
  id: string;
  callTreeId: string;
  activatedBy: string;
  activatedAt: Date;
  reason: string;
  incidentId?: string;
  
  // Progress tracking
  callProgress: {
    contactId: string;
    status: 'Pending' | 'Calling' | 'Reached' | 'No Answer' | 'Escalated';
    attemptCount: number;
    lastAttemptAt?: Date;
    reachedAt?: Date;
    notes?: string;
  }[];
  
  completedAt?: Date;
  effectiveness: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lessonsLearned?: string;
}

export interface CallTreeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Crisis Management' | 'IT Emergency' | 'Facility Emergency' | 'Security Incident' | 'Custom';
  structure: {
    level: number;
    roleType: string;
    suggestedRoles: string[];
    callInstructions: string;
  }[];
}
