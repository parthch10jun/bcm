import React from 'react';
import { ProcessBIAStatus, UnitBIAStatus, getProcessStatusConfig, getUnitStatusConfig } from '@/types/bia-status';

interface BIAStatusBadgeProps {
  status: ProcessBIAStatus | UnitBIAStatus;
  type?: 'process' | 'unit';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * BIA Status Badge Component
 * 
 * Displays a colored badge showing the BIA status of a process or organizational unit.
 * Supports different sizes and can show/hide icon and label.
 */
export default function BIAStatusBadge({
  status,
  type = 'process',
  size = 'md',
  showIcon = true,
  showLabel = true,
  className = ''
}: BIAStatusBadgeProps) {
  const config = type === 'process' 
    ? getProcessStatusConfig(status as ProcessBIAStatus)
    : getUnitStatusConfig(status as UnitBIAStatus);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.bgColor} ${config.color}
        ${sizeClasses[size]}
        ${className}
      `}
      title={config.description}
    >
      {showIcon && (
        <span className={`${config.icon} ${dotSizeClasses[size]} rounded-full flex-shrink-0`} />
      )}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

