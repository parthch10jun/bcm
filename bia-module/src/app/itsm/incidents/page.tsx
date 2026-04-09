'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  ServerIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

type IncidentStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated';
type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentCategory = 'Infrastructure' | 'Application' | 'Database' | 'Network' | 'Security' | 'Service Outage';

interface Incident {
  id: string;
  number: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  affectedService: string;
  affectedServiceId: string;
  businessImpact: string;
  assignedTo: string;
  reportedBy: string;
  reportedDate: string;
  resolvedDate?: string;
  slaBreached: boolean;
  slaDueDate: string;
  timeToResolve?: string;
  triggeredDRPlan?: string;
  linkedBIA?: string;
  rootCause?: string;
  resolution?: string;
  relatedIncidents?: string[];
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    number: 'INC0001234',
    title: 'Core Insurance Platform - Database Connection Failure',
    description: 'Primary database connection pool exhausted, causing application timeouts and service degradation',
    category: 'Database',
    priority: 'Critical',
    status: 'Resolved',
    affectedService: 'Core Insurance Platform',
    affectedServiceId: 'ITS-001',
    businessImpact: 'Policy management and claims processing unavailable. Estimated revenue impact: €50,000/hour',
    assignedTo: 'Database Team',
    reportedBy: 'Monitoring System',
    reportedDate: '2024-12-15 09:15:00',
    resolvedDate: '2024-12-15 11:30:00',
    slaBreached: false,
    slaDueDate: '2024-12-15 13:15:00',
    timeToResolve: '2h 15m',
    triggeredDRPlan: 'BCP-004',
    linkedBIA: 'BIA-INS-001',
    rootCause: 'Database connection pool misconfiguration after recent update',
    resolution: 'Increased connection pool size and implemented connection timeout monitoring',
    relatedIncidents: []
  },
  {
    id: 'INC-002',
    number: 'INC0001235',
    title: 'Payment Gateway - Service Unavailable',
    description: 'Payment gateway returning 503 errors, preventing premium collection and claims payment processing',
    category: 'Application',
    priority: 'Critical',
    status: 'In Progress',
    affectedService: 'Payment Gateway',
    affectedServiceId: 'ITS-007',
    businessImpact: 'Unable to process payments. 150+ transactions queued. Estimated impact: €75,000/hour',
    assignedTo: 'Application Support Team',
    reportedBy: 'Customer Service',
    reportedDate: '2024-12-15 14:30:00',
    slaBreached: false,
    slaDueDate: '2024-12-15 16:30:00',
    triggeredDRPlan: 'BCP-007',
    linkedBIA: 'BIA-PAY-001'
  },
  {
    id: 'INC-003',
    number: 'INC0001236',
    title: 'Network Latency - Munich Data Center',
    description: 'High network latency detected between Munich and Frankfurt sites affecting replication',
    category: 'Network',
    priority: 'High',
    status: 'Assigned',
    affectedService: 'Network Infrastructure',
    affectedServiceId: 'ITS-010',
    businessImpact: 'Database replication lag increasing. RPO at risk if primary site fails',
    assignedTo: 'Network Operations',
    reportedBy: 'Monitoring System',
    reportedDate: '2024-12-15 15:45:00',
    slaBreached: false,
    slaDueDate: '2024-12-15 19:45:00',
    linkedBIA: 'BIA-INF-001'
  },
  {
    id: 'INC-004',
    number: 'INC0001237',
    title: 'Ransomware Detection - Email Server',
    description: 'Suspicious encryption activity detected on email server. Potential ransomware attack',
    category: 'Security',
    priority: 'Critical',
    status: 'Escalated',
    affectedService: 'Email System',
    affectedServiceId: 'ITS-012',
    businessImpact: 'Email services isolated. Business communication disrupted. Potential data loss',
    assignedTo: 'Security Operations Center',
    reportedBy: 'SIEM System',
    reportedDate: '2024-12-15 16:00:00',
    slaBreached: false,
    slaDueDate: '2024-12-15 17:00:00',
    triggeredDRPlan: 'BCP-005',
    linkedBIA: 'BIA-SEC-001'
  },
  {
    id: 'INC-005',
    number: 'INC0001238',
    title: 'Customer Portal - Slow Response Time',
    description: 'Customer portal experiencing degraded performance. Page load times exceeding 10 seconds',
    category: 'Application',
    priority: 'Medium',
    status: 'New',
    affectedService: 'Customer Portal',
    affectedServiceId: 'ITS-006',
    businessImpact: 'Customer experience degraded. Potential customer complaints and reputation damage',
    assignedTo: 'Unassigned',
    reportedBy: 'Customer Service',
    reportedDate: '2024-12-15 16:30:00',
    slaBreached: false,
    slaDueDate: '2024-12-16 00:30:00',
    linkedBIA: 'BIA-CUS-001'
  }
];

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.affectedService.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriority || incident.priority === selectedPriority;
    const matchesStatus = !selectedStatus || incident.status === selectedStatus;
    const matchesCategory = !selectedCategory || incident.category === selectedCategory;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const stats = {
    total: mockIncidents.length,
    critical: mockIncidents.filter(i => i.priority === 'Critical').length,
    active: mockIncidents.filter(i => i.status === 'New' || i.status === 'Assigned' || i.status === 'In Progress' || i.status === 'Escalated').length,
    slaBreached: mockIncidents.filter(i => i.slaBreached).length,
    avgResolutionTime: '2h 45m'
  };

  const getPriorityColor = (priority: IncidentPriority) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'New': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Assigned': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'In Progress': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Resolved': return 'text-green-700 bg-green-50 border-green-200';
      case 'Closed': return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'Escalated': return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Incident Management</h1>
              <p className="mt-0.5 text-xs text-gray-500">
                Track and resolve IT service incidents with ITSCM integration
              </p>
            </div>
            <Link
              href="/itsm/incidents/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Report Incident
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-50 rounded-sm flex items-center justify-center">
                <ChartBarIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Total Incidents</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-red-50 rounded-sm flex items-center justify-center">
                <BoltIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Critical</p>
                <p className="text-lg font-semibold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-orange-50 rounded-sm flex items-center justify-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Active</p>
                <p className="text-lg font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-50 rounded-sm flex items-center justify-center">
                <ClockIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">SLA Breached</p>
                <p className="text-lg font-semibold text-gray-900">{stats.slaBreached}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-50 rounded-sm flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-500">Avg Resolution</p>
                <p className="text-lg font-semibold text-gray-900">{stats.avgResolutionTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-[30px] pl-7 pr-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            <div className="w-40">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="w-40">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div className="w-40">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
              >
                <option value="">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Application">Application</option>
                <option value="Database">Database</option>
                <option value="Network">Network</option>
                <option value="Security">Security</option>
                <option value="Service Outage">Service Outage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Affected Service
                  </th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Category
                  </th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Priority
                  </th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Assigned To
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    SLA Due
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    ITSCM Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <Link href={`/itsm/incidents/${incident.id}`} className="block">
                        <div className="text-xs font-medium text-gray-900 hover:text-gray-700">
                          {incident.number}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-md">
                          {incident.title}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/libraries/it-services/${incident.affectedServiceId}`} className="text-xs text-gray-900 hover:text-gray-700">
                        {incident.affectedService}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs text-gray-700">{incident.category}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center w-14 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex justify-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-700">
                      {incident.assignedTo}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <ClockIcon className={`h-3 w-3 ${incident.slaBreached ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${incident.slaBreached ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                          {new Date(incident.slaDueDate).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        {incident.triggeredDRPlan && (
                          <Link
                            href={`/it-dr-plans/${incident.triggeredDRPlan}`}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {incident.triggeredDRPlan}
                          </Link>
                        )}
                        {incident.linkedBIA && (
                          <Link
                            href={`/bia-records/${incident.linkedBIA}`}
                            className="text-[10px] text-purple-600 hover:text-purple-800 font-medium"
                          >
                            {incident.linkedBIA}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

