'use client';

import { ClipboardDocumentCheckIcon, ArrowRightIcon, ExclamationTriangleIcon, CheckBadgeIcon, BoltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BCPReadiness() {
  // Readiness Score
  const readinessScore = 87;

  // Compliance Metrics
  const complianceMetrics = [
    { name: 'ISO 22301', status: 'Compliant', score: 92, dueDate: '2025-06-15' },
    { name: 'SOC 2', status: 'Compliant', score: 88, dueDate: '2025-03-20' },
    { name: 'Internal Audit', status: 'In Progress', score: 75, dueDate: '2025-01-31' },
    { name: 'Regulatory', status: 'Compliant', score: 95, dueDate: '2025-09-01' }
  ];

  // Active Incidents
  const activeIncidents = [
    { id: 1, title: 'Network Latency Issue', severity: 'Medium', status: 'In Progress', duration: '2h 15m' },
    { id: 2, title: 'Vendor Service Degradation', severity: 'Low', status: 'Monitoring', duration: '45m' }
  ];

  // BCP Test Schedule
  const upcomingTests = [
    { id: 1, name: 'Full DR Failover Test', date: '2024-12-15', type: 'Full' },
    { id: 2, name: 'Crisis Comm Exercise', date: '2024-12-20', type: 'Tabletop' },
    { id: 3, name: 'Data Recovery Test', date: '2025-01-10', type: 'Partial' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  // Calculate gauge rotation
  const gaugeRotation = (readinessScore / 100) * 180 - 90;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-900">Operational Readiness</h2>
        </div>
        <Link href="/bcp" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Readiness Gauge */}
      <div className="flex justify-center mb-5">
        <div className="relative w-40 h-24">
          {/* Gauge Background */}
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGradient)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${readinessScore * 1.26}, 126`} />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <p className={`text-2xl font-bold ${getScoreColor(readinessScore)}`}>{readinessScore}%</p>
            <p className="text-[10px] text-gray-500">Overall Readiness</p>
          </div>
        </div>
      </div>

      {/* Compliance Grid */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {complianceMetrics.map((metric, idx) => (
          <div key={idx} className="bg-gray-50 rounded-sm p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-900">{metric.name}</span>
              <span className={`text-xs font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${
                metric.score >= 90 ? 'bg-green-500' : 
                metric.score >= 75 ? 'bg-blue-500' : 
                metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`} style={{ width: `${metric.score}%` }}></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Due: {metric.dueDate}</p>
          </div>
        ))}
      </div>

      {/* Active Incidents */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BoltIcon className="h-4 w-4 text-yellow-500" />
          Active Incidents ({activeIncidents.length})
        </h3>
        {activeIncidents.length > 0 ? (
          <div className="space-y-2">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs text-gray-900">{incident.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">{incident.duration}</span>
                  <span className="text-[10px] font-medium text-yellow-700">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-sm">
            <CheckBadgeIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-700">No active incidents</span>
          </div>
        )}
      </div>

      {/* Upcoming Tests */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Upcoming BCP Tests</h3>
        <div className="space-y-1">
          {upcomingTests.slice(0, 2).map((test) => (
            <div key={test.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-sm">
              <span className="text-gray-900">{test.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{test.date}</span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">{test.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

