// Mock data for all library modules

export const mockAssets = [
  {
    id: 1,
    name: 'Primary Database Server',
    assetType: 'Technology',
    category: 'Hardware',
    description: 'Main production database server',
    location: 'Data Center A',
    owner: 'IT Department',
    criticality: 'Critical',
    status: 'Active',
    purchaseDate: '2022-01-15',
    warrantyExpiry: '2025-01-15'
  },
  {
    id: 2,
    name: 'Email Server Cluster',
    assetType: 'Technology',
    category: 'Software',
    description: 'Enterprise email infrastructure',
    location: 'Data Center B',
    owner: 'IT Department',
    criticality: 'High',
    status: 'Active',
    purchaseDate: '2021-06-20',
    warrantyExpiry: '2024-06-20'
  },
  {
    id: 3,
    name: 'Customer Portal Application',
    assetType: 'Technology',
    category: 'Software',
    description: 'Customer-facing web portal',
    location: 'Cloud - AWS',
    owner: 'Digital Services',
    criticality: 'Critical',
    status: 'Active',
    purchaseDate: '2023-03-10',
    warrantyExpiry: '2026-03-10'
  },
  {
    id: 4,
    name: 'Backup Generator',
    assetType: 'Equipment',
    category: 'Power',
    description: '500kW backup power generator',
    location: 'Building A',
    owner: 'Facilities',
    criticality: 'High',
    status: 'Active',
    purchaseDate: '2020-09-05',
    warrantyExpiry: '2025-09-05'
  },
  {
    id: 5,
    name: 'Network Firewall',
    assetType: 'Technology',
    category: 'Security',
    description: 'Enterprise network security appliance',
    location: 'Data Center A',
    owner: 'Security Team',
    criticality: 'Critical',
    status: 'Active',
    purchaseDate: '2022-11-12',
    warrantyExpiry: '2025-11-12'
  }
];

export const mockDepartments = [
  {
    id: 1,
    name: 'Information Technology',
    code: 'IT',
    description: 'IT infrastructure and support services',
    headOfDepartment: 'John Smith',
    employeeCount: 45,
    location: 'Building A - Floor 3',
    budget: 2500000,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Finance',
    code: 'FIN',
    description: 'Financial planning and accounting',
    headOfDepartment: 'Sarah Johnson',
    employeeCount: 28,
    location: 'Building A - Floor 2',
    budget: 1800000,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Human Resources',
    code: 'HR',
    description: 'Employee relations and talent management',
    headOfDepartment: 'Mike Chen',
    employeeCount: 15,
    location: 'Building B - Floor 1',
    budget: 950000,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Operations',
    code: 'OPS',
    description: 'Business operations and process management',
    headOfDepartment: 'Emily Davis',
    employeeCount: 62,
    location: 'Building A - Floor 1',
    budget: 3200000,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Customer Service',
    code: 'CS',
    description: 'Customer support and relations',
    headOfDepartment: 'David Wilson',
    employeeCount: 38,
    location: 'Building C - Floor 2',
    budget: 1500000,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Sales',
    code: 'SALES',
    description: 'Sales and business development',
    headOfDepartment: 'Lisa Anderson',
    employeeCount: 52,
    location: 'Building B - Floor 3',
    budget: 2800000,
    status: 'Active'
  }
];

export const mockLocations = [
  {
    id: 1,
    name: 'Headquarters - Building A',
    address: '123 Main Street, New York, NY 10001',
    type: 'Office',
    capacity: 250,
    status: 'Active',
    primaryContact: 'John Smith',
    phone: '+1-212-555-0100',
    emergencyContact: '+1-212-555-0199'
  },
  {
    id: 2,
    name: 'Data Center - Primary',
    address: '456 Tech Park Drive, Austin, TX 78701',
    type: 'Data Center',
    capacity: 50,
    status: 'Active',
    primaryContact: 'Mike Chen',
    phone: '+1-512-555-0200',
    emergencyContact: '+1-512-555-0299'
  },
  {
    id: 3,
    name: 'Regional Office - West',
    address: '789 Pacific Avenue, San Francisco, CA 94102',
    type: 'Office',
    capacity: 150,
    status: 'Active',
    primaryContact: 'Sarah Johnson',
    phone: '+1-415-555-0300',
    emergencyContact: '+1-415-555-0399'
  },
  {
    id: 4,
    name: 'Warehouse - Central',
    address: '321 Industrial Blvd, Chicago, IL 60601',
    type: 'Warehouse',
    capacity: 100,
    status: 'Active',
    primaryContact: 'David Wilson',
    phone: '+1-312-555-0400',
    emergencyContact: '+1-312-555-0499'
  }
];

export const mockPeople = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1-212-555-1001',
    department: 'Information Technology',
    jobTitle: 'IT Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9001'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-212-555-1002',
    department: 'Finance',
    jobTitle: 'Finance Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9002'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    phone: '+1-212-555-1003',
    department: 'Human Resources',
    jobTitle: 'HR Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9003'
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1-212-555-1004',
    department: 'Operations',
    jobTitle: 'Operations Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9004'
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1-212-555-1005',
    department: 'Customer Service',
    jobTitle: 'CS Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9005'
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1-212-555-1006',
    department: 'Sales',
    jobTitle: 'Sales Director',
    role: 'Department Head',
    location: 'Headquarters - Building A',
    status: 'Active',
    emergencyContact: '+1-212-555-9006'
  }
];

export const mockVendors = [
  {
    id: 1,
    name: 'CloudTech Solutions',
    category: 'Cloud Services',
    description: 'Cloud infrastructure and hosting provider',
    contactPerson: 'Robert Brown',
    email: 'robert.brown@cloudtech.com',
    phone: '+1-800-555-2001',
    address: '100 Cloud Drive, Seattle, WA 98101',
    contractStart: '2023-01-01',
    contractEnd: '2025-12-31',
    criticality: 'Critical',
    status: 'Active',
    annualSpend: 500000
  },
  {
    id: 2,
    name: 'SecureNet Inc',
    category: 'Security',
    description: 'Network security and monitoring services',
    contactPerson: 'Jennifer Lee',
    email: 'jennifer.lee@securenet.com',
    phone: '+1-800-555-2002',
    address: '200 Security Blvd, Boston, MA 02101',
    contractStart: '2022-06-01',
    contractEnd: '2024-05-31',
    criticality: 'High',
    status: 'Active',
    annualSpend: 250000
  },
  {
    id: 3,
    name: 'DataBackup Pro',
    category: 'Backup & Recovery',
    description: 'Enterprise backup and disaster recovery',
    contactPerson: 'Michael Torres',
    email: 'michael.torres@databackup.com',
    phone: '+1-800-555-2003',
    address: '300 Backup Lane, Denver, CO 80201',
    contractStart: '2023-03-15',
    contractEnd: '2026-03-14',
    criticality: 'Critical',
    status: 'Active',
    annualSpend: 180000
  },
  {
    id: 4,
    name: 'Office Supplies Co',
    category: 'Office Supplies',
    description: 'Office equipment and supplies vendor',
    contactPerson: 'Amanda White',
    email: 'amanda.white@officesupplies.com',
    phone: '+1-800-555-2004',
    address: '400 Supply Street, Atlanta, GA 30301',
    contractStart: '2022-01-01',
    contractEnd: '2024-12-31',
    criticality: 'Low',
    status: 'Active',
    annualSpend: 50000
  }
];

export const mockVitalRecords = [
  {
    id: 1,
    name: 'Customer Database',
    category: 'Database',
    description: 'Primary customer information database',
    owner: 'IT Department',
    location: 'Data Center A',
    format: 'Digital',
    retentionPeriod: '7 years',
    backupFrequency: 'Daily',
    lastBackup: '2024-11-24',
    criticality: 'Critical',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Financial Records',
    category: 'Financial',
    description: 'Annual financial statements and tax records',
    owner: 'Finance Department',
    location: 'Secure Archive',
    format: 'Digital & Physical',
    retentionPeriod: '10 years',
    backupFrequency: 'Weekly',
    lastBackup: '2024-11-20',
    criticality: 'Critical',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Employee Records',
    category: 'HR',
    description: 'Employee personnel files and contracts',
    owner: 'Human Resources',
    location: 'HR Office',
    format: 'Digital & Physical',
    retentionPeriod: '5 years after termination',
    backupFrequency: 'Weekly',
    lastBackup: '2024-11-20',
    criticality: 'High',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Legal Contracts',
    category: 'Legal',
    description: 'Vendor and customer contracts',
    owner: 'Legal Department',
    location: 'Legal Archive',
    format: 'Digital',
    retentionPeriod: 'Contract term + 7 years',
    backupFrequency: 'Weekly',
    lastBackup: '2024-11-20',
    criticality: 'High',
    status: 'Active'
  }
];

export const mockServices = [
  {
    id: 1,
    name: 'Email Service',
    description: 'Enterprise email and communication platform',
    owner: 'IT Department',
    category: 'Communication',
    criticality: 'Critical',
    rto: '4 hours',
    rpo: '1 hour',
    dependencies: ['Network Infrastructure', 'Email Server Cluster'],
    status: 'Active',
    users: 500
  },
  {
    id: 2,
    name: 'Customer Portal',
    description: 'Customer-facing web portal and services',
    owner: 'Digital Services',
    category: 'Customer Service',
    criticality: 'Critical',
    rto: '2 hours',
    rpo: '30 minutes',
    dependencies: ['Web Servers', 'Customer Database'],
    status: 'Active',
    users: 10000
  },
  {
    id: 3,
    name: 'Payroll Processing',
    description: 'Employee payroll and benefits management',
    owner: 'Finance Department',
    category: 'Financial',
    criticality: 'High',
    rto: '24 hours',
    rpo: '4 hours',
    dependencies: ['HR System', 'Financial Database'],
    status: 'Active',
    users: 200
  },
  {
    id: 4,
    name: 'Inventory Management',
    description: 'Warehouse and inventory tracking system',
    owner: 'Operations',
    category: 'Operations',
    criticality: 'High',
    rto: '8 hours',
    rpo: '2 hours',
    dependencies: ['Warehouse System', 'Barcode Scanners'],
    status: 'Active',
    users: 150
  }
];

export const mockProcesses = [
  {
    id: 1,
    name: 'Order Processing',
    description: 'Customer order intake and fulfillment',
    owner: 'Operations',
    department: 'Operations',
    criticality: 'Critical',
    rto: '4 hours',
    mtpd: '8 hours',
    dependencies: ['Customer Portal', 'Inventory Management'],
    status: 'Active',
    lastReviewed: '2024-10-15'
  },
  {
    id: 2,
    name: 'Payment Processing',
    description: 'Customer payment and transaction processing',
    owner: 'Finance',
    department: 'Finance',
    criticality: 'Critical',
    rto: '2 hours',
    mtpd: '4 hours',
    dependencies: ['Payment Gateway', 'Financial Database'],
    status: 'Active',
    lastReviewed: '2024-11-01'
  },
  {
    id: 3,
    name: 'Customer Support',
    description: 'Customer service and support operations',
    owner: 'Customer Service',
    department: 'Customer Service',
    criticality: 'High',
    rto: '8 hours',
    mtpd: '24 hours',
    dependencies: ['CRM System', 'Email Service'],
    status: 'Active',
    lastReviewed: '2024-09-20'
  }
];

