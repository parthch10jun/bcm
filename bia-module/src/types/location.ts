export interface Location {
  id: string;
  name: string;
  address: string;
  locationType: 'Office' | 'Data Center' | 'Factory' | 'Warehouse' | 'Branch' | 'Other';
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity: {
    maxOccupancy: number;
    currentOccupancy: number;
  };
  facilityManager: {
    name: string;
    phone: string;
    email: string;
  };
  emergencyContacts: {
    localEmergencyServices: string;
    security: string;
    facilities: string;
  };
  infrastructure: {
    powerBackup: boolean;
    internetRedundancy: boolean;
    hvacSystem: boolean;
    securitySystems: string[];
  };
  businessContinuity: {
    evacuationPlan?: string; // URL to document
    alternateWorkSite?: string; // Location ID of backup site
    recoveryResources: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationBIA {
  id: string;
  locationId: string;
  name: string;
  description: string;
  analysisDate: Date;
  analyst: string;
  
  // Aggregated data from Process BIAs
  criticalProcesses: {
    processId: string;
    processName: string;
    criticalityTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
    rto: number; // in hours
    rpo: number; // in hours
    keyPersonnelCount: number;
  }[];
  
  // Staff analysis
  staffAnalysis: {
    totalStaff: number;
    keyPersonnel: number;
    criticalRoles: string[];
    skillConcentrationRisks: string[];
  };
  
  // Technology dependencies
  technologyAssets: {
    assetId: string;
    assetName: string;
    assetType: 'Server' | 'Network' | 'Storage' | 'Application' | 'Other';
    criticality: 'Critical' | 'Important' | 'Standard';
    dependentProcesses: string[];
  }[];
  
  // Location-specific risks
  locationRisks: {
    riskType: 'Natural Disaster' | 'Fire' | 'Flood' | 'Power Outage' | 'Civil Unrest' | 'Access Restriction' | 'Other';
    likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
    impact: 'Minimal' | 'Minor' | 'Moderate' | 'Major' | 'Severe';
    mitigationMeasures: string[];
  }[];
  
  // Recovery strategies
  recoveryStrategies: {
    strategy: string;
    timeframe: string;
    resources: string[];
    cost: number;
    feasibility: 'High' | 'Medium' | 'Low';
  }[];
  
  // Overall assessment
  overallRiskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  maxAcceptableDowntime: number; // in hours
  recommendedActions: string[];
  
  status: 'Draft' | 'Under Review' | 'Approved' | 'Requires Update';
  approvedBy?: string;
  approvedDate?: Date;
  nextReviewDate: Date;
}

export interface LocationBIASummary {
  totalLocations: number;
  criticalLocations: number;
  locationsRequiringUpdate: number;
  averageRiskRating: number;
  topRisks: {
    riskType: string;
    affectedLocations: number;
  }[];
}
