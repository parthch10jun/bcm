'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PhoneIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Mock data for call tree members (hierarchical structure)
const mockTreeMembers = {
  'ct-001': {
    name: 'IT Infrastructure Emergency',
    description: 'Communication tree for critical IT system failures',
    purpose: 'Rapid notification and coordination for IT emergencies',
    applicableScenarios: ['Server outage', 'Network failure', 'Cyber security incident'],
    status: 'Active',
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-01',
    lastActivated: '2024-01-25',
    maxCallAttempts: 3,
    defaultTimeoutMinutes: 15,
    escalationPolicy: 'Automatic',
    approvedBy: 'Jane Smith',
    approvedDate: '2024-01-20',
    nextReviewDate: '2024-07-20',
    members: [
      {
        id: '1',
        name: 'Rajesh Kumar',
        role: 'IT Director',
        department: 'Information Technology',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@company.com',
        location: 'Gurugram HQ',
        level: 1,
        isKeyPersonnel: true,
        children: [
          {
            id: '2',
            name: 'Priya Sharma',
            role: 'Infrastructure Manager',
            department: 'IT Infrastructure',
            phone: '+91 98765 43211',
            email: 'priya.sharma@company.com',
            location: 'Gurugram HQ',
            level: 2,
            isKeyPersonnel: true,
            children: [
              { id: '5', name: 'Amit Patel', role: 'Senior Network Engineer', department: 'Network Operations', phone: '+91 98765 43214', email: 'amit.patel@company.com', location: 'Gurugram HQ', level: 3, isKeyPersonnel: false, children: [] },
              { id: '6', name: 'Sneha Gupta', role: 'System Administrator', department: 'IT Infrastructure', phone: '+91 98765 43215', email: 'sneha.gupta@company.com', location: 'Gurugram HQ', level: 3, isKeyPersonnel: false, children: [] }
            ]
          },
          {
            id: '3',
            name: 'Vikram Singh',
            role: 'Security Manager',
            department: 'IT Security',
            phone: '+91 98765 43212',
            email: 'vikram.singh@company.com',
            location: 'Gurugram HQ',
            level: 2,
            isKeyPersonnel: true,
            children: [
              { id: '7', name: 'Rahul Verma', role: 'Security Analyst', department: 'IT Security', phone: '+91 98765 43216', email: 'rahul.verma@company.com', location: 'Gurugram HQ', level: 3, isKeyPersonnel: false, children: [] }
            ]
          },
          {
            id: '4',
            name: 'Anita Desai',
            role: 'Application Manager',
            department: 'IT Applications',
            phone: '+91 98765 43213',
            email: 'anita.desai@company.com',
            location: 'Mumbai Office',
            level: 2,
            isKeyPersonnel: true,
            children: [
              { id: '8', name: 'Karan Mehta', role: 'Senior Developer', department: 'IT Applications', phone: '+91 98765 43217', email: 'karan.mehta@company.com', location: 'Mumbai Office', level: 3, isKeyPersonnel: false, children: [] },
              { id: '9', name: 'Deepika Nair', role: 'Database Administrator', department: 'IT Applications', phone: '+91 98765 43218', email: 'deepika.nair@company.com', location: 'Mumbai Office', level: 3, isKeyPersonnel: false, children: [] }
            ]
          }
        ]
      }
    ],
    recentActivations: [
      { id: 'act-001', date: '2024-01-25', reason: 'Primary database server failure', status: 'Completed', duration: '45 mins', reached: 8, total: 9 },
      { id: 'act-002', date: '2024-01-10', reason: 'Network switch outage', status: 'Completed', duration: '30 mins', reached: 9, total: 9 }
    ]
  },
  'ct-002': {
    name: 'Gurugram Office Evacuation',
    description: 'Emergency evacuation communication for Gurugram headquarters',
    purpose: 'Coordinate safe evacuation and accountability',
    applicableScenarios: ['Fire alarm', 'Security threat', 'Natural disaster'],
    status: 'Active',
    createdBy: 'Priya Sharma',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
    lastActivated: undefined as string | undefined,
    maxCallAttempts: 2,
    defaultTimeoutMinutes: 10,
    escalationPolicy: 'Manual',
    approvedBy: 'Mike Johnson',
    approvedDate: '2024-01-22',
    nextReviewDate: '2024-07-22',
    members: [
      {
        id: '1',
        name: 'Mike Johnson',
        role: 'Facility Manager',
        department: 'Operations',
        phone: '+91 98765 54321',
        email: 'mike.johnson@company.com',
        location: 'Gurugram HQ',
        level: 1,
        isKeyPersonnel: true,
        children: [
          { id: '2', name: 'Floor 1 Warden', role: 'Fire Warden', department: 'Safety', phone: '+91 98765 54322', email: 'floor1.warden@company.com', location: 'Gurugram HQ', level: 2, isKeyPersonnel: true, children: [] },
          { id: '3', name: 'Floor 2 Warden', role: 'Fire Warden', department: 'Safety', phone: '+91 98765 54323', email: 'floor2.warden@company.com', location: 'Gurugram HQ', level: 2, isKeyPersonnel: true, children: [] }
        ]
      }
    ],
    recentActivations: []
  },
  'ct-003': {
    name: 'Crisis Management Team',
    description: 'Executive crisis management communication',
    purpose: 'Activate senior leadership for major incidents',
    applicableScenarios: ['Major business disruption', 'Public relations crisis', 'Regulatory incident'],
    status: 'Under Review',
    createdBy: 'Sarah Wilson',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
    maxCallAttempts: 5,
    defaultTimeoutMinutes: 30,
    escalationPolicy: 'Automatic',
    approvedBy: undefined as string | undefined,
    approvedDate: undefined as string | undefined,
    lastActivated: undefined as string | undefined,
    nextReviewDate: '2024-08-01',
    members: [
      {
        id: '1',
        name: 'CEO Office',
        role: 'Chief Executive Officer',
        department: 'Executive',
        phone: '+91 98765 00001',
        email: 'ceo@company.com',
        location: 'Mumbai HQ',
        level: 1,
        isKeyPersonnel: true,
        children: []
      }
    ],
    recentActivations: []
  }
};

interface TreeMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  location: string;
  level: number;
  isKeyPersonnel: boolean;
  children: TreeMember[];
}

function TreeNode({ member, expanded, onToggle }: { member: TreeMember; expanded: Set<string>; onToggle: (id: string) => void }) {
  const hasChildren = member.children && member.children.length > 0;
  const isExpanded = expanded.has(member.id);

  return (
    <div className="ml-3 first:ml-0">
      <div className={`flex items-center p-2 rounded-sm border ${member.isKeyPersonnel ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} hover:shadow-sm transition-shadow mb-1.5`}>
        {hasChildren ? (
          <button onClick={() => onToggle(member.id)} className="mr-1.5 text-gray-500 hover:text-gray-700">
            {isExpanded ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronRightIcon className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <div className="w-5 mr-1.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-900">{member.name}</span>
            {member.isKeyPersonnel && (
              <span className="px-1 py-0.5 text-[9px] font-medium bg-blue-100 text-blue-700 rounded-sm border border-blue-200">Key</span>
            )}
          </div>
          <div className="text-[10px] text-gray-600">{member.role} • {member.department}</div>
          <div className="flex items-center gap-3 mt-0.5 text-[9px] text-gray-500">
            <span className="flex items-center gap-0.5"><PhoneIcon className="h-2.5 w-2.5" />{member.phone}</span>
            <span className="flex items-center gap-0.5 truncate"><EnvelopeIcon className="h-2.5 w-2.5" />{member.email}</span>
            <span className="flex items-center gap-0.5"><MapPinIcon className="h-2.5 w-2.5" />{member.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-green-600 hover:bg-green-50 rounded-sm" title="Call">
            <PhoneIcon className="h-3.5 w-3.5" />
          </button>
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm" title="Email">
            <EnvelopeIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-gray-200 pl-3">
          {member.children.map(child => (
            <TreeNode key={child.id} member={child} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CallTreeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
  const [activeTab, setActiveTab] = useState<'tree' | 'history'>('tree');

  const treeData = mockTreeMembers[params.id as keyof typeof mockTreeMembers];

  if (!treeData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Call Tree Not Found</h1>
          <p className="mt-2 text-gray-600">The requested call tree does not exist.</p>
          <Link href="/call-trees" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Call Trees
          </Link>
        </div>
      </div>
    );
  }

  const toggleNode = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const countMembers = (members: TreeMember[]): number => {
    return members.reduce((acc, m) => acc + 1 + countMembers(m.children), 0);
  };

  const totalMembers = countMembers(treeData.members);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-1 text-gray-400 hover:text-gray-600">
                  <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-gray-900">{treeData.name}</h1>
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm border ${getStatusColor(treeData.status)}`}>
                      {treeData.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{treeData.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center h-[28px] px-2.5 border border-gray-300 text-[10px] font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
                  <DocumentDuplicateIcon className="h-3.5 w-3.5 mr-1" /> Clone
                </button>
                <Link href={`/call-trees/${params.id}/edit`} className="inline-flex items-center h-[28px] px-2.5 border border-gray-300 text-[10px] font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
                  <PencilIcon className="h-3.5 w-3.5 mr-1" /> Edit
                </Link>
                <button className="inline-flex items-center h-[28px] px-2.5 text-[10px] font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800">
                  <PlayIcon className="h-3.5 w-3.5 mr-1" /> Activate
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-sm border border-gray-200 p-3">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Members</p>
              <div className="mt-1.5 flex items-baseline">
                <p className="text-xl font-semibold text-gray-900">{totalMembers}</p>
                <span className="ml-1 text-[10px] text-gray-500">people</span>
              </div>
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Activations</p>
              <div className="mt-1.5 flex items-baseline">
                <p className="text-xl font-semibold text-gray-900">{treeData.recentActivations.length}</p>
                <span className="ml-1 text-[10px] text-gray-500">times</span>
              </div>
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Default Timeout</p>
              <div className="mt-1.5 flex items-baseline">
                <p className="text-xl font-semibold text-gray-900">{treeData.defaultTimeoutMinutes}</p>
                <span className="ml-1 text-[10px] text-gray-500">minutes</span>
              </div>
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Max Call Attempts</p>
              <div className="mt-1.5 flex items-baseline">
                <p className="text-xl font-semibold text-gray-900">{treeData.maxCallAttempts}</p>
                <span className="ml-1 text-[10px] text-gray-500">attempts</span>
              </div>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-gray-100 p-0.5 rounded-sm">
              <button
                onClick={() => setActiveTab('tree')}
                className={`inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-medium transition-all duration-200 ${activeTab === 'tree' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <UserGroupIcon className="h-3.5 w-3.5 mr-1.5" />
                Call Tree Structure
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-medium transition-all duration-200 ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                Activation History
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-sm border border-gray-200">
            <div className="p-3">
              {activeTab === 'tree' ? (
                <div className="space-y-1">
                  {treeData.members.map(member => (
                    <TreeNode key={member.id} member={member} expanded={expanded} onToggle={toggleNode} />
                  ))}
                </div>
              ) : (
                <div>
                  {treeData.recentActivations.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <ClockIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-xs">No activation history available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Initiated By</th>
                            <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Response Rate</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {treeData.recentActivations.map(activation => (
                            <tr key={activation.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="text-xs font-medium text-gray-900">{activation.date}</div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="text-xs text-gray-900">{activation.reason}</div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="text-xs text-gray-700">System Admin</div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-sm border ${
                                  activation.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>{activation.status}</span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <span className="text-xs text-gray-700">{activation.duration}</span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${(activation.reached / activation.total) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-gray-600">{activation.reached}/{activation.total}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="mt-4 bg-white rounded-sm border border-gray-200 p-3">
            <h3 className="text-xs font-medium text-gray-900 mb-2">Configuration Details</h3>
            <div className="grid grid-cols-4 gap-3 text-[10px]">
              <div><span className="text-gray-500">Created By:</span><span className="ml-1.5 text-gray-900">{treeData.createdBy}</span></div>
              <div><span className="text-gray-500">Created:</span><span className="ml-1.5 text-gray-900">{treeData.createdAt}</span></div>
              <div><span className="text-gray-500">Last Updated:</span><span className="ml-1.5 text-gray-900">{treeData.updatedAt}</span></div>
              <div><span className="text-gray-500">Next Review:</span><span className="ml-1.5 text-gray-900">{treeData.nextReviewDate}</span></div>
              <div><span className="text-gray-500">Escalation Policy:</span><span className="ml-1.5 text-gray-900">{treeData.escalationPolicy}</span></div>
              {treeData.approvedBy && (<div><span className="text-gray-500">Approved By:</span><span className="ml-1.5 text-gray-900">{treeData.approvedBy}</span></div>)}
              <div className="col-span-2"><span className="text-gray-500">Applicable Scenarios:</span><span className="ml-1.5 text-gray-900">{treeData.applicableScenarios.join(', ')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
