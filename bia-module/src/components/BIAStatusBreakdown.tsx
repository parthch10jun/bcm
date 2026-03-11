import React from 'react';
import { BIAStatusBreakdown, PROCESS_BIA_STATUS_CONFIG } from '@/types/bia-status';

interface BIAStatusBreakdownProps {
  breakdown: BIAStatusBreakdown;
  totalProcesses: number;
  className?: string;
}

/**
 * BIA Status Breakdown Component
 * 
 * Displays a detailed breakdown of BIA statuses across all processes.
 * Shows count and percentage for each status type.
 */
export default function BIAStatusBreakdownComponent({
  breakdown,
  totalProcesses,
  className = ''
}: BIAStatusBreakdownProps) {
  const getPercentage = (count: number): number => {
    if (totalProcesses === 0) return 0;
    return Math.round((count / totalProcesses) * 100);
  };

  const statusItems = [
    { key: 'approved', count: breakdown.approved, config: PROCESS_BIA_STATUS_CONFIG.APPROVED },
    { key: 'inProgress', count: breakdown.inProgress, config: PROCESS_BIA_STATUS_CONFIG.IN_PROGRESS },
    { key: 'draft', count: breakdown.draft, config: PROCESS_BIA_STATUS_CONFIG.DRAFT },
    { key: 'submitted', count: breakdown.submitted, config: PROCESS_BIA_STATUS_CONFIG.SUBMITTED },
    { key: 'underReview', count: breakdown.underReview, config: PROCESS_BIA_STATUS_CONFIG.UNDER_REVIEW },
    { key: 'rejected', count: breakdown.rejected, config: PROCESS_BIA_STATUS_CONFIG.REJECTED },
    { key: 'notStarted', count: breakdown.notStarted, config: PROCESS_BIA_STATUS_CONFIG.NOT_STARTED },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
        BIA Status Summary
      </h4>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-3">
          <span>Total Processes:</span>
          <span className="text-gray-900">{totalProcesses}</span>
        </div>

        {statusItems.map(({ key, count, config }) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className={`${config.icon} w-2.5 h-2.5 rounded-full flex-shrink-0`} />
              <span className={`${config.color} font-medium`}>{config.label}:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{count}</span>
              <span className="text-gray-500 text-xs min-w-[3rem] text-right">
                ({getPercentage(count)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>Overall Completion</span>
          <span className="font-medium">{getPercentage(breakdown.approved)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getPercentage(breakdown.approved)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

