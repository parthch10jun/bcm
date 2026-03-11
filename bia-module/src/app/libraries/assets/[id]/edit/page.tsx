'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { assetService } from '@/services/assetService';
import { AssetStatus } from '@/types/asset';
import { 
  CubeIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface AssetType {
  id: number;
  typeName: string;
}

interface AssetCategory {
  id: number;
  categoryName: string;
  assetTypeId?: number;
}

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id as string;
  
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    assetName: '',
    description: '',
    assetTypeId: '',
    categoryId: '',
    vendor: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyExpiry: '',
    owner: '',
    technicalContact: '',
    notes: '',
    status: AssetStatus.ACTIVE,
    // Recovery objectives
    rtoHours: '',
    rpoHours: '',
    assetCriticality: ''
  });

  useEffect(() => {
    loadData();
  }, [assetId]);

  useEffect(() => {
    // Filter categories based on selected asset type
    if (formData.assetTypeId) {
      const filtered = assetCategories.filter(
        cat => cat.assetTypeId === parseInt(formData.assetTypeId)
      );
      setFilteredCategories(filtered);
      
      // Reset category if it doesn't match the new type
      if (formData.categoryId) {
        const categoryExists = filtered.some(cat => cat.id === parseInt(formData.categoryId));
        if (!categoryExists) {
          setFormData(prev => ({ ...prev, categoryId: '' }));
        }
      }
    } else {
      setFilteredCategories([]);
      setFormData(prev => ({ ...prev, categoryId: '' }));
    }
  }, [formData.assetTypeId, assetCategories]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [asset, types, categories] = await Promise.all([
        assetService.getById(Number(assetId)),
        assetService.getTypes(),
        assetService.getCategories()
      ]);
      
      setAssetTypes(types);
      setAssetCategories(categories);
      
      setFormData({
        assetName: asset.assetName || '',
        description: asset.description || '',
        assetTypeId: asset.assetTypeId?.toString() || '',
        categoryId: asset.categoryId?.toString() || '',
        vendor: asset.vendor || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate || '',
        warrantyExpiry: asset.warrantyExpiry || '',
        owner: asset.owner || '',
        technicalContact: asset.technicalContact || '',
        notes: asset.notes || '',
        status: asset.status || AssetStatus.ACTIVE,
        // Recovery objectives
        rtoHours: asset.rtoHours?.toString() || '',
        rpoHours: asset.rpoHours?.toString() || '',
        assetCriticality: asset.assetCriticality || ''
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setErrors({ submit: 'Failed to load asset data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
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

    if (!formData.assetName.trim()) {
      newErrors.assetName = 'Asset name is required';
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
      await assetService.update(Number(assetId), {
        assetName: formData.assetName,
        description: formData.description || undefined,
        assetTypeId: formData.assetTypeId ? parseInt(formData.assetTypeId) : undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        vendor: formData.vendor || undefined,
        model: formData.model || undefined,
        serialNumber: formData.serialNumber || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        warrantyExpiry: formData.warrantyExpiry || undefined,
        owner: formData.owner || undefined,
        technicalContact: formData.technicalContact || undefined,
        notes: formData.notes || undefined,
        status: formData.status,
        // Recovery objectives
        rtoHours: formData.rtoHours ? parseInt(formData.rtoHours) : undefined,
        rpoHours: formData.rpoHours ? parseInt(formData.rpoHours) : undefined,
        assetCriticality: formData.assetCriticality || undefined
      });

      router.push('/libraries/assets');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update asset. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/libraries/assets');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-xs text-gray-600">Loading asset...</p>
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
            href="/libraries/assets"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Assets
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Asset</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Update asset record in the Asset Library
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
                  BCM Principle: Criticality Inheritance
                </h3>
                <div className="mt-0.5 text-xs text-blue-800">
                  <p>
                    An asset's criticality is <strong>inherited from the processes it supports</strong>.
                    Link this asset to processes to establish its criticality tier.
                    Assets without process links will default to Tier 5 (lowest criticality).
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
                    <label htmlFor="assetName" className="block text-xs font-medium text-gray-700 mb-1">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      id="assetName"
                      name="assetName"
                      required
                      value={formData.assetName}
                      onChange={(e) => handleChange('assetName', e.target.value)}
                      className={`w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.assetName ? 'border-red-300' : ''}`}
                      placeholder="e.g., SAP Finance Server"
                    />
                    {errors.assetName && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.assetName}</p>
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
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Brief description of the asset and its purpose"
                    />
                  </div>

                  <div>
                    <label htmlFor="assetTypeId" className="block text-xs font-medium text-gray-700 mb-1">
                      Asset Type
                    </label>
                    <select
                      id="assetTypeId"
                      name="assetTypeId"
                      value={formData.assetTypeId}
                      onChange={(e) => handleChange('assetTypeId', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select Type</option>
                      {assetTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.typeName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="categoryId" className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      disabled={!formData.assetTypeId}
                    >
                      <option value="">Select Category</option>
                      {filteredCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.categoryName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as AssetStatus)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={AssetStatus.ACTIVE}>Active</option>
                      <option value={AssetStatus.INACTIVE}>Inactive</option>
                      <option value={AssetStatus.RETIRED}>Retired</option>
                      <option value={AssetStatus.MAINTENANCE}>Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="assetCriticality" className="block text-xs font-medium text-gray-700 mb-1">
                      Asset Criticality
                    </label>
                    <select
                      id="assetCriticality"
                      name="assetCriticality"
                      value={formData.assetCriticality}
                      onChange={(e) => handleChange('assetCriticality', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select Criticality</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Asset-level criticality for recovery prioritization
                    </p>
                  </div>
                </div>

                {/* Recovery Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label htmlFor="rtoHours" className="block text-xs font-medium text-gray-700 mb-1">
                      RTO (Recovery Time Objective)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="rtoHours"
                        name="rtoHours"
                        value={formData.rtoHours}
                        onChange={(e) => handleChange('rtoHours', e.target.value)}
                        min="0"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        placeholder="e.g., 4"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">hours</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Maximum acceptable time to restore this asset after disruption
                    </p>
                  </div>

                  <div>
                    <label htmlFor="rpoHours" className="block text-xs font-medium text-gray-700 mb-1">
                      RPO (Recovery Point Objective)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="rpoHours"
                        name="rpoHours"
                        value={formData.rpoHours}
                        onChange={(e) => handleChange('rpoHours', e.target.value)}
                        min="0"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        placeholder="e.g., 1"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">hours</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      Maximum acceptable data loss window
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Technical Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vendor" className="block text-xs font-medium text-gray-700 mb-1">
                      Vendor
                    </label>
                    <input
                      type="text"
                      id="vendor"
                      name="vendor"
                      value={formData.vendor}
                      onChange={(e) => handleChange('vendor', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., Dell, HP, Microsoft"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-xs font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., PowerEdge R740"
                    />
                  </div>

                  <div>
                    <label htmlFor="serialNumber" className="block text-xs font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleChange('serialNumber', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., SN123456789"
                    />
                  </div>

                  <div>
                    <label htmlFor="purchaseDate" className="block text-xs font-medium text-gray-700 mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={(e) => handleChange('purchaseDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="warrantyExpiry" className="block text-xs font-medium text-gray-700 mb-1">
                      Warranty Expiry
                    </label>
                    <input
                      type="date"
                      id="warrantyExpiry"
                      name="warrantyExpiry"
                      value={formData.warrantyExpiry}
                      onChange={(e) => handleChange('warrantyExpiry', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership & Contact */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Ownership & Contact</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="owner" className="block text-xs font-medium text-gray-700 mb-1">
                      Owner
                    </label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      value={formData.owner}
                      onChange={(e) => handleChange('owner', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="technicalContact" className="block text-xs font-medium text-gray-700 mb-1">
                      Technical Contact
                    </label>
                    <input
                      type="text"
                      id="technicalContact"
                      name="technicalContact"
                      value={formData.technicalContact}
                      onChange={(e) => handleChange('technicalContact', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., tech.support@company.com"
                    />
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
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Additional notes or comments about this asset"
                />
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-xs text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
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

