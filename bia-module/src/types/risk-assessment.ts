// Risk Assessment Module - TypeScript Interfaces

// ============================================
// ENUMS
// ============================================

export enum EnablerTypeCode {
  BUILDING = 'BUILDING',
  EQUIPMENT = 'EQUIPMENT',
  TECHNOLOGY = 'TECHNOLOGY',
  PEOPLE = 'PEOPLE',
  VENDOR = 'VENDOR',
  VITAL_RECORD = 'VITAL_RECORD'
}

export enum RiskCategoryCode {
  LOCATION = 'LOCATION',
  ORG_UNIT = 'ORG_UNIT',
  PROCESS = 'PROCESS',
  SUPPLIER = 'SUPPLIER',
  APPLICATION = 'APPLICATION',
  ASSET = 'ASSET',
  PROJECT = 'PROJECT',
  PEOPLE = 'PEOPLE',
  DATA = 'DATA'
}

export enum LikelihoodLevel {
  VERY_UNLIKELY = 'VERY_UNLIKELY',
  UNLIKELY = 'UNLIKELY',
  POSSIBLE = 'POSSIBLE',
  LIKELY = 'LIKELY',
  VERY_LIKELY = 'VERY_LIKELY'
}

export enum RiskImpactLevel {
  NEGLIGIBLE = 'NEGLIGIBLE',
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  SEVERE = 'SEVERE'
}

export enum RiskLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum RiskAssessmentStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

// ============================================
// BASE ENTITY
// ============================================

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDeleted: boolean;
}

// ============================================
// THREAT LIBRARY
// ============================================

export interface ThreatType extends BaseEntity {
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface EnablerType extends BaseEntity {
  code: EnablerTypeCode;
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface Threat extends BaseEntity {
  name: string;
  description?: string;
  threatType?: ThreatType;
  threatTypeId?: number;
  displayOrder?: number;
  isActive: boolean;
  threatEnablerTypes?: ThreatEnablerType[];
}

export interface ThreatEnablerType extends BaseEntity {
  threat?: Threat;
  threatId: number;
  enablerType?: EnablerType;
  enablerTypeId: number;
  impactDescription?: string;
}

// ============================================
// RISK CATEGORY LIBRARY
// ============================================

export interface RiskCategory extends BaseEntity {
  code: RiskCategoryCode;
  name: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  riskCategoryThreats?: RiskCategoryThreat[];
}

export interface RiskCategoryThreat extends BaseEntity {
  riskCategory?: RiskCategory;
  riskCategoryId: number;
  threat?: Threat;
  threatId: number;
  isDefaultSelected: boolean;
}

// ============================================
// RISK ASSESSMENT
// ============================================

export interface RiskAssessment extends BaseEntity {
  assessmentName: string;
  assessmentDescription?: string;
  riskCategory?: RiskCategory;
  riskCategoryId: number;
  contextType: string;
  contextId: number;
  contextName?: string;
  assessmentDate: string;
  assessor?: string;
  reviewer?: string;
  status: RiskAssessmentStatus;
  overallRiskLevel?: RiskLevel;
  overallRiskScore?: number;
  threatAssessments?: ThreatAssessment[];
  riskThreshold?: number;
  completionPercentage?: number;
  currentStep?: number;
}

export interface ThreatAssessment extends BaseEntity {
  riskAssessment?: RiskAssessment;
  riskAssessmentId: number;
  threat?: Threat;
  threatId: number;
  likelihoodLevel: LikelihoodLevel;
  likelihoodScore: number;
  impactLevel: RiskImpactLevel;
  impactScore: number;
  riskLevel: RiskLevel;
  riskScore: number;
  currentControls?: string;
  controlEffectiveness?: string;
  residualRiskLevel?: RiskLevel;
  residualRiskScore?: number;
  mitigationActions?: string;
  mitigationOwner?: string;
  mitigationDeadline?: string;
  notes?: string;
  isSelected?: boolean;
}

// ============================================
// RISK CONTEXT (for RiskContextService)
// ============================================

export interface RiskContextRequest {
  contextType: string;
  contextId: number;
  riskCategoryCode: RiskCategoryCode;
}

export interface RiskContextResponse {
  contextType: string;
  contextId: number;
  contextName: string;
  riskCategory: RiskCategory;
  applicableThreats: Threat[];
  enablerTypes: EnablerType[];
}

// ============================================
// FORM DTOS
// ============================================

export interface CreateThreatRequest {
  name: string;
  description?: string;
  threatTypeId: number;
  displayOrder?: number;
  isActive: boolean;
  enablerTypeIds: number[];
}

export interface UpdateThreatRequest {
  name?: string;
  description?: string;
  threatTypeId?: number;
  displayOrder?: number;
  isActive?: boolean;
  enablerTypeIds?: number[];
}

export interface CreateRiskCategoryThreatRequest {
  riskCategoryId: number;
  threatId: number;
  isDefaultSelected: boolean;
}

export interface CreateRiskAssessmentRequest {
  assessmentName: string;
  assessmentDescription?: string;
  riskCategoryId: number;
  contextType: string;
  contextId: number;
  assessmentDate: string;
  assessor?: string;
  reviewer?: string;
  status: RiskAssessmentStatus;
}

export interface CreateThreatAssessmentRequest {
  riskAssessmentId: number;
  threatId: number;
  likelihoodLevel: LikelihoodLevel;
  likelihoodScore: number;
  impactLevel: RiskImpactLevel;
  impactScore: number;
  currentControls?: string;
  controlEffectiveness?: string;
  residualRiskLevel?: RiskLevel;
  residualRiskScore?: number;
  mitigationActions?: string;
  mitigationOwner?: string;
  mitigationDeadline?: string;
  notes?: string;
}

// ============================================
// UI HELPERS
// ============================================

export const LIKELIHOOD_LABELS: Record<LikelihoodLevel, string> = {
  [LikelihoodLevel.VERY_UNLIKELY]: 'Very Unlikely (1)',
  [LikelihoodLevel.UNLIKELY]: 'Unlikely (2)',
  [LikelihoodLevel.POSSIBLE]: 'Possible (3)',
  [LikelihoodLevel.LIKELY]: 'Likely (4)',
  [LikelihoodLevel.VERY_LIKELY]: 'Very Likely (5)'
};

export const IMPACT_LABELS: Record<RiskImpactLevel, string> = {
  [RiskImpactLevel.NEGLIGIBLE]: 'Negligible (1)',
  [RiskImpactLevel.MINOR]: 'Minor (2)',
  [RiskImpactLevel.MODERATE]: 'Moderate (3)',
  [RiskImpactLevel.MAJOR]: 'Major (4)',
  [RiskImpactLevel.SEVERE]: 'Severe (5)'
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  [RiskLevel.VERY_LOW]: 'Very Low',
  [RiskLevel.LOW]: 'Low',
  [RiskLevel.MEDIUM]: 'Medium',
  [RiskLevel.HIGH]: 'High',
  [RiskLevel.VERY_HIGH]: 'Very High'
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.VERY_LOW]: 'bg-green-100 text-green-700 border-green-200',
  [RiskLevel.LOW]: 'bg-green-100 text-green-700 border-green-200',
  [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [RiskLevel.HIGH]: 'bg-orange-100 text-orange-700 border-orange-200',
  [RiskLevel.VERY_HIGH]: 'bg-red-100 text-red-700 border-red-200'
};

export const STATUS_LABELS: Record<RiskAssessmentStatus, string> = {
  [RiskAssessmentStatus.DRAFT]: 'Draft',
  [RiskAssessmentStatus.IN_PROGRESS]: 'In Progress',
  [RiskAssessmentStatus.UNDER_REVIEW]: 'Under Review',
  [RiskAssessmentStatus.APPROVED]: 'Approved',
  [RiskAssessmentStatus.REJECTED]: 'Rejected',
  [RiskAssessmentStatus.ARCHIVED]: 'Archived'
};

export const STATUS_COLORS: Record<RiskAssessmentStatus, string> = {
  [RiskAssessmentStatus.DRAFT]: 'bg-gray-100 text-gray-700 border-gray-200',
  [RiskAssessmentStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
  [RiskAssessmentStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [RiskAssessmentStatus.APPROVED]: 'bg-green-100 text-green-700 border-green-200',
  [RiskAssessmentStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
  [RiskAssessmentStatus.ARCHIVED]: 'bg-gray-100 text-gray-700 border-gray-200'
};

// ============================================
// VULNERABILITY LIBRARY
// ============================================

export enum VulnerabilityCategory {
  TECHNICAL = 'TECHNICAL',
  PROCESS = 'PROCESS',
  PHYSICAL = 'PHYSICAL',
  HUMAN = 'HUMAN',
  SUPPLIER = 'SUPPLIER'
}

export interface Vulnerability extends BaseEntity {
  vulnerabilityId: string;
  name: string;
  description?: string;
  category: VulnerabilityCategory;
  relatedThreatIds?: number[];
  relatedThreats?: Threat[];
  relatedAssetIds?: number[];
  relatedServiceIds?: number[];
  status: 'ACTIVE' | 'INACTIVE';
}

// ============================================
// RISK LIBRARY
// ============================================

export interface Risk extends BaseEntity {
  riskId: string;
  name: string;
  category: string;
  description?: string;
  causes?: string;
  consequences?: string;
  defaultRiskRating?: RiskLevel;
  status: 'ACTIVE' | 'INACTIVE';
}

// ============================================
// CONTROL LIBRARY
// ============================================

export enum ControlType {
  PREVENTIVE = 'PREVENTIVE',
  DETECTIVE = 'DETECTIVE',
  CORRECTIVE = 'CORRECTIVE',
  DIRECTIVE = 'DIRECTIVE'
}

export enum ControlCategory {
  OPERATIONAL = 'OPERATIONAL',
  TECHNICAL = 'TECHNICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  PHYSICAL = 'PHYSICAL',
  MANAGERIAL = 'MANAGERIAL'
}

export interface Control extends BaseEntity {
  controlId: string;
  name: string;
  description?: string;
  controlType: ControlType;
  controlCategory: ControlCategory;
  effectivenessRating: number; // 1-5 scale
  controlOwner?: string;
  controlOwnerEmail?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_REVIEW';
  frequency?: 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  lastTestDate?: string;
  nextTestDate?: string;
  linkedRisks?: number;
  implementationDate?: string;
  cost?: number;
  effectiveness?: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'NOT_TESTED';
}

// ============================================
// THREAT-VULNERABILITY-RISK MAPPING
// ============================================

export interface ThreatVulnerabilityMapping extends BaseEntity {
  threatId: number;
  threat?: Threat;
  vulnerabilityId: number;
  vulnerability?: Vulnerability;
}

export interface ThreatRiskMapping extends BaseEntity {
  threatId: number;
  threat?: Threat;
  riskId: number;
  risk?: Risk;
}

export interface VulnerabilityRiskMapping extends BaseEntity {
  vulnerabilityId: number;
  vulnerability?: Vulnerability;
  riskId: number;
  risk?: Risk;
}

// ============================================
// TREATMENT PLAN
// ============================================

export enum TreatmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface TreatmentPlan extends BaseEntity {
  threatAssessmentId: number;
  mitigationAction: string;
  description?: string;
  owner?: string;
  startDate?: string;
  dueDate?: string;
  status: TreatmentStatus;
  evidence?: string;
  progressPercent: number;
}

// ============================================
// RESIDUAL RISK CONFIGURATION
// ============================================

export enum ResidualRiskMethod {
  FORMULA_BASED = 'FORMULA_BASED', // Residual = Inherent - Control Effectiveness
  FACTOR_BASED = 'FACTOR_BASED',   // Residual = Inherent × (1 - Control Strength Factor)
  WEIGHTED = 'WEIGHTED'             // Weighted calculation based on multiple factors
}

export interface RiskConfiguration {
  residualRiskMethod: ResidualRiskMethod;
  riskThreshold: number; // Risk appetite threshold
  slaReviewDays: number;
  slaApprovalDays: number;
  slaMitigationDays: number;
  escalationEnabled: boolean;
  escalationHours: number;
}

