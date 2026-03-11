'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowPathIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Mock PIR data based on completed incident
const pirData = {
  incident: {
    id: 'INC-2025-0042',
    playbookId: 'CPB-001',
    playbookName: 'Trading System Outage Response',
    title: 'Core Trading Platform Outage - 28 Nov 2025',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    detectedAt: '2025-11-28T09:15:00',
    resolvedAt: '2025-11-28T12:45:00',
    totalDuration: '3h 30m',
    crisisCommander: 'Rajesh Kumar',
  },
  
  executive_summary: `On November 28, 2025, at 09:15 IST, the Core Trading Platform experienced a complete outage affecting all trading operations. The incident was detected through automated monitoring alerts indicating latency exceeding 500ms across all trading segments.

The Crisis Management Team was activated at 09:22 IST, and the incident was escalated to SEBI as per regulatory requirements. Root cause was identified as a database connection pool exhaustion due to a misconfigured application deployment. Trading was fully restored at 12:45 IST.

Total market impact: ~3.5 hours of trading disruption affecting 1,247 broker members and an estimated trade value impact of ₹12,500 Cr.`,

  timeline: [
    { time: '09:15', event: 'Monitoring alerts triggered - trading latency > 500ms', type: 'detection' },
    { time: '09:18', event: 'NOC confirmed alerts - initial triage started', type: 'action' },
    { time: '09:22', event: 'Crisis Commander notified - CMT activated', type: 'escalation' },
    { time: '09:28', event: 'War room established (virtual)', type: 'action' },
    { time: '09:35', event: 'SEBI notified of potential trading halt', type: 'regulatory' },
    { time: '09:42', event: 'Root cause identified - DB connection pool exhausted', type: 'investigation' },
    { time: '09:50', event: 'Member broadcast sent - trading halt confirmed', type: 'communication' },
    { time: '10:15', event: 'Rollback of faulty deployment initiated', type: 'action' },
    { time: '11:30', event: 'Database connections restored', type: 'recovery' },
    { time: '12:00', event: 'Trading system validation started', type: 'recovery' },
    { time: '12:30', event: 'Gradual trading restoration initiated', type: 'recovery' },
    { time: '12:45', event: 'Full trading operations restored', type: 'resolved' },
    { time: '13:00', event: 'Member notification - normal operations resumed', type: 'communication' },
    { time: '14:00', event: 'SEBI incident report submitted', type: 'regulatory' },
  ],

  root_cause: {
    primary: 'Database connection pool exhaustion due to misconfigured application deployment',
    contributing: [
      'Deployment process did not include connection pool validation',
      'Insufficient monitoring on connection pool metrics',
      'Load testing did not simulate peak trading conditions',
    ],
    category: 'Change Management / Configuration Error',
  },

  impact: {
    tradingHours: '3h 30m',
    membersAffected: 1247,
    estimatedTradeValue: '₹12,500 Cr',
    reputationalImpact: 'High - Media coverage, member complaints',
    regulatoryImpact: 'SEBI notification submitted within 6 hours',
    financialImpact: '₹2.5 Cr (compensation claims)',
  },

  playbook_performance: {
    phasesCompleted: 6,
    totalPhases: 6,
    stepsCompleted: 22,
    totalSteps: 24,
    deviations: 2,
    avgPhaseTime: '35 min',
    rtoActual: '3h 30m',
    rtoTarget: '4 hours',
    rtoMet: true,
  },

  lessons_learned: [
    { type: 'success', text: 'Crisis team activation was swift - within 7 minutes of detection' },
    { type: 'success', text: 'SEBI notification completed within regulatory timeline' },
    { type: 'success', text: 'Member communication was timely and accurate' },
    { type: 'improvement', text: 'Deployment validation process needs enhancement' },
    { type: 'improvement', text: 'Connection pool monitoring should be added to pre-deployment checklist' },
    { type: 'improvement', text: 'Load testing should include connection exhaustion scenarios' },
  ],

  recommendations: [
    { priority: 'HIGH', action: 'Implement automated connection pool validation in CI/CD pipeline', owner: 'DevOps Team', deadline: '2025-12-15' },
    { priority: 'HIGH', action: 'Add connection pool metrics to real-time monitoring dashboard', owner: 'NOC', deadline: '2025-12-10' },
    { priority: 'MEDIUM', action: 'Update deployment runbook with validation steps', owner: 'Release Management', deadline: '2025-12-20' },
    { priority: 'MEDIUM', action: 'Conduct tabletop exercise for similar scenarios', owner: 'IT Security', deadline: '2026-01-15' },
    { priority: 'LOW', action: 'Review and update trading system BIA', owner: 'Business Continuity', deadline: '2026-01-30' },
  ],

  approvals: [
    { role: 'Crisis Commander', name: 'Rajesh Kumar', status: 'pending' },
    { role: 'Head of Trading', name: 'Priya Sharma', status: 'pending' },
    { role: 'Compliance Head', name: 'Vikram Singh', status: 'pending' },
    { role: 'CTO', name: 'Deepak Joshi', status: 'pending' },
  ],
};

export default function PIRPage() {
  const params = useParams();
  const [activeSection, setActiveSection] = useState('executive');

  const sections = [
    { id: 'executive', name: 'Executive Summary' },
    { id: 'timeline', name: 'Incident Timeline' },
    { id: 'rootcause', name: 'Root Cause Analysis' },
    { id: 'impact', name: 'Impact Assessment' },
    { id: 'performance', name: 'Playbook Performance' },
    { id: 'lessons', name: 'Lessons Learned' },
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'approvals', name: 'Approvals' },
  ];

  const getTimelineTypeColor = (type: string) => {
    switch (type) {
      case 'detection': return 'bg-red-500';
      case 'escalation': return 'bg-orange-500';
      case 'action': return 'bg-blue-500';
      case 'investigation': return 'bg-purple-500';
      case 'recovery': return 'bg-green-500';
      case 'resolved': return 'bg-green-600';
      case 'communication': return 'bg-yellow-500';
      case 'regulatory': return 'bg-orange-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <Link href={`/crisis-management/playbooks/${params.id}`} className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-900 mb-2 transition-colors">
            <ArrowLeftIcon className="h-3 w-3" />
            Back to Playbook
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-sm font-semibold text-gray-900">Post-Incident Report</h1>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-green-100 text-green-700 border border-green-200 rounded-sm uppercase">
                  RESOLVED
                </span>
              </div>
              <p className="text-[10px] text-gray-500">{pirData.incident.title}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[9px] text-gray-400">Incident ID: <span className="font-semibold text-gray-700">{pirData.incident.id}</span></span>
                <span className="text-[9px] text-gray-400">Duration: <span className="font-semibold text-gray-700">{pirData.incident.totalDuration}</span></span>
                <span className="text-[9px] text-gray-400">Commander: <span className="font-semibold text-gray-700">{pirData.incident.crisisCommander}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-[10px] font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <PrinterIcon className="h-3 w-3" />
                Print
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-[10px] font-medium rounded-sm hover:bg-gray-50 transition-colors">
                <DocumentArrowDownIcon className="h-3 w-3" />
                Export PDF
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-sm hover:bg-gray-800 transition-colors">
                <PaperAirplaneIcon className="h-3 w-3" />
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-48 bg-white border-r border-gray-200 min-h-[calc(100vh-120px)]">
          <div className="p-3">
            <p className="text-[9px] uppercase font-semibold text-gray-400 tracking-wide mb-2">Report Sections</p>
            <nav className="space-y-0.5">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-2.5 py-1.5 text-[10px] rounded-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-gray-900 text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Executive Summary */}
          {activeSection === 'executive' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-gray-100 flex items-center justify-center">
                  <DocumentTextIcon className="h-3 w-3 text-gray-500" />
                </div>
                Executive Summary
              </h2>
              <div className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-line">
                {pirData.executive_summary}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeSection === 'timeline' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-gray-100 flex items-center justify-center">
                  <ClockIcon className="h-3 w-3 text-gray-500" />
                </div>
                Incident Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-2">
                  {pirData.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className={`absolute left-1 w-3.5 h-3.5 rounded-full ${getTimelineTypeColor(item.type)} border-2 border-white shadow-sm`}></div>
                      <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                        <span className="text-[9px] font-mono text-gray-500 w-10 flex-shrink-0">{item.time}</span>
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-900">{item.event}</p>
                          <span className={`inline-block mt-1 px-1.5 py-0.5 text-[8px] font-medium rounded-sm ${getTimelineTypeColor(item.type)} text-white`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Root Cause */}
          {activeSection === 'rootcause' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-red-50 flex items-center justify-center">
                  <ShieldExclamationIcon className="h-3 w-3 text-red-500" />
                </div>
                Root Cause Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Primary Root Cause</h3>
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-[10px] text-gray-900">{pirData.root_cause.primary}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contributing Factors</h3>
                  <ul className="space-y-1.5">
                    {pirData.root_cause.contributing.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[10px] text-gray-700 p-2 bg-orange-50 border border-orange-100 rounded-sm">
                        <ExclamationTriangleIcon className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</h3>
                  <span className="px-2 py-1 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-sm">
                    {pirData.root_cause.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Impact Assessment */}
          {activeSection === 'impact' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-gray-100 flex items-center justify-center">
                  <ChartBarIcon className="h-3 w-3 text-gray-500" />
                </div>
                Impact Assessment
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 hover:shadow-sm transition-shadow">
                  <p className="text-[9px] uppercase font-medium text-gray-400 tracking-wide">Trading Hours Lost</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{pirData.impact.tradingHours}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 hover:shadow-sm transition-shadow">
                  <p className="text-[9px] uppercase font-medium text-gray-400 tracking-wide">Members Affected</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{pirData.impact.membersAffected.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 hover:shadow-sm transition-shadow">
                  <p className="text-[9px] uppercase font-medium text-gray-400 tracking-wide">Est. Trade Value Impact</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{pirData.impact.estimatedTradeValue}</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-sm">
                  <p className="text-[9px] uppercase font-medium text-gray-500 tracking-wide">Reputational Impact</p>
                  <p className="text-[10px] font-medium text-gray-900 mt-0.5">{pirData.impact.reputationalImpact}</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <p className="text-[9px] uppercase font-medium text-gray-500 tracking-wide">Regulatory Impact</p>
                  <p className="text-[10px] font-medium text-gray-900 mt-0.5">{pirData.impact.regulatoryImpact}</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                  <p className="text-[9px] uppercase font-medium text-gray-500 tracking-wide">Financial Impact</p>
                  <p className="text-[10px] font-medium text-gray-900 mt-0.5">{pirData.impact.financialImpact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Playbook Performance */}
          {activeSection === 'performance' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-gray-100 flex items-center justify-center">
                  <ArrowPathIcon className="h-3 w-3 text-gray-500" />
                </div>
                Playbook Performance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-gray-600">Phases Completed</span>
                      <span className="text-[10px] font-semibold text-gray-900">{pirData.playbook_performance.phasesCompleted}/{pirData.playbook_performance.totalPhases}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(pirData.playbook_performance.phasesCompleted/pirData.playbook_performance.totalPhases)*100}%`}}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-gray-600">Steps Completed</span>
                      <span className="text-[10px] font-semibold text-gray-900">{pirData.playbook_performance.stepsCompleted}/{pirData.playbook_performance.totalSteps}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${(pirData.playbook_performance.stepsCompleted/pirData.playbook_performance.totalSteps)*100}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-medium text-gray-500 tracking-wide">RTO Target</p>
                        <p className="text-sm font-bold text-gray-900">{pirData.playbook_performance.rtoTarget}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-medium text-gray-500 tracking-wide">RTO Actual</p>
                        <p className="text-sm font-bold text-gray-900">{pirData.playbook_performance.rtoActual}</p>
                      </div>
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-[9px] text-green-700 mt-1.5 font-medium">RTO Target Met ✓</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-sm border border-gray-100 text-center">
                      <p className="text-[9px] uppercase font-medium text-gray-400 tracking-wide">Deviations</p>
                      <p className="text-lg font-bold text-orange-600">{pirData.playbook_performance.deviations}</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-sm border border-gray-100 text-center">
                      <p className="text-[9px] uppercase font-medium text-gray-400 tracking-wide">Avg Phase Time</p>
                      <p className="text-lg font-bold text-gray-900">{pirData.playbook_performance.avgPhaseTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {activeSection === 'lessons' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-yellow-50 flex items-center justify-center">
                  <LightBulbIcon className="h-3 w-3 text-yellow-600" />
                </div>
                Lessons Learned
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[9px] font-semibold text-green-700 uppercase tracking-wide mb-2">What Went Well</h3>
                  <div className="space-y-1.5">
                    {pirData.lessons_learned.filter(l => l.type === 'success').map((lesson, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded-sm">
                        <CheckCircleIcon className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-gray-700">{lesson.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[9px] font-semibold text-orange-700 uppercase tracking-wide mb-2">Areas for Improvement</h3>
                  <div className="space-y-1.5">
                    {pirData.lessons_learned.filter(l => l.type === 'improvement').map((lesson, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-sm">
                        <ExclamationTriangleIcon className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-gray-700">{lesson.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {activeSection === 'recommendations' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Recommendations & Action Items</h2>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-2.5 py-2 text-left font-semibold text-gray-700 uppercase tracking-wide">Priority</th>
                      <th className="px-2.5 py-2 text-left font-semibold text-gray-700 uppercase tracking-wide">Action Item</th>
                      <th className="px-2.5 py-2 text-left font-semibold text-gray-700 uppercase tracking-wide">Owner</th>
                      <th className="px-2.5 py-2 text-left font-semibold text-gray-700 uppercase tracking-wide">Deadline</th>
                      <th className="px-2.5 py-2 text-left font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pirData.recommendations.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2.5 py-2">
                          <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-sm ${
                            rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority}
                          </span>
                        </td>
                        <td className="px-2.5 py-2 text-gray-900">{rec.action}</td>
                        <td className="px-2.5 py-2 text-gray-600">{rec.owner}</td>
                        <td className="px-2.5 py-2 text-gray-600">{rec.deadline}</td>
                        <td className="px-2.5 py-2">
                          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-gray-100 text-gray-700 rounded-sm">
                            Open
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Approvals */}
          {activeSection === 'approvals' && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="h-5 w-5 rounded-sm bg-gray-100 flex items-center justify-center">
                  <UserGroupIcon className="h-3 w-3 text-gray-500" />
                </div>
                Report Approvals
              </h2>
              <div className="space-y-2">
                {pirData.approvals.map((approval, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-[10px] font-semibold">
                        {approval.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-900">{approval.name}</p>
                        <p className="text-[9px] text-gray-400">{approval.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {approval.status === 'pending' ? (
                        <>
                          <button className="px-2.5 py-1 text-[9px] font-medium text-green-700 bg-green-100 rounded-sm hover:bg-green-200 transition-colors">
                            Approve
                          </button>
                          <button className="px-2.5 py-1 text-[9px] font-medium text-red-700 bg-red-100 rounded-sm hover:bg-red-200 transition-colors">
                            Request Changes
                          </button>
                        </>
                      ) : approval.status === 'approved' ? (
                        <span className="flex items-center gap-1 text-[10px] text-green-700 font-medium">
                          <CheckCircleIcon className="h-3.5 w-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-red-700 font-medium">
                          <XCircleIcon className="h-3.5 w-3.5" /> Changes Requested
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-[9px] text-gray-400">Once all approvals are received, the PIR will be finalized and distributed to all stakeholders.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

