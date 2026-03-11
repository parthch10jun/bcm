'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { OrganizationalUnit, OrganizationalUnitTree, UNIT_TYPE_LABELS, UNIT_TYPE_COLORS } from '@/types/organizationalUnit';
import OrganizationalTreeView from '@/components/OrganizationalTreeView';
import BIAStatusBadge from '@/components/BIAStatusBadge';
import { getMockBIAStatus, hasMockBIAData } from '@/data/mockBIAStatus';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  UserGroupIcon,
  PlusIcon,
  TableCellsIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

export default function OrganizationalUnitsPage() {
  const [tree, setTree] = useState<OrganizationalUnitTree | null>(null);
  const [allUnits, setAllUnits] = useState<OrganizationalUnit[]>([]);
  // REMOVED: biaEligibleUnits state - all units can now have BIAs
  const [selectedUnit, setSelectedUnit] = useState<OrganizationalUnit | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  // REMOVED: showBiaEligibleOnly state - all units can now have BIAs
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    // Load organizational data
    const loadData = async () => {
      try {
        setLoading(true);
        const [orgTree, units] = await Promise.all([
          organizationalUnitService.getTree(),
          organizationalUnitService.getAll()
          // REMOVED: getBiaEligibleUnits() - all units can now have BIAs
        ]);

        setTree(orgTree);
        setAllUnits(units);
        // REMOVED: setBiaEligibleUnits - all units can now have BIAs
      } catch (error) {
        console.error('Error loading organizational units:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectUnit = (unit: OrganizationalUnit) => {
    setSelectedUnit(unit);
  };

  const handleDeleteUnit = async (unit: OrganizationalUnit) => {
    // Check if unit has subordinates
    if (unit.childCount && unit.childCount > 0) {
      alert(`Cannot delete "${unit.unitName}" because it has ${unit.childCount} subordinate unit(s). Please delete or reassign subordinate units first.`);
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${unit.unitName}"?\n\nThis action cannot be undone.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await organizationalUnitService.delete(unit.id);
      alert(`Successfully deleted "${unit.unitName}"`);

      // Reload data
      const [orgTree, units] = await Promise.all([
        organizationalUnitService.getTree(),
        organizationalUnitService.getAll()
        // REMOVED: getBiaEligibleUnits() - all units can now have BIAs
      ]);

      setTree(orgTree);
      setAllUnits(units);
      // REMOVED: setBiaEligibleUnits - all units can now have BIAs

      // Clear selection if deleted unit was selected
      if (selectedUnit?.id === unit.id) {
        setSelectedUnit(null);
      }
    } catch (error: any) {
      console.error('Error deleting unit:', error);
      const errorMessage = error.message || 'Failed to delete organizational unit';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Filter units based on search and type filter
  const filteredUnits = allUnits.filter(unit => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      unit.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.unitCode?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = typeFilter === 'ALL' || unit.unitType === typeFilter;

    // NEW ARCHITECTURE: All units can have BIAs, so no filtering needed
    // Keeping the filter UI for backward compatibility but it doesn't filter anything
    const matchesBiaFilter = true;

    return matchesSearch && matchesType && matchesBiaFilter;
  });

  const totalEmployees = allUnits.reduce((sum, unit) => sum + (unit.employeeCount || 0), 0);
  const divisionsCount = allUnits.filter(u => u.unitType === 'DIVISION').length;
  const departmentsCount = allUnits.filter(u => u.unitType === 'DEPARTMENT').length;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-xs text-gray-500">Loading organizational units...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Organizational Units Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">Organizational structure and hierarchy management</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Bulk upload functionality coming soon')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1" />
              Bulk Upload
            </button>
            <Link
              href="/libraries/organizational-units/new"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Unit
            </Link>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-3">
            {/* Total Units */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Units</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{allUnits.length}</p>
                    <span className="ml-1 text-xs text-gray-500">units</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Organizations</span>
                      <span className="font-medium text-gray-900">{allUnits.filter(u => u.unitType === 'ORGANIZATION').length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Divisions</span>
                      <span className="font-medium text-gray-900">{divisionsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Departments</span>
                      <span className="font-medium text-gray-900">{departmentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Employees */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Employees</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{totalEmployees.toLocaleString()}</p>
                    <span className="ml-1 text-xs text-gray-500">people</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Avg per Unit</span>
                      <span className="font-medium text-gray-900">
                        {allUnits.length > 0 ? Math.round(totalEmployees / allUnits.length) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hierarchy Depth */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Hierarchy</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{divisionsCount}</p>
                    <span className="ml-1 text-xs text-gray-500">divisions</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Departments</span>
                      <span className="font-medium text-gray-900">{departmentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Teams</span>
                      <span className="font-medium text-gray-900">{allUnits.filter(u => u.unitType === 'TEAM').length}</span>
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
                      <span className="font-medium text-gray-600">{allUnits.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search units by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="ALL">All Types</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="DIVISION">Divisions</option>
                <option value="DEPARTMENT">Departments</option>
                <option value="TEAM">Teams</option>
              </select>

              {/* Clear Filters */}
              {(searchQuery || typeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('ALL');
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('tree')}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm ${
                  viewMode === 'tree'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChartBarIcon className="h-3.5 w-3.5 mr-1" />
                Tree View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm ${
                  viewMode === 'table'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <TableCellsIcon className="h-3.5 w-3.5 mr-1" />
                Table View
              </button>
            </div>

            {selectedUnit && (
              <div className="text-xs text-gray-600">
                Selected: <span className="font-medium text-gray-900">{selectedUnit.fullPath}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Main View */}
            <div className="lg:col-span-2">
              {viewMode === 'tree' && tree ? (
                <OrganizationalTreeView
                  tree={tree}
                  onSelectUnit={handleSelectUnit}
                  onDeleteUnit={handleDeleteUnit}
                  selectedUnitId={selectedUnit?.id}
                  showBiaEligibleOnly={false}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Head
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Employees
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUnits.map((unit) => (
                        <tr
                          key={unit.id}
                          onClick={() => handleSelectUnit(unit)}
                          className={`cursor-pointer hover:bg-gray-50 ${
                            selectedUnit?.id === unit.id ? 'bg-gray-100' : ''
                          }`}
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-xs font-medium text-gray-900">{unit.unitName}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{unit.unitCode}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${UNIT_TYPE_COLORS[unit.unitType]}`}>
                              {UNIT_TYPE_LABELS[unit.unitType]}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {unit.unitHead || '-'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {unit.employeeCount?.toLocaleString() || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              {selectedUnit ? (
                <div className="bg-white border border-gray-200 rounded-sm">
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Unit Details</h3>
                  </div>

                  <div className="p-3">
                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-3">
                      <Link
                        href={`/libraries/organizational-units/${selectedUnit.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <PencilIcon className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUnit(selectedUnit)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-sm text-red-700 bg-white hover:bg-red-50"
                        title="Delete Unit"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Unit Name</label>
                        <p className="mt-0.5 text-xs text-gray-900">{selectedUnit.unitName}</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Unit Code</label>
                        <p className="mt-0.5 text-xs font-mono text-gray-900">{selectedUnit.unitCode}</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Full Path</label>
                        <p className="mt-0.5 text-xs text-gray-900">{selectedUnit.fullPath}</p>
                      </div>

                      {selectedUnit.parentUnitId && (
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-0.5">Parent Unit</label>
                          <button
                            onClick={() => {
                              const parent = allUnits.find(u => u.id === selectedUnit.parentUnitId);
                              if (parent) {
                                handleSelectUnit(parent);
                              }
                            }}
                            className="text-xs text-gray-900 hover:text-gray-700 hover:underline text-left"
                          >
                            {allUnits.find(u => u.id === selectedUnit.parentUnitId)?.unitName || 'Unknown'}
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</label>
                        <p className="mt-0.5">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${UNIT_TYPE_COLORS[selectedUnit.unitType]}`}>
                            {UNIT_TYPE_LABELS[selectedUnit.unitType]}
                          </span>
                        </p>
                      </div>

                      {/* BIA Status Section - All units can have BIAs now */}
                      {hasMockBIAData(selectedUnit.id) && (() => {
                        const biaStatus = getMockBIAStatus(selectedUnit.id);
                        if (!biaStatus) return null;

                        return (
                          <div className="pt-2.5 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">BIA Status</label>
                              <BIAStatusBadge
                                status={biaStatus.overallStatus}
                                type="unit"
                                size="sm"
                              />
                            </div>

                            {/* Compact Summary */}
                            <div className="space-y-0.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-600">Total Processes:</span>
                                <span className="font-medium text-gray-900">{biaStatus.totalProcesses}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-600">Approved:</span>
                                <span className="font-medium text-green-600">{biaStatus.statusBreakdown.approved}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-600">Completion:</span>
                                <span className="font-medium text-gray-900">{biaStatus.completionPercentage}%</span>
                              </div>
                            </div>

                            {/* Simple Progress Bar */}
                            <div className="mt-1.5">
                              <div className="w-full bg-gray-200 rounded-sm h-1">
                                <div
                                  className={`h-1 rounded-sm transition-all ${
                                    biaStatus.completionPercentage === 100 ? 'bg-green-600' :
                                    biaStatus.completionPercentage >= 50 ? 'bg-gray-900' :
                                    'bg-gray-600'
                                  }`}
                                  style={{ width: `${biaStatus.completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {selectedUnit.unitHead && (
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Unit Head</label>
                          <p className="mt-0.5 text-xs text-gray-900">{selectedUnit.unitHead}</p>
                          {selectedUnit.unitHeadEmail && (
                            <p className="text-[10px] text-gray-500">{selectedUnit.unitHeadEmail}</p>
                          )}
                        </div>
                      )}

                      {selectedUnit.employeeCount && (
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Employees</label>
                          <p className="mt-0.5 text-xs text-gray-900">{selectedUnit.employeeCount.toLocaleString()}</p>
                        </div>
                      )}

                      {selectedUnit.description && (
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Description</label>
                          <p className="mt-0.5 text-xs text-gray-900">{selectedUnit.description}</p>
                        </div>
                      )}

                      {/* Subordinate Units Section */}
                      {selectedUnit.childCount && selectedUnit.childCount > 0 && (
                        <div className="pt-2.5 border-t border-gray-200">
                          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Subordinate Units ({selectedUnit.childCount})
                          </label>
                          <div className="mt-1.5 space-y-0.5">
                            <p className="text-[10px] text-gray-600">
                              This unit has {selectedUnit.childCount} subordinate unit{selectedUnit.childCount > 1 ? 's' : ''}.
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Expand this unit in the tree view to see subordinate units.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Processes Section */}
                      {selectedUnit.isBiaEligible && (
                        <div className="pt-2.5 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                              Processes
                            </label>
                            <Link
                              href={`/bia/processes/new?unitId=${selectedUnit.id}`}
                              className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-900 bg-gray-100 rounded-sm hover:bg-gray-200"
                            >
                              <PlusIcon className="h-3 w-3 mr-0.5" />
                              Add Process
                            </Link>
                          </div>
                          <div className="mt-1.5">
                            <div className="bg-gray-50 rounded-sm p-2.5 text-center">
                              <p className="text-[10px] text-gray-600">No processes linked yet</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                Add processes to this operational-level unit to conduct BIAs
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-sm border border-gray-200 p-4 text-center">
                  <UserGroupIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-600">Select a unit to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

