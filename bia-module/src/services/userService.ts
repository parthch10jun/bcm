import { User, CreateUserRequest, UpdateUserRequest, UserStats, BulkUploadResult, HrmsSyncResult, UserStatus, UserRole } from '@/types/user';

const API_BASE_URL = 'http://localhost:8080/api/users';
const USE_MOCK_DATA = true; // Set to false to use real backend

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    contactNumber: '+1-212-555-1001',
    jobTitle: 'IT Director',
    userRole: UserRole.ADMIN,
    organizationalUnitId: 1,
    organizationalUnitName: 'Information Technology',
    organizationalUnitCode: 'IT',
    hrmsEmployeeId: 'EMP001',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 2,
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    contactNumber: '+1-212-555-1002',
    jobTitle: 'Finance Director',
    userRole: UserRole.MANAGER,
    organizationalUnitId: 2,
    organizationalUnitName: 'Finance',
    organizationalUnitCode: 'FIN',
    hrmsEmployeeId: 'EMP002',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 3,
    fullName: 'Mike Chen',
    email: 'mike.chen@company.com',
    contactNumber: '+1-212-555-1003',
    jobTitle: 'HR Director',
    userRole: UserRole.MANAGER,
    organizationalUnitId: 3,
    organizationalUnitName: 'Human Resources',
    organizationalUnitCode: 'HR',
    hrmsEmployeeId: 'EMP003',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 4,
    fullName: 'Emily Davis',
    email: 'emily.davis@company.com',
    contactNumber: '+1-212-555-1004',
    jobTitle: 'Operations Director',
    userRole: UserRole.MANAGER,
    organizationalUnitId: 4,
    organizationalUnitName: 'Operations',
    organizationalUnitCode: 'OPS',
    hrmsEmployeeId: 'EMP004',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 5,
    fullName: 'David Wilson',
    email: 'david.wilson@company.com',
    contactNumber: '+1-212-555-1005',
    jobTitle: 'CS Director',
    userRole: UserRole.MANAGER,
    organizationalUnitId: 5,
    organizationalUnitName: 'Customer Service',
    organizationalUnitCode: 'CS',
    hrmsEmployeeId: 'EMP005',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 6,
    fullName: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    contactNumber: '+1-212-555-1006',
    jobTitle: 'Sales Director',
    userRole: UserRole.MANAGER,
    organizationalUnitId: 6,
    organizationalUnitName: 'Sales',
    organizationalUnitCode: 'SALES',
    hrmsEmployeeId: 'EMP006',
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 7,
    fullName: 'Robert Brown',
    email: 'robert.brown@company.com',
    contactNumber: '+1-212-555-1007',
    jobTitle: 'Senior Developer',
    userRole: UserRole.USER,
    organizationalUnitId: 1,
    organizationalUnitName: 'Information Technology',
    organizationalUnitCode: 'IT',
    hrmsEmployeeId: 'EMP007',
    status: UserStatus.ACTIVE,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  },
  {
    id: 8,
    fullName: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    contactNumber: '+1-212-555-1008',
    jobTitle: 'Financial Analyst',
    userRole: UserRole.USER,
    organizationalUnitId: 2,
    organizationalUnitName: 'Finance',
    organizationalUnitCode: 'FIN',
    hrmsEmployeeId: 'EMP008',
    status: UserStatus.ACTIVE,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    lastSyncedAt: '2024-11-24T00:00:00Z'
  }
];

/**
 * Service for managing users (People Library)
 */
export const userService = {
  /**
   * Get all users
   */
  async getAll(filters?: {
    unitId?: number;
    status?: UserStatus;
    role?: string;
    search?: string;
  }): Promise<User[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...mockUsers];

      if (filters?.unitId) {
        filtered = filtered.filter(u => u.organizationalUnitId === filters.unitId);
      }
      if (filters?.status) {
        filtered = filtered.filter(u => u.status === filters.status);
      }
      if (filters?.role) {
        filtered = filtered.filter(u => u.userRole === filters.role as UserRole);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(u =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.jobTitle?.toLowerCase().includes(search))
        );
      }

      return filtered;
    }

    try {
      const params = new URLSearchParams();

      if (filters?.unitId) {
        params.append('unit_id', filters.unitId.toString());
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.role) {
        params.append('role', filters.role);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const url = params.toString() ? `${API_BASE_URL}?${params}` : API_BASE_URL;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        totalUsers: mockUsers.length,
        usersWithUnit: mockUsers.filter(u => u.organizationalUnitId).length,
        usersWithoutUnit: mockUsers.filter(u => !u.organizationalUnitId).length
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/stats`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  async create(request: CreateUserRequest): Promise<User> {
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
        throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  async update(id: number, request: UpdateUserRequest): Promise<User> {
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
        throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Bulk upload users from CSV file
   */
  async bulkUpload(file: File): Promise<BulkUploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/bulk-upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Download CSV template for bulk upload
   */
  async downloadTemplate(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk-upload/template`);
      
      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  },

  /**
   * Sync users from HRMS
   */
  async syncFromHrms(): Promise<HrmsSyncResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/sync-hrms`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync from HRMS: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing from HRMS:', error);
      throw error;
    }
  },

  /**
   * Get last HRMS sync status
   */
  async getLastSyncStatus(): Promise<HrmsSyncResult> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        syncStatus: 'SUCCESS',
        usersAdded: 2,
        usersUpdated: 6,
        usersFailed: 0,
        startedAt: '2024-11-24T08:00:00Z',
        completedAt: '2024-11-24T08:05:00Z',
        triggeredBy: 'System'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sync-hrms/status`);

      if (!response.ok) {
        throw new Error(`Failed to fetch sync status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sync status:', error);
      throw error;
    }
  },
};

