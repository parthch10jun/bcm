'use client';

import { useState, useMemo } from 'react';
import { useOrganizationalChart } from '@/contexts/OrganizationalChartContext';
import { 
  BIAReconciliationEngine, 
  BIAReconciliationResult, 
  BIARecord 
} from '@/types/bia-reconciliation';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CogIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface BIAReconciliationDashboardProps {
  biaRecords: BIARecord[];
  onReconciliationUpdate?: (result: BIAReconciliationResult) => void;
}

export default function BIAReconciliationDashboard({ 
  biaRecords, 
  onReconciliationUpdate 
}: BIAReconciliationDashboardProps) {
  const { nodes, edges } = useOrganizationalChart();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Calculate reconciliation results for all departments
  const reconciliationResults = useMemo(() => {
    const results: BIAReconciliationResult[] = [];
    
    // Get all department and subdepartment nodes
    const departmentNodes = nodes.filter(node => 
      node.type === 'department' || node.type === 'subdepartment'
    );
    
    departmentNodes.forEach(node => {
      // Find department BIA for this node
      const departmentBIA = biaRecords.find(bia => 
        bia.type === 'department' && 
        bia.departmentScope?.nodeId === node.id
      );
      
      // Find process BIAs that belong to this department
      const processBIAs = biaRecords.filter(bia => 
        bia.type === 'process' && 
        bia.orgNodeId === node.id
      );
      
      if (departmentBIA || processBIAs.length > 0) {
        try {
          const result = BIAReconciliationEngine.reconcileDepartmentBIA(
            node.id,
            departmentBIA || null,
            processBIAs,
            { nodes, edges }
          );
          results.push(result);
        } catch (error) {
          console.error(`Error reconciling department ${node.id}:`, error);
        }
      }
    });
    
    return results;
  }, [nodes, edges, biaRecords]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalDepartments = reconciliationResults.length;
    const departmentsWithConflicts = reconciliationResults.filter(r => r.reconciliation.hasConflict).length;
    const departmentsWithBothSources = reconciliationResults.filter(r => 
      r.directDepartmentBIA && r.aggregatedFromProcesses.processCount > 0
    ).length;
    const departmentsWithOnlyProcesses = reconciliationResults.filter(r => 
      !r.directDepartmentBIA && r.aggregatedFromProcesses.processCount > 0
    ).length;
    const departmentsWithOnlyDeptBIA = reconciliationResults.filter(r => 
      r.directDepartmentBIA && r.aggregatedFromProcesses.processCount === 0
    ).length;

    return {
      totalDepartments,
      departmentsWithConflicts,
      departmentsWithBothSources,
      departmentsWithOnlyProcesses,
      departmentsWithOnlyDeptBIA,
      conflictRate: totalDepartments > 0 ? Math.round((departmentsWithConflicts / totalDepartments) * 100) : 0
    };
  }, [reconciliationResults]);

  const getConflictSeverityColor = (result: BIAReconciliationResult) => {
    if (!result.reconciliation.hasConflict) return 'text-green-600 bg-green-50 border-green-200';
    
    switch (result.reconciliation.confidenceLevel) {
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAuthoritativeSourceIcon = (source: string) => {
    switch (source) {
      case 'department-bia': return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'aggregated-processes': return <CogIcon className="h-4 w-4" />;
      case 'hybrid': return <ArrowPathIcon className="h-4 w-4" />;
      default: return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const handleReconciliationAction = (result: BIAReconciliationResult, action: string) => {
    // Handle different reconciliation actions
    switch (action) {
      case 'accept-department':
        // Accept department BIA as authoritative
        break;
      case 'accept-aggregated':
        // Accept aggregated process BIAs as authoritative
        break;
      case 'create-hybrid':
        // Create hybrid reconciliation
        break;
      case 'flag-for-review':
        // Flag for manual review
        break;
    }
    
    if (onReconciliationUpdate) {
      onReconciliationUpdate(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">BIA Reconciliation Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Analyze and reconcile differences between Department Level BIA and aggregated Process BIA data.
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{summaryStats.totalDepartments}</div>
            <div className="text-sm text-blue-700">Total Departments</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{summaryStats.departmentsWithConflicts}</div>
            <div className="text-sm text-red-700">With Conflicts</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{summaryStats.departmentsWithBothSources}</div>
            <div className="text-sm text-green-700">Both Sources</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{summaryStats.departmentsWithOnlyProcesses}</div>
            <div className="text-sm text-yellow-700">Process BIA Only</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{summaryStats.conflictRate}%</div>
            <div className="text-sm text-purple-700">Conflict Rate</div>
          </div>
        </div>
      </div>

      {/* Reconciliation Results Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Department Reconciliation Results</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Sources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conflict Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Authoritative Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective RTO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reconciliationResults.map((result) => (
                <tr key={result.departmentNodeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.departmentName}</div>
                      <div className="text-xs text-gray-500">{result.departmentPath}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {result.directDepartmentBIA && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                          Dept BIA
                        </span>
                      )}
                      {result.aggregatedFromProcesses.processCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CogIcon className="h-3 w-3 mr-1" />
                          {result.aggregatedFromProcesses.processCount} Processes
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getConflictSeverityColor(result)}`}>
                      {result.reconciliation.hasConflict ? (
                        <>
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          {result.reconciliation.conflictType?.replace('-', ' ').toUpperCase()}
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          No Conflicts
                        </>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      {getAuthoritativeSourceIcon(result.authoritativeSource)}
                      <span className="ml-2 capitalize">
                        {result.authoritativeSource.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.effectiveMetrics.rto}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.effectiveMetrics.criticality}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDetails(showDetails === result.departmentNodeId ? null : result.departmentNodeId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {result.reconciliation.hasConflict && (
                        <button
                          onClick={() => handleReconciliationAction(result, 'flag-for-review')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {(() => {
            const result = reconciliationResults.find(r => r.departmentNodeId === showDetails);
            if (!result) return null;

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detailed Analysis: {result.departmentName}
                  </h3>
                  <button
                    onClick={() => setShowDetails(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Department BIA Data */}
                  {result.directDepartmentBIA && (
                    <div className="border border-blue-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-blue-900 mb-3">Department Level BIA</h4>
                      <div className="space-y-2 text-sm">
                        <div>RTO: <span className="font-medium">{result.directDepartmentBIA.rto}h</span></div>
                        <div>RPO: <span className="font-medium">{result.directDepartmentBIA.rpo}h</span></div>
                        <div>Criticality: <span className="font-medium">{result.directDepartmentBIA.criticality.tier}</span></div>
                        <div>Status: <span className="font-medium">{result.directDepartmentBIA.status}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Aggregated Process Data */}
                  {result.aggregatedFromProcesses.processCount > 0 && (
                    <div className="border border-green-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-green-900 mb-3">
                        Aggregated from {result.aggregatedFromProcesses.processCount} Processes
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>Worst Case RTO: <span className="font-medium">{result.aggregatedFromProcesses.aggregatedMetrics.worstCaseRTO}h</span></div>
                        <div>Average RTO: <span className="font-medium">{result.aggregatedFromProcesses.aggregatedMetrics.averageRTO}h</span></div>
                        <div>Highest Criticality: <span className="font-medium">{result.aggregatedFromProcesses.aggregatedMetrics.highestCriticality}</span></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conflicts and Recommendations */}
                {result.reconciliation.hasConflict && (
                  <div className="border border-red-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-red-900 mb-3">Conflicts & Recommendations</h4>
                    
                    {result.reconciliation.conflictDetails && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Identified Conflicts:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                          {result.reconciliation.conflictDetails.map((conflict, index) => (
                            <li key={index}>{conflict}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.reconciliation.recommendations && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                          {result.reconciliation.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Effective Metrics */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Effective Metrics (Authoritative)</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">RTO:</span>
                      <span className="ml-2 font-medium">{result.effectiveMetrics.rto}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Criticality:</span>
                      <span className="ml-2 font-medium">{result.effectiveMetrics.criticality}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    <strong>Justification:</strong> {result.effectiveMetrics.justification}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
