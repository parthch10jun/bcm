'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { biaStore } from '@/store/bia-store';
import { BusinessProcess, Department } from '@/types/bia';
import {
  CogIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

function ProcessesPageContent() {
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<BusinessProcess[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  
  const searchParams = useSearchParams();
  const departmentFilter = searchParams.get('department');

  useEffect(() => {
    const allProcesses = biaStore.getAllProcesses();
    const allDepartments = biaStore.getAllDepartments();
    
    setProcesses(allProcesses);
    setDepartments(allDepartments);
    
    // Set initial department filter from URL
    if (departmentFilter) {
      setSelectedDepartment(departmentFilter);
    }
  }, [departmentFilter]);

  useEffect(() => {
    let filtered = processes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(process => 
        process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment) {
      // TODO: Implement department filtering when department association is added to BusinessProcess
      // filtered = filtered.filter(process => process.departmentId === selectedDepartment);
    }

    // Filter by criticality
    if (criticalityFilter) {
      if (criticalityFilter === 'critical') {
        filtered = filtered.filter(process => process.criticalityScore >= 3);
      } else if (criticalityFilter === 'high') {
        filtered = filtered.filter(process => process.criticalityScore >= 2 && process.criticalityScore < 3);
      } else if (criticalityFilter === 'medium') {
        filtered = filtered.filter(process => process.criticalityScore >= 1 && process.criticalityScore < 2);
      } else if (criticalityFilter === 'low') {
        filtered = filtered.filter(process => process.criticalityScore < 1);
      }
    }

    // Sort by criticality score (highest first)
    filtered.sort((a, b) => b.criticalityScore - a.criticalityScore);

    setFilteredProcesses(filtered);
  }, [processes, searchTerm, selectedDepartment, criticalityFilter]);

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || 'Unknown Department';
  };

  const getCriticalityColor = (score: number) => {
    if (score >= 3) return 'bg-red-500';
    if (score >= 2) return 'bg-orange-500';
    if (score >= 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCriticalityLabel = (score: number) => {
    if (score >= 3) return 'Critical';
    if (score >= 2) return 'High';
    if (score >= 1) return 'Medium';
    return 'Low';
  };

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Processes Analytics</h1>
              <p className="mt-2 text-lg text-gray-600">
                Operational core - detailed process analysis and dependency mapping - Read-only view
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
            <p className="text-sm text-orange-700 font-medium">
              📊 Analytics View - Manage data in <Link href="/libraries/processes" className="underline hover:text-orange-800">Processes Library</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CogIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Processes</div>
                  <div className="text-2xl font-semibold text-gray-900">{processes.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Critical Processes</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {processes.filter(p => p.criticalityScore >= 3).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Avg RTO</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {processes.length > 0 ? '4 hours' : '0'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Staff Required</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {processes.reduce((sum, p) => sum + (p.staffRequirements.minimumStaffCount || 0), 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              {/* Criticality Filter */}
              <select
                value={criticalityFilter}
                onChange={(e) => setCriticalityFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Criticality Levels</option>
                <option value="critical">Critical (3.0+)</option>
                <option value="high">High (2.0-2.9)</option>
                <option value="medium">Medium (1.0-1.9)</option>
                <option value="low">Low (&lt;1.0)</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('');
                  setCriticalityFilter('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Processes List */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Processes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredProcesses.length} of {processes.length} processes
                </p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProcesses.map((process) => (
              <div key={process.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 ${getCriticalityColor(process.criticalityScore)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-sm font-medium">
                            {process.criticalityScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-gray-900 truncate">
                            {process.name}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            process.criticalityScore >= 3 ? 'bg-red-100 text-red-800' :
                            process.criticalityScore >= 2 ? 'bg-orange-100 text-orange-800' :
                            process.criticalityScore >= 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {getCriticalityLabel(process.criticalityScore)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {process.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Owner: {process.processOwner}</span>
                          <span>•</span>
                          <span>Type: {process.processType}</span>
                          <span>•</span>
                          <span>Priority: {process.priorityRank}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">RTO: {process.rto}</div>
                            <div className="text-xs text-gray-500">Recovery Time</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">MTD: {process.mtd}</div>
                            <div className="text-xs text-gray-500">Max Tolerable</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{process.staffRequirements.minimumStaffCount || 0}</div>
                            <div className="text-xs text-gray-500">Min Staff</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ComputerDesktopIcon className="h-5 w-5 text-purple-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{process.itInfrastructureRequirements.length}</div>
                            <div className="text-xs text-gray-500">IT Systems</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Single Points of Failure Alert */}
                    {process.spofAssessment && process.spofAssessment.overallRiskLevel !== 'Low' && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">
                            SPOF Risk Level: {process.spofAssessment.overallRiskLevel}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/bia-records/new?process=${process.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                        Conduct BIA
                      </Link>
                      <Link
                        href={`/processes/${process.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProcesses.length === 0 && processes.length > 0 && (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No processes found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}

        {processes.length === 0 && (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No processes</h3>
            <p className="mt-1 text-sm text-gray-500">No process data available for analysis.</p>
            <div className="mt-6">
              <Link
                href="/libraries/processes"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Manage Processes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProcessesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <ProcessesPageContent />
    </Suspense>
  );
}
