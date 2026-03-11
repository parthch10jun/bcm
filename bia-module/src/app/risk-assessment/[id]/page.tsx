'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  ServerIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { riskAssessmentService, threatAssessmentService, treatmentPlanService, TreatmentPlan } from '@/services/riskAssessmentService';
import { RiskAssessment, ThreatAssessment } from '@/types/risk-assessment';
import AuditTrail from '../components/AuditTrail';

export default function RiskAssessmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [threats, setThreats] = useState<ThreatAssessment[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentData, threatsData, plansData] = await Promise.all([
        riskAssessmentService.getById(parseInt(id)),
        threatAssessmentService.getByRiskAssessment(parseInt(id)),
        treatmentPlanService.getByRiskAssessment(parseInt(id))
      ]);
      setAssessment(assessmentData);
      setThreats(threatsData);
      setTreatmentPlans(plansData);
    } catch (err) {
      console.error('Error loading risk assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'DRAFT':
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateRiskDistribution = () => {
    const distribution = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    threats.forEach(threat => {
      const level = threat.riskLevel?.toUpperCase();
      if (level && level in distribution) {
        distribution[level as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading risk assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Risk assessment not found</p>
          <button
            onClick={() => router.push('/risk-assessment')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-sm hover:bg-gray-800"
          >
            Back to Risk Assessments
          </button>
        </div>
      </div>
    );
  }

  const riskDistribution = calculateRiskDistribution();
  const totalThreats = threats.length;
  const assessedThreats = threats.filter(t => t.isSelected).length;
  const highRisks = riskDistribution.CRITICAL + riskDistribution.HIGH;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/risk-assessment')}
                className="p-2 hover:bg-gray-100 rounded-sm"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assessment.assessmentName}</h1>
                <p className="text-sm text-gray-600 mt-1">Risk Assessment Report</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(assessment.status)}
                <span className="text-sm font-medium">{assessment.status}</span>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{totalThreats}</div>
            <div className="text-xs text-gray-500 mt-1">Total Threats</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{assessedThreats}</div>
            <div className="text-xs text-gray-500 mt-1">Assessed Threats</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{highRisks}</div>
            <div className="text-xs text-gray-500 mt-1">High/Critical Risks</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{assessment.riskThreshold || 12}</div>
            <div className="text-xs text-gray-500 mt-1">Risk Threshold</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
                { id: 'context', name: 'Context', icon: ServerIcon },
                { id: 'threats', name: 'Threat Assessment', icon: ExclamationTriangleIcon },
                { id: 'treatment', name: 'Treatment Plans', icon: ShieldCheckIcon },
                { id: 'summary', name: 'Executive Summary', icon: ChartBarIcon },
                { id: 'audit', name: 'Audit Trail', icon: ClipboardDocumentListIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-2 border-b-2 font-medium text-xs flex items-center`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessment Overview</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Assessment Name</label>
                    <p className="text-sm text-gray-900">{assessment.assessmentName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Assessment Date</label>
                    <p className="text-sm text-gray-900">{new Date(assessment.assessmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Assessor</label>
                    <p className="text-sm text-gray-900">{assessment.assessor || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Reviewer</label>
                    <p className="text-sm text-gray-900">{assessment.reviewer || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Context Type</label>
                    <p className="text-sm text-gray-900">{assessment.contextType}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Context Object</label>
                    <p className="text-sm text-gray-900">{assessment.contextName}</p>
                  </div>
                </div>

                {assessment.assessmentDescription && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-sm text-gray-900">{assessment.assessmentDescription}</p>
                  </div>
                )}

                {/* Risk Distribution Chart */}
                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Risk Distribution</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="border border-red-200 bg-red-50 rounded-sm p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{riskDistribution.CRITICAL}</div>
                      <div className="text-xs text-red-700 mt-1">Critical</div>
                    </div>
                    <div className="border border-orange-200 bg-orange-50 rounded-sm p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{riskDistribution.HIGH}</div>
                      <div className="text-xs text-orange-700 mt-1">High</div>
                    </div>
                    <div className="border border-yellow-200 bg-yellow-50 rounded-sm p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{riskDistribution.MEDIUM}</div>
                      <div className="text-xs text-yellow-700 mt-1">Medium</div>
                    </div>
                    <div className="border border-green-200 bg-green-50 rounded-sm p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{riskDistribution.LOW}</div>
                      <div className="text-xs text-green-700 mt-1">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Context Information</h3>
                <div className="border border-gray-200 rounded-sm p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Context Type</label>
                      <p className="text-sm text-gray-900">{assessment.contextType}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Context Name</label>
                      <p className="text-sm text-gray-900">{assessment.contextName}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-600">
                      This risk assessment evaluates threats and vulnerabilities specific to the {assessment.contextType.toLowerCase()} context.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'threats' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Threat Assessment Details</h3>

                {threats.length === 0 ? (
                  <div className="text-center py-12 border border-gray-200 rounded-sm">
                    <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">No threats assessed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threats.filter(t => t.isSelected).map((threat) => (
                      <div key={threat.id} className="border border-gray-200 rounded-sm p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{threat.threat?.name || 'Unknown Threat'}</h4>
                            {threat.threat?.description && (
                              <p className="text-xs text-gray-600 mt-1">{threat.threat.description}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-sm text-xs font-medium border ${getRiskLevelColor(threat.riskLevel)}`}>
                            {threat.riskLevel}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <div className="text-xs text-gray-600 mb-1">Likelihood</div>
                            <div className="text-sm font-semibold text-gray-900">{threat.likelihoodLevel || 'Not Set'}</div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <div className="text-xs text-gray-600 mb-1">Impact</div>
                            <div className="text-sm font-semibold text-gray-900">{threat.impactLevel || 'Not Set'}</div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <div className="text-xs text-gray-600 mb-1">Risk Score</div>
                            <div className="text-sm font-semibold text-gray-900">{threat.riskScore || 0}</div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <div className="text-xs text-gray-600 mb-1">Risk Level</div>
                            <div className="text-sm font-semibold text-gray-900">{threat.riskLevel || 'N/A'}</div>
                          </div>
                        </div>

                        {threat.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                            <p className="text-xs text-gray-600">{threat.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'treatment' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Treatment Plans</h3>

                {treatmentPlans.length === 0 ? (
                  <div className="text-center py-12 border border-gray-200 rounded-sm">
                    <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">No treatment plans defined</p>
                    <p className="text-xs text-gray-500 mt-2">Treatment plans help mitigate identified risks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treatmentPlans.map((plan) => (
                      <div key={plan.id} className="border border-gray-200 rounded-sm p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{plan.threatName}</h4>
                            <p className="text-xs text-gray-600 mt-1">Treatment Option: <span className="font-medium">{plan.treatmentOption}</span></p>
                          </div>
                          <span className={`px-2 py-1 rounded-sm text-xs font-medium border ${
                            plan.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                            plan.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            plan.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {plan.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Action Description</label>
                            <p className="text-xs text-gray-900">{plan.actionDescription}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Action Owner</label>
                              <p className="text-xs text-gray-900">{plan.actionOwner}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Target Date</label>
                              <p className="text-xs text-gray-900">{new Date(plan.targetDate).toLocaleDateString()}</p>
                            </div>
                            {plan.completionDate && (
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Completion Date</label>
                                <p className="text-xs text-gray-900">{new Date(plan.completionDate).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>

                          {plan.effectivenessReview && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Effectiveness Review</label>
                              <p className="text-xs text-gray-900">{plan.effectivenessReview}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Executive Summary</h3>

                {/* Assessment Summary */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Assessment Summary</h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      This risk assessment for <strong>{assessment.contextName}</strong> ({assessment.contextType})
                      was conducted on {new Date(assessment.assessmentDate).toLocaleDateString()} by {assessment.assessor || 'Unknown'}.
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed mt-3">
                      A total of <strong>{totalThreats} threats</strong> were identified, of which <strong>{assessedThreats} were assessed</strong>.
                      The assessment revealed <strong>{riskDistribution.CRITICAL} critical risks</strong>, <strong>{riskDistribution.HIGH} high risks</strong>,
                      {' '}<strong>{riskDistribution.MEDIUM} medium risks</strong>, and <strong>{riskDistribution.LOW} low risks</strong>.
                    </p>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Findings</h4>
                  <div className="space-y-3">
                    {highRisks > 0 && (
                      <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-sm p-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-red-900">High Priority Risks Identified</p>
                          <p className="text-xs text-red-700 mt-1">
                            {highRisks} high or critical risk(s) require immediate attention and mitigation planning.
                          </p>
                        </div>
                      </div>
                    )}

                    {riskDistribution.MEDIUM > 0 && (
                      <div className="flex items-start space-x-3 bg-yellow-50 border border-yellow-200 rounded-sm p-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-900">Medium Risk Areas</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            {riskDistribution.MEDIUM} medium risk(s) should be monitored and addressed in the next planning cycle.
                          </p>
                        </div>
                      </div>
                    )}

                    {riskDistribution.LOW > 0 && (
                      <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-sm p-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-green-900">Low Risk Areas</p>
                          <p className="text-xs text-green-700 mt-1">
                            {riskDistribution.LOW} low risk(s) are within acceptable tolerance levels.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {highRisks > 0 && (
                      <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span>Develop and implement treatment plans for all high and critical risks within the next 30 days.</span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <span className="text-gray-900 mr-2">•</span>
                      <span>Conduct regular risk reviews (quarterly recommended) to monitor changes in threat landscape.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-900 mr-2">•</span>
                      <span>Ensure all stakeholders are informed of identified risks and mitigation strategies.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-900 mr-2">•</span>
                      <span>Document lessons learned and update risk assessment methodology as needed.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Trail</h3>
                <AuditTrail assessmentId={parseInt(id)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

