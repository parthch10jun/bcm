'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  ServerStackIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Import ITSCM reports
import BCMtoITSCMWorkflow from '../reporting/components/BCMtoITSCMWorkflow';
import ITServiceContinuityReport from '../reporting/components/ITServiceContinuityReport';
import BCMITSCMIntegrationReport from '../reporting/components/BCMITSCMIntegrationReport';
import BCPTestingReport from '../reporting/components/BCPTestingReport';

type ReportType = 'workflow' | 'service-continuity' | 'bcm-itscm-integration' | 'bcp-testing';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('workflow');

  const reports = [
    {
      id: 'workflow' as ReportType,
      name: 'BCM → ITSCM Workflow',
      description: 'End-to-end integration workflow',
      icon: ServerStackIcon,
      color: 'purple'
    },
    {
      id: 'service-continuity' as ReportType,
      name: 'IT Service Continuity Assessment',
      description: 'Comprehensive ITSCM posture analysis',
      icon: ServerStackIcon,
      color: 'blue'
    },
    {
      id: 'bcm-itscm-integration' as ReportType,
      name: 'BCM-ITSCM Integration',
      description: 'Business & IT continuity alignment',
      icon: DocumentTextIcon,
      color: 'purple'
    },
    {
      id: 'bcp-testing' as ReportType,
      name: 'BCP Testing & Exercises',
      description: 'Testing results and findings analysis',
      icon: CheckCircleIcon,
      color: 'green'
    }
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              ITSCM Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              IT Service Continuity Management Reports & Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Report Selection Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {reports.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`text-left p-4 rounded-sm border-2 transition-all ${
                  isSelected
                    ? `border-${report.color}-600 bg-${report.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 ${isSelected ? `bg-${report.color}-600` : 'bg-gray-100'} rounded-sm`}>
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold ${isSelected ? `text-${report.color}-900` : 'text-gray-900'}`}>
                      {report.name}
                    </h3>
                    <p className={`text-xs ${isSelected ? `text-${report.color}-700` : 'text-gray-600'}`}>
                      {report.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className={`h-5 w-5 text-${report.color}-600`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <ClockIcon className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {selectedReport === 'workflow' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <ServerStackIcon className="h-5 w-5 text-purple-600" />
                <h2 className="text-sm font-semibold text-gray-900">BCM → ITSCM Integration Workflow</h2>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                End-to-end traceability from Business Impact Analysis to IT Disaster Recovery Plans
              </p>
              <BCMtoITSCMWorkflow />
            </div>
          )}

          {selectedReport === 'service-continuity' && (
            <ITServiceContinuityReport />
          )}

          {selectedReport === 'bcm-itscm-integration' && (
            <BCMITSCMIntegrationReport />
          )}

          {selectedReport === 'bcp-testing' && (
            <BCPTestingReport />
          )}
        </div>
      </div>
    </div>
  );
}

