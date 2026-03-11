'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ServerStackIcon, ArrowRightIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ITSCMServiceHealth() {
  // Service Health Distribution
  const healthDistribution = [
    { name: 'Operational', value: 139, color: '#10b981' },
    { name: 'At Risk', value: 10, color: '#f59e0b' },
    { name: 'Critical', value: 7, color: '#ef4444' }
  ];

  // RTO Compliance by Tier
  const rtoComplianceData = [
    { tier: 'Tier 1', compliant: 40, atRisk: 2, total: 42 },
    { tier: 'Tier 2', compliant: 62, atRisk: 6, total: 68 },
    { tier: 'Tier 3', compliant: 37, atRisk: 9, total: 46 }
  ];

  // Critical Services Status
  const criticalServices = [
    { name: 'Core Banking System', status: 'Operational', rto: '2h', lastTest: '2024-02-10', health: 'green', rtoMet: true },
    { name: 'Payment Gateway', status: 'At Risk', rto: '2h', lastTest: '2023-12-15', health: 'yellow', rtoMet: false },
    { name: 'Customer Portal', status: 'Operational', rto: '4h', lastTest: '2024-02-08', health: 'green', rtoMet: true },
    { name: 'Email Services', status: 'Critical', rto: '4h', lastTest: '2023-11-20', health: 'red', rtoMet: false },
    { name: 'Data Warehouse', status: 'Operational', rto: '8h', lastTest: '2024-02-05', health: 'green', rtoMet: true },
    { name: 'Mobile Banking App', status: 'Operational', rto: '2h', lastTest: '2024-01-28', health: 'green', rtoMet: true }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium mb-1">{payload[0].payload.tier}</p>
          <p className="text-green-600">Compliant: {payload[0].value}</p>
          {payload[1] && <p className="text-yellow-600">At Risk: {payload[1].value}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ServerStackIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">IT Service Health & RTO Compliance</h2>
        </div>
        <Link href="/itscm-dashboard" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View Details <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* Service Health Distribution & RTO Compliance */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        {/* Health Distribution Pie Chart */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Service Health Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {healthDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RTO Compliance Bar Chart */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">RTO Compliance by Service Tier</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rtoComplianceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="tier" tick={{ fontSize: 10 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="compliant" fill="#10b981" name="Compliant" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="atRisk" fill="#f59e0b" name="At Risk" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Services Table */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3">Critical IT Services Status</h3>
        <div className="space-y-2">
          {criticalServices.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className={`h-2 w-2 rounded-full ${
                  service.health === 'green' ? 'bg-green-500' :
                  service.health === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">{service.name}</p>
                  <p className="text-[10px] text-gray-500">Target RTO: {service.rto} | Last Test: {service.lastTest}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {service.rtoMet ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium ${
                  service.health === 'green' ? 'bg-green-100 text-green-700' :
                  service.health === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

