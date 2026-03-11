/**
 * Organizational Unit Types
 * Self-referencing hierarchical model for organizational structure
 */

export type UnitType = 
  | 'ORGANIZATION'
  | 'DIVISION'
  | 'DEPARTMENT'
  | 'TEAM'
  | 'SUB_TEAM'
  | 'CUSTOM';

export type CriticalityTier = 
  | 'TIER_1'
  | 'TIER_2'
  | 'TIER_3'
  | 'TIER_4'
  | 'TIER_5';

export interface OrganizationalUnit {
  id: string;
  unitCode: string;
  unitName: string;
  description?: string;
  
  // Self-referencing hierarchy
  parentUnitId?: string;
  parentUnit?: OrganizationalUnit;
  childUnits?: OrganizationalUnit[];
  
  // Classification
  unitType: UnitType;
  isBiaEligible: boolean;
  
  // Leadership
  unitHead?: string;
  unitHeadEmail?: string;
  unitHeadPhone?: string;
  
  // Location
  locationId?: string;
  
  // Criticality
  criticalityTier?: CriticalityTier;
  criticalityScore?: number;
  
  // Metrics
  employeeCount?: number;
  annualBudget?: number;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  
  // Computed fields
  fullPath?: string;
  level?: number;
  isLeafNode?: boolean;
  childCount?: number;
}

export interface OrganizationalUnitTree extends OrganizationalUnit {
  children: OrganizationalUnitTree[];
}

export interface CreateOrganizationalUnitRequest {
  unitCode?: string;
  unitName: string;
  description?: string;
  parentUnitId?: string;
  unitType: UnitType;
  isBiaEligible: boolean;
  unitHead?: string;
  unitHeadEmail?: string;
  unitHeadPhone?: string;
  employeeCount?: number;
  annualBudget?: number;
}

export interface UpdateOrganizationalUnitRequest extends Partial<CreateOrganizationalUnitRequest> {
  id: string;
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  ORGANIZATION: 'Organization',
  DIVISION: 'Division',
  DEPARTMENT: 'Department',
  TEAM: 'Team',
  SUB_TEAM: 'Sub-Team',
  CUSTOM: 'Custom'
};

export const UNIT_TYPE_COLORS: Record<UnitType, string> = {
  ORGANIZATION: 'bg-purple-100 text-purple-800',
  DIVISION: 'bg-blue-100 text-blue-800',
  DEPARTMENT: 'bg-green-100 text-green-800',
  TEAM: 'bg-yellow-100 text-yellow-800',
  SUB_TEAM: 'bg-orange-100 text-orange-800',
  CUSTOM: 'bg-gray-100 text-gray-800'
};

