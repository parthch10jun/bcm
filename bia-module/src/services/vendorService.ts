/**
 * Service for Vendor API calls
 */

import { Vendor, CreateVendorRequest, UpdateVendorRequest, VendorStatus, ServiceType } from '@/types/vendor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USE_MOCK_DATA = true; // Set to false to use real backend

// Mock data
const mockVendors: Vendor[] = [
  {
    id: 1,
    vendorName: 'CloudTech Solutions',
    status: VendorStatus.ACTIVE,
    serviceType: ServiceType.CLOUD_PROVIDER,
    description: 'Cloud infrastructure and hosting provider',
    contactName: 'Robert Brown',
    contactEmail: 'robert.brown@cloudtech.com',
    contactPhone: '+1-800-555-2001',
    address: '100 Cloud Drive, Seattle, WA 98101',
    contractStartDate: '2023-01-01',
    contractEndDate: '2025-12-31',
    recoveryTimeCapability: 4,
    website: 'https://cloudtech.com',
    notes: 'Primary cloud infrastructure provider',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    processCount: 5,
    assetCount: 12
  },
  {
    id: 2,
    vendorName: 'SecureNet Inc',
    status: VendorStatus.ACTIVE,
    serviceType: ServiceType.MANAGED_SERVICE,
    description: 'Network security and monitoring services',
    contactName: 'Jennifer Lee',
    contactEmail: 'jennifer.lee@securenet.com',
    contactPhone: '+1-800-555-2002',
    address: '200 Security Blvd, Boston, MA 02101',
    contractStartDate: '2022-06-01',
    contractEndDate: '2024-05-31',
    recoveryTimeCapability: 2,
    website: 'https://securenet.com',
    notes: 'Network security provider',
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    processCount: 3,
    assetCount: 8
  },
  {
    id: 3,
    vendorName: 'DataBackup Pro',
    status: VendorStatus.ACTIVE,
    serviceType: ServiceType.SAAS,
    description: 'Enterprise backup and disaster recovery',
    contactName: 'Michael Torres',
    contactEmail: 'michael.torres@databackup.com',
    contactPhone: '+1-800-555-2003',
    address: '300 Backup Lane, Denver, CO 80201',
    contractStartDate: '2023-03-15',
    contractEndDate: '2026-03-14',
    recoveryTimeCapability: 1,
    website: 'https://databackup.com',
    notes: 'Backup and DR provider',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    processCount: 8,
    assetCount: 15
  },
  {
    id: 4,
    vendorName: 'Office Supplies Co',
    status: VendorStatus.ACTIVE,
    serviceType: ServiceType.SUPPLIER,
    description: 'Office equipment and supplies vendor',
    contactName: 'Amanda White',
    contactEmail: 'amanda.white@officesupplies.com',
    contactPhone: '+1-800-555-2004',
    address: '400 Supply Street, Atlanta, GA 30301',
    contractStartDate: '2022-01-01',
    contractEndDate: '2024-12-31',
    recoveryTimeCapability: 24,
    website: 'https://officesupplies.com',
    notes: 'Office supplies vendor',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    processCount: 1,
    assetCount: 2
  },
  {
    id: 5,
    vendorName: 'TelecomGlobal',
    status: VendorStatus.ACTIVE,
    serviceType: ServiceType.TELECOM,
    description: 'Telecommunications and internet services',
    contactName: 'James Wilson',
    contactEmail: 'james.wilson@telecomglobal.com',
    contactPhone: '+1-800-555-2005',
    address: '500 Telecom Plaza, Dallas, TX 75201',
    contractStartDate: '2021-01-01',
    contractEndDate: '2025-12-31',
    recoveryTimeCapability: 8,
    website: 'https://telecomglobal.com',
    notes: 'Primary telecom provider',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    processCount: 4,
    assetCount: 6
  }
];

export const vendorService = {
  /**
   * Get all vendors with optional filters
   */
  getAll: async (filters?: {
    status?: VendorStatus;
    serviceType?: ServiceType;
    search?: string;
  }): Promise<Vendor[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...mockVendors];

      if (filters?.status) {
        filtered = filtered.filter(v => v.status === filters.status);
      }
      if (filters?.serviceType) {
        filtered = filtered.filter(v => v.serviceType === filters.serviceType);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(v =>
          v.vendorName.toLowerCase().includes(search) ||
          (v.description?.toLowerCase().includes(search)) ||
          (v.contactName?.toLowerCase().includes(search))
        );
      }

      return filtered;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.serviceType) params.append('serviceType', filters.serviceType);
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_BASE_URL}/api/vendors${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }

    return response.json();
  },

  /**
   * Get a single vendor by ID
   */
  getById: async (id: number): Promise<Vendor> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const vendor = mockVendors.find(v => v.id === id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return vendor;
    }

    const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch vendor');
    }

    return response.json();
  },

  /**
   * Create a new vendor
   */
  create: async (vendor: CreateVendorRequest): Promise<Vendor> => {
    const response = await fetch(`${API_BASE_URL}/api/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create vendor');
    }

    return response.json();
  },

  /**
   * Update an existing vendor
   */
  update: async (id: number, vendor: UpdateVendorRequest): Promise<Vendor> => {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update vendor');
    }

    return response.json();
  },

  /**
   * Delete a vendor (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete vendor');
    }
  },
};

