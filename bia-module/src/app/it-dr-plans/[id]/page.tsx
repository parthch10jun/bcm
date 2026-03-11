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

// Mock data for demo - BCP Plans with Enabler Types
const mockDRPlanDetails: Record<string, any> = {
  'BCP-001': {
    id: 'BCP-001',
    name: 'People Displacement - Mumbai Office',
    description: 'Business continuity plan for managing workforce displacement scenarios including office evacuation, pandemic lockdowns, and mass transit disruptions affecting employee availability.',
    service: 'Human Resources',
    status: 'Approved',
    criticality: 'Tier 1',
    rto: '2 Hours',
    rpo: '15 Minutes',
    linkedBIA: 'BIA-FIN-001',
    owner: 'John Smith',
    enablerType: 'Human Resources',
    strategy: 'Work from Home / Alternate Site',
    ...defaultDRPlan,
    recoveryStrategy: {
      type: 'Work from Home / Alternate Site',
      location: 'Distributed (Home Offices + Backup Office - Navi Mumbai)',
      infrastructure: 'VPN infrastructure, collaboration tools (Teams/Zoom), cloud-based applications',
      failoverMechanism: 'Immediate activation of remote work protocols with automated access provisioning'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-001', name: 'VPN Infrastructure', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-002', name: 'Identity & Access Management', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-003', name: 'Collaboration Tools (Teams/Zoom)', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'APP-001', name: 'Core Business Applications', type: 'Application', criticality: 'Tier 1' },
        { id: 'APP-002', name: 'HR Management System', type: 'Application', criticality: 'Tier 2' },
        { id: 'APP-003', name: 'Time Tracking System', type: 'Application', criticality: 'Tier 2' }
      ],
      vendors: [
        { id: 'VEN-001', name: 'Microsoft', service: 'Teams & Office 365', sla: '2 Hours' },
        { id: 'VEN-002', name: 'Cisco', service: 'VPN Infrastructure', sla: '4 Hours' }
      ]
    },
    enablerResources: {
      personnel: [
        { role: 'Critical Staff (Tier 1)', count: 450, remoteCapable: 450, alternateLocation: 50 },
        { role: 'Essential Staff (Tier 2)', count: 320, remoteCapable: 300, alternateLocation: 20 },
        { role: 'Support Staff (Tier 3)', count: 180, remoteCapable: 150, alternateLocation: 0 }
      ],
      equipment: [
        { item: 'Laptops with VPN', quantity: 950, available: 950, location: 'Distributed' },
        { item: 'Mobile Phones', quantity: 950, available: 950, location: 'Distributed' },
        { item: 'Backup Office Workstations', quantity: 70, available: 70, location: 'Navi Mumbai' }
      ],
      facilities: [
        { name: 'Backup Office - Navi Mumbai', capacity: 70, type: 'Hot Desk', readiness: 'Active' },
        { name: 'Satellite Office - Pune', capacity: 30, type: 'Hot Desk', readiness: 'Standby' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Assessment & Activation', duration: '15 minutes', steps: ['Assess displacement scenario and scope', 'Activate BCP team and HR leadership', 'Determine affected employee count and locations', 'Verify remote work infrastructure capacity'] },
      { phase: 'Phase 2: Employee Notification', duration: '30 minutes', steps: ['Send mass notification to all affected employees', 'Provide work-from-home instructions and VPN access', 'Identify employees requiring alternate office space', 'Coordinate transportation to backup facilities if needed'] },
      { phase: 'Phase 3: Access Provisioning', duration: '45 minutes', steps: ['Activate VPN accounts for all displaced staff', 'Provision collaboration tool licenses', 'Enable remote access to critical applications', 'Set up virtual meeting rooms for teams'] },
      { phase: 'Phase 4: Validation & Support', duration: '30 minutes', steps: ['Verify all critical staff are online and productive', 'Test access to essential business applications', 'Establish IT helpdesk for remote work issues', 'Monitor productivity and connectivity metrics'] }
    ],
    testingHistory: [
      { date: '2025-10-15', type: 'Full BCP Exercise', result: 'Successful', notes: '950 employees transitioned to remote work in 1h 50m' },
      { date: '2025-08-20', type: 'Tabletop Exercise', result: 'Successful', notes: 'All teams participated, identified VPN capacity gap (now resolved)' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Pandemic Response Protocol', type: 'Health Emergency', severity: 'Critical', triggerCondition: 'When health emergency requires office closure' },
      { id: 'IRP-003', name: 'Natural Disaster Response', type: 'Natural Disaster', severity: 'High', triggerCondition: 'When natural disaster affects office accessibility' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Mass Transit Disruption Response', severity: 'High' }
    ]
  },
  'BCP-002': {
    id: 'BCP-002',
    name: 'Building Evacuation - Head Office',
    description: 'Business continuity plan for managing building evacuation scenarios including fire, structural damage, bomb threats, and environmental hazards affecting the head office facility.',
    service: 'Facilities Management',
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
    name: 'Technology Outage - Core Systems',
    description: 'Business continuity plan for managing technology infrastructure failures including data center outages, network failures, and critical system unavailability.',
    service: 'IT Infrastructure',
    status: 'Approved',
    criticality: 'Tier 1',
    rto: '2 Hours',
    rpo: '15 Minutes',
    linkedBIA: 'BIA-IT-001',
    owner: 'Mike Chen',
    enablerType: 'Technology',
    strategy: 'Failover to DR Site',
    ...defaultDRPlan,
    recoveryStrategy: {
      type: 'Failover to DR Site',
      location: 'DR Data Center - Navi Mumbai',
      infrastructure: 'Active-Active cluster with real-time synchronous replication',
      failoverMechanism: 'Automated failover with health monitoring and zero data loss'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-001', name: 'Power Infrastructure', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-005', name: 'Network Connectivity', type: 'System', criticality: 'Tier 1' },
        { id: 'SYS-006', name: 'Storage Infrastructure', type: 'System', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'APP-006', name: 'All Business Applications', type: 'Application', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-004', name: 'IBM', service: 'Hardware Support', sla: '4 Hours' },
        { id: 'VEN-005', name: 'Oracle', service: 'Database Support', sla: '2 Hours' },
        { id: 'VEN-006', name: 'Cisco', service: 'Network Support', sla: '4 Hours' }
      ]
    },
    enablerResources: {
      infrastructure: [
        { component: 'Application Servers', primary: 24, dr: 24, capacity: '100%', status: 'Active-Active' },
        { component: 'Database Servers', primary: 8, dr: 8, capacity: '100%', status: 'Active-Active' },
        { component: 'Storage Arrays', primary: 4, dr: 4, capacity: '10 PB', status: 'Replicated' }
      ],
      network: [
        { type: 'Primary Link', bandwidth: '10 Gbps', provider: 'Tata', backup: 'Yes' },
        { type: 'Secondary Link', bandwidth: '10 Gbps', provider: 'Airtel', backup: 'Yes' },
        { type: 'Tertiary Link', bandwidth: '1 Gbps', provider: 'BSNL', backup: 'No' }
      ],
      power: [
        { type: 'Grid Power', capacity: '2 MW', backup: 'UPS + Generator' },
        { type: 'UPS', capacity: '1.5 MW', runtime: '15 minutes' },
        { type: 'Diesel Generator', capacity: '2 MW', runtime: '72 hours' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection & Assessment', duration: '10 minutes', steps: ['Automated monitoring detects outage', 'Assess scope and impact of technology failure', 'Activate IT operations team', 'Determine if DR failover is required'] },
      { phase: 'Phase 2: Failover Initiation', duration: '30 minutes', steps: ['Initiate automated failover to DR site', 'Verify database replication status', 'Activate DR application servers', 'Update DNS and load balancer configurations'] },
      { phase: 'Phase 3: Service Restoration', duration: '1 hour', steps: ['Bring all critical applications online at DR site', 'Verify network connectivity and routing', 'Test user access and authentication', 'Restore batch processing and scheduled jobs'] },
      { phase: 'Phase 4: Validation', duration: '20 minutes', steps: ['Execute end-to-end transaction tests', 'Verify data integrity and consistency', 'Confirm all critical services are operational', 'Monitor performance and capacity metrics'] }
    ],
    testingHistory: [
      { date: '2025-11-01', type: 'Full DR Failover Test', result: 'Successful', notes: 'Complete failover achieved in 1h 35m, all systems operational' },
      { date: '2025-09-15', type: 'Partial Failover Test', result: 'Successful', notes: 'Database failover completed in 25 minutes' }
    ],
    linkedIRPs: [
      { id: 'IRP-003', name: 'Cyber Attack Response', type: 'Cyber', severity: 'Critical', triggerCondition: 'When cyber attack affects technology infrastructure' },
      { id: 'IRP-007', name: 'Data Center Outage', type: 'Infrastructure', severity: 'Critical', triggerCondition: 'When data center becomes unavailable' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Technology Infrastructure Failure', severity: 'Critical' }
    ]
  },
  'DR-004': {
    id: 'DR-004',
    name: 'Data Warehouse Recovery',
    description: 'Disaster recovery plan for enterprise data warehouse and business intelligence systems.',
    service: 'Data Warehouse',
    status: 'Approved',
    criticality: 'Tier 3',
    rto: '24 Hours',
    rpo: '4 Hours',
    linkedBIA: 'BIA-DATA-001',
    owner: 'Emily Davis',
    ...defaultDRPlan,
    recoveryStrategy: {
      type: 'Cold Site',
      location: 'Pune DR Site',
      infrastructure: 'Daily backups with 4-hour RPO restore capability',
      failoverMechanism: 'Manual failover with restore from backup'
    },
    dependencies: {
      upstream: [
        { id: 'DR-001', name: 'Core Banking System', type: 'DR Plan', criticality: 'Tier 1' },
        { id: 'SYS-006', name: 'ETL Services', type: 'System', criticality: 'Tier 2' }
      ],
      downstream: [
        { id: 'APP-007', name: 'BI Dashboards', type: 'Application', criticality: 'Tier 3' },
        { id: 'APP-008', name: 'Regulatory Reports', type: 'Application', criticality: 'Tier 2' }
      ],
      vendors: [
        { id: 'VEN-006', name: 'Informatica', service: 'ETL Support', sla: '8 Hours' }
      ]
    },
    technicalDetails: {
      servers: [
        { name: 'DW-PROD-01', role: 'Data Warehouse Server', location: 'Primary DC', backup: 'DW-DR-01' }
      ],
      databases: [
        { name: 'DW_MAIN', size: '15 TB', replication: 'Daily Backup', lastBackup: '2025-12-03 00:00' }
      ],
      networks: [
        { segment: 'Data VLAN 300', subnet: '10.10.300.0/24', drSubnet: '10.20.300.0/24' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Assessment', duration: '1 hour', steps: ['Assess data warehouse impact', 'Identify data loss window', 'Activate DR team'] },
      { phase: 'Phase 2: Recovery', duration: '12 hours', steps: ['Provision DR infrastructure', 'Restore from latest backup', 'Verify data integrity'] },
      { phase: 'Phase 3: Validation', duration: '8 hours', steps: ['Run ETL jobs', 'Validate report outputs', 'Verify BI dashboard connectivity'] },
      { phase: 'Phase 4: Sync', duration: '3 hours', steps: ['Sync incremental data', 'Update downstream systems', 'Document recovery'] }
    ],
    testingHistory: [
      { date: '2025-07-15', type: 'Backup Restore Test', result: 'Successful', notes: 'Full restore completed in 18 hours' }
    ],
    linkedIRPs: [],
    linkedCrisisPlaybooks: []
  },
  'DR-005': {
    id: 'DR-005',
    name: 'Network Infrastructure Recovery',
    description: 'Disaster recovery plan for core network infrastructure including routers, switches, firewalls, and load balancers.',
    service: 'Network Infrastructure',
    status: 'Approved',
    criticality: 'Tier 1',
    rto: '1 Hour',
    rpo: '5 Minutes',
    linkedBIA: 'BIA-IT-001',
    owner: 'Raj Patel',
    ...defaultDRPlan,
    recoveryStrategy: {
      type: 'Hot Site',
      location: 'Mumbai DR Site',
      infrastructure: 'Redundant network with automated failover',
      failoverMechanism: 'BGP-based automatic failover with VRRP'
    },
    dependencies: {
      upstream: [
        { id: 'SYS-007', name: 'ISP Links', type: 'External', criticality: 'Tier 1' },
        { id: 'SYS-008', name: 'MPLS Network', type: 'External', criticality: 'Tier 1' }
      ],
      downstream: [
        { id: 'ALL', name: 'All IT Systems', type: 'Infrastructure', criticality: 'Tier 1' }
      ],
      vendors: [
        { id: 'VEN-007', name: 'Cisco', service: 'Network Support', sla: '30 Minutes' },
        { id: 'VEN-008', name: 'Tata Communications', service: 'ISP Support', sla: '1 Hour' }
      ]
    },
    technicalDetails: {
      servers: [
        { name: 'FW-PROD-01', role: 'Primary Firewall', location: 'Primary DC', backup: 'FW-DR-01' },
        { name: 'FW-PROD-02', role: 'Secondary Firewall', location: 'Primary DC', backup: 'FW-DR-02' },
        { name: 'LB-PROD-01', role: 'Load Balancer', location: 'Primary DC', backup: 'LB-DR-01' }
      ],
      databases: [],
      networks: [
        { segment: 'Core Network', subnet: '10.10.0.0/16', drSubnet: '10.20.0.0/16' },
        { segment: 'Management VLAN', subnet: '10.10.1.0/24', drSubnet: '10.20.1.0/24' }
      ]
    },
    recoveryProcedures: [
      { phase: 'Phase 1: Detection', duration: '5 minutes', steps: ['Automated alerts trigger', 'NOC confirms outage', 'Initiate failover'] },
      { phase: 'Phase 2: Failover', duration: '30 minutes', steps: ['Activate DR network devices', 'Update BGP routing', 'Verify VRRP takeover', 'Confirm ISP failover'] },
      { phase: 'Phase 3: Validation', duration: '20 minutes', steps: ['Verify all VLANs active', 'Test inter-site connectivity', 'Confirm firewall rules', 'Validate load balancer'] },
      { phase: 'Phase 4: Notification', duration: '5 minutes', steps: ['Notify all IT teams', 'Update monitoring systems', 'Brief management'] }
    ],
    testingHistory: [
      { date: '2025-11-01', type: 'Automated Failover Test', result: 'Successful', notes: 'Failover completed in 12 minutes' },
      { date: '2025-09-15', type: 'Full Network DR Test', result: 'Successful', notes: 'All systems recovered within RTO' }
    ],
    linkedIRPs: [
      { id: 'IRP-001', name: 'Ransomware Attack Response', type: 'Ransomware', severity: 'Critical', triggerCondition: 'When network devices are compromised' },
      { id: 'IRP-003', name: 'DDoS Attack Mitigation', type: 'DDoS', severity: 'High', triggerCondition: 'When network is under attack' }
    ],
    linkedCrisisPlaybooks: [
      { id: 'CPB-001', name: 'Trading System Outage Response', severity: 'Critical' }
    ]
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
            {/* Servers */}
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

            {/* Databases */}
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

            {/* Networks */}
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

