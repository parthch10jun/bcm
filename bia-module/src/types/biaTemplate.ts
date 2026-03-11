// BIA Template Configuration Types

export type BIAFieldType = 
  | 'staff-list'
  | 'recovery-staff'
  | 'impact-analysis'
  | 'peak-times'
  | 'dependencies'
  | 'resources'
  | 'spof-analysis'
  | 'additional-information';

export type OrganizationalLevel = 
  | 'organization'
  | 'department'
  | 'location'
  | 'process';

export interface BIAField {
  id: string;
  type: BIAFieldType;
  name: string;
  description: string;
  required: boolean;
  order: number;
  isEnabled: boolean;
  configuration?: {
    // Field-specific configuration options
    [key: string]: any;
  };
}

export interface BIATemplate {
  id: string;
  name: string;
  description: string;
  organizationalLevel: OrganizationalLevel;
  applicableToIds: string[]; // IDs of departments, locations, processes, or organization
  fields: BIAField[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
}

export interface BIATemplateConfiguration {
  organizationId: string;
  templates: BIATemplate[];
  defaultTemplates: {
    [key in OrganizationalLevel]: string; // Template ID
  };
}

// Predefined field definitions
export const PREDEFINED_BIA_FIELDS: Record<BIAFieldType, Omit<BIAField, 'id' | 'order' | 'isEnabled'>> = {
  'staff-list': {
    type: 'staff-list',
    name: 'Staff List',
    description: 'Personnel assigned to this process (linked to People Library)',
    required: false,
    configuration: {
      allowMultipleSelection: true,
      linkToPeopleLibrary: true,
      showRoles: true,
      showContactInfo: true
    }
  },
  'recovery-staff': {
    type: 'recovery-staff',
    name: 'Recovery Staff',
    description: 'Personnel responsible for recovery operations (linked to People Library)',
    required: false,
    configuration: {
      allowMultipleSelection: true,
      linkToPeopleLibrary: true,
      showRoles: true,
      showContactInfo: true,
      requireRecoveryTraining: true
    }
  },
  'impact-analysis': {
    type: 'impact-analysis',
    name: 'Impact Analysis',
    description: 'Business impact assessment and MTPD calculation',
    required: true,
    configuration: {
      enableWaterfallLogic: true,
      impactCategories: ['financial', 'operational', 'reputational', 'regulatory'],
      timeframes: ['1hr', '4hr', '24hr', '3days', '1week']
    }
  },
  'peak-times': {
    type: 'peak-times',
    name: 'Peak Times and Critical Deadlines',
    description: 'Time-sensitive business requirements and operational constraints',
    required: false,
    configuration: {
      enableRecurringPatterns: true,
      enableSeasonalVariations: true,
      enableCriticalDeadlines: true
    }
  },
  'dependencies': {
    type: 'dependencies',
    name: 'Dependencies',
    description: 'Upstream and downstream process dependencies',
    required: false,
    configuration: {
      enableUpstreamDependencies: true,
      enableDownstreamDependencies: true,
      linkToProcessLibrary: true,
      showRTOImpact: true
    }
  },
  'resources': {
    type: 'resources',
    name: 'Resources (BETH3V)',
    description: 'Critical resources following BETH3V framework',
    required: false,
    configuration: {
      enableBuildings: true,
      enableEquipment: true,
      enableTechnology: true,
      enableVitalRecords: true,
      enableHumanResources: true,
      enableVendors: true
    }
  },
  'spof-analysis': {
    type: 'spof-analysis',
    name: 'Single Point of Failure Analysis',
    description: 'Identification and analysis of single points of failure',
    required: false,
    configuration: {
      enablePersonDependency: true,
      enableTechnologyDependency: true,
      enableVendorDependency: true,
      requireMitigationStrategies: true
    }
  },
  'additional-information': {
    type: 'additional-information',
    name: 'Additional Information',
    description: 'Custom business-specific information and notes',
    required: false,
    configuration: {
      enableCustomFields: true,
      enableFileAttachments: true,
      enableRichTextEditor: true
    }
  }
};

// Template validation and utility functions
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BIATemplateService {
  validateTemplate(template: BIATemplate): TemplateValidationResult;
  getAvailableFields(): BIAField[];
  getTemplatesByLevel(level: OrganizationalLevel): BIATemplate[];
  getApplicableTemplates(entityId: string, entityType: OrganizationalLevel): BIATemplate[];
  createTemplate(template: Omit<BIATemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>): BIATemplate;
  updateTemplate(id: string, updates: Partial<BIATemplate>): BIATemplate;
  deleteTemplate(id: string): boolean;
  duplicateTemplate(id: string, newName: string): BIATemplate;
  setDefaultTemplate(level: OrganizationalLevel, templateId: string): void;
}

// Template selection context for BIA creation
export interface BIACreationContext {
  entityType: OrganizationalLevel;
  entityId: string;
  entityName: string;
  selectedTemplate?: BIATemplate;
  availableTemplates: BIATemplate[];
}

// Dynamic field rendering configuration
export interface FieldRenderConfig {
  field: BIAField;
  stepNumber: number;
  isVisible: boolean;
  isRequired: boolean;
  validationRules: any[];
  dependencies: string[]; // Field IDs this field depends on
}

export interface DynamicBIAWizardConfig {
  template: BIATemplate;
  context: BIACreationContext;
  fields: FieldRenderConfig[];
  totalSteps: number;
  currentStep: number;
}
