'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  MapIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import DashboardInsights from './DashboardInsights';
import RiskHeatMap from './RiskHeatMap';
import ThreatIntelligence from './ThreatIntelligence';
import { RiskAssessment, RiskLevel } from '@/types/risk-assessment';

interface StrategicOverviewProps {
  onHeatMapCellClick: (impact: string, likelihood: string) => void;
  assessments: RiskAssessment[];
  loading: boolean;
}

type TabType = 'dashboard' | 'heatmap' | 'threats';

interface Tab {
  id: TabType;
  name: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

export default function StrategicOverview({
  onHeatMapCellClick,
  assessments,
  loading
}: StrategicOverviewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const total = assessments.length;
    const highCritical = assessments.filter(a =>
      a.overallRiskLevel === RiskLevel.HIGH ||
      a.overallRiskLevel === RiskLevel.VERY_HIGH
    ).length;
    const inProgress = assessments.filter(a =>
      a.status === 'IN_PROGRESS' || a.status === 'UNDER_REVIEW'
    ).length;
    const completed = assessments.filter(a => a.status === 'APPROVED').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, highCritical, inProgress, completed, completionRate };
  }, [assessments]);

  const tabs: Tab[] = [
    {
      id: 'dashboard',
      name: 'Dashboard Insights',
      icon: ChartBarIcon,
      component: DashboardInsights
    },
    {
      id: 'heatmap',
      name: 'Risk Heat Map',
      icon: MapIcon,
      component: RiskHeatMap
    },
    {
      id: 'threats',
      name: 'Threat Intelligence',
      icon: ExclamationTriangleIcon,
      component: ThreatIntelligence
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Assessments */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpiMetrics.total}</p>
            </div>
            <div className="h-10 w-10 bg-gray-50 rounded-sm flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* High/Critical Risks */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">High/Critical Risks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpiMetrics.highCritical}</p>
            </div>
            <div className="h-10 w-10 bg-red-50 rounded-sm flex items-center justify-center">
              <FireIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpiMetrics.inProgress}</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpiMetrics.completed}</p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpiMetrics.completionRate}%</p>
            </div>
            <div className="h-10 w-10 bg-gray-50 rounded-sm flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => router.push('/risk-assessment/risk-register')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <ClipboardDocumentListIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Risk Register</p>
              <p className="text-[10px] text-gray-500 truncate">View all risks</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/risk-assessment/settings/scoring')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <CalculatorIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Scoring Models</p>
              <p className="text-[10px] text-gray-500 truncate">Configure matrix</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/risk-assessment/settings/notifications')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <BellIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Notifications</p>
              <p className="text-[10px] text-gray-500 truncate">Manage alerts</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/risk-assessment/settings/reminders')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <ClockIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Reminders</p>
              <p className="text-[10px] text-gray-500 truncate">Set escalations</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/risk-assessment/controls')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Controls</p>
              <p className="text-[10px] text-gray-500 truncate">Manage library</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/risk-assessment/mitigation-performance')}
            className="flex items-center p-2.5 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <ChartBarIcon className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="ml-2 text-left min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Performance</p>
              <p className="text-[10px] text-gray-500 truncate">Track mitigation</p>
            </div>
          </button>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="px-6 pt-6">
          {/* Tab Navigation - Enhanced Segmented Control */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200
                    ${isActive
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <tab.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardInsights assessments={assessments} loading={loading} />}
          {activeTab === 'heatmap' && <RiskHeatMap onCellClick={onHeatMapCellClick} assessments={assessments} loading={loading} />}
          {activeTab === 'threats' && <ThreatIntelligence />}
        </div>
      </div>
    </div>
  );
}
