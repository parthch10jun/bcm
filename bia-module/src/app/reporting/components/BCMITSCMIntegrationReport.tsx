'use client';

import {
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function BCMITSCMIntegrationReport() {
  const reportData = {
    generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportingPeriod: 'FY 2025 Q4',
    
    integrationMetrics: {
      totalBusinessProcesses: 124,
      processesWithITDependencies: 98,
      itDependencyRate: 79.0,
      totalITServices: 156,
      servicesLinkedToBCPs: 138,
      bcpLinkageRate: 88.5,
      endToEndCoverage: 84.2
    },

    alignmentMatrix: [
      {
        businessProcess: 'Claims Processing',
        criticality: 'Tier 1',
        rto: '4 Hours',
        rpo: '1 Hour',
        itServices: ['Claims Management System', 'Oracle Database', 'Document Storage'],
        drPlansCount: 3,
        alignmentStatus: 'Fully Aligned',
        lastValidated: '2025-11-10',
        status: 'success'
      },
      {
        businessProcess: 'Policy Underwriting',
        criticality: 'Tier 2',
        rto: '12 Hours',
        rpo: '4 Hours',
        itServices: ['Underwriting System', 'Risk Assessment Engine'],
        drPlansCount: 2,
        alignmentStatus: 'Fully Aligned',
        lastValidated: '2025-10-25',
        status: 'success'
      },
      {
        businessProcess: 'Customer Service',
        criticality: 'Tier 2',
        rto: '8 Hours',
        rpo: '4 Hours',
        itServices: ['Customer Portal', 'CRM System', 'Call Center Platform'],
        drPlansCount: 2,
        alignmentStatus: 'Partial Alignment',
        lastValidated: '2025-09-15',
        status: 'warning'
      },
      {
        businessProcess: 'Premium Collection',
        criticality: 'Tier 1',
        rto: '4 Hours',
        rpo: '1 Hour',
        itServices: ['Payment Gateway', 'Banking Integration'],
        drPlansCount: 2,
        alignmentStatus: 'Fully Aligned',
        lastValidated: '2025-11-05',
        status: 'success'
      },
      {
        businessProcess: 'Financial Reporting',
        criticality: 'Tier 3',
        rto: '48 Hours',
        rpo: '24 Hours',
        itServices: ['Reporting & Analytics', 'Data Warehouse'],
        drPlansCount: 1,
        alignmentStatus: 'Gap Identified',
        lastValidated: '2025-08-20',
        status: 'danger'
      }
    ],

    dependencyMapping: {
      tier1Processes: {
        count: 32,
        withFullITCoverage: 28,
        coverageRate: 87.5,
        avgITServicesPerProcess: 3.2
      },
      tier2Processes: {
        count: 48,
        withFullITCoverage: 40,
        coverageRate: 83.3,
        avgITServicesPerProcess: 2.8
      },
      tier3Processes: {
        count: 28,
        withFullITCoverage: 20,
        coverageRate: 71.4,
        avgITServicesPerProcess: 2.1
      },
      tier4Processes: {
        count: 16,
        withFullITCoverage: 10,
        coverageRate: 62.5,
        avgITServicesPerProcess: 1.5
      }
    },

    rtoRpoAlignment: [
      {
        tier: 'Tier 1',
        businessRTO: '≤ 4 hours',
        businessRPO: '≤ 1 hour',
        itRTO: '≤ 4 hours',
        itRPO: '≤ 1 hour',
        alignmentScore: 95,
        gaps: 2,
        status: 'success'
      },
      {
        tier: 'Tier 2',
        businessRTO: '≤ 24 hours',
        businessRPO: '≤ 4 hours',
        itRTO: '≤ 24 hours',
        itRPO: '≤ 4 hours',
        alignmentScore: 88,
        gaps: 6,
        status: 'success'
      },
      {
        tier: 'Tier 3',
        businessRTO: '≤ 72 hours',
        businessRPO: '≤ 24 hours',
        itRTO: '≤ 72 hours',
        itRPO: '≤ 24 hours',
        alignmentScore: 76,
        gaps: 8,
        status: 'warning'
      },
      {
        tier: 'Tier 4',
        businessRTO: '≤ 1 week',
        businessRPO: '≤ 48 hours',
        itRTO: '≤ 1 week',
        itRPO: '≤ 48 hours',
        alignmentScore: 68,
        gaps: 6,
        status: 'warning'
      }
    ],

    integrationWorkflow: [
      {
        stage: 'BIA Completion',
        bcmOutput: 'Business RTO/RPO Requirements',
        itscmInput: 'IT Service Continuity Requirements',
        dataQuality: 95,
        status: 'success'
      },
      {
        stage: 'Risk Assessment',
        bcmOutput: 'Business Risk Scenarios',
        itscmInput: 'IT Threat & Vulnerability Analysis',
        dataQuality: 92,
        status: 'success'
      },
      {
        stage: 'Strategy Development',
        bcmOutput: 'Business Recovery Strategies',
        itscmInput: 'IT Recovery Strategy Selection',
        dataQuality: 88,
        status: 'success'
      },
      {
        stage: 'Plan Creation',
        bcmOutput: 'Business Continuity Plans',
        itscmInput: 'IT DR Plan Requirements',
        dataQuality: 85,
        status: 'warning'
      },
      {
        stage: 'Testing & Validation',
        bcmOutput: 'BCP Test Results',
        itscmInput: 'IT DR Test Scenarios',
        dataQuality: 78,
        status: 'warning'
      }
    ],

    keyBenefits: [
      {
        benefit: 'Reduced Planning Time',
        description: 'Automated data flow from BIA to IT DR plans eliminates manual re-entry',
        impact: '40% reduction in planning cycle time',
        quantified: '120 hours saved per quarter'
      },
      {
        benefit: 'Improved Accuracy',
        description: 'Single source of truth ensures consistency between BCM and ITSCM',
        impact: '85% reduction in data discrepancies',
        quantified: '95% data quality score'
      },
      {
        benefit: 'Enhanced Visibility',
        description: 'End-to-end traceability from business processes to IT recovery plans',
        impact: 'Real-time alignment monitoring',
        quantified: '100% visibility into dependencies'
      },
      {
        benefit: 'Faster Recovery',
        description: 'Integrated testing validates both business and IT recovery capabilities',
        impact: 'RTO performance exceeding targets',
        quantified: '4.8 hours avg vs 6.0 hours target'
      }
    ],

    gaps: [
      {
        id: 1,
        area: 'Testing Integration',
        finding: 'BCM and ITSCM tests are not fully coordinated',
        impact: 'Potential gaps in end-to-end recovery validation',
        recommendation: 'Implement integrated test scenarios combining business and IT recovery',
        priority: 'High'
      },
      {
        id: 2,
        area: 'Vendor Dependencies',
        finding: '22% of critical IT services rely on third-party vendors without documented continuity agreements',
        impact: 'External dependencies may not meet business RTO/RPO requirements',
        recommendation: 'Establish vendor continuity agreements and integrate into ITSCM plans',
        priority: 'High'
      },
      {
        id: 3,
        area: 'Data Quality',
        finding: 'Some BIA records lack detailed IT dependency information',
        impact: 'Incomplete IT service continuity planning',
        recommendation: 'Enhance BIA template to capture comprehensive IT dependencies',
        priority: 'Medium'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-700 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'danger': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getAlignmentColor = (status: string) => {
    switch (status) {
      case 'Fully Aligned': return 'text-green-700 bg-green-50 border-green-300';
      case 'Partial Alignment': return 'text-amber-700 bg-amber-50 border-amber-300';
      case 'Gap Identified': return 'text-red-700 bg-red-50 border-red-300';
      default: return 'text-gray-700 bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Report Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-sm">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">BCM-ITSCM Integration Report</h1>
                <p className="text-xs text-gray-600">End-to-End Business Continuity & IT Service Continuity Alignment Analysis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-purple-600 rounded-sm hover:bg-purple-700">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Report Metadata */}
        <div className="mt-4 flex items-center gap-6 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-medium">Generated:</span>
            <span>{reportData.generatedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Period:</span>
            <span>{reportData.reportingPeriod}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-purple-600" />
            <span className="font-medium">ISO 22301 & ISO 27001 Aligned</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-purple-600" />
            Integration Metrics Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                <p className="text-xs text-blue-700 font-medium">Business Process Coverage</p>
              </div>
              <p className="text-2xl font-bold text-blue-900 mb-1">{reportData.integrationMetrics.itDependencyRate}%</p>
              <p className="text-[10px] text-blue-700">{reportData.integrationMetrics.processesWithITDependencies} of {reportData.integrationMetrics.totalBusinessProcesses} processes have IT dependencies mapped</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <ServerStackIcon className="h-5 w-5 text-purple-600" />
                <p className="text-xs text-purple-700 font-medium">IT Service Linkage</p>
              </div>
              <p className="text-2xl font-bold text-purple-900 mb-1">{reportData.integrationMetrics.bcpLinkageRate}%</p>
              <p className="text-[10px] text-purple-700">{reportData.integrationMetrics.servicesLinkedToBCPs} of {reportData.integrationMetrics.totalITServices} IT services linked to BCPs</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-xs text-green-700 font-medium">End-to-End Coverage</p>
              </div>
              <p className="text-2xl font-bold text-green-900 mb-1">{reportData.integrationMetrics.endToEndCoverage}%</p>
              <p className="text-[10px] text-green-700">Complete BCM → ITSCM traceability achieved</p>
            </div>
          </div>
        </section>

        {/* Business Process to IT Service Alignment Matrix */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-purple-600" />
            Business Process → IT Service Alignment Matrix
          </h2>
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Business Process</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Criticality</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Business RTO/RPO</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Supporting IT Services</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">DR Plans</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Alignment Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Validated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.alignmentMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{row.businessProcess}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                        row.criticality === 'Tier 1' ? 'text-red-700 bg-red-50 border-red-200' :
                        row.criticality === 'Tier 2' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                        'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {row.criticality}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div>RTO: {row.rto}</div>
                      <div className="text-[10px] text-gray-500">RPO: {row.rpo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {row.itServices.map((service, sidx) => (
                          <div key={sidx} className="text-[10px] text-gray-700 flex items-center gap-1">
                            <ServerStackIcon className="h-3 w-3 text-gray-400" />
                            {service}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                        {row.drPlansCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getAlignmentColor(row.alignmentStatus)}`}>
                        {row.alignmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">{row.lastValidated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RTO/RPO Alignment by Tier */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowPathIcon className="h-4 w-4 text-purple-600" />
            RTO/RPO Alignment Analysis by Criticality Tier
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {reportData.rtoRpoAlignment.map((tier) => (
              <div key={tier.tier} className={`border-2 rounded-sm p-4 ${getStatusColor(tier.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-900">{tier.tier}</h3>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{tier.alignmentScore}%</p>
                    <p className="text-[10px] text-gray-600">Alignment Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-600 mb-1">Business Requirements</p>
                    <p className="text-xs font-medium text-gray-900">RTO: {tier.businessRTO}</p>
                    <p className="text-xs font-medium text-gray-900">RPO: {tier.businessRPO}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 mb-1">IT Capabilities</p>
                    <p className="text-xs font-medium text-gray-900">RTO: {tier.itRTO}</p>
                    <p className="text-xs font-medium text-gray-900">RPO: {tier.itRPO}</p>
                  </div>
                </div>
                {tier.gaps > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
                    <span className="text-gray-700">{tier.gaps} services with alignment gaps</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Integration Workflow */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowPathIcon className="h-4 w-4 text-purple-600" />
            BCM → ITSCM Data Flow
          </h2>
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Lifecycle Stage</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">BCM Output</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ITSCM Input</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Data Quality</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.integrationWorkflow.map((stage, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{stage.stage}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{stage.bcmOutput}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{stage.itscmInput}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stage.dataQuality >= 90 ? 'bg-green-500' : stage.dataQuality >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${stage.dataQuality}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{stage.dataQuality}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(stage.status)}`}>
                        {stage.status === 'success' ? 'Operational' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Benefits */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            Key Benefits of BCM-ITSCM Integration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {reportData.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">{benefit.benefit}</h3>
                <p className="text-xs text-gray-700 mb-3">{benefit.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-[10px] font-medium text-green-700">{benefit.impact}</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-sm px-2 py-1">
                    <p className="text-[10px] font-bold text-green-900">{benefit.quantified}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gaps and Recommendations */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
            Integration Gaps & Recommendations
          </h2>
          <div className="space-y-3">
            {reportData.gaps.map((gap) => (
              <div key={gap.id} className={`border-l-4 rounded-sm p-4 ${
                gap.priority === 'High' ? 'border-red-500 bg-red-50' :
                gap.priority === 'Medium' ? 'border-amber-500 bg-amber-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border ${
                      gap.priority === 'High' ? 'text-red-700 bg-red-100 border-red-300' :
                      gap.priority === 'Medium' ? 'text-amber-700 bg-amber-100 border-amber-300' :
                      'text-blue-700 bg-blue-100 border-blue-300'
                    }`}>
                      {gap.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-gray-900">{gap.area}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Finding:</p>
                    <p className="text-xs text-gray-900">{gap.finding}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Impact:</p>
                    <p className="text-xs text-gray-700">{gap.impact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">Recommendation:</p>
                    <p className="text-xs font-medium text-gray-900">{gap.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ISO Compliance Statement */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-2">ISO 22301 & ISO 27001 Alignment</h3>
              <p className="text-xs text-gray-700 mb-2">
                This BCM-ITSCM Integration Report demonstrates compliance with:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">ISO 22301:2019 (BCM)</p>
                  <ul className="text-xs text-gray-700 space-y-0.5 ml-4">
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clause 8.2: Business Impact Analysis</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clause 8.3: Business Continuity Strategy</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clause 8.4: Business Continuity Plans</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">ISO 27001:2022 (ISMS)</p>
                  <ul className="text-xs text-gray-700 space-y-0.5 ml-4">
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Annex A.17.1: IT Service Continuity</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Annex A.17.2: Redundancies</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircleIcon className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Integrated BCM-ISMS approach</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2025 Allianz Business Continuity & IT Service Continuity Management | Confidential</p>
            <p>Page 1 of 1 | Generated: {reportData.generatedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

