'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import OrganizationLogo from './OrganizationLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  BuildingOfficeIcon,
  CogIcon,
  GlobeAltIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  PhoneIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  BuildingOffice2Icon,
  FolderIcon,
  MapPinIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  ServerIcon,
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  ClipboardDocumentCheckIcon as TaskIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  isSection?: boolean;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    description: 'Overview and reports'
  },
  {
    name: 'My Workspace',
    href: '/dashboard',
    icon: ChartBarIcon,
    description: 'Role-based workspace'
  },
  {
    name: 'My Actions',
    href: '/my-actions',
    icon: TaskIcon,
    description: 'Tasks and workflow items'
  },
  {
    name: 'MITKAT',
    href: '/mitkat-dashboard',
    icon: GlobeAltIcon,
    description: 'Global threat monitoring'
  },
  {
    name: 'Libraries',
    href: '/libraries',
    icon: FolderIcon,
    description: 'Master data management',
    isSection: true,
    children: [
      {
        name: 'Organizational Units',
        href: '/libraries/organizational-units',
        icon: BuildingOfficeIcon,
        description: 'Org structure'
      },
      {
        name: 'Services',
        href: '/libraries/services',
        icon: GlobeAltIcon,
        description: 'Service master data'
      },
      {
        name: 'Locations',
        href: '/libraries/locations',
        icon: MapPinIcon,
        description: 'Location master data'
      },
      {
        name: 'Processes',
        href: '/libraries/processes',
        icon: CogIcon,
        description: 'Process master data'
      },
      {
        name: 'People',
        href: '/libraries/people',
        icon: UserGroupIcon,
        description: 'People library'
      },
      {
        name: 'Assets',
        href: '/libraries/assets',
        icon: ComputerDesktopIcon,
        description: 'Asset inventory'
      },
      {
        name: 'Vendors',
        href: '/libraries/vendors',
        icon: BuildingOffice2Icon,
        description: 'Vendor management'
      },
      {
        name: 'Vital Records',
        href: '/libraries/vital-records',
        icon: DocumentTextIcon,
        description: 'Vital Records Library'
      },
      // {
      //   name: 'Threats',
      //   href: '/libraries/threats',
      //   icon: ShieldExclamationIcon,
      //   description: 'Threat Library'
      // },
      // {
      //   name: 'Vulnerabilities',
      //   href: '/libraries/vulnerabilities',
      //   icon: ExclamationTriangleIcon,
      //   description: 'Vulnerability Library'
      // },
      {
        name: 'Risks',
        href: '/libraries/risks',
        icon: ExclamationCircleIcon,
        description: 'Risk Library'
      },
      {
        name: 'Controls',
        href: '/libraries/controls',
        icon: ShieldExclamationIcon,
        description: 'Control Library'
      },
      // {
      //   name: 'Risk Categories',
      //   href: '/libraries/risk-categories',
      //   icon: ShieldExclamationIcon,
      //   description: 'Risk Category Library'
      // },
      // {
      //   name: 'Risk Mapping',
      //   href: '/libraries/risk-mapping',
      //   icon: ChartBarIcon,
      //   description: 'Threat-Vulnerability-Risk Mapping'
      // }
    ]
  },
  {
    name: 'BIA',
    href: '/bia-records',
    icon: ClipboardDocumentListIcon,
    description: 'Business Impact Analysis'
  },
  {
    name: 'Risk Assessment',
    href: '/risk-assessment',
    icon: ExclamationTriangleIcon,
    description: 'Risk analysis and management'
  },
  {
    name: 'Business Continuity Plan',
    href: '/it-dr-plans',
    icon: ServerIcon,
    description: 'Business Continuity Planning'
  },
  {
    name: 'Incident Response Plan',
    href: '/bcp',
    icon: DocumentTextIcon,
    description: 'Incident response planning'
  },
  {
    name: 'Call Trees',
    href: '/call-trees',
    icon: PhoneIcon,
    description: 'Emergency communication'
  },
  {
    name: 'Issue & Action Tracker',
    href: '/issues',
    icon: ClipboardDocumentCheckIcon,
    description: 'Track issues and actions'
  },
  {
    name: 'Crisis Management Plans',
    href: '/crisis-plans',
    icon: ShieldExclamationIcon,
    description: 'Crisis scenarios with dependency mapping'
  },
  {
    name: 'Cyber Crisis Management',
    href: '/crisis-management',
    icon: ExclamationCircleIcon,
    description: 'Cyber crisis response and management'
  },
  {
    name: 'Testing',
    href: '/testing',
    icon: BeakerIcon,
    description: 'BCP testing and exercises'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    description: 'Platform configuration'
  }
];

interface NavigationProps {
  className?: string;
  organizationLogo?: string | null;
  organizationName?: string;
}

export default function Navigation({
  className = '',
  organizationLogo = null,
  organizationName = 'AutoResilience'
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    // Hide Settings for non-admin users
    if (item.name === 'Settings' && !isAdmin) {
      return false;
    }
    return true;
  });

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (!isCollapsed) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Add small delay before expanding (200ms)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    if (!isCollapsed) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Add delay before collapsing (300ms)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  // Determine if sidebar should be expanded (either not collapsed, or collapsed but hovered)
  const isExpanded = !isCollapsed || isHovered;

  // Get initials from organization name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Take first 2 initials
  };

  // Initialize expanded sections based on current path
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const initial: string[] = [];
    if (pathname.includes('/libraries')) {
      initial.push('Libraries');
    }
    return initial;
  });

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Auto-expand sections if we navigate to their pages
  useEffect(() => {
    if (pathname.includes('/libraries') && !expandedSections.includes('Libraries')) {
      setExpandedSections(prev => [...prev, 'Libraries']);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-2.5 rounded-lg shadow-lg text-white hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bcm-sidebar transform
          lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-16'}
          ${className}
        `}
        style={{
          transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Header with AutoBCM Branding */}
          <div className="flex items-center justify-between h-20 px-4 border-b border-slate-200/60 backdrop-blur-sm">
            {isExpanded ? (
              <>
                <div className="flex items-center justify-center w-full">
                  {/* AutoBCM Branding */}
                  <div className="flex-shrink-0 w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                      <span className="text-slate-700">Auto</span>
                      <span className="relative inline-block ml-0.5">
                        <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent font-extrabold">
                          BCM
                        </span>
                        {/* Glow effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-md opacity-40 animate-pulse"></span>
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Theme toggle and mobile close button */}
                <div className="flex items-center space-x-2">
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  >
                    {theme === 'light' ? (
                      <MoonIcon className="h-4 w-4" />
                    ) : (
                      <SunIcon className="h-4 w-4" />
                    )}
                  </button>

                  {/* Mobile close button */}
                  <div className="lg:hidden">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full py-2">
                {/* Collapsed: AutoBCM Icon */}
                <div className="relative group">
                  {/* Outer glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Main icon container */}
                  <div className="relative w-11 h-11 flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-md border border-slate-300 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                    <span className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      BCM
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto bcm-nav-scrollable">
            {filteredNavigation.map((item) => {
              // Check if any child is active
              const hasActiveChild = item.children?.some(child => pathname.startsWith(child.href));

              // Only highlight parent if no child is active
              const isActive = item.name === 'BIA'
                ? (pathname.includes('/bia-records') || pathname.includes('/consolidation'))
                : item.name === 'Risk Assessment'
                ? pathname.includes('/risk-assessment')
                : item.name === 'Libraries'
                ? (pathname === '/libraries' || (pathname.includes('/libraries') && !hasActiveChild))
                : pathname === item.href;

              // Handle Libraries section with children
              if (item.isSection && item.children) {
                const isSectionExpanded = expandedSections.includes(item.name);

                if (!isExpanded) {
                  // Collapsed: Show only icon with tooltip
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        bcm-nav-item rounded-lg transition-all duration-200 flex items-center justify-center
                        ${isActive ? 'bcm-nav-item active' : ''}
                      `}
                      title={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  );
                }

                return (
                  <div key={item.name} className="space-y-1">
                    {/* Section Header - Clickable to navigate */}
                    <div className="relative">
                      <Link
                        href={item.href}
                        className={`
                          w-full bcm-nav-item transition-all duration-200 text-left group flex items-center
                          ${isActive ? 'active' : ''}
                        `}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon
                          className="mr-2.5 h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs truncate">{item.name}</div>
                          <div className="text-[10px] opacity-70 leading-tight truncate">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                      {/* Toggle button for expanding/collapsing */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(item.name);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label={isSectionExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronRightIcon
                          className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-300 ${isSectionExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Children - Only show when expanded */}
                    {isSectionExpanded && (
                      <div className="ml-6 space-y-0.5 animate-fadeIn">
                        {item.children.map((child) => {
                          const childIsActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`
                                bcm-nav-item transition-all duration-200 text-xs group
                                ${childIsActive ? 'active' : ''}
                              `}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <child.icon
                                className="mr-2.5 h-3.5 w-3.5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs truncate">{child.name}</div>
                                <div className="text-[10px] opacity-70 leading-tight truncate">
                                  {child.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular navigation items
              if (!isExpanded) {
                // Collapsed: Show only icon with tooltip
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      bcm-nav-item transition-all duration-200 flex items-center justify-center group
                      ${isActive ? 'active' : ''}
                    `}
                    title={item.name}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    bcm-nav-item transition-all duration-200 group
                    ${isActive ? 'active' : ''}
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon
                    className="mr-2.5 h-4 w-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">{item.name}</div>
                    <div className="text-[10px] opacity-70 leading-tight truncate">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>


        </div>
      </div>
    </>
  );
}
