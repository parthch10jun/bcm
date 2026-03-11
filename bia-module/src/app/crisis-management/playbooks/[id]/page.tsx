'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  PlayIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ListBulletIcon,
  MegaphoneIcon,
  CubeIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Comprehensive playbook data
const playbookData: Record<string, any> = {
  'CPB-001': {
    id: 'CPB-001',
    name: 'Trading System Outage Response',
    category: 'TRADING_SYSTEM',
    severity: 'CRITICAL',
    version: '2.3',
    status: 'ACTIVE',
    description: 'Comprehensive playbook for responding to trading system outages affecting BSE trading operations. Covers detection, escalation, containment, and recovery procedures.',
    estimatedDuration: '2-4 hours',
    owner: { name: 'Rajesh Kumar', role: 'CISO', phone: '+91 98765 43210', email: 'rajesh.kumar@bse.co.in' },
    lastUpdated: '2025-11-15',
    lastTested: '2025-10-20',
    nextReview: '2026-02-15',
    reviewers: ['Priya Sharma', 'Amit Patel', 'Vikram Singh'],
    
    // Scope & Activation
    scope: {
      triggers: [
        { source: 'Monitoring System', condition: 'Trading latency > 500ms for 2+ minutes', priority: 'CRITICAL' },
        { source: 'Member Complaints', condition: '5+ members report order failures', priority: 'HIGH' },
        { source: 'SIEM Alert', condition: 'Anomaly detected in trading core', priority: 'CRITICAL' },
      ],
      linkedBIAs: [
        { id: 'BIA-001', name: 'Core Trading Platform', criticality: 'Tier 1', rto: '15 min' },
        { id: 'BIA-003', name: 'Market Data Dissemination', criticality: 'Tier 1', rto: '5 min' },
      ],
      linkedRAs: [
        { id: 'RA-001', name: 'Cyber Security Risk Assessment', level: 'HIGH', scenarios: 12 },
      ],
      linkedDRs: [
        { id: 'DR-001', name: 'Core Trading DR Plan', siteType: 'HOT', rto: '15 min' },
        { id: 'DR-002', name: 'Data Center Failover Plan', siteType: 'HOT', rto: '30 min' },
      ],
      linkedIRPs: [
        { id: 'IRP-001', name: 'Ransomware Attack Response', type: 'Cyber' },
        { id: 'IRP-003', name: 'DDoS Attack Mitigation', type: 'Network' },
      ],
    },
    
    // Team
    team: {
      crisisCommander: { name: 'Rajesh Kumar', role: 'CISO', phone: '+91 98765 43210' },
      deputyCommander: { name: 'Deepak Joshi', role: 'IR Manager', phone: '+91 98765 43217' },
      technicalLead: { name: 'Amit Patel', role: 'Infrastructure Lead', phone: '+91 98765 43212' },
      communicationsLead: { name: 'Sneha Reddy', role: 'Communications Manager', phone: '+91 98765 43213' },
      businessLead: { name: 'Priya Sharma', role: 'Head of Trading Ops', phone: '+91 98765 43211' },
      regulatoryLiaison: { name: 'Vikram Singh', role: 'Compliance Head', phone: '+91 98765 43214' },
      coreTeam: [
        { name: 'Mohammed Khan', role: 'Network Security Lead' },
        { name: 'Anita Desai', role: 'Legal Counsel' },
      ],
    },
    
    // Phases
    phases: [
      {
        id: 1,
        name: 'Detection & Triage',
        duration: '5-15 min',
        steps: [
          { id: 1, title: 'Confirm alert authenticity via monitoring dashboard', required: true, evidence: true },
          { id: 2, title: 'Assess scope of impact (affected systems/members)', required: true },
          { id: 3, title: 'Initial severity classification', required: true },
          { id: 4, title: 'Log incident in ITSM system', required: true },
        ],
        escalationTrigger: 'Impact confirmed on trading operations',
      },
      {
        id: 2,
        name: 'Escalation & Activation',
        duration: '10-15 min',
        steps: [
          { id: 1, title: 'Notify Crisis Commander', required: true },
          { id: 2, title: 'Activate Crisis Management Team', required: true },
          { id: 3, title: 'Establish War Room (physical/virtual)', required: true },
          { id: 4, title: 'Notify SEBI if trading halt expected', required: true, regulatory: true },
        ],
        decisionPoint: 'Declare formal crisis? Invoke DR?',
      },
      {
        id: 3,
        name: 'Containment',
        duration: '15-60 min',
        steps: [
          { id: 1, title: 'Isolate affected trading segments if required', required: true },
          { id: 2, title: 'Implement temporary trading controls', required: true },
          { id: 3, title: 'Engage DR site if primary unrecoverable', required: false },
          { id: 4, title: 'Notify members via broadcast', required: true },
        ],
      },
      {
        id: 4,
        name: 'Investigation',
        duration: '1-4 hours',
        steps: [
          { id: 1, title: 'Root cause analysis', required: true, evidence: true },
          { id: 2, title: 'Forensic data collection if cyber-related', required: false },
          { id: 3, title: 'Timeline reconstruction', required: true },
        ],
      },
      {
        id: 5,
        name: 'Recovery',
        duration: '30 min - 2 hours',
        steps: [
          { id: 1, title: 'Execute recovery runbook', required: true },
          { id: 2, title: 'Validate trading system functionality', required: true, evidence: true },
          { id: 3, title: 'Gradual restoration of trading segments', required: true },
          { id: 4, title: 'Member connectivity verification', required: true },
          { id: 5, title: 'Resume normal operations', required: true },
        ],
      },
      {
        id: 6,
        name: 'Post-Incident',
        duration: '1-5 days',
        steps: [
          { id: 1, title: 'Submit SEBI incident report within 6 hours', required: true, regulatory: true },
          { id: 2, title: 'Internal post-mortem meeting', required: true },
          { id: 3, title: 'Update playbook based on lessons learned', required: true },
          { id: 4, title: 'Member communication on resolution', required: true },
        ],
      },
    ],
    
    // Communication Plan
    communication: {
      internalTemplates: [
        { name: 'Incident Alert - All Staff', channels: ['Email', 'Teams'], audience: 'All Employees' },
        { name: 'Executive Briefing', channels: ['Phone', 'Email'], audience: 'C-Suite' },
        { name: 'Technical Team Update', channels: ['Teams'], audience: 'IT Staff' },
      ],
      regulatoryTemplates: [
        { name: 'SEBI Incident Notification', channels: ['SEBI Portal', 'Email'], timeline: 'Within 6 hours' },
        { name: 'RBI Notification (if applicable)', channels: ['Portal'], timeline: 'Within 24 hours' },
      ],
      memberTemplates: [
        { name: 'Trading Halt Notice', channels: ['Email', 'SMS', 'Member Portal'], audience: 'All Members' },
        { name: 'Service Restoration Notice', channels: ['Email', 'Member Portal'], audience: 'All Members' },
      ],
      mediaTemplates: [
        { name: 'Holding Statement', status: 'Pre-approved' },
        { name: 'Press Release Template', status: 'Requires CMD approval' },
      ],
    },
    
    // Resources
    resources: {
      runbooks: [
        { name: 'Trading System Failover Runbook', lastUpdated: '2025-10-15' },
        { name: 'Database Recovery Procedure', lastUpdated: '2025-09-20' },
      ],
      vendors: [
        { name: 'Oracle Support', type: 'Database', contact: '+1-800-XXX-XXXX' },
        { name: 'Tata Communications', type: 'Network', contact: '+91-22-XXXX-XXXX' },
      ],
      locations: [
        { name: 'Primary DR Site', type: 'HOT', location: 'Navi Mumbai', activation: 'Immediate' },
        { name: 'Secondary DR Site', type: 'WARM', location: 'Chennai', activation: '2 hours' },
      ],
      templates: [
        { name: 'Incident Log Template' },
        { name: 'SEBI Notification Form' },
        { name: 'Post-Incident Report Template' },
      ],
    },
  },
};

export default function PlaybookDetailPage() {
  const params = useParams();
  const playbookId = params.id as string;
  const playbook = playbookData[playbookId] || playbookData['CPB-001'];
  
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'team' | 'communication' | 'resources'>('overview');

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId) ? prev.filter(id => id !== phaseId) : [...prev, phaseId]
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'phases', name: 'Response Phases', icon: ListBulletIcon },
    { id: 'team', name: 'Crisis Team', icon: UserGroupIcon },
    { id: 'communication', name: 'Communication', icon: MegaphoneIcon },
    { id: 'resources', name: 'Resources', icon: CubeIcon },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <Link href="/crisis-management/playbooks" className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeftIcon className="h-3 w-3" />
            Back to Playbooks
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-sm font-semibold text-gray-900">{playbook.name}</h1>
                <span className={`px-1.5 py-0.5 text-[9px] font-semibold border rounded-sm ${getSeverityColor(playbook.severity)}`}>
                  {playbook.severity}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-green-100 text-green-700 border border-green-200 rounded-sm">
                  {playbook.status}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 max-w-xl">{playbook.description}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/crisis-management/playbooks/${playbookId}/execute`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-[10px] font-medium rounded-sm hover:bg-red-700 transition-colors"
              >
                <PlayIcon className="h-3.5 w-3.5" />
                Execute
              </Link>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-[10px] font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <PencilSquareIcon className="h-3.5 w-3.5" />
                Edit
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-[10px] font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                Clone
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500">Duration: <span className="font-semibold text-gray-700">{playbook.estimatedDuration}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500">Last Tested: <span className="font-semibold text-gray-700">{playbook.lastTested}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowPathIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500">Version: <span className="font-semibold text-gray-700">{playbook.version}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserGroupIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500">Owner: <span className="font-semibold text-gray-700">{playbook.owner.name}</span></span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-0 border-t border-gray-100">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="col-span-2 space-y-4">
              {/* Activation Triggers */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="h-5 w-5 rounded-sm bg-red-50 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-3 w-3 text-red-500" />
                  </div>
                  Activation Triggers
                </h3>
                <div className="space-y-1.5">
                  {playbook.scope.triggers.map((trigger: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="text-[10px] font-medium text-gray-900">{trigger.condition}</p>
                        <p className="text-[9px] text-gray-400">Source: {trigger.source}</p>
                      </div>
                      <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-sm ${
                        trigger.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {trigger.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Modules */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="h-5 w-5 rounded-sm bg-blue-50 flex items-center justify-center">
                    <LinkIcon className="h-3 w-3 text-blue-500" />
                  </div>
                  Linked Modules
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Linked BIAs */}
                  <div>
                    <h4 className="text-[9px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Threat Assessments (BIA)</h4>
                    <div className="space-y-1">
                      {playbook.scope.linkedBIAs.map((bia: any) => (
                        <div key={bia.id} className="flex items-center justify-between p-1.5 bg-blue-50 rounded-sm border border-blue-100">
                          <span className="text-[10px] font-medium text-gray-900">{bia.name}</span>
                          <span className="text-[9px] text-gray-500">RTO: {bia.rto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Linked DRs */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h4 className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">IT DR Plans</h4>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-medium bg-green-50 text-green-700 border border-green-200">
                        IT DR Module
                      </span>
                    </div>
                    <div className="space-y-1">
                      {playbook.scope.linkedDRs.map((dr: any) => (
                        <Link
                          key={dr.id}
                          href={`/it-dr-plans/${dr.id}`}
                          className="flex items-center justify-between p-1.5 bg-green-50 rounded-sm border border-green-100 hover:bg-green-100 transition-colors group"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-green-600">{dr.id}</span>
                            <span className="text-[10px] font-medium text-gray-900">{dr.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1 py-0.5 text-[8px] font-semibold rounded-sm ${
                              dr.siteType === 'HOT' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                            }`}>{dr.siteType}</span>
                            <span className="text-[9px] text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Linked RAs */}
                  <div>
                    <h4 className="text-[9px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Risk Assessments</h4>
                    <div className="space-y-1">
                      {playbook.scope.linkedRAs.map((ra: any) => (
                        <div key={ra.id} className="flex items-center justify-between p-1.5 bg-orange-50 rounded-sm border border-orange-100">
                          <span className="text-[10px] font-medium text-gray-900">{ra.name}</span>
                          <span className="text-[9px] text-gray-500">{ra.scenarios} scenarios</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Linked IRPs */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h4 className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Escalated From IRPs</h4>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        IRP Module
                      </span>
                    </div>
                    <div className="space-y-1">
                      {playbook.scope.linkedIRPs.map((irp: any) => (
                        <Link
                          key={irp.id}
                          href={`/bcp/scenarios/${irp.id}`}
                          className="flex items-center justify-between p-1.5 bg-purple-50 rounded-sm border border-purple-100 hover:bg-purple-100 transition-colors group"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-blue-600">{irp.id}</span>
                            <span className="text-[10px] font-medium text-gray-900">{irp.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-500">{irp.type}</span>
                            <span className="text-[9px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phases Summary */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Response Phases Overview</h3>
                <div className="flex items-center gap-1.5">
                  {playbook.phases.map((phase: any, idx: number) => (
                    <div key={phase.id} className="flex items-center">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                        <span className="h-4 w-4 bg-gray-900 text-white rounded-full flex items-center justify-center text-[9px] font-semibold">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-medium text-gray-700">{phase.name}</span>
                      </div>
                      {idx < playbook.phases.length - 1 && (
                        <ChevronRightIcon className="h-3 w-3 text-gray-300 mx-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Crisis Commander */}
              <div className="bg-white border border-gray-200 rounded-sm p-3 hover:shadow-sm transition-shadow">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-100">Crisis Commander</h3>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-semibold">
                    {playbook.team.crisisCommander.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-900">{playbook.team.crisisCommander.name}</p>
                    <p className="text-[9px] text-gray-400">{playbook.team.crisisCommander.role}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[9px] text-gray-500 flex items-center gap-1.5">
                    <PhoneIcon className="h-3 w-3" /> {playbook.team.crisisCommander.phone}
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white border border-gray-200 rounded-sm p-3 hover:shadow-sm transition-shadow">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-100">Key Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Total Phases</span>
                    <span className="text-xs font-bold text-gray-900">{playbook.phases.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Total Steps</span>
                    <span className="text-xs font-bold text-gray-900">{playbook.phases.reduce((acc: number, p: any) => acc + p.steps.length, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Required Steps</span>
                    <span className="text-xs font-bold text-gray-900">{playbook.phases.reduce((acc: number, p: any) => acc + p.steps.filter((s: any) => s.required).length, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Linked BIAs</span>
                    <span className="text-xs font-bold text-gray-900">{playbook.scope.linkedBIAs.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Linked DR Plans</span>
                    <span className="text-xs font-bold text-gray-900">{playbook.scope.linkedDRs.length}</span>
                  </div>
                </div>
              </div>

              {/* Review Info */}
              <div className="bg-white border border-gray-200 rounded-sm p-3 hover:shadow-sm transition-shadow">
                <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-100">Review Status</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Last Updated</span>
                    <span className="text-[10px] font-semibold text-gray-900">{playbook.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Last Tested</span>
                    <span className="text-[10px] font-semibold text-gray-900">{playbook.lastTested}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wide">Next Review</span>
                    <span className="text-[10px] font-semibold text-gray-900">{playbook.nextReview}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Reviewers:</p>
                  <div className="flex flex-wrap gap-1">
                    {playbook.reviewers.map((r: string) => (
                      <span key={r} className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-600 rounded-sm">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phases Tab */}
        {activeTab === 'phases' && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Response Phases & Steps</h3>
              <p className="text-[9px] text-gray-400 mt-0.5">Detailed breakdown of all phases and steps</p>
            </div>
            <div className="divide-y divide-gray-100">
              {playbook.phases.map((phase: any) => (
                <div key={phase.id}>
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full px-3 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-semibold">
                        {phase.id}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-semibold text-gray-900">{phase.name}</p>
                        <p className="text-[9px] text-gray-400">Duration: {phase.duration} • {phase.steps.length} steps</p>
                      </div>
                    </div>
                    {expandedPhases.includes(phase.id) ? (
                      <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </button>
                  {expandedPhases.includes(phase.id) && (
                    <div className="px-3 pb-3 pl-12">
                      <div className="space-y-1.5">
                        {phase.steps.map((step: any) => (
                          <div key={step.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-sm border border-gray-100">
                            <div className="h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center text-[9px] text-gray-400">
                              {step.id}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-gray-900">{step.title}</p>
                              <div className="flex gap-1.5 mt-1">
                                {step.required && (
                                  <span className="px-1 py-0.5 text-[8px] bg-red-100 text-red-700 rounded-sm font-medium">Required</span>
                                )}
                                {step.evidence && (
                                  <span className="px-1 py-0.5 text-[8px] bg-blue-100 text-blue-700 rounded-sm font-medium">Evidence</span>
                                )}
                                {step.regulatory && (
                                  <span className="px-1 py-0.5 text-[8px] bg-orange-100 text-orange-700 rounded-sm font-medium">Regulatory</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {phase.escalationTrigger && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-sm">
                          <span className="text-[9px] font-semibold text-yellow-800">Escalation Trigger:</span>
                          <span className="text-[9px] text-yellow-700 ml-1">{phase.escalationTrigger}</span>
                        </div>
                      )}
                      {phase.decisionPoint && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-sm">
                          <span className="text-[9px] font-semibold text-blue-800">Decision Point:</span>
                          <span className="text-[9px] text-blue-700 ml-1">{phase.decisionPoint}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Leadership */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Crisis Leadership</h3>
              <div className="space-y-2">
                {[
                  { title: 'Crisis Commander', data: playbook.team.crisisCommander },
                  { title: 'Deputy Commander', data: playbook.team.deputyCommander },
                  { title: 'Technical Lead', data: playbook.team.technicalLead },
                  { title: 'Communications Lead', data: playbook.team.communicationsLead },
                  { title: 'Business Lead', data: playbook.team.businessLead },
                  { title: 'Regulatory Liaison', data: playbook.team.regulatoryLiaison },
                ].map((lead, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wide">{lead.title}</p>
                      <p className="text-[10px] font-semibold text-gray-900">{lead.data.name}</p>
                      <p className="text-[9px] text-gray-500">{lead.data.role}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded-sm transition-colors">
                        <PhoneIcon className="h-3 w-3 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded-sm transition-colors">
                        <EnvelopeIcon className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RACI Matrix */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">RACI Matrix</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-700 uppercase tracking-wide">Activity</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700 uppercase tracking-wide">R</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700 uppercase tracking-wide">A</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700 uppercase tracking-wide">C</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700 uppercase tracking-wide">I</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Incident Detection</td><td className="text-center text-gray-600">Tech</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-400">-</td><td className="text-center text-gray-600">All</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Escalation Decision</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Tech</td><td className="text-center text-gray-600">Deputy</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Technical Response</td><td className="text-center text-gray-600">Tech</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Team</td><td className="text-center text-gray-600">Biz</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Stakeholder Comms</td><td className="text-center text-gray-600">Comms</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Legal</td><td className="text-center text-gray-600">All</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Member Notification</td><td className="text-center text-gray-600">Comms</td><td className="text-center text-gray-600">Biz</td><td className="text-center text-gray-400">-</td><td className="text-center text-gray-600">Reg</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Regulatory Reporting</td><td className="text-center text-gray-600">Reg</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Legal</td><td className="text-center text-gray-600">Exec</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">DR Activation</td><td className="text-center text-gray-600">Tech</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">Biz</td><td className="text-center text-gray-600">All</td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-2 py-1.5 text-gray-700">Post-Incident Review</td><td className="text-center text-gray-600">Tech</td><td className="text-center text-gray-600">Cmdr</td><td className="text-center text-gray-600">All</td><td className="text-center text-gray-600">Exec</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Internal Templates */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Internal Communications</h3>
              <div className="space-y-1.5">
                {playbook.communication.internalTemplates.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{t.name}</p>
                      <p className="text-[9px] text-gray-400">{t.channels.join(', ')} • {t.audience}</p>
                    </div>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Templates */}
            <div className="bg-white border border-orange-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-orange-100">
                <div className="h-5 w-5 rounded-sm bg-orange-50 flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-3 w-3 text-orange-500" />
                </div>
                Regulatory Notifications
              </h3>
              <div className="space-y-1.5">
                {playbook.communication.regulatoryTemplates.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 rounded-sm border border-orange-100 hover:bg-orange-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{t.name}</p>
                      <p className="text-[9px] text-gray-500">{t.channels.join(', ')} • {t.timeline}</p>
                    </div>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Templates */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Member Communications</h3>
              <div className="space-y-1.5">
                {playbook.communication.memberTemplates.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{t.name}</p>
                      <p className="text-[9px] text-gray-400">{t.channels.join(', ')}</p>
                    </div>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Templates */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Media / PR</h3>
              <div className="space-y-1.5">
                {playbook.communication.mediaTemplates.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{t.name}</p>
                      <p className="text-[9px] text-gray-400">{t.status}</p>
                    </div>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">View</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Runbooks */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Recovery Runbooks</h3>
              <div className="space-y-1.5">
                {playbook.resources.runbooks.map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{r.name}</p>
                      <p className="text-[9px] text-gray-400">Last updated: {r.lastUpdated}</p>
                    </div>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">Open</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendors */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Vendor Contacts</h3>
              <div className="space-y-1.5">
                {playbook.resources.vendors.map((v: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-[10px] font-medium text-gray-900">{v.name}</p>
                      <p className="text-[9px] text-gray-400">{v.type} • {v.contact}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-sm transition-colors">
                      <PhoneIcon className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Locations */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Recovery Locations</h3>
              <div className="space-y-1.5">
                {playbook.resources.locations.map((loc: any, idx: number) => (
                  <div key={idx} className={`p-2 rounded-sm ${
                    loc.type === 'HOT' ? 'bg-red-50 border border-red-200' :
                    loc.type === 'WARM' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`px-1 py-0.5 text-[8px] font-semibold rounded-sm text-white ${
                        loc.type === 'HOT' ? 'bg-red-600' : loc.type === 'WARM' ? 'bg-yellow-600' : 'bg-blue-600'
                      }`}>{loc.type}</span>
                      <p className="text-[10px] font-medium text-gray-900">{loc.name}</p>
                    </div>
                    <p className="text-[9px] text-gray-500">{loc.location} • Activation: {loc.activation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Document Templates</h3>
              <div className="space-y-1.5">
                {playbook.resources.templates.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="text-[10px] font-medium text-gray-900">{t.name}</p>
                    <button className="text-[9px] text-gray-500 hover:text-gray-900">Download</button>
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

