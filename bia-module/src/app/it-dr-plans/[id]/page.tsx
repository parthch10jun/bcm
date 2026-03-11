'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

// Type definitions
type Approval = { stage: string; approver: string; date: string; status: string };
type Procedure = { phase: string; duration: string; steps: string[] };
type Dependency = { id: string; name: string; type: string; criticality: string };
type Vendor = { id: string; name: string; service: string; sla: string };
type Server = { name: string; role: string; location: string; backup: string };
type Database = { name: string; size: string; replication: string; lastBackup: string };
type Network = { segment: string; subnet: string; drSubnet: string };
type TestHistory = { date: string; type: string; result: string; notes: string };
type LinkedIRP = { id: string; name: string; type: string; severity: string; triggerCondition: string };
type LinkedPlaybook = { id: string; name: string; severity: string };

// Default DR Plan template
const defaultDRPlan = {
  approvalHistory: [
    { stage: 'Service Manager', approver: 'Assigned Owner', date: '2025-11-10', status: 'Approved' },
    { stage: 'DBCM Team', approver: 'Sarah Johnson', date: '2025-11-12', status: 'Approved' },
    { stage: 'Service VP', approver: 'Ali Rahman', date: '2025-11-15', status: 'Approved' }
  ],
  technicalFocalPoint: 'Mohammed Hassan',
  createdDate: '2025-10-01',
  lastUpdated: '2025-11-15',
  nextReview: '2025-12-15',
};

// Mock data for demo - IT DR Plans matching the list view
const mockDRPlanDetails: Record<string, any> = {
  'BCP-001': {
    id: 'BCP-001',
    name: 'Core Insurance Platform Recovery',
    description: 'Application recovery plan for the core insurance platform supporting policy management, claims processing, and customer service operations.',
    service: 'Core Insurance Platform',
    status: 'Published',
    criticality: 'Tier 1',
    rto: '2 Hours',
    rpo: '15 Minutes',
    linkedBIA: 'BIA-INS-001',
    owner: 'John Doe',
    enablerType: 'Technology',
    planType: 'ARP',
    itService: 'Core Insurance Platform',
    businessProcessesCount: 5,
    recoveryStrategy: 'Hot Site',
    location: 'Munich Data Center',
    ...defaultDRPlan,
    recoveryStrategyDetails: {
      type: 'Hot Site',
      location: 'Frankfurt DR Site',
      infrastructure: 'Active-Active cluster with real-time replication',
      failoverMechanism: 'Automated failover with load balancer redirection'
    },
    dependencies: {
      upstream: [
        { id: 'DB-001', name: 'Policy Database', type: 'Database', criticality: 'Tier 1' },
        { id: 'SYS-001', name: 'Application Server Cluster', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-002', name: 'Load Balancer', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'PROC-001', name: 'Policy Management', type: 'Business Process', criticality: 'Tier 1' },
        { id: 'PROC-002', name: 'Claims Processing', type: 'Business Process', criticality: 'Tier 1' },
        { id: 'PROC-003', name: 'Customer Service', type: 'Business Process', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-001', name: 'Oracle', service: 'Database Support', sla: '2 Hours' },
        { id: 'VEN-002', name: 'IBM', service: 'Application Server Support', sla: '4 Hours' }
      ]
    },
    enablerResources: {
      infrastructure: [
        { component: 'Application Servers', primary: 12, dr: 12, capacity: '100%', status: 'Active-Active' },
        { component: 'Database Servers', primary: 4, dr: 4, capacity: '100%', status: 'Active-Active' },
        { component: 'Load Balancers', primary: 2, dr: 2, capacity: '100%', status: 'Active-Active' }
      ],
      network: [
        { type: 'Primary Link', bandwidth: '10 Gbps', provider: 'Deutsche Telekom', backup: 'Yes' },
        { type: 'Secondary Link', bandwidth: '10 Gbps', provider: 'Vodafone', backup: 'Yes' }
      ],
      power: [
        { type: 'Grid Power', capacity: '500 kW', backup: 'UPS + Generator' },
        { type: 'UPS', capacity: '400 kW', runtime: '15 minutes' },
        { type: 'Diesel Generator', capacity: '600 kW', runtime: '72 hours' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection & Assessment', duration: '15 minutes', steps: ['Automated monitoring detects platform outage', 'Assess scope and impact', 'Activate IT operations team', 'Determine if DR failover is required'] },
      { phase: 'Phase 2: Failover Initiation', duration: '45 minutes', steps: ['Initiate automated failover to Frankfurt DR site', 'Verify database replication status', 'Activate DR application servers', 'Update DNS and load balancer configurations'] },
      { phase: 'Phase 3: Service Restoration', duration: '45 minutes', steps: ['Bring all critical applications online at DR site', 'Verify network connectivity', 'Test user access and authentication', 'Restore batch processing'] },
      { phase: 'Phase 4: Validation', duration: '15 minutes', steps: ['Execute end-to-end transaction tests', 'Verify data integrity', 'Confirm all critical services operational', 'Monitor performance metrics'] }
    ],
    testingHistory: [
      { date: '2024-10-20', type: 'Full DR Failover Test', result: 'Successful', notes: 'Complete failover achieved in 1h 50m, all systems operational' },
      { date: '2024-07-15', type: 'Partial Failover Test', result: 'Successful', notes: 'Database failover completed in 30 minutes' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Data Center Outage', type: 'Infrastructure', severity: 'Critical', triggerCondition: 'When Munich data center becomes unavailable' },
      { id: 'IRP-002', name: 'Cyber Attack Response', type: 'Cyber', severity: 'Critical', triggerCondition: 'When cyber attack affects core platform' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Technology Infrastructure Failure', severity: 'Critical' }
    ]
  },
  'BCP-002': {
    id: 'BCP-002',
    name: 'Claims Management System Recovery',
    description: 'Application recovery plan for the claims management system supporting claims intake, processing, adjudication, and payment operations.',
    service: 'Claims Management System',
    status: 'Approved',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-FAC-001',
    owner: 'Sarah Johnson',
    enablerType: 'Building',
    strategy: 'Alternate Facility Activation',
    ...defaultDRPlan,
    recoveryStrategy: {
      type: 'Alternate Facility Activation',
      location: 'Backup Office - BKC, Mumbai',
      infrastructure: 'Pre-configured office space with workstations, network, and telephony',
      failoverMechanism: 'Immediate relocation to alternate facility with pre-assigned seating'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-001', name: 'Building Access Control', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-004', name: 'Emergency Notification System', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'APP-004', name: 'Business Operations', type: 'Application', criticality: 'Tier 1' },
        { id: 'APP-005', name: 'Customer Service', type: 'Application', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-003', name: 'Regus', service: 'Alternate Office Space', sla: '2 Hours' },
        { id: 'VEN-004', name: 'Tata Communications', service: 'Network Connectivity', sla: '4 Hours' }
      ]
    },
    enablerResources: {
      facilities: [
        { name: 'Head Office - Fort, Mumbai', capacity: 850, type: 'Primary', readiness: 'Active' },
        { name: 'Backup Office - BKC, Mumbai', capacity: 500, type: 'Alternate', readiness: 'Active' },
        { name: 'Satellite Office - Andheri', capacity: 200, type: 'Alternate', readiness: 'Standby' }
      ],
      equipment: [
        { item: 'Workstations at Backup Office', quantity: 500, available: 500, location: 'BKC' },
        { item: 'Network Equipment', quantity: 50, available: 50, location: 'BKC' },
        { item: 'Telephony System', quantity: 500, available: 500, location: 'BKC' }
      ],
      utilities: [
        { type: 'Power (Generator)', capacity: '500 KVA', backup: 'Yes', duration: '48 hours' },
        { type: 'HVAC', capacity: '500 persons', backup: 'Yes', duration: 'Continuous' },
        { type: 'Internet (Primary)', bandwidth: '1 Gbps', backup: 'Yes', provider: 'Tata' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Evacuation & Safety', duration: '30 minutes', steps: ['Initiate building evacuation procedures', 'Account for all personnel at assembly points', 'Assess building damage and safety status', 'Coordinate with emergency services'] },
      { phase: 'Phase 2: Activation Decision', duration: '1 hour', steps: ['Determine if alternate facility activation is required', 'Notify all staff of relocation plan', 'Activate backup office infrastructure', 'Coordinate transportation for critical staff'] },
      { phase: 'Phase 3: Relocation', duration: '2 hours', steps: ['Transport critical staff to backup office', 'Assign workstations based on priority', 'Activate network and telephony systems', 'Restore access to critical applications'] },
      { phase: 'Phase 4: Validation', duration: '30 minutes', steps: ['Verify all critical functions are operational', 'Test customer-facing services', 'Confirm communication channels', 'Document relocation timeline'] }
    ],
    testingHistory: [
      { date: '2025-09-10', type: 'Full Evacuation Drill', result: 'Successful', notes: 'All 850 staff evacuated in 12 minutes, backup office activated in 3h 45m' }
    ],
    linkedIRPs: [
      { id: 'IRP-002', name: 'Fire Emergency Response', type: 'Fire', severity: 'Critical', triggerCondition: 'When fire affects building safety' },
      { id: 'IRP-005', name: 'Bomb Threat Protocol', type: 'Security', severity: 'Critical', triggerCondition: 'When bomb threat requires evacuation' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-002', name: 'Natural Disaster Building Response', severity: 'Critical' }
    ]
  },
  'BCP-003': {
    id: 'BCP-003',
    name: 'Munich Data Center Infrastructure Recovery',
    description: 'Infrastructure recovery plan for Munich data center including power, cooling, network, and physical security systems.',
    service: 'Munich Data Center',
    status: 'Published',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-INF-001',
    owner: 'Mike Johnson',
    enablerType: 'Building',
    planType: 'IRP',
    itService: 'Munich Data Center',
    businessProcessesCount: 12,
    recoveryStrategy: 'Warm Site',
    location: 'Munich Data Center',
    ...defaultDRPlan,
    recoveryStrategyDetails: {
      type: 'Warm Site',
      location: 'Frankfurt Backup Data Center',
      infrastructure: 'Pre-configured infrastructure with 4-hour activation time',
      failoverMechanism: 'Manual failover with infrastructure activation'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-001', name: 'Power Grid', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-002', name: 'Cooling Systems', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-003', name: 'Network Backbone', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'APP-001', name: 'All Hosted Applications', type: 'Application', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-001', name: 'Siemens', service: 'Power Systems', sla: '2 Hours' },
        { id: 'VEN-002', name: 'Schneider Electric', service: 'Cooling Systems', sla: '4 Hours' }
      ]
    },
    enablerResources: {
      infrastructure: [
        { component: 'Power Systems', primary: 2, dr: 2, capacity: '2 MW', status: 'Redundant' },
        { component: 'Cooling Units', primary: 4, dr: 4, capacity: '500 kW', status: 'N+1' },
        { component: 'Network Core', primary: 2, dr: 2, capacity: '100 Gbps', status: 'Active-Active' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection & Assessment', duration: '30 minutes', steps: ['Detect infrastructure failure', 'Assess impact scope', 'Activate facilities team', 'Determine recovery approach'] },
      { phase: 'Phase 2: Failover to Frankfurt', duration: '2 hours', steps: ['Initiate workload migration', 'Activate Frankfurt infrastructure', 'Redirect network traffic', 'Verify system availability'] },
      { phase: 'Phase 3: Validation', duration: '1 hour', steps: ['Test all critical systems', 'Verify data integrity', 'Confirm business operations', 'Monitor performance'] },
      { phase: 'Phase 4: Stabilization', duration: '30 minutes', steps: ['Fine-tune performance', 'Document issues', 'Brief stakeholders', 'Plan recovery'] }
    ],
    testingHistory: [
      { date: '2024-11-10', type: 'Infrastructure Failover Test', result: 'Successful', notes: 'Failover completed in 3h 45m, all systems operational' },
      { date: '2024-08-20', type: 'Power Failure Simulation', result: 'Successful', notes: 'UPS and generator systems performed as expected' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Data Center Power Failure', type: 'Infrastructure', severity: 'Critical', triggerCondition: 'When power systems fail' },
      { id: 'IRP-002', name: 'Cooling System Failure', type: 'Infrastructure', severity: 'High', triggerCondition: 'When cooling capacity is compromised' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Data Center Outage Response', severity: 'Critical' }
    ]
  },
  'BCP-004': {
    id: 'BCP-004',
    name: 'Policy Database Recovery Plan',
    description: 'Data recovery plan for the policy database supporting all insurance policy operations and customer data.',
    service: 'Policy Database',
    status: 'In Review',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-DB-001',
    owner: 'Emily Davis',
    enablerType: 'Technology',
    planType: 'DRP',
    itService: 'Policy Database',
    businessProcessesCount: 4,
    recoveryStrategy: 'Cloud DR',
    location: 'Munich Data Center',
    ...defaultDRPlan,
    recoveryStrategyDetails: {
      type: 'Cloud DR',
      location: 'AWS Frankfurt Region',
      infrastructure: 'Cloud-based database replication with automated failover',
      failoverMechanism: 'Automated cloud failover with RDS Multi-AZ'
    },
    dependencies: {
      upstream: [
        { id: 'DB-001', name: 'Database Servers', type: 'Infrastructure', criticality: 'Tier 1' },
        { id: 'SYS-001', name: 'Storage Systems', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'PROC-001', name: 'Policy Management', type: 'Business Process', criticality: 'Tier 1' },
        { id: 'PROC-002', name: 'Customer Service', type: 'Business Process', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-001', name: 'AWS', service: 'Cloud Infrastructure', sla: '1 Hour' },
        { id: 'VEN-002', name: 'Oracle', service: 'Database Support', sla: '2 Hours' }
      ]
    },
    enablerResources: {
      infrastructure: [
        { component: 'RDS Instances', primary: 2, dr: 2, capacity: '100%', status: 'Multi-AZ' },
        { component: 'Storage (EBS)', primary: 1, dr: 1, capacity: '10 TB', status: 'Replicated' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection', duration: '15 minutes', steps: ['Detect database failure', 'Assess impact', 'Activate DB team', 'Initiate failover'] },
      { phase: 'Phase 2: Failover', duration: '2 hours', steps: ['Trigger AWS RDS failover', 'Verify replication status', 'Update application connections', 'Test database connectivity'] },
      { phase: 'Phase 3: Validation', duration: '1 hour', steps: ['Run data integrity checks', 'Test application queries', 'Verify performance', 'Monitor replication lag'] },
      { phase: 'Phase 4: Stabilization', duration: '45 minutes', steps: ['Fine-tune performance', 'Document recovery', 'Brief stakeholders', 'Plan fallback'] }
    ],
    testingHistory: [
      { date: '2024-10-15', type: 'RDS Failover Test', result: 'Successful', notes: 'Automated failover completed in 3h 30m' },
      { date: '2024-07-20', type: 'Backup Restore Test', result: 'Successful', notes: 'Database restored from snapshot in 2h 15m' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Database Corruption', type: 'Data', severity: 'Critical', triggerCondition: 'When database integrity is compromised' },
      { id: 'IRP-002', name: 'Ransomware Attack', type: 'Cyber', severity: 'Critical', triggerCondition: 'When database is encrypted by ransomware' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Data Loss Response', severity: 'Critical' }
    ]
  },
  'BCP-005': {
    id: 'BCP-005',
    name: 'Cybersecurity Incident Response Plan',
    description: 'Cybersecurity incident response plan for detecting, containing, and recovering from security incidents and cyber attacks.',
    service: 'Security Operations Center',
    status: 'Published',
    criticality: 'Tier 1',
    rto: '1 Hour',
    rpo: '0 Minutes',
    linkedBIA: 'BIA-SEC-001',
    owner: 'David Wilson',
    enablerType: 'Technology',
    planType: 'CIRP',
    itService: 'Security Operations Center',
    businessProcessesCount: 15,
    recoveryStrategy: 'Manual',
    location: 'All Locations',
    ...defaultDRPlan,
    recoveryStrategyDetails: {
      type: 'Manual',
      location: 'Distributed SOC Teams',
      infrastructure: 'Security tools, SIEM, incident response playbooks',
      failoverMechanism: 'Manual incident response procedures'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-001', name: 'SIEM Platform', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-002', name: 'Threat Intelligence', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'ALL', name: 'All IT Systems', type: 'Infrastructure', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-001', name: 'CrowdStrike', service: 'EDR Platform', sla: '1 Hour' },
        { id: 'VEN-002', name: 'Palo Alto', service: 'Firewall Support', sla: '2 Hours' }
      ]
    },
    enablerResources: {
      infrastructure: [
        { component: 'SIEM Platform', primary: 1, dr: 1, capacity: '100%', status: 'Active-Active' },
        { component: 'SOC Workstations', primary: 20, dr: 10, capacity: '50%', status: 'Standby' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection & Triage', duration: '15 minutes', steps: ['Detect security incident', 'Classify severity', 'Activate SOC team', 'Initiate containment'] },
      { phase: 'Phase 2: Containment', duration: '30 minutes', steps: ['Isolate affected systems', 'Block malicious IPs', 'Disable compromised accounts', 'Preserve evidence'] },
      { phase: 'Phase 3: Eradication', duration: '2 hours', steps: ['Remove malware', 'Patch vulnerabilities', 'Reset credentials', 'Verify clean state'] },
      { phase: 'Phase 4: Recovery', duration: '1 hour', steps: ['Restore systems', 'Monitor for reinfection', 'Document incident', 'Brief stakeholders'] }
    ],
    testingHistory: [
      { date: '2024-10-30', type: 'Ransomware Simulation', result: 'Successful', notes: 'Incident contained in 45 minutes, full recovery in 3h 30m' },
      { date: '2024-08-15', type: 'Phishing Attack Drill', result: 'Successful', notes: 'All affected accounts disabled within 20 minutes' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Ransomware Attack', type: 'Cyber', severity: 'Critical', triggerCondition: 'When ransomware is detected' },
      { id: 'IRP-002', name: 'Data Breach', type: 'Cyber', severity: 'Critical', triggerCondition: 'When unauthorized data access is detected' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Cyber Attack Response', severity: 'Critical' }
    ]
  },
  // Simplified entries for remaining plans
  'BCP-006': {
    id: 'BCP-006',
    name: 'Customer Portal Application Recovery',
    description: 'Application recovery plan for the customer self-service portal enabling policy inquiries, claims submission, and account management.',
    service: 'Customer Portal',
    status: 'Published',
    criticality: 'Tier 2',
    rto: '8 Hours',
    rpo: '4 Hours',
    linkedBIA: 'BIA-APP-002',
    owner: 'Lisa Anderson',
    enablerType: 'Technology',
    planType: 'ARP',
    itService: 'Customer Portal',
    businessProcessesCount: 2,
    recoveryStrategy: 'Warm Site',
    location: 'Frankfurt DR Site',
    strategy: 'Warm Site Recovery',
    ...defaultDRPlan,
    recoveryProcedures: [
      { phase: 'Phase 1: Assessment', duration: '1 hour', steps: ['Assess portal outage scope', 'Identify affected customer services', 'Activate application team', 'Notify stakeholders'] },
      { phase: 'Phase 2: Warm Site Activation', duration: '4 hours', steps: ['Activate Frankfurt warm site infrastructure', 'Deploy application code from repository', 'Configure load balancers', 'Update DNS records'] },
      { phase: 'Phase 3: Data Sync', duration: '2 hours', steps: ['Sync customer data from primary database', 'Verify data integrity', 'Test authentication services', 'Validate session management'] },
      { phase: 'Phase 4: Go-Live', duration: '1 hour', steps: ['Execute smoke tests', 'Enable customer access', 'Monitor application performance', 'Document recovery timeline'] }
    ],
    dependencies: {
      upstream: [
        { id: 'DB-001', name: 'Customer Database', type: 'Database', criticality: 'Tier 1' },
        { id: 'AUTH-001', name: 'Authentication Service', type: 'Application', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'PROC-003', name: 'Customer Self-Service', type: 'Business Process', criticality: 'Tier 2' }
      ],
      vendors: [
        { id: 'VEN-003', name: 'Akamai', service: 'CDN Services', sla: '4 Hours' }
      ]
    }
  },
  'BCP-007': {
    id: 'BCP-007',
    name: 'Payment Gateway Recovery Plan',
    description: 'Application recovery plan for payment processing gateway handling premium payments, claims disbursements, and financial transactions.',
    service: 'Payment Gateway',
    status: 'Approved',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-APP-003',
    owner: 'Tom Harris',
    enablerType: 'Technology',
    planType: 'ARP',
    itService: 'Payment Gateway',
    businessProcessesCount: 3,
    recoveryStrategy: 'Cloud DR',
    location: 'Cloud (AWS)',
    strategy: 'Cloud-based Recovery',
    ...defaultDRPlan,
    recoveryProcedures: [
      { phase: 'Phase 1: Detection & Triage', duration: '30 minutes', steps: ['Detect payment gateway failure', 'Assess transaction impact', 'Activate payments team', 'Halt new payment processing'] },
      { phase: 'Phase 2: Cloud Failover', duration: '2 hours', steps: ['Trigger AWS auto-failover to DR region', 'Verify payment queue integrity', 'Activate standby payment processors', 'Update payment routing'] },
      { phase: 'Phase 3: Transaction Recovery', duration: '1 hour', steps: ['Replay failed transactions from queue', 'Reconcile payment records', 'Verify bank connectivity', 'Test end-to-end payment flow'] },
      { phase: 'Phase 4: Validation', duration: '30 minutes', steps: ['Process test transactions', 'Verify PCI compliance', 'Resume normal operations', 'Notify finance team'] }
    ],
    dependencies: {
      upstream: [
        { id: 'BANK-001', name: 'Banking Integration', type: 'External Service', criticality: 'Tier 1' },
        { id: 'DB-002', name: 'Transaction Database', type: 'Database', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'PROC-004', name: 'Premium Collection', type: 'Business Process', criticality: 'Tier 1' },
        { id: 'PROC-005', name: 'Claims Payment', type: 'Business Process', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-004', name: 'Stripe', service: 'Payment Processing', sla: '2 Hours' },
        { id: 'VEN-005', name: 'AWS', service: 'Cloud Infrastructure', sla: '1 Hour' }
      ]
    }
  },
  'BCP-008': {
    id: 'BCP-008',
    name: 'Underwriting System Recovery',
    description: 'Application recovery plan for the underwriting system supporting risk assessment, policy pricing, and approval workflows.',
    service: 'Underwriting System',
    status: 'Draft',
    criticality: 'Tier 2',
    rto: '12 Hours',
    rpo: '4 Hours',
    linkedBIA: 'BIA-APP-004',
    owner: 'Anna Schmidt',
    enablerType: 'Technology',
    planType: 'ARP',
    itService: 'Underwriting System',
    businessProcessesCount: 2,
    recoveryStrategy: 'Warm Site',
    location: 'Munich Data Center',
    strategy: 'Warm Site Recovery',
    ...defaultDRPlan,
    recoveryProcedures: [
      { phase: 'Phase 1: Assessment', duration: '2 hours', steps: ['Assess underwriting system outage', 'Identify pending applications', 'Activate underwriting team', 'Implement manual workarounds'] },
      { phase: 'Phase 2: Recovery', duration: '6 hours', steps: ['Restore application from backup', 'Verify risk models and pricing rules', 'Test workflow engine', 'Validate integration with policy system'] },
      { phase: 'Phase 3: Data Validation', duration: '3 hours', steps: ['Reconcile pending applications', 'Verify underwriting decisions', 'Test approval workflows', 'Validate reporting'] },
      { phase: 'Phase 4: Resume Operations', duration: '1 hour', steps: ['Resume automated underwriting', 'Process backlog', 'Monitor system performance', 'Brief underwriting team'] }
    ],
    dependencies: {
      upstream: [
        { id: 'RISK-001', name: 'Risk Assessment Engine', type: 'Application', criticality: 'Tier 2' }
      ],
      downstream: [
        { id: 'PROC-006', name: 'Policy Underwriting', type: 'Business Process', criticality: 'Tier 2' }
      ],
      vendors: []
    }
  },
  'BCP-009': {
    id: 'BCP-009',
    name: 'Frankfurt Infrastructure Recovery',
    description: 'Infrastructure recovery plan for Frankfurt data center including power, cooling, network, and physical security systems.',
    service: 'Frankfurt Data Center',
    status: 'Published',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-INF-002',
    owner: 'Klaus Weber',
    enablerType: 'Building',
    planType: 'IRP',
    itService: 'Frankfurt Data Center',
    businessProcessesCount: 10,
    recoveryStrategy: 'Cold Site',
    location: 'Frankfurt DR Site',
    strategy: 'Cold Site Activation',
    ...defaultDRPlan,
    recoveryProcedures: [
      { phase: 'Phase 1: Emergency Response', duration: '30 minutes', steps: ['Assess infrastructure failure', 'Ensure personnel safety', 'Activate facilities team', 'Notify all IT teams'] },
      { phase: 'Phase 2: Cold Site Activation', duration: '2 hours', steps: ['Activate Frankfurt DR facility', 'Power up infrastructure systems', 'Establish network connectivity', 'Verify environmental controls'] },
      { phase: 'Phase 3: Workload Migration', duration: '1 hour', steps: ['Migrate critical workloads to DR site', 'Activate backup servers', 'Restore network services', 'Test application connectivity'] },
      { phase: 'Phase 4: Validation', duration: '30 minutes', steps: ['Verify all systems operational', 'Test business applications', 'Monitor infrastructure health', 'Document recovery'] }
    ],
    dependencies: {
      upstream: [
        { id: 'POWER-001', name: 'Power Grid', type: 'Utility', criticality: 'Tier 1' },
        { id: 'COOL-001', name: 'Cooling Systems', type: 'Infrastructure', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'ALL-APPS', name: 'All Frankfurt Applications', type: 'Application', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-006', name: 'Siemens', service: 'Power Systems', sla: '2 Hours' }
      ]
    }
  },
  'BCP-010': {
    id: 'BCP-010',
    name: 'Claims Database Backup & Recovery',
    description: 'Data recovery plan for the claims database supporting all claims processing, adjudication, and payment operations.',
    service: 'Claims Database',
    status: 'Published',
    criticality: 'Tier 1',
    rto: '4 Hours',
    rpo: '1 Hour',
    linkedBIA: 'BIA-DB-002',
    owner: 'Maria Schneider',
    enablerType: 'Technology',
    planType: 'DRP',
    itService: 'Claims Database',
    businessProcessesCount: 3,
    recoveryStrategy: 'Cloud DR',
    location: 'Munich Data Center',
    strategy: 'Cloud-based Recovery',
    ...defaultDRPlan,
    recoveryProcedures: [
      { phase: 'Phase 1: Detection', duration: '15 minutes', steps: ['Detect database failure or corruption', 'Assess data loss window', 'Activate database team', 'Halt claims processing'] },
      { phase: 'Phase 2: Cloud Failover', duration: '2 hours', steps: ['Trigger AWS RDS failover', 'Verify replication status', 'Activate read replicas', 'Update application connection strings'] },
      { phase: 'Phase 3: Data Validation', duration: '1 hour', steps: ['Run data integrity checks', 'Verify claims records', 'Test database queries', 'Validate backup consistency'] },
      { phase: 'Phase 4: Resume Operations', duration: '45 minutes', steps: ['Resume claims processing', 'Process queued transactions', 'Monitor database performance', 'Notify claims team'] }
    ],
    dependencies: {
      upstream: [
        { id: 'STORAGE-001', name: 'Cloud Storage', type: 'Infrastructure', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'PROC-007', name: 'Claims Processing', type: 'Business Process', criticality: 'Tier 1' },
        { id: 'PROC-008', name: 'Claims Adjudication', type: 'Business Process', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-007', name: 'AWS', service: 'RDS Database', sla: '1 Hour' }
      ]
    }
  }
};

const statusColors: Record<string, string> = {
  'Draft': 'bg-gray-50 text-gray-600 border-gray-200',
  'Planning': 'bg-gray-100 text-gray-700 border-gray-300',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Strategy Defined': 'bg-gray-50 text-gray-600 border-gray-200',
  'Validated': 'bg-gray-50 text-gray-600 border-gray-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const criticalityColors: Record<string, string> = {
  'Tier 1': 'bg-red-50 text-red-700 border-red-200',
  'Tier 2': 'bg-gray-50 text-gray-600 border-gray-200',
  'Tier 3': 'bg-gray-50 text-gray-600 border-gray-200',
  'Tier 4': 'bg-gray-100 text-gray-700 border-gray-300',
  'Tier 5': 'bg-gray-50 text-gray-600 border-gray-200'
};

export default function DRPlanDetailPage() {
  const params = useParams();
  const planId = params.id as string;
  const plan = mockDRPlanDetails[planId as keyof typeof mockDRPlanDetails];

  const [activeTab, setActiveTab] = useState<'overview' | 'procedures' | 'dependencies' | 'technical' | 'testing' | 'linkages'>('overview');

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ServerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">BCP Plan not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested BCP plan does not exist.</p>
          <Link href="/it-dr-plans" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            ← Back to BCP Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/it-dr-plans"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              Back
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">{plan.name}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${statusColors[plan.status]}`}>
                  {plan.status}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${criticalityColors[plan.criticality]}`}>
                  {plan.criticality}
                </span>
                {plan.enablerType && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${
                    plan.enablerType === 'Human Resources' ? 'bg-purple-100 text-purple-700' :
                    plan.enablerType === 'Building' ? 'bg-blue-100 text-blue-700' :
                    plan.enablerType === 'Technology' ? 'bg-cyan-100 text-cyan-700' :
                    plan.enablerType === 'Equipment' ? 'bg-orange-100 text-orange-700' :
                    plan.enablerType === 'Vendors' ? 'bg-pink-100 text-pink-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {plan.enablerType}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-600">{plan.description}</p>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Plan ID</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{plan.id}</p>
                </div>
                {plan.enablerType && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Strategy</p>
                    <p className="text-xs text-gray-900 font-medium mt-0.5">{plan.strategy}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Service</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{plan.service}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">RTO</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{plan.rto}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">RPO</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{plan.rpo}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                <PencilIcon className="h-3.5 w-3.5" />
                Edit Plan
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors">
                <DocumentTextIcon className="h-3.5 w-3.5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('procedures')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'procedures'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Continuity Procedures
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'dependencies'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Dependencies
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'technical'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Technical Details
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'testing'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Testing & Validation
            </button>
            <button
              onClick={() => setActiveTab('linkages')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'linkages'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                Plan Linkages
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Plan Owner</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Technical Focal Point</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.technicalFocalPoint}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Created Date</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.createdDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Last Updated</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Next Review</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.nextReview}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Linked BIA</p>
                  <Link href={`/bia-records/${plan.linkedBIA}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                    {plan.linkedBIA}
                  </Link>
                </div>
              </div>
            </div>

            {/* Continuity Strategy Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Continuity Strategy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Strategy Type</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.recoveryStrategy.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Alternate Location</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.recoveryStrategy.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Infrastructure & Resources</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.recoveryStrategy.infrastructure}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Activation Mechanism</p>
                  <p className="text-xs text-gray-900 mt-1">{plan.recoveryStrategy.failoverMechanism}</p>
                </div>
              </div>
            </div>

            {/* Approval History Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Approval History</h3>
              <div className="space-y-3">
                {plan.approvalHistory.map((approval: { stage: string; approver: string; date: string; status: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{approval.stage}</p>
                        <p className="text-[10px] text-gray-600">{approval.approver}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-900">{approval.status}</p>
                      <p className="text-[10px] text-gray-600">{approval.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className="space-y-4">
            {plan.recoveryProcedures.map((procedure: { phase: string; duration: string; steps: string[] }, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{procedure.phase}</h3>
                  <span className="text-xs text-gray-600 font-medium">Duration: {procedure.duration}</span>
                </div>
                <div className="space-y-2">
                  {procedure.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-medium text-blue-600">{stepIndex + 1}</span>
                      </div>
                      <p className="text-xs text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            {/* Upstream Dependencies */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Upstream Dependencies</h3>
              <p className="text-xs text-gray-600 mb-4">Systems and services that this DR plan depends on</p>
              <div className="space-y-2">
                {plan.dependencies.upstream.map((dep: Dependency) => (
                  <div key={dep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-center gap-3">
                      <ServerIcon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{dep.name}</p>
                        <p className="text-[10px] text-gray-600">{dep.type} • {dep.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${criticalityColors[dep.criticality]}`}>
                      {dep.criticality}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Downstream Dependencies */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Downstream Dependencies</h3>
              <p className="text-xs text-gray-600 mb-4">Systems and services that depend on this DR plan</p>
              <div className="space-y-2">
                {plan.dependencies.downstream.map((dep: Dependency) => (
                  <div key={dep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-center gap-3">
                      <CogIcon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{dep.name}</p>
                        <p className="text-[10px] text-gray-600">{dep.type} • {dep.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${criticalityColors[dep.criticality]}`}>
                      {dep.criticality}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Dependencies */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Vendor Dependencies</h3>
              <p className="text-xs text-gray-600 mb-4">Third-party vendors critical for recovery</p>
              <div className="space-y-2">
                {plan.dependencies.vendors.map((vendor: Vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-center gap-3">
                      <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-[10px] text-gray-600">{vendor.service} • {vendor.id}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-700">SLA: {vendor.sla}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="space-y-6">
            {plan.technicalDetails ? (
              <>
                {/* Servers */}
                {plan.technicalDetails.servers && plan.technicalDetails.servers.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-sm p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Servers</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Server Name</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Role</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Location</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Backup Server</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {plan.technicalDetails.servers.map((server: Server, index: number) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-xs text-gray-900">{server.name}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{server.role}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{server.location}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{server.backup}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Databases */}
                {plan.technicalDetails.databases && plan.technicalDetails.databases.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-sm p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Databases</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Database Name</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Size</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Replication</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Last Backup</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {plan.technicalDetails.databases.map((db: Database, index: number) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-xs text-gray-900">{db.name}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{db.size}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{db.replication}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{db.lastBackup}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Networks */}
                {plan.technicalDetails.networks && plan.technicalDetails.networks.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-sm p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Network Configuration</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Network Segment</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">Production Subnet</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-700 uppercase">DR Subnet</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {plan.technicalDetails.networks.map((network: Network, index: number) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-xs text-gray-900">{network.segment}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{network.subnet}</td>
                              <td className="px-3 py-2 text-xs text-gray-700">{network.drSubnet}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-8">
                <div className="text-center">
                  <ServerIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Technical Details Available</h3>
                  <p className="mt-1 text-xs text-gray-500">Technical infrastructure details have not been documented for this plan yet.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            {/* Testing History */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Testing History</h3>
              <div className="space-y-3">
                {plan.testingHistory.map((test: TestHistory, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-green-50 text-green-700 border border-green-300">
                          {test.result}
                        </span>
                        <span className="text-xs font-medium text-gray-900">{test.type}</span>
                      </div>
                      <span className="text-xs text-gray-600">{test.date}</span>
                    </div>
                    <p className="text-xs text-gray-700">{test.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Testing Schedule */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Next Testing Schedule</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-sm border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">Full DR Test - Scheduled</span>
                  </div>
                  <p className="text-xs text-gray-700">Date: 2025-12-20</p>
                  <p className="text-xs text-gray-700 mt-1">Type: Complete failover and failback test</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'linkages' && (
          <div className="space-y-6">
            {/* Triggered By IRPs Section */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Triggered By Incident Response Plans</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    IRP Module
                  </span>
                </div>
                <span className="text-xs text-gray-500">{plan.linkedIRPs?.length || 0} linked IRPs</span>
              </div>

              {plan.linkedIRPs && plan.linkedIRPs.length > 0 ? (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">IRP ID</th>
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Name</th>
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Type</th>
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Severity</th>
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Trigger Condition</th>
                          <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {plan.linkedIRPs.map((irp: LinkedIRP) => (
                          <tr key={irp.id} className="hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <span className="text-xs font-medium text-blue-600">{irp.id}</span>
                            </td>
                            <td className="py-2 px-3 text-xs text-gray-900">{irp.name}</td>
                            <td className="py-2 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                {irp.type}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                {irp.severity}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-xs text-gray-600">{irp.triggerCondition}</td>
                            <td className="py-2 px-3">
                              <Link
                                href={`/bcp/scenarios/${irp.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View IRP →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <ShieldCheckIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-xs text-gray-500">No IRPs currently link to this DR Plan</p>
                </div>
              )}
            </div>

            {/* Linked Crisis Playbooks Section */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Escalates To Crisis Playbooks</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    Crisis Management
                  </span>
                </div>
                <span className="text-xs text-gray-500">{plan.linkedCrisisPlaybooks?.length || 0} linked playbooks</span>
              </div>

              {plan.linkedCrisisPlaybooks && plan.linkedCrisisPlaybooks.length > 0 ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {plan.linkedCrisisPlaybooks.map((playbook: LinkedPlaybook) => (
                      <div key={playbook.id} className="p-3 bg-gray-50 rounded-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-900">{playbook.id}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                            {playbook.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">{playbook.name}</p>
                        <Link
                          href={`/crisis-management/playbooks/${playbook.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Playbook →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <BoltIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-xs text-gray-500">No Crisis Playbooks linked</p>
                </div>
              )}
            </div>

            {/* Escalation Flow Visualization */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Escalation Flow</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                    <span className="text-[10px] font-medium text-red-600 mt-1">IRP</span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">{plan.linkedIRPs?.length || 0} plans</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="text-gray-400">→</div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-300 flex flex-col items-center justify-center">
                    <ServerIcon className="h-6 w-6 text-blue-600" />
                    <span className="text-[10px] font-medium text-blue-600 mt-1">IT DR</span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">This Plan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="text-gray-400">→</div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 flex flex-col items-center justify-center">
                    <BoltIcon className="h-6 w-6 text-amber-600" />
                    <span className="text-[10px] font-medium text-amber-600 mt-1">Crisis</span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">{plan.linkedCrisisPlaybooks?.length || 0} playbooks</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-gray-500 mt-4">
                Incident Response activates this DR Plan → DR Plan may escalate to Crisis Management
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

