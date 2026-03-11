'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  ClockIcon,
  LinkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export type RecordStatus = 'Draft' | 'Pending Review' | 'In Review' | 'Approved' | 'Rejected' | 'Active' | 'Archived';

interface LinkedRecord {
  id: string;
  name: string;
  type: 'BCP' | 'BIA' | 'Risk' | 'Test';
  href: string;
}

interface Chip {
  label: string;
  variant?: 'scenario' | 'strategy' | 'category' | 'tag';
}

interface RecordHeaderProps {
  id: string;
  title: string;
  status: RecordStatus;
  owner: string;
  lastUpdated: string;
  linkedRecords?: LinkedRecord[];
  chips?: Chip[];
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const statusStyles: Record<RecordStatus, { bg: string; text: string; dot: string }> = {
  'Draft': { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  'Pending Review': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'In Review': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  'Approved': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Archived': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const chipStyles = {
  scenario: 'bg-purple-50 text-purple-700 border-purple-200',
  strategy: 'bg-blue-50 text-blue-700 border-blue-200',
  category: 'bg-teal-50 text-teal-700 border-teal-200',
  tag: 'bg-gray-50 text-gray-600 border-gray-200',
};

const linkedRecordStyles = {
  BCP: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  BIA: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  Risk: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  Test: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
};

export default function RecordHeader({
  id,
  title,
  status,
  owner,
  lastUpdated,
  linkedRecords = [],
  chips = [],
  description,
  icon,
  actions,
}: RecordHeaderProps) {
  const statusStyle = statusStyles[status];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Top row: ID, Status, Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{id}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
              {status}
            </span>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Title row */}
        <div className="flex items-start gap-3 mb-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            {description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>}
          </div>
        </div>

        {/* Linked records */}
        {linkedRecords.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {linkedRecords.map((record) => (
                <Link
                  key={record.id}
                  href={record.href}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium transition-colors ${linkedRecordStyles[record.type]}`}
                >
                  <DocumentTextIcon className="h-3 w-3" />
                  {record.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Chips (scenarios/strategies) */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chips.map((chip, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium ${chipStyles[chip.variant || 'tag']}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {/* Meta row: Owner, Last Updated */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <UserCircleIcon className="h-3.5 w-3.5" />
            {owner}
          </span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            Updated {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}

