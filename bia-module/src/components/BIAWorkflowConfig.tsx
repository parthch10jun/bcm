'use client';

import { useState, useEffect } from 'react';
import { BIAWorkflowConfiguration, BIATabConfiguration, DEFAULT_BIA_WORKFLOW } from '@/types/bia';
import { 
  CogIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface BIAWorkflowConfigProps {
  onConfigurationChange: (config: BIAWorkflowConfiguration) => void;
  currentConfig?: BIAWorkflowConfiguration;
}

export default function BIAWorkflowConfig({ onConfigurationChange, currentConfig }: BIAWorkflowConfigProps) {
  const [config, setConfig] = useState<BIAWorkflowConfiguration>(currentConfig || DEFAULT_BIA_WORKFLOW);
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleTabUpdate = (tabId: string, updates: Partial<BIATabConfiguration>) => {
    const updatedConfig = {
      ...config,
      tabs: config.tabs.map(tab => 
        tab.id === tabId ? { ...tab, ...updates } : tab
      ),
      updatedAt: new Date()
    };
    setConfig(updatedConfig);
    onConfigurationChange(updatedConfig);
  };

  const handleTabReorder = (tabId: string, direction: 'up' | 'down') => {
    const currentIndex = config.tabs.findIndex(tab => tab.id === tabId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === config.tabs.length - 1)
    ) {
      return;
    }

    const newTabs = [...config.tabs];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap tabs
    [newTabs[currentIndex], newTabs[targetIndex]] = [newTabs[targetIndex], newTabs[currentIndex]];
    
    // Update order numbers
    newTabs.forEach((tab, index) => {
      tab.order = index + 1;
    });

    const updatedConfig = {
      ...config,
      tabs: newTabs,
      updatedAt: new Date()
    };
    setConfig(updatedConfig);
    onConfigurationChange(updatedConfig);
  };

  const handleTabDelete = (tabId: string) => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (tab?.isRequired) {
      alert('Cannot delete required tabs');
      return;
    }

    const updatedConfig = {
      ...config,
      tabs: config.tabs.filter(tab => tab.id !== tabId),
      updatedAt: new Date()
    };
    setConfig(updatedConfig);
    onConfigurationChange(updatedConfig);
  };

  const getIconComponent = (iconName: string) => {
    // For now, just return CogIcon as default
    // In a real implementation, you'd have a proper icon mapping system
    return CogIcon;
  };

  return (
    <div className="bg-white rounded-lg shadow-bcm border border-gray-100">
      <div className="bcm-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CogIcon className="h-5 w-5 text-bcm-dark mr-2" />
            <h3 className="text-lg font-medium text-gray-900">BIA Workflow Configuration</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`bcm-button-${isEditing ? 'secondary' : 'primary'}`}
          >
            {isEditing ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Configuration
              </>
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Configure the BIA workflow steps and their properties
        </p>
      </div>

      <div className="p-6">
        {/* Workflow Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Workflow Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bcm-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Version</label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => setConfig({ ...config, version: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bcm-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Steps</label>
              <div className="mt-1 text-sm text-gray-900 py-2">
                {config.tabs.filter(tab => tab.isEnabled).length} enabled steps
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Configuration */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Workflow Steps</h4>
          
          {config.tabs.map((tab, index) => {
            const IconComponent = getIconComponent(tab.icon);
            const isEditing = editingTab === tab.id;
            
            return (
              <div
                key={tab.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  tab.isEnabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">#{tab.order}</span>
                      <IconComponent className="h-5 w-5 text-bcm-dark" />
                    </div>
                    
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={tab.name}
                          onChange={(e) => handleTabUpdate(tab.id, { name: e.target.value })}
                          className="bcm-input text-sm"
                        />
                      ) : (
                        <h5 className="text-sm font-medium text-gray-900">{tab.name}</h5>
                      )}
                      
                      {isEditing ? (
                        <textarea
                          value={tab.description}
                          onChange={(e) => handleTabUpdate(tab.id, { description: e.target.value })}
                          className="mt-1 bcm-input text-xs"
                          rows={2}
                        />
                      ) : (
                        <p className="text-xs text-gray-500">{tab.description}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Required Badge */}
                      {tab.isRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                      
                      {/* Enabled Toggle */}
                      <button
                        onClick={() => handleTabUpdate(tab.id, { isEnabled: !tab.isEnabled })}
                        disabled={tab.isRequired}
                        className={`p-1 rounded ${
                          tab.isEnabled ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                        } ${tab.isRequired ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {tab.isEnabled ? (
                          <EyeIcon className="h-4 w-4" />
                        ) : (
                          <EyeSlashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleTabReorder(tab.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleTabReorder(tab.id, 'down')}
                      disabled={index === config.tabs.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingTab(isEditing ? null : tab.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {isEditing ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <PencilIcon className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete Button */}
                    {!tab.isRequired && (
                      <button
                        onClick={() => handleTabDelete(tab.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Required Fields */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Required Fields</label>
                        <textarea
                          value={tab.validationRules.requiredFields.join(', ')}
                          onChange={(e) => handleTabUpdate(tab.id, {
                            validationRules: {
                              ...tab.validationRules,
                              requiredFields: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                            }
                          })}
                          className="mt-1 bcm-input text-xs"
                          rows={2}
                          placeholder="field1, field2, field3"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Component</label>
                        <input
                          type="text"
                          value={tab.component}
                          onChange={(e) => handleTabUpdate(tab.id, { component: e.target.value })}
                          className="mt-1 bcm-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Tab Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="bcm-button-secondary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Custom Step
          </button>
        </div>
      </div>
    </div>
  );
}
