'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { userService } from '@/services/userService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { User, UserStats, UserStatus, HrmsSyncResult, BulkUploadResult } from '@/types/user';
import { OrganizationalUnit } from '@/types/organizationalUnit';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function PeopleLibraryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [lastSync, setLastSync] = useState<HrmsSyncResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load data with individual error handling for each API call
      const [usersData, statsData, unitsData, syncStatus] = await Promise.allSettled([
        userService.getAll(),
        userService.getStats(),
        organizationalUnitService.getAll(),
        userService.getLastSyncStatus()
      ]);

      // Handle users data
      if (usersData.status === 'fulfilled') {
        setUsers(usersData.value);
      } else {
        console.error('Error loading users:', usersData.reason);
        setUsers([]);
      }

      // Handle stats data
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        console.error('Error loading stats:', statsData.reason);
        setStats(null);
      }

      // Handle organizational units data
      if (unitsData.status === 'fulfilled') {
        setOrganizationalUnits(unitsData.value);
      } else {
        console.error('Error loading organizational units:', unitsData.reason);
        setOrganizationalUnits([]);
      }

      // Handle sync status data (optional - don't fail if this doesn't work)
      if (syncStatus.status === 'fulfilled') {
        setLastSync(syncStatus.value);
      } else {
        console.warn('Could not load last sync status:', syncStatus.reason);
        setLastSync(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncHrms = async () => {
    if (!confirm('Sync users from HRMS? This may take a few minutes.')) return;
    try {
      setSyncing(true);
      const result = await userService.syncFromHrms();
      setLastSync(result);
      await loadData();
      alert(`HRMS Sync completed!\nAdded: ${result.usersAdded}\nUpdated: ${result.usersUpdated}\nFailed: ${result.usersFailed}`);
    } catch (error: any) {
      alert('HRMS sync failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadResult(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    try {
      setUploading(true);
      const result = await userService.bulkUpload(uploadFile);
      setUploadResult(result);
      await loadData();
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const closeBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      await userService.downloadTemplate();
    } catch (error: any) {
      alert('Failed to download template: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.delete(id);
      await loadData();
    } catch (error: any) {
      alert('Failed to delete user: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.hrmsEmployeeId && user.hrmsEmployeeId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesUnit = !unitFilter || user.organizationalUnitId?.toString() === unitFilter;
    const matchesRole = !roleFilter || (user as any).role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesUnit && matchesRole && matchesStatus;
  });

  const uniqueRoles = [...new Set(users.map(u => (u as any).role).filter(Boolean))];

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, unitFilter, roleFilter, statusFilter]);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">People Library</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-sm text-gray-600">Loading people...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">People Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">Manage employees, contractors, and human resources</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSyncHrms} disabled={syncing} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50">
              <ArrowPathIcon className={`h-3.5 w-3.5 mr-1 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync HRMS'}
            </button>
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1" />
              Bulk Upload
            </button>
            <Link href="/libraries/people/new" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Person
            </Link>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Data Quality Score */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Data Quality</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {(() => {
                      const usersWithContact = users.filter(u => u.contactNumber).length;
                      const usersWithRole = users.filter(u => (u as any).role).length;
                      const usersWithUnit = users.filter(u => u.organizationalUnitId).length;
                      const totalFields = users.length * 3;
                      const filledFields = usersWithContact + usersWithRole + usersWithUnit;
                      return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
                    })()}%
                  </p>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Contact Info</span>
                    <span className="font-medium text-gray-900">{users.filter(u => u.contactNumber).length}/{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Role Assigned</span>
                    <span className="font-medium text-gray-900">{users.filter(u => (u as any).role).length}/{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Unit Mapped</span>
                    <span className="font-medium text-gray-900">{users.filter(u => u.organizationalUnitId).length}/{users.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Required */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Action Required</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => !u.contactNumber || !u.organizationalUnitId || u.status !== UserStatus.ACTIVE).length}
                  </p>
                  <span className="ml-1 text-xs text-gray-500">users</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Missing Contact</span>
                    <span className="font-medium text-amber-600">{users.filter(u => !u.contactNumber).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">No Unit Assigned</span>
                    <span className="font-medium text-amber-600">{users.filter(u => !u.organizationalUnitId).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Inactive/Terminated</span>
                    <span className="font-medium text-amber-600">{users.filter(u => u.status !== UserStatus.ACTIVE).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HRMS Sync Health */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">HRMS Sync</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.hrmsEmployeeId).length}
                  </p>
                  <span className="ml-1 text-xs text-gray-500">synced</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">HRMS Linked</span>
                    <span className="font-medium text-gray-900">{users.filter(u => u.hrmsEmployeeId).length}/{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Manual Entries</span>
                    <span className="font-medium text-gray-900">{users.filter(u => !u.hrmsEmployeeId).length}</span>
                  </div>
                  {lastSync && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Last Sync</span>
                      <span className="font-medium text-gray-900">
                        {(() => {
                          const syncDate = new Date(lastSync.startedAt);
                          const now = new Date();
                          const diffHours = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60 * 60));
                          if (diffHours < 1) return 'Just now';
                          if (diffHours < 24) return `${diffHours}h ago`;
                          return `${Math.floor(diffHours / 24)}d ago`;
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Overview</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                  <span className="ml-1 text-xs text-gray-500">total</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium text-green-600">{users.filter(u => u.status === UserStatus.ACTIVE).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Inactive</span>
                    <span className="font-medium text-yellow-600">{users.filter(u => u.status === UserStatus.INACTIVE).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Terminated</span>
                    <span className="font-medium text-red-600">{users.filter(u => u.status === UserStatus.TERMINATED).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {lastSync && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="ml-2">
                  <h3 className="text-xs font-medium text-blue-900">Last HRMS Sync</h3>
                  <div className="mt-0.5 text-xs text-blue-800">
                    <span className="font-medium">Status:</span> {lastSync.syncStatus} | <span className="font-medium"> Added:</span> {lastSync.usersAdded} | <span className="font-medium"> Updated:</span> {lastSync.usersUpdated} | <span className="font-medium"> Failed:</span> {lastSync.usersFailed}
                  </div>
                  <p className="mt-0.5 text-[10px] text-blue-700">{new Date(lastSync.startedAt).toLocaleString()} by {lastSync.triggeredBy}</p>
                </div>
              </div>
              <button onClick={handleDownloadTemplate} className="inline-flex items-center px-2 py-1 border border-blue-300 text-[10px] font-medium rounded text-blue-700 bg-white hover:bg-blue-50">
                <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                CSV Template
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-sm mb-4">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Filters</h3>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-5 gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search people..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-sm text-xs bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900" />
              </div>
              <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="block w-full px-2 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option value="">All Units</option>
                {organizationalUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.unitName}</option>)}
              </select>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="block w-full px-2 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option value="">All Roles</option>
                {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full px-2 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option value="">All Statuses</option>
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.INACTIVE}>Inactive</option>
                <option value={UserStatus.TERMINATED}>Terminated</option>
              </select>
              <button onClick={() => { setSearchTerm(''); setUnitFilter(''); setRoleFilter(''); setStatusFilter(''); }} className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FunnelIcon className="h-3.5 w-3.5 mr-1" />
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Organizational Unit</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium">{user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900">{user.fullName}</div>
                          {user.hrmsEmployeeId && <div className="text-[10px] text-gray-500">{user.hrmsEmployeeId}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{(user as any).role || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{user.organizationalUnitName || '—'}</div>
                      {user.organizationalUnitCode && <div className="text-[10px] text-gray-500">{user.organizationalUnitCode}</div>}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{user.email}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{user.contactNumber || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${user.status === UserStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-200' : user.status === UserStatus.INACTIVE ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{user.status}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                      <Link href={`/libraries/people/${user.id}/edit`} className="text-gray-600 hover:text-gray-900 mr-3" title="Edit">
                        <PencilIcon className="h-4 w-4 inline" />
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="text-gray-600 hover:text-gray-900" title="Delete">
                        <TrashIcon className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No people found</h3>
              <p className="mt-1 text-xs text-gray-500">Try adjusting your search criteria.</p>
            </div>
          </div>
        )}

        {users.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No people</h3>
              <p className="mt-1 text-xs text-gray-500">Get started by syncing from HRMS or uploading a CSV file.</p>
              <div className="mt-6 flex items-center justify-center space-x-2">
                <button onClick={handleSyncHrms} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                  <ArrowPathIcon className="h-3.5 w-3.5 mr-1.5" />
                  Sync with HRMS
                </button>
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload People</h2>
              <button
                onClick={closeBulkUploadModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Instructions */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <p className="text-xs text-blue-800 font-medium mb-2">Instructions:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Download the CSV template using the button below</li>
                  <li>Fill in the user information following the template format</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the results and fix any errors if needed</li>
                </ol>
              </div>

              {/* Download Template Button */}
              <div className="mb-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
                />
                {uploadFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected file: {uploadFile.name}
                  </p>
                )}
              </div>

              {/* Upload Results */}
              {uploadResult && (
                <div className="mb-4">
                  <div className={`p-3 rounded-sm border ${
                    uploadResult.failedRows === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="text-sm font-medium mb-2">
                      {uploadResult.failedRows === 0 ? (
                        <span className="text-green-800">✓ Upload Successful</span>
                      ) : (
                        <span className="text-amber-800">⚠ Upload Completed with Errors</span>
                      )}
                    </p>
                    <p className="text-xs mb-2">
                      <span className="text-green-700">Success: {uploadResult.successfulRows}</span>
                      {' | '}
                      <span className="text-red-700">Errors: {uploadResult.failedRows}</span>
                    </p>
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="text-xs font-medium mb-1">Error Messages:</p>
                        <ul className="text-xs space-y-1">
                          {uploadResult.errors.map((msg, idx) => (
                            <li key={idx} className="text-gray-700">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeBulkUploadModal}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Close
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!uploadFile || uploading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
