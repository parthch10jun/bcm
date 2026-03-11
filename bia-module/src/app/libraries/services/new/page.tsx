'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CogIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { biaStore } from '@/store/bia-store';



interface ServiceFormData {
  name: string;
  description: string;
  serviceOwner: string;
  relationshipManager: string;
  customerCount: number;
  customerSegments: string[];
  requiredProcessIds: string[];
  slas: {
    metric: string;
    target: string;
    penalty: string;
  }[];
  regulatoryRequirements: string[];
}

// Predefined regulatory requirements
const REGULATORY_OPTIONS = [
  'SOX (Sarbanes-Oxley)',
  'GDPR (General Data Protection Regulation)',
  'HIPAA (Health Insurance Portability)',
  'PCI DSS (Payment Card Industry)',
  'ISO 27001 (Information Security)',
  'SOC 2 (Service Organization Control)',
  'FISMA (Federal Information Security)',
  'NIST Cybersecurity Framework',
  'Basel III (Banking Regulation)',
  'MiFID II (Markets in Financial Instruments)',
  'CCPA (California Consumer Privacy Act)',
  'PIPEDA (Personal Information Protection)',
  'FedRAMP (Federal Risk Authorization)',
  'COSO (Committee of Sponsoring Organizations)',
  'COBIT (Control Objectives for IT)',
  'Other'
];

interface FormErrors {
  [key: string]: string;
}

export default function NewServiceLibraryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showProcessSelector, setShowProcessSelector] = useState(false);
  const [processSearchTerm, setProcessSearchTerm] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [availableProcesses, setAvailableProcesses] = useState<any[]>([]);
  const [newSLA, setNewSLA] = useState({ metric: '', target: '', penalty: '' });

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    serviceOwner: '',
    relationshipManager: '',
    customerCount: 0,
    customerSegments: [],
    requiredProcessIds: [],
    slas: [],
    regulatoryRequirements: []
  });

  // Load processes from BIA store
  useEffect(() => {
    biaStore.initializeSampleData();
    setAvailableProcesses(biaStore.getAllProcesses());
  }, []);

  // Process management functions
  const addProcess = (processId: string) => {
    if (!formData.requiredProcessIds.includes(processId)) {
      setFormData(prev => ({
        ...prev,
        requiredProcessIds: [...prev.requiredProcessIds, processId]
      }));
    }
    setShowProcessSelector(false);
    setProcessSearchTerm('');
  };

  const removeProcess = (processId: string) => {
    setFormData(prev => ({
      ...prev,
      requiredProcessIds: prev.requiredProcessIds.filter(id => id !== processId)
    }));
  };

  const getSelectedProcesses = () => {
    return availableProcesses.filter(process =>
      formData.requiredProcessIds.includes(process.id)
    );
  };

  const getFilteredProcesses = () => {
    return availableProcesses.filter(process =>
      !formData.requiredProcessIds.includes(process.id) &&
      (process.name.toLowerCase().includes(processSearchTerm.toLowerCase()) ||
       (process.department && biaStore.getDepartment(process.department)?.name.toLowerCase().includes(processSearchTerm.toLowerCase())) ||
       process.processOwner.toLowerCase().includes(processSearchTerm.toLowerCase()))
    );
  };

  const addCustomerSegment = () => {
    if (newSegment && !formData.customerSegments.includes(newSegment)) {
      setFormData(prev => ({
        ...prev,
        customerSegments: [...prev.customerSegments, newSegment]
      }));
      setNewSegment('');
    }
  };

  const removeCustomerSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      customerSegments: prev.customerSegments.filter(s => s !== segment)
    }));
  };

  // SLA management functions
  const addSLA = () => {
    if (newSLA.metric && newSLA.target && newSLA.penalty) {
      setFormData(prev => ({
        ...prev,
        slas: [...prev.slas, { ...newSLA }]
      }));
      setNewSLA({ metric: '', target: '', penalty: '' });
    }
  };

  const removeSLA = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slas: prev.slas.filter((_, i) => i !== index)
    }));
  };

  // Regulatory requirements management
  const toggleRegulatoryRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      regulatoryRequirements: prev.regulatoryRequirements.includes(requirement)
        ? prev.regulatoryRequirements.filter(r => r !== requirement)
        : [...prev.regulatoryRequirements, requirement]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    }

    if (!formData.serviceOwner.trim()) {
      newErrors.serviceOwner = 'Service owner is required';
    }

    if (!formData.relationshipManager.trim()) {
      newErrors.relationshipManager = 'Relationship manager is required';
    }

    if (formData.customerSegments.length === 0) {
      newErrors.customerSegments = 'At least one customer segment is required';
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
    setErrors({});

    try {
      // TODO: Integrate with BIA store
      console.log('Creating service:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/libraries/services');
    } catch (error) {
      setErrors({ submit: 'Failed to create service. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/services"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Services Library
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Service</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new customer-facing service in the master library
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="e.g., Online Banking Portal"
                  />
                  {errors.name && (
                    <p className="mt-0.5 text-[10px] text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Service Owner *
                  </label>
                  <input
                    type="text"
                    value={formData.serviceOwner}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceOwner: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.serviceOwner ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="John Doe"
                  />
                  {errors.serviceOwner && (
                    <p className="mt-0.5 text-[10px] text-red-600">{errors.serviceOwner}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relationship Manager *
                  </label>
                  <input
                    type="text"
                    value={formData.relationshipManager}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipManager: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.relationshipManager ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Jane Smith"
                  />
                  {errors.relationshipManager && (
                    <p className="mt-0.5 text-[10px] text-red-600">{errors.relationshipManager}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Customer Count
                  </label>
                  <input
                    type="number"
                    value={formData.customerCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerCount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="10000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Service Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Describe the service and its value to customers..."
                  />
                  {errors.description && (
                    <p className="mt-0.5 text-[10px] text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Customer Segments</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomerSegment())}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Add customer segment..."
                />
                <button
                  type="button"
                  onClick={addCustomerSegment}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {formData.customerSegments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.customerSegments.map((segment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {segment}
                      <button
                        type="button"
                        onClick={() => removeCustomerSegment(segment)}
                        className="ml-1.5 text-gray-600 hover:text-gray-800"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.customerSegments && (
                <p className="mt-2 text-[10px] text-red-600">{errors.customerSegments}</p>
              )}
            </div>
          </div>

          {/* Process Dependencies */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Process Dependencies</h3>
                <button
                  type="button"
                  onClick={() => setShowProcessSelector(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  Link Process
                </button>
              </div>
            </div>
            <div className="p-4">
              {getSelectedProcesses().length > 0 ? (
                <div className="space-y-2">
                  {getSelectedProcesses().map((process) => {
                    const department = biaStore.getDepartment(process.department);
                    return (
                      <div
                        key={process.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CogIcon className="h-4 w-4 text-gray-600" />
                            <div>
                              <h4 className="text-xs font-medium text-gray-900">{process.name}</h4>
                              <p className="text-[10px] text-gray-500">
                                {department?.name} • Owner: {process.processOwner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProcess(process.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CogIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-xs font-medium text-gray-900">No processes linked</h3>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Link processes that this service depends on for operation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Process Selector Modal */}
          {showProcessSelector && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border border-gray-200 w-11/12 max-w-2xl rounded-sm bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Select Processes</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProcessSelector(false);
                      setProcessSearchTerm('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={processSearchTerm}
                    onChange={(e) => setProcessSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm text-xs bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Search processes by name, department, or owner..."
                  />
                </div>

                {/* Process List */}
                <div className="max-h-96 overflow-y-auto">
                  {getFilteredProcesses().length > 0 ? (
                    <div className="space-y-2">
                      {getFilteredProcesses().map((process) => {
                        const department = biaStore.getDepartment(process.department);
                        return (
                          <div
                            key={process.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
                            onClick={() => addProcess(process.id)}
                          >
                            <div className="flex items-center gap-2">
                              <CogIcon className="h-4 w-4 text-gray-600" />
                              <div>
                                <h4 className="text-xs font-medium text-gray-900">{process.name}</h4>
                                <p className="text-[10px] text-gray-500">
                                  {department?.name} • Owner: {process.processOwner}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addProcess(process.id);
                              }}
                              className="inline-flex items-center px-2.5 py-1 border border-transparent text-[10px] font-medium rounded-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
                            >
                              Add
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CogIcon className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-xs font-medium text-gray-900">No processes found</h3>
                      <p className="mt-1 text-[10px] text-gray-500">
                        {processSearchTerm ? 'Try adjusting your search terms.' : 'No processes available to link.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Service Level Agreements */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Service Level Agreements</h3>
            </div>
            <div className="p-4">
              {/* Add SLA Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Metric
                  </label>
                  <input
                    type="text"
                    value={newSLA.metric}
                    onChange={(e) => setNewSLA(prev => ({ ...prev, metric: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Uptime, Response Time"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    value={newSLA.target}
                    onChange={(e) => setNewSLA(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 99.9%, < 2 seconds"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Penalty
                    </label>
                    <input
                      type="text"
                      value={newSLA.penalty}
                      onChange={(e) => setNewSLA(prev => ({ ...prev, penalty: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., 5% credit, $1000 fine"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSLA}
                    className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* SLA List */}
              {formData.slas.length > 0 ? (
                <div className="space-y-2">
                  {formData.slas.map((sla, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm"
                    >
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Metric</span>
                            <p className="text-xs font-medium text-gray-900">{sla.metric}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Target</span>
                            <p className="text-xs font-medium text-gray-900">{sla.target}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Penalty</span>
                            <p className="text-xs font-medium text-gray-900">{sla.penalty}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSLA(index)}
                        className="ml-4 text-gray-600 hover:text-gray-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-xs font-medium text-gray-900">No SLAs defined</h3>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Add service level agreements to define performance commitments.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Regulatory Requirements */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Regulatory Requirements</h3>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-gray-600 mb-4">
                Select all regulatory frameworks and compliance requirements that apply to this service.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {REGULATORY_OPTIONS.map((requirement) => (
                  <label
                    key={requirement}
                    className="relative flex items-start py-2 px-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center h-4">
                      <input
                        type="checkbox"
                        checked={formData.regulatoryRequirements.includes(requirement)}
                        onChange={() => toggleRegulatoryRequirement(requirement)}
                        className="focus:ring-gray-900 h-3.5 w-3.5 text-gray-900 border-gray-300 rounded-sm"
                      />
                    </div>
                    <div className="ml-2 text-xs">
                      <span className="font-medium text-gray-900">{requirement}</span>
                    </div>
                  </label>
                ))}
              </div>

              {formData.regulatoryRequirements.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <h4 className="text-xs font-medium text-gray-900 mb-2">Selected Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.regulatoryRequirements.map((requirement) => (
                      <span
                        key={requirement}
                        className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {requirement}
                        <button
                          type="button"
                          onClick={() => toggleRegulatoryRequirement(requirement)}
                          className="ml-1.5 text-gray-600 hover:text-gray-800"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Link
              href="/libraries/services"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-3.5 w-3.5 mr-1" />
                  Create Service
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-3">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
                <div className="ml-2">
                  <h3 className="text-xs font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-[10px] text-red-700">
                    <p>{errors.submit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
