import React, { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Standardized section component for Settings pages
 * Groups related settings together
 */
export function SettingsSection({ title, description, children, className = '' }: SettingsSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface SettingsDividerProps {
  className?: string;
}

/**
 * Visual divider for Settings pages
 */
export function SettingsDivider({ className = '' }: SettingsDividerProps) {
  return <div className={`border-t border-gray-200 ${className}`} />;
}

interface SettingsGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

/**
 * Grid layout for Settings pages
 */
export function SettingsGrid({ children, cols = 2, className = '' }: SettingsGridProps) {
  const colsStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };
  
  return (
    <div className={`grid ${colsStyles[cols]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

