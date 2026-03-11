'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface LogDeviationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: string;
  testId: string;
  onSubmit: (deviation: Deviation) => void;
}

export interface Deviation {
  id: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  title: string;
  description: string;
  expectedBehavior: string;
  actualBehavior: string;
  impact: string;
  phase: string;
  timestamp: string;
  requiresFollowUp: boolean;
}

const severityOptions = [
  { value: 'critical', label: 'Critical', color: 'red', description: 'Test cannot continue' },
  { value: 'major', label: 'Major', color: 'orange', description: 'Significant impact on objectives' },
  { value: 'minor', label: 'Minor', color: 'yellow', description: 'Limited impact, workaround available' },
  { value: 'observation', label: 'Observation', color: 'blue', description: 'For improvement consideration' }
];

export default function LogDeviationModal({ isOpen, onClose, currentPhase, testId, onSubmit }: LogDeviationModalProps) {
  const [severity, setSeverity] = useState<Deviation['severity']>('minor');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [impact, setImpact] = useState('');
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const deviation: Deviation = {
      id: `DEV-${Date.now()}`,
      severity,
      title,
      description,
      expectedBehavior,
      actualBehavior,
      impact,
      phase: currentPhase,
      timestamp: new Date().toISOString(),
      requiresFollowUp
    };

    onSubmit(deviation);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setTitle('');
      setDescription('');
      setExpectedBehavior('');
      setActualBehavior('');
      setImpact('');
      setRequiresFollowUp(false);
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const getSeverityColors = (sev: string, isSelected: boolean) => {
    const colors: Record<string, string> = {
      critical: isSelected ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300',
      major: isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300',
      minor: isSelected ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-yellow-300',
      observation: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'
    };
    return colors[sev] || colors.minor;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
          {/* Header */}
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-sm">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Log Deviation</h2>
                  <p className="text-xs text-gray-600">Test: {testId} | Phase: {currentPhase}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isSuccess ? (
            <div className="px-6 py-12 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Deviation Logged Successfully</h3>
              <p className="text-sm text-gray-600">The deviation has been recorded and will be included in the test report.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Severity Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Severity Level *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {severityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSeverity(option.value as Deviation['severity'])}
                        className={`p-3 rounded-sm border text-center transition-colors ${getSeverityColors(option.value, severity === option.value)}`}
                      >
                        <ExclamationCircleIcon className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium block">{option.label}</span>
                        <span className="text-[10px] text-gray-500">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Deviation Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Communication channel unavailable"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Expected vs Actual */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Expected Behavior *
                    </label>
                    <textarea
                      value={expectedBehavior}
                      onChange={(e) => setExpectedBehavior(e.target.value)}
                      required
                      rows={3}
                      placeholder="What should have happened..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Actual Behavior *
                    </label>
                    <textarea
                      value={actualBehavior}
                      onChange={(e) => setActualBehavior(e.target.value)}
                      required
                      rows={3}
                      placeholder="What actually happened..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Additional context or details..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Impact Assessment */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Impact Assessment
                  </label>
                  <textarea
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    rows={2}
                    placeholder="How does this affect the test objectives or business continuity..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Follow-up Required */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={requiresFollowUp}
                    onChange={(e) => setRequiresFollowUp(e.target.checked)}
                    className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="followUp" className="text-sm text-gray-700">
                    This deviation requires post-test follow-up action
                  </label>
                </div>

                {/* Timestamp Info */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-sm border border-amber-200">
                  <ClockIcon className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-amber-700">
                    Logged at: {new Date().toLocaleString()} | Phase: {currentPhase}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !expectedBehavior || !actualBehavior}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging...
                    </>
                  ) : (
                    'Log Deviation'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

