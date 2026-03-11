'use client';

import { ReactNode } from 'react';

interface BIAPageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function BIAPageLayout({ 
  children, 
  title, 
  subtitle, 
  actions 
}: BIAPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {(title || actions) && (
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
}
