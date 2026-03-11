'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  PresentationChartBarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

// Import dashboard sections
import ExecutiveSummary from './reporting/components/ExecutiveSummary';
import BIAAnalytics from './reporting/components/BIAAnalytics';
import RiskOverview from './reporting/components/RiskOverview';
import ITDRMetrics from './reporting/components/ITDRMetrics';
import BCPReadiness from './reporting/components/BCPReadiness';
import OrganizationalCoverage from './reporting/components/OrganizationalCoverage';
import DependencyGapReport from './reporting/components/DependencyGapReport';
import ExecutiveKPIs from './reporting/components/ExecutiveKPIs';
import BCMLifecycleDashboard from './reporting/components/BCMLifecycleDashboard';
import DependencyHeatmap from './reporting/components/DependencyHeatmap';

type TabType = 'bcm-dashboard' | 'executive-dashboard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('bcm-dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('current-fy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'bcm-dashboard' as TabType, name: 'AutoResilience Dashboard', icon: ChartBarIcon, description: 'Resilience Overview' },
    { id: 'executive-dashboard' as TabType, name: 'Executive Dashboard', icon: PresentationChartBarIcon, description: 'C-Suite Strategic View' }
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header with Tabs */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-blue-600" />
              Home
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Dashboards & Security Reports
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

        {/* Elegant Center-Aligned Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
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

                {/*Resilience Lifecycle Dashboard */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Resilience Lifecycle</h2>
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
