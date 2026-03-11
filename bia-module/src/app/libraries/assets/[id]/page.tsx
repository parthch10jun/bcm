'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CubeIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { assetService } from '@/services/assetService';
import { Asset, getCriticalityTierName, getCriticalityTierColor, getAssetCriticalityName, formatRecoveryTime } from '@/types/asset';

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id as string;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assetId) {
      loadAsset();
    }
  }, [assetId]);

  const loadAsset = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getById(Number(assetId));
      setAsset(data);
    } catch (err) {
      setError('Failed to load asset details');
      console.error('Error loading asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/libraries/assets/${assetId}/edit`);
  };

  const handleDelete = async () => {
    if (!asset) return;
    
    if (confirm(`Are you sure you want to delete "${asset.assetName}"? This action cannot be undone.`)) {
      try {
        await assetService.delete(asset.id);
        router.push('/libraries/assets');
      } catch (err) {
        alert('Failed to delete asset');
        console.error('Error deleting asset:', err);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'RETIRED':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityBadgeClass = (tier: string) => {
    const color = getCriticalityTierColor(tier as any);
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'gray':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasNoDependencies = asset && asset.processCount === 0;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-red-600">{error || 'Asset not found'}</p>
            <button
              onClick={() => router.push('/libraries/assets')}
              className="mt-4 inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back to Assets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/libraries/assets')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Assets
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{asset.assetName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Asset Details</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-3.5 w-3.5 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-sm text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="h-3.5 w-3.5 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Alert Banners */}
          {hasNoDependencies && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-blue-800">
                    No Process Dependencies
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    This asset is not linked to any processes. Asset criticality is inherited from the processes it supports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {asset.isCritical && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-red-800">
                    Critical Asset
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    This asset supports {asset.processCount} critical process{asset.processCount !== 1 ? 'es' : ''} and requires priority attention.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Asset Name
                </label>
                <p className="text-xs text-gray-900">{asset.assetName}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getStatusBadgeClass(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Asset Type
                </label>
                <p className="text-xs text-gray-900">{asset.assetTypeName || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Category
                </label>
                <p className="text-xs text-gray-900">{asset.categoryName || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <p className="text-xs text-gray-900">{asset.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          {/* Recovery Objectives & Criticality */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Recovery Objectives & Criticality</h2>
            </div>
            <div className="p-4 grid grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Asset Criticality
                </label>
                {asset.assetCriticality ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                    asset.assetCriticality === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    asset.assetCriticality === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    asset.assetCriticality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getAssetCriticalityName(asset.assetCriticality)}
                  </span>
                ) : (
                  <p className="text-xs text-gray-400">Not set</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  RTO (Recovery Time)
                </label>
                <p className="text-xs text-gray-900 font-medium">{formatRecoveryTime(asset.rtoHours)}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  RPO (Recovery Point)
                </label>
                <p className="text-xs text-gray-900 font-medium">{formatRecoveryTime(asset.rpoHours)}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Inherited Criticality
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getCriticalityBadgeClass(asset.inheritedCriticality)}`}>
                  {getCriticalityTierName(asset.inheritedCriticality)}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Technical Details</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Vendor
                </label>
                <p className="text-xs text-gray-900">{asset.vendor || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Model
                </label>
                <p className="text-xs text-gray-900">{asset.model || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Serial Number
                </label>
                <p className="text-xs text-gray-900">{asset.serialNumber || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Location
                </label>
                <p className="text-xs text-gray-900">{asset.locationName || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Purchase Date
                </label>
                <p className="text-xs text-gray-900">{asset.purchaseDate || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Warranty Expiry
                </label>
                <p className="text-xs text-gray-900">{asset.warrantyExpiry || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Ownership & Contact */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Ownership & Contact</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Owner
                </label>
                <p className="text-xs text-gray-900">{asset.owner || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Technical Contact
                </label>
                <p className="text-xs text-gray-900">{asset.technicalContact || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Dependencies</h2>
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Cog6ToothIcon className="h-3 w-3" />
                  Linked Processes
                </label>
                <p className="text-xs text-gray-900 font-medium">{asset.processCount || 0}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CubeIcon className="h-3 w-3" />
                  Depends On
                </label>
                <p className="text-xs text-gray-900 font-medium">{asset.dependencyCount || 0} assets</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CubeIcon className="h-3 w-3" />
                  Dependents
                </label>
                <p className="text-xs text-gray-900 font-medium">{asset.dependentCount || 0} assets</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {asset.notes && (
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <DocumentTextIcon className="h-3.5 w-3.5" />
                  Additional Notes
                </h2>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-900 whitespace-pre-wrap">{asset.notes}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

