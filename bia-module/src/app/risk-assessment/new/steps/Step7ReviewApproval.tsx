'use client';

import { useState } from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Step7Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onBack: () => void;
  onSubmit: () => void;
  isDemoMode?: boolean;
}

export default function Step7ReviewApproval({ assessmentId, data, onUpdate, onBack, onSubmit, isDemoMode = false }: Step7Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // In demo mode, skip API call
      if (isDemoMode) {
        console.log('🎬 Demo Mode: Simulating assessment submission');
        await new Promise(resolve => setTimeout(resolve, 800));
        alert('Risk assessment submitted successfully! (Demo Mode)');
        onSubmit();
        return;
      }

      const response = await fetch(`http://localhost:8080/api/risk-assessments/wizard/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executiveSummary: data.executiveSummary || '',
          recommendations: data.recommendations || ''
        })
      });

      if (!response.ok) throw new Error('Failed to submit assessment');

      alert('Risk assessment submitted successfully!');
      onSubmit();
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Review & Approval</h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 7 of 7: Final review and submission</p>
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
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Assessment Summary */}
          <div className="border border-gray-200 rounded-sm p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Assessment Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Assessment Name:</span>
                <span className="ml-2 font-medium">{data.assessmentName}</span>
              </div>
              <div>
                <span className="text-gray-500">Context:</span>
                <span className="ml-2 font-medium">{data.contextName}</span>
              </div>
              <div>
                <span className="text-gray-500">Assessor:</span>
                <span className="ml-2 font-medium">{data.assessorName}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-medium">{data.assessmentDate}</span>
              </div>
            </div>
          </div>

          {/* Risk Summary */}
          {data.riskSummary && (
            <div className="border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Risk Summary</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-xl font-bold text-gray-900">{data.riskSummary.totalThreats || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">Total</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-xl font-bold text-red-900">{data.riskSummary.highRiskCount || 0}</div>
                  <div className="text-xs text-red-700 mt-1">High</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded">
                  <div className="text-xl font-bold text-amber-900">{data.riskSummary.mediumRiskCount || 0}</div>
                  <div className="text-xs text-amber-700 mt-1">Medium</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-900">{data.riskSummary.lowRiskCount || 0}</div>
                  <div className="text-xs text-green-700 mt-1">Low</div>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary */}
          <div className="border border-gray-200 rounded-sm p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Executive Summary (Optional)
            </label>
            <textarea
              value={data.executiveSummary || ''}
              onChange={(e) => onUpdate({ executiveSummary: e.target.value })}
              rows={4}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Provide a high-level summary of the risk assessment findings..."
            />
          </div>

          {/* Recommendations */}
          <div className="border border-gray-200 rounded-sm p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Recommendations (Optional)
            </label>
            <textarea
              value={data.recommendations || ''}
              onChange={(e) => onUpdate({ recommendations: e.target.value })}
              rows={4}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Provide recommendations for risk mitigation and next steps..."
            />
          </div>

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
            onClick={handleSubmit}
            disabled={submitting}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50 flex items-center"
          >
            {submitting ? (
              <>
                <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Submit Assessment
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

