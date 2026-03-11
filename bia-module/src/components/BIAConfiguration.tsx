'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useOrganization } from '@/contexts/OrganizationContext';

interface TimeFrame {
  id: string;
  label: string;
  valueInHours: number;
}

interface ImpactCategory {
  id: string;
  name: string;
  severityDefinitions: {
    [key: number]: string;
  };
}

interface BIAConfigurationProps {
  onSave: (config: any) => void;
}

export default function BIAConfiguration({ onSave }: BIAConfigurationProps) {
  const { biaConfig, updateBIAConfig } = useOrganization();
  const [timeFrames, setTimeFrames] = useState<TimeFrame[]>(biaConfig.timeFrames);
  const [impactCategories, setImpactCategories] = useState<ImpactCategory[]>(biaConfig.impactCategories);
  const [criticalityThreshold, setCriticalityThreshold] = useState(biaConfig.criticalityThreshold);
  const [editingTimeFrame, setEditingTimeFrame] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newTimeFrame, setNewTimeFrame] = useState({ label: '', valueInHours: 0 });
  const [newCategory, setNewCategory] = useState({ name: '', severityDefinitions: {} });
  const [isSaving, setIsSaving] = useState(false);

  // Sync with context when it changes
  useEffect(() => {
    setTimeFrames(biaConfig.timeFrames);
    setImpactCategories(biaConfig.impactCategories);
    setCriticalityThreshold(biaConfig.criticalityThreshold);
  }, [biaConfig]);

  const addTimeFrame = () => {
    if (newTimeFrame.label && newTimeFrame.valueInHours > 0) {
      const newFrame: TimeFrame = {
        id: Date.now().toString(),
        label: newTimeFrame.label,
        valueInHours: newTimeFrame.valueInHours
      };
      setTimeFrames([...timeFrames, newFrame]);
      setNewTimeFrame({ label: '', valueInHours: 0 });
    }
  };

  const deleteTimeFrame = (id: string) => {
    setTimeFrames(timeFrames.filter(tf => tf.id !== id));
  };

  const addImpactCategory = () => {
    if (newCategory.name) {
      const newCat: ImpactCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        severityDefinitions: {
          1: 'Minimal impact',
          2: 'Minor impact',
          3: 'Moderate impact',
          4: 'Severe impact',
          5: 'Catastrophic impact'
        }
      };
      setImpactCategories([...impactCategories, newCat]);
      setNewCategory({ name: '', severityDefinitions: {} });
    }
  };

  const deleteImpactCategory = (id: string) => {
    setImpactCategories(impactCategories.filter(ic => ic.id !== id));
  };

  const updateSeverityDefinition = (categoryId: string, severity: number, definition: string) => {
    setImpactCategories(impactCategories.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            severityDefinitions: {
              ...category.severityDefinitions,
              [severity]: definition
            }
          }
        : category
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const config = {
        timeFrames,
        impactCategories,
        criticalityThreshold,
        rtoOptions: biaConfig.rtoOptions,
        rpoOptions: biaConfig.rpoOptions
      };
      await updateBIAConfig(config);
      onSave(config);
    } catch (error) {
      console.error('Failed to save BIA configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Criticality Threshold */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <ExclamationTriangleIcon className="h-4 w-4 text-green-600 mr-1.5" />
            <h3 className="text-sm font-medium text-gray-900">Criticality Threshold</h3>
          </div>
          <p className="text-xs text-gray-500">
            Set the severity level at which an impact is considered unacceptable for MTPD calculation
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="block text-xs font-medium text-gray-700">
              Unacceptable Impact Threshold:
            </label>
            <select
              value={criticalityThreshold}
              onChange={(e) => setCriticalityThreshold(parseInt(e.target.value))}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-40"
            >
              <option value={3}>3 - Moderate</option>
              <option value={4}>4 - Severe</option>
              <option value={5}>5 - Catastrophic</option>
            </select>
          </div>
          <p className="text-xs text-gray-500">
            When any impact category reaches this severity level or higher, the system will suggest that timeframe as the MTPD.
          </p>
        </div>
      </div>

      {/* Time Periods Configuration */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <ClockIcon className="h-4 w-4 text-green-600 mr-1.5" />
            <h3 className="text-sm font-medium text-gray-900">Impact Analysis Timeframes</h3>
          </div>
          <p className="text-xs text-gray-500">
            Configure the time periods used in your impact analysis matrix
          </p>
        </div>
        <div className="space-y-3">
          {timeFrames.map((timeFrame) => (
            <div key={timeFrame.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-200">
              <div>
                <span className="text-xs font-medium text-gray-900">{timeFrame.label}</span>
                <span className="ml-2 text-[10px] text-gray-500">({timeFrame.valueInHours} hours)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setEditingTimeFrame(timeFrame.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteTimeFrame(timeFrame.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Timeframe */}
          <div className="flex items-center space-x-2 p-2 border-2 border-dashed border-gray-300 rounded-sm">
            <input
              type="text"
              placeholder="Label (e.g., '2-4 Days')"
              value={newTimeFrame.label}
              onChange={(e) => setNewTimeFrame({ ...newTimeFrame, label: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Hours"
              value={newTimeFrame.valueInHours || ''}
              onChange={(e) => setNewTimeFrame({ ...newTimeFrame, valueInHours: parseInt(e.target.value) || 0 })}
              className="w-20 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={addTimeFrame}
              className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Impact Categories Configuration */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <ChartBarIcon className="h-4 w-4 text-green-600 mr-1.5" />
            <h3 className="text-sm font-medium text-gray-900">Impact Categories & Severity Definitions</h3>
          </div>
          <p className="text-xs text-gray-500">
            Define impact categories and their severity level descriptions
          </p>
        </div>
        <div className="space-y-4">
          {impactCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-sm p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                <button
                  onClick={() => deleteImpactCategory(category.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[1, 2, 3, 4, 5].map((severity) => (
                  <div key={severity} className="flex items-center space-x-2">
                    <span className="w-14 text-xs font-medium text-gray-700">
                      Level {severity}:
                    </span>
                    <input
                      type="text"
                      value={category.severityDefinitions[severity] || ''}
                      onChange={(e) => updateSeverityDefinition(category.id, severity, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Severity ${severity} definition`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add New Category */}
          <div className="flex items-center space-x-2 p-2 border-2 border-dashed border-gray-300 rounded-sm">
            <input
              type="text"
              placeholder="Category name (e.g., 'Environmental')"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={addImpactCategory}
              className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckIcon className="h-3.5 w-3.5 inline mr-1.5" />
          {isSaving ? 'Saving...' : 'Save BIA Configuration'}
        </button>
      </div>
    </div>
  );
}
