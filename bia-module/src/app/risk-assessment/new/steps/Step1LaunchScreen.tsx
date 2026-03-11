'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { riskCategoryService } from '@/services/riskAssessmentService';
import { processService } from '@/services/processService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { assetService } from '@/services/assetService';
import { vendorService } from '@/services/vendorService';

interface Step1Props {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onCancel: () => void;
  setAssessmentId: (id: number) => void;
  isDemoMode?: boolean;
}

export default function Step1LaunchScreen({ data, onUpdate, onNext, onCancel, setAssessmentId, isDemoMode = false }: Step1Props) {
  const [riskCategories, setRiskCategories] = useState<any[]>([]);
  const [contextObjects, setContextObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    loadRiskCategories();
  }, []);

  useEffect(() => {
    if (data.contextType) {
      loadContextObjects(data.contextType);
    }
  }, [data.contextType]);

  const loadRiskCategories = async () => {
    try {
      const categories = await riskCategoryService.getAll();
      setRiskCategories(categories);
    } catch (err) {
      console.error('Error loading risk categories:', err);
    }
  };

  const loadContextObjects = async (contextType: string) => {
    try {
      setLoading(true);
      let objects: any[] = [];

      switch (contextType) {
        case 'PROCESS':
          objects = await processService.getAll();
          break;
        case 'ORG_UNIT':
        case 'LOCATION':
          objects = await organizationalUnitService.getAll();
          break;
        case 'ASSET':
        case 'APPLICATION':
          objects = await assetService.getAll();
          break;
        case 'SUPPLIER':
          objects = await vendorService.getAll();
          break;
        default:
          objects = [];
      }

      setContextObjects(objects);
    } catch (err) {
      console.error('Error loading context objects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = riskCategories.find(c => c.id === parseInt(categoryId));
    if (category) {
      onUpdate({
        riskCategoryId: category.id,
        contextType: category.code
      });
    }
  };

  const handleContextObjectChange = (objectId: string) => {
    const obj = contextObjects.find(o => o.id === parseInt(objectId));
    if (obj) {
      onUpdate({
        contextId: obj.id,
        contextName: obj.name || obj.unitName
      });
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!data.riskCategoryId) newErrors.riskCategoryId = 'Risk category is required';
    if (!data.contextId) newErrors.contextId = 'Context object is required';
    if (!data.assessmentName?.trim()) newErrors.assessmentName = 'Assessment name is required';
    if (!data.assessorName?.trim()) newErrors.assessorName = 'Assessor name is required';
    if (!data.assessorEmail?.trim()) newErrors.assessorEmail = 'Assessor email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      console.log('Creating assessment with data:', {
        riskCategoryId: data.riskCategoryId,
        contextType: data.contextType,
        contextId: data.contextId,
        contextName: data.contextName,
        assessmentName: data.assessmentName,
        description: data.description,
        assessorName: data.assessorName,
        assessorEmail: data.assessorEmail,
        assessmentDate: data.assessmentDate,
        riskThreshold: data.riskThreshold
      });

      // In demo mode, use mock data instead of calling the backend
      if (isDemoMode) {
        console.log('🎬 Demo Mode: Using mock assessment ID');
        // Simulate a short delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Use a mock ID for demo purposes
        setAssessmentId(999);
        onNext();
        return;
      }

      // Call backend API to create draft assessment
      const response = await fetch('http://localhost:8080/api/risk-assessments/wizard/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riskCategoryId: data.riskCategoryId,
          contextType: data.contextType,
          contextId: data.contextId,
          contextName: data.contextName,
          assessmentName: data.assessmentName,
          description: data.description,
          assessorName: data.assessorName,
          assessorEmail: data.assessorEmail,
          assessmentDate: data.assessmentDate,
          riskThreshold: data.riskThreshold
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to create assessment: ${errorText}`);
      }

      const result = await response.json();
      console.log('Assessment created successfully:', result);
      setAssessmentId(result.id);
      onNext();
    } catch (err) {
      console.error('Error creating assessment:', err);
      alert(`Failed to create assessment. Please try again. Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Create New Risk Assessment
              {data.riskCategoryId && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                  🎬 Demo Mode
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 1 of 7: Define assessment scope and context</p>
          </div>
          <button
            onClick={onCancel}
            className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="space-y-4">
          {/* Risk Category Selection */}
          <div className="border border-gray-200 rounded-sm p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Risk Category <span className="text-red-500">*</span>
            </label>
            <select
              value={data.riskCategoryId || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Select risk category...</option>
              {riskCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.riskCategoryId && <p className="text-xs text-red-500 mt-1">{errors.riskCategoryId}</p>}
          </div>

          {/* Context Object Selection */}
          {data.contextType && (
            <div className="border border-gray-200 rounded-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Context Object <span className="text-red-500">*</span>
              </label>
              <select
                value={data.contextId || ''}
                onChange={(e) => handleContextObjectChange(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                disabled={loading}
              >
                <option value="">Select {data.contextType.toLowerCase()}...</option>
                {contextObjects.map(obj => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name || obj.unitName || obj.processName}
                  </option>
                ))}
              </select>
              {errors.contextId && <p className="text-xs text-red-500 mt-1">{errors.contextId}</p>}
            </div>
          )}

          {/* Assessment Details */}
          <div className="border border-gray-200 rounded-sm p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Assessment Details</h3>

            <div>
              <label className="block text-xs text-gray-700 mb-1">
                Assessment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.assessmentName}
                onChange={(e) => onUpdate({ assessmentName: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="e.g., Q4 2025 Process Risk Assessment"
              />
              {errors.assessmentName && <p className="text-xs text-red-500 mt-1">{errors.assessmentName}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Brief description of the assessment scope and objectives..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Assessor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.assessorName}
                  onChange={(e) => onUpdate({ assessorName: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                {errors.assessorName && <p className="text-xs text-red-500 mt-1">{errors.assessorName}</p>}
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Assessor Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={data.assessorEmail}
                  onChange={(e) => onUpdate({ assessorEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                {errors.assessorEmail && <p className="text-xs text-red-500 mt-1">{errors.assessorEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Assessment Date</label>
                <input
                  type="date"
                  value={data.assessmentDate}
                  onChange={(e) => onUpdate({ assessmentDate: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Risk Threshold</label>
                <input
                  type="number"
                  value={data.riskThreshold}
                  onChange={(e) => onUpdate({ riskThreshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  min="1"
                  max="25"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">Risks above this score require treatment plans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-3">
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Next: Context Overview'}
          </button>
        </div>
      </div>
    </>
  );
}

