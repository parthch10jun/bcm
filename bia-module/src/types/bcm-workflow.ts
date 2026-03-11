/**
 * BCM Integrated Workflow Types
 * 
 * Defines the connected lifecycle: BIA → Risk Assessment → BCP → Testing
 * With comprehensive upstream and downstream dependency tracking
 */

// ============================================
// DEPENDENCY CLASSIFICATION
// ============================================

export type DependencyDirection = 'UPSTREAM' | 'DOWNSTREAM';
export type DependencyType = 'REQUIRED' | 'IMPORTANT' | 'OPTIONAL';
export type DependencyCategory = 
  | 'PEOPLE'
  | 'APPLICATION'
  | 'TECHNOLOGY_ASSET'
  | 'VENDOR'
  | 'FACILITY'
  | 'DATA'
  | 'SUPPLIER_PROCESS'
  | 'INTERNAL_PROCESS'
  | 'CUSTOMER'
  | 'REGULATORY'
  | 'SLA_REPORT';

// Base dependency interface
export interface BaseDependency {
  id: string;
  name: string;
  description?: string;
  direction: DependencyDirection;
  category: DependencyCategory;
  dependencyType: DependencyType;
  rtoHours?: number;
  rpoHours?: number;
  isCritical: boolean;
  isSinglePointOfFailure: boolean;
  alternateOption?: string;
  notes?: string;
}

// ============================================
// UPSTREAM DEPENDENCIES (What the process needs)
// ============================================

export interface UpstreamDependency extends BaseDependency {
  direction: 'UPSTREAM';
}

export interface PeopleDependency extends UpstreamDependency {
  category: 'PEOPLE';
  personId?: number;
  role: string;
  skills: string[];
  minimumRequired: number;
  backupPersonId?: number;
}

export interface ApplicationDependency extends UpstreamDependency {
  category: 'APPLICATION';
  applicationId?: number;
  applicationRto: number;
  applicationRpo: number;
  recoveryCapability: string;
}

export interface TechnologyAssetDependency extends UpstreamDependency {
  category: 'TECHNOLOGY_ASSET';
  assetId?: number;
  assetType: string;
  assetRto: number;
  assetRpo: number;
}

export interface VendorDependency extends UpstreamDependency {
  category: 'VENDOR';
  vendorId?: number;
  serviceProvided: string;
  contractedRto?: number;
  contractedRpo?: number;
  contactInfo?: string;
}

export interface FacilityDependency extends UpstreamDependency {
  category: 'FACILITY';
  locationId?: number;
  locationType: string;
  capacity: number;
  alternateLocation?: string;
}

export interface DataDependency extends UpstreamDependency {
  category: 'DATA';
  vitalRecordId?: number;
  dataClassification: string;
  retentionPeriod?: string;
  backupFrequency?: string;
}

export interface SupplierProcessDependency extends UpstreamDependency {
  category: 'SUPPLIER_PROCESS';
  supplierProcessId?: number;
  supplierName: string;
  processName: string;
  slaCommitment?: string;
}

// ============================================
// DOWNSTREAM DEPENDENCIES (Who depends on this)
// ============================================

export interface DownstreamDependency extends BaseDependency {
  direction: 'DOWNSTREAM';
}

export interface InternalProcessDependency extends DownstreamDependency {
  category: 'INTERNAL_PROCESS';
  processId?: number;
  processName: string;
  processRto: number;
  impactIfUnavailable: string;
}

export interface CustomerDependency extends DownstreamDependency {
  category: 'CUSTOMER';
  customerSegment: string;
  customerCount?: number;
  revenueImpact?: number;
  slaCommitments: string[];
}

export interface RegulatoryDependency extends DownstreamDependency {
  category: 'REGULATORY';
  regulatoryBody: string;
  requirement: string;
  complianceDeadline?: string;
  penaltyForNonCompliance?: string;
}

export interface SLAReportDependency extends DownstreamDependency {
  category: 'SLA_REPORT';
  reportName: string;
  frequency: string;
  deadline: string;
  recipients: string[];
  penaltyForMiss?: string;
}

// Union types for all dependencies
export type UpstreamDependencyUnion = 
  | PeopleDependency 
  | ApplicationDependency 
  | TechnologyAssetDependency 
  | VendorDependency 
  | FacilityDependency 
  | DataDependency 
  | SupplierProcessDependency;

export type DownstreamDependencyUnion = 
  | InternalProcessDependency 
  | CustomerDependency 
  | RegulatoryDependency 
  | SLAReportDependency;

export type AnyDependency = UpstreamDependencyUnion | DownstreamDependencyUnion;

// ============================================
// ENHANCED BIA RECORD WITH DEPENDENCIES
// ============================================

export interface BIABusinessFunction {
  id: string;
  name: string;
  description: string;
  owner: string;
  department: string;
}

export interface BIACriticalActivity {
  id: string;
  name: string;
  description: string;
  priority: number;
  rtoHours: number;
  rpoHours: number;
  mtdHours: number;
  peakPeriods: string[];
}

export interface BIAImpactAssessment {
  financial: {
    hourlyLoss: number;
    dailyLoss: number;
    weeklyLoss: number;
    description: string;
  };
  operational: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    affectedProcessCount: number;
  };
  regulatory: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    complianceRisks: string[];
  };
  safety: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    safetyRisks: string[];
  };
  reputational: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    mediaExposureRisk: string;
  };
}

export interface EnhancedBIARecord {
  id: number;
  biaName: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

  // Business Function & Activities
  businessFunction: BIABusinessFunction;
  criticalActivities: BIACriticalActivity[];

  // Recovery Objectives
  rtoHours: number;
  rpoHours: number;
  mtdHours: number;

  // Impact Assessment
  impactAssessment: BIAImpactAssessment;

  // Dependencies
  upstreamDependencies: UpstreamDependencyUnion[];
  downstreamDependencies: DownstreamDependencyUnion[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

// ============================================
// RISK ASSESSMENT LINKED TO BIA
// ============================================

export interface DependencyRisk {
  id: string;
  dependencyId: string;
  dependencyName: string;
  dependencyCategory: DependencyCategory;
  riskName: string;
  riskDescription: string;

  // Inherent Risk
  inherentLikelihood: 1 | 2 | 3 | 4 | 5;
  inherentImpact: 1 | 2 | 3 | 4 | 5;
  inherentRiskScore: number;
  inherentRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Controls
  existingControls: string[];
  controlEffectiveness: 'INEFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'EFFECTIVE' | 'HIGHLY_EFFECTIVE';

  // Residual Risk
  residualLikelihood: 1 | 2 | 3 | 4 | 5;
  residualImpact: 1 | 2 | 3 | 4 | 5;
  residualRiskScore: number;
  residualRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Mitigation
  mitigationActions: MitigationAction[];
}

export interface MitigationAction {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedDate?: string;
}

export interface LinkedRiskAssessment {
  id: number;
  assessmentName: string;
  biaId: number;
  biaName: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED';

  // Auto-pulled from BIA
  criticalActivities: BIACriticalActivity[];
  rtoHours: number;
  rpoHours: number;
  mtdHours: number;
  upstreamDependencies: UpstreamDependencyUnion[];
  downstreamDependencies: DownstreamDependencyUnion[];

  // Risks created against dependencies
  dependencyRisks: DependencyRisk[];

  // Summary
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  createdAt: string;
  updatedAt: string;
}

// ============================================
// BUSINESS CONTINUITY PLAN (BCP)
// ============================================

export interface BCPStrategy {
  id: string;
  name: string;
  description: string;
  type: 'PREVENTION' | 'MITIGATION' | 'RECOVERY' | 'WORKAROUND';
  targetDependencies: string[]; // dependency IDs
  estimatedCost?: number;
  implementationTime?: string;
}

export interface ResourceRequirement {
  id: string;
  resourceType: 'PERSONNEL' | 'EQUIPMENT' | 'FACILITY' | 'TECHNOLOGY' | 'DATA' | 'VENDOR';
  name: string;
  quantity: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  alternateSource?: string;
}

export interface AlternateSiteStrategy {
  id: string;
  primarySite: string;
  alternateSite: string;
  activationCriteria: string;
  activationTime: string;
  capacity: number;
  equipmentAvailable: string[];
  networkConnectivity: string;
}

export interface ManualWorkaround {
  id: string;
  processName: string;
  workaroundDescription: string;
  maxDuration: string;
  requiredResources: string[];
  limitations: string[];
  procedureSteps: string[];
}

export interface BCPRole {
  id: string;
  roleName: string;
  responsibilities: string[];
  primaryPerson: string;
  backupPerson?: string;
  contactInfo: string;
  authorityLevel: string;
}

export interface CommunicationPlan {
  id: string;
  stakeholderGroup: string;
  communicationMethod: string[];
  frequency: string;
  keyMessages: string[];
  escalationPath: string;
  contactList: { name: string; role: string; contact: string }[];
}

export interface DependencyAssuranceItem {
  id: string;
  dependencyId: string;
  dependencyName: string;
  dependencyCategory: DependencyCategory;
  continuityAction: string;
  isSinglePointOfFailure: boolean;
  alternateOption?: string;
  linkedRiskId?: string;
  linkedMitigationId?: string;
  assuranceStatus: 'NOT_ADDRESSED' | 'PARTIALLY_ADDRESSED' | 'FULLY_ADDRESSED';
}

export interface LinkedBCP {
  id: number;
  bcpName: string;
  biaId: number;
  biaName: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'OUTDATED';
  version: string;

  // Auto-pulled from BIA
  criticalActivities: BIACriticalActivity[];
  rtoHours: number;
  rpoHours: number;
  mtdHours: number;
  upstreamDependencies: UpstreamDependencyUnion[];
  downstreamDependencies: DownstreamDependencyUnion[];

  // Linked Risk Assessments
  linkedRiskAssessments: { id: number; name: string; riskCount: number }[];

  // BCP Sections
  continuityStrategies: BCPStrategy[];
  resourceRequirements: ResourceRequirement[];
  alternateSiteStrategies: AlternateSiteStrategy[];
  manualWorkarounds: ManualWorkaround[];
  rolesAndResponsibilities: BCPRole[];
  communicationPlan: CommunicationPlan[];

  // Dependency Assurance Matrix
  dependencyAssuranceMatrix: DependencyAssuranceItem[];

  // Metadata
  owner: string;
  lastReviewDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TESTING & EXERCISES
// ============================================

export type TestType = 'WALKTHROUGH' | 'TABLETOP' | 'FUNCTIONAL' | 'FULL_SIMULATION';
export type TestStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface PreTestTask {
  id: string;
  taskName: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
  completedDate?: string;
}

export interface ExecutionStep {
  id: string;
  stepNumber: number;
  description: string;
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'SKIPPED';
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface TestEvidence {
  id: string;
  evidenceType: 'SCREENSHOT' | 'DOCUMENT' | 'LOG' | 'VIDEO' | 'PHOTO' | 'OTHER';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface CorrectiveAction {
  id: string;
  issueIdentified: string;
  actionRequired: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  dueDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  completedDate?: string;
  verifiedBy?: string;
}

export interface LinkedTestExercise {
  id: number;
  testName: string;
  testType: TestType;
  bcpId: number;
  bcpName: string;
  biaId: number;
  biaName: string;
  status: TestStatus;

  // Auto-filled from BCP
  scope: string;
  objectivesFromBCP: string[];
  dependenciesBeingTested: DependencyAssuranceItem[];

  // Test Planning
  scheduledDate: string;
  estimatedDuration: string;
  participants: { name: string; role: string }[];
  preTestTasks: PreTestTask[];

  // Execution
  executionSteps: ExecutionStep[];
  actualStartTime?: string;
  actualEndTime?: string;

  // Evidence & Results
  evidenceCapture: TestEvidence[];
  correctiveActions: CorrectiveAction[];

  // Approval
  result?: 'PASSED' | 'PASSED_WITH_ISSUES' | 'FAILED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedDate?: string;
  approvalComments?: string;

  // Linked back to BCP
  lessonsLearned?: string;
  recommendedBCPUpdates?: string[];

  createdAt: string;
  updatedAt: string;
}

// ============================================
// BCM LIFECYCLE DASHBOARD
// ============================================

export interface BCMLifecycleStatus {
  biaId: number;
  biaName: string;
  biaStatus: 'DRAFT' | 'IN_PROGRESS' | 'APPROVED';
  biaCompletionPercentage: number;

  riskAssessmentId?: number;
  riskAssessmentStatus?: 'NOT_STARTED' | 'DRAFT' | 'IN_PROGRESS' | 'APPROVED';
  riskAssessmentCompletionPercentage: number;

  bcpId?: number;
  bcpStatus?: 'NOT_STARTED' | 'DRAFT' | 'APPROVED' | 'ACTIVE';
  bcpCompletionPercentage: number;

  lastTestId?: number;
  lastTestDate?: string;
  lastTestResult?: 'PASSED' | 'PASSED_WITH_ISSUES' | 'FAILED';
  nextTestDueDate?: string;

  overallReadiness: 'NOT_READY' | 'PARTIALLY_READY' | 'READY' | 'VALIDATED';
  singlePointsOfFailure: number;
  unaddressedRisks: number;
  overdueTests: number;
}

export interface DependencyHeatmapItem {
  dependencyId: string;
  dependencyName: string;
  dependencyCategory: DependencyCategory;
  direction: DependencyDirection;
  riskCount: number;
  highestRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isSinglePointOfFailure: boolean;
  hasAlternate: boolean;
  bcpCoverage: 'NONE' | 'PARTIAL' | 'FULL';
  lastTestedDate?: string;
}
