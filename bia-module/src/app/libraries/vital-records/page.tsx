'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VitalRecord, VitalRecordStatus, getStatusColor, formatRPO } from '@/types/vitalRecord';
import { vitalRecordService } from '@/services/vitalRecordService';
import Pagination from '@/components/Pagination';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function VitalRecordsLibraryPage() {
  const router = useRouter();
  const [vitalRecords, setVitalRecords] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    failedRows: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const recordsData = await vitalRecordService.getAll();
      setVitalRecords(recordsData);
      setError(null);
    } catch (err) {
      console.error('Error loading vital records:', err);
      setError('Failed to load vital records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vital record?')) {
      return;
    }

    try {
      await vitalRecordService.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting vital record:', err);
      alert('Failed to delete vital record');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await vitalRecordService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vital_records_bulk_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading template:', err);
      alert('Failed to download template');
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const result = await vitalRecordService.bulkUpload(uploadFile);
      setUploadResult(result);
      setUploadFile(null);
      await loadData();
    } catch (err: any) {
      console.error('Error uploading file:', err);
      alert(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const closeBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  // Apply filters
  const filteredRecords = vitalRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.recordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || record.status === selectedStatus;
    const matchesType = !selectedType || record.recordType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Statistics
  const totalRecords = vitalRecords.length;
  const activeRecords = vitalRecords.filter(r => r.status === VitalRecordStatus.ACTIVE).length;
  const archivedRecords = vitalRecords.filter(r => r.status === VitalRecordStatus.ARCHIVED).length;
  const recordsByType = vitalRecords.reduce((acc, r) => {
    const type = r.recordType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recordTypes = ['Database', 'Document', 'SOP', 'Contact List', 'Configuration', 'Other'];

  const getStatusBadgeColor = (status: VitalRecordStatus) => {
    switch (status) {
      case VitalRecordStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200';
      case VitalRecordStatus.ARCHIVED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case VitalRecordStatus.INACTIVE:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Vital Records Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">Critical documents, databases, and information assets</p>
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
              onClick={() => router.push('/libraries/vital-records/new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Vital Record
            </button>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Insight Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Total Records */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Records</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{totalRecords}</p>
                  <span className="ml-1 text-xs text-gray-500">records</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium text-green-600">{activeRecords}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Archived</span>
                    <span className="font-medium text-gray-600">{archivedRecords}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Inactive</span>
                    <span className="font-medium text-yellow-600">{vitalRecords.filter(r => r.status === VitalRecordStatus.INACTIVE).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Databases */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Databases</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{recordsByType['Database'] || 0}</p>
                  <span className="ml-1 text-xs text-gray-500">records</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Documents</span>
                    <span className="font-medium text-gray-900">{recordsByType['Document'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">SOPs</span>
                    <span className="font-medium text-gray-900">{recordsByType['SOP'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Contact Lists</span>
                    <span className="font-medium text-gray-900">{recordsByType['Contact List'] || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RPO Coverage */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">RPO Coverage</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{vitalRecords.filter(r => r.recoveryPointObjective).length}</p>
                  <span className="ml-1 text-xs text-gray-500">defined</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">≤ 1 Hour</span>
                    <span className="font-medium text-green-600">{vitalRecords.filter(r => r.recoveryPointObjective && r.recoveryPointObjective <= 1).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">≤ 24 Hours</span>
                    <span className="font-medium text-blue-600">{vitalRecords.filter(r => r.recoveryPointObjective && r.recoveryPointObjective <= 24).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">&gt; 24 Hours</span>
                    <span className="font-medium text-gray-600">{vitalRecords.filter(r => r.recoveryPointObjective && r.recoveryPointObjective > 24).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Record Types */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Record Types</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{Object.keys(recordsByType).length}</p>
                  <span className="ml-1 text-xs text-gray-500">types</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Configurations</span>
                    <span className="font-medium text-gray-900">{recordsByType['Configuration'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Other</span>
                    <span className="font-medium text-gray-900">{recordsByType['Other'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Total Types</span>
                    <span className="font-medium text-gray-900">{Object.keys(recordsByType).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vital records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">All Statuses</option>
              <option value={VitalRecordStatus.ACTIVE}>Active</option>
              <option value={VitalRecordStatus.ARCHIVED}>Archived</option>
              <option value={VitalRecordStatus.INACTIVE}>Inactive</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">All Types</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(searchTerm || selectedStatus || selectedType) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedType('');
                }}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No vital records found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Record Name</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">RPO</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/libraries/vital-records/${record.id}`)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">{record.recordName}</div>
                      {record.description && (
                        <div className="text-[10px] text-gray-500">{record.description}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{record.recordType || '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{record.location || '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatRPO(record.recoveryPointObjective)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => router.push(`/libraries/vital-records/${record.id}/edit`)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredRecords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
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
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Vital Records</h2>
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
                  <li>Fill in the vital record information following the template format</li>
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
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
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
                    uploadResult.failedRows === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="text-sm font-medium mb-2">
                      {uploadResult.failedRows === 0 ? (
                        <span className="text-green-800">✓ Upload Successful</span>
                      ) : (
                        <span className="text-amber-800">⚠ Upload Completed with Errors</span>
                      )}
                    </p>
                    <p className="text-xs mb-2">
                      <span className="text-green-700">Success: {uploadResult.successCount}</span>
                      {' | '}
                      <span className="text-red-700">Errors: {uploadResult.failedRows}</span>
                    </p>
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="text-xs font-medium mb-1">Messages:</p>
                        <ul className="text-xs space-y-1">
                          {uploadResult.errors.map((message, index) => (
                            <li key={index} className="text-gray-600">
                              • {message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeBulkUploadModal}
                className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                {uploadResult ? 'Close' : 'Cancel'}
              </button>
              {!uploadResult && (
                <button
                  onClick={handleBulkUpload}
                  disabled={!uploadFile || uploading}
                  className="px-4 py-2 border border-transparent rounded-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

