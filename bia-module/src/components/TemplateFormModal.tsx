'use client';

import { useState } from 'react';
import { 
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { BIATemplate, BIAField, OrganizationalLevel, PREDEFINED_BIA_FIELDS } from '../types/biaTemplate';

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingTemplate: BIATemplate | null;
  templateForm: {
    name: string;
    description: string;
    organizationalLevel: OrganizationalLevel;
    isActive: boolean;
    fields: BIAField[];
  };
  setTemplateForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    organizationalLevel: OrganizationalLevel;
    isActive: boolean;
    fields: BIAField[];
  }>>;
  onAddField: (fieldType: string) => void;
  onRemoveField: (fieldId: string) => void;
  onToggleField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
}

const organizationalLevels: { value: OrganizationalLevel; label: string }[] = [
  { value: 'organization', label: 'Organization' },
  { value: 'department', label: 'Department' },
  { value: 'location', label: 'Location' },
  { value: 'process', label: 'Process' }
];

export default function TemplateFormModal({
  isOpen,
  onClose,
  onSave,
  editingTemplate,
  templateForm,
  setTemplateForm,
  onAddField,
  onRemoveField,
  onToggleField,
  onMoveField
}: TemplateFormModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'fields'>('basic');

  if (!isOpen) return null;

  const handleSave = () => {
    // Basic validation
    if (!templateForm.name.trim()) {
      alert('Template name is required');
      return;
    }

    if (templateForm.fields.length === 0) {
      alert('Template must have at least one field');
      return;
    }

    const hasImpactAnalysis = templateForm.fields.some(f => f.type === 'impact-analysis' && f.isEnabled);
    if (!hasImpactAnalysis) {
      alert('Impact Analysis field is required');
      return;
    }

    onSave();
  };

  const getAvailableFieldsToAdd = () => {
    const usedFieldTypes = templateForm.fields.map(f => f.type);
    return Object.keys(PREDEFINED_BIA_FIELDS).filter(type => !usedFieldTypes.includes(type as any));
  };

  const getFieldTypeLabel = (type: string) => {
    return PREDEFINED_BIA_FIELDS[type as keyof typeof PREDEFINED_BIA_FIELDS]?.name || type;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`${
                activeTab === 'fields'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Fields Configuration ({templateForm.fields.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizational Level
                </label>
                <select
                  value={templateForm.organizationalLevel}
                  onChange={(e) => setTemplateForm(prev => ({ 
                    ...prev, 
                    organizationalLevel: e.target.value as OrganizationalLevel 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!!editingTemplate} // Can't change level when editing
                >
                  {organizationalLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {editingTemplate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Organizational level cannot be changed when editing an existing template
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={templateForm.isActive}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active template
                </label>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-6">
              {/* Add Field Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add Fields</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {getAvailableFieldsToAdd().map((fieldType) => (
                    <button
                      key={fieldType}
                      onClick={() => onAddField(fieldType)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      {getFieldTypeLabel(fieldType)}
                    </button>
                  ))}
                </div>
                {getAvailableFieldsToAdd().length === 0 && (
                  <p className="text-sm text-gray-500 italic">All available fields have been added</p>
                )}
              </div>

              {/* Fields List */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Template Fields ({templateForm.fields.length})
                </h4>
                {templateForm.fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No fields added yet. Add fields from the section above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templateForm.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field, index) => (
                        <div
                          key={field.id}
                          className={`border rounded-lg p-4 ${
                            field.isEnabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-500">
                                #{field.order}
                              </span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {field.name}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <div className="text-xs text-gray-500">{field.description}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onToggleField(field.id)}
                                className={`p-1 rounded ${
                                  field.isEnabled 
                                    ? 'text-green-600 hover:text-green-800' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                title={field.isEnabled ? 'Disable field' : 'Enable field'}
                              >
                                {field.isEnabled ? (
                                  <EyeIcon className="h-4 w-4" />
                                ) : (
                                  <EyeSlashIcon className="h-4 w-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => onMoveField(field.id, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ArrowUpIcon className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => onMoveField(field.id, 'down')}
                                disabled={index === templateForm.fields.length - 1}
                                className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ArrowDownIcon className="h-4 w-4" />
                              </button>
                              
                              {!field.required && (
                                <button
                                  onClick={() => onRemoveField(field.id)}
                                  className="p-1 rounded text-red-600 hover:text-red-800"
                                  title="Remove field"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
