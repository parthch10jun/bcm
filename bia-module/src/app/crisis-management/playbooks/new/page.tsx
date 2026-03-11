'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  UserGroupIcon,
  ListBulletIcon,
  MegaphoneIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  BuildingOfficeIcon,
  ServerIcon,
  PhoneIcon,
  MapPinIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  FlagIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  EyeIcon,
  StarIcon,
  CommandLineIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  FolderIcon,
  ShieldCheckIcon,
  TruckIcon,
  SignalIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  StopIcon,
  PhoneArrowDownLeftIcon,
  PhoneXMarkIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Enhanced 7-Step Wizard
const WIZARD_STEPS = [
  { id: 1, name: 'Classification', description: 'Incident type, decision & basic details', icon: FlagIcon },
  { id: 2, name: 'Scope', description: 'Resources, IT services, suppliers & locations', icon: CubeIcon },
  { id: 3, name: 'Communication', description: 'Teams, templates & contacts', icon: MegaphoneIcon },
  { id: 4, name: 'Playbooks', description: 'IRP phases, steps & checklists', icon: ListBulletIcon },
  { id: 5, name: 'BCP Invocation', description: 'Link & invoke BCPs and IRPs', icon: BoltIcon },
  { id: 6, name: 'Incident Log', description: 'Log template & closure checklist', icon: ClipboardDocumentCheckIcon },
  { id: 7, name: 'Report', description: 'Complete crisis management report', icon: DocumentTextIcon },
];

// Incident Type Options (from prototype)
const INCIDENT_TYPES = [
  { value: 'real', label: 'Real Incident', color: 'bg-red-600 text-white', desc: 'Actual crisis event' },
  { value: 'drill', label: 'Drill', color: 'bg-orange-600 text-white', desc: 'Planned exercise' },
  { value: 'test', label: 'Test', color: 'bg-amber-600 text-white', desc: 'System/process test' },
  { value: 'simulation', label: 'Simulation', color: 'bg-gray-700 text-white', desc: 'Tabletop exercise' },
];

// Incident Decision Options
const INCIDENT_DECISIONS = [
  { value: 'bcp-invoked', label: 'BCP Invoked', color: 'bg-red-600 text-white', desc: 'Business Continuity Plan fully activated' },
  { value: 'partial', label: 'Partial Activation', color: 'bg-orange-500 text-white', desc: 'Selected BCPs activated' },
  { value: 'not-invoked', label: 'Not Invoked', color: 'bg-gray-600 text-white', desc: 'Monitoring only, no BCP activation' },
];

// Category options for BSE
const PLAYBOOK_CATEGORIES = [
  { value: 'CYBER_ATTACK', label: 'Cyber Attack (Ransomware/DDoS)', icon: '🛡️' },
  { value: 'DATA_BREACH', label: 'Data Breach', icon: '🔓' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure Failure', icon: '🏢' },
  { value: 'NETWORK_OUTAGE', label: 'Network Outage', icon: '📡' },
  { value: 'POWER_FAILURE', label: 'Power Failure', icon: '⚡' },
  { value: 'NATURAL_DISASTER', label: 'Natural Disaster', icon: '🌪️' },
  { value: 'PANDEMIC', label: 'Pandemic / Health Crisis', icon: '🏥' },
  { value: 'REGULATORY', label: 'Regulatory Response', icon: '📋' },
  { value: 'INSIDER_THREAT', label: 'Insider Threat', icon: '👤' },
  { value: 'VENDOR_FAILURE', label: 'Vendor/Third Party Failure', icon: '🤝' },
];

const SEVERITY_OPTIONS = [
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200', desc: 'Immediate response required' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Response within 1 hour' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', desc: 'Response within 4 hours' },
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-200', desc: 'Response within 24 hours' },
];

// Scope Sub-tabs
const SCOPE_TABS = [
  { id: 'data-assets', label: 'Data & Information Assets', icon: FolderIcon, color: 'blue' },
  { id: 'it-services', label: 'IT Services', icon: ServerIcon, color: 'red' },
  { id: 'hardware', label: 'Hardware', icon: ComputerDesktopIcon, color: 'orange' },
  { id: 'suppliers', label: 'Suppliers', icon: TruckIcon, color: 'amber' },
  { id: 'telephony', label: 'Telephony', icon: PhoneIcon, color: 'gray' },
  { id: 'locations', label: 'Locations', icon: MapPinIcon, color: 'yellow' },
  { id: 'org-areas', label: 'Org Areas', icon: BuildingOfficeIcon, color: 'slate' },
  { id: 'irps', label: 'IRPs', icon: ShieldCheckIcon, color: 'orange' },
];

// Mock data for linking
const mockBIAs = [
  { id: 'BIA-001', name: 'Core Trading Platform', department: 'Trading Operations', criticality: 'Tier 1', rto: '15 min' },
  { id: 'BIA-002', name: 'Clearing & Settlement System', department: 'Clearing Corporation', criticality: 'Tier 1', rto: '30 min' },
  { id: 'BIA-003', name: 'Market Data Dissemination', department: 'Market Data', criticality: 'Tier 1', rto: '5 min' },
  { id: 'BIA-004', name: 'Member Trading Gateway', department: 'Member Services', criticality: 'Tier 1', rto: '15 min' },
  { id: 'BIA-005', name: 'Surveillance System', department: 'Compliance', criticality: 'Tier 2', rto: '2 hours' },
];

const mockRiskAssessments = [
  { id: 'RA-001', name: 'Cyber Security Risk Assessment', category: 'Technology', level: 'HIGH', scenarios: 12 },
  { id: 'RA-002', name: 'Operational Risk Assessment', category: 'Operations', level: 'MEDIUM', scenarios: 8 },
  { id: 'RA-003', name: 'Third Party Risk Assessment', category: 'Vendor', level: 'HIGH', scenarios: 6 },
];

const mockDRPlans = [
  { id: 'DR-001', name: 'Core Trading DR Plan', siteType: 'HOT', rto: '15 min', status: 'Active' },
  { id: 'DR-002', name: 'Data Center Failover Plan', siteType: 'HOT', rto: '30 min', status: 'Active' },
  { id: 'DR-003', name: 'Network Recovery Plan', siteType: 'WARM', rto: '1 hour', status: 'Active' },
];

const mockIRPs = [
  {
    id: 'IRP-001',
    name: 'Ransomware Attack Response',
    type: 'Cyber',
    lastTested: '2025-10-20',
    status: 'Active',
    responseTime: '< 15 min',
    phases: [
      { name: 'Preparation', duration: 'Pre-incident', steps: [
        { title: 'Verify EDR deployment on all endpoints', required: true },
        { title: 'Confirm network segmentation is active', required: true },
        { title: 'Validate backup systems operational', required: true },
        { title: 'Ensure IR team availability (24/7)', required: true },
      ]},
      { name: 'Detection & Analysis', duration: '15 min', steps: [
        { title: 'EDR alert triggers on suspicious encryption activity', required: true },
        { title: 'Validate alert - check for false positive indicators', required: true },
        { title: 'Identify affected systems and scope of encryption', required: true },
        { title: 'Determine ransomware variant and TTPs', required: true },
        { title: 'Check for data exfiltration indicators', required: true },
        { title: 'Escalate to Incident Commander if confirmed', required: true },
      ]},
      { name: 'Containment', duration: '30 min', steps: [
        { title: 'Isolate affected systems from network (EDR isolation)', required: true },
        { title: 'Block malicious IPs/domains at firewall', required: true },
        { title: 'Disable compromised user accounts', required: true },
        { title: 'Preserve volatile memory for forensics', required: true },
        { title: 'Take forensic disk images of affected systems', required: false },
      ]},
      { name: 'Eradication', duration: '4 hours', steps: [
        { title: 'Identify and remove all malware artifacts', required: true },
        { title: 'Patch exploited vulnerabilities', required: true },
        { title: 'Remove persistence mechanisms', required: true },
        { title: 'Verify complete removal with threat hunting', required: true },
        { title: 'Update detection signatures and rules', required: false },
      ]},
      { name: 'Recovery', duration: '4 hours (RTO)', steps: [
        { title: 'Restore critical trading systems from clean backups', required: true },
        { title: 'Restore member portal and API services', required: true },
        { title: 'Restore market data feeds', required: true },
        { title: 'Restore clearing and settlement systems', required: true },
        { title: 'Verify system integrity and functionality', required: true },
        { title: 'Gradual reconnection to network with monitoring', required: true },
      ]},
      { name: 'Post-Incident', duration: '72 hours', steps: [
        { title: 'Conduct lessons learned meeting', required: true },
        { title: 'Complete incident report', required: true },
        { title: 'Submit regulatory notifications (SEBI - 6 hours)', required: true },
        { title: 'Update IRP based on findings', required: false },
        { title: 'Implement preventive measures', required: false },
      ]},
    ]
  },
  {
    id: 'IRP-002',
    name: 'Data Breach Containment',
    type: 'Data Security',
    lastTested: '2025-09-15',
    status: 'Active',
    responseTime: '< 30 min',
    phases: [
      { name: 'Detection & Classification', duration: '30 min', steps: [
        { title: 'Identify breach scope and affected data types', required: true },
        { title: 'Classify data sensitivity (PII, Financial, Confidential)', required: true },
        { title: 'Determine breach vector and timeline', required: true },
        { title: 'Assess regulatory implications (GDPR, SEBI, RBI)', required: true },
      ]},
      { name: 'Containment', duration: '1 hour', steps: [
        { title: 'Revoke compromised access credentials', required: true },
        { title: 'Block unauthorized data transfer channels', required: true },
        { title: 'Preserve forensic evidence', required: true },
        { title: 'Isolate affected systems if necessary', required: true },
      ]},
      { name: 'Investigation', duration: '4 hours', steps: [
        { title: 'Conduct forensic analysis of breach', required: true },
        { title: 'Identify all affected records and individuals', required: true },
        { title: 'Document evidence chain of custody', required: true },
        { title: 'Determine if data was exfiltrated or just accessed', required: true },
      ]},
      { name: 'Notification', duration: '6-72 hours', steps: [
        { title: 'Notify SEBI within 6 hours (cyber incidents)', required: true },
        { title: 'Notify CERT-In within 6 hours', required: true },
        { title: 'Prepare affected individual notifications', required: true },
        { title: 'Brief Board and senior management', required: true },
        { title: 'Coordinate with legal counsel', required: true },
      ]},
      { name: 'Remediation', duration: '30 days', steps: [
        { title: 'Implement additional security controls', required: true },
        { title: 'Conduct security awareness training', required: false },
        { title: 'Update data protection policies', required: false },
        { title: 'Complete post-incident review', required: true },
      ]},
    ]
  },
  {
    id: 'IRP-003',
    name: 'DDoS Attack Mitigation',
    type: 'Network',
    lastTested: '2025-10-05',
    status: 'Under Review',
    responseTime: '< 10 min',
    phases: [
      { name: 'Detection', duration: '5 min', steps: [
        { title: 'Network monitoring alerts on traffic anomaly', required: true },
        { title: 'Identify attack type (volumetric, protocol, application)', required: true },
        { title: 'Assess affected services and impact', required: true },
      ]},
      { name: 'Initial Response', duration: '10 min', steps: [
        { title: 'Activate DDoS mitigation service (Akamai/Cloudflare)', required: true },
        { title: 'Enable rate limiting on edge devices', required: true },
        { title: 'Notify ISP for upstream filtering', required: true },
        { title: 'Activate geo-blocking if attack source identified', required: false },
      ]},
      { name: 'Mitigation', duration: '30 min', steps: [
        { title: 'Implement traffic scrubbing rules', required: true },
        { title: 'Scale infrastructure (auto-scaling if available)', required: true },
        { title: 'Block identified malicious IP ranges', required: true },
        { title: 'Monitor mitigation effectiveness', required: true },
      ]},
      { name: 'Recovery', duration: '1 hour', steps: [
        { title: 'Verify service restoration', required: true },
        { title: 'Gradually remove mitigation measures', required: true },
        { title: 'Monitor for attack resurgence', required: true },
        { title: 'Document attack patterns for future prevention', required: false },
      ]},
      { name: 'Post-Incident', duration: '24 hours', steps: [
        { title: 'Analyze attack patterns and vectors', required: true },
        { title: 'Update DDoS playbook with lessons learned', required: true },
        { title: 'File regulatory reports if required', required: true },
        { title: 'Review and enhance protection measures', required: false },
      ]},
    ]
  },
];

const mockTeamMembers = [
  { id: 'TM-001', name: 'Rajesh Kumar', role: 'Chief Information Security Officer', department: 'IT Security', phone: '+91 98765 43210', email: 'rajesh.kumar@bse.co.in' },
  { id: 'TM-002', name: 'Priya Sharma', role: 'Head of Trading Operations', department: 'Trading', phone: '+91 98765 43211', email: 'priya.sharma@bse.co.in' },
  { id: 'TM-003', name: 'Amit Patel', role: 'Infrastructure Lead', department: 'IT Infrastructure', phone: '+91 98765 43212', email: 'amit.patel@bse.co.in' },
  { id: 'TM-004', name: 'Sneha Reddy', role: 'Communications Manager', department: 'Corporate Communications', phone: '+91 98765 43213', email: 'sneha.reddy@bse.co.in' },
  { id: 'TM-005', name: 'Vikram Singh', role: 'Compliance Head', department: 'Compliance', phone: '+91 98765 43214', email: 'vikram.singh@bse.co.in' },
  { id: 'TM-006', name: 'Anita Desai', role: 'Legal Counsel', department: 'Legal', phone: '+91 98765 43215', email: 'anita.desai@bse.co.in' },
  { id: 'TM-007', name: 'Mohammed Khan', role: 'Network Security Lead', department: 'IT Security', phone: '+91 98765 43216', email: 'mohammed.khan@bse.co.in' },
  { id: 'TM-008', name: 'Deepak Joshi', role: 'Incident Response Manager', department: 'IT Security', phone: '+91 98765 43217', email: 'deepak.joshi@bse.co.in' },
  { id: 'TM-009', name: 'Kavita Menon', role: 'HR Director', department: 'Human Resources', phone: '+91 98765 43218', email: 'kavita.menon@bse.co.in' },
  { id: 'TM-010', name: 'Suresh Nair', role: 'Facilities Manager', department: 'Administration', phone: '+91 98765 43219', email: 'suresh.nair@bse.co.in' },
];

// Mock Scope Data - Data & Information Assets
const mockVitalRecords = [
  { id: 'DA-001', name: 'Customer Database', type: 'Database', location: 'Primary DC - Oracle Cluster', criticality: 'Critical' },
  { id: 'DA-002', name: 'Trading Records Archive', type: 'Database', location: 'Primary DC - SQL Server', criticality: 'Critical' },
  { id: 'DA-003', name: 'Employee PII Repository', type: 'Database', location: 'HR System - Encrypted Storage', criticality: 'Critical' },
  { id: 'DA-004', name: 'Transaction Logs', type: 'Log Data', location: 'Splunk SIEM - Hot Storage', criticality: 'Critical' },
  { id: 'DA-005', name: 'API Keys & Secrets Vault', type: 'Secrets', location: 'HashiCorp Vault', criticality: 'Critical' },
  { id: 'DA-006', name: 'Source Code Repository', type: 'Code', location: 'GitHub Enterprise', criticality: 'High' },
  { id: 'DA-007', name: 'Backup Encryption Keys', type: 'Keys', location: 'HSM - Primary DC', criticality: 'Critical' },
  { id: 'DA-008', name: 'Audit Trail Database', type: 'Database', location: 'Compliance Server', criticality: 'High' },
  { id: 'DA-009', name: 'Configuration Management DB', type: 'CMDB', location: 'ServiceNow Instance', criticality: 'High' },
  { id: 'DA-010', name: 'Network Diagrams & Architecture', type: 'Documentation', location: 'Confluence - Restricted', criticality: 'Medium' },
];

const mockITServices = [
  { id: 'IT-001', name: 'Core Banking System', type: 'Application', vendor: 'Finacle', criticality: 'Critical' },
  { id: 'IT-002', name: 'Trading Platform', type: 'Application', vendor: 'In-house', criticality: 'Critical' },
  { id: 'IT-003', name: 'Active Directory', type: 'Identity', vendor: 'Microsoft', criticality: 'Critical' },
  { id: 'IT-004', name: 'Email Gateway', type: 'Communication', vendor: 'Proofpoint', criticality: 'Critical' },
  { id: 'IT-005', name: 'DNS Services', type: 'Infrastructure', vendor: 'Infoblox', criticality: 'Critical' },
  { id: 'IT-006', name: 'Firewall Cluster', type: 'Security', vendor: 'Palo Alto', criticality: 'Critical' },
  { id: 'IT-007', name: 'Load Balancer', type: 'Infrastructure', vendor: 'F5', criticality: 'Critical' },
  { id: 'IT-008', name: 'Endpoint Detection (EDR)', type: 'Security', vendor: 'CrowdStrike', criticality: 'Critical' },
  { id: 'IT-009', name: 'SIEM Platform', type: 'Security', vendor: 'Splunk', criticality: 'High' },
  { id: 'IT-010', name: 'Backup & Recovery', type: 'Infrastructure', vendor: 'Veeam', criticality: 'Critical' },
  { id: 'IT-006', name: 'Cisco WebEx', type: 'Communication', vendor: 'Cisco', criticality: 'Medium' },
];

const mockHardware = [
  { id: 'HW-001', name: 'Desktop Computers', quantity: 450, location: 'All Floors', criticality: 'High' },
  { id: 'HW-002', name: 'Laptops', quantity: 200, location: 'Mobile', criticality: 'High' },
  { id: 'HW-003', name: 'Network Printers', quantity: 25, location: 'All Floors', criticality: 'Medium' },
  { id: 'HW-004', name: 'Servers (Primary DC)', quantity: 50, location: 'Data Center Mumbai', criticality: 'Critical' },
  { id: 'HW-005', name: 'Servers (DR Site)', quantity: 50, location: 'Data Center Navi Mumbai', criticality: 'Critical' },
  { id: 'HW-006', name: 'Network Switches', quantity: 30, location: 'All Floors', criticality: 'Critical' },
];

const mockSuppliers = [
  { id: 'SUP-001', name: 'Tata Communications', type: 'Network Provider', contact: '+91 22 6661 8000', sla: '99.99% uptime' },
  { id: 'SUP-002', name: 'Oracle India', type: 'Database Vendor', contact: '+91 80 4029 0000', sla: '4-hour response' },
  { id: 'SUP-003', name: 'Microsoft India', type: 'Cloud Provider', contact: '+91 80 4103 0000', sla: '99.9% SLA' },
  { id: 'SUP-004', name: 'Cisco Systems', type: 'Network Equipment', contact: '+91 80 4426 0000', sla: 'NBD replacement' },
  { id: 'SUP-005', name: 'Dell Technologies', type: 'Hardware Vendor', contact: '+91 80 2505 0000', sla: '4-hour onsite' },
];

const mockTelephony = [
  { id: 'TEL-001', name: 'Main PBX System', type: 'On-Premise', provider: 'Avaya', lines: 500 },
  { id: 'TEL-002', name: 'Call Center System', type: 'Cloud', provider: 'Genesys', lines: 100 },
  { id: 'TEL-003', name: 'Emergency Hotline', type: 'Dedicated', provider: 'BSNL', lines: 10 },
  { id: 'TEL-004', name: 'Mobile Fleet', type: 'Cellular', provider: 'Airtel', lines: 300 },
];

const mockLocations = [
  { id: 'LOC-001', name: 'BSE Tower - Mumbai', type: 'Headquarters', address: 'Dalal Street, Mumbai', capacity: 2000, isPrimary: true },
  { id: 'LOC-002', name: 'DR Site - Navi Mumbai', type: 'DR Site', address: 'Airoli, Navi Mumbai', capacity: 500, isPrimary: false },
  { id: 'LOC-003', name: 'Regional Office - Delhi', type: 'Branch', address: 'Connaught Place, Delhi', capacity: 100, isPrimary: false },
  { id: 'LOC-004', name: 'Regional Office - Chennai', type: 'Branch', address: 'Anna Salai, Chennai', capacity: 75, isPrimary: false },
];

const mockOrgAreas = [
  { id: 'ORG-001', name: 'Information Technology', parent: null, headCount: 150, critical: true },
  { id: 'ORG-002', name: 'IT Security', parent: 'ORG-001', headCount: 25, critical: true },
  { id: 'ORG-003', name: 'IT Infrastructure', parent: 'ORG-001', headCount: 40, critical: true },
  { id: 'ORG-004', name: 'IT Applications', parent: 'ORG-001', headCount: 60, critical: true },
  { id: 'ORG-005', name: 'Operations', parent: null, headCount: 200, critical: true },
  { id: 'ORG-006', name: 'Compliance', parent: null, headCount: 30, critical: true },
  { id: 'ORG-007', name: 'Finance', parent: null, headCount: 50, critical: false },
  { id: 'ORG-008', name: 'Human Resources', parent: null, headCount: 25, critical: false },
];

// Mock BCPs for invocation
const mockBCPs = [
  { id: 'BCP-001', name: 'IT Disaster Recovery Plan', department: 'IT', status: 'Approved', lastTested: '2025-10-15', rto: '4 hours' },
  { id: 'BCP-002', name: 'Operations Continuity Plan', department: 'Operations', status: 'Approved', lastTested: '2025-09-20', rto: '2 hours' },
  { id: 'BCP-003', name: 'Cyber Incident Response Plan', department: 'IT Security', status: 'Approved', lastTested: '2025-11-01', rto: '1 hour' },
  { id: 'BCP-004', name: 'Pandemic Response Plan', department: 'HR', status: 'Approved', lastTested: '2025-08-10', rto: '24 hours' },
  { id: 'BCP-005', name: 'Facilities Emergency Plan', department: 'Admin', status: 'Under Review', lastTested: '2025-07-15', rto: '4 hours' },
];

// ============================================
// SIEM / APM / ITSM / NETWORK MONITORING MOCK DATA
// ============================================

// Alert severity levels - Enterprise muted palette
const ALERT_SEVERITY = {
  CRITICAL: { label: 'P1', color: 'bg-red-600', textColor: 'text-red-700', bgLight: 'bg-gray-50', border: 'border-l-4 border-l-red-600 border-gray-200', priority: 1 },
  HIGH: { label: 'P2', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-gray-50', border: 'border-l-4 border-l-orange-500 border-gray-200', priority: 2 },
  MEDIUM: { label: 'P3', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-gray-50', border: 'border-l-4 border-l-yellow-500 border-gray-200', priority: 3 },
  LOW: { label: 'P4', color: 'bg-gray-400', textColor: 'text-gray-600', bgLight: 'bg-gray-50', border: 'border-l-4 border-l-gray-400 border-gray-200', priority: 4 },
};

// Source types - Using icon component names
const ALERT_SOURCES = {
  SIEM: { label: 'SIEM', abbr: 'SEC', desc: 'Security Information & Event Management' },
  APM: { label: 'APM', abbr: 'APP', desc: 'Application Performance Monitoring' },
  ITSM: { label: 'ITSM', abbr: 'SVC', desc: 'IT Service Management' },
  NETWORK: { label: 'Network', abbr: 'NET', desc: 'Network Monitoring' },
};

// Mock SIEM Alerts
const mockSIEMAlerts = [
  {
    id: 'SIEM-001',
    source: 'SIEM',
    title: 'Ransomware Attack Detected',
    description: 'Suspicious encryption activity detected on multiple file servers. Possible ransomware variant identified.',
    severity: 'CRITICAL',
    timestamp: '2025-12-02T09:45:00Z',
    affectedAssets: ['HW-004', 'HW-005'],
    affectedServices: ['IT-004', 'IT-005'],
    affectedLocations: ['LOC-001'],
    indicators: ['C2 communication detected', 'File encryption in progress', 'Lateral movement observed'],
    source_system: 'Splunk Enterprise SIEM',
    correlation_id: 'CORR-2025-1202-001',
    mitre_tactics: ['TA0040 - Impact', 'TA0008 - Lateral Movement'],
    suggestedCategory: 'CYBER_ATTACK',
    suggestedSeverity: 'CRITICAL',
    suggestedBCPs: ['BCP-003'],
  },
  {
    id: 'SIEM-002',
    source: 'SIEM',
    title: 'Unauthorized Access Attempt - Admin Portal',
    description: 'Multiple failed login attempts detected on administrative portal from external IP addresses.',
    severity: 'HIGH',
    timestamp: '2025-12-02T09:30:00Z',
    affectedAssets: ['HW-004'],
    affectedServices: ['IT-001'],
    affectedLocations: ['LOC-001'],
    indicators: ['Brute force pattern', '500+ failed attempts', 'IP geolocation: Eastern Europe'],
    source_system: 'IBM QRadar',
    correlation_id: 'CORR-2025-1202-002',
    mitre_tactics: ['TA0006 - Credential Access'],
    suggestedCategory: 'CYBER_ATTACK',
    suggestedSeverity: 'HIGH',
    suggestedBCPs: ['BCP-003'],
  },
  {
    id: 'SIEM-003',
    source: 'SIEM',
    title: 'Data Exfiltration Suspected',
    description: 'Unusual outbound data transfer detected from database servers during non-business hours.',
    severity: 'CRITICAL',
    timestamp: '2025-12-02T08:15:00Z',
    affectedAssets: ['HW-004', 'HW-006'],
    affectedServices: ['IT-005'],
    affectedLocations: ['LOC-001'],
    indicators: ['2.3 TB transferred', 'Destination: Unknown cloud storage', 'After-hours activity'],
    source_system: 'Microsoft Sentinel',
    correlation_id: 'CORR-2025-1202-003',
    mitre_tactics: ['TA0010 - Exfiltration'],
    suggestedCategory: 'DATA_BREACH',
    suggestedSeverity: 'CRITICAL',
    suggestedBCPs: ['BCP-003', 'BCP-001'],
  },
];

// Mock APM Alerts
const mockAPMAlerts = [
  {
    id: 'APM-001',
    source: 'APM',
    title: 'Trading Engine Response Time Critical',
    description: 'Core trading engine experiencing 5000ms+ latency. Order processing severely delayed.',
    severity: 'CRITICAL',
    timestamp: '2025-12-02T09:50:00Z',
    affectedAssets: ['HW-004'],
    affectedServices: ['IT-004'],
    affectedLocations: ['LOC-001'],
    metrics: { responseTime: '5234ms', errorRate: '23%', throughput: '120 TPS (normal: 5000 TPS)' },
    source_system: 'Dynatrace',
    root_cause: 'Database connection pool exhaustion',
    suggestedCategory: 'INFRASTRUCTURE',
    suggestedSeverity: 'CRITICAL',
    suggestedBCPs: ['BCP-001', 'BCP-002'],
  },
  {
    id: 'APM-002',
    source: 'APM',
    title: 'Market Data Feed Latency Spike',
    description: 'Real-time market data feed experiencing significant delays affecting price dissemination.',
    severity: 'HIGH',
    timestamp: '2025-12-02T09:42:00Z',
    affectedAssets: ['HW-004', 'HW-006'],
    affectedServices: ['IT-004'],
    affectedLocations: ['LOC-001', 'LOC-002'],
    metrics: { latency: '850ms (SLA: 50ms)', packetLoss: '2.3%', jitter: '45ms' },
    source_system: 'New Relic',
    root_cause: 'Network congestion on primary link',
    suggestedCategory: 'NETWORK_OUTAGE',
    suggestedSeverity: 'HIGH',
    suggestedBCPs: ['BCP-002'],
  },
  {
    id: 'APM-003',
    source: 'APM',
    title: 'Member Portal Error Rate Elevated',
    description: 'Member trading portal showing 15% error rate. Users reporting login failures.',
    severity: 'MEDIUM',
    timestamp: '2025-12-02T09:35:00Z',
    affectedAssets: ['HW-004'],
    affectedServices: ['IT-001', 'IT-003'],
    affectedLocations: ['LOC-001'],
    metrics: { errorRate: '15%', affectedUsers: '1,234', avgResponseTime: '3.2s' },
    source_system: 'AppDynamics',
    root_cause: 'Authentication service degradation',
    suggestedCategory: 'INFRASTRUCTURE',
    suggestedSeverity: 'MEDIUM',
    suggestedBCPs: ['BCP-001'],
  },
];

// Mock ITSM Alerts (ServiceNow Incidents)
const mockITSMAlerts = [
  {
    id: 'INC-001',
    source: 'ITSM',
    title: 'P1 - Complete Trading System Outage',
    description: 'Trading system unresponsive. No orders can be processed. All trading desks affected.',
    severity: 'CRITICAL',
    timestamp: '2025-12-02T09:48:00Z',
    affectedAssets: ['HW-004', 'HW-005', 'HW-006'],
    affectedServices: ['IT-004', 'IT-005'],
    affectedLocations: ['LOC-001'],
    ticket_number: 'INC0012345',
    assigned_group: 'Trading Support',
    escalation_level: 'P1 - Major Incident',
    impacted_users: 2500,
    source_system: 'ServiceNow',
    suggestedCategory: 'INFRASTRUCTURE',
    suggestedSeverity: 'CRITICAL',
    suggestedBCPs: ['BCP-001', 'BCP-002'],
  },
  {
    id: 'INC-002',
    source: 'ITSM',
    title: 'P2 - Email System Degradation',
    description: 'Microsoft 365 email service experiencing delays. Messages delayed by 30+ minutes.',
    severity: 'HIGH',
    timestamp: '2025-12-02T09:20:00Z',
    affectedAssets: [],
    affectedServices: ['IT-001', 'IT-002'],
    affectedLocations: ['LOC-001', 'LOC-002', 'LOC-003', 'LOC-004'],
    ticket_number: 'INC0012346',
    assigned_group: 'Cloud Services',
    escalation_level: 'P2 - High Impact',
    impacted_users: 1800,
    source_system: 'ServiceNow',
    suggestedCategory: 'VENDOR_FAILURE',
    suggestedSeverity: 'HIGH',
    suggestedBCPs: ['BCP-001'],
  },
];

// Mock Network Monitoring Alerts
const mockNetworkAlerts = [
  {
    id: 'NET-001',
    source: 'NETWORK',
    title: 'Primary Data Center Link Down',
    description: 'Primary WAN link between Mumbai HQ and Navi Mumbai DR site is down. Failover in progress.',
    severity: 'CRITICAL',
    timestamp: '2025-12-02T09:47:00Z',
    affectedAssets: ['HW-006'],
    affectedServices: ['IT-004', 'IT-005'],
    affectedLocations: ['LOC-001', 'LOC-002'],
    link_details: { circuit_id: 'TATA-MUM-NM-001', bandwidth: '10 Gbps', failover_status: 'Active' },
    source_system: 'Cisco DNA Center',
    suggestedCategory: 'NETWORK_OUTAGE',
    suggestedSeverity: 'CRITICAL',
    suggestedBCPs: ['BCP-001', 'BCP-002'],
  },
  {
    id: 'NET-002',
    source: 'NETWORK',
    title: 'Core Switch CPU Critical',
    description: 'Core network switch experiencing 98% CPU utilization. Possible broadcast storm.',
    severity: 'HIGH',
    timestamp: '2025-12-02T09:40:00Z',
    affectedAssets: ['HW-006'],
    affectedServices: ['IT-003', 'IT-004'],
    affectedLocations: ['LOC-001'],
    device_details: { hostname: 'CORE-SW-01', model: 'Cisco Nexus 9500', uptime: '234 days' },
    source_system: 'SolarWinds NPM',
    suggestedCategory: 'INFRASTRUCTURE',
    suggestedSeverity: 'HIGH',
    suggestedBCPs: ['BCP-001'],
  },
  {
    id: 'NET-003',
    source: 'NETWORK',
    title: 'Firewall Cluster Failover',
    description: 'Active firewall node failed. Standby node has taken over. Investigating root cause.',
    severity: 'MEDIUM',
    timestamp: '2025-12-02T09:25:00Z',
    affectedAssets: ['HW-006'],
    affectedServices: [],
    affectedLocations: ['LOC-001'],
    device_details: { cluster: 'FW-CLUSTER-01', active_node: 'FW-02', failed_node: 'FW-01' },
    source_system: 'Palo Alto Panorama',
    suggestedCategory: 'INFRASTRUCTURE',
    suggestedSeverity: 'MEDIUM',
    suggestedBCPs: ['BCP-001'],
  },
];

// Combine all alerts
const allMonitoringAlerts = [...mockSIEMAlerts, ...mockAPMAlerts, ...mockITSMAlerts, ...mockNetworkAlerts];

// Mock Call Trees from the Call Tree module
const mockCallTrees = [
  {
    id: 'ct-001',
    name: 'IT Infrastructure Emergency',
    description: 'Communication tree for critical IT system failures',
    members: 15,
    levels: 3,
    status: 'Active',
    lastTested: '2025-01-25',
    responseRate: 94,
    avgResponseTime: '2.3 min'
  },
  {
    id: 'ct-002',
    name: 'Executive Crisis Team',
    description: 'Senior leadership notification tree',
    members: 8,
    levels: 2,
    status: 'Active',
    lastTested: '2025-01-20',
    responseRate: 100,
    avgResponseTime: '1.8 min'
  },
  {
    id: 'ct-003',
    name: 'Trading Floor Emergency',
    description: 'Trading operations rapid response',
    members: 22,
    levels: 4,
    status: 'Active',
    lastTested: '2025-01-28',
    responseRate: 91,
    avgResponseTime: '2.7 min'
  },
  {
    id: 'ct-004',
    name: 'Regulatory Compliance Team',
    description: 'SEBI/RBI/NSE notification chain',
    members: 6,
    levels: 2,
    status: 'Active',
    lastTested: '2025-01-15',
    responseRate: 100,
    avgResponseTime: '1.5 min'
  },
  {
    id: 'ct-005',
    name: 'Data Center Operations',
    description: 'DR site activation and failover team',
    members: 12,
    levels: 3,
    status: 'Under Review',
    lastTested: '2025-01-10',
    responseRate: 88,
    avgResponseTime: '3.1 min'
  },
];

export default function NewPlaybookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeScopeTab, setActiveScopeTab] = useState('data-assets');
  const [commSubTab, setCommSubTab] = useState<'teams' | 'response' | 'templates'>('teams');

  // Detection & Monitoring Panel State
  const [showDetectionPanel, setShowDetectionPanel] = useState(true);
  const [activeAlertSource, setActiveAlertSource] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [alertFilters, setAlertFilters] = useState({
    sources: ['SIEM', 'APM', 'ITSM', 'NETWORK'],
    severities: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
  });

  // Invocation Advisor State
  const [invocationAdvisor, setInvocationAdvisor] = useState<{
    show: boolean;
    alert: any;
    score: number;
    recommendation: 'full' | 'partial' | 'none';
    breakdown: { criterion: string; score: number; maxScore: number; detail: string }[];
    suggestedBCPs: string[];
  } | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Classification - SAMPLE DATA
    incidentType: 'real',
    incidentDecision: 'immediate',
    invokedBCPsInClassification: ['BCP-001'] as string[],
    name: 'Ransomware Attack Response - Core Banking Systems',
    category: 'Cyber Security Incident',
    severity: 'CRITICAL',
    description: 'Critical ransomware attack detected on core banking infrastructure affecting trading systems, customer data, and payment processing. Immediate containment and recovery actions required. Potential data exfiltration suspected.',
    estimatedDuration: '24-48 hours',
    owner: 'TM-001',
    reviewers: ['TM-002', 'TM-003'] as string[],

    // Step 2: Scope - SAMPLE DATA
    selectedVitalRecords: ['DA-001', 'DA-002', 'DA-003', 'DA-005', 'DA-006'] as string[],
    selectedITServices: ['IT-001', 'IT-002', 'IT-004', 'IT-008', 'IT-009'] as string[],
    selectedHardware: ['HW-001', 'HW-002', 'HW-003'] as string[],
    selectedSuppliers: ['SUP-001', 'SUP-002', 'SUP-004'] as string[],
    selectedTelephony: ['TEL-001', 'TEL-002'] as string[],
    selectedLocations: ['LOC-001', 'LOC-002', 'LOC-003'] as string[],
    selectedOrgAreas: ['ORG-001', 'ORG-002', 'ORG-003', 'ORG-004'] as string[],
    orgSpecialNeeds: 'Priority focus on trading floor operations and customer-facing services. Ensure DR site readiness for failover.',

    // Step 3: Management Team (CMT) - SAMPLE DATA
    crisisCommander: 'TM-001',
    deputyCommander: 'TM-002',
    technicalLead: 'TM-003',
    communicationsLead: 'TM-004',
    businessLead: 'TM-005',
    regulatoryLiaison: 'TM-006',
    legalCounsel: 'TM-007',
    hrLead: 'TM-008',
    facilitiesLead: 'TM-009',
    // L3 Operational
    l3NetworkEngineer: 'TM-010',
    l3DatabaseAdmin: 'TM-011',
    l3SecurityAnalyst: 'TM-012',
    l3AppSupport: 'TM-013',
    l3InfraLead: 'TM-014',
    l3HelpdeskLead: 'TM-015',
    // Call Tree Linking
    linkedCallTrees: ['CT-001', 'CT-002', 'CT-003'] as string[],

    // Step 4: Response Teams - SAMPLE DATA
    incidentResponseTeam: [
      { id: 'IRT-1', teamName: 'Cyber Security Response Team', leader: 'TM-003', members: ['TM-010', 'TM-012', 'TM-014'] as string[], role: 'Technical Investigation & Containment' },
      { id: 'IRT-2', teamName: 'Infrastructure Recovery Team', leader: 'TM-014', members: ['TM-010', 'TM-011', 'TM-013'] as string[], role: 'System Restoration & Validation' },
    ] as any[],
    crisisResponseTeam: [
      { id: 'CRT-1', teamName: 'Executive Crisis Committee', leader: 'TM-001', members: ['TM-002', 'TM-005', 'TM-006'] as string[], role: 'Strategic Decision Making & Stakeholder Management' },
      { id: 'CRT-2', teamName: 'Communications & Legal Team', leader: 'TM-004', members: ['TM-007', 'TM-008'] as string[], role: 'Internal/External Communications & Regulatory Liaison' },
    ] as any[],

    // Step 5: Phases - SAMPLE DATA with steps and execution details
    phases: [
      { name: 'Detection & Triage', duration: '15-30 min', actualDuration: '22 min', startTime: '2024-12-03 08:47 AM', endTime: '2024-12-03 09:09 AM', status: 'Completed', steps: [
        { title: 'Validate alert from SIEM/EDR system', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '08:47 AM', endTime: '08:52 AM', duration: '5 min', notes: 'CrowdStrike EDR flagged suspicious process execution' },
        { title: 'Identify affected systems and scope', required: true, status: 'Completed', executedBy: 'TM-010', startTime: '08:52 AM', endTime: '09:00 AM', duration: '8 min', notes: '12 servers identified in Trading subnet' },
        { title: 'Document initial indicators of compromise (IOCs)', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '09:00 AM', endTime: '09:06 AM', duration: '6 min', notes: 'Hash values, C2 IPs documented in SIEM' },
        { title: 'Notify Security Operations Center (SOC)', required: false, status: 'Completed', executedBy: 'TM-012', startTime: '09:06 AM', endTime: '09:09 AM', duration: '3 min', notes: 'SOC ticket #INC-2024-1203-001 created' },
      ] },
      { name: 'Escalation & Activation', duration: '10-15 min', actualDuration: '18 min', startTime: '2024-12-03 09:09 AM', endTime: '2024-12-03 09:27 AM', status: 'Completed', steps: [
        { title: 'Activate Crisis Management Team (CMT)', required: true, status: 'Completed', executedBy: 'TM-003', startTime: '09:09 AM', endTime: '09:12 AM', duration: '3 min', notes: 'CMT activation email sent to all members' },
        { title: 'Invoke call tree for key personnel', required: true, status: 'Completed', executedBy: 'TM-003', startTime: '09:12 AM', endTime: '09:18 AM', duration: '6 min', notes: 'L1: 3/3 reached, L2: 5/6 reached, L3: 4/6 reached' },
        { title: 'Establish war room (physical/virtual)', required: true, status: 'Completed', executedBy: 'TM-002', startTime: '09:15 AM', endTime: '09:20 AM', duration: '5 min', notes: 'MS Teams bridge activated, Room 4B-Crisis reserved' },
        { title: 'Brief executive leadership on situation', required: true, status: 'Completed', executedBy: 'TM-001', startTime: '09:20 AM', endTime: '09:27 AM', duration: '7 min', notes: 'CEO, CFO, CRO briefed on initial assessment' },
      ] },
      { name: 'Containment', duration: '30-60 min', actualDuration: '48 min', startTime: '2024-12-03 09:27 AM', endTime: '2024-12-03 10:15 AM', status: 'Completed', steps: [
        { title: 'Isolate affected network segments', required: true, status: 'Completed', executedBy: 'TM-010', startTime: '09:27 AM', endTime: '09:42 AM', duration: '15 min', notes: 'VLAN 172.16.x.x isolated at core switch' },
        { title: 'Disable compromised user accounts', required: true, status: 'Completed', executedBy: 'TM-011', startTime: '09:35 AM', endTime: '09:45 AM', duration: '10 min', notes: '47 accounts disabled in Active Directory' },
        { title: 'Block malicious IPs at firewall level', required: true, status: 'Completed', executedBy: 'TM-010', startTime: '09:42 AM', endTime: '09:55 AM', duration: '13 min', notes: '23 C2 IPs blocked on Palo Alto firewalls' },
        { title: 'Preserve forensic evidence (memory dumps, logs)', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '09:45 AM', endTime: '10:10 AM', duration: '25 min', notes: 'Memory dumps from 8 critical servers, Splunk logs exported' },
        { title: 'Implement emergency access controls', required: false, status: 'Completed', executedBy: 'TM-014', startTime: '10:00 AM', endTime: '10:15 AM', duration: '15 min', notes: 'Jump server access restricted to IR team only' },
      ] },
      { name: 'Investigation', duration: '1-4 hours', actualDuration: '3h 15min', startTime: '2024-12-03 10:15 AM', endTime: '2024-12-03 01:30 PM', status: 'Completed', steps: [
        { title: 'Analyze malware samples in sandbox', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '10:15 AM', endTime: '11:30 AM', duration: '1h 15min', notes: 'LockBit 3.0 variant confirmed, encryption mechanism analyzed' },
        { title: 'Trace attack vector and entry point', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '10:30 AM', endTime: '12:00 PM', duration: '1h 30min', notes: 'Phishing email to finance team, macro-enabled document' },
        { title: 'Identify extent of data exfiltration', required: true, status: 'Completed', executedBy: 'TM-003', startTime: '11:00 AM', endTime: '01:00 PM', duration: '2h', notes: '~2.3GB exfiltrated to external IP before containment' },
        { title: 'Review authentication logs for lateral movement', required: true, status: 'Completed', executedBy: 'TM-011', startTime: '11:30 AM', endTime: '01:15 PM', duration: '1h 45min', notes: 'Pass-the-hash detected, 5 service accounts compromised' },
        { title: 'Engage third-party forensics if required', required: false, status: 'Completed', executedBy: 'TM-001', startTime: '12:00 PM', endTime: '01:30 PM', duration: '1h 30min', notes: 'Mandiant engaged, on-site team ETA 4 hours' },
      ] },
      { name: 'Eradication', duration: '2-4 hours', actualDuration: '3h 30min', startTime: '2024-12-03 01:30 PM', endTime: '2024-12-03 05:00 PM', status: 'Completed', steps: [
        { title: 'Remove malware from all affected systems', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '01:30 PM', endTime: '03:30 PM', duration: '2h', notes: 'EDR-assisted removal on 12 servers, manual on 3' },
        { title: 'Patch exploited vulnerabilities', required: true, status: 'Completed', executedBy: 'TM-014', startTime: '02:00 PM', endTime: '04:00 PM', duration: '2h', notes: 'CVE-2024-XXXX patched, Office macros disabled org-wide' },
        { title: 'Reset all potentially compromised credentials', required: true, status: 'Completed', executedBy: 'TM-011', startTime: '03:00 PM', endTime: '04:30 PM', duration: '1h 30min', notes: '152 user passwords reset, 12 service account keys rotated' },
        { title: 'Rebuild systems from clean backups if needed', required: false, status: 'Completed', executedBy: 'TM-013', startTime: '03:30 PM', endTime: '05:00 PM', duration: '1h 30min', notes: '4 servers rebuilt from Veeam backups (Dec 2 snapshot)' },
      ] },
      { name: 'Recovery', duration: '2-8 hours', actualDuration: '4h 30min', startTime: '2024-12-03 05:00 PM', endTime: '2024-12-03 09:30 PM', status: 'Completed', steps: [
        { title: 'Restore systems from verified clean backups', required: true, status: 'Completed', executedBy: 'TM-011', startTime: '05:00 PM', endTime: '06:30 PM', duration: '1h 30min', notes: 'Trading DB, Customer DB restored from verified snapshots' },
        { title: 'Validate system integrity before reconnection', required: true, status: 'Completed', executedBy: 'TM-012', startTime: '06:30 PM', endTime: '07:30 PM', duration: '1h', notes: 'Hash verification passed, no persistence mechanisms found' },
        { title: 'Perform staged reconnection to network', required: true, status: 'Completed', executedBy: 'TM-010', startTime: '07:30 PM', endTime: '08:30 PM', duration: '1h', notes: 'Staged: Core → App → Web tier reconnection' },
        { title: 'Conduct functionality testing', required: true, status: 'Completed', executedBy: 'TM-013', startTime: '08:30 PM', endTime: '09:15 PM', duration: '45 min', notes: 'UAT passed for trading, payments, and reporting modules' },
        { title: 'Resume normal business operations', required: true, status: 'Completed', executedBy: 'TM-001', startTime: '09:15 PM', endTime: '09:30 PM', duration: '15 min', notes: 'Go-live approved by Crisis Commander, all-hands notification sent' },
      ] },
      { name: 'Post-Incident', duration: '1-2 days', actualDuration: '1.5 days', startTime: '2024-12-04 09:00 AM', endTime: '2024-12-05 03:00 PM', status: 'Completed', steps: [
        { title: 'Conduct post-incident review meeting', required: true, status: 'Completed', executedBy: 'TM-001', startTime: '09:00 AM', endTime: '11:00 AM', duration: '2h', notes: '18 attendees, all key stakeholders present' },
        { title: 'Document lessons learned', required: true, status: 'Completed', executedBy: 'TM-003', startTime: '11:00 AM', endTime: '03:00 PM', duration: '4h', notes: '12 improvement items identified, 5 critical' },
        { title: 'Update incident response procedures', required: false, status: 'In Progress', executedBy: 'TM-003', startTime: '03:00 PM', endTime: '', duration: 'Ongoing', notes: 'Playbook updates pending review by CISO' },
        { title: 'Submit regulatory reports (SEBI, CERT-In)', required: true, status: 'Completed', executedBy: 'TM-006', startTime: '02:00 PM', endTime: '02:45 PM', duration: '45 min', notes: 'SEBI filed 14:30, CERT-In filed 14:45 (within 6hr mandate)' },
        { title: 'Prepare executive summary report', required: true, status: 'Completed', executedBy: 'TM-004', startTime: '01:00 PM', endTime: '03:00 PM', duration: '2h', notes: 'Board-ready summary delivered to CEO' },
      ] },
    ],

    // Crisis Call & Communication Metrics - SAMPLE DATA
    crisisCallMetrics: {
      totalCalls: 8,
      primaryBridge: {
        platform: 'Microsoft Teams',
        bridgeId: 'CRISIS-2024-1203',
        startTime: '2024-12-03 09:15 AM',
        endTime: '2024-12-03 09:30 PM',
        totalDuration: '12h 15min',
        peakParticipants: 24,
        uniqueParticipants: 31,
      },
      callSessions: [
        { id: 'CALL-1', name: 'Initial Crisis Brief', startTime: '09:15 AM', endTime: '09:45 AM', duration: '30 min', participants: 12, host: 'TM-001', type: 'All Hands' },
        { id: 'CALL-2', name: 'Technical Deep Dive', startTime: '10:00 AM', endTime: '11:30 AM', duration: '1h 30min', participants: 8, host: 'TM-003', type: 'Technical' },
        { id: 'CALL-3', name: 'Executive Update #1', startTime: '12:00 PM', endTime: '12:30 PM', duration: '30 min', participants: 6, host: 'TM-001', type: 'Executive' },
        { id: 'CALL-4', name: 'Stakeholder Communications Sync', startTime: '01:00 PM', endTime: '01:30 PM', duration: '30 min', participants: 5, host: 'TM-004', type: 'Communications' },
        { id: 'CALL-5', name: 'Technical Status Update', startTime: '03:00 PM', endTime: '03:30 PM', duration: '30 min', participants: 10, host: 'TM-003', type: 'Technical' },
        { id: 'CALL-6', name: 'Executive Update #2', startTime: '05:00 PM', endTime: '05:30 PM', duration: '30 min', participants: 7, host: 'TM-001', type: 'Executive' },
        { id: 'CALL-7', name: 'Recovery Go/No-Go', startTime: '07:00 PM', endTime: '08:00 PM', duration: '1h', participants: 14, host: 'TM-001', type: 'Decision' },
        { id: 'CALL-8', name: 'Incident Closure Brief', startTime: '09:00 PM', endTime: '09:30 PM', duration: '30 min', participants: 18, host: 'TM-001', type: 'All Hands' },
      ],
    } as any,

    // Level Involvement & Response Tracking - SAMPLE DATA
    levelInvolvement: {
      L1: {
        name: 'Executive Leadership',
        activated: true,
        activatedAt: '2024-12-03 09:12 AM',
        activatedBy: 'TM-003',
        totalMembers: 3,
        responded: 3,
        responseRate: '100%',
        avgResponseTime: '4 min',
        members: [
          { id: 'TM-001', name: 'Rajesh Kumar', role: 'Crisis Commander', notifiedAt: '09:12 AM', respondedAt: '09:14 AM', responseTime: '2 min', channel: 'Phone', status: 'Active' },
          { id: 'TM-002', name: 'Priya Sharma', role: 'Deputy Commander', notifiedAt: '09:12 AM', respondedAt: '09:16 AM', responseTime: '4 min', channel: 'Phone', status: 'Active' },
          { id: 'TM-005', name: 'Vikram Singh', role: 'Business Lead', notifiedAt: '09:12 AM', respondedAt: '09:18 AM', responseTime: '6 min', channel: 'MS Teams', status: 'Active' },
        ],
      },
      L2: {
        name: 'Tactical Management',
        activated: true,
        activatedAt: '2024-12-03 09:12 AM',
        activatedBy: 'TM-003',
        totalMembers: 6,
        responded: 5,
        responseRate: '83%',
        avgResponseTime: '8 min',
        members: [
          { id: 'TM-003', name: 'Amit Patel', role: 'Technical Lead / CISO', notifiedAt: '09:09 AM', respondedAt: '09:09 AM', responseTime: '0 min', channel: 'Self', status: 'Active' },
          { id: 'TM-004', name: 'Sneha Reddy', role: 'Communications Lead', notifiedAt: '09:12 AM', respondedAt: '09:17 AM', responseTime: '5 min', channel: 'Phone', status: 'Active' },
          { id: 'TM-006', name: 'Arjun Menon', role: 'Regulatory Liaison', notifiedAt: '09:12 AM', respondedAt: '09:20 AM', responseTime: '8 min', channel: 'Email', status: 'Active' },
          { id: 'TM-007', name: 'Kavitha Nair', role: 'Legal Counsel', notifiedAt: '09:12 AM', respondedAt: '09:25 AM', responseTime: '13 min', channel: 'Phone', status: 'Active' },
          { id: 'TM-008', name: 'Suresh Iyer', role: 'HR Lead', notifiedAt: '09:12 AM', respondedAt: '09:22 AM', responseTime: '10 min', channel: 'MS Teams', status: 'Active' },
          { id: 'TM-009', name: 'Deepa Krishnan', role: 'Facilities Lead', notifiedAt: '09:12 AM', respondedAt: '-', responseTime: 'N/A', channel: 'Phone', status: 'No Response' },
        ],
      },
      L3: {
        name: 'Operational Response',
        activated: true,
        activatedAt: '2024-12-03 09:15 AM',
        activatedBy: 'TM-003',
        totalMembers: 6,
        responded: 4,
        responseRate: '67%',
        avgResponseTime: '12 min',
        members: [
          { id: 'TM-010', name: 'Rahul Verma', role: 'Network Engineer', notifiedAt: '09:15 AM', respondedAt: '09:18 AM', responseTime: '3 min', channel: 'Slack', status: 'Active' },
          { id: 'TM-011', name: 'Meera Joshi', role: 'Database Admin', notifiedAt: '09:15 AM', respondedAt: '09:25 AM', responseTime: '10 min', channel: 'Phone', status: 'Active' },
          { id: 'TM-012', name: 'Karthik Rao', role: 'Security Analyst', notifiedAt: '09:15 AM', respondedAt: '09:17 AM', responseTime: '2 min', channel: 'Slack', status: 'Active' },
          { id: 'TM-013', name: 'Ananya Pillai', role: 'App Support Lead', notifiedAt: '09:15 AM', respondedAt: '09:35 AM', responseTime: '20 min', channel: 'Email', status: 'Active' },
          { id: 'TM-014', name: 'Rohan Gupta', role: 'Infrastructure Lead', notifiedAt: '09:15 AM', respondedAt: '-', responseTime: 'N/A', channel: 'Phone', status: 'Joined Late (10:00 AM)' },
          { id: 'TM-015', name: 'Neha Bansal', role: 'Helpdesk Lead', notifiedAt: '09:15 AM', respondedAt: '-', responseTime: 'N/A', channel: 'Phone', status: 'On Leave' },
        ],
      },
    } as any,

    // Response Summary Metrics
    responseSummary: {
      incidentStartTime: '2024-12-03 08:47 AM',
      incidentEndTime: '2024-12-03 09:30 PM',
      totalIncidentDuration: '12h 43min',
      timeToDetection: '0 min (automated)',
      timeToContainment: '1h 28min',
      timeToEradication: '8h 13min',
      timeToRecovery: '12h 43min',
      mttr: '12h 43min',
      totalPersonHours: '156 person-hours',
      estimatedFinancialImpact: '$2.3M',
      dataExfiltrated: '2.3 GB',
      systemsAffected: 15,
      usersImpacted: 847,
    } as any,

    // Step 6: Communication & Toolkit
    internalTemplates: [] as any[],
    regulatoryTemplates: [] as any[],
    memberTemplates: [] as any[],
    toolkitDocuments: [] as any[],

    // Step 7: BCP Invocation - SAMPLE DATA
    bcpInvocations: [
      { id: 'BCP-INV-1', bcpId: 'BCP-001', status: 'Invoked', approvedBy: 'TM-001', invokedAt: '2024-12-03 09:15 AM' },
      { id: 'BCP-INV-2', bcpId: 'BCP-002', status: 'Pending', approvedBy: '', invokedAt: '' },
    ] as any[],
    linkedBIAs: ['BIA-001', 'BIA-002', 'BIA-003'] as string[],
    linkedRAs: [] as string[],
    linkedDRs: ['DR-001', 'DR-002'] as string[],
    linkedIRPs: ['IRP-001', 'IRP-002'] as string[],

    // Step 8: Incident Log & Closure - SAMPLE DATA
    incidentLogTemplate: [
      { id: 'LOG-1', task: 'Initial Assessment & Triage', status: 'Completed', priority: 'High', assignedTo: 'TM-003', dueDate: '2024-12-03 09:30 AM', estimatedCost: '', communicationMedia: 'MS Teams' },
      { id: 'LOG-2', task: 'Network Isolation & Containment', status: 'Completed', priority: 'High', assignedTo: 'TM-010', dueDate: '2024-12-03 10:00 AM', estimatedCost: '', communicationMedia: 'War Room' },
      { id: 'LOG-3', task: 'Forensic Evidence Collection', status: 'In Progress', priority: 'High', assignedTo: 'TM-012', dueDate: '2024-12-03 12:00 PM', estimatedCost: '$15,000', communicationMedia: 'Email' },
      { id: 'LOG-4', task: 'Stakeholder Communications', status: 'In Progress', priority: 'Medium', assignedTo: 'TM-004', dueDate: '2024-12-03 11:00 AM', estimatedCost: '', communicationMedia: 'Email + Phone' },
      { id: 'LOG-5', task: 'System Recovery from Backup', status: 'Pending', priority: 'High', assignedTo: 'TM-011', dueDate: '2024-12-03 06:00 PM', estimatedCost: '$50,000', communicationMedia: 'War Room' },
      { id: 'LOG-6', task: 'SEBI Regulatory Filing', status: 'Pending', priority: 'High', assignedTo: 'TM-006', dueDate: '2024-12-03 03:00 PM', estimatedCost: '', communicationMedia: 'SEBI Portal' },
    ] as any[],
    closureChecklist: [
      { id: 'CLOSE-1', item: 'All systems restored to normal operation', completed: true, completedBy: 'TM-011', completedAt: '2024-12-03 08:00 PM', evidence: [{ name: 'System Health Report', type: 'Document', url: '/docs/system-health-report.pdf' }] },
      { id: 'CLOSE-2', item: 'Incident documentation completed', completed: true, completedBy: 'TM-003', completedAt: '2024-12-04 10:00 AM', evidence: [{ name: 'Incident Timeline', type: 'Document', url: '/docs/incident-timeline.pdf' }, { name: 'Forensic Report', type: 'Report', url: '/docs/forensic-report.pdf' }] },
      { id: 'CLOSE-3', item: 'Stakeholders notified of resolution', completed: true, completedBy: 'TM-004', completedAt: '2024-12-04 11:00 AM', evidence: [{ name: 'Communication Log', type: 'Email', url: '' }] },
      { id: 'CLOSE-4', item: 'Post-incident review scheduled', completed: true, completedBy: 'TM-001', completedAt: '2024-12-04 02:00 PM', evidence: [{ name: 'Meeting Invite', type: 'Email', url: '' }] },
      { id: 'CLOSE-5', item: 'Lessons learned documented', completed: false, completedBy: '', completedAt: '', evidence: [] },
      { id: 'CLOSE-6', item: 'Regulatory reports filed (SEBI, CERT-In)', completed: true, completedBy: 'TM-006', completedAt: '2024-12-03 02:45 PM', evidence: [{ name: 'SEBI Filing Confirmation', type: 'Document', url: '' }, { name: 'CERT-In Acknowledgement', type: 'Document', url: '' }] },
    ] as any[],
  });

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f3f4f6',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Calculate how many pages we need
      const scaledHeight = imgHeight * ratio;
      const pageHeight = pdfHeight - 20; // Leave margin
      let heightLeft = scaledHeight;
      let position = 10;
      let page = 1;

      // Add first page
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
        heightLeft -= pageHeight;
        page++;
      }

      // Add header to each page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Crisis Management Report - ${formData.name || 'Untitled'} | Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });
      }

      pdf.save(`Crisis-Report-${formData.name?.replace(/\s+/g, '-') || 'Untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log('Saving playbook:', formData);
    // TODO: API call to save
  };

  // Calculate Invocation Advisor Score
  const calculateInvocationScore = (alert: any) => {
    const breakdown: { criterion: string; score: number; maxScore: number; detail: string }[] = [];

    // 1. Alert Severity (25 points max)
    const severityScores = { CRITICAL: 25, HIGH: 19, MEDIUM: 12, LOW: 6 };
    const severityScore = severityScores[alert.severity as keyof typeof severityScores] || 0;
    breakdown.push({
      criterion: 'Alert Severity',
      score: severityScore,
      maxScore: 25,
      detail: `${ALERT_SEVERITY[alert.severity as keyof typeof ALERT_SEVERITY]?.label} priority alert from ${alert.source}`,
    });

    // 2. Affected Asset Criticality (25 points max)
    const affectedHardware = mockHardware.filter(h => alert.affectedAssets?.includes(h.id));
    const affectedServices = mockITServices.filter(s => alert.affectedServices?.includes(s.id));
    const allAffected = [...affectedHardware, ...affectedServices];
    const criticalCount = allAffected.filter(a => a.criticality === 'Critical').length;
    const highCount = allAffected.filter(a => a.criticality === 'High').length;
    const assetScore = Math.min(25, criticalCount * 12 + highCount * 5);
    const assetNames = allAffected.slice(0, 3).map(a => a.name).join(', ');
    breakdown.push({
      criterion: 'Asset Criticality',
      score: assetScore,
      maxScore: 25,
      detail: criticalCount > 0 ? `${criticalCount} Tier 1 assets: ${assetNames}` : `${allAffected.length} assets affected`,
    });

    // 3. RTO Breach Risk (20 points max)
    // Check if affected services have short RTOs
    const affectedBIAs = mockBIAs.filter(b =>
      alert.affectedServices?.some((s: string) => b.name.toLowerCase().includes('trading') || b.name.toLowerCase().includes('market'))
    );
    const hasShortRTO = affectedBIAs.some(b => b.rto.includes('min'));
    const rtoScore = hasShortRTO ? 20 : (affectedBIAs.length > 0 ? 10 : 0);
    breakdown.push({
      criterion: 'RTO Breach Risk',
      score: rtoScore,
      maxScore: 20,
      detail: hasShortRTO ? `Critical RTO: ${affectedBIAs[0]?.rto} recovery window` : 'Within recovery tolerance',
    });

    // 4. Dependency Impact (15 points max)
    const dependencyCount = (alert.affectedAssets?.length || 0) + (alert.affectedServices?.length || 0);
    const dependencyScore = Math.min(15, dependencyCount * 3);
    breakdown.push({
      criterion: 'Dependency Impact',
      score: dependencyScore,
      maxScore: 15,
      detail: `${dependencyCount} systems/services in impact chain`,
    });

    // 5. Regulatory Trigger (15 points max)
    const isRegulatory = alert.source === 'SIEM' ||
      alert.suggestedCategory === 'DATA_BREACH' ||
      alert.severity === 'CRITICAL' ||
      alert.title.toLowerCase().includes('trading') ||
      alert.title.toLowerCase().includes('data');
    const regulatoryScore = isRegulatory ? 15 : (alert.severity === 'HIGH' ? 8 : 0);
    breakdown.push({
      criterion: 'Regulatory Trigger',
      score: regulatoryScore,
      maxScore: 15,
      detail: isRegulatory ? 'SEBI reporting required within 30 min' : 'Standard monitoring',
    });

    const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0);
    const recommendation: 'full' | 'partial' | 'none' =
      totalScore >= 80 ? 'full' : (totalScore >= 50 ? 'partial' : 'none');

    return { score: totalScore, recommendation, breakdown, suggestedBCPs: alert.suggestedBCPs || [] };
  };

  // Import alert data into the crisis form
  const handleImportAlert = (alert: any) => {
    // Calculate invocation advisor
    const advisorResult = calculateInvocationScore(alert);

    // Set the invocation decision based on advisor recommendation
    const incidentDecision = advisorResult.recommendation === 'full' ? 'bcp-invoked' :
      (advisorResult.recommendation === 'partial' ? 'partial' : 'not-invoked');

    // Auto-populate form fields based on alert data
    setFormData(prev => ({
      ...prev,
      category: alert.suggestedCategory || prev.category,
      severity: alert.suggestedSeverity || prev.severity,
      name: `${alert.title} - Response Plan`,
      description: alert.description + (alert.indicators ? '\n\nIndicators:\n• ' + alert.indicators.join('\n• ') : ''),
      selectedHardware: [...new Set([...prev.selectedHardware, ...(alert.affectedAssets || [])])],
      selectedITServices: [...new Set([...prev.selectedITServices, ...(alert.affectedServices || [])])],
      selectedLocations: [...new Set([...prev.selectedLocations, ...(alert.affectedLocations || [])])],
      incidentDecision,
      invokedBCPsInClassification: [...new Set([...prev.invokedBCPsInClassification, ...(alert.suggestedBCPs || [])])],
    }));

    setSelectedAlert(alert);

    // Show the Invocation Advisor panel
    setInvocationAdvisor({
      show: true,
      alert,
      score: advisorResult.score,
      recommendation: advisorResult.recommendation,
      breakdown: advisorResult.breakdown,
      suggestedBCPs: advisorResult.suggestedBCPs,
    });
  };

  // Accept advisor recommendation
  const handleAcceptAdvisorRecommendation = () => {
    if (!invocationAdvisor) return;
    // Already applied in handleImportAlert, just close the panel
    setInvocationAdvisor(null);
  };

  // Override advisor recommendation
  const handleOverrideRecommendation = (newDecision: 'bcp-invoked' | 'partial' | 'not-invoked') => {
    setFormData(prev => ({ ...prev, incidentDecision: newDecision }));
    setInvocationAdvisor(null);
  };

  // Get filtered alerts
  const getFilteredAlerts = () => {
    return allMonitoringAlerts.filter(alert =>
      alertFilters.sources.includes(alert.source) &&
      alertFilters.severities.includes(alert.severity)
    ).sort((a, b) => {
      const severityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
      return (severityOrder[a.severity as keyof typeof severityOrder] || 5) - (severityOrder[b.severity as keyof typeof severityOrder] || 5);
    });
  };

  // Format timestamp
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Time ago
  const timeAgo = (ts: string) => {
    const now = new Date();
    const then = new Date(ts);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  // Step 1: Classification (Enhanced with Incident Type & Decision)
  const renderClassificationStep = () => (
    <div className="space-y-5">
      {/* Detection & Monitoring Integration Panel - Enterprise Grade */}
      <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
        {/* Panel Header */}
        <div
          className="px-4 py-3 bg-gray-900 flex items-center justify-between cursor-pointer"
          onClick={() => setShowDetectionPanel(!showDetectionPanel)}
        >
          <div className="flex items-center gap-3">
            <SignalIcon className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-white">Incident Detection Feed</h3>
              <p className="text-[10px] text-gray-400">Integrated monitoring from SIEM, APM, ITSM, Network</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {getFilteredAlerts().filter(a => a.severity === 'CRITICAL').length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-red-400 font-medium">
                  {getFilteredAlerts().filter(a => a.severity === 'CRITICAL').length} Critical
                </span>
              </div>
            )}
            <span className="text-[11px] text-gray-500">{getFilteredAlerts().length} alerts</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${showDetectionPanel ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Panel Content */}
        {showDetectionPanel && (
          <div>
            {/* Source Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                <button
                  onClick={() => setActiveAlertSource(null)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    activeAlertSource === null
                      ? 'border-gray-900 text-gray-900 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Sources
                  <span className="ml-1.5 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">
                    {allMonitoringAlerts.length}
                  </span>
                </button>
                {(['SIEM', 'APM', 'ITSM', 'NETWORK'] as const).map(source => {
                  const count = allMonitoringAlerts.filter(a => a.source === source).length;
                  const hasCritical = allMonitoringAlerts.filter(a => a.source === source && a.severity === 'CRITICAL').length > 0;
                  return (
                    <button
                      key={source}
                      onClick={() => setActiveAlertSource(activeAlertSource === source ? null : source)}
                      className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeAlertSource === source
                          ? 'border-gray-900 text-gray-900 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {hasCritical && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                      {ALERT_SOURCES[source].label}
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Priority:</span>
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => {
                      const newSeverities = alertFilters.severities.includes(sev)
                        ? alertFilters.severities.filter(s => s !== sev)
                        : [...alertFilters.severities, sev];
                      setAlertFilters({ ...alertFilters, severities: newSeverities });
                    }}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all border ${
                      alertFilters.severities.includes(sev)
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {ALERT_SEVERITY[sev].label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-gray-400">
                Showing {getFilteredAlerts().filter(a => !activeAlertSource || a.source === activeAlertSource).length} alerts
              </span>
            </div>

            {/* Alert Table */}
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-16">Priority</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-16">Source</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Alert Details</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-24">Time</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-20">Impact</th>
                    <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getFilteredAlerts()
                    .filter(alert => !activeAlertSource || alert.source === activeAlertSource)
                    .map(alert => {
                      const severity = ALERT_SEVERITY[alert.severity as keyof typeof ALERT_SEVERITY];
                      const source = ALERT_SOURCES[alert.source as keyof typeof ALERT_SOURCES];
                      const isSelected = selectedAlert?.id === alert.id;

                      return (
                        <tr
                          key={alert.id}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedAlert(isSelected ? null : alert)}
                        >
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center justify-center w-7 h-5 text-[10px] font-bold rounded ${severity?.color} text-white`}>
                              {severity?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                              {source?.abbr}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 truncate max-w-md">{alert.title}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-md mt-0.5">{alert.source_system}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            <p className="text-[11px]">{formatTimestamp(alert.timestamp)}</p>
                            <p className="text-[10px] text-gray-400">{timeAgo(alert.timestamp)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {(alert.affectedAssets?.length || 0) + (alert.affectedServices?.length || 0) > 0 && (
                                <span className="text-[10px] text-gray-600">
                                  {(alert.affectedAssets?.length || 0) + (alert.affectedServices?.length || 0)} assets
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImportAlert(alert);
                              }}
                              className="px-2.5 py-1 text-[10px] font-medium rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                            >
                              Import
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {getFilteredAlerts().filter(a => !activeAlertSource || a.source === activeAlertSource).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No alerts match current filters</p>
                </div>
              )}
            </div>

            {/* Expanded Alert Details */}
            {selectedAlert && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${ALERT_SEVERITY[selectedAlert.severity as keyof typeof ALERT_SEVERITY]?.color} text-white`}>
                        {ALERT_SEVERITY[selectedAlert.severity as keyof typeof ALERT_SEVERITY]?.label}
                      </span>
                      <span className="text-xs font-medium text-gray-900">{selectedAlert.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600">{selectedAlert.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 text-[10px]">
                  <div>
                    <span className="text-gray-500 uppercase tracking-wide">Source System</span>
                    <p className="font-medium text-gray-800 mt-0.5">{selectedAlert.source_system}</p>
                  </div>
                  {selectedAlert.correlation_id && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-wide">Correlation ID</span>
                      <p className="font-medium text-gray-800 mt-0.5 font-mono">{selectedAlert.correlation_id}</p>
                    </div>
                  )}
                  {selectedAlert.ticket_number && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-wide">Ticket</span>
                      <p className="font-medium text-gray-800 mt-0.5">{selectedAlert.ticket_number}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 uppercase tracking-wide">Suggested Category</span>
                    <p className="font-medium text-gray-800 mt-0.5">
                      {PLAYBOOK_CATEGORIES.find(c => c.value === selectedAlert.suggestedCategory)?.label}
                    </p>
                  </div>
                </div>

                {/* Indicators */}
                {selectedAlert.indicators && (
                  <div className="mt-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Threat Indicators</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedAlert.indicators.map((ind: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {selectedAlert.metrics && (
                  <div className="mt-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Performance Metrics</span>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {Object.entries(selectedAlert.metrics).map(([key, value]) => (
                        <div key={key} className="text-[10px]">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="font-medium text-gray-800">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MITRE */}
                {selectedAlert.mitre_tactics && (
                  <div className="mt-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">MITRE ATT&CK</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedAlert.mitre_tactics.map((tactic: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded">
                          {tactic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Import Summary */}
                <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-[11px] font-medium text-gray-700">
                        Import will auto-populate: Category, Severity, {(selectedAlert.affectedAssets?.length || 0) + (selectedAlert.affectedServices?.length || 0)} affected assets, {selectedAlert.suggestedBCPs?.length || 0} BCPs
                      </span>
                    </div>
                    <button
                      onClick={() => handleImportAlert(selectedAlert)}
                      className="px-3 py-1.5 text-[11px] font-medium rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                    >
                      Import to Crisis Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invocation Advisor Panel */}
      {invocationAdvisor?.show && (
        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
          {/* Advisor Header */}
          <div className="px-4 py-3 bg-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                invocationAdvisor.recommendation === 'full' ? 'bg-red-600' :
                invocationAdvisor.recommendation === 'partial' ? 'bg-orange-500' : 'bg-gray-600'
              }`}>
                <span className="text-lg font-bold text-white">{invocationAdvisor.score}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Invocation Advisor</h3>
                <p className="text-[10px] text-gray-400">Automated BCP activation recommendation</p>
              </div>
            </div>
            <button
              onClick={() => setInvocationAdvisor(null)}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Advisor Content */}
          <div className="p-4">
            {/* Recommendation Banner */}
            <div className={`p-4 rounded-lg mb-4 ${
              invocationAdvisor.recommendation === 'full' ? 'bg-red-50 border border-red-200' :
              invocationAdvisor.recommendation === 'partial' ? 'bg-orange-50 border border-orange-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    invocationAdvisor.recommendation === 'full' ? 'bg-red-100' :
                    invocationAdvisor.recommendation === 'partial' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <ShieldExclamationIcon className={`h-6 w-6 ${
                      invocationAdvisor.recommendation === 'full' ? 'text-red-600' :
                      invocationAdvisor.recommendation === 'partial' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${
                      invocationAdvisor.recommendation === 'full' ? 'text-red-900' :
                      invocationAdvisor.recommendation === 'partial' ? 'text-orange-900' : 'text-gray-900'
                    }`}>
                      {invocationAdvisor.recommendation === 'full' ? 'FULL BCP INVOCATION' :
                       invocationAdvisor.recommendation === 'partial' ? 'PARTIAL ACTIVATION' : 'MONITORING ONLY'}
                    </p>
                    <p className={`text-xs ${
                      invocationAdvisor.recommendation === 'full' ? 'text-red-700' :
                      invocationAdvisor.recommendation === 'partial' ? 'text-orange-700' : 'text-gray-700'
                    }`}>
                      Score: {invocationAdvisor.score}/100 — {
                        invocationAdvisor.recommendation === 'full' ? 'Critical threshold exceeded (≥80)' :
                        invocationAdvisor.recommendation === 'partial' ? 'Elevated risk level (50-79)' :
                        'Within normal parameters (<50)'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Confidence</p>
                  <p className="text-lg font-bold text-gray-900">{Math.min(95, 70 + invocationAdvisor.score / 4)}%</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Score Breakdown</h4>
              <div className="space-y-2">
                {invocationAdvisor.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-32 text-xs text-gray-600">{item.criterion}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.score >= item.maxScore * 0.8 ? 'bg-red-500' :
                            item.score >= item.maxScore * 0.5 ? 'bg-orange-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right text-xs font-medium text-gray-800">
                      {item.score}/{item.maxScore}
                    </div>
                    <div className="w-48 text-[10px] text-gray-500 truncate" title={item.detail}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested BCPs */}
            {invocationAdvisor.suggestedBCPs.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Suggested BCPs for Activation</h4>
                <div className="flex flex-wrap gap-2">
                  {invocationAdvisor.suggestedBCPs.map((bcpId: string) => {
                    const bcp = mockBCPs.find(b => b.id === bcpId);
                    return bcp ? (
                      <span key={bcpId} className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-800">
                        {bcp.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Override recommendation:</span>
                {invocationAdvisor.recommendation !== 'full' && (
                  <button
                    onClick={() => handleOverrideRecommendation('bcp-invoked')}
                    className="px-2 py-1 text-[10px] font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Full Invoke
                  </button>
                )}
                {invocationAdvisor.recommendation !== 'partial' && (
                  <button
                    onClick={() => handleOverrideRecommendation('partial')}
                    className="px-2 py-1 text-[10px] font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Partial
                  </button>
                )}
                {invocationAdvisor.recommendation !== 'none' && (
                  <button
                    onClick={() => handleOverrideRecommendation('not-invoked')}
                    className="px-2 py-1 text-[10px] font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Not Invoked
                  </button>
                )}
              </div>
              <button
                onClick={handleAcceptAdvisorRecommendation}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  invocationAdvisor.recommendation === 'full' ? 'bg-red-600 hover:bg-red-700 text-white' :
                  invocationAdvisor.recommendation === 'partial' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                  'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Accept Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Classification Header - Key Decision Dropdowns */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-red-900/50 rounded-lg p-5 text-white border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <FlagIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base font-bold">Incident Classification</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">Incident Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {INCIDENT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateFormData('incidentType', type.value)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    formData.incidentType === type.value
                      ? 'bg-red-600 border-red-500 ring-2 ring-red-400/50 shadow-lg shadow-red-600/20'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <p className="text-sm font-bold">{type.label}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">Incident Decision *</label>
            <div className="space-y-2">
              {INCIDENT_DECISIONS.map(dec => (
                <button
                  key={dec.value}
                  type="button"
                  onClick={() => updateFormData('incidentDecision', dec.value)}
                  className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 border ${
                    formData.incidentDecision === dec.value
                      ? dec.value === 'bcp-invoked'
                        ? 'bg-red-600 border-red-500 ring-2 ring-red-400/50 shadow-lg shadow-red-600/20'
                        : dec.value === 'partial'
                          ? 'bg-orange-600 border-orange-500 ring-2 ring-orange-400/50 shadow-lg'
                          : 'bg-gray-700 border-gray-600 ring-2 ring-gray-500/50'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.incidentDecision === dec.value ? 'border-white' : 'border-gray-500'
                  }`}>
                    {formData.incidentDecision === dec.value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{dec.label}</p>
                    <p className="text-[10px] opacity-75">{dec.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BCP Selection Panel - Shows when BCP Invoked or Partial Activation */}
      {(formData.incidentDecision === 'bcp-invoked' || formData.incidentDecision === 'partial') && (
        <div className={`rounded-lg p-5 text-white animate-in slide-in-from-top-2 duration-300 border ${
          formData.incidentDecision === 'bcp-invoked'
            ? 'bg-gradient-to-r from-red-900 to-red-800 border-red-700'
            : 'bg-gradient-to-r from-orange-900 to-orange-800 border-orange-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5 text-white" />
              <h3 className="text-base font-bold">
                {formData.incidentDecision === 'bcp-invoked' ? 'BCPs to Invoke' : 'Partial BCP Activation'}
              </h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              formData.incidentDecision === 'bcp-invoked' ? 'bg-red-600' : 'bg-orange-600'
            }`}>
              {formData.invokedBCPsInClassification?.length || 0} selected
            </span>
          </div>
          <p className="text-sm text-red-100 mb-4">
            {formData.incidentDecision === 'bcp-invoked'
              ? 'Select the Business Continuity Plans that need to be fully invoked for this incident:'
              : 'Select the BCPs that will be partially activated:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {mockBCPs.map(bcp => {
              const isSelected = formData.invokedBCPsInClassification?.includes(bcp.id);
              return (
                <label
                  key={bcp.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const current = formData.invokedBCPsInClassification || [];
                      const updated = e.target.checked
                        ? [...current, bcp.id]
                        : current.filter((id: string) => id !== bcp.id);
                      updateFormData('invokedBCPsInClassification', updated);
                    }}
                    className="h-4 w-4 mt-0.5 text-red-600 rounded border-gray-300 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-white'}`}>{bcp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${isSelected ? 'text-gray-500' : 'text-red-200'}`}>{bcp.department}</span>
                      <span className={`text-xs ${isSelected ? 'text-gray-400' : 'text-red-300'}`}>•</span>
                      <span className={`text-xs ${isSelected ? 'text-gray-500' : 'text-red-200'}`}>RTO: {bcp.rto}</span>
                    </div>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      isSelected
                        ? (bcp.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')
                        : (bcp.status === 'Approved' ? 'bg-green-500/30 text-green-100' : 'bg-yellow-500/30 text-yellow-100')
                    }`}>
                      {bcp.status}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Crisis Management Plan Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="e.g., Cyber Attack Response Plan - Ransomware"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 appearance-none bg-white"
          >
            <option value="">Select category...</option>
            {PLAYBOOK_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Estimated Duration</label>
          <input
            type="text"
            value={formData.estimatedDuration}
            onChange={(e) => updateFormData('estimatedDuration', e.target.value)}
            placeholder="e.g., 4-8 hours"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">Severity Level *</label>
        <div className="grid grid-cols-4 gap-3">
          {SEVERITY_OPTIONS.map(sev => (
            <button
              key={sev.value}
              type="button"
              onClick={() => updateFormData('severity', sev.value)}
              className={`p-3 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                formData.severity === sev.value
                  ? `${sev.color} shadow-sm`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <p className="text-sm font-semibold">{sev.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{sev.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={3}
          placeholder="Describe the purpose and scope of this crisis management plan..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      {/* Owner & Reviewers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Plan Owner *</label>
          <select
            value={formData.owner}
            onChange={(e) => updateFormData('owner', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 appearance-none bg-white"
          >
            <option value="">Select owner...</option>
            {mockTeamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Reviewers</label>
          <select
            multiple
            value={formData.reviewers}
            onChange={(e) => updateFormData('reviewers', Array.from(e.target.selectedOptions, o => o.value))}
            className="w-full h-[72px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            {mockTeamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
            ))}
          </select>
          <p className="text-[9px] text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>
    </div>
  );

  // Step 2: Enhanced Scope Configuration with Sub-tabs
  const renderScopeStep = () => {
    const renderScopeContent = () => {
      switch (activeScopeTab) {
        case 'data-assets':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Data & Information Assets</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Critical documents, databases, and information repositories</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{formData.selectedVitalRecords.length} selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
                {mockVitalRecords.map(record => (
                  <label key={record.id} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.selectedVitalRecords.includes(record.id)
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedVitalRecords.includes(record.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedVitalRecords, record.id]
                          : formData.selectedVitalRecords.filter(id => id !== record.id);
                        updateFormData('selectedVitalRecords', updated);
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-4 w-4 text-blue-500" />
                        <p className="text-sm font-medium text-gray-900">{record.name}</p>
                        <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                          record.criticality === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{record.criticality}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{record.type} • {record.location}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'it-services':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Technical Services & Applications</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedITServices.length} selected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockITServices.map(service => (
                  <label key={service.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedITServices.includes(service.id)
                      ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedITServices.includes(service.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedITServices, service.id]
                          : formData.selectedITServices.filter(id => id !== service.id);
                        updateFormData('selectedITServices', updated);
                      }}
                      className="h-4 w-4 text-red-600 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <ServerIcon className="h-4 w-4 text-red-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                      </div>
                      <p className="text-[11px] text-gray-500">{service.type} • {service.vendor}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'hardware':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Hardware & Equipment</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedHardware.length} selected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockHardware.map(hw => (
                  <label key={hw.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedHardware.includes(hw.id)
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedHardware.includes(hw.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedHardware, hw.id]
                          : formData.selectedHardware.filter(id => id !== hw.id);
                        updateFormData('selectedHardware', updated);
                      }}
                      className="h-4 w-4 text-orange-600 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <ComputerDesktopIcon className="h-4 w-4 text-orange-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">{hw.name}</p>
                        <span className="text-[10px] text-gray-500">×{hw.quantity}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">{hw.location}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'suppliers':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Critical Suppliers & Vendors</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedSuppliers.length} selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockSuppliers.map(supplier => (
                  <label key={supplier.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedSuppliers.includes(supplier.id)
                      ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedSuppliers.includes(supplier.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedSuppliers, supplier.id]
                          : formData.selectedSuppliers.filter(id => id !== supplier.id);
                        updateFormData('selectedSuppliers', updated);
                      }}
                      className="h-4 w-4 text-green-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-4 w-4 text-green-500" />
                        <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-gray-100 text-gray-600">{supplier.type}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Contact: {supplier.contact} • SLA: {supplier.sla}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'telephony':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Telephony & Communication Systems</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedTelephony.length} selected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockTelephony.map(tel => (
                  <label key={tel.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedTelephony.includes(tel.id)
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedTelephony.includes(tel.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedTelephony, tel.id]
                          : formData.selectedTelephony.filter(id => id !== tel.id);
                        updateFormData('selectedTelephony', updated);
                      }}
                      className="h-4 w-4 text-orange-600 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-orange-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">{tel.name}</p>
                      </div>
                      <p className="text-[11px] text-gray-500">{tel.provider} • {tel.lines} lines</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'locations':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Locations & Facilities</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedLocations.length} selected</span>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockLocations.map(loc => (
                  <label key={loc.id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedLocations.includes(loc.id)
                      ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedLocations.includes(loc.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedLocations, loc.id]
                          : formData.selectedLocations.filter(id => id !== loc.id);
                        updateFormData('selectedLocations', updated);
                      }}
                      className="h-4 w-4 text-yellow-600 rounded border-gray-300 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm font-medium text-gray-900">{loc.name}</p>
                        {loc.isPrimary && <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-gray-900 text-white">Primary</span>}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{loc.address}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{loc.type} • Capacity: {loc.capacity}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        case 'org-areas':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700">Organization Areas & Departments</h4>
                <span className="text-[10px] text-gray-500">{formData.selectedOrgAreas.length} selected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
                {mockOrgAreas.map(org => (
                  <label key={org.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.selectedOrgAreas.includes(org.id)
                      ? 'border-gray-800 bg-gray-100 ring-1 ring-gray-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedOrgAreas.includes(org.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.selectedOrgAreas, org.id]
                          : formData.selectedOrgAreas.filter(id => id !== org.id);
                        updateFormData('selectedOrgAreas', updated);
                      }}
                      className="h-4 w-4 text-gray-900 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-700" />
                        <p className="text-sm font-medium text-gray-900 truncate">{org.name}</p>
                        {org.critical && <span className="px-1 py-0.5 text-[8px] font-medium rounded bg-red-100 text-red-600">Critical</span>}
                      </div>
                      <p className="text-[11px] text-gray-500">{org.headCount} employees</p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Organization Special Needs</label>
                <textarea
                  value={formData.orgSpecialNeeds}
                  onChange={(e) => updateFormData('orgSpecialNeeds', e.target.value)}
                  rows={2}
                  placeholder="e.g., Regulatory compliance requirements, data protection needs, accessibility requirements..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          );
        case 'irps':
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Incident Response Plans (IRPs)</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Link relevant IRPs that will be activated during this incident</p>
                </div>
                <span className="text-[10px] text-gray-500">{formData.linkedIRPs.length} linked</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {mockIRPs.map(irp => {
                  const isSelected = formData.linkedIRPs.includes(irp.id);
                  return (
                    <label
                      key={irp.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.linkedIRPs, irp.id]
                            : formData.linkedIRPs.filter(id => id !== irp.id);
                          updateFormData('linkedIRPs', updated);
                        }}
                        className="h-4 w-4 text-orange-600 rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="h-4 w-4 text-orange-600" />
                          <p className="text-sm font-medium text-gray-900 truncate">{irp.name}</p>
                          <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                            irp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{irp.status}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[11px] text-gray-500">{irp.type}</p>
                          <span className="text-[10px] text-gray-400">•</span>
                          <p className="text-[11px] text-gray-500">Last tested: {irp.lastTested}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-orange-600">{irp.responseTime}</p>
                        <p className="text-[9px] text-gray-500">Response Time</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {formData.linkedIRPs.length > 0 && (
                <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-white">
                      {formData.linkedIRPs.length} IRP{formData.linkedIRPs.length > 1 ? 's' : ''} Linked
                    </span>
                    <span className="text-[10px] text-gray-400 ml-auto">
                      These will appear in Step 7 (BCP Invocation)
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    };

    // Get selection count for each tab
    const getTabCount = (tabId: string): number => {
      switch (tabId) {
        case 'data-assets': return formData.selectedVitalRecords.length;
        case 'it-services': return formData.selectedITServices.length;
        case 'hardware': return formData.selectedHardware.length;
        case 'suppliers': return formData.selectedSuppliers.length;
        case 'telephony': return formData.selectedTelephony.length;
        case 'locations': return formData.selectedLocations.length;
        case 'org-areas': return formData.selectedOrgAreas.length;
        case 'irps': return formData.linkedIRPs.length;
        default: return 0;
      }
    };

    // Color mappings for tabs
    const getTabColors = (tabId: string) => {
      const colors: Record<string, { active: string; inactive: string; badge: string }> = {
        'data-assets': {
          active: 'bg-blue-600 text-white shadow-lg shadow-blue-200',
          inactive: 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200',
          badge: 'bg-blue-100 text-blue-700'
        },
        'it-services': {
          active: 'bg-red-600 text-white shadow-lg shadow-red-200',
          inactive: 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-200',
          badge: 'bg-red-100 text-red-700'
        },
        'hardware': {
          active: 'bg-orange-600 text-white shadow-lg shadow-orange-200',
          inactive: 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200',
          badge: 'bg-orange-100 text-orange-700'
        },
        'suppliers': {
          active: 'bg-amber-600 text-white shadow-lg shadow-amber-200',
          inactive: 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-gray-200',
          badge: 'bg-amber-100 text-amber-700'
        },
        'telephony': {
          active: 'bg-gray-800 text-white shadow-lg shadow-gray-300',
          inactive: 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200',
          badge: 'bg-gray-200 text-gray-700'
        },
        'locations': {
          active: 'bg-yellow-600 text-white shadow-lg shadow-yellow-200',
          inactive: 'bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200',
          badge: 'bg-yellow-100 text-yellow-700'
        },
        'org-areas': {
          active: 'bg-slate-700 text-white shadow-lg shadow-slate-200',
          inactive: 'bg-white text-gray-600 hover:bg-slate-50 hover:text-slate-700 border border-gray-200',
          badge: 'bg-slate-200 text-slate-700'
        },
        'irps': {
          active: 'bg-orange-600 text-white shadow-lg shadow-orange-200',
          inactive: 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200',
          badge: 'bg-orange-100 text-orange-700'
        },
      };
      return colors[tabId] || colors['data-assets'];
    };

    return (
      <div className="space-y-5">
        {/* Enterprise Tab Switcher */}
        <div className="bg-gray-100 rounded-xl p-1.5">
          <div className="grid grid-cols-4 gap-1.5">
            {SCOPE_TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeScopeTab === tab.id;
              const count = getTabCount(tab.id);
              const colors = getTabColors(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScopeTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive ? colors.active : colors.inactive
                  }`}
                >
                  <TabIcon className={`h-4 w-4 ${isActive ? '' : 'text-gray-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : colors.badge
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[320px] bg-white rounded-lg border border-gray-200 p-4">
          {renderScopeContent()}
        </div>

        {/* Selection Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Scope Summary</h4>
            <span className="text-[11px] text-gray-500">
              {formData.selectedVitalRecords.length + formData.selectedITServices.length +
               formData.selectedHardware.length + formData.selectedSuppliers.length +
               formData.selectedTelephony.length + formData.selectedLocations.length +
               formData.selectedOrgAreas.length + formData.linkedIRPs.length} items selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.selectedVitalRecords.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center gap-1.5">
                <FolderIcon className="h-3.5 w-3.5" />
                {formData.selectedVitalRecords.length} Data Assets
              </span>
            )}
            {formData.selectedITServices.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center gap-1.5">
                <ServerIcon className="h-3.5 w-3.5" />
                {formData.selectedITServices.length} IT Services
              </span>
            )}
            {formData.selectedHardware.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full flex items-center gap-1.5">
                <ComputerDesktopIcon className="h-3.5 w-3.5" />
                {formData.selectedHardware.length} Hardware
              </span>
            )}
            {formData.selectedSuppliers.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full flex items-center gap-1.5">
                <TruckIcon className="h-3.5 w-3.5" />
                {formData.selectedSuppliers.length} Suppliers
              </span>
            )}
            {formData.selectedTelephony.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5" />
                {formData.selectedTelephony.length} Telephony
              </span>
            )}
            {formData.selectedLocations.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1.5">
                <MapPinIcon className="h-3.5 w-3.5" />
                {formData.selectedLocations.length} Locations
              </span>
            )}
            {formData.selectedOrgAreas.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-slate-200 text-slate-700 rounded-full flex items-center gap-1.5">
                <BuildingOfficeIcon className="h-3.5 w-3.5" />
                {formData.selectedOrgAreas.length} Org Areas
              </span>
            )}
            {formData.linkedIRPs.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-orange-600 text-white rounded-full flex items-center gap-1.5">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                {formData.linkedIRPs.length} IRPs
              </span>
            )}
            {formData.selectedVitalRecords.length === 0 && formData.selectedITServices.length === 0 &&
             formData.selectedHardware.length === 0 && formData.selectedSuppliers.length === 0 &&
             formData.selectedTelephony.length === 0 && formData.selectedLocations.length === 0 &&
             formData.selectedOrgAreas.length === 0 && formData.linkedIRPs.length === 0 && (
              <span className="text-sm text-gray-400 italic">No items selected yet — select items from the tabs above</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Management Team (CMT) - Enhanced with L1/L2/L3 Hierarchy
  const renderManagementTeamStep = () => {
    const getMemberById = (id: string) => mockTeamMembers.find(m => m.id === id);

    const RoleCard = ({ role, field, description, required = false, color = 'gray' }: { role: string; field: string; description: string; required?: boolean; color?: string }) => {
      const selectedMember = getMemberById(formData[field as keyof typeof formData] as string);
      const colorClasses: Record<string, string> = {
        gray: 'border-gray-200 bg-gray-50',
        red: 'border-red-200 bg-red-50',
        orange: 'border-orange-200 bg-orange-50',
        amber: 'border-amber-200 bg-amber-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        black: 'border-gray-800 bg-gray-100',
      };

      return (
        <div className={`border-2 rounded-lg p-3 transition-all ${selectedMember ? colorClasses[color] : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">{role}</span>
              {required && <span className="text-red-500 text-xs">*</span>}
            </div>
            {selectedMember && (
              <button
                type="button"
                onClick={() => updateFormData(field, '')}
                className="text-gray-400 hover:text-red-500 p-0.5"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {selectedMember ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                {selectedMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{selectedMember.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{selectedMember.role}</p>
                <p className="text-[10px] text-gray-400">{selectedMember.phone}</p>
              </div>
            </div>
          ) : (
            <select
              value=""
              onChange={(e) => updateFormData(field, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
            >
              <option value="">Select {role}...</option>
              {mockTeamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
              ))}
            </select>
          )}
          <p className="text-[9px] text-gray-400 mt-2">{description}</p>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* CMT Header with Hierarchy Explanation */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserGroupIcon className="h-5 w-5 text-white/80" />
                <h3 className="text-sm font-semibold">Crisis Management Team (CMT) Hierarchy</h3>
              </div>
              <p className="text-[11px] text-gray-300">Define escalation levels for crisis response</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] text-gray-300">L1</span>
              </div>
              <span className="text-gray-600">→</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-[10px] text-gray-300">L2</span>
              </div>
              <span className="text-gray-600">→</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-[10px] text-gray-300">L3</span>
              </div>
            </div>
          </div>
        </div>

        {/* L1 - Executive Leadership (Strategic Decision Making) */}
        <div className="border-l-4 border-red-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded">L1</span>
            <h4 className="text-xs font-semibold text-gray-800">Executive Leadership</h4>
            <span className="text-[10px] text-gray-500">Strategic Decision Making & Crisis Authority</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <RoleCard role="Crisis Commander" field="crisisCommander" description="Ultimate authority, strategic decisions, external liaison with Board/SEBI" required color="red" />
            <RoleCard role="Deputy Commander" field="deputyCommander" description="Succession authority, coordinates cross-functional response" color="red" />
            <RoleCard role="Regulatory Liaison" field="regulatoryLiaison" description="SEBI/RBI/NSE reporting, compliance decisions" color="red" />
          </div>
        </div>

        {/* L2 - Tactical Management (Coordination & Management) */}
        <div className="border-l-4 border-orange-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded">L2</span>
            <h4 className="text-xs font-semibold text-gray-800">Tactical Management</h4>
            <span className="text-[10px] text-gray-500">Coordination, Resource Allocation & Team Direction</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <RoleCard role="Technical Lead" field="technicalLead" description="IT/Security response, coordinates L3 tech teams, system recovery" required color="orange" />
            <RoleCard role="Communications Lead" field="communicationsLead" description="Media, member notifications, internal comms strategy" required color="orange" />
            <RoleCard role="Business Lead" field="businessLead" description="Trading ops continuity, impact assessment, vendor coordination" color="orange" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <RoleCard role="Legal Counsel" field="legalCounsel" description="Legal implications, liability, regulatory filings" color="orange" />
            <RoleCard role="HR Lead" field="hrLead" description="Staff welfare, emergency staffing, union liaison" color="orange" />
            <RoleCard role="Facilities Lead" field="facilitiesLead" description="Physical security, building ops, DR site activation" color="orange" />
          </div>
        </div>

        {/* L3 - Operational Response (Hands-on Technical Execution) */}
        <div className="border-l-4 border-yellow-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-yellow-500 text-gray-900 text-[10px] font-bold rounded">L3</span>
            <h4 className="text-xs font-semibold text-gray-800">Operational Response</h4>
            <span className="text-[10px] text-gray-500">Hands-on Technical Execution & First Responders</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <RoleCard role="Network Engineer" field="l3NetworkEngineer" description="Network infrastructure, connectivity restoration" color="yellow" />
            <RoleCard role="Database Admin" field="l3DatabaseAdmin" description="Database recovery, data integrity verification" color="yellow" />
            <RoleCard role="Security Analyst" field="l3SecurityAnalyst" description="Threat containment, forensics, security monitoring" color="yellow" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <RoleCard role="Application Support" field="l3AppSupport" description="Trading systems, matching engine, order management" color="amber" />
            <RoleCard role="Infrastructure Lead" field="l3InfraLead" description="Servers, storage, backup systems, DR failover" color="amber" />
            <RoleCard role="Helpdesk Lead" field="l3HelpdeskLead" description="Member support, issue logging, status updates" color="amber" />
          </div>
        </div>

        {/* Escalation Path Summary */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Escalation Path</h4>
          <div className="flex items-center gap-2">
            {/* L3 */}
            <div className="flex-1 bg-yellow-900/30 border border-yellow-700 rounded-lg p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 bg-yellow-500 text-gray-900 text-[8px] font-bold rounded">L3</span>
                <span className="text-[10px] font-semibold text-yellow-400">First Response</span>
              </div>
              <p className="text-[9px] text-yellow-500">Detects & contains issue</p>
              <p className="text-[9px] text-gray-500 mt-1">Escalates if: Unresolved in 15min, Impact &gt; threshold</p>
            </div>
            <div className="text-gray-600">→</div>
            {/* L2 */}
            <div className="flex-1 bg-orange-900/30 border border-orange-700 rounded-lg p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-bold rounded">L2</span>
                <span className="text-[10px] font-semibold text-orange-400">Tactical Mgmt</span>
              </div>
              <p className="text-[9px] text-orange-500">Coordinates response teams</p>
              <p className="text-[9px] text-gray-500 mt-1">Escalates if: BCP needed, External impact</p>
            </div>
            <div className="text-gray-600">→</div>
            {/* L1 */}
            <div className="flex-1 bg-red-900/30 border border-red-700 rounded-lg p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded">L1</span>
                <span className="text-[10px] font-semibold text-red-400">Executive Authority</span>
              </div>
              <p className="text-[9px] text-red-500">Strategic decisions</p>
              <p className="text-[9px] text-gray-500 mt-1">Activates: Full BCP, Regulatory reporting</p>
            </div>
          </div>
        </div>

        {/* CMT Summary */}
        <div className="bg-gray-900 rounded-lg p-4 text-white border border-gray-800">
          <h4 className="text-[10px] font-semibold text-red-400 uppercase tracking-wide mb-3">Team Assignment Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded">L1</span>
                <span className="text-[10px] text-gray-400">Executive</span>
              </div>
              <div className="space-y-1">
                {formData.crisisCommander && (
                  <p className="text-[11px] text-white">✓ {getMemberById(formData.crisisCommander)?.name}</p>
                )}
                {formData.deputyCommander && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.deputyCommander)?.name}</p>
                )}
                {formData.regulatoryLiaison && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.regulatoryLiaison)?.name}</p>
                )}
                {!formData.crisisCommander && !formData.deputyCommander && !formData.regulatoryLiaison && (
                  <p className="text-[10px] text-gray-500 italic">Not assigned</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-bold rounded">L2</span>
                <span className="text-[10px] text-gray-400">Tactical</span>
              </div>
              <div className="space-y-1">
                {formData.technicalLead && (
                  <p className="text-[11px] text-white">✓ {getMemberById(formData.technicalLead)?.name}</p>
                )}
                {formData.communicationsLead && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.communicationsLead)?.name}</p>
                )}
                {formData.businessLead && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.businessLead)?.name}</p>
                )}
                {!formData.technicalLead && !formData.communicationsLead && !formData.businessLead && (
                  <p className="text-[10px] text-gray-500 italic">Not assigned</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 bg-yellow-500 text-gray-900 text-[8px] font-bold rounded">L3</span>
                <span className="text-[10px] text-gray-400">Operational</span>
              </div>
              <div className="space-y-1">
                {formData.l3NetworkEngineer && (
                  <p className="text-[11px] text-white">✓ {getMemberById(formData.l3NetworkEngineer)?.name}</p>
                )}
                {formData.l3DatabaseAdmin && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.l3DatabaseAdmin)?.name}</p>
                )}
                {formData.l3SecurityAnalyst && (
                  <p className="text-[11px] text-gray-300">✓ {getMemberById(formData.l3SecurityAnalyst)?.name}</p>
                )}
                {!formData.l3NetworkEngineer && !formData.l3DatabaseAdmin && !formData.l3SecurityAnalyst && (
                  <p className="text-[10px] text-gray-500 italic">Not assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call Tree Integration Section */}
        <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-red-400" />
              <h4 className="text-sm font-semibold text-white">Call Tree Integration</h4>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-600 text-white">
                {formData.linkedCallTrees.length} linked
              </span>
            </div>
            <a
              href="/call-trees"
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              Manage Call Trees
            </a>
          </div>
          <div className="p-4 bg-gray-50">
            <p className="text-xs text-gray-600 mb-3">
              Link existing call trees from the Call Tree module. These will be activated during crisis response.
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {mockCallTrees.map(ct => {
                const isLinked = formData.linkedCallTrees.includes(ct.id);
                return (
                  <label
                    key={ct.id}
                    className={`flex items-center gap-4 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      isLinked
                        ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isLinked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.linkedCallTrees, ct.id]
                          : formData.linkedCallTrees.filter(id => id !== ct.id);
                        updateFormData('linkedCallTrees', updated);
                      }}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{ct.name}</p>
                        <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                          ct.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{ct.status}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{ct.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{ct.members}</p>
                        <p className="text-[9px] text-gray-500">Members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">L{ct.levels}</p>
                        <p className="text-[9px] text-gray-500">Levels</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-bold ${ct.responseRate >= 95 ? 'text-green-600' : ct.responseRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {ct.responseRate}%
                        </p>
                        <p className="text-[9px] text-gray-500">Response</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{ct.avgResponseTime}</p>
                        <p className="text-[9px] text-gray-500">Avg Time</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            {formData.linkedCallTrees.length > 0 && (
              <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-white">
                      {formData.linkedCallTrees.length} Call Tree{formData.linkedCallTrees.length > 1 ? 's' : ''} Linked
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-gray-300">
                      Total Members: {mockCallTrees.filter(ct => formData.linkedCallTrees.includes(ct.id)).reduce((sum, ct) => sum + ct.members, 0)}
                    </span>
                    <span className="text-gray-300">
                      Avg Response: {(mockCallTrees.filter(ct => formData.linkedCallTrees.includes(ct.id)).reduce((sum, ct) => sum + ct.responseRate, 0) / formData.linkedCallTrees.length).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Response Teams (IRT & CRT)
  const renderResponseTeamsStep = () => {
    const addTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam') => {
      const teams = formData[type];
      const newId = `${type === 'incidentResponseTeam' ? 'IRT' : 'CRT'}-${teams.length + 1}`;
      updateFormData(type, [...teams, { id: newId, teamName: '', leader: '', members: [], role: '' }]);
    };

    const updateTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam', index: number, field: string, value: any) => {
      const teams = [...formData[type]];
      teams[index] = { ...teams[index], [field]: value };
      updateFormData(type, teams);
    };

    const removeTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam', index: number) => {
      const teams = formData[type].filter((_: any, i: number) => i !== index);
      updateFormData(type, teams.length > 0 ? teams : [{ id: `${type === 'incidentResponseTeam' ? 'IRT' : 'CRT'}-1`, teamName: '', leader: '', members: [], role: '' }]);
    };

    const TeamTable = ({ title, type, color }: { title: string; type: 'incidentResponseTeam' | 'crisisResponseTeam'; color: string }) => (
      <div className={`border-2 rounded-lg overflow-hidden ${color === 'red' ? 'border-red-300' : 'border-orange-300'}`}>
        <div className={`px-4 py-3 flex items-center justify-between ${color === 'red' ? 'bg-gradient-to-r from-gray-900 to-red-900' : 'bg-gradient-to-r from-gray-900 to-orange-900'}`}>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-white" />
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${color === 'red' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'}`}>
              {formData[type].length} {formData[type].length === 1 ? 'team' : 'teams'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => addTeam(type)}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
              color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            <PlusIcon className="h-3 w-3" /> Add Team
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/4">Team Name</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/5">Team Leader</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/4">Members</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/4">Role/Responsibility</th>
                <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formData[type].map((team: any, idx: number) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={team.teamName}
                      onChange={(e) => updateTeam(type, idx, 'teamName', e.target.value)}
                      placeholder="e.g., IT Security Response"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={team.leader}
                      onChange={(e) => updateTeam(type, idx, 'leader', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none bg-white"
                    >
                      <option value="">Select leader...</option>
                      {mockTeamMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      multiple
                      value={team.members}
                      onChange={(e) => updateTeam(type, idx, 'members', Array.from(e.target.selectedOptions, o => o.value))}
                      className="w-full h-16 px-2 py-1 text-[11px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      {mockTeamMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={team.role}
                      onChange={(e) => updateTeam(type, idx, 'role', e.target.value)}
                      placeholder="e.g., Technical Investigation"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeTeam(type, idx)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div className="space-y-5">
        <TeamTable title="Incident Response Team (IRT)" type="incidentResponseTeam" color="red" />
        <TeamTable title="Crisis Response Team (CRT)" type="crisisResponseTeam" color="orange" />
      </div>
    );
  };

  // Step 4: Response Phases
  const renderPhasesStep = () => {
    const linkedIRPsData = mockIRPs.filter(irp => formData.linkedIRPs.includes(irp.id));
    const hasLinkedIRPs = linkedIRPsData.length > 0;
    const hasExistingPhases = formData.phases.some(p => p.steps && p.steps.length > 0);

    // Toggle IRP selection (add to linkedIRPs)
    const toggleIRPSelection = (irpId: string) => {
      if (formData.linkedIRPs.includes(irpId)) {
        updateFormData('linkedIRPs', formData.linkedIRPs.filter((id: string) => id !== irpId));
      } else {
        updateFormData('linkedIRPs', [...formData.linkedIRPs, irpId]);
      }
    };

    // Import from single IRP (replace all)
    const importFromIRP = (irpId: string) => {
      const irp = mockIRPs.find(i => i.id === irpId);
      if (irp && irp.phases) {
        updateFormData('phases', irp.phases.map((p: any) => ({
          name: p.name,
          duration: p.duration,
          steps: p.steps.map((s: any) => ({ title: s.title, required: s.required }))
        })));
      }
    };

    // Import and merge from multiple IRPs
    const importFromMultipleIRPs = () => {
      if (linkedIRPsData.length === 0) return;

      // Use first IRP as base structure
      const primaryIRP = linkedIRPsData[0];
      const otherIRPs = linkedIRPsData.slice(1);

      if (!primaryIRP.phases) return;

      // Start with primary IRP phases
      const mergedPhases = primaryIRP.phases.map((p: any) => ({
        name: p.name,
        duration: p.duration,
        steps: p.steps.map((s: any) => ({ title: s.title, required: s.required, source: primaryIRP.name }))
      }));

      // Merge steps from other IRPs into matching phases
      otherIRPs.forEach((irp: any) => {
        if (!irp.phases) return;
        irp.phases.forEach((irpPhase: any) => {
          // Find matching phase by similar name
          const matchingPhaseIdx = mergedPhases.findIndex((mp: any) =>
            mp.name.toLowerCase().includes(irpPhase.name.toLowerCase().split(' ')[0]) ||
            irpPhase.name.toLowerCase().includes(mp.name.toLowerCase().split(' ')[0])
          );

          if (matchingPhaseIdx !== -1) {
            // Add steps to existing phase
            const newSteps = irpPhase.steps.map((s: any) => ({
              title: `[${irp.name.split(' ')[0]}] ${s.title}`,
              required: s.required
            }));
            mergedPhases[matchingPhaseIdx].steps = [
              ...mergedPhases[matchingPhaseIdx].steps,
              ...newSteps
            ];
          } else {
            // Add as new phase if no match
            mergedPhases.push({
              name: irpPhase.name,
              duration: irpPhase.duration,
              steps: irpPhase.steps.map((s: any) => ({
                title: `[${irp.name.split(' ')[0]}] ${s.title}`,
                required: s.required
              }))
            });
          }
        });
      });

      updateFormData('phases', mergedPhases);
    };

    return (
      <div className="space-y-4">
        {/* IRP Selection & Import Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">IRP Playbooks</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Select IRPs to import pre-defined response phases. Multiple IRPs will merge their steps.
                  </p>
                </div>
                {hasLinkedIRPs && (
                  <button
                    type="button"
                    onClick={() => {
                      if (hasExistingPhases) {
                        if (confirm('This will replace all existing phases with merged IRP phases. Continue?')) {
                          importFromMultipleIRPs();
                        }
                      } else {
                        importFromMultipleIRPs();
                      }
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                    Import {linkedIRPsData.length} IRP{linkedIRPsData.length > 1 ? 's' : ''} Phases
                  </button>
                )}
              </div>

              {/* IRP Selection Grid */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                {mockIRPs.map((irp, idx) => {
                  const isSelected = formData.linkedIRPs.includes(irp.id);
                  const selectionOrder = formData.linkedIRPs.indexOf(irp.id) + 1;
                  return (
                    <label
                      key={irp.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-100 border-2 border-orange-400 shadow-sm'
                          : 'bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleIRPSelection(irp.id)}
                          className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        />
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {selectionOrder}
                          </span>
                        )}
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <ShieldCheckIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{irp.name}</p>
                            <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                              irp.type === 'Cyber' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>{irp.type}</span>
                            {idx === 0 && isSelected && linkedIRPsData.length > 1 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-medium bg-green-100 text-green-700 rounded">
                                Primary Structure
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {irp.phases?.length || 0} phases • {irp.phases?.reduce((acc: number, p: any) => acc + (p.steps?.length || 0), 0) || 0} steps • Response: {irp.responseTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${
                          irp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {irp.status}
                        </span>
                        {isSelected && linkedIRPsData.length === 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (hasExistingPhases) {
                                if (confirm('Replace existing phases?')) importFromIRP(irp.id);
                              } else {
                                importFromIRP(irp.id);
                              }
                            }}
                            className="px-3 py-1.5 text-[10px] font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
                          >
                            Import
                          </button>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {linkedIRPsData.length > 1 && (
                <div className="mt-3 p-3 bg-amber-100 border border-amber-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <InformationCircleIcon className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-amber-800">
                      <span className="font-semibold">Multi-IRP Merge:</span> The first selected IRP (<span className="font-medium">{linkedIRPsData[0]?.name}</span>)
                      will provide the phase structure. Steps from other IRPs will be added to matching phases and prefixed with their source.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header with Add Phase */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Playbook Phases</h3>
          <button
            type="button"
            onClick={() => updateFormData('phases', [...formData.phases, { name: 'New Phase', duration: '', steps: [] }])}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" /> Add Phase
          </button>
        </div>

        {/* Phases List */}
        <div className="space-y-2">
          {formData.phases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="border border-gray-200 rounded-sm overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-semibold">
                    {phaseIdx + 1}
                  </div>
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => {
                      const updated = [...formData.phases];
                      updated[phaseIdx].name = e.target.value;
                      updateFormData('phases', updated);
                    }}
                    className="text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phase.duration}
                    onChange={(e) => {
                      const updated = [...formData.phases];
                      updated[phaseIdx].duration = e.target.value;
                      updateFormData('phases', updated);
                    }}
                    placeholder="Duration"
                    className="w-20 px-2 py-1 text-[10px] border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.phases.length > 1) {
                        updateFormData('phases', formData.phases.filter((_, i) => i !== phaseIdx));
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Steps {phase.steps?.length > 0 && <span className="text-gray-700">({phase.steps.length})</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.phases];
                      updated[phaseIdx].steps = [...(updated[phaseIdx].steps || []), { title: '', required: true, status: 'Pending', executedBy: '', startTime: '', endTime: '', duration: '', notes: '' }];
                      updateFormData('phases', updated);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    <PlusIcon className="h-3.5 w-3.5" /> Add Step
                  </button>
                </div>
                {(!phase.steps || phase.steps.length === 0) ? (
                  <p className="text-sm text-gray-400 italic">No steps added yet</p>
                ) : (
                  <div className="space-y-2">
                    {phase.steps.map((step: any, stepIdx: number) => (
                      <div key={stepIdx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 w-6 text-center flex-shrink-0">{stepIdx + 1}.</span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = [...formData.phases];
                            updated[phaseIdx].steps[stepIdx].title = e.target.value;
                            updateFormData('phases', updated);
                          }}
                          placeholder="Step description..."
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-gray-600 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={step.required}
                            onChange={(e) => {
                              const updated = [...formData.phases];
                              updated[phaseIdx].steps[stepIdx].required = e.target.checked;
                              updateFormData('phases', updated);
                            }}
                            className="h-3.5 w-3.5 text-gray-900 rounded"
                          />
                          Required
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.phases];
                            updated[phaseIdx].steps = updated[phaseIdx].steps.filter((_: any, i: number) => i !== stepIdx);
                            updateFormData('phases', updated);
                          }}
                          className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Communication (Merged: Management Team + Response Teams + Communication Templates)
  const renderCommunicationStep = () => {
    const getMemberById = (id: string) => mockTeamMembers.find(m => m.id === id);

    const RoleCard = ({ role, field, required = false, color = 'gray' }: { role: string; field: string; required?: boolean; color?: string }) => {
      const selectedMember = getMemberById(formData[field as keyof typeof formData] as string);
      const colorClasses: Record<string, string> = {
        gray: 'border-gray-200 bg-gray-50',
        red: 'border-red-200 bg-red-50',
        orange: 'border-orange-200 bg-orange-50',
        amber: 'border-amber-200 bg-amber-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        black: 'border-gray-800 bg-gray-100',
      };

      return (
        <div className={`border-2 rounded-lg p-2 transition-all ${selectedMember ? colorClasses[color] : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-semibold text-gray-700 uppercase tracking-wide">{role}</span>
              {required && <span className="text-red-500 text-[8px]">*</span>}
            </div>
            {selectedMember && (
              <button type="button" onClick={() => updateFormData(field, '')} className="text-gray-400 hover:text-red-500 p-0.5">
                <XMarkIcon className="h-3 w-3" />
              </button>
            )}
          </div>
          {selectedMember ? (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                {selectedMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-gray-900 truncate">{selectedMember.name}</p>
                <p className="text-[9px] text-gray-500 truncate">{selectedMember.role}</p>
              </div>
            </div>
          ) : (
            <select
              value=""
              onChange={(e) => updateFormData(field, e.target.value)}
              className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none bg-white"
            >
              <option value="">Select...</option>
              {mockTeamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>
      );
    };

    const addTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam') => {
      const teams = formData[type];
      const newId = `${type === 'incidentResponseTeam' ? 'IRT' : 'CRT'}-${teams.length + 1}`;
      updateFormData(type, [...teams, { id: newId, teamName: '', leader: '', members: [], role: '' }]);
    };

    const updateTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam', index: number, field: string, value: any) => {
      const teams = [...formData[type]];
      teams[index] = { ...teams[index], [field]: value };
      updateFormData(type, teams);
    };

    const removeTeam = (type: 'incidentResponseTeam' | 'crisisResponseTeam', index: number) => {
      const teams = formData[type].filter((_: any, i: number) => i !== index);
      updateFormData(type, teams.length > 0 ? teams : [{ id: `${type === 'incidentResponseTeam' ? 'IRT' : 'CRT'}-1`, teamName: '', leader: '', members: [], role: '' }]);
    };

    const TeamTable = ({ title, type, color }: { title: string; type: 'incidentResponseTeam' | 'crisisResponseTeam'; color: string }) => (
      <div className={`border rounded-lg overflow-hidden ${color === 'red' ? 'border-red-300' : 'border-orange-300'}`}>
        <div className={`px-3 py-2 flex items-center justify-between ${color === 'red' ? 'bg-gradient-to-r from-gray-900 to-red-900' : 'bg-gradient-to-r from-gray-900 to-orange-900'}`}>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-3.5 w-3.5 text-white" />
            <h4 className="text-xs font-semibold text-white">{title}</h4>
            <span className={`px-1.5 py-0.5 text-[8px] font-medium rounded ${color === 'red' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'}`}>
              {formData[type].length}
            </span>
          </div>
          <button type="button" onClick={() => addTeam(type)} className={`flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded ${color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
            <PlusIcon className="h-2.5 w-2.5" /> Add
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-2 py-1.5 text-left text-[9px] font-semibold text-gray-600 uppercase">Team</th>
              <th className="px-2 py-1.5 text-left text-[9px] font-semibold text-gray-600 uppercase">Leader</th>
              <th className="px-2 py-1.5 text-left text-[9px] font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-2 py-1.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {formData[type].map((team: any, idx: number) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-2 py-1.5">
                  <input type="text" value={team.teamName} onChange={(e) => updateTeam(type, idx, 'teamName', e.target.value)} placeholder="Team name..." className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900" />
                </td>
                <td className="px-2 py-1.5">
                  <select value={team.leader} onChange={(e) => updateTeam(type, idx, 'leader', e.target.value)} className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none bg-white">
                    <option value="">Select...</option>
                    {mockTeamMembers.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={team.role} onChange={(e) => updateTeam(type, idx, 'role', e.target.value)} placeholder="Responsibility..." className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900" />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <button type="button" onClick={() => removeTeam(type, idx)} className="p-0.5 text-red-400 hover:text-red-600"><TrashIcon className="h-3 w-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="space-y-5">
        {/* Sub-tabs for Communication sections */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-xl">
          {[
            { id: 'teams', label: 'Management Team (CMT)', icon: UserGroupIcon },
            { id: 'response', label: 'Response Teams (IRT/CRT)', icon: UsersIcon },
            { id: 'templates', label: 'Templates & Channels', icon: MegaphoneIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCommSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex-1 justify-center ${
                commSubTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Management Team (CMT) Sub-tab */}
        {commSubTab === 'teams' && (
          <div className="space-y-4">
            {/* CMT Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="h-5 w-5 text-white/80" />
                  <h3 className="text-sm font-semibold">Crisis Management Team Hierarchy</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-gray-300">L1 Executive</span></div>
                  <span className="text-gray-600 text-xs">→</span>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-xs text-gray-300">L2 Tactical</span></div>
                  <span className="text-gray-600 text-xs">→</span>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-xs text-gray-300">L3 Ops</span></div>
                </div>
              </div>
            </div>

            {/* L1 - Executive */}
            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">L1</span>
                <span className="text-sm font-semibold text-gray-800">Executive Leadership</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <RoleCard role="Crisis Commander" field="crisisCommander" required color="red" />
                <RoleCard role="Deputy Commander" field="deputyCommander" color="red" />
                <RoleCard role="Regulatory Liaison" field="regulatoryLiaison" color="red" />
              </div>
            </div>

            {/* L2 - Tactical */}
            <div className="border-l-4 border-orange-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">L2</span>
                <span className="text-sm font-semibold text-gray-800">Tactical Management</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <RoleCard role="Technical Lead" field="technicalLead" required color="orange" />
                <RoleCard role="Communications Lead" field="communicationsLead" required color="orange" />
                <RoleCard role="Business Lead" field="businessLead" color="orange" />
              </div>
            </div>

            {/* L3 - Operational */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-yellow-500 text-gray-900 text-xs font-bold rounded">L3</span>
                <span className="text-sm font-semibold text-gray-800">Operational Response</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <RoleCard role="Network Engineer" field="l3NetworkEngineer" color="yellow" />
                <RoleCard role="Database Admin" field="l3DatabaseAdmin" color="yellow" />
                <RoleCard role="Security Analyst" field="l3SecurityAnalyst" color="yellow" />
              </div>
            </div>

            {/* Call Tree Integration */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-red-400" />
                  <h4 className="text-sm font-semibold text-white">Call Tree Integration</h4>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">{formData.linkedCallTrees.length} linked</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {mockCallTrees.map(ct => {
                    const isLinked = formData.linkedCallTrees.includes(ct.id);
                    return (
                      <label key={ct.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${isLinked ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                        <input type="checkbox" checked={isLinked} onChange={(e) => {
                          const updated = e.target.checked ? [...formData.linkedCallTrees, ct.id] : formData.linkedCallTrees.filter(id => id !== ct.id);
                          updateFormData('linkedCallTrees', updated);
                        }} className="h-4 w-4 text-red-600 rounded border-gray-300" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{ct.name}</p>
                          <p className="text-xs text-gray-500">{ct.members} members • {ct.responseRate}% response</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Teams Sub-tab */}
        {commSubTab === 'response' && (
          <div className="space-y-4">
            <TeamTable title="Incident Response Team (IRT)" type="incidentResponseTeam" color="red" />
            <TeamTable title="Crisis Response Team (CRT)" type="crisisResponseTeam" color="orange" />
          </div>
        )}

        {/* Templates & Channels Sub-tab */}
        {commSubTab === 'templates' && (
          <div className="space-y-5">
            {/* Regulatory Reporting Section */}
            <div className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Regulatory Reporting Channels</h4>
                    <p className="text-xs text-gray-500">Configure notification timelines and portals</p>
                  </div>
                </div>
                <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors">
                  <PlusIcon className="h-3.5 w-3.5" /> Add Channel
                </button>
              </div>
              <div className="space-y-3">
                {/* SEBI */}
                <div className="bg-white rounded-lg border border-orange-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-orange-800">SEBI (Securities & Exchange Board)</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-600 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Timeline</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500">
                        <option>Within 6 hours</option>
                        <option>Within 24 hours</option>
                        <option>Within 48 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Portal URL</label>
                      <input type="text" placeholder="https://sebi.gov.in/..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
                {/* RBI */}
                <div className="bg-white rounded-lg border border-orange-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-orange-800">RBI (Reserve Bank of India)</span>
                    <input type="checkbox" className="h-4 w-4 text-orange-600 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Timeline</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500">
                        <option>Within 6 hours</option>
                        <option>Within 24 hours</option>
                        <option>Within 48 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Portal URL</label>
                      <input type="text" placeholder="https://rbi.org.in/..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
                {/* CERT-In */}
                <div className="bg-white rounded-lg border border-orange-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-orange-800">CERT-In (Cyber Security)</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-600 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Timeline</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500">
                        <option>Within 6 hours</option>
                        <option>Within 24 hours</option>
                        <option>Within 48 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Portal URL</label>
                      <input type="text" placeholder="https://cert-in.org.in/..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Templates */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Communication Templates</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Internal</h5>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Incident Alert - All Staff</p>
                      <p className="text-xs text-gray-500 mt-0.5">Email + Teams</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Executive Briefing</p>
                      <p className="text-xs text-gray-500 mt-0.5">Phone + Email</p>
                    </div>
                  </div>
                  <button type="button" className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <PlusIcon className="h-3.5 w-3.5" /> Add Template
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Member</h5>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Trading Halt Notice</p>
                      <p className="text-xs text-gray-500 mt-0.5">Email + SMS + Portal</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Service Restoration</p>
                      <p className="text-xs text-gray-500 mt-0.5">Email + Portal</p>
                    </div>
                  </div>
                  <button type="button" className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <PlusIcon className="h-3.5 w-3.5" /> Add Template
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Media / PR</h5>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Holding Statement</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pre-approved</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Press Release</p>
                      <p className="text-xs text-gray-500 mt-0.5">Requires approval</p>
                    </div>
                  </div>
                  <button type="button" className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <PlusIcon className="h-3.5 w-3.5" /> Add Template
                  </button>
                </div>
              </div>
            </div>

            {/* Channels */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Enabled Communication Channels</h4>
              <div className="flex flex-wrap gap-2">
                {['MS Teams', 'WhatsApp', 'SMS', 'Phone/IVR', 'Email', 'Slack', 'Zoom', 'WebEx', 'Pager'].map(channel => (
                  <label key={channel} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    <input type="checkbox" defaultChecked={['MS Teams', 'WhatsApp', 'SMS', 'Phone/IVR', 'Email'].includes(channel)} className="h-4 w-4 text-gray-900 rounded" />
                    <span className="text-sm font-medium text-gray-700">{channel}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 6: Resources
  const renderResourcesStep = () => (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Resources & Dependencies</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Linked DR Plans Summary */}
        <div className="border border-gray-200 rounded-sm p-3 bg-white">
          <h4 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-100">Linked IT DR Plans</h4>
          {formData.linkedDRs.length === 0 ? (
            <p className="text-[10px] text-gray-400 italic">No DR Plans linked. Go back to Step 2 to link.</p>
          ) : (
            <div className="space-y-1.5">
              {mockDRPlans.filter(dr => formData.linkedDRs.includes(dr.id)).map(dr => (
                <div key={dr.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
                  <div>
                    <p className="text-[10px] font-medium text-gray-900">{dr.name}</p>
                    <p className="text-[9px] text-gray-400">{dr.siteType} Site • RTO: {dr.rto}</p>
                  </div>
                  <span className="px-1.5 py-0.5 text-[9px] bg-green-100 text-green-700 rounded-sm font-medium">Linked</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Runbooks */}
        <div className="border border-gray-200 rounded-sm p-3 bg-white">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Recovery Runbooks</h4>
            <button type="button" className="text-[9px] text-gray-500 hover:text-gray-900">+ Add Runbook</button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Trading System Failover</p>
                <p className="text-[9px] text-gray-400">Last updated: 2025-10-15</p>
              </div>
              <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Database Recovery</p>
                <p className="text-[9px] text-gray-400">Last updated: 2025-09-20</p>
              </div>
              <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
            </div>
          </div>
        </div>

        {/* Vendor Contacts */}
        <div className="border border-gray-200 rounded-sm p-3 bg-white">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Vendor Contacts</h4>
            <button type="button" className="text-[9px] text-gray-500 hover:text-gray-900">+ Add Vendor</button>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-[10px] font-medium text-gray-900">Oracle Support</p>
              <p className="text-[9px] text-gray-400">24x7 Support: +1-800-XXX-XXXX</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-[10px] font-medium text-gray-900">Network Provider (Tata)</p>
              <p className="text-[9px] text-gray-400">NOC: +91-22-XXXX-XXXX</p>
            </div>
          </div>
        </div>

        {/* Document Templates */}
        <div className="border border-gray-200 rounded-sm p-3 bg-white">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Document Templates</h4>
            <button type="button" className="text-[9px] text-gray-500 hover:text-gray-900">+ Add Template</button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-[10px] font-medium text-gray-900">Incident Log Template</p>
              <button className="text-[9px] text-gray-500 hover:text-gray-900">Download</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-[10px] font-medium text-gray-900">SEBI Notification Form</p>
              <button className="text-[9px] text-gray-500 hover:text-gray-900">Download</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-[10px] font-medium text-gray-900">Post-Incident Report Template</p>
              <button className="text-[9px] text-gray-500 hover:text-gray-900">Download</button>
            </div>
          </div>
        </div>
      </div>

      {/* Alternate Locations */}
      <div className="border border-gray-200 rounded-sm p-3 bg-white">
        <h4 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-100">Alternate Recovery Locations</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-red-600 text-white rounded-sm">HOT</span>
              <p className="text-[10px] font-medium text-gray-900">Primary DR Site</p>
            </div>
            <p className="text-[9px] text-gray-500">Navi Mumbai • Activation: Immediate</p>
          </div>
          <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-yellow-600 text-white rounded-sm">WARM</span>
              <p className="text-[10px] font-medium text-gray-900">Secondary DR Site</p>
            </div>
            <p className="text-[9px] text-gray-500">Chennai • Activation: 2 hours</p>
          </div>
          <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-gray-700 text-white rounded-sm">COLD</span>
              <p className="text-[10px] font-medium text-gray-900">Tertiary Site</p>
            </div>
            <p className="text-[9px] text-gray-500">Hyderabad • Activation: 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 7: BCP & IRP Invocation
  const renderBCPInvocationStep = () => {
    const addBCPInvocation = () => {
      const newId = `BCP-INV-${formData.bcpInvocations.length + 1}`;
      updateFormData('bcpInvocations', [...formData.bcpInvocations, { id: newId, bcpId: '', status: 'Not Invoked', approvedBy: '', invokedAt: '' }]);
    };

    const updateBCPInvocation = (index: number, field: string, value: string) => {
      const invocations = [...formData.bcpInvocations];
      invocations[index] = { ...invocations[index], [field]: value };
      updateFormData('bcpInvocations', invocations);
    };

    const removeBCPInvocation = (index: number) => {
      const invocations = formData.bcpInvocations.filter((_: any, i: number) => i !== index);
      updateFormData('bcpInvocations', invocations.length > 0 ? invocations : [{ id: 'BCP-INV-1', bcpId: '', status: 'Not Invoked', approvedBy: '', invokedAt: '' }]);
    };

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <BoltIcon className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-semibold">BCP & IRP Invocation</h3>
          </div>
          <p className="text-[11px] text-gray-300">Link and configure Business Continuity Plans and Incident Response Plans for invocation during crisis</p>
        </div>

        {/* BCP Invocation Table */}
        <div className="border-2 border-red-300 rounded-lg overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-900 to-red-900">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-white" />
              <h4 className="text-sm font-semibold text-white">Business Continuity Plans</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-red-600 text-white">
                {formData.bcpInvocations.filter((b: any) => b.bcpId).length} linked
              </span>
            </div>
            <button
              type="button"
              onClick={addBCPInvocation}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-3 w-3" /> Add BCP
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/3">BCP / Plan</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/5">Status</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/5">Approved By</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-1/5">Invoked At</th>
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formData.bcpInvocations.map((inv: any, idx: number) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <select
                        value={inv.bcpId}
                        onChange={(e) => updateBCPInvocation(idx, 'bcpId', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none bg-white"
                      >
                        <option value="">Select BCP...</option>
                        {mockBCPs.map(bcp => (
                          <option key={bcp.id} value={bcp.id}>{bcp.name} ({bcp.department})</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={inv.status}
                        onChange={(e) => updateBCPInvocation(idx, 'status', e.target.value)}
                        className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none ${
                          inv.status === 'Invoked' ? 'bg-green-50 border-green-300 text-green-700' :
                          inv.status === 'Partial' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                          'bg-gray-50 border-gray-300 text-gray-700'
                        }`}
                      >
                        <option value="Not Invoked">Not Invoked</option>
                        <option value="Partial">Partial</option>
                        <option value="Invoked">Invoked</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={inv.approvedBy}
                        onChange={(e) => updateBCPInvocation(idx, 'approvedBy', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none bg-white"
                      >
                        <option value="">Select approver...</option>
                        {mockTeamMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="datetime-local"
                        value={inv.invokedAt}
                        onChange={(e) => updateBCPInvocation(idx, 'invokedAt', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeBCPInvocation(idx)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Linked IRPs from Scope */}
        <div className="border-2 border-orange-300 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-orange-900 flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-white" />
            <h4 className="text-sm font-semibold text-white">Linked Incident Response Plans</h4>
          </div>
          <div className="p-4 bg-white">
            {formData.linkedIRPs.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No IRPs linked. Go back to Scope step to link IRPs.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {mockIRPs.filter(irp => formData.linkedIRPs.includes(irp.id)).map(irp => (
                  <div key={irp.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{irp.name}</p>
                      <p className="text-[11px] text-gray-500">{irp.type} • Last tested: {irp.lastTested}</p>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-medium bg-orange-600 text-white rounded-full">Linked</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Step 8: Incident Log & Closure Checklist
  const renderIncidentLogStep = () => {
    const addLogEntry = () => {
      const newId = `LOG-${formData.incidentLogTemplate.length + 1}`;
      updateFormData('incidentLogTemplate', [...formData.incidentLogTemplate, {
        id: newId, task: '', status: 'Pending', priority: 'Medium', assignedTo: '', dueDate: '', estimatedCost: '', communicationMedia: ''
      }]);
    };

    const updateLogEntry = (index: number, field: string, value: string) => {
      const entries = [...formData.incidentLogTemplate];
      entries[index] = { ...entries[index], [field]: value };
      updateFormData('incidentLogTemplate', entries);
    };

    const removeLogEntry = (index: number) => {
      const entries = formData.incidentLogTemplate.filter((_: any, i: number) => i !== index);
      updateFormData('incidentLogTemplate', entries.length > 0 ? entries : [{ id: 'LOG-1', task: '', status: 'Pending', priority: 'Medium', assignedTo: '', dueDate: '', estimatedCost: '', communicationMedia: '' }]);
    };

    const addClosureItem = () => {
      const newId = `CLOSE-${formData.closureChecklist.length + 1}`;
      updateFormData('closureChecklist', [...formData.closureChecklist, { id: newId, item: '', completed: false, completedBy: '', completedAt: '', evidence: [] }]);
    };

    const updateClosureItem = (index: number, field: string, value: any) => {
      const items = [...formData.closureChecklist];
      items[index] = { ...items[index], [field]: value };
      updateFormData('closureChecklist', items);
    };

    const removeClosureItem = (index: number) => {
      const items = formData.closureChecklist.filter((_: any, i: number) => i !== index);
      updateFormData('closureChecklist', items.length > 0 ? items : [{ id: 'CLOSE-1', item: '', completed: false, completedBy: '', completedAt: '', evidence: [] }]);
    };

    const addEvidence = (index: number) => {
      const items = [...formData.closureChecklist];
      const newEvidence = { id: `EV-${Date.now()}`, name: '', type: 'document', url: '' };
      items[index].evidence = [...(items[index].evidence || []), newEvidence];
      updateFormData('closureChecklist', items);
    };

    const updateEvidence = (itemIndex: number, evidenceIndex: number, field: string, value: string) => {
      const items = [...formData.closureChecklist];
      items[itemIndex].evidence[evidenceIndex] = { ...items[itemIndex].evidence[evidenceIndex], [field]: value };
      updateFormData('closureChecklist', items);
    };

    const removeEvidence = (itemIndex: number, evidenceIndex: number) => {
      const items = [...formData.closureChecklist];
      items[itemIndex].evidence = items[itemIndex].evidence.filter((_: any, i: number) => i !== evidenceIndex);
      updateFormData('closureChecklist', items);
    };

    return (
      <div className="space-y-5">
        {/* Incident Log Template */}
        <div className="border-2 border-amber-300 rounded-lg overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-900 to-amber-900">
            <div className="flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Incident Log Template</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-amber-600 text-white">
                {formData.incidentLogTemplate.length} entries
              </span>
            </div>
            <button
              type="button"
              onClick={addLogEntry}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <PlusIcon className="h-3 w-3" /> Add Entry
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide">Task</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-24">Status</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-20">Priority</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-28">Assigned To</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-28">Due Date</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-24">Est. Cost</th>
                  <th className="px-2 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wide w-28">Comm. Media</th>
                  <th className="px-2 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formData.incidentLogTemplate.map((entry: any, idx: number) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={entry.task}
                        onChange={(e) => updateLogEntry(idx, 'task', e.target.value)}
                        placeholder="Task description..."
                        className="w-full px-2 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={entry.status}
                        onChange={(e) => updateLogEntry(idx, 'status', e.target.value)}
                        className="w-full px-1 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={entry.priority}
                        onChange={(e) => updateLogEntry(idx, 'priority', e.target.value)}
                        className={`w-full px-1 py-1 text-[11px] border rounded focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                          entry.priority === 'Critical' ? 'bg-red-50 border-red-300' :
                          entry.priority === 'High' ? 'bg-orange-50 border-orange-300' :
                          entry.priority === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                          'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={entry.assignedTo}
                        onChange={(e) => updateLogEntry(idx, 'assignedTo', e.target.value)}
                        className="w-full px-1 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="">Assign...</option>
                        {mockTeamMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="date"
                        value={entry.dueDate}
                        onChange={(e) => updateLogEntry(idx, 'dueDate', e.target.value)}
                        className="w-full px-1 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={entry.estimatedCost}
                        onChange={(e) => updateLogEntry(idx, 'estimatedCost', e.target.value)}
                        placeholder="₹0"
                        className="w-full px-1 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={entry.communicationMedia}
                        onChange={(e) => updateLogEntry(idx, 'communicationMedia', e.target.value)}
                        className="w-full px-1 py-1 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="">Select...</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Teams">Teams</option>
                        <option value="SMS">SMS</option>
                        <option value="In-Person">In-Person</option>
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => removeLogEntry(idx)}
                        className="p-0.5 text-red-400 hover:text-red-600"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closure Checklist */}
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between bg-green-50">
            <div className="flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-900">Incident Closure Checklist</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-green-200 text-green-700">
                {formData.closureChecklist.filter((c: any) => c.completed).length}/{formData.closureChecklist.length} complete
              </span>
            </div>
            <button
              type="button"
              onClick={addClosureItem}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-3 w-3" /> Add Item
            </button>
          </div>
          <div className="p-4 space-y-3">
            {formData.closureChecklist.map((item: any, idx: number) => (
              <div key={item.id} className={`rounded-lg border transition-all ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}>
                {/* Main row */}
                <div className="flex items-center gap-3 p-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => updateClosureItem(idx, 'completed', e.target.checked)}
                    className="h-4 w-4 text-green-600 rounded border-gray-300"
                  />
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => updateClosureItem(idx, 'item', e.target.value)}
                    placeholder="Closure checklist item..."
                    className={`flex-1 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      item.completed ? 'bg-green-50 border-green-200 line-through text-gray-500' : 'border-gray-300'
                    }`}
                  />
                  <select
                    value={item.completedBy}
                    onChange={(e) => updateClosureItem(idx, 'completedBy', e.target.value)}
                    className="w-36 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Completed by...</option>
                    {mockTeamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addEvidence(idx)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="Link Evidence"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    Evidence
                  </button>
                  <button
                    type="button"
                    onClick={() => removeClosureItem(idx)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Evidence Section */}
                {item.evidence && item.evidence.length > 0 && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="ml-7 pl-3 border-l-2 border-blue-200 space-y-2">
                      <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">Linked Evidence</span>
                      {item.evidence.map((ev: any, evIdx: number) => (
                        <div key={ev.id} className="flex items-center gap-2 bg-blue-50 rounded-md p-2 border border-blue-100">
                          <DocumentTextIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <input
                            type="text"
                            value={ev.name}
                            onChange={(e) => updateEvidence(idx, evIdx, 'name', e.target.value)}
                            placeholder="Evidence name..."
                            className="flex-1 px-2 py-1 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <select
                            value={ev.type}
                            onChange={(e) => updateEvidence(idx, evIdx, 'type', e.target.value)}
                            className="w-28 px-2 py-1 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          >
                            <option value="document">Document</option>
                            <option value="screenshot">Screenshot</option>
                            <option value="log">Log File</option>
                            <option value="email">Email</option>
                            <option value="ticket">Ticket</option>
                            <option value="report">Report</option>
                          </select>
                          <input
                            type="text"
                            value={ev.url}
                            onChange={(e) => updateEvidence(idx, evIdx, 'url', e.target.value)}
                            placeholder="URL or file path..."
                            className="w-48 px-2 py-1 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => removeEvidence(idx, evIdx)}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <XMarkIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 7: Comprehensive Crisis Management Report
  const renderReportStep = () => {
    const getMemberName = (id: string) => mockTeamMembers.find(m => m.id === id)?.name || 'Not assigned';
    const getVitalRecordName = (id: string) => mockVitalRecords.find(r => r.id === id)?.name || id;
    const getITServiceName = (id: string) => mockITServices.find(s => s.id === id)?.name || id;
    const getHardwareName = (id: string) => mockHardware.find(h => h.id === id)?.name || id;
    const getSupplierName = (id: string) => mockSuppliers.find(s => s.id === id)?.name || id;
    const getTelephonyName = (id: string) => mockTelephony.find(t => t.id === id)?.name || id;
    const getLocationName = (id: string) => mockLocations.find(l => l.id === id)?.name || id;
    const getOrgAreaName = (id: string) => mockOrgAreas.find(o => o.id === id)?.name || id;
    const getIRPName = (id: string) => mockIRPs.find(i => i.id === id)?.name || id;
    const getBCPName = (id: string) => mockBCPs.find(b => b.id === id)?.name || id;
    const getCallTreeName = (id: string) => mockCallTrees.find(c => c.id === id)?.name || id;

    // Enterprise-level Report Section - Clean, Professional Design
    const ReportSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode; color?: string }) => (
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 bg-gray-800 flex items-center gap-3 border-b border-gray-700">
          <Icon className="h-4 w-4 text-gray-300" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
      </div>
    );

    const DataRow = ({ label, value, badge, critical }: { label: string; value: string | React.ReactNode; badge?: string; critical?: boolean }) => (
      <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-2">
          {badge && <span className={`px-2 py-0.5 text-xs font-medium ${critical ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{value}</span>}
          {!badge && <span className="text-sm font-medium text-gray-900 text-right">{value}</span>}
        </div>
      </div>
    );

    const ItemList = ({ items, emptyText = 'None selected' }: { items: string[]; emptyText?: string }) => (
      items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs border border-gray-200">{item}</span>
          ))}
        </div>
      ) : <span className="text-xs text-gray-400 italic">{emptyText}</span>
    );

    const StatusBadge = ({ status }: { status: string }) => {
      const isComplete = status === 'Completed' || status === 'Active';
      const isPending = status === 'Pending' || status === 'In Progress';
      return (
        <span className={`px-2 py-0.5 text-xs font-medium ${isComplete ? 'bg-gray-800 text-white' : isPending ? 'bg-gray-200 text-gray-700' : 'bg-red-600 text-white'}`}>
          {status}
        </span>
      );
    };

    const totalSteps = formData.phases.reduce((acc, phase) => acc + phase.steps.length, 0);
    const completedChecklist = formData.closureChecklist.filter(item => item.completed).length;

    return (
      <div className="space-y-4">
        {/* Printable Report Content */}
        <div ref={reportRef} className="space-y-4 bg-white p-6">
          {/* Report Header - Clean Enterprise Style */}
          <div className="border-b-2 border-gray-900 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold uppercase">Confidential</span>
                  <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-semibold uppercase">{formData.severity}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || 'Untitled Playbook'}</h1>
                <p className="text-sm text-gray-500">Crisis Management Incident Report</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Report Generated</p>
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{formData.phases.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phases</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{totalSteps}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Steps</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{formData.responseSummary?.totalIncidentDuration || '-'}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{formData.responseSummary?.totalPersonHours || '-'}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Person Hours</p>
              </div>
            </div>
          </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Section 1: Classification */}
          <ReportSection title="1. Incident Classification" icon={FlagIcon}>
            <div className="space-y-1">
              <DataRow label="Playbook Name" value={formData.name || '-'} />
              <DataRow label="Category" value={formData.category || '-'} />
              <DataRow label="Incident Type" value={formData.incidentType === 'real' ? 'Real Incident' : formData.incidentType === 'drill' ? 'Drill' : 'Test'} badge="true" critical={formData.incidentType === 'real'} />
              <DataRow label="Severity" value={formData.severity} badge="true" critical={formData.severity === 'CRITICAL'} />
              <DataRow label="Invocation Decision" value={formData.incidentDecision === 'immediate' ? 'Immediate Invocation' : formData.incidentDecision === 'standby' ? 'Standby' : 'Monitor'} />
              <DataRow label="Estimated Duration" value={formData.estimatedDuration || '-'} />
              <DataRow label="Owner" value={formData.owner ? getMemberName(formData.owner) : '-'} />
              <DataRow label="Description" value={formData.description || '-'} />
            </div>
          </ReportSection>

          {/* Section 2: Scope - Data Assets */}
          <ReportSection title="2. Scope - Data & IT Assets" icon={CubeIcon}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Data & Information Assets ({formData.selectedVitalRecords.length})</p>
                <ItemList items={formData.selectedVitalRecords.map(getVitalRecordName)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">IT Services ({formData.selectedITServices.length})</p>
                <ItemList items={formData.selectedITServices.map(getITServiceName)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Hardware ({formData.selectedHardware.length})</p>
                <ItemList items={formData.selectedHardware.map(getHardwareName)} />
              </div>
            </div>
          </ReportSection>

          {/* Section 2b: Scope - Suppliers & Locations */}
          <ReportSection title="2b. Scope - Suppliers & Locations" icon={MapPinIcon}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Suppliers ({formData.selectedSuppliers.length})</p>
                <ItemList items={formData.selectedSuppliers.map(getSupplierName)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Telephony ({formData.selectedTelephony.length})</p>
                <ItemList items={formData.selectedTelephony.map(getTelephonyName)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Locations ({formData.selectedLocations.length})</p>
                <ItemList items={formData.selectedLocations.map(getLocationName)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Organizational Areas ({formData.selectedOrgAreas.length})</p>
                <ItemList items={formData.selectedOrgAreas.map(getOrgAreaName)} />
              </div>
            </div>
          </ReportSection>

          {/* Section 3: Communication - CMT */}
          <ReportSection title="3. Crisis Management Team" icon={UserGroupIcon}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-200">L1 - Executive Leadership</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Crisis Commander</p>
                    <p className="text-sm font-medium text-gray-900">{formData.crisisCommander ? getMemberName(formData.crisisCommander) : '-'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Deputy Commander</p>
                    <p className="text-sm font-medium text-gray-900">{formData.deputyCommander ? getMemberName(formData.deputyCommander) : '-'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-200">L2 - Tactical Management</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Technical Lead</p>
                    <p className="text-sm font-medium text-gray-900">{formData.technicalLead ? getMemberName(formData.technicalLead) : '-'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Communications Lead</p>
                    <p className="text-sm font-medium text-gray-900">{formData.communicationsLead ? getMemberName(formData.communicationsLead) : '-'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Business Lead</p>
                    <p className="text-sm font-medium text-gray-900">{formData.businessLead ? getMemberName(formData.businessLead) : '-'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-200">L3 - Operational Response</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500">Network Engineer</p>
                    <p className="text-sm font-semibold text-gray-900">{formData.l3NetworkEngineer ? getMemberName(formData.l3NetworkEngineer) : '-'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Database Admin</p>
                    <p className="text-sm font-medium text-gray-900">{formData.l3DatabaseAdmin ? getMemberName(formData.l3DatabaseAdmin) : '-'}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Security Analyst</p>
                    <p className="text-sm font-medium text-gray-900">{formData.l3SecurityAnalyst ? getMemberName(formData.l3SecurityAnalyst) : '-'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Linked Call Trees ({formData.linkedCallTrees.length})</p>
                <ItemList items={formData.linkedCallTrees.map(getCallTreeName)} />
              </div>
            </div>
          </ReportSection>
        </div>

        {/* Full Width Sections */}
        {/* Section 3b: Response Teams */}
        <ReportSection title="3b. Response Teams (IRT & CRT)" icon={UsersIcon}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">Incident Response Teams (IRT)</p>
              <div className="space-y-2">
                {formData.incidentResponseTeam.map((team: any) => (
                  <div key={team.id} className="p-3 bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{team.teamName}</p>
                      <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-medium">{team.id}</span>
                    </div>
                    <p className="text-xs text-gray-500">Leader: <span className="font-medium text-gray-700">{team.leader ? getMemberName(team.leader) : '-'}</span></p>
                    <p className="text-xs text-gray-500">Role: <span className="font-medium text-gray-700">{team.role}</span></p>
                    <p className="text-xs text-gray-500">Members: <span className="font-medium text-gray-700">{team.members.length > 0 ? team.members.map((m: string) => getMemberName(m)).join(', ') : '-'}</span></p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">Crisis Response Teams (CRT)</p>
              <div className="space-y-2">
                {formData.crisisResponseTeam.map((team: any) => (
                  <div key={team.id} className="p-3 bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{team.teamName}</p>
                      <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-medium">{team.id}</span>
                    </div>
                    <p className="text-xs text-gray-500">Leader: <span className="font-medium text-gray-700">{team.leader ? getMemberName(team.leader) : '-'}</span></p>
                    <p className="text-xs text-gray-500">Role: <span className="font-medium text-gray-700">{team.role}</span></p>
                    <p className="text-xs text-gray-500">Members: <span className="font-medium text-gray-700">{team.members.length > 0 ? team.members.map((m: string) => getMemberName(m)).join(', ') : '-'}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ReportSection>

        {/* Section 4: Playbooks/Phases */}
        <ReportSection title="4. Response Playbooks & Phases" icon={ListBulletIcon}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Linked IRPs ({formData.linkedIRPs.length})</p>
              <ItemList items={formData.linkedIRPs.map(getIRPName)} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {formData.phases.map((phase, idx) => (
                <div key={idx} className="border border-gray-200 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-100 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <p className="text-sm font-medium text-gray-900">{phase.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white text-gray-700 text-xs border border-gray-300">{phase.duration}</span>
                      <span className="px-2 py-0.5 bg-gray-800 text-white text-xs">{phase.steps.length} steps</span>
                    </div>
                  </div>
                  {phase.steps.length > 0 && (
                    <div className="p-3 bg-white">
                      <div className="grid grid-cols-2 gap-2">
                        {phase.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100">
                            <span className="w-5 h-5 bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{stepIdx + 1}</span>
                            <p className="text-xs text-gray-700 flex-1">{step.title}</p>
                            {step.required && <span className="px-1.5 py-0.5 bg-gray-800 text-white text-[9px] font-medium">REQ</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        {/* Section 5: BCP Invocation */}
        <ReportSection title="5. BCP & DR Invocation" icon={BoltIcon}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">BCP Invocations</p>
              <div className="space-y-2">
                {formData.bcpInvocations.filter((inv: any) => inv.bcpId).map((inv: any) => (
                  <div key={inv.id} className="p-3 bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{getBCPName(inv.bcpId)}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium ${inv.status === 'Invoked' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>{inv.status}</span>
                    </div>
                    {inv.approvedBy && <p className="text-xs text-gray-500">Approved by: {getMemberName(inv.approvedBy)}</p>}
                    {inv.invokedAt && <p className="text-xs text-gray-500">Invoked at: {inv.invokedAt}</p>}
                  </div>
                ))}
                {formData.bcpInvocations.filter((inv: any) => inv.bcpId).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No BCPs invoked</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Linked BIAs ({formData.linkedBIAs.length})</p>
                <ItemList items={formData.linkedBIAs.map(id => mockBIAs.find(b => b.id === id)?.name || id)} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Linked DRs ({formData.linkedDRs.length})</p>
                <ItemList items={formData.linkedDRs.map(id => mockDRPlans.find(d => d.id === id)?.name || id)} />
              </div>
            </div>
          </div>
        </ReportSection>

        {/* Section 6: Incident Log & Closure */}
        <div className="grid grid-cols-2 gap-4">
          <ReportSection title="6a. Incident Log" icon={ClipboardDocumentCheckIcon}>
            <div className="space-y-2">
              {formData.incidentLogTemplate.map((log: any) => (
                <div key={log.id} className="p-3 bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{log.task}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium ${log.priority === 'High' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>{log.priority}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Status: {log.status}</span>
                    {log.assignedTo && <span>Assigned: {getMemberName(log.assignedTo)}</span>}
                    {log.dueDate && <span>Due: {log.dueDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="6b. Closure Checklist" icon={CheckCircleIcon}>
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-100 border border-gray-200">
                <span className="text-xs font-medium text-gray-700 uppercase">Completion Progress</span>
                <span className="text-sm font-bold text-gray-900">{completedChecklist} / {formData.closureChecklist.length}</span>
              </div>
              {formData.closureChecklist.map((item: any) => (
                <div key={item.id} className={`p-3 border ${item.completed ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      {item.completed && <CheckIcon className="h-3 w-3 text-white" />}
                    </div>
                    <p className={`text-sm ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{item.item}</p>
                  </div>
                  {item.completed && item.completedBy && (
                    <p className="text-xs text-gray-500 ml-8 mt-1">Completed by {getMemberName(item.completedBy)} {item.completedAt && `at ${item.completedAt}`}</p>
                  )}
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="ml-8 mt-2">
                      <p className="text-xs text-gray-500 mb-1">Evidence ({item.evidence.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {item.evidence.map((ev: any, evIdx: number) => (
                          <span key={evIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs border border-gray-200">{ev.name || `Evidence ${evIdx + 1}`}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>
        </div>

        {/* Section 7: Response Summary Metrics */}
        <ReportSection title="7. Incident Response Metrics" icon={ChartBarIcon}>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{formData.responseSummary?.totalIncidentDuration || '-'}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase">Total Duration</p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{formData.responseSummary?.timeToContainment || '-'}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase">Time to Containment</p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{formData.responseSummary?.totalPersonHours || '-'}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase">Person Hours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{formData.responseSummary?.systemsAffected || '-'}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase">Systems Affected</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <DataRow label="Incident Start Time" value={formData.responseSummary?.incidentStartTime || '-'} />
              <DataRow label="Incident End Time" value={formData.responseSummary?.incidentEndTime || '-'} />
              <DataRow label="Time to Detection" value={formData.responseSummary?.timeToDetection || '-'} />
              <DataRow label="Time to Eradication" value={formData.responseSummary?.timeToEradication || '-'} />
              <DataRow label="Time to Recovery (MTTR)" value={formData.responseSummary?.mttr || '-'} />
            </div>
            <div className="space-y-2">
              <DataRow label="Data Exfiltrated" value={formData.responseSummary?.dataExfiltrated || '-'} badge="true" critical />
              <DataRow label="Users Impacted" value={formData.responseSummary?.usersImpacted?.toString() || '-'} />
              <DataRow label="Estimated Financial Impact" value={formData.responseSummary?.estimatedFinancialImpact || '-'} badge="true" critical />
            </div>
          </div>
        </ReportSection>

        {/* Section 8: Crisis Call Metrics */}
        <ReportSection title="8. Crisis Call & Meeting Log" icon={PhoneIcon}>
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 border border-gray-200 text-center">
                <p className="text-xl font-bold text-gray-900">{formData.crisisCallMetrics?.totalCalls || 0}</p>
                <p className="text-xs text-gray-500 uppercase">Total Calls</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 text-center">
                <p className="text-xl font-bold text-gray-900">{formData.crisisCallMetrics?.primaryBridge?.totalDuration || '-'}</p>
                <p className="text-xs text-gray-500 uppercase">Total Bridge Time</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 text-center">
                <p className="text-xl font-bold text-gray-900">{formData.crisisCallMetrics?.primaryBridge?.peakParticipants || 0}</p>
                <p className="text-xs text-gray-500 uppercase">Peak Participants</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 text-center">
                <p className="text-xl font-bold text-gray-900">{formData.crisisCallMetrics?.primaryBridge?.uniqueParticipants || 0}</p>
                <p className="text-xs text-gray-500 uppercase">Unique Participants</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Primary Bridge Details</p>
              <div className="grid grid-cols-3 gap-4">
                <DataRow label="Platform" value={formData.crisisCallMetrics?.primaryBridge?.platform || '-'} />
                <DataRow label="Bridge ID" value={formData.crisisCallMetrics?.primaryBridge?.bridgeId || '-'} />
                <DataRow label="Duration" value={`${formData.crisisCallMetrics?.primaryBridge?.startTime || '-'} - ${formData.crisisCallMetrics?.primaryBridge?.endTime || '-'}`} />
              </div>
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Call Sessions Timeline</p>
          <div className="space-y-2">
            {formData.crisisCallMetrics?.callSessions?.map((call: any, idx: number) => (
              <div key={call.id} className="flex items-center gap-4 p-3 bg-white border border-gray-200">
                <div className="w-7 h-7 bg-gray-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{call.name}</p>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{call.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{call.startTime} - {call.endTime}</span>
                    <span>{call.duration}</span>
                    <span>{call.participants} participants</span>
                    <span>Host: {getMemberName(call.host)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Section 9: Level Involvement & Communication Response */}
        <ReportSection title="9. Team Response & Level Involvement" icon={UserGroupIcon}>
          <div className="space-y-4">
            {['L1', 'L2', 'L3'].map((level) => {
              const levelData = formData.levelInvolvement?.[level];
              if (!levelData) return null;
              return (
                <div key={level} className="border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-bold">{level}</span>
                      <span className="text-gray-300 font-medium text-sm">{levelData.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center px-3 py-1 bg-gray-700">
                        <p className="text-sm font-bold text-white">{levelData.responded}/{levelData.totalMembers}</p>
                        <p className="text-xs text-gray-400">Responded</p>
                      </div>
                      <div className="text-center px-3 py-1 bg-gray-700">
                        <p className="text-sm font-bold text-white">{levelData.responseRate}</p>
                        <p className="text-xs text-gray-400">Response Rate</p>
                      </div>
                      <div className="text-center px-3 py-1 bg-gray-700">
                        <p className="text-sm font-bold text-white">{levelData.avgResponseTime}</p>
                        <p className="text-xs text-gray-400">Avg Response</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="text-xs text-gray-500 mb-3">
                      Activated at <span className="font-medium">{levelData.activatedAt}</span> by <span className="font-medium">{getMemberName(levelData.activatedBy)}</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase border-b border-gray-200">
                          <th className="text-left py-2 font-medium">Member</th>
                          <th className="text-left py-2 font-medium">Role</th>
                          <th className="text-left py-2 font-medium">Notified</th>
                          <th className="text-left py-2 font-medium">Responded</th>
                          <th className="text-left py-2 font-medium">Response Time</th>
                          <th className="text-left py-2 font-medium">Channel</th>
                          <th className="text-left py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {levelData.members?.map((member: any) => (
                          <tr key={member.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 text-sm font-medium text-gray-900">{member.name}</td>
                            <td className="py-2 text-xs text-gray-600">{member.role}</td>
                            <td className="py-2 text-xs text-gray-600">{member.notifiedAt}</td>
                            <td className="py-2 text-xs text-gray-600">{member.respondedAt}</td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-xs font-medium ${member.responseTime === 'N/A' ? 'bg-gray-100 text-gray-500' : 'bg-gray-800 text-white'}`}>
                                {member.responseTime}
                              </span>
                            </td>
                            <td className="py-2 text-xs text-gray-600">{member.channel}</td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-xs font-medium ${member.status === 'Active' ? 'bg-gray-800 text-white' : member.status.includes('No Response') ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {member.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </ReportSection>

        {/* Section 10: Detailed Phase Execution Log */}
        <ReportSection title="10. Detailed Phase Execution Log" icon={ClockIcon}>
          <div className="space-y-3">
            {formData.phases.map((phase: any, phaseIdx: number) => (
              <div key={phaseIdx} className="border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white text-gray-800 flex items-center justify-center text-xs font-bold">{phaseIdx + 1}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{phase.name}</p>
                      <p className="text-gray-400 text-xs">{phase.startTime} → {phase.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center px-3 py-1 bg-gray-700">
                      <p className="text-sm font-bold text-white">{phase.actualDuration || phase.duration}</p>
                      <p className="text-xs text-gray-400">Actual Duration</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium ${phase.status === 'Completed' ? 'bg-white text-gray-800' : 'bg-gray-600 text-white'}`}>
                      {phase.status || 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase border-b border-gray-200">
                        <th className="text-left py-2 w-8 font-medium">#</th>
                        <th className="text-left py-2 font-medium">Step</th>
                        <th className="text-left py-2 font-medium w-24">Executed By</th>
                        <th className="text-left py-2 font-medium w-20">Start</th>
                        <th className="text-left py-2 font-medium w-20">End</th>
                        <th className="text-left py-2 font-medium w-20">Duration</th>
                        <th className="text-left py-2 font-medium w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phase.steps.map((step: any, stepIdx: number) => (
                        <tr key={stepIdx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-2">
                            <span className="w-5 h-5 bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-bold">{stepIdx + 1}</span>
                          </td>
                          <td className="py-2">
                            <div>
                              <p className="text-sm text-gray-900">{step.title}</p>
                              {step.notes && <p className="text-xs text-gray-500 mt-0.5 italic">{step.notes}</p>}
                            </div>
                          </td>
                          <td className="py-2 text-xs text-gray-600">{step.executedBy ? getMemberName(step.executedBy) : '-'}</td>
                          <td className="py-2 text-xs text-gray-600">{step.startTime || '-'}</td>
                          <td className="py-2 text-xs text-gray-600">{step.endTime || '-'}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{step.duration || '-'}</span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 text-xs font-medium ${step.status === 'Completed' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              {step.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Report Footer */}
        <div className="border-t-2 border-gray-900 pt-4 mt-6 flex items-center justify-between text-xs text-gray-500">
          <div>
            <p className="font-medium text-gray-700">CONFIDENTIAL - FOR INTERNAL USE ONLY</p>
            <p>This document contains sensitive incident response information.</p>
          </div>
          <div className="text-right">
            <p>Generated: {new Date().toLocaleString()}</p>
            <p>Document ID: CMP-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>

        </div>
        {/* End of Printable Report Content */}

        {/* Export/Print Actions */}
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <ArrowDownIcon className="h-4 w-4" />
                Export as PDF
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            Print Report
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderClassificationStep();
      case 2: return renderScopeStep();
      case 3: return renderCommunicationStep();
      case 4: return renderPhasesStep();
      case 5: return renderBCPInvocationStep();
      case 6: return renderIncidentLogStep();
      case 7: return renderReportStep();
      default: return renderClassificationStep();
    }
  };

  const progress = Math.round((currentStep / WIZARD_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Progress Header - Resilience Theme */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-red-900 text-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/crisis-management/playbooks" className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                <ArrowLeftIcon className="h-3 w-3" />
                Back to Playbooks
              </Link>
              <div className="h-4 w-px bg-red-800" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <ShieldExclamationIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-wide">Crisis Response Playbook</h1>
                  <p className="text-[10px] text-red-300">Step {currentStep} of {WIZARD_STEPS.length} • {WIZARD_STEPS[currentStep - 1].name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Progress Bar - Red accent */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Progress</span>
                <div className="w-40">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-lg font-bold text-red-400">{progress}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Navigation - Light theme with high contrast */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <nav aria-label="Progress" className="w-full">
          <ol className="flex items-start w-full">
            {WIZARD_STEPS.map((step, idx) => {
              const isComplete = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = isComplete || isCurrent;
              const isLast = idx === WIZARD_STEPS.length - 1;

              return (
                <li key={step.id} className={`relative ${isLast ? 'flex-shrink-0' : 'flex-1'}`}>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => isClickable && setCurrentStep(step.id)}
                        disabled={!isClickable}
                        className={`
                          relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200 flex-shrink-0
                          ${isCurrent
                            ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/30 ring-2 ring-gray-400/30'
                            : isComplete
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }
                          ${isClickable ? 'cursor-pointer hover:shadow-lg hover:border-gray-600' : 'cursor-not-allowed'}
                        `}
                      >
                        {isComplete ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.id}</span>
                        )}
                      </button>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-wide text-center whitespace-nowrap ${
                        isCurrent ? 'text-gray-900' : isComplete ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </p>
                    </div>

                    {!isLast && (
                      <div className={`h-0.5 flex-1 -mt-6 transition-colors duration-300 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="px-6 py-5">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-red-500 flex-shrink-0 border border-gray-700 shadow-lg">
            {(() => {
              const StepIcon = WIZARD_STEPS[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5" />;
            })()}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{WIZARD_STEPS[currentStep - 1].name}</h2>
            <p className="text-[10px] text-gray-500">{WIZARD_STEPS[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons - Dark theme */}
        <div className="flex items-center justify-between mt-5 px-1">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-xs font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Step
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              Save Draft
            </button>
            {currentStep < WIZARD_STEPS.length ? (
              <button
                onClick={nextStep}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/20 transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/20 transition-all"
              >
                ✓ Create Playbook
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

