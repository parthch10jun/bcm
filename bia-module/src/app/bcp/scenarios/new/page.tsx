'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CheckIcon,
  DocumentTextIcon,
  TagIcon,
  LinkIcon,
  BookOpenIcon,
  EyeIcon,
  ShieldExclamationIcon,
  FireIcon,
  BoltIcon,
  CloudIcon,
  InformationCircleIcon,
  ServerIcon,
  CpuChipIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const steps = [
  { id: 1, name: 'Link BIA', icon: DocumentTextIcon },
  { id: 2, name: 'Basic Information', icon: DocumentTextIcon },
  { id: 3, name: 'Classification', icon: TagIcon },
  { id: 4, name: 'Link Resources', icon: LinkIcon },
  { id: 5, name: 'Playbook Selection', icon: BookOpenIcon },
  { id: 6, name: 'Review & Submit', icon: EyeIcon }
];

// Mock BIA Records from BIA Module (would come from API in production)
const mockBIARecords = [
  {
    id: 1,
    biaName: 'Trading Operations - Business Impact Analysis',
    biaType: 'PROCESS',
    status: 'APPROVED',
    finalRtoHours: 2,
    finalRpoHours: 0.5,
    mtpdHours: 4,
    finalCriticality: 'CRITICAL',
    biaCoordinator: 'Sarah Johnson',
    department: 'Trading Operations',
    processes: [
      { id: 'PROC-001', name: 'Order Matching Engine', rto: 1, rpo: 0, criticality: 'Critical', owner: 'John Smith' },
      { id: 'PROC-002', name: 'Trade Settlement', rto: 2, rpo: 0.5, criticality: 'Critical', owner: 'Jane Doe' },
      { id: 'PROC-003', name: 'Market Data Feed', rto: 0.5, rpo: 0, criticality: 'Critical', owner: 'Mike Wilson' }
    ],
    assets: [
      { id: 'AST-001', name: 'Trading Server Cluster', type: 'Server', rto: 1, rpo: 0, criticality: 'Critical', location: 'Primary DC' },
      { id: 'AST-002', name: 'Oracle RAC Database', type: 'Database', rto: 2, rpo: 0.5, criticality: 'Critical', location: 'Primary DC' },
      { id: 'AST-003', name: 'Core Network Switches', type: 'Network', rto: 0.5, rpo: 0, criticality: 'Critical', location: 'Primary DC' }
    ],
    vendors: [
      { id: 'VND-001', name: 'Oracle', type: 'Software', sla: '4 hour response', contract: 'Premium Support' },
      { id: 'VND-002', name: 'Dell EMC', type: 'Hardware', sla: '2 hour response', contract: 'Mission Critical' }
    ],
    linkedRisks: 5
  },
  {
    id: 2,
    biaName: 'Member Services Portal - Business Impact Analysis',
    biaType: 'PROCESS',
    status: 'APPROVED',
    finalRtoHours: 4,
    finalRpoHours: 1,
    mtpdHours: 8,
    finalCriticality: 'HIGH',
    biaCoordinator: 'Ahmed Al-Mansouri',
    department: 'Member Services',
    processes: [
      { id: 'PROC-004', name: 'Member Portal', rto: 4, rpo: 1, criticality: 'High', owner: 'Sarah Lee' },
      { id: 'PROC-005', name: 'API Gateway', rto: 2, rpo: 0.5, criticality: 'High', owner: 'Tom Chen' }
    ],
    assets: [
      { id: 'AST-004', name: 'Web Application Servers', type: 'Server', rto: 2, rpo: 1, criticality: 'High', location: 'Primary DC' },
      { id: 'AST-005', name: 'CDN Infrastructure', type: 'Network', rto: 1, rpo: 0, criticality: 'High', location: 'Cloud' }
    ],
    vendors: [
      { id: 'VND-003', name: 'Akamai', type: 'CDN', sla: '1 hour response', contract: 'Enterprise' }
    ],
    linkedRisks: 3
  },
  {
    id: 3,
    biaName: 'Surveillance & Compliance - Business Impact Analysis',
    biaType: 'PROCESS',
    status: 'APPROVED',
    finalRtoHours: 4,
    finalRpoHours: 0,
    mtpdHours: 24,
    finalCriticality: 'CRITICAL',
    biaCoordinator: 'Mohammed Hassan',
    department: 'Compliance',
    processes: [
      { id: 'PROC-006', name: 'Trade Surveillance', rto: 4, rpo: 0, criticality: 'Critical', owner: 'Lisa Wang' },
      { id: 'PROC-007', name: 'Regulatory Reporting', rto: 8, rpo: 0, criticality: 'High', owner: 'David Kim' }
    ],
    assets: [
      { id: 'AST-006', name: 'SMARTS Surveillance System', type: 'Application', rto: 4, rpo: 0, criticality: 'Critical', location: 'Primary DC' },
      { id: 'AST-007', name: 'Compliance Database', type: 'Database', rto: 4, rpo: 0, criticality: 'Critical', location: 'Primary DC' }
    ],
    vendors: [
      { id: 'VND-004', name: 'NASDAQ', type: 'Software', sla: '4 hour response', contract: 'Premium' }
    ],
    linkedRisks: 4
  }
];

// Additional standalone processes not in BIA (for manual linking)
const additionalProcesses = [
  { id: 'PROC-010', name: 'Email Communications', rto: 8, rpo: 4, criticality: 'Medium', owner: 'IT Operations', department: 'IT' },
  { id: 'PROC-011', name: 'HR Self-Service', rto: 24, rpo: 8, criticality: 'Low', owner: 'HR Team', department: 'HR' },
  { id: 'PROC-012', name: 'Document Management', rto: 12, rpo: 4, criticality: 'Medium', owner: 'Admin', department: 'Operations' }
];

// Additional standalone assets not in BIA (for manual linking)
const additionalAssets = [
  { id: 'AST-010', name: 'Backup Power Generators', type: 'Infrastructure', rto: 0.5, rpo: 0, criticality: 'Critical', location: 'All Sites' },
  { id: 'AST-011', name: 'VPN Gateway', type: 'Network', rto: 1, rpo: 0, criticality: 'High', location: 'Primary DC' },
  { id: 'AST-012', name: 'Endpoint Workstations', type: 'Hardware', rto: 8, rpo: 4, criticality: 'Medium', location: 'All Sites' }
];

// Additional vendors not in BIA
const additionalVendors = [
  { id: 'VND-010', name: 'CrowdStrike', type: 'Security', sla: '1 hour response', contract: 'Falcon Complete' },
  { id: 'VND-011', name: 'Palo Alto Networks', type: 'Security', sla: '2 hour response', contract: 'Premium Support' },
  { id: 'VND-012', name: 'Microsoft', type: 'Software', sla: '4 hour response', contract: 'Premier Support' }
];

export default function NewBCPScenarioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');

  // BCP-themed loading animation
  useEffect(() => {
    const stages = [
      { text: 'Initializing Business Continuity Framework...', duration: 600 },
      { text: 'Loading Scenario Templates & Playbooks...', duration: 550 },
      { text: 'Connecting to Resource Libraries...', duration: 500 },
      { text: 'Preparing Criticality Assessment Tools...', duration: 450 },
      { text: 'Validating Compliance Requirements...', duration: 400 },
      { text: 'Ready to Create Scenario...', duration: 350 }
    ];

    let currentStageIndex = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2;
      setLoadingProgress(Math.min(progress, 100));

      if (currentStageIndex < stages.length) {
        const stageProgress = (progress / 100) * stages.length;
        if (stageProgress > currentStageIndex) {
          setLoadingStage(stages[currentStageIndex].text);
          currentStageIndex++;
        }
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => setIsInitialLoading(false), 300);
      }
    }, 35);

    return () => clearInterval(progressInterval);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    // BIA Link
    linkedBiaId: null as number | null,
    linkedBiaName: '',
    biaRtoHours: null as number | null,
    biaRpoHours: null as number | null,
    biaMtdHours: null as number | null,
    biaCriticality: '',
    biaBusinessFunction: '',
    // Basic Info
    name: '',
    type: '',
    description: '',
    objectives: '',
    severity: '',
    criticality: '',
    regulatory: '',
    // Linked resources with full data
    linkedProcesses: [] as { id: string; name: string; rto: number; rpo: number; criticality: string; owner: string; source: string }[],
    linkedAssets: [] as { id: string; name: string; type: string; rto: number; rpo: number; criticality: string; location: string; source: string }[],
    linkedVendors: [] as { id: string; name: string; type: string; sla: string; contract: string; source: string }[],
    playbook: '',
    // Linked Risk Assessments (auto-pulled from BIA)
    linkedRiskAssessments: [] as { id: number; name: string; riskCount: number }[],
    // Calculated metrics
    calculatedRto: null as number | null,
    calculatedRpo: null as number | null,
    calculatedCriticality: '' as string
  });

  const [selectedBia, setSelectedBia] = useState<any>(null);
  const [showDataSourceTooltip, setShowDataSourceTooltip] = useState<string | null>(null);

  // Calculate derived metrics from linked resources
  const calculateDerivedMetrics = (processes: typeof formData.linkedProcesses, assets: typeof formData.linkedAssets) => {
    const allItems = [...processes, ...assets];
    if (allItems.length === 0) return { rto: null, rpo: null, criticality: '' };

    // RTO = MIN of all linked RTOs (most restrictive)
    const minRto = Math.min(...allItems.map(item => item.rto));

    // RPO = MIN of all linked RPOs (most restrictive)
    const minRpo = Math.min(...allItems.map(item => item.rpo));

    // Criticality = MAX of all linked criticalities
    const criticalityOrder = ['Low', 'Medium', 'High', 'Critical'];
    const maxCriticalityIndex = Math.max(...allItems.map(item =>
      criticalityOrder.indexOf(item.criticality.charAt(0).toUpperCase() + item.criticality.slice(1).toLowerCase())
    ));
    const maxCriticality = criticalityOrder[maxCriticalityIndex] || 'Medium';

    return { rto: minRto, rpo: minRpo, criticality: maxCriticality };
  };

  // Update calculated metrics when linked resources change
  useEffect(() => {
    const metrics = calculateDerivedMetrics(formData.linkedProcesses, formData.linkedAssets);
    setFormData(prev => ({
      ...prev,
      calculatedRto: metrics.rto,
      calculatedRpo: metrics.rpo,
      calculatedCriticality: metrics.criticality
    }));
  }, [formData.linkedProcesses, formData.linkedAssets]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting BCP Scenario:', formData);
    router.push('/bcp');
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Gradient Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-red-200 to-orange-200 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              animation: 'gridMove 20s linear infinite'
            }} />
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          {/* Triple Rotating Shields - BCP Theme */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer Shield Ring */}
            <div className="absolute inset-0 border-4 border-orange-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full" />
            </div>
            {/* Middle Shield Ring */}
            <div className="absolute inset-3 border-4 border-red-400 rounded-full" style={{ animation: 'spin 2s linear infinite reverse' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            {/* Inner Shield Ring */}
            <div className="absolute inset-6 border-4 border-amber-400 rounded-full animate-spin" style={{ animationDuration: '2.5s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full" />
            </div>
            {/* Center Shield Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldExclamationIcon className="h-12 w-12 text-orange-600 animate-pulse" />
            </div>
          </div>

          {/* Title with Gradient */}
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
            Business Continuity Planning
          </h2>
          <p className="text-sm text-gray-600 mb-6">{loadingStage}</p>

          {/* Progress Bar */}
          <div className="w-96 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{loadingProgress}% Complete</p>
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-2 gap-3 w-96 mx-auto mt-6">
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 20 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 20 ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-orange-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Framework Ready</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 40 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 40 ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-orange-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Templates Loaded</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 60 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 60 ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-orange-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Libraries Connected</span>
              </div>
            </div>
            <div className={`p-3 rounded-sm border transition-all duration-300 ${loadingProgress > 80 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {loadingProgress > 80 ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin border-t-orange-500" />
                )}
                <span className="text-xs font-medium text-gray-700">Compliance Validated</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/bcp"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create BCP Scenario</h1>
                <p className="text-xs text-gray-500 mt-0.5">Define a new business continuity scenario</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-gray-900 border-gray-900'
                        : isCurrent
                        ? 'bg-white border-gray-900'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={`h-5 w-5 ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`mt-2 text-[10px] font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Link to Business Impact Analysis</h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Select a BIA to auto-populate processes, assets, RTO/RPO/MTD, and linked Risk Assessments.
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800"
                      onMouseEnter={() => setShowDataSourceTooltip('bia-info')}
                      onMouseLeave={() => setShowDataSourceTooltip(null)}
                    >
                      <InformationCircleIcon className="h-4 w-4" />
                      How linking works
                    </button>
                    {showDataSourceTooltip === 'bia-info' && (
                      <div className="absolute right-0 top-6 z-10 w-72 p-3 bg-gray-900 text-white text-[10px] rounded-sm shadow-lg">
                        <p className="font-medium mb-1">Data Source: BIA Module</p>
                        <p className="mb-2">When you link a BIA, the following data is auto-populated:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li>All processes from the BIA</li>
                          <li>All IT assets from the BIA</li>
                          <li>All vendors from the BIA</li>
                          <li>RTO/RPO/MTD values</li>
                          <li>Linked risk assessments</li>
                        </ul>
                        <p className="mt-2 text-gray-300">You can add/remove items in Step 4.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BIA Selection */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-2">
                    Select BIA Record *
                  </label>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {mockBIARecords.map((bia) => (
                      <label
                        key={bia.id}
                        className={`block border rounded-sm p-3 cursor-pointer transition-all ${
                          formData.linkedBiaId === bia.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="linkedBia"
                            checked={formData.linkedBiaId === bia.id}
                            onChange={() => {
                              // Auto-populate processes, assets, and vendors from BIA
                              const linkedProcesses = bia.processes.map(p => ({
                                ...p,
                                source: `BIA: ${bia.biaName}`
                              }));
                              const linkedAssets = bia.assets.map(a => ({
                                ...a,
                                source: `BIA: ${bia.biaName}`
                              }));
                              const linkedVendors = bia.vendors.map(v => ({
                                ...v,
                                source: `BIA: ${bia.biaName}`
                              }));

                              setFormData({
                                ...formData,
                                linkedBiaId: bia.id,
                                linkedBiaName: bia.biaName,
                                biaRtoHours: bia.finalRtoHours,
                                biaRpoHours: bia.finalRpoHours,
                                biaMtdHours: bia.mtpdHours,
                                biaCriticality: bia.finalCriticality,
                                biaBusinessFunction: bia.department,
                                linkedProcesses,
                                linkedAssets,
                                linkedVendors,
                                linkedRiskAssessments: [{ id: bia.id, name: `${bia.biaName} Risk Assessment`, riskCount: bia.linkedRisks }]
                              });
                              setSelectedBia(bia);
                            }}
                            className="mt-0.5 h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-900">{bia.biaName}</p>
                              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                bia.finalCriticality === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {bia.finalCriticality}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">{bia.department} • Coordinator: {bia.biaCoordinator}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                              <span>RTO: {bia.finalRtoHours}h</span>
                              <span>RPO: {bia.finalRpoHours}h</span>
                              <span>MTPD: {bia.mtpdHours}h</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[10px]">
                              <span className="text-blue-600">{bia.processes.length} processes</span>
                              <span className="text-purple-600">{bia.assets.length} assets</span>
                              <span className="text-green-600">{bia.vendors.length} vendors</span>
                              <span className="text-orange-600">{bia.linkedRisks} risks</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Selected BIA Summary */}
                {selectedBia && (
                  <div className="border border-green-200 bg-green-50 rounded-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-green-900">✓ BIA Selected - Auto-populated Data</h3>
                      <span className="text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        Source: BIA Module
                      </span>
                    </div>

                    {/* Recovery Metrics */}
                    <div className="grid grid-cols-4 gap-3 text-xs mb-4">
                      <div className="bg-white rounded p-2 border border-green-100">
                        <p className="text-[10px] text-gray-500">RTO</p>
                        <p className="font-semibold">{selectedBia.finalRtoHours}h</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-green-100">
                        <p className="text-[10px] text-gray-500">RPO</p>
                        <p className="font-semibold">{selectedBia.finalRpoHours}h</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-green-100">
                        <p className="text-[10px] text-gray-500">MTPD</p>
                        <p className="font-semibold">{selectedBia.mtpdHours}h</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-green-100">
                        <p className="text-[10px] text-gray-500">Linked Risks</p>
                        <p className="font-semibold text-orange-600">{selectedBia.linkedRisks}</p>
                      </div>
                    </div>

                    {/* Auto-populated Resources */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Auto-populated Processes ({selectedBia.processes.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedBia.processes.map((proc: any) => (
                            <span key={proc.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-blue-200 rounded text-[10px] text-blue-700">
                              <BuildingOfficeIcon className="h-3 w-3" />
                              {proc.name}
                              <span className="text-gray-400">RTO:{proc.rto}h</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Auto-populated Assets ({selectedBia.assets.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedBia.assets.map((asset: any) => (
                            <span key={asset.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-purple-200 rounded text-[10px] text-purple-700">
                              <ServerIcon className="h-3 w-3" />
                              {asset.name}
                              <span className="text-gray-400">RTO:{asset.rto}h</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-1">Auto-populated Vendors ({selectedBia.vendors.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedBia.vendors.map((vendor: any) => (
                            <span key={vendor.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-green-200 rounded text-[10px] text-green-700">
                              <UserGroupIcon className="h-3 w-3" />
                              {vendor.name}
                              <span className="text-gray-400">{vendor.sla}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-green-700 mt-3 italic">
                      You can modify these selections in Step 4 (Link Resources)
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h2>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Scenario Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Cyberattack Response & Recovery"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Scenario Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Select type...</option>
                    <option value="Cyberattack">Cyberattack</option>
                    <option value="Power Outage">Power Outage</option>
                    <option value="Pandemic">Pandemic</option>
                    <option value="Supply Chain">Supply Chain Disruption</option>
                    <option value="Natural Disaster">Natural Disaster</option>
                    <option value="Data Breach">Data Breach</option>
                    <option value="System Failure">System Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the scenario and its potential impact..."
                    rows={4}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Test Objectives
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="What are the key objectives for testing this scenario?"
                    rows={3}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Classification</h2>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Severity Level *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Select severity...</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Criticality Score (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                    placeholder="Enter criticality score"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-medium text-gray-500 mb-1.5">
                    Regulatory Requirements
                  </label>
                  <select
                    value={formData.regulatory}
                    onChange={(e) => setFormData({ ...formData, regulatory: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Select regulatory framework...</option>
                    <option value="ISO 22301">ISO 22301 - Business Continuity</option>
                    <option value="NIST">NIST Cybersecurity Framework</option>
                    <option value="SOC 2">SOC 2 Compliance</option>
                    <option value="GDPR">GDPR - Data Protection</option>
                    <option value="PCI DSS">PCI DSS</option>
                    <option value="HIPAA">HIPAA</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Link Resources</h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Manage processes, assets, and vendors linked to this IRP. Items from BIA are pre-selected.
                    </p>
                  </div>
                  {/* Calculated Metrics Summary */}
                  {(formData.linkedProcesses.length > 0 || formData.linkedAssets.length > 0) && (
                    <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-sm px-3 py-2">
                      <div className="relative">
                        <button
                          type="button"
                          className="text-orange-600"
                          onMouseEnter={() => setShowDataSourceTooltip('calc-metrics')}
                          onMouseLeave={() => setShowDataSourceTooltip(null)}
                        >
                          <InformationCircleIcon className="h-4 w-4" />
                        </button>
                        {showDataSourceTooltip === 'calc-metrics' && (
                          <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-sm shadow-lg">
                            <p className="font-medium mb-1">Calculated Metrics</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              <li><strong>RTO</strong> = MIN of all linked RTOs</li>
                              <li><strong>RPO</strong> = MIN of all linked RPOs</li>
                              <li><strong>Criticality</strong> = MAX of all linked criticalities</li>
                            </ul>
                            <p className="mt-2 text-gray-300">Based on {formData.linkedProcesses.length} processes and {formData.linkedAssets.length} assets</p>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px]">
                        <span className="text-gray-600">Calculated: </span>
                        <span className="font-medium text-orange-700">RTO: {formData.calculatedRto}h</span>
                        <span className="mx-1 text-gray-400">|</span>
                        <span className="font-medium text-orange-700">RPO: {formData.calculatedRpo}h</span>
                        <span className="mx-1 text-gray-400">|</span>
                        <span className={`font-medium ${
                          formData.calculatedCriticality === 'Critical' ? 'text-red-600' :
                          formData.calculatedCriticality === 'High' ? 'text-orange-600' : 'text-yellow-600'
                        }`}>{formData.calculatedCriticality}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Linked Processes */}
                <div className="border border-gray-200 rounded-sm">
                  <div className="bg-blue-50 border-b border-blue-100 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Linked Processes ({formData.linkedProcesses.length})</span>
                    </div>
                    <span className="text-[10px] text-blue-600">Source: BIA Module + Manual Selection</span>
                  </div>
                  <div className="p-3">
                    {/* Currently linked processes */}
                    {formData.linkedProcesses.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Currently Linked</p>
                        <div className="space-y-1">
                          {formData.linkedProcesses.map((proc) => (
                            <div key={proc.id} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-900">{proc.name}</span>
                                <span className="text-[10px] text-gray-500">RTO: {proc.rto}h | RPO: {proc.rpo}h</span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                                  proc.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                                  proc.criticality === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{proc.criticality}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">{proc.source}</span>
                                <button
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData,
                                    linkedProcesses: formData.linkedProcesses.filter(p => p.id !== proc.id)
                                  })}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Add more processes */}
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Add Additional Processes</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {additionalProcesses
                          .filter(p => !formData.linkedProcesses.find(lp => lp.id === p.id))
                          .map((proc) => (
                            <label key={proc.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      linkedProcesses: [...formData.linkedProcesses, { ...proc, source: 'Manual Selection' }]
                                    });
                                  }
                                }}
                                className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-700">{proc.name}</span>
                              <span className="text-[10px] text-gray-400">RTO: {proc.rto}h | {proc.department}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Assets */}
                <div className="border border-gray-200 rounded-sm">
                  <div className="bg-purple-50 border-b border-purple-100 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-900">Linked IT Assets ({formData.linkedAssets.length})</span>
                    </div>
                    <span className="text-[10px] text-purple-600">Source: BIA Module + CMDB</span>
                  </div>
                  <div className="p-3">
                    {/* Currently linked assets */}
                    {formData.linkedAssets.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Currently Linked</p>
                        <div className="space-y-1">
                          {formData.linkedAssets.map((asset) => (
                            <div key={asset.id} className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <CpuChipIcon className="h-3 w-3 text-purple-500" />
                                <span className="text-xs font-medium text-gray-900">{asset.name}</span>
                                <span className="text-[10px] text-gray-500">{asset.type} | RTO: {asset.rto}h</span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                                  asset.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                                  asset.criticality === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{asset.criticality}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">{asset.source}</span>
                                <button
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData,
                                    linkedAssets: formData.linkedAssets.filter(a => a.id !== asset.id)
                                  })}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Add more assets */}
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Add Additional Assets</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {additionalAssets
                          .filter(a => !formData.linkedAssets.find(la => la.id === a.id))
                          .map((asset) => (
                            <label key={asset.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      linkedAssets: [...formData.linkedAssets, { ...asset, source: 'Manual Selection' }]
                                    });
                                  }
                                }}
                                className="h-3 w-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-xs text-gray-700">{asset.name}</span>
                              <span className="text-[10px] text-gray-400">{asset.type} | RTO: {asset.rto}h</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Vendors */}
                <div className="border border-gray-200 rounded-sm">
                  <div className="bg-green-50 border-b border-green-100 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-900">Linked Vendors ({formData.linkedVendors.length})</span>
                    </div>
                    <span className="text-[10px] text-green-600">Source: BIA Module + Vendor Registry</span>
                  </div>
                  <div className="p-3">
                    {/* Currently linked vendors */}
                    {formData.linkedVendors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Currently Linked</p>
                        <div className="space-y-1">
                          {formData.linkedVendors.map((vendor) => (
                            <div key={vendor.id} className="flex items-center justify-between bg-green-50 border border-green-100 rounded px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-900">{vendor.name}</span>
                                <span className="text-[10px] text-gray-500">{vendor.type} | {vendor.sla}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded">{vendor.source}</span>
                                <button
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData,
                                    linkedVendors: formData.linkedVendors.filter(v => v.id !== vendor.id)
                                  })}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Add more vendors */}
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500 mb-2">Add Additional Vendors</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {additionalVendors
                          .filter(v => !formData.linkedVendors.find(lv => lv.id === v.id))
                          .map((vendor) => (
                            <label key={vendor.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      linkedVendors: [...formData.linkedVendors, { ...vendor, source: 'Manual Selection' }]
                                    });
                                  }
                                }}
                                className="h-3 w-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="text-xs text-gray-700">{vendor.name}</span>
                              <span className="text-[10px] text-gray-400">{vendor.type} | {vendor.sla}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Playbook Selection</h2>
                <p className="text-xs text-gray-600 mb-4">
                  Select a playbook template that defines the response procedures for this scenario.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'tabletop', name: 'Tabletop Exercise', description: 'Discussion-based scenario walkthrough with key stakeholders' },
                    { id: 'simulation', name: 'Full Simulation', description: 'Comprehensive end-to-end test with all systems and teams' },
                    { id: 'walkthrough', name: 'Walkthrough Test', description: 'Step-by-step review of procedures without full activation' },
                    { id: 'functional', name: 'Functional Test', description: 'Test specific functions or components in isolation' }
                  ].map((playbook) => (
                    <label
                      key={playbook.id}
                      className={`block border rounded-sm p-3 cursor-pointer transition-all ${
                        formData.playbook === playbook.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="playbook"
                          value={playbook.id}
                          checked={formData.playbook === playbook.id}
                          onChange={(e) => setFormData({ ...formData, playbook: e.target.value })}
                          className="mt-0.5 h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{playbook.name}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{playbook.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Review & Submit</h2>

                {/* Calculated Metrics Banner */}
                {(formData.linkedProcesses.length > 0 || formData.linkedAssets.length > 0) && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-orange-900">Calculated IRP Metrics</h3>
                      <div className="flex items-center gap-1 text-[10px] text-orange-600">
                        <InformationCircleIcon className="h-3 w-3" />
                        <span>Auto-calculated from linked resources</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded p-3 border border-orange-100">
                        <p className="text-[10px] text-gray-500 mb-1">Recovery Time Objective (RTO)</p>
                        <p className="text-lg font-bold text-orange-600">{formData.calculatedRto}h</p>
                        <p className="text-[9px] text-gray-400 mt-1">= MIN of {formData.linkedProcesses.length + formData.linkedAssets.length} linked items</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-orange-100">
                        <p className="text-[10px] text-gray-500 mb-1">Recovery Point Objective (RPO)</p>
                        <p className="text-lg font-bold text-orange-600">{formData.calculatedRpo}h</p>
                        <p className="text-[9px] text-gray-400 mt-1">= MIN of {formData.linkedProcesses.length + formData.linkedAssets.length} linked items</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-orange-100">
                        <p className="text-[10px] text-gray-500 mb-1">Criticality Level</p>
                        <p className={`text-lg font-bold ${
                          formData.calculatedCriticality === 'Critical' ? 'text-red-600' :
                          formData.calculatedCriticality === 'High' ? 'text-orange-600' : 'text-yellow-600'
                        }`}>{formData.calculatedCriticality}</p>
                        <p className="text-[9px] text-gray-400 mt-1">= MAX of linked criticalities</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column - Basic Info */}
                  <div className="border border-gray-200 rounded-sm p-4 bg-gray-50 space-y-3">
                    <h3 className="text-xs font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
                    {/* Linked BIA */}
                    {formData.linkedBiaId && (
                      <div className="bg-blue-50 border border-blue-100 rounded p-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase font-medium text-blue-600">Linked BIA</p>
                          <span className="text-[9px] text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">Source: BIA Module</span>
                        </div>
                        <p className="text-xs text-gray-900 mt-0.5 font-medium">{formData.linkedBiaName}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                          <span>RTO: {formData.biaRtoHours}h</span>
                          <span>RPO: {formData.biaRpoHours}h</span>
                          <span>MTPD: {formData.biaMtdHours}h</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500">Scenario Name</p>
                      <p className="text-xs text-gray-900 mt-0.5">{formData.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500">Type</p>
                      <p className="text-xs text-gray-900 mt-0.5">{formData.type || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-500">Description</p>
                      <p className="text-xs text-gray-900 mt-0.5">{formData.description || 'Not specified'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500">Severity</p>
                        <p className="text-xs text-gray-900 mt-0.5">{formData.severity || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-medium text-gray-500">Playbook</p>
                        <p className="text-xs text-gray-900 mt-0.5">{formData.playbook || 'Not selected'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Linked Resources */}
                  <div className="border border-gray-200 rounded-sm p-4 bg-gray-50 space-y-3">
                    <h3 className="text-xs font-medium text-gray-900 border-b border-gray-200 pb-2">Linked Resources</h3>

                    {/* Processes */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase font-medium text-blue-600">Processes ({formData.linkedProcesses.length})</p>
                        <span className="text-[9px] text-gray-400">
                          {formData.linkedProcesses.filter(p => p.source.includes('BIA')).length} from BIA, {formData.linkedProcesses.filter(p => p.source === 'Manual Selection').length} manual
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.linkedProcesses.slice(0, 4).map(p => (
                          <span key={p.id} className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{p.name}</span>
                        ))}
                        {formData.linkedProcesses.length > 4 && (
                          <span className="text-[10px] text-gray-500">+{formData.linkedProcesses.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* Assets */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase font-medium text-purple-600">IT Assets ({formData.linkedAssets.length})</p>
                        <span className="text-[9px] text-gray-400">
                          {formData.linkedAssets.filter(a => a.source.includes('BIA')).length} from BIA, {formData.linkedAssets.filter(a => a.source === 'Manual Selection').length} manual
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.linkedAssets.slice(0, 4).map(a => (
                          <span key={a.id} className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{a.name}</span>
                        ))}
                        {formData.linkedAssets.length > 4 && (
                          <span className="text-[10px] text-gray-500">+{formData.linkedAssets.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* Vendors */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase font-medium text-green-600">Vendors ({formData.linkedVendors.length})</p>
                        <span className="text-[9px] text-gray-400">
                          {formData.linkedVendors.filter(v => v.source.includes('BIA')).length} from BIA, {formData.linkedVendors.filter(v => v.source === 'Manual Selection').length} manual
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.linkedVendors.slice(0, 4).map(v => (
                          <span key={v.id} className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{v.name}</span>
                        ))}
                        {formData.linkedVendors.length > 4 && (
                          <span className="text-[10px] text-gray-500">+{formData.linkedVendors.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* Linked Risks */}
                    {formData.linkedRiskAssessments && formData.linkedRiskAssessments.length > 0 && (
                      <div className="bg-orange-50 border border-orange-100 rounded p-2">
                        <p className="text-[10px] uppercase font-medium text-orange-600">Linked Risk Assessments</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                          <span className="text-xs text-gray-900">{formData.linkedRiskAssessments[0].riskCount} risks identified</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition-colors"
              >
                Submit Scenario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

