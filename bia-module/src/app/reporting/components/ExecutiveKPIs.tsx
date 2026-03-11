'use client';

import { useState, useEffect } from 'react';
import {
  CheckBadgeIcon,
  DocumentCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ServerStackIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Mock executive KPI data
const mockExecutiveData = {
  criticalProcessesWithBIA: { value: 87, total: 100, trend: 5 },
  recoveryPlansAvailable: { value: 92, total: 100, trend: 3 },
  meanTimeToRecover: { value: 4.2, unit: 'hours', trend: -0.8 },
  overdueExercises: { value: 3, critical: 1, trend: 2 },
  biaCompletionRate: { value: 78, trend: 8 },
  riskMitigationRate: { value: 85, trend: 2 },
  bcpTestSuccess: { value: 94, trend: 1 },
  complianceScore: { value: 91, trend: 4 }
};

export default function ExecutiveKPIs() {
  const [data, setData] = useState(mockExecutiveData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Critical Processes with Validated BIA',
      value: `${data.criticalProcessesWithBIA.value}%`,
      subtitle: `${data.criticalProcessesWithBIA.value} of ${data.criticalProcessesWithBIA.total} processes`,
      trend: data.criticalProcessesWithBIA.trend,
      icon: DocumentCheckIcon,
      color: 'blue',
      target: 95
    },
    {
      title: 'Recovery Plans Available',
      value: `${data.recoveryPlansAvailable.value}%`,
      subtitle: `${data.recoveryPlansAvailable.value} of ${data.recoveryPlansAvailable.total} plans`,
      trend: data.recoveryPlansAvailable.trend,
      icon: ShieldCheckIcon,
      color: 'green',
      target: 100
    },
    {
      title: 'Mean Time to Recover (MTTR)',
      value: `${data.meanTimeToRecover.value}h`,
      subtitle: 'Simulated average across all systems',
      trend: data.meanTimeToRecover.trend,
      icon: ClockIcon,
      color: 'purple',
      isInverse: true,
      target: 4
    },
    {
      title: 'Overdue Exercises / DR Tests',
      value: data.overdueExercises.value,
      subtitle: `${data.overdueExercises.critical} critical, ${data.overdueExercises.value - data.overdueExercises.critical} standard`,
      trend: data.overdueExercises.trend,
      icon: ExclamationTriangleIcon,
      color: data.overdueExercises.value > 0 ? 'red' : 'green',
      isInverse: true,
      isAlert: data.overdueExercises.value > 0
    },
    {
      title: 'BIA Completion Rate',
      value: `${data.biaCompletionRate.value}%`,
      subtitle: 'Across all business units',
      trend: data.biaCompletionRate.trend,
      icon: ChartBarIcon,
      color: 'indigo',
      target: 90
    },
    {
      title: 'Risk Mitigation Rate',
      value: `${data.riskMitigationRate.value}%`,
      subtitle: 'Risks with active controls',
      trend: data.riskMitigationRate.trend,
      icon: ShieldCheckIcon,
      color: 'teal',
      target: 90
    },
    {
      title: 'BCP Test Success Rate',
      value: `${data.bcpTestSuccess.value}%`,
      subtitle: 'Last 12 months',
      trend: data.bcpTestSuccess.trend,
      icon: ServerStackIcon,
      color: 'emerald',
      target: 95
    },
    {
      title: 'Overall Compliance Score',
      value: `${data.complianceScore.value}%`,
      subtitle: 'ISO 22301 alignment',
      trend: data.complianceScore.trend,
      icon: CheckBadgeIcon,
      color: 'amber',
      target: 95
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
      green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
      red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-500' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-500' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Executive Key Performance Indicators</h3>
        <span className="text-[10px] text-gray-500">Updated: {new Date().toLocaleDateString()}</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const colorClasses = getColorClasses(kpi.color);
          const Icon = kpi.icon;
          const isTrendPositive = kpi.isInverse ? kpi.trend < 0 : kpi.trend > 0;
          return (
            <div key={index} className={`${colorClasses.bg} border border-gray-200 rounded-sm p-4 relative overflow-hidden`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wide mb-1">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${colorClasses.text}`}>{kpi.value}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{kpi.subtitle}</p>
                </div>
                <Icon className={`h-8 w-8 ${colorClasses.icon} opacity-50`} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className={`flex items-center text-[10px] ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isTrendPositive ? <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> : <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />}
                  {Math.abs(kpi.trend)}{typeof kpi.trend === 'number' && kpi.value.toString().includes('%') ? '%' : ''} vs last period
                </div>
                {kpi.target && <span className="text-[10px] text-gray-400">Target: {kpi.target}{kpi.value.toString().includes('%') ? '%' : ''}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

