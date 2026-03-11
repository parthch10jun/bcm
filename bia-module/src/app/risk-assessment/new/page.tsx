'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Step0BIASelection from './steps/Step0BIASelection';
import Step1LaunchScreen from './steps/Step1LaunchScreen';
import Step2ContextOverview from './steps/Step2ContextOverview';
import Step3ThreatSelection from './steps/Step3ThreatSelection';
import Step4RiskEvaluation from './steps/Step4RiskEvaluation';
import Step5RiskSummary from './steps/Step5RiskSummary';
import Step6TreatmentPlans from './steps/Step6TreatmentPlans';
import Step7ReviewApproval from './steps/Step7ReviewApproval';

const WIZARD_STEPS = [
  { id: 0, name: 'BIA Link', title: 'Link to BIA' },
  { id: 1, name: 'Launch', title: 'Create New Risk Assessment' },
  { id: 2, name: 'Context', title: 'Context Overview' },
  { id: 3, name: 'Threats', title: 'Threat Selection' },
  { id: 4, name: 'Evaluate', title: 'Risk Evaluation' },
  { id: 5, name: 'Summary', title: 'Risk Summary' },
  { id: 6, name: 'Treatment', title: 'Treatment Plans' },
  { id: 7, name: 'Review', title: 'Review & Approval' }
];

// Demo data templates for each risk assessment type
const DEMO_DATA_TEMPLATES: Record<string, any> = {
  PROCESS: {
    riskCategoryId: 3, // "Process" category
    contextType: 'PROCESS',
    contextId: 1,
    contextName: 'IT Project Management',
    assessmentName: 'IT Project Management Risk Assessment - Demo',
    description: 'Comprehensive risk assessment for IT project management processes including planning, execution, and delivery.',
    assessorName: 'John Smith',
    assessorEmail: 'john.smith@acme.com',
    assessmentDate: new Date().toISOString().split('T')[0],
    riskThreshold: 12,
  },
  LOCATION: {
    riskCategoryId: 1, // "Location Level" category
    contextType: 'LOCATION',
    contextId: 1,
    contextName: 'ACME Corporation',
    assessmentName: 'Head Office Location Risk Assessment - Demo',
    description: 'Risk assessment for head office facility covering physical security, environmental hazards, and business continuity.',
    assessorName: 'Sarah Johnson',
    assessorEmail: 'sarah.johnson@acme.com',
    assessmentDate: new Date().toISOString().split('T')[0],
    riskThreshold: 15,
  },
  SUPPLIER: {
    riskCategoryId: 4, // "Supplier/Vendor" category
    contextType: 'SUPPLIER',
    contextId: 1,
    contextName: 'Amazon Web Services',
    assessmentName: 'AWS Cloud Services Risk Assessment - Demo',
    description: 'Third-party supplier risk assessment for AWS cloud infrastructure services and dependencies.',
    assessorName: 'Michael Chen',
    assessorEmail: 'michael.chen@acme.com',
    assessmentDate: new Date().toISOString().split('T')[0],
    riskThreshold: 12,
  },
  APPLICATION: {
    riskCategoryId: 5, // "Application/Software" category
    contextType: 'APPLICATION',
    contextId: 1,
    contextName: 'SAP Finance Server',
    assessmentName: 'SAP ERP System Risk Assessment - Demo',
    description: 'Enterprise application risk assessment for SAP ERP system covering security, availability, and data integrity.',
    assessorName: 'Emily Davis',
    assessorEmail: 'emily.davis@acme.com',
    assessmentDate: new Date().toISOString().split('T')[0],
    riskThreshold: 15,
  },
  PEOPLE: {
    riskCategoryId: 8, // "People/Personnel" category
    contextType: 'PEOPLE',
    contextId: 1,
    contextName: 'Executive Team',
    assessmentName: 'Key Personnel Risk Assessment - Demo',
    description: 'Risk assessment for key personnel and executive leadership team covering succession planning and knowledge retention.',
    assessorName: 'Robert Wilson',
    assessorEmail: 'robert.wilson@acme.com',
    assessmentDate: new Date().toISOString().split('T')[0],
    riskThreshold: 12,
  }
};

function NewRiskAssessmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0); // Start at BIA selection step
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  // Check if demo mode is enabled via URL parameter
  const demoType = searchParams.get('demo'); // e.g., ?demo=PROCESS
  const isDemoMode = demoType && DEMO_DATA_TEMPLATES[demoType];

  console.log('🎬 Demo Mode Detection:', { demoType, isDemoMode, template: isDemoMode ? DEMO_DATA_TEMPLATES[demoType] : null });

  const [wizardData, setWizardData] = useState<any>({
    // Step 0 data - BIA Link
    linkedBiaId: null,
    linkedBiaName: null,
    biaRtoHours: null,
    biaRpoHours: null,
    biaMtdHours: null,
    biaCriticality: null,
    biaBusinessFunction: null,

    // Step 1 data - use demo data if available
    ...(isDemoMode ? DEMO_DATA_TEMPLATES[demoType] : {
      riskCategoryId: null,
      contextType: '',
      contextId: null,
      contextName: '',
      assessmentName: '',
      description: '',
      assessorName: '',
      assessorEmail: '',
      assessmentDate: new Date().toISOString().split('T')[0],
      riskThreshold: 12,
    }),

    // Step 2 data (loaded from backend)
    contextOverview: null,

    // Step 3 data
    selectedThreats: [],

    // Step 4 data
    threatAssessments: [],

    // Step 5 data
    riskSummary: null,

    // Step 6 data
    treatmentPlans: [],

    // Step 7 data
    executiveSummary: '',
    recommendations: ''
  });

  console.log('📊 Wizard Data Initialized:', wizardData);

  const updateWizardData = (updates: any) => {
    setWizardData((prev: any) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/risk-assessment');
    }
  };

  const handleSkipBIA = () => {
    // Skip BIA selection and go directly to Step 1
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0BIASelection
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onSkip={handleSkipBIA}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <Step1LaunchScreen
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onCancel={handleCancel}
            setAssessmentId={setAssessmentId}
            isDemoMode={!!isDemoMode}
          />
        );
      case 2:
        return (
          <Step2ContextOverview
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            isDemoMode={!!isDemoMode}
          />
        );
      case 3:
        return (
          <Step3ThreatSelection
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            isDemoMode={!!isDemoMode}
          />
        );
      case 4:
        return (
          <Step4RiskEvaluation
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            isDemoMode={!!isDemoMode}
          />
        );
      case 5:
        return (
          <Step5RiskSummary
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            isDemoMode={!!isDemoMode}
          />
        );
      case 6:
        return (
          <Step6TreatmentPlans
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            isDemoMode={!!isDemoMode}
          />
        );
      case 7:
        return (
          <Step7ReviewApproval
            assessmentId={assessmentId}
            data={wizardData}
            onUpdate={updateWizardData}
            onBack={handleBack}
            onSubmit={() => router.push('/risk-assessment')}
            isDemoMode={!!isDemoMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
}

export default function NewRiskAssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <NewRiskAssessmentPageContent />
    </Suspense>
  );
}
