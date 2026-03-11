'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ChevronRightIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { IssuePriority, ActionType } from '@/types/issue-action';
import { mockIssues, mockUsers } from '@/data/mockIssueActionData';

export default function AddActionPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  // Find the issue
  const issue = mockIssues.find(i => i.id === issueId);

  // Form state
  const [title, setTitle] = useState('');
  const [actionType, setActionType] = useState<ActionType | ''>('');
  const [owner, setOwner] = useState('');
  const [priority, setPriority] = useState<IssuePriority | ''>('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // UI state
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState('');

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist.</p>
          <Link href="/issues" className="text-blue-600 hover:text-blue-700">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  // Filter users for owner dropdown
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(ownerSearch.toLowerCase())
  );

  const handleSelectOwner = (userName: string) => {
    setOwner(userName);
    setOwnerSearch('');
    setShowOwnerDropdown(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    if (!title || !actionType || !owner || !targetDate) {
      alert('Please fill in all mandatory fields');
      return;
    }

    // TODO: Submit to backend
    console.log('Creating action:', {
      title, actionType, owner, priority, targetDate, description, attachments, issueId
    });
    
    router.push(`/issues/${issueId}`);
  };

  const handleCancel = () => {
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
          <span className="text-gray-900 font-medium">Add Action</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add Action</h1>
              <p className="mt-1 text-sm text-gray-500">
                Linked to Issue: <Link href={`/issues/${issueId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {issue.referenceNumber} - {issue.title}
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6 max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Action Title - Mandatory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter action title"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Action Owner - Mandatory, Searchable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Owner <span className="text-red-500">*</span>
                </label>

                {/* Selected Owner */}
                {owner && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {owner}
                      <button
                        type="button"
                        onClick={() => setOwner('')}
                        className="ml-2 hover:text-blue-900"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                )}

                {/* Search Input */}
                {!owner && (
                  <div className="relative">
                    <input
                      type="text"
                      value={ownerSearch}
                      onChange={(e) => {
                        setOwnerSearch(e.target.value);
                        setShowOwnerDropdown(true);
                      }}
                      onFocus={() => setShowOwnerDropdown(true)}
                      placeholder="Search for action owner..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Dropdown */}
                    {showOwnerDropdown && ownerSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleSelectOwner(user.name)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
                            >
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!owner && (
                  <p className="mt-1 text-xs text-red-500">Action owner is required</p>
                )}
              </div>

              {/* Action Type - Mandatory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ActionType)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Action Type</option>
                  <option value="PREVENTIVE">Preventive</option>
                  <option value="CORRECTIVE">Corrective</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Preventive: Proactive measures to prevent issues. Corrective: Reactive fixes to address issues.
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssuePriority)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Priority</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Target Date - Mandatory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachment
                </label>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-sm p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <PaperClipIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload files
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      or drag and drop
                    </span>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <PaperClipIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="border border-gray-300 rounded-sm">
              {/* Toolbar */}
              <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => {
                    const textarea = document.getElementById('description') as HTMLTextAreaElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = description.substring(start, end);
                    const newText = description.substring(0, start) + `**${selectedText}**` + description.substring(end);
                    setDescription(newText);
                  }}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs italic text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => {
                    const textarea = document.getElementById('description') as HTMLTextAreaElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = description.substring(start, end);
                    const newText = description.substring(0, start) + `*${selectedText}*` + description.substring(end);
                    setDescription(newText);
                  }}
                >
                  I
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => setDescription(description + '\n• ')}
                >
                  • List
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) {
                      const text = prompt('Enter link text:') || url;
                      setDescription(description + `[${text}](${url})`);
                    }
                  }}
                >
                  🔗 Link
                </button>
              </div>
              {/* Text Area */}
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the action in detail. Use the toolbar above for formatting."
                rows={6}
                className="w-full px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none resize-none"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Supports basic markdown: **bold**, *italic*, • bullets, [links](url)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

