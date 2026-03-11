'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { processService } from '@/services/processService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { OrganizationalUnit } from '@/types/organizationalUnit';
import { ProcessStatus } from '@/types/process';
import {
  CogIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function NewProcessPage() {
  const router = useRouter();
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    processName: '',
    processCode: '',
    description: '',
    organizationalUnitId: '',
    processOwner: '',
    status: ProcessStatus.DRAFT
  });

  useEffect(() => {
    loadOrganizationalUnits();
  }, []);

  const loadOrganizationalUnits = async () => {
    try {
      const units = await organizationalUnitService.getAll();
      setOrganizationalUnits(units);
    } catch (error) {
      console.error('Error loading organizational units:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.processName.trim()) {
      newErrors.processName = 'Process name is required';
    }

    if (!formData.organizationalUnitId) {
      newErrors.organizationalUnitId = 'Organizational unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await processService.create({
        processName: formData.processName,
        processCode: formData.processCode || undefined,
        description: formData.description || undefined,
        organizationalUnitId: parseInt(formData.organizationalUnitId),
        processOwner: formData.processOwner || undefined,
        status: formData.status
      });

      router.push('/libraries/processes');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create process. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/libraries/processes');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/processes"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Processes
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Process</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new business process in the master library
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Info Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CogIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-blue-900">
                  BCM Principle: Process Criticality
                </h3>
                <div className="mt-0.5 text-xs text-blue-800">
                  <p>
                    Process criticality is <strong>determined during BIA analysis</strong>, not at creation.
                    After creating this process, conduct a BIA to establish its MTPD, RTO, and criticality tier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="processName" className="block text-xs font-medium text-gray-700 mb-1">
                      Process Name *
                    </label>
                    <input
                      type="text"
                      id="processName"
                      name="processName"
                      required
                      value={formData.processName}
                      onChange={(e) => handleChange('processName', e.target.value)}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.processName ? 'border-red-300' : ''}`}
                      placeholder="e.g., Payroll Processing"
                    />
                    {errors.processName && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.processName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="processCode" className="block text-xs font-medium text-gray-700 mb-1">
                      Process Code
                    </label>
                    <input
                      type="text"
                      id="processCode"
                      name="processCode"
                      value={formData.processCode}
                      onChange={(e) => handleChange('processCode', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., PROC-001 (auto-generated if blank)"
                    />
                    <p className="mt-0.5 text-[10px] text-gray-500">Leave blank for auto-generation</p>
                  </div>

                  <div>
                    <label htmlFor="organizationalUnitId" className="block text-xs font-medium text-gray-700 mb-1">
                      Organizational Unit *
                    </label>
                    <select
                      id="organizationalUnitId"
                      name="organizationalUnitId"
                      required
                      value={formData.organizationalUnitId}
                      onChange={(e) => handleChange('organizationalUnitId', e.target.value)}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.organizationalUnitId ? 'border-red-300' : ''}`}
                    >
                      <option value="">Select Organizational Unit</option>
                      {organizationalUnits.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unitName} ({unit.unitCode})
                        </option>
                      ))}
                    </select>
                    {errors.organizationalUnitId && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.organizationalUnitId}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Brief description of the business process and its purpose"
                    />
                  </div>

                  <div>
                    <label htmlFor="processOwner" className="block text-xs font-medium text-gray-700 mb-1">
                      Process Owner
                    </label>
                    <input
                      type="text"
                      id="processOwner"
                      name="processOwner"
                      value={formData.processOwner}
                      onChange={(e) => handleChange('processOwner', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as ProcessStatus)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={ProcessStatus.DRAFT}>Draft - Being defined, not yet official</option>
                      <option value={ProcessStatus.ACTIVE}>Active - Officially recognized and operational</option>
                      <option value={ProcessStatus.ARCHIVED}>Archived - No longer in use</option>
                    </select>
                    <p className="mt-0.5 text-[10px] text-gray-500">Process lifecycle state</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="ml-2 text-xs text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-sm text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1" />
                    Create Process
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
