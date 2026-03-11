'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { biaStore } from '@/store/bia-store';
import { Service } from '@/types/bia';
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

interface ServiceFormData {
  name: string;
  description: string;
  serviceOwner: string;
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

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
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
    customerCount: 0,
    customerSegments: [],
    requiredProcessIds: [],
    slas: [],
    regulatoryRequirements: []
  });

  useEffect(() => {
    const loadService = () => {
      biaStore.initializeSampleData();
      setAvailableProcesses(biaStore.getAllProcesses());

      const foundService = biaStore.getAllServices().find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
        setFormData({
          name: foundService.name,
          description: foundService.description,
          serviceOwner: foundService.serviceOwner,
          // relationshipManager: foundService.relationshipManager, // Property not available in Service interface
          customerCount: foundService.customerCount,
          customerSegments: [...foundService.customerSegments],
          requiredProcessIds: [...foundService.requiredProcessIds],
          slas: foundService.slas ? [...foundService.slas] : [],
          regulatoryRequirements: foundService.regulatoryRequirements ? [...foundService.regulatoryRequirements] : []
        });
      }
      setLoading(false);
    };

    loadService();
  }, [serviceId]);

  const handleInputChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addCustomerSegment = () => {
    if (newSegment.trim() && !formData.customerSegments.includes(newSegment.trim())) {
      setFormData(prev => ({
        ...prev,
        customerSegments: [...prev.customerSegments, newSegment.trim()]
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

  const toggleProcess = (processId: string) => {
    setFormData(prev => ({
      ...prev,
      requiredProcessIds: prev.requiredProcessIds.includes(processId)
        ? prev.requiredProcessIds.filter(id => id !== processId)
        : [...prev.requiredProcessIds, processId]
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
      // TODO: Implement actual service update logic
      console.log('Updating service:', serviceId, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/libraries/services');
    } catch (error) {
      console.error('Error updating service:', error);
      setErrors({ submit: 'Failed to update service. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading service...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="px-6 py-6">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Service not found</h3>
          <p className="mt-1 text-sm text-gray-500">The service you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              href="/libraries/services"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProcesses = getFilteredProcesses();

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Link
                href="/libraries/services"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Services Library
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Update service information in the master library
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                          errors.name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="Enter service name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="serviceOwner" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Owner *
                      </label>
                      <input
                        type="text"
                        id="serviceOwner"
                        value={formData.serviceOwner}
                        onChange={(e) => handleInputChange('serviceOwner', e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                          errors.serviceOwner 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="Enter service owner name"
                      />
                      {errors.serviceOwner && (
                        <p className="mt-1 text-sm text-red-600">{errors.serviceOwner}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description *
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.description
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      placeholder="Describe the service and its purpose"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="customerCount" className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Count
                      </label>
                      <input
                        type="number"
                        id="customerCount"
                        min="0"
                        value={formData.customerCount}
                        onChange={(e) => handleInputChange('customerCount', parseInt(e.target.value) || 0)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Number of customers served"
                      />
                    </div>
                  </div>


                </div>
              </div>

              {/* Customer Segments */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSegment}
                        onChange={(e) => setNewSegment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomerSegment())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Add customer segment (e.g., Enterprise, SMB, Consumer)"
                      />
                      <button
                        type="button"
                        onClick={addCustomerSegment}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {formData.customerSegments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.customerSegments.map((segment, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {segment}
                            <button
                              type="button"
                              onClick={() => removeCustomerSegment(segment)}
                              className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {errors.customerSegments && (
                      <p className="text-sm text-red-600">{errors.customerSegments}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Level Agreements */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Service Level Agreements</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {/* Add SLA Form */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metric
                      </label>
                      <input
                        type="text"
                        value={newSLA.metric}
                        onChange={(e) => setNewSLA(prev => ({ ...prev, metric: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Uptime, Response Time"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target
                      </label>
                      <input
                        type="text"
                        value={newSLA.target}
                        onChange={(e) => setNewSLA(prev => ({ ...prev, target: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 99.9%, < 2 seconds"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Penalty
                        </label>
                        <input
                          type="text"
                          value={newSLA.penalty}
                          onChange={(e) => setNewSLA(prev => ({ ...prev, penalty: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 5% credit, $1000 fine"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSLA}
                        className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* SLA List */}
                  {formData.slas.length > 0 ? (
                    <div className="space-y-3">
                      {formData.slas.map((sla, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Metric</span>
                                <p className="text-sm font-medium text-gray-900">{sla.metric}</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target</span>
                                <p className="text-sm font-medium text-gray-900">{sla.target}</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Penalty</span>
                                <p className="text-sm font-medium text-gray-900">{sla.penalty}</p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSLA(index)}
                            className="ml-4 text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No SLAs defined</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add service level agreements to define performance commitments.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Level Agreements */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Service Level Agreements</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {/* Add SLA Form */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metric
                      </label>
                      <input
                        type="text"
                        value={newSLA.metric}
                        onChange={(e) => setNewSLA(prev => ({ ...prev, metric: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Uptime, Response Time"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target
                      </label>
                      <input
                        type="text"
                        value={newSLA.target}
                        onChange={(e) => setNewSLA(prev => ({ ...prev, target: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 99.9%, < 2 seconds"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Penalty
                        </label>
                        <input
                          type="text"
                          value={newSLA.penalty}
                          onChange={(e) => setNewSLA(prev => ({ ...prev, penalty: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 5% credit, $1000 fine"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSLA}
                        className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* SLA List */}
                  {formData.slas.length > 0 ? (
                    <div className="space-y-3">
                      {formData.slas.map((sla, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Metric</span>
                                <p className="text-sm font-medium text-gray-900">{sla.metric}</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target</span>
                                <p className="text-sm font-medium text-gray-900">{sla.target}</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Penalty</span>
                                <p className="text-sm font-medium text-gray-900">{sla.penalty}</p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSLA(index)}
                            className="ml-4 text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No SLAs defined</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add service level agreements to define performance commitments.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Regulatory Requirements */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Regulatory Requirements</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Select all regulatory frameworks and compliance requirements that apply to this service.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {REGULATORY_OPTIONS.map((requirement) => (
                      <label
                        key={requirement}
                        className="relative flex items-start py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={formData.regulatoryRequirements.includes(requirement)}
                            onChange={() => toggleRegulatoryRequirement(requirement)}
                            className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <span className="font-medium text-gray-900">{requirement}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.regulatoryRequirements.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-sm font-medium text-red-900 mb-2">Selected Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.regulatoryRequirements.map((requirement) => (
                          <span
                            key={requirement}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {requirement}
                            <button
                              type="button"
                              onClick={() => toggleRegulatoryRequirement(requirement)}
                              className="ml-1 text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/libraries/services"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Update Service
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
    </div>
  );
}
