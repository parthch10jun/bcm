'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ChevronRightIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { IssueModule, IssuePriority, IssueImpact } from '@/types/issue-action';
import { mockUsers, mockRelatedRecords, mockBusinessUnits } from '@/data/mockIssueActionData';

export default function CreateIssuePage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<IssueModule | ''>('');
  const [businessUnit, setBusinessUnit] = useState('');
  const [relatedRecordId, setRelatedRecordId] = useState('');
  const [priority, setPriority] = useState<IssuePriority | ''>('');
  const [impact, setImpact] = useState<IssueImpact | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [raisedBy, setRaisedBy] = useState('Current User'); // Auto-populated
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // UI state
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');

  // Get related records based on selected module
  const relatedRecords = module ? mockRelatedRecords[module] : [];

  // Filter users for assignee dropdown
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const handleAddAssignee = (userName: string) => {
    if (!assignedTo.includes(userName)) {
      setAssignedTo([...assignedTo, userName]);
    }
    setAssigneeSearch('');
    setShowAssigneeDropdown(false);
  };

  const handleRemoveAssignee = (userName: string) => {
    setAssignedTo(assignedTo.filter(name => name !== userName));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Validation
    if (!title || !module || !businessUnit || !priority || !dueDate || assignedTo.length === 0) {
      alert('Please fill in all mandatory fields');
      return;
    }

    // TODO: Submit to backend
    console.log('Submitting issue:', {
      title, module, businessUnit, relatedRecordId, priority, impact, dueDate,
      description, raisedBy, assignedTo, attachments
    });

    router.push('/issues');
  };

  const handleSaveAsDraft = () => {
    // TODO: Save as draft
    console.log('Saving as draft');
    router.push('/issues');
  };

  const handleCancel = () => {
    router.push('/issues');
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
          <span className="text-gray-900 font-medium">Create Issue</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create Issue</h1>
              <p className="mt-1 text-sm text-gray-500">Fill in the details to create a new issue</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsDraft}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Section A: Basic Details */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h2>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Issue Title - Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter issue title"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Module - Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={module}
                    onChange={(e) => {
                      setModule(e.target.value as IssueModule);
                      setRelatedRecordId(''); // Reset related record when module changes
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Module</option>
                    <option value="BIA">BIA</option>
                    <option value="RA">Risk Assessment</option>
                    <option value="BCP">BCP</option>
                    <option value="CM">Crisis Management</option>
                    <option value="TESTING">Testing</option>
                    <option value="AUDIT">Audit</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>

                {/* Business Unit - Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Business Unit</option>
                    {mockBusinessUnits.map(bu => (
                      <option key={bu.id} value={bu.name}>{bu.name}</option>
                    ))}
                  </select>
                </div>

                {/* Related Record - Dynamic based on Module */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Record
                  </label>
                  <select
                    value={relatedRecordId}
                    onChange={(e) => setRelatedRecordId(e.target.value)}
                    disabled={!module}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Related Record</option>
                    {relatedRecords.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.id} - {record.title}
                      </option>
                    ))}
                  </select>
                  {!module && (
                    <p className="mt-1 text-xs text-gray-500">Select a module first</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Priority - Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as IssuePriority)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                {/* Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={impact}
                    onChange={(e) => setImpact(e.target.value as IssueImpact)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Impact</option>
                    <option value="SEVERE">Severe</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                {/* Due Date - Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Description */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>

            {/* Rich Text Editor - Simplified for now */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
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
                  placeholder="Describe the issue in detail. Use the toolbar above for formatting."
                  rows={8}
                  className="w-full px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none resize-none"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Supports basic markdown: **bold**, *italic*, • bullets, [links](url)
              </p>
            </div>
          </div>

          {/* Section C: People and Attachments */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">People and Attachments</h2>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Raised By - Auto-populated */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raised By
                  </label>
                  <input
                    type="text"
                    value={raisedBy}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Auto-populated from current user</p>
                </div>

                {/* Assigned To - Searchable, Multi-select, Mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To <span className="text-red-500">*</span>
                  </label>

                  {/* Selected Assignees */}
                  {assignedTo.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {assignedTo.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => handleRemoveAssignee(name)}
                            className="ml-1 hover:text-blue-900"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={assigneeSearch}
                      onChange={(e) => {
                        setAssigneeSearch(e.target.value);
                        setShowAssigneeDropdown(true);
                      }}
                      onFocus={() => setShowAssigneeDropdown(true)}
                      placeholder="Search and select assignees..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Dropdown */}
                    {showAssigneeDropdown && assigneeSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleAddAssignee(user.name)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                              </div>
                              {assignedTo.includes(user.name) && (
                                <span className="text-blue-600 text-xs">✓ Selected</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
                        )}
                      </div>
                    )}
                  </div>
                  {assignedTo.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">At least one assignee is required</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachments
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
          </div>
        </div>
      </div>
    </div>
  );
}

