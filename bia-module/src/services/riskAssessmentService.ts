// Risk Assessment API Service Layer

import {
  ThreatType,
  EnablerType,
  Threat,
  RiskCategory,
  RiskAssessment,
  ThreatAssessment,
  RiskCategoryThreat,
  CreateThreatRequest,
  UpdateThreatRequest,
  CreateRiskCategoryThreatRequest,
  CreateRiskAssessmentRequest,
  CreateThreatAssessmentRequest,
  RiskContextRequest,
  RiskContextResponse,
  EnablerTypeCode,
  RiskCategoryCode
} from '@/types/risk-assessment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USE_MOCK_DATA = true; // Set to false to use real backend

// ============================================
// MOCK DATA
// ============================================

// Mock Threat Types
const mockThreatTypes: ThreatType[] = [
  {
    id: 1,
    name: 'Natural Disaster',
    description: 'Natural events that can disrupt operations',
    displayOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 2,
    name: 'Cyber Security',
    description: 'Digital threats and cyber attacks',
    displayOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 3,
    name: 'Infrastructure Failure',
    description: 'Failures in critical infrastructure',
    displayOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 4,
    name: 'Human Error',
    description: 'Mistakes and errors by personnel',
    displayOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 5,
    name: 'Supply Chain',
    description: 'Disruptions in supply chain and vendors',
    displayOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 6,
    name: 'Health & Safety',
    description: 'Health emergencies and safety incidents',
    displayOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  }
];

// Mock Enabler Types (BETH3V)
const mockEnablerTypes: EnablerType[] = [
  {
    id: 1,
    code: EnablerTypeCode.BUILDING,
    name: 'Buildings',
    description: 'Physical facilities and structures',
    displayOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 2,
    code: EnablerTypeCode.EQUIPMENT,
    name: 'Equipment',
    description: 'Physical equipment and machinery',
    displayOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 3,
    code: EnablerTypeCode.TECHNOLOGY,
    name: 'Technology',
    description: 'IT systems and technology infrastructure',
    displayOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 4,
    code: EnablerTypeCode.PEOPLE,
    name: 'People (Humans)',
    description: 'Human resources and personnel',
    displayOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 5,
    code: EnablerTypeCode.VENDOR,
    name: 'Third-party Vendors',
    description: 'External vendors and suppliers',
    displayOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  },
  {
    id: 6,
    code: EnablerTypeCode.VITAL_RECORD,
    name: 'Vital Records',
    description: 'Critical documents and data',
    displayOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false
  }
];

// Mock Threats
const mockThreats: Threat[] = [
  {
    id: 1,
    name: 'Earthquake',
    description: 'Seismic activity causing structural damage',
    threatTypeId: 1,
    threatType: mockThreatTypes[0],
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 2,
    name: 'Flood',
    description: 'Water damage from flooding',
    threatTypeId: 1,
    threatType: mockThreatTypes[0],
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 3,
    name: 'Hurricane/Typhoon',
    description: 'Severe tropical storm with high winds',
    threatTypeId: 1,
    threatType: mockThreatTypes[0],
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 4,
    name: 'Ransomware Attack',
    description: 'Malicious software encrypting data for ransom',
    threatTypeId: 2,
    threatType: mockThreatTypes[1],
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 5,
    name: 'Data Breach',
    description: 'Unauthorized access to sensitive data',
    threatTypeId: 2,
    threatType: mockThreatTypes[1],
    displayOrder: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 6,
    name: 'DDoS Attack',
    description: 'Distributed denial of service attack',
    threatTypeId: 2,
    threatType: mockThreatTypes[1],
    displayOrder: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 7,
    name: 'Power Outage',
    description: 'Loss of electrical power supply',
    threatTypeId: 3,
    threatType: mockThreatTypes[2],
    displayOrder: 7,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 8,
    name: 'Network Failure',
    description: 'Failure of network infrastructure',
    threatTypeId: 3,
    threatType: mockThreatTypes[2],
    displayOrder: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 9,
    name: 'Accidental Data Deletion',
    description: 'Unintentional deletion of critical data',
    threatTypeId: 4,
    threatType: mockThreatTypes[3],
    displayOrder: 9,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 10,
    name: 'Vendor Service Disruption',
    description: 'Critical vendor unable to provide services',
    threatTypeId: 5,
    threatType: mockThreatTypes[4],
    displayOrder: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 11,
    name: 'Pandemic',
    description: 'Widespread disease outbreak affecting workforce',
    threatTypeId: 6,
    threatType: mockThreatTypes[5],
    displayOrder: 11,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  },
  {
    id: 12,
    name: 'Fire',
    description: 'Fire damage to facilities or equipment',
    threatTypeId: 1,
    threatType: mockThreatTypes[0],
    displayOrder: 12,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    threatEnablerTypes: []
  }
];

// Mock Risk Categories
const mockRiskCategories: RiskCategory[] = [
  {
    id: 1,
    code: RiskCategoryCode.LOCATION,
    name: 'Location Risk',
    description: 'Risks associated with physical locations and facilities',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 2,
    code: RiskCategoryCode.ORG_UNIT,
    name: 'Organizational Unit Risk',
    description: 'Risks specific to organizational units and departments',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 3,
    code: RiskCategoryCode.PROCESS,
    name: 'Process Risk',
    description: 'Risks affecting business processes',
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 4,
    code: RiskCategoryCode.SUPPLIER,
    name: 'Supplier Risk',
    description: 'Risks from third-party suppliers and vendors',
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 5,
    code: RiskCategoryCode.APPLICATION,
    name: 'Application Risk',
    description: 'Risks related to software applications',
    displayOrder: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 6,
    code: RiskCategoryCode.ASSET,
    name: 'Asset Risk',
    description: 'Risks to physical and digital assets',
    displayOrder: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 7,
    code: RiskCategoryCode.PROJECT,
    name: 'Project Risk',
    description: 'Risks affecting projects and initiatives',
    displayOrder: 7,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 8,
    code: RiskCategoryCode.PEOPLE,
    name: 'People Risk',
    description: 'Risks related to human resources',
    displayOrder: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  },
  {
    id: 9,
    code: RiskCategoryCode.DATA,
    name: 'Data Risk',
    description: 'Risks to data integrity and availability',
    displayOrder: 9,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    isDeleted: false,
    riskCategoryThreats: []
  }
];

// ============================================
// THREAT TYPES
// ============================================

export const threatTypeService = {
  getAll: async (): Promise<ThreatType[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockThreatTypes;
    }

    const response = await fetch(`${API_BASE_URL}/api/threat-types`);
    if (!response.ok) throw new Error('Failed to fetch threat types');
    return response.json();
  },

  getById: async (id: number): Promise<ThreatType> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const threatType = mockThreatTypes.find(t => t.id === id);
      if (!threatType) throw new Error('Threat type not found');
      return threatType;
    }

    const response = await fetch(`${API_BASE_URL}/api/threat-types/${id}`);
    if (!response.ok) throw new Error('Failed to fetch threat type');
    return response.json();
  },

  create: async (data: Partial<ThreatType>): Promise<ThreatType> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const newThreatType: ThreatType = {
        id: Math.max(...mockThreatTypes.map(t => t.id)) + 1,
        name: data.name || '',
        description: data.description,
        displayOrder: data.displayOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isDeleted: false
      };
      mockThreatTypes.push(newThreatType);
      return newThreatType;
    }

    const response = await fetch(`${API_BASE_URL}/api/threat-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create threat type');
    return response.json();
  },

  update: async (id: number, data: Partial<ThreatType>): Promise<ThreatType> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockThreatTypes.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Threat type not found');
      mockThreatTypes[index] = { ...mockThreatTypes[index], ...data, updatedAt: new Date().toISOString() };
      return mockThreatTypes[index];
    }

    const response = await fetch(`${API_BASE_URL}/api/threat-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update threat type');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockThreatTypes.findIndex(t => t.id === id);
      if (index !== -1) {
        mockThreatTypes.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/threat-types/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete threat type');
  }
};

// ============================================
// ENABLER TYPES
// ============================================

export const enablerTypeService = {
  getAll: async (): Promise<EnablerType[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockEnablerTypes;
    }

    const response = await fetch(`${API_BASE_URL}/api/enabler-types`);
    if (!response.ok) throw new Error('Failed to fetch enabler types');
    return response.json();
  },

  getById: async (id: number): Promise<EnablerType> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const enablerType = mockEnablerTypes.find(e => e.id === id);
      if (!enablerType) throw new Error('Enabler type not found');
      return enablerType;
    }

    const response = await fetch(`${API_BASE_URL}/api/enabler-types/${id}`);
    if (!response.ok) throw new Error('Failed to fetch enabler type');
    return response.json();
  }
};

// ============================================
// THREATS
// ============================================

export const threatService = {
  getAll: async (): Promise<Threat[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockThreats;
    }

    const response = await fetch(`${API_BASE_URL}/api/threats`);
    if (!response.ok) throw new Error('Failed to fetch threats');
    return response.json();
  },

  getById: async (id: number): Promise<Threat> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const threat = mockThreats.find(t => t.id === id);
      if (!threat) throw new Error('Threat not found');
      return threat;
    }

    const response = await fetch(`${API_BASE_URL}/api/threats/${id}`);
    if (!response.ok) throw new Error('Failed to fetch threat');
    return response.json();
  },

  getByThreatType: async (threatTypeId: number): Promise<Threat[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockThreats.filter(t => t.threatTypeId === threatTypeId);
    }

    const response = await fetch(`${API_BASE_URL}/api/threats/by-threat-type/${threatTypeId}`);
    if (!response.ok) throw new Error('Failed to fetch threats by type');
    return response.json();
  },

  getByEnablerType: async (enablerTypeId: number): Promise<Threat[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // For mock data, return all threats (in real implementation, would filter by enabler type)
      return mockThreats;
    }

    const response = await fetch(`${API_BASE_URL}/api/threats/by-enabler-type/${enablerTypeId}`);
    if (!response.ok) throw new Error('Failed to fetch threats by enabler type');
    return response.json();
  },

  create: async (data: CreateThreatRequest): Promise<Threat> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const threatType = mockThreatTypes.find(t => t.id === data.threatTypeId);
      const newThreat: Threat = {
        id: Math.max(...mockThreats.map(t => t.id)) + 1,
        name: data.name,
        description: data.description,
        threatTypeId: data.threatTypeId,
        threatType: threatType,
        displayOrder: data.displayOrder,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isDeleted: false,
        threatEnablerTypes: []
      };
      mockThreats.push(newThreat);
      return newThreat;
    }

    const response = await fetch(`${API_BASE_URL}/api/threats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create threat');
    return response.json();
  },

  update: async (id: number, data: UpdateThreatRequest): Promise<Threat> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockThreats.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Threat not found');
      const threatType = data.threatTypeId ? mockThreatTypes.find(t => t.id === data.threatTypeId) : mockThreats[index].threatType;
      mockThreats[index] = {
        ...mockThreats[index],
        ...data,
        threatType: threatType,
        updatedAt: new Date().toISOString()
      };
      return mockThreats[index];
    }

    const response = await fetch(`${API_BASE_URL}/api/threats/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update threat');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockThreats.findIndex(t => t.id === id);
      if (index !== -1) {
        mockThreats.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/threats/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete threat');
  }
};

// ============================================
// RISK CATEGORIES
// ============================================

export const riskCategoryService = {
  getAll: async (): Promise<RiskCategory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRiskCategories;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories`);
    if (!response.ok) throw new Error('Failed to fetch risk categories');
    return response.json();
  },

  getById: async (id: number): Promise<RiskCategory> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const category = mockRiskCategories.find(c => c.id === id);
      if (!category) throw new Error('Risk category not found');
      return category;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch risk category');
    return response.json();
  },

  create: async (data: Partial<RiskCategory>): Promise<RiskCategory> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newCategory: RiskCategory = {
        id: Math.max(...mockRiskCategories.map(c => c.id)) + 1,
        code: data.code || RiskCategoryCode.LOCATION,
        name: data.name || '',
        description: data.description,
        displayOrder: data.displayOrder,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isDeleted: false,
        riskCategoryThreats: []
      };
      mockRiskCategories.push(newCategory);
      return newCategory;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create risk category');
    return response.json();
  },

  update: async (id: number, data: Partial<RiskCategory>): Promise<RiskCategory> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockRiskCategories.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Risk category not found');
      mockRiskCategories[index] = {
        ...mockRiskCategories[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return mockRiskCategories[index];
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update risk category');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockRiskCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockRiskCategories.splice(index, 1);
      }
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete risk category');
  },

  assignThreat: async (data: CreateRiskCategoryThreatRequest): Promise<RiskCategoryThreat> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Mock implementation - just return a mock object
      const threat = mockThreats.find(t => t.id === data.threatId);
      const category = mockRiskCategories.find(c => c.id === data.riskCategoryId);
      return {
        id: Date.now(),
        riskCategoryId: data.riskCategoryId,
        riskCategory: category,
        threatId: data.threatId,
        threat: threat,
        isDefaultSelected: data.isDefaultSelected || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isDeleted: false
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${data.riskCategoryId}/threats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to assign threat to risk category');
    return response.json();
  },

  removeThreat: async (riskCategoryId: number, threatId: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Mock implementation - no-op
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${riskCategoryId}/threats/${threatId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove threat from risk category');
  },

  // Convenience methods matching the page usage
  getAllRiskCategories: async (): Promise<RiskCategory[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRiskCategories;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories`);
    if (!response.ok) throw new Error('Failed to fetch risk categories');
    return response.json();
  },

  createRiskCategory: async (data: Partial<RiskCategory>): Promise<RiskCategory> => {
    return riskCategoryService.create(data);
  },

  updateRiskCategory: async (id: number, data: Partial<RiskCategory>): Promise<RiskCategory> => {
    return riskCategoryService.update(id, data);
  },

  assignThreats: async (riskCategoryId: number, threatIds: number[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock implementation - no-op
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${riskCategoryId}/threats/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threatIds })
    });
    if (!response.ok) throw new Error('Failed to update risk category');
    return response.json();
  },

  deleteRiskCategory: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock implementation - no-op
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/risk-categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete risk category');
  }
};

// ============================================
// RISK ASSESSMENTS
// ============================================

export const riskAssessmentService = {
  getAll: async (): Promise<RiskAssessment[]> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments`);
    if (!response.ok) throw new Error('Failed to fetch risk assessments');
    return response.json();
  },

  getById: async (id: number): Promise<RiskAssessment> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch risk assessment');
    return response.json();
  },

  getByContext: async (contextType: string, contextId: number): Promise<RiskAssessment[]> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments/by-context/${contextType}/${contextId}`);
    if (!response.ok) throw new Error('Failed to fetch risk assessments by context');
    return response.json();
  },

  create: async (data: CreateRiskAssessmentRequest): Promise<RiskAssessment> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create risk assessment');
    return response.json();
  },

  update: async (id: number, data: Partial<RiskAssessment>): Promise<RiskAssessment> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update risk assessment');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete risk assessment');
  }
};

// ============================================
// THREAT ASSESSMENTS
// ============================================

export const threatAssessmentService = {
  getByRiskAssessment: async (riskAssessmentId: number): Promise<ThreatAssessment[]> => {
    const response = await fetch(`${API_BASE_URL}/api/threat-assessments/by-risk-assessment/${riskAssessmentId}`);
    if (!response.ok) throw new Error('Failed to fetch threat assessments');
    return response.json();
  },

  create: async (data: CreateThreatAssessmentRequest): Promise<ThreatAssessment> => {
    const response = await fetch(`${API_BASE_URL}/api/threat-assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create threat assessment');
    return response.json();
  },

  update: async (id: number, data: Partial<ThreatAssessment>): Promise<ThreatAssessment> => {
    const response = await fetch(`${API_BASE_URL}/api/threat-assessments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update threat assessment');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/threat-assessments/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete threat assessment');
  }
};

// ============================================
// RISK CONTEXT SERVICE
// ============================================

export const riskContextService = {
  getApplicableThreats: async (request: RiskContextRequest): Promise<RiskContextResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-context/applicable-threats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error('Failed to fetch applicable threats');
    return response.json();
  }
};

// ============================================
// TREATMENT PLAN SERVICE
// ============================================

export interface TreatmentPlan {
  id: number;
  threatAssessmentId: number;
  threatId: number;
  threatName: string;
  treatmentOption: string;
  actionDescription: string;
  actionOwner: string;
  targetDate: string;
  status: string;
  completionDate?: string;
  effectivenessReview?: string;
  createdAt: string;
  updatedAt: string;
}

export const treatmentPlanService = {
  getByRiskAssessment: async (riskAssessmentId: number): Promise<TreatmentPlan[]> => {
    const response = await fetch(`${API_BASE_URL}/api/risk-assessments/wizard/${riskAssessmentId}/treatment-plans`);
    if (!response.ok) throw new Error('Failed to fetch treatment plans');
    return response.json();
  }
};
