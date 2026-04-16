'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CommandLineIcon,
  BoltIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Runbook data with detailed steps
const runbookData: Record<string, any> = {
  'CRB-001': {
    id: 'CRB-001',
    name: 'Ransomware Isolation Runbook',
    description: 'Step-by-step procedure for isolating ransomware-infected systems to prevent lateral movement',
    category: 'Containment',
    linkedIRP: 'IRP-001',
    irpName: 'Ransomware Attack Response',
    status: 'Ready',
    estimatedTime: '45 min',
    automated: true,
    owner: 'SOC Lead',
    lastUpdated: '2025-11-10',
    version: '2.3',
    phases: [
      {
        id: 1,
        name: 'Initial Detection Validation',
        duration: '5 min',
        steps: [
          { id: 101, title: 'Confirm ransomware indicators in SIEM alerts', description: 'Review Splunk alerts for file encryption patterns, suspicious process execution', required: true, automated: false, evidence: true },
          { id: 102, title: 'Identify patient zero system', description: 'Trace back to the first infected endpoint using EDR timeline', required: true, automated: true, evidence: true },
          { id: 103, title: 'Document ransomware variant', description: 'Capture ransom note, encrypted file extension, and IOCs', required: true, automated: false, evidence: true }
        ]
      },
      {
        id: 2,
        name: 'Network Isolation',
        duration: '10 min',
        steps: [
          { id: 201, title: 'Isolate infected segment via firewall', description: 'Apply emergency ACL rules to block lateral movement from infected VLAN', required: true, automated: true, evidence: false },
          { id: 202, title: 'Disable affected user accounts', description: 'Lock compromised AD accounts to prevent credential abuse', required: true, automated: true, evidence: false },
          { id: 203, title: 'Block C2 domains at DNS level', description: 'Add known C2 domains to DNS sinkhole', required: true, automated: true, evidence: false },
          { id: 204, title: 'Quarantine infected endpoints via EDR', description: 'Push network isolation policy through CrowdStrike', required: true, automated: true, evidence: false }
        ]
      },
      {
        id: 3,
        name: 'Containment Verification',
        duration: '15 min',
        steps: [
          { id: 301, title: 'Verify no new encryption activity', description: 'Monitor file system changes across network shares', required: true, automated: true, evidence: true },
          { id: 302, title: 'Confirm isolated systems cannot reach network', description: 'Run connectivity tests from quarantined systems', required: true, automated: false, evidence: true },
          { id: 303, title: 'Validate C2 communication is blocked', description: 'Check DNS logs for attempted C2 callbacks', required: true, automated: true, evidence: true },
          { id: 304, title: 'Review lateral movement attempts', description: 'Analyze failed authentication attempts post-isolation', required: false, automated: true, evidence: true }
        ]
      },
      {
        id: 4,
        name: 'Backup Protection',
        duration: '10 min',
        steps: [
          { id: 401, title: 'Isolate backup infrastructure', description: 'Disconnect backup servers from production network', required: true, automated: false, evidence: false },
          { id: 402, title: 'Verify backup integrity', description: 'Run integrity checks on most recent backup snapshots', required: true, automated: true, evidence: true },
          { id: 403, title: 'Enable immutable backup mode', description: 'Activate WORM protection on backup storage', required: true, automated: true, evidence: false }
        ]
      },
      {
        id: 5,
        name: 'Documentation & Escalation',
        duration: '5 min',
        steps: [
          { id: 501, title: 'Log all actions in incident tracker', description: 'Update ServiceNow incident with timeline and actions', required: true, automated: false, evidence: false },
          { id: 502, title: 'Prepare containment status report', description: 'Generate summary for CISO and stakeholders', required: true, automated: false, evidence: true },
          { id: 503, title: 'Trigger forensics runbook if needed', description: 'Escalate to CRB-002 for evidence collection', required: false, automated: false, evidence: false }
        ]
      }
    ],
    executionHistory: [
      { id: 'EX-001', date: '2025-11-15', duration: '42 min', result: 'Success', executor: 'Ahmed Al-Mansouri', stepsCompleted: 17, stepsTotal: 17, notes: 'Executed during quarterly drill' },
      { id: 'EX-002', date: '2025-09-20', duration: '38 min', result: 'Success', executor: 'Sarah Johnson', stepsCompleted: 17, stepsTotal: 17, notes: 'Tabletop exercise' },
      { id: 'EX-003', date: '2025-07-15', duration: '55 min', result: 'Partial', executor: 'Mohammed Hassan', stepsCompleted: 15, stepsTotal: 17, notes: 'Backup verification delayed due to storage issue' }
    ]
  }
};

// Add more runbooks with same structure pattern...
const defaultRunbook = {
  id: 'CRB-XXX',
  name: 'Cyber Runbook',
  description: 'Step-by-step incident response procedure',
  category: 'General',
  linkedIRP: 'IRP-001',
  status: 'Ready',
  estimatedTime: '30 min',
  automated: false,
  owner: 'Security Team',
  lastUpdated: '2025-11-01',
  version: '1.0',
  phases: [
    {
      id: 1,
      name: 'Initial Steps',
      duration: '10 min',
      steps: [
        { id: 101, title: 'Verify incident details', description: 'Confirm incident scope and severity', required: true, automated: false, evidence: true },
        { id: 102, title: 'Notify response team', description: 'Alert relevant team members', required: true, automated: false, evidence: false }
      ]
    }
  ],
  executionHistory: []
};

function CyberRunbookDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const runbookId = params.id as string;
  const startExecute = searchParams.get('execute') === 'true';

  const runbook = runbookData[runbookId] || { ...defaultRunbook, id: runbookId, name: `Runbook ${runbookId}` };

  const [activeTab, setActiveTab] = useState<'steps' | 'history' | 'documentation'>('steps');
  const [executionMode, setExecutionMode] = useState(startExecute);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]);
  const [stepNotes, setStepNotes] = useState<Record<number, string>>({});
  const [stepEvidence, setStepEvidence] = useState<Record<number, string[]>>({});

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId) ? prev.filter(id => id !== phaseId) : [...prev, phaseId]
    );
  };

  const totalSteps = runbook.phases.reduce((sum: number, phase: any) => sum + phase.steps.length, 0);
  const completedCount = completedSteps.length;
  const progress = Math.round((completedCount / totalSteps) * 100);

  const getPhaseStatus = (phase: any) => {
    const phaseStepIds = phase.steps.map((s: any) => s.id);
    const completedInPhase = phaseStepIds.filter((id: number) => completedSteps.includes(id)).length;
    if (completedInPhase === 0) return 'pending';
    if (completedInPhase === phaseStepIds.length) return 'complete';
    return 'in-progress';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Containment': return 'bg-red-100 text-red-700 border-red-200';
      case 'Investigation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Eradication': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Compliance': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp/runbooks"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <CommandLineIcon className="h-5 w-5 text-gray-700" />
                  <h1 className="text-xl font-semibold text-gray-900">{runbook.name}</h1>
                  {runbook.automated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      <BoltIcon className="h-3 w-3" /> Automated
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{runbook.id} • Linked to {runbook.linkedIRP} • Version {runbook.version}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {executionMode && (
                <>
                  {/* Timer */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-mono text-sm font-medium">{formatTime(elapsedTime)}</span>
                  </div>
                  {/* Progress */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-sm">
                    <span className="text-xs font-medium text-gray-900">{completedCount}/{totalSteps}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-600">{progress}%</span>
                  </div>
                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-sm ${
                      isRunning ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isRunning ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                    {isRunning ? 'Pause' : 'Resume'}
                  </button>
                  {/* Stop */}
                  <button
                    onClick={() => { setExecutionMode(false); setIsRunning(false); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700"
                  >
                    <StopIcon className="h-4 w-4" />
                    End
                  </button>
                </>
              )}
              {!executionMode && (
                <button
                  onClick={() => { setExecutionMode(true); setIsRunning(true); setCompletedSteps([]); setElapsedTime(0); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700"
                >
                  <PlayIcon className="h-4 w-4" />
                  Start Execution
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-4 border-t border-gray-200 pt-3">
            <button
              onClick={() => setActiveTab('steps')}
              className={`text-xs font-medium pb-2 border-b-2 transition-colors ${activeTab === 'steps' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Steps ({totalSteps})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-xs font-medium pb-2 border-b-2 transition-colors ${activeTab === 'history' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Execution History
            </button>
            <button
              onClick={() => setActiveTab('documentation')}
              className={`text-xs font-medium pb-2 border-b-2 transition-colors ${activeTab === 'documentation' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Documentation
            </button>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="space-y-4">
            {executionMode && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-sm p-4">
                <div className="flex items-center gap-3">
                  <ArrowPathIcon className={`h-5 w-5 text-green-600 ${isRunning ? 'animate-spin' : ''}`} />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Execution Mode Active</p>
                    <p className="text-xs text-green-700 mt-0.5">Complete steps in order. Add notes and evidence as needed.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Phases */}
            {runbook.phases.map((phase: any) => {
              const phaseStatus = getPhaseStatus(phase);
              const isExpanded = expandedPhases.includes(phase.id);
              const phaseSteps = phase.steps;
              const completedInPhase = phaseSteps.filter((s: any) => completedSteps.includes(s.id)).length;

              return (
                <div key={phase.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  {/* Phase Header */}
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {phaseStatus === 'complete' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : phaseStatus === 'in-progress' ? (
                        <ArrowPathIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Phase {phase.id}: {phase.name}</p>
                        <p className="text-[10px] text-gray-500">{phase.duration} • {completedInPhase}/{phaseSteps.length} steps</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDownIcon className="h-4 w-4 text-gray-500" /> : <ChevronRightIcon className="h-4 w-4 text-gray-500" />}
                  </button>

                  {/* Phase Steps */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {phaseSteps.map((step: any) => {
                        const isCompleted = completedSteps.includes(step.id);
                        return (
                          <div key={step.id} className={`px-4 py-3 ${isCompleted ? 'bg-green-50' : ''}`}>
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => executionMode && toggleStep(step.id)}
                                disabled={!executionMode}
                                className={`mt-0.5 h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                  isCompleted ? 'bg-green-600 border-green-600 text-white' : executionMode ? 'border-gray-300 hover:border-gray-400' : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                {isCompleted && <CheckIcon className="h-3 w-3" />}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-900">{step.title}</span>
                                  {step.required && <span className="text-[9px] px-1 py-0.5 bg-red-100 text-red-700 rounded">Required</span>}
                                  {step.automated && <span className="text-[9px] px-1 py-0.5 bg-purple-100 text-purple-700 rounded flex items-center gap-0.5"><BoltIcon className="h-2.5 w-2.5" />Auto</span>}
                                  {step.evidence && <span className="text-[9px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded flex items-center gap-0.5"><CameraIcon className="h-2.5 w-2.5" />Evidence</span>}
                                </div>
                                <p className="text-xs text-gray-600">{step.description}</p>

                                {/* Step Actions (in execution mode) */}
                                {executionMode && isCompleted && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <button className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                      <ChatBubbleLeftIcon className="h-3 w-3" /> Add Note
                                    </button>
                                    {step.evidence && (
                                      <button className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                                        <PaperClipIcon className="h-3 w-3" /> Attach Evidence
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Execution History</h3>
            </div>
            {runbook.executionHistory && runbook.executionHistory.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Execution ID</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Steps</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Result</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Executor</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {runbook.executionHistory.map((exec: any) => (
                    <tr key={exec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-mono text-gray-600">{exec.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{exec.date}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{exec.duration}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{exec.stepsCompleted}/{exec.stepsTotal}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-sm ${exec.result === 'Success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {exec.result}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{exec.executor}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{exec.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <ClockIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No execution history yet</p>
              </div>
            )}
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Runbook Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Category</span>
                  <span className={`px-2 py-0.5 rounded-sm border ${getCategoryColor(runbook.category)}`}>{runbook.category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Owner</span>
                  <span className="text-gray-900">{runbook.owner}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Estimated Time</span>
                  <span className="text-gray-900">{runbook.estimatedTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{runbook.lastUpdated}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Version</span>
                  <span className="text-gray-900">{runbook.version}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Linked Resources</h3>
              <div className="space-y-2">
                <Link href={`/bcp/scenarios/${runbook.linkedIRP}`} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{runbook.linkedIRP}</p>
                    <p className="text-gray-500">{runbook.irpName || 'Incident Response Plan'}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CyberRunbookDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading runbook...</div>
      </div>
    }>
      <CyberRunbookDetailContent />
    </Suspense>
  );
}

