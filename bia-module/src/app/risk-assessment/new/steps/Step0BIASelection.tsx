'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon, 
  ArrowRightIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import BIASelector from '@/components/bcm-workflow/BIASelector';
import BIADependenciesPanel from '@/components/bcm-workflow/BIADependenciesPanel';

interface Step0Props {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

export default function Step0BIASelection({ data, onUpdate, onNext, onSkip, onCancel }: Step0Props) {
  const [selectedBia, setSelectedBia] = useState<any>(null);
  const [showDependencies, setShowDependencies] = useState(false);

  const handleBiaSelect = (bia: any) => {
    setSelectedBia(bia);
    if (bia) {
      onUpdate({
        linkedBiaId: bia.id,
        linkedBiaName: bia.biaName,
        biaRtoHours: bia.rtoHours,
        biaRpoHours: bia.rpoHours,
        biaMtdHours: bia.mtdHours,
        biaCriticality: bia.criticality,
        biaBusinessFunction: bia.businessFunction
      });
      setShowDependencies(true);
    } else {
      onUpdate({
        linkedBiaId: null,
        linkedBiaName: null,
        biaRtoHours: null,
        biaRpoHours: null,
        biaMtdHours: null,
        biaCriticality: null,
        biaBusinessFunction: null
      });
      setShowDependencies(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Link to Business Impact Analysis</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a BIA to auto-populate critical activities, RTO/RPO, and dependencies
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: BIA Selection */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium">Why link to a BIA?</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Auto-pull critical activities and recovery objectives</li>
                    <li>View upstream and downstream dependencies</li>
                    <li>Create risks against specific dependencies</li>
                    <li>Maintain traceability across BCM lifecycle</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Select a BIA Record</h3>
              <BIASelector
                selectedBiaId={selectedBia?.id || null}
                onSelect={handleBiaSelect}
                filterApprovedOnly={true}
              />
            </div>
          </div>

          {/* Right: Selected BIA Details & Dependencies */}
          <div className="space-y-4">
            {selectedBia ? (
              <>
                {/* Selected BIA Summary */}
                <div className="border border-green-200 bg-green-50 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="text-sm font-medium text-green-900">Selected BIA</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{selectedBia.biaName}</span>
                    </div>
                    <p className="text-xs text-gray-600">{selectedBia.businessFunction}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-[10px] text-gray-500 uppercase">RTO</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedBia.rtoHours}h</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-[10px] text-gray-500 uppercase">RPO</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedBia.rpoHours}h</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-[10px] text-gray-500 uppercase">MTD</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedBia.mtdHours}h</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-blue-600">
                        <ArrowUpIcon className="h-3 w-3" />
                        {selectedBia.upstreamCount} upstream dependencies
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <ArrowDownIcon className="h-3 w-3" />
                        {selectedBia.downstreamCount} downstream dependencies
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dependencies Panel */}
                {showDependencies && (
                  <div className="max-h-[400px] overflow-y-auto">
                    <BIADependenciesPanel
                      biaId={selectedBia.id}
                      biaName={selectedBia.biaName}
                      showRiskActions={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="border border-gray-200 rounded-sm p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a BIA to view its details and dependencies</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-3">
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
          >
            Skip - Create without BIA link
          </button>
          <button
            onClick={onNext}
            disabled={!selectedBia}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Continue with BIA
            <ArrowRightIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </>
  );
}

