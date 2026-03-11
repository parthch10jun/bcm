'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface Step5Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

// Mock summary data for demo mode
const DEMO_SUMMARY = {
  totalThreats: 5,
  highRiskCount: 2,
  mediumRiskCount: 2,
  lowRiskCount: 1,
  averageRiskScore: 14.2,
  overallRiskLevel: 'MEDIUM',
  threatsByCategory: [
    { category: 'Cyber Security', count: 2, avgScore: 16 },
    { category: 'Operational', count: 2, avgScore: 12 },
    { category: 'Personnel', count: 1, avgScore: 10 }
  ],
  topRisks: [
    { name: 'Cyber Attack / Ransomware', score: 20, level: 'HIGH' },
    { name: 'Data Breach', score: 16, level: 'HIGH' },
    { name: 'System Failure', score: 12, level: 'MEDIUM' }
  ]
};

export default function Step5RiskSummary({ assessmentId, data, onUpdate, onNext, onBack, isDemoMode = false }: Step5Props) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      console.log('🎬 Demo Mode: Using mock risk summary');
      setTimeout(() => {
        setSummary(DEMO_SUMMARY);
        onUpdate({ riskSummary: DEMO_SUMMARY });
        setLoading(false);
      }, 500);
    } else if (assessmentId) {
      loadSummary();
    }
  }, [assessmentId, isDemoMode]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/risk-assessments/wizard/${assessmentId}/summary`);
      if (!response.ok) throw new Error('Failed to load summary');

      const result = await response.json();
      setSummary(result);
      onUpdate({ riskSummary: result });
    } catch (err) {
      console.error('Error loading summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Risk Summary</h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 5 of 7: Review risk assessment results</p>
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
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
              <p className="text-sm text-gray-500 mt-3">Loading risk summary...</p>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-sm p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{summary.totalThreats || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Threats</div>
                </div>
                <div className="border border-gray-200 rounded-sm p-4 text-center bg-red-50">
                  <div className="text-2xl font-bold text-red-900">{summary.highRiskCount || 0}</div>
                  <div className="text-xs text-red-700 mt-1">High Risk</div>
                </div>
                <div className="border border-gray-200 rounded-sm p-4 text-center bg-amber-50">
                  <div className="text-2xl font-bold text-amber-900">{summary.mediumRiskCount || 0}</div>
                  <div className="text-xs text-amber-700 mt-1">Medium Risk</div>
                </div>
                <div className="border border-gray-200 rounded-sm p-4 text-center bg-green-50">
                  <div className="text-2xl font-bold text-green-900">{summary.lowRiskCount || 0}</div>
                  <div className="text-xs text-green-700 mt-1">Low Risk</div>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Risk Distribution</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">High</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${((summary.highRiskCount || 0) / (summary.totalThreats || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-gray-600">{summary.highRiskCount || 0}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">Medium</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-amber-500"
                        style={{ width: `${((summary.mediumRiskCount || 0) / (summary.totalThreats || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-gray-600">{summary.mediumRiskCount || 0}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">Low</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${((summary.lowRiskCount || 0) / (summary.totalThreats || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-gray-600">{summary.lowRiskCount || 0}</div>
                  </div>
                </div>
              </div>

              {/* Threshold Analysis */}
              {summary.highRiskCount > 0 && (
                <div className="border border-amber-200 bg-amber-50 rounded-sm p-4">
                  <p className="text-xs text-amber-900">
                    <strong>Action Required:</strong> {summary.highRiskCount} high-risk threat{summary.highRiskCount !== 1 ? 's' : ''} require{summary.highRiskCount === 1 ? 's' : ''} treatment plans in the next step.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No summary data available</p>
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
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800"
          >
            Next: Treatment Plans
          </button>
        </div>
      </div>
    </>
  );
}

