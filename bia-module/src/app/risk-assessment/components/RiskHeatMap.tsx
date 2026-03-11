'use client';

import { useState, useMemo } from 'react';
import { RiskAssessment } from '@/types/risk-assessment';

interface RiskHeatMapProps {
  onCellClick: (impact: string, likelihood: string) => void;
  assessments: RiskAssessment[];
  loading: boolean;
}

const impactLevels = ['Severe', 'Major', 'Moderate', 'Minor', 'Insignificant'];
const likelihoodLevels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];

export default function RiskHeatMap({ onCellClick, assessments, loading }: RiskHeatMapProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Calculate risk counts from real assessment data
  const riskCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize all cells to 0
    impactLevels.forEach(impact => {
      likelihoodLevels.forEach(likelihood => {
        counts[`${impact}-${likelihood}`] = 0;
      });
    });

    // TODO: Count actual threats from assessments when threat data is available
    // For now, using mock data for visualization
    const mockCounts = {
      'Severe-Almost Certain': 2,
      'Severe-Likely': 3,
      'Severe-Possible': 1,
      'Major-Almost Certain': 4,
      'Major-Likely': 6,
      'Major-Possible': 3,
      'Major-Unlikely': 1,
      'Moderate-Almost Certain': 5,
      'Moderate-Likely': 8,
      'Moderate-Possible': 12,
      'Moderate-Unlikely': 4,
      'Moderate-Rare': 1,
      'Minor-Almost Certain': 3,
      'Minor-Likely': 7,
      'Minor-Possible': 15,
      'Minor-Unlikely': 8,
      'Minor-Rare': 3,
      'Insignificant-Likely': 2,
      'Insignificant-Possible': 8,
      'Insignificant-Unlikely': 12,
      'Insignificant-Rare': 6,
    };

    return { ...counts, ...mockCounts };
  }, [assessments]);

  const getCellColor = (impactIndex: number, likelihoodIndex: number) => {
    // Calculate risk score (Impact x Likelihood)
    const riskScore = (4 - impactIndex) * likelihoodIndex;

    if (riskScore >= 12) return 'from-red-600 to-red-500'; // Critical
    if (riskScore >= 8) return 'from-red-500 to-red-400'; // High
    if (riskScore >= 6) return 'from-orange-500 to-orange-400'; // Medium-High
    if (riskScore >= 4) return 'from-yellow-500 to-yellow-400'; // Medium
    if (riskScore >= 2) return 'from-yellow-400 to-yellow-300'; // Low-Medium
    return 'from-green-400 to-green-300'; // Low
  };

  const getCellTextColor = (impactIndex: number, likelihoodIndex: number) => {
    const riskScore = (4 - impactIndex) * likelihoodIndex;
    return riskScore >= 6 ? 'text-white' : 'text-gray-900';
  };

  const getRiskLabel = (impactIndex: number, likelihoodIndex: number) => {
    const riskScore = (4 - impactIndex) * likelihoodIndex;
    if (riskScore >= 12) return 'CRITICAL';
    if (riskScore >= 8) return 'HIGH';
    if (riskScore >= 6) return 'MEDIUM-HIGH';
    if (riskScore >= 4) return 'MEDIUM';
    if (riskScore >= 2) return 'LOW-MEDIUM';
    return 'LOW';
  };

  const handleCellClick = (impact: string, likelihood: string) => {
    const cellKey = `${impact}-${likelihood}`;
    setSelectedCell(cellKey);
    onCellClick(impact, likelihood);
  };

  const getRiskCount = (impact: string, likelihood: string) => {
    return (riskCounts as any)[`${impact}-${likelihood}`] || 0;
  };

  const totalRisks = useMemo(() => {
    return Object.values(riskCounts).reduce((sum, count) => sum + count, 0);
  }, [riskCounts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-500">Loading heat map data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Interactive Risk Heat Map</h3>
          <p className="text-xs text-gray-500 mt-1">Click on any cell to filter risks by Impact and Likelihood levels</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Threats Mapped</p>
          <p className="text-2xl font-bold text-gray-900">{totalRisks}</p>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-6 gap-2">
            {/* Header Row */}
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">Impact ↓ / Likelihood →</span>
            </div>
            {likelihoodLevels.map((likelihood) => (
              <div key={likelihood} className="bg-gray-50 border border-gray-200 rounded-sm p-3 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">{likelihood}</span>
              </div>
            ))}

            {/* Data Rows */}
            {impactLevels.map((impact, impactIndex) => (
              <>
                {/* Row Header */}
                <div key={`header-${impact}`} className="bg-gray-50 border border-gray-200 rounded-sm p-3 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700 text-center">{impact}</span>
                </div>

                {/* Data Cells */}
                {likelihoodLevels.map((likelihood, likelihoodIndex) => {
                  const cellKey = `${impact}-${likelihood}`;
                  const riskCount = getRiskCount(impact, likelihood);
                  const isSelected = selectedCell === cellKey;
                  const isHovered = hoveredCell === cellKey;
                  const riskLabel = getRiskLabel(impactIndex, likelihoodIndex);

                  return (
                    <div
                      key={cellKey}
                      className={`
                        relative cursor-pointer transition-all duration-300 rounded-sm overflow-hidden
                        ${isSelected ? 'ring-4 ring-gray-900 ring-offset-2 scale-105' : ''}
                        ${isHovered && !isSelected ? 'scale-105 shadow-lg' : ''}
                      `}
                      onClick={() => handleCellClick(impact, likelihood)}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className={`
                          w-full h-24 flex flex-col items-center justify-center
                          bg-gradient-to-br ${getCellColor(impactIndex, likelihoodIndex)}
                          ${getCellTextColor(impactIndex, likelihoodIndex)}
                          border border-gray-300
                          transition-all duration-300
                          ${isHovered ? 'shadow-2xl' : 'shadow-md'}
                        `}
                        style={{
                          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        }}
                      >
                        <div className="text-3xl font-bold">{riskCount}</div>
                        <div className="text-[10px] font-medium mt-1 opacity-90">{riskLabel}</div>
                      </div>

                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-sm px-3 py-2 shadow-lg whitespace-nowrap">
                            <div className="font-semibold">{impact} Impact × {likelihood}</div>
                            <div className="text-gray-300 mt-1">{riskCount} threat{riskCount !== 1 ? 's' : ''} • {riskLabel}</div>
                          </div>
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 mx-auto"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-300 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-300 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">Low-Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-400 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-400 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">Medium-High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-400 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-500 border border-gray-300 rounded-sm shadow-sm"></div>
          <span className="font-medium">Critical</span>
        </div>
      </div>

      {/* Selected Cell Info */}
      {selectedCell && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm">
          <p className="text-xs text-blue-900">
            <strong className="font-semibold">Filter Applied:</strong> Showing risks with <span className="font-semibold">{selectedCell.replace('-', ' impact and ')}</span> likelihood
          </p>
        </div>
      )}
    </div>
  );
}
