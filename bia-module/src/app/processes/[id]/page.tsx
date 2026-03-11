'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Mock process data
const mockProcesses = [
  {
    id: 'proc-001',
    name: 'Payroll Processing',
    description: 'Monthly payroll processing for all employees including salary calculations, deductions, and payments.',
    department: 'Finance',
    owner: 'Jane Smith',
    ownerEmail: 'jane.smith@company.com',
    approvedRTO: 4,
    lastReviewed: '2024-01-15',
    status: 'Active',
    criticality: 'High',
    dependencies: [
      'Employee Data Management',
      'Time Tracking System',
      'Banking Integration'
    ],
    stakeholders: [
      { name: 'Jane Smith', role: 'Process Owner' },
      { name: 'Mike Johnson', role: 'Finance Director' },
      { name: 'Sarah Wilson', role: 'HR Manager' }
    ],
    steps: [
      'Collect timesheet data',
      'Calculate gross pay',
      'Apply deductions',
      'Generate pay slips',
      'Process bank transfers',
      'Update accounting records'
    ],
    risks: [
      'System downtime during payroll run',
      'Data corruption in employee records',
      'Banking system unavailability'
    ]
  },
  {
    id: 'proc-002',
    name: 'Customer Support',
    description: 'Handling customer inquiries, complaints, and support requests through multiple channels.',
    department: 'Operations',
    owner: 'John Doe',
    ownerEmail: 'john.doe@company.com',
    approvedRTO: 2,
    lastReviewed: '2024-02-01',
    status: 'Active',
    criticality: 'Critical',
    dependencies: [
      'CRM System',
      'Knowledge Base',
      'Ticketing System'
    ],
    stakeholders: [
      { name: 'John Doe', role: 'Process Owner' },
      { name: 'Lisa Chen', role: 'Operations Manager' },
      { name: 'David Brown', role: 'Customer Success Lead' }
    ],
    steps: [
      'Receive customer inquiry',
      'Log ticket in system',
      'Assign to appropriate agent',
      'Research and resolve issue',
      'Communicate solution to customer',
      'Close ticket and follow up'
    ],
    risks: [
      'High volume during peak periods',
      'System outages affecting response time',
      'Staff unavailability'
    ]
  }
];

export default function ProcessDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;
  
  const process = mockProcesses.find(p => p.id === processId);
  
  if (!process) {
    return (
      <div className="px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Process Not Found</h1>
          <p className="mt-2 text-gray-600">The requested process could not be found.</p>
          <Link
            href="/processes"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Processes
          </Link>
        </div>
      </div>
    );
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/processes"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Processes
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/bia-records/new?process=${process.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
              Conduct BIA
            </Link>
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{process.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{process.description}</p>
        </div>
      </div>

      {/* Process Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-lg font-semibold text-gray-900">{process.department}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Process Owner</p>
              <p className="text-lg font-semibold text-gray-900">{process.owner}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved RTO</p>
              <p className="text-lg font-semibold text-gray-900">{process.approvedRTO}h</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Criticality</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(process.criticality)}`}>
                {process.criticality}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Process Steps */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Steps</h3>
          <ol className="space-y-3">
            {process.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Dependencies */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
          <ul className="space-y-2">
            {process.dependencies.map((dependency, index) => (
              <li key={index} className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-700">{dependency}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stakeholders */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Stakeholders</h3>
          <div className="space-y-3">
            {process.stakeholders.map((stakeholder, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{stakeholder.name}</p>
                  <p className="text-sm text-gray-500">{stakeholder.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
          <ul className="space-y-2">
            {process.risks.map((risk, index) => (
              <li key={index} className="flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Process Metadata */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {process.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Reviewed</p>
            <p className="text-sm text-gray-900">{new Date(process.lastReviewed).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Owner Email</p>
            <p className="text-sm text-gray-900">{process.ownerEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
