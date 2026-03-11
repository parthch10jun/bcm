/**
 * Asset types for Asset Library
 * 
 * IMPORTANT: Asset criticality is INHERITED from processes!
 * An asset is only critical if it supports a critical process.
 */

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RETIRED = 'RETIRED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum CriticalityTier {
  TIER_1 = 'TIER_1',  // Mission Critical (Score >= 32)
  TIER_2 = 'TIER_2',  // Critical (Score >= 24)
  TIER_3 = 'TIER_3',  // Important (Score >= 16)
  TIER_4 = 'TIER_4',  // Standard (Score >= 8)
  TIER_5 = 'TIER_5'   // Non-Critical (Score < 8)
}

export enum DependencyType {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  PREFERRED = 'PREFERRED'
}

/**
 * Asset-level criticality (independent of process inheritance)
 */
export enum AssetCriticality {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface AssetType {
  id: number;
  typeName: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AssetCategory {
  id: number;
  categoryName: string;
  assetTypeId?: number;
  assetTypeName?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Asset {
  id: number;
  assetName: string;
  description?: string;
  status: AssetStatus;
  
  // Type and Category
  assetTypeId?: number;
  assetTypeName?: string;
  categoryId?: number;
  categoryName?: string;
  
  // Location
  locationId?: number;
  locationName?: string;
  
  // Asset Details
  vendor?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  owner?: string;
  technicalContact?: string;
  notes?: string;

  // Recovery Objectives (for BIA dependency gap analysis)
  /**
   * Recovery Time Objective in hours
   * Maximum acceptable time to restore asset after disruption
   */
  rtoHours?: number;

  /**
   * Recovery Point Objective in hours
   * Maximum acceptable data loss window
   */
  rpoHours?: number;

  /**
   * Asset-level criticality: CRITICAL, HIGH, MEDIUM, LOW
   * Independent of inherited process criticality
   */
  assetCriticality?: string;
  
  // Audit Fields
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  
  // Computed Fields (calculated by backend)
  
  /**
   * Inherited criticality from linked processes
   * This is the HIGHEST criticality of any process that depends on this asset
   */
  inheritedCriticality: CriticalityTier;
  
  /**
   * Criticality score (for sorting/filtering)
   */
  criticalityScore: number;
  
  /**
   * Number of processes that depend on this asset
   */
  processCount: number;
  
  /**
   * Number of other assets this asset depends on
   */
  dependencyCount: number;
  
  /**
   * Number of other assets that depend on this asset
   */
  dependentCount: number;
  
  /**
   * Is this asset critical? (Tier 1 or Tier 2)
   */
  isCritical: boolean;
}

export interface CreateAssetRequest {
  assetName: string;
  description?: string;
  status?: AssetStatus;
  assetTypeId?: number;
  categoryId?: number;
  locationId?: number;
  vendor?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  owner?: string;
  technicalContact?: string;
  notes?: string;
  // Recovery objectives
  rtoHours?: number;
  rpoHours?: number;
  assetCriticality?: string;
}

export interface UpdateAssetRequest {
  assetName?: string;
  description?: string;
  status?: AssetStatus;
  assetTypeId?: number;
  categoryId?: number;
  locationId?: number;
  vendor?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  owner?: string;
  technicalContact?: string;
  notes?: string;
  // Recovery objectives
  rtoHours?: number;
  rpoHours?: number;
  assetCriticality?: string;
}

export interface AssetDependency {
  id: number;
  assetId: number;
  assetName: string;
  dependsOnAssetId: number;
  dependsOnAssetName: string;
  dependencyType: DependencyType;
  notes?: string;
}

export interface ProcessAsset {
  id: number;
  processId: number;
  processName: string;
  assetId: number;
  assetName: string;
  dependencyType: DependencyType;
  notes?: string;
}

/**
 * Helper function to get criticality tier display name
 */
export function getCriticalityTierName(tier: CriticalityTier): string {
  switch (tier) {
    case CriticalityTier.TIER_1:
      return 'Tier 1 - Mission Critical';
    case CriticalityTier.TIER_2:
      return 'Tier 2 - Critical';
    case CriticalityTier.TIER_3:
      return 'Tier 3 - Important';
    case CriticalityTier.TIER_4:
      return 'Tier 4 - Standard';
    case CriticalityTier.TIER_5:
      return 'Tier 5 - Non-Critical';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to get criticality tier color
 */
export function getCriticalityTierColor(tier: CriticalityTier): string {
  switch (tier) {
    case CriticalityTier.TIER_1:
      return 'red';
    case CriticalityTier.TIER_2:
      return 'orange';
    case CriticalityTier.TIER_3:
      return 'yellow';
    case CriticalityTier.TIER_4:
      return 'blue';
    case CriticalityTier.TIER_5:
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Helper function to get asset criticality display name
 */
export function getAssetCriticalityName(criticality: string | undefined): string {
  switch (criticality) {
    case 'CRITICAL':
      return 'Critical';
    case 'HIGH':
      return 'High';
    case 'MEDIUM':
      return 'Medium';
    case 'LOW':
      return 'Low';
    default:
      return 'Not Set';
  }
}

/**
 * Helper function to get asset criticality color
 */
export function getAssetCriticalityColor(criticality: string | undefined): string {
  switch (criticality) {
    case 'CRITICAL':
      return 'red';
    case 'HIGH':
      return 'orange';
    case 'MEDIUM':
      return 'yellow';
    case 'LOW':
      return 'green';
    default:
      return 'gray';
  }
}

/**
 * Helper function to format RTO/RPO hours
 */
export function formatRecoveryTime(hours: number | undefined): string {
  if (hours === undefined || hours === null) return 'Not Set';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) return `${days} day${days !== 1 ? 's' : ''}`;
  return `${days}d ${remainingHours}h`;
}
