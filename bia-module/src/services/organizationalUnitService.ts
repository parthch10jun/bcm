import { OrganizationalUnit, OrganizationalUnitTree, UnitType } from '@/types/organizationalUnit';

/**
 * Organizational Unit Service
 * Connects to Spring Boot backend API for organizational structure
 */

const API_BASE_URL = 'http://localhost:8080/api/organizational-units';

// Fallback mock data for development (if backend is not running)
const mockOrganizationalUnits: OrganizationalUnit[] = [
  // Level 0: Organization
  {
    id: '1',
    unitCode: 'ORG-001',
    unitName: 'ACME Corporation',
    description: 'Global technology and services company',
    parentUnitId: undefined,
    unitType: 'ORGANIZATION',
    isBiaEligible: false,
    unitHead: 'John Smith',
    unitHeadEmail: 'john.smith@acme.com',
    employeeCount: 5000,
    level: 0,
    isLeafNode: false,
  },
  
  // Level 1: Divisions
  {
    id: '2',
    unitCode: 'DIV-OPS',
    unitName: 'Operations',
    description: 'Operations Division',
    parentUnitId: '1',
    unitType: 'DIVISION',
    isBiaEligible: false,
    unitHead: 'Sarah Johnson',
    unitHeadEmail: 'sarah.johnson@acme.com',
    employeeCount: 2000,
    level: 1,
    isLeafNode: false,
  },
  {
    id: '3',
    unitCode: 'DIV-TECH',
    unitName: 'Technology',
    description: 'Technology Division',
    parentUnitId: '1',
    unitType: 'DIVISION',
    isBiaEligible: false,
    unitHead: 'Michael Chen',
    unitHeadEmail: 'michael.chen@acme.com',
    employeeCount: 1500,
    level: 1,
    isLeafNode: false,
  },
  {
    id: '4',
    unitCode: 'DIV-FIN',
    unitName: 'Finance',
    description: 'Finance Division',
    parentUnitId: '1',
    unitType: 'DIVISION',
    isBiaEligible: false,
    unitHead: 'Emily Davis',
    unitHeadEmail: 'emily.davis@acme.com',
    employeeCount: 500,
    level: 1,
    isLeafNode: false,
  },
  {
    id: '5',
    unitCode: 'DIV-HR',
    unitName: 'Human Resources',
    description: 'Human Resources Division',
    parentUnitId: '1',
    unitType: 'DIVISION',
    isBiaEligible: false,
    unitHead: 'Robert Wilson',
    unitHeadEmail: 'robert.wilson@acme.com',
    employeeCount: 300,
    level: 1,
    isLeafNode: false,
  },
  
  // Level 2: Departments under Technology
  {
    id: '6',
    unitCode: 'DEPT-IT-INFRA',
    unitName: 'IT Infrastructure',
    description: 'Infrastructure and Operations',
    parentUnitId: '3',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'David Lee',
    unitHeadEmail: 'david.lee@acme.com',
    employeeCount: 200,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '7',
    unitCode: 'DEPT-SW-DEV',
    unitName: 'Software Development',
    description: 'Application Development',
    parentUnitId: '3',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Lisa Anderson',
    unitHeadEmail: 'lisa.anderson@acme.com',
    employeeCount: 400,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: false,
  },
  {
    id: '8',
    unitCode: 'DEPT-CYBER-SEC',
    unitName: 'Cybersecurity',
    description: 'Information Security',
    parentUnitId: '3',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'James Martinez',
    unitHeadEmail: 'james.martinez@acme.com',
    employeeCount: 150,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '9',
    unitCode: 'DEPT-DATA',
    unitName: 'Data & Analytics',
    description: 'Data Engineering and Analytics',
    parentUnitId: '3',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Maria Garcia',
    unitHeadEmail: 'maria.garcia@acme.com',
    employeeCount: 180,
    criticalityTier: 'TIER_2',
    level: 2,
    isLeafNode: true,
  },
  
  // Level 2: Departments under Finance
  {
    id: '10',
    unitCode: 'DEPT-ACCT',
    unitName: 'Accounting',
    description: 'Financial Accounting',
    parentUnitId: '4',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Patricia Brown',
    unitHeadEmail: 'patricia.brown@acme.com',
    employeeCount: 150,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '11',
    unitCode: 'DEPT-PAYROLL',
    unitName: 'Payroll',
    description: 'Payroll Processing',
    parentUnitId: '4',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Christopher Taylor',
    unitHeadEmail: 'christopher.taylor@acme.com',
    employeeCount: 80,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '12',
    unitCode: 'DEPT-FP-A',
    unitName: 'FP&A',
    description: 'Financial Planning and Analysis',
    parentUnitId: '4',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Jennifer White',
    unitHeadEmail: 'jennifer.white@acme.com',
    employeeCount: 100,
    criticalityTier: 'TIER_2',
    level: 2,
    isLeafNode: true,
  },
  
  // Level 2: Departments under Operations
  {
    id: '13',
    unitCode: 'DEPT-CUST-SVC',
    unitName: 'Customer Service',
    description: 'Customer Support Operations',
    parentUnitId: '2',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Daniel Harris',
    unitHeadEmail: 'daniel.harris@acme.com',
    employeeCount: 500,
    criticalityTier: 'TIER_1',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '14',
    unitCode: 'DEPT-LOGISTICS',
    unitName: 'Logistics',
    description: 'Supply Chain and Logistics',
    parentUnitId: '2',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Amanda Clark',
    unitHeadEmail: 'amanda.clark@acme.com',
    employeeCount: 400,
    criticalityTier: 'TIER_2',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '15',
    unitCode: 'DEPT-QUALITY',
    unitName: 'Quality Assurance',
    description: 'Quality Control and Assurance',
    parentUnitId: '2',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Kevin Rodriguez',
    unitHeadEmail: 'kevin.rodriguez@acme.com',
    employeeCount: 200,
    criticalityTier: 'TIER_2',
    level: 2,
    isLeafNode: true,
  },
  
  // Level 2: Departments under HR
  {
    id: '16',
    unitCode: 'DEPT-RECRUIT',
    unitName: 'Recruitment',
    description: 'Talent Acquisition',
    parentUnitId: '5',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Michelle Lewis',
    unitHeadEmail: 'michelle.lewis@acme.com',
    employeeCount: 80,
    criticalityTier: 'TIER_3',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '17',
    unitCode: 'DEPT-COMP-BEN',
    unitName: 'Compensation & Benefits',
    description: 'Employee Compensation and Benefits',
    parentUnitId: '5',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Brian Walker',
    unitHeadEmail: 'brian.walker@acme.com',
    employeeCount: 60,
    criticalityTier: 'TIER_2',
    level: 2,
    isLeafNode: true,
  },
  {
    id: '18',
    unitCode: 'DEPT-TRAINING',
    unitName: 'Training & Development',
    description: 'Employee Learning and Development',
    parentUnitId: '5',
    unitType: 'DEPARTMENT',
    isBiaEligible: true,
    unitHead: 'Nicole Hall',
    unitHeadEmail: 'nicole.hall@acme.com',
    employeeCount: 50,
    criticalityTier: 'TIER_3',
    level: 2,
    isLeafNode: true,
  },
  
  // Level 3: Teams under Software Development
  {
    id: '19',
    unitCode: 'TEAM-FRONTEND',
    unitName: 'Frontend Team',
    description: 'Frontend Development Team',
    parentUnitId: '7',
    unitType: 'TEAM',
    isBiaEligible: true,
    unitHead: 'Alex Turner',
    unitHeadEmail: 'alex.turner@acme.com',
    employeeCount: 50,
    criticalityTier: 'TIER_1',
    level: 3,
    isLeafNode: true,
  },
  {
    id: '20',
    unitCode: 'TEAM-BACKEND',
    unitName: 'Backend Team',
    description: 'Backend Development Team',
    parentUnitId: '7',
    unitType: 'TEAM',
    isBiaEligible: true,
    unitHead: 'Sophia King',
    unitHeadEmail: 'sophia.king@acme.com',
    employeeCount: 60,
    criticalityTier: 'TIER_1',
    level: 3,
    isLeafNode: true,
  },
  {
    id: '21',
    unitCode: 'TEAM-MOBILE',
    unitName: 'Mobile Team',
    description: 'Mobile App Development Team',
    parentUnitId: '7',
    unitType: 'TEAM',
    isBiaEligible: true,
    unitHead: 'Ryan Scott',
    unitHeadEmail: 'ryan.scott@acme.com',
    employeeCount: 40,
    criticalityTier: 'TIER_2',
    level: 3,
    isLeafNode: true,
  },
];

class OrganizationalUnitService {
  private useMockData = false; // Set to true if backend is not available

  /**
   * Convert backend DTO to frontend type
   */
  private convertFromBackend(dto: any): OrganizationalUnit {
    return {
      id: dto.id?.toString() || '',
      unitCode: dto.unitCode || '',
      unitName: dto.unitName || '',
      description: dto.description,
      parentUnitId: dto.parentUnitId?.toString(),
      unitType: dto.unitType as UnitType,
      isBiaEligible: dto.isBiaEligible || false,
      unitHead: dto.unitHead,
      unitHeadEmail: dto.unitHeadEmail,
      unitHeadPhone: dto.unitHeadPhone,
      employeeCount: dto.employeeCount,
      annualBudget: dto.annualBudget,
      criticalityTier: dto.criticalityTier,
      criticalityScore: dto.criticalityScore,
      level: dto.level || 0,
      isLeafNode: dto.isLeafNode || false,
      childCount: dto.childCount || 0,
      fullPath: dto.fullPath || '',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
    };
  }

  /**
   * Get all organizational units
   */
  async getAll(): Promise<OrganizationalUnit[]> {
    if (this.useMockData) {
      return mockOrganizationalUnits.map(unit => ({
        ...unit,
        fullPath: this.getFullPath(unit.id),
      }));
    }

    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch organizational units');
      const data = await response.json();
      return data.map((dto: any) => this.convertFromBackend(dto));
    } catch (error) {
      console.error('Error fetching organizational units:', error);
      console.warn('Falling back to mock data');
      this.useMockData = true;
      return this.getAll();
    }
  }

  /**
   * Get organizational unit by ID
   */
  async getById(id: string): Promise<OrganizationalUnit | undefined> {
    if (this.useMockData) {
      const unit = mockOrganizationalUnits.find(u => u.id === id);
      if (unit) {
        return {
          ...unit,
          fullPath: this.getFullPath(id),
        };
      }
      return undefined;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error('Failed to fetch organizational unit');
      }
      const data = await response.json();
      return this.convertFromBackend(data);
    } catch (error) {
      console.error(`Error fetching organizational unit ${id}:`, error);
      console.warn('Falling back to mock data');
      this.useMockData = true;
      return this.getById(id);
    }
  }

  /**
   * Get only BIA-eligible units (for dropdown in BIA wizard)
   */
  async getBiaEligibleUnits(): Promise<OrganizationalUnit[]> {
    if (this.useMockData) {
      return mockOrganizationalUnits
        .filter(unit => unit.isBiaEligible)
        .map(unit => ({
          ...unit,
          fullPath: this.getFullPath(unit.id),
        }))
        .sort((a, b) => (a.fullPath || '').localeCompare(b.fullPath || ''));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bia-eligible`);
      if (!response.ok) throw new Error('Failed to fetch BIA-eligible units');
      const data = await response.json();
      return data
        .map((dto: any) => this.convertFromBackend(dto))
        .sort((a: OrganizationalUnit, b: OrganizationalUnit) =>
          (a.fullPath || '').localeCompare(b.fullPath || '')
        );
    } catch (error) {
      console.error('Error fetching BIA-eligible units:', error);
      console.warn('Falling back to mock data');
      this.useMockData = true;
      return this.getBiaEligibleUnits();
    }
  }

  /**
   * Get organizational tree (hierarchical structure)
   */
  async getTree(): Promise<OrganizationalUnitTree | null> {
    const allUnits = await this.getAll();
    const root = allUnits.find(u => !u.parentUnitId);
    if (!root) return null;

    return this.buildTreeNode(root.id, allUnits);
  }

  /**
   * Build tree node recursively
   */
  private buildTreeNode(unitId: string, allUnits: OrganizationalUnit[]): OrganizationalUnitTree {
    const unit = allUnits.find(u => u.id === unitId)!;
    const children = allUnits
      .filter(u => u.parentUnitId === unitId)
      .map(child => this.buildTreeNode(child.id, allUnits));

    return {
      ...unit,
      children,
    };
  }

  /**
   * Get full hierarchical path for a unit (fallback for mock data)
   */
  private getFullPath(unitId: string): string {
    const unit = mockOrganizationalUnits.find(u => u.id === unitId);
    if (!unit) return '';

    if (!unit.parentUnitId) {
      return unit.unitName;
    }

    const parentPath = this.getFullPath(unit.parentUnitId);
    return `${parentPath} > ${unit.unitName}`;
  }

  /**
   * Get children of a unit
   */
  async getChildren(unitId: string): Promise<OrganizationalUnit[]> {
    const allUnits = await this.getAll();
    return allUnits.filter(u => u.parentUnitId === unitId);
  }

  /**
   * Get ancestors of a unit
   */
  async getAncestors(unitId: string): Promise<OrganizationalUnit[]> {
    const allUnits = await this.getAll();
    const ancestors: OrganizationalUnit[] = [];
    let currentUnit = allUnits.find(u => u.id === unitId);

    while (currentUnit?.parentUnitId) {
      const parent = allUnits.find(u => u.id === currentUnit!.parentUnitId);
      if (parent) {
        ancestors.unshift(parent);
        currentUnit = parent;
      } else {
        break;
      }
    }

    return ancestors;
  }

  /**
   * Create a new organizational unit
   */
  async create(data: Partial<OrganizationalUnit>): Promise<OrganizationalUnit> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitCode: data.unitCode,
          unitName: data.unitName,
          description: data.description,
          parentUnitId: data.parentUnitId ? parseInt(data.parentUnitId) : null,
          unitType: data.unitType,
          unitHead: data.unitHead,
          unitHeadEmail: data.unitHeadEmail,
          unitHeadPhone: data.unitHeadPhone,
          employeeCount: data.employeeCount,
          annualBudget: data.annualBudget,
        }),
      });

      if (!response.ok) throw new Error('Failed to create organizational unit');
      const dto = await response.json();
      return this.convertFromBackend(dto);
    } catch (error) {
      console.error('Error creating organizational unit:', error);
      throw error;
    }
  }

  /**
   * Update an organizational unit
   */
  async update(id: string, data: Partial<OrganizationalUnit>): Promise<OrganizationalUnit> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitCode: data.unitCode,
          unitName: data.unitName,
          description: data.description,
          parentUnitId: data.parentUnitId ? parseInt(data.parentUnitId) : null,
          unitType: data.unitType,
          unitHead: data.unitHead,
          unitHeadEmail: data.unitHeadEmail,
          unitHeadPhone: data.unitHeadPhone,
          employeeCount: data.employeeCount,
          annualBudget: data.annualBudget,
        }),
      });

      if (!response.ok) throw new Error('Failed to update organizational unit');
      const dto = await response.json();
      return this.convertFromBackend(dto);
    } catch (error) {
      console.error('Error updating organizational unit:', error);
      throw error;
    }
  }

  /**
   * Delete an organizational unit
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete organizational unit');
    } catch (error) {
      console.error('Error deleting organizational unit:', error);
      throw error;
    }
  }
}

export const organizationalUnitService = new OrganizationalUnitService();

