'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ServerStackIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ITDRMetrics() {
  // DR Plan Status
  const planStatus = {
    active: 24,
    draft: 3,
    underReview: 2,
    total: 29
  };

  // Test Results
  const testResults = [
    { month: 'Jul', passed: 4, failed: 1 },
    { month: 'Aug', passed: 5, failed: 0 },
    { month: 'Sep', passed: 3, failed: 1 },
    { month: 'Oct', passed: 6, failed: 0 },
    { month: 'Nov', passed: 5, failed: 1 }
  ];

  // RTO Compliance by Tier
  const rtoCompliance = [
    { tier: 'Tier 1', target: 4, actual: 3.5, compliant: true },
    { tier: 'Tier 2', target: 8, actual: 7.2, compliant: true },
    { tier: 'Tier 3', target: 24, actual: 26, compliant: false },
    { tier: 'Tier 4', target: 72, actual: 48, compliant: true }
  ];

  // Recent DR Tests
  const recentTests = [
    { id: 1, plan: 'Core Banking System', date: '2024-11-15', result: 'Passed', rto: '3.5h' },
    { id: 2, plan: 'Email Infrastructure', date: '2024-11-10', result: 'Passed', rto: '2.1h' },
    { id: 3, plan: 'Customer Portal', date: '2024-11-05', result: 'Failed', rto: '6.2h' },
    { id: 4, plan: 'Data Warehouse', date: '2024-10-28', result: 'Passed', rto: '18h' }
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

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ServerStackIcon className="h-5 w-5 text-purple-600" />
          <h2 className="text-sm font-semibold text-gray-900">IT Disaster Recovery</h2>
        </div>
        <Link href="/it-dr-plans" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-purple-50 border border-purple-100 rounded-sm p-3 text-center">
          <p className="text-xl font-bold text-purple-600">{planStatus.active}</p>
          <p className="text-[10px] text-purple-700">Active Plans</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-sm p-3 text-center">
          <p className="text-xl font-bold text-green-600">{successRate}%</p>
          <p className="text-[10px] text-green-700">Test Success</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{rtoCompliance.filter(r => r.compliant).length}/{rtoCompliance.length}</p>
          <p className="text-[10px] text-blue-700">RTO Compliant</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 text-center">
          <p className="text-xl font-bold text-gray-600">{planStatus.underReview}</p>
          <p className="text-[10px] text-gray-700">Under Review</p>
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

      {/* Recent Tests Table */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3">Recent DR Tests</h3>
        <div className="space-y-2">
          {recentTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm">
              <div className="flex items-center gap-2">
                {test.result === 'Passed' ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-900">{test.plan}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-500">{test.date}</span>
                <span className="text-xs font-medium text-gray-700">{test.rto}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  test.result === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {test.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

