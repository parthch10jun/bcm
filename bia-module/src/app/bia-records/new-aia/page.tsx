'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ServerIcon,
  CircleStackIcon,
  CpuChipIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CubeIcon,
  ShareIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

// AIA Workflow Steps
const AIA_STEPS = [
  { id: 1, name: 'Preparation & Scoping', icon: DocumentTextIcon, description: 'Define scope and objectives' },
  { id: 2, name: 'Asset Inventory', icon: CubeIcon, description: 'Catalog IT resources' },
  { id: 3, name: 'Dependency Mapping', icon: ShareIcon, description: 'Link business to technical' },
  { id: 4, name: 'Requirement Mapping', icon: ClockIcon, description: 'Assign RTO/RPO/MTPD' },
  { id: 5, name: 'Criticality Tiering', icon: ChartBarIcon, description: 'Categorize by recovery needs' },
  { id: 6, name: 'Resource Requirements', icon: UserGroupIcon, description: 'Identify recovery resources' },
  { id: 7, name: 'Reporting & Validation', icon: DocumentCheckIcon, description: 'Document and approve' }
];

export default function NewAIAPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 1: Preparation & Scoping
  const [scope, setScope] = useState({
    aiaName: '',
    description: '',
    businessUnit: '',
    scopeType: 'application', // application | service | infrastructure
    includedSystems: [] as string[],
    excludedSystems: [] as string[],
    objectives: '',
    stakeholders: [] as { name: string; role: string; email: string }[]
  });

  // Step 2: Asset Inventory
  const [assetInventory, setAssetInventory] = useState({
    applications: [] as { id: string; name: string; type: string; owner: string; criticality: string }[],
    databases: [] as { id: string; name: string; size: string; type: string; location: string }[],
    servers: [] as { id: string; name: string; role: string; location: string; os: string }[],
    networks: [] as { id: string; segment: string; bandwidth: string; provider: string }[],
    licenses: [] as { id: string; software: string; count: number; vendor: string; expiry: string }[]
  });

  // Step 3: Dependency Mapping
  const [dependencies, setDependencies] = useState({
    processToTech: [] as { processId: string; processName: string; techComponents: string[]; cascadeImpact: string }[],
    techToTech: [] as { sourceId: string; sourceName: string; targetId: string; targetName: string; dependencyType: string }[],
    externalDeps: [] as { systemId: string; vendorName: string; service: string; sla: string; criticality: string }[]
  });

  // Step 4: Requirement Mapping
  const [requirements, setRequirements] = useState({
    systemRequirements: [] as { 
      systemId: string; 
      systemName: string; 
      businessProcess: string;
      rto: number; 
      rpo: number; 
      mtpd: number;
      source: string; // 'BIA' | 'Manual'
    }[]
  });

  // Step 5: Criticality Tiering
  const [tiering, setTiering] = useState({
    tier1: [] as string[], // Near-zero data loss, instant failover
    tier2: [] as string[], // <4 hours RTO, <1 hour RPO
    tier3: [] as string[], // <24 hours RTO, <4 hours RPO
    tier4: [] as string[]  // >24 hours RTO
  });

  // Step 6: Resource Requirements
  const [resources, setResources] = useState({
    personnel: [] as { role: string; count: number; skills: string[]; availability: string }[],
    facilities: [] as { type: string; location: string; capacity: string; drSite: string }[],
    vendors: [] as { name: string; service: string; contract: string; sla: string; escalation: string }[]
  });

  // Step 7: Reporting & Validation
  const [validation, setValidation] = useState({
    findings: [] as { category: string; description: string; severity: string; recommendation: string }[],
    approvals: [] as { stage: string; approver: string; status: string; date: string; comments: string }[],
    nextReviewDate: '',
    reportGenerated: false
  });

  const handleNext = () => {
    if (currentStep < AIA_STEPS.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or next step
    if (completedSteps.includes(stepId) || stepId === currentStep || stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = () => {
    // Save AIA and redirect
    console.log('Submitting AIA:', { scope, assetInventory, dependencies, requirements, tiering, resources, validation });
    router.push('/bia-records');
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'complete';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/bia-records" className="text-gray-600 hover:text-gray-900">
                <ChevronLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Application Impact Analysis (AIA)</h1>
                <p className="text-xs text-gray-600 mt-1">Technical BIA Workflow - ISO 27031:2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Step {currentStep} of {AIA_STEPS.length}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep / AIA_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {AIA_STEPS.map((step, index) => {
                const status = getStepStatus(step.id);
                const Icon = step.icon;
                const isClickable = completedSteps.includes(step.id) || step.id === currentStep || step.id === currentStep + 1;

                return (
                  <li key={step.id} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleStepClick(step.id)}
                        disabled={!isClickable}
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                          ${status === 'complete' ? 'bg-green-50 border-green-600' : ''}
                          ${status === 'active' ? 'bg-blue-50 border-blue-600' : ''}
                          ${status === 'pending' ? 'bg-gray-50 border-gray-300' : ''}
                          ${!isClickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
                        `}
                      >
                        {status === 'complete' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <Icon className={`h-5 w-5 ${status === 'active' ? 'text-blue-600' : 'text-gray-400'}`} />
                        )}
                      </button>
                      <div className="mt-2 text-center">
                        <p className={`text-xs font-medium ${status === 'active' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {step.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    {index < AIA_STEPS.length - 1 && (
                      <div className={`
                        absolute top-5 left-1/2 w-full h-0.5 -z-10
                        ${completedSteps.includes(step.id) ? 'bg-green-600' : 'bg-gray-300'}
                      `} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="p-6">
            {/* Step Content */}
            {currentStep === 1 && <Step1PreparationScoping scope={scope} setScope={setScope} />}
            {currentStep === 2 && <Step2AssetInventory inventory={assetInventory} setInventory={setAssetInventory} />}
            {currentStep === 3 && <Step3DependencyMapping dependencies={dependencies} setDependencies={setDependencies} />}
            {currentStep === 4 && <Step4RequirementMapping requirements={requirements} setRequirements={setRequirements} />}
            {currentStep === 5 && <Step5CriticalityTiering tiering={tiering} setTiering={setTiering} />}
            {currentStep === 6 && <Step6ResourceRequirements resources={resources} setResources={setResources} />}
            {currentStep === 7 && <Step7ReportingValidation validation={validation} setValidation={setValidation} />}
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </button>

            <div className="text-xs text-gray-600">
              Step {currentStep} of {AIA_STEPS.length}
            </div>

            {currentStep < AIA_STEPS.length ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-sm hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Complete AIA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Preparation & Scoping
function Step1PreparationScoping({ scope, setScope }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Preparation & Scoping</h2>
        <p className="text-sm text-gray-600 mt-1">
          Define which applications and services fall within the scope of the assessment based on business criticality.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">AIA Name *</label>
          <input
            type="text"
            value={scope.aiaName}
            onChange={(e) => setScope({ ...scope, aiaName: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Core Insurance Platform AIA"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Business Unit *</label>
          <select
            value={scope.businessUnit}
            onChange={(e) => setScope({ ...scope, businessUnit: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select business unit</option>
            <option value="insurance-operations">Insurance Operations</option>
            <option value="claims">Claims Processing</option>
            <option value="underwriting">Underwriting</option>
            <option value="customer-service">Customer Service</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={scope.description}
          onChange={(e) => setScope({ ...scope, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the purpose and objectives of this AIA..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Scope Type</label>
        <div className="grid grid-cols-3 gap-4">
          {['application', 'service', 'infrastructure'].map((type) => (
            <button
              key={type}
              onClick={() => setScope({ ...scope, scopeType: type })}
              className={`
                px-4 py-3 text-sm font-medium border-2 rounded-sm transition-all
                ${scope.scopeType === type
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}
              `}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <DocumentTextIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-blue-900">ISO 27031:2025 - AIA Purpose</h4>
            <p className="text-xs text-blue-700 mt-1">
              The Application Impact Analysis bridges business requirements (RTO/RPO from BIA) to specific IT assets and dependencies.
              This technical BIA ensures IT recovery strategies align with business continuity objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Asset Inventory
function Step2AssetInventory({ inventory, setInventory }: any) {
  const [activeTab, setActiveTab] = useState<'applications' | 'databases' | 'servers' | 'networks' | 'licenses'>('applications');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Asset Inventory</h2>
        <p className="text-sm text-gray-600 mt-1">
          Create a comprehensive record of all IT resources including hardware, software, and licenses.
        </p>
      </div>

      {/* Asset Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'applications', label: 'Applications', icon: ServerIcon },
            { id: 'databases', label: 'Databases', icon: CircleStackIcon },
            { id: 'servers', label: 'Servers', icon: CpuChipIcon },
            { id: 'networks', label: 'Networks', icon: ShareIcon },
            { id: 'licenses', label: 'Licenses', icon: DocumentTextIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {inventory[tab.id]?.length || 0}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">Catalog all business applications and IT systems</p>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
              <ServerIcon className="h-4 w-4" />
              Add Application
            </button>
          </div>

          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Application Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Criticality</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No applications added yet. Click "Add Application" to begin.
                    </td>
                  </tr>
                ) : (
                  inventory.applications.map((app: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{app.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{app.type}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{app.owner}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`
                          inline-flex px-2 py-0.5 text-xs font-medium rounded-sm
                          ${app.criticality === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                          ${app.criticality === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''}
                          ${app.criticality === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : ''}
                        `}>
                          {app.criticality}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sample Data Button */}
          <button
            onClick={() => setInventory({
              ...inventory,
              applications: [
                { id: 'app-001', name: 'Core Insurance Platform', type: 'Business Critical', owner: 'Michael Schmidt', criticality: 'Critical' },
                { id: 'app-002', name: 'Customer Portal', type: 'Customer-Facing', owner: 'Anna Weber', criticality: 'High' },
                { id: 'app-003', name: 'Claims Management System', type: 'Business Critical', owner: 'Klaus Müller', criticality: 'Critical' }
              ]
            })}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Load Sample Data
          </button>
        </div>
      )}

      {/* Other tabs would follow similar pattern */}
      {activeTab !== 'applications' && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 text-center">
          <p className="text-sm text-gray-600">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} inventory coming soon...
          </p>
        </div>
      )}
    </div>
  );
}

// Step 3: Dependency Mapping
function Step3DependencyMapping({ dependencies, setDependencies }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Dependency Mapping</h2>
        <p className="text-sm text-gray-600 mt-1">
          Link business processes to specific technical components via CMDB. Identify cascading effects where failure of one system impacts multiple services.
        </p>
      </div>

      {/* Process to Technical Mapping */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Business Process → Technical Components</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
            <ShareIcon className="h-4 w-4" />
            Add Mapping
          </button>
        </div>

        <div className="space-y-3">
          {dependencies.processToTech.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No process-to-technical mappings defined yet.
            </div>
          ) : (
            dependencies.processToTech.map((mapping: any, index: number) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mapping.processName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Depends on: {mapping.techComponents.join(', ')}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      <strong>Cascade Impact:</strong> {mapping.cascadeImpact}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setDependencies({
            ...dependencies,
            processToTech: [
              { processId: 'proc-001', processName: 'Policy Management', techComponents: ['Core Insurance Platform', 'Policy Database', 'Application Server Cluster'], cascadeImpact: 'If Core Insurance Platform fails, all policy operations stop immediately affecting 3 business processes' },
              { processId: 'proc-002', processName: 'Claims Processing', techComponents: ['Claims Management System', 'Claims Database', 'Payment Gateway'], cascadeImpact: 'Claims Database failure impacts both claims processing and payment disbursement' }
            ]
          })}
          className="mt-4 text-xs text-blue-600 hover:text-blue-800"
        >
          Load Sample Mappings
        </button>
      </div>

      {/* Cascading Effect Visualization */}
      <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ShareIcon className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-amber-900">Cascading Effects Analysis</h4>
            <p className="text-xs text-amber-700 mt-1">
              Dependency mapping reveals that a single technical component failure can cascade to multiple business processes.
              This analysis is critical for prioritizing recovery strategies and understanding true business impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Requirement Mapping
function Step4RequirementMapping({ requirements, setRequirements }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Requirement Mapping</h2>
        <p className="text-sm text-gray-600 mt-1">
          Assign RTO, RPO, and MTPD from the Business BIA to the specific supporting IT systems.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">IT System</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Business Process</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">RTO (Hours)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">RPO (Hours)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">MTPD (Hours)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Source</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requirements.systemRequirements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No requirement mappings defined yet.
                </td>
              </tr>
            ) : (
              requirements.systemRequirements.map((req: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{req.systemName}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{req.businessProcess}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{req.rto}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{req.rpo}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{req.mtpd}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`
                      inline-flex px-2 py-0.5 text-xs font-medium rounded-sm
                      ${req.source === 'BIA' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}
                    `}>
                      {req.source}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setRequirements({
          systemRequirements: [
            { systemId: 'sys-001', systemName: 'Core Insurance Platform', businessProcess: 'Policy Management', rto: 2, rpo: 1, mtpd: 4, source: 'BIA' },
            { systemId: 'sys-002', systemName: 'Claims Management System', businessProcess: 'Claims Processing', rto: 4, rpo: 2, mtpd: 8, source: 'BIA' },
            { systemId: 'sys-003', systemName: 'Customer Portal', businessProcess: 'Customer Self-Service', rto: 8, rpo: 4, mtpd: 24, source: 'BIA' }
          ]
        })}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        Load Sample Requirements
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-blue-900">BIA-Driven Requirements</h4>
            <p className="text-xs text-blue-700 mt-1">
              RTO/RPO/MTPD values should be inherited from the Business BIA. This ensures IT recovery strategies are aligned with actual business needs, not arbitrary technical targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 5: Criticality Tiering
function Step5CriticalityTiering({ tiering, setTiering }: any) {
  const allSystems = [
    'Core Insurance Platform',
    'Claims Management System',
    'Customer Portal',
    'Policy Database',
    'Payment Gateway',
    'Email Server',
    'File Server',
    'Backup System'
  ];

  const tierDefinitions = [
    { tier: 'tier1', name: 'Tier 1 - Mission Critical', rto: '< 2 hours', rpo: '< 15 minutes', color: 'red', description: 'Near-zero data loss, instant failover required' },
    { tier: 'tier2', name: 'Tier 2 - Business Critical', rto: '< 4 hours', rpo: '< 1 hour', color: 'orange', description: 'Minimal data loss acceptable, rapid recovery needed' },
    { tier: 'tier3', name: 'Tier 3 - Important', rto: '< 24 hours', rpo: '< 4 hours', color: 'yellow', description: 'Moderate recovery timeframe acceptable' },
    { tier: 'tier4', name: 'Tier 4 - Standard', rto: '> 24 hours', rpo: '> 4 hours', color: 'gray', description: 'Extended recovery timeframe acceptable' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Criticality Tiering</h2>
        <p className="text-sm text-gray-600 mt-1">
          Categorize systems into tiers based on their recovery requirements. This drives recovery strategy selection and resource allocation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tierDefinitions.map((tierDef) => (
          <div key={tierDef.tier} className={`bg-${tierDef.color}-50 border border-${tierDef.color}-200 rounded-sm p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={`text-sm font-semibold text-${tierDef.color}-900`}>{tierDef.name}</h3>
                <p className={`text-xs text-${tierDef.color}-700 mt-1`}>{tierDef.description}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium bg-${tierDef.color}-100 text-${tierDef.color}-700 rounded-sm`}>
                {tiering[tierDef.tier]?.length || 0} systems
              </span>
            </div>
            <div className="space-y-1">
              <p className={`text-xs text-${tierDef.color}-700`}><strong>RTO:</strong> {tierDef.rto}</p>
              <p className={`text-xs text-${tierDef.color}-700`}><strong>RPO:</strong> {tierDef.rpo}</p>
            </div>
            <div className="mt-3 space-y-1">
              {tiering[tierDef.tier]?.map((system: string, index: number) => (
                <div key={index} className={`text-xs bg-white border border-${tierDef.color}-200 rounded px-2 py-1`}>
                  {system}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setTiering({
          tier1: ['Core Insurance Platform', 'Policy Database'],
          tier2: ['Claims Management System', 'Payment Gateway'],
          tier3: ['Customer Portal', 'Email Server'],
          tier4: ['File Server', 'Backup System']
        })}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        Load Sample Tiering
      </button>

      <div className="bg-green-50 border border-green-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <ChartBarIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-green-900">Tiering Drives Strategy</h4>
            <p className="text-xs text-green-700 mt-1">
              Tier 1 systems require Active-Active or Hot Site strategies. Tier 2 may use Warm Site. Tier 3/4 can use Cold Site or backup/restore.
              This tiering directly informs IT DR Plan development and budget allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 6: Resource Requirements
function Step6ResourceRequirements({ resources, setResources }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Resource Requirement Identification</h2>
        <p className="text-sm text-gray-600 mt-1">
          Determine what personnel, facilities, and vendor contracts are needed to restore the technical stack.
        </p>
      </div>

      {/* Personnel Requirements */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Personnel Requirements</h3>
        <div className="space-y-3">
          {resources.personnel.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No personnel requirements defined yet.</p>
          ) : (
            resources.personnel.map((person: any, index: number) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-medium text-gray-900">{person.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Count</p>
                    <p className="text-sm text-gray-900">{person.count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Skills</p>
                    <p className="text-sm text-gray-900">{person.skills.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className="text-sm text-gray-900">{person.availability}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setResources({
            ...resources,
            personnel: [
              { role: 'Database Administrator', count: 2, skills: ['Oracle', 'PostgreSQL', 'Backup/Restore'], availability: '24/7 On-Call' },
              { role: 'Network Engineer', count: 2, skills: ['Cisco', 'Firewall', 'VPN'], availability: '24/7 On-Call' },
              { role: 'Application Support', count: 3, skills: ['Java', 'SAP', 'Troubleshooting'], availability: 'Business Hours + On-Call' }
            ]
          })}
          className="mt-4 text-xs text-blue-600 hover:text-blue-800"
        >
          Load Sample Personnel
        </button>
      </div>

      {/* Vendor Requirements */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Vendor & Third-Party Requirements</h3>
        <div className="space-y-3">
          {resources.vendors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No vendor requirements defined yet.</p>
          ) : (
            resources.vendors.map((vendor: any, index: number) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Vendor</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="text-sm text-gray-900">{vendor.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SLA</p>
                    <p className="text-sm text-gray-900">{vendor.sla}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Escalation</p>
                    <p className="text-sm text-gray-900">{vendor.escalation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setResources({
            ...resources,
            vendors: [
              { name: 'AWS', service: 'Cloud Infrastructure', contract: 'Enterprise Support', sla: '1 Hour Response', escalation: 'TAM Direct Line' },
              { name: 'Oracle', service: 'Database Support', contract: 'Platinum Support', sla: '2 Hour Response', escalation: 'Critical Escalation Path' }
            ]
          })}
          className="mt-4 text-xs text-blue-600 hover:text-blue-800"
        >
          Load Sample Vendors
        </button>
      </div>
    </div>
  );
}

// Step 7: Reporting & Validation
function Step7ReportingValidation({ validation, setValidation }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Reporting & Validation</h2>
        <p className="text-sm text-gray-600 mt-1">
          Document findings and obtain stakeholder approval to ensure the technical recovery strategy aligns with business needs.
        </p>
      </div>

      {/* Key Findings */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Findings</h3>
        <div className="space-y-3">
          {validation.findings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No findings documented yet.</p>
          ) : (
            validation.findings.map((finding: any, index: number) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        inline-flex px-2 py-0.5 text-xs font-medium rounded-sm
                        ${finding.severity === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                        ${finding.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : ''}
                        ${finding.severity === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                      `}>
                        {finding.severity}
                      </span>
                      <span className="text-xs text-gray-600">{finding.category}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{finding.description}</p>
                    <p className="text-xs text-gray-600 mt-1"><strong>Recommendation:</strong> {finding.recommendation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setValidation({
            ...validation,
            findings: [
              { category: 'RTO Gap', description: 'Core Insurance Platform current RTO is 6 hours, business requirement is 2 hours', severity: 'High', recommendation: 'Implement Active-Active architecture with automated failover' },
              { category: 'Single Point of Failure', description: 'Payment Gateway has no redundancy', severity: 'High', recommendation: 'Deploy secondary payment gateway in DR site' },
              { category: 'Dependency Risk', description: 'Claims processing depends on single database instance', severity: 'Medium', recommendation: 'Implement database replication to DR site' }
            ]
          })}
          className="mt-4 text-xs text-blue-600 hover:text-blue-800"
        >
          Load Sample Findings
        </button>
      </div>

      {/* Approval Status */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Approval Workflow</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
            <div>
              <p className="text-sm font-medium text-gray-900">IT Manager Review</p>
              <p className="text-xs text-gray-600">Michael Schmidt</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-sm">
              ✓ Approved
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
            <div>
              <p className="text-sm font-medium text-gray-900">CISO Review</p>
              <p className="text-xs text-gray-600">Anna Weber</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-sm">
              ⏳ Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <div>
              <p className="text-sm font-medium text-gray-900">CIO Approval</p>
              <p className="text-xs text-gray-600">Dr. Klaus Müller</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">
              ⏸ Not Started
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <DocumentCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-blue-900">AIA Complete - Ready for IT DR Plan Development</h4>
            <p className="text-xs text-blue-700 mt-1">
              This AIA provides the technical foundation for developing IT DR Plans. The criticality tiering, dependency mapping, and requirement alignment ensure that IT recovery strategies directly support business continuity objectives per ISO 27031:2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

