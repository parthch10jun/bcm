'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CallTree, CallTreeActivation } from '@/types/callTree';
import {
  PhoneIcon,
  PlusIcon,
  PlayIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mockCallTrees: CallTree[] = [
  {
    id: 'ct-001',
    name: 'IT Infrastructure Emergency',
    description: 'Communication tree for critical IT system failures',
    purpose: 'Rapid notification and coordination for IT emergencies',
    applicableScenarios: ['Server outage', 'Network failure', 'Cyber security incident'],
    rootNodes: [], // Would contain actual tree structure
    createdBy: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
    lastActivated: new Date('2024-01-25'),
    maxCallAttempts: 3,
    defaultTimeoutMinutes: 15,
    escalationPolicy: 'Automatic',
    status: 'Active',
    approvedBy: 'Jane Smith',
    approvedDate: new Date('2024-01-20'),
    nextReviewDate: new Date('2024-07-20')
  },
  {
    id: 'ct-002',
    name: 'Gurugram Office Evacuation',
    description: 'Emergency evacuation communication for Gurugram headquarters',
    purpose: 'Coordinate safe evacuation and accountability',
    applicableScenarios: ['Fire alarm', 'Security threat', 'Natural disaster'],
    rootNodes: [],
    createdBy: 'Priya Sharma',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    maxCallAttempts: 2,
    defaultTimeoutMinutes: 10,
    escalationPolicy: 'Manual',
    status: 'Active',
    approvedBy: 'Mike Johnson',
    approvedDate: new Date('2024-01-22'),
    nextReviewDate: new Date('2024-07-22')
  },
  {
    id: 'ct-003',
    name: 'Crisis Management Team',
    description: 'Executive crisis management communication',
    purpose: 'Activate senior leadership for major incidents',
    applicableScenarios: ['Major business disruption', 'Public relations crisis', 'Regulatory incident'],
    rootNodes: [],
    createdBy: 'Sarah Wilson',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    maxCallAttempts: 5,
    defaultTimeoutMinutes: 30,
    escalationPolicy: 'Automatic',
    status: 'Under Review',
    nextReviewDate: new Date('2024-08-01')
  }
];

const mockActivations: CallTreeActivation[] = [
  {
    id: 'act-001',
    callTreeId: 'ct-001',
    activatedBy: 'John Doe',
    activatedAt: new Date('2024-01-25T14:30:00'),
    reason: 'Primary database server failure',
    callProgress: [
      {
        contactId: 'contact-001',
        status: 'Reached',
        attemptCount: 1,
        lastAttemptAt: new Date('2024-01-25T14:31:00'),
        reachedAt: new Date('2024-01-25T14:31:00')
      },
      {
        contactId: 'contact-002',
        status: 'No Answer',
        attemptCount: 3,
        lastAttemptAt: new Date('2024-01-25T14:45:00')
      }
    ],
    completedAt: new Date('2024-01-25T15:15:00'),
    effectiveness: 'Good',
    lessonsLearned: 'Need backup contact for network administrator'
  }
];

export default function CallTreesPage() {
  const router = useRouter();
  const [callTrees, setCallTrees] = useState<CallTree[]>([]);
  const [activations, setActivations] = useState<CallTreeActivation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setCallTrees(mockCallTrees);
    setActivations(mockActivations);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLastActivation = (callTreeId: string) => {
    return activations
      .filter(act => act.callTreeId === callTreeId)
      .sort((a, b) => b.activatedAt.getTime() - a.activatedAt.getTime())[0];
  };

  // Filter call trees
  const filteredCallTrees = callTrees.filter(tree => {
    if (selectedStatus && tree.status !== selectedStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!tree.name.toLowerCase().includes(search) &&
          !tree.description.toLowerCase().includes(search) &&
          !tree.purpose?.toLowerCase().includes(search)) return false;
    }
    return true;
  });

  // Stats
  const totalTrees = callTrees.length;
  const activeTrees = callTrees.filter(tree => tree.status === 'Active').length;
  const underReviewTrees = callTrees.filter(tree => tree.status === 'Under Review').length;
  const recentActivations = activations.length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  Call Tree Management
                </h1>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  Emergency communication plans and activation tracking
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/call-trees/templates"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Templates
                </Link>
                <Link
                  href="/call-trees/new"
                  className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Call Tree
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 sm:px-8 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-3">
              {/* Total Call Trees */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Call Trees</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{totalTrees}</p>
                      <span className="ml-1 text-xs text-gray-500">trees</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Trees */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Active Trees</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-green-600">{activeTrees}</p>
                      <span className="ml-1 text-xs text-gray-500">active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activations */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recent Activations</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{recentActivations}</p>
                      <span className="ml-1 text-xs text-gray-500">activations</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Needs Review */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Needs Review</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{underReviewTrees}</p>
                      <span className="ml-1 text-xs text-gray-500">pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search call trees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full h-[30px] pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-40">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                        Call Tree
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                        Purpose & Scenarios
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                        Status
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[18%]">
                        Last Activation
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCallTrees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <PhoneIcon className="mx-auto h-10 w-10 text-gray-400" />
                          <p className="mt-2 text-xs text-gray-500">
                            {searchTerm || selectedStatus
                              ? 'No call trees match your filters'
                              : 'No call trees yet. Create your first call tree to get started.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredCallTrees.map((callTree) => {
                        const lastActivation = getLastActivation(callTree.id);
                        return (
                          <tr
                            key={callTree.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => router.push(`/call-trees/${callTree.id}`)}
                          >
                            <td className="px-3 py-2">
                              <div className="text-xs font-medium text-gray-900 truncate">{callTree.name}</div>
                              <div className="text-[10px] text-gray-500 truncate">{callTree.description}</div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-xs text-gray-900 truncate">{callTree.purpose}</div>
                              <div className="text-[10px] text-gray-500 truncate">
                                {callTree.applicableScenarios.slice(0, 2).join(', ')}
                                {callTree.applicableScenarios.length > 2 && '...'}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center justify-center w-[90px] px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(callTree.status)}`}>
                                {callTree.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              {lastActivation ? (
                                <div>
                                  <div className="text-xs text-gray-900">
                                    {lastActivation.activatedAt.toLocaleDateString()}
                                  </div>
                                  <div className="text-[10px] text-gray-500 truncate">
                                    {lastActivation.reason}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Never activated</span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center space-x-2">
                                <Link
                                  href={`/call-trees/${callTree.id}`}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="View Details"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/call-trees/${callTree.id}/edit`}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Link>
                                {callTree.status === 'Active' && (
                                  <button
                                    className="text-gray-600 hover:text-gray-900"
                                    title="Activate Call Tree"
                                  >
                                    <PlayIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activations */}
            {activations.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider">Recent Activations</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {activations.slice(0, 3).map((activation) => {
                      const callTree = callTrees.find(tree => tree.id === activation.callTreeId);
                      const successRate = activation.callProgress.filter(p => p.status === 'Reached').length / activation.callProgress.length * 100;

                      return (
                        <div key={activation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <PlayIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900">{callTree?.name}</div>
                              <div className="text-[10px] text-gray-500">{activation.reason}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-900">{successRate.toFixed(0)}% Success</div>
                            <div className="text-[10px] text-gray-500">{activation.activatedAt.toLocaleDateString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
