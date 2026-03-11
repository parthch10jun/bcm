'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  CubeIcon,
  BuildingOfficeIcon,
  ServerIcon,
  ClockIcon,
  DocumentCheckIcon,
  ChevronRightIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

type WizardStep = 'scenario' | 'scope' | 'processes' | 'internal' | 'external' | 'criteria' | 'schedule' | 'review';

interface WizardStepDef {
  id: WizardStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Steps for BCP Tests (linked to BCP, require scenario selection)
const bcpTestSteps: WizardStepDef[] = [
  { id: 'scenario', label: 'Scenario & Strategy', shortLabel: 'Scenario', icon: BeakerIcon },
  { id: 'processes', label: 'Select Processes', shortLabel: 'Processes', icon: CubeIcon },
  { id: 'internal', label: 'Internal Dependencies', shortLabel: 'Internal', icon: BuildingOfficeIcon },
  { id: 'external', label: 'External Dependencies', shortLabel: 'External', icon: LinkIcon },
  { id: 'criteria', label: 'Success Criteria', shortLabel: 'Criteria', icon: DocumentCheckIcon },
  { id: 'schedule', label: 'Schedule & Team', shortLabel: 'Schedule', icon: ClockIcon },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review', icon: CheckCircleIcon },
];

// Steps for Tabletop Exercises (may or may not be linked to BCP)
const tabletopSteps: WizardStepDef[] = [
  { id: 'scope', label: 'Exercise Scope', shortLabel: 'Scope', icon: BeakerIcon },
  { id: 'criteria', label: 'Success Criteria', shortLabel: 'Criteria', icon: DocumentCheckIcon },
  { id: 'schedule', label: 'Schedule & Team', shortLabel: 'Schedule', icon: ClockIcon },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review', icon: CheckCircleIcon },
];

// Mock BCP data with scenarios and strategies
const mockBCPs: Record<string, any> = {
  'BCP-001': {
    id: 'BCP-001',
    name: 'Customer Service Operations',
    scenarios: [
      { id: 'SCN-001', name: 'Data Center Outage', type: 'Technology', severity: 'Critical' },
      { id: 'SCN-002', name: 'Office Inaccessibility', type: 'Building', severity: 'High' },
      { id: 'SCN-003', name: 'Pandemic Lockdown', type: 'People', severity: 'High' },
    ],
    strategies: {
      'SCN-001': [
        { id: 'STR-001', name: 'Site Failover', type: 'Recovery', rto: '2 hours' },
        { id: 'STR-002', name: 'Cloud Activation', type: 'Recovery', rto: '1 hour' },
      ],
      'SCN-002': [
        { id: 'STR-003', name: 'Remote Work Activation', type: 'Workaround', rto: '4 hours' },
        { id: 'STR-004', name: 'Alternate Site Activation', type: 'Recovery', rto: '6 hours' },
      ],
      'SCN-003': [
        { id: 'STR-005', name: 'Full Remote Work', type: 'Workaround', rto: '2 hours' },
      ],
    },
    processes: [
      { id: 'PROC-001', name: 'Customer Inquiry Handling', rto: 2, criticality: 'Critical', owner: 'John Smith' },
      { id: 'PROC-002', name: 'Complaint Resolution', rto: 4, criticality: 'High', owner: 'Jane Doe' },
      { id: 'PROC-003', name: 'Order Processing', rto: 2, criticality: 'Critical', owner: 'Mike Wilson' },
      { id: 'PROC-004', name: 'Billing Support', rto: 8, criticality: 'Medium', owner: 'Sarah Lee' },
    ],
    internalDeps: [
      { id: 'INT-001', name: 'IT Help Desk', type: 'Department', criticality: 'High' },
      { id: 'INT-002', name: 'Network Operations', type: 'Department', criticality: 'Critical' },
      { id: 'INT-003', name: 'Finance', type: 'Department', criticality: 'Medium' },
    ],
    externalDeps: [
      { id: 'EXT-001', name: 'AWS Cloud Services', type: 'Vendor', criticality: 'Critical' },
      { id: 'EXT-002', name: 'Telecom Provider', type: 'Vendor', criticality: 'Critical' },
      { id: 'EXT-003', name: 'Payment Gateway', type: 'Vendor', criticality: 'High' },
    ],
    successCriteria: [
      { id: 'SC-001', name: 'RTO Met', description: 'Services restored within target RTO', metric: 'Time to recovery < RTO' },
      { id: 'SC-002', name: 'RPO Met', description: 'Data loss within acceptable limits', metric: 'Data loss < RPO' },
      { id: 'SC-003', name: 'Full Recovery', description: 'All critical processes operational', metric: '100% critical processes running' },
      { id: 'SC-004', name: 'Communication Success', description: 'All stakeholders notified', metric: '100% notification delivery' },
    ],
  },
};

// Add more BCP entries
mockBCPs['BCP-002'] = { ...mockBCPs['BCP-001'], id: 'BCP-002', name: 'IT Security Incident Response' };
mockBCPs['BCP-003'] = { ...mockBCPs['BCP-001'], id: 'BCP-003', name: 'Payment Processing' };
mockBCPs['BCP-004'] = { ...mockBCPs['BCP-001'], id: 'BCP-004', name: 'Finance Operations' };
mockBCPs['BCP-005'] = { ...mockBCPs['BCP-001'], id: 'BCP-005', name: 'Pandemic Response Plan' };

interface PlanData {
  scenario: string | null;
  strategy: string | null;
  selectedProcesses: string[];
  selectedInternalDeps: string[];
  selectedExternalDeps: string[];
  selectedCriteria: string[];
  customCriteria: { name: string; description: string; metric: string }[];
  plannedStartDate: string;
  plannedEndDate: string;
  facilitator: string;
  participants: { name: string; role: string }[];
}

// Mock test record
const mockTestRecords: Record<string, any> = {
  'BCP-T-001': { linkedBCP: 'BCP-001', category: 'bcp', name: 'Q4 2024 Full DR Simulation', scenarioType: null },
  'BCP-T-002': { linkedBCP: 'BCP-003', category: 'bcp', name: 'IT System Failover Test', scenarioType: null },
  'BCP-T-003': { linkedBCP: 'BCP-004', category: 'bcp', name: 'Finance BCP Walkthrough', scenarioType: null },
  'BCP-T-004': { linkedBCP: 'BCP-002', category: 'bcp', name: 'Communication Recovery Test', scenarioType: null },
  'TT-001': { linkedBCP: 'BCP-002', category: 'tabletop', name: 'Cybersecurity Incident Response', scenarioType: 'cyber' },
  'TT-002': { linkedBCP: null, category: 'tabletop', name: 'Supply Chain Disruption Exercise', scenarioType: 'supply_chain' },
  'TT-003': { linkedBCP: 'BCP-005', category: 'tabletop', name: 'Pandemic Response Exercise', scenarioType: 'pandemic' },
};

// Helper to get test record - handles dynamic IDs like TT-8659
function getTestRecord(testId: string) {
  // Check if it exists in mock data
  if (mockTestRecords[testId]) {
    return mockTestRecords[testId];
  }
  // For dynamically created records, determine type from ID prefix
  if (testId.startsWith('TT-')) {
    return { linkedBCP: null, category: 'tabletop', name: `Tabletop Exercise ${testId}`, scenarioType: 'custom' };
  }
  if (testId.startsWith('BCP-T-')) {
    return { linkedBCP: 'BCP-001', category: 'bcp', name: `BCP Test ${testId}`, scenarioType: null };
  }
  // Default fallback
  return { linkedBCP: null, category: 'tabletop', name: 'Test Record', scenarioType: 'custom' };
}

export default function TestPlanWizard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = params.id as string;

  // Get test record and determine type
  const testRecord = getTestRecord(testId);
  const isTabletop = testRecord.category === 'tabletop';
  const hasLinkedBCP = !!testRecord.linkedBCP;
  const linkedBCP = hasLinkedBCP ? (mockBCPs[testRecord.linkedBCP] || mockBCPs['BCP-001']) : null;

  // Use appropriate steps based on test type
  const wizardSteps = isTabletop ? tabletopSteps : bcpTestSteps;
  const defaultStep = isTabletop ? 'scope' : 'scenario';

  const initialStep = (searchParams.get('step') as WizardStep) || defaultStep;
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);

  // Tabletop-specific state
  const [tabletopData, setTabletopData] = useState({
    objectives: '',
    discussionTopics: [] as string[],
    expectedOutcomes: '',
  });

  const [planData, setPlanData] = useState<PlanData>({
    scenario: null,
    strategy: null,
    selectedProcesses: [],
    selectedInternalDeps: [],
    selectedExternalDeps: [],
    selectedCriteria: [],
    customCriteria: [],
    plannedStartDate: '',
    plannedEndDate: '',
    facilitator: '',
    participants: [],
  });

  const currentStepIndex = wizardSteps.findIndex(s => s.id === currentStep);

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
    router.push(`/testing/${testId}/plan?step=${step}`, { scroll: false });
  };

  const goNext = () => {
    if (currentStepIndex < wizardSteps.length - 1) {
      goToStep(wizardSteps[currentStepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      goToStep(wizardSteps[currentStepIndex - 1].id);
    }
  };

  const isStepComplete = (step: WizardStep): boolean => {
    switch (step) {
      case 'scenario': return !!planData.scenario && !!planData.strategy;
      case 'scope': return !!tabletopData.objectives && tabletopData.discussionTopics.length > 0;
      case 'processes': return planData.selectedProcesses.length > 0;
      case 'internal': return planData.selectedProcesses.length > 0;
      case 'external': return planData.selectedProcesses.length > 0;
      case 'criteria': return planData.selectedCriteria.length > 0 || planData.customCriteria.length > 0;
      case 'schedule': return !!planData.plannedStartDate && !!planData.facilitator;
      case 'review': return false;
      default: return false;
    }
  };

  const getProgress = (): number => {
    const completedSteps = wizardSteps.filter(s => isStepComplete(s.id)).length;
    return Math.round((completedSteps / (wizardSteps.length - 1)) * 100);
  };

  const availableStrategies = planData.scenario && linkedBCP ? (linkedBCP.strategies[planData.scenario] || []) : [];

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Wizard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/testing/${testId}`} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowLeftIcon className="h-3 w-3" />
              Back to Test
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-xs text-gray-500">{testRecord.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Test Plan Builder</h1>
              <p className="text-xs text-gray-500 mt-1">Configure the test scope, dependencies, and success criteria</p>
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
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1">
            {wizardSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = isStepComplete(step.id);
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : isComplete
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : isPast
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {isComplete && !isActive ? (
                      <CheckCircleSolidIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                    <span className="hidden lg:inline">{step.shortLabel}</span>
                  </button>
                  {index < wizardSteps.length - 1 && (
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
          {/* Tabletop Scope Step */}
          {currentStep === 'scope' && (
            <TabletopScopeStep
              testRecord={testRecord}
              tabletopData={tabletopData}
              setTabletopData={setTabletopData}
            />
          )}
          {/* BCP Test Scenario Step */}
          {currentStep === 'scenario' && linkedBCP && (
            <ScenarioStep
              linkedBCP={linkedBCP}
              planData={planData}
              setPlanData={setPlanData}
              availableStrategies={availableStrategies}
            />
          )}
          {currentStep === 'processes' && linkedBCP && (
            <ProcessesStep linkedBCP={linkedBCP} planData={planData} setPlanData={setPlanData} />
          )}
          {currentStep === 'internal' && linkedBCP && (
            <InternalDepsStep linkedBCP={linkedBCP} planData={planData} setPlanData={setPlanData} />
          )}
          {currentStep === 'external' && linkedBCP && (
            <ExternalDepsStep linkedBCP={linkedBCP} planData={planData} setPlanData={setPlanData} />
          )}
          {currentStep === 'criteria' && (
            <CriteriaStep linkedBCP={linkedBCP} planData={planData} setPlanData={setPlanData} isTabletop={isTabletop} />
          )}
          {currentStep === 'schedule' && (
            <ScheduleStep planData={planData} setPlanData={setPlanData} />
          )}
          {currentStep === 'review' && (
            <ReviewStep linkedBCP={linkedBCP} planData={planData} testId={testId} isTabletop={isTabletop} tabletopData={tabletopData} />
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
                alert('Plan submitted for approval!');
                router.push(`/testing/${testId}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
            >
              Submit for Approval
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

// === TABLETOP STEP: Exercise Scope ===
function TabletopScopeStep({ testRecord, tabletopData, setTabletopData }: any) {
  const [newTopic, setNewTopic] = useState('');

  const scenarioTypeLabels: Record<string, { name: string; description: string }> = {
    cyber: { name: 'Cyber Attack', description: 'Ransomware, data breach, system compromise' },
    natural: { name: 'Natural Disaster', description: 'Earthquake, flood, fire, storm' },
    pandemic: { name: 'Pandemic/Health', description: 'Disease outbreak, workforce impact' },
    supply_chain: { name: 'Supply Chain', description: 'Vendor failure, logistics disruption' },
    regulatory: { name: 'Regulatory Crisis', description: 'Compliance breach, audit failure' },
    custom: { name: 'Custom Scenario', description: 'User-defined scenario' },
  };

  const scenarioInfo = scenarioTypeLabels[testRecord.scenarioType] || scenarioTypeLabels.custom;

  const suggestedTopics = [
    'Initial incident detection and assessment',
    'Communication and escalation procedures',
    'Resource mobilization and team activation',
    'Decision-making under uncertainty',
    'Stakeholder notification process',
    'Recovery prioritization',
    'Lessons learned and improvement areas',
  ];

  const addTopic = (topic: string) => {
    if (topic && !tabletopData.discussionTopics.includes(topic)) {
      setTabletopData({ ...tabletopData, discussionTopics: [...tabletopData.discussionTopics, topic] });
    }
    setNewTopic('');
  };

  const removeTopic = (topic: string) => {
    setTabletopData({
      ...tabletopData,
      discussionTopics: tabletopData.discussionTopics.filter((t: string) => t !== topic),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-purple-800">Define Exercise Scope</p>
            <p className="text-[10px] text-purple-700 mt-1">
              Set the objectives and discussion topics for this tabletop exercise.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Type Info */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Scenario Type</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
            <BeakerIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-xs font-medium text-gray-900">{scenarioInfo.name}</p>
              <p className="text-[10px] text-gray-500">{scenarioInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Exercise Objectives <span className="text-red-500">*</span></h2>
        </div>
        <div className="p-4">
          <textarea
            rows={3}
            value={tabletopData.objectives}
            onChange={(e) => setTabletopData({ ...tabletopData, objectives: e.target.value })}
            placeholder="What do you want to achieve with this exercise? e.g., Validate communication procedures, test decision-making under pressure..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
      </div>

      {/* Discussion Topics */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Discussion Topics <span className="text-red-500">*</span></h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Add topics to guide the exercise discussion</p>
        </div>
        <div className="p-4 space-y-4">
          {/* Selected Topics */}
          {tabletopData.discussionTopics.length > 0 && (
            <div className="space-y-2">
              {tabletopData.discussionTopics.map((topic: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm border border-gray-200">
                  <span className="text-xs text-gray-700">{topic}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Topic */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic(newTopic))}
              placeholder="Add a custom topic..."
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
            <button
              type="button"
              onClick={() => addTopic(newTopic)}
              disabled={!newTopic}
              className="px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:bg-gray-300"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Suggested Topics */}
          <div>
            <p className="text-[10px] font-medium text-gray-500 mb-2">Suggested topics:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics
                .filter(t => !tabletopData.discussionTopics.includes(t))
                .map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => addTopic(topic)}
                    className="px-2 py-1 text-[10px] text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    + {topic}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expected Outcomes */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Expected Outcomes</h2>
        </div>
        <div className="p-4">
          <textarea
            rows={2}
            value={tabletopData.expectedOutcomes}
            onChange={(e) => setTabletopData({ ...tabletopData, expectedOutcomes: e.target.value })}
            placeholder="What outcomes do you expect from this exercise? e.g., Updated procedures, identified gaps, trained staff..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

// === BCP TEST STEP 1: Scenario & Strategy Selection ===
function ScenarioStep({ linkedBCP, planData, setPlanData, availableStrategies }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Select Test Scenario & Strategy</p>
            <p className="text-[10px] text-blue-700 mt-1">
              Choose a disruption scenario from the linked BCP and the recovery strategy you want to test.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Linked BCP: {linkedBCP.name}</h2>
        </div>
        <div className="p-4 space-y-6">
          {/* Scenario Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Select Scenario <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {linkedBCP.scenarios.map((scenario: any) => (
                <label
                  key={scenario.id}
                  className={`relative flex items-start p-4 border rounded-sm cursor-pointer transition-colors ${
                    planData.scenario === scenario.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={scenario.id}
                    checked={planData.scenario === scenario.id}
                    onChange={() => setPlanData({ ...planData, scenario: scenario.id, strategy: null })}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">{scenario.name}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                        scenario.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        scenario.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {scenario.severity}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-100 text-blue-700 rounded">
                        {scenario.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{scenario.id}</p>
                  </div>
                  {planData.scenario === scenario.id && (
                    <CheckCircleSolidIcon className="h-5 w-5 text-gray-900" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Strategy Selection */}
          {planData.scenario && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Select Recovery Strategy <span className="text-red-500">*</span>
              </label>
              {availableStrategies.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No strategies defined for this scenario.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {availableStrategies.map((strategy: any) => (
                    <label
                      key={strategy.id}
                      className={`relative flex items-start p-4 border rounded-sm cursor-pointer transition-colors ${
                        planData.strategy === strategy.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="strategy"
                        value={strategy.id}
                        checked={planData.strategy === strategy.id}
                        onChange={() => setPlanData({ ...planData, strategy: strategy.id })}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{strategy.name}</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-purple-100 text-purple-700 rounded">
                            {strategy.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">Target RTO: {strategy.rto}</p>
                      </div>
                      {planData.strategy === strategy.id && (
                        <CheckCircleSolidIcon className="h-5 w-5 text-gray-900" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === STEP 2: Process Selection ===
function ProcessesStep({ linkedBCP, planData, setPlanData }: any) {
  const toggleProcess = (id: string) => {
    const current = planData.selectedProcesses;
    const updated = current.includes(id) ? current.filter((p: string) => p !== id) : [...current, id];
    setPlanData({ ...planData, selectedProcesses: updated });
  };

  const selectAll = () => {
    setPlanData({ ...planData, selectedProcesses: linkedBCP.processes.map((p: any) => p.id) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Select Processes to Test</h2>
          <button onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-800">Select All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {linkedBCP.processes.map((process: any) => (
            <label key={process.id} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={planData.selectedProcesses.includes(process.id)}
                onChange={() => toggleProcess(process.id)}
                className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <div className="ml-3 flex-1">
                <p className="text-xs font-medium text-gray-900">{process.name}</p>
                <p className="text-[10px] text-gray-500">Owner: {process.owner} • RTO: {process.rto}h</p>
              </div>
              <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                process.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                process.criticality === 'High' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {process.criticality}
              </span>
            </label>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500">{planData.selectedProcesses.length} process(es) selected</p>
    </div>
  );
}

// === STEP 3: Internal Dependencies (Auto-populated from BIA) ===
function InternalDepsStep({ linkedBCP, planData }: any) {
  // Dependencies are auto-populated based on selected processes from BIA
  // This is read-only - dependencies are derived from the BIA records

  // Mock: In reality, this would filter based on selected processes
  const derivedInternalDeps = linkedBCP.internalDeps.filter((dep: any) => {
    // All dependencies linked to selected processes would be shown
    return planData.selectedProcesses.length > 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Auto-Populated from BIA</p>
            <p className="text-[10px] text-blue-700 mt-1">
              Internal dependencies are automatically derived from the BIA records linked to your selected processes.
              These cannot be modified here - update the BIA if changes are needed.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Internal Dependencies</h2>
            <p className="text-[10px] text-gray-500 mt-1">Departments and systems that support the selected processes</p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">Read-Only</span>
        </div>
        {derivedInternalDeps.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">
            Select processes in the previous step to see their dependencies.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {derivedInternalDeps.map((dep: any) => (
              <div key={dep.id} className="flex items-center px-4 py-3 bg-gray-50">
                <CheckCircleSolidIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="ml-3 flex-1">
                  <p className="text-xs font-medium text-gray-900">{dep.name}</p>
                  <p className="text-[10px] text-gray-500">{dep.type} • Linked via BIA</p>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                  dep.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                  dep.criticality === 'High' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {dep.criticality}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">{derivedInternalDeps.length} internal dependency(ies) will be tested</p>
    </div>
  );
}

// === STEP 4: External Dependencies (Auto-populated from BIA) ===
function ExternalDepsStep({ linkedBCP, planData }: any) {
  // Dependencies are auto-populated based on selected processes from BIA
  // This is read-only - dependencies are derived from the BIA records

  // Mock: In reality, this would filter based on selected processes
  const derivedExternalDeps = linkedBCP.externalDeps.filter((dep: any) => {
    // All dependencies linked to selected processes would be shown
    return planData.selectedProcesses.length > 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800">Auto-Populated from BIA</p>
            <p className="text-[10px] text-blue-700 mt-1">
              External dependencies are automatically derived from the BIA records linked to your selected processes.
              These cannot be modified here - update the BIA if changes are needed.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">External Dependencies</h2>
            <p className="text-[10px] text-gray-500 mt-1">Third-party vendors and external services required for recovery</p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">Read-Only</span>
        </div>
        {derivedExternalDeps.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">
            Select processes in the previous step to see their dependencies.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {derivedExternalDeps.map((dep: any) => (
              <div key={dep.id} className="flex items-center px-4 py-3 bg-gray-50">
                <CheckCircleSolidIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="ml-3 flex-1">
                  <p className="text-xs font-medium text-gray-900">{dep.name}</p>
                  <p className="text-[10px] text-gray-500">{dep.type} • Linked via BIA</p>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                  dep.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                  dep.criticality === 'High' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {dep.criticality}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">{derivedExternalDeps.length} external dependency(ies) will be tested</p>
    </div>
  );
}


// === STEP 5: Success Criteria ===
function CriteriaStep({ linkedBCP, planData, setPlanData, isTabletop }: any) {
  const toggle = (id: string) => {
    const current = planData.selectedCriteria;
    const updated = current.includes(id) ? current.filter((p: string) => p !== id) : [...current, id];
    setPlanData({ ...planData, selectedCriteria: updated });
  };

  const addCustomCriteria = () => {
    setPlanData({
      ...planData,
      customCriteria: [...planData.customCriteria, { name: '', description: '', metric: '' }]
    });
  };

  const updateCustomCriteria = (index: number, field: string, value: string) => {
    const updated = [...planData.customCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setPlanData({ ...planData, customCriteria: updated });
  };

  const removeCustomCriteria = (index: number) => {
    const updated = planData.customCriteria.filter((_: any, i: number) => i !== index);
    setPlanData({ ...planData, customCriteria: updated });
  };

  // Default criteria for tabletop exercises
  const tabletopCriteria = [
    { id: 'TT-SC-001', name: 'Objectives Achieved', description: 'All exercise objectives were met', metric: 'All objectives addressed' },
    { id: 'TT-SC-002', name: 'Participation', description: 'All key stakeholders actively participated', metric: '100% attendance and engagement' },
    { id: 'TT-SC-003', name: 'Gaps Identified', description: 'Gaps in procedures or knowledge were identified', metric: 'Documented gap list' },
    { id: 'TT-SC-004', name: 'Action Items', description: 'Clear action items were defined', metric: 'Action items with owners and dates' },
  ];

  const criteriaList = isTabletop ? tabletopCriteria : (linkedBCP?.successCriteria || []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Select Success Criteria</h2>
          <p className="text-[10px] text-gray-500 mt-1">Define how {isTabletop ? 'exercise' : 'test'} success will be measured.</p>
        </div>
        <div className="divide-y divide-gray-100">
          {criteriaList.map((criteria: any) => (
            <label key={criteria.id} className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={planData.selectedCriteria.includes(criteria.id)}
                onChange={() => toggle(criteria.id)}
                className="h-4 w-4 mt-0.5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <div className="ml-3 flex-1">
                <p className="text-xs font-medium text-gray-900">{criteria.name}</p>
                <p className="text-[10px] text-gray-500">{criteria.description}</p>
                <p className="text-[10px] text-blue-600 mt-1">Metric: {criteria.metric}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Criteria */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Custom Criteria</h2>
          <button onClick={addCustomCriteria} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add Custom
          </button>
        </div>
        {planData.customCriteria.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No custom criteria added</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {planData.customCriteria.map((criteria: any, index: number) => (
              <div key={index} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Custom Criteria {index + 1}</span>
                  <button onClick={() => removeCustomCriteria(index)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Criteria Name"
                  value={criteria.name}
                  onChange={(e) => updateCustomCriteria(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={criteria.description}
                  onChange={(e) => updateCustomCriteria(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <input
                  type="text"
                  placeholder="Measurement Metric"
                  value={criteria.metric}
                  onChange={(e) => updateCustomCriteria(index, 'metric', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// === STEP 6: Schedule & Team ===
function ScheduleStep({ planData, setPlanData }: any) {
  const addParticipant = () => {
    setPlanData({
      ...planData,
      participants: [...planData.participants, { name: '', role: '' }]
    });
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...planData.participants];
    updated[index] = { ...updated[index], [field]: value };
    setPlanData({ ...planData, participants: updated });
  };

  const removeParticipant = (index: number) => {
    const updated = planData.participants.filter((_: any, i: number) => i !== index);
    setPlanData({ ...planData, participants: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Schedule</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Planned Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={planData.plannedStartDate}
                onChange={(e) => setPlanData({ ...planData, plannedStartDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Planned End Date</label>
              <input
                type="date"
                value={planData.plannedEndDate}
                onChange={(e) => setPlanData({ ...planData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Test Facilitator <span className="text-red-500">*</span></label>
            <select
              value={planData.facilitator}
              onChange={(e) => setPlanData({ ...planData, facilitator: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Select facilitator...</option>
              <option value="Sarah Chen">Sarah Chen - BCM Manager</option>
              <option value="John Smith">John Smith - IT Director</option>
              <option value="Emily Wang">Emily Wang - Operations Manager</option>
              <option value="David Kim">David Kim - Risk Officer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Participants</h2>
          <button onClick={addParticipant} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add Participant
          </button>
        </div>
        {planData.participants.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No participants added yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {planData.participants.map((p: any, index: number) => (
              <div key={index} className="p-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-sm"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={p.role}
                  onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-sm"
                />
                <button onClick={() => removeParticipant(index)} className="text-red-600 hover:text-red-800">
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


// === STEP 7: Review & Submit ===
function ReviewStep({ linkedBCP, planData, testId, isTabletop, tabletopData }: any) {
  const getScenarioName = () => linkedBCP?.scenarios?.find((s: any) => s.id === planData.scenario)?.name || 'Not selected';
  const getStrategyName = () => {
    if (!planData.scenario || !linkedBCP) return 'Not selected';
    const strategies = linkedBCP.strategies[planData.scenario] || [];
    return strategies.find((s: any) => s.id === planData.strategy)?.name || 'Not selected';
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-green-800">Ready for Review</p>
            <p className="text-[10px] text-green-700 mt-1">
              Review the {isTabletop ? 'exercise' : 'test'} plan configuration below and submit for approval.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {isTabletop ? (
          /* Tabletop Exercise Summary */
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Exercise Scope</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500">Objectives:</span>
                <p className="font-medium text-gray-900 mt-1">{tabletopData?.objectives || 'Not defined'}</p>
              </div>
              <div>
                <span className="text-gray-500">Discussion Topics:</span>
                <p className="font-medium text-gray-900 mt-1">{tabletopData?.discussionTopics?.length || 0} topics</p>
              </div>
            </div>
          </div>
        ) : (
          /* BCP Test Summary */
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Scenario & Strategy</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Scenario:</span>
                <span className="font-medium text-gray-900">{getScenarioName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Strategy:</span>
                <span className="font-medium text-gray-900">{getStrategyName()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <h3 className="text-xs font-semibold text-gray-900 mb-3">Schedule</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Start Date:</span>
              <span className="font-medium text-gray-900">{planData.plannedStartDate || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Facilitator:</span>
              <span className="font-medium text-gray-900">{planData.facilitator || 'Not assigned'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabletop Discussion Topics */}
      {isTabletop && tabletopData?.discussionTopics?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900">Discussion Topics</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {tabletopData.discussionTopics.map((topic: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-[10px] font-medium text-gray-600 flex-shrink-0">
                    {i + 1}
                  </span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* BCP Test Scope Summary */}
      {!isTabletop && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900">Test Scope Summary</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">Processes</p>
              <p className="text-xs font-medium text-gray-900">{planData.selectedProcesses.length} selected</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">Internal Dependencies</p>
              <p className="text-xs font-medium text-gray-900">{planData.selectedInternalDeps.length} selected</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">External Dependencies</p>
              <p className="text-xs font-medium text-gray-900">{planData.selectedExternalDeps.length} selected</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">Success Criteria</p>
              <p className="text-xs font-medium text-gray-900">{planData.selectedCriteria.length + planData.customCriteria.length} defined</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Criteria for Tabletop */}
      {isTabletop && (
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900">Success Criteria</h3>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-gray-900">{planData.selectedCriteria.length + planData.customCriteria.length} criteria defined</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-900">Participants ({planData.participants.length})</h3>
        </div>
        {planData.participants.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No participants added</div>
        ) : (
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {planData.participants.map((p: any, i: number) => (
                <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {p.name} ({p.role})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}