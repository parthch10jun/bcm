'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface FormData {
  planName: string;
  businessService: string;
  planType: 'BCP' | 'DRP' | 'BRP';
  planOwner: string;
  deputyOwner: string;
  locations: string[];
  reviewFrequency: 'Annual' | 'Semi-Annual' | 'Quarterly';
}

interface FormErrors {
  planName?: string;
  businessService?: string;
  planOwner?: string;
  deputyOwner?: string;
  locations?: string;
}

export default function CreateBCPPage() {
  const router = useRouter();
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    planName: 'Customer Service Operations BCP',
    businessService: 'BIA-001',
    planType: 'BCP',
    planOwner: 'user-1',
    deputyOwner: 'user-2',
    locations: ['loc-1'],
    reviewFrequency: 'Annual'
  });

  // Mock data for dropdowns
  const businessServices = [
    { id: 'BIA-001', name: 'Customer Service Operations', criticality: 'Tier 1' },
    { id: 'BIA-002', name: 'Payment Processing', criticality: 'Tier 1' },
    { id: 'BIA-003', name: 'Trading Operations', criticality: 'Tier 1' },
    { id: 'BIA-004', name: 'Data Center Operations', criticality: 'Tier 1' },
    { id: 'BIA-005', name: 'Branch Banking Services', criticality: 'Tier 2' }
  ];

  const users = [
    { id: 'U001', name: 'John Doe', title: 'BCM Manager' },
    { id: 'U002', name: 'Sarah Mitchell', title: 'Operations Director' },
    { id: 'U003', name: 'Mike Johnson', title: 'IT Director' },
    { id: 'U004', name: 'Emily Davis', title: 'Risk Manager' },
    { id: 'U005', name: 'David Wilson', title: 'Compliance Officer' }
  ];

  const availableLocations = [
    'Headquarters - Riyadh',
    'Branch Office - Jeddah',
    'Data Center - Dubai',
    'Regional Hub - London'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = formData.locations.includes(location)
      ? formData.locations.filter(l => l !== location)
      : [...formData.locations, location];
    handleInputChange('locations', newLocations);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    }

    if (!formData.businessService) {
      newErrors.businessService = 'Please select a business service from BIA';
    }

    if (!formData.planOwner) {
      newErrors.planOwner = 'Plan owner is required';
    }

    if (!formData.deputyOwner) {
      newErrors.deputyOwner = 'Deputy owner is required';
    } else if (formData.deputyOwner === formData.planOwner) {
      newErrors.deputyOwner = 'Deputy owner must be different from plan owner';
    }

    if (formData.locations.length === 0) {
      newErrors.locations = 'Select at least one applicable location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    // Save without validation
    console.log('Saving draft:', formData);
    // Show toast notification
    alert('Draft saved successfully');
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save and navigate to next screen
      console.log('Form valid, proceeding to next screen:', formData);
      router.push('/it-dr-plans/create/scope');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('Are you sure? Unsaved changes will be lost.')) {
        router.push('/it-dr-plans');
      }
    } else {
      router.push('/it-dr-plans');
    }
  };

  const characterCount = formData.planName.length;
  const maxCharacters = 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                Create Business Continuity Plan
              </h1>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                    step === 1
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 1 of 12: Plan Metadata & Control</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          {/* PLAN DETAILS Section */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Plan Details
              </h3>
            </div>
            <div className="px-4 py-4 space-y-4">
              {/* Plan Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Plan Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => handleInputChange('planName', e.target.value)}
                  maxLength={maxCharacters}
                  placeholder="e.g., Customer Service Operations BCP"
                  className={`block w-full h-[32px] px-3 text-xs border rounded-sm focus:outline-none focus:ring-1 ${
                    errors.planName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.planName && (
                    <p className="text-[10px] text-red-600">{errors.planName}</p>
                  )}
                  <p className={`text-[10px] ml-auto ${
                    characterCount >= maxCharacters ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {characterCount}/{maxCharacters}
                  </p>
                </div>
              </div>

              {/* Business Service / Process */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Business Service / Process <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.businessService}
                  onChange={(e) => handleInputChange('businessService', e.target.value)}
                  className={`block w-full h-[32px] px-2 text-xs border rounded-sm focus:outline-none focus:ring-1 bg-white ${
                    errors.businessService
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
                  }`}
                >
                  <option value="">Select from BIA</option>
                  {businessServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.criticality})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1 mt-1">
                  <InformationCircleIcon className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-[10px] text-gray-500">
                    Only BIA-approved critical services are available
                  </p>
                </div>
                {errors.businessService && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.businessService}</p>
                )}
              </div>

              {/* Plan Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Plan Type <span className="text-red-600">*</span>
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="BCP"
                      checked={formData.planType === 'BCP'}
                      onChange={(e) => handleInputChange('planType', e.target.value as 'BCP')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">Business Continuity Plan</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="DRP"
                      checked={formData.planType === 'DRP'}
                      onChange={(e) => handleInputChange('planType', e.target.value as 'DRP')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">IT Disaster Recovery Plan (DRP)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="BRP"
                      checked={formData.planType === 'BRP'}
                      onChange={(e) => handleInputChange('planType', e.target.value as 'BRP')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">Business Recovery Plan (BRP)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* OWNERSHIP Section */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Ownership
              </h3>
            </div>
            <div className="px-4 py-4 space-y-4">
              {/* Plan Owner */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Plan Owner <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.planOwner}
                  onChange={(e) => handleInputChange('planOwner', e.target.value)}
                  className={`block w-full h-[32px] px-2 text-xs border rounded-sm focus:outline-none focus:ring-1 bg-white ${
                    errors.planOwner
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
                  }`}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.title}
                    </option>
                  ))}
                </select>
                {errors.planOwner && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.planOwner}</p>
                )}
              </div>

              {/* Deputy Owner */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Deputy Owner <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.deputyOwner}
                  onChange={(e) => handleInputChange('deputyOwner', e.target.value)}
                  className={`block w-full h-[32px] px-2 text-xs border rounded-sm focus:outline-none focus:ring-1 bg-white ${
                    errors.deputyOwner
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
                  }`}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.title}
                    </option>
                  ))}
                </select>
                {errors.deputyOwner && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.deputyOwner}</p>
                )}
              </div>
            </div>
          </div>

          {/* LOCATION & SCOPE Section */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Location & Scope
              </h3>
            </div>
            <div className="px-4 py-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Applicable Locations <span className="text-red-600">*</span>
                </label>
                <div className="space-y-1.5">
                  {availableLocations.map(location => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.locations.includes(location)}
                        onChange={() => handleLocationToggle(location)}
                        className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-xs text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
                {errors.locations && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.locations}</p>
                )}
              </div>
            </div>
          </div>

          {/* GOVERNANCE Section */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Governance
              </h3>
            </div>
            <div className="px-4 py-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Review Frequency
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Annual"
                      checked={formData.reviewFrequency === 'Annual'}
                      onChange={(e) => handleInputChange('reviewFrequency', e.target.value as 'Annual')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">Annual (Required)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Semi-Annual"
                      checked={formData.reviewFrequency === 'Semi-Annual'}
                      onChange={(e) => handleInputChange('reviewFrequency', e.target.value as 'Semi-Annual')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">Semi-Annual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Quarterly"
                      checked={formData.reviewFrequency === 'Quarterly'}
                      onChange={(e) => handleInputChange('reviewFrequency', e.target.value as 'Quarterly')}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-2 text-xs text-gray-700">Quarterly</span>
                  </label>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-600" />
                  <p className="text-[10px] text-amber-700">
                    requires minimum annual review
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Populated Fields */}
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
            <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Auto-Generated Information
            </h4>
            <div className="grid grid-cols-4 gap-3 text-[10px]">
              <div>
                <span className="text-gray-500">Version:</span>
                <span className="ml-1 text-gray-900 font-medium">v1.0</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-1 text-gray-900 font-medium">Draft</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-1 text-gray-900 font-medium">{new Date().toISOString().split('T')[0]}</span>
              </div>
              <div>
                <span className="text-gray-500">By:</span>
                <span className="ml-1 text-gray-900 font-medium">Current User</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-3 py-2 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-3 py-2 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Save Draft
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-2 border border-transparent rounded-sm text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Next: Scope →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

