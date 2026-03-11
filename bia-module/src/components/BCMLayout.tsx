'use client';

import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import HierarchicalNavigation from '@/components/HierarchicalNavigation';
import { usePathname } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';

interface BCMLayoutProps {
  children: ReactNode;
}

export default function BCMLayout({ children }: BCMLayoutProps) {
  const pathname = usePathname();
  const { settings } = useOrganization();

  // Determine if we should show hierarchical navigation within the main content
  // Only show BIA navigation for actual BIA pages (not Libraries pages)
  const showBIANavigation = pathname.includes('/bia-records') ||
                           pathname.includes('/consolidation');

  // Always use the same layout structure with fixed sidebar
  return (
    <div className="bcm-layout-container">
      {/* Fixed Left Sidebar - Always Present */}
      <Navigation
        organizationLogo={settings.logo}
        organizationName={settings.name}
      />

      {/* Main Content Area */}
      <main className="bcm-main-content">
        {/* Hierarchical Navigation (when in BIA context) */}
        {showBIANavigation && (
          <div className="bcm-secondary-nav">
            <HierarchicalNavigation />
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="bcm-content-scrollable">
          {showBIANavigation ? (
            // BIA content without additional padding since HierarchicalNavigation handles it
            <div className="py-6">
              {children}
            </div>
          ) : (
            // Standard content
            children
          )}
        </div>
      </main>
    </div>
  );
}
