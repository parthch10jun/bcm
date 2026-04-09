'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BeakerIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';

type TestType = 'bcp' | 'tabletop' | 'itscm';

interface TestRecord {
  id: string;
  name: string;
  type: 'Full Simulation' | 'Tabletop Exercise' | 'Walkthrough' | 'Component Test' | 'Application Failover' | 'Database Recovery' | 'Network Failover' | 'Cyber Incident Response' | 'Full DR Site Activation';
  category: TestType;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  linkedBCP: string | null;
  linkedITService?: string | null;
  owner: string;
  plannedDate: string;
  nextAction: string;
  criticality: 'High' | 'Medium' | 'Low';
  result?: 'Passed' | 'Passed with Issues' | 'Failed' | 'Pending';
  rtoTarget?: string;
  rtoAchieved?: string;
}

const mockTests: TestRecord[] = [
  { id: 'BCP-T-001', name: 'Q4 2024 Full DR Simulation', type: 'Full Simulation', category: 'bcp', status: 'Completed', linkedBCP: 'BCP-001', owner: 'Sarah Chen', plannedDate: '2024-11-15', nextAction: 'Generate report', criticality: 'High', result: 'Passed' },
  { id: 'BCP-T-002', name: 'IT System Failover Test', type: 'Component Test', category: 'bcp', status: 'In Progress', linkedBCP: 'BCP-002', owner: 'Michael Torres', plannedDate: '2024-11-25', nextAction: 'Execute Phase 2', criticality: 'High', result: 'Pending' },
  { id: 'BCP-T-003', name: 'Finance BCP Walkthrough', type: 'Walkthrough', category: 'bcp', status: 'Scheduled', linkedBCP: 'BCP-003', owner: 'Emily Wang', plannedDate: '2024-12-01', nextAction: 'Send invites', criticality: 'Medium' },
  { id: 'BCP-T-004', name: 'Communication Recovery Test', type: 'Component Test', category: 'bcp', status: 'Pending Approval', linkedBCP: 'BCP-001', owner: 'David Kim', plannedDate: '2024-12-05', nextAction: 'Awaiting review', criticality: 'Medium' },
  { id: 'BCP-T-005', name: 'Data Center Failover', type: 'Full Simulation', category: 'bcp', status: 'Draft', linkedBCP: 'BCP-004', owner: 'Sarah Chen', plannedDate: '2024-12-15', nextAction: 'Complete plan', criticality: 'High' },
  { id: 'TT-001', name: 'Cybersecurity Incident Response', type: 'Tabletop Exercise', category: 'tabletop', status: 'Completed', linkedBCP: 'BCP-001', owner: 'Alex Johnson', plannedDate: '2024-11-10', nextAction: 'Close findings', criticality: 'High', result: 'Passed with Issues' },
  { id: 'TT-002', name: 'Supply Chain Disruption Scenario', type: 'Tabletop Exercise', category: 'tabletop', status: 'Completed', linkedBCP: null, owner: 'Lisa Park', plannedDate: '2024-11-05', nextAction: 'Generate report', criticality: 'Medium', result: 'Failed' },
  { id: 'TT-003', name: 'Pandemic Response Exercise', type: 'Tabletop Exercise', category: 'tabletop', status: 'Scheduled', linkedBCP: 'BCP-005', owner: 'James Wilson', plannedDate: '2024-12-10', nextAction: 'Prepare materials', criticality: 'Medium' },
  { id: 'TT-004', name: 'Regulatory Crisis Simulation', type: 'Tabletop Exercise', category: 'tabletop', status: 'Draft', linkedBCP: null, owner: 'Emily Wang', plannedDate: '2024-12-20', nextAction: 'Define scenario', criticality: 'Low' },
  // ITSCM Tests
  { id: 'ITSCM-T-001', name: 'Core Insurance Platform Failover', type: 'Application Failover', category: 'itscm', status: 'Completed', linkedBCP: 'BCP-001', linkedITService: 'SVC-001', owner: 'Michael Schmidt', plannedDate: '2025-11-10', nextAction: 'Review results', criticality: 'High', result: 'Passed', rtoTarget: '2 Hours', rtoAchieved: '1.5 Hours' },
  { id: 'ITSCM-T-002', name: 'Oracle Database Recovery Test', type: 'Database Recovery', category: 'itscm', status: 'In Progress', linkedBCP: 'BCP-002', linkedITService: 'SVC-003', owner: 'Anna Schmidt', plannedDate: '2025-11-25', nextAction: 'Execute recovery', criticality: 'High', result: 'Pending', rtoTarget: '4 Hours', rtoAchieved: 'TBD' },
  { id: 'ITSCM-T-003', name: 'Network Infrastructure Failover', type: 'Network Failover', category: 'itscm', status: 'Scheduled', linkedBCP: 'BCP-003', linkedITService: 'SVC-005', owner: 'Tom Harris', plannedDate: '2025-12-01', nextAction: 'Prepare test plan', criticality: 'High', rtoTarget: '1 Hour' },
  { id: 'ITSCM-T-004', name: 'Ransomware Response Drill', type: 'Cyber Incident Response', category: 'itscm', status: 'Completed', linkedBCP: 'BCP-006', linkedITService: 'SVC-008', owner: 'David Klein', plannedDate: '2025-10-15', nextAction: 'Document lessons', criticality: 'High', result: 'Passed with Issues', rtoTarget: '6 Hours', rtoAchieved: '7 Hours' },
  { id: 'ITSCM-T-005', name: 'Full DR Site Activation - Munich', type: 'Full DR Site Activation', category: 'itscm', status: 'Scheduled', linkedBCP: 'BCP-001', linkedITService: 'Multiple', owner: 'Klaus Weber', plannedDate: '2025-12-15', nextAction: 'Coordinate teams', criticality: 'High', rtoTarget: '8 Hours' },
  { id: 'ITSCM-T-006', name: 'Payment Gateway Failover', type: 'Application Failover', category: 'itscm', status: 'Pending Approval', linkedBCP: 'BCP-004', linkedITService: 'SVC-002', owner: 'Lisa Anderson', plannedDate: '2025-12-05', nextAction: 'Awaiting approval', criticality: 'High', rtoTarget: '4 Hours' },
  { id: 'ITSCM-T-007', name: 'CRM System Recovery', type: 'Application Failover', category: 'itscm', status: 'Draft', linkedBCP: 'BCP-005', linkedITService: 'SVC-006', owner: 'Emma Weber', plannedDate: '2025-12-20', nextAction: 'Define scope', criticality: 'Medium', rtoTarget: '18 Hours' },
];

export default function TestingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TestType>('bcp');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bcpFilter, setBcpFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTests = mockTests.filter(test => {
    if (test.category !== activeTab) return false;
    if (searchTerm && !test.name.toLowerCase().includes(searchTerm.toLowerCase()) && !test.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== 'all' && test.status !== statusFilter) return false;
    if (bcpFilter !== 'all' && test.linkedBCP !== bcpFilter) return false;
    if (ownerFilter !== 'all' && test.owner !== ownerFilter) return false;
    return true;
  });

  const bcpTests = mockTests.filter(t => t.category === 'bcp');
  const tabletopTests = mockTests.filter(t => t.category === 'tabletop');
  const itscmTests = mockTests.filter(t => t.category === 'itscm');

  const stats = {
    bcp: { total: bcpTests.length, pending: bcpTests.filter(t => t.status === 'Pending Approval').length, scheduled: bcpTests.filter(t => t.status === 'Scheduled').length },
    tabletop: { total: tabletopTests.length, pending: tabletopTests.filter(t => t.status === 'Pending Approval').length, scheduled: tabletopTests.filter(t => t.status === 'Scheduled').length },
    itscm: { total: itscmTests.length, pending: itscmTests.filter(t => t.status === 'Pending Approval').length, scheduled: itscmTests.filter(t => t.status === 'Scheduled').length },
  };

  const uniqueBCPs = [...new Set(mockTests.map(t => t.linkedBCP).filter(Boolean))] as string[];
  const uniqueOwners = [...new Set(mockTests.map(t => t.owner))];

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
      'Approved': 'bg-blue-50 text-blue-700 border-blue-200',
      'Scheduled': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'In Progress': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Completed': 'bg-green-50 text-green-700 border-green-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || styles['Draft'];
  };

  const getResultStyle = (result?: string) => {
    if (!result) return '';
    const styles: Record<string, string> = {
      'Passed': 'text-green-600',
      'Passed with Issues': 'text-yellow-600',
      'Failed': 'text-red-600',
      'Pending': 'text-gray-500',
    };
    return styles[result] || '';
  };

  const getCriticalityDot = (criticality: string) => {
    const colors: Record<string, string> = { 'High': 'bg-red-500', 'Medium': 'bg-yellow-500', 'Low': 'bg-green-500' };
    return colors[criticality] || 'bg-gray-400';
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Testing Records</h1>
                <p className="text-xs text-gray-500 mt-0.5">BCP tests, ITSCM tests, tabletop exercises, and simulation tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/testing/dashboard" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                  <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                  Dashboard
                </Link>
                {activeTab === 'bcp' ? (
                  <Link href="/testing/new-bcp-test" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                    Schedule BCP Test
                  </Link>
                ) : activeTab === 'itscm' ? (
                  <Link href="/testing/new" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                    Schedule ITSCM Test
                  </Link>
                ) : (
                  <Link href="/testing/new" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                    New Tabletop
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 border-t border-gray-100">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('bcp')}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'bcp'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BeakerIcon className="h-4 w-4" />
                  BCP Testing
                  <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">{stats.bcp.total}</span>
                  {stats.bcp.pending > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded">{stats.bcp.pending} pending</span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('itscm')}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'itscm'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ServerStackIcon className="h-4 w-4" />
                  ITSCM Testing
                  <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">{stats.itscm.total}</span>
                  {stats.itscm.pending > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded">{stats.itscm.pending} pending</span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('tabletop')}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'tabletop'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-4 w-4" />
                  Tabletop Testing
                  <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">{stats.tabletop.total}</span>
                  {stats.tabletop.pending > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded">{stats.tabletop.pending} pending</span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm w-56 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Linked BCP Filter */}
              <select
                value={bcpFilter}
                onChange={(e) => setBcpFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="all">All BCPs</option>
                {uniqueBCPs.map(bcp => (
                  <option key={bcp} value={bcp}>{bcp}</option>
                ))}
              </select>

              {/* Owner Filter */}
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="all">All Owners</option>
                {uniqueOwners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
                  showFilters ? 'bg-gray-100 border-gray-400 text-gray-900' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-3.5 w-3.5 mr-1" />
                More
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{filteredTests.length} records</span>
              <button className="p-1.5 hover:bg-gray-100 rounded-sm">
                <ArrowPathIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Records Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Linked BCP</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Planned Date</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <BeakerIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No testing records found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or create a new record</p>
                    </td>
                  </tr>
                ) : (
                  filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      onClick={() => router.push(`/testing/${test.id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3">
                        <div className={`w-2 h-2 rounded-full ${getCriticalityDot(test.criticality)}`} title={`${test.criticality} Criticality`} />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-600">{test.id}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-xs font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{test.name}</div>
                        {test.result && (
                          <span className={`text-[10px] ${getResultStyle(test.result)}`}>{test.result}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{test.type}</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {test.linkedBCP ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                            <DocumentTextIcon className="h-3 w-3 mr-1" />
                            {test.linkedBCP}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Unlinked</span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusStyle(test.status)}`}>
                          {test.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{test.nextAction}</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                          {test.plannedDate}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{test.owner}</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
    </div>
  );
}
