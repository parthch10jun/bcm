'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, RadialBarChart, RadialBar } from 'recharts';
import { ChartBarIcon, ClockIcon, ShieldCheckIcon, DocumentCheckIcon, ArrowTrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DepartmentBIAChartsProps {
  biaRecords: any[];
}

export default function DepartmentBIACharts({ biaRecords }: DepartmentBIAChartsProps) {
  // BIA Status Distribution
  const statusData = [
    { name: 'Approved', value: biaRecords.filter(b => b.workflowStatus === 'APPROVED').length || 2, color: '#10b981' },
    { name: 'In Progress', value: biaRecords.filter(b => b.workflowStatus === 'IN_PROGRESS').length || 3, color: '#3b82f6' },
    { name: 'Submitted', value: biaRecords.filter(b => b.workflowStatus === 'SUBMITTED').length || 2, color: '#f59e0b' },
    { name: 'Draft', value: biaRecords.filter(b => b.workflowStatus === 'DRAFT').length || 1, color: '#6b7280' }
  ];

  // Target Type Distribution
  const targetTypeData = [
    { name: 'Process', value: biaRecords.filter(b => b.biaTargetType === 'PROCESS').length || 3, color: '#8b5cf6' },
    { name: 'Department', value: biaRecords.filter(b => b.biaTargetType === 'DEPARTMENT').length || 2, color: '#06b6d4' },
    { name: 'Application', value: biaRecords.filter(b => b.biaTargetType === 'APPLICATION').length || 2, color: '#f97316' },
    { name: 'Infrastructure', value: biaRecords.filter(b => b.biaTargetType === 'INFRASTRUCTURE').length || 1, color: '#ec4899' }
  ];

  // Weekly Progress Trend
  const progressTrend = [
    { week: 'Week 1', completed: 1, inProgress: 2, total: 3 },
    { week: 'Week 2', completed: 2, inProgress: 3, total: 5 },
    { week: 'Week 3', completed: 3, inProgress: 4, total: 7 },
    { week: 'Week 4', completed: 4, inProgress: 2, total: 6 }
  ];

  // RTO Analysis by BIA
  const rtoAnalysis = [
    { bia: 'Finance Ops', rto: 4, target: 2, gap: 2 },
    { bia: 'IT Infra', rto: 8, target: 4, gap: 4 },
    { bia: 'Customer Svc', rto: 2, target: 2, gap: 0 },
    { bia: 'Supply Chain', rto: 12, target: 8, gap: 4 },
    { bia: 'HR Systems', rto: 24, target: 24, gap: 0 }
  ];

  // Completion Rate Gauge
  const completionData = [
    { name: 'Completed', value: 65, fill: '#10b981' },
    { name: 'Remaining', value: 35, fill: '#e5e7eb' }
  ];

  const totalBIAs = statusData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-sm shadow-lg text-xs">
          <p className="font-medium text-gray-900">{label || payload[0].name}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.color || entry.fill }}>{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Two Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status Distribution Pie */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <ChartBarIcon className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-semibold text-gray-900">BIA Status Distribution</h3>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-24 mb-12">
            <p className="text-xl font-bold text-gray-900">{totalBIAs}</p>
            <p className="text-[9px] text-gray-500">Total</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[9px] text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Type Distribution */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <DocumentCheckIcon className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs font-semibold text-gray-900">BIA by Target Type</h3>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetTypeData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} stroke="#6b7280" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} stroke="#6b7280" width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {targetTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Progress Trend & RTO Analysis */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Progress Trend */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
            <h3 className="text-xs font-semibold text-gray-900">Weekly BIA Progress</h3>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 9 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fill="url(#colorCompleted)" name="Completed" />
                <Area type="monotone" dataKey="inProgress" stroke="#3b82f6" fill="url(#colorInProgress)" name="In Progress" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RTO Gap Analysis */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClockIcon className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-semibold text-gray-900">RTO Gap Analysis</h3>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rtoAnalysis} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bia" tick={{ fontSize: 8 }} stroke="#6b7280" angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 9 }} stroke="#6b7280" label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 9 } }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rto" fill="#3b82f6" name="Actual RTO" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#10b981" name="Target RTO" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

