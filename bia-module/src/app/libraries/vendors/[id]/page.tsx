'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  CubeIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { vendorService } from '@/services/vendorService';
import { Vendor, getVendorStatusLabel, getServiceTypeLabel, formatRecoveryTime } from '@/types/vendor';

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vendorId) {
      loadVendor();
    }
  }, [vendorId]);

  const loadVendor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorService.getById(Number(vendorId));
      setVendor(data);
    } catch (err) {
      setError('Failed to load vendor details');
      console.error('Error loading vendor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/libraries/vendors/${vendorId}/edit`);
  };

  const handleDelete = async () => {
    if (!vendor) return;
    
    if (confirm(`Are you sure you want to delete "${vendor.vendorName}"? This action cannot be undone.`)) {
      try {
        await vendorService.delete(vendor.id);
        router.push('/libraries/vendors');
      } catch (err) {
        alert('Failed to delete vendor');
        console.error('Error deleting vendor:', err);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasGapRisk = vendor && vendor.recoveryTimeCapability && vendor.recoveryTimeCapability > 4;
  const hasNoDependencies = vendor && vendor.processCount === 0 && vendor.assetCount === 0;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-red-600">{error || 'Vendor not found'}</p>
            <button
              onClick={() => router.push('/libraries/vendors')}
              className="mt-4 inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back to Vendors
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
            onClick={() => router.push('/libraries/vendors')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Vendors
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{vendor.vendorName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Vendor Details</p>
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
          {hasGapRisk && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-amber-800">
                    Gap Risk Detected
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    This vendor's RTO-C ({formatRecoveryTime(vendor.recoveryTimeCapability!)}) exceeds the critical threshold of 4 hours. 
                    Processes depending on this vendor may have recovery gaps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasNoDependencies && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-blue-800">
                    No Dependencies Linked
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    This vendor is not linked to any processes or assets. Link dependencies to enable gap analysis.
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
                  Vendor Name
                </label>
                <p className="text-xs text-gray-900">{vendor.vendorName}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getStatusBadgeClass(vendor.status)}`}>
                  {getVendorStatusLabel(vendor.status)}
                </span>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Service Type
                </label>
                <p className="text-xs text-gray-900">{vendor.serviceType ? getServiceTypeLabel(vendor.serviceType) : 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <p className="text-xs text-gray-900">{vendor.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <BuildingOfficeIcon className="h-3 w-3" />
                  Contact Name
                </label>
                <p className="text-xs text-gray-900">{vendor.contactName || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <EnvelopeIcon className="h-3 w-3" />
                  Email
                </label>
                <p className="text-xs text-gray-900">{vendor.contactEmail || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <PhoneIcon className="h-3 w-3" />
                  Phone
                </label>
                <p className="text-xs text-gray-900">{vendor.contactPhone || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <GlobeAltIcon className="h-3 w-3" />
                  Website
                </label>
                {vendor.website ? (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    {vendor.website}
                  </a>
                ) : (
                  <p className="text-xs text-gray-900">Not specified</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Address
                </label>
                <p className="text-xs text-gray-900">{vendor.address || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Recovery & Contract Details */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Recovery & Contract Details</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Recovery Time Capability (RTO-C)
                </label>
                <p className="text-xs text-gray-900 font-medium">
                  {vendor.recoveryTimeCapability ? formatRecoveryTime(vendor.recoveryTimeCapability) : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Contract Period
                </label>
                <p className="text-xs text-gray-900">
                  {vendor.contractStartDate && vendor.contractEndDate
                    ? `${vendor.contractStartDate} to ${vendor.contractEndDate}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Dependencies</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Cog6ToothIcon className="h-3 w-3" />
                  Linked Processes
                </label>
                <p className="text-xs text-gray-900 font-medium">{vendor.processCount || 0}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CubeIcon className="h-3 w-3" />
                  Linked Assets
                </label>
                <p className="text-xs text-gray-900 font-medium">{vendor.assetCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {vendor.notes && (
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <DocumentTextIcon className="h-3.5 w-3.5" />
                  Additional Notes
                </h2>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-900 whitespace-pre-wrap">{vendor.notes}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

