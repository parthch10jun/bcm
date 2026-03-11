'use client';

import { useState } from 'react';
import { ProcessRollupData } from '@/types/department-bia';
import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  ServerIcon,
  BuildingOfficeIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface ProcessRollupReferenceProps {
  rollupData: ProcessRollupData;
  departmentName: string;
  onUseReference?: (field: 'rto' | 'mtpd' | 'criticality', value: any) => void;
}

export default function ProcessRollupReference({ 
  rollupData, 
  departmentName, 
  onUseReference 
}: ProcessRollupReferenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProcessDetails, setShowProcessDetails] = useState(false);

  if (rollupData.processCount === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center text-gray-600">
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">No processes found in {departmentName} for reference data.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Reference Data from Constituent Processes
              </h3>
              <p className="text-xs text-blue-700 mt-1">
                Aggregated from {rollupData.processCount} process{rollupData.processCount !== 1 ? 'es' : ''} in {departmentName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Suggested RTO */}
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Suggested RTO</span>
              </div>
              {onUseReference && (
                <button
                  onClick={() => onUseReference('rto', rollupData.suggestedRTO)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-300 rounded"
                >
                  Use
                </button>
              )}
            </div>
            <div className="text-lg font-bold text-blue-600">{rollupData.suggestedRTO}h</div>
            <div className="text-xs text-gray-600">Worst case from processes</div>
          </div>

          {/* Suggested MTPD */}
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Suggested MTPD</span>
              </div>
              {onUseReference && (
                <button
                  onClick={() => onUseReference('mtpd', rollupData.suggestedMTPD)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-300 rounded"
                >
                  Use
                </button>
              )}
            </div>
            <div className="text-lg font-bold text-orange-600">{rollupData.suggestedMTPD}h</div>
            <div className="text-xs text-gray-600">Maximum from processes</div>
          </div>

          {/* Suggested Criticality */}
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Suggested Criticality</span>
              </div>
              {onUseReference && (
                <button
                  onClick={() => onUseReference('criticality', rollupData.suggestedCriticality)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-300 rounded"
                >
                  Use
                </button>
              )}
            </div>
            <div className="text-sm font-bold text-red-600">{rollupData.suggestedCriticality.tier}</div>
            <div className="text-xs text-gray-600">Score: {rollupData.suggestedCriticality.score}</div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="mt-3 p-3 bg-blue-100 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Reasoning:</strong> {rollupData.suggestedCriticality.reasoning}
          </p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-blue-200">
          {/* Process Breakdown */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-900">Process Breakdown</h4>
              <button
                onClick={() => setShowProcessDetails(!showProcessDetails)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                {showProcessDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>

            {showProcessDetails ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-blue-900">Process</th>
                      <th className="px-3 py-2 text-left font-medium text-blue-900">RTO</th>
                      <th className="px-3 py-2 text-left font-medium text-blue-900">RPO</th>
                      <th className="px-3 py-2 text-left font-medium text-blue-900">Criticality</th>
                      <th className="px-3 py-2 text-left font-medium text-blue-900">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    {rollupData.processBreakdown.map((process) => (
                      <tr key={process.processId}>
                        <td className="px-3 py-2 text-gray-900">{process.processName}</td>
                        <td className="px-3 py-2 text-gray-600">{process.rto}h</td>
                        <td className="px-3 py-2 text-gray-600">{process.rpo}h</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            process.criticality.includes('Tier 1') ? 'bg-red-100 text-red-800' :
                            process.criticality.includes('Tier 2') ? 'bg-orange-100 text-orange-800' :
                            process.criticality.includes('Tier 3') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {process.criticality}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">{process.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rollupData.processBreakdown.slice(0, 6).map((process) => (
                  <div key={process.processId} className="bg-white border border-blue-200 rounded p-2">
                    <div className="text-xs font-medium text-gray-900 truncate">{process.processName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      RTO: {process.rto}h | {process.criticality.split(' ')[0]} {process.criticality.split(' ')[1]}
                    </div>
                  </div>
                ))}
                {rollupData.processBreakdown.length > 6 && (
                  <div className="bg-gray-100 border border-gray-200 rounded p-2 flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      +{rollupData.processBreakdown.length - 6} more processes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Aggregated Dependencies */}
          {(rollupData.aggregatedDependencies.criticalPeople.length > 0 ||
            rollupData.aggregatedDependencies.criticalAssets.length > 0 ||
            rollupData.aggregatedDependencies.criticalVendors.length > 0) && (
            <div className="p-4 border-t border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-3">Aggregated Dependencies (Reference)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Critical People */}
                {rollupData.aggregatedDependencies.criticalPeople.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded p-3">
                    <div className="flex items-center mb-2">
                      <UsersIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-xs font-medium text-gray-900">Critical People</span>
                    </div>
                    <div className="space-y-1">
                      {rollupData.aggregatedDependencies.criticalPeople.slice(0, 3).map((person, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <div className="font-medium">{person.name}</div>
                          <div className="text-gray-500">{person.role} • {person.processSource}</div>
                        </div>
                      ))}
                      {rollupData.aggregatedDependencies.criticalPeople.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{rollupData.aggregatedDependencies.criticalPeople.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Critical Assets */}
                {rollupData.aggregatedDependencies.criticalAssets.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded p-3">
                    <div className="flex items-center mb-2">
                      <ServerIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-xs font-medium text-gray-900">Critical Assets</span>
                    </div>
                    <div className="space-y-1">
                      {rollupData.aggregatedDependencies.criticalAssets.slice(0, 3).map((asset, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-gray-500">{asset.type} • {asset.processSource}</div>
                        </div>
                      ))}
                      {rollupData.aggregatedDependencies.criticalAssets.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{rollupData.aggregatedDependencies.criticalAssets.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Critical Vendors */}
                {rollupData.aggregatedDependencies.criticalVendors.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded p-3">
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-xs font-medium text-gray-900">Critical Vendors</span>
                    </div>
                    <div className="space-y-1">
                      {rollupData.aggregatedDependencies.criticalVendors.slice(0, 3).map((vendor, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-gray-500">{vendor.service} • {vendor.processSource}</div>
                        </div>
                      ))}
                      {rollupData.aggregatedDependencies.criticalVendors.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{rollupData.aggregatedDependencies.criticalVendors.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Note */}
      <div className="p-3 bg-blue-100 border-t border-blue-200 rounded-b-lg">
        <div className="flex items-start">
          <DocumentTextIcon className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <strong>Note:</strong> This data is for reference only. Your Department BIA assessment will take precedence 
            over this aggregated process data in all reports and consolidation views.
          </div>
        </div>
      </div>
    </div>
  );
}
