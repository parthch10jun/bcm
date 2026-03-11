'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIAgent from '@/components/AIAgent';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CloudIcon,
  CpuChipIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BookOpenIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  BoltIcon,
  ShieldExclamationIcon,
  SignalIcon,
  FireIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

// Comprehensive IT Asset Data with real metrics
const IT_ASSETS = {
  infrastructure: [
    { id: 'DC-001', name: 'Primary Data Center - Newark', type: 'Data Center', tier: 1, rto: 0.5, rpo: 0.08, status: 'Active', location: 'Newark, NJ', capacity: '500 Racks', redundancy: 'N+1', uptime: 99.99 },
    { id: 'DC-002', name: 'DR Site - Chicago', type: 'Data Center', tier: 1, rto: 1, rpo: 0.25, status: 'Standby', location: 'Chicago, IL', capacity: '300 Racks', redundancy: 'N+1', uptime: 99.95 },
    { id: 'NET-001', name: 'Core Network Infrastructure', type: 'Network', tier: 1, rto: 0.5, rpo: 0, status: 'Active', bandwidth: '100 Gbps', redundancy: 'Active-Active' },
  ],
  servers: [
    { id: 'SRV-001', name: 'SAP HANA Production Cluster', type: 'Database Server', tier: 1, rto: 2, rpo: 0.25, status: 'Active', cpu: '128 vCPU', ram: '2 TB', storage: '50 TB NVMe', os: 'SLES 15 SP4' },
    { id: 'SRV-002', name: 'Oracle Database Primary', type: 'Database Server', tier: 1, rto: 2, rpo: 0.25, status: 'Active', cpu: '64 vCPU', ram: '512 GB', storage: '20 TB SSD', os: 'Oracle Linux 8' },
    { id: 'SRV-003', name: 'Active Directory Domain Controllers', type: 'Authentication', tier: 1, rto: 1, rpo: 0.08, status: 'Active', instances: 4, replication: 'Multi-site' },
    { id: 'SRV-004', name: 'Exchange Server Cluster', type: 'Email', tier: 1, rto: 4, rpo: 1, status: 'Active', mailboxes: 5000, storage: '10 TB' },
    { id: 'SRV-005', name: 'VMware vSphere Cluster', type: 'Virtualization', tier: 1, rto: 1, rpo: 0.5, status: 'Active', hosts: 12, vms: 450 },
  ],
  applications: [
    { id: 'APP-001', name: 'Core Banking System (T24)', type: 'Business Critical', tier: 1, rto: 2, rpo: 0.25, status: 'Active', users: 2500, transactions: '50K/day', vendor: 'Temenos' },
    { id: 'APP-002', name: 'Customer Portal', type: 'Customer Facing', tier: 1, rto: 3, rpo: 0.5, status: 'Active', users: 150000, sessions: '10K concurrent', uptime: 99.9 },
    { id: 'APP-003', name: 'Trading Platform', type: 'Business Critical', tier: 1, rto: 1, rpo: 0.08, status: 'Active', trades: '100K/day', latency: '<10ms' },
    { id: 'APP-004', name: 'HR & Payroll System', type: 'Internal', tier: 2, rto: 24, rpo: 4, status: 'Active', employees: 5000, vendor: 'Workday' },
    { id: 'APP-005', name: 'Document Management', type: 'Internal', tier: 2, rto: 8, rpo: 2, status: 'Active', documents: '10M', storage: '5 TB' },
  ],
  security: [
    { id: 'SEC-001', name: 'Firewall Cluster (Palo Alto)', type: 'Security', tier: 1, rto: 0.5, rpo: 0, status: 'Active', throughput: '40 Gbps', rules: 2500 },
    { id: 'SEC-002', name: 'SIEM Platform (Splunk)', type: 'Security', tier: 1, rto: 4, rpo: 1, status: 'Active', events: '50GB/day', retention: '90 days' },
    { id: 'SEC-003', name: 'Endpoint Protection (CrowdStrike)', type: 'Security', tier: 1, rto: 2, rpo: 0, status: 'Active', endpoints: 6000 },
  ],
  backup: [
    { id: 'BKP-001', name: 'Veeam Backup Infrastructure', type: 'Backup', tier: 1, rto: 4, rpo: 1, status: 'Active', capacity: '500 TB', dailyBackup: '15 TB' },
    { id: 'BKP-002', name: 'Tape Library (Quantum)', type: 'Archive', tier: 2, rto: 24, rpo: 24, status: 'Active', capacity: '2 PB', retention: '7 years' },
    { id: 'BKP-003', name: 'Cloud Backup (AWS S3)', type: 'Cloud Backup', tier: 1, rto: 8, rpo: 4, status: 'Active', region: 'us-east-1', encryption: 'AES-256' },
  ]
};

// Recovery strategies mapped to assets
const RECOVERY_STRATEGIES = {
  'DC-001': { primary: 'Failover to DC-002', secondary: 'Cloud burst to AWS', mttr: '30 mins', tested: '2024-10-15', result: 'Pass' },
  'SRV-001': { primary: 'SAP HANA System Replication to DR', secondary: 'Restore from Veeam', mttr: '45 mins', tested: '2024-11-01', result: 'Pass' },
  'SRV-002': { primary: 'Oracle Data Guard Failover', secondary: 'RMAN Restore', mttr: '60 mins', tested: '2024-09-20', result: 'Pass' },
  'SRV-003': { primary: 'Multi-site AD Replication', secondary: 'Authoritative Restore', mttr: '15 mins', tested: '2024-11-10', result: 'Pass' },
  'APP-001': { primary: 'Application Cluster Failover', secondary: 'DR Site Activation', mttr: '90 mins', tested: '2024-10-25', result: 'Pass' },
  'APP-002': { primary: 'Load Balancer Failover', secondary: 'CDN Failover', mttr: '5 mins', tested: '2024-11-05', result: 'Pass' },
  'APP-003': { primary: 'Active-Active Failover', secondary: 'Warm Standby', mttr: '2 mins', tested: '2024-11-15', result: 'Pass' },
};

type SimulationStep = {
  id: number;
  time: string;
  system: string;
  systemId: string;
  event: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'active' | 'failed' | 'recovered';
  dependencies: string[];
  recoveryAction?: string;
  rtoTarget?: number;
  actualRecovery?: number;
  insights?: string[];
};

export default function SimulationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string>('people-displacement');

  // State for showing insights panel
  const [showInsights, setShowInsights] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const scenarios = {
    'people-displacement': {
      name: 'Mass People Displacement',
      description: 'Office evacuation due to pandemic lockdown affecting 950 employees across Mumbai office',
      duration: '1h 50m',
      affectedSystems: 12,
      icon: '👥',
      color: 'from-purple-500 to-pink-600',
      riskScore: 90,
      businessImpact: '$1.8M/hour',
      enablerType: 'Human Resources',
      strategy: 'Work from Home / Alternate Site',
      steps: [
        {
          id: 1, time: 'T+0:00', system: 'Mumbai Head Office', systemId: 'FAC-001',
          event: 'Government announces immediate lockdown - Office evacuation required for 950 employees',
          impact: 'critical' as const, status: 'pending' as const, dependencies: [],
          rtoTarget: 2, insights: ['All employees must vacate within 2 hours', 'Remote work infrastructure must be activated immediately']
        },
        {
          id: 2, time: 'T+0:05', system: 'BCP Team Activation', systemId: 'TEAM-001',
          event: 'BCP team activated - HR leadership notified - Emergency notification sent to all staff',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['FAC-001'],
          rtoTarget: 0.25, insights: ['950 employees affected', 'Critical staff: 450 Tier 1, 320 Tier 2', 'VPN capacity: 1000 concurrent users']
        },
        {
          id: 3, time: 'T+0:10', system: 'VPN Infrastructure', systemId: 'SYS-001',
          event: 'VPN capacity check - Current: 120 users, Capacity: 1000 users - Scaling initiated',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['TEAM-001'],
          rtoTarget: 0.5, recoveryAction: 'Activate additional VPN concentrators',
          insights: ['VPN licenses available: 1000', 'Bandwidth: 10 Gbps available', 'Authentication via Azure AD']
        },
        {
          id: 4, time: 'T+0:15', system: 'Mass Notification System', systemId: 'COMM-001',
          event: 'Work-from-home instructions sent to all 950 employees via SMS, Email, and Teams',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['TEAM-001'],
          rtoTarget: 0.25, recoveryAction: 'Send WFH setup guide and VPN credentials',
          insights: ['Delivery rate: 98%', 'Response rate tracking enabled', 'IT helpdesk scaled up']
        },
        {
          id: 5, time: 'T+0:20', system: 'Collaboration Tools (Teams/Zoom)', systemId: 'SYS-003',
          event: 'Virtual meeting rooms created for all departments - 85 team channels activated',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['TEAM-001'],
          rtoTarget: 0.5, insights: ['Teams licenses: Unlimited', 'Zoom capacity: 500 concurrent meetings', 'Recording enabled for critical meetings']
        },
        {
          id: 6, time: 'T+0:30', system: 'Employee Access Provisioning', systemId: 'IAM-001',
          event: 'Remote access activated for 450 Tier 1 critical staff - VPN accounts provisioned',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['SYS-001'],
          rtoTarget: 1, recoveryAction: 'Bulk VPN account activation via automation',
          insights: ['MFA enrollment: 100%', 'Conditional access policies applied', 'Session monitoring enabled']
        },
        {
          id: 7, time: 'T+0:45', system: 'Core Business Applications', systemId: 'APP-001',
          event: 'Remote access to SAP, Oracle, and CRM systems verified - 380 users online',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['IAM-001'],
          rtoTarget: 1.5, insights: ['Application performance: Normal', 'Citrix gateway: Operational', 'Database connections: Stable']
        },
        {
          id: 8, time: 'T+0:50', system: 'Backup Office - Navi Mumbai', systemId: 'FAC-002',
          event: 'Backup office activated for 50 critical staff who cannot work from home',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['TEAM-001'],
          recoveryAction: 'Assign workstations and coordinate transportation',
          insights: ['Capacity: 70 workstations', 'Transportation arranged for 50 staff', 'Social distancing protocols in place']
        },
        {
          id: 9, time: 'T+1:00', system: 'IT Helpdesk', systemId: 'SUPPORT-001',
          event: 'Helpdesk scaled to handle 150 concurrent support requests - Remote support tools activated',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['TEAM-001'],
          insights: ['Ticket volume: 180 requests', 'Average resolution time: 8 minutes', 'Common issues: VPN setup, laptop configuration']
        },
        {
          id: 10, time: 'T+1:10', system: 'Tier 2 Staff Access', systemId: 'IAM-002',
          event: 'Remote access activated for 320 Tier 2 essential staff',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['SYS-001'],
          actualRecovery: 1.17, rtoTarget: 2,
          insights: ['✅ RTO MET: 1h 10m vs 2 hour target', 'Total users online: 700', 'VPN utilization: 70%']
        },
        {
          id: 11, time: 'T+1:20', system: 'Productivity Monitoring', systemId: 'MON-001',
          event: 'Productivity metrics dashboard activated - Real-time monitoring of remote workforce',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['APP-001'],
          actualRecovery: 1.33, rtoTarget: 2,
          insights: ['✅ Active users: 820/950 (86%)', 'Application usage: Normal', 'Network performance: Optimal']
        },
        {
          id: 12, time: 'T+1:30', system: 'Customer-Facing Services', systemId: 'CUST-001',
          event: 'All customer-facing services operational - Call center, email support, and chat active',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['APP-001'],
          actualRecovery: 1.5, rtoTarget: 2,
          insights: ['✅ RTO MET: 1h 30m vs 2 hour target', 'Customer service SLA: Met', 'No customer impact reported']
        },
        {
          id: 13, time: 'T+1:40', system: 'Tier 3 Support Staff', systemId: 'IAM-003',
          event: 'Remote access activated for 150 Tier 3 support staff',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['SYS-001'],
          actualRecovery: 1.67, rtoTarget: 2,
          insights: ['✅ Total users online: 920/950 (97%)', 'VPN utilization: 92%', 'Bandwidth usage: 7.5 Gbps']
        },
        {
          id: 14, time: 'T+1:45', system: 'Business Operations Validation', systemId: 'OPS-001',
          event: 'All critical business functions validated - Productivity at 95% of normal levels',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['APP-001', 'CUST-001'],
          actualRecovery: 1.75, rtoTarget: 2,
          insights: ['✅ RTO MET: 1h 45m vs 2 hour target', 'Transaction processing: Normal', 'No business disruption']
        },
        {
          id: 15, time: 'T+1:50', system: 'All Personnel & Systems', systemId: 'ALL',
          event: 'BCP activation complete - 950 employees transitioned to remote work successfully',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['IAM-001', 'IAM-002', 'IAM-003'],
          insights: ['✅ SIMULATION COMPLETE', 'All 950 employees online', 'Total transition time: 1h 50m', 'All RTOs achieved', 'Business continuity maintained']
        }
      ]
    },
    'building-evacuation': {
      name: 'Building Evacuation - Fire Emergency',
      description: 'Fire alarm triggered in Head Office - Immediate evacuation of 850 employees required',
      duration: '3h 45m',
      affectedSystems: 10,
      icon: '🏢',
      color: 'from-red-500 to-orange-600',
      riskScore: 92,
      businessImpact: '$2.2M/hour',
      enablerType: 'Building',
      strategy: 'Alternate Facility Activation',
      steps: [
        {
          id: 1, time: 'T+0:00', system: 'CrowdStrike Falcon (SEC-003)', systemId: 'SEC-003',
          event: 'ALERT: Ransomware behavior detected on WKSTN-FIN-042 - Encryption activity in progress',
          impact: 'critical' as const, status: 'pending' as const, dependencies: [],
          insights: ['Initial infection via phishing email', 'User clicked malicious attachment', 'Process: svchost.exe (suspicious)']
        },
        {
          id: 2, time: 'T+0:02', system: 'Palo Alto Firewall (SEC-001)', systemId: 'SEC-001',
          event: 'Network isolation initiated - Infected subnet quarantined',
          impact: 'critical' as const, status: 'pending' as const, dependencies: ['SEC-003'],
          recoveryAction: 'Block lateral movement via micro-segmentation',
          insights: ['C2 communication blocked', '47 IP addresses blacklisted', 'East-West traffic restricted']
        },
        {
          id: 3, time: 'T+0:05', system: 'SIEM Platform Splunk (SEC-002)', systemId: 'SEC-002',
          event: 'Threat hunting initiated - Identifying scope of compromise',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['SEC-001'],
          insights: ['23 workstations show IOCs', '3 file servers encrypted', 'AD not compromised']
        },
        {
          id: 4, time: 'T+0:10', system: 'Security Operations Center', systemId: 'SOC',
          event: 'Incident Response Team activated - CISO notified',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['SEC-002'],
          insights: ['Law enforcement notification prepared', 'Cyber insurance carrier contacted', 'Legal team engaged']
        },
        {
          id: 5, time: 'T+0:15', system: 'Active Directory (SRV-003)', systemId: 'SRV-003',
          event: 'Emergency password reset for compromised accounts',
          impact: 'high' as const, status: 'pending' as const, dependencies: ['SOC'],
          recoveryAction: 'Force MFA re-enrollment for affected users',
          insights: ['3 accounts compromised', 'Kerberos tickets invalidated', 'Service accounts verified clean']
        },
        {
          id: 6, time: 'T+0:20', system: 'Veeam Backup (BKP-001)', systemId: 'BKP-001',
          event: 'Clean backup verification - Immutable backups confirmed intact',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['SOC'],
          insights: ['✅ Immutable backups: 99% intact', 'Last clean backup: 4 hours ago', 'Air-gapped tape backup available']
        },
        {
          id: 7, time: 'T+0:30', system: 'Document Management (APP-005)', systemId: 'APP-005',
          event: 'File server restoration initiated from clean backups',
          impact: 'medium' as const, status: 'pending' as const, dependencies: ['BKP-001'],
          rtoTarget: 8, insights: ['10 million documents to restore', 'Estimated time: 45 minutes', 'Priority: Financial documents first']
        },
        {
          id: 8, time: 'T+0:45', system: 'Endpoint Protection', systemId: 'SEC-003-CLEAN',
          event: 'Clean endpoints verified - 5,977 of 6,000 confirmed malware-free',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['SOC'],
          insights: ['23 endpoints being reimaged', 'EDR signatures updated', 'All endpoints scanned']
        },
        {
          id: 9, time: 'T+0:60', system: 'File Servers', systemId: 'APP-005-DR',
          event: 'Critical documents restored - Financial and legal files recovered',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['APP-005'],
          actualRecovery: 1, rtoTarget: 8,
          insights: ['✅ RTO MET: 60 mins vs 8 hour target', '8.5 million documents restored', 'Integrity verification: PASSED']
        },
        {
          id: 10, time: 'T+0:75', system: 'All Workstations', systemId: 'ENDPOINTS',
          event: 'Affected workstations reimaged and restored to production',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['SEC-003-CLEAN'],
          insights: ['23 workstations reimaged', 'User data restored from OneDrive', 'Productivity tools verified']
        },
        {
          id: 11, time: 'T+0:85', system: 'Network Perimeter', systemId: 'NET-RESTORE',
          event: 'Network quarantine lifted - Normal operations resumed',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['ENDPOINTS', 'APP-005-DR'],
          insights: ['Firewall rules updated', 'Enhanced monitoring enabled', 'Threat hunting continues']
        },
        {
          id: 12, time: 'T+0:90', system: 'Full Environment', systemId: 'ALL',
          event: 'Ransomware incident contained - All systems operational',
          impact: 'low' as const, status: 'pending' as const, dependencies: ['NET-RESTORE'],
          insights: ['✅ INCIDENT CONTAINED', 'Zero ransom paid', 'All data recovered from backups', 'Post-incident review scheduled']
        }
      ]
    }
  };

  const [steps, setSteps] = useState<SimulationStep[]>(scenarios[selectedScenario as keyof typeof scenarios].steps);

  // Loading animation effect
  useEffect(() => {
    const stages = [
      { text: 'Initializing BCP Simulation Environment...', duration: 800 },
      { text: 'Loading Enabler Dependencies...', duration: 700 },
      { text: 'Establishing Secure Connections...', duration: 600 },
      { text: 'Validating Continuity Procedures...', duration: 700 },
      { text: 'Preparing Scenario Data...', duration: 600 },
      { text: 'Simulation Ready', duration: 500 }
    ];

    let currentStage = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2;
      setLoadingProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, 60);

    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setLoadingStage(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 650);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, []);

  useEffect(() => {
    setSteps(scenarios[selectedScenario as keyof typeof scenarios].steps);
    setCurrentStep(0);
    setIsRunning(false);
  }, [selectedScenario]);

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map((step, idx) => {
          if (idx === currentStep) {
            return { ...step, status: step.impact === 'critical' || step.impact === 'high' ? 'failed' : 'recovered' };
          }
          if (idx < currentStep) {
            return step;
          }
          if (idx === currentStep + 1) {
            return { ...step, status: 'active' };
          }
          return step;
        }));
        setCurrentStep(prev => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsRunning(false);
      setSimulationComplete(true);
      setShowInsights(true);
    }
  }, [isRunning, currentStep, steps.length]);

  const handleReset = () => {
    setSteps(scenarios[selectedScenario as keyof typeof scenarios].steps);
    setCurrentStep(0);
    setIsRunning(false);
    setSimulationComplete(false);
    setShowInsights(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <ClockIcon className="h-5 w-5 text-blue-600 animate-pulse" />;
    if (status === 'failed') return <XCircleIcon className="h-5 w-5 text-red-600" />;
    if (status === 'recovered') return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const getSystemIcon = (system: string) => {
    if (system.includes('Data Center') || system.includes('DC-')) return <ServerIcon className="h-5 w-5" />;
    if (system.includes('Cloud') || system.includes('Backup') || system.includes('Veeam')) return <CloudIcon className="h-5 w-5" />;
    if (system.includes('SAP') || system.includes('Oracle') || system.includes('Database')) return <CircleStackIcon className="h-5 w-5" />;
    if (system.includes('Portal') || system.includes('Customer')) return <GlobeAltIcon className="h-5 w-5" />;
    if (system.includes('Security') || system.includes('CrowdStrike') || system.includes('Firewall') || system.includes('SIEM')) return <ShieldCheckIcon className="h-5 w-5" />;
    if (system.includes('Team') || system.includes('SOC') || system.includes('Command')) return <UserGroupIcon className="h-5 w-5" />;
    if (system.includes('Active Directory') || system.includes('Authentication')) return <ShieldExclamationIcon className="h-5 w-5" />;
    if (system.includes('Trading')) return <ChartBarIcon className="h-5 w-5" />;
    if (system.includes('Email') || system.includes('Exchange')) return <BellIcon className="h-5 w-5" />;
    if (system.includes('Network') || system.includes('Endpoint')) return <SignalIcon className="h-5 w-5" />;
    return <CpuChipIcon className="h-5 w-5" />;
  };

  const currentScenario = scenarios[selectedScenario as keyof typeof scenarios];

  // Calculate simulation metrics
  const getSimulationMetrics = () => {
    const completedSteps = steps.filter(s => s.status === 'failed' || s.status === 'recovered');
    const rtoMet = steps.filter(s => s.actualRecovery && s.rtoTarget && s.actualRecovery <= s.rtoTarget).length;
    const totalWithRto = steps.filter(s => s.rtoTarget).length;
    return {
      progress: Math.round((completedSteps.length / steps.length) * 100),
      rtoCompliance: totalWithRto > 0 ? Math.round((rtoMet / totalWithRto) * 100) : 0,
      systemsRecovered: steps.filter(s => s.status === 'recovered').length,
      criticalFailures: steps.filter(s => s.status === 'failed' && s.impact === 'critical').length
    };
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black items-center justify-center overflow-hidden relative">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Pulsing circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main loading content */}
        <div className="relative z-10 text-center max-w-2xl px-8">
          {/* Icon with rotating ring */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute w-24 h-24 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <ServerIcon className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Business Continuity Simulation
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            Preparing simulation environment
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-medium text-gray-400">{loadingProgress}%</span>
              <span className="text-sm font-mono text-blue-400">{loadingProgress === 100 ? 'Complete' : 'Loading...'}</span>
            </div>
          </div>

          {/* Loading stage text */}
          <div className="h-8 flex items-center justify-center">
            <p className="text-sm text-gray-300 font-medium animate-pulse flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              {loadingStage}
            </p>
          </div>

          {/* System checks */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">Network</p>
              <p className="text-green-400 font-semibold mt-1">Connected</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">Database</p>
              <p className="text-green-400 font-semibold mt-1">Ready</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">Systems</p>
              <p className="text-green-400 font-semibold mt-1">Online</p>
            </div>
          </div>
        </div>

        {/* Add keyframes for animations */}
        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Business Continuity Plans</h1>
            <p className="text-sm text-gray-400 mt-1">Real-time BCP Simulation & Testing</p>
          </div>
        </div>

        {/* Navigation - Segmented Control */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
              <Link
                href="/it-dr-plans"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-xs transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <DocumentTextIcon className="mr-2 h-4 w-4" />
                BCP Plans
              </Link>
              <Link
                href="/it-dr-plans/runbooks"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-xs transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <BookOpenIcon className="mr-2 h-4 w-4" />
                Runbooks
              </Link>
              <Link
                href="/it-dr-plans/simulation"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-xs transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              >
                <PlayIcon className="mr-2 h-4 w-4" />
                Simulation
              </Link>
              <Link
                href="/it-dr-plans/notifications"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-xs transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </Link>
              <Link
                href="/it-dr-plans/settings"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-xs transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Cog6ToothIcon className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Scenario Selection Cards */}
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(scenarios).map(([key, scen]) => (
                <div
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  className={`group relative cursor-pointer rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 ${
                    selectedScenario === key
                      ? 'bg-gradient-to-br ' + scen.color + ' shadow-2xl ring-4 ring-white/20'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-xl'
                  }`}
                  style={{
                    boxShadow: selectedScenario === key 
                      ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59, 130, 246, 0.3)' 
                      : '0 10px 30px rgba(0,0,0,0.3)',
                    transform: selectedScenario === key ? 'perspective(1000px) rotateX(-2deg)' : 'perspective(1000px) rotateX(0deg)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{scen.icon}</div>
                    {selectedScenario === key && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-white">ACTIVE</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${selectedScenario === key ? 'text-white' : 'text-gray-200'}`}>
                    {scen.name}
                  </h3>
                  <p className={`text-sm mb-4 ${selectedScenario === key ? 'text-white/90' : 'text-gray-400'}`}>
                    {scen.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className={`flex items-center gap-1.5 ${selectedScenario === key ? 'text-white/80' : 'text-gray-500'}`}>
                      <ClockIcon className="h-4 w-4" />
                      <span>{scen.duration}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${selectedScenario === key ? 'text-white/80' : 'text-gray-500'}`}>
                      <ServerIcon className="h-4 w-4" />
                      <span>{scen.affectedSystems} systems</span>
                    </div>
                  </div>

                  {/* 3D depth effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Control Panel */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Simulation Controls</h3>
                  <p className="text-sm text-gray-400">
                    {isRunning ? 'Simulation in progress...' : 'Ready to start simulation'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    disabled={currentStep >= steps.length && !isRunning}
                    className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      isRunning
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    style={{
                      boxShadow: isRunning 
                        ? '0 10px 30px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.2)'
                        : '0 10px 30px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    {isRunning ? (
                      <>
                        <PauseIcon className="h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-5 w-5" />
                        {currentStep >= steps.length ? 'Complete' : 'Start'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white transition-all duration-300 transform hover:scale-105 hover:from-gray-600 hover:to-gray-700 shadow-lg"
                    style={{
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">Progress</span>
                  <span className="text-xs font-bold text-white">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full shadow-lg"
                    style={{ 
                      width: `${(currentStep / steps.length) * 100}%`,
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3D Cascading Event Timeline */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <SignalIcon className="h-5 w-5 text-blue-400" />
                Cascading Event Timeline
              </h3>
              
              <div className="relative space-y-4">
                {/* Vertical timeline connector */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-orange-500 via-yellow-500 to-green-500 rounded-full opacity-30 -z-10"></div>
                
                {steps.map((step, index) => {
                  const isActive = step.status === 'active';
                  const isFailed = step.status === 'failed';
                  const isRecovered = step.status === 'recovered';
                  const isPending = step.status === 'pending';
                  
                  return (
                    <div
                      key={step.id}
                      className={`group relative ml-20 transition-all duration-500 transform ${
                        isActive ? 'scale-105' : 'scale-100'
                      }`}
                      style={{
                        opacity: isPending ? 0.5 : 1,
                        transform: isActive 
                          ? 'perspective(1000px) rotateX(-2deg) translateY(-4px)' 
                          : 'perspective(1000px) rotateX(0deg) translateY(0)'
                      }}
                    >
                      {/* Timeline node */}
                      <div className={`absolute -left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl z-10 flex items-center justify-center transition-all duration-500 ${
                        isFailed 
                          ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50' 
                          : isRecovered
                          ? 'bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/50'
                          : isActive
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-blue-500/50 animate-pulse'
                          : 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg'
                      }`}
                        style={{
                          boxShadow: isActive 
                            ? '0 0 30px rgba(59, 130, 246, 0.6), 0 10px 20px rgba(0,0,0,0.3)'
                            : isFailed
                            ? '0 0 30px rgba(239, 68, 68, 0.6), 0 10px 20px rgba(0,0,0,0.3)'
                            : isRecovered
                            ? '0 0 30px rgba(34, 197, 94, 0.6), 0 10px 20px rgba(0,0,0,0.3)'
                            : '0 10px 20px rgba(0,0,0,0.3)'
                        }}
                      >
                        <div className="text-white font-bold text-sm">{step.id}</div>
                      </div>

                      {/* Event Card */}
                      <div
                        className={`relative rounded-xl p-5 transition-all duration-500 border-2 ${
                          isFailed
                            ? 'bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-500/50'
                            : isRecovered
                            ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-500/50'
                            : isActive
                            ? 'bg-gradient-to-br from-blue-900/40 to-indigo-800/40 border-blue-500/50'
                            : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                        }`}
                        style={{
                          boxShadow: isActive
                            ? '0 20px 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* System Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              isFailed
                                ? 'bg-red-500/20 text-red-400'
                                : isRecovered
                                ? 'bg-green-500/20 text-green-400'
                                : isActive
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-700/50 text-gray-500'
                            }`}>
                              {getSystemIcon(step.system)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                  isFailed || isRecovered || isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                  {step.time}
                                </span>
                                <h4 className={`text-sm font-bold ${
                                  isFailed || isRecovered || isActive ? 'text-white' : 'text-gray-400'
                                }`}>
                                  {step.system}
                                </h4>
                              </div>
                              
                              <p className={`text-sm mb-3 ${
                                isFailed || isRecovered || isActive ? 'text-gray-200' : 'text-gray-500'
                              }`}>
                                {step.event}
                              </p>

                              {/* Impact & Status Badges */}
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                  step.impact === 'critical'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : step.impact === 'high'
                                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                    : step.impact === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                }`}>
                                  {step.impact === 'critical' && <FireIcon className="h-3 w-3" />}
                                  {step.impact === 'high' && <ExclamationTriangleIcon className="h-3 w-3" />}
                                  {step.impact.toUpperCase()}
                                </span>

                                {isFailed && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                                    <XCircleIcon className="h-3 w-3" />
                                    FAILED
                                  </span>
                                )}
                                {isRecovered && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                    <CheckCircleIcon className="h-3 w-3" />
                                    RECOVERED
                                  </span>
                                )}
                                {isActive && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse">
                                    <ClockIcon className="h-3 w-3" />
                                    IN PROGRESS
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status Icon */}
                          <div className="flex-shrink-0">
                            {getStatusIcon(step.status)}
                          </div>
                        </div>

                        {/* Insights Panel for each step */}
                        {step.insights && (isActive || isRecovered || isFailed) && (
                          <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <LightBulbIcon className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs font-semibold text-yellow-400">INSIGHTS</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {step.insights.map((insight, i) => (
                                <div key={i} className={`text-xs px-3 py-2 rounded-lg ${
                                  insight.startsWith('✅')
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : 'bg-gray-700/50 text-gray-300'
                                }`}>
                                  {insight}
                                </div>
                              ))}
                            </div>
                            {step.rtoTarget && step.actualRecovery && (
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-blue-400" />
                                  <span className="text-xs text-gray-400">RTO Target: <span className="text-white font-semibold">{step.rtoTarget}h</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {step.actualRecovery <= step.rtoTarget ? (
                                    <ArrowTrendingDownIcon className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-400" />
                                  )}
                                  <span className="text-xs text-gray-400">Actual: <span className={`font-semibold ${step.actualRecovery <= step.rtoTarget ? 'text-green-400' : 'text-red-400'}`}>{step.actualRecovery}h</span></span>
                                </div>
                              </div>
                            )}
                            {step.recoveryAction && (
                              <div className="mt-3 flex items-center gap-2">
                                <WrenchScrewdriverIcon className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-blue-300">{step.recoveryAction}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3D depth layers */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>

                      {/* Connection line to next step */}
                      {index < steps.length - 1 && (
                        <div className="absolute left-0 top-full w-0.5 h-4 bg-gradient-to-b from-gray-600 to-transparent ml-8"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation Complete - Insights Dashboard */}
            {simulationComplete && showInsights && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-green-500/30"
                style={{
                  boxShadow: '0 20px 60px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Simulation Complete</h3>
                      <p className="text-sm text-gray-400">DR Recovery Analysis & Recommendations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInsights(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Total Recovery Time</div>
                    <div className="text-2xl font-bold text-white">{currentScenario.duration}</div>
                    <div className="text-xs text-green-400 mt-1">✓ Within target</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Systems Recovered</div>
                    <div className="text-2xl font-bold text-white">{currentScenario.affectedSystems}/{currentScenario.affectedSystems}</div>
                    <div className="text-xs text-green-400 mt-1">100% success rate</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">RTO Compliance</div>
                    <div className="text-2xl font-bold text-green-400">100%</div>
                    <div className="text-xs text-green-400 mt-1">All targets met</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Data Loss (RPO)</div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-green-400 mt-1">Zero data loss</div>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      Strengths Identified
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-xs text-green-300">
                        SAP HANA System Replication performed flawlessly - 20 min recovery vs 2h target
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-xs text-green-300">
                        DR site activation was smooth - all network routing updated within 5 minutes
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-xs text-green-300">
                        Crisis communication was effective - all stakeholders notified within 15 minutes
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                        Generator maintenance schedule should be reviewed - startup failure was a risk
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                        Consider reducing DNS TTL during business hours for faster failover
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                        Add automated customer notification system for faster communication
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Simulation completed at {new Date().toLocaleString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors">
                      <DocumentTextIcon className="h-4 w-4" />
                      Export Report
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/30">
                      <ArrowRightIcon className="h-4 w-4" />
                      Update DR Plan
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* AI Agent */}
      <AIAgent context="it-dr" />
    </div>
  );
}
