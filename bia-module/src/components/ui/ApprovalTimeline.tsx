'use client';

import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export type ApprovalAction = 'submitted' | 'approved' | 'rejected' | 'changes_requested' | 'resubmitted' | 'comment' | 'pending';

export interface ApprovalEvent {
  id: string;
  action: ApprovalAction;
  user: string;
  role?: string;
  timestamp: string;
  comments?: string;
  stage?: string;
}

interface ApprovalTimelineProps {
  events: ApprovalEvent[];
  currentPending?: {
    user: string;
    role: string;
    stage: string;
    waitingSince: string;
  };
  compact?: boolean;
}

const actionConfig: Record<ApprovalAction, { icon: React.ElementType; bg: string; iconColor: string; label: string }> = {
  submitted: { icon: PaperAirplaneIcon, bg: 'bg-blue-100', iconColor: 'text-blue-600', label: 'Submitted for review' },
  approved: { icon: CheckCircleSolidIcon, bg: 'bg-green-100', iconColor: 'text-green-600', label: 'Approved' },
  rejected: { icon: XCircleIcon, bg: 'bg-red-100', iconColor: 'text-red-600', label: 'Rejected' },
  changes_requested: { icon: ArrowPathIcon, bg: 'bg-orange-100', iconColor: 'text-orange-600', label: 'Changes requested' },
  resubmitted: { icon: ArrowPathIcon, bg: 'bg-blue-100', iconColor: 'text-blue-600', label: 'Resubmitted' },
  comment: { icon: ChatBubbleLeftIcon, bg: 'bg-gray-100', iconColor: 'text-gray-600', label: 'Comment added' },
  pending: { icon: ClockIcon, bg: 'bg-amber-100', iconColor: 'text-amber-600', label: 'Pending approval' },
};

export default function ApprovalTimeline({
  events,
  currentPending,
  compact = false,
}: ApprovalTimelineProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-900">Approval Timeline</h3>
      </div>

      <div className="p-4">
        {/* Pending indicator */}
        {currentPending && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-4 w-4 text-amber-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-amber-800">Awaiting Approval</p>
                <p className="text-[10px] text-amber-700 mt-0.5">
                  {currentPending.user} ({currentPending.role}) • {currentPending.stage}
                </p>
                <p className="text-[10px] text-amber-600 mt-1">
                  Waiting since {currentPending.waitingSince}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {events.length === 0 ? (
            <div className="text-center py-6">
              <ClockIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No approval history yet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((event, idx) => {
                const config = actionConfig[event.action];
                const Icon = config.icon;
                const isLast = idx === events.length - 1;

                return (
                  <div key={event.id} className="relative flex gap-3">
                    {/* Vertical line */}
                    {!isLast && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    {/* Icon */}
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 ${config.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${config.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-4 ${compact ? 'pb-3' : 'pb-4'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900">{config.label}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <UserCircleIcon className="h-3 w-3" />
                            {event.user}
                            {event.role && <span className="text-gray-400">• {event.role}</span>}
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400">{event.timestamp}</span>
                      </div>

                      {event.stage && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-[9px] font-medium text-gray-600 rounded">
                          Stage: {event.stage}
                        </span>
                      )}

                      {event.comments && (
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-sm">
                          <p className="text-[10px] text-gray-600 leading-relaxed">{event.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

