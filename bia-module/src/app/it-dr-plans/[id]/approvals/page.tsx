'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

/**
 * Executive Approval Workflow for IRBC Strategies
 * 
 * Per ISO 27031:2025, top management must evaluate and approve IRBC strategies.
 * This elevates IT continuity to a strategic level similar to production.
 * 
 * Approval Chain:
 * 1. IT Manager Review
 * 2. CISO/Security Review
 * 3. CIO Approval
 * 4. Board/Executive Committee Final Approval
 */

interface ApprovalStage {
  id: string;
  stage: number;
  role: string;
  approver: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  decision?: 'Approve' | 'Reject' | 'Request Changes';
  comments?: string;
  submittedAt?: string;
  respondedAt?: string;
  dueDate: string;
}

interface RiskAcceptance {
  id: string;
  riskType: 'RTO Gap' | 'RPO Gap' | 'Budget Constraint' | 'Technical Limitation' | 'Third-Party Dependency';
  description: string;
  impact: string;
  mitigation: string;
  acceptedBy?: string;
  acceptedDate?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const mockApprovalChain: ApprovalStage[] = [
  {
    id: 'APR-001',
    stage: 1,
    role: 'IT Manager',
    approver: 'Thomas Weber',
    email: 'thomas.weber@allianz.de',
    status: 'Approved',
    decision: 'Approve',
    comments: 'Technical approach is sound. Recovery procedures are well-documented.',
    submittedAt: '2024-12-10 09:00',
    respondedAt: '2024-12-10 14:30',
    dueDate: '2024-12-12'
  },
  {
    id: 'APR-002',
    stage: 2,
    role: 'CISO (Chief Information Security Officer)',
    approver: 'David Schneider',
    email: 'david.schneider@allianz.de',
    status: 'Approved',
    decision: 'Approve',
    comments: 'Security controls are adequate. Recommend adding MFA for DR site access.',
    submittedAt: '2024-12-10 15:00',
    respondedAt: '2024-12-11 10:15',
    dueDate: '2024-12-14'
  },
  {
    id: 'APR-003',
    stage: 3,
    role: 'CIO (Chief Information Officer)',
    approver: 'Dr. Klaus Müller',
    email: 'klaus.mueller@allianz.de',
    status: 'Pending',
    dueDate: '2024-12-16'
  },
  {
    id: 'APR-004',
    stage: 4,
    role: 'Board / Executive Committee',
    approver: 'Executive Risk Committee',
    email: 'risk.committee@allianz.de',
    status: 'Pending',
    dueDate: '2024-12-20'
  }
];

const mockRiskAcceptances: RiskAcceptance[] = [
  {
    id: 'RISK-001',
    riskType: 'RTO Gap',
    description: 'Current RTO for database recovery is 6 hours, but business requirement is 4 hours',
    impact: 'Potential €50,000/hour revenue loss during extended outage',
    mitigation: 'Implementing automated failover in Q1 2025 to reduce RTO to 2 hours',
    acceptedBy: 'Dr. Klaus Müller (CIO)',
    acceptedDate: '2024-11-15',
    status: 'Accepted'
  },
  {
    id: 'RISK-002',
    riskType: 'Budget Constraint',
    description: 'Full geo-redundant DR site requires €2M investment, currently allocated €1.2M',
    impact: 'Limited to warm standby instead of hot standby, increasing RTO by 2-3 hours',
    mitigation: 'Phased implementation: critical systems in 2024, remaining systems in 2025',
    status: 'Pending'
  }
];

export default function ITDRPlanApprovalsPage() {
  const params = useParams();
  const router = useRouter();
  const [approvalChain, setApprovalChain] = useState<ApprovalStage[]>(mockApprovalChain);
  const [riskAcceptances, setRiskAcceptances] = useState<RiskAcceptance[]>(mockRiskAcceptances);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<ApprovalStage | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'Rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'Changes Requested': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Pending': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircleSolidIcon className="h-5 w-5 text-green-600" />;
      case 'Rejected': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'Changes Requested': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'Pending': return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const currentStage = approvalChain.find(s => s.status === 'Pending');
  const approvedCount = approvalChain.filter(s => s.status === 'Approved').length;
  const totalStages = approvalChain.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Executive Approval Workflow</h1>
              <p className="text-sm text-gray-600 mt-1">
                IT DR Plan: Core Insurance Platform Failover (ITDR-001)
              </p>
            </div>
            <button
              onClick={() => router.push(`/it-dr-plans/${params.id}`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              Back to Plan
            </button>
          </div>
        </div>
      </div>

      {/* ISO 27031 Compliance Banner */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900">ISO 27031:2025 Requirement</p>
              <p className="text-xs text-blue-800 mt-1">
                Top management is assigned clear responsibility for evaluating and approving IRBC strategies.
                This elevates IT continuity to a strategic level, ensuring executive oversight and resource commitment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Approval Progress</h2>
            <span className="text-xs text-gray-600">
              {approvedCount} of {totalStages} stages completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${(approvedCount / totalStages) * 100}%` }}
              />
            </div>
          </div>

          {/* Stage Timeline */}
          <div className="mt-6 space-y-4">
            {approvalChain.map((stage, index) => (
              <div key={stage.id} className="flex items-start gap-4">
                {/* Stage Number & Icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    stage.status === 'Approved'
                      ? 'bg-green-50 border-green-600'
                      : stage.status === 'Rejected'
                      ? 'bg-red-50 border-red-600'
                      : stage.status === 'Changes Requested'
                      ? 'bg-yellow-50 border-yellow-600'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    {getStatusIcon(stage.status)}
                  </div>
                  {index < approvalChain.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      stage.status === 'Approved' ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Stage Details */}
                <div className="flex-1 pb-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{stage.role}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(stage.status)}`}>
                            {stage.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <UserCircleIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{stage.approver}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{stage.email}</span>
                        </div>

                        {stage.comments && (
                          <div className="mt-3 bg-white border border-gray-200 rounded-sm p-3">
                            <div className="flex items-start gap-2">
                              <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-700">Comments:</p>
                                <p className="text-xs text-gray-600 mt-1">{stage.comments}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500">Due: {stage.dueDate}</p>
                        {stage.respondedAt && (
                          <p className="text-xs text-gray-500 mt-1">Responded: {stage.respondedAt}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Pending Stage */}
                    {stage.status === 'Pending' && stage.stage === currentStage?.stage && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowApprovalModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowApprovalModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-yellow-600 rounded-sm hover:bg-yellow-700"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowApprovalModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Acceptance Documentation */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Risk Acceptance Documentation</h2>
                <p className="text-xs text-gray-600 mt-1">
                  Formal documentation of accepted risks and gaps in IRBC strategy
                </p>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                Add Risk Acceptance
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {riskAcceptances.map((risk) => (
              <div key={risk.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        {risk.riskType}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(risk.status)}`}>
                        {risk.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 mt-2">{risk.description}</h3>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Impact:</p>
                        <p className="text-xs text-gray-600 mt-1">{risk.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Mitigation:</p>
                        <p className="text-xs text-gray-600 mt-1">{risk.mitigation}</p>
                      </div>
                    </div>

                    {risk.acceptedBy && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircleSolidIcon className="h-4 w-4 text-green-600" />
                          <span>Accepted by <strong>{risk.acceptedBy}</strong> on {risk.acceptedDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board-Level Reporting Summary */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Board-Level Reporting Summary</h2>
            <p className="text-xs text-gray-600 mt-1">
              Executive summary for board presentation
            </p>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-sm font-semibold text-gray-900">IRBC Strategy Overview</h3>
              <p className="text-xs text-gray-700 mt-2">
                The Core Insurance Platform Failover strategy ensures business continuity for critical insurance
                operations with a Recovery Time Objective (RTO) of 4 hours and Recovery Point Objective (RPO) of 1 hour.
              </p>

              <h3 className="text-sm font-semibold text-gray-900 mt-4">Investment Required</h3>
              <ul className="text-xs text-gray-700 mt-2 space-y-1">
                <li>DR Site Infrastructure: €1,200,000</li>
                <li>Annual Maintenance: €180,000</li>
                <li>Testing & Training: €50,000/year</li>
              </ul>

              <h3 className="text-sm font-semibold text-gray-900 mt-4">Risk Mitigation</h3>
              <p className="text-xs text-gray-700 mt-2">
                This strategy mitigates the risk of extended outages that could result in €500,000/hour revenue loss
                and potential regulatory penalties under DORA and BaFin BAIT requirements.
              </p>

              <h3 className="text-sm font-semibold text-gray-900 mt-4">Compliance Alignment</h3>
              <ul className="text-xs text-gray-700 mt-2 space-y-1">
                <li>✓ ISO 27031:2025 (IRBC)</li>
                <li>✓ ISO 22301 (Business Continuity)</li>
                <li>✓ DORA (Digital Operational Resilience)</li>
                <li>✓ BaFin BAIT (Banking Supervisory Requirements)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

