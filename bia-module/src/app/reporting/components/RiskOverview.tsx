'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { ShieldCheckIcon, ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RiskOverview() {
  // Risk Trend Data
  const trendData = [
    { month: 'Jun', inherent: 78, residual: 45, target: 30 },
    { month: 'Jul', inherent: 82, residual: 42, target: 30 },
    { month: 'Aug', inherent: 75, residual: 38, target: 30 },
    { month: 'Sep', inherent: 80, residual: 35, target: 30 },
    { month: 'Oct', inherent: 72, residual: 32, target: 30 },
    { month: 'Nov', inherent: 68, residual: 28, target: 30 }
  ];

  // Risk Matrix Summary
  const riskMatrix = {
    critical: 5,
    high: 12,
    medium: 18,
    low: 8
  };

  // Control Effectiveness
  const controlEffectiveness = 73;

  // Top Risks
  const topRisks = [
    { id: 1, name: 'Cyber Attack - Ransomware', level: 'Critical', score: 25, trend: 'up' },
    { id: 2, name: 'Data Center Outage', level: 'Critical', score: 20, trend: 'stable' },
    { id: 3, name: 'Key Vendor Failure', level: 'High', score: 16, trend: 'down' },
    { id: 4, name: 'Regulatory Non-compliance', level: 'High', score: 15, trend: 'up' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-red-600" />
          <h2 className="text-sm font-semibold text-gray-900">Risk Assessment Overview</h2>
        </div>
        <Link href="/risk-assessment" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Risk Distribution Mini Cards */}
        <div className="bg-red-50 border border-red-100 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{riskMatrix.critical}</p>
          <p className="text-[10px] text-red-700">Critical</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">{riskMatrix.high}</p>
          <p className="text-[10px] text-orange-700">High</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{riskMatrix.medium + riskMatrix.low}</p>
          <p className="text-[10px] text-yellow-700">Medium/Low</p>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <div>
        <h3 className="text-xs font-medium text-gray-700 mb-3">Risk Trend (6 Months)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorInherent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResidual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inherent" stroke="#ef4444" fill="url(#colorInherent)" name="Inherent" />
              <Area type="monotone" dataKey="residual" stroke="#3b82f6" fill="url(#colorResidual)" name="Residual" />
              <Area type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" fill="none" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Risks */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-2">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
          Top Unmitigated Risks
        </h3>
        <div className="space-y-2">
          {topRisks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getLevelColor(risk.level)}`}>
                  {risk.level}
                </span>
                <span className="text-xs text-gray-900">{risk.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Score: {risk.score}</span>
                <span className={`text-[10px] ${
                  risk.trend === 'up' ? 'text-red-500' : 
                  risk.trend === 'down' ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {risk.trend === 'up' ? '↑' : risk.trend === 'down' ? '↓' : '–'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

