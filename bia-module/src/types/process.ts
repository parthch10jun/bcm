/**
 * Process Status Enum
 * Represents the lifecycle state of a process
 */
export enum ProcessStatus {
  DRAFT = 'DRAFT',           // Process is being defined but not yet official
  ACTIVE = 'ACTIVE',         // Process is officially recognized and part of operations
  ARCHIVED = 'ARCHIVED'      // Process is no longer in use
}

/**
 * Process interface matching backend ProcessDTO
 */
export interface Process {
  id: number;
  processName: string;
  processCode?: string;
  description?: string;
  
  // Organizational Unit Reference
  organizationalUnitId: number;
  organizationalUnitName: string;
  organizationalUnitCode?: string;
  
  // Process Details
  processOwner?: string;
  status: ProcessStatus;
  isCritical: boolean;
  
  // Audit Fields
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  
  // Computed Fields
  biaCount?: number;
}

/**
 * Request interface for creating a new process
 */
export interface CreateProcessRequest {
  processName: string;
  processCode?: string;
  description?: string;
  organizationalUnitId: number;
  processOwner?: string;
  status?: ProcessStatus;
}

/**
 * Request interface for updating an existing process
 */
export interface UpdateProcessRequest {
  processName?: string;
  processCode?: string;
  description?: string;
  organizationalUnitId?: number;
  processOwner?: string;
  status?: ProcessStatus;
}

/**
 * Process with organizational unit details (for display)
 */
export interface ProcessWithUnit extends Process {
  organizationalUnit?: {
    id: number;
    unitName: string;
    unitCode?: string;
    unitType?: string;
  };
}

