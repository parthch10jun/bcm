'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export interface BIAWizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isComplete: boolean;
  isActive: boolean;
  completionPercentage: number;
  requiredFields: string[];
  optionalFields: string[];
}

interface BIAWizardProps {
  biaRecordId: string;
  onStepChange: (stepId: string) => void;
  onComplete: () => void;
}

const defaultSteps: BIAWizardStep[] = [
  {
    id: 'bia-details',
    title: 'BIA Details',
    description: 'Basic information and scope definition',
    icon: DocumentTextIcon,
    isComplete: false,
    isActive: true,
    completionPercentage: 0,
    requiredFields: ['name', 'description', 'businessCoordinator', 'businessContinuityAnalyst'],
    optionalFields: ['startDate', 'endDate']
  },
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Purpose, scope, and context',
    icon: DocumentTextIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['introduction', 'purpose', 'scope'],
    optionalFields: ['attachments']
  },
  {
    id: 'locations',
    title: 'Locations',
    description: 'Physical and operational sites',
    icon: BuildingOfficeIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['primaryLocation'],
    optionalFields: ['secondaryLocations', 'emergencyContacts']
  },
  {
    id: 'staff-list',
    title: 'Staff List',
    description: 'Key personnel and roles',
    icon: UsersIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['keyPersonnel'],
    optionalFields: ['departmentStaff', 'contactDetails']
  },
  {
    id: 'recovery-staff',
    title: 'Recovery Staff',
    description: 'Designated recovery team members',
    icon: UsersIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['recoveryTeamLead'],
    optionalFields: ['recoveryTeamMembers', 'alternateContacts']
  },
  {
    id: 'processes',
    title: 'Processes',
    description: 'Business process analysis and impact assessment',
    icon: CogIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['businessProcesses', 'impactAssessment'],
    optionalFields: ['dependencies', 'resources']
  },
  {
    id: 'finish',
    title: 'Finish',
    description: 'Review and submit for approval',
    icon: CheckCircleIcon,
    isComplete: false,
    isActive: false,
    completionPercentage: 0,
    requiredFields: ['finalReview'],
    optionalFields: ['comments']
  }
];

export default function BIAWizard({ biaRecordId, onStepChange, onComplete }: BIAWizardProps) {
  const [steps, setSteps] = useState<BIAWizardStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const overallProgress = Math.round((steps.filter(s => s.isComplete).length / totalSteps) * 100);

  useEffect(() => {
    // Update active step
    setSteps(prevSteps => 
      prevSteps.map((step, index) => ({
        ...step,
        isActive: index === currentStepIndex
      }))
    );
  }, [currentStepIndex]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      // Mark current step as complete
      setSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === currentStepIndex 
            ? { ...step, isComplete: true, completionPercentage: 100 }
            : step
        )
      );
      
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange(steps[nextIndex].id);
    } else {
      // Final step - complete the BIA
      setSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === currentStepIndex 
            ? { ...step, isComplete: true, completionPercentage: 100 }
            : step
        )
      );
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange(steps[prevIndex].id);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStepIndex) {
      setCurrentStepIndex(stepIndex);
      onStepChange(steps[stepIndex].id);
    }
  };

  const getStepStatus = (step: BIAWizardStep, index: number) => {
    if (step.isComplete) return 'complete';
    if (step.isActive) return 'active';
    if (index < currentStepIndex) return 'available';
    return 'upcoming';
  };

  const getStepIcon = (step: BIAWizardStep, status: string) => {
    if (status === 'complete') {
      return <CheckCircleIcon className="h-5 w-5 text-white" />;
    }
    if (status === 'active') {
      return <ClockIcon className="h-5 w-5 text-white" />;
    }
    return <step.icon className="h-5 w-5 text-gray-400" />;
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-bcm-blue border-bcm-blue text-white';
      case 'active':
        return 'bg-bcm-dark border-bcm-dark text-white';
      case 'available':
        return 'bg-white border-gray-300 text-gray-700 hover:border-bcm-blue cursor-pointer';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-400';
    }
  };

  return (
    <div className="bg-white">
      {/* Progress Header */}
      <div className="bg-bcm-dark text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Business Impact Analysis Wizard</h2>
            <p className="text-sm text-gray-300">Step {currentStepIndex + 1} of {totalSteps}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <div className="text-sm text-gray-300">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bcm-progress-bar">
            <div 
              className="bcm-progress-fill bg-white" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="px-6 py-4 border-b border-gray-200">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step, index);
              const isClickable = status === 'complete' || status === 'active' || status === 'available';
              
              return (
                <li key={step.id} className="flex-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => isClickable && handleStepClick(index)}
                      disabled={!isClickable}
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                        ${getStepStyles(status)}
                        ${!isClickable ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      {getStepIcon(step, status)}
                    </button>
                    
                    {index < steps.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-2
                        ${step.isComplete ? 'bg-bcm-blue' : 'bg-gray-200'}
                      `} />
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <div className={`
                      text-xs font-medium
                      ${status === 'active' ? 'text-bcm-dark' : 
                        status === 'complete' ? 'text-bcm-blue' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Current Step Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-bcm-dark rounded-full">
              <currentStep.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{currentStep.title}</h3>
            <p className="text-gray-600 mt-2">{currentStep.description}</p>
          </div>

          {/* Step Content Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Step content for "{currentStep.title}" will be rendered here.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Required fields: {currentStep.requiredFields.join(', ')}</p>
              {currentStep.optionalFields.length > 0 && (
                <p>Optional fields: {currentStep.optionalFields.join(', ')}</p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              className={`
                inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md
                ${currentStepIndex === 0 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
                }
              `}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNextStep}
              className="bcm-button-primary"
            >
              {currentStepIndex === totalSteps - 1 ? 'Complete BIA' : 'Next Step'}
              {currentStepIndex < totalSteps - 1 && (
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
