'use client';

import Navigation from './Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageLayout({ 
  children, 
  title, 
  subtitle, 
  actions 
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Navigation />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        {(title || actions) && (
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4 sm:px-8">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center space-x-3">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 sm:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
