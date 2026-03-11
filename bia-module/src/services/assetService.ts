import { Asset, AssetType, AssetCategory, CreateAssetRequest, UpdateAssetRequest, AssetStatus, CriticalityTier } from '@/types/asset';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USE_MOCK_DATA = true; // Set to false to use real backend

// Mock data
const mockAssets: Asset[] = [
  {
    id: 1,
    assetName: 'Primary Database Server',
    assetTypeId: 1,
    assetTypeName: 'Technology',
    categoryId: 1,
    categoryName: 'Hardware',
    description: 'Main production database server',
    locationName: 'Data Center A',
    owner: 'IT Department',
    inheritedCriticality: CriticalityTier.TIER_1,
    criticalityScore: 32,
    processCount: 5,
    dependencyCount: 2,
    dependentCount: 3,
    isCritical: true,
    status: AssetStatus.ACTIVE,
    purchaseDate: '2022-01-15',
    warrantyExpiry: '2025-01-15',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 2,
    assetName: 'Email Server Cluster',
    assetTypeId: 1,
    assetTypeName: 'Technology',
    categoryId: 2,
    categoryName: 'Software',
    description: 'Enterprise email infrastructure',
    locationName: 'Data Center B',
    owner: 'IT Department',
    inheritedCriticality: CriticalityTier.TIER_2,
    criticalityScore: 24,
    processCount: 3,
    dependencyCount: 1,
    dependentCount: 2,
    isCritical: true,
    status: AssetStatus.ACTIVE,
    purchaseDate: '2021-06-20',
    warrantyExpiry: '2024-06-20',
    createdAt: '2021-06-20T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 3,
    assetName: 'Customer Portal Application',
    assetTypeId: 1,
    assetTypeName: 'Technology',
    categoryId: 2,
    categoryName: 'Software',
    description: 'Customer-facing web portal',
    locationName: 'Cloud - AWS',
    owner: 'Digital Services',
    inheritedCriticality: CriticalityTier.TIER_1,
    criticalityScore: 36,
    processCount: 8,
    dependencyCount: 3,
    dependentCount: 5,
    isCritical: true,
    status: AssetStatus.ACTIVE,
    purchaseDate: '2023-03-10',
    warrantyExpiry: '2026-03-10',
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 4,
    assetName: 'Backup Generator',
    assetTypeId: 2,
    assetTypeName: 'Equipment',
    categoryId: 3,
    categoryName: 'Power',
    description: '500kW backup power generator',
    locationName: 'Building A',
    owner: 'Facilities',
    inheritedCriticality: CriticalityTier.TIER_2,
    criticalityScore: 28,
    processCount: 4,
    dependencyCount: 0,
    dependentCount: 1,
    isCritical: true,
    status: AssetStatus.ACTIVE,
    purchaseDate: '2020-09-05',
    warrantyExpiry: '2025-09-05',
    createdAt: '2020-09-05T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 5,
    assetName: 'Network Firewall',
    assetTypeId: 1,
    assetTypeName: 'Technology',
    categoryId: 4,
    categoryName: 'Security',
    description: 'Enterprise network security appliance',
    locationName: 'Data Center A',
    owner: 'Security Team',
    inheritedCriticality: CriticalityTier.TIER_1,
    criticalityScore: 34,
    processCount: 6,
    dependencyCount: 1,
    dependentCount: 4,
    isCritical: true,
    status: AssetStatus.ACTIVE,
    purchaseDate: '2022-11-12',
    warrantyExpiry: '2025-11-12',
    createdAt: '2022-11-12T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  }
];

const mockAssetTypes: AssetType[] = [
  { id: 1, typeName: 'Technology', description: 'IT and technology assets', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, typeName: 'Equipment', description: 'Physical equipment and machinery', createdAt: '2024-01-01T00:00:00Z' },
  { id: 3, typeName: 'Facility', description: 'Buildings and facilities', createdAt: '2024-01-01T00:00:00Z' },
  { id: 4, typeName: 'People', description: 'Human resources', createdAt: '2024-01-01T00:00:00Z' }
];

const mockAssetCategories: AssetCategory[] = [
  { id: 1, categoryName: 'Hardware', description: 'Physical hardware', assetTypeId: 1, assetTypeName: 'Technology', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, categoryName: 'Software', description: 'Software applications', assetTypeId: 1, assetTypeName: 'Technology', createdAt: '2024-01-01T00:00:00Z' },
  { id: 3, categoryName: 'Power', description: 'Power equipment', assetTypeId: 2, assetTypeName: 'Equipment', createdAt: '2024-01-01T00:00:00Z' },
  { id: 4, categoryName: 'Security', description: 'Security systems', assetTypeId: 1, assetTypeName: 'Technology', createdAt: '2024-01-01T00:00:00Z' }
];

/**
 * Asset Service
 *
 * Handles all API calls for the Asset Library.
 * Assets include inherited criticality from linked processes.
 */
export const assetService = {
  /**
   * Get all assets with inherited criticality
   */
  getAll: async (): Promise<Asset[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAssets;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  /**
   * Get asset by ID
   */
  getById: async (id: number): Promise<Asset> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const asset = mockAssets.find(a => a.id === id);
      if (!asset) {
        throw new Error('Asset not found');
      }
      return asset;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset');
    }

    return response.json();
  },

  /**
   * Create a new asset
   */
  create: async (asset: CreateAssetRequest): Promise<Asset> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newAsset: Asset = {
        id: Math.max(...mockAssets.map(a => a.id)) + 1,
        ...asset,
        status: asset.status || AssetStatus.ACTIVE,
        assetTypeName: mockAssetTypes.find(t => t.id === asset.assetTypeId)?.typeName || '',
        categoryName: mockAssetCategories.find(c => c.id === asset.categoryId)?.categoryName || '',
        inheritedCriticality: CriticalityTier.TIER_5,
        criticalityScore: 0,
        processCount: 0,
        dependencyCount: 0,
        dependentCount: 0,
        isCritical: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'User',
        updatedBy: 'User'
      };
      mockAssets.push(newAsset);
      return newAsset;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create asset');
    }

    return response.json();
  },

  /**
   * Update an existing asset
   */
  update: async (id: number, asset: UpdateAssetRequest): Promise<Asset> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockAssets.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Asset not found');
      }
      mockAssets[index] = {
        ...mockAssets[index],
        ...asset,
        assetTypeName: mockAssetTypes.find(t => t.id === asset.assetTypeId)?.typeName || mockAssets[index].assetTypeName,
        categoryName: mockAssetCategories.find(c => c.id === asset.categoryId)?.categoryName || mockAssets[index].categoryName,
        updatedAt: new Date().toISOString(),
        updatedBy: 'User'
      };
      return mockAssets[index];
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update asset');
    }

    return response.json();
  },

  /**
   * Delete an asset (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockAssets.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssets.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete asset');
    }
  },

  /**
   * Get all asset types (for filter dropdown)
   */
  getTypes: async (): Promise<AssetType[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockAssetTypes;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset types');
    }

    return response.json();
  },

  /**
   * Get all asset categories (for filter dropdown)
   */
  getCategories: async (): Promise<AssetCategory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockAssetCategories;
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset categories');
    }

    return response.json();
  },

  /**
   * Get categories by asset type (for cascading filter)
   */
  getCategoriesByType: async (typeId: number): Promise<AssetCategory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockAssetCategories.filter(c => c.assetTypeId === typeId);
    }

    const response = await fetch(`${API_BASE_URL}/api/assets/types/${typeId}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories for type');
    }

    return response.json();
  },
};

