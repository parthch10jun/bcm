'use client';

import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ServerStackIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  status?: 'success' | 'warning' | 'danger';
}

function KPICard({ title, value, subtitle, icon: Icon, iconColor, iconBgColor, trend, status }: KPICardProps) {
  const statusColors = {
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    danger: 'border-l-4 border-l-red-500'
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-sm p-5 hover:shadow-md transition-shadow ${status ? statusColors[status] : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-600">{subtitle}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              {trend.isPositive ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-sm ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveSummary() {
  // Mock data - in production, this would come from API
  const kpiData = {
    biaCompleted: { value: 47, total: 52, trend: 12 },
    riskAssessments: { active: 38, critical: 5, trend: -8 },
    drPlans: { active: 24, tested: 21, trend: 15 },
    bcpReadiness: { score: 87, incidents: 2, trend: 5 }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900">Executive Summary</h2>
        <span className="text-xs text-gray-500">FY 2025 Overview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="BIA Completion"
          value={`${kpiData.biaCompleted.value}/${kpiData.biaCompleted.total}`}
          subtitle={`${Math.round((kpiData.biaCompleted.value / kpiData.biaCompleted.total) * 100)}% Complete`}
          icon={DocumentTextIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: kpiData.biaCompleted.trend, isPositive: true, label: 'vs last FY' }}
          status="success"
        />

        <KPICard
          title="Active Risks"
          value={kpiData.riskAssessments.active}
          subtitle={`${kpiData.riskAssessments.critical} Critical Risks`}
          icon={ShieldCheckIcon}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          trend={{ value: Math.abs(kpiData.riskAssessments.trend), isPositive: kpiData.riskAssessments.trend < 0, label: 'vs last quarter' }}
          status={kpiData.riskAssessments.critical > 3 ? 'warning' : 'success'}
        />

        <KPICard
          title="DR Plans Active"
          value={kpiData.drPlans.active}
          subtitle={`${kpiData.drPlans.tested} Successfully Tested`}
          icon={ServerStackIcon}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: kpiData.drPlans.trend, isPositive: true, label: 'test success rate' }}
          status="success"
        />

        <KPICard
          title="Incident Response Readiness"
          value={`${kpiData.bcpReadiness.score}%`}
          subtitle={`${kpiData.bcpReadiness.incidents} Active Incidents`}
          icon={ClipboardDocumentCheckIcon}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          trend={{ value: kpiData.bcpReadiness.trend, isPositive: true, label: 'improvement' }}
          status={kpiData.bcpReadiness.score >= 80 ? 'success' : 'warning'}
        />
      </div>

      {/* Quick Alerts */}
      <div className="mt-5 p-4 bg-gray-50 rounded-sm">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Security Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-xs">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-700">5 threat assessments pending</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
            <span className="text-gray-700">3 incident response tests overdue</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span className="text-gray-700">ISO 27001 audit scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

