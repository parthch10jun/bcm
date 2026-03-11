'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: string;
  testId: string;
  onSubmit: (evidence: Evidence) => void;
}

export interface Evidence {
  id: string;
  type: 'screenshot' | 'document' | 'log' | 'photo' | 'video';
  title: string;
  description: string;
  phase: string;
  timestamp: string;
  fileName?: string;
}

const evidenceTypes = [
  { value: 'screenshot', label: 'Screenshot', icon: PhotoIcon },
  { value: 'document', label: 'Document', icon: DocumentTextIcon },
  { value: 'log', label: 'System Log', icon: DocumentTextIcon },
  { value: 'photo', label: 'Photo', icon: PhotoIcon },
  { value: 'video', label: 'Video Recording', icon: PhotoIcon }
];

export default function AddEvidenceModal({ isOpen, onClose, currentPhase, testId, onSubmit }: AddEvidenceModalProps) {
  const [evidenceType, setEvidenceType] = useState<Evidence['type']>('screenshot');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    const evidence: Evidence = {
      id: `EVD-${Date.now()}`,
      type: evidenceType,
      title,
      description,
      phase: currentPhase,
      timestamp: new Date().toISOString(),
      fileName: fileName || undefined
    };

    onSubmit(evidence);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset and close after success
    setTimeout(() => {
      setTitle('');
      setDescription('');
      setFileName('');
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
          {/* Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-sm">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add Evidence</h2>
                  <p className="text-xs text-gray-600">Test: {testId} | Phase: {currentPhase}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isSuccess ? (
            <div className="px-6 py-12 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Evidence Added Successfully</h3>
              <p className="text-sm text-gray-600">Your evidence has been recorded for this test phase.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                {/* Evidence Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Evidence Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {evidenceTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setEvidenceType(type.value as Evidence['type'])}
                        className={`p-3 rounded-sm border text-center transition-colors ${
                          evidenceType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <type.icon className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Command Center Setup Complete"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe what this evidence demonstrates..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Attach File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-sm p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="evidence-file"
                    />
                    <label htmlFor="evidence-file" className="cursor-pointer">
                      <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      {fileName ? (
                        <p className="text-sm text-blue-600 font-medium">{fileName}</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Timestamp Info */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-sm">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    Timestamp: {new Date().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Evidence'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

