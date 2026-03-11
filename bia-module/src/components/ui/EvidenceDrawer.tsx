'use client';

import { useState, useCallback } from 'react';
import {
  XMarkIcon,
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  TagIcon,
  LinkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  linkedSection?: string;
  url?: string;
}

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItem[];
  onUpload?: (files: FileList) => void;
  onDelete?: (id: string) => void;
  onTagUpdate?: (id: string, tags: string[]) => void;
  onLinkToSection?: (id: string, section: string) => void;
  sections?: string[];
  title?: string;
}

const typeIcons = {
  document: DocumentIcon,
  image: PhotoIcon,
  video: FilmIcon,
  other: PaperClipIcon,
};

const typeColors = {
  document: 'bg-blue-50 text-blue-600',
  image: 'bg-green-50 text-green-600',
  video: 'bg-purple-50 text-purple-600',
  other: 'bg-gray-50 text-gray-600',
};

export default function EvidenceDrawer({
  isOpen,
  onClose,
  evidence,
  onUpload,
  onDelete,
  onTagUpdate,
  onLinkToSection,
  sections = [],
  title = 'Evidence & Attachments',
}: EvidenceDrawerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onUpload) {
      onUpload(e.dataTransfer.files);
    }
  }, [onUpload]);

  const handleAddTag = (id: string, currentTags: string[]) => {
    if (newTag.trim() && onTagUpdate) {
      onTagUpdate(id, [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (id: string, currentTags: string[], tagToRemove: string) => {
    if (onTagUpdate) {
      onTagUpdate(id, currentTags.filter(t => t !== tagToRemove));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <PaperClipIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-medium rounded">
              {evidence.length}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mx-4 mt-4 border-2 border-dashed rounded-sm p-4 text-center transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <ArrowUpTrayIcon className={`h-6 w-6 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-xs text-gray-600">Drag & drop files here</p>
          <p className="text-[10px] text-gray-400 mt-1">or</p>
          <label className="inline-block mt-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 cursor-pointer">
            Browse Files
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files && onUpload?.(e.target.files)} />
          </label>
        </div>

        {/* Evidence list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {evidence.length === 0 ? (
            <div className="text-center py-8">
              <PaperClipIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No evidence attached</p>
            </div>
          ) : (
            evidence.map((item) => {
              const Icon = typeIcons[item.type];
              const isExpanded = selectedItem === item.id;

              return (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
                  <div className="p-3 flex items-start gap-3">
                    <div className={`flex-shrink-0 w-9 h-9 rounded flex items-center justify-center ${typeColors[item.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{item.size} • {item.uploadedAt}</p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] text-gray-600">
                              {tag}
                              {isExpanded && (
                                <button onClick={() => handleRemoveTag(item.id, item.tags, tag)} className="hover:text-red-500">
                                  <XMarkIcon className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.linkedSection && (
                        <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          Linked to: {item.linkedSection}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedItem(isExpanded ? null : item.id)} className="p-1.5 hover:bg-gray-200 rounded">
                        <TagIcon className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <EyeIcon className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      {onDelete && (
                        <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-100 rounded">
                          <TrashIcon className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded: Tag & Link controls */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-2 border-t border-gray-200 bg-white space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag..."
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag(item.id, item.tags)}
                        />
                        <button onClick={() => handleAddTag(item.id, item.tags)} className="p-1 bg-gray-900 text-white rounded-sm">
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {sections.length > 0 && (
                        <select
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-sm"
                          value={item.linkedSection || ''}
                          onChange={(e) => onLinkToSection?.(item.id, e.target.value)}
                        >
                          <option value="">Link to section...</option>
                          {sections.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

