'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  ShieldExclamationIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Sample lifecycle data
const lifecycleData = [
  {
    id: 1,
    biaName: 'Payment Processing System',
    businessFunction: 'Financial Operations',
    criticality: 'CRITICAL',
    biaStatus: 'APPROVED',
    riskAssessments: [{ id: 1, name: 'Payment RA', status: 'COMPLETED', riskCount: 5, highRisks: 2 }],
    bcpScenarios: [{ id: 1, name: 'Cyberattack Response', status: 'APPROVED', lastTested: '2024-10-15' }],
    tests: [{ id: 1, name: 'Q4 DR Test', status: 'PASSED', date: '2024-10-15', score: 92 }],
    completeness: 100
  },
  {
    id: 2,
    biaName: 'Customer Portal',
    businessFunction: 'Customer Service',
    criticality: 'HIGH',
    biaStatus: 'APPROVED',
    riskAssessments: [{ id: 2, name: 'Portal RA', status: 'COMPLETED', riskCount: 3, highRisks: 1 }],
    bcpScenarios: [{ id: 2, name: 'System Outage', status: 'DRAFT', lastTested: null }],
    tests: [],
    completeness: 60
  },
  {
    id: 3,
    biaName: 'Core Banking System',
    businessFunction: 'Banking Operations',
    criticality: 'CRITICAL',
    biaStatus: 'APPROVED',
    riskAssessments: [{ id: 3, name: 'Core Banking RA', status: 'IN_PROGRESS', riskCount: 8, highRisks: 4 }],
    bcpScenarios: [],
    tests: [],
    completeness: 40
  },
  {
    id: 4,
    biaName: 'HR Management System',
    businessFunction: 'Human Resources',
    criticality: 'MEDIUM',
    biaStatus: 'IN_PROGRESS',
    riskAssessments: [],
    bcpScenarios: [],
    tests: [],
    completeness: 20
  },
  {
    id: 5,
    biaName: 'Supply Chain Management',
    businessFunction: 'Operations',
    criticality: 'HIGH',
    biaStatus: 'APPROVED',
    riskAssessments: [{ id: 5, name: 'Supply Chain RA', status: 'COMPLETED', riskCount: 4, highRisks: 1 }],
    bcpScenarios: [{ id: 5, name: 'Vendor Disruption', status: 'APPROVED', lastTested: '2024-09-20' }],
    tests: [{ id: 5, name: 'Q3 Tabletop', status: 'PASSED', date: '2024-09-20', score: 85 }],
    completeness: 100
  }
];

const getStatusIcon = (status: string | null) => {
  if (!status) return <XCircleIcon className="h-4 w-4 text-gray-300" />;
  switch (status) {
    case 'APPROVED':
    case 'COMPLETED':
    case 'PASSED':
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case 'IN_PROGRESS':
    case 'DRAFT':
      return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
    case 'FAILED':
      return <XCircleIcon className="h-4 w-4 text-red-500" />;
    default:
      return <XCircleIcon className="h-4 w-4 text-gray-300" />;
  }
};

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case 'CRITICAL': return 'bg-red-100 text-red-700';
    case 'HIGH': return 'bg-orange-100 text-orange-700';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function BCMLifecycleDashboard() {
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'critical'>('all');

  const filteredData = lifecycleData.filter(item => {
    if (filter === 'incomplete') return item.completeness < 100;
    if (filter === 'critical') return item.criticality === 'CRITICAL';
    return true;
  });

  // Summary stats
  const totalBIAs = lifecycleData.length;
  const completedLifecycles = lifecycleData.filter(d => d.completeness === 100).length;
  const criticalWithoutBCP = lifecycleData.filter(d => d.criticality === 'CRITICAL' && d.bcpScenarios.length === 0).length;
  const overdueTests = lifecycleData.filter(d => d.bcpScenarios.length > 0 && d.tests.length === 0).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] uppercase font-medium text-gray-500">Critical Assets</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalBIAs}</p>
          <p className="text-xs text-gray-500 mt-1">In resilience lifecycle</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] uppercase font-medium text-gray-500">Cyber Protected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedLifecycles}</p>
          <p className="text-xs text-gray-500 mt-1">Full incident response ready</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] uppercase font-medium text-gray-500">Unprotected Critical</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{criticalWithoutBCP}</p>
          <p className="text-xs text-red-500 mt-1">Requires immediate action</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] uppercase font-medium text-gray-500">Untested Response Plans</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{overdueTests}</p>
          <p className="text-xs text-orange-500 mt-1">Plans without validation</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'All BIAs' },
          { key: 'incomplete', label: 'Incomplete Lifecycles' },
          { key: 'critical', label: 'Critical Only' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              filter === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lifecycle Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-[10px] uppercase font-medium text-gray-500">BIA</th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <DocumentTextIcon className="h-3 w-3" />
                  BIA
                </div>
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-400" />
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <ShieldExclamationIcon className="h-3 w-3" />
                  Risk Assessment
                </div>
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-400" />
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <ClipboardDocumentListIcon className="h-3 w-3" />
                  BCP
                </div>
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-400" />
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <BeakerIcon className="h-3 w-3" />
                  Test
                </div>
              </th>
              <th className="px-4 py-2 text-center text-[10px] uppercase font-medium text-gray-500">Completeness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{item.biaName}</p>
                    <p className="text-[10px] text-gray-500">{item.businessFunction}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${getCriticalityColor(item.criticality)}`}>
                      {item.criticality}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(item.biaStatus)}
                    <span className="text-[10px] text-gray-500 mt-0.5">{item.biaStatus}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-300" />
                </td>
                <td className="px-4 py-3 text-center">
                  {item.riskAssessments.length > 0 ? (
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.riskAssessments[0].status)}
                      <span className="text-[10px] text-gray-500 mt-0.5">{item.riskAssessments[0].riskCount} risks</span>
                      {item.riskAssessments[0].highRisks > 0 && (
                        <span className="text-[10px] text-red-500">{item.riskAssessments[0].highRisks} high</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircleIcon className="h-4 w-4 text-gray-300" />
                      <span className="text-[10px] text-gray-400 mt-0.5">Not started</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-300" />
                </td>
                <td className="px-4 py-3 text-center">
                  {item.bcpScenarios.length > 0 ? (
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.bcpScenarios[0].status)}
                      <span className="text-[10px] text-gray-500 mt-0.5">{item.bcpScenarios[0].name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircleIcon className="h-4 w-4 text-gray-300" />
                      <span className="text-[10px] text-gray-400 mt-0.5">No BCP</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <ArrowRightIcon className="h-3 w-3 mx-auto text-gray-300" />
                </td>
                <td className="px-4 py-3 text-center">
                  {item.tests.length > 0 ? (
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.tests[0].status)}
                      <span className="text-[10px] text-gray-500 mt-0.5">{item.tests[0].score}%</span>
                      <span className="text-[10px] text-gray-400">{item.tests[0].date}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircleIcon className="h-4 w-4 text-gray-300" />
                      <span className="text-[10px] text-gray-400 mt-0.5">Not tested</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.completeness === 100 ? 'bg-green-500' :
                          item.completeness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.completeness}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">{item.completeness}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

