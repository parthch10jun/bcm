'use client';

import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export interface WizardStep {
  id: string;
  name: string;
  description?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  icon?: React.ReactNode;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onChange?: (stepIndex: number) => void;
  variant?: 'horizontal' | 'vertical' | 'tabs';
  size?: 'sm' | 'md';
  allowNavigation?: boolean;
}

export default function WizardStepper({
  steps,
  currentStep,
  onChange,
  variant = 'horizontal',
  size = 'md',
  allowNavigation = true,
}: WizardStepperProps) {
  const handleStepClick = (index: number) => {
    if (!allowNavigation) return;
    if (steps[index].isLocked) return;
    onChange?.(index);
  };

  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStep;
            const isCompleted = step.isCompleted || idx < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                disabled={step.isLocked}
                className={`
                  relative flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                  ${isCurrent
                    ? 'border-gray-900 text-gray-900'
                    : isCompleted
                    ? 'border-transparent text-green-600 hover:text-green-700 hover:border-green-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  ${step.isLocked ? 'opacity-50 cursor-not-allowed' : allowNavigation ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircleSolidIcon className="h-4 w-4 text-green-500" />
                ) : step.isLocked ? (
                  <LockClosedIcon className="h-4 w-4" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isCurrent ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </span>
                )}
                {step.name}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Vertical variant
  if (variant === 'vertical') {
    return (
      <nav className="space-y-1">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStep;
          const isCompleted = step.isCompleted || idx < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              disabled={step.isLocked}
              className={`
                w-full flex items-start gap-3 px-3 py-2.5 rounded-sm text-left transition-colors
                ${isCurrent ? 'bg-gray-100' : 'hover:bg-gray-50'}
                ${step.isLocked ? 'opacity-50 cursor-not-allowed' : allowNavigation ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5
                ${isCompleted ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <CheckCircleIcon className="h-4 w-4" /> : step.isLocked ? <LockClosedIcon className="h-3 w-3" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>{step.name}</p>
                {step.description && (
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{step.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    );
  }

  // Horizontal (default)
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStep;
          const isCompleted = step.isCompleted || idx < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => handleStepClick(idx)}
                disabled={step.isLocked}
                className={`flex items-center gap-2 ${step.isLocked ? 'opacity-50 cursor-not-allowed' : allowNavigation ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-gray-900 text-white ring-2 ring-gray-300' : 'bg-gray-200 text-gray-500'}
                `}>
                  {isCompleted ? <CheckCircleSolidIcon className="h-4 w-4" /> : step.isLocked ? <LockClosedIcon className="h-3 w-3" /> : idx + 1}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</p>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

