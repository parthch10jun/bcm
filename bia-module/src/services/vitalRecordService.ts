/**
 * Service for Vital Records API
 */

import {
  VitalRecord,
  CreateVitalRecordRequest,
  UpdateVitalRecordRequest,
  VitalRecordStatistics,
  VitalRecordStatus
} from '@/types/vitalRecord';

const API_BASE_URL = 'http://localhost:8080/api/vital-records';
const USE_MOCK_DATA = true; // Set to false to use real backend

// Mock data
const mockVitalRecords: VitalRecord[] = [
  {
    id: 1,
    recordName: 'Customer Database',
    status: VitalRecordStatus.ACTIVE,
    recordType: 'Database',
    location: 'Data Center A',
    description: 'Primary customer information database',
    owner: 'IT Department',
    technicalContact: 'John Smith',
    backupFrequency: 'Daily',
    storageFormat: 'Digital',
    retentionPeriod: '7 years',
    recoveryPointObjective: 1,
    notes: 'Critical customer data',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-11-24T00:00:00Z',
    updatedBy: 'System',
    version: 1
  },
  {
    id: 2,
    recordName: 'Financial Records',
    status: VitalRecordStatus.ACTIVE,
    recordType: 'Financial',
    location: 'Secure Archive',
    description: 'Annual financial statements and tax records',
    owner: 'Finance Department',
    technicalContact: 'Sarah Johnson',
    backupFrequency: 'Weekly',
    storageFormat: 'Digital & Physical',
    retentionPeriod: '10 years',
    recoveryPointObjective: 4,
    notes: 'Regulatory compliance required',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-11-24T00:00:00Z',
    updatedBy: 'System',
    version: 1
  },
  {
    id: 3,
    recordName: 'Employee Records',
    status: VitalRecordStatus.ACTIVE,
    recordType: 'HR',
    location: 'HR Office',
    description: 'Employee personnel files and contracts',
    owner: 'Human Resources',
    technicalContact: 'Mike Chen',
    backupFrequency: 'Weekly',
    storageFormat: 'Digital & Physical',
    retentionPeriod: '5 years after termination',
    recoveryPointObjective: 8,
    notes: 'Confidential employee data',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-11-24T00:00:00Z',
    updatedBy: 'System',
    version: 1
  },
  {
    id: 4,
    recordName: 'Legal Contracts',
    status: VitalRecordStatus.ACTIVE,
    recordType: 'Legal',
    location: 'Legal Archive',
    description: 'Vendor and customer contracts',
    owner: 'Legal Department',
    technicalContact: 'Emily Davis',
    backupFrequency: 'Weekly',
    storageFormat: 'Digital',
    retentionPeriod: 'Contract term + 7 years',
    recoveryPointObjective: 4,
    notes: 'Legal compliance required',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-11-24T00:00:00Z',
    updatedBy: 'System',
    version: 1
  },
  {
    id: 5,
    recordName: 'Product Documentation',
    status: VitalRecordStatus.ACTIVE,
    recordType: 'Documentation',
    location: 'Document Management System',
    description: 'Product specifications and technical documentation',
    owner: 'Operations',
    technicalContact: 'David Wilson',
    backupFrequency: 'Daily',
    storageFormat: 'Digital',
    retentionPeriod: 'Product lifecycle + 3 years',
    recoveryPointObjective: 2,
    notes: 'Essential for product support',
    createdAt: '2023-02-01T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-11-24T00:00:00Z',
    updatedBy: 'System',
    version: 1
  }
];

export const vitalRecordService = {
  /**
   * Get all vital records
   */
  async getAll(params?: {
    status?: VitalRecordStatus;
    recordType?: string;
    search?: string;
  }): Promise<VitalRecord[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...mockVitalRecords];

      if (params?.status) {
        filtered = filtered.filter(r => r.status === params.status);
      }
      if (params?.recordType) {
        filtered = filtered.filter(r => r.recordType === params.recordType);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(r =>
          r.recordName.toLowerCase().includes(search) ||
          (r.description?.toLowerCase().includes(search)) ||
          (r.recordType?.toLowerCase().includes(search))
        );
      }

      return filtered;
    }

    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.recordType) queryParams.append('recordType', params.recordType);
    if (params?.search) queryParams.append('search', params.search);

    const url = queryParams.toString()
      ? `${API_BASE_URL}?${queryParams.toString()}`
      : API_BASE_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vital records');
    }
    return response.json();
  },

  /**
   * Get vital record by ID
   */
  async getById(id: number): Promise<VitalRecord> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const record = mockVitalRecords.find(r => r.id === id);
      if (!record) {
        throw new Error('Vital record not found');
      }
      return record;
    }

    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vital record');
    }
    return response.json();
  },

  /**
   * Create a new vital record
   */
  async create(data: CreateVitalRecordRequest): Promise<VitalRecord> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create vital record');
    }
    return response.json();
  },

  /**
   * Update an existing vital record
   */
  async update(id: number, data: UpdateVitalRecordRequest): Promise<VitalRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update vital record');
    }
    return response.json();
  },

  /**
   * Delete a vital record
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete vital record');
    }
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<VitalRecordStatistics> {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return response.json();
  },

  /**
   * Download CSV template
   */
  async downloadTemplate(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/bulk-upload/template`);
    if (!response.ok) {
      throw new Error('Failed to download template');
    }
    return response.blob();
  },

  /**
   * Bulk upload vital records
   */
  async bulkUpload(file: File): Promise<{
    successCount: number;
    failedRows: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/bulk-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },
};

