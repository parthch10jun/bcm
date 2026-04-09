'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ClockIcon,
  UserIcon,
  ServerIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

type IncidentStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated';
type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentCategory = 'Infrastructure' | 'Application' | 'Database' | 'Network' | 'Security' | 'Service Outage';

interface TimelineEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'status_change' | 'assignment' | 'comment' | 'escalation' | 'resolution';
}

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
  closedDate?: string;
  slaBreached: boolean;
  slaDueDate: string;
  timeToResolve?: string;
  triggeredDRPlan?: string;
  linkedBIA?: string;
  rootCause?: string;
  resolution?: string;
  relatedIncidents?: string[];
  timeline: TimelineEvent[];
  affectedUsers: number;
  estimatedRevenueLoss?: string;
  technicalDetails: string;
  workaround?: string;
}

const mockIncidentDetails: Record<string, Incident> = {
  'INC-001': {
    id: 'INC-001',
    number: 'INC0001234',
    title: 'Core Insurance Platform - Database Connection Failure',
    description: 'Primary database connection pool exhausted, causing application timeouts and service degradation. Multiple users reporting inability to access policy management and claims processing functions.',
    category: 'Database',
    priority: 'Critical',
    status: 'Resolved',
    affectedService: 'Core Insurance Platform',
    affectedServiceId: 'ITS-001',
    businessImpact: 'Policy management and claims processing unavailable. Estimated revenue impact: €50,000/hour. 250+ users affected across Munich and Frankfurt offices.',
    assignedTo: 'Database Team',
    reportedBy: 'Monitoring System',
    reportedDate: '2024-12-15 09:15:00',
    resolvedDate: '2024-12-15 11:30:00',
    slaBreached: false,
    slaDueDate: '2024-12-15 13:15:00',
    timeToResolve: '2h 15m',
    triggeredDRPlan: 'BCP-001',
    linkedBIA: 'BIA-INS-001',
    rootCause: 'Database connection pool misconfiguration after recent update. Connection pool size was set to 50 but actual concurrent user load reached 180 during peak hours.',
    resolution: 'Increased connection pool size from 50 to 300. Implemented connection timeout monitoring with alerts at 70% threshold. Added auto-scaling rules for connection pool based on load.',
    affectedUsers: 250,
    estimatedRevenueLoss: '€112,500',
    technicalDetails: 'PostgreSQL connection pool exhaustion. Error logs showing "FATAL: sorry, too many clients already". Database CPU at 95%, memory at 78%. No disk I/O issues detected.',
    workaround: 'Users directed to use backup read-only reporting interface for urgent queries. Critical transactions queued for batch processing after resolution.',
    timeline: [
      {
        id: 'evt-001',
        timestamp: '2024-12-15 09:15:00',
        user: 'Monitoring System',
        action: 'Incident Created',
        details: 'Automated alert triggered: Database connection pool at 100%',
        type: 'status_change'
      },
      {
        id: 'evt-002',
        timestamp: '2024-12-15 09:18:00',
        user: 'IT Service Desk',
        action: 'Assigned to Database Team',
        details: 'Incident escalated to Database Team based on category and priority',
        type: 'assignment'
      },
      {
        id: 'evt-003',
        timestamp: '2024-12-15 09:25:00',
        user: 'Thomas Weber (DBA)',
        action: 'Status Changed to In Progress',
        details: 'Investigation started. Reviewing database logs and connection metrics.',
        type: 'status_change'
      },
      {
        id: 'evt-004',
        timestamp: '2024-12-15 09:45:00',
        user: 'Thomas Weber (DBA)',
        action: 'DR Plan Triggered',
        details: 'Activated BCP-001 (Core Insurance Platform Recovery) - Standby database promoted',
        type: 'escalation'
      },
      {
        id: 'evt-005',
        timestamp: '2024-12-15 10:30:00',
        user: 'Thomas Weber (DBA)',
        action: 'Comment Added',
        details: 'Root cause identified: Connection pool misconfiguration. Implementing fix on primary database.',
        type: 'comment'
      },
      {
        id: 'evt-006',
        timestamp: '2024-12-15 11:15:00',
        user: 'Thomas Weber (DBA)',
        action: 'Comment Added',
        details: 'Fix deployed. Connection pool increased to 300. Monitoring for stability.',
        type: 'comment'
      },
      {
        id: 'evt-007',
        timestamp: '2024-12-15 11:30:00',
        user: 'Thomas Weber (DBA)',
        action: 'Status Changed to Resolved',
        details: 'Service fully restored. All users can access the platform. Monitoring shows healthy connection pool usage at 45%.',
        type: 'resolution'
      }
    ]
  },
  'INC-002': {
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
    linkedBIA: 'BIA-PAY-001',
    affectedUsers: 85,
    estimatedRevenueLoss: '€150,000',
    technicalDetails: 'Payment gateway API returning HTTP 503. Load balancer shows all backend servers in unhealthy state. Database connections appear normal.',
    workaround: 'Manual payment processing via backup system for critical transactions only.',
    timeline: [
      {
        id: 'evt-001',
        timestamp: '2024-12-15 14:30:00',
        user: 'Customer Service',
        action: 'Incident Created',
        details: 'Multiple customers reporting payment failures',
        type: 'status_change'
      },
      {
        id: 'evt-002',
        timestamp: '2024-12-15 14:35:00',
        user: 'IT Service Desk',
        action: 'Assigned to Application Support Team',
        details: 'Critical priority - immediate response required',
        type: 'assignment'
      },
      {
        id: 'evt-003',
        timestamp: '2024-12-15 14:40:00',
        user: 'Maria Schmidt (App Support)',
        action: 'Status Changed to In Progress',
        details: 'Investigating payment gateway backend servers',
        type: 'status_change'
      }
    ]
  }
};

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;
  const incident = mockIncidentDetails[incidentId];

  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'impact' | 'resolution'>('details');

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Incident not found</h3>
          <p className="mt-1 text-sm text-gray-500">The incident you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link href="/itsm/incidents" className="text-sm font-medium text-red-600 hover:text-red-500">
              ← Back to Incidents
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/itsm/incidents"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              Back to Incidents
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-semibold text-gray-900">{incident.number}</h1>
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getPriorityColor(incident.priority)}`}>
                  {incident.priority}
                </span>
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              <h2 className="text-sm text-gray-700 mb-2">{incident.title}</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ServerIcon className="h-3.5 w-3.5" />
                  <Link href={`/libraries/it-services/${incident.affectedServiceId}`} className="hover:text-gray-700">
                    {incident.affectedService}
                  </Link>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>{incident.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span>{new Date(incident.reportedDate).toLocaleString('en-GB')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {incident.status === 'In Progress' && (
                <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700 transition-colors">
                  Mark as Resolved
                </button>
              )}
              {incident.status === 'Resolved' && (
                <button className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-sm hover:bg-gray-700 transition-colors">
                  Close Incident
                </button>
              )}
              {(incident.status === 'New' || incident.status === 'Assigned') && (
                <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700 transition-colors">
                  Escalate to IT DR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                activeTab === 'details'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                activeTab === 'timeline'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                activeTab === 'impact'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Business Impact
            </button>
            <button
              onClick={() => setActiveTab('resolution')}
              className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                activeTab === 'resolution'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resolution
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'details' && (
              <>
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Incident Description</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{incident.description}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{incident.technicalDetails}</p>
                </div>

                {incident.workaround && (
                  <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                    <div className="flex items-start gap-2">
                      <BoltIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-semibold text-amber-900 mb-1">Workaround Available</h3>
                        <p className="text-xs text-amber-800">{incident.workaround}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Incident Timeline</h3>
                <div className="space-y-4">
                  {incident.timeline.map((event, index) => (
                    <div key={event.id} className="relative">
                      {index !== incident.timeline.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className="flex gap-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          event.type === 'resolution' ? 'bg-green-100' :
                          event.type === 'escalation' ? 'bg-red-100' :
                          event.type === 'status_change' ? 'bg-blue-100' :
                          event.type === 'assignment' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {event.type === 'resolution' && <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />}
                          {event.type === 'escalation' && <BoltIcon className="h-3.5 w-3.5 text-red-600" />}
                          {event.type === 'status_change' && <ArrowPathIcon className="h-3.5 w-3.5 text-blue-600" />}
                          {event.type === 'assignment' && <UserIcon className="h-3.5 w-3.5 text-purple-600" />}
                          {event.type === 'comment' && <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-gray-600" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-medium text-gray-900">{event.action}</p>
                            <p className="text-[10px] text-gray-500">
                              {new Date(event.timestamp).toLocaleString('en-GB')}
                            </p>
                          </div>
                          <p className="text-[10px] text-gray-600 mb-0.5">{event.user}</p>
                          <p className="text-xs text-gray-700">{event.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <>
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Impact Assessment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-medium text-gray-700 uppercase">Impact Description</label>
                      <p className="mt-1 text-xs text-gray-900">{incident.businessImpact}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-medium text-gray-700 uppercase">Affected Users</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{incident.affectedUsers}</p>
                      </div>
                      {incident.estimatedRevenueLoss && (
                        <div>
                          <label className="text-[10px] font-medium text-gray-700 uppercase">Est. Revenue Loss</label>
                          <p className="mt-1 text-lg font-semibold text-red-600">{incident.estimatedRevenueLoss}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {incident.linkedBIA && (
                  <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
                    <div className="flex items-start gap-2">
                      <DocumentTextIcon className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-purple-900 mb-1">Linked Business Impact Analysis</h3>
                        <p className="text-xs text-purple-800 mb-2">
                          This incident affects a service covered by BIA {incident.linkedBIA}
                        </p>
                        <Link
                          href={`/bia-records/${incident.linkedBIA}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-800"
                        >
                          View BIA Record →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {incident.triggeredDRPlan && (
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-blue-900 mb-1">IT DR Plan Activated</h3>
                        <p className="text-xs text-blue-800 mb-2">
                          This incident triggered the activation of IT DR Plan {incident.triggeredDRPlan}
                        </p>
                        <Link
                          href={`/it-dr-plans/${incident.triggeredDRPlan}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          View DR Plan →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'resolution' && (
              <>
                {incident.rootCause && (
                  <div className="bg-white border border-gray-200 rounded-sm p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Root Cause Analysis</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{incident.rootCause}</p>
                  </div>
                )}

                {incident.resolution && (
                  <div className="bg-white border border-gray-200 rounded-sm p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Resolution Details</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{incident.resolution}</p>
                  </div>
                )}

                {incident.timeToResolve && (
                  <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs font-medium text-green-900">Time to Resolve</p>
                        <p className="text-lg font-semibold text-green-700">{incident.timeToResolve}</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          SLA Target: 4 hours • Status: {incident.slaBreached ? 'Breached' : 'Met'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!incident.resolution && (
                  <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-xs font-medium text-amber-900">Resolution In Progress</p>
                        <p className="text-xs text-amber-700 mt-1">
                          This incident is currently being worked on. Resolution details will be added once the incident is resolved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* SLA Tracker */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">SLA Status</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-gray-700">Time Remaining</span>
                    <span className={`text-[10px] font-medium ${incident.slaBreached ? 'text-red-600' : 'text-green-600'}`}>
                      {incident.slaBreached ? 'Breached' : 'On Track'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${incident.slaBreached ? 'bg-red-600' : 'bg-green-600'}`}
                      style={{ width: incident.slaBreached ? '100%' : '60%' }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[10px] text-gray-600">Due Date</p>
                  <p className="text-xs font-medium text-gray-900">
                    {new Date(incident.slaDueDate).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">Incident Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-600">Category</p>
                  <p className="text-xs font-medium text-gray-900">{incident.category}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600">Reported By</p>
                  <p className="text-xs font-medium text-gray-900">{incident.reportedBy}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600">Reported Date</p>
                  <p className="text-xs font-medium text-gray-900">
                    {new Date(incident.reportedDate).toLocaleString('en-GB')}
                  </p>
                </div>
                {incident.resolvedDate && (
                  <div>
                    <p className="text-[10px] text-gray-600">Resolved Date</p>
                    <p className="text-xs font-medium text-gray-900">
                      {new Date(incident.resolvedDate).toLocaleString('en-GB')}
                    </p>
                  </div>
                )}
                {incident.closedDate && (
                  <div>
                    <p className="text-[10px] text-gray-600">Closed Date</p>
                    <p className="text-xs font-medium text-gray-900">
                      {new Date(incident.closedDate).toLocaleString('en-GB')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ITSCM Integration */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">ITSCM Integration</h3>
              <div className="space-y-2">
                {incident.linkedBIA && (
                  <div>
                    <p className="text-[10px] text-gray-600 mb-0.5">Linked BIA</p>
                    <Link
                      href={`/bia-records/${incident.linkedBIA}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      <DocumentTextIcon className="h-3.5 w-3.5" />
                      {incident.linkedBIA}
                    </Link>
                  </div>
                )}
                {incident.triggeredDRPlan && (
                  <div>
                    <p className="text-[10px] text-gray-600 mb-0.5">Triggered DR Plan</p>
                    <Link
                      href={`/it-dr-plans/${incident.triggeredDRPlan}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5" />
                      {incident.triggeredDRPlan}
                    </Link>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">Affected Service</p>
                  <Link
                    href={`/libraries/it-services/${incident.affectedServiceId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 hover:text-gray-700"
                  >
                    <ServerIcon className="h-3.5 w-3.5" />
                    {incident.affectedService}
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Incidents */}
            {incident.relatedIncidents && incident.relatedIncidents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-3">Related Incidents</h3>
                <div className="space-y-1.5">
                  {incident.relatedIncidents.map((relatedId) => (
                    <Link
                      key={relatedId}
                      href={`/itsm/incidents/${relatedId}`}
                      className="block text-xs text-blue-600 hover:text-blue-800"
                    >
                      {relatedId}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-left">
                  Add Comment
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-left">
                  Attach File
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-left">
                  Reassign
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-left">
                  Change Priority
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

