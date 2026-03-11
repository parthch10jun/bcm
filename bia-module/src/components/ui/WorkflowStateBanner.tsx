'use client';

import { LockClosedIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export type WorkflowStage = 'Draft' | 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Changes Requested';

interface WorkflowStateBannerProps {
  currentStage: WorkflowStage;
  isLocked?: boolean;
  lockMessage?: string;
  showSteps?: boolean;
  onSubmit?: () => void;
  onRequestChanges?: () => void;
  onApprove?: () => void;
  canEdit?: boolean;
}

const stages: WorkflowStage[] = ['Draft', 'Submitted', 'In Review', 'Approved'];

const stageConfig: Record<WorkflowStage, { bg: string; border: string; text: string; icon: React.ElementType; label: string }> = {
  'Draft': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: ClockIcon, label: 'Draft - Not yet submitted' },
  'Submitted': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: ArrowPathIcon, label: 'Submitted - Awaiting review' },
  'In Review': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: ClockIcon, label: 'In Review - Under evaluation' },
  'Approved': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircleIcon, label: 'Approved - Record finalized' },
  'Rejected': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircleIcon, label: 'Rejected - Needs revision' },
  'Changes Requested': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: ArrowPathIcon, label: 'Changes Requested - Action required' },
};

export default function WorkflowStateBanner({
  currentStage,
  isLocked = false,
  lockMessage = 'This record is locked until approved',
  showSteps = true,
  onSubmit,
  onRequestChanges,
  onApprove,
  canEdit = true,
}: WorkflowStateBannerProps) {
  const config = stageConfig[currentStage];
  const Icon = config.icon;
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className={`${config.bg} border ${config.border} rounded-sm overflow-hidden`}>
      {/* Status bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${config.text}`} />
          <div>
            <p className={`text-xs font-semibold ${config.text}`}>{config.label}</p>
            {isLocked && (
              <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                <LockClosedIcon className="h-3 w-3" />
                {lockMessage}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons based on stage */}
        <div className="flex items-center gap-2">
          {currentStage === 'Draft' && onSubmit && (
            <button
              onClick={onSubmit}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition-colors"
            >
              Submit for Review
            </button>
          )}
          {currentStage === 'In Review' && onApprove && (
            <>
              <button
                onClick={onRequestChanges}
                className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-white border border-orange-300 rounded-sm hover:bg-orange-50 transition-colors"
              >
                Request Changes
              </button>
              <button
                onClick={onApprove}
                className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
            </>
          )}
          {(currentStage === 'Rejected' || currentStage === 'Changes Requested') && canEdit && (
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
              Edit & Resubmit
            </button>
          )}
        </div>
      </div>

      {/* Step indicators */}
      {showSteps && currentStage !== 'Rejected' && currentStage !== 'Changes Requested' && (
        <div className="px-4 py-2 bg-white/50 border-t border-gray-100">
          <div className="flex items-center">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isUpcoming = idx > currentIndex;

              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 text-white ring-2 ring-blue-200' :
                        'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircleIcon className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                      {stage}
                    </span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lock overlay hint */}
      {isLocked && (
        <div className="px-4 py-2 bg-gray-900/5 border-t border-gray-200 flex items-center gap-2">
          <LockClosedIcon className="h-3.5 w-3.5 text-gray-500" />
          <p className="text-[10px] text-gray-600">Editing is disabled. This record must be approved before changes can be made.</p>
        </div>
      )}
    </div>
  );
}

