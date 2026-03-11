'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { BIATemplate, OrganizationalLevel, BIAField, PREDEFINED_BIA_FIELDS } from '../../../types/biaTemplate';
import biaTemplateService from '../../../services/biaTemplateService';
import TemplateFormModal from '../../../components/TemplateFormModal';

const organizationalLevels: { value: OrganizationalLevel; label: string }[] = [
  { value: 'organization', label: 'Organization' },
  { value: 'department', label: 'Department' },
  { value: 'location', label: 'Location' },
  { value: 'process', label: 'Process' }
];

export default function BIATemplatesPage() {
  const [templates, setTemplates] = useState<BIATemplate[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<OrganizationalLevel>('process');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BIATemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    organizationalLevel: 'process' as OrganizationalLevel,
    isActive: true,
    fields: [] as BIAField[]
  });
  const [availableFields, setAvailableFields] = useState<BIAField[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [selectedLevel]);

  useEffect(() => {
    // Load available fields when component mounts
    const fields = biaTemplateService.getAvailableFields();
    setAvailableFields(fields);
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const levelTemplates = biaTemplateService.getTemplatesByLevel(selectedLevel);
      setTemplates(levelTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      organizationalLevel: selectedLevel,
      isActive: true,
      fields: []
    });
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template: BIATemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      organizationalLevel: template.organizationalLevel,
      isActive: template.isActive,
      fields: [...template.fields]
    });
    setIsCreateModalOpen(true);
  };

  const handleDuplicateTemplate = async (template: BIATemplate) => {
    try {
      const newName = `${template.name} (Copy)`;
      await biaTemplateService.duplicateTemplate(template.id, newName);
      loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleDeleteTemplate = async (template: BIATemplate) => {
    if (template.isDefault) {
      alert('Cannot delete a default template');
      return;
    }

    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await biaTemplateService.deleteTemplate(template.id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Error deleting template. It may be in use.');
      }
    }
  };

  const handleSetDefault = async (template: BIATemplate) => {
    try {
      biaTemplateService.setDefaultTemplate(selectedLevel, template.id);
      loadTemplates();
    } catch (error) {
      console.error('Error setting default template:', error);
    }
  };

  const getFieldCount = (template: BIATemplate) => {
    return template.fields.filter(field => field.isEnabled).length;
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        // Update existing template
        await biaTemplateService.updateTemplate(editingTemplate.id, {
          name: templateForm.name,
          description: templateForm.description,
          isActive: templateForm.isActive,
          fields: templateForm.fields,
          updatedBy: 'user' // In real app, get from auth context
        });
      } else {
        // Create new template
        await biaTemplateService.createTemplate({
          name: templateForm.name,
          description: templateForm.description,
          organizationalLevel: templateForm.organizationalLevel,
          applicableToIds: [],
          fields: templateForm.fields,
          isDefault: false,
          isActive: templateForm.isActive,
          createdBy: 'user', // In real app, get from auth context
          updatedBy: 'user'
        });
      }

      setIsCreateModalOpen(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    }
  };

  const handleAddField = (fieldType: string) => {
    const predefinedField = PREDEFINED_BIA_FIELDS[fieldType as keyof typeof PREDEFINED_BIA_FIELDS];
    if (!predefinedField) return;

    // Check if field already exists
    const existingField = templateForm.fields.find(f => f.type === fieldType);
    if (existingField) return;

    const newField: BIAField = {
      ...predefinedField,
      id: `field-${Date.now()}`,
      order: templateForm.fields.length + 1,
      isEnabled: true
    };

    setTemplateForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField].sort((a, b) => a.order - b.order)
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    setTemplateForm(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const handleToggleField = (fieldId: string) => {
    setTemplateForm(prev => ({
      ...prev,
      fields: prev.fields.map(f =>
        f.id === fieldId ? { ...f, isEnabled: !f.isEnabled } : f
      )
    }));
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = templateForm.fields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= templateForm.fields.length) return;

    const newFields = [...templateForm.fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];

    // Update order numbers
    newFields.forEach((field, index) => {
      field.order = index + 1;
    });

    setTemplateForm(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const getStatusBadge = (template: BIATemplate) => {
    if (template.isDefault) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Default
        </span>
      );
    }

    if (!template.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  return (
    <div className="px-6 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BIA Template Management</h1>
            <p className="mt-2 text-lg text-gray-600">Configure and manage BIA templates for different organizational levels</p>
          </div>
          <button
            onClick={handleCreateTemplate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {organizationalLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value)}
                className={`${
                  selectedLevel === level.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {level.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">
            <Cog6ToothIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create your first BIA template for {organizationalLevels.find(l => l.value === selectedLevel)?.label.toLowerCase()} level.
            </p>
            <button
              onClick={handleCreateTemplate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Template
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fields
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 break-words">{template.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 break-words max-w-xs">{template.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getFieldCount(template)} fields</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(template)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {!template.isDefault && (
                          <button
                            onClick={() => handleSetDefault(template)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                            title="Set as default"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit template"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="text-green-600 hover:text-green-900"
                          title="Duplicate template"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        {!template.isDefault && (
                          <button
                            onClick={() => handleDeleteTemplate(template)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete template"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Template Creation/Edit Modal */}
      <TemplateFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveTemplate}
        editingTemplate={editingTemplate}
        templateForm={templateForm}
        setTemplateForm={setTemplateForm}
        onAddField={handleAddField}
        onRemoveField={handleRemoveField}
        onToggleField={handleToggleField}
        onMoveField={handleMoveField}
      />
    </div>
  );
}
