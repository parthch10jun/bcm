'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TestExecutionStatus = 'Scheduled' | 'In Progress' | 'Paused' | 'Completed' | 'Failed' | 'Cancelled';

export interface TestExecutionState {
  testId: string;
  status: TestExecutionStatus;
  currentPhase: number;
  totalPhases: number;
  elapsedTime: number;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  result?: 'Passed' | 'Passed with Issues' | 'Failed' | null;
  deviationsCount: number;
  evidenceCount: number;
  completedStepsCount: number;
  totalStepsCount: number;
}

interface BCPTestContextType {
  testStates: Record<string, TestExecutionState>;
  updateTestStatus: (testId: string, updates: Partial<TestExecutionState>) => void;
  startTest: (testId: string, totalPhases: number, totalSteps: number) => void;
  pauseTest: (testId: string) => void;
  resumeTest: (testId: string) => void;
  completeTest: (testId: string, result: 'Passed' | 'Passed with Issues' | 'Failed') => void;
  cancelTest: (testId: string) => void;
  getTestState: (testId: string) => TestExecutionState | undefined;
  incrementDeviation: (testId: string) => void;
  incrementEvidence: (testId: string) => void;
  updateProgress: (testId: string, phase: number, completedSteps: number, elapsedTime: number) => void;
}

const BCPTestContext = createContext<BCPTestContextType | undefined>(undefined);

export function BCPTestProvider({ children }: { children: ReactNode }) {
  const [testStates, setTestStates] = useState<Record<string, TestExecutionState>>({});

  const updateTestStatus = useCallback((testId: string, updates: Partial<TestExecutionState>) => {
    setTestStates(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        ...updates,
        testId
      } as TestExecutionState
    }));
  }, []);

  const startTest = useCallback((testId: string, totalPhases: number, totalSteps: number) => {
    setTestStates(prev => ({
      ...prev,
      [testId]: {
        testId,
        status: 'In Progress',
        currentPhase: 0,
        totalPhases,
        elapsedTime: 0,
        startedAt: new Date().toISOString(),
        result: null,
        deviationsCount: 0,
        evidenceCount: 0,
        completedStepsCount: 0,
        totalStepsCount: totalSteps
      }
    }));
  }, []);

  const pauseTest = useCallback((testId: string) => {
    updateTestStatus(testId, {
      status: 'Paused',
      pausedAt: new Date().toISOString()
    });
  }, [updateTestStatus]);

  const resumeTest = useCallback((testId: string) => {
    updateTestStatus(testId, {
      status: 'In Progress',
      pausedAt: undefined
    });
  }, [updateTestStatus]);

  const completeTest = useCallback((testId: string, result: 'Passed' | 'Passed with Issues' | 'Failed') => {
    updateTestStatus(testId, {
      status: 'Completed',
      completedAt: new Date().toISOString(),
      result
    });
  }, [updateTestStatus]);

  const cancelTest = useCallback((testId: string) => {
    updateTestStatus(testId, {
      status: 'Cancelled',
      completedAt: new Date().toISOString()
    });
  }, [updateTestStatus]);

  const getTestState = useCallback((testId: string) => {
    return testStates[testId];
  }, [testStates]);

  const incrementDeviation = useCallback((testId: string) => {
    setTestStates(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        deviationsCount: (prev[testId]?.deviationsCount || 0) + 1
      }
    }));
  }, []);

  const incrementEvidence = useCallback((testId: string) => {
    setTestStates(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        evidenceCount: (prev[testId]?.evidenceCount || 0) + 1
      }
    }));
  }, []);

  const updateProgress = useCallback((testId: string, phase: number, completedSteps: number, elapsedTime: number) => {
    updateTestStatus(testId, {
      currentPhase: phase,
      completedStepsCount: completedSteps,
      elapsedTime
    });
  }, [updateTestStatus]);

  return (
    <BCPTestContext.Provider value={{
      testStates,
      updateTestStatus,
      startTest,
      pauseTest,
      resumeTest,
      completeTest,
      cancelTest,
      getTestState,
      incrementDeviation,
      incrementEvidence,
      updateProgress
    }}>
      {children}
    </BCPTestContext.Provider>
  );
}

export function useBCPTest() {
  const context = useContext(BCPTestContext);
  if (context === undefined) {
    throw new Error('useBCPTest must be used within a BCPTestProvider');
  }
  return context;
}

