'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ServerStackIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ShieldCheckIcon, CubeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ITDRMetrics() {
  // DR Plan Status by Type
  const plansByType = [
    { type: 'ARP', count: 5, color: '#9333ea' },
    { type: 'IRP', count: 2, color: '#f97316' },
    { type: 'DRP', count: 2, color: '#3b82f6' },
    { type: 'CIRP', count: 1, color: '#ef4444' }
  ];

  // Recovery Strategy Distribution
  const recoveryStrategies = [
    { strategy: 'Hot Site', count: 3, color: '#10b981' },
    { strategy: 'Warm Site', count: 3, color: '#3b82f6' },
    { strategy: 'Cloud DR', count: 3, color: '#9333ea' },
    { strategy: 'Cold Site', count: 1, color: '#6b7280' }
  ];

  // BCM-ITSCM Alignment Metrics
  const alignmentMetrics = {
    totalITServices: 15,
    servicesWithDRPlans: 10,
    criticalProcessesCovered: 35,
    totalCriticalProcesses: 42,
    averageRTO: 4.2,
    targetRTO: 4.0
  };

  const coveragePercent = Math.round((alignmentMetrics.servicesWithDRPlans / alignmentMetrics.totalITServices) * 100);
  const processCoveragePercent = Math.round((alignmentMetrics.criticalProcessesCovered / alignmentMetrics.totalCriticalProcesses) * 100);

  // Test Results
  const testResults = [
    { month: 'Jul', passed: 4, failed: 1 },
    { month: 'Aug', passed: 5, failed: 0 },
    { month: 'Sep', passed: 3, failed: 1 },
    { month: 'Oct', passed: 6, failed: 0 },
    { month: 'Nov', passed: 5, failed: 1 }
  ];

  // Recent DR Tests with IT Service linkage
  const recentTests = [
    { id: 1, plan: 'Core Insurance Platform Recovery', itService: 'Core Insurance Platform', date: '2024-11-15', result: 'Passed', rto: '3.5h', planType: 'ARP' },
    { id: 2, plan: 'Claims Management System Recovery', itService: 'Claims Management System', date: '2024-11-10', result: 'Passed', rto: '2.1h', planType: 'ARP' },
    { id: 3, plan: 'Customer Portal Application Recovery', itService: 'Customer Portal', date: '2024-11-05', result: 'Passed', rto: '4.2h', planType: 'ARP' },
    { id: 4, plan: 'Munich Data Center Infrastructure Recovery', itService: 'Munich Data Center', date: '2024-10-28', result: 'Passed', rto: '18h', planType: 'IRP' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.fill }}>{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const successRate = Math.round((testResults.reduce((sum, t) => sum + t.passed, 0) /
    testResults.reduce((sum, t) => sum + t.passed + t.failed, 0)) * 100);

  const totalPlans = plansByType.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ServerStackIcon className="h-5 w-5 text-purple-600" />
          <h2 className="text-sm font-semibold text-gray-900">ITSCM & DR Metrics</h2>
        </div>
        <Link href="/it-dr-plans" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All Plans <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* BCM-ITSCM Alignment Stats */}
      <div className="mb-5 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-sm">
        <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ShieldCheckIcon className="h-4 w-4 text-purple-600" />
          BCM-ITSCM Alignment
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">{coveragePercent}%</p>
            <p className="text-[10px] text-gray-700">IT Services with DR Plans</p>
            <p className="text-[9px] text-gray-500 mt-1">{alignmentMetrics.servicesWithDRPlans}/{alignmentMetrics.totalITServices} services covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{processCoveragePercent}%</p>
            <p className="text-[10px] text-gray-700">Critical Processes Protected</p>
            <p className="text-[9px] text-gray-500 mt-1">{alignmentMetrics.criticalProcessesCovered}/{alignmentMetrics.totalCriticalProcesses} processes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{totalPlans}</p>
            <p className="text-[10px] text-gray-700">Total DR Plans</p>
            <p className="text-[9px] text-gray-500 mt-1">Across all plan types</p>
          </div>
        </div>
      </div>

      {/* Plan Type & Recovery Strategy Distribution */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">DR Plan Types</h3>
          <div className="space-y-2">
            {plansByType.map((plan) => (
              <div key={plan.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: plan.color }}></div>
                  <span className="text-xs text-gray-700">{plan.type}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{plan.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Recovery Strategies</h3>
          <div className="space-y-2">
            {recoveryStrategies.map((strategy) => (
              <div key={strategy.strategy} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: strategy.color }}></div>
                  <span className="text-xs text-gray-700">{strategy.strategy}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{strategy.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Results Chart */}
      <div className="mb-5">
        <h3 className="text-xs font-medium text-gray-700 mb-3">DR Test Results (Last 5 Months)</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={testResults} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passed" fill="#10b981" name="Passed" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" name="Failed" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tests Table with IT Service Linkage */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3">Recent DR Tests (IT Service Linkage)</h3>
        <div className="space-y-2">
          {recentTests.map((test) => (
            <div key={test.id} className="p-3 bg-gray-50 rounded-sm border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  {test.result === 'Passed' ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">{test.plan}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CubeIcon className="h-3 w-3 text-blue-500" />
                      <span className="text-[10px] text-blue-600">{test.itService}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                    test.planType === 'ARP' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    test.planType === 'IRP' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    test.planType === 'DRP' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {test.planType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                    test.result === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {test.result}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 ml-6">
                <span>{test.date}</span>
                <span className="font-medium text-gray-700">RTO: {test.rto}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

