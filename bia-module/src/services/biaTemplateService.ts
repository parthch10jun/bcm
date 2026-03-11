import { 
  BIATemplate, 
  BIAField, 
  BIAFieldType, 
  OrganizationalLevel, 
  PREDEFINED_BIA_FIELDS,
  TemplateValidationResult,
  BIATemplateService,
  BIACreationContext
} from '../types/biaTemplate';

// Mock data for development - in production this would connect to a backend API
const mockTemplates: BIATemplate[] = [
  {
    id: 'template-001',
    name: 'Standard Process BIA Template',
    description: 'Comprehensive template for process-level BIA with all standard fields',
    organizationalLevel: 'process',
    applicableToIds: [], // Empty means applicable to all processes
    fields: [
      { ...PREDEFINED_BIA_FIELDS['impact-analysis'], id: 'field-001', order: 1, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['staff-list'], id: 'field-002', order: 2, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['recovery-staff'], id: 'field-003', order: 3, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['peak-times'], id: 'field-004', order: 4, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['dependencies'], id: 'field-005', order: 5, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['resources'], id: 'field-006', order: 6, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['spof-analysis'], id: 'field-007', order: 7, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['additional-information'], id: 'field-008', order: 8, isEnabled: true }
    ],
    isDefault: true,
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedBy: 'system',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1
  },
  {
    id: 'template-002',
    name: 'Basic Process BIA Template',
    description: 'Simplified template for basic process BIA with essential fields only',
    organizationalLevel: 'process',
    applicableToIds: [],
    fields: [
      { ...PREDEFINED_BIA_FIELDS['impact-analysis'], id: 'field-009', order: 1, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['staff-list'], id: 'field-010', order: 2, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['dependencies'], id: 'field-011', order: 3, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['resources'], id: 'field-012', order: 4, isEnabled: true }
    ],
    isDefault: false,
    isActive: true,
    createdBy: 'admin',
    createdAt: '2024-01-15T00:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-15T00:00:00Z',
    version: 1
  },
  {
    id: 'template-003',
    name: 'Department BIA Template',
    description: 'Template for department-level BIA focusing on organizational structure',
    organizationalLevel: 'department',
    applicableToIds: [],
    fields: [
      { ...PREDEFINED_BIA_FIELDS['impact-analysis'], id: 'field-013', order: 1, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['staff-list'], id: 'field-014', order: 2, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['recovery-staff'], id: 'field-015', order: 3, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['resources'], id: 'field-016', order: 4, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['spof-analysis'], id: 'field-017', order: 5, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['additional-information'], id: 'field-018', order: 6, isEnabled: true }
    ],
    isDefault: true,
    isActive: true,
    createdBy: 'admin',
    createdAt: '2024-01-10T00:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-10T00:00:00Z',
    version: 1
  },
  {
    id: 'template-004',
    name: 'Location BIA Template',
    description: 'Template for location-based BIA with facility-specific considerations',
    organizationalLevel: 'location',
    applicableToIds: [],
    fields: [
      { ...PREDEFINED_BIA_FIELDS['impact-analysis'], id: 'field-019', order: 1, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['staff-list'], id: 'field-020', order: 2, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['peak-times'], id: 'field-021', order: 3, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['resources'], id: 'field-022', order: 4, isEnabled: true },
      { ...PREDEFINED_BIA_FIELDS['spof-analysis'], id: 'field-023', order: 5, isEnabled: true }
    ],
    isDefault: true,
    isActive: true,
    createdBy: 'admin',
    createdAt: '2024-01-05T00:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-05T00:00:00Z',
    version: 1
  }
];

class BIATemplateServiceImpl implements BIATemplateService {
  private templates: BIATemplate[] = [...mockTemplates];
  private defaultTemplates: Record<OrganizationalLevel, string> = {
    organization: 'template-001',
    department: 'template-003',
    location: 'template-004',
    process: 'template-001'
  };

  validateTemplate(template: BIATemplate): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!template.name?.trim()) {
      errors.push('Template name is required');
    }

    if (!template.description?.trim()) {
      warnings.push('Template description is recommended');
    }

    if (!template.fields || template.fields.length === 0) {
      errors.push('Template must have at least one field');
    }

    // Validate fields
    const requiredFieldFound = template.fields.some(field => 
      field.type === 'impact-analysis' && field.isEnabled
    );
    
    if (!requiredFieldFound) {
      errors.push('Impact Analysis field is required and must be enabled');
    }

    // Check for duplicate field types
    const fieldTypes = template.fields.map(f => f.type);
    const duplicates = fieldTypes.filter((type, index) => fieldTypes.indexOf(type) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate field types found: ${duplicates.join(', ')}`);
    }

    // Validate field order
    const orders = template.fields.map(f => f.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    if (JSON.stringify(orders) !== JSON.stringify(sortedOrders)) {
      warnings.push('Field order should be sequential');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  getAvailableFields(): BIAField[] {
    return Object.entries(PREDEFINED_BIA_FIELDS).map(([type, fieldDef], index) => ({
      ...fieldDef,
      id: `available-${type}`,
      order: index + 1,
      isEnabled: true
    }));
  }

  getTemplatesByLevel(level: OrganizationalLevel): BIATemplate[] {
    return this.templates.filter(template => 
      template.organizationalLevel === level && template.isActive
    );
  }

  getApplicableTemplates(entityId: string, entityType: OrganizationalLevel): BIATemplate[] {
    return this.templates.filter(template => 
      template.organizationalLevel === entityType && 
      template.isActive &&
      (template.applicableToIds.length === 0 || template.applicableToIds.includes(entityId))
    );
  }

  createTemplate(templateData: Omit<BIATemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>): BIATemplate {
    const newTemplate: BIATemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<BIATemplate>): BIATemplate {
    const templateIndex = this.templates.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    const updatedTemplate = {
      ...this.templates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: this.templates[templateIndex].version + 1
    };

    this.templates[templateIndex] = updatedTemplate;
    return updatedTemplate;
  }

  deleteTemplate(id: string): boolean {
    const templateIndex = this.templates.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      return false;
    }

    // Check if it's a default template
    const isDefault = Object.values(this.defaultTemplates).includes(id);
    if (isDefault) {
      throw new Error('Cannot delete a default template');
    }

    this.templates.splice(templateIndex, 1);
    return true;
  }

  duplicateTemplate(id: string, newName: string): BIATemplate {
    const originalTemplate = this.templates.find(t => t.id === id);
    if (!originalTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }

    const duplicatedTemplate = this.createTemplate({
      ...originalTemplate,
      name: newName,
      isDefault: false,
      createdBy: 'user', // In real app, get from auth context
      updatedBy: 'user'
    });

    return duplicatedTemplate;
  }

  setDefaultTemplate(level: OrganizationalLevel, templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    if (template.organizationalLevel !== level) {
      throw new Error(`Template is not applicable to ${level} level`);
    }

    this.defaultTemplates[level] = templateId;
  }

  getDefaultTemplate(level: OrganizationalLevel): BIATemplate | null {
    const templateId = this.defaultTemplates[level];
    return this.templates.find(t => t.id === templateId) || null;
  }

  getTemplateById(id: string): BIATemplate | null {
    return this.templates.find(t => t.id === id) || null;
  }

  getBIACreationContext(entityType: OrganizationalLevel, entityId: string, entityName: string): BIACreationContext {
    const availableTemplates = this.getApplicableTemplates(entityId, entityType);
    const defaultTemplate = this.getDefaultTemplate(entityType);

    return {
      entityType,
      entityId,
      entityName,
      selectedTemplate: defaultTemplate || availableTemplates[0],
      availableTemplates
    };
  }
}

// Export singleton instance
export const biaTemplateService = new BIATemplateServiceImpl();
export default biaTemplateService;
