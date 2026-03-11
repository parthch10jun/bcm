'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processService } from '@/services/processService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { Process, ProcessStatus } from '@/types/process';
import { OrganizationalUnit } from '@/types/organizationalUnit';
import Pagination from '@/components/Pagination';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function ProcessesLibraryPage() {
  const router = useRouter();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | ''>('');
  const [unitFilter, setUnitFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [processesData, unitsData] = await Promise.all([
        processService.getAll(),
        organizationalUnitService.getAll()
      ]);
      setProcesses(processesData);
      setOrganizationalUnits(unitsData);
    } catch (error) {
      console.error('Error loading processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this process? This action cannot be undone.')) {
      return;
    }

    try {
      await processService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting process:', error);
      alert('Failed to delete process. It may have associated BIA records.');
    }
  };

  // Filter processes
  const filteredProcesses = processes.filter(process => {
    const matchesSearch = !searchTerm ||
      process.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processOwner?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || process.status === statusFilter;
    const matchesUnit = !unitFilter || process.organizationalUnitId.toString() === unitFilter;

    return matchesSearch && matchesStatus && matchesUnit;
  });

  // Calculate metrics
  const totalProcesses = processes.length;
  const activeProcesses = processes.filter(p => p.status === 'ACTIVE').length;
  const draftProcesses = processes.filter(p => p.status === 'DRAFT').length;
  const archivedProcesses = processes.filter(p => p.status === 'ARCHIVED').length;
  const criticalProcesses = processes.filter(p => p.isCritical).length;

  // Pagination
  const totalPages = Math.ceil(filteredProcesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProcesses = filteredProcesses.slice(startIndex, endIndex);

  const getStatusBadge = (status: ProcessStatus) => {
    const styles = {
      ACTIVE: 'bg-green-50 text-green-700 border-green-200',
      DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    const labels = {
      ACTIVE: 'Active',
      DRAFT: 'Draft',
      ARCHIVED: 'Archived'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Process Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">Business processes and operational workflows</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/libraries/processes/new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Process
            </button>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Processes */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Processes</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{totalProcesses}</p>
                    <span className="ml-1 text-xs text-gray-500">processes</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Active</span>
                      <span className="font-medium text-green-600">{activeProcesses}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Draft</span>
                      <span className="font-medium text-yellow-600">{draftProcesses}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Archived</span>
                      <span className="font-medium text-gray-600">{archivedProcesses}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Processes */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical Processes</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{criticalProcesses}</p>
                    <span className="ml-1 text-xs text-gray-500">critical</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">% of Total</span>
                      <span className="font-medium text-red-600">
                        {totalProcesses > 0 ? Math.round((criticalProcesses / totalProcesses) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BIA Coverage */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">BIA Coverage</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                    <span className="ml-1 text-xs text-gray-500">completed</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">With BIA</span>
                      <span className="font-medium text-green-600">0</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Without BIA</span>
                      <span className="font-medium text-gray-600">{totalProcesses}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Status */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Process Status</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{activeProcesses}</p>
                    <span className="ml-1 text-xs text-gray-500">active</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Operational</span>
                      <span className="font-medium text-green-600">{activeProcesses}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">In Development</span>
                      <span className="font-medium text-yellow-600">{draftProcesses}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-900">Filters</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search processes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                {/* Organizational Unit Filter */}
                <div>
                  <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="block w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">All Units</option>
                    {organizationalUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ProcessStatus | '')}
                    className="block w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setUnitFilter('');
                      setStatusFilter('');
                      setCurrentPage(1);
                    }}
                    className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    <XMarkIcon className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Processes Table */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-900">Processes</h3>
                <p className="text-[10px] text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProcesses.length)} of {filteredProcesses.length}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-xs text-gray-500">Loading processes...</p>
              </div>
            ) : filteredProcesses.length === 0 ? (
              <div className="p-12 text-center">
                <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No processes found</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {processes.length === 0
                    ? 'Get started by creating your first process.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                {processes.length === 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/libraries/processes/new')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                    >
                      <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                      Add Process
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Process Name
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Organizational Unit
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Critical
                        </th>
                        <th scope="col" className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedProcesses.map((process) => (
                        <tr key={process.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-sm">
                                <CogIcon className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-xs font-medium text-gray-900">{process.processName}</div>
                                {process.description && (
                                  <div className="text-[10px] text-gray-500 truncate max-w-xs">
                                    {process.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="text-xs text-gray-900">{process.processCode || '-'}</span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="text-xs text-gray-900">{process.organizationalUnitName || '-'}</span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="text-xs text-gray-900">{process.processOwner || '-'}</span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {getStatusBadge(process.status)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {process.isCritical ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                Critical
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Normal
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-xs font-medium">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => router.push(`/libraries/processes/${process.id}/edit`)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(process.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredProcesses.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
