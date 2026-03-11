'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  TagIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Issue, Action, IssueStatusConfig, PriorityConfig, ActionStatusConfig, ActionTypeConfig } from '@/types/issue-action';

interface IssueDetailModalProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueDetailModal({ issue, onClose }: IssueDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'corrective' | 'preventive'>('details');

  const statusConfig = IssueStatusConfig[issue.status];
  const priorityConfig = PriorityConfig[issue.priority];
  const isOverdue = new Date(issue.dueDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(issue.status);

  // Filter actions by type
  const correctiveActions = issue.actions?.filter(a => a.actionType === 'CORRECTIVE') || [];
  const preventiveActions = issue.actions?.filter(a => a.actionType === 'PREVENTIVE') || [];

  const renderActionCard = (action: Action) => {
    const actionStatusConfig = ActionStatusConfig[action.status];
    const actionTypeConfig = ActionTypeConfig[action.actionType];

    return (
      <div key={action.id} className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${actionTypeConfig.bgColor} ${actionTypeConfig.color}`}>
              {action.actionType === 'CORRECTIVE' ? (
                <WrenchScrewdriverIcon className="h-3 w-3 mr-1" />
              ) : (
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
              )}
              {actionTypeConfig.label}
            </span>
            <span className="text-xs text-gray-500">{action.referenceNumber}</span>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${actionStatusConfig.bgColor} ${actionStatusConfig.color} ${actionStatusConfig.borderColor}`}>
            {actionStatusConfig.label}
          </span>
        </div>
        
        <h4 className="text-sm font-medium text-gray-900 mb-2">{action.title}</h4>
        <p className="text-xs text-gray-600 mb-3">{action.description}</p>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center text-gray-600">
            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{action.owner}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>Target: {new Date(action.targetDate).toLocaleDateString()}</span>
          </div>
          {action.completionDate && (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              <span>Completed: {new Date(action.completionDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Status</span>
            <span className="font-medium">{actionStatusConfig.label}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                action.status === 'COMPLETED' ? 'bg-green-500' :
                action.status === 'CLOSED' ? 'bg-gray-500' : 'bg-blue-500'
              }`}
              style={{ width: action.status === 'COMPLETED' || action.status === 'CLOSED' ? '100%' : action.status === 'IN_PROGRESS' ? '50%' : '10%' }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-blue-600">{issue.referenceNumber}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${priorityConfig.bgColor} ${priorityConfig.color} ${priorityConfig.borderColor}`}>
                    {priorityConfig.label}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                    {statusConfig.label}
                  </span>
                  {isOverdue && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{issue.title}</h2>
              </div>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex -mb-px">
              {[
                { key: 'details', label: 'Issue Details' },
                { key: 'corrective', label: `Corrective Actions (${correctiveActions.length})` },
                { key: 'preventive', label: `Preventive Actions (${preventiveActions.length})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-sm p-3">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <TagIcon className="h-4 w-4 mr-1" />
                      Module
                    </div>
                    <p className="text-sm font-medium text-gray-900">{issue.module}</p>
                  </div>
                  <div className="bg-gray-50 rounded-sm p-3">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Related Record
                    </div>
                    <p className="text-sm font-medium text-gray-900">{issue.relatedRecordTitle || 'N/A'}</p>
                    {issue.relatedRecordId && (
                      <p className="text-xs text-gray-500">{issue.relatedRecordId}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-sm p-3">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Created Date
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(issue.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Responsible Business Unit */}
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                    Responsible Business Unit
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-700">Business Unit</p>
                      <p className="text-sm font-medium text-blue-900">{issue.businessUnit}</p>
                      {issue.businessUnitId && (
                        <p className="text-xs text-blue-600">({issue.businessUnitId})</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Assigned To</p>
                      <p className="text-sm font-medium text-blue-900">{issue.assignedTo?.join(', ') || 'Not Assigned'}</p>
                      {issue.assignedToEmails && issue.assignedToEmails.length > 0 && (
                        <p className="text-xs text-blue-600">{issue.assignedToEmails.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`rounded-sm p-3 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Due Date
                    </div>
                    <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </p>
                    {isOverdue && <p className="text-xs text-red-600">Overdue!</p>}
                  </div>
                  {issue.closedDate && (
                    <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                      <div className="flex items-center text-green-600 text-xs mb-1">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Closed Date
                      </div>
                      <p className="text-sm font-medium text-green-700">
                        {new Date(issue.closedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* On Hold Reason & Impact */}
                {(issue.onHoldReason || issue.impact) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issue.onHoldReason && (
                      <div className="bg-gray-50 rounded-sm p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">On Hold Reason</h4>
                        <p className="text-sm text-gray-700">{issue.onHoldReason}</p>
                      </div>
                    )}
                    {issue.impact && (
                      <div className="bg-orange-50 border border-orange-200 rounded-sm p-4">
                        <h4 className="text-sm font-semibold text-orange-900 mb-2">Impact Level</h4>
                        <p className="text-sm text-orange-700">{issue.impact}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Summary */}
                <div className="bg-gray-50 rounded-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions Summary</h3>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-lg font-bold text-blue-600">{correctiveActions.length}</p>
                        <p className="text-xs text-gray-500">Corrective Actions</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <p className="text-lg font-bold text-purple-600">{preventiveActions.length}</p>
                        <p className="text-xs text-gray-500">Preventive Actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'corrective' && (
              <div className="space-y-4">
                {correctiveActions.length === 0 ? (
                  <div className="text-center py-8">
                    <WrenchScrewdriverIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No corrective actions defined yet</p>
                    <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                      + Add Corrective Action
                    </button>
                  </div>
                ) : (
                  correctiveActions.map(renderActionCard)
                )}
              </div>
            )}

            {activeTab === 'preventive' && (
              <div className="space-y-4">
                {preventiveActions.length === 0 ? (
                  <div className="text-center py-8">
                    <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No preventive actions defined yet</p>
                    <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700">
                      + Add Preventive Action
                    </button>
                  </div>
                ) : (
                  preventiveActions.map(renderActionCard)
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Created by {issue.createdBy} on {new Date(issue.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
                Edit Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

