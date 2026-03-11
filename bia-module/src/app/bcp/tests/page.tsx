'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useBCPTest } from '@/contexts/BCPTestContext';

const mockTests = [
  {
    id: 'TEST-001',
    name: 'Ransomware Attack Response Simulation',
    scenario: 'IRP-001',
    type: 'Full Simulation',
    status: 'Completed',
    result: 'Passed',
    scheduledDate: '2025-10-15',
    completedDate: '2025-10-15',
    duration: '6h 45m',
    participants: 12,
    deviations: 2,
    coordinator: 'Sarah Johnson'
  },
  {
    id: 'TEST-002',
    name: 'Data Breach Tabletop Exercise',
    scenario: 'IRP-002',
    type: 'Tabletop',
    status: 'Scheduled',
    result: null,
    scheduledDate: '2025-12-20',
    completedDate: null,
    duration: null,
    participants: 8,
    deviations: 0,
    coordinator: 'Ahmed Al-Mansouri'
  },
  {
    id: 'TEST-003',
    name: 'DDoS Mitigation Walkthrough',
    scenario: 'IRP-003',
    type: 'Walkthrough',
    status: 'In Progress',
    result: null,
    scheduledDate: '2025-11-18',
    completedDate: null,
    duration: '2h 15m',
    participants: 15,
    deviations: 1,
    coordinator: 'Mohammed Hassan'
  },
  {
    id: 'TEST-004',
    name: 'Insider Threat Detection Test',
    scenario: 'IRP-004',
    type: 'Functional',
    status: 'Completed',
    result: 'Passed with Deviations',
    scheduledDate: '2025-09-10',
    completedDate: '2025-09-10',
    duration: '4h 30m',
    participants: 6,
    deviations: 3,
    coordinator: 'Fatima Al-Rashid'
  },
  {
    id: 'TEST-005',
    name: 'Zero-Day Exploit Response Drill',
    scenario: 'IRP-005',
    type: 'Full Simulation',
    status: 'Draft',
    result: null,
    scheduledDate: '2026-03-01',
    completedDate: null,
    duration: null,
    participants: 20,
    deviations: 0,
    coordinator: 'Khalid bin Salman'
  }
];

export default function BCPTestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Get real-time test states from context
  const { testStates } = useBCPTest();

  // Merge mock data with real-time execution states
  const testsWithRealTimeStatus = useMemo(() => {
    return mockTests.map(test => {
      const liveState = testStates[test.id];
      if (liveState) {
        return {
          ...test,
          status: liveState.status,
          result: liveState.result || test.result,
          duration: liveState.elapsedTime ? formatDuration(liveState.elapsedTime) : test.duration,
          deviations: liveState.deviationsCount || test.deviations,
          // Additional live data
          liveData: {
            currentPhase: liveState.currentPhase,
            totalPhases: liveState.totalPhases,
            completedSteps: liveState.completedStepsCount,
            totalSteps: liveState.totalStepsCount,
            evidenceCount: liveState.evidenceCount,
            isLive: liveState.status === 'In Progress' || liveState.status === 'Paused'
          }
        };
      }
      return { ...test, liveData: null };
    });
  }, [testStates]);

  const filteredTests = testsWithRealTimeStatus.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.scenario.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || test.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || test.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: testsWithRealTimeStatus.length,
    completed: testsWithRealTimeStatus.filter(t => t.status === 'Completed').length,
    scheduled: testsWithRealTimeStatus.filter(t => t.status === 'Scheduled').length,
    inProgress: testsWithRealTimeStatus.filter(t => t.status === 'In Progress' || t.status === 'Paused').length,
    passRate: Math.round((testsWithRealTimeStatus.filter(t => t.result === 'Passed').length / testsWithRealTimeStatus.filter(t => t.result).length) * 100) || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'In Progress': return 'text-blue-700 bg-blue-50 border-blue-200 animate-pulse';
      case 'Paused': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Scheduled': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Cancelled': return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'Draft': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getResultColor = (result: string | null) => {
    if (!result) return 'text-gray-700 bg-gray-50 border-gray-200';
    switch (result) {
      case 'Passed': return 'text-green-700 bg-green-50 border-green-200';
      case 'Passed with Issues': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Passed with Deviations': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Failed': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Incident Response Plan</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage response scenarios, test execution, cyber incidents, and playbooks
              </p>
            </div>
            <Link
              href="/bcp/tests/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Schedule Test
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Segmented Control */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm max-w-4xl">
          <Link
            href="/bcp"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ClipboardDocumentCheckIcon className="mr-2 h-4 w-4" />
            Scenarios
          </Link>
          <Link
            href="/bcp/playbooks"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <BookOpenIcon className="mr-2 h-4 w-4" />
            Playbooks
          </Link>
          <Link
            href="/bcp/tests"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 bg-white text-gray-900 shadow-sm border border-gray-200"
          >
            <BeakerIcon className="mr-2 h-4 w-4 text-gray-900" />
            Tests
          </Link>
          <Link
            href="/bcp/incidents"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
            Incidents
          </Link>
          <Link
            href="/bcp/settings"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-xs transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <Cog6ToothIcon className="mr-2 h-4 w-4" />
            Settings
          </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <BeakerIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Tests</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Completed</p>
                <p className="text-xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Scheduled</p>
                <p className="text-xl font-semibold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <PlayIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">In Progress</p>
                <p className="text-xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 rounded-sm flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Pass Rate</p>
                <p className="text-xl font-semibold text-gray-900">{stats.passRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests by name, ID, or scenario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Types</option>
                <option value="Full Simulation">Full Simulation</option>
                <option value="Tabletop">Tabletop</option>
                <option value="Walkthrough">Walkthrough</option>
                <option value="Functional">Functional</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32 h-8 px-2.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{width: '25%'}} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th style={{width: '8%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th style={{width: '12%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th style={{width: '12%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th style={{width: '11%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                  <th style={{width: '10%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th style={{width: '12%'}} className="px-3 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <Link href={`/bcp/tests/${test.id}`} className="text-xs font-medium text-gray-900 hover:text-gray-700 truncate block">
                        {test.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Link href={`/bcp/scenarios/${test.scenario}`} className="text-xs text-gray-700 hover:text-gray-900">
                        {test.scenario}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{test.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium border whitespace-nowrap ${getStatusColor(test.status)}`}>
                          {test.status === 'In Progress' && <ArrowPathIcon className="h-2.5 w-2.5 animate-spin" />}
                          {test.status === 'Paused' && <PauseIcon className="h-2.5 w-2.5" />}
                          {test.status}
                        </span>
                        {test.liveData?.isLive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                      {test.liveData?.isLive && (
                        <div className="mt-0.5 text-[9px] text-gray-500">
                          Phase {test.liveData.currentPhase + 1}/{test.liveData.totalPhases} • {test.liveData.completedSteps}/{test.liveData.totalSteps} steps
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {test.result ? (
                        <span className={`inline-flex justify-center px-2 py-0.5 rounded-sm text-[10px] font-medium border whitespace-nowrap ${getResultColor(test.result)}`}>
                          {test.result}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{test.scheduledDate}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{test.duration || '-'}</span>
                      {test.liveData?.isLive && test.deviations > 0 && (
                        <span className="ml-1 text-[10px] text-amber-600">({test.deviations} dev)</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {test.status === 'Scheduled' ? (
                        <Link
                          href={`/bcp/tests/${test.id}/execute`}
                          className="inline-flex items-center justify-center gap-1 w-16 py-1 bg-green-600 text-white text-[10px] font-medium rounded-sm hover:bg-green-700 transition-colors"
                        >
                          <PlayIcon className="h-3 w-3" />
                          Start
                        </Link>
                      ) : test.status === 'In Progress' || test.status === 'Paused' ? (
                        <Link
                          href={`/bcp/tests/${test.id}/execute`}
                          className="inline-flex items-center justify-center gap-1 w-16 py-1 bg-blue-600 text-white text-[10px] font-medium rounded-sm hover:bg-blue-700 transition-colors"
                        >
                          <ArrowPathIcon className="h-3 w-3" />
                          Resume
                        </Link>
                      ) : (
                        <Link
                          href={`/bcp/tests/${test.id}`}
                          className="inline-flex items-center justify-center w-16 py-1 text-[10px] text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

