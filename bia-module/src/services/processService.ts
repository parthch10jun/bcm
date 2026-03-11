import { Process, CreateProcessRequest, UpdateProcessRequest, ProcessStatus } from '@/types/process';

const API_BASE_URL = 'http://localhost:8080/api/processes';

/**
 * Service for managing business processes
 * Provides methods to interact with the Process API
 */
export const processService = {
  /**
   * Get all processes
   * @param filters Optional filters (unitId, status, critical, search)
   */
  async getAll(filters?: {
    unitId?: number;
    status?: ProcessStatus;
    critical?: boolean;
    search?: string;
  }): Promise<Process[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.unitId) {
        params.append('unit_id', filters.unitId.toString());
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.critical !== undefined) {
        params.append('critical', filters.critical.toString());
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const url = params.toString() ? `${API_BASE_URL}?${params}` : API_BASE_URL;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch processes: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching processes:', error);
      // Return mock data as fallback
      return getMockProcesses();
    }
  },

  /**
   * Get process by ID
   */
  async getById(id: number): Promise<Process> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch process: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching process:', error);
      throw error;
    }
  },

  /**
   * Get all processes for a specific organizational unit
   */
  async getByUnitId(unitId: number): Promise<Process[]> {
    return this.getAll({ unitId });
  },

  /**
   * Get all critical processes
   */
  async getCritical(): Promise<Process[]> {
    return this.getAll({ critical: true });
  },

  /**
   * Search processes by name
   */
  async search(name: string): Promise<Process[]> {
    return this.getAll({ search: name });
  },

  /**
   * Create a new process
   */
  async create(request: CreateProcessRequest): Promise<Process> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create process: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating process:', error);
      throw error;
    }
  },

  /**
   * Update an existing process
   */
  async update(id: number, request: UpdateProcessRequest): Promise<Process> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update process: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating process:', error);
      throw error;
    }
  },

  /**
   * Delete a process
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete process: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting process:', error);
      throw error;
    }
  },
};

/**
 * Mock data for fallback when API is unavailable
 */
function getMockProcesses(): Process[] {
  return [
    {
      id: 1,
      processName: 'Customer Order Processing',
      processCode: 'PROC-001',
      description: 'End-to-end process for handling customer orders from receipt to fulfillment',
      organizationalUnitId: 1,
      organizationalUnitName: 'Sales Department',
      organizationalUnitCode: 'ORG-SALES',
      processOwner: 'John Smith',
      status: ProcessStatus.ACTIVE,
      isCritical: true,
      createdAt: new Date().toISOString(),
      biaCount: 2,
    },
    {
      id: 2,
      processName: 'Payroll Processing',
      processCode: 'PROC-002',
      description: 'Monthly payroll calculation and disbursement process',
      organizationalUnitId: 2,
      organizationalUnitName: 'Finance Department',
      organizationalUnitCode: 'ORG-FIN',
      processOwner: 'Jane Doe',
      status: ProcessStatus.ACTIVE,
      isCritical: true,
      createdAt: new Date().toISOString(),
      biaCount: 1,
    },
    {
      id: 3,
      processName: 'IT Support Ticketing',
      processCode: 'PROC-003',
      description: 'Process for managing and resolving IT support tickets',
      organizationalUnitId: 3,
      organizationalUnitName: 'IT Department',
      organizationalUnitCode: 'ORG-IT',
      processOwner: 'Bob Johnson',
      status: ProcessStatus.ACTIVE,
      isCritical: false,
      createdAt: new Date().toISOString(),
      biaCount: 0,
    },
    {
      id: 4,
      processName: 'Employee Onboarding',
      processCode: 'PROC-004',
      description: 'Complete onboarding process for new employees',
      organizationalUnitId: 4,
      organizationalUnitName: 'Human Resources',
      organizationalUnitCode: 'ORG-HR',
      processOwner: 'Alice Williams',
      status: ProcessStatus.ACTIVE,
      isCritical: false,
      createdAt: new Date().toISOString(),
      biaCount: 1,
    },
    {
      id: 5,
      processName: 'Inventory Management',
      processCode: 'PROC-005',
      description: 'Process for tracking and managing inventory levels',
      organizationalUnitId: 5,
      organizationalUnitName: 'Operations',
      organizationalUnitCode: 'ORG-OPS',
      processOwner: 'Charlie Brown',
      status: ProcessStatus.ACTIVE,
      isCritical: true,
      createdAt: new Date().toISOString(),
      biaCount: 1,
    },
  ];
}

