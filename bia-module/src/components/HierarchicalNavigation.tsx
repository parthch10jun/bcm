'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfileSwitcher } from './UserProfileSwitcher';
import {
  BuildingOfficeIcon,
  CogIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ChevronRightIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  isActive?: boolean;
}

interface HierarchicalNavigationProps {
  className?: string;
}

export default function HierarchicalNavigation({ className = '' }: HierarchicalNavigationProps) {
  const pathname = usePathname();

  // Determine current module based on pathname - no state needed, compute directly
  const currentModule = (pathname.includes('/bia-records') ||
                        pathname.includes('/consolidation')) ? 'bia' : 'main';

  const mainNavigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      description: 'Overview and analytics',
      isActive: pathname === '/'
    },
    {
      name: 'BIA',
      href: '/bia-records',
      icon: ClipboardDocumentListIcon,
      description: 'Business Impact Analysis',
      isActive: currentModule === 'bia'
    },
    {
      name: 'Risk Assessment',
      href: '/risk-assessment',
      icon: ExclamationTriangleIcon,
      description: 'Risk analysis and management',
      isActive: pathname.includes('/risk-assessment')
    },
    {
      name: 'Incident Response Plan',
      href: '/bcp',
      icon: DocumentTextIcon,
      description: 'Incident response planning',
      isActive: pathname.includes('/bcp')
    },
    {
      name: 'Issue & Action Tracker',
      href: '/issues',
      icon: ClipboardDocumentCheckIcon,
      description: 'Track issues and actions',
      isActive: pathname.includes('/issues')
    },
    {
      name: 'Testing',
      href: '/testing',
      icon: BeakerIcon,
      description: 'BCP testing and exercises',
      isActive: pathname.includes('/testing')
    },
    {
      name: 'Reporting',
      href: '/reporting',
      icon: ChartBarIcon,
      description: 'Reports and analytics',
      isActive: pathname.includes('/reporting')
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      description: 'Platform configuration',
      isActive: pathname.includes('/settings')
    }
  ];

  const biaNavigation: NavigationItem[] = [
    {
      name: 'Records',
      href: '/bia-records',
      icon: ClipboardDocumentListIcon,
      description: 'BIA management',
      isActive: pathname.includes('/bia-records')
    },
    {
      name: 'Consolidation',
      href: '/consolidation',
      icon: ChartBarIcon,
      description: 'Organization view',
      isActive: pathname.includes('/consolidation')
    }
  ];

  // Always use BIA navigation since this component is only used in BIA context
  const currentNavigation = biaNavigation;

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* BIA Navigation Tabs with User Profile - Elegant Center-Aligned Pill Style */}
      <div className="px-6 py-4 flex items-center justify-center relative">
        {/* Elegant Center-Aligned Tab Switcher */}
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          {currentNavigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.isActive;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile Switcher - Positioned on the right */}
        <div className="absolute right-6 flex-shrink-0">
          <UserProfileSwitcher />
        </div>
      </div>
    </div>
  );
}

// Context indicator component for showing current level
export function BIALevelIndicator() {
  const pathname = usePathname();
  
  const getCurrentLevel = () => {
    if (pathname.includes('/bia-records')) return { level: 'BIA Record', color: 'bg-orange-100 text-orange-800' };
    if (pathname.includes('/consolidation')) return { level: 'Consolidation', color: 'bg-gray-100 text-gray-800' };
    return null;
  };

  const currentLevel = getCurrentLevel();
  
  if (!currentLevel) return null;

  return (
    <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Current Analysis Level:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentLevel.color}`}>
            {currentLevel.level}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          {currentLevel.level === 'BIA Record' && 'Individual BIA management'}
          {currentLevel.level === 'Consolidation' && 'Organization-wide summary'}
        </div>
      </div>
    </div>
  );
}
