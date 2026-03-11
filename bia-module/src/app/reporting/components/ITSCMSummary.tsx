'use client';

import Link from 'next/link';
import {
  ServerStackIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  CubeIcon,
  ArrowRightIcon,
  GlobeAltIcon
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

export default function ITSCMSummary() {
  // Mock ITSCM data - in production, this would come from API
  const kpiData = {
    totalServices: { value: 156, critical: 42, trend: 5 },
    rtoCompliance: { value: 89, atRisk: 7, trend: 3 },
    averageRTO: { value: 4.2, target: 4.0, trend: -5 },
    recoveryCapability: { score: 92, tests: 24, trend: 8 }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900">ITSCM Executive Summary</h2>
        <span className="text-xs text-gray-500">FY 2025 Overview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total IT Services"
          value={kpiData.totalServices.value}
          subtitle={`${kpiData.totalServices.critical} Critical Services`}
          icon={ServerStackIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: kpiData.totalServices.trend, isPositive: true, label: 'vs last FY' }}
          status="success"
        />

        <KPICard
          title="RTO Compliance"
          value={`${kpiData.rtoCompliance.value}%`}
          subtitle={`${kpiData.rtoCompliance.atRisk} Services At Risk`}
          icon={CheckCircleIcon}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          trend={{ value: kpiData.rtoCompliance.trend, isPositive: true, label: 'improvement' }}
          status={kpiData.rtoCompliance.atRisk > 5 ? 'warning' : 'success'}
        />

        <KPICard
          title="Average RTO"
          value={`${kpiData.averageRTO.value}h`}
          subtitle={`Target: ${kpiData.averageRTO.target}h`}
          icon={ClockIcon}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: Math.abs(kpiData.averageRTO.trend), isPositive: kpiData.averageRTO.trend < 0, label: 'vs target' }}
          status={kpiData.averageRTO.value <= kpiData.averageRTO.target ? 'success' : 'warning'}
        />

        <KPICard
          title="Recovery Capability"
          value={`${kpiData.recoveryCapability.score}%`}
          subtitle={`${kpiData.recoveryCapability.tests} Tests Completed`}
          icon={ShieldCheckIcon}
          iconColor="text-teal-600"
          iconBgColor="bg-teal-50"
          trend={{ value: kpiData.recoveryCapability.trend, isPositive: true, label: 'readiness' }}
          status={kpiData.recoveryCapability.score >= 85 ? 'success' : 'warning'}
        />
      </div>

      {/* Quick Alerts */}
      <div className="mt-5 p-4 bg-gray-50 rounded-sm">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">ITSCM Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-xs">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-700">7 services require RTO review</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
            <span className="text-gray-700">3 recovery tests overdue</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span className="text-gray-700">Application mapping 95% complete</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5 flex items-center gap-3">
        <Link
          href="/libraries/it-services"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <ServerStackIcon className="h-4 w-4 mr-2" />
          Manage IT Services
          <ArrowRightIcon className="h-3 w-3 ml-2" />
        </Link>
        <Link
          href="/libraries/it-services/application-mapping"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-purple-300 rounded-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          View Application Map
          <ArrowRightIcon className="h-3 w-3 ml-2" />
        </Link>
      </div>
    </div>
  );
}

