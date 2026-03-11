import React from 'react';
import { ProcessBIASummary } from '@/types/bia-status';
import BIAStatusBadge from './BIAStatusBadge';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface ProcessBIAListProps {
  processes: ProcessBIASummary[];
  className?: string;
}

/**
 * Process BIA List Component
 * 
 * Displays a list of processes with their BIA statuses.
 * Shows process name, owner, status, and last updated date.
 */
export default function ProcessBIAList({
  processes,
  className = ''
}: ProcessBIAListProps) {
  if (processes.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <p className="text-sm text-gray-500">No processes linked to this unit yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Processes will appear here once they are associated with this organizational unit.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-900">
          Processes ({processes.length})
        </h4>
      </div>

      <div className="divide-y divide-gray-200">
        {processes.map((process) => (
          <div
            key={process.id}
            className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {process.processName}
                  </h5>
                  {process.criticality && (
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded font-medium
                      ${process.criticality === 'Tier 1' ? 'bg-red-100 text-red-700' : ''}
                      ${process.criticality === 'Tier 2' ? 'bg-orange-100 text-orange-700' : ''}
                      ${process.criticality === 'Tier 3' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${process.criticality === 'Tier 4' ? 'bg-green-100 text-green-700' : ''}
                    `}>
                      {process.criticality}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {process.processOwner && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{process.processOwner}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>Updated {formatDate(process.lastUpdated)}</span>
                  </div>
                  {process.rto !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">RTO:</span>
                      <span>{process.rto}h</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <BIAStatusBadge
                  status={process.biaStatus}
                  type="process"
                  size="sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

