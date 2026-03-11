// Crisis Management Playbook Types for BSE

// ============================================
// ENUMS
// ============================================

export type PlaybookStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'RETIRED';
export type PlaybookSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PlaybookCategory = 
  | 'TRADING_SYSTEM' 
  | 'CLEARING_SETTLEMENT' 
  | 'MARKET_DATA' 
  | 'MEMBER_CONNECTIVITY'
  | 'CYBER_ATTACK' 
  | 'DATA_BREACH' 
  | 'INFRASTRUCTURE' 
  | 'REGULATORY'
  | 'INSIDER_THREAT'
  | 'NATURAL_DISASTER';

export type RACIRole = 'RESPONSIBLE' | 'ACCOUNTABLE' | 'CONSULTED' | 'INFORMED';
export type PhaseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type CommunicationChannel = 'TEAMS' | 'WHATSAPP' | 'SMS' | 'PHONE' | 'EMAIL' | 'SEBI_PORTAL';
export type StakeholderType = 'INTERNAL' | 'EXTERNAL' | 'REGULATORY' | 'VENDOR' | 'MEMBER' | 'MEDIA';

// ============================================
// HEADER & METADATA
// ============================================

export interface PlaybookMetadata {
  id: string;
  name: string;
  version: string;
  status: PlaybookStatus;
  severity: PlaybookSeverity;
  category: PlaybookCategory;
  description: string;
  owner: TeamMember;
  reviewers: TeamMember[];
  approvedBy?: TeamMember;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastTestedAt?: string;
  nextReviewDate?: string;
  estimatedDuration: string;
  changeHistory: ChangeHistoryEntry[];
}

export interface ChangeHistoryEntry {
  id: string;
  version: string;
  changedBy: string;
  changedAt: string;
  changeType: 'CREATED' | 'UPDATED' | 'REVIEWED' | 'APPROVED' | 'TESTED';
  changeDescription: string;
}

// ============================================
// SCOPE & ACTIVATION
// ============================================

export interface ActivationCriteria {
  id: string;
  name: string;
  description: string;
  triggerType: 'AUTOMATIC' | 'MANUAL' | 'THRESHOLD';
  conditions: TriggerCondition[];
  thresholds?: ActivationThreshold[];
}

export interface TriggerCondition {
  id: string;
  source: string; // e.g., "SIEM Alert", "Monitoring System", "User Report"
  condition: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ActivationThreshold {
  id: string;
  metric: string; // e.g., "Systems Affected", "Users Impacted", "Revenue Impact"
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'BETWEEN';
  value: number;
  valueMax?: number;
  unit: string;
}

export interface PlaybookScope {
  activationCriteria: ActivationCriteria[];
  affectedSystems: LinkedAsset[];
  affectedProcesses: LinkedProcess[];
  impactAssessment: ImpactAssessmentLink;
  linkedBIAs: LinkedBIA[];
  linkedRiskAssessments: LinkedRiskAssessment[];
  linkedDRPlans: LinkedDRPlan[];
  linkedIRPs: LinkedIRP[];
}

// ============================================
// MODULE LINKING
// ============================================

export interface LinkedBIA {
  id: string;
  name: string;
  department: string;
  criticalityTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  rto: string;
  rpo: string;
  mtpd: string;
  criticalProcesses: string[];
}

export interface LinkedRiskAssessment {
  id: string;
  name: string;
  riskCategory: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatScenarios: string[];
  controls: string[];
}

export interface LinkedDRPlan {
  id: string;
  name: string;
  siteType: 'HOT' | 'WARM' | 'COLD';
  rto: string;
  rpo: string;
  recoveryProcedures: string[];
  runbookIds: string[];
}

export interface LinkedIRP {
  id: string;
  name: string;
  scenarioType: string;
  status: string;
  lastTested?: string;
}

export interface LinkedAsset {
  id: string;
  name: string;
  type: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
}

export interface LinkedProcess {
  id: string;
  name: string;
  department: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rto: string;
}

export interface ImpactAssessmentLink {
  financialImpact: string;
  operationalImpact: string;
  reputationalImpact: string;
  regulatoryImpact: string;
  customerImpact: string;
}

// ============================================
// TEAM & RACI MATRIX
// ============================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  whatsapp?: string;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'ON_LEAVE';
  isBackup?: boolean;
  backupFor?: string;
}

export interface RACIAssignment {
  activity: string;
  responsible: TeamMember[];
  accountable: TeamMember;
  consulted: TeamMember[];
  informed: TeamMember[];
}

export interface CrisisTeam {
  crisisCommander: TeamMember;
  deputyCommander?: TeamMember;
  technicalLead: TeamMember;
  communicationsLead: TeamMember;
  businessLead: TeamMember;
  regulatoryLiaison?: TeamMember;
  legalCounsel?: TeamMember;
  hrLead?: TeamMember;
  externalLiaisons: TeamMember[];
  coreTeam: TeamMember[];
  extendedTeam: TeamMember[];
  raciMatrix: RACIAssignment[];
}

// ============================================
// RESPONSE PHASES
// ============================================

export interface PlaybookPhase {
  id: string;
  order: number;
  name: string;
  description: string;
  estimatedDuration: string;
  status: PhaseStatus;
  steps: PlaybookStep[];
  checklistItems: ChecklistItem[];
  decisionPoints: DecisionPoint[];
  escalationTriggers: EscalationTrigger[];
}

export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  detailedInstructions?: string;
  responsibleRole: string;
  estimatedTime: string;
  isRequired: boolean;
  requiresEvidence: boolean;
  evidenceType?: 'SCREENSHOT' | 'LOG' | 'DOCUMENT' | 'APPROVAL' | 'OTHER';
  linkedRunbook?: string;
  linkedDRPlan?: string;
  automationAvailable: boolean;
  automationScript?: string;
  dependencies: string[]; // step IDs
  outputs: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  isRequired: boolean;
  order: number;
  category: string;
}

export interface DecisionPoint {
  id: string;
  question: string;
  description: string;
  options: DecisionOption[];
  defaultOption?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  nextPhaseId?: string;
  nextStepId?: string;
  escalationRequired: boolean;
}

export interface EscalationTrigger {
  id: string;
  condition: string;
  threshold?: string;
  escalateTo: TeamMember;
  notificationChannels: CommunicationChannel[];
  autoEscalate: boolean;
  timeoutMinutes?: number;
}

// ============================================
// COMMUNICATION PLAN
// ============================================

export interface CommunicationPlan {
  internalNotifications: NotificationTemplate[];
  executiveBriefings: BriefingTemplate[];
  regulatoryReporting: RegulatoryTemplate[];
  memberCommunications: MemberTemplate[];
  mediaPR: MediaTemplate[];
  vendorNotifications: VendorTemplate[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  audience: StakeholderType;
  audienceList: TeamMember[];
  channel: CommunicationChannel;
  triggerPhase: string;
  triggerCondition: string;
  subject: string;
  body: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  requiresAcknowledgment: boolean;
  escalateIfNoAck: boolean;
  escalationTimeoutMinutes?: number;
}

export interface BriefingTemplate {
  id: string;
  name: string;
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'ON_DEMAND';
  audience: TeamMember[];
  format: 'VERBAL' | 'WRITTEN' | 'DASHBOARD' | 'PRESENTATION';
  contentSections: string[];
  deliveryMethod: CommunicationChannel;
}

export interface RegulatoryTemplate {
  id: string;
  regulator: string; // e.g., "SEBI", "RBI", "NSE"
  reportType: string;
  mandatoryTimeline: string; // e.g., "Within 6 hours", "Within 24 hours"
  reportingPortal?: string;
  contactPerson: TeamMember;
  templateFields: string[];
  attachmentsRequired: string[];
}

export interface MemberTemplate {
  id: string;
  name: string;
  memberCategory: 'ALL' | 'AFFECTED' | 'SPECIFIC';
  channel: CommunicationChannel;
  subject: string;
  body: string;
  includeTechnicalDetails: boolean;
}

export interface MediaTemplate {
  id: string;
  name: string;
  type: 'HOLDING_STATEMENT' | 'PRESS_RELEASE' | 'FAQ' | 'SOCIAL_MEDIA';
  approvalRequired: boolean;
  approver: TeamMember;
  content: string;
}

export interface VendorTemplate {
  id: string;
  vendorCategory: string;
  contactList: TeamMember[];
  notificationType: 'ALERT' | 'SUPPORT_REQUEST' | 'ESCALATION';
  slaReference?: string;
}

// ============================================
// RESOURCES & DEPENDENCIES
// ============================================

export interface PlaybookResources {
  drPlans: LinkedDRPlan[];
  runbooks: Runbook[];
  vendorContacts: VendorContact[];
  regulatoryContacts: RegulatoryContact[];
  templates: DocumentTemplate[];
  tools: RecoveryTool[];
  alternateLocations: AlternateLocation[];
}

export interface Runbook {
  id: string;
  name: string;
  description: string;
  linkedDRPlan?: string;
  linkedPhase?: string;
  documentUrl?: string;
  lastUpdated: string;
  owner: string;
}

export interface VendorContact {
  id: string;
  vendorName: string;
  vendorType: string;
  primaryContact: TeamMember;
  escalationContact?: TeamMember;
  supportNumber: string;
  supportEmail: string;
  slaDetails: string;
  contractReference?: string;
}

export interface RegulatoryContact {
  id: string;
  regulator: string;
  department: string;
  primaryContact: TeamMember;
  reportingPortal?: string;
  emergencyNumber?: string;
  reportingTimelines: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'INCIDENT_LOG' | 'NOTIFICATION' | 'PIR' | 'REGULATORY_REPORT' | 'FORM' | 'CHECKLIST';
  description: string;
  templateUrl?: string;
  lastUpdated: string;
}

export interface RecoveryTool {
  id: string;
  name: string;
  type: string;
  purpose: string;
  accessUrl?: string;
  credentials?: string; // Reference to secure vault
  documentation?: string;
}

export interface AlternateLocation {
  id: string;
  name: string;
  type: 'HOT_SITE' | 'WARM_SITE' | 'COLD_SITE' | 'WORK_FROM_HOME';
  address: string;
  capacity: number;
  activationTime: string;
  contactPerson: TeamMember;
  facilities: string[];
}

// ============================================
// EXECUTION & TRACKING
// ============================================

export interface PlaybookExecution {
  id: string;
  playbookId: string;
  playbookVersion: string;
  incidentId: string;
  incidentName: string;
  status: 'INITIATED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'ABORTED';
  startedAt: string;
  startedBy: TeamMember;
  endedAt?: string;
  currentPhase: string;
  completedPhases: string[];
  completedSteps: string[];
  timeline: TimelineEvent[];
  notifications: NotificationLog[];
  decisions: DecisionLog[];
  escalations: EscalationLog[];
  attachments: AttachmentLog[];
  metrics: ExecutionMetrics;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: 'PHASE_START' | 'PHASE_END' | 'STEP_COMPLETE' | 'DECISION' | 'ESCALATION' | 'NOTIFICATION' | 'NOTE' | 'ATTACHMENT';
  title: string;
  description: string;
  performedBy: string;
  phaseId?: string;
  stepId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  templateId: string;
  channel: CommunicationChannel;
  recipients: string[];
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'ACKNOWLEDGED';
  acknowledgedBy?: string[];
  acknowledgedAt?: string[];
}

export interface DecisionLog {
  id: string;
  timestamp: string;
  decisionPointId: string;
  question: string;
  selectedOption: string;
  decidedBy: string;
  rationale?: string;
}

export interface EscalationLog {
  id: string;
  timestamp: string;
  triggerId: string;
  reason: string;
  escalatedTo: string;
  escalatedBy: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface AttachmentLog {
  id: string;
  timestamp: string;
  name: string;
  type: string;
  uploadedBy: string;
  stepId?: string;
  phaseId?: string;
  url: string;
}

export interface ExecutionMetrics {
  totalDuration: number; // in minutes
  phaseTimings: Record<string, number>;
  stepsCompleted: number;
  totalSteps: number;
  escalationsTriggered: number;
  notificationsSent: number;
  decisionsLogged: number;
  rtoAchieved: boolean;
  rpoAchieved: boolean;
  actualRTO?: string;
  actualRPO?: string;
}

// ============================================
// POST-INCIDENT REPORT
// ============================================

export interface PostIncidentReport {
  id: string;
  executionId: string;
  incidentId: string;
  incidentName: string;
  playbookUsed: string;
  generatedAt: string;
  generatedBy: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED';

  executiveSummary: string;
  incidentDescription: string;
  timeline: TimelineEvent[];

  rootCauseAnalysis: {
    primaryCause: string;
    contributingFactors: string[];
    categoryClassification: string;
  };

  impactAssessment: {
    systemsAffected: string[];
    usersAffected: number;
    financialImpact: string;
    reputationalImpact: string;
    regulatoryImplications: string;
    downtime: string;
  };

  responseEffectiveness: {
    playbookAdherence: number; // percentage
    rtoTarget: string;
    rtoActual: string;
    rpoTarget: string;
    rpoActual: string;
    escalationsRequired: number;
    communicationEffectiveness: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  };

  lessonsLearned: {
    whatWorkedWell: string[];
    areasForImprovement: string[];
    playbookUpdatesRequired: string[];
  };

  recommendations: Recommendation[];

  regulatoryReporting: {
    regulatorsNotified: string[];
    reportsFiled: string[];
    pendingReports: string[];
    complianceStatus: 'COMPLIANT' | 'PENDING' | 'NON_COMPLIANT';
  };

  approvals: {
    reviewedBy?: TeamMember;
    reviewedAt?: string;
    approvedBy?: TeamMember;
    approvedAt?: string;
    comments?: string;
  };
}

export interface Recommendation {
  id: string;
  category: 'PROCESS' | 'TECHNOLOGY' | 'PEOPLE' | 'PLAYBOOK' | 'TRAINING';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  owner: string;
  targetDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

// ============================================
// COMPLETE PLAYBOOK
// ============================================

export interface CrisisPlaybook {
  metadata: PlaybookMetadata;
  scope: PlaybookScope;
  team: CrisisTeam;
  phases: PlaybookPhase[];
  communicationPlan: CommunicationPlan;
  resources: PlaybookResources;
  executions?: PlaybookExecution[];
}

