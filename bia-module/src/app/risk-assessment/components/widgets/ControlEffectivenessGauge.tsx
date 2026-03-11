'use client';

import { useMemo } from 'react';

interface ControlEffectivenessData {
  strong: number;
  moderate: number;
  weak: number;
  none: number;
}

interface ControlEffectivenessGaugeProps {
  data: ControlEffectivenessData;
}

export default function ControlEffectivenessGauge({ data }: ControlEffectivenessGaugeProps) {
  const total = data.strong + data.moderate + data.weak + data.none;
  
  const effectiveness = useMemo(() => {
    if (total === 0) return 0;
    // Weighted score: Strong=100, Moderate=60, Weak=30, None=0
    const score = (data.strong * 100 + data.moderate * 60 + data.weak * 30) / total;
    return Math.round(score);
  }, [data, total]);

  const getColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', ring: 'stroke-green-500' };
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600', ring: 'stroke-blue-500' };
    if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'stroke-yellow-500' };
    return { bg: 'bg-red-500', text: 'text-red-600', ring: 'stroke-red-500' };
  };

  const color = getColor(effectiveness);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (effectiveness / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            className={color.ring}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${color.text}`}>{effectiveness}%</div>
          <div className="text-xs text-gray-500 mt-1">Overall</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 w-full">
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-sm">
          <span className="text-xs font-medium text-green-900">Strong</span>
          <span className="text-sm font-bold text-green-600">{data.strong}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-sm">
          <span className="text-xs font-medium text-blue-900">Moderate</span>
          <span className="text-sm font-bold text-blue-600">{data.moderate}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-sm">
          <span className="text-xs font-medium text-yellow-900">Weak</span>
          <span className="text-sm font-bold text-yellow-600">{data.weak}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-sm">
          <span className="text-xs font-medium text-red-900">None</span>
          <span className="text-sm font-bold text-red-600">{data.none}</span>
        </div>
      </div>
    </div>
  );
}

