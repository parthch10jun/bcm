'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BoltIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

import AddEvidenceModal, { Evidence } from './components/AddEvidenceModal';
import LogDeviationModal, { Deviation } from './components/LogDeviationModal';
import ContactTeamModal, { ContactRequest } from './components/ContactTeamModal';
import { useBCPTest } from '@/contexts/BCPTestContext';

// Dynamic import for 3D component
const BCPSimulation3D = dynamic(() => import('./BCPSimulation3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Loading 3D Simulation...</p>
      </div>
    </div>
  )
});

const testPhases = [
  {
    id: 1,
    name: 'Activation',
    duration: '15 min',
    steps: [
      'Declare incident and activate BCP team',
      'Notify all stakeholders',
      'Establish command center',
      'Verify communication channels'
    ],
    color: 'blue'
  },
  {
    id: 2,
    name: 'Assessment',
    duration: '30 min',
    steps: [
      'Assess scope and impact',
      'Identify affected systems and processes',
      'Determine resource requirements',
      'Establish recovery priorities'
    ],
    color: 'purple'
  },
  {
    id: 3,
    name: 'Response',
    duration: '2 hours',
    steps: [
      'Execute recovery procedures',
      'Activate alternate facilities',
      'Restore critical systems',
      'Implement workarounds'
    ],
    color: 'orange'
  },
  {
    id: 4,
    name: 'Recovery',
    duration: '4 hours',
    steps: [
      'Restore normal operations',
      'Validate system integrity',
      'Confirm data consistency',
      'Resume business processes'
    ],
    color: 'green'
  },
  {
    id: 5,
    name: 'Validation',
    duration: '1 hour',
    steps: [
      'Test all critical functions',
      'Verify stakeholder communications',
      'Document deviations',
      'Collect lessons learned'
    ],
    color: 'teal'
  }
];

export default function BCPTestExecutionPage() {
  const params = useParams();
  const testId = params.id as string;

  // BCP Test Context for real-time status updates
  const {
    startTest,
    pauseTest,
    resumeTest,
    completeTest,
    cancelTest,
    incrementDeviation,
    incrementEvidence,
    updateProgress,
    getTestState
  } = useBCPTest();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);

  // Modal states
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showLogDeviationModal, setShowLogDeviationModal] = useState(false);
  const [showContactTeamModal, setShowContactTeamModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Test data storage
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [deviationList, setDeviationList] = useState<Deviation[]>([]);
  const [contactHistory, setContactHistory] = useState<ContactRequest[]>([]);

  // BCP Test Loading Animation
  useEffect(() => {
    const stages = [
      { text: 'Initializing BCP Test Environment...', duration: 550 },
      { text: 'Loading Scenario Parameters...', duration: 500 },
      { text: 'Preparing 3D Simulation Engine...', duration: 450 },
      { text: 'Connecting to Resource Libraries...', duration: 400 },
      { text: 'Validating Test Procedures...', duration: 350 },
      { text: 'Ready to Execute Test...', duration: 300 }
    ];

    let currentStageIndex = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2.5;
      setLoadingProgress(Math.min(progress, 100));

      if (currentStageIndex < stages.length) {
        const stageProgress = (progress / 100) * stages.length;
        if (stageProgress > currentStageIndex) {
          setLoadingStage(stages[currentStageIndex].text);
          currentStageIndex++;
        }
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => setIsInitialLoading(false), 300);
      }
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  // Timer for test execution
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Sync progress to context
  useEffect(() => {
    if (testStarted && testId) {
      updateProgress(testId, currentPhase, completedSteps.length, elapsedTime);
    }
  }, [currentPhase, completedSteps.length, elapsedTime, testStarted, testId, updateProgress]);

  const totalSteps = testPhases.reduce((sum, p) => sum + p.steps.length, 0);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!testStarted) {
      // First time starting - register with context
      startTest(testId, testPhases.length, totalSteps);
      setTestStarted(true);
    } else {
      // Resuming from pause
      resumeTest(testId);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    pauseTest(testId);
  };

  const handleStop = () => {
    setIsRunning(false);
    cancelTest(testId);
    setElapsedTime(0);
    setCurrentPhase(0);
    setCompletedSteps([]);
    setTestStarted(false);
  };

  const handleCompleteTest = (result: 'Passed' | 'Passed with Issues' | 'Failed') => {
    setIsRunning(false);
    completeTest(testId, result);
    setShowCompleteModal(false);
  };

  const handleStepComplete = (phaseId: number, stepIndex: number) => {
    const stepId = phaseId * 100 + stepIndex;
    if (!completedSteps.includes(stepId)) {
      const newSteps = [...completedSteps, stepId];
      setCompletedSteps(newSteps);
    }
  };

  // Handlers for modals
  const handleAddEvidence = (evidence: Evidence) => {
    setEvidenceList(prev => [...prev, evidence]);
    incrementEvidence(testId);
    console.log('Evidence added:', evidence);
  };

  const handleLogDeviation = (deviation: Deviation) => {
    setDeviationList(prev => [...prev, deviation]);
    incrementDeviation(testId);
    console.log('Deviation logged:', deviation);
  };

  const handleContactTeam = (contact: ContactRequest) => {
    setContactHistory(prev => [...prev, contact]);
    console.log('Team contacted:', contact);
  };

  const handleNextPhase = () => {
    if (currentPhase < testPhases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      // Last phase - show complete modal
      setShowCompleteModal(true);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Gradient Orbs - BCP Theme */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />

          {/* Hexagonal Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2314b8a6' stroke-width='1'/%3E%3C/svg%3E")`,
              animation: 'hexMove 25s linear infinite'
            }} />
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          {/* Hexagonal Rotating Rings - BCP Theme */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer Hexagon Ring */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#14b8a6" strokeWidth="3" />
                <circle cx="50" cy="5" r="4" fill="#14b8a6" />
              </svg>
            </div>
            {/* Middle Hexagon Ring */}
            <div className="absolute inset-3" style={{ animation: 'spin 3s linear infinite reverse' }}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#0891b2" strokeWidth="3" />
                <circle cx="50" cy="5" r="4" fill="#0891b2" />
              </svg>
            </div>
            {/* Inner Hexagon Ring */}
            <div className="absolute inset-6 animate-spin" style={{ animationDuration: '3.5s' }}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#06b6d4" strokeWidth="3" />
                <circle cx="50" cy="5" r="4" fill="#06b6d4" />
              </svg>
            </div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <BeakerIcon className="h-12 w-12 text-teal-600 animate-pulse" />
            </div>
          </div>

          {/* Title with Gradient */}
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            BCP Test Execution
          </h2>
          <p className="text-sm text-gray-600 mb-6">{loadingStage}</p>

          {/* Progress Bar */}
          <div className="w-96 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{loadingProgress}% Complete</p>
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-2 gap-3 w-96 mx-auto mt-6">
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 20 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 20 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-teal-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Environment Ready</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 40 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 40 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-teal-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Scenario Loaded</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 60 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 60 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-teal-500" />
                )}
                <span className="text-xs font-medium text-gray-700">3D Engine Active</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 80 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 80 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-teal-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Procedures Validated</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes hexMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp/tests"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">BCP Test Execution - {testId}</h1>
                <p className="text-sm text-gray-500 mt-1">Cyberattack Response & Recovery Scenario</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-sm">
                <ClockIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-mono font-medium text-gray-900">{formatTime(elapsedTime)}</span>
              </div>
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors"
                >
                  <PlayIcon className="h-4 w-4" />
                  Start Test
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-sm hover:bg-amber-700 transition-colors"
                >
                  <PauseIcon className="h-4 w-4" />
                  Pause
                </button>
              )}
              <button
                onClick={handleStop}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700 transition-colors"
              >
                <StopIcon className="h-4 w-4" />
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 3D Simulation */}
          <div className="col-span-2 space-y-6">
            {/* 3D Visualization */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">3D Test Simulation</h2>
              <Suspense fallback={<div className="h-[600px] bg-gray-100 rounded-sm animate-pulse" />}>
                <BCPSimulation3D currentPhase={currentPhase} isRunning={isRunning} />
              </Suspense>
            </div>

            {/* Phase Progress */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Phases</h2>
              <div className="space-y-3">
                {testPhases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`border rounded-sm p-3 transition-all ${
                      currentPhase === index
                        ? 'border-gray-900 bg-gray-50'
                        : currentPhase > index
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {currentPhase > index ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : currentPhase === index ? (
                          <div className="h-5 w-5 border-2 border-gray-900 rounded-full animate-spin border-t-transparent" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{phase.name}</span>
                      </div>
                      <span className="text-xs text-gray-600">{phase.duration}</span>
                    </div>
                    <div className="ml-7 space-y-1">
                      {phase.steps.map((step, stepIndex) => {
                        const stepId = phase.id * 100 + stepIndex;
                        const isCompleted = completedSteps.includes(stepId);
                        return (
                          <div key={stepIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleStepComplete(phase.id, stepIndex)}
                              className="h-3 w-3 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                            />
                            <span className={`text-xs ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Test Details */}
          <div className="space-y-6">
            {/* Test Status */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border mt-1 ${
                    isRunning ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700 bg-gray-50 border-gray-200'
                  }`}>
                    {isRunning ? 'In Progress' : 'Paused'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-gray-500">Current Phase</p>
                  <p className="text-xs text-gray-900 mt-1">{testPhases[currentPhase]?.name || 'Not Started'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-gray-500">Completed Steps</p>
                  <p className="text-xs text-gray-900 mt-1">{completedSteps.length} / {testPhases.reduce((sum, p) => sum + p.steps.length, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-gray-500">Elapsed Time</p>
                  <p className="text-xs font-mono text-gray-900 mt-1">{formatTime(elapsedTime)}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setShowAddEvidenceModal(true)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                    Add Evidence
                  </div>
                  {evidenceList.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{evidenceList.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setShowLogDeviationModal(true)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-amber-50 border border-amber-200 rounded-sm hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
                    Log Deviation
                  </div>
                  {deviationList.length > 0 && (
                    <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{deviationList.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setShowContactTeamModal(true)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4 text-green-600" />
                    Contact Team
                  </div>
                  {contactHistory.length > 0 && (
                    <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{contactHistory.length}</span>
                  )}
                </button>
                <button
                  onClick={handleNextPhase}
                  disabled={currentPhase >= testPhases.length - 1}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BoltIcon className="h-4 w-4" />
                  Next Phase
                  {currentPhase < testPhases.length - 1 && (
                    <span className="ml-auto text-[10px] opacity-75">→ {testPhases[currentPhase + 1]?.name}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Test Participants */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Participants</h2>
              <div className="space-y-2">
                {[
                  { name: 'Sarah Johnson', role: 'Test Coordinator', status: 'Active' },
                  { name: 'Ahmed Al-Mansouri', role: 'IT Lead', status: 'Active' },
                  { name: 'Mohammed Hassan', role: 'Business Lead', status: 'Active' },
                  { name: 'Fatima Al-Rashid', role: 'Observer', status: 'Standby' }
                ].map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{participant.name}</p>
                      <p className="text-[10px] text-gray-600">{participant.role}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm ${
                      participant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {participant.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEvidenceModal
        isOpen={showAddEvidenceModal}
        onClose={() => setShowAddEvidenceModal(false)}
        currentPhase={testPhases[currentPhase]?.name || 'Unknown'}
        testId={testId}
        onSubmit={handleAddEvidence}
      />

      <LogDeviationModal
        isOpen={showLogDeviationModal}
        onClose={() => setShowLogDeviationModal(false)}
        currentPhase={testPhases[currentPhase]?.name || 'Unknown'}
        testId={testId}
        onSubmit={handleLogDeviation}
      />

      <ContactTeamModal
        isOpen={showContactTeamModal}
        onClose={() => setShowContactTeamModal(false)}
        testId={testId}
        onContact={handleContactTeam}
      />

      {/* Complete Test Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCompleteModal(false)} />
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
              <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                <h2 className="text-lg font-semibold text-gray-900">Complete Test</h2>
                <p className="text-xs text-gray-600">Select the final test result</p>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Test Duration: <span className="font-mono font-medium">{formatTime(elapsedTime)}</span> |
                  Deviations: <span className="font-medium">{deviationList.length}</span> |
                  Evidence: <span className="font-medium">{evidenceList.length}</span>
                </p>
                <button
                  onClick={() => handleCompleteTest('Passed')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Passed</span>
                </button>
                <button
                  onClick={() => handleCompleteTest('Passed with Issues')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-sm hover:bg-yellow-600 transition-colors"
                >
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="font-medium">Passed with Issues</span>
                </button>
                <button
                  onClick={() => handleCompleteTest('Failed')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
                >
                  <StopIcon className="h-5 w-5" />
                  <span className="font-medium">Failed</span>
                </button>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Continue Testing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

