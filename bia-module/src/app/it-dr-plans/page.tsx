'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AIAgent from '@/components/AIAgent';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  BeakerIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  UserCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

interface BCPPlan {
  id: string;
  name: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Retired';
  owner: string;
  lastReviewed: string | null;
  nextReviewDue: string;
  lastTestDate: string | null;
  samaStatus: 'Compliant' | 'Has Gaps' | 'Not Assessed';
  location: string;
  enablerType: string;
  planType: 'ARP' | 'IRP' | 'DRP' | 'CIRP';
  itService: string;
  businessProcessesCount: number;
  recoveryStrategy: 'Hot Site' | 'Warm Site' | 'Cold Site' | 'Cloud DR' | 'Manual';
}

export default function BCPModuleLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [ownerFilter, setOwnerFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Mock BCP Plans data
  const bcpPlans: BCPPlan[] = [
    {
      id: 'BCP-001',
      name: 'Core Insurance Platform Recovery',
      status: 'Published',
      owner: 'John Doe',
      lastReviewed: '2024-11-15',
      nextReviewDue: '2025-11',
      lastTestDate: '2024-10-20',
      samaStatus: 'Compliant',
      location: 'Munich Data Center',
      enablerType: 'Technology',
      planType: 'ARP',
      itService: 'Core Insurance Platform',
      businessProcessesCount: 5,
      recoveryStrategy: 'Hot Site'
    },
    {
      id: 'BCP-002',
      name: 'Claims Management System Recovery',
      status: 'Published',
      owner: 'Sarah Mitchell',
      lastReviewed: '2024-10-20',
      nextReviewDue: '2025-10',
      lastTestDate: '2024-09-15',
      samaStatus: 'Compliant',
      location: 'Frankfurt DR Site',
      enablerType: 'Technology',
      planType: 'ARP',
      itService: 'Claims Management System',
      businessProcessesCount: 3,
      recoveryStrategy: 'Hot Site'
    },
    {
      id: 'BCP-003',
      name: 'Munich Data Center Infrastructure Recovery',
      status: 'Published',
      owner: 'Mike Johnson',
      lastReviewed: '2024-12-01',
      nextReviewDue: '2025-12',
      lastTestDate: '2024-11-10',
      samaStatus: 'Compliant',
      location: 'Munich Data Center',
      enablerType: 'Building',
      planType: 'IRP',
      itService: 'Munich Data Center',
      businessProcessesCount: 12,
      recoveryStrategy: 'Warm Site'
    },
    {
      id: 'BCP-004',
      name: 'Policy Database Recovery Plan',
      status: 'In Review',
      owner: 'Emily Davis',
      lastReviewed: '2024-11-20',
      nextReviewDue: '2025-06',
      lastTestDate: '2024-10-15',
      samaStatus: 'Has Gaps',
      location: 'Munich Data Center',
      enablerType: 'Technology',
      planType: 'DRP',
      itService: 'Policy Database',
      businessProcessesCount: 4,
      recoveryStrategy: 'Cloud DR'
    },
    {
      id: 'BCP-005',
      name: 'Cybersecurity Incident Response Plan',
      status: 'Published',
      owner: 'David Wilson',
      lastReviewed: '2024-11-25',
      nextReviewDue: '2025-11',
      lastTestDate: '2024-10-30',
      samaStatus: 'Compliant',
      location: 'All Locations',
      enablerType: 'Technology',
      planType: 'CIRP',
      itService: 'Security Operations Center',
      businessProcessesCount: 15,
      recoveryStrategy: 'Manual'
    },
    {
      id: 'BCP-006',
      name: 'Customer Portal Application Recovery',
      status: 'Published',
      owner: 'Lisa Anderson',
      lastReviewed: '2024-11-05',
      nextReviewDue: '2025-11',
      lastTestDate: '2024-10-20',
      samaStatus: 'Compliant',
      location: 'Frankfurt DR Site',
      enablerType: 'Technology',
      planType: 'ARP',
      itService: 'Customer Portal',
      businessProcessesCount: 2,
      recoveryStrategy: 'Warm Site'
    },
    {
      id: 'BCP-007',
      name: 'Payment Gateway Recovery Plan',
      status: 'Approved',
      owner: 'Tom Harris',
      lastReviewed: '2024-12-10',
      nextReviewDue: '2025-12',
      lastTestDate: '2024-11-20',
      samaStatus: 'Compliant',
      location: 'Cloud (AWS)',
      enablerType: 'Technology',
      planType: 'ARP',
      itService: 'Payment Gateway',
      businessProcessesCount: 3,
      recoveryStrategy: 'Cloud DR'
    },
    {
      id: 'BCP-008',
      name: 'Underwriting System Recovery',
      status: 'Draft',
      owner: 'Anna Schmidt',
      lastReviewed: null,
      nextReviewDue: '2025-03',
      lastTestDate: null,
      samaStatus: 'Not Assessed',
      location: 'Munich Data Center',
      enablerType: 'Technology',
      planType: 'ARP',
      itService: 'Underwriting System',
      businessProcessesCount: 2,
      recoveryStrategy: 'Warm Site'
    },
    {
      id: 'BCP-009',
      name: 'Frankfurt Infrastructure Recovery',
      status: 'Published',
      owner: 'Klaus Weber',
      lastReviewed: '2024-11-18',
      nextReviewDue: '2025-11',
      lastTestDate: '2024-10-25',
      samaStatus: 'Compliant',
      location: 'Frankfurt DR Site',
      enablerType: 'Building',
      planType: 'IRP',
      itService: 'Frankfurt Data Center',
      businessProcessesCount: 10,
      recoveryStrategy: 'Cold Site'
    },
    {
      id: 'BCP-010',
      name: 'Claims Database Backup & Recovery',
      status: 'Published',
      owner: 'Maria Schneider',
      lastReviewed: '2024-12-05',
      nextReviewDue: '2025-12',
      lastTestDate: '2024-11-15',
      samaStatus: 'Compliant',
      location: 'Munich Data Center',
      enablerType: 'Technology',
      planType: 'DRP',
      itService: 'Claims Database',
      businessProcessesCount: 3,
      recoveryStrategy: 'Cloud DR'
    }
  ];

  // Calculate metrics
  const totalPlans = bcpPlans.length;
  const publishedPlans = bcpPlans.filter(p => p.status === 'Published').length;
  const criticalServices = 12; // Mock: total critical services from BIA
  const coveragePercent = Math.round((publishedPlans / criticalServices) * 100);

  const testedLast12Months = bcpPlans.filter(p => {
    if (!p.lastTestDate) return false;
    const testDate = new Date(p.lastTestDate);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return testDate >= twelveMonthsAgo;
  }).length;
  const testingPercent = Math.round((testedLast12Months / totalPlans) * 100);

  const overdueCount = bcpPlans.filter(p => {
    const dueDate = new Date(p.nextReviewDue);
    return dueDate < new Date();
  }).length;

  // Get unique owners and locations for filters
  const uniqueOwners = Array.from(new Set(bcpPlans.map(p => p.owner))).sort();
  const uniqueLocations = Array.from(new Set(bcpPlans.map(p => p.location))).sort();

  // Apply filters
  const filteredPlans = bcpPlans.filter(plan => {
    const matchesSearch = searchQuery === '' ||
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || plan.status === statusFilter;
    const matchesOwner = ownerFilter === '' || plan.owner === ownerFilter;
    const matchesLocation = locationFilter === '' || plan.location === locationFilter;

    return matchesSearch && matchesStatus && matchesOwner && matchesLocation;
  });

  // Apply sorting
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn as keyof BCPPlan];
    let bVal: any = b[sortColumn as keyof BCPPlan];

    if (aVal === null) aVal = '';
    if (bVal === null) bVal = '';

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = sortedPlans.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'In Review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Retired': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setOwnerFilter('');
    setLocationFilter('');
  };

  const hasActiveFilters = searchQuery || statusFilter || ownerFilter || locationFilter;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Business Continuity Plans
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Management dashboard providing situational awareness across all BCPs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/it-dr-plans/coverage"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <ShieldCheckIcon className="h-3.5 w-3.5 mr-1.5" />
                  DR Coverage
                </Link>
                <button
                  onClick={() => router.push('/it-dr-plans/create')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                  Create BCP
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-4 sm:px-8 space-y-4">

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-4 gap-3">
              {/* Total Plans Metric */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Plans</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{totalPlans}</p>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      {publishedPlans} Published, {totalPlans - publishedPlans} Draft/Review
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Metric */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Coverage</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{coveragePercent}%</p>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      Critical Services with Published BCP
                    </div>
                  </div>
                </div>
              </div>

              {/* Testing Metric */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tested 12mo</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{testingPercent}%</p>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      BCPs tested in last 12 months
                    </div>
                  </div>
                </div>
              </div>

              {/* Overdue Metric */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Overdue</p>
                    <div className="mt-2 flex items-baseline">
                      <p className={`text-2xl font-semibold ${overdueCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{overdueCount}</p>
                      <span className="ml-1 text-xs text-gray-500">reviews</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-600">
                      Overdue reviews/tests
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="p-3">
                <div className="flex items-center gap-2">
                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search BCPs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full h-[30px] pl-7 pr-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-40">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                    >
                      <option value="">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Published">Published</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  {/* Owner Filter */}
                  <div className="w-40">
                    <select
                      value={ownerFilter}
                      onChange={(e) => setOwnerFilter(e.target.value)}
                      className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                    >
                      <option value="">All Owners</option>
                      {uniqueOwners.map(owner => (
                        <option key={owner} value={owner}>{owner}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="w-48">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="h-[30px] px-3 text-xs text-gray-600 hover:text-gray-900 whitespace-nowrap border border-gray-300 rounded-sm hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BCP List Data Table */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              {paginatedPlans.length === 0 ? (
                <div className="text-center py-16">
                  <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-base font-medium text-gray-900">No Business Continuity Plans Yet</h3>
                  <p className="mt-2 text-xs text-gray-500">Get started by creating your first BCP</p>
                  <button
                    onClick={() => router.push('/it-dr-plans/create')}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
                  >
                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                    Create BCP
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            onClick={() => handleSort('name')}
                            className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-1">
                              Plan Name
                              {sortColumn === 'name' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('planType')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[80px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Plan Type
                              {sortColumn === 'planType' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('itService')}
                            className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-1">
                              IT Service
                              {sortColumn === 'itService' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('businessProcessesCount')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Business Impact
                              {sortColumn === 'businessProcessesCount' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('recoveryStrategy')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[110px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Recovery Strategy
                              {sortColumn === 'recoveryStrategy' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('status')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[90px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Status
                              {sortColumn === 'status' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('owner')}
                            className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-1">
                              Owner
                              {sortColumn === 'owner' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('lastReviewed')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Last Reviewed
                              {sortColumn === 'lastReviewed' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('nextReviewDue')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Next Due
                              {sortColumn === 'nextReviewDue' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('lastTestDate')}
                            className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]"
                          >
                            <div className="flex items-center justify-center gap-1">
                              Last Test
                              {sortColumn === 'lastTestDate' && (
                                <span className="text-gray-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[70px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedPlans.map((plan) => {
                          const isOverdueSoon = plan.nextReviewDue &&
                            new Date(plan.nextReviewDue) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                          return (
                            <tr key={plan.id} className="hover:bg-gray-50 cursor-pointer">
                              <td className="px-3 py-2">
                                <Link
                                  href={`/it-dr-plans/${plan.id}`}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {plan.name}
                                </Link>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                                  plan.planType === 'ARP' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  plan.planType === 'IRP' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  plan.planType === 'DRP' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {plan.planType}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-xs text-gray-900">{plan.itService}</span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                                    plan.businessProcessesCount >= 10 ? 'bg-red-50 text-red-700 border-red-200' :
                                    plan.businessProcessesCount >= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                    {plan.businessProcessesCount} {plan.businessProcessesCount === 1 ? 'Process' : 'Processes'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
                                  plan.recoveryStrategy === 'Hot Site' ? 'bg-green-50 text-green-700 border-green-200' :
                                  plan.recoveryStrategy === 'Warm Site' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  plan.recoveryStrategy === 'Cold Site' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                  plan.recoveryStrategy === 'Cloud DR' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {plan.recoveryStrategy}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeColor(plan.status)}`}>
                                  {plan.status}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                  <UserCircleIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-xs text-gray-900">{plan.owner}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className="text-xs text-gray-900">
                                  {plan.lastReviewed || '-'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`text-xs ${isOverdueSoon ? 'text-amber-600 font-medium' : 'text-gray-900'}`}>
                                    {plan.nextReviewDue}
                                  </span>
                                  {isOverdueSoon && (
                                    <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-600" />
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className="text-xs text-gray-900">
                                  {plan.lastTestDate || '-'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <div className="relative inline-block">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenu(openActionMenu === plan.id ? null : plan.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-sm hover:bg-gray-100"
                                  >
                                    <EllipsisVerticalIcon className="h-4 w-4" />
                                  </button>

                                  {openActionMenu === plan.id && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-sm shadow-lg border border-gray-200 z-10">
                                      <div className="py-1">
                                        <button
                                          onClick={() => router.push(`/it-dr-plans/${plan.id}`)}
                                          className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                          <EyeIcon className="h-3.5 w-3.5 mr-2" />
                                          View Details
                                        </button>
                                        <button
                                          onClick={() => router.push(`/it-dr-plans/${plan.id}/edit`)}
                                          className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                          <PencilIcon className="h-3.5 w-3.5 mr-2" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => router.push(`/it-dr-plans/simulation?plan=${plan.id}`)}
                                          className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                          <BeakerIcon className="h-3.5 w-3.5 mr-2" />
                                          Test
                                        </button>
                                        <button
                                          className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                          <ArchiveBoxIcon className="h-3.5 w-3.5 mr-2" />
                                          Archive
                                        </button>
                                        <button
                                          className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                          <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-2" />
                                          Export
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">
                          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPlans.length)} of {sortedPlans.length} results
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 rounded-sm text-xs px-2 py-1"
                        >
                          <option value={25}>25 per page</option>
                          <option value={50}>50 per page</option>
                          <option value={100}>100 per page</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-xs text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* AI Agent */}
      <AIAgent context="it-dr" />
    </div>
  );
}
