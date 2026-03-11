'use client';

import Link from 'next/link';
import {
  BeakerIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  UserCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function TestingDashboard() {
  // Mock KPIs
  const kpis = {
    totalTests: 9,
    pendingApprovals: 2,
    upcomingThisMonth: 3,
    overdueCAPA: 4,
  };

  // My Pending items
  const myPending = [
    { id: 'BCP-T-004', name: 'Communication Recovery Test', action: 'Approve plan', dueDate: '2024-12-01' },
    { id: 'TT-004', name: 'Regulatory Crisis Simulation', action: 'Complete scenario', dueDate: '2024-12-05' },
  ];

  // Recently Updated
  const recentlyUpdated = [
    { id: 'BCP-T-001', name: 'Q4 2024 Full DR Simulation', status: 'Completed', updatedBy: 'Sarah Chen', updatedAt: '2 hours ago' },
    { id: 'TT-001', name: 'Cybersecurity Incident Response', status: 'Completed', updatedBy: 'Alex Johnson', updatedAt: '1 day ago' },
    { id: 'BCP-T-002', name: 'IT System Failover Test', status: 'In Progress', updatedBy: 'Michael Torres', updatedAt: '2 days ago' },
  ];

  // Upcoming Schedule
  const upcomingSchedule = [
    { id: 'BCP-T-003', name: 'Finance BCP Walkthrough', type: 'Walkthrough', date: '2024-12-01', owner: 'Emily Wang' },
    { id: 'BCP-T-004', name: 'Communication Recovery Test', type: 'Component Test', date: '2024-12-05', owner: 'David Kim' },
    { id: 'TT-003', name: 'Pandemic Response Exercise', type: 'Tabletop', date: '2024-12-10', owner: 'James Wilson' },
  ];

  // Open CAPA items
  const openCAPA = [
    { id: 'CAPA-001', finding: 'Communication delays during DR test', severity: 'High', dueDate: '2024-11-30', testId: 'BCP-T-001' },
    { id: 'CAPA-002', name: 'Missing escalation procedures', severity: 'Medium', dueDate: '2024-12-05', testId: 'TT-001' },
    { id: 'CAPA-003', finding: 'Incomplete backup verification', severity: 'High', dueDate: '2024-11-28', testId: 'TT-002' },
    { id: 'CAPA-004', finding: 'Role confusion during scenario', severity: 'Low', dueDate: '2024-12-10', testId: 'TT-002' },
  ];

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, string> = {
      'High': 'bg-red-50 text-red-700 border-red-200',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Low': 'bg-green-50 text-green-700 border-green-200',
    };
    return styles[severity] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'Completed': 'bg-green-50 text-green-700',
      'In Progress': 'bg-blue-50 text-blue-700',
      'Scheduled': 'bg-gray-50 text-gray-700',
    };
    return styles[status] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Testing Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">Overview of testing activities and pending actions</p>
          </div>
          <Link href="/testing" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
            <DocumentTextIcon className="h-3.5 w-3.5 mr-1.5" />
            View Records
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Tests</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{kpis.totalTests}</p>
                  <p className="text-[10px] text-gray-500 mt-1">All time records</p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center">
                  <BeakerIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Pending Approvals</p>
                  <p className="text-2xl font-semibold text-amber-600 mt-1">{kpis.pendingApprovals}</p>
                  <p className="text-[10px] text-amber-600 mt-1">Awaiting review</p>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-sm flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Upcoming</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{kpis.upcomingThisMonth}</p>
                  <p className="text-[10px] text-gray-500 mt-1">This month</p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-200 rounded-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Overdue CAPA</p>
                  <p className="text-2xl font-semibold text-red-600 mt-1">{kpis.overdueCAPA}</p>
                  <p className="text-[10px] text-red-600 mt-1">Action required</p>
                </div>
                <div className="h-10 w-10 bg-red-50 rounded-sm flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* My Pending */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">My Pending Actions</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">{myPending.length}</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {myPending.map((item) => (
                    <Link key={item.id} href={`/testing/${item.id}`} className="block px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.action} • Due {item.dueDate}</p>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recently Updated */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Recently Updated</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentlyUpdated.map((item) => (
                    <Link key={item.id} href={`/testing/${item.id}`} className="block px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-gray-900">{item.name}</p>
                            <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${getStatusStyle(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <UserCircleIcon className="h-3 w-3" />
                            {item.updatedBy} • {item.updatedAt}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Schedule */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming Schedule</h3>
                  <Link href="/testing/calendar" className="text-[10px] text-blue-600 hover:underline">View Calendar</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {upcomingSchedule.map((item) => (
                    <Link key={item.id} href={`/testing/${item.id}`} className="block px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.type} • {item.owner}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Open CAPA / Issues */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Open CAPA Items</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">{openCAPA.length} open</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {openCAPA.map((item) => (
                    <div key={item.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-500">{item.id}</span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${getSeverityStyle(item.severity)}`}>
                              {item.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-900 mt-1">{item.finding}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">From {item.testId} • Due {item.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* Global Filters Hint */}
        <div className="bg-gray-100 border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs font-medium text-gray-700">Quick Filters</p>
                <p className="text-[10px] text-gray-500">Filter by type, status, BCP, criticality, or date range</p>
              </div>
            </div>
            <Link href="/testing" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              Go to Records List
              <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

