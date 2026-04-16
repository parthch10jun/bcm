'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  XMarkIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type Step = 'basic' | 'scope' | 'dependencies' | 'team' | 'response' | 'review';

interface CrisisPlanData {
  // Basic Info
  planName: string;
  scenarioType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  owner: string;
  
  // Scope
  affectedLocations: string[];
  affectedDepartments: string[];
  affectedProcesses: string[];
  
  // Dependencies (BETH3V)
  buildings: string[];
  equipment: string[];
  technology: string[];
  humanResources: string[];
  thirdPartyVendors: string[];
  vitalRecords: string[];
  
  // Team
  crisisTeam: Array<{
    role: string;
    primary: string;
    alternate: string;
    contact: string;
  }>;
  
  // Response
  activationCriteria: string[];
  responsePhases: Array<{
    name: string;
    duration: string;
    actions: string[];
  }>;
  callTreeId?: string;
}

const scenarioTypes = [
  { value: 'natural_disaster', label: 'Natural Disaster', icon: ExclamationTriangleIcon },
  { value: 'cyber_attack', label: 'Cyber Attack', icon: ShieldExclamationIcon },
  { value: 'facility_damage', label: 'Facility Damage', icon: BuildingOfficeIcon },
  { value: 'pandemic', label: 'Pandemic / Health Crisis', icon: UsersIcon },
  { value: 'supply_chain', label: 'Supply Chain Disruption', icon: MapPinIcon },
  { value: 'data_breach', label: 'Data Breach', icon: DocumentTextIcon },
  { value: 'power_outage', label: 'Power / Utility Outage', icon: ChartBarIcon },
  { value: 'custom', label: 'Custom Scenario', icon: DocumentTextIcon }
];

// Map scenario IDs to readable labels
const scenarioIdToLabel: Record<string, string> = {
  'location_failure': 'facility_damage',
  'building_failure': 'facility_damage',
  'equipment_failure': 'power_outage',
  'technology_failure': 'cyber_attack',
  'people_unavailable': 'pandemic',
  'vendor_failure': 'supply_chain',
  'data_loss': 'data_breach'
};

// Mock Call Tree Data with team members
const mockCallTrees: Record<string, Array<{ role: string; primary: string; alternate: string; contact: string }>> = {
  'CT-001': [
    { role: 'Crisis Commander', primary: 'Mohammed Al-Qahtani', alternate: 'Sara Al-Mutairi', contact: '+966 50 123 4567' },
    { role: 'Operations Lead', primary: 'Abdullah Al-Dosari', alternate: 'Noura Al-Harbi', contact: '+966 50 234 5678' },
    { role: 'IT & SCADA Lead', primary: 'Khalid Al-Shehri', alternate: 'Maha Al-Otaibi', contact: '+966 50 345 6789' },
    { role: 'Communications Lead', primary: 'Fahad Al-Ghamdi', alternate: 'Lama Al-Zahrani', contact: '+966 50 456 7890' },
    { role: 'Water Quality Lead', primary: 'Saleh Al-Malki', alternate: 'Reem Al-Juhani', contact: '+966 50 567 8901' },
    { role: 'Engineering Lead', primary: 'Omar Al-Rashid', alternate: 'Huda Al-Saud', contact: '+966 50 678 9012' }
  ],
  'CT-002': [
    { role: 'Crisis Commander', primary: 'Ahmed Al-Rashid', alternate: 'Fatima Al-Zahrani', contact: '+966 50 111 2222' },
    { role: 'Operations Lead', primary: 'Yousef Al-Harbi', alternate: 'Aisha Al-Qahtani', contact: '+966 50 222 3333' },
    { role: 'IT & SCADA Lead', primary: 'Faisal Al-Mutairi', alternate: 'Nora Al-Shehri', contact: '+966 50 333 4444' },
    { role: 'Communications Lead', primary: 'Saud Al-Dosari', alternate: 'Layla Al-Ghamdi', contact: '+966 50 444 5555' },
    { role: 'Water Quality Lead', primary: 'Tariq Al-Otaibi', alternate: 'Mariam Al-Malki', contact: '+966 50 555 6666' },
    { role: 'Engineering Lead', primary: 'Nasser Al-Juhani', alternate: 'Hanan Al-Rashid', contact: '+966 50 666 7777' }
  ],
  'CT-003': [
    { role: 'Crisis Commander', primary: 'Ibrahim Al-Saud', alternate: 'Amira Al-Harbi', contact: '+966 50 777 8888' },
    { role: 'Operations Lead', primary: 'Majed Al-Zahrani', alternate: 'Dina Al-Qahtani', contact: '+966 50 888 9999' },
    { role: 'IT & SCADA Lead', primary: 'Waleed Al-Shehri', alternate: 'Rana Al-Mutairi', contact: '+966 50 999 0000' },
    { role: 'Communications Lead', primary: 'Bandar Al-Ghamdi', alternate: 'Joud Al-Dosari', contact: '+966 50 101 1111' },
    { role: 'Water Quality Lead', primary: 'Saad Al-Malki', alternate: 'Lina Al-Otaibi', contact: '+966 50 202 2222' },
    { role: 'Engineering Lead', primary: 'Turki Al-Rashid', alternate: 'Mona Al-Juhani', contact: '+966 50 303 3333' }
  ],
  'CT-004': [
    { role: 'Crisis Commander', primary: 'Mansour Al-Harbi', alternate: 'Basma Al-Zahrani', contact: '+966 50 404 4444' },
    { role: 'Operations Lead', primary: 'Rakan Al-Qahtani', alternate: 'Wafa Al-Shehri', contact: '+966 50 505 5555' },
    { role: 'IT & SCADA Lead', primary: 'Ziyad Al-Mutairi', alternate: 'Abeer Al-Ghamdi', contact: '+966 50 606 6666' },
    { role: 'Communications Lead', primary: 'Adel Al-Dosari', alternate: 'Najla Al-Malki', contact: '+966 50 707 7777' },
    { role: 'Water Quality Lead', primary: 'Hamad Al-Otaibi', alternate: 'Ghada Al-Rashid', contact: '+966 50 808 8888' },
    { role: 'Engineering Lead', primary: 'Sultan Al-Juhani', alternate: 'Dalal Al-Saud', contact: '+966 50 909 9999' }
  ]
};

function NewCrisisPlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [prefillApplied, setPrefillApplied] = useState(false);
  const [selectedCallTree, setSelectedCallTree] = useState<string>('');
  const [formData, setFormData] = useState<CrisisPlanData>({
    planName: '',
    scenarioType: '',
    severity: 'High',
    description: '',
    owner: '',
    affectedLocations: [],
    affectedDepartments: [],
    affectedProcesses: [],
    buildings: [],
    equipment: [],
    technology: [],
    humanResources: [],
    thirdPartyVendors: [],
    vitalRecords: [],
    crisisTeam: [],
    activationCriteria: [],
    responsePhases: [],
    callTreeId: ''
  });

  // Handler for call tree selection
  const handleCallTreeChange = (callTreeId: string) => {
    setSelectedCallTree(callTreeId);
    setFormData(prev => ({ ...prev, callTreeId }));

    if (callTreeId && mockCallTrees[callTreeId]) {
      // Auto-populate crisis team from selected call tree
      setFormData(prev => ({
        ...prev,
        crisisTeam: mockCallTrees[callTreeId]
      }));
    } else {
      // Clear team if no call tree selected
      setFormData(prev => ({
        ...prev,
        crisisTeam: []
      }));
    }
  };

  // Check for prefill data from dependency analysis
  useEffect(() => {
    if (prefillApplied) return;

    const isFromAnalysis = searchParams.get('from') === 'analysis';
    if (!isFromAnalysis) return;

    const prefillData = sessionStorage.getItem('crisisPlanPrefill');
    if (prefillData) {
      try {
        const data = JSON.parse(prefillData);

        // Map the scenario type from analysis to wizard format
        const mappedScenarioType = scenarioIdToLabel[data.scenarioType] || 'custom';

        // Generate a plan name based on scenario
        const scenarioLabel = scenarioTypes.find(s => s.value === mappedScenarioType)?.label || 'Crisis';
        const enablerName = data.affectedLocations?.[0] || data.affectedBuildings?.[0] || 'Unknown';
        const planName = `${scenarioLabel} - ${enablerName}`;

        // Build description from impact data
        const description = `Auto-generated crisis plan from dependency analysis.
Failure Type: ${data.enablerType?.charAt(0).toUpperCase() + data.enablerType?.slice(1) || 'Unknown'}
Impact: ${data.metrics?.totalProcesses || 0} processes affected, ${data.metrics?.tier1Affected || 0} Tier 1 processes
Min RTO: ${data.metrics?.minRTO || 0} minutes
People Affected: ${data.metrics?.totalPeople || 0}`;

        // Update form data with prefilled values
        setFormData(prev => ({
          ...prev,
          planName: planName,
          scenarioType: mappedScenarioType,
          severity: (data.metrics?.tier1Affected > 0 || data.metrics?.criticalProcesses > 0) ? 'Critical' : 'High',
          description: description,
          affectedLocations: data.affectedLocations || [],
          affectedProcesses: data.affectedProcesses || [],
          buildings: data.affectedBuildings || [],
          equipment: data.affectedEquipment || [],
          technology: data.affectedTechnology || [],
          humanResources: data.affectedPeople || [],
          thirdPartyVendors: data.affectedVendors || [],
          vitalRecords: data.affectedVitalRecords || []
        }));

        // Clear sessionStorage after reading
        sessionStorage.removeItem('crisisPlanPrefill');
        setPrefillApplied(true);
      } catch (e) {
        console.error('Error parsing prefill data:', e);
      }
    }
  }, [searchParams, prefillApplied]);

  const steps: Array<{ id: Step; label: string; description: string }> = [
    { id: 'basic', label: 'Basic Information', description: 'Plan details and scenario' },
    { id: 'scope', label: 'Crisis Scope', description: 'Affected areas and processes' },
    { id: 'dependencies', label: 'BETH3V Dependencies', description: 'Resource dependencies' },
    { id: 'team', label: 'Crisis Team', description: 'Team structure and roles' },
    { id: 'response', label: 'Response Plan', description: 'Activation and procedures' },
    { id: 'review', label: 'Review & Submit', description: 'Final review' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting crisis plan:', formData);
    router.push('/crisis-plans');
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
              Create Crisis Management Plan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Define crisis scenario, scope, dependencies, and response procedures
            </p>
          </div>
          <button
            onClick={() => router.push('/crisis-plans')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentStepIndex ? 'bg-green-600 text-white' :
                    index === currentStepIndex ? 'bg-red-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStepIndex ? <CheckIcon className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${index === currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-full mx-2 ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
          {/* Step 1: Basic Information */}
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Basic Information</h2>
                <p className="text-xs text-gray-500 mb-6">Define the crisis scenario and basic plan details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    placeholder="e.g., Data Center Outage Response"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Scenario Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {scenarioTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, scenarioType: type.value })}
                          className={`p-3 border rounded-sm text-left transition-all ${
                            formData.scenarioType === type.value
                              ? 'border-red-600 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5 mb-2" />
                          <p className="text-xs font-medium">{type.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Severity Level *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Plan Owner *
                  </label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the crisis scenario and its potential impact..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Crisis Scope */}
          {currentStep === 'scope' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Crisis Scope</h2>
                <p className="text-xs text-gray-500 mb-6">Define which locations, departments, and processes are affected</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Affected Locations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Riyadh Operations Center', 'Jeddah Water Treatment Plant', 'Dammam Distribution Hub', 'Makkah Regional Office', 'Madinah Treatment Facility', 'Eastern Province Hub'].map((loc) => (
                      <label key={loc} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.affectedLocations.includes(loc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, affectedLocations: [...formData.affectedLocations, loc] });
                            } else {
                              setFormData({ ...formData, affectedLocations: formData.affectedLocations.filter(l => l !== loc) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Affected Departments
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Operations Control', 'Water Quality', 'Distribution Management', 'Customer Service', 'IT & SCADA', 'Maintenance & Engineering'].map((dept) => (
                      <label key={dept} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.affectedDepartments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, affectedDepartments: [...formData.affectedDepartments, dept] });
                            } else {
                              setFormData({ ...formData, affectedDepartments: formData.affectedDepartments.filter(d => d !== dept) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-2">
                    Affected Critical Processes
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Water Distribution Control', 'Water Quality Testing', 'Customer Billing', 'Emergency Response', 'SCADA Monitoring', 'Treatment Plant Operations'].map((proc) => (
                      <label key={proc} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.affectedProcesses.includes(proc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, affectedProcesses: [...formData.affectedProcesses, proc] });
                            } else {
                              setFormData({ ...formData, affectedProcesses: formData.affectedProcesses.filter(p => p !== proc) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{proc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: BETH3V Dependencies */}
          {currentStep === 'dependencies' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">BETH3V Dependencies</h2>
                <p className="text-xs text-gray-500 mb-6">Identify which resources and enablers are affected by this crisis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buildings */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Buildings ({formData.buildings.length})
                  </h3>
                  <div className="space-y-2">
                    {['SCADA Control Center', 'Customer Service Building', 'Main Treatment Facility', 'Pumping Station'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.buildings.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, buildings: [...formData.buildings, item] });
                            } else {
                              setFormData({ ...formData, buildings: formData.buildings.filter(b => b !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Equipment ({formData.equipment.length})
                  </h3>
                  <div className="space-y-2">
                    {['Water Filtration Systems', 'Chlorination Equipment', 'Distribution Pumps', 'SCADA Servers'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.equipment.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, equipment: [...formData.equipment, item] });
                            } else {
                              setFormData({ ...formData, equipment: formData.equipment.filter(e => e !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Technology */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Technology / IT Systems ({formData.technology.length})
                  </h3>
                  <div className="space-y-2">
                    {['SCADA Control System', 'Customer Billing Platform', 'Water Quality Monitoring', 'Distribution Management System'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.technology.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, technology: [...formData.technology, item] });
                            } else {
                              setFormData({ ...formData, technology: formData.technology.filter(t => t !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Human Resources */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Human Resources ({formData.humanResources.length})
                  </h3>
                  <div className="space-y-2">
                    {['Control Room Operators (35)', 'IT Operations Team (20)', 'Plant Operators (45)', 'Field Technicians (25)'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.humanResources.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, humanResources: [...formData.humanResources, item] });
                            } else {
                              setFormData({ ...formData, humanResources: formData.humanResources.filter(h => h !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Third-party Vendors */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Third-party Vendors ({formData.thirdPartyVendors.length})
                  </h3>
                  <div className="space-y-2">
                    {['Chemical Supplier (Chlorine)', 'Equipment Maintenance Contractor', 'Lab Testing Services', 'IT Support Vendor'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.thirdPartyVendors.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, thirdPartyVendors: [...formData.thirdPartyVendors, item] });
                            } else {
                              setFormData({ ...formData, thirdPartyVendors: formData.thirdPartyVendors.filter(v => v !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Vital Records */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">
                    Vital Records ({formData.vitalRecords.length})
                  </h3>
                  <div className="space-y-2">
                    {['Water Quality Reports', 'Customer Database', 'Regulatory Compliance Documents', 'Asset Maintenance Logs'].map((item) => (
                      <label key={item} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.vitalRecords.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, vitalRecords: [...formData.vitalRecords, item] });
                            } else {
                              setFormData({ ...formData, vitalRecords: formData.vitalRecords.filter(r => r !== item) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* BETH3V Summary */}
              <div className="border border-gray-200 rounded-sm p-4 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-900 mb-3">BETH3V Summary</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.buildings.length}</p>
                    <p className="text-[10px] text-gray-600">Buildings</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.equipment.length}</p>
                    <p className="text-[10px] text-gray-600">Equipment</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.technology.length}</p>
                    <p className="text-[10px] text-gray-600">Technology</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.humanResources.length}</p>
                    <p className="text-[10px] text-gray-600">People</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.thirdPartyVendors.length}</p>
                    <p className="text-[10px] text-gray-600">Vendors</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-sm bg-white">
                    <p className="text-lg font-bold text-gray-900">{formData.vitalRecords.length}</p>
                    <p className="text-[10px] text-gray-600">Records</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Crisis Team */}
          {currentStep === 'team' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Crisis Management Team</h2>
                <p className="text-xs text-gray-500 mb-6">Define team structure with primary and alternate contacts</p>
              </div>

              {/* Call Tree Selection - Moved to top */}
              <div className="border border-gray-200 rounded-sm p-4 bg-blue-50">
                <label className="block text-[10px] font-medium text-gray-700 mb-2">
                  Link to Call Tree (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">Select a call tree to auto-populate team members</p>
                <select
                  value={selectedCallTree}
                  onChange={(e) => handleCallTreeChange(e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                >
                  <option value="">Select existing call tree...</option>
                  <option value="CT-001">Water Emergency Response Tree</option>
                  <option value="CT-002">IT & SCADA Incident Tree</option>
                  <option value="CT-003">Treatment Plant Crisis Tree</option>
                  <option value="CT-004">Distribution Network Tree</option>
                </select>
                {selectedCallTree && (
                  <p className="text-xs text-green-600 mt-2">✓ Team members auto-populated from call tree</p>
                )}
              </div>

              <div className="space-y-4">
                {['Crisis Commander', 'Operations Lead', 'IT & SCADA Lead', 'Communications Lead', 'Water Quality Lead', 'Engineering Lead'].map((role, index) => {
                  const teamMember = formData.crisisTeam.find(member => member.role === role);
                  return (
                    <div key={role} className="border border-gray-200 rounded-sm p-4">
                      <h3 className="text-xs font-bold text-gray-900 mb-3">{role}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Primary Contact</label>
                          <input
                            type="text"
                            value={teamMember?.primary || ''}
                            onChange={(e) => {
                              const updatedTeam = [...formData.crisisTeam];
                              const memberIndex = updatedTeam.findIndex(m => m.role === role);
                              if (memberIndex >= 0) {
                                updatedTeam[memberIndex].primary = e.target.value;
                              } else {
                                updatedTeam.push({ role, primary: e.target.value, alternate: '', contact: '' });
                              }
                              setFormData({ ...formData, crisisTeam: updatedTeam });
                            }}
                            placeholder="e.g., Ahmed Al-Rashid"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Alternate Contact</label>
                          <input
                            type="text"
                            value={teamMember?.alternate || ''}
                            onChange={(e) => {
                              const updatedTeam = [...formData.crisisTeam];
                              const memberIndex = updatedTeam.findIndex(m => m.role === role);
                              if (memberIndex >= 0) {
                                updatedTeam[memberIndex].alternate = e.target.value;
                              } else {
                                updatedTeam.push({ role, primary: '', alternate: e.target.value, contact: '' });
                              }
                              setFormData({ ...formData, crisisTeam: updatedTeam });
                            }}
                            placeholder="e.g., Fatima Al-Zahrani"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Contact Number</label>
                          <input
                            type="tel"
                            value={teamMember?.contact || ''}
                            onChange={(e) => {
                              const updatedTeam = [...formData.crisisTeam];
                              const memberIndex = updatedTeam.findIndex(m => m.role === role);
                              if (memberIndex >= 0) {
                                updatedTeam[memberIndex].contact = e.target.value;
                              } else {
                                updatedTeam.push({ role, primary: '', alternate: '', contact: e.target.value });
                              }
                              setFormData({ ...formData, crisisTeam: updatedTeam });
                            }}
                            placeholder="+966 XX XXX XXXX"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workforce Requirements Suggestions */}
              <div className="border border-gray-200 rounded-sm p-4 bg-yellow-50">
                <h3 className="text-xs font-bold text-gray-900 mb-3">💡 Workforce Requirements Suggestions</h3>
                <p className="text-xs text-gray-600 mb-3">Based on your crisis scenario, consider these workforce requirements:</p>
                <div className="space-y-2">
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-xs font-medium text-gray-900 mb-1">Core Crisis Team (6-8 people)</p>
                    <p className="text-xs text-gray-600">Crisis Commander, Operations Lead, IT & SCADA Lead, Communications Lead, Water Quality Lead, Engineering Lead</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-xs font-medium text-gray-900 mb-1">Extended Response Team (15-20 people)</p>
                    <p className="text-xs text-gray-600">Field technicians, plant operators, control room staff, customer service representatives, regulatory liaison officers</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-xs font-medium text-gray-900 mb-1">Support Personnel (10-15 people)</p>
                    <p className="text-xs text-gray-600">Administrative support, logistics coordinators, documentation specialists, media relations team</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-xs font-medium text-gray-900 mb-1">External Stakeholders (5-10 contacts)</p>
                    <p className="text-xs text-gray-600">Ministry of Environment, Water and Agriculture, local authorities, emergency services, key vendors, executive leadership</p>
                  </div>
                </div>
              </div>

              {/* Escalation & De-escalation Procedures */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3">📊 Escalation & De-escalation Procedures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Escalation */}
                  <div className="border border-red-200 rounded-sm p-3 bg-red-50">
                    <h4 className="text-xs font-bold text-red-900 mb-2">⬆️ Escalation Triggers</h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>Crisis severity increases (Medium → High → Critical)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>Multiple locations affected (expand from 1 to 3+ sites)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>RTO/MTD thresholds exceeded for Tier 1 processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>Public safety risk or regulatory non-compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>Media attention or social media escalation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>Initial response actions ineffective after 2 hours</span>
                      </li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs font-medium text-red-900 mb-1">Escalation Actions:</p>
                      <p className="text-xs text-gray-700">→ Notify CEO/Executive Leadership</p>
                      <p className="text-xs text-gray-700">→ Activate extended response team</p>
                      <p className="text-xs text-gray-700">→ Engage external crisis consultants</p>
                      <p className="text-xs text-gray-700">→ Notify government authorities</p>
                    </div>
                  </div>

                  {/* De-escalation */}
                  <div className="border border-green-200 rounded-sm p-3 bg-green-50">
                    <h4 className="text-xs font-bold text-green-900 mb-2">⬇️ De-escalation Criteria</h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Immediate threat contained and stabilized</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Critical processes restored within RTO targets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Water quality parameters return to normal levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>No new incidents or complications for 4+ hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Regulatory authorities confirm compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Public communications successfully managed</span>
                      </li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs font-medium text-green-900 mb-1">De-escalation Actions:</p>
                      <p className="text-xs text-gray-700">→ Stand down extended response team</p>
                      <p className="text-xs text-gray-700">→ Transition to recovery operations</p>
                      <p className="text-xs text-gray-700">→ Begin post-incident review process</p>
                      <p className="text-xs text-gray-700">→ Update stakeholders on resolution</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Tree Notification Recommendations */}
              <div className="border border-gray-200 rounded-sm p-4 bg-purple-50">
                <h3 className="text-xs font-bold text-gray-900 mb-3">📞 Call Tree Notification Recommendations</h3>
                <p className="text-xs text-gray-600 mb-3">Suggested notification sequence based on crisis severity:</p>

                <div className="space-y-3">
                  {/* Tier 1 - Immediate */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-sm">TIER 1</span>
                      <span className="text-xs font-bold text-gray-900">Immediate Notification (0-5 min)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-gray-900">Internal:</p>
                        <p className="text-gray-600">• Crisis Commander</p>
                        <p className="text-gray-600">• Operations Lead</p>
                        <p className="text-gray-600">• On-duty Control Room Supervisor</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">External:</p>
                        <p className="text-gray-600">• Emergency Services (if safety risk)</p>
                        <p className="text-gray-600">• Local Civil Defense</p>
                      </div>
                    </div>
                  </div>

                  {/* Tier 2 - Priority */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-bold rounded-sm">TIER 2</span>
                      <span className="text-xs font-bold text-gray-900">Priority Notification (5-15 min)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-gray-900">Internal:</p>
                        <p className="text-gray-600">• IT & SCADA Lead</p>
                        <p className="text-gray-600">• Water Quality Lead</p>
                        <p className="text-gray-600">• Engineering Lead</p>
                        <p className="text-gray-600">• Communications Lead</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">External:</p>
                        <p className="text-gray-600">• Ministry of Environment, Water & Agriculture</p>
                        <p className="text-gray-600">• Regional Health Authority</p>
                        <p className="text-gray-600">• Critical Vendors (chemicals, equipment)</p>
                      </div>
                    </div>
                  </div>

                  {/* Tier 3 - Standard */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs font-bold rounded-sm">TIER 3</span>
                      <span className="text-xs font-bold text-gray-900">Standard Notification (15-30 min)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-gray-900">Internal:</p>
                        <p className="text-gray-600">• Department Heads (affected areas)</p>
                        <p className="text-gray-600">• HR & Admin Support</p>
                        <p className="text-gray-600">• Finance/Procurement (if needed)</p>
                        <p className="text-gray-600">• Legal/Compliance Team</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">External:</p>
                        <p className="text-gray-600">• Local Municipality Officials</p>
                        <p className="text-gray-600">• Insurance Provider</p>
                        <p className="text-gray-600">• Support Contractors</p>
                      </div>
                    </div>
                  </div>

                  {/* Tier 4 - Executive */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-sm">TIER 4</span>
                      <span className="text-xs font-bold text-gray-900">Executive Notification (30-60 min or upon escalation)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-gray-900">Internal:</p>
                        <p className="text-gray-600">• CEO / Managing Director</p>
                        <p className="text-gray-600">• Board of Directors (if critical)</p>
                        <p className="text-gray-600">• All Department Heads</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">External:</p>
                        <p className="text-gray-600">• Media Relations (if public)</p>
                        <p className="text-gray-600">• Government Affairs Office</p>
                        <p className="text-gray-600">• Industry Associations</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white border border-gray-200 rounded-sm">
                  <p className="text-xs font-medium text-gray-900 mb-1">📱 Notification Methods (in order of priority):</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <p>1. Direct phone call (primary contact)</p>
                    <p>2. SMS alert to mobile</p>
                    <p>3. Email notification</p>
                    <p>4. WhatsApp/Teams message</p>
                    <p>5. Automated call tree system</p>
                    <p>6. Backup contact (if no response in 5 min)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Response Plan */}
          {currentStep === 'response' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Response Plan</h2>
                <p className="text-xs text-gray-500 mb-6">Define activation criteria and response procedures</p>
              </div>

              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-xs font-bold text-gray-900 mb-2">Activation Criteria</h3>
                <p className="text-xs text-gray-500 mb-3">Select conditions that trigger this crisis plan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Water contamination detected in distribution network',
                    'Treatment plant failure affecting >50% capacity',
                    'SCADA system cyber attack or compromise',
                    'Major pipeline rupture or infrastructure damage',
                    'Prolonged power outage (>4 hours) at critical facilities',
                    'Chemical supply disruption (chlorine shortage)',
                    'Natural disaster impacting water facilities',
                    'Regulatory non-compliance requiring immediate action'
                  ].map((criteria, idx) => (
                    <label key={criteria} className="flex items-start gap-2 p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.activationCriteria.includes(criteria)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, activationCriteria: [...formData.activationCriteria, criteria] });
                          } else {
                            setFormData({ ...formData, activationCriteria: formData.activationCriteria.filter(c => c !== criteria) });
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5"
                      />
                      <span className="text-xs text-gray-700">{criteria}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-3">Response Phases Timeline</h3>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Detection & Assessment',
                        duration: '0-15 min',
                        actions: [
                          'Confirm water quality incident or facility failure',
                          'Notify Crisis Commander and Operations Lead',
                          'Activate crisis management team',
                          'Establish emergency communication channels'
                        ]
                      },
                      {
                        name: 'Immediate Response',
                        duration: '15 min - 1 hour',
                        actions: [
                          'Implement water distribution containment measures',
                          'Activate backup treatment processes or emergency tankers',
                          'Notify regulatory authorities (Ministry of Environment, Water and Agriculture)',
                          'Set up crisis command center at Riyadh Operations'
                        ]
                      },
                      {
                        name: 'Stabilization',
                        duration: '1-6 hours',
                        actions: [
                          'Execute water quality restoration procedures',
                          'Monitor SCADA systems and distribution network',
                          'Provide public updates via media and customer service',
                          'Coordinate with external agencies and contractors'
                        ]
                      },
                      {
                        name: 'Recovery & Resumption',
                        duration: '6-24 hours',
                        actions: [
                          'Restore normal water distribution operations',
                          'Validate water quality across all affected zones',
                          'Conduct crisis team debrief and lessons learned',
                          'Document incident and update regulatory reports'
                        ]
                      }
                    ].map((phase, index) => (
                      <div key={index} className="relative pl-14">
                        <div className="absolute left-0 top-2 w-12 h-12 rounded-full bg-gray-700 border-4 border-white flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="border border-gray-200 rounded-sm p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-gray-900">{phase.name}</h4>
                            <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-sm">
                              {phase.duration}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {phase.actions.map((action, i) => (
                              <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                <CheckIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Review & Submit</h2>
                <p className="text-xs text-gray-500 mb-6">Review all information before submitting the crisis plan</p>
              </div>

              <div className="space-y-4">
                {/* Basic Info Summary */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Plan Name:</span>
                      <p className="font-medium text-gray-900">{formData.planName || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Scenario Type:</span>
                      <p className="font-medium text-gray-900">{scenarioTypes.find(t => t.value === formData.scenarioType)?.label || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Severity:</span>
                      <p className="font-medium text-gray-900">{formData.severity}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span>
                      <p className="font-medium text-gray-900">{formData.owner || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Scope Summary */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">Crisis Scope</h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Locations:</span>
                      <p className="font-medium text-gray-900">{formData.affectedLocations.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Departments:</span>
                      <p className="font-medium text-gray-900">{formData.affectedDepartments.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Processes:</span>
                      <p className="font-medium text-gray-900">{formData.affectedProcesses.length} selected</p>
                    </div>
                  </div>
                </div>

                {/* BETH3V Summary */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">BETH3V Dependencies</h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Buildings:</span>
                      <p className="font-medium text-gray-900">{formData.buildings.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Equipment:</span>
                      <p className="font-medium text-gray-900">{formData.equipment.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Technology:</span>
                      <p className="font-medium text-gray-900">{formData.technology.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Human Resources:</span>
                      <p className="font-medium text-gray-900">{formData.humanResources.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vendors:</span>
                      <p className="font-medium text-gray-900">{formData.thirdPartyVendors.length} selected</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vital Records:</span>
                      <p className="font-medium text-gray-900">{formData.vitalRecords.length} selected</p>
                    </div>
                  </div>
                </div>

                {/* Response Summary */}
                <div className="border border-gray-200 rounded-sm p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-3">Response Plan</h3>
                  <div className="text-xs">
                    <span className="text-gray-500">Activation Criteria:</span>
                    <p className="font-medium text-gray-900">{formData.activationCriteria.length} criteria defined</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm ${
              currentStepIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
            >
              Next
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700"
            >
              <CheckIcon className="h-4 w-4" />
              Submit Crisis Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewCrisisPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading crisis plan wizard...</p>
        </div>
      </div>
    }>
      <NewCrisisPlanForm />
    </Suspense>
  );
}
