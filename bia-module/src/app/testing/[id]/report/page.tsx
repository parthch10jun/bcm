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
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

type ReportStep = 'timing' | 'processes' | 'applications' | 'hardware' | 'internal' | 'external' | 'criteria' | 'issues' | 'summary' | 'review' | 'logistics' | 'attendance' | 'discussions' | 'findings' | 'feedback' | 'management';

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
  { id: 'criteria', label: 'Success Criteria Q&A', shortLabel: 'Criteria' },
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
  };
  if (mockTestRecords[testId]) return mockTestRecords[testId];
  if (testId.startsWith('TT-')) return { name: `Tabletop Exercise ${testId}`, category: 'tabletop' };
  if (testId.startsWith('BCP-T-')) return { name: `BCP Test ${testId}`, category: 'bcp' };
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
  id: string;
  result: 'pass' | 'fail' | 'partial' | null;
  comments: string;
  actualTime?: string;
}

interface Issue {
  description: string;
  rootCause: string;
  correctiveAction: string;
  owner: string;
  targetDate: string;
}

interface ReportData {
  timing: TimingData;
  processResults: Record<string, ResultItem>;
  appResults: Record<string, ResultItem>;
  hardwareResults: Record<string, ResultItem>;
  internalResults: Record<string, ResultItem>;
  externalResults: Record<string, ResultItem>;
  criteriaResults: Record<string, { met: boolean | null; evidence: string }>;
  issues: Issue[];
  summary: string;
  lessonsLearned: string;
  finalResult: 'pass' | 'fail' | 'partial' | null;
  justification: string;
  evidenceFiles: { name: string; size: string }[];
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

  // BCP Report Data
  const [reportData, setReportData] = useState<ReportData>({
    timing: { testStart: '', recoveryStart: '', recoveryComplete: '', testEnd: '' },
    processResults: {},
    appResults: {},
    hardwareResults: {},
    internalResults: {},
    externalResults: {},
    criteriaResults: {},
    issues: [],
    summary: '',
    lessonsLearned: '',
    finalResult: null,
    justification: '',
    evidenceFiles: [],
  });

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
            <FindingsStep data={tabletopReport} setData={setTabletopReport} />
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
function FindingsStep({ data, setData }: any) {
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