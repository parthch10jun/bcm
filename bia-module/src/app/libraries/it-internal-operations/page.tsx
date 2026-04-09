'use client';

import { useState } from 'react';
import { 
  ServerIcon, 
  ChartBarIcon, 
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * IT Internal Operations BIA
 * 
 * Per ISO 27031:2025, IT must be treated as an independent business unit
 * that requires its own BIA for internal processes necessary to perform ITSCM tasks.
 * 
 * This module tracks IT's own critical services like:
 * - IT Service Desk
 * - Monitoring & Alerting Systems
 * - Change Management Tools
 * - IT Asset Management
 * - Security Operations Center (SOC)
 */

interface ITInternalService {
  id: string;
  name: string;
  category: 'Service Desk' | 'Monitoring' | 'Change Management' | 'Asset Management' | 'Security Operations' | 'Documentation';
  description: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  rto: number; // hours
  rpo: number; // hours
  mtpd: number; // hours
  owner: string;
  dependencies: string[];
  impactOnITSCM: string; // How this affects IT's ability to recover other services
  status: 'Active' | 'Under Review' | 'Needs Update';
  lastReviewed: string;
  biaId?: string;
}

const mockITInternalServices: ITInternalService[] = [
  {
    id: 'IT-INT-001',
    name: 'IT Service Desk (Ticketing System)',
    category: 'Service Desk',
    description: 'ServiceNow ticketing system for incident management, service requests, and change tracking',
    criticality: 'Critical',
    rto: 4,
    rpo: 1,
    mtpd: 8,
    owner: 'Thomas Weber (IT Service Manager)',
    dependencies: ['Active Directory', 'Email System', 'Knowledge Base'],
    impactOnITSCM: 'Without ticketing, IT cannot coordinate recovery activities, track incidents, or manage change requests during DR scenarios. Critical for ITSCM orchestration.',
    status: 'Active',
    lastReviewed: '2024-11-15',
    biaId: 'BIA-IT-001'
  },
  {
    id: 'IT-INT-002',
    name: 'Monitoring & Alerting Platform',
    category: 'Monitoring',
    description: 'Nagios/Prometheus monitoring stack with PagerDuty alerting for infrastructure health',
    criticality: 'Critical',
    rto: 2,
    rpo: 0.5,
    mtpd: 4,
    owner: 'Anna Schmidt (Infrastructure Lead)',
    dependencies: ['Network Connectivity', 'Time Synchronization', 'SMTP Gateway'],
    impactOnITSCM: 'Loss of monitoring means IT cannot detect failures, validate recovery success, or trigger automated failover. Essential for RTO/RPO validation.',
    status: 'Active',
    lastReviewed: '2024-10-20',
    biaId: 'BIA-IT-002'
  },
  {
    id: 'IT-INT-003',
    name: 'Change Management System',
    category: 'Change Management',
    description: 'Change Advisory Board (CAB) workflow and emergency change approval system',
    criticality: 'High',
    rto: 8,
    rpo: 4,
    mtpd: 24,
    owner: 'Michael Klein (Change Manager)',
    dependencies: ['ServiceNow', 'Email', 'Approval Workflow Engine'],
    impactOnITSCM: 'Emergency changes during DR require rapid approval. Without this system, IT cannot formally authorize recovery actions, creating compliance risk.',
    status: 'Active',
    lastReviewed: '2024-09-10',
    biaId: 'BIA-IT-003'
  },
  {
    id: 'IT-INT-004',
    name: 'IT Asset Management (CMDB)',
    category: 'Asset Management',
    description: 'Configuration Management Database tracking all IT assets, dependencies, and relationships',
    criticality: 'Critical',
    rto: 6,
    rpo: 2,
    mtpd: 12,
    owner: 'Lisa Müller (Asset Manager)',
    dependencies: ['Discovery Tools', 'Integration APIs', 'Database Cluster'],
    impactOnITSCM: 'CMDB contains dependency maps essential for recovery sequencing. Loss means IT cannot determine correct recovery order or identify affected systems.',
    status: 'Active',
    lastReviewed: '2024-11-01',
    biaId: 'BIA-IT-004'
  },
  {
    id: 'IT-INT-005',
    name: 'Security Operations Center (SOC)',
    category: 'Security Operations',
    description: 'SIEM platform, threat detection, and incident response coordination',
    criticality: 'Critical',
    rto: 1,
    rpo: 0.25,
    mtpd: 2,
    owner: 'David Schneider (CISO)',
    dependencies: ['Log Aggregation', 'Threat Intelligence Feeds', 'Forensics Tools'],
    impactOnITSCM: 'SOC must remain operational to detect cyber incidents during DR. Loss creates blind spot where attacks could go undetected during recovery.',
    status: 'Active',
    lastReviewed: '2024-12-01',
    biaId: 'BIA-IT-005'
  },
  {
    id: 'IT-INT-006',
    name: 'IT Documentation Repository',
    category: 'Documentation',
    description: 'Confluence/SharePoint repository for runbooks, procedures, and technical documentation',
    criticality: 'High',
    rto: 12,
    rpo: 8,
    mtpd: 48,
    owner: 'Emma Fischer (Documentation Lead)',
    dependencies: ['File Storage', 'Search Index', 'Version Control'],
    impactOnITSCM: 'Contains DR runbooks and recovery procedures. Without access, IT staff must rely on memory, increasing error risk and recovery time.',
    status: 'Under Review',
    lastReviewed: '2024-08-15',
    biaId: undefined
  }
];

export default function ITInternalOperationsPage() {
  const [services, setServices] = useState<ITInternalService[]>(mockITInternalServices);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Service Desk', 'Monitoring', 'Change Management', 'Asset Management', 'Security Operations', 'Documentation'];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'Under Review': return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'Needs Update': return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const stats = {
    total: services.length,
    critical: services.filter(s => s.criticality === 'Critical').length,
    needsBIA: services.filter(s => !s.biaId).length,
    avgRTO: Math.round(services.reduce((sum, s) => sum + s.rto, 0) / services.length)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IT Internal Operations BIA</h1>
              <p className="text-sm text-gray-600 mt-1">
                Business Impact Analysis for IT's own critical services (ISO 27031:2025 Requirement)
              </p>
            </div>
            <Link
              href="/bia-records/new?type=it-internal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4" />
              Create IT Internal BIA
            </Link>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900">ISO 27031:2025 Compliance Requirement</p>
              <p className="text-xs text-blue-800 mt-1">
                IT must be treated as an independent business unit requiring its own BIA. IT's internal services
                (Service Desk, Monitoring, CMDB, SOC) are prerequisites for performing ITSCM tasks. If these fail,
                IT cannot recover other business services, creating a cascading failure scenario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total IT Services</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <ServerIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Critical Services</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.critical}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Needs BIA</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.needsBIA}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg RTO</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgRTO}h</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Criticality</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">RTO/RPO</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Impact on ITSCM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">BIA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{service.owner}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700">{service.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCriticalityColor(service.criticality)}`}>
                      {service.criticality}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700">
                      <div>RTO: <span className="font-semibold">{service.rto}h</span></div>
                      <div>RPO: <span className="font-semibold">{service.rpo}h</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 max-w-xs line-clamp-2">{service.impactOnITSCM}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(service.status)}
                      <span className="text-xs text-gray-700">{service.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {service.biaId ? (
                      <Link
                        href={`/bia-records/${service.biaId}`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {service.biaId}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">Not Created</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

