import React, { ReactNode } from 'react';

interface SettingsCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized card component for Settings pages
 * Uses Golf Saudi green theme
 */
export function SettingsCard({ children, className = '' }: SettingsCardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface SettingsCardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: ReactNode;
}

/**
 * Standardized card header for Settings pages
 */
export function SettingsCardHeader({ title, description, icon: Icon, action }: SettingsCardHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-green-600" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

interface SettingsCardBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized card body for Settings pages
 */
export function SettingsCardBody({ children, className = '' }: SettingsCardBodyProps) {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

interface SettingsCardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized card footer for Settings pages
 */
export function SettingsCardFooter({ children, className = '' }: SettingsCardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
}

