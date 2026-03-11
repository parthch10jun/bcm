'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Step3Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

export default function Step3ThreatSelection({ assessmentId, data, onUpdate, onNext, onBack, isDemoMode = false }: Step3Props) {
  const [threatCount, setThreatCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const initializeThreats = async (attempt = 1) => {
    // In demo mode, use mock data
    if (isDemoMode) {
      console.log('🎬 Demo Mode: Using mock threat count');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockThreatCount = 12;
      setThreatCount(mockThreatCount);
      setInitialized(true);
      setLoading(false);
      onUpdate({ selectedThreats: mockThreatCount });
      return;
    }

    if (!assessmentId) {
      console.log('⚠️ No assessment ID provided, skipping threat initialization');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Initializing threats for assessment ${assessmentId} (attempt ${attempt})...`);

      // Add a small delay for first retry to allow backend to commit transaction
      if (attempt > 1) {
        console.log(`⏳ Waiting 1 second before retry...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const url = `http://localhost:8080/api/risk-assessments/wizard/${assessmentId}/initialize-threats`;
      console.log(`📡 Calling: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Backend error: ${errorText}`);
        throw new Error(`Failed to initialize threats (HTTP ${response.status}): ${errorText}`);
      }

      const count = await response.json();
      console.log(`✅ Successfully initialized ${count} threats`);

      setThreatCount(count);
      setInitialized(true);
      setError(null);
      setLoading(false);
      onUpdate({ selectedThreats: count });
    } catch (err: any) {
      console.error('❌ Error initializing threats:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });

      // Retry up to 3 times
      if (attempt < 3) {
        console.log(`⚠️ Retrying... (${attempt}/3)`);
        setRetryCount(attempt);
        setTimeout(() => initializeThreats(attempt + 1), 1500);
      } else {
        console.error('❌ All retry attempts failed');
        setError('Failed to initialize threats after multiple attempts. Please try again.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if ((assessmentId || isDemoMode) && !initialized) {
      initializeThreats();
    }
  }, [assessmentId, isDemoMode]);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Threat Selection</h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 3 of 7: Auto-load applicable threats</p>
          </div>
          <button
            onClick={onBack}
            className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="text-center py-12">
              <div className="border border-red-200 bg-red-50 rounded-sm p-6 max-w-md mx-auto">
                <div className="text-red-600 mb-3">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-red-900 mb-2">Initialization Failed</h3>
                <p className="text-xs text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setInitialized(false);
                    initializeThreats();
                  }}
                  className="px-4 py-2 text-xs bg-red-600 text-white rounded-sm hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
              <p className="text-sm text-gray-500 mt-3">
                Initializing applicable threats...
                {retryCount > 0 && <span className="block text-xs text-amber-600 mt-1">Retrying... ({retryCount}/3)</span>}
              </p>
            </div>
          ) : initialized ? (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="border border-green-200 bg-green-50 rounded-sm p-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-900">Threats Initialized Successfully</h3>
                    <p className="text-xs text-green-700 mt-1">
                      {threatCount} applicable threat{threatCount !== 1 ? 's' : ''} have been identified based on your risk category and context.
                    </p>
                  </div>
                </div>
              </div>

              {/* Threat Summary */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Threat Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">{threatCount}</div>
                    <div className="text-xs text-gray-500 mt-1">Total Threats</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-900">{threatCount}</div>
                    <div className="text-xs text-blue-700 mt-1">Selected</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded">
                    <div className="text-2xl font-bold text-amber-900">0</div>
                    <div className="text-xs text-amber-700 mt-1">Assessed</div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="border border-blue-200 bg-blue-50 rounded-sm p-4">
                <p className="text-xs text-blue-900">
                  <strong>Next Step:</strong> You will assess each threat by evaluating its likelihood and impact in the Risk Evaluation step.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Waiting to initialize threats...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!initialized}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Next: Risk Evaluation
          </button>
        </div>
      </div>
    </>
  );
}

