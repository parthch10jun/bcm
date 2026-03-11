'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from 'recharts';
import { BuildingOfficeIcon, UserGroupIcon, CubeIcon, MapPinIcon, DocumentDuplicateIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrganizationalCoverage() {
  // Department BIA Coverage
  const departmentCoverage = [
    { name: 'Finance', coverage: 95, biaCount: 12, color: '#10b981' },
    { name: 'IT', coverage: 88, biaCount: 18, color: '#10b981' },
    { name: 'Operations', coverage: 75, biaCount: 8, color: '#3b82f6' },
    { name: 'HR', coverage: 60, biaCount: 4, color: '#f59e0b' },
    { name: 'Marketing', coverage: 45, biaCount: 3, color: '#ef4444' },
    { name: 'Legal', coverage: 80, biaCount: 5, color: '#3b82f6' }
  ];

  // Library Metrics
  const libraryMetrics = [
    { name: 'Processes', count: 156, linked: 142, icon: DocumentDuplicateIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Assets', count: 234, linked: 198, icon: CubeIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Locations', count: 28, linked: 25, icon: MapPinIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Personnel', count: 1245, linked: 856, icon: UserGroupIcon, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  // BETH3V Resources
  const beth3vData = [
    { category: 'Buildings', total: 12, covered: 11 },
    { category: 'Equipment', total: 89, covered: 78 },
    { category: 'Technology', total: 156, covered: 142 },
    { category: 'Human Resources', total: 1245, covered: 1180 },
    { category: '3rd Party', total: 45, covered: 38 },
    { category: 'Vital Records', total: 234, covered: 212 }
  ];

  const overallCoverage = Math.round(departmentCoverage.reduce((sum, d) => sum + d.coverage, 0) / departmentCoverage.length);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-gray-600">Coverage: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">Organizational Coverage</h2>
        </div>
        <Link href="/libraries" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View Libraries <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Coverage Chart */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-medium text-gray-700 mb-3">BIA Coverage by Department</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCoverage} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#6b7280" width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                  {departmentCoverage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600">
            <span className="font-medium">Overall Coverage:</span>
            <span className={`font-bold ${overallCoverage >= 75 ? 'text-green-600' : overallCoverage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {overallCoverage}%
            </span>
          </div>
        </div>

        {/* Library Quick Stats */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Library Utilization</h3>
          <div className="space-y-3">
            {libraryMetrics.map((lib, idx) => (
              <div key={idx} className={`p-3 rounded-sm ${lib.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <lib.icon className={`h-4 w-4 ${lib.color}`} />
                    <span className="text-xs font-medium text-gray-900">{lib.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{lib.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/50 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full bg-current ${lib.color}`} 
                      style={{ width: `${(lib.linked / lib.count) * 100}%` }}></div>
                  </div>
                  <span className="text-[10px] text-gray-600">{Math.round((lib.linked / lib.count) * 100)}% linked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BETH3V Summary */}
      <div className="mt-5 pt-5 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3">BETH3V Framework Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {beth3vData.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-sm p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{item.covered}/{item.total}</p>
              <p className="text-[10px] text-gray-600 truncate">{item.category}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${(item.covered / item.total) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

