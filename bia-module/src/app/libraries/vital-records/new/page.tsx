'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateVitalRecordRequest, VitalRecordStatus } from '@/types/vitalRecord';
import { vitalRecordService } from '@/services/vitalRecordService';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function NewVitalRecordPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateVitalRecordRequest>({
    recordName: '',
    status: VitalRecordStatus.ACTIVE,
    recordType: '',
    location: '',
    description: '',
    recoveryPointObjective: undefined,
    owner: '',
    technicalContact: '',
    backupFrequency: '',
    storageFormat: '',
    retentionPeriod: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.recordName.trim()) {
      setError('Record name is required');
      return;
    }

    try {
      setSaving(true);
      await vitalRecordService.create(formData);
      router.push('/libraries/vital-records');
    } catch (err: any) {
      console.error('Error creating vital record:', err);
      setError(err.message || 'Failed to create vital record');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof CreateVitalRecordRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.push('/libraries/vital-records');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/vital-records"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Vital Records
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Vital Record</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new entry in the Vital Records Library
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                <div className="flex items-center">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Record Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recordName}
                    onChange={(e) => handleChange('recordName', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Customer Master Database"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as VitalRecordStatus)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={VitalRecordStatus.ACTIVE}>Active</option>
                      <option value={VitalRecordStatus.ARCHIVED}>Archived</option>
                      <option value={VitalRecordStatus.INACTIVE}>Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Record Type</label>
                    <select
                      value={formData.recordType}
                      onChange={(e) => handleChange('recordType', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select type...</option>
                      <option value="Database">Database</option>
                      <option value="Document">Document</option>
                      <option value="SOP">SOP</option>
                      <option value="Contact List">Contact List</option>
                      <option value="Configuration">Configuration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Production Server - DB01, SharePoint - HR/Documents"
                  />
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    URL, server path, or physical location where this record is stored
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="What this record contains..."
                  />
                </div>
              </div>
            </div>

            {/* Recovery & Backup Details */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Recovery & Backup Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Recovery Point Objective (RPO-C)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.recoveryPointObjective || ''}
                    onChange={(e) => handleChange('recoveryPointObjective', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Enter hours (e.g., 24 for daily backups)"
                  />
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Data backup frequency in hours (e.g., 1 = hourly, 24 = daily, 168 = weekly)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Backup Frequency</label>
                    <input
                      type="text"
                      value={formData.backupFrequency}
                      onChange={(e) => handleChange('backupFrequency', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., Daily at 2:00 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Storage Format</label>
                    <input
                      type="text"
                      value={formData.storageFormat}
                      onChange={(e) => handleChange('storageFormat', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., PostgreSQL, PDF, Excel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Retention Period</label>
                  <input
                    type="text"
                    value={formData.retentionPeriod}
                    onChange={(e) => handleChange('retentionPeriod', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 7 years, Indefinite"
                  />
                </div>
              </div>
            </div>

            {/* Ownership & Contact */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Ownership & Contact</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
                    <input
                      type="text"
                      value={formData.owner}
                      onChange={(e) => handleChange('owner', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., IT Department"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Technical Contact</label>
                    <input
                      type="text"
                      value={formData.technicalContact}
                      onChange={(e) => handleChange('technicalContact', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., it-support@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Additional Notes</h3>
              </div>
              <div className="p-4">
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-sm text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                    Create Vital Record
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

