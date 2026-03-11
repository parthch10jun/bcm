'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  ServerIcon,
  ArchiveBoxIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { vitalRecordService } from '@/services/vitalRecordService';
import { VitalRecord, getStatusColor, formatRPO } from '@/types/vitalRecord';

export default function VitalRecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params?.id as string;

  const [record, setRecord] = useState<VitalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordId) {
      loadRecord();
    }
  }, [recordId]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vitalRecordService.getById(Number(recordId));
      setRecord(data);
    } catch (err) {
      setError('Failed to load vital record details');
      console.error('Error loading vital record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/libraries/vital-records/${recordId}/edit`);
  };

  const handleDelete = async () => {
    if (!record) return;
    
    if (confirm(`Are you sure you want to delete "${record.recordName}"? This action cannot be undone.`)) {
      try {
        await vitalRecordService.delete(record.id);
        router.push('/libraries/vital-records');
      } catch (err) {
        alert('Failed to delete vital record');
        console.error('Error deleting vital record:', err);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return getStatusColor(status as any);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'ARCHIVED':
        return 'Archived';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return status;
    }
  };

  const hasNoBackup = record && !record.backupFrequency;
  const hasHighRPO = record && record.recoveryPointObjective && record.recoveryPointObjective > 24;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-red-600">{error || 'Vital record not found'}</p>
            <button
              onClick={() => router.push('/libraries/vital-records')}
              className="mt-4 inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back to Vital Records
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
            onClick={() => router.push('/libraries/vital-records')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Vital Records
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{record.recordName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Vital Record Details</p>
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
          {hasNoBackup && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-red-800">
                    No Backup Frequency Defined
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    This vital record does not have a backup frequency configured. Define a backup schedule to ensure data protection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasHighRPO && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-amber-800">
                    High Recovery Point Objective
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    This record's RPO ({formatRPO(record.recoveryPointObjective)}) exceeds 24 hours. 
                    Consider more frequent backups to minimize potential data loss.
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
                  Record Name
                </label>
                <p className="text-xs text-gray-900">{record.recordName}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getStatusBadgeClass(record.status)}`}>
                  {getStatusLabel(record.status)}
                </span>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Record Type
                </label>
                <p className="text-xs text-gray-900">{record.recordType || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Location
                </label>
                <p className="text-xs text-gray-900">{record.location || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <p className="text-xs text-gray-900">{record.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          {/* Recovery & Backup Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Recovery & Backup Information</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Recovery Point Objective (RPO)
                </label>
                <p className="text-xs text-gray-900">{formatRPO(record.recoveryPointObjective)}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Backup Frequency
                </label>
                <p className="text-xs text-gray-900">{record.backupFrequency || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ServerIcon className="h-3 w-3" />
                  Storage Format
                </label>
                <p className="text-xs text-gray-900">{record.storageFormat || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ArchiveBoxIcon className="h-3 w-3" />
                  Retention Period
                </label>
                <p className="text-xs text-gray-900">{record.retentionPeriod || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Ownership & Contacts */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-900">Ownership & Contacts</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Owner
                </label>
                <p className="text-xs text-gray-900">{record.owner || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Technical Contact
                </label>
                <p className="text-xs text-gray-900">{record.technicalContact || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {record.notes && (
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xs font-semibold text-gray-900">Additional Notes</h2>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-900 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

