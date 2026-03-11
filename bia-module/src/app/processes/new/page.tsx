'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BIAPageLayout from '@/components/BIAPageLayout';
import { biaStore } from '@/store/bia-store';
import { Department, BusinessProcess, ImpactCategory, TimeInterval } from '@/types/bia';
import { 
  CogIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function NewProcessPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    processOwner: '',
    bcmChampion: '',
    criticalityScore: 1,
    peakTimes: '',
    criticalDeadlines: '',
    minimumStaffRequired: 0,
    requiredSkills: [] as string[],
    keyApplications: [] as string[],
    criticalVendors: [] as string[],
    singlePointsOfFailure: [] as string[],
    interProcessDependencies: [] as string[]
  });

  useEffect(() => {
    setDepartments(biaStore.getAllDepartments());
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Process name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Process description is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department selection is required';
    }
    
    if (!formData.processOwner.trim()) {
      newErrors.processOwner = 'Process owner is required';
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
      const newProcess: BusinessProcess = {
        id: `proc-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        biaRecordId: '',
        processOwner: formData.processOwner,
        processType: 'Core' as const,
        productServiceIds: [],
        impactAssessmentGrid: {} as any, // Will be populated during BIA
        peakTimes: [],
        criticalDeadlines: [],
        mtd: '',
        rto: '',
        rpo: '',
        mbco: '',
        dependencies: [],
        staffRequirements: {
          minimumCount: formData.minimumStaffRequired,
          requiredSkills: formData.requiredSkills,
          keyPersonnel: []
        } as any,
        applicationRequirements: [],
        itInfrastructureRequirements: [],
        vitalRecords: [],
        spofAssessment: {
          hasKeyPersonDependency: false,
          hasUndocumentedProcesses: false,
          hasSingleVendorDependency: false,
          hasUnprotectedData: false,
          hasHardwareSpof: false,
          otherSpofs: [],
          overallRiskLevel: 'Low' as const,
          mitigationPlan: ''
        },
        criticalityScore: formData.criticalityScore,
        priorityRank: 1,
        isComplete: false
      };

      // Add to store (in a real app, this would be an API call)
      // biaStore.createProcess(newProcess); // TODO: Fix store compatibility with BusinessProcess

      // Redirect to processes list
      router.push('/libraries/processes');
    } catch (error) {
      console.error('Error creating process:', error);
      setErrors({ submit: 'Failed to create process. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleArrayFieldChange = (field: keyof typeof formData, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  return (
    <BIAPageLayout
      title="Create New Process"
      subtitle="Add a new business process for impact analysis"
      actions={
        <button
          onClick={() => router.back()}
          className="bcm-button-secondary"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </button>
      }
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bcm-card">
            <div className="bcm-card-header">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Process Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`mt-1 bcm-input ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g., Customer Payment Processing"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className={`mt-1 bcm-input ${errors.department ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Process Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`mt-1 bcm-input ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the purpose and scope of this process..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Process Owner *
                  </label>
                  <input
                    type="text"
                    value={formData.processOwner}
                    onChange={(e) => setFormData(prev => ({ ...prev, processOwner: e.target.value }))}
                    className={`mt-1 bcm-input ${errors.processOwner ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.processOwner && (
                    <p className="mt-1 text-sm text-red-600">{errors.processOwner}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    BCM Champion
                  </label>
                  <input
                    type="text"
                    value={formData.bcmChampion}
                    onChange={(e) => setFormData(prev => ({ ...prev, bcmChampion: e.target.value }))}
                    className="mt-1 bcm-input"
                    placeholder="Jane Smith"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Process Classification */}
          <div className="bcm-card">
            <div className="bcm-card-header">
              <h3 className="text-lg font-medium text-gray-900">Process Classification</h3>
              <p className="text-sm text-gray-500">Basic categorization - detailed impact analysis will be conducted separately</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Initial Priority Level
                </label>
                <select
                  value={formData.criticalityScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, criticalityScore: parseInt(e.target.value) }))}
                  className="mt-1 bcm-input"
                >
                  <option value={1}>1 - Low Priority</option>
                  <option value={2}>2 - Medium-Low Priority</option>
                  <option value={3}>3 - Medium Priority</option>
                  <option value={4}>4 - High Priority</option>
                  <option value={5}>5 - Critical Priority</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  This is a preliminary assessment. Detailed impact analysis and recovery objectives will be determined during the BIA process.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bcm-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bcm-button-primary"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Create Process
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.submit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </BIAPageLayout>
  );
}
