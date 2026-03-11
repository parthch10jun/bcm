'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { vendorService } from '@/services/vendorService';
import {
  Vendor,
  VendorStatus,
  ServiceType,
  getVendorStatusLabel,
  getServiceTypeLabel,
  formatRecoveryTime
} from '@/types/vendor';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | ''>('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | ''>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    errorCount: number;
    messages: string[];
  } | null>(null);

  useEffect(() => {
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors, searchTerm, statusFilter, serviceTypeFilter]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vendors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(vendor => vendor.status === statusFilter);
    }

    // Apply service type filter
    if (serviceTypeFilter) {
      filtered = filtered.filter(vendor => vendor.serviceType === serviceTypeFilter);
    }

    setFilteredVendors(filtered);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setServiceTypeFilter('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      await vendorService.delete(id);
      await loadVendors();
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/vendors/bulk-upload/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vendor_bulk_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading template:', err);
      alert('Failed to download template');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('http://localhost:8080/api/vendors/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);

      if (result.successCount > 0) {
        await loadVendors();
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const closeBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  // Calculate KPI metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === VendorStatus.ACTIVE).length;
  const underReviewVendors = vendors.filter(v => v.status === VendorStatus.UNDER_REVIEW).length;
  const inactiveVendors = vendors.filter(v => v.status === VendorStatus.INACTIVE).length;
  const criticalVendors = vendors.filter(v =>
    v.recoveryTimeCapability && v.recoveryTimeCapability <= 4
  ).length;

  // Group vendors by service type
  const serviceTypeCounts = vendors.reduce((acc, vendor) => {
    const type = vendor.serviceType || ServiceType.OTHER;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<ServiceType, number>);

  const topServiceTypes = Object.entries(serviceTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const getStatusBadgeColor = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200';
      case VendorStatus.INACTIVE:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case VendorStatus.UNDER_REVIEW:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Vendor Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Central registry of external suppliers, vendors, and partners
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1" />
              Bulk Upload
            </button>
            <button
              onClick={() => router.push('/libraries/vendors/new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Vendor
            </button>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Total Vendors */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Vendors</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{totalVendors}</p>
                  <span className="ml-1 text-xs text-gray-500">vendors</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium text-green-600">{activeVendors}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Under Review</span>
                    <span className="font-medium text-amber-600">{underReviewVendors}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Inactive</span>
                    <span className="font-medium text-gray-600">{inactiveVendors}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical RTO-C */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical RTO-C</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{criticalVendors}</p>
                  <span className="ml-1 text-xs text-gray-500">vendors</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">≤ 4 Hours</span>
                    <span className="font-medium text-green-600">{criticalVendors}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">≤ 24 Hours</span>
                    <span className="font-medium text-blue-600">{vendors.filter(v => v.recoveryTimeCapability && v.recoveryTimeCapability <= 24).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">&gt; 24 Hours</span>
                    <span className="font-medium text-gray-600">{vendors.filter(v => v.recoveryTimeCapability && v.recoveryTimeCapability > 24).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Service Types</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{Object.keys(serviceTypeCounts).length}</p>
                  <span className="ml-1 text-xs text-gray-500">types</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  {topServiceTypes.slice(0, 3).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">{getServiceTypeLabel(type as ServiceType)}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Dependencies</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{vendors.filter(v => v.processCount > 0 || v.assetCount > 0).length}</p>
                  <span className="ml-1 text-xs text-gray-500">linked</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Total Processes</span>
                    <span className="font-medium text-blue-600">{vendors.reduce((sum, v) => sum + (v.processCount || 0), 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Total Assets</span>
                    <span className="font-medium text-blue-600">{vendors.reduce((sum, v) => sum + (v.assetCount || 0), 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">No Dependencies</span>
                    <span className="font-medium text-amber-600">{vendors.filter(v => v.processCount === 0 && v.assetCount === 0).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VendorStatus | '')}
              className="px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">All Statuses</option>
              {Object.values(VendorStatus).map(status => (
                <option key={status} value={status}>{getVendorStatusLabel(status)}</option>
              ))}
            </select>

            {/* Service Type Filter */}
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value as ServiceType | '')}
              className="px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">All Service Types</option>
              {Object.values(ServiceType).map(type => (
                <option key={type} value={type}>{getServiceTypeLabel(type)}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(searchTerm || statusFilter || serviceTypeFilter) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                Clear filters
              </button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-xs text-gray-500">
              Showing {filteredVendors.length} of {totalVendors} vendors
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  RTO-C
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Processes
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Assets
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                paginatedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/libraries/vendors/${vendor.id}`)}
                  >
                    <td className="px-3 py-2">
                      <div className="text-xs font-medium text-gray-900">{vendor.vendorName}</div>
                      {vendor.description && (
                        <div className="text-[10px] text-gray-500 truncate max-w-xs">{vendor.description}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {vendor.serviceType ? getServiceTypeLabel(vendor.serviceType) : '-'}
                    </td>
                    <td className="px-3 py-2">
                      {vendor.contactName ? (
                        <div>
                          <div className="text-xs text-gray-900">{vendor.contactName}</div>
                          {vendor.contactEmail && (
                            <div className="text-[10px] text-gray-500">{vendor.contactEmail}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {formatRecoveryTime(vendor.recoveryTimeCapability)}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {vendor.processCount > 0 ? (
                        <span className="font-medium">{vendor.processCount}</span>
                      ) : (
                        <span className="text-amber-600">0</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {vendor.assetCount > 0 ? (
                        <span className="font-medium">{vendor.assetCount}</span>
                      ) : (
                        <span className="text-amber-600">0</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeColor(vendor.status)}`}>
                        {getVendorStatusLabel(vendor.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => router.push(`/libraries/vendors/${vendor.id}/edit`)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredVendors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVendors.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Vendors</h2>
              <button
                onClick={closeBulkUploadModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Instructions */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <p className="text-xs text-blue-800 font-medium mb-2">Instructions:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Download the CSV template using the button below</li>
                  <li>Fill in the vendor information following the template format</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the results and fix any errors if needed</li>
                </ol>
              </div>

              {/* Download Template Button */}
              <div className="mb-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
                />
                {uploadFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected file: {uploadFile.name}
                  </p>
                )}
              </div>

              {/* Upload Results */}
              {uploadResult && (
                <div className="mb-4">
                  <div className={`p-3 rounded-sm border ${
                    uploadResult.errorCount === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="text-sm font-medium mb-2">
                      {uploadResult.errorCount === 0 ? (
                        <span className="text-green-800">✓ Upload Successful</span>
                      ) : (
                        <span className="text-amber-800">⚠ Upload Completed with Errors</span>
                      )}
                    </p>
                    <p className="text-xs mb-2">
                      <span className="text-green-700">Success: {uploadResult.successCount}</span>
                      {' | '}
                      <span className="text-red-700">Errors: {uploadResult.errorCount}</span>
                    </p>
                    {uploadResult.messages && uploadResult.messages.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="text-xs font-medium mb-1">Messages:</p>
                        <ul className="text-xs space-y-1">
                          {uploadResult.messages.map((msg, idx) => (
                            <li key={idx} className="text-gray-700">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeBulkUploadModal}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Close
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!uploadFile || uploading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

