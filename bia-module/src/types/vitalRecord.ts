/**
 * Vital Record Types
 */

export enum VitalRecordStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  INACTIVE = 'INACTIVE'
}

export interface VitalRecord {
  id: number;
  recordName: string;
  status: VitalRecordStatus;
  recordType?: string;
  location?: string;
  description?: string;
  recoveryPointObjective?: number; // RPO-C in hours
  owner?: string;
  technicalContact?: string;
  backupFrequency?: string;
  storageFormat?: string;
  retentionPeriod?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  version?: number;
}

export interface CreateVitalRecordRequest {
  recordName: string;
  status?: VitalRecordStatus;
  recordType?: string;
  location?: string;
  description?: string;
  recoveryPointObjective?: number;
  owner?: string;
  technicalContact?: string;
  backupFrequency?: string;
  storageFormat?: string;
  retentionPeriod?: string;
  notes?: string;
}

export interface UpdateVitalRecordRequest {
  recordName?: string;
  status?: VitalRecordStatus;
  recordType?: string;
  location?: string;
  description?: string;
  recoveryPointObjective?: number;
  owner?: string;
  technicalContact?: string;
  backupFrequency?: string;
  storageFormat?: string;
  retentionPeriod?: string;
  notes?: string;
}

export interface VitalRecordStatistics {
  totalRecords: number;
  activeRecords: number;
  archivedRecords: number;
}

// Helper function to get status badge color
export function getStatusColor(status: VitalRecordStatus): string {
  switch (status) {
    case VitalRecordStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case VitalRecordStatus.ARCHIVED:
      return 'bg-gray-100 text-gray-800';
    case VitalRecordStatus.INACTIVE:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to format RPO
export function formatRPO(hours?: number): string {
  if (!hours) return 'Not specified';
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours % 168 === 0) {
    const weeks = hours / 168;
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (hours % 24 === 0) {
    const days = hours / 24;
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hours`;
  }
}

