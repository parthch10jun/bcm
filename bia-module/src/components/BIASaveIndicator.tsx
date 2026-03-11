'use client';

import { SaveStatus } from '@/hooks/useBIAAutoSave';
import { 
  CheckCircleIcon, 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface BIASaveIndicatorProps {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  error: Error | null;
}

export default function BIASaveIndicator({ saveStatus, lastSavedAt, error }: BIASaveIndicatorProps) {
  const getStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-600" />,
          text: 'Saving...',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'saved':
        return {
          icon: <CheckCircleIcon className="h-4 w-4 text-green-600" />,
          text: 'All changes saved',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <ExclamationCircleIcon className="h-4 w-4 text-red-600" />,
          text: error?.message || 'Failed to save',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        if (lastSavedAt) {
          const timeSince = getTimeSince(lastSavedAt);
          return {
            icon: <ClockIcon className="h-4 w-4 text-gray-500" />,
            text: `Last saved ${timeSince}`,
            textColor: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200'
          };
        }
        return {
          icon: <ClockIcon className="h-4 w-4 text-gray-400" />,
          text: 'Not saved yet',
          textColor: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getTimeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const status = getStatusDisplay();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border ${status.bgColor} ${status.borderColor}`}>
      {status.icon}
      <span className={`text-xs font-medium ${status.textColor}`}>
        {status.text}
      </span>
    </div>
  );
}

