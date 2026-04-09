'use client';

import Link from 'next/link';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  MapPinIcon,
  CogIcon,
  UserGroupIcon,
  FolderIcon,
  ChevronRightIcon,
  PlusIcon,
  ComputerDesktopIcon,
  BuildingOffice2Icon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline';

export default function LibrariesPage() {
  const libraries = [
    {
      name: 'Organizational Units',
      href: '/libraries/organizational-units',
      icon: BuildingOfficeIcon,
      description: 'Self-referencing hierarchical organizational structure',
      color: 'bg-blue-500',
      count: 21
    },
    {
      name: 'People',
      href: '/libraries/people',
      icon: UserGroupIcon,
      description: 'Manage employees, contractors, and human resources',
      color: 'bg-indigo-500',
      count: 0
    },
    {
      name: 'Locations',
      href: '/libraries/locations',
      icon: MapPinIcon,
      description: 'Manage physical locations and their properties',
      color: 'bg-purple-500',
      count: 4
    },
    {
      name: 'Processes',
      href: '/libraries/processes',
      icon: CogIcon,
      description: 'Manage business processes and their operational details',
      color: 'bg-orange-500',
      count: 25
    },
    {
      name: 'Assets',
      href: '/libraries/assets',
      icon: ComputerDesktopIcon,
      description: 'Manage technology assets and infrastructure inventory',
      color: 'bg-cyan-500',
      count: 6
    },
    {
      name: 'IT Services',
      href: '/libraries/it-services',
      icon: ServerStackIcon,
      description: 'Manage IT services with RTO/RPO and recovery strategies',
      color: 'bg-blue-600',
      count: 15
    },
    {
      name: 'IT Internal Operations',
      href: '/libraries/it-internal-operations',
      icon: ServerStackIcon,
      description: 'BIA for IT\'s own critical services (ISO 27031:2025)',
      color: 'bg-indigo-600',
      count: 6
    },
    {
      name: 'Vendors',
      href: '/libraries/vendors',
      icon: BuildingOffice2Icon,
      description: 'Manage external suppliers and vendor relationships',
      color: 'bg-pink-500',
      count: 10
    },
    {
      name: 'Vital Records',
      href: '/libraries/vital-records',
      icon: DocumentTextIcon,
      description: 'Manage critical documents and information assets',
      color: 'bg-yellow-500',
      count: 0
    },
    {
      name: 'Threats',
      href: '/libraries/threats',
      icon: ShieldExclamationIcon,
      description: 'Manage threats and their impact on BETH3V enablers',
      color: 'bg-red-500',
      count: 29
    },
    {
      name: 'Vulnerabilities',
      href: '/libraries/vulnerabilities',
      icon: ExclamationTriangleIcon,
      description: 'Manage vulnerabilities by category with threat linkages',
      color: 'bg-amber-500',
      count: 0
    },
    {
      name: 'Risks',
      href: '/libraries/risks',
      icon: ExclamationCircleIcon,
      description: 'Manage risk definitions with causes and consequences',
      color: 'bg-rose-500',
      count: 0
    },
    {
      name: 'Controls',
      href: '/libraries/controls',
      icon: ShieldCheckIcon,
      description: 'Manage preventive, detective, and corrective controls',
      color: 'bg-emerald-500',
      count: 0
    },
    // {
    //   name: 'Risk Categories',
    //   href: '/libraries/risk-categories',
    //   icon: ShieldExclamationIcon,
    //   description: 'Define assessment contexts and assign applicable threats',
    //   color: 'bg-teal-500',
    //   count: 9
    // },
    {
      name: 'Risk Mapping',
      href: '/libraries/risk-mapping',
      icon: ChartBarIcon,
      description: 'Map threats to vulnerabilities and risks',
      color: 'bg-violet-500',
      count: 0
    }
  ];

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FolderIcon className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Libraries</h1>
            <p className="mt-2 text-lg text-gray-600">
              Master data management for all business entities
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FolderIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Data Management Hub
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Libraries contain the master data for all business entities. 
                  Use these modules to create, edit, and manage your organizational structure, 
                  services, locations, and processes. This data feeds into the BIA analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Libraries Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {libraries.map((library) => {
          const IconComponent = library.icon;
          return (
            <Link
              key={library.name}
              href={library.href}
              className="group relative bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 ${library.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {library.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{library.count} records</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {library.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                      Manage {library.name.toLowerCase()}
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {libraries.map((library) => (
            <Link
              key={`add-${library.name}`}
              href={`${library.href}/new`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add {library.name.slice(0, -1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
