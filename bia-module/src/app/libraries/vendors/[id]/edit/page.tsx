'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon, CubeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { vendorService } from '@/services/vendorService';
import { VendorStatus, ServiceType, getVendorStatusLabel, getServiceTypeLabel } from '@/types/vendor';

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    vendorName: '',
    status: VendorStatus.ACTIVE,
    serviceType: '' as ServiceType | '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    recoveryTimeCapability: '',
    contractStartDate: '',
    contractEndDate: '',
    website: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadVendor();
  }, [vendorId]);

  const loadVendor = async () => {
    try {
      setLoading(true);
      const vendor = await vendorService.getById(Number(vendorId));
      
      setFormData({
        vendorName: vendor.vendorName || '',
        status: vendor.status || VendorStatus.ACTIVE,
        serviceType: vendor.serviceType || '',
        description: vendor.description || '',
        contactName: vendor.contactName || '',
        contactEmail: vendor.contactEmail || '',
        contactPhone: vendor.contactPhone || '',
        recoveryTimeCapability: vendor.recoveryTimeCapability?.toString() || '',
        contractStartDate: vendor.contractStartDate || '',
        contractEndDate: vendor.contractEndDate || '',
        website: vendor.website || '',
        address: vendor.address || '',
        notes: vendor.notes || ''
      });
    } catch (error) {
      console.error('Error loading vendor:', error);
      setErrors({ submit: 'Failed to load vendor data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorName.trim()) {
      newErrors.vendorName = 'Vendor name is required';
    }

    // Validate email format if provided
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    // Validate RTO-C is a positive number if provided
    if (formData.recoveryTimeCapability && parseInt(formData.recoveryTimeCapability) < 0) {
      newErrors.recoveryTimeCapability = 'Recovery time must be a positive number';
    }

    // Validate contract dates
    if (formData.contractStartDate && formData.contractEndDate) {
      if (new Date(formData.contractStartDate) > new Date(formData.contractEndDate)) {
        newErrors.contractEndDate = 'End date must be after start date';
      }
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
      await vendorService.update(Number(vendorId), {
        id: Number(vendorId),
        vendorName: formData.vendorName,
        status: formData.status,
        serviceType: formData.serviceType || undefined,
        description: formData.description || undefined,
        contactName: formData.contactName || undefined,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        recoveryTimeCapability: formData.recoveryTimeCapability ? parseInt(formData.recoveryTimeCapability) : undefined,
        contractStartDate: formData.contractStartDate || undefined,
        contractEndDate: formData.contractEndDate || undefined,
        website: formData.website || undefined,
        address: formData.address || undefined,
        notes: formData.notes || undefined
      });
      
      router.push('/libraries/vendors');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update vendor. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/libraries/vendors');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-xs text-gray-600">Loading vendor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/vendors"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Vendors
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Vendor</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Update vendor record in the Vendor Library
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Info Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CubeIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-blue-900">
                  BCM Principle: Vendor Dependencies & Gap Analysis
                </h3>
                <div className="mt-0.5 text-xs text-blue-800">
                  <p>
                    The <strong>Recovery Time Capability (RTO-C)</strong> is the vendor's contractual SLA for recovery.
                    This is critical for BIA gap analysis. When a process requires a 4-hour RTO but depends on a vendor
                    with an 8-hour RTO-C, a gap is detected and must be addressed.
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
                    <label htmlFor="vendorName" className="block text-xs font-medium text-gray-700 mb-1">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      id="vendorName"
                      name="vendorName"
                      required
                      value={formData.vendorName}
                      onChange={handleChange}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.vendorName ? 'border-red-300' : ''}`}
                      placeholder="e.g., AWS, Microsoft Azure"
                    />
                    {errors.vendorName && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.vendorName}</p>
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
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Brief description of the vendor and services provided"
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
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={VendorStatus.ACTIVE}>{getVendorStatusLabel(VendorStatus.ACTIVE)}</option>
                      <option value={VendorStatus.INACTIVE}>{getVendorStatusLabel(VendorStatus.INACTIVE)}</option>
                      <option value={VendorStatus.UNDER_REVIEW}>{getVendorStatusLabel(VendorStatus.UNDER_REVIEW)}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-xs font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select Service Type</option>
                      {Object.values(ServiceType).map(type => (
                        <option key={type} value={type}>{getServiceTypeLabel(type)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Contact Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactName" className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.contactEmail ? 'border-red-300' : ''}`}
                      placeholder="e.g., contact@vendor.com"
                    />
                    {errors.contactEmail && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-xs font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., https://www.vendor.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Full address of the vendor"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recovery & Contract Details */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Recovery & Contract Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="recoveryTimeCapability" className="block text-xs font-medium text-gray-700 mb-1">
                      Recovery Time Capability (hours)
                    </label>
                    <input
                      type="number"
                      id="recoveryTimeCapability"
                      name="recoveryTimeCapability"
                      min="0"
                      step="1"
                      value={formData.recoveryTimeCapability}
                      onChange={handleChange}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.recoveryTimeCapability ? 'border-red-300' : ''}`}
                      placeholder="e.g., 4"
                    />
                    {errors.recoveryTimeCapability && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.recoveryTimeCapability}</p>
                    )}
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Vendor's contractual SLA for recovery time
                    </p>
                  </div>

                  <div>
                    <label htmlFor="contractStartDate" className="block text-xs font-medium text-gray-700 mb-1">
                      Contract Start Date
                    </label>
                    <input
                      type="date"
                      id="contractStartDate"
                      name="contractStartDate"
                      value={formData.contractStartDate}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="contractEndDate" className="block text-xs font-medium text-gray-700 mb-1">
                      Contract End Date
                    </label>
                    <input
                      type="date"
                      id="contractEndDate"
                      name="contractEndDate"
                      value={formData.contractEndDate}
                      onChange={handleChange}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.contractEndDate ? 'border-red-300' : ''}`}
                    />
                    {errors.contractEndDate && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.contractEndDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Additional Information</h3>
              </div>
              <div className="p-4">
                <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Additional notes or comments about this vendor"
                />
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="ml-2 text-xs text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1" />
                    Save Changes
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

