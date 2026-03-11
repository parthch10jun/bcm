// Central Libraries for BIA Integration

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  mobile?: string;
  department: string;
  jobTitle: string;
  location: string;
  manager?: string;
  skills: string[];
  isKeyPersonnel: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'Active' | 'Inactive' | 'On Leave';
  lastUpdated: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'Hardware' | 'Software' | 'Infrastructure' | 'Data' | 'Facility';
  category: string;
  description: string;
  location: string;
  owner: string; // Person ID
  custodian?: string; // Person ID
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Technical details
  specifications?: {
    vendor?: string;
    model?: string;
    version?: string;
    serialNumber?: string;
    licenseInfo?: string;
  };
  
  // Operational details
  operationalStatus: 'Active' | 'Inactive' | 'Maintenance' | 'Retired';
  maintenanceSchedule?: string;
  supportContract?: string;
  
  // Dependencies
  dependencies: string[]; // Other asset IDs
  supportedProcesses: string[]; // Process IDs
  
  // Recovery information
  recoveryPriority: number;
  backupLocation?: string;
  alternativeAssets?: string[]; // Asset IDs
  
  lastUpdated: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Technology' | 'Service' | 'Supplier' | 'Contractor' | 'Consultant';
  status: 'Active' | 'Inactive' | 'Under Review';
  
  // Contact information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  
  // Business details
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Contract information
  contractDetails: {
    contractNumber?: string;
    startDate: string;
    endDate: string;
    value: number;
    currency: string;
    renewalTerms?: string;
  };
  
  // Service details
  servicesProvided: string[];
  supportedProcesses: string[]; // Process IDs
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  
  // Risk assessment
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: string[];
  
  // Business continuity
  hasBCPlan: boolean;
  alternativeVendors?: string[]; // Vendor IDs
  escalationProcedure?: string;
  
  // Performance metrics
  slaMetrics?: {
    availability: number;
    responseTime: string;
    resolutionTime: string;
  };
  
  lastUpdated: string;
}

// Linking interfaces for BIA integration
export interface ProcessPersonLink {
  processId: string;
  personId: string;
  role: 'Owner' | 'Key Staff' | 'Backup' | 'SME' | 'Approver';
  criticality: 'Essential' | 'Important' | 'Helpful';
  canWorkRemotely: boolean;
  crossTrainingStatus: 'Trained' | 'In Progress' | 'Not Trained';
}

export interface ProcessAssetLink {
  processId: string;
  assetId: string;
  dependency: 'Critical' | 'High' | 'Medium' | 'Low';
  usageType: 'Primary' | 'Backup' | 'Development' | 'Testing';
  recoveryRequirement: string;
  alternativeOptions?: string[];
}

export interface ProcessVendorLink {
  processId: string;
  vendorId: string;
  serviceType: string;
  dependency: 'Critical' | 'High' | 'Medium' | 'Low';
  contractualSLA?: string;
  escalationRequired: boolean;
  alternativeVendors?: string[];
}

// Search and filter interfaces
export interface LibrarySearchFilters {
  searchTerm?: string;
  department?: string;
  location?: string;
  criticality?: string;
  status?: string;
  type?: string;
}

export interface LibrarySearchResult<T> {
  items: T[];
  totalCount: number;
  filteredCount: number;
}
