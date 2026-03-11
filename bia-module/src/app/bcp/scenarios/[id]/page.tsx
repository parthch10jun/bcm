'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  BookOpenIcon,
  BeakerIcon,
  CalendarIcon,
  ShieldExclamationIcon,
  ServerIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  FingerPrintIcon,
  ArrowPathIcon,
  DocumentCheckIcon,
  PlayIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CommandLineIcon,
  LinkIcon,
  BoltIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Data source indicator component
const DataSourceBadge = ({ source, tooltip }: { source: string; tooltip?: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getSourceColor = (src: string) => {
    if (src.includes('BIA')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (src.includes('Test')) return 'bg-green-100 text-green-700 border-green-200';
    if (src.includes('CMDB')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (src.includes('Calculated')) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="relative inline-flex">
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium rounded border ${getSourceColor(source)} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <InformationCircleIcon className="h-3 w-3" />
        {source}
      </span>
      {showTooltip && tooltip && (
        <div className="absolute bottom-full left-0 mb-1 z-10 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
};

// Comprehensive IRP data structure based on NIST 800-61 and CISA guidelines
const mockScenarioDetails: Record<string, any> = {
  'IRP-001': {
    id: 'IRP-001',
    name: 'Ransomware Attack Response',
    type: 'Ransomware',
    severity: 'Critical',
    criticality: 98,
    status: 'Active',
    version: '3.2',
    createdDate: '2024-06-15',
    lastUpdated: '2025-11-10',
    approvedBy: 'Board Risk Committee',
    approvalDate: '2025-11-15',
    reviewCycle: 'Quarterly',
    nextReview: '2026-02-15',

    // Overview
    description: 'Comprehensive incident response plan for ransomware attacks including detection, containment, eradication, and recovery procedures. This plan covers encryption events, data exfiltration attempts, double extortion scenarios, and ransom negotiations. Aligned with NIST SP 800-61r3 and CISA Ransomware Guide.',
    objectives: [
      'Detect ransomware activity within 15 minutes of initial execution',
      'Isolate infected systems within 30 minutes of detection',
      'Preserve forensic evidence for investigation and potential prosecution',
      'Restore critical trading operations within 4-hour RTO',
      'Ensure zero data loss through backup restoration (RPO: 15 minutes)',
      'Comply with SEBI 6-hour incident notification requirement'
    ],
    scope: 'All BSE IT infrastructure including trading systems, member portals, market data feeds, clearing & settlement systems, and supporting infrastructure.',
    assumptions: [
      'Backup systems are operational and tested',
      'Network segmentation is properly configured',
      'EDR agents are deployed on all endpoints',
      'Incident response team is available 24/7'
    ],

    // Regulatory & Compliance
    regulatory: [
      { framework: 'SEBI Cyber Security Framework', requirement: 'Incident Response Plan mandatory', compliance: 'Compliant' },
      { framework: 'ISO 27001:2022', requirement: 'A.5.24 - Incident Management', compliance: 'Compliant' },
      { framework: 'CERT-In Guidelines', requirement: '6-hour reporting for cyber incidents', compliance: 'Compliant' },
      { framework: 'RBI IT Framework', requirement: 'Cyber Crisis Management Plan', compliance: 'Compliant' },
      { framework: 'NIST CSF 2.0', requirement: 'RS.AN, RS.CO, RS.MI', compliance: 'Aligned' }
    ],

    // Response Team
    responseTeam: {
      incidentCommander: { name: 'Sarah Johnson', role: 'CISO', phone: '+91 98765 43210', email: 'sarah.johnson@bse.co.in', backup: 'Ahmed Al-Mansouri' },
      technicalLead: { name: 'Rajesh Kumar', role: 'Security Architect', phone: '+91 98765 43211', email: 'rajesh.kumar@bse.co.in', backup: 'Priya Sharma' },
      forensicsLead: { name: 'Vikram Singh', role: 'Digital Forensics', phone: '+91 98765 43212', email: 'vikram.singh@bse.co.in', backup: 'Neha Patel' },
      communicationsLead: { name: 'Anita Desai', role: 'Corp Communications', phone: '+91 98765 43213', email: 'anita.desai@bse.co.in', backup: 'Suresh Menon' },
      legalCounsel: { name: 'Advocate Sharma', role: 'Legal Advisor', phone: '+91 98765 43214', email: 'legal@bse.co.in', backup: 'External Counsel - AZB' },
      teamMembers: [
        { name: 'Mohammed Hassan', role: 'Network Security', availability: '24/7', expertise: 'Network Isolation, Firewall' },
        { name: 'Fatima Al-Rashid', role: 'SOC Lead', availability: '24/7', expertise: 'SIEM, Threat Detection' },
        { name: 'Arjun Reddy', role: 'Systems Admin', availability: 'On-call', expertise: 'Server Recovery, Backup' },
        { name: 'Deepa Nair', role: 'Database Admin', availability: 'On-call', expertise: 'Database Recovery' },
        { name: 'Sanjay Gupta', role: 'Application Support', availability: 'On-call', expertise: 'Trading Systems' }
      ]
    },

    // Escalation Matrix
    escalationMatrix: [
      { level: 1, severity: 'Low', timeframe: '< 30 min', authority: 'SOC Analyst', actions: 'Initial triage, log collection', notification: 'SOC Lead' },
      { level: 2, severity: 'Medium', timeframe: '< 15 min', authority: 'SOC Lead', actions: 'Containment initiation', notification: 'Security Manager' },
      { level: 3, severity: 'High', timeframe: '< 10 min', authority: 'Security Manager', actions: 'Full IR team activation', notification: 'CISO, CTO' },
      { level: 4, severity: 'Critical', timeframe: 'Immediate', authority: 'CISO', actions: 'Crisis management activation', notification: 'CEO, Board, SEBI' }
    ],

    // NIST IR Lifecycle Phases
    phases: {
      preparation: {
        name: 'Preparation',
        status: 'Complete',
        lastReviewed: '2025-11-01',
        activities: [
          { task: 'EDR deployment on all endpoints', status: 'Complete', owner: 'Security Ops', evidence: 'CrowdStrike dashboard - 100% coverage' },
          { task: 'Network segmentation verification', status: 'Complete', owner: 'Network Team', evidence: 'Segmentation test report dated 2025-10-15' },
          { task: 'Backup verification and testing', status: 'Complete', owner: 'Infrastructure', evidence: 'Monthly backup test - 99.9% success rate' },
          { task: 'IR team training completed', status: 'Complete', owner: 'CISO Office', evidence: 'Training certificates on file' },
          { task: 'Communication templates prepared', status: 'Complete', owner: 'Corp Comms', evidence: 'Templates in SharePoint' },
          { task: 'Forensic toolkit ready', status: 'Complete', owner: 'Forensics Lead', evidence: 'Toolkit inventory verified' }
        ],
        tools: ['CrowdStrike Falcon', 'Veeam Backup', 'Palo Alto Cortex XDR', 'Microsoft Sentinel', 'Forensic Workstation']
      },
      detection: {
        name: 'Detection & Analysis',
        targetTime: '15 minutes',
        activities: [
          { step: 1, action: 'EDR alert triggers on suspicious file encryption activity', responsible: 'SOC Analyst', timeframe: 'T+0' },
          { step: 2, action: 'Validate alert - check for false positive indicators', responsible: 'SOC Analyst', timeframe: 'T+2 min' },
          { step: 3, action: 'Identify affected systems and scope of encryption', responsible: 'SOC Lead', timeframe: 'T+5 min' },
          { step: 4, action: 'Determine ransomware variant and TTPs', responsible: 'Threat Intel', timeframe: 'T+10 min' },
          { step: 5, action: 'Check for data exfiltration indicators', responsible: 'SOC Analyst', timeframe: 'T+12 min' },
          { step: 6, action: 'Escalate to Incident Commander if confirmed', responsible: 'SOC Lead', timeframe: 'T+15 min' }
        ],
        indicators: [
          { type: 'File Extension', description: 'Unusual file extensions (.encrypted, .locked, .crypted)', severity: 'High' },
          { type: 'Process Behavior', description: 'Mass file modification by single process', severity: 'Critical' },
          { type: 'Network Traffic', description: 'C2 communication to known malicious IPs', severity: 'Critical' },
          { type: 'Registry Changes', description: 'Persistence mechanisms in Run keys', severity: 'High' },
          { type: 'Shadow Copy', description: 'Deletion of Volume Shadow Copies', severity: 'Critical' },
          { type: 'Ransom Note', description: 'Creation of ransom note files', severity: 'Critical' }
        ]
      },
      containment: {
        name: 'Containment',
        targetTime: '30 minutes',
        shortTerm: [
          { step: 1, action: 'Isolate affected systems from network (EDR network isolation)', responsible: 'SOC Lead', timeframe: 'T+0', automated: true },
          { step: 2, action: 'Block malicious IPs/domains at firewall', responsible: 'Network Security', timeframe: 'T+5 min', automated: true },
          { step: 3, action: 'Disable compromised user accounts', responsible: 'IAM Team', timeframe: 'T+10 min', automated: false },
          { step: 4, action: 'Preserve volatile memory for forensics', responsible: 'Forensics Lead', timeframe: 'T+15 min', automated: false },
          { step: 5, action: 'Take forensic disk images of affected systems', responsible: 'Forensics Lead', timeframe: 'T+20 min', automated: false }
        ],
        longTerm: [
          { step: 1, action: 'Implement additional network segmentation', responsible: 'Network Team', timeframe: 'T+1 hour' },
          { step: 2, action: 'Deploy additional monitoring on unaffected systems', responsible: 'SOC', timeframe: 'T+2 hours' },
          { step: 3, action: 'Reset credentials for potentially compromised accounts', responsible: 'IAM Team', timeframe: 'T+3 hours' },
          { step: 4, action: 'Verify backup integrity before restoration', responsible: 'Infrastructure', timeframe: 'T+4 hours' }
        ]
      },
      eradication: {
        name: 'Eradication',
        targetTime: '4 hours',
        activities: [
          { step: 1, action: 'Identify and remove all malware artifacts', responsible: 'Security Ops', timeframe: 'T+0-2 hours' },
          { step: 2, action: 'Patch exploited vulnerabilities', responsible: 'Patch Management', timeframe: 'T+2-3 hours' },
          { step: 3, action: 'Remove persistence mechanisms', responsible: 'Security Ops', timeframe: 'T+3-4 hours' },
          { step: 4, action: 'Verify complete removal with threat hunting', responsible: 'Threat Intel', timeframe: 'T+4 hours' },
          { step: 5, action: 'Update detection signatures and rules', responsible: 'SOC', timeframe: 'T+4 hours' }
        ]
      },
      recovery: {
        name: 'Recovery',
        targetTime: '4 hours (RTO)',
        activities: [
          { step: 1, action: 'Restore critical trading systems from clean backups', responsible: 'Infrastructure', priority: 'P1', rto: '4 hours' },
          { step: 2, action: 'Restore member portal and API services', responsible: 'Application Team', priority: 'P1', rto: '4 hours' },
          { step: 3, action: 'Restore market data feeds', responsible: 'Data Team', priority: 'P1', rto: '4 hours' },
          { step: 4, action: 'Restore clearing and settlement systems', responsible: 'Operations', priority: 'P1', rto: '4 hours' },
          { step: 5, action: 'Restore supporting systems (email, file shares)', responsible: 'IT Ops', priority: 'P2', rto: '8 hours' },
          { step: 6, action: 'Verify system integrity and functionality', responsible: 'QA Team', priority: 'P1', rto: '4 hours' },
          { step: 7, action: 'Gradual reconnection to network with monitoring', responsible: 'Network Team', priority: 'P1', rto: '4 hours' }
        ],
        validationChecklist: [
          'All critical systems operational',
          'No signs of reinfection',
          'Backup systems verified',
          'User access restored',
          'External connectivity tested',
          'Trading functionality verified'
        ]
      },
      postIncident: {
        name: 'Post-Incident Activities',
        targetTime: '72 hours',
        activities: [
          { task: 'Conduct lessons learned meeting', timeframe: 'Within 72 hours', owner: 'Incident Commander' },
          { task: 'Complete incident report', timeframe: 'Within 5 days', owner: 'Forensics Lead' },
          { task: 'Submit regulatory notifications', timeframe: 'Within 6 hours (SEBI)', owner: 'Compliance' },
          { task: 'Update IRP based on findings', timeframe: 'Within 30 days', owner: 'CISO' },
          { task: 'Conduct additional training if needed', timeframe: 'Within 60 days', owner: 'Security Awareness' },
          { task: 'Implement preventive measures', timeframe: 'Within 90 days', owner: 'Security Ops' }
        ],
        reportingRequirements: [
          { authority: 'SEBI', timeframe: '6 hours', method: 'SEBI Portal + Email', contact: 'sebi-cyber@sebi.gov.in' },
          { authority: 'CERT-In', timeframe: '6 hours', method: 'CERT-In Portal', contact: 'incident@cert-in.org.in' },
          { authority: 'Board of Directors', timeframe: '24 hours', method: 'Emergency Board Meeting', contact: 'Board Secretary' },
          { authority: 'Affected Members', timeframe: '48 hours', method: 'Official Communication', contact: 'Member Relations' }
        ]
      }
    },

    // Linked IT Assets with details
    linkedAssets: [
      { id: 'AST-001', name: 'Primary Trading Servers', type: 'Server', criticality: 'Critical', rto: '4 hours', rpo: '15 min', location: 'Primary DC', owner: 'Trading Ops' },
      { id: 'AST-002', name: 'Database Cluster (Oracle RAC)', type: 'Database', criticality: 'Critical', rto: '4 hours', rpo: '0 min', location: 'Primary DC', owner: 'DBA Team' },
      { id: 'AST-003', name: 'Member Portal Servers', type: 'Server', criticality: 'High', rto: '4 hours', rpo: '15 min', location: 'Primary DC', owner: 'Web Ops' },
      { id: 'AST-004', name: 'Market Data Feed Servers', type: 'Server', criticality: 'Critical', rto: '2 hours', rpo: '0 min', location: 'Primary DC', owner: 'Data Ops' },
      { id: 'AST-005', name: 'Backup Storage (Veeam)', type: 'Storage', criticality: 'Critical', rto: '1 hour', rpo: 'N/A', location: 'DR Site', owner: 'Infrastructure' },
      { id: 'AST-006', name: 'Core Network Switches', type: 'Network', criticality: 'Critical', rto: '1 hour', rpo: 'N/A', location: 'Both DCs', owner: 'Network Ops' },
      { id: 'AST-007', name: 'Firewall Cluster (Palo Alto)', type: 'Security', criticality: 'Critical', rto: '30 min', rpo: 'N/A', location: 'Both DCs', owner: 'Security Ops' },
      { id: 'AST-008', name: 'Domain Controllers', type: 'Server', criticality: 'Critical', rto: '2 hours', rpo: '15 min', location: 'Both DCs', owner: 'IT Ops' }
    ],

    // Linked Business Processes
    linkedProcesses: [
      { id: 'BP-001', name: 'Core Trading Platform', criticality: 'Tier 1', rto: '4 hours', rpo: '15 min', owner: 'Trading Operations', dependencies: ['Database Cluster', 'Network Infrastructure'] },
      { id: 'BP-002', name: 'Member Services Portal', criticality: 'Tier 1', rto: '4 hours', rpo: '1 hour', owner: 'Member Relations', dependencies: ['Web Servers', 'API Gateway'] },
      { id: 'BP-003', name: 'Market Data Dissemination', criticality: 'Tier 1', rto: '2 hours', rpo: '0 min', owner: 'Data Operations', dependencies: ['Feed Servers', 'Network'] },
      { id: 'BP-004', name: 'Clearing & Settlement', criticality: 'Tier 1', rto: '4 hours', rpo: '0 min', owner: 'Clearing Operations', dependencies: ['Database', 'Trading Platform'] },
      { id: 'BP-005', name: 'Regulatory Reporting', criticality: 'Tier 2', rto: '8 hours', rpo: '1 hour', owner: 'Compliance', dependencies: ['Database', 'Reporting Tools'] }
    ],

    // Linked Services/Applications
    linkedServices: [
      { name: 'CrowdStrike Falcon', type: 'EDR', purpose: 'Endpoint detection and response', criticality: 'Critical', contact: 'CrowdStrike TAM' },
      { name: 'Veeam Backup & Replication', type: 'Backup', purpose: 'System and data backup', criticality: 'Critical', contact: 'Veeam Support' },
      { name: 'Palo Alto Cortex XDR', type: 'XDR', purpose: 'Extended detection and response', criticality: 'Critical', contact: 'Palo Alto TAM' },
      { name: 'Microsoft Sentinel', type: 'SIEM', purpose: 'Security monitoring and alerting', criticality: 'Critical', contact: 'Microsoft Premier' },
      { name: 'Splunk Enterprise', type: 'Log Management', purpose: 'Log aggregation and analysis', criticality: 'High', contact: 'Splunk Support' }
    ],

    // Linked Vendors
    linkedVendors: [
      { name: 'CrowdStrike', type: 'Security Vendor', contract: 'Enterprise Agreement', sla: '15 min response for P1', contact: 'support@crowdstrike.com', phone: '+1-888-512-8906' },
      { name: 'Palo Alto Networks', type: 'Security Vendor', contract: 'Premium Support', sla: '30 min response for P1', contact: 'support@paloaltonetworks.com', phone: '+1-866-898-9087' },
      { name: 'Microsoft', type: 'Cloud Provider', contract: 'Premier Support', sla: '1 hour response for Sev A', contact: 'premier@microsoft.com', phone: '+1-800-936-5800' },
      { name: 'Veeam', type: 'Backup Vendor', contract: 'Production Support', sla: '2 hour response for P1', contact: 'support@veeam.com', phone: '+1-614-339-8200' },
      { name: 'AZB & Partners', type: 'Legal Counsel', contract: 'Retainer', sla: '1 hour response', contact: 'cyber@azbpartners.com', phone: '+91-22-6639-6880' }
    ],

    // Communication Plan
    communicationPlan: {
      internal: [
        { audience: 'Executive Leadership', timing: 'Within 30 minutes', method: 'Phone + Email', template: 'EXEC-ALERT-001', owner: 'Incident Commander' },
        { audience: 'IT Staff', timing: 'Within 15 minutes', method: 'Teams + SMS', template: 'IT-ALERT-001', owner: 'Technical Lead' },
        { audience: 'All Employees', timing: 'Within 2 hours', method: 'Email + Intranet', template: 'EMP-ALERT-001', owner: 'Communications Lead' },
        { audience: 'Board of Directors', timing: 'Within 4 hours', method: 'Phone + Email', template: 'BOARD-ALERT-001', owner: 'CEO/CISO' }
      ],
      external: [
        { audience: 'SEBI', timing: 'Within 6 hours', method: 'SEBI Portal + Email', template: 'REG-NOTIFY-001', owner: 'Compliance' },
        { audience: 'CERT-In', timing: 'Within 6 hours', method: 'CERT-In Portal', template: 'CERT-NOTIFY-001', owner: 'Security Ops' },
        { audience: 'Members/Customers', timing: 'Within 24 hours', method: 'Email + Portal Notice', template: 'MEMBER-NOTIFY-001', owner: 'Member Relations' },
        { audience: 'Media', timing: 'As needed', method: 'Press Release', template: 'MEDIA-STMT-001', owner: 'Corp Communications' }
      ]
    },

    // Testing Information
    playbook: 'PB-001 - Ransomware Response Playbook',
    lastTested: '2025-10-15',
    nextTest: '2026-01-15',
    testFrequency: 'Quarterly',
    testHistory: [
      { id: 'TEST-001', date: '2025-10-15', type: 'Full Simulation', result: 'Passed', duration: '6h 45m', participants: 28, findings: 2, rtoAchieved: '3h 52m', rpoAchieved: '12 min' },
      { id: 'TEST-002', date: '2025-07-10', type: 'Tabletop Exercise', result: 'Passed with Deviations', duration: '3h 30m', participants: 15, findings: 5, rtoAchieved: 'N/A', rpoAchieved: 'N/A' },
      { id: 'TEST-003', date: '2025-04-05', type: 'Walkthrough', result: 'Passed', duration: '2h 15m', participants: 12, findings: 1, rtoAchieved: 'N/A', rpoAchieved: 'N/A' },
      { id: 'TEST-004', date: '2025-01-20', type: 'Full Simulation', result: 'Passed', duration: '7h 10m', participants: 25, findings: 4, rtoAchieved: '4h 05m', rpoAchieved: '14 min' }
    ],

    // Metrics
    metrics: {
      mttr: '3h 52m',
      mttd: '8 min',
      mttc: '22 min',
      successRate: '100%',
      lastIncident: null,
      testsCompleted: 4,
      findingsResolved: 12,
      findingsOpen: 0
    },

    // CROSS-MODULE LINKING
    // Linked IT DR Plans (activated when systems need restoration)
    linkedDRPlans: [
      {
        id: 'DR-001',
        name: 'SAP ERP System Recovery',
        status: 'Approved',
        rto: '4 hours',
        rpo: '15 min',
        siteType: 'HOT',
        triggerCondition: 'When ransomware affects trading systems',
        lastTested: '2025-09-15',
        link: '/it-dr-plans/DR-001'
      },
      {
        id: 'DR-004',
        name: 'Database Cluster Failover',
        status: 'Validated',
        rto: '2 hours',
        rpo: '0 min',
        siteType: 'HOT',
        triggerCondition: 'When database servers are encrypted',
        lastTested: '2025-10-01',
        link: '/it-dr-plans/DR-004'
      },
      {
        id: 'DR-005',
        name: 'Network Infrastructure Recovery',
        status: 'Validated',
        rto: '1 hour',
        rpo: 'N/A',
        siteType: 'WARM',
        triggerCondition: 'When network devices are compromised',
        lastTested: '2025-08-20',
        link: '/it-dr-plans/DR-005'
      }
    ],

    // Linked Crisis Playbooks (activated when severity escalates)
    linkedCrisisPlaybooks: [
      {
        id: 'CP-001',
        name: 'Ransomware Crisis Playbook',
        status: 'Active',
        severity: 'Critical',
        triggerCondition: 'When data exfiltration confirmed OR ransom demand received',
        activates: 'Crisis Management Team',
        regulatory: true,
        lastUpdated: '2025-11-01',
        link: '/crisis-management/playbooks/CP-001'
      },
      {
        id: 'CP-003',
        name: 'Regulatory Escalation Playbook',
        status: 'Active',
        severity: 'High',
        triggerCondition: 'When SEBI/CERT-In notification required',
        activates: 'Compliance & Legal',
        regulatory: true,
        lastUpdated: '2025-10-15',
        link: '/crisis-management/playbooks/CP-003'
      }
    ],

    // Cyber Runbooks (step-by-step procedures for this IRP)
    cyberRunbooks: [
      {
        id: 'CRB-001',
        name: 'Ransomware Isolation Runbook',
        category: 'Containment',
        status: 'Ready',
        steps: 24,
        estimatedTime: '45 min',
        lastUpdated: '2025-11-10',
        automated: true,
        owner: 'SOC Lead',
        phase: 'Containment',
        link: '/bcp/runbooks/CRB-001'
      },
      {
        id: 'CRB-002',
        name: 'Forensic Evidence Collection',
        category: 'Investigation',
        status: 'Ready',
        steps: 32,
        estimatedTime: '2 hours',
        lastUpdated: '2025-10-25',
        automated: false,
        owner: 'Forensics Lead',
        phase: 'Detection & Analysis',
        link: '/bcp/runbooks/CRB-002'
      },
      {
        id: 'CRB-003',
        name: 'Credential Reset Procedures',
        category: 'Eradication',
        status: 'Ready',
        steps: 18,
        estimatedTime: '1 hour',
        lastUpdated: '2025-11-05',
        automated: true,
        owner: 'IAM Team',
        phase: 'Eradication',
        link: '/bcp/runbooks/CRB-003'
      },
      {
        id: 'CRB-004',
        name: 'SEBI/CERT-In Notification Runbook',
        category: 'Compliance',
        status: 'Ready',
        steps: 12,
        estimatedTime: '30 min',
        lastUpdated: '2025-11-01',
        automated: false,
        owner: 'Compliance',
        phase: 'Post-Incident',
        link: '/bcp/runbooks/CRB-004'
      }
    ],

    // Escalation Triggers (automatic escalation conditions)
    escalationTriggers: [
      {
        id: 'ET-001',
        name: 'Escalate to IT DR',
        condition: 'Systems encrypted > 5 OR Critical asset affected',
        targetPlan: 'IT DR Plan',
        targetPlanId: 'DR-001',
        autoActivate: true,
        notifyRoles: ['IT Ops Manager', 'Infrastructure Lead'],
        timeframe: 'Immediate',
        status: 'Active'
      },
      {
        id: 'ET-002',
        name: 'Escalate to Crisis Management',
        condition: 'Data exfiltration confirmed OR Ransom demand received OR Media attention',
        targetPlan: 'Crisis Playbook',
        targetPlanId: 'CP-001',
        autoActivate: true,
        notifyRoles: ['CEO', 'CFO', 'Board Risk Committee', 'Legal Counsel'],
        timeframe: 'Within 15 min',
        status: 'Active'
      },
      {
        id: 'ET-003',
        name: 'Regulatory Notification',
        condition: 'Incident confirmed as cyber attack affecting operations',
        targetPlan: 'SEBI/CERT-In Notification',
        targetPlanId: 'CRB-004',
        autoActivate: true,
        notifyRoles: ['Compliance Officer', 'CISO', 'CEO'],
        timeframe: 'Within 6 hours (regulatory)',
        status: 'Active'
      },
      {
        id: 'ET-004',
        name: 'Activate Business Continuity',
        condition: 'Trading systems offline > 30 min OR Member portal unavailable',
        targetPlan: 'Business Continuity Plan',
        targetPlanId: 'BCP-001',
        autoActivate: false,
        notifyRoles: ['COO', 'Business Unit Heads'],
        timeframe: 'Within 30 min',
        status: 'Active'
      }
    ],

    owner: 'Sarah Johnson - CISO'
  },
  'IRP-002': {
    id: 'IRP-002',
    name: 'Data Breach Containment',
    type: 'Data Breach',
    description: 'Response procedures for data breach incidents including PII/sensitive data exposure, unauthorized access detection, forensic investigation, and regulatory notification protocols.',
    objectives: 'Ensure rapid containment of data breach, proper evidence preservation, and compliance with SEBI 6-hour notification requirement.',
    severity: 'Critical',
    criticality: 95,
    regulatory: 'SEBI Circular, IT Act 2000, DPDP Act 2023',
    status: 'Active',
    version: '2.4',
    createdDate: '2024-08-20',
    lastUpdated: '2025-10-25',
    owner: 'Ahmed Al-Mansouri - Security Ops',
    linkedProcesses: ['Member Data Management', 'KYC Processing', 'Trade Reporting', 'Regulatory Compliance'],
    linkedServices: ['Splunk SIEM', 'DLP Gateway', 'IAM System', 'Audit Log Server'],
    linkedAssets: ['Database Servers', 'File Servers', 'Email Gateway', 'API Gateway'],
    linkedVendors: ['Splunk', 'Symantec', 'Okta', 'Legal Counsel - AZB'],
    playbook: 'PB-002 - Data Breach Response Playbook',
    lastTested: '2025-09-20',
    nextTest: '2025-12-20',
    testHistory: [
      { date: '2025-09-20', type: 'Full Simulation', result: 'Passed', duration: '5h 30m' },
      { date: '2025-06-15', type: 'Tabletop', result: 'Passed', duration: '4h 00m' }
    ]
  },
  'IRP-003': {
    id: 'IRP-003',
    name: 'DDoS Attack Mitigation',
    type: 'DDoS Attack',
    description: 'Mitigation procedures for volumetric, protocol, and application-layer DDoS attacks targeting trading infrastructure, member portals, and market data feeds.',
    objectives: 'Maintain trading operations during DDoS attack with <1% packet loss and <100ms additional latency through traffic scrubbing and CDN failover.',
    severity: 'High',
    criticality: 88,
    regulatory: 'SEBI Cyber Framework',
    status: 'Active',
    version: '2.1',
    createdDate: '2024-05-10',
    lastUpdated: '2025-09-15',
    owner: 'Mohammed Hassan - Network Security',
    linkedProcesses: ['Trading Gateway', 'Member Portal', 'Market Data Feed', 'API Services'],
    linkedServices: ['Akamai Prolexic', 'Cloudflare', 'Palo Alto Firewall', 'F5 Load Balancer'],
    linkedAssets: ['Edge Routers', 'Firewall Cluster', 'Load Balancers', 'DNS Servers'],
    linkedVendors: ['Akamai', 'Cloudflare', 'Palo Alto', 'F5 Networks'],
    playbook: 'PB-003 - DDoS Mitigation Playbook',
    lastTested: '2025-08-10',
    nextTest: '2026-02-10',
    testHistory: [
      { date: '2025-08-10', type: 'Full Simulation', result: 'Passed', duration: '4h 15m' },
      { date: '2025-05-05', type: 'Functional Test', result: 'Passed', duration: '2h 30m' }
    ]
  },
  'IRP-004': {
    id: 'IRP-004',
    name: 'Insider Threat Response',
    type: 'Insider Threat',
    description: 'Response procedures for malicious insider activities including unauthorized data access, privilege abuse, sabotage attempts, and collusion with external actors.',
    objectives: 'Detect and respond to insider threats while preserving evidence for potential legal action and minimizing operational disruption.',
    severity: 'High',
    criticality: 82,
    regulatory: 'SEBI Cyber Framework, Prevention of Fraud',
    status: 'Under Review',
    version: '1.8',
    createdDate: '2024-09-01',
    lastUpdated: '2025-08-20',
    owner: 'Fatima Al-Rashid - SOC Lead',
    linkedProcesses: ['Access Management', 'Privileged Operations', 'Data Handling', 'HR Offboarding'],
    linkedServices: ['UEBA Platform', 'DLP System', 'PAM Solution', 'HR Management System'],
    linkedAssets: ['All Critical Servers', 'Database Systems', 'Source Code Repos', 'Financial Systems'],
    linkedVendors: ['Securonix', 'CyberArk', 'Varonis', 'Legal - Internal Counsel'],
    playbook: 'PB-004 - Insider Threat Playbook',
    lastTested: '2025-07-05',
    nextTest: '2025-12-05',
    testHistory: [
      { date: '2025-07-05', type: 'Tabletop', result: 'Passed with Deviations', duration: '3h 45m' },
      { date: '2025-03-15', type: 'Walkthrough', result: 'Passed', duration: '2h 00m' }
    ]
  },
  'IRP-005': {
    id: 'IRP-005',
    name: 'Zero-Day Exploit Response',
    type: 'Zero-Day',
    description: 'Emergency response procedures for zero-day vulnerabilities affecting critical infrastructure, including rapid patching, compensating controls, and threat hunting.',
    objectives: 'Implement compensating controls within 2 hours of zero-day disclosure and complete patching of critical systems within 24 hours.',
    severity: 'Critical',
    criticality: 92,
    regulatory: 'SEBI Cyber Framework, CERT-In Guidelines',
    status: 'Active',
    version: '2.0',
    createdDate: '2024-07-20',
    lastUpdated: '2025-11-01',
    owner: 'Khalid bin Salman - Threat Intel',
    linkedProcesses: ['Vulnerability Management', 'Patch Management', 'Threat Intelligence', 'Security Monitoring'],
    linkedServices: ['Qualys VMDR', 'CrowdStrike Falcon', 'Recorded Future', 'WSUS/SCCM'],
    linkedAssets: ['All Servers', 'Workstations', 'Network Devices', 'Security Appliances'],
    linkedVendors: ['Qualys', 'CrowdStrike', 'Recorded Future', 'Microsoft'],
    playbook: 'PB-005 - Zero-Day Response Playbook',
    lastTested: '2025-11-01',
    nextTest: '2026-02-01',
    testHistory: [
      { date: '2025-11-01', type: 'Full Simulation', result: 'Passed', duration: '5h 00m' },
      { date: '2025-08-15', type: 'Tabletop', result: 'Passed', duration: '3h 00m' }
    ]
  },
  'IRP-006': {
    id: 'IRP-006',
    name: 'Phishing Campaign Response',
    type: 'Phishing',
    description: 'Response procedures for phishing attacks including spear-phishing, business email compromise (BEC), and credential harvesting campaigns targeting employees and members.',
    objectives: 'Identify and contain phishing campaigns within 1 hour, reset compromised credentials, and notify affected parties.',
    severity: 'Medium',
    criticality: 75,
    regulatory: 'SEBI Cyber Framework',
    status: 'Draft',
    version: '1.0',
    createdDate: '2025-01-10',
    lastUpdated: '2025-10-05',
    owner: 'Lisa Chen - Security Awareness',
    linkedProcesses: ['Email Security', 'User Awareness', 'Credential Management', 'Incident Reporting'],
    linkedServices: ['Proofpoint', 'Microsoft Defender', 'Okta MFA', 'ServiceNow'],
    linkedAssets: ['Email Gateway', 'Exchange Servers', 'User Workstations', 'VPN Gateway'],
    linkedVendors: ['Proofpoint', 'Microsoft', 'Okta', 'KnowBe4'],
    playbook: 'PB-006 - Phishing Response Playbook',
    lastTested: null,
    nextTest: '2026-03-01',
    testHistory: []
  }
};

// Helper function to check if scenario has comprehensive data
const hasComprehensiveData = (scenario: any) => {
  return scenario.phases && scenario.responseTeam && scenario.escalationMatrix;
};

export default function BCPScenarioDetailPage() {
  const params = useParams();
  const scenarioId = params.id as string;
  const scenario = mockScenarioDetails[scenarioId as keyof typeof mockScenarioDetails];

  const [activeTab, setActiveTab] = useState<'overview' | 'response' | 'team' | 'resources' | 'communication' | 'testing' | 'linkages' | 'runbooks'>('overview');

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Scenario not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested incident response scenario does not exist.</p>
          <Link href="/bcp" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            ← Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  const isComprehensive = hasComprehensiveData(scenario);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Under Review': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Draft': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName) {
      case 'Preparation': return <Cog6ToothIcon className="h-5 w-5" />;
      case 'Detection & Analysis': return <MagnifyingGlassIcon className="h-5 w-5" />;
      case 'Containment': return <ShieldCheckIcon className="h-5 w-5" />;
      case 'Eradication': return <FingerPrintIcon className="h-5 w-5" />;
      case 'Recovery': return <ArrowPathIcon className="h-5 w-5" />;
      case 'Post-Incident Activities': return <DocumentCheckIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">{scenario.name}</h1>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(scenario.status)}`}>
                    {scenario.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getSeverityColor(scenario.severity)}`}>
                    {scenario.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{scenario.id} • Version {scenario.version}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
              <Link
                href={`/bcp/tests/new?scenario=${scenario.id}&mode=schedule`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-50 transition-colors"
              >
                <CalendarIcon className="h-4 w-4" />
                Schedule Test
              </Link>
              <Link
                href={`/bcp/tests/new?scenario=${scenario.id}&mode=initiate`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700 transition-colors shadow-sm"
              >
                <BeakerIcon className="h-4 w-4" />
                Initiate Test Now
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <DocumentTextIcon className="h-4 w-4" />
                Overview
              </span>
            </button>
            {isComprehensive && (
              <>
                <button
                  onClick={() => setActiveTab('response')}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'response'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Response Phases
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'team'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserGroupIcon className="h-4 w-4" />
                    Team & Escalation
                  </span>
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'resources'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ServerIcon className="h-4 w-4" />
                Linked Resources
              </span>
            </button>
            {isComprehensive && (
              <button
                onClick={() => setActiveTab('communication')}
                className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'communication'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BellAlertIcon className="h-4 w-4" />
                  Communication
                </span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('testing')}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'testing'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BeakerIcon className="h-4 w-4" />
                Testing History
              </span>
            </button>
            {isComprehensive && scenario.linkedDRPlans && (
              <>
                <button
                  onClick={() => setActiveTab('linkages')}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'linkages'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4" />
                    Plan Linkages
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('runbooks')}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'runbooks'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CommandLineIcon className="h-4 w-4" />
                    Cyber Runbooks
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Description & Objectives */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Plan Overview</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-xs text-gray-900 leading-relaxed">{scenario.description}</p>
                  </div>
                  {isComprehensive && scenario.objectives && Array.isArray(scenario.objectives) ? (
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Objectives</p>
                      <ul className="space-y-1.5">
                        {scenario.objectives.map((obj: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-900">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Objectives</p>
                      <p className="text-xs text-gray-900">{scenario.objectives}</p>
                    </div>
                  )}
                  {isComprehensive && scenario.scope && (
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Scope</p>
                      <p className="text-xs text-gray-900">{scenario.scope}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Dashboard - Only for comprehensive scenarios */}
              {isComprehensive && scenario.metrics && (
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Performance Metrics</h2>
                    <DataSourceBadge
                      source="Test History"
                      tooltip="Metrics calculated from historical test executions and actual incident data."
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded-sm text-center relative group">
                      <p className="text-[10px] uppercase font-medium text-gray-500">MTTD</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{scenario.metrics.mttd}</p>
                      <p className="text-[10px] text-gray-500">Mean Time to Detect</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-40 p-2 bg-gray-900 text-white text-[9px] rounded shadow-lg">
                        Average detection time from last 5 tests. Target: &lt;15 min
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-sm text-center relative group">
                      <p className="text-[10px] uppercase font-medium text-gray-500">MTTC</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{scenario.metrics.mttc}</p>
                      <p className="text-[10px] text-gray-500">Mean Time to Contain</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-40 p-2 bg-gray-900 text-white text-[9px] rounded shadow-lg">
                        Average containment time from last 5 tests. Target: &lt;2 hours
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-sm text-center relative group">
                      <p className="text-[10px] uppercase font-medium text-gray-500">MTTR</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{scenario.metrics.mttr}</p>
                      <p className="text-[10px] text-gray-500">Mean Time to Recover</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-40 p-2 bg-gray-900 text-white text-[9px] rounded shadow-lg">
                        Average recovery time. Must meet RTO of linked processes.
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-sm text-center relative group">
                      <p className="text-[10px] uppercase font-medium text-gray-500">Success Rate</p>
                      <p className="text-lg font-semibold text-green-600 mt-1">{scenario.metrics.successRate}</p>
                      <p className="text-[10px] text-gray-500">Test Pass Rate</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-40 p-2 bg-gray-900 text-white text-[9px] rounded shadow-lg">
                        Passed tests / Total tests. Based on {scenario.testHistory?.length || 0} historical tests.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regulatory Compliance - Only for comprehensive scenarios */}
              {isComprehensive && scenario.regulatory && Array.isArray(scenario.regulatory) && (
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Regulatory Compliance</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Framework</th>
                          <th className="w-[50%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Requirement</th>
                          <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {scenario.regulatory.map((reg: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 text-xs text-gray-900 font-medium">{reg.framework}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{reg.requirement}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                                reg.compliance === 'Compliant' ? 'text-green-700 bg-green-50 border-green-200' : 'text-blue-700 bg-blue-50 border-blue-200'
                              }`}>
                                {reg.compliance}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Criticality Assessment */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Criticality Assessment</h2>
                  <DataSourceBadge
                    source="Calculated"
                    tooltip="Criticality = MAX of all linked process/asset criticalities. Score derived from BIA records."
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase font-medium text-gray-500">Criticality Score</p>
                      <span className="text-sm font-semibold text-gray-900">{scenario.criticality}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${scenario.criticality >= 90 ? 'bg-red-600' : scenario.criticality >= 75 ? 'bg-orange-600' : scenario.criticality >= 50 ? 'bg-amber-600' : 'bg-green-600'}`}
                        style={{ width: `${scenario.criticality}%` }}
                      />
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="bg-gray-50 rounded-sm p-3 border border-gray-100">
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">How This Score is Calculated</p>
                    <div className="space-y-2 text-[10px] text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">1.</span>
                        <span><strong>Linked Processes:</strong> MAX criticality from {isComprehensive ? scenario.linkedProcesses?.length || 0 : 'N/A'} linked processes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">2.</span>
                        <span><strong>Linked Assets:</strong> MAX criticality from {isComprehensive ? scenario.linkedAssets?.length || 0 : 'N/A'} linked IT assets</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">3.</span>
                        <span><strong>RTO Impact:</strong> Lower RTO = Higher criticality weight</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">4.</span>
                        <span><strong>Regulatory:</strong> SEBI/CERT-In requirements add +10% to score</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-[10px] text-gray-500">
                        <InformationCircleIcon className="h-3 w-3 inline mr-1" />
                        Data sourced from: BIA Module, CMDB, Compliance Registry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Metadata */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Plan Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Owner</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.owner}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Type</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Version</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.version}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Created</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Last Updated</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.lastUpdated}</p>
                  </div>
                  {isComprehensive && scenario.approvedBy && (
                    <>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500">Approved By</p>
                        <p className="text-xs text-gray-900 mt-1">{scenario.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500">Review Cycle</p>
                        <p className="text-xs text-gray-900 mt-1">{scenario.reviewCycle}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Testing Schedule */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Testing Schedule</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Last Tested</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.lastTested || 'Not yet tested'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500">Next Test</p>
                    <p className="text-xs text-gray-900 mt-1">{scenario.nextTest}</p>
                  </div>
                  {isComprehensive && scenario.testFrequency && (
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500">Test Frequency</p>
                      <p className="text-xs text-gray-900 mt-1">{scenario.testFrequency}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Associated Playbook */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Associated Playbook</h2>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{scenario.playbook}</p>
                      <Link href="/bcp/playbooks/PB-001" className="text-[10px] text-blue-600 hover:text-blue-800">
                        View Playbook →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Phases Tab - NIST IR Lifecycle */}
        {activeTab === 'response' && isComprehensive && scenario.phases && (
          <div className="space-y-6">
            {/* Phase Timeline */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">NIST Incident Response Lifecycle</h2>
              <div className="flex items-center justify-between">
                {['Preparation', 'Detection & Analysis', 'Containment', 'Eradication', 'Recovery', 'Post-Incident Activities'].map((phase, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {getPhaseIcon(phase)}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1 text-center max-w-[80px]">{phase}</p>
                    </div>
                    {idx < 5 && <ArrowRightIcon className="h-4 w-4 text-gray-400 mx-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Detection & Analysis Phase */}
            {scenario.phases.detection && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Detection & Analysis</h2>
                  </div>
                  <span className="text-xs text-gray-500">Target: {scenario.phases.detection.targetTime}</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-3">Detection Steps</p>
                    <div className="space-y-2">
                      {scenario.phases.detection.activities.map((activity: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">{activity.step}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-900">{activity.action}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{activity.responsible} • {activity.timeframe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-3">Indicators of Compromise (IOCs)</p>
                    <div className="space-y-2">
                      {scenario.phases.detection.indicators.map((ioc: any, idx: number) => (
                        <div key={idx} className="p-2 border border-gray-200 rounded-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-900">{ioc.type}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${ioc.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{ioc.severity}</span>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-1">{ioc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Containment Phase */}
            {scenario.phases.containment && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Containment</h2>
                  </div>
                  <span className="text-xs text-gray-500">Target: {scenario.phases.containment.targetTime}</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-3">Short-Term Containment</p>
                    <div className="space-y-2">
                      {scenario.phases.containment.shortTerm.map((action: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-orange-50 rounded-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-medium flex items-center justify-center">{action.step}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-900">{action.action}</p>
                              {action.automated && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-sm">Automated</span>}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">{action.responsible} • {action.timeframe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-medium text-gray-500 mb-3">Long-Term Containment</p>
                    <div className="space-y-2">
                      {scenario.phases.containment.longTerm.map((action: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-medium flex items-center justify-center">{action.step}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-900">{action.action}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{action.responsible} • {action.timeframe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recovery Phase */}
            {scenario.phases.recovery && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="h-5 w-5 text-green-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Recovery</h2>
                  </div>
                  <span className="text-xs text-gray-500">Target RTO: {scenario.phases.recovery.targetTime}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[5%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">#</th>
                        <th className="w-[40%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Recovery Action</th>
                        <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Responsible</th>
                        <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Priority</th>
                        <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RTO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scenario.phases.recovery.activities.map((activity: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-xs text-gray-900">{activity.step}</td>
                          <td className="px-3 py-2 text-xs text-gray-900">{activity.action}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{activity.responsible}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${activity.priority === 'P1' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{activity.priority}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{activity.rto}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team & Escalation Tab */}
        {activeTab === 'team' && isComprehensive && scenario.responseTeam && (
          <div className="space-y-6">
            {/* Core Response Team */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Core Response Team</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { role: 'Incident Commander', data: scenario.responseTeam.incidentCommander },
                  { role: 'Technical Lead', data: scenario.responseTeam.technicalLead },
                  { role: 'Forensics Lead', data: scenario.responseTeam.forensicsLead },
                  { role: 'Communications Lead', data: scenario.responseTeam.communicationsLead },
                  { role: 'Legal Counsel', data: scenario.responseTeam.legalCounsel }
                ].map((member, idx) => (
                  <div key={idx} className="p-3 border border-gray-200 rounded-sm">
                    <p className="text-[10px] uppercase font-medium text-gray-500">{member.role}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{member.data.name}</p>
                    <p className="text-xs text-gray-600">{member.data.role}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <PhoneIcon className="h-3 w-3" />
                        <span>{member.data.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <EnvelopeIcon className="h-3 w-3" />
                        <span>{member.data.email}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">Backup: {member.data.backup}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Team */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Extended Response Team</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Name</th>
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Role</th>
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Expertise</th>
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenario.responseTeam.teamMembers.map((member: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-xs text-gray-900 font-medium">{member.name}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{member.role}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{member.expertise}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${member.availability === '24/7' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{member.availability}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Escalation Matrix */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Escalation Matrix</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Level</th>
                      <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Severity</th>
                      <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Timeframe</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Authority</th>
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Actions</th>
                      <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Notify</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenario.escalationMatrix.map((level: any, idx: number) => (
                      <tr key={idx} className={level.severity === 'Critical' ? 'bg-red-50' : ''}>
                        <td className="px-3 py-2 text-xs font-medium text-gray-900">L{level.level}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                            level.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                            level.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            level.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>{level.severity}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">{level.timeframe}</td>
                        <td className="px-3 py-2 text-xs text-gray-900">{level.authority}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{level.actions}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{level.notification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Data Source Summary Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-medium text-gray-900">Linked Resources Summary</h3>
                  <p className="text-[10px] text-gray-600 mt-1">
                    Resources linked to this IRP determine RTO/RPO requirements and criticality scoring.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">From BIA Module</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-gray-600">From CMDB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">From Vendor Registry</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IT Assets - Comprehensive view */}
            {isComprehensive && Array.isArray(scenario.linkedAssets) && scenario.linkedAssets[0]?.id ? (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ServerIcon className="h-5 w-5 text-purple-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Linked IT Assets</h2>
                    <span className="text-[10px] text-gray-500">({scenario.linkedAssets.length} assets)</span>
                  </div>
                  <DataSourceBadge
                    source="BIA + CMDB"
                    tooltip="Assets linked from BIA records and Configuration Management Database. RTO/RPO values inherited from BIA."
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
                        <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Asset Name</th>
                        <th className="w-[12%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Type</th>
                        <th className="w-[12%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Criticality</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RTO</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RPO</th>
                        <th className="w-[21%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scenario.linkedAssets.map((asset: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-purple-600 font-medium">{asset.id}</td>
                          <td className="px-3 py-2 text-xs text-gray-900">{asset.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{asset.type}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${asset.criticality === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{asset.criticality}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{asset.rto}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{asset.rpo}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{asset.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Linked Assets</h2>
                <div className="grid grid-cols-4 gap-2">
                  {scenario.linkedAssets.map((asset: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded-sm text-xs text-gray-900">{typeof asset === 'string' ? asset : asset.name}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Processes - Comprehensive view */}
            {isComprehensive && Array.isArray(scenario.linkedProcesses) && scenario.linkedProcesses[0]?.id ? (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Linked Business Processes</h2>
                    <span className="text-[10px] text-gray-500">({scenario.linkedProcesses.length} processes)</span>
                  </div>
                  <DataSourceBadge
                    source="BIA Module"
                    tooltip="Processes linked from Business Impact Analysis. RTO/RPO and criticality tiers defined in BIA records."
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
                        <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Process Name</th>
                        <th className="w-[12%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Criticality</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RTO</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RPO</th>
                        <th className="w-[33%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Dependencies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scenario.linkedProcesses.map((process: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-blue-600 font-medium">{process.id}</td>
                          <td className="px-3 py-2 text-xs text-gray-900">{process.name}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${process.criticality === 'Tier 1' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{process.criticality}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{process.rto}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{process.rpo}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{process.dependencies?.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Linked Processes</h2>
                  <DataSourceBadge source="Manual Entry" tooltip="Processes manually linked. Consider linking from BIA for RTO/RPO data." />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {scenario.linkedProcesses.map((process: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded-sm text-xs text-gray-900">{typeof process === 'string' ? process : process.name}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendors - Comprehensive view */}
            {isComprehensive && Array.isArray(scenario.linkedVendors) && scenario.linkedVendors[0]?.name ? (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-green-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Linked Vendors & Support</h2>
                    <span className="text-[10px] text-gray-500">({scenario.linkedVendors.length} vendors)</span>
                  </div>
                  <DataSourceBadge
                    source="Vendor Registry"
                    tooltip="Vendors linked from Vendor Management module. SLA and contract details from vendor records."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {scenario.linkedVendors.map((vendor: any, idx: number) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-sm hover:border-green-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-sm">{vendor.type}</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><span className="font-medium">Contract:</span> {vendor.contract}</p>
                        <p><span className="font-medium">SLA:</span> {vendor.sla}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <EnvelopeIcon className="h-3 w-3" />
                          <span>{vendor.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-3 w-3" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Linked Vendors</h2>
                  <DataSourceBadge source="Manual Entry" tooltip="Vendors manually linked. Consider linking from Vendor Registry for SLA data." />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {scenario.linkedVendors.map((vendor: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded-sm text-xs text-gray-900">{typeof vendor === 'string' ? vendor : vendor.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && isComprehensive && scenario.communicationPlan && (
          <div className="space-y-6">
            {/* Internal Communications */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Internal Communications</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Audience</th>
                      <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Timing</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Method</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Template</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenario.communicationPlan.internal.map((comm: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-xs text-gray-900 font-medium">{comm.audience}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{comm.timing}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{comm.method}</td>
                        <td className="px-3 py-2 text-xs text-blue-600">{comm.template}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{comm.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* External Communications */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">External Communications & Regulatory Notifications</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[25%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Audience</th>
                      <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Timing</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Method</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Template</th>
                      <th className="w-[20%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenario.communicationPlan.external.map((comm: any, idx: number) => (
                      <tr key={idx} className={comm.audience === 'SEBI' || comm.audience === 'CERT-In' ? 'bg-red-50' : ''}>
                        <td className="px-3 py-2 text-xs text-gray-900 font-medium">{comm.audience}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${comm.timing.includes('6 hours') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{comm.timing}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">{comm.method}</td>
                        <td className="px-3 py-2 text-xs text-blue-600">{comm.template}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{comm.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-6">
            {/* Test Metrics Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-900">Test Performance Summary</h3>
                <DataSourceBadge
                  source="Test Execution"
                  tooltip="Metrics calculated from actual test executions. MTTD, MTTC, MTTR derived from test results."
                />
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Total Tests</p>
                  <p className="text-lg font-semibold text-gray-900">{scenario.testHistory?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Pass Rate</p>
                  <p className="text-lg font-semibold text-green-600">
                    {scenario.testHistory?.length ?
                      Math.round((scenario.testHistory.filter((t: any) => t.result === 'Passed').length / scenario.testHistory.length) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Last Test</p>
                  <p className="text-sm font-medium text-gray-900">{scenario.lastTested || 'Never'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Next Scheduled</p>
                  <p className="text-sm font-medium text-gray-900">{scenario.nextTest || 'Not scheduled'}</p>
                </div>
              </div>
            </div>

            {/* Test Summary - for comprehensive scenarios */}
            {isComprehensive && scenario.testHistory && scenario.testHistory[0]?.rtoAchieved && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Test History</h2>
                  <DataSourceBadge
                    source="BCP Tests Module"
                    tooltip="Test records from BCP Testing module. RTO/RPO achieved values measured during test execution."
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Test ID</th>
                        <th className="w-[12%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Date</th>
                        <th className="w-[18%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Type</th>
                        <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Result</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Duration</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RTO</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RPO</th>
                        <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scenario.testHistory.map((test: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-xs text-blue-600 font-medium">{test.id}</td>
                          <td className="px-3 py-2 text-xs text-gray-900">{test.date}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{test.type}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${test.result === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{test.result}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{test.duration}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{test.rtoAchieved}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{test.rpoAchieved}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{test.findings} findings</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Simple test history for non-comprehensive scenarios */}
            {(!isComprehensive || !scenario.testHistory?.[0]?.rtoAchieved) && scenario.testHistory && scenario.testHistory.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Test History</h2>
                <div className="space-y-3">
                  {scenario.testHistory.map((test: any, idx: number) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-900">{test.date}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                          test.result === 'Passed' ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {test.result}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Type: {test.type}</span>
                        <span>Duration: {test.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No tests message */}
            {(!scenario.testHistory || scenario.testHistory.length === 0) && (
              <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
                <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No tests have been conducted yet.</p>
                <Link
                  href={`/bcp/tests/new?scenario=${scenario.id}&mode=schedule`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800"
                >
                  <PlayIcon className="h-4 w-4" />
                  Schedule First Test
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Plan Linkages Tab */}
        {activeTab === 'linkages' && isComprehensive && scenario.linkedDRPlans && (
          <div className="space-y-6">
            {/* Escalation Flow Visualization */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <BoltIcon className="h-5 w-5 text-orange-600" />
                <h2 className="text-sm font-semibold text-gray-900">Escalation Flow</h2>
              </div>
              <div className="flex items-center justify-between bg-white rounded-sm p-4 border border-orange-100">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="mt-1 font-medium text-gray-900">IRP</span>
                    <span className="text-[10px] text-gray-500">Current</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <ServerIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="mt-1 font-medium text-gray-900">IT DR</span>
                    <span className="text-[10px] text-gray-500">{scenario.linkedDRPlans.length} Plans</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="mt-1 font-medium text-gray-900">Crisis</span>
                    <span className="text-[10px] text-gray-500">{scenario.linkedCrisisPlaybooks?.length || 0} Playbooks</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 max-w-xs">
                  <p className="font-medium text-gray-900 mb-1">Automatic Escalation</p>
                  <p>When conditions are met, linked plans are automatically activated with notifications sent to responsible parties.</p>
                </div>
              </div>
            </div>

            {/* Linked IT DR Plans */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-purple-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Linked IT DR Plans</h2>
                  <span className="text-[10px] text-gray-500">({scenario.linkedDRPlans.length} plans)</span>
                </div>
                <DataSourceBadge
                  source="IT DR Module"
                  tooltip="DR Plans linked from IT Disaster Recovery module. Auto-activated when trigger conditions are met."
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
                      <th className="w-[22%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Plan Name</th>
                      <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
                      <th className="w-[8%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Site</th>
                      <th className="w-[8%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RTO</th>
                      <th className="w-[8%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">RPO</th>
                      <th className="w-[24%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Trigger Condition</th>
                      <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenario.linkedDRPlans.map((dr: any, idx: number) => (
                      <tr key={idx} className="hover:bg-purple-50 transition-colors">
                        <td className="px-3 py-2 text-xs text-purple-600 font-medium">{dr.id}</td>
                        <td className="px-3 py-2 text-xs text-gray-900">{dr.name}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${dr.status === 'Approved' || dr.status === 'Validated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{dr.status}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${dr.siteType === 'HOT' ? 'bg-red-100 text-red-700' : dr.siteType === 'WARM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{dr.siteType}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">{dr.rto}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{dr.rpo}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{dr.triggerCondition}</td>
                        <td className="px-3 py-2">
                          <Link href={dr.link} className="text-[10px] text-purple-600 hover:text-purple-800 font-medium">
                            View Plan →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Linked Crisis Playbooks */}
            {scenario.linkedCrisisPlaybooks && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Linked Crisis Playbooks</h2>
                    <span className="text-[10px] text-gray-500">({scenario.linkedCrisisPlaybooks.length} playbooks)</span>
                  </div>
                  <DataSourceBadge
                    source="Crisis Management"
                    tooltip="Crisis Playbooks linked from Crisis Management module. Activated when escalation criteria are met."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {scenario.linkedCrisisPlaybooks.map((cp: any, idx: number) => (
                    <div key={idx} className="p-4 border border-red-100 rounded-sm bg-red-50/30 hover:bg-red-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{cp.id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${cp.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{cp.severity}</span>
                          {cp.regulatory && <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700">Regulatory</span>}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${cp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{cp.status}</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{cp.name}</h3>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-start gap-2">
                          <BoltIcon className="h-3.5 w-3.5 text-orange-500 mt-0.5" />
                          <span><strong>Trigger:</strong> {cp.triggerCondition}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <UserGroupIcon className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                          <span><strong>Activates:</strong> {cp.activates}</span>
                        </div>
                      </div>
                      <Link href={cp.link} className="inline-flex items-center gap-1 mt-3 text-xs text-red-600 hover:text-red-800 font-medium">
                        View Playbook <ChevronRightIcon className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Escalation Triggers */}
            {scenario.escalationTriggers && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BoltIcon className="h-5 w-5 text-orange-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Escalation Triggers</h2>
                    <span className="text-[10px] text-gray-500">({scenario.escalationTriggers.length} triggers)</span>
                  </div>
                  <DataSourceBadge
                    source="Automated"
                    tooltip="Escalation triggers are automatically evaluated during incident response. Some trigger auto-activation."
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[8%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
                        <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Name</th>
                        <th className="w-[30%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Condition</th>
                        <th className="w-[12%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Target Plan</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Timeframe</th>
                        <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Auto</th>
                        <th className="w-[15%] px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Notify</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scenario.escalationTriggers.map((trigger: any, idx: number) => (
                        <tr key={idx} className={trigger.autoActivate ? 'bg-orange-50/50' : ''}>
                          <td className="px-3 py-2 text-xs text-orange-600 font-medium">{trigger.id}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 font-medium">{trigger.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{trigger.condition}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                              trigger.targetPlan.includes('DR') ? 'bg-purple-100 text-purple-700' :
                              trigger.targetPlan.includes('Crisis') ? 'bg-red-100 text-red-700' :
                              trigger.targetPlan.includes('Continuity') ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{trigger.targetPlan}</span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{trigger.timeframe}</td>
                          <td className="px-3 py-2">
                            {trigger.autoActivate ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700">Auto</span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-700">Manual</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-[10px] text-gray-600">{trigger.notifyRoles.slice(0, 2).join(', ')}{trigger.notifyRoles.length > 2 ? '...' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cyber Runbooks Tab */}
        {activeTab === 'runbooks' && isComprehensive && scenario.cyberRunbooks && (
          <div className="space-y-6">
            {/* Runbooks Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-sm p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Cyber Runbooks for {scenario.id}</h2>
                  <p className="text-xs text-gray-300 mt-1">Step-by-step procedures for incident response phases</p>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold">{scenario.cyberRunbooks.length}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Total Runbooks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scenario.cyberRunbooks.reduce((sum: number, rb: any) => sum + rb.steps, 0)}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Total Steps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scenario.cyberRunbooks.filter((rb: any) => rb.automated).length}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Automated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Runbooks Grid */}
            <div className="grid grid-cols-2 gap-4">
              {scenario.cyberRunbooks.map((runbook: any, idx: number) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-sm p-4 hover:border-gray-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CommandLineIcon className="h-5 w-5 text-gray-700" />
                      <span className="text-xs font-mono text-gray-600">{runbook.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {runbook.automated && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 border border-green-200">Automated</span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${runbook.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{runbook.status}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 mb-2">{runbook.name}</h3>

                  <div className="flex items-center gap-4 mb-3">
                    <span className={`text-[10px] px-2 py-1 rounded-sm ${
                      runbook.category === 'Containment' ? 'bg-red-100 text-red-700' :
                      runbook.category === 'Investigation' ? 'bg-blue-100 text-blue-700' :
                      runbook.category === 'Eradication' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{runbook.category}</span>
                    <span className="text-[10px] text-gray-500">Phase: {runbook.phase}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-gray-50 rounded-sm p-2">
                      <p className="text-sm font-semibold text-gray-900">{runbook.steps}</p>
                      <p className="text-[10px] text-gray-500">Steps</p>
                    </div>
                    <div className="bg-gray-50 rounded-sm p-2">
                      <p className="text-sm font-semibold text-gray-900">{runbook.estimatedTime}</p>
                      <p className="text-[10px] text-gray-500">Duration</p>
                    </div>
                    <div className="bg-gray-50 rounded-sm p-2">
                      <p className="text-sm font-semibold text-gray-900">{runbook.owner}</p>
                      <p className="text-[10px] text-gray-500">Owner</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-500">Updated: {runbook.lastUpdated}</span>
                    <Link href={runbook.link} className="inline-flex items-center gap-1 text-xs text-gray-900 hover:text-gray-700 font-medium">
                      Open Runbook <ChevronRightIcon className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Runbook Execution Order */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Recommended Execution Order</h2>
              <div className="flex items-center gap-2">
                {scenario.cyberRunbooks.map((runbook: any, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        runbook.category === 'Containment' ? 'bg-red-100 text-red-700' :
                        runbook.category === 'Investigation' ? 'bg-blue-100 text-blue-700' :
                        runbook.category === 'Eradication' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-[9px] text-gray-600 mt-1 text-center max-w-[80px] truncate">{runbook.name.split(' ')[0]}</span>
                    </div>
                    {idx < scenario.cyberRunbooks.length - 1 && (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

