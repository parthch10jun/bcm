'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DocumentTextIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BIAAnalytics() {
  // Threat Assessment Status Distribution
  const statusData = [
    { name: 'Mitigated', value: 32, color: '#10b981' },
    { name: 'In Progress', value: 12, color: '#3b82f6' },
    { name: 'Pending Review', value: 5, color: '#f59e0b' },
    { name: 'Identified', value: 3, color: '#6b7280' }
  ];

  // Threat Severity Distribution
  const criticalityData = [
    { name: 'Critical', count: 8, color: '#dc2626' },
    { name: 'High', count: 15, color: '#f97316' },
    { name: 'Medium', count: 18, color: '#f59e0b' },
    { name: 'Low', count: 11, color: '#10b981' }
  ];

  // Response Time by Asset Category
  const rtoData = [
    { dept: 'Core Systems', rto: 2, rpo: 1 },
    { dept: 'Network Infra', rto: 4, rpo: 2 },
    { dept: 'Applications', rto: 8, rpo: 4 },
    { dept: 'Endpoints', rto: 24, rpo: 8 },
    { dept: 'Cloud Services', rto: 48, rpo: 24 }
  ];

  const totalThreats = statusData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">{payload[0].value} Threats</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">Threat Assessment</h2>
        </div>
        <Link href="/bia-records" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Status Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Center label */}
          <div className="text-center -mt-28 mb-16">
            <p className="text-2xl font-bold text-gray-900">{totalThreats}</p>
            <p className="text-[10px] text-gray-500">Total Threats</p>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[10px] text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Severity Bar Chart */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Threat Severity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criticalityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#6b7280" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#6b7280" width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {criticalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MTTR/MTTD Summary Table */}
      <div className="mt-5 pt-5 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          MTTR/MTTD by Asset Category
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 font-medium text-gray-600">Asset Category</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">MTTR (hrs)</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">MTTD (hrs)</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">Priority</th>
              </tr>
            </thead>
            <tbody>
              {rtoData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium text-gray-900">{row.dept}</td>
                  <td className="py-2 px-3 text-center">{row.rto}h</td>
                  <td className="py-2 px-3 text-center">{row.rpo}h</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      row.rto <= 4 ? 'bg-red-100 text-red-700' :
                      row.rto <= 24 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {row.rto <= 4 ? 'Critical' : row.rto <= 24 ? 'High' : 'Normal'}
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

