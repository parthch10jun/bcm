'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ClockIcon,
  UserCircleIcon,
  CalendarIcon,
  LinkIcon,
  LockClosedIcon,
  BeakerIcon,
  PencilSquareIcon,
  ChartBarIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

type TabType = 'overview' | 'plan' | 'report' | 'approvals' | 'evidence';
type RecordStatus = 'Draft' | 'Plan Submitted' | 'Plan Approved' | 'In Progress' | 'Report Submitted' | 'Completed' | 'Cancelled';
type TestCategory = 'bcp' | 'tabletop';

interface TestRecord {
  id: string;
  name: string;
  type: 'Full Simulation' | 'Tabletop Exercise' | 'Walkthrough' | 'Component Test';
  category: TestCategory;
  status: RecordStatus;
  workflowStage: 'draft' | 'plan_review' | 'approved' | 'executing' | 'report_review' | 'complete';
  linkedBCP: string | null;
  linkedBCPName: string | null;
  owner: string;
  scenario: string | null;
  strategy: string | null;
  createdDate: string;
  lastUpdated: string;
  plannedDate: string | null;
  completedDate: string | null;
  description: string;
  nextAction: string;
  planProgress: number;
  reportProgress: number;
  pendingApproval: 'plan' | 'report' | null;
  evidenceCount: number;
}

// Mock test records
const mockTests: Record<string, TestRecord> = {
  'BCP-T-001': {
    id: 'BCP-T-001',
    name: 'Q4 2024 Full DR Simulation',
    type: 'Full Simulation',
    category: 'bcp',
    status: 'Completed',
    workflowStage: 'complete',
    linkedBCP: 'BCP-001',
    linkedBCPName: 'Customer Service Operations',
    owner: 'Sarah Chen',
    scenario: 'Data Center Outage',
    strategy: 'Site Failover',
    createdDate: '2024-10-01',
    lastUpdated: '2024-11-15',
    plannedDate: '2024-11-15',
    completedDate: '2024-11-15',
    description: 'Full-scale disaster recovery simulation testing all critical business functions and IT systems recovery procedures.',
    nextAction: 'View Report',
    planProgress: 100,
    reportProgress: 100,
    pendingApproval: null,
    evidenceCount: 12,
  },
  'BCP-T-002': {
    id: 'BCP-T-002',
    name: 'IT System Failover Test',
    type: 'Component Test',
    category: 'bcp',
    status: 'In Progress',
    workflowStage: 'executing',
    linkedBCP: 'BCP-003',
    linkedBCPName: 'Payment Processing',
    owner: 'Michael Torres',
    scenario: 'System Failure',
    strategy: 'Hot Standby Activation',
    createdDate: '2024-11-01',
    lastUpdated: '2024-11-18',
    plannedDate: '2024-11-20',
    completedDate: null,
    description: 'Testing failover procedures for payment processing systems.',
    nextAction: 'Continue Test Execution',
    planProgress: 100,
    reportProgress: 35,
    pendingApproval: null,
    evidenceCount: 5,
  },
  'BCP-T-003': {
    id: 'BCP-T-003',
    name: 'Finance BCP Walkthrough',
    type: 'Walkthrough',
    category: 'bcp',
    status: 'Plan Approved',
    workflowStage: 'approved',
    linkedBCP: 'BCP-004',
    linkedBCPName: 'Finance Operations',
    owner: 'Emily Wang',
    scenario: 'Office Inaccessibility',
    strategy: 'Remote Work Activation',
    createdDate: '2024-11-10',
    lastUpdated: '2024-11-16',
    plannedDate: '2024-12-01',
    completedDate: null,
    description: 'Walkthrough of finance department BCP procedures.',
    nextAction: 'Start Test Execution',
    planProgress: 100,
    reportProgress: 0,
    pendingApproval: null,
    evidenceCount: 3,
  },
  'BCP-T-004': {
    id: 'BCP-T-004',
    name: 'Communication Recovery Test',
    type: 'Component Test',
    category: 'bcp',
    status: 'Plan Submitted',
    workflowStage: 'plan_review',
    linkedBCP: 'BCP-002',
    linkedBCPName: 'IT Security Incident Response',
    owner: 'David Kim',
    scenario: null,
    strategy: null,
    createdDate: '2024-11-12',
    lastUpdated: '2024-11-14',
    plannedDate: '2024-12-05',
    completedDate: null,
    description: 'Testing communication systems recovery procedures.',
    nextAction: 'Awaiting Plan Approval',
    planProgress: 100,
    reportProgress: 0,
    pendingApproval: 'plan',
    evidenceCount: 2,
  },
  'TT-001': {
    id: 'TT-001',
    name: 'Cybersecurity Incident Response',
    type: 'Tabletop Exercise',
    category: 'tabletop',
    status: 'Completed',
    workflowStage: 'complete',
    linkedBCP: 'BCP-002',
    linkedBCPName: 'IT Security Incident Response',
    owner: 'Alex Johnson',
    scenario: 'Ransomware Attack',
    strategy: null,
    createdDate: '2024-10-15',
    lastUpdated: '2024-11-10',
    plannedDate: '2024-11-10',
    completedDate: '2024-11-10',
    description: 'Tabletop exercise simulating a ransomware attack scenario.',
    nextAction: 'View Report',
    planProgress: 100,
    reportProgress: 100,
    pendingApproval: null,
    evidenceCount: 8,
  },
  'TT-002': {
    id: 'TT-002',
    name: 'Supply Chain Disruption Exercise',
    type: 'Tabletop Exercise',
    category: 'tabletop',
    status: 'Report Submitted',
    workflowStage: 'report_review',
    linkedBCP: null,
    linkedBCPName: null,
    owner: 'Lisa Park',
    scenario: 'Vendor Failure',
    strategy: null,
    createdDate: '2024-11-01',
    lastUpdated: '2024-11-17',
    plannedDate: '2024-11-15',
    completedDate: '2024-11-15',
    description: 'Standalone tabletop exercise for supply chain scenarios.',
    nextAction: 'Awaiting Report Approval',
    planProgress: 100,
    reportProgress: 100,
    pendingApproval: 'report',
    evidenceCount: 6,
  },
  'TT-003': {
    id: 'TT-003',
    name: 'Pandemic Response Exercise',
    type: 'Tabletop Exercise',
    category: 'tabletop',
    status: 'Draft',
    workflowStage: 'draft',
    linkedBCP: 'BCP-005',
    linkedBCPName: 'Pandemic Response Plan',
    owner: 'James Wilson',
    scenario: null,
    strategy: null,
    createdDate: '2024-11-15',
    lastUpdated: '2024-11-15',
    plannedDate: '2024-12-10',
    completedDate: null,
    description: 'Tabletop exercise for pandemic response procedures.',
    nextAction: 'Complete Test Plan',
    planProgress: 25,
    reportProgress: 0,
    pendingApproval: null,
    evidenceCount: 0,
  },
};

// Default test for unknown IDs
const defaultTest: TestRecord = {
  id: 'TEST-XXX',
  name: 'Test Record',
  type: 'Tabletop Exercise',
  category: 'tabletop',
  status: 'Draft',
  workflowStage: 'draft',
  linkedBCP: null,
  linkedBCPName: null,
  owner: 'Unknown',
  scenario: null,
  strategy: null,
  createdDate: new Date().toISOString().split('T')[0],
  lastUpdated: new Date().toISOString().split('T')[0],
  plannedDate: null,
  completedDate: null,
  description: 'This test record needs to be configured.',
  nextAction: 'Complete Test Plan',
  planProgress: 0,
  reportProgress: 0,
  pendingApproval: null,
  evidenceCount: 0,
};

// Tab definitions
const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'plan', label: 'Test Plan' },
  { id: 'report', label: 'Test Report' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'evidence', label: 'Evidence' },
];

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const test = mockTests[testId] || { ...defaultTest, id: testId, name: `Test ${testId}` };

  const getStatusStyle = (status: RecordStatus) => {
    const styles: Record<RecordStatus, string> = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
      'Plan Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
      'Plan Approved': 'bg-blue-50 text-blue-700 border-blue-200',
      'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
      'Report Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
      'Completed': 'bg-green-50 text-green-700 border-green-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getWorkflowStages = () => {
    return [
      { id: 'draft', label: 'Draft', complete: ['plan_review', 'approved', 'executing', 'report_review', 'complete'].includes(test.workflowStage) },
      { id: 'plan_review', label: 'Plan Review', complete: ['approved', 'executing', 'report_review', 'complete'].includes(test.workflowStage) },
      { id: 'approved', label: 'Approved', complete: ['executing', 'report_review', 'complete'].includes(test.workflowStage) },
      { id: 'executing', label: 'Executing', complete: ['report_review', 'complete'].includes(test.workflowStage) },
      { id: 'report_review', label: 'Report Review', complete: ['complete'].includes(test.workflowStage) },
      { id: 'complete', label: 'Complete', complete: test.workflowStage === 'complete' },
    ];
  };

  const getCTAButton = () => {
    // CTA buttons change based on status/stage and test type
    const isTabletop = test.category === 'tabletop';

    // For BCP tests in draft without scenario selected
    if (test.category === 'bcp' && !test.scenario && test.workflowStage === 'draft') {
      return { label: 'Select Scenario & Strategy', action: () => router.push(`/testing/${testId}/plan?step=scenario`), primary: true };
    }
    // For Tabletop exercises in draft - go to scope step
    if (isTabletop && test.workflowStage === 'draft' && test.planProgress < 100) {
      return { label: 'Continue Planning', action: () => router.push(`/testing/${testId}/plan?step=scope`), primary: true };
    }
    // For BCP tests in draft with plan in progress
    if (test.workflowStage === 'draft' && test.planProgress < 100) {
      return { label: 'Continue Plan', action: () => router.push(`/testing/${testId}/plan`), primary: true };
    }
    if (test.workflowStage === 'draft' && test.planProgress === 100) {
      return { label: 'Submit for Approval', action: () => alert('Plan submitted for approval'), primary: true };
    }
    if (test.workflowStage === 'approved') {
      return { label: isTabletop ? 'Start Exercise' : 'Start Test Execution', action: () => alert('Test execution started'), primary: true };
    }
    if (test.workflowStage === 'executing' && test.reportProgress === 0) {
      return { label: 'Start Report', action: () => router.push(`/testing/${testId}/report`), primary: true };
    }
    if (test.workflowStage === 'executing' && test.reportProgress > 0 && test.reportProgress < 100) {
      return { label: 'Continue Report', action: () => router.push(`/testing/${testId}/report`), primary: true };
    }
    if (test.workflowStage === 'executing' && test.reportProgress === 100) {
      return { label: 'Submit Report', action: () => alert('Report submitted for approval'), primary: true };
    }
    if (test.workflowStage === 'complete') {
      return { label: 'View Report', action: () => router.push(`/testing/${test.id}/report`), primary: false };
    }
    return null;
  };

  const cta = getCTAButton();

  const workflowStages = getWorkflowStages();

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Back Button */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/testing"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              Back
            </Link>
          </div>

          {/* Title & Actions Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">{test.name}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${getStatusStyle(test.status)}`}>
                  {test.status}
                </span>
                {test.category === 'bcp' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-700">
                    BCP Test
                  </span>
                )}
                {test.category === 'tabletop' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
                    Tabletop
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-1 text-xs text-gray-600">{test.description}</p>

              {/* Quick Info Row */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Test ID</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{test.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Type</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{test.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Owner</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{test.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Planned Date</p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">{test.plannedDate || 'Not scheduled'}</p>
                </div>
                {test.linkedBCP && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Linked BCP</p>
                    <Link href={`/it-dr-plans/${test.linkedBCP}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-0.5 inline-block">
                      {test.linkedBCPName}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {cta && (
                <button
                  onClick={cta.action}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    cta.primary
                      ? 'text-white bg-gray-900 hover:bg-gray-800'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cta.label}
                  {cta.primary && <ArrowRightIcon className="h-3.5 w-3.5" />}
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                <DocumentTextIcon className="h-3.5 w-3.5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-gray-200">
          <nav className="flex gap-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.id === 'evidence' && test.evidenceCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-600 rounded">
                    {test.evidenceCount}
                  </span>
                )}
                {tab.id === 'approvals' && test.pendingApproval && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-amber-100 text-amber-700 rounded">
                    Pending
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && <OverviewTab test={test} workflowStages={workflowStages} />}
        {activeTab === 'plan' && <PlanTab test={test} />}
        {activeTab === 'report' && <ReportTab test={test} />}
        {activeTab === 'approvals' && <ApprovalsTab test={test} />}
        {activeTab === 'evidence' && <EvidenceTab test={test} />}
      </div>
    </div>
  );
}

// Overview Tab Component
interface WorkflowStage {
  id: string;
  label: string;
  complete: boolean;
}

function OverviewTab({ test, workflowStages }: { test: TestRecord; workflowStages: WorkflowStage[] }) {
  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Workflow Progress</h3>
        <div className="flex items-center justify-between">
          {workflowStages.map((stage, idx) => (
            <div key={stage.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stage.complete ? 'bg-green-100' : stage.id === test.workflowStage ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  {stage.complete ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className={`text-xs font-medium ${stage.id === test.workflowStage ? 'text-white' : 'text-gray-500'}`}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1.5 ${stage.id === test.workflowStage ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  {stage.label}
                </span>
              </div>
              {idx < workflowStages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${stage.complete ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Action Alert */}
      {test.workflowStage !== 'complete' && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-900">Next Required Action</p>
              <p className="text-xs text-amber-700 mt-1">{test.nextAction}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Test Owner</p>
                <p className="text-xs text-gray-900 mt-1">{test.owner}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Test Type</p>
                <p className="text-xs text-gray-900 mt-1">{test.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Created Date</p>
                <p className="text-xs text-gray-900 mt-1">{test.createdDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Last Updated</p>
                <p className="text-xs text-gray-900 mt-1">{test.lastUpdated}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Planned Date</p>
                <p className="text-xs text-gray-900 mt-1">{test.plannedDate || 'Not scheduled'}</p>
              </div>
              {test.completedDate && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Completed Date</p>
                  <p className="text-xs text-gray-900 mt-1">{test.completedDate}</p>
                </div>
              )}
              {test.linkedBCP && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Linked BCP</p>
                  <Link href={`/it-dr-plans/${test.linkedBCP}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                    {test.linkedBCPName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Scenario & Strategy (BCP Tests) */}
          {test.category === 'bcp' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Test Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Scenario</p>
                  {test.scenario ? (
                    <span className="inline-flex items-center mt-1 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-sm text-xs font-medium border border-orange-200">
                      {test.scenario}
                    </span>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-1">Not selected</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Recovery Strategy</p>
                  {test.strategy ? (
                    <span className="inline-flex items-center mt-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-sm text-xs font-medium border border-teal-200">
                      {test.strategy}
                    </span>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-1">Not selected</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Progress */}
        <div className="space-y-6">
          {/* Plan Progress */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-900">Test Plan</h3>
              <span className="text-xs font-medium text-gray-600">{test.planProgress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${test.planProgress}%` }} />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              {test.planProgress === 100 ? 'Plan complete' : 'Continue to submit for approval'}
            </p>
          </div>

          {/* Report Progress */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-900">Test Report</h3>
              <span className="text-xs font-medium text-gray-600">{test.reportProgress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${test.reportProgress}%` }} />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              {test.reportProgress === 0 ? 'Not started' : test.reportProgress === 100 ? 'Complete' : 'In progress'}
            </p>
          </div>

          {/* Evidence Count */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900">Evidence</h3>
              <span className="text-xs font-medium text-gray-600">{test.evidenceCount} files</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              {test.evidenceCount === 0 ? 'No evidence uploaded' : 'Evidence attached to this test'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Plan Tab Component
function PlanTab({ test }: { test: TestRecord }) {
  const isLocked = test.workflowStage !== 'draft';
  const isTabletop = test.category === 'tabletop';

  // Mock plan data - in real app this would come from API
  const planData = {
    scenario: test.scenario || 'Data Center Outage',
    strategy: test.strategy || 'Site Failover',
    objective: 'Validate the organization\'s ability to recover critical business processes within defined RTOs.',
    scope: 'All Tier 1 critical processes and supporting IT infrastructure',
    scheduledDate: test.plannedDate,
    scheduledTime: '09:00 - 17:00',
    location: 'Primary DR Site / Virtual',
    facilitator: test.owner,
    participants: [
      { name: 'Sarah Chen', role: 'Test Lead' },
      { name: 'Mike Johnson', role: 'IT Recovery Lead' },
      { name: 'Lisa Wang', role: 'Business Representative' },
      { name: 'Tom Brown', role: 'Communications Lead' },
    ],
    processes: ['Payment Processing', 'Customer Service', 'Order Management', 'Financial Reporting'],
    successCriteria: [
      { name: 'RTO Achievement', target: 'All processes recovered within 4 hours' },
      { name: 'Data Integrity', target: 'No data loss beyond RPO of 1 hour' },
      { name: 'Communication', target: 'All stakeholders notified within 30 minutes' },
    ],
  };

  return (
    <div className="max-w-4xl space-y-6">
      {isLocked && (
        <div className="bg-gray-100 border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-700">Plan Locked</p>
              <p className="text-[10px] text-gray-500">The test plan has been submitted and cannot be edited.</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-900">Plan Progress</h2>
          <span className="text-xs font-medium text-gray-600">{test.planProgress}% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${test.planProgress}%` }} />
        </div>
        {!isLocked && test.planProgress < 100 && (
          <Link href={`/testing/${test.id}/plan`} className="inline-flex items-center mt-3 text-xs text-blue-600 hover:text-blue-800">
            Continue Planning <ArrowRightIcon className="h-3 w-3 ml-1" />
          </Link>
        )}
      </div>

      {test.planProgress === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <BeakerIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-xs text-gray-500 mb-4">No plan created yet</p>
          <Link href={`/testing/${test.id}/plan`} className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
            Start Planning
            <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Scenario & Objective */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">{isTabletop ? 'Exercise Scope' : 'Scenario & Strategy'}</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Scenario</p>
                <p className="text-xs text-gray-900 mt-1">{planData.scenario}</p>
              </div>
              {!isTabletop && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Strategy</p>
                  <p className="text-xs text-gray-900 mt-1">{planData.strategy}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-[10px] text-gray-500 uppercase font-medium">Objective</p>
                <p className="text-xs text-gray-900 mt-1">{planData.objective}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Schedule</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Date</p>
                <p className="text-xs text-gray-900 mt-1">{planData.scheduledDate || 'TBD'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Time</p>
                <p className="text-xs text-gray-900 mt-1">{planData.scheduledTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Location</p>
                <p className="text-xs text-gray-900 mt-1">{planData.location}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Facilitator</p>
                <p className="text-xs text-gray-900 mt-1">{planData.facilitator}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Participants ({planData.participants.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {planData.participants.map((p, i) => (
                <div key={i} className="px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-900">{p.name}</span>
                  <span className="text-[10px] text-gray-500">{p.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success Criteria */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Success Criteria</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {planData.successCriteria.map((c, i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-xs font-medium text-gray-900">{c.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{c.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          {!isLocked && (
            <div className="flex justify-end">
              <Link href={`/testing/${test.id}/plan`} className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                <PencilSquareIcon className="h-3.5 w-3.5 mr-1.5" />
                Edit Plan
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Report Tab Component
function ReportTab({ test }: { test: TestRecord }) {
  const isLocked = test.workflowStage === 'complete' || test.workflowStage === 'report_review';
  const isTabletop = test.category === 'tabletop';
  const canStartReport = test.workflowStage === 'executing' || test.workflowStage === 'report_review' || test.workflowStage === 'complete';

  // Mock report data - in real app this would come from API
  const reportData = test.reportProgress > 0 ? {
    actualStart: test.plannedDate ? `${test.plannedDate} 09:15` : 'N/A',
    actualEnd: test.plannedDate ? `${test.plannedDate} 16:45` : 'N/A',
    finalResult: test.reportProgress === 100 ? 'pass' : null,
    attendees: 6,
    plannedAttendees: 8,
    findings: 3,
    issues: 2,
    evidenceFiles: test.evidenceCount,
    executiveSummary: 'The test was conducted successfully with all primary objectives achieved. Minor issues were identified and documented for remediation.',
  } : null;

  return (
    <div className="max-w-4xl space-y-6">
      {!canStartReport ? (
        <div className="bg-gray-100 border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-700">Report Not Available</p>
              <p className="text-[10px] text-gray-500">The test plan must be approved before the report can be created.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900">Report Progress</h2>
              <span className="text-xs font-medium text-gray-600">{test.reportProgress}% Complete</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${test.reportProgress}%` }} />
            </div>
            {test.reportProgress < 100 && (
              <Link href={`/testing/${test.id}/report`} className="inline-flex items-center mt-3 text-xs text-green-600 hover:text-green-800">
                {test.reportProgress === 0 ? 'Start Report' : 'Continue Report'} <ArrowRightIcon className="h-3 w-3 ml-1" />
              </Link>
            )}
          </div>

          {test.reportProgress === 0 ? (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
              <ChartBarIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-500 mb-4">No report created yet. Start documenting the test execution.</p>
              <Link href={`/testing/${test.id}/report`} className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                Start Report Wizard
                <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </div>
          ) : reportData && (
            <>
              {/* Final Result */}
              {reportData.finalResult && (
                <div className={`border rounded-sm p-4 ${
                  reportData.finalResult === 'pass' ? 'bg-green-50 border-green-200' :
                  reportData.finalResult === 'partial' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className={`h-6 w-6 ${
                      reportData.finalResult === 'pass' ? 'text-green-600' :
                      reportData.finalResult === 'partial' ? 'text-amber-600' :
                      'text-red-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-semibold ${
                        reportData.finalResult === 'pass' ? 'text-green-800' :
                        reportData.finalResult === 'partial' ? 'text-amber-800' :
                        'text-red-800'
                      }`}>
                        {reportData.finalResult === 'pass' ? (isTabletop ? 'Exercise Successful' : 'Test Passed') :
                         reportData.finalResult === 'partial' ? 'Partial Success' :
                         (isTabletop ? 'Exercise Unsuccessful' : 'Test Failed')}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">Final result submitted and approved</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Execution Summary */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Execution Summary</h2>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Actual Start</p>
                    <p className="text-xs text-gray-900 mt-1">{reportData.actualStart}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Actual End</p>
                    <p className="text-xs text-gray-900 mt-1">{reportData.actualEnd}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Attendance</p>
                    <p className="text-xs text-gray-900 mt-1">{reportData.attendees}/{reportData.plannedAttendees}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Evidence Files</p>
                    <p className="text-xs text-gray-900 mt-1">{reportData.evidenceFiles}</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Key Metrics</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-sm">
                    <p className="text-2xl font-bold text-amber-700">{reportData.findings}</p>
                    <p className="text-[10px] text-amber-600 uppercase font-medium mt-1">Findings</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-sm">
                    <p className="text-2xl font-bold text-red-700">{reportData.issues}</p>
                    <p className="text-[10px] text-red-600 uppercase font-medium mt-1">Issues</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Executive Summary</h2>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-700 leading-relaxed">{reportData.executiveSummary}</p>
                </div>
              </div>

              {/* View Full Report Button */}
              <div className="flex justify-end gap-3">
                {!isLocked && (
                  <Link href={`/testing/${test.id}/report`} className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                    <PencilSquareIcon className="h-3.5 w-3.5 mr-1.5" />
                    Edit Report
                  </Link>
                )}
                <Link href={`/testing/${test.id}/report`} className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                  View Full Report
                  <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// Approvals Tab Component
function ApprovalsTab({ test }: { test: TestRecord }) {
  const [approvalComment, setApprovalComment] = useState('');

  const mockApprovals = [
    { id: 1, type: 'Plan Submitted', user: 'Sarah Chen', date: '2024-11-14', status: 'pending', comments: 'Please review the test plan for Q4 DR simulation.' },
    { id: 2, type: 'Plan Created', user: 'Sarah Chen', date: '2024-11-10', status: 'complete', comments: null },
  ];

  const mockPlanSummary = {
    scenario: 'Data Center Outage',
    strategy: 'Site Failover',
    processes: 4,
    internalDeps: 3,
    externalDeps: 2,
    successCriteria: 4,
    plannedDate: '2024-11-20',
    facilitator: 'Sarah Chen',
    participants: 6,
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Pending Approval Action Card */}
      {test.pendingApproval && (
        <div className="bg-white border-2 border-amber-300 rounded-sm">
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-900">
                {test.pendingApproval === 'plan' ? 'Plan Approval Required' : 'Report Approval Required'}
              </h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-xs text-gray-600">
              Review the {test.pendingApproval === 'plan' ? 'test plan' : 'test report'} below and provide your decision.
            </p>

            {/* Comment Box */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm resize-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Add comments for the submitter..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Approved!')}
                className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                Approve
              </button>
              <button
                onClick={() => alert('Rejected - will require resubmission')}
                className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-sm hover:bg-red-700"
              >
                <XCircleIcon className="h-4 w-4 mr-1.5" />
                Reject
              </button>
              <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read-Only Plan Summary (when pending approval) */}
      {test.pendingApproval === 'plan' && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Plan Summary (Read-Only)</h2>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">Locked for Review</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Scenario</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.scenario}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Strategy</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.strategy}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Planned Date</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.plannedDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Processes</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.processes} selected</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Internal Deps</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.internalDeps} selected</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">External Deps</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.externalDeps} selected</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Success Criteria</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.successCriteria} defined</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Facilitator</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.facilitator}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-medium">Participants</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{mockPlanSummary.participants} people</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Timeline */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Approval History</h2>
        </div>
        <div className="p-4">
          <div className="relative">
            {mockApprovals.map((approval, idx) => (
              <div key={approval.id} className="flex items-start gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    approval.status === 'complete' ? 'bg-green-100' :
                    approval.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {approval.status === 'complete' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : approval.status === 'rejected' ? (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    ) : (
                      <ClockIcon className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  {idx < mockApprovals.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-900">{approval.type}</h3>
                    <span className="text-[10px] text-gray-500">{approval.date}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">By {approval.user}</p>
                  {approval.comments && (
                    <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-sm">{approval.comments}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resubmit Button (shown when rejected) */}
      {test.workflowStage === 'draft' && test.planProgress === 100 && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-red-900">Plan Rejected</p>
                <p className="text-[10px] text-red-700 mt-1">Please address the feedback and resubmit for approval.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-sm hover:bg-red-700">
              Resubmit Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Evidence Tab Component
function EvidenceTab({ test }: { test: TestRecord }) {
  const mockEvidence = [
    { id: 1, name: 'Pre-test_checklist.pdf', type: 'PDF', size: '245 KB', uploadedBy: 'Sarah Chen', date: '2024-11-14', section: 'Plan' },
    { id: 2, name: 'Network_diagram.png', type: 'Image', size: '1.2 MB', uploadedBy: 'Michael Torres', date: '2024-11-15', section: 'Plan' },
    { id: 3, name: 'Execution_log.xlsx', type: 'Excel', size: '89 KB', uploadedBy: 'Sarah Chen', date: '2024-11-15', section: 'Report' },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Evidence & Attachments</h2>
          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
            <PaperClipIcon className="h-3.5 w-3.5 mr-1.5" />
            Upload File
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {test.evidenceCount === 0 ? (
            <div className="p-8 text-center">
              <PaperClipIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-500">No evidence uploaded yet</p>
            </div>
          ) : (
            mockEvidence.map((file) => (
              <div key={file.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-sm flex items-center justify-center">
                    <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">{file.name}</p>
                    <p className="text-[10px] text-gray-500">{file.size} • Uploaded by {file.uploadedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-[9px] font-medium bg-gray-100 text-gray-600 rounded">{file.section}</span>
                  <span className="text-[10px] text-gray-500">{file.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

