/**
 * BIA Service
 * 
 * Handles all API calls for the polymorphic BIA hub architecture.
 * Supports the 12-step BIA wizard workflow.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BiaRecord {
  id?: number;
  biaName: string;
  biaTargetId: number;
  biaTargetType: 'PROCESS' | 'ORGANIZATIONAL_UNIT' | 'ASSET' | 'LOCATION' | 'SERVICE' | 'VENDOR' | 'VITAL_RECORD';
  biaType: 'PROCESS' | 'DEPARTMENT' | 'LOCATION';
  status: 'DRAFT' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  biaCoordinator?: string;
  analysisDate?: string;
  finalRtoHours?: number;
  finalRpoHours?: number;
  finalCriticality?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt?: string;
  updatedAt?: string;
  // Versioning fields
  fiscalYear?: string; // e.g., "FY2025"
  version?: number; // e.g., 1, 2, 3... (evaluation count within fiscal year)
  versionLabel?: string; // e.g., "FY2025-1", "FY2025-5"
  previousVersionId?: number; // Link to previous version
  isLatestVersion?: boolean;
}

export interface BiaAnswer {
  questionId: number;
  answerValue: string;
  answerScore?: number;
  answerNotes?: string;
}

export interface BiaDependency {
  dependencyId: number;
  dependencyType: 'REQUIRED' | 'IMPORTANT' | 'OPTIONAL';
  notes?: string;
  // For people dependencies
  roleInBia?: string;
  isCritical?: boolean;
  // For vendor dependencies
  serviceProvided?: string;
}

export interface BiaTargetProcess {
  processId: number;
  processName?: string;
  processCode?: string;
  processOwner?: string;
  isPrimary: boolean;
  selectionReason?: string;
}

export interface BiaCalculationResult {
  suggestedRto: number;
  suggestedRpo: number;
  suggestedCriticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface GapDetail {
  dependencyName: string;
  dependencyType: string;
  gapType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requirement: number;
  capability: number;
  gap: number;
  description: string;
  recommendation: string;
}

export interface BiaGapAnalysis {
  biaId: number;
  biaName: string;
  requiredRto: number;
  requiredRpo: number;
  requiredCriticality: string;
  hasGaps: boolean;
  totalGaps: number;
  criticalGaps: number;
  assetGaps: GapDetail[];
  vendorGaps: GapDetail[];
  vitalRecordGaps: GapDetail[];
  peopleGaps: GapDetail[];
  processGaps: GapDetail[];
}

export interface BiaSummary {
  bia: BiaRecord;
  answers: BiaAnswer[];
  dependencies: {
    assets: any[];
    people: any[];
    vendors: any[];
    vitalRecords: any[];
    processes: any[];
  };
  gapAnalysis: BiaGapAnalysis;
}

// ============================================================================
// API SERVICE
// ============================================================================

export const biaService = {
  /**
   * Get all BIAs with optional filtering
   */
  getAll: async (params?: {
    status?: string;
    targetType?: string;
    criticality?: string;
  }): Promise<BiaRecord[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.targetType) queryParams.append('targetType', params.targetType);
    if (params?.criticality) queryParams.append('criticality', params.criticality);

    const url = `${API_BASE_URL}/api/bias${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch BIAs');
    }

    return response.json();
  },

  /**
   * Get BIA by ID
   */
  getById: async (id: number): Promise<BiaRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch BIA');
    }

    return response.json();
  },

  /**
   * Create a new BIA
   */
  create: async (bia: BiaRecord): Promise<BiaRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/bias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bia),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create BIA');
    }

    return response.json();
  },

  /**
   * Update an existing BIA
   */
  update: async (id: number, bia: Partial<BiaRecord>): Promise<BiaRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bia),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update BIA');
    }

    return response.json();
  },

  /**
   * Delete a BIA (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete BIA');
    }
  },

  /**
   * Submit questionnaire answers
   */
  submitAnswers: async (id: number, answers: BiaAnswer[]): Promise<{ message: string; suggestedRto: number; suggestedRpo: number; suggestedCriticality: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answers');
    }

    return response.json();
  },

  /**
   * Get questionnaire answers
   */
  getAnswers: async (id: number): Promise<BiaAnswer[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/answers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch answers');
    }

    return response.json();
  },

  /**
   * Calculate suggested metrics
   */
  calculateMetrics: async (id: number): Promise<BiaCalculationResult> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/calculate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to calculate metrics');
    }

    return response.json();
  },

  /**
   * Apply calculated metrics to BIA
   */
  applyCalculation: async (id: number): Promise<BiaRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/apply-calculation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to apply calculation');
    }

    return response.json();
  },

  /**
   * Link assets to BIA
   */
  linkAssets: async (id: number, dependencies: BiaDependency[]): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependencies),
    });

    if (!response.ok) {
      throw new Error('Failed to link assets');
    }

    return response.json();
  },

  /**
   * Link people to BIA
   */
  linkPeople: async (id: number, dependencies: BiaDependency[]): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependencies),
    });

    if (!response.ok) {
      throw new Error('Failed to link people');
    }

    return response.json();
  },

  /**
   * Link vendors to BIA
   */
  linkVendors: async (id: number, dependencies: BiaDependency[]): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependencies),
    });

    if (!response.ok) {
      throw new Error('Failed to link vendors');
    }

    return response.json();
  },

  /**
   * Link vital records to BIA
   */
  linkVitalRecords: async (id: number, dependencies: BiaDependency[]): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies/vital-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependencies),
    });

    if (!response.ok) {
      throw new Error('Failed to link vital records');
    }

    return response.json();
  },

  /**
   * Link processes to BIA
   */
  linkProcesses: async (id: number, dependencies: BiaDependency[]): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies/processes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependencies),
    });

    if (!response.ok) {
      throw new Error('Failed to link processes');
    }

    return response.json();
  },

  /**
   * Get all dependencies for a BIA
   */
  getDependencies: async (id: number): Promise<{
    assets: any[];
    people: any[];
    vendors: any[];
    vitalRecords: any[];
    processes: any[];
  }> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/dependencies`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dependencies');
    }

    return response.json();
  },

  /**
   * Perform gap analysis
   */
  performGapAnalysis: async (id: number): Promise<BiaGapAnalysis> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/gap-analysis`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to perform gap analysis');
    }

    return response.json();
  },

  /**
   * Get complete BIA summary
   */
  getSummary: async (id: number): Promise<BiaSummary> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch BIA summary');
    }

    return response.json();
  },

  /**
   * Finalize BIA (change status to APPROVED)
   */
  finalize: async (id: number): Promise<BiaRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${id}/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to finalize BIA');
    }

    return response.json();
  },

  // ============================================================================
  // MULTI-PROCESS BIA SUPPORT (V9 Migration)
  // ============================================================================

  /**
   * Add target processes to a BIA (for multi-process BIA analysis)
   * @param biaId - The BIA record ID
   * @param processes - Array of processes to add as targets
   */
  addTargetProcesses: async (biaId: number, processes: Array<{
    processId: number;
    isPrimary: boolean;
    selectionReason?: string;
  }>): Promise<BiaTargetProcess[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/target-processes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processes),
    });

    if (!response.ok) {
      throw new Error('Failed to add target processes');
    }

    return response.json();
  },

  /**
   * Get all target processes for a BIA
   * @param biaId - The BIA record ID
   */
  getTargetProcesses: async (biaId: number): Promise<BiaTargetProcess[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/target-processes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch target processes');
    }

    return response.json();
  },

  /**
   * Remove a target process from a BIA
   * @param biaId - The BIA record ID
   * @param processId - The process ID to remove
   */
  removeTargetProcess: async (biaId: number, processId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/target-processes/${processId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to remove target process');
    }
  },
};

export default biaService;
