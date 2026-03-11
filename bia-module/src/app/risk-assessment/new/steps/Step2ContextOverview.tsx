'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Step2Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

// Mock context data for demo mode
const DEMO_CONTEXT_DATA = {
  contextType: 'PROCESS',
  contextName: 'Customer Order Processing',
  biaSummary: {
    mtpd: '24 hours',
    rto: '4 hours',
    rpo: '1 hour',
    criticality: 'HIGH'
  },
  linkedEnabers: [
    { enablerType: 'BUSINESS', enablerName: 'Order Management System', status: 'ACTIVE' },
    { enablerType: 'EQUIPMENT', enablerName: 'Production Line Equipment', status: 'ACTIVE' },
    { enablerType: 'TECHNOLOGY', enablerName: 'SAP ERP System', status: 'ACTIVE' },
    { enablerType: 'HUMAN_RESOURCE', enablerName: 'Operations Team', status: 'ACTIVE' },
    { enablerType: 'THIRD_PARTY', enablerName: 'Logistics Provider', status: 'ACTIVE' },
    { enablerType: 'VITAL_RECORDS', enablerName: 'Order Database', status: 'ACTIVE' }
  ]
};

export default function Step2ContextOverview({ assessmentId, data, onUpdate, onNext, onBack, isDemoMode = false }: Step2Props) {
  const [contextData, setContextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Use mock data in demo mode
      console.log('🎬 Demo Mode: Using mock context data');
      setTimeout(() => {
        setContextData(DEMO_CONTEXT_DATA);
        onUpdate({ contextOverview: DEMO_CONTEXT_DATA });
        setLoading(false);
      }, 500);
    } else if (assessmentId) {
      loadContextOverview();
    }
  }, [assessmentId, isDemoMode]);

  const loadContextOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/risk-assessments/wizard/${assessmentId}/context-overview`);
      if (!response.ok) throw new Error('Failed to load context');

      const result = await response.json();
      setContextData(result);
      onUpdate({ contextOverview: result });
    } catch (err) {
      console.error('Error loading context:', err);
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
            <h1 className="text-xl font-semibold text-gray-900">Context Overview</h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 2 of 7: Review context and linked enablers</p>
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
              <p className="text-sm text-gray-500 mt-3">Loading context overview...</p>
            </div>
          ) : contextData ? (
            <div className="space-y-4">
              {/* Context Summary */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Context Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Context Type:</span>
                    <span className="ml-2 font-medium">{contextData.contextType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Context Name:</span>
                    <span className="ml-2 font-medium">{contextData.contextName}</span>
                  </div>
                </div>
              </div>

              {/* BIA Summary (if available) */}
              {contextData.biaSummary && (
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">BIA Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">MTPD:</span>
                      <span className="ml-2 font-medium">{contextData.biaSummary.mtpd || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">RTO:</span>
                      <span className="ml-2 font-medium">{contextData.biaSummary.rto || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Criticality:</span>
                      <span className="ml-2 font-medium">{contextData.biaSummary.criticality || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Linked Enablers */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Linked Enablers (BETH3V)</h3>
                {contextData.linkedEnabers && contextData.linkedEnabers.length > 0 ? (
                  <div className="space-y-2">
                    {contextData.linkedEnabers.map((enabler: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                            {enabler.enablerType}
                          </span>
                          <span className="font-medium">{enabler.enablerName}</span>
                        </div>
                        {enabler.status && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            enabler.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {enabler.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No linked enablers found for this context.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No context data available</p>
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
            Next: Threat Selection
          </button>
        </div>
      </div>
    </>
  );
}

