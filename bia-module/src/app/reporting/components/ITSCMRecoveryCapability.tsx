'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheckIcon, CubeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ITSCMRecoveryCapability() {
  // Recovery Capability by Category
  const recoveryCapability = [
    { category: 'Infrastructure', score: 95, target: 90 },
    { category: 'Applications', score: 88, target: 85 },
    { category: 'Data', score: 92, target: 95 },
    { category: 'Network', score: 85, target: 90 },
    { category: 'Security', score: 90, target: 85 },
    { category: 'Cloud Services', score: 93, target: 90 }
  ];

  // Application Dependencies
  const applicationDependencies = [
    { app: 'Core Banking', dependencies: 12, critical: 8, mapped: 12, coverage: 100 },
    { app: 'Payment Gateway', dependencies: 8, critical: 6, mapped: 7, coverage: 88 },
    { app: 'Customer Portal', dependencies: 15, critical: 10, mapped: 14, coverage: 93 },
    { app: 'Mobile App', dependencies: 10, critical: 7, mapped: 10, coverage: 100 },
    { app: 'Data Warehouse', dependencies: 6, critical: 3, mapped: 5, coverage: 83 }
  ];

  // Recovery Strategy Distribution
  const recoveryStrategies = [
    { strategy: 'Hot Site', count: 42, percentage: 27 },
    { strategy: 'Warm Site', count: 68, percentage: 44 },
    { strategy: 'Cold Site', count: 31, percentage: 20 },
    { strategy: 'Cloud Failover', count: 15, percentage: 9 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium">{payload[0].payload.category}</p>
          <p className="text-blue-600">Score: {payload[0].value}%</p>
          <p className="text-gray-500">Target: {payload[0].payload.target}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-teal-600" />
          <h2 className="text-sm font-semibold text-gray-900">Recovery Capability & Application Dependencies</h2>
        </div>
        <Link href="/itscm-dashboard/application-mapping" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View Mapping <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        {/* Recovery Capability Radar Chart */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Recovery Capability Assessment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={recoveryCapability}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Current Score" dataKey="score" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
                <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-teal-500"></div>
              <span className="text-xs text-gray-600">Current Score</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <span className="text-xs text-gray-600">Target</span>
            </div>
          </div>
        </div>

        {/* Recovery Strategy Distribution */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Recovery Strategy Distribution</h3>
          <div className="space-y-3 mt-6">
            {recoveryStrategies.map((strategy, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">{strategy.strategy}</span>
                  <span className="text-xs text-gray-500">{strategy.count} services ({strategy.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
                    style={{ width: `${strategy.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-teal-50 border border-teal-100 rounded-sm p-3 text-center">
              <p className="text-xl font-bold text-teal-600">92%</p>
              <p className="text-[10px] text-teal-700">Avg Capability</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 text-center">
              <p className="text-xl font-bold text-blue-600">156</p>
              <p className="text-[10px] text-blue-700">Total Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Dependencies Table */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-700">Critical Application Dependencies</h3>
          <CubeIcon className="h-4 w-4 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Application</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Deps</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Mapped</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicationDependencies.map((app, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs font-medium text-gray-900">{app.app}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 text-center">{app.dependencies}</td>
                  <td className="px-3 py-2 text-xs text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                      {app.critical}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600 text-center">{app.mapped}</td>
                  <td className="px-3 py-2 text-xs text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                      app.coverage === 100 ? 'bg-green-100 text-green-700' :
                      app.coverage >= 90 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.coverage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

