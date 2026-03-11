'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlayIcon,
  StopIcon,
  PhoneIcon,
  PhoneArrowDownLeftIcon,
  PhoneXMarkIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowPathIcon,
  SignalIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

// Mock Call Tree Test Data
const mockCallTreeTests = [
  {
    id: 'TEST-001',
    callTreeId: 'ct-001',
    callTreeName: 'IT Infrastructure Emergency',
    testType: 'Drill',
    status: 'Completed',
    startedAt: '2025-01-25 14:30:00',
    completedAt: '2025-01-25 14:45:00',
    duration: '15 min',
    totalMembers: 15,
    reached: 14,
    noAnswer: 1,
    responseRate: 93.3,
    avgResponseTime: '2.3 min',
    initiatedBy: 'Rajesh Kumar',
  },
  {
    id: 'TEST-002',
    callTreeId: 'ct-002',
    callTreeName: 'Executive Crisis Team',
    testType: 'Simulation',
    status: 'Completed',
    startedAt: '2025-01-20 10:00:00',
    completedAt: '2025-01-20 10:12:00',
    duration: '12 min',
    totalMembers: 8,
    reached: 8,
    noAnswer: 0,
    responseRate: 100,
    avgResponseTime: '1.8 min',
    initiatedBy: 'Priya Sharma',
  },
  {
    id: 'TEST-003',
    callTreeId: 'ct-003',
    callTreeName: 'Trading Floor Emergency',
    testType: 'Drill',
    status: 'In Progress',
    startedAt: '2025-12-02 09:15:00',
    completedAt: null,
    duration: 'In Progress',
    totalMembers: 22,
    reached: 18,
    noAnswer: 2,
    pending: 2,
    responseRate: 81.8,
    avgResponseTime: '2.5 min',
    initiatedBy: 'Anil Mehta',
  },
];

// Mock Live Call Statistics for Active Test
const mockLiveCallStats = {
  testId: 'TEST-003',
  callTreeName: 'Trading Floor Emergency',
  startTime: '09:15:00',
  elapsedTime: '00:08:45',
  totalMembers: 22,
  levels: [
    {
      level: 'L1',
      name: 'Management',
      members: [
        { name: 'CTO', status: 'Reached', responseTime: '0:45', attempts: 1 },
        { name: 'Trading Head', status: 'Reached', responseTime: '1:12', attempts: 1 },
      ]
    },
    {
      level: 'L2',
      name: 'Team Leads',
      members: [
        { name: 'Equity Desk Lead', status: 'Reached', responseTime: '1:30', attempts: 1 },
        { name: 'Derivatives Lead', status: 'Reached', responseTime: '2:05', attempts: 2 },
        { name: 'Fixed Income Lead', status: 'No Answer', responseTime: null, attempts: 3 },
        { name: 'FX Desk Lead', status: 'Reached', responseTime: '1:55', attempts: 1 },
      ]
    },
    {
      level: 'L3',
      name: 'Operations',
      members: [
        { name: 'Senior Trader 1', status: 'Reached', responseTime: '2:10', attempts: 1 },
        { name: 'Senior Trader 2', status: 'Reached', responseTime: '2:30', attempts: 1 },
        { name: 'Senior Trader 3', status: 'Reached', responseTime: '3:00', attempts: 2 },
        { name: 'Risk Analyst', status: 'Reached', responseTime: '2:45', attempts: 1 },
        { name: 'Compliance Officer', status: 'Calling', responseTime: null, attempts: 1 },
        { name: 'Settlement Lead', status: 'Pending', responseTime: null, attempts: 0 },
      ]
    },
    {
      level: 'L4',
      name: 'Support Staff',
      members: [
        { name: 'IT Support 1', status: 'Reached', responseTime: '3:15', attempts: 1 },
        { name: 'IT Support 2', status: 'Reached', responseTime: '3:30', attempts: 1 },
        { name: 'Admin Support', status: 'Reached', responseTime: '4:00', attempts: 2 },
        { name: 'Trading Assistant 1', status: 'Reached', responseTime: '3:45', attempts: 1 },
        { name: 'Trading Assistant 2', status: 'Reached', responseTime: '4:10', attempts: 1 },
        { name: 'Trading Assistant 3', status: 'No Answer', responseTime: null, attempts: 3 },
        { name: 'Market Data Analyst', status: 'Reached', responseTime: '4:25', attempts: 1 },
        { name: 'Backup Operator', status: 'Pending', responseTime: null, attempts: 0 },
      ]
    }
  ],
  summary: {
    reached: 18,
    noAnswer: 2,
    calling: 1,
    pending: 1,
    totalAttempts: 28,
    avgResponseTime: '2.5 min',
  }
};

// Available call trees for testing
const availableCallTrees = [
  { id: 'ct-001', name: 'IT Infrastructure Emergency', members: 15, levels: 3, status: 'Active' },
  { id: 'ct-002', name: 'Executive Crisis Team', members: 8, levels: 2, status: 'Active' },
  { id: 'ct-003', name: 'Trading Floor Emergency', members: 22, levels: 4, status: 'Active' },
  { id: 'ct-004', name: 'Regulatory Compliance Team', members: 6, levels: 2, status: 'Active' },
  { id: 'ct-005', name: 'Data Center Operations', members: 12, levels: 3, status: 'Under Review' },
];

export default function CrisisTestingPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'live' | 'history'>('dashboard');
  const [isTestRunning, setIsTestRunning] = useState(true);
  const [selectedCallTree, setSelectedCallTree] = useState('');
  const [testType, setTestType] = useState<'drill' | 'simulation' | 'test'>('drill');
  const [elapsedSeconds, setElapsedSeconds] = useState(525); // 8:45

  // Simulate timer for live test
  useEffect(() => {
    if (isTestRunning && activeTab === 'live') {
      const timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTestRunning, activeTab]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reached': return 'bg-green-100 text-green-700 border-green-200';
      case 'No Answer': return 'bg-red-100 text-red-700 border-red-200';
      case 'Calling': return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'Pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Reached': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'No Answer': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'Calling': return <PhoneIcon className="h-4 w-4 text-blue-600 animate-bounce" />;
      case 'Pending': return <ClockIcon className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  // KPI Cards
  const kpiCards = [
    { label: 'Total Tests (This Month)', value: '12', change: '+3', trend: 'up', icon: ChartBarIcon, color: 'blue' },
    { label: 'Avg Response Rate', value: '94.2%', change: '+2.1%', trend: 'up', icon: SignalIcon, color: 'green' },
    { label: 'Avg Response Time', value: '2.4 min', change: '-0.3', trend: 'up', icon: ClockIcon, color: 'purple' },
    { label: 'Active Tests Now', value: '1', change: '', trend: 'neutral', icon: BoltIcon, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/crisis-management" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <div>
                <h1 className="text-lg font-bold">Crisis Call Testing</h1>
                <p className="text-xs text-gray-400">Test call trees, track responses, analyze statistics</p>
              </div>
            </div>
            {isTestRunning && (
              <div className="flex items-center gap-3 px-4 py-2 bg-red-600/20 rounded-lg border border-red-500/30">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-300">Live Test in Progress</span>
                <span className="text-sm font-bold text-white">{formatTime(elapsedSeconds)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'live', label: 'Live Monitor', icon: SignalIcon },
            { id: 'history', label: 'Test History', icon: ClockIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {kpiCards.map((kpi, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`h-5 w-5 text-${kpi.color}-600`} />
                    {kpi.change && (
                      <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Start New Test Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Start New Call Tree Test</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Call Tree</label>
                  <select
                    value={selectedCallTree}
                    onChange={(e) => setSelectedCallTree(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select a call tree...</option>
                    {availableCallTrees.map(ct => (
                      <option key={ct.id} value={ct.id}>{ct.name} ({ct.members} members)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Test Type</label>
                  <div className="flex gap-2">
                    {['drill', 'simulation', 'test'].map(type => (
                      <button
                        key={type}
                        onClick={() => setTestType(type as any)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                          testType === type
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    disabled={!selectedCallTree}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      selectedCallTree
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <PlayIcon className="h-4 w-4" />
                    Start Test
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Tests Summary */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recent Call Tree Tests</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All →</button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">Call Tree</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">Reached</th>
                    <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">Response Rate</th>
                    <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">Avg Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockCallTreeTests.map(test => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{test.callTreeName}</p>
                        <p className="text-xs text-gray-500">by {test.initiatedBy}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          test.testType === 'Drill' ? 'bg-blue-100 text-blue-700' :
                          test.testType === 'Simulation' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{test.testType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          test.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          test.status === 'In Progress' ? 'bg-orange-100 text-orange-700 animate-pulse' :
                          'bg-gray-100 text-gray-700'
                        }`}>{test.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{test.startedAt.split(' ')[0]}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-gray-900">{test.reached}</span>
                        <span className="text-xs text-gray-500">/{test.totalMembers}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-bold ${
                          test.responseRate >= 95 ? 'text-green-600' :
                          test.responseRate >= 85 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{test.responseRate}%</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{test.avgResponseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-6">
            {/* Live Test Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <h2 className="text-xl font-bold">{mockLiveCallStats.callTreeName}</h2>
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">DRILL</span>
                  </div>
                  <p className="text-sm text-gray-400">Started at {mockLiveCallStats.startTime} • {mockLiveCallStats.totalMembers} total members</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{formatTime(elapsedSeconds)}</p>
                    <p className="text-xs text-gray-400">Elapsed Time</p>
                  </div>
                  <button
                    onClick={() => setIsTestRunning(!isTestRunning)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      isTestRunning
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isTestRunning ? (
                      <>
                        <StopIcon className="h-5 w-5" />
                        Stop Test
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-5 w-5" />
                        Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Statistics Summary */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-500">Reached</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{mockLiveCallStats.summary.reached}</p>
                <p className="text-xs text-gray-500 mt-1">{((mockLiveCallStats.summary.reached / mockLiveCallStats.totalMembers) * 100).toFixed(0)}% of total</p>
              </div>
              <div className="bg-white rounded-lg border-2 border-red-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                  <span className="text-xs font-medium text-gray-500">No Answer</span>
                </div>
                <p className="text-3xl font-bold text-red-600">{mockLiveCallStats.summary.noAnswer}</p>
                <p className="text-xs text-gray-500 mt-1">After 3 attempts</p>
              </div>
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneIcon className="h-5 w-5 text-blue-600 animate-bounce" />
                  <span className="text-xs font-medium text-gray-500">Calling Now</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{mockLiveCallStats.summary.calling}</p>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">Pending</span>
                </div>
                <p className="text-3xl font-bold text-gray-600">{mockLiveCallStats.summary.pending}</p>
                <p className="text-xs text-gray-500 mt-1">In queue</p>
              </div>
              <div className="bg-white rounded-lg border-2 border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-500">Avg Response</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{mockLiveCallStats.summary.avgResponseTime}</p>
                <p className="text-xs text-gray-500 mt-1">{mockLiveCallStats.summary.totalAttempts} total attempts</p>
              </div>
            </div>

            {/* Live Call Progress by Level */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Live Call Progress by Level</h3>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                  <ArrowPathIcon className="h-3.5 w-3.5" />
                  Auto-refreshing
                </button>
              </div>
              <div className="p-4 space-y-4">
                {mockLiveCallStats.levels.map((level, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`px-4 py-2 flex items-center justify-between ${
                      level.level === 'L1' ? 'bg-red-50 border-b border-red-100' :
                      level.level === 'L2' ? 'bg-orange-50 border-b border-orange-100' :
                      level.level === 'L3' ? 'bg-blue-50 border-b border-blue-100' :
                      'bg-gray-50 border-b border-gray-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          level.level === 'L1' ? 'bg-red-600 text-white' :
                          level.level === 'L2' ? 'bg-orange-500 text-white' :
                          level.level === 'L3' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>{level.level}</span>
                        <span className="text-sm font-medium text-gray-700">{level.name}</span>
                        <span className="text-xs text-gray-500">({level.members.length} members)</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-medium">
                          {level.members.filter(m => m.status === 'Reached').length} reached
                        </span>
                        {level.members.some(m => m.status === 'No Answer') && (
                          <span className="text-red-600 font-medium">
                            {level.members.filter(m => m.status === 'No Answer').length} no answer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 grid grid-cols-4 gap-2">
                      {level.members.map((member, mIdx) => (
                        <div
                          key={mIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg border ${getStatusColor(member.status)}`}
                        >
                          {getStatusIcon(member.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{member.name}</p>
                            {member.responseTime && (
                              <p className="text-[10px] text-gray-500">{member.responseTime}</p>
                            )}
                            {member.status === 'Calling' && (
                              <p className="text-[10px] text-blue-600">Attempt {member.attempts}...</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by call tree name..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>All Types</option>
                  <option>Drill</option>
                  <option>Simulation</option>
                  <option>Test</option>
                </select>
                <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-xs text-green-600 mt-1">+12 this month</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Average Response Rate</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <p className="text-xs text-green-600 mt-1">↑ 2.1% vs last month</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Fastest Response</p>
                <p className="text-2xl font-bold text-blue-600">0:45</p>
                <p className="text-xs text-gray-500 mt-1">Executive Crisis Team</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">Coverage Rate</p>
                <p className="text-2xl font-bold text-purple-600">98.5%</p>
                <p className="text-xs text-gray-500 mt-1">Members reached at least once</p>
              </div>
            </div>

            {/* Full History Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Test ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Call Tree</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Started</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Reached/Total</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Response Rate</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Avg Time</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockCallTreeTests.filter(t => t.status === 'Completed').map(test => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{test.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{test.callTreeName}</p>
                        <p className="text-xs text-gray-500">by {test.initiatedBy}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          test.testType === 'Drill' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>{test.testType}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{test.startedAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{test.duration}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-green-600">{test.reached}</span>
                        <span className="text-sm text-gray-500">/{test.totalMembers}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-bold ${
                          test.responseRate >= 95 ? 'text-green-600' : test.responseRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{test.responseRate}%</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{test.avgResponseTime}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View Report</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
