import React from 'react';

interface BIAProgressBarProps {
  completionPercentage: number; // 0-100
  totalProcesses: number;
  approvedProcesses: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * BIA Progress Bar Component
 * 
 * Displays a visual progress bar showing BIA completion percentage.
 * Shows the ratio of approved processes to total processes.
 */
export default function BIAProgressBar({
  completionPercentage,
  totalProcesses,
  approvedProcesses,
  showLabel = true,
  size = 'md',
  className = ''
}: BIAProgressBarProps) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">
            BIA Progress
          </span>
          <span className="text-xs text-gray-600">
            {approvedProcesses}/{totalProcesses} processes ({completionPercentage}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getProgressColor(completionPercentage)} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
}

