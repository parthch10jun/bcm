'use client';

import { useState } from 'react';
import {
  ServerStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function ITServiceContinuityReport() {
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Mock data for IT Service Continuity Assessment
  const reportData = {
    generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportingPeriod: 'FY 2025 Q4',
    preparedBy: 'ITSCM Team',
    approvedBy: 'Klaus Weber, Head of IT Operations',
    
    executiveSummary: {
      totalServices: 156,
      criticalServices: 42,
      servicesWithDRPlans: 138,
      coverageRate: 88.5,
      rtoComplianceRate: 89.2,
      lastAssessmentDate: '2025-11-15',
      nextReviewDate: '2026-02-15'
    },

    servicesByTier: [
      {
        tier: 'Tier 1',
        name: 'Mission Critical',
        count: 42,
        withDRPlans: 40,
        rtoTarget: '≤ 4 hours',
        rpoTarget: '≤ 1 hour',
        complianceRate: 95.2,
        status: 'success',
        services: [
          { name: 'Core Insurance Platform', owner: 'Michael Schmidt', rto: '2 Hours', rpo: '15 Minutes', lastTested: '2025-11-10', status: 'Compliant' },
          { name: 'Claims Processing System', owner: 'Sarah Johnson', rto: '4 Hours', rpo: '1 Hour', lastTested: '2025-10-25', status: 'Compliant' },
          { name: 'Payment Gateway', owner: 'Tom Harris', rto: '4 Hours', rpo: '1 Hour', lastTested: '2025-11-05', status: 'Compliant' },
          { name: 'Customer Portal', owner: 'Lisa Anderson', rto: '6 Hours', rpo: '2 Hours', lastTested: '2025-09-20', status: 'At Risk' }
        ]
      },
      {
        tier: 'Tier 2',
        name: 'Business Critical',
        count: 58,
        withDRPlans: 52,
        rtoTarget: '≤ 24 hours',
        rpoTarget: '≤ 4 hours',
        complianceRate: 89.7,
        status: 'success',
        services: [
          { name: 'Underwriting System', owner: 'Anna Schmidt', rto: '12 Hours', rpo: '4 Hours', lastTested: '2025-10-15', status: 'Compliant' },
          { name: 'Document Management', owner: 'Peter Mueller', rto: '24 Hours', rpo: '4 Hours', lastTested: '2025-11-01', status: 'Compliant' },
          { name: 'CRM System', owner: 'Emma Weber', rto: '18 Hours', rpo: '6 Hours', lastTested: '2025-08-30', status: 'Review Required' }
        ]
      },
      {
        tier: 'Tier 3',
        name: 'Important',
        count: 38,
        withDRPlans: 32,
        rtoTarget: '≤ 72 hours',
        rpoTarget: '≤ 24 hours',
        complianceRate: 84.2,
        status: 'warning',
        services: [
          { name: 'Reporting & Analytics', owner: 'David Klein', rto: '48 Hours', rpo: '24 Hours', lastTested: '2025-09-10', status: 'Compliant' },
          { name: 'Training Portal', owner: 'Sophie Fischer', rto: '72 Hours', rpo: '24 Hours', lastTested: '2025-07-15', status: 'Test Overdue' }
        ]
      },
      {
        tier: 'Tier 4',
        name: 'Standard',
        count: 18,
        withDRPlans: 14,
        rtoTarget: '≤ 1 week',
        rpoTarget: '≤ 48 hours',
        complianceRate: 77.8,
        status: 'warning',
        services: [
          { name: 'Internal Wiki', owner: 'Martin Becker', rto: '5 Days', rpo: '48 Hours', lastTested: '2025-06-20', status: 'Compliant' }
        ]
      }
    ],

    recoveryStrategies: [
      { strategy: 'Hot Site (Active-Active)', count: 28, percentage: 18.0, avgRTO: '1 Hour', color: 'green' },
      { strategy: 'Warm Site (Active-Passive)', count: 45, percentage: 28.8, avgRTO: '6 Hours', color: 'blue' },
      { strategy: 'Cloud DR', count: 38, percentage: 24.4, avgRTO: '4 Hours', color: 'purple' },
      { strategy: 'Cold Site', count: 18, percentage: 11.5, avgRTO: '24 Hours', color: 'orange' },
      { strategy: 'Manual Workaround', count: 9, percentage: 5.8, avgRTO: '48 Hours', color: 'amber' },
      { strategy: 'No DR Plan', count: 18, percentage: 11.5, avgRTO: 'N/A', color: 'red' }
    ],

    gapsAndRecommendations: [
      {
        id: 1,
        severity: 'High',
        category: 'Coverage Gap',
        finding: '18 IT services (11.5%) do not have documented DR plans',
        impact: 'Potential service disruption without recovery procedures',
        recommendation: 'Develop DR plans for all Tier 1-3 services by Q1 2026',
        owner: 'ITSCM Team',
        dueDate: '2026-03-31'
      },
      {
        id: 2,
        severity: 'Medium',
        category: 'Testing Compliance',
        finding: '12 services have not been tested in the last 6 months',
        impact: 'Unvalidated recovery capabilities may fail during actual incidents',
        recommendation: 'Execute overdue DR tests and establish quarterly testing schedule',
        owner: 'IT Operations',
        dueDate: '2026-01-31'
      },
      {
        id: 3,
        severity: 'Medium',
        category: 'RTO/RPO Alignment',
        finding: '8 services have RTO/RPO targets that exceed business requirements',
        impact: 'Business continuity objectives may not be met',
        recommendation: 'Review and enhance recovery strategies for identified services',
        owner: 'Service Owners',
        dueDate: '2026-02-28'
      },
      {
        id: 4,
        severity: 'Low',
        category: 'Documentation',
        finding: 'DR plan documentation quality varies across services',
        impact: 'Inconsistent recovery execution during incidents',
        recommendation: 'Standardize DR plan templates and conduct documentation review',
        owner: 'ITSCM Team',
        dueDate: '2026-04-30'
      }
    ],

    testingResults: {
      totalTests: 48,
      successful: 42,
      partialSuccess: 4,
      failed: 2,
      successRate: 87.5,
      avgRTOAchieved: '4.8 Hours',
      avgRTOTarget: '6.0 Hours',
      rtoPerformance: 'Exceeding Target'
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'text-red-700 bg-red-50 border-red-200';
      case 'Tier 2': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Tier 3': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Tier 4': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-green-700 bg-green-50 border-green-200';
      case 'At Risk': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Review Required': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Test Overdue': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-700 bg-red-50 border-red-300';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-300';
      case 'Low': return 'text-blue-700 bg-blue-50 border-blue-300';
      default: return 'text-gray-700 bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Report Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-sm">
                <ServerStackIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">IT Service Continuity Assessment Report</h1>
                <p className="text-xs text-gray-600">Comprehensive ITSCM Posture Analysis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Report Metadata */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Generated</p>
              <p className="font-medium text-gray-900">{reportData.generatedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Period</p>
              <p className="font-medium text-gray-900">{reportData.reportingPeriod}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Prepared By</p>
              <p className="font-medium text-gray-900">{reportData.preparedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Approved By</p>
              <p className="font-medium text-gray-900">{reportData.approvedBy}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-blue-600" />
            Executive Summary
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">Total IT Services</p>
              <p className="text-2xl font-bold text-blue-900">{reportData.executiveSummary.totalServices}</p>
              <p className="text-[10px] text-blue-700 mt-1">{reportData.executiveSummary.criticalServices} Critical (Tier 1)</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-sm p-4">
              <p className="text-xs text-green-600 font-medium mb-1">DR Plan Coverage</p>
              <p className="text-2xl font-bold text-green-900">{reportData.executiveSummary.coverageRate}%</p>
              <p className="text-[10px] text-green-700 mt-1">{reportData.executiveSummary.servicesWithDRPlans} of {reportData.executiveSummary.totalServices} services</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
              <p className="text-xs text-purple-600 font-medium mb-1">RTO Compliance</p>
              <p className="text-2xl font-bold text-purple-900">{reportData.executiveSummary.rtoComplianceRate}%</p>
              <p className="text-[10px] text-purple-700 mt-1">Meeting business requirements</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
              <p className="text-xs text-amber-600 font-medium mb-1">Next Review</p>
              <p className="text-sm font-bold text-amber-900">{reportData.executiveSummary.nextReviewDate}</p>
              <p className="text-[10px] text-amber-700 mt-1">Quarterly assessment cycle</p>
            </div>
          </div>
        </section>

        {/* Service Tier Analysis */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ServerStackIcon className="h-4 w-4 text-blue-600" />
              IT Service Analysis by Criticality Tier
            </h2>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-1.5 bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Tiers</option>
              <option value="Tier 1">Tier 1 Only</option>
              <option value="Tier 2">Tier 2 Only</option>
              <option value="Tier 3">Tier 3 Only</option>
              <option value="Tier 4">Tier 4 Only</option>
            </select>
          </div>

          <div className="space-y-4">
            {reportData.servicesByTier
              .filter(tierData => selectedTier === 'all' || tierData.tier === selectedTier)
              .map((tierData) => (
                <div key={tierData.tier} className="border border-gray-200 rounded-sm overflow-hidden">
                  {/* Tier Header */}
                  <div className={`px-4 py-3 ${getTierColor(tierData.tier)} border-b border-gray-200`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-semibold">{tierData.tier}: {tierData.name}</h3>
                        <p className="text-[10px] mt-0.5">RTO Target: {tierData.rtoTarget} | RPO Target: {tierData.rpoTarget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">{tierData.count} Services</p>
                        <p className="text-[10px]">{tierData.withDRPlans} with DR Plans ({tierData.complianceRate}%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">RTO</th>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">RPO</th>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Tested</th>
                          <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tierData.services.map((service, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-xs text-gray-900">{service.name}</td>
                            <td className="px-4 py-2 text-xs text-gray-700">{service.owner}</td>
                            <td className="px-4 py-2 text-xs text-gray-700">{service.rto}</td>
                            <td className="px-4 py-2 text-xs text-gray-700">{service.rpo}</td>
                            <td className="px-4 py-2 text-xs text-gray-700">{service.lastTested}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(service.status)}`}>
                                {service.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Recovery Strategies Distribution */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CogIcon className="h-4 w-4 text-blue-600" />
            Recovery Strategy Distribution
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {reportData.recoveryStrategies.map((strategy) => (
              <div key={strategy.strategy} className="border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-900">{strategy.strategy}</p>
                  <span className={`text-xs font-bold text-${strategy.color}-600`}>{strategy.count}</span>
                </div>
                <div className="mb-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${strategy.color}-500`}
                      style={{ width: `${strategy.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span>{strategy.percentage}% of services</span>
                  <span>Avg RTO: {strategy.avgRTO}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testing Results */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BeakerIcon className="h-4 w-4 text-blue-600" />
            DR Testing Results Summary
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-sm p-4">
              <p className="text-xs text-gray-600 mb-1">Total Tests Conducted</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.testingResults.totalTests}</p>
            </div>
            <div className="border border-green-200 bg-green-50 rounded-sm p-4">
              <p className="text-xs text-green-700 mb-1">Successful</p>
              <p className="text-2xl font-bold text-green-900">{reportData.testingResults.successful}</p>
            </div>
            <div className="border border-amber-200 bg-amber-50 rounded-sm p-4">
              <p className="text-xs text-amber-700 mb-1">Partial Success</p>
              <p className="text-2xl font-bold text-amber-900">{reportData.testingResults.partialSuccess}</p>
            </div>
            <div className="border border-red-200 bg-red-50 rounded-sm p-4">
              <p className="text-xs text-red-700 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-900">{reportData.testingResults.failed}</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-sm p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-blue-600 mb-1">Success Rate</p>
                <p className="text-xl font-bold text-blue-900">{reportData.testingResults.successRate}%</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1">Avg RTO Achieved</p>
                <p className="text-xl font-bold text-blue-900">{reportData.testingResults.avgRTOAchieved}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1">Performance vs Target</p>
                <p className="text-xl font-bold text-green-900">{reportData.testingResults.rtoPerformance}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gaps and Recommendations */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
            Gaps, Findings & Recommendations
          </h2>
          <div className="space-y-3">
            {reportData.gapsAndRecommendations.map((item) => (
              <div key={item.id} className={`border-l-4 rounded-sm p-4 ${getSeverityColor(item.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className="text-xs font-semibold text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600">Owner: {item.owner}</p>
                    <p className="text-[10px] text-gray-600">Due: {item.dueDate}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Finding:</p>
                    <p className="text-xs text-gray-900">{item.finding}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Impact:</p>
                    <p className="text-xs text-gray-700">{item.impact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Recommendation:</p>
                    <p className="text-xs font-medium text-gray-900">{item.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ISO 27001 Compliance Statement */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-2">ISO 27001:2022 Annex A.17 Compliance</h3>
              <p className="text-xs text-gray-700 mb-2">
                This IT Service Continuity Assessment aligns with ISO 27001:2022 Annex A.17 (Information Security Aspects of Business Continuity Management) requirements:
              </p>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>A.17.1.1:</strong> Planning information security continuity - IT service dependencies documented and recovery strategies defined</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>A.17.1.2:</strong> Implementing information security continuity - DR plans established for critical IT services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>A.17.1.3:</strong> Verify, review and evaluate - Regular DR testing conducted with {reportData.testingResults.successRate}% success rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>A.17.2.1:</strong> Availability of information processing facilities - {reportData.executiveSummary.coverageRate}% of IT services have documented recovery capabilities</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Report Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2025 Allianz IT Service Continuity Management | Confidential</p>
            <p>Page 1 of 1 | Generated: {reportData.generatedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

