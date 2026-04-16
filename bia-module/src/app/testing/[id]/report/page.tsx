'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  CheckIcon,
  XMarkIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  StarIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

type ReportStep = 'timing' | 'processes' | 'applications' | 'hardware' | 'internal' | 'external' | 'rpo' | 'failback' | 'technical-evidence' | 'compliance' | 'business-impact' | 'third-party' | 'post-validation' | 'criteria' | 'issues' | 'summary' | 'review' | 'logistics' | 'attendance' | 'discussions' | 'findings' | 'feedback' | 'management';

interface ReportStepDef {
  id: ReportStep;
  label: string;
  shortLabel: string;
}

// BCP Test Report Steps
const bcpReportSteps: ReportStepDef[] = [
  { id: 'timing', label: 'Timing Capture', shortLabel: 'Timing' },
  { id: 'processes', label: 'Process Results', shortLabel: 'Processes' },
  { id: 'applications', label: 'Applications/Software', shortLabel: 'Apps' },
  { id: 'hardware', label: 'Hardware/Infrastructure', shortLabel: 'Hardware' },
  { id: 'internal', label: 'Internal Dependencies', shortLabel: 'Internal' },
  { id: 'external', label: 'External Dependencies', shortLabel: 'External' },
  { id: 'rpo', label: 'RPO Tracking', shortLabel: 'RPO' },
  { id: 'failback', label: 'Failback Procedures', shortLabel: 'Failback' },
  { id: 'technical-evidence', label: 'Technical Evidence', shortLabel: 'Evidence' },
  { id: 'compliance', label: 'Regulatory Compliance', shortLabel: 'Compliance' },
  { id: 'business-impact', label: 'Business Impact Assessment', shortLabel: 'Impact' },
  { id: 'third-party', label: 'Third-Party Coordination', shortLabel: 'Vendors' },
  { id: 'post-validation', label: 'Post-Test Validation', shortLabel: 'Validation' },
  { id: 'criteria', label: 'Success Criteria Q&A', shortLabel: 'Criteria' },
  { id: 'findings', label: 'Findings & Observations', shortLabel: 'Findings' },
  { id: 'issues', label: 'Issues & CAPA', shortLabel: 'Issues' },
  { id: 'summary', label: 'Summary & Lessons', shortLabel: 'Summary' },
  { id: 'review', label: 'Final Review', shortLabel: 'Review' },
];

// Tabletop Exercise Report Steps
const tabletopReportSteps: ReportStepDef[] = [
  { id: 'logistics', label: 'Exercise Logistics', shortLabel: 'Logistics' },
  { id: 'attendance', label: 'Attendance', shortLabel: 'Attendance' },
  { id: 'discussions', label: 'Scenario Discussions', shortLabel: 'Discussions' },
  { id: 'findings', label: 'Findings', shortLabel: 'Findings' },
  { id: 'feedback', label: 'Feedback & What Went Well', shortLabel: 'Feedback' },
  { id: 'issues', label: 'Issues Log', shortLabel: 'Issues' },
  { id: 'management', label: 'Management Summary', shortLabel: 'Summary' },
  { id: 'criteria', label: 'Success Criteria Q&A', shortLabel: 'Criteria' },
  { id: 'review', label: 'Final Review', shortLabel: 'Review' },
];

// Helper to get test record
function getTestRecord(testId: string) {
  const mockTestRecords: Record<string, any> = {
    'BCP-T-001': { name: 'Q4 2024 Full DR Simulation', category: 'bcp' },
    'BCP-T-002': { name: 'IT System Failover Test', category: 'bcp' },
    'TT-001': { name: 'Cybersecurity Incident Response', category: 'tabletop' },
    'ITSCM-T-001': { name: 'Core Insurance Platform Failover', category: 'bcp' },
    'ITSCM-T-002': { name: 'Oracle Database Recovery Test', category: 'bcp' },
    'ITSCM-T-003': { name: 'Network Infrastructure Failover', category: 'bcp' },
    'ITSCM-T-004': { name: 'Ransomware Response Drill', category: 'bcp' },
    'ITSCM-T-005': { name: 'Full DR Site Activation - Munich', category: 'bcp' },
    'ITSCM-T-006': { name: 'Payment Gateway Failover', category: 'bcp' },
    'ITSCM-T-007': { name: 'CRM System Recovery', category: 'bcp' },
  };
  if (mockTestRecords[testId]) return mockTestRecords[testId];
  if (testId.startsWith('TT-')) return { name: `Tabletop Exercise ${testId}`, category: 'tabletop' };
  if (testId.startsWith('BCP-T-')) return { name: `BCP Test ${testId}`, category: 'bcp' };
  if (testId.startsWith('ITSCM-T-')) return { name: `ITSCM Test ${testId}`, category: 'bcp' };
  return { name: 'Test Record', category: 'bcp' };
}

// Mock items to test
const mockTestItems = {
  processes: [
    { id: 'PROC-001', name: 'Customer Inquiry Handling', rto: 2 },
    { id: 'PROC-002', name: 'Complaint Resolution', rto: 4 },
    { id: 'PROC-003', name: 'Order Processing', rto: 2 },
  ],
  applications: [
    { id: 'APP-001', name: 'CRM System', rto: 1 },
    { id: 'APP-002', name: 'Ticketing Platform', rto: 2 },
    { id: 'APP-003', name: 'Email Server', rto: 1 },
  ],
  hardware: [
    { id: 'HW-001', name: 'Primary Database Server', rto: 1 },
    { id: 'HW-002', name: 'Application Server Cluster', rto: 2 },
    { id: 'HW-003', name: 'Network Switches', rto: 0.5 },
  ],
  internal: [
    { id: 'INT-001', name: 'IT Help Desk' },
    { id: 'INT-002', name: 'Network Operations' },
  ],
  external: [
    { id: 'EXT-001', name: 'AWS Cloud Services' },
    { id: 'EXT-002', name: 'Telecom Provider' },
  ],
  criteria: [
    { id: 'SC-001', name: 'RTO Met', description: 'Services restored within target RTO' },
    { id: 'SC-002', name: 'RPO Met', description: 'Data loss within acceptable limits' },
    { id: 'SC-003', name: 'Full Recovery', description: 'All critical processes operational' },
    { id: 'SC-004', name: 'Communication Success', description: 'All stakeholders notified' },
  ],
};

// Tabletop-specific success criteria
const tabletopCriteria = [
  { id: 'TT-SC-001', name: 'Objectives Achieved', description: 'All exercise objectives were addressed and discussed' },
  { id: 'TT-SC-002', name: 'Participant Engagement', description: 'All participants actively contributed to discussions' },
  { id: 'TT-SC-003', name: 'Gaps Identified', description: 'Key gaps in plans/procedures were identified' },
  { id: 'TT-SC-004', name: 'Action Items Defined', description: 'Clear action items and owners were assigned' },
  { id: 'TT-SC-005', name: 'Communication Tested', description: 'Communication procedures were validated' },
];

interface TimingData {
  testStart: string;
  recoveryStart: string;
  recoveryComplete: string;
  testEnd: string;
}

interface ResultItem {
  id?: string;
  result?: 'pass' | 'fail' | 'partial' | null;
  comments?: string;
  actualTime?: string;
  status?: 'pass' | 'fail' | 'partial';
  rtoActual?: number;
  notes?: string;
}

interface Finding {
  id: string;
  category: 'observation' | 'gap' | 'improvement' | 'best-practice';
  severity: 'high' | 'medium' | 'low';
  area: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
}

interface Issue {
  id?: string;
  description: string;
  rootCause?: string;
  correctiveAction: string;
  owner?: string;
  targetDate?: string;
  severity?: string;
  category?: string;
  impact?: string;
  responsible?: string;
  dueDate?: string;
  status?: string;
}

interface RPOData {
  dataSource: string;
  rpoTarget: string;
  rpoAchieved: string;
  dataLoss: string;
  backupUsed: string;
  comments: string;
}

interface FailbackProcedure {
  step: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in-progress' | 'pending' | null;
  responsible: string;
  notes: string;
}

interface TechnicalEvidence {
  timestamp: string;
  source: string;
  type: 'log' | 'metric' | 'screenshot' | 'command-output';
  description: string;
  content: string;
}

interface ComplianceMapping {
  requirement: string;
  framework: 'BaFin' | 'DORA' | 'ISO-22301' | 'ISO-27001';
  testActivity: string;
  evidence: string;
  status: 'compliant' | 'partial' | 'non-compliant' | null;
}

interface BusinessImpactValidation {
  businessProcess: string;
  validationMethod: string;
  expectedOutcome: string;
  actualOutcome: string;
  impactLevel: 'none' | 'low' | 'medium' | 'high' | null;
  notes: string;
}

interface ThirdPartyCoordination {
  vendor: string;
  contactPerson: string;
  communicationTime: string;
  purpose: string;
  response: string;
  slaCompliance: 'met' | 'not-met' | 'n/a' | null;
  notes: string;
}

interface PostTestValidation {
  checkType: string;
  description: string;
  expectedState: string;
  actualState: string;
  status: 'pass' | 'fail' | 'warning' | null;
  validatedBy: string;
  validatedAt: string;
  notes: string;
}

interface ReportData {
  timing: TimingData;
  processResults: Record<string, ResultItem>;
  appResults: Record<string, ResultItem>;
  hardwareResults: Record<string, ResultItem>;
  internalResults: Record<string, ResultItem>;
  externalResults: Record<string, ResultItem>;
  criteriaResults: Record<string, { met: boolean | null; evidence: string }>;
  findings: Finding[];
  issues: Issue[];
  summary: string;
  lessonsLearned: string;
  finalResult: 'pass' | 'fail' | 'partial' | null;
  justification: string;
  evidenceFiles: { name: string; size: string }[];
  // New sections
  rpoData: RPOData[];
  failbackProcedures: FailbackProcedure[];
  technicalEvidence: TechnicalEvidence[];
  complianceMatrix: ComplianceMapping[];
  businessImpactValidation: BusinessImpactValidation[];
  thirdPartyCoordination: ThirdPartyCoordination[];
  postTestValidation: PostTestValidation[];
}

// Tabletop-specific data
interface TabletopReportData {
  logistics: {
    actualStart: string;
    actualEnd: string;
    location: string;
    hostConfirmed: boolean;
    facilitator: string;
  };
  attendance: {
    planned: { name: string; role: string }[];
    attended: string[];
    absentees: string[];
  };
  discussions: {
    topic: string;
    actualResponse: string;
    rating: 'excellent' | 'good' | 'fair' | 'poor' | null;
    expectedResponse: string;
    comments: string;
  }[];
  findings: {
    description: string;
    category: 'gap' | 'improvement' | 'observation';
    priority: 'high' | 'medium' | 'low';
  }[];
  feedback: {
    whatWentWell: string[];
    participantFeedback: { participant: string; feedback: string; rating: number }[];
  };
  managementSummary: {
    executiveSummary: string;
    keyFindings: string;
    recommendations: string;
  };
}

// Function to get sample data for ITSCM-T-001
function getITSCMSampleData(): ReportData {
  return {
    timing: {
      testStart: '2024-03-10T09:00',
      recoveryStart: '2024-03-10T09:15',
      recoveryComplete: '2024-03-10T11:45',
      testEnd: '2024-03-10T14:30'
    },
    processResults: {
      'PROC-001': { status: 'pass', rtoActual: 1.5, notes: 'Customer inquiry system recovered successfully within RTO' },
      'PROC-002': { status: 'pass', rtoActual: 3.2, notes: 'Complaint resolution workflow operational' },
      'PROC-003': { status: 'partial', rtoActual: 2.8, notes: 'Order processing restored but with reduced capacity initially' },
    },
    appResults: {
      'APP-001': { status: 'pass', rtoActual: 0.8, notes: 'CRM System fully operational from DR site' },
      'APP-002': { status: 'pass', rtoActual: 1.5, notes: 'Ticketing platform restored with all integrations working' },
      'APP-003': { status: 'pass', rtoActual: 0.5, notes: 'Email server failover successful' },
    },
    hardwareResults: {
      'HW-001': { status: 'pass', rtoActual: 0.7, notes: 'Database server cluster activated at DR site' },
      'HW-002': { status: 'pass', rtoActual: 1.2, notes: 'Application servers brought online successfully' },
      'HW-003': { status: 'pass', rtoActual: 0.3, notes: 'Network infrastructure switched to backup configuration' },
    },
    internalResults: {
      'INT-001': { status: 'pass', notes: 'IT Help Desk coordinated effectively during test' },
      'INT-002': { status: 'pass', notes: 'Network Operations team responded within expected timeframes' },
    },
    externalResults: {
      'EXT-001': { status: 'pass', notes: 'AWS responded to support request within SLA' },
      'EXT-002': { status: 'pass', notes: 'Telecom provider confirmed circuit availability' },
    },
    criteriaResults: {
      'All critical systems recovered within RTO': { met: true, evidence: 'All systems met or exceeded RTO targets as documented in timing section' },
      'Data integrity verified post-recovery': { met: true, evidence: 'Database checksums validated, no data corruption detected' },
      'Communication protocols followed': { met: true, evidence: 'All stakeholders notified per communication plan' },
      'Backup systems functioned as expected': { met: true, evidence: 'DR site systems performed without issues' },
    },
    findings: [
      {
        id: 'FIND-001',
        category: 'improvement',
        severity: 'medium',
        area: 'Network Infrastructure',
        description: 'VPN connection to DR site could be optimized with pre-established tunnels',
        recommendation: 'Implement always-on VPN tunnels between primary and DR sites to eliminate connection establishment time during failover',
        priority: 'medium',
        assignedTo: 'Network Architecture Team'
      },
      {
        id: 'FIND-002',
        category: 'best-practice',
        severity: 'low',
        area: 'Documentation',
        description: 'DR runbook documentation process is working well but could benefit from automated validation',
        recommendation: 'Implement quarterly automated checks to validate credentials and contact information in DR runbooks',
        priority: 'low',
        assignedTo: 'IT Operations'
      },
      {
        id: 'FIND-003',
        category: 'observation',
        severity: 'low',
        area: 'Team Coordination',
        description: 'Cross-team communication during test was excellent, demonstrating value of regular drills',
        recommendation: 'Continue quarterly DR drills to maintain team readiness and coordination',
        priority: 'medium',
        assignedTo: 'ITSCM Coordinator'
      }
    ],
    issues: [
      {
        id: 'ISS-001',
        severity: 'medium',
        category: 'technical',
        description: 'Initial VPN connection to DR site experienced 5-minute delay',
        impact: 'Delayed start of recovery by 5 minutes',
        correctiveAction: 'Review VPN configuration and add redundant connection path',
        responsible: 'Network Team',
        dueDate: '2024-03-24',
        status: 'open'
      },
      {
        id: 'ISS-002',
        severity: 'low',
        category: 'procedural',
        description: 'DR runbook missing updated credentials for monitoring system',
        impact: 'Required 10 minutes to locate correct credentials',
        correctiveAction: 'Update DR runbook with current credential vault references',
        responsible: 'IT Operations',
        dueDate: '2024-03-17',
        status: 'open'
      }
    ],
    summary: 'The ITSCM test successfully validated our disaster recovery capabilities for critical IT systems. All primary objectives were achieved, with systems recovering within established RTOs. The test demonstrated effective coordination between IT teams and external vendors. Two minor issues were identified and documented for remediation.',
    lessonsLearned: 'Key learnings: 1) VPN redundancy is critical for DR site access, 2) Credential management processes need improvement, 3) Team coordination was excellent and should be maintained through regular drills, 4) Documentation accuracy is essential and requires quarterly reviews.',
    finalResult: 'pass',
    justification: 'All critical success criteria were met. Systems recovered within RTO targets, data integrity was maintained, and business processes were validated. The two identified issues are minor and do not impact the overall success of the test.',
    evidenceFiles: [
      { name: 'system_logs_dr_test_20240310.zip', size: '45.2 MB' },
      { name: 'network_diagrams_failover.pdf', size: '3.1 MB' },
      { name: 'database_integrity_report.pdf', size: '1.8 MB' },
    ],
    rpoData: [],
    failbackProcedures: [],
    technicalEvidence: [],
    complianceMatrix: [],
    businessImpactValidation: [],
    thirdPartyCoordination: [],
    postTestValidation: [],
  };
}

export default function TestReportWizard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = params.id as string;

  // Get test record and determine type
  const testRecord = getTestRecord(testId);
  const isTabletop = testRecord.category === 'tabletop';
  const reportSteps = isTabletop ? tabletopReportSteps : bcpReportSteps;
  const defaultStep = isTabletop ? 'logistics' : 'timing';

  const initialStep = (searchParams.get('step') as ReportStep) || defaultStep;
  const [currentStep, setCurrentStep] = useState<ReportStep>(initialStep);

  // Initialize with sample data for ITSCM-T-001, empty for others
  const getInitialData = () => {
    if (testId === 'ITSCM-T-001') {
      const sampleData = getITSCMSampleData();
      // Add the new comprehensive data
      sampleData.rpoData = [
        {
          dataSource: 'Customer Database',
          rpoTarget: '4 hours',
          rpoAchieved: '3.5 hours',
          dataLoss: 'None',
          backupUsed: 'Incremental backup from 05:30 AM',
          comments: 'RPO target exceeded, no data loss detected'
        },
        {
          dataSource: 'Transaction Logs',
          rpoTarget: '1 hour',
          rpoAchieved: '45 minutes',
          dataLoss: 'None',
          backupUsed: 'Continuous replication',
          comments: 'Real-time replication working as expected'
        },
        {
          dataSource: 'Document Management System',
          rpoTarget: '24 hours',
          rpoAchieved: '12 hours',
          dataLoss: 'None',
          backupUsed: 'Daily backup from 02:00 AM',
          comments: 'Well within RPO target'
        }
      ];

      sampleData.failbackProcedures = [
        {
          step: 'Data Synchronization',
          description: 'Synchronized production data from DR site back to primary datacenter',
          startTime: '2024-03-10T15:00',
          endTime: '2024-03-10T16:30',
          status: 'completed',
          responsible: 'Database Administrator',
          notes: 'Full sync completed successfully, verified data consistency'
        },
        {
          step: 'Primary System Validation',
          description: 'Validated all primary systems are operational and ready for cutover',
          startTime: '2024-03-10T16:30',
          endTime: '2024-03-10T17:00',
          status: 'completed',
          responsible: 'IT Operations Lead',
          notes: 'All health checks passed'
        },
        {
          step: 'Traffic Cutover',
          description: 'Redirected user traffic from DR site back to primary site',
          startTime: '2024-03-10T17:00',
          endTime: '2024-03-10T17:15',
          status: 'completed',
          responsible: 'Network Operations',
          notes: 'Seamless cutover with no user impact'
        },
        {
          step: 'Post-Failback Monitoring',
          description: 'Monitored systems for 2 hours post-failback to ensure stability',
          startTime: '2024-03-10T17:15',
          endTime: '2024-03-10T19:15',
          status: 'completed',
          responsible: 'NOC Team',
          notes: 'No anomalies detected, all systems stable'
        }
      ];

      sampleData.technicalEvidence = [
        {
          timestamp: '2024-03-10T09:15',
          source: 'Database Server',
          type: 'log',
          description: 'Database failover initiation',
          content: '[2024-03-10 09:15:23] INFO: Initiating failover to DR site\n[2024-03-10 09:15:45] INFO: Connection to primary lost, switching to secondary\n[2024-03-10 09:16:12] INFO: DR database online, accepting connections\n[2024-03-10 09:16:18] INFO: Replication lag: 0 seconds'
        },
        {
          timestamp: '2024-03-10T09:30',
          source: 'Monitoring System',
          type: 'metric',
          description: 'System performance metrics during recovery',
          content: 'CPU Usage: 45%\nMemory Usage: 62%\nDisk I/O: 340 MB/s\nNetwork Throughput: 850 Mbps\nActive Connections: 1,247\nResponse Time: 145ms (avg)'
        },
        {
          timestamp: '2024-03-10T11:00',
          source: 'Application Server',
          type: 'command-output',
          description: 'Service status verification',
          content: '$ systemctl status crm-service\n● crm-service.service - CRM Application Service\n   Loaded: loaded (/etc/systemd/system/crm-service.service; enabled)\n   Active: active (running) since Sun 2024-03-10 09:20:15 UTC; 1h 40min ago\n   Main PID: 12847 (java)\n   Memory: 2.1G\n   CGroup: /system.slice/crm-service.service\n           └─12847 /usr/bin/java -jar /opt/crm/crm-app.jar'
        }
      ];

      sampleData.complianceMatrix = [
        {
          requirement: 'DORA Art. 11 - ICT Business Continuity Testing',
          framework: 'DORA',
          testActivity: 'Full DR failover test validating recovery of critical ICT systems within defined RTOs',
          evidence: 'Test results demonstrate successful recovery of all critical systems. Timing data shows RTO compliance.',
          status: 'compliant'
        },
        {
          requirement: 'BaFin BAIT AT 7.2 - Business Continuity Management',
          framework: 'BaFin',
          testActivity: 'Validated emergency procedures, communication protocols, and recovery capabilities',
          evidence: 'Documented test execution, stakeholder communication logs, and recovery validation results',
          status: 'compliant'
        },
        {
          requirement: 'ISO 22301:2019 - Clause 8.5 Exercising and Testing',
          framework: 'ISO-22301',
          testActivity: 'Conducted scenario-based DR test with defined objectives and success criteria',
          evidence: 'Test plan, execution records, and post-test analysis documented in this report',
          status: 'compliant'
        },
        {
          requirement: 'ISO 27001:2022 - A.17.1.3 Verify, review and evaluate',
          framework: 'ISO-27001',
          testActivity: 'Verified information security controls during DR scenario including access controls and data integrity',
          evidence: 'Security validation performed, access logs reviewed, data integrity checks completed',
          status: 'compliant'
        }
      ];

      sampleData.businessImpactValidation = [
        {
          businessProcess: 'Customer Order Processing',
          validationMethod: 'End-to-end transaction test with 50 sample orders',
          expectedOutcome: 'Orders processed successfully through DR systems with normal processing times',
          actualOutcome: 'All 50 test orders processed successfully. Average processing time 2.3 seconds (normal: 2.1 seconds)',
          impactLevel: 'low',
          notes: 'Slight performance degradation acceptable during DR scenario'
        },
        {
          businessProcess: 'Customer Support Ticket Management',
          validationMethod: 'Created and resolved test tickets through DR environment',
          expectedOutcome: 'Support staff able to access and update tickets without issues',
          actualOutcome: 'All ticket operations successful. Support team reported no functional limitations',
          impactLevel: 'none',
          notes: 'No impact to business operations'
        },
        {
          businessProcess: 'Financial Reporting',
          validationMethod: 'Generated standard financial reports from DR database',
          expectedOutcome: 'Reports generated with accurate data matching production',
          actualOutcome: 'All reports generated successfully with 100% data accuracy verified',
          impactLevel: 'none',
          notes: 'Reporting functionality fully operational'
        }
      ];

      sampleData.thirdPartyCoordination = [
        {
          vendor: 'Amazon Web Services (AWS)',
          contactPerson: 'Sarah Mitchell - Enterprise Support',
          communicationTime: '2024-03-10T08:45',
          purpose: 'Notification of DR test and request for standby support',
          response: 'Acknowledged test notification. Support team on standby. No issues reported during test window.',
          slaCompliance: 'met',
          notes: 'Excellent responsiveness from AWS support team'
        },
        {
          vendor: 'Deutsche Telekom',
          contactPerson: 'Klaus Weber - Network Operations',
          communicationTime: '2024-03-10T08:50',
          purpose: 'Verify backup circuit availability and bandwidth',
          response: 'Confirmed backup circuit operational. Bandwidth test completed successfully at 950 Mbps.',
          slaCompliance: 'met',
          notes: 'Circuit performance exceeded requirements'
        },
        {
          vendor: 'Veeam Backup Solutions',
          contactPerson: 'Technical Support Team',
          communicationTime: '2024-03-10T09:10',
          purpose: 'Coordinate backup restoration for test scenario',
          response: 'Provided guidance on optimal restore procedures. Monitored restore progress remotely.',
          slaCompliance: 'met',
          notes: 'Vendor support enhanced test execution efficiency'
        }
      ];

      sampleData.postTestValidation = [
        {
          checkType: 'Data Integrity Verification',
          description: 'Validated data consistency between primary and DR databases post-failback',
          expectedState: 'All database checksums match, no data corruption or loss',
          actualState: 'Checksums verified across all tables. 0 discrepancies found. Data integrity 100%',
          status: 'pass',
          validatedBy: 'Maria Schmidt - DBA',
          validatedAt: '2024-03-10T18:00',
          notes: 'Comprehensive validation completed successfully'
        },
        {
          checkType: 'System Performance Baseline',
          description: 'Verified system performance returned to normal operational levels',
          expectedState: 'Response times, throughput, and resource utilization within normal ranges',
          actualState: 'All metrics within 5% of baseline. Response time: 142ms (baseline: 138ms)',
          status: 'pass',
          validatedBy: 'Thomas Mueller - Performance Engineer',
          validatedAt: '2024-03-10T18:30',
          notes: 'Performance fully restored to pre-test levels'
        },
        {
          checkType: 'Configuration Verification',
          description: 'Confirmed all system configurations restored to production state',
          expectedState: 'All configuration files match production baseline',
          actualState: 'Configuration audit completed. All systems match production baseline.',
          status: 'pass',
          validatedBy: 'IT Operations Team',
          validatedAt: '2024-03-10T19:00',
          notes: 'No configuration drift detected'
        },
        {
          checkType: 'User Access Validation',
          description: 'Verified user authentication and authorization working correctly',
          expectedState: 'All users can authenticate and access appropriate resources',
          actualState: 'Tested 100 user accounts across different roles. All successful.',
          status: 'pass',
          validatedBy: 'Security Team',
          validatedAt: '2024-03-10T19:15',
          notes: 'Access controls functioning as expected'
        }
      ];

      return sampleData;
    }

    return {
      timing: { testStart: '', recoveryStart: '', recoveryComplete: '', testEnd: '' },
      processResults: {},
      appResults: {},
      hardwareResults: {},
      internalResults: {},
      externalResults: {},
      criteriaResults: {},
      findings: [],
      issues: [],
      summary: '',
      lessonsLearned: '',
      finalResult: null,
      justification: '',
      evidenceFiles: [],
      rpoData: [],
      failbackProcedures: [],
      technicalEvidence: [],
      complianceMatrix: [],
      businessImpactValidation: [],
      thirdPartyCoordination: [],
      postTestValidation: [],
    };
  };

  // BCP Report Data
  const [reportData, setReportData] = useState<ReportData>(getInitialData());

  // Tabletop Report Data
  const [tabletopReport, setTabletopReport] = useState<TabletopReportData>({
    logistics: { actualStart: '', actualEnd: '', location: '', hostConfirmed: false, facilitator: '' },
    attendance: { planned: [
      { name: 'John Smith', role: 'BC Manager' },
      { name: 'Sarah Johnson', role: 'IT Lead' },
      { name: 'Mike Chen', role: 'Operations' },
      { name: 'Lisa Wong', role: 'HR Representative' },
    ], attended: [], absentees: [] },
    discussions: [
      { topic: 'Initial incident detection and assessment', actualResponse: '', rating: null, expectedResponse: 'Team identifies incident within 15 minutes', comments: '' },
      { topic: 'Communication and escalation procedures', actualResponse: '', rating: null, expectedResponse: 'Proper escalation chain followed', comments: '' },
      { topic: 'Resource mobilization and team activation', actualResponse: '', rating: null, expectedResponse: 'All key personnel activated within 30 minutes', comments: '' },
    ],
    findings: [],
    feedback: { whatWentWell: [], participantFeedback: [] },
    managementSummary: { executiveSummary: '', keyFindings: '', recommendations: '' },
  });

  const currentStepIndex = reportSteps.findIndex(s => s.id === currentStep);

  const goToStep = (step: ReportStep) => {
    setCurrentStep(step);
    router.push(`/testing/${testId}/report?step=${step}`, { scroll: false });
  };

  const goNext = () => {
    if (currentStepIndex < reportSteps.length - 1) {
      goToStep(reportSteps[currentStepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      goToStep(reportSteps[currentStepIndex - 1].id);
    }
  };

  const getProgress = (): number => {
    if (isTabletop) {
      let completed = 0;
      if (tabletopReport.logistics.actualStart) completed++;
      if (tabletopReport.attendance.attended.length > 0) completed++;
      if (tabletopReport.discussions.some(d => d.actualResponse)) completed++;
      if (tabletopReport.feedback.whatWentWell.length > 0) completed++;
      if (tabletopReport.managementSummary.executiveSummary) completed++;
      if (Object.keys(reportData.criteriaResults).length > 0) completed++;
      if (reportData.finalResult) completed++;
      return Math.round((completed / 7) * 100);
    }
    let completed = 0;
    if (reportData.timing.testStart) completed++;
    if (Object.keys(reportData.processResults).length > 0) completed++;
    if (Object.keys(reportData.appResults).length > 0) completed++;
    if (Object.keys(reportData.hardwareResults).length > 0) completed++;
    if (Object.keys(reportData.internalResults).length > 0) completed++;
    if (Object.keys(reportData.externalResults).length > 0) completed++;
    if (Object.keys(reportData.criteriaResults).length > 0) completed++;
    if (reportData.summary) completed++;
    if (reportData.finalResult) completed++;
    return Math.round((completed / 9) * 100);
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/testing/${testId}`} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowLeftIcon className="h-3 w-3" />
              Back to {isTabletop ? 'Exercise' : 'Test'}
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-xs text-gray-500">{testRecord.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{isTabletop ? 'Exercise Report' : 'Test Report'}</h1>
              <p className="text-xs text-gray-500 mt-1">{isTabletop ? 'Document exercise outcomes and findings' : 'Document test execution results and findings'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-semibold text-gray-900">{getProgress()}%</p>
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${getProgress()}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="px-6 pb-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {reportSteps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : isPast
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {step.shortLabel}
                  </button>
                  {index < reportSteps.length - 1 && (
                    <ChevronRightIcon className="h-4 w-4 text-gray-300 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="max-w-4xl">
          {/* BCP Test Steps */}
          {!isTabletop && currentStep === 'timing' && (
            <TimingStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'processes' && (
            <ResultsGridStep
              title="Process Results"
              description="Record pass/fail status for each tested process"
              items={mockTestItems.processes}
              results={reportData.processResults}
              setResults={(r: any) => setReportData({ ...reportData, processResults: r })}
              showRTO
            />
          )}
          {!isTabletop && currentStep === 'applications' && (
            <ResultsGridStep
              title="Application/Software Results"
              description="Record recovery status for applications and software"
              items={mockTestItems.applications}
              results={reportData.appResults}
              setResults={(r: any) => setReportData({ ...reportData, appResults: r })}
              showRTO
            />
          )}
          {!isTabletop && currentStep === 'hardware' && (
            <ResultsGridStep
              title="Hardware/Infrastructure Results"
              description="Record recovery status for hardware and infrastructure"
              items={mockTestItems.hardware}
              results={reportData.hardwareResults}
              setResults={(r: any) => setReportData({ ...reportData, hardwareResults: r })}
              showRTO
            />
          )}
          {!isTabletop && currentStep === 'internal' && (
            <ResultsGridStep
              title="Internal Dependency Results"
              description="Record status for internal department dependencies"
              items={mockTestItems.internal}
              results={reportData.internalResults}
              setResults={(r: any) => setReportData({ ...reportData, internalResults: r })}
            />
          )}
          {!isTabletop && currentStep === 'external' && (
            <ResultsGridStep
              title="External Dependency Results"
              description="Record status for external vendor dependencies"
              items={mockTestItems.external}
              results={reportData.externalResults}
              setResults={(r: any) => setReportData({ ...reportData, externalResults: r })}
            />
          )}
          {!isTabletop && currentStep === 'rpo' && (
            <RPOTrackingStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'failback' && (
            <FailbackStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'technical-evidence' && (
            <TechnicalEvidenceStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'compliance' && (
            <ComplianceMatrixStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'business-impact' && (
            <BusinessImpactStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'third-party' && (
            <ThirdPartyStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'post-validation' && (
            <PostValidationStep reportData={reportData} setReportData={setReportData} />
          )}
          {!isTabletop && currentStep === 'summary' && (
            <SummaryStep reportData={reportData} setReportData={setReportData} />
          )}

          {/* Tabletop Exercise Steps */}
          {isTabletop && currentStep === 'logistics' && (
            <LogisticsStep data={tabletopReport} setData={setTabletopReport} />
          )}
          {isTabletop && currentStep === 'attendance' && (
            <AttendanceStep data={tabletopReport} setData={setTabletopReport} />
          )}
          {isTabletop && currentStep === 'discussions' && (
            <DiscussionsStep data={tabletopReport} setData={setTabletopReport} />
          )}
          {isTabletop && currentStep === 'findings' && (
            <TabletopFindingsStep data={tabletopReport} setData={setTabletopReport} />
          )}
          {isTabletop && currentStep === 'feedback' && (
            <FeedbackStep data={tabletopReport} setData={setTabletopReport} />
          )}
          {isTabletop && currentStep === 'management' && (
            <ManagementSummaryStep data={tabletopReport} setData={setTabletopReport} />
          )}

          {/* Shared Steps */}
          {currentStep === 'criteria' && (
            <CriteriaQAStep
              criteria={isTabletop ? tabletopCriteria : mockTestItems.criteria}
              results={reportData.criteriaResults}
              setResults={(r: any) => setReportData({ ...reportData, criteriaResults: r })}
              isTabletop={isTabletop}
            />
          )}
          {currentStep === 'findings' && (
            <FindingsStep
              findings={reportData.findings}
              setFindings={(f: any) => setReportData({ ...reportData, findings: f })}
            />
          )}
          {currentStep === 'issues' && (
            <IssuesStep
              issues={reportData.issues}
              setIssues={(i: any) => setReportData({ ...reportData, issues: i })}
              isTabletop={isTabletop}
            />
          )}
          {currentStep === 'review' && (
            <FinalReviewStep
              reportData={reportData}
              setReportData={setReportData}
              testId={testId}
              isTabletop={isTabletop}
              tabletopReport={tabletopReport}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-sm transition-colors ${
              currentStepIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Previous
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={() => {
                alert('Report submitted for approval!');
                router.push(`/testing/${testId}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
            >
              Submit Report
              <CheckCircleIcon className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
            >
              Next
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// === STEP 1: Timing Capture ===
function TimingStep({ reportData, setReportData }: any) {
  const updateTiming = (field: string, value: string) => {
    setReportData({
      ...reportData,
      timing: { ...reportData.timing, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Timing Capture</p>
            <p className="text-[10px] text-blue-700 mt-1">
              Record the key timestamps from the test execution.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Test Execution Timeline</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Test Start <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={reportData.timing.testStart}
                onChange={(e) => updateTiming('testStart', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">When the test exercise began</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Recovery Start</label>
              <input
                type="datetime-local"
                value={reportData.timing.recoveryStart}
                onChange={(e) => updateTiming('recoveryStart', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">When recovery procedures were initiated</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Recovery Complete</label>
              <input
                type="datetime-local"
                value={reportData.timing.recoveryComplete}
                onChange={(e) => updateTiming('recoveryComplete', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">When all systems were recovered</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Test End <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={reportData.timing.testEnd}
                onChange={(e) => updateTiming('testEnd', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">When the test exercise concluded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === STEP 2-6: Results Grid (reusable) ===
function ResultsGridStep({ title, description, items, results, setResults, showRTO = false }: any) {
  const updateResult = (id: string, field: string, value: any) => {
    setResults({
      ...results,
      [id]: { ...results[id], id, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-[10px] text-gray-500 mt-1">{description}</p>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item: any) => {
            const result = results[item.id] || {};
            return (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{item.name}</p>
                    {showRTO && <p className="text-[10px] text-gray-500">Target RTO: {item.rto}h</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateResult(item.id, 'result', 'pass')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        result.result === 'pass'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      <CheckIcon className="h-3.5 w-3.5 inline mr-1" />
                      Pass
                    </button>
                    <button
                      onClick={() => updateResult(item.id, 'result', 'partial')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        result.result === 'partial'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      Partial
                    </button>
                    <button
                      onClick={() => updateResult(item.id, 'result', 'fail')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        result.result === 'fail'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <XMarkIcon className="h-3.5 w-3.5 inline mr-1" />
                      Fail
                    </button>
                  </div>
                </div>
                {showRTO && (
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Actual Recovery Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 1.5 hours"
                      value={result.actualTime || ''}
                      onChange={(e) => updateResult(item.id, 'actualTime', e.target.value)}
                      className="w-48 px-2 py-1.5 text-xs border border-gray-300 rounded-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Comments</label>
                  <textarea
                    placeholder="Add observations or notes..."
                    value={result.comments || ''}
                    onChange={(e) => updateResult(item.id, 'comments', e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-sm resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// === STEP 7: Success Criteria Q&A ===
function CriteriaQAStep({ criteria, results, setResults }: any) {
  const updateCriteria = (id: string, field: string, value: any) => {
    setResults({
      ...results,
      [id]: { ...results[id], [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Success Criteria Evaluation</h2>
          <p className="text-[10px] text-gray-500 mt-1">Evaluate whether each success criterion was met</p>
        </div>
        <div className="divide-y divide-gray-100">
          {criteria.map((c: any) => {
            const result = results[c.id] || {};
            return (
              <div key={c.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{c.name}</p>
                    <p className="text-[10px] text-gray-500">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCriteria(c.id, 'met', true)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        result.met === true
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      Met
                    </button>
                    <button
                      onClick={() => updateCriteria(c.id, 'met', false)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        result.met === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      Not Met
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Evidence / Justification</label>
                  <textarea
                    placeholder="Provide evidence or explanation..."
                    value={result.evidence || ''}
                    onChange={(e) => updateCriteria(c.id, 'evidence', e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-sm resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === STEP: Findings & Observations ===
function FindingsStep({ findings, setFindings }: any) {
  const addFinding = () => {
    setFindings([...findings, {
      id: `FIND-${String(findings.length + 1).padStart(3, '0')}`,
      category: 'observation',
      severity: 'low',
      area: '',
      description: '',
      recommendation: '',
      priority: 'low',
      assignedTo: ''
    }]);
  };

  const updateFinding = (index: number, field: string, value: string) => {
    const updated = [...findings];
    updated[index] = { ...updated[index], [field]: value };
    setFindings(updated);
  };

  const removeFinding = (index: number) => {
    setFindings(findings.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Findings vs. Issues</p>
            <p className="text-[10px] text-blue-700 mt-1">
              <strong>Findings</strong> are observations, gaps, or improvement opportunities that don't require immediate corrective action.
              <strong className="ml-1">Issues</strong> (next step) are problems requiring formal CAPA (Corrective and Preventive Action).
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Findings & Observations</h2>
        <button onClick={addFinding} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Finding
        </button>
      </div>

      {findings.map((finding: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">{finding.id || `Finding #${index + 1}`}</span>
            <button onClick={() => removeFinding(index)} className="text-red-600 hover:text-red-800">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={finding.category}
                  onChange={(e) => updateFinding(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="observation">Observation</option>
                  <option value="gap">Gap</option>
                  <option value="improvement">Improvement</option>
                  <option value="best-practice">Best Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={finding.severity}
                  onChange={(e) => updateFinding(index, 'severity', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={finding.priority}
                  onChange={(e) => updateFinding(index, 'priority', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Area/Domain</label>
              <input
                type="text"
                value={finding.area}
                onChange={(e) => updateFinding(index, 'area', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                placeholder="e.g., Network Infrastructure, Documentation, Team Coordination"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={finding.description}
                onChange={(e) => updateFinding(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                placeholder="Describe the finding or observation..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Recommendation</label>
              <textarea
                value={finding.recommendation}
                onChange={(e) => updateFinding(index, 'recommendation', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                placeholder="What is recommended to address this finding?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
              <input
                type="text"
                value={finding.assignedTo}
                onChange={(e) => updateFinding(index, 'assignedTo', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                placeholder="Team or person responsible"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// === STEP 8: Issues & CAPA ===
function IssuesStep({ issues, setIssues }: any) {
  const addIssue = () => {
    setIssues([...issues, { description: '', rootCause: '', correctiveAction: '', owner: '', targetDate: '' }]);
  };

  const updateIssue = (index: number, field: string, value: string) => {
    const updated = [...issues];
    updated[index] = { ...updated[index], [field]: value };
    setIssues(updated);
  };

  const removeIssue = (index: number) => {
    setIssues(issues.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      {issues.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <CheckCircleSolidIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-green-800">No Issues Recorded</p>
              <p className="text-[10px] text-green-700 mt-1">
                If issues were identified during the test, add them below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Issues & Corrective Actions</h2>
        <button onClick={addIssue} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Issue
        </button>
      </div>

      {issues.map((issue: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">Issue #{index + 1}</span>
            <button onClick={() => removeIssue(index)} className="text-red-600 hover:text-red-800">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                value={issue.description}
                onChange={(e) => updateIssue(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                placeholder="Describe the issue..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Root Cause</label>
              <textarea
                value={issue.rootCause}
                onChange={(e) => updateIssue(index, 'rootCause', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                placeholder="What caused this issue?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Corrective Action</label>
              <textarea
                value={issue.correctiveAction}
                onChange={(e) => updateIssue(index, 'correctiveAction', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                placeholder="What action will be taken?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
                <select
                  value={issue.owner}
                  onChange={(e) => updateIssue(index, 'owner', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                >
                  <option value="">Select owner...</option>
                  <option value="Sarah Chen">Sarah Chen</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Emily Wang">Emily Wang</option>
                  <option value="David Kim">David Kim</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={issue.targetDate}
                  onChange={(e) => updateIssue(index, 'targetDate', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



// === STEP 9: Summary & Lessons Learned ===
function SummaryStep({ reportData, setReportData }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Executive Summary</h2>
        </div>
        <div className="p-4">
          <textarea
            value={reportData.summary}
            onChange={(e) => setReportData({ ...reportData, summary: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
            placeholder="Provide an executive summary of the test execution and results..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Lessons Learned</h2>
        </div>
        <div className="p-4">
          <textarea
            value={reportData.lessonsLearned}
            onChange={(e) => setReportData({ ...reportData, lessonsLearned: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
            placeholder="Document key lessons learned and recommendations for improvement..."
          />
        </div>
      </div>
    </div>
  );
}

// === NEW STEP: RPO Tracking ===
function RPOTrackingStep({ reportData, setReportData }: any) {
  const addRPOEntry = () => {
    setReportData({
      ...reportData,
      rpoData: [...reportData.rpoData, {
        dataSource: '',
        rpoTarget: '',
        rpoAchieved: '',
        dataLoss: '',
        backupUsed: '',
        comments: '',
      }]
    });
  };

  const removeRPOEntry = (index: number) => {
    setReportData({
      ...reportData,
      rpoData: reportData.rpoData.filter((_: any, i: number) => i !== index)
    });
  };

  const updateRPOEntry = (index: number, field: string, value: string) => {
    const updated = [...reportData.rpoData];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, rpoData: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">RPO Tracking</h3>
        <p className="text-xs text-gray-500">
          Track Recovery Point Objective (RPO) metrics for each data source tested
        </p>
      </div>

      <div className="space-y-4">
        {reportData.rpoData.map((entry: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">RPO Entry #{index + 1}</h4>
              <button
                onClick={() => removeRPOEntry(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Source / System
                </label>
                <input
                  type="text"
                  value={entry.dataSource}
                  onChange={(e) => updateRPOEntry(index, 'dataSource', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Customer Database, Transaction Logs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  RPO Target
                </label>
                <input
                  type="text"
                  value={entry.rpoTarget}
                  onChange={(e) => updateRPOEntry(index, 'rpoTarget', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 4 hours, 1 hour"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  RPO Achieved
                </label>
                <input
                  type="text"
                  value={entry.rpoAchieved}
                  onChange={(e) => updateRPOEntry(index, 'rpoAchieved', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 3.5 hours, 45 minutes"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Loss (if any)
                </label>
                <input
                  type="text"
                  value={entry.dataLoss}
                  onChange={(e) => updateRPOEntry(index, 'dataLoss', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., None, 15 minutes of transactions"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Backup Used
                </label>
                <input
                  type="text"
                  value={entry.backupUsed}
                  onChange={(e) => updateRPOEntry(index, 'backupUsed', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Daily backup from 02:00, Snapshot from 14:30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <input
                  type="text"
                  value={entry.comments}
                  onChange={(e) => updateRPOEntry(index, 'comments', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional notes"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRPOEntry}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add RPO Entry
      </button>
    </div>
  );
}

// === NEW STEP: Failback Procedures ===
function FailbackStep({ reportData, setReportData }: any) {
  const addProcedure = () => {
    setReportData({
      ...reportData,
      failbackProcedures: [...reportData.failbackProcedures, {
        step: '',
        description: '',
        startTime: '',
        endTime: '',
        status: null,
        responsible: '',
        notes: '',
      }]
    });
  };

  const removeProcedure = (index: number) => {
    setReportData({
      ...reportData,
      failbackProcedures: reportData.failbackProcedures.filter((_: any, i: number) => i !== index)
    });
  };

  const updateProcedure = (index: number, field: string, value: any) => {
    const updated = [...reportData.failbackProcedures];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, failbackProcedures: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Failback Procedures</h3>
        <p className="text-xs text-gray-500">
          Document the return-to-normal process and restoration to primary systems
        </p>
      </div>

      <div className="space-y-4">
        {reportData.failbackProcedures.map((proc: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Step #{index + 1}</h4>
              <button
                onClick={() => removeProcedure(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Step Name
                </label>
                <input
                  type="text"
                  value={proc.step}
                  onChange={(e) => updateProcedure(index, 'step', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Data Synchronization, Primary System Validation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={proc.status || ''}
                  onChange={(e) => updateProcedure(index, 'status', e.target.value || null)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={proc.description}
                  onChange={(e) => updateProcedure(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Detailed description of the failback step"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={proc.startTime}
                  onChange={(e) => updateProcedure(index, 'startTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={proc.endTime}
                  onChange={(e) => updateProcedure(index, 'endTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Responsible Person
                </label>
                <input
                  type="text"
                  value={proc.responsible}
                  onChange={(e) => updateProcedure(index, 'responsible', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Name or role"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={proc.notes}
                  onChange={(e) => updateProcedure(index, 'notes', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional notes or observations"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addProcedure}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Failback Step
      </button>
    </div>
  );
}

// === NEW STEP: Technical Evidence ===
function TechnicalEvidenceStep({ reportData, setReportData }: any) {
  const addEvidence = () => {
    setReportData({
      ...reportData,
      technicalEvidence: [...reportData.technicalEvidence, {
        timestamp: new Date().toISOString().slice(0, 16),
        source: '',
        type: 'log',
        description: '',
        content: '',
      }]
    });
  };

  const removeEvidence = (index: number) => {
    setReportData({
      ...reportData,
      technicalEvidence: reportData.technicalEvidence.filter((_: any, i: number) => i !== index)
    });
  };

  const updateEvidence = (index: number, field: string, value: any) => {
    const updated = [...reportData.technicalEvidence];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, technicalEvidence: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Technical Evidence</h3>
        <p className="text-xs text-gray-500">
          Capture log excerpts, metrics, screenshots, and command outputs as technical evidence
        </p>
      </div>

      <div className="space-y-4">
        {reportData.technicalEvidence.map((item: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Evidence #{index + 1}</h4>
              <button
                onClick={() => removeEvidence(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={item.timestamp}
                  onChange={(e) => updateEvidence(index, 'timestamp', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  value={item.source}
                  onChange={(e) => updateEvidence(index, 'source', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Application Server, Database, Monitoring System"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Evidence Type
                </label>
                <select
                  value={item.type}
                  onChange={(e) => updateEvidence(index, 'type', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="log">Log Entry</option>
                  <option value="metric">Metric/Measurement</option>
                  <option value="screenshot">Screenshot</option>
                  <option value="command-output">Command Output</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateEvidence(index, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief description of the evidence"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Content / Excerpt
                </label>
                <textarea
                  value={item.content}
                  onChange={(e) => updateEvidence(index, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Paste log excerpt, metric values, command output, or screenshot reference here..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addEvidence}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Technical Evidence
      </button>
    </div>
  );
}

// === NEW STEP: Compliance Matrix ===
function ComplianceMatrixStep({ reportData, setReportData }: any) {
  const addMapping = () => {
    setReportData({
      ...reportData,
      complianceMatrix: [...reportData.complianceMatrix, {
        requirement: '',
        framework: 'BaFin',
        testActivity: '',
        evidence: '',
        status: null,
      }]
    });
  };

  const removeMapping = (index: number) => {
    setReportData({
      ...reportData,
      complianceMatrix: reportData.complianceMatrix.filter((_: any, i: number) => i !== index)
    });
  };

  const updateMapping = (index: number, field: string, value: any) => {
    const updated = [...reportData.complianceMatrix];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, complianceMatrix: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Regulatory Compliance Matrix</h3>
        <p className="text-xs text-gray-500">
          Map test activities to BaFin, DORA, ISO-22301, and ISO-27001 requirements
        </p>
      </div>

      <div className="space-y-4">
        {reportData.complianceMatrix.map((mapping: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Mapping #{index + 1}</h4>
              <button
                onClick={() => removeMapping(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Framework
                </label>
                <select
                  value={mapping.framework}
                  onChange={(e) => updateMapping(index, 'framework', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="BaFin">BaFin</option>
                  <option value="DORA">DORA</option>
                  <option value="ISO-22301">ISO-22301</option>
                  <option value="ISO-27001">ISO-27001</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Compliance Status
                </label>
                <select
                  value={mapping.status || ''}
                  onChange={(e) => updateMapping(index, 'status', e.target.value || null)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="compliant">Compliant</option>
                  <option value="partial">Partially Compliant</option>
                  <option value="non-compliant">Non-Compliant</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Requirement
                </label>
                <input
                  type="text"
                  value={mapping.requirement}
                  onChange={(e) => updateMapping(index, 'requirement', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., DORA Art. 11 - ICT Business Continuity Testing"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Test Activity
                </label>
                <textarea
                  value={mapping.testActivity}
                  onChange={(e) => updateMapping(index, 'testActivity', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe how this test addresses the requirement"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Evidence
                </label>
                <textarea
                  value={mapping.evidence}
                  onChange={(e) => updateMapping(index, 'evidence', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Reference to test results, documentation, or artifacts that demonstrate compliance"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addMapping}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Compliance Mapping
      </button>
    </div>
  );
}

// === NEW STEP: Business Impact Assessment ===
function BusinessImpactStep({ reportData, setReportData }: any) {
  const addValidation = () => {
    setReportData({
      ...reportData,
      businessImpactValidation: [...reportData.businessImpactValidation, {
        businessProcess: '',
        validationMethod: '',
        expectedOutcome: '',
        actualOutcome: '',
        impactLevel: null,
        notes: '',
      }]
    });
  };

  const removeValidation = (index: number) => {
    setReportData({
      ...reportData,
      businessImpactValidation: reportData.businessImpactValidation.filter((_: any, i: number) => i !== index)
    });
  };

  const updateValidation = (index: number, field: string, value: any) => {
    const updated = [...reportData.businessImpactValidation];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, businessImpactValidation: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Business Impact Assessment</h3>
        <p className="text-xs text-gray-500">
          Validate business process functionality and assess actual impact during the test
        </p>
      </div>

      <div className="space-y-4">
        {reportData.businessImpactValidation.map((validation: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Validation #{index + 1}</h4>
              <button
                onClick={() => removeValidation(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Business Process
                </label>
                <input
                  type="text"
                  value={validation.businessProcess}
                  onChange={(e) => updateValidation(index, 'businessProcess', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Customer Order Processing, Payment Settlement"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Impact Level
                </label>
                <select
                  value={validation.impactLevel || ''}
                  onChange={(e) => updateValidation(index, 'impactLevel', e.target.value || null)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select impact level</option>
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Validation Method
                </label>
                <input
                  type="text"
                  value={validation.validationMethod}
                  onChange={(e) => updateValidation(index, 'validationMethod', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., End-to-end transaction test, User acceptance testing"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Expected Outcome
                </label>
                <textarea
                  value={validation.expectedOutcome}
                  onChange={(e) => updateValidation(index, 'expectedOutcome', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What was expected to happen during the test"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Actual Outcome
                </label>
                <textarea
                  value={validation.actualOutcome}
                  onChange={(e) => updateValidation(index, 'actualOutcome', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What actually happened during the test"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={validation.notes}
                  onChange={(e) => updateValidation(index, 'notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional observations or comments"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addValidation}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Business Process Validation
      </button>
    </div>
  );
}

// === NEW STEP: Third-Party Coordination ===
function ThirdPartyStep({ reportData, setReportData }: any) {
  const addCoordination = () => {
    setReportData({
      ...reportData,
      thirdPartyCoordination: [...reportData.thirdPartyCoordination, {
        vendor: '',
        contactPerson: '',
        communicationTime: '',
        purpose: '',
        response: '',
        slaCompliance: null,
        notes: '',
      }]
    });
  };

  const removeCoordination = (index: number) => {
    setReportData({
      ...reportData,
      thirdPartyCoordination: reportData.thirdPartyCoordination.filter((_: any, i: number) => i !== index)
    });
  };

  const updateCoordination = (index: number, field: string, value: any) => {
    const updated = [...reportData.thirdPartyCoordination];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, thirdPartyCoordination: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Third-Party Coordination</h3>
        <p className="text-xs text-gray-500">
          Document vendor communications and third-party service provider coordination during the test
        </p>
      </div>

      <div className="space-y-4">
        {reportData.thirdPartyCoordination.map((item: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Coordination #{index + 1}</h4>
              <button
                onClick={() => removeCoordination(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vendor / Service Provider
                </label>
                <input
                  type="text"
                  value={item.vendor}
                  onChange={(e) => updateCoordination(index, 'vendor', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., AWS, Microsoft Azure, Data Center Provider"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={item.contactPerson}
                  onChange={(e) => updateCoordination(index, 'contactPerson', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Name and role"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Communication Time
                </label>
                <input
                  type="datetime-local"
                  value={item.communicationTime}
                  onChange={(e) => updateCoordination(index, 'communicationTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SLA Compliance
                </label>
                <select
                  value={item.slaCompliance || ''}
                  onChange={(e) => updateCoordination(index, 'slaCompliance', e.target.value || null)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="met">SLA Met</option>
                  <option value="not-met">SLA Not Met</option>
                  <option value="n/a">N/A</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Purpose of Communication
                </label>
                <textarea
                  value={item.purpose}
                  onChange={(e) => updateCoordination(index, 'purpose', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Notification of DR test, Request for failover support, Status update"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vendor Response
                </label>
                <textarea
                  value={item.response}
                  onChange={(e) => updateCoordination(index, 'response', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Summary of vendor's response and actions taken"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateCoordination(index, 'notes', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional notes or observations"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCoordination}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Vendor Communication
      </button>
    </div>
  );
}

// === NEW STEP: Post-Test Validation ===
function PostValidationStep({ reportData, setReportData }: any) {
  const addValidation = () => {
    setReportData({
      ...reportData,
      postTestValidation: [...reportData.postTestValidation, {
        checkType: '',
        description: '',
        expectedState: '',
        actualState: '',
        status: null,
        validatedBy: '',
        validatedAt: '',
        notes: '',
      }]
    });
  };

  const removeValidation = (index: number) => {
    setReportData({
      ...reportData,
      postTestValidation: reportData.postTestValidation.filter((_: any, i: number) => i !== index)
    });
  };

  const updateValidation = (index: number, field: string, value: any) => {
    const updated = [...reportData.postTestValidation];
    updated[index] = { ...updated[index], [field]: value };
    setReportData({ ...reportData, postTestValidation: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Post-Test Validation</h3>
        <p className="text-xs text-gray-500">
          System health checks and data reconciliation performed after test completion
        </p>
      </div>

      <div className="space-y-4">
        {reportData.postTestValidation.map((validation: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-gray-700">Validation #{index + 1}</h4>
              <button
                onClick={() => removeValidation(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Check Type
                </label>
                <input
                  type="text"
                  value={validation.checkType}
                  onChange={(e) => updateValidation(index, 'checkType', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Data Integrity, System Health, Configuration Verification"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={validation.status || ''}
                  onChange={(e) => updateValidation(index, 'status', e.target.value || null)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={validation.description}
                  onChange={(e) => updateValidation(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Detailed description of the validation check"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Expected State
                </label>
                <textarea
                  value={validation.expectedState}
                  onChange={(e) => updateValidation(index, 'expectedState', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What the system state should be after the test"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Actual State
                </label>
                <textarea
                  value={validation.actualState}
                  onChange={(e) => updateValidation(index, 'actualState', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="The actual system state observed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Validated By
                </label>
                <input
                  type="text"
                  value={validation.validatedBy}
                  onChange={(e) => updateValidation(index, 'validatedBy', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Name of person who performed the validation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Validated At
                </label>
                <input
                  type="datetime-local"
                  value={validation.validatedAt}
                  onChange={(e) => updateValidation(index, 'validatedAt', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={validation.notes}
                  onChange={(e) => updateValidation(index, 'notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional observations or remediation actions"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addValidation}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100"
      >
        <PlusIcon className="w-4 h-4" />
        Add Validation Check
      </button>
    </div>
  );
}

// === STEP 10: Final Review ===
function FinalReviewStep({ reportData, setReportData, testId, isTabletop, tabletopReport }: any) {
  const handleFileUpload = () => {
    // Mock file upload
    const mockFile = { name: `evidence_${Date.now()}.pdf`, size: '2.4 MB' };
    setReportData({
      ...reportData,
      evidenceFiles: [...reportData.evidenceFiles, mockFile]
    });
  };

  const removeFile = (index: number) => {
    setReportData({
      ...reportData,
      evidenceFiles: reportData.evidenceFiles.filter((_: any, i: number) => i !== index)
    });
  };

  const countResults = (results: Record<string, any>) => {
    const values = Object.values(results);
    return {
      pass: values.filter((r: any) => r.result === 'pass').length,
      partial: values.filter((r: any) => r.result === 'partial').length,
      fail: values.filter((r: any) => r.result === 'fail').length,
    };
  };

  const processStats = countResults(reportData.processResults);
  const appStats = countResults(reportData.appResults);
  const hardwareStats = countResults(reportData.hardwareResults);

  // Tabletop stats
  const discussionRatings = tabletopReport?.discussions?.reduce((acc: any, d: any) => {
    if (d.rating) acc[d.rating] = (acc[d.rating] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      {/* Final Result Selection */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Final {isTabletop ? 'Exercise' : 'Test'} Result</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setReportData({ ...reportData, finalResult: 'pass' })}
              className={`flex-1 py-4 rounded-sm border-2 transition-colors ${
                reportData.finalResult === 'pass'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <CheckCircleSolidIcon className={`h-8 w-8 mx-auto mb-2 ${reportData.finalResult === 'pass' ? 'text-green-600' : 'text-gray-300'}`} />
              <p className={`text-sm font-semibold ${reportData.finalResult === 'pass' ? 'text-green-700' : 'text-gray-500'}`}>{isTabletop ? 'SUCCESSFUL' : 'PASS'}</p>
            </button>
            <button
              onClick={() => setReportData({ ...reportData, finalResult: 'partial' })}
              className={`flex-1 py-4 rounded-sm border-2 transition-colors ${
                reportData.finalResult === 'partial'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <ExclamationTriangleIcon className={`h-8 w-8 mx-auto mb-2 ${reportData.finalResult === 'partial' ? 'text-amber-500' : 'text-gray-300'}`} />
              <p className={`text-sm font-semibold ${reportData.finalResult === 'partial' ? 'text-amber-700' : 'text-gray-500'}`}>PARTIAL</p>
            </button>
            <button
              onClick={() => setReportData({ ...reportData, finalResult: 'fail' })}
              className={`flex-1 py-4 rounded-sm border-2 transition-colors ${
                reportData.finalResult === 'fail'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <XMarkIcon className={`h-8 w-8 mx-auto mb-2 ${reportData.finalResult === 'fail' ? 'text-red-600' : 'text-gray-300'}`} />
              <p className={`text-sm font-semibold ${reportData.finalResult === 'fail' ? 'text-red-700' : 'text-gray-500'}`}>{isTabletop ? 'UNSUCCESSFUL' : 'FAIL'}</p>
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Justification <span className="text-red-500">*</span></label>
            <textarea
              value={reportData.justification}
              onChange={(e) => setReportData({ ...reportData, justification: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
              placeholder="Provide justification for the final result..."
            />
          </div>
        </div>
      </div>

      {/* Results Summary - Different for BCP vs Tabletop */}
      {isTabletop ? (
        /* Tabletop Exercise Summary */
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Exercise Summary</h2>
          </div>
          <div className="p-4 grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Attendance</p>
              <p className="text-lg font-bold text-gray-900">{tabletopReport?.attendance?.attended?.length || 0}/{tabletopReport?.attendance?.planned?.length || 0}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Discussions</p>
              <div className="flex justify-center gap-1 text-xs">
                <span className="text-green-600">{discussionRatings.excellent || 0} Exc</span>
                <span className="text-blue-600">{discussionRatings.good || 0} Good</span>
                <span className="text-amber-600">{discussionRatings.fair || 0} Fair</span>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Findings</p>
              <p className="text-lg font-bold text-gray-900">{tabletopReport?.findings?.length || 0}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Positives</p>
              <p className="text-lg font-bold text-green-600">{tabletopReport?.feedback?.whatWentWell?.length || 0}</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600">
              <strong>Issues Identified:</strong> {reportData.issues.length}
            </p>
          </div>
        </div>
      ) : (
        /* BCP Test Summary */
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Results Summary</h2>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Processes</p>
              <div className="flex justify-center gap-2 text-xs">
                <span className="text-green-600">{processStats.pass} Pass</span>
                <span className="text-amber-600">{processStats.partial} Partial</span>
                <span className="text-red-600">{processStats.fail} Fail</span>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Applications</p>
              <div className="flex justify-center gap-2 text-xs">
                <span className="text-green-600">{appStats.pass} Pass</span>
                <span className="text-amber-600">{appStats.partial} Partial</span>
                <span className="text-red-600">{appStats.fail} Fail</span>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-sm">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Hardware</p>
              <div className="flex justify-center gap-2 text-xs">
                <span className="text-green-600">{hardwareStats.pass} Pass</span>
                <span className="text-amber-600">{hardwareStats.partial} Partial</span>
                <span className="text-red-600">{hardwareStats.fail} Fail</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-600">
              <strong>Issues Identified:</strong> {reportData.issues.length}
            </p>
          </div>
        </div>
      )}

      {/* Evidence Upload */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Supporting Evidence</h2>
          <button onClick={handleFileUpload} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
            <CloudArrowUpIcon className="h-3.5 w-3.5 mr-1" />
            Upload File
          </button>
        </div>
        {reportData.evidenceFiles.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No evidence files uploaded</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reportData.evidenceFiles.map((file: any, index: number) => (
              <div key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DocumentCheckIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-900">{file.name}</span>
                  <span className="text-[10px] text-gray-500">{file.size}</span>
                </div>
                <button onClick={() => removeFile(index)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// TABLETOP EXERCISE REPORT STEPS
// ============================================

// === TABLETOP STEP 1: Logistics ===
function LogisticsStep({ data, setData }: any) {
  const updateLogistics = (field: string, value: any) => {
    setData({ ...data, logistics: { ...data.logistics, [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-800">Exercise Logistics</p>
            <p className="text-[10px] text-amber-700 mt-1">
              Confirm the actual exercise timing, location, and host details.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Exercise Details</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Actual Start Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={data.logistics.actualStart}
                onChange={(e) => updateLogistics('actualStart', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Actual End Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={data.logistics.actualEnd}
                onChange={(e) => updateLogistics('actualEnd', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.logistics.location}
              onChange={(e) => updateLogistics('location', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="e.g., Conference Room A, Virtual (Teams), etc."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Facilitator</label>
            <input
              type="text"
              value={data.logistics.facilitator}
              onChange={(e) => updateLogistics('facilitator', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Name of the exercise facilitator"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="hostConfirmed"
              checked={data.logistics.hostConfirmed}
              onChange={(e) => updateLogistics('hostConfirmed', e.target.checked)}
              className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="hostConfirmed" className="text-xs text-gray-700">
              Host/Facilitator confirmed exercise was conducted as planned
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}


// === TABLETOP STEP 2: Attendance ===
function AttendanceStep({ data, setData }: any) {
  const toggleAttendance = (name: string) => {
    const attended = data.attendance.attended.includes(name)
      ? data.attendance.attended.filter((n: string) => n !== name)
      : [...data.attendance.attended, name];
    const absentees = data.attendance.planned
      .map((p: any) => p.name)
      .filter((n: string) => !attended.includes(n));
    setData({ ...data, attendance: { ...data.attendance, attended, absentees } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <UserGroupIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Attendance Tracking</p>
            <p className="text-[10px] text-blue-700 mt-1">
              Mark which planned participants actually attended the exercise.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Planned Participants</h2>
          <p className="text-[10px] text-gray-500 mt-1">Click to mark attendance</p>
        </div>
        <div className="divide-y divide-gray-100">
          {data.attendance.planned.map((participant: any) => {
            const attended = data.attendance.attended.includes(participant.name);
            return (
              <div
                key={participant.name}
                onClick={() => toggleAttendance(participant.name)}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                  attended ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {participant.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">{participant.name}</p>
                    <p className="text-[10px] text-gray-500">{participant.role}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-medium ${
                  attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {attended ? '✓ Attended' : 'Not Marked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{data.attendance.attended.length}</p>
          <p className="text-xs text-green-600">Attended</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-700">{data.attendance.planned.length - data.attendance.attended.length}</p>
          <p className="text-xs text-gray-600">Absent</p>
        </div>
      </div>
    </div>
  );
}

// === TABLETOP STEP 3: Scenario Discussions ===
function DiscussionsStep({ data, setData }: any) {
  const updateDiscussion = (index: number, field: string, value: any) => {
    const updated = [...data.discussions];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, discussions: updated });
  };

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'good', label: 'Good', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'fair', label: 'Fair', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { value: 'poor', label: 'Poor', color: 'bg-red-100 text-red-700 border-red-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-purple-800">Scenario Discussions</p>
            <p className="text-[10px] text-purple-700 mt-1">
              Document the actual responses and rate them against expected outcomes.
            </p>
          </div>
        </div>
      </div>

      {data.discussions.map((discussion: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-gray-900 text-white rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <h3 className="text-xs font-semibold text-gray-900">{discussion.topic}</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-sm p-3">
              <p className="text-[10px] text-blue-600 uppercase font-medium mb-1">Expected Response</p>
              <p className="text-xs text-blue-800">{discussion.expectedResponse}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Actual Response <span className="text-red-500">*</span></label>
              <textarea
                value={discussion.actualResponse}
                onChange={(e) => updateDiscussion(index, 'actualResponse', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Describe how the team actually responded..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Rating vs Expected</label>
              <div className="flex gap-2">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateDiscussion(index, 'rating', option.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${
                      discussion.rating === option.value
                        ? option.color + ' ring-2 ring-offset-1 ring-gray-400'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Comments</label>
              <textarea
                value={discussion.comments}
                onChange={(e) => updateDiscussion(index, 'comments', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Any additional observations or notes..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


// === TABLETOP STEP 4: Findings ===
function TabletopFindingsStep({ data, setData }: any) {
  const addFinding = () => {
    setData({
      ...data,
      findings: [...data.findings, { description: '', category: 'observation', priority: 'medium' }]
    });
  };

  const updateFinding = (index: number, field: string, value: any) => {
    const updated = [...data.findings];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, findings: updated });
  };

  const removeFinding = (index: number) => {
    setData({ ...data, findings: data.findings.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <LightBulbIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-800">Findings & Observations</p>
            <p className="text-[10px] text-amber-700 mt-1">
              Document gaps, improvements, and observations identified during the exercise.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Findings ({data.findings.length})</h2>
          <button
            onClick={addFinding}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Finding
          </button>
        </div>
        {data.findings.length === 0 ? (
          <div className="p-8 text-center">
            <LightBulbIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No findings added yet</p>
            <button onClick={addFinding} className="mt-2 text-xs text-blue-600 hover:text-blue-800">
              Add your first finding
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.findings.map((finding: any, index: number) => (
              <div key={index} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Finding #{index + 1}</span>
                  <button onClick={() => removeFinding(index)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={finding.description}
                  onChange={(e) => updateFinding(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                  placeholder="Describe the finding..."
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Category</label>
                    <select
                      value={finding.category}
                      onChange={(e) => updateFinding(index, 'category', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                    >
                      <option value="gap">Gap</option>
                      <option value="improvement">Improvement Opportunity</option>
                      <option value="observation">Observation</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Priority</label>
                    <select
                      value={finding.priority}
                      onChange={(e) => updateFinding(index, 'priority', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// === TABLETOP STEP 5: Feedback & What Went Well ===
function FeedbackStep({ data, setData }: any) {
  const [newWentWell, setNewWentWell] = useState('');

  const addWentWell = () => {
    if (newWentWell.trim()) {
      setData({
        ...data,
        feedback: { ...data.feedback, whatWentWell: [...data.feedback.whatWentWell, newWentWell.trim()] }
      });
      setNewWentWell('');
    }
  };

  const removeWentWell = (index: number) => {
    setData({
      ...data,
      feedback: { ...data.feedback, whatWentWell: data.feedback.whatWentWell.filter((_: any, i: number) => i !== index) }
    });
  };

  const addParticipantFeedback = () => {
    setData({
      ...data,
      feedback: {
        ...data.feedback,
        participantFeedback: [...data.feedback.participantFeedback, { participant: '', feedback: '', rating: 4 }]
      }
    });
  };

  const updateParticipantFeedback = (index: number, field: string, value: any) => {
    const updated = [...data.feedback.participantFeedback];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, feedback: { ...data.feedback, participantFeedback: updated } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <HandThumbUpIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-green-800">Feedback & Positives</p>
            <p className="text-[10px] text-green-700 mt-1">
              Capture what went well and collect participant feedback.
            </p>
          </div>
        </div>
      </div>

      {/* What Went Well */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">What Went Well</h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWentWell}
              onChange={(e) => setNewWentWell(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWentWell()}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-sm"
              placeholder="Add something that went well..."
            />
            <button
              onClick={addWentWell}
              className="px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700"
            >
              Add
            </button>
          </div>
          {data.feedback.whatWentWell.length > 0 && (
            <ul className="space-y-2">
              {data.feedback.whatWentWell.map((item: string, index: number) => (
                <li key={index} className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-sm">
                  <span className="text-xs text-green-800">✓ {item}</span>
                  <button onClick={() => removeWentWell(index)} className="text-green-600 hover:text-green-800">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Participant Feedback */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Participant Feedback</h2>
          <button
            onClick={addParticipantFeedback}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Feedback
          </button>
        </div>
        {data.feedback.participantFeedback.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No participant feedback collected yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.feedback.participantFeedback.map((fb: any, index: number) => (
              <div key={index} className="p-4 space-y-3">
                <input
                  type="text"
                  value={fb.participant}
                  onChange={(e) => updateParticipantFeedback(index, 'participant', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm"
                  placeholder="Participant name"
                />
                <textarea
                  value={fb.feedback}
                  onChange={(e) => updateParticipantFeedback(index, 'feedback', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none"
                  placeholder="Their feedback..."
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateParticipantFeedback(index, 'rating', star)}
                      className={`text-lg ${fb.rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// === TABLETOP STEP 6: Management Summary ===
function ManagementSummaryStep({ data, setData }: any) {
  const updateSummary = (field: string, value: string) => {
    setData({ ...data, managementSummary: { ...data.managementSummary, [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <DocumentCheckIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-indigo-800">Management Summary</p>
            <p className="text-[10px] text-indigo-700 mt-1">
              Prepare the executive summary, key findings, and recommendations for management review.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Executive Summary</h2>
          <p className="text-[10px] text-gray-500 mt-1">High-level overview of the exercise for senior leadership</p>
        </div>
        <div className="p-4">
          <textarea
            value={data.managementSummary.executiveSummary}
            onChange={(e) => updateSummary('executiveSummary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            placeholder="Provide a brief executive summary of the exercise, including purpose, scope, and overall outcome..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Key Findings</h2>
          <p className="text-[10px] text-gray-500 mt-1">Summarize the most important findings from the exercise</p>
        </div>
        <div className="p-4">
          <textarea
            value={data.managementSummary.keyFindings}
            onChange={(e) => updateSummary('keyFindings', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            placeholder="List the key findings that require management attention..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Recommendations</h2>
          <p className="text-[10px] text-gray-500 mt-1">Proposed actions and improvements based on exercise outcomes</p>
        </div>
        <div className="p-4">
          <textarea
            value={data.managementSummary.recommendations}
            onChange={(e) => updateSummary('recommendations', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            placeholder="Provide recommendations for improving business continuity capabilities..."
          />
        </div>
      </div>

      {/* Quick Stats from Exercise */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Exercise Statistics</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{data.attendance?.attended?.length || 0}</p>
            <p className="text-[10px] text-gray-500">Attendees</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.discussions?.filter((d: any) => d.actualResponse).length || 0}</p>
            <p className="text-[10px] text-gray-500">Topics Discussed</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.findings?.length || 0}</p>
            <p className="text-[10px] text-gray-500">Findings</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.feedback?.whatWentWell?.length || 0}</p>
            <p className="text-[10px] text-gray-500">Positives</p>
          </div>
        </div>
      </div>
    </div>
  );
}