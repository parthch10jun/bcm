// Core BIA Data Types following ISO 22301 requirements
// Implements the formal BIA lifecycle workflow and governance

export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// BIA Lifecycle States
export type BIAStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'In Consolidation';

// BIA Workflow Actions
export type BIAAction = 'Submit for Approval' | 'Approve' | 'Reject' | 'Request Changes' | 'Add to Consolidation';

// Enhanced BIA Analysis Types - The "How Critical" Phase
export interface ImpactAnalysisMatrix {
  impactCategory: string; // e.g., 'Financial', 'Reputational', 'Regulatory'
  timeframes: {
    timeframe: string; // e.g., '<4 Hours', '4-24 Hours', '1-3 Days'
    impactRating: number; // 1-5 scale
    impactDescription: string;
    quantitativeValue?: number; // For financial impacts
  }[];
}

export interface MTDPCalculation {
  calculatedMTPD: number; // in hours
  triggeringCategory: string;
  triggeringTimeframe: string;
  triggeringRating: number;
  thresholdUsed: number;
  calculationDate: Date;
}

export interface RTODetermination {
  strategicRTO: number; // in hours
  strategicRPO: number; // in hours
  justification: string;
  costConsiderations: string;
  resourceRequirements: string[];
  technologyDependencies: string[];
  approvedBy: string;
  approvedDate: Date;
}

// Primary BIA Record - The main container for organizational unit analysis
export interface BIARecord extends BaseEntity {
  // Basic Information
  startDate: Date;
  endDate?: Date;
  status: BIAStatus;

  // Ownership and Governance
  businessCoordinator: string; // Process owner
  businessContinuityAnalyst: string; // BC analyst responsible
  approver?: string; // Manager who approves

  // Workflow tracking
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Scope and Context
  introduction: string;
  purpose: string;
  scope: string;

  // Associated entities
  locationIds: string[];
  staffIds: string[];
  recoveryStaffIds: string[];
  businessProcessIds: string[];

  // Enhanced BIA Analysis - The "How Critical" Phase
  selectedProcesses: {
    processId: string;
    processName: string;
    processOwner: string;
    selectionReason: string;
  }[];

  impactAnalysis: {
    processId: string;
    analysisMatrix: ImpactAnalysisMatrix[];
    mtpdCalculation: MTDPCalculation;
    rtoRpoDetermination: RTODetermination;
    keyDependencies: string[];
    recoveryPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  }[];

  // Consolidation
  consolidationId?: string;

  // Audit trail
  workflowHistory: BIAWorkflowEvent[];
}

export interface BIAWorkflowEvent {
  id: string;
  action: BIAAction;
  performedBy: string;
  performedAt: Date;
  comments?: string;
  fromStatus: BIAStatus;
  toStatus: BIAStatus;
}

// Location Management
export interface Location extends BaseEntity {
  address: string;
  locationType: 'Primary Office' | 'Branch Office' | 'Data Center' | 'Warehouse' | 'Remote Site' | 'Other';
  capacity: number;
  isOperational: boolean;
  emergencyContacts: {
    name: string;
    role: string;
    phone: string;
    email: string;
  }[];
}

// Staff Management
export interface Staff extends BaseEntity {
  employeeId: string;
  role: string;
  department: string;
  skills: string[];
  isKeyPersonnel: boolean;
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
  };
  backupPersonnel: string[];
}

// Products & Services (outputs of business processes)
export interface ProductService extends BaseEntity {
  type: 'Product' | 'Service';
  customerSegments: string[];
  revenueContribution: number;
  isCustomerFacing: boolean;
  regulatoryRequirements: string[];
  supportingProcessIds: string[];
}

// Time Intervals for Impact Assessment
export type TimeInterval = '15m' | '1h' | '4h' | '8h' | '1d' | '3d' | '1w' | '2w' | '1m';

// Impact Categories
export type ImpactCategory = 'Financial' | 'Operational' | 'Legal' | 'Reputational' | 'Regulatory' | 'Customer' | 'Environmental';

// Impact Severity Levels
export type ImpactSeverity = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

// Impact Assessment Grid
export type ImpactAssessmentGrid = {
  [timeInterval in TimeInterval]: {
    [category in ImpactCategory]: {
      severity: ImpactSeverity;
      description: string;
      quantitativeValue?: number; // For financial impacts
    }
  }
}

// Peak Times and Critical Deadlines
export interface PeakTime {
  name: string;
  description: string;
  timeframe: string;
  additionalImpact: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Ad-hoc';
}

export interface CriticalDeadline {
  name: string;
  description: string;
  deadline: string;
  consequences: string;
  type: 'Regulatory' | 'Contractual' | 'Operational' | 'Financial';
  isRecurring: boolean;
}

// Impact Assessment Types (Updated)
export interface ImpactLevel {
  timeframe: string; // e.g., "1 hour", "4 hours", "1 day", "3 days", "1 week"
  financial: {
    directCosts: number;
    revenueLoss: number;
    regulatoryFines: number;
    description: string;
  };
  operational: {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    affectedProcesses: string[];
  };
  reputational: {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    customerImpact: string;
    mediaRisk: string;
  };
  regulatory: {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    complianceRisk: string;
  };
}

export interface ImpactAnalysis {
  impactLevels: ImpactLevel[];
  mtpd: string; // Maximum Tolerable Period of Disruption
  mtpdRationale: string;
}

// Resource Dependencies
export interface BasicStaffRequirement {
  minimumCount: number;
  requiredSkills: string[];
  keyPersonnel: {
    name: string;
    role: string;
    isEssential: boolean;
    backupPersonnel?: string[];
  }[];
}

export interface ITSystemDependency {
  systemName: string;
  systemType: 'Application' | 'Database' | 'Network' | 'Infrastructure';
  criticality: 'Essential' | 'Important' | 'Useful';
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  vendor?: string;
  description: string;
}

export interface VendorDependency {
  vendorName: string;
  serviceProvided: string;
  criticality: 'Essential' | 'Important' | 'Useful';
  contractualSLA?: string;
  alternativeOptions: string[];
  contactInfo: {
    primary: string;
    emergency: string;
  };
}

export interface FacilityDependency {
  facilityName: string;
  location: string;
  facilityType: 'Primary Office' | 'Data Center' | 'Warehouse' | 'Retail' | 'Other';
  criticality: 'Essential' | 'Important' | 'Useful';
  capacity: string;
  alternativeOptions: string[];
}

// Enhanced Business Process (The operational core)
export interface BusinessProcess extends BaseEntity {
  // Association with BIA Record
  biaRecordId: string;

  // Identification & Ownership
  processOwner: string;
  processType: 'Core' | 'Supporting' | 'Management';

  // Products & Services Link
  productServiceIds: string[]; // Links to Products & Services this process supports

  // Impact Assessment
  impactAssessmentGrid: ImpactAssessmentGrid;

  // Time Sensitivities
  peakTimes: PeakTime[];
  criticalDeadlines: CriticalDeadline[];

  // Recovery Objectives (derived from impact analysis)
  mtd: string; // Maximum Tolerable Downtime
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  mbco: string; // Minimum Business Continuity Objective

  // Dependencies (with RTO tracking for gap analysis)
  dependencies: ProcessDependency[];

  // Resources (comprehensive resource quantification)
  staffRequirements: StaffRequirement;
  applicationRequirements: ApplicationRequirement[];
  itInfrastructureRequirements: ITInfrastructureRequirement[];
  vitalRecords: VitalRecord[];

  // Single Points of Failure Assessment
  spofAssessment: SPOFAssessment;

  // Calculated fields
  criticalityScore: number; // Auto-calculated based on impact analysis
  priorityRank: number; // Auto-calculated for recovery prioritization

  // Workflow status
  isComplete: boolean;
  lastReviewedAt?: Date;
  reviewedBy?: string;
}

// Process Dependencies with RTO tracking
export interface ProcessDependency {
  id: string;
  dependencyType: 'Upstream Process' | 'Downstream Process' | 'External System' | 'Third Party Service';
  name: string;
  description: string;
  criticality: 'Essential' | 'Important' | 'Useful';
  dependencyRTO: string; // RTO of the dependency
  potentialImpact: string;
  alternativeOptions: string[];
  contactInfo?: {
    primary: string;
    emergency: string;
  };
}

// Enhanced Staff Requirements
export interface StaffRequirement {
  minimumStaffCount: number;
  staffByTimeframe: {
    [timeInterval in TimeInterval]?: number;
  };
  requiredSkills: string[];
  keyPersonnel: {
    staffId: string;
    name: string;
    role: string;
    isEssential: boolean;
    backupPersonnel: string[];
    uniqueKnowledge: string[];
  }[];
  trainingRequirements: string[];
}

// Application & Software Requirements
export interface ApplicationRequirement {
  id: string;
  name: string;
  vendor: string;
  version: string;
  criticality: 'Essential' | 'Important' | 'Useful';
  desiredRTO: string;
  desiredRPO: string;
  licenseInfo: string;
  backupLocation: string;
  alternativeOptions: string[];
}

// IT Infrastructure Requirements
export interface ITInfrastructureRequirement {
  id: string;
  name: string;
  type: 'Server' | 'Network' | 'Storage' | 'Security' | 'Communication' | 'Other';
  criticality: 'Essential' | 'Important' | 'Useful';
  specifications: string;
  location: string;
  desiredRTO: string;
  backupOptions: string[];
  vendor?: string;
}

// Vital Records
export interface VitalRecord {
  id: string;
  name: string;
  type: 'Electronic' | 'Physical' | 'Both';
  format: string;
  location: string;
  backupLocation: string;
  retentionPeriod: string;
  accessRequirements: string;
  criticality: 'Essential' | 'Important' | 'Useful';
  lastBackupDate?: Date;
}

// Single Point of Failure Assessment
export interface SPOFAssessment {
  hasKeyPersonDependency: boolean;
  keyPersonDetails?: string;

  hasUndocumentedProcesses: boolean;
  undocumentedProcessDetails?: string;

  hasSingleVendorDependency: boolean;
  singleVendorDetails?: string;

  hasUnprotectedData: boolean;
  unprotectedDataDetails?: string;

  hasHardwareSpof: boolean;
  hardwareSpofDetails?: string;

  otherSpofs: {
    category: string;
    description: string;
    impact: string;
    mitigation: string;
  }[];

  overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationPlan: string;
}

// Department-level BIA (Strategic overview)
export interface Department extends BaseEntity {
  // Identification & Ownership
  departmentHead: string;
  bcmChampion: string;
  departmentMission: string;

  // Linked Processes (calculated from Process entities)
  processIds: string[];

  // Aggregated Resource Summary (auto-calculated)
  totalStaff?: number;
  totalApplications?: number;
  totalVendors?: number;

  // Process Summary (auto-calculated)
  processCount?: number;
  criticalProcessCount?: number;
  averageCriticality?: number;

  // High-level Impact Summary
  strategicImpact?: string;

  // Calculated Recovery Objectives (derived from constituent processes)
  effectiveRTO?: string; // Minimum (most stringent) RTO among processes
  effectiveMTPD?: string; // Maximum tolerable period of disruption

  // Aggregated Resources (auto-calculated from processes)
  aggregatedResources?: {
    totalCriticalStaff: number;
    keyApplications: string[];
    criticalVendors: string[];
    keyRoles: string[];
    facilitiesRequired: string[];
  };
}

// Service-level BIA (Customer-facing lens)
export interface Service extends BaseEntity {
  // Identification & Ownership
  serviceOwner: string;
  customerSegments: string[];
  
  // Service Level Agreements
  slas: {
    metric: string;
    target: string;
    penalty: string;
  }[];
  
  // Linked Underlying Processes
  requiredProcessIds: string[]; // Process IDs required for this service
  
  // Customer Communication
  communicationRequirements: {
    channels: string[];
    timeline: string;
    keyMessages: string[];
    escalationCriteria: string;
  };
  
  // Calculated Service Objectives (derived from underlying processes)
  effectiveRTO: string; // Longest RTO among required processes
  effectiveRPO: string; // Longest RPO among required processes
  
  // Service-specific metrics
  revenueImpact: number;
  customerCount: number;
  regulatoryRequirements: string[];
}

// BIA Configuration and Settings
export interface BIAConfiguration {
  organization: {
    name: string;
    industry: string;
    size: string;
  };
  impactCategories: {
    financial: {
      thresholds: {
        low: number;
        medium: number;
        high: number;
        critical: number;
      };
      currency: string;
    };
    timeframes: string[]; // Standard timeframes for impact assessment
  };
  recoveryObjectives: {
    rtoOptions: string[];
    rpoOptions: string[];
  };
}

// BIA Consolidation - Organization-wide strategic view
export interface BIAConsolidation extends BaseEntity {
  // Consolidation metadata
  consolidationPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Included BIA Records
  includedBIARecords: string[];

  // Strategic overrides by senior management
  strategicOverrides: {
    processId: string;
    originalRTO: string;
    overriddenRTO: string;
    overriddenBy: string;
    overrideReason: string;
    overrideDate: Date;
  }[];

  // Organization-wide risk assessment
  systemicRisks: {
    riskType: 'Technology' | 'Vendor' | 'Location' | 'Skills' | 'Regulatory';
    description: string;
    affectedProcesses: string[];
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigationStrategy: string;
    owner: string;
    targetDate: Date;
  }[];

  // Executive summary
  executiveSummary: {
    totalProcessesAnalyzed: number;
    criticalProcessCount: number;
    averageRTO: string;
    totalRecoveryStaffRequired: number;
    estimatedRecoveryCost: number;
    complianceStatus: 'Compliant' | 'Partially Compliant' | 'Non-Compliant';
    keyRecommendations: string[];
  };

  // Approval and sign-off
  approvedBy: string;
  approvedAt?: Date;
  nextReviewDate: Date;
}

// Configurable Tab System
export interface BIATabConfiguration {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from Heroicons
  isRequired: boolean;
  isEnabled: boolean;
  order: number;
  component: string; // Component name to render
  validationRules: {
    requiredFields: string[];
    customValidation?: string; // Custom validation function name
  };
  permissions: {
    canView: string[]; // User roles that can view this tab
    canEdit: string[]; // User roles that can edit this tab
  };
}

export interface BIAWorkflowConfiguration {
  id: string;
  name: string;
  description: string;
  version: string;
  isDefault: boolean;
  tabs: BIATabConfiguration[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Default BIA Workflow Configuration
export const DEFAULT_BIA_WORKFLOW: BIAWorkflowConfiguration = {
  id: 'default-bia-workflow',
  name: 'Standard ISO 22301 BIA Workflow',
  description: 'Default workflow following ISO 22301 requirements',
  version: '1.0',
  isDefault: true,
  tabs: [
    {
      id: 'bia-details',
      name: 'BIA Details',
      description: 'Basic information and scope definition',
      icon: 'DocumentTextIcon',
      isRequired: true,
      isEnabled: true,
      order: 1,
      component: 'BIADetailsForm',
      validationRules: {
        requiredFields: ['name', 'description', 'businessCoordinator', 'businessContinuityAnalyst']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'introduction',
      name: 'Introduction',
      description: 'Purpose, scope, and context',
      icon: 'InformationCircleIcon',
      isRequired: true,
      isEnabled: true,
      order: 2,
      component: 'IntroductionForm',
      validationRules: {
        requiredFields: ['introduction', 'purpose', 'scope']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'locations',
      name: 'Locations',
      description: 'Physical and operational sites',
      icon: 'BuildingOfficeIcon',
      isRequired: true,
      isEnabled: true,
      order: 3,
      component: 'LocationSelector',
      validationRules: {
        requiredFields: ['primaryLocation']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'staff-list',
      name: 'Staff List',
      description: 'Key personnel and roles',
      icon: 'UsersIcon',
      isRequired: true,
      isEnabled: true,
      order: 4,
      component: 'PeopleSelector',
      validationRules: {
        requiredFields: ['keyPersonnel']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'recovery-staff',
      name: 'Recovery Staff',
      description: 'Designated recovery team members',
      icon: 'UserGroupIcon',
      isRequired: true,
      isEnabled: true,
      order: 5,
      component: 'RecoveryStaffForm',
      validationRules: {
        requiredFields: ['recoveryTeamLead']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'processes',
      name: 'Processes',
      description: 'Business process analysis and impact assessment',
      icon: 'CogIcon',
      isRequired: true,
      isEnabled: true,
      order: 6,
      component: 'ProcessesForm',
      validationRules: {
        requiredFields: ['businessProcesses', 'impactAssessment']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    },
    {
      id: 'finish',
      name: 'Finish',
      description: 'Review and submit for approval',
      icon: 'CheckCircleIcon',
      isRequired: true,
      isEnabled: true,
      order: 7,
      component: 'FinishForm',
      validationRules: {
        requiredFields: ['finalReview']
      },
      permissions: {
        canView: ['analyst', 'coordinator', 'manager'],
        canEdit: ['analyst', 'coordinator']
      }
    }
  ],
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Analysis Results and Reports
export interface BIAAnalysisResult {
  generatedAt: Date;
  biaRecordId?: string; // If analysis is for a specific BIA
  consolidationId?: string; // If analysis is for consolidation

  summary: {
    totalProcesses: number;
    criticalProcesses: number;
    totalDepartments: number;
    totalServices: number;
    averageRTO: string;
    averageMTD: string;
  };

  criticalityRanking: {
    processId: string;
    processName: string;
    criticalityScore: number;
    rto: string;
    mtd: string;
    department: string;
    biaRecordId: string;
  }[];

  riskAreas: {
    category: string;
    description: string;
    affectedProcesses: string[];
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    recommendedActions: string[];
  }[];

  recoveryPriorities: {
    priority: number;
    processId: string;
    processName: string;
    rto: string;
    dependencies: string[];
    estimatedRecoveryTime: string;
  }[];

  complianceGaps: {
    requirement: string;
    currentStatus: string;
    gap: string;
    recommendedAction: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
}
