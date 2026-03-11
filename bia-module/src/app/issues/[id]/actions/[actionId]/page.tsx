'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ChevronRightIcon,
  UserCircleIcon,
  CalendarIcon,
  PaperClipIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { mockIssues } from '@/data/mockIssueActionData';
import {
  ActionStatus,
  ActionStatusConfig,
  PriorityConfig,
  ActionTypeConfig
} from '@/types/issue-action';

export default function ActionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;
  const actionId = params.actionId as string;
  
  // Find the issue and action
  const issue = mockIssues.find(i => i.id === issueId);
  const action = issue?.actions.find(a => a.id === actionId);
  
  // State for quick status update
  const [currentStatus, setCurrentStatus] = useState<ActionStatus>(action?.status || 'OPEN');
  const [newNote, setNewNote] = useState('');

  if (!issue || !action) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Action Not Found</h2>
          <p className="text-gray-600 mb-4">The action you're looking for doesn't exist.</p>
          <Link href="/issues" className="text-blue-600 hover:text-blue-700">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = ActionStatusConfig[currentStatus];
  const priorityConfig = action.priority ? PriorityConfig[action.priority] : null;
  const isOverdue = new Date(action.targetDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(currentStatus);

  const handleStatusChange = (newStatus: ActionStatus) => {
    setCurrentStatus(newStatus);
    // TODO: Save to backend
    console.log('Status changed to:', newStatus);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      alert('Please enter a note');
      return;
    }
    
    // TODO: Save to backend
    console.log('Adding note:', newNote);
    setNewNote('');
  };

  const handleSaveChanges = () => {
    // TODO: Save all changes to backend
    console.log('Saving changes');
    router.push(`/issues/${issueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <HomeIcon className="h-4 w-4 mr-2" />
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <Link href="/issues" className="hover:text-blue-600">Issue and Action Management</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <Link href={`/issues/${issueId}`} className="hover:text-blue-600">Issue Details</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">Action Details</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{action.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Linked to Issue:</span>
                <Link href={`/issues/${issueId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {issue.referenceNumber} - {issue.title}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick Status Update Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Quick Update Status</label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as ActionStatus)}
                  className="text-sm border border-gray-300 rounded-sm px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {priorityConfig && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium border ${priorityConfig.bgColor} ${priorityConfig.color} ${priorityConfig.borderColor}`}>
                    {priorityConfig.label}
                  </span>
                </div>
              )}

              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors self-end"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Section 1: Overview */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Owner */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Owner</label>
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{action.owner}</p>
                    {action.ownerEmail && (
                      <p className="text-xs text-gray-500">{action.ownerEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Action Type</label>
                {(() => {
                  const actionTypeConfig = ActionTypeConfig[action.actionType];
                  return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium border ${actionTypeConfig.bgColor} ${actionTypeConfig.color} ${actionTypeConfig.borderColor}`}>
                      {actionTypeConfig.label}
                    </span>
                  );
                })()}
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Target Date</label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(action.targetDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {isOverdue && <p className="text-xs text-red-500 mt-1">Overdue</p>}
              </div>

              {/* Issue Link */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Linked Issue</label>
                <Link
                  href={`/issues/${issueId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {issue.referenceNumber}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Description</label>
              <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-sm p-4">
                {action.description || 'No description provided'}
              </div>
            </div>
          </div>

          {/* Section 2: Progress Notes */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Notes</h3>

            {/* Add Note Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Progress Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter progress update or note..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {action.progressNotes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No progress notes yet</p>
              ) : (
                action.progressNotes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-sm p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{note.createdBy}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 3: Attachments */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>

            {action.attachments && action.attachments.length > 0 ? (
              <div className="space-y-2">
                {action.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100"
                  >
                    <PaperClipIcon className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{attachment.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.fileSize / 1024).toFixed(1)} KB • Uploaded by {attachment.uploadedBy} on{' '}
                        {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No attachments</p>
            )}
          </div>

          {/* Section 4: Timeline / Audit History */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline / Audit History</h3>

            {action.timeline && action.timeline.length > 0 ? (
              <div className="space-y-4">
                {action.timeline.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.type === 'CREATED' ? 'bg-blue-500' :
                        entry.type === 'STATUS_CHANGE' ? 'bg-green-500' :
                        entry.type === 'EDIT' ? 'bg-yellow-500' :
                        entry.type === 'NOTE_ADDED' ? 'bg-purple-500' :
                        'bg-gray-400'
                      }`}></div>
                      {index < action.timeline!.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                          {entry.oldValue && entry.newValue && (
                            <p className="text-xs text-gray-600 mt-1">
                              Changed from <span className="font-medium">{entry.oldValue}</span> to{' '}
                              <span className="font-medium">{entry.newValue}</span>
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">by {entry.createdBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No timeline entries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

