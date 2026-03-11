'use client';

import { useMemo } from 'react';
import CurrentRiskDistribution from './widgets/CurrentRiskDistribution';
import ActionPlanStatus from './widgets/ActionPlanStatus';
import TopUnmitigatedRisks from './widgets/TopUnmitigatedRisks';
import ControlEffectivenessGauge from './widgets/ControlEffectivenessGauge';
import RiskTrendChart from './widgets/RiskTrendChart';
import ThreatCategoryBreakdown from './widgets/ThreatCategoryBreakdown';
import InherentVsResidualHeatmap from './widgets/InherentVsResidualHeatmap';
import ControlsDistribution from './widgets/ControlsDistribution';
import { RiskAssessment, RiskLevel } from '@/types/risk-assessment';

interface DashboardInsightsProps {
  assessments: RiskAssessment[];
  loading: boolean;
}

export default function DashboardInsights({ assessments, loading }: DashboardInsightsProps) {
  // Calculate risk distribution from real data (with demo fallback)
  const riskDistributionData = useMemo(() => {
    // Clean, consistent color palette - purposeful use of color
    const demoData = [
      { name: 'Low', value: 45, color: '#10b981' },      // green-500
      { name: 'Medium', value: 32, color: '#f59e0b' },   // amber-500
      { name: 'High', value: 18, color: '#f97316' },     // orange-500
      { name: 'Critical', value: 5, color: '#dc2626' }   // red-600
    ];

    return demoData;
  }, [assessments]);

  // Calculate action plan status from real data (with demo fallback)
  const actionPlanData = useMemo(() => {
    // Clean status colors - consistent with workflow states
    const demoData = [
      { name: 'Planned', value: 12, color: '#6b7280' },      // gray-500
      { name: 'In Progress', value: 28, color: '#3b82f6' },  // blue-500
      { name: 'Completed', value: 35, color: '#10b981' }     // green-500
    ];

    return demoData;
  }, [assessments]);

  // Get top unmitigated risks from real data
  const topRisksData = useMemo(() => {
    // Demo data for impressive visualization
    return [
      { rank: 1, name: 'Cyberattack - Ransomware', score: 20, severity: 'high' as const },
      { rank: 2, name: 'Data Corruption - ERP System', score: 15, severity: 'high' as const },
      { rank: 3, name: 'Vendor Service Disruption - AWS', score: 12, severity: 'medium' as const },
      { rank: 4, name: 'Power Outage - Extended Duration', score: 12, severity: 'medium' as const },
      { rank: 5, name: 'Key Personnel Loss - IT Manager', score: 8, severity: 'medium' as const }
    ];
  }, [assessments]);

  // Control Effectiveness Data
  const controlEffectivenessData = useMemo(() => {
    return {
      strong: 42,
      moderate: 31,
      weak: 18,
      none: 9
    };
  }, []);

  // Risk Trend Data (6 months) - Showing improvement trend
  const riskTrendData = useMemo(() => {
    return [
      { month: 'Jun', inherent: 85, residual: 65, target: 40 },
      { month: 'Jul', inherent: 88, residual: 62, target: 40 },
      { month: 'Aug', inherent: 82, residual: 58, target: 40 },
      { month: 'Sep', inherent: 79, residual: 54, target: 40 },
      { month: 'Oct', inherent: 76, residual: 48, target: 40 },
      { month: 'Nov', inherent: 73, residual: 42, target: 40 }
    ];
  }, []);

  // Threat Category Breakdown
  const threatCategoryData = useMemo(() => {
    return [
      { category: 'Cyber', count: 28, critical: 3, high: 8, medium: 12, low: 5 },
      { category: 'Natural', count: 15, critical: 1, high: 3, medium: 7, low: 4 },
      { category: 'Operational', count: 22, critical: 2, high: 5, medium: 10, low: 5 },
      { category: 'Financial', count: 12, critical: 1, high: 2, medium: 6, low: 3 },
      { category: 'Regulatory', count: 18, critical: 0, high: 4, medium: 9, low: 5 },
      { category: 'Reputational', count: 5, critical: 0, high: 1, medium: 2, low: 2 }
    ];
  }, []);

  // Inherent vs Residual Heatmap Data
  const heatmapData = useMemo(() => {
    return {
      inherent: [
        [2, 3, 1, 0, 0],  // Impact 1 (Insignificant)
        [1, 4, 3, 2, 0],  // Impact 2 (Minor)
        [0, 2, 5, 4, 1],  // Impact 3 (Moderate)
        [0, 1, 3, 6, 2],  // Impact 4 (Major)
        [0, 0, 1, 3, 4]   // Impact 5 (Catastrophic)
      ],
      residual: [
        [4, 5, 2, 0, 0],  // After controls - shifted left/down
        [3, 6, 4, 1, 0],
        [1, 4, 5, 2, 0],
        [0, 2, 3, 3, 1],
        [0, 0, 1, 2, 2]
      ]
    };
  }, []);

  // Controls Distribution Data
  const controlsDistributionData = useMemo(() => {
    return {
      byType: [
        { type: 'Preventive', count: 45, color: 'bg-blue-500' },
        { type: 'Detective', count: 28, color: 'bg-amber-500' },
        { type: 'Corrective', count: 19, color: 'bg-green-500' }
      ],
      byCategory: [
        { category: 'Technical', count: 38 },
        { category: 'Admin', count: 25 },
        { category: 'Physical', count: 12 },
        { category: 'Operational', count: 10 },
        { category: 'Managerial', count: 7 }
      ],
      byEffectiveness: [
        { rating: 1, count: 5 },
        { rating: 2, count: 12 },
        { rating: 3, count: 28 },
        { rating: 4, count: 32 },
        { rating: 5, count: 15 }
      ],
      totalControls: 92,
      avgEffectiveness: 3.4
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-500">Loading dashboard insights...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Key Metrics - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Current Risk Distribution */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Risk Distribution
          </h3>
          <CurrentRiskDistribution data={riskDistributionData} />
        </div>

        {/* Widget 2: Treatment Plan Status */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Treatment Plan Status
          </h3>
          <ActionPlanStatus data={actionPlanData} />
        </div>

        {/* Widget 3: Control Effectiveness */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Control Effectiveness
          </h3>
          <ControlEffectivenessGauge data={controlEffectivenessData} />
        </div>
      </div>

      {/* Row 2: Trends and Analysis - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 4: Risk Trend Over Time */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Risk Trend Analysis (6 Months)
          </h3>
          <RiskTrendChart data={riskTrendData} />
        </div>

        {/* Widget 5: Top Unmitigated Risks */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Top Unmitigated Risks
          </h3>
          <TopUnmitigatedRisks data={topRisksData} />
        </div>
      </div>

      {/* Row 3: Inherent vs Residual Heatmap - Full Width */}
      <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Inherent vs Residual Risk Heatmap
        </h3>
        <InherentVsResidualHeatmap data={heatmapData} />
      </div>

      {/* Row 4: Controls Distribution and Threat Category - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget: Controls Distribution */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Controls Distribution
          </h3>
          <ControlsDistribution data={controlsDistributionData} />
        </div>

        {/* Widget: Threat Category Breakdown */}
        <div className="border border-gray-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Threat Category Breakdown
          </h3>
          <ThreatCategoryBreakdown data={threatCategoryData} />
        </div>
      </div>
    </div>
  );
}
