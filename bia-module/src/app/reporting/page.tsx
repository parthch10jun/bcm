'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ServerStackIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PresentationChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Import dashboard sections
import ExecutiveSummary from './components/ExecutiveSummary';
import BIAAnalytics from './components/BIAAnalytics';
import RiskOverview from './components/RiskOverview';
import ITDRMetrics from './components/ITDRMetrics';
import BCPReadiness from './components/BCPReadiness';
import OrganizationalCoverage from './components/OrganizationalCoverage';
import DependencyGapReport from './components/DependencyGapReport';
import ExecutiveKPIs from './components/ExecutiveKPIs';
import BCMLifecycleDashboard from './components/BCMLifecycleDashboard';
import DependencyHeatmap from './components/DependencyHeatmap';

type TabType = 'bcm-dashboard' | 'executive-dashboard';

export default function ReportingDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('bcm-dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('current-fy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'bcm-dashboard' as TabType, name: 'BCM Dashboard', icon: ChartBarIcon, description: 'Head of Department View' },
    { id: 'executive-dashboard' as TabType, name: 'Executive Dashboard', icon: PresentationChartBarIcon, description: 'C-Suite Strategic View' }
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header with Tabs */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              Reporting & Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Business Continuity Management Dashboards & Reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-2 bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="current-fy">Current FY (2025)</option>
              <option value="last-fy">Last FY (2024)</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="ytd">Year to Date</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <ClockIcon className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* BCM Dashboard Tab */}
            {activeTab === 'bcm-dashboard' && (
              <div className="space-y-6">
                <ExecutiveSummary />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <BIAAnalytics />
                  <RiskOverview />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ITDRMetrics />
                  <BCPReadiness />
                </div>
                <DependencyGapReport />
                <OrganizationalCoverage />
              </div>
            )}

            {/* Executive Dashboard Tab */}
            {activeTab === 'executive-dashboard' && (
              <div className="space-y-6">
                {/* Executive KPIs - Full Width */}
                <ExecutiveKPIs />

                {/* BCM Lifecycle Dashboard - BIA → RA → BCP → Test */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">BCM Lifecycle Completeness</h2>
                  <BCMLifecycleDashboard />
                </div>

                {/* Dependency Heatmap */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Dependency Risk Heatmap</h2>
                  <DependencyHeatmap />
                </div>

                {/* Strategic Overview Cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <BIAAnalytics />
                  <RiskOverview />
                </div>

                {/* Dependency Gap for C-Suite */}
                <DependencyGapReport />

                {/* Recovery & Compliance */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ITDRMetrics />
                  <BCPReadiness />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

