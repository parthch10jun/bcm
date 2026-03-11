import { Issue, Action, IssueActionStats, IssueModule, BusinessUnit } from '@/types/issue-action';

// Mock Business Units
export const mockBusinessUnits: BusinessUnit[] = [
  { id: 'bu-001', name: 'Information Technology', code: 'IT', headName: 'Ahmed Al-Rashid', headEmail: 'ahmed.rashid@company.com' },
  { id: 'bu-002', name: 'Finance', code: 'FIN', headName: 'Sara Al-Fahad', headEmail: 'sara.fahad@company.com' },
  { id: 'bu-003', name: 'Human Resources', code: 'HR', headName: 'Mohammed Al-Qahtani', headEmail: 'mohammed.qahtani@company.com' },
  { id: 'bu-004', name: 'Operations', code: 'OPS', headName: 'Fatima Al-Dosari', headEmail: 'fatima.dosari@company.com' },
  { id: 'bu-005', name: 'Golf Course Management', code: 'GOLF', headName: 'Khalid Al-Harbi', headEmail: 'khalid.harbi@company.com' },
  { id: 'bu-006', name: 'Customer Experience', code: 'CX', headName: 'Nora Al-Mutairi', headEmail: 'nora.mutairi@company.com' },
  { id: 'bu-007', name: 'Facilities Management', code: 'FAC', headName: 'Abdullah Al-Shehri', headEmail: 'abdullah.shehri@company.com' },
  { id: 'bu-008', name: 'Security', code: 'SEC', headName: 'Omar Al-Ghamdi', headEmail: 'omar.ghamdi@company.com' }
];

// Mock Users for assignment
export const mockUsers = [
  { id: 'user-001', name: 'Ahmed Al-Rashid', email: 'ahmed.rashid@company.com', department: 'IT' },
  { id: 'user-002', name: 'Sara Al-Fahad', email: 'sara.fahad@company.com', department: 'Finance' },
  { id: 'user-003', name: 'Mohammed Al-Qahtani', email: 'mohammed.qahtani@company.com', department: 'HR' },
  { id: 'user-004', name: 'Fatima Al-Dosari', email: 'fatima.dosari@company.com', department: 'Operations' },
  { id: 'user-005', name: 'Khalid Al-Harbi', email: 'khalid.harbi@company.com', department: 'Golf Course' },
  { id: 'user-006', name: 'Nora Al-Mutairi', email: 'nora.mutairi@company.com', department: 'CX' },
  { id: 'user-007', name: 'Abdullah Al-Shehri', email: 'abdullah.shehri@company.com', department: 'Facilities' },
  { id: 'user-008', name: 'Omar Al-Ghamdi', email: 'omar.ghamdi@company.com', department: 'Security' },
  { id: 'user-009', name: 'Ali Hassan', email: 'ali.hassan@company.com', department: 'IT' },
  { id: 'user-010', name: 'Layla Mohammed', email: 'layla.mohammed@company.com', department: 'Finance' }
];

// Mock Related Records by Module
export const mockRelatedRecords: Record<IssueModule, { id: string; title: string }[]> = {
  BIA: [
    { id: 'BIA-001', title: 'Payroll Processing' },
    { id: 'BIA-002', title: 'Customer Service Operations' },
    { id: 'BIA-003', title: 'IT Infrastructure Management' }
  ],
  RA: [
    { id: 'RA-001', title: 'Cybersecurity Risk Assessment 2024' },
    { id: 'RA-002', title: 'Operational Risk Assessment Q3' }
  ],
  BCP: [
    { id: 'BCP-001', title: 'IT Disaster Recovery Plan' },
    { id: 'BCP-002', title: 'Business Continuity Plan - Finance' }
  ],
  CM: [
    { id: 'CM-001', title: 'Crisis Communication Plan' }
  ],
  TESTING: [
    { id: 'TEST-001', title: 'DR Test Q3 2024' },
    { id: 'TEST-002', title: 'BCP Tabletop Exercise' }
  ],
  AUDIT: [
    { id: 'AUD-001', title: 'Internal BCM Audit 2024' },
    { id: 'AUD-002', title: 'Security Controls Audit' }
  ],
  OTHERS: []
};

// Mock Actions
const mockActions: Action[] = [
  {
    id: 'act-001', referenceNumber: 'A-2025-001', title: 'Update backup procedures',
    description: 'Revise and update the IT backup procedures to ensure 4-hour RPO compliance',
    actionType: 'CORRECTIVE',
    status: 'IN_PROGRESS', priority: 'HIGH', owner: 'Ali Hassan', ownerEmail: 'ali.hassan@company.com',
    targetDate: '2024-12-15', issueId: 'iss-001', progressNotes: [
      { id: 'pn-001', note: 'Started reviewing current backup procedures', createdBy: 'Ali Hassan', createdAt: '2024-11-15T10:00:00Z' },
      { id: 'pn-002', note: 'Identified gaps in database backup schedule', createdBy: 'Ali Hassan', createdAt: '2024-11-20T14:30:00Z' }
    ],
    timeline: [
      { id: 'tl-001', type: 'CREATED', description: 'Action created', createdBy: 'Ahmed Al-Rashid', createdAt: '2024-11-01T09:00:00Z' },
      { id: 'tl-002', type: 'STATUS_CHANGE', description: 'Status changed', oldValue: 'OPEN', newValue: 'IN_PROGRESS', createdBy: 'Ali Hassan', createdAt: '2024-11-15T10:00:00Z' }
    ],
    createdBy: 'Ahmed Al-Rashid', createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-11-20T14:30:00Z'
  },
  {
    id: 'act-002', referenceNumber: 'A-2025-002', title: 'Implement automated failover',
    description: 'Configure automated failover for critical database systems',
    actionType: 'PREVENTIVE',
    status: 'OPEN', priority: 'CRITICAL', owner: 'Reem Al-Ahmad', ownerEmail: 'reem.ahmad@company.com',
    targetDate: '2024-12-30', issueId: 'iss-001', progressNotes: [],
    timeline: [
      { id: 'tl-003', type: 'CREATED', description: 'Action created', createdBy: 'Ahmed Al-Rashid', createdAt: '2024-11-05T11:00:00Z' }
    ],
    createdBy: 'Ahmed Al-Rashid', createdAt: '2024-11-05T11:00:00Z', updatedAt: '2024-11-05T11:00:00Z'
  },
  {
    id: 'act-003', referenceNumber: 'A-2025-003', title: 'Staff training on new procedures',
    description: 'Conduct training sessions for all finance staff on updated procedures',
    actionType: 'PREVENTIVE',
    status: 'COMPLETED', priority: 'HIGH', owner: 'Layla Mohammed', ownerEmail: 'layla.mohammed@company.com',
    targetDate: '2024-11-10', completionDate: '2024-11-08', issueId: 'iss-002',
    progressNotes: [
      { id: 'pn-003', note: 'Training materials prepared', createdBy: 'Layla Mohammed', createdAt: '2024-11-05T09:00:00Z' },
      { id: 'pn-004', note: 'All sessions completed successfully', createdBy: 'Layla Mohammed', createdAt: '2024-11-08T16:00:00Z' }
    ],
    timeline: [
      { id: 'tl-004', type: 'CREATED', description: 'Action created', createdBy: 'Sara Al-Fahad', createdAt: '2024-10-20T10:00:00Z' },
      { id: 'tl-005', type: 'STATUS_CHANGE', description: 'Status changed', oldValue: 'OPEN', newValue: 'IN_PROGRESS', createdBy: 'Layla Mohammed', createdAt: '2024-11-01T09:00:00Z' },
      { id: 'tl-006', type: 'STATUS_CHANGE', description: 'Status changed', oldValue: 'IN_PROGRESS', newValue: 'COMPLETED', createdBy: 'Layla Mohammed', createdAt: '2024-11-08T16:00:00Z' }
    ],
    createdBy: 'Sara Al-Fahad', createdAt: '2024-10-20T10:00:00Z', updatedAt: '2024-11-08T16:00:00Z'
  },
  {
    id: 'act-004', referenceNumber: 'A-2025-004', title: 'Vendor evaluation and backup sourcing',
    description: 'Identify and evaluate alternative vendors for irrigation systems',
    actionType: 'CORRECTIVE',
    status: 'IN_PROGRESS', priority: 'HIGH', owner: 'Khalid Al-Harbi', ownerEmail: 'khalid.harbi@company.com',
    targetDate: '2025-01-10', issueId: 'iss-003', progressNotes: [
      { id: 'pn-005', note: 'RFP sent to 3 potential vendors', createdBy: 'Khalid Al-Harbi', createdAt: '2024-11-18T11:00:00Z' }
    ],
    timeline: [
      { id: 'tl-007', type: 'CREATED', description: 'Action created', createdBy: 'Khalid Al-Harbi', createdAt: '2024-11-10T10:00:00Z' }
    ],
    createdBy: 'Khalid Al-Harbi', createdAt: '2024-11-10T10:00:00Z', updatedAt: '2024-11-18T11:00:00Z'
  }
];

// Mock Issues with new structure
export const mockIssues: Issue[] = [
  {
    id: 'iss-001', referenceNumber: 'ISS-2025-0145', title: 'IT Backup Recovery Time Exceeds RTO',
    description: '<p>During the last DR test, IT systems took <strong>8 hours</strong> to recover, exceeding the <strong>4-hour RTO target</strong>.</p><ul><li>Database restore took longer than expected</li><li>Network configuration issues identified</li><li>Staff unfamiliar with updated procedures</li></ul>',
    module: 'TESTING', businessUnit: 'Information Technology', businessUnitId: 'bu-001',
    priority: 'CRITICAL', impact: 'HIGH', status: 'IN_PROGRESS',
    relatedRecordId: 'TEST-001', relatedRecordTitle: 'DR Test Q3 2024',
    assignedTo: ['Ahmed Al-Rashid', 'Ali Hassan'], assignedToEmails: ['ahmed.rashid@company.com', 'ali.hassan@company.com'],
    raisedBy: 'BCM Champion', raisedByEmail: 'bcm.champion@company.com',
    dueDate: '2024-12-31', createdDate: '2024-10-28',
    actions: [mockActions[0], mockActions[1]],
    createdBy: 'BCM Champion', createdAt: '2024-10-28T09:00:00Z', updatedAt: '2024-11-20T14:30:00Z'
  },
  {
    id: 'iss-002', referenceNumber: 'ISS-2025-0146', title: 'Finance Process Documentation Gap',
    description: '<p>BIA revealed that critical finance processes lack updated documentation and SOPs.</p><p>This poses a significant risk for knowledge transfer and compliance.</p>',
    module: 'BIA', businessUnit: 'Finance', businessUnitId: 'bu-002',
    priority: 'HIGH', impact: 'MEDIUM', status: 'COMPLETED',
    relatedRecordId: 'BIA-001', relatedRecordTitle: 'Payroll Processing',
    assignedTo: ['Sara Al-Fahad'], raisedBy: 'BIA Coordinator',
    dueDate: '2024-11-30', createdDate: '2024-10-15',
    actions: [mockActions[2]],
    createdBy: 'BIA Coordinator', createdAt: '2024-10-15T10:00:00Z', updatedAt: '2024-11-10T16:00:00Z'
  },
  {
    id: 'iss-003', referenceNumber: 'ISS-2025-0147', title: 'Vendor Single Point of Failure',
    description: '<p>Critical dependency on single vendor for golf course irrigation systems with no backup arrangement.</p>',
    module: 'RA', businessUnit: 'Golf Course Management', businessUnitId: 'bu-005',
    priority: 'HIGH', impact: 'SEVERE', status: 'OPEN',
    relatedRecordId: 'RA-002', relatedRecordTitle: 'Operational Risk Assessment Q3',
    assignedTo: ['Khalid Al-Harbi'], raisedBy: 'Risk Manager',
    dueDate: '2025-01-15', createdDate: '2024-11-01',
    actions: [mockActions[3]],
    createdBy: 'Risk Manager', createdAt: '2024-11-01T11:00:00Z', updatedAt: '2024-11-15T09:00:00Z'
  },
  {
    id: 'iss-004', referenceNumber: 'ISS-2025-0148', title: 'Access Control Policy Non-Compliance',
    description: '<p>Security audit identified gaps in physical access control logging. System not capturing all entry/exit events.</p>',
    module: 'AUDIT', businessUnit: 'Security', businessUnitId: 'bu-008',
    priority: 'CRITICAL', impact: 'HIGH', status: 'IN_PROGRESS',
    relatedRecordId: 'AUD-002', relatedRecordTitle: 'Security Controls Audit',
    assignedTo: ['Omar Al-Ghamdi'], raisedBy: 'Internal Audit',
    dueDate: '2024-12-15', createdDate: '2024-11-05',
    actions: [],
    createdBy: 'Internal Audit', createdAt: '2024-11-05T14:00:00Z', updatedAt: '2024-11-18T10:00:00Z'
  },
  {
    id: 'iss-005', referenceNumber: 'ISS-2025-0149', title: 'HR Succession Planning Gaps',
    description: '<p>Key positions in HR lack documented succession plans. This creates business continuity risk.</p>',
    module: 'BIA', businessUnit: 'Human Resources', businessUnitId: 'bu-003',
    priority: 'MEDIUM', impact: 'MEDIUM', status: 'ON_HOLD',
    relatedRecordId: 'BIA-002', relatedRecordTitle: 'Customer Service Operations',
    assignedTo: ['Mohammed Al-Qahtani'], raisedBy: 'BIA Coordinator',
    dueDate: '2025-02-28', createdDate: '2024-11-10',
    actions: [], onHoldReason: 'Pending HR restructuring completion',
    createdBy: 'BIA Coordinator', createdAt: '2024-11-10T09:00:00Z', updatedAt: '2024-11-20T11:00:00Z'
  },
  {
    id: 'iss-006', referenceNumber: 'ISS-2025-0150', title: 'BCP Plan Not Tested in 12 Months',
    description: '<p>The Business Continuity Plan for Finance department has not been tested within the required 12-month window.</p>',
    module: 'BCP', businessUnit: 'Finance', businessUnitId: 'bu-002',
    priority: 'HIGH', impact: 'HIGH', status: 'OPEN',
    relatedRecordId: 'BCP-002', relatedRecordTitle: 'Business Continuity Plan - Finance',
    assignedTo: ['Sara Al-Fahad', 'Layla Mohammed'], raisedBy: 'BCM Coordinator',
    dueDate: '2024-12-20', createdDate: '2024-11-15',
    actions: [],
    createdBy: 'BCM Coordinator', createdAt: '2024-11-15T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z'
  },
  {
    id: 'iss-007', referenceNumber: 'ISS-2025-0151', title: 'Crisis Communication Plan Outdated',
    description: '<p>The crisis communication plan contains outdated contact information and procedures.</p>',
    module: 'CM', businessUnit: 'Customer Experience', businessUnitId: 'bu-006',
    priority: 'MEDIUM', impact: 'MEDIUM', status: 'CLOSED',
    relatedRecordId: 'CM-001', relatedRecordTitle: 'Crisis Communication Plan',
    assignedTo: ['Nora Al-Mutairi'], raisedBy: 'Crisis Manager',
    dueDate: '2024-11-01', createdDate: '2024-10-01', closedDate: '2024-10-28',
    actions: [],
    createdBy: 'Crisis Manager', createdAt: '2024-10-01T09:00:00Z', updatedAt: '2024-10-28T16:00:00Z'
  }
];

// Calculate statistics
export const calculateStats = (issues: Issue[]): IssueActionStats => {
  const allActions = issues.flatMap(i => i.actions);
  const now = new Date();

  // Get unique business units
  const uniqueBusinessUnits = Array.from(new Set(issues.map(i => i.businessUnit)));

  return {
    totalIssues: issues.length,
    openIssues: issues.filter(i => i.status === 'OPEN').length,
    inProgressIssues: issues.filter(i => i.status === 'IN_PROGRESS').length,
    completedIssues: issues.filter(i => i.status === 'COMPLETED').length,
    closedIssues: issues.filter(i => i.status === 'CLOSED').length,
    onHoldIssues: issues.filter(i => i.status === 'ON_HOLD').length,
    overdueIssues: issues.filter(i => !['CLOSED', 'COMPLETED'].includes(i.status) && new Date(i.dueDate) < now).length,
    totalActions: allActions.length,
    openActions: allActions.filter(a => a.status === 'OPEN').length,
    inProgressActions: allActions.filter(a => a.status === 'IN_PROGRESS').length,
    completedActions: allActions.filter(a => a.status === 'COMPLETED').length,
    closedActions: allActions.filter(a => a.status === 'CLOSED').length,
    overdueActions: allActions.filter(a => !['COMPLETED', 'CLOSED'].includes(a.status) && new Date(a.targetDate) < now).length,
    criticalIssues: issues.filter(i => i.priority === 'CRITICAL' && !['CLOSED', 'COMPLETED'].includes(i.status)).length,
    highPriorityIssues: issues.filter(i => i.priority === 'HIGH' && !['CLOSED', 'COMPLETED'].includes(i.status)).length,
    issuesByModule: (['BIA', 'RA', 'BCP', 'CM', 'TESTING', 'AUDIT', 'OTHERS'] as IssueModule[]).map(mod => ({
      module: mod,
      count: issues.filter(i => i.module === mod && !['CLOSED', 'COMPLETED'].includes(i.status)).length
    })).filter(x => x.count > 0).sort((a, b) => b.count - a.count),

    // By business unit
    issuesByBusinessUnit: uniqueBusinessUnits.map(bu => ({
      businessUnit: bu,
      count: issues.filter(i => i.businessUnit === bu && !['CLOSED', 'COMPLETED'].includes(i.status)).length
    })).filter(x => x.count > 0).sort((a, b) => b.count - a.count),

    overdueIssuesByBusinessUnit: uniqueBusinessUnits.map(bu => ({
      businessUnit: bu,
      count: issues.filter(i => i.businessUnit === bu && !['CLOSED', 'COMPLETED'].includes(i.status) && new Date(i.dueDate) < now).length
    })).filter(x => x.count > 0).sort((a, b) => b.count - a.count),

    // By action type
    preventiveActions: allActions.filter(a => a.actionType === 'PREVENTIVE').length,
    correctiveActions: allActions.filter(a => a.actionType === 'CORRECTIVE').length,
    actionsByType: [
      { type: 'PREVENTIVE' as const, count: allActions.filter(a => a.actionType === 'PREVENTIVE').length },
      { type: 'CORRECTIVE' as const, count: allActions.filter(a => a.actionType === 'CORRECTIVE').length }
    ].filter(x => x.count > 0).sort((a, b) => b.count - a.count)
  };
};

export const mockStats = calculateStats(mockIssues);

