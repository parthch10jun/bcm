'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { biaStore } from '@/store/bia-store';
import { Department, BusinessProcess } from '@/types/bia';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  TruckIcon,
  ClockIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function DepartmentsLibraryPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);

  useEffect(() => {
    setDepartments(biaStore.getAllDepartments());
    setProcesses(biaStore.getAllProcesses());
  }, []);

  const getDepartmentProcesses = (departmentId: string) => {
    // TODO: Implement proper department-process linking
    return [];
  };

  const getCriticalProcessCount = (departmentId: string) => {
    // TODO: Implement proper critical process counting
    return 0;
  };

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link
                href="/libraries"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Back to Libraries
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Departments Library</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage organizational departments and their resource aggregation
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/libraries/departments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Department
          </Link>
        </div>
      </div>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Departments</div>
                  <div className="text-2xl font-semibold text-gray-900">{departments.length}</div>
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
                  <div className="text-sm font-medium text-gray-500">Total Critical Staff</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {departments.reduce((sum, dept) => sum + (dept.aggregatedResources?.totalCriticalStaff || 0), 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ComputerDesktopIcon className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Key Applications</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {new Set(departments.flatMap(dept => dept.aggregatedResources?.keyApplications || [])).size}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Critical Vendors</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {new Set(departments.flatMap(dept => dept.aggregatedResources?.criticalVendors || [])).size}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departments List */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Departments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage organizational departments and their business continuity profiles
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {departments.map((department) => {
              const departmentProcesses = getDepartmentProcesses(department.id);
              const criticalProcessCount = getCriticalProcessCount(department.id);
              
              return (
                <div key={department.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium text-gray-900 truncate">
                            {department.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {department.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Head: {department.departmentHead}</span>
                            <span>•</span>
                            <span>Staff: {department.aggregatedResources?.totalCriticalStaff || 0}</span>
                            <span>•</span>
                            <span>Processes: {departmentProcesses.length}</span>
                            {criticalProcessCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-red-600 font-medium">
                                  {criticalProcessCount} Critical
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Resource Summary */}
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {department.aggregatedResources?.totalCriticalStaff || 0} Critical Staff
                              </div>
                              <div className="text-xs text-gray-500">
                                {department.aggregatedResources?.keyRoles?.slice(0, 2).join(', ') || 'No roles defined'}
                                {(department.aggregatedResources?.keyRoles?.length || 0) > 2 && '...'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <ComputerDesktopIcon className="h-5 w-5 text-green-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {department.aggregatedResources?.keyApplications?.length || 0} Applications
                              </div>
                              <div className="text-xs text-gray-500">
                                {department.aggregatedResources?.keyApplications?.slice(0, 2).join(', ') || 'No applications'}
                                {(department.aggregatedResources?.keyApplications?.length || 0) > 2 && '...'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <TruckIcon className="h-5 w-5 text-purple-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {department.aggregatedResources?.criticalVendors?.length || 0} Vendors
                              </div>
                              <div className="text-xs text-gray-500">
                                {department.aggregatedResources?.criticalVendors?.slice(0, 2).join(', ') || 'No vendors'}
                                {(department.aggregatedResources?.criticalVendors?.length || 0) > 2 && '...'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/libraries/departments/${department.id}/edit`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                        <Link
                          href={`/libraries/processes?department=${department.id}`}
                          className="inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          View Processes
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {departments.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first department.</p>
            <div className="mt-6">
              <Link
                href="/libraries/departments/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Department
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
