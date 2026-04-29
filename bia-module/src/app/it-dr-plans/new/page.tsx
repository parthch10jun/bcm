'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CheckIcon,
  ServerIcon,
  DocumentTextIcon,
  LinkIcon,
  CogIcon,
  ShieldCheckIcon,
  CloudIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Step configuration
const steps = [
  { id: 1, name: 'Basic Information', fieldType: 'basic-info' },
  { id: 2, name: 'Enabler & Strategy', fieldType: 'enabler-strategy' },
  { id: 3, name: 'Scope & Coverage', fieldType: 'scope' },
  { id: 4, name: 'Continuity Objectives', fieldType: 'continuity-objectives' },
  { id: 5, name: 'Continuity Procedures', fieldType: 'procedures' },
  { id: 6, name: 'Resources & Dependencies', fieldType: 'resources' },
  { id: 7, name: 'Testing & Validation', fieldType: 'testing' },
  { id: 8, name: 'Review & Submit', fieldType: 'review' }
];

// Mock data for library integrations
const mockITSystems = [
  { id: 'SYS-001', name: 'Active Directory', category: 'Authentication', tier: 'Tier 1', rto: '2h' },
  { id: 'SYS-002', name: 'Email Server', category: 'Communication', tier: 'Tier 1', rto: '4h' },
  { id: 'SYS-003', name: 'File Server', category: 'Storage', tier: 'Tier 1', rto: '4h' },
  { id: 'SYS-004', name: 'Database Server', category: 'Database', tier: 'Tier 1', rto: '2h' },
  { id: 'SYS-005', name: 'Web Application Server', category: 'Application', tier: 'Tier 2', rto: '8h' }
];

const mockProcesses = [
  { id: 'PROC-001', name: 'Financial Reporting', department: 'Finance', tier: 'Tier 1', mtpd: '4h' },
  { id: 'PROC-002', name: 'Customer Order Processing', department: 'Sales', tier: 'Tier 1', mtpd: '8h' },
  { id: 'PROC-003', name: 'Payroll Processing', department: 'HR', tier: 'Tier 2', mtpd: '24h' }
];

const mockAssets = [
  { id: 'AST-001', name: 'Dell PowerEdge R750 Server Cluster', type: 'Equipment', location: 'Data Center - Newark', status: 'Active' },
  { id: 'AST-002', name: 'NetApp AFF A400 Storage Array', type: 'Equipment', location: 'Data Center - Newark', status: 'Active' },
  { id: 'AST-003', name: 'VMware vSphere 8.0 Enterprise', type: 'Technology', location: 'Virtual Infrastructure', status: 'Active' },
  { id: 'AST-004', name: 'Backup Generator (250kVA)', type: 'Equipment', location: 'Data Center - Newark', status: 'Active' }
];

const mockPeople = [
  { id: 'USR-001', name: 'Sarah Johnson', role: 'IT Operations Manager', department: 'IT Operations', phone: '+1-555-0100', email: 'sarah.j@company.com' },
  { id: 'USR-002', name: 'Michael Chen', role: 'Database Administrator', department: 'IT Infrastructure', phone: '+1-555-0101', email: 'michael.c@company.com' },
  { id: 'USR-003', name: 'David Rodriguez', role: 'Network Engineer', department: 'IT Infrastructure', phone: '+1-555-0102', email: 'david.r@company.com' },
  { id: 'USR-004', name: 'Jennifer Martinez', role: 'Security Analyst', department: 'IT Security', phone: '+1-555-0103', email: 'jennifer.m@company.com' }
];

const mockVendors = [
  { id: 'VND-001', name: 'Verizon Business', type: 'Telecommunications', service: 'Primary Network Provider', contact: 'Enterprise Support 24/7', tier: 'Tier 1' },
  { id: 'VND-002', name: 'AWS', type: 'Cloud Services', service: 'Cloud Infrastructure & DR Site', contact: 'Premium Support', tier: 'Tier 1' },
  { id: 'VND-003', name: 'Dell Technologies', type: 'Hardware', service: 'Server Hardware & Support', contact: 'ProSupport Plus', tier: 'Tier 2' },
  { id: 'VND-004', name: 'Commvault', type: 'Software', service: 'Backup & Recovery Software', contact: 'Enterprise Support', tier: 'Tier 1' }
];

export default function NewDRPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    planName: 'People Displacement - Mumbai Office',
    planType: 'Business Continuity Plan',
    description: 'Business continuity plan for managing workforce displacement scenarios including office evacuation, pandemic lockdowns, and mass transit disruptions.',
    owner: 'Sarah Johnson',
    secondaryOwner: 'Michael Chen',

    // Step 2: Enabler & Strategy
    enablerType: 'Human Resources',
    strategy: 'Work from Home / Alternate Site',

    // Step 3: Scope & Coverage
    businessUnits: ['IT', 'Finance', 'Customer Service', 'Sales', 'HR'],
    geographicScope: 'Primary: Newark, NJ → Backup: Jersey City, NJ',
    coveredSystems: 'All Tier 1 and Tier 2 IT systems and applications',
    selectedSystems: mockITSystems,
    selectedProcesses: mockProcesses,
    
    // Step 3: Recovery Objectives
    rto: '4',
    rpo: '1',
    mtd: '24',
    rtoJustification: 'Based on business impact analysis, critical business processes require IT services to be restored within 4 hours to prevent significant financial and operational impact.',
    
    // Step 4: Recovery Procedures
    activationCriteria: '• Complete loss of primary data center\n• Fire, flood, or natural disaster affecting facility\n• Extended power outage (>2 hours)\n• Critical infrastructure failure\n• Cyber attack rendering systems inoperable\n• Government-mandated evacuation',
    procedures: '1. Assess the situation and confirm disaster scenario\n2. Activate DR team and notify stakeholders\n3. Initiate failover to backup data center\n4. Verify system availability at backup site\n5. Begin data recovery and validation\n6. Restore critical applications in priority order\n7. Validate business process functionality',
    escalationSteps: [
      { level: 1, role: 'IT Operations Manager', contact: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1-555-0100', timeframe: '0-30 minutes' },
      { level: 2, role: 'VP of IT', contact: 'Michael Chen', email: 'michael.c@company.com', phone: '+1-555-0101', timeframe: '30-60 minutes' },
      { level: 3, role: 'CIO', contact: 'David Rodriguez', email: 'david.r@company.com', phone: '+1-555-0102', timeframe: '1+ hours' },
      { level: 4, role: 'CEO', contact: 'Jennifer Martinez', email: 'jennifer.m@company.com', phone: '+1-555-0103', timeframe: 'Critical situations' }
    ],
    
    // Step 5: Resources & Dependencies
    selectedAssets: mockAssets,
    selectedPeople: mockPeople,
    selectedVendors: mockVendors,
    
    // Step 6: Testing & Validation
    testFrequency: 'Quarterly',
    lastTestDate: '2024-09-15',
    nextTestDate: '2024-12-15',
    testObjectives: 'Validate failover procedures, verify RTO/RPO targets, test communication protocols, ensure team readiness'
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting DR Plan:', formData);
    alert('DR Plan submitted successfully!');
    router.push('/it-dr-plans');
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.fieldType) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="e.g., People Displacement - Mumbai Office"
              />
              <p className="text-[10px] text-gray-500 mt-1">Descriptive name for this BCP plan</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Plan Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select plan type...</option>
                <option value="Business Continuity Plan">Business Continuity Plan</option>
                <option value="Crisis Management Plan">Crisis Management Plan</option>
                <option value="Emergency Response Plan">Emergency Response Plan</option>
                <option value="Pandemic Response Plan">Pandemic Response Plan</option>
                <option value="Cyber Incident Response">Cyber Incident Response</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Type of business continuity plan</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Describe the purpose and scope of this DR plan..."
              />
              <p className="text-[10px] text-gray-500 mt-1">Detailed description of the plan</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Primary Owner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Enter owner name or email"
                />
                <p className="text-[10px] text-gray-500 mt-1">Primary responsible person</p>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Secondary Owner
                </label>
                <input
                  type="text"
                  value={formData.secondaryOwner}
                  onChange={(e) => setFormData({ ...formData, secondaryOwner: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Enter secondary owner"
                />
                <p className="text-[10px] text-gray-500 mt-1">Backup responsible person</p>
              </div>
            </div>
          </div>
        );

      case 'enabler-strategy':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-sm p-3">
              <p className="text-xs text-purple-700">
                Select the primary enabler type and continuity strategy for this BCP plan.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Enabler Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.enablerType}
                onChange={(e) => setFormData({ ...formData, enablerType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select enabler type...</option>
                <option value="Human Resources">👥 Human Resources</option>
                <option value="Building">🏢 Building</option>
                <option value="Technology">💻 Technology</option>
                <option value="Equipment">⚙️ Equipment</option>
                <option value="Vendors">🤝 Vendors</option>
                <option value="Vital Records">📄 Vital Records</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Primary enabler affected by this continuity scenario</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Continuity Strategy <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select strategy...</option>
                {formData.enablerType === 'Human Resources' && (
                  <>
                    <option value="Work from Home / Alternate Site">Work from Home / Alternate Site</option>
                    <option value="Temporary Staffing">Temporary Staffing</option>
                    <option value="Cross-Training & Succession">Cross-Training & Succession</option>
                  </>
                )}
                {formData.enablerType === 'Building' && (
                  <>
                    <option value="Alternate Facility Activation">Alternate Facility Activation</option>
                    <option value="Hot Site Relocation">Hot Site Relocation</option>
                    <option value="Mobile Recovery Unit">Mobile Recovery Unit</option>
                  </>
                )}
                {formData.enablerType === 'Technology' && (
                  <>
                    <option value="Failover to DR Site">Failover to DR Site</option>
                    <option value="Cloud-Based Recovery">Cloud-Based Recovery</option>
                    <option value="Manual Workarounds">Manual Workarounds</option>
                  </>
                )}
                {formData.enablerType === 'Equipment' && (
                  <>
                    <option value="Backup Equipment Deployment">Backup Equipment Deployment</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Vendor Emergency Supply">Vendor Emergency Supply</option>
                  </>
                )}
                {formData.enablerType === 'Vendors' && (
                  <>
                    <option value="Alternate Vendor Activation">Alternate Vendor Activation</option>
                    <option value="Multi-Vendor Strategy">Multi-Vendor Strategy</option>
                    <option value="In-House Contingency">In-House Contingency</option>
                  </>
                )}
                {formData.enablerType === 'Vital Records' && (
                  <>
                    <option value="Backup Restoration">Backup Restoration</option>
                    <option value="Offsite Storage Retrieval">Offsite Storage Retrieval</option>
                    <option value="Cloud Backup Recovery">Cloud Backup Recovery</option>
                  </>
                )}
                {!formData.enablerType && (
                  <option value="" disabled>Please select an enabler type first</option>
                )}
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Strategy to maintain business continuity for this enabler</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
              <h4 className="text-xs font-medium text-gray-900 mb-2">Strategy Description</h4>
              {formData.strategy === 'Work from Home / Alternate Site' && (
                <p className="text-xs text-gray-600">
                  Activate remote work protocols and alternate site facilities to maintain workforce productivity during office displacement scenarios.
                </p>
              )}
              {formData.strategy === 'Alternate Facility Activation' && (
                <p className="text-xs text-gray-600">
                  Relocate operations to a pre-designated alternate facility with necessary infrastructure and resources.
                </p>
              )}
              {formData.strategy === 'Failover to DR Site' && (
                <p className="text-xs text-gray-600">
                  Automatically or manually failover critical technology systems to a disaster recovery site with minimal downtime.
                </p>
              )}
              {formData.strategy === 'Backup Equipment Deployment' && (
                <p className="text-xs text-gray-600">
                  Deploy pre-positioned backup equipment or procure emergency replacements to restore operational capability.
                </p>
              )}
              {formData.strategy === 'Alternate Vendor Activation' && (
                <p className="text-xs text-gray-600">
                  Activate pre-qualified alternate vendors to maintain supply chain continuity during primary vendor disruption.
                </p>
              )}
              {formData.strategy === 'Backup Restoration' && (
                <p className="text-xs text-gray-600">
                  Restore vital records from secure backup systems including offsite storage and cloud repositories.
                </p>
              )}
              {!formData.strategy && (
                <p className="text-xs text-gray-400 italic">Select a strategy to see its description</p>
              )}
            </div>
          </div>
        );

      case 'scope':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <p className="text-xs text-blue-700">
                Define which systems, processes, and business units are covered by this DR plan.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Selected IT Systems ({formData.selectedSystems.length})
              </label>
              
              <div className="space-y-2">
                {formData.selectedSystems.map((system) => (
                  <div key={system.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <ServerIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{system.name}</span>
                          <span className="text-[10px] text-gray-500">({system.id})</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{system.category} • RTO: {system.rto}</div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                        system.tier === 'Tier 1' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {system.tier}
                      </span>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add IT Systems
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Select IT systems from the IT Systems Library</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Selected Business Processes ({formData.selectedProcesses.length})
              </label>
              
              <div className="space-y-2">
                {formData.selectedProcesses.map((process) => (
                  <div key={process.id} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <DocumentTextIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{process.name}</span>
                          <span className="text-[10px] text-gray-500">({process.id})</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{process.department} • MTPD: {process.mtpd}</div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                        process.tier === 'Tier 1' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {process.tier}
                      </span>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add Business Processes
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Select business processes from BIA Records</p>
            </div>
          </div>
        );

      case 'continuity-objectives':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <p className="text-xs text-blue-700">
                Define continuity objectives including recovery time objective (RTO), recovery point objective (RPO), and maximum tolerable downtime (MTD).
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Recovery Time Objective (RTO) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.rto}
                    onChange={(e) => setFormData({ ...formData, rto: e.target.value })}
                    className="w-full px-3 py-2 pr-16 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="4"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">hours</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Maximum time to restore service</p>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Recovery Point Objective (RPO) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.rpo}
                    onChange={(e) => setFormData({ ...formData, rpo: e.target.value })}
                    className="w-full px-3 py-2 pr-16 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="1"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">hours</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Maximum acceptable data loss</p>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Maximum Tolerable Downtime (MTD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.mtd}
                    onChange={(e) => setFormData({ ...formData, mtd: e.target.value })}
                    className="w-full px-3 py-2 pr-16 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="24"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">hours</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Absolute maximum downtime before critical impact</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Business Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.rtoJustification}
                onChange={(e) => setFormData({ ...formData, rtoJustification: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Explain the business rationale for these recovery objectives..."
              />
              <p className="text-[10px] text-gray-500 mt-1">Justify the selected RTO/RPO/MTD values</p>
            </div>
          </div>
        );

            case 'procedures':
        const activationCriteriaList = [
          { id: 1, title: 'Complete Data Center Loss', description: 'Total loss of primary data center facility', severity: 'critical', icon: '🔥' },
          { id: 2, title: 'Natural Disaster', description: 'Fire, flood, earthquake, or severe weather event', severity: 'critical', icon: '🌪️' },
          { id: 3, title: 'Extended Power Outage', description: 'Power loss exceeding 2 hours', severity: 'high', icon: '⚡' },
          { id: 4, title: 'Infrastructure Failure', description: 'Critical system or network infrastructure failure', severity: 'high', icon: '🔧' },
          { id: 5, title: 'Cyber Attack', description: 'Ransomware or attack rendering systems inoperable', severity: 'critical', icon: '🛡️' },
          { id: 6, title: 'Mandatory Evacuation', description: 'Government-mandated facility evacuation', severity: 'medium', icon: '🚨' }
        ];

        const recoverySteps = [
          { 
            id: 1, 
            title: 'Assess & Confirm', 
            description: 'Assess the situation and confirm disaster scenario',
            duration: '15 min',
            status: 'pending',
            icon: '🔍',
            details: 'Evaluate incident severity, confirm trigger criteria met, document initial assessment'
          },
          { 
            id: 2, 
            title: 'Activate Team', 
            description: 'Activate DR team and notify stakeholders',
            duration: '30 min',
            status: 'pending',
            icon: '📢',
            details: 'Contact DR team members, notify executives, establish communication channels'
          },
          { 
            id: 3, 
            title: 'Initiate Failover', 
            description: 'Initiate failover to backup data center',
            duration: '1 hour',
            status: 'pending',
            icon: '🔄',
            details: 'Execute failover procedures, redirect traffic, activate backup systems'
          },
          { 
            id: 4, 
            title: 'Verify Systems', 
            description: 'Verify system availability at backup site',
            duration: '45 min',
            status: 'pending',
            icon: '✓',
            details: 'Test connectivity, verify system status, confirm resource availability'
          },
          { 
            id: 5, 
            title: 'Recover Data', 
            description: 'Begin data recovery and validation',
            duration: '2 hours',
            status: 'pending',
            icon: '💾',
            details: 'Restore from backups, validate data integrity, verify RPO compliance'
          },
          { 
            id: 6, 
            title: 'Restore Applications', 
            description: 'Restore critical applications in priority order',
            duration: '3 hours',
            status: 'pending',
            icon: '⚙️',
            details: 'Start Tier 1 applications, configure dependencies, test functionality'
          },
          { 
            id: 7, 
            title: 'Validate & Resume', 
            description: 'Validate business process functionality',
            duration: '1 hour',
            status: 'pending',
            icon: '🎯',
            details: 'End-to-end testing, business validation, resume normal operations'
          }
        ];

        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-blue-700 font-medium">
                📋 Define activation triggers and recovery workflow for this DR plan
              </p>
            </div>

            {/* Activation Criteria - Interactive Workflow */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
                Activation Criteria <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {activationCriteriaList.map((criterion, index) => (
                  <div
                    key={criterion.id}
                    className="group relative bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md ${
                        criterion.severity === 'critical' 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : criterion.severity === 'high'
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                          : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                      }`}>
                        {criterion.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1">{criterion.title}</h4>
                        <p className="text-[10px] text-gray-600 leading-relaxed">{criterion.description}</p>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-0.5 text-[9px] font-medium rounded-full ${
                            criterion.severity === 'critical'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : criterion.severity === 'high'
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {criterion.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3D depth effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                  </div>
                ))}
              </div>
              
              <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-dashed border-gray-300 text-xs font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add Activation Criterion
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Conditions that trigger this DR plan activation</p>
            </div>

            {/* Recovery Procedures - 3D Timeline Workflow */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
                Step-by-Step Recovery Procedures <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                {/* Vertical timeline connector */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-green-400"></div>
                
                <div className="space-y-4">
                  {recoverySteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-xl transition-all duration-300 ml-12"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                        boxShadow: '4px 4px 12px rgba(0,0,0,0.08), -2px -2px 8px rgba(255,255,255,0.8)',
                        transform: 'perspective(1000px) rotateX(0deg)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) translateY(-4px)';
                        e.currentTarget.style.boxShadow = '6px 8px 20px rgba(0,0,0,0.12), -3px -3px 12px rgba(255,255,255,0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0)';
                        e.currentTarget.style.boxShadow = '4px 4px 12px rgba(0,0,0,0.08), -2px -2px 8px rgba(255,255,255,0.8)';
                      }}
                    >
                      {/* Step number badge - positioned on timeline */}
                      <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-white z-10">
                        {step.id}
                      </div>
                      
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shadow-md border border-gray-300">
                          {step.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h4>
                              <p className="text-xs text-gray-700 font-medium">{step.description}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {step.duration}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-gray-600 leading-relaxed mb-3">{step.details}</p>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-colors">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Details
                            </button>
                            <button className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-400 transition-colors">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 3D depth layers */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      <div className="absolute -bottom-1 -right-1 w-full h-full rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 -z-10 opacity-30"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="mt-4 inline-flex items-center px-3 py-1.5 border border-dashed border-gray-300 text-xs font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add Recovery Step
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Detailed recovery steps in sequential order with estimated durations</p>
            </div>

            
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Escalation Steps Table
              </label>
              
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-20">Level</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Role/Title</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.escalationSteps.map((step, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-medium">
                            {step.level}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-xs font-medium text-gray-900">{step.role}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-xs font-medium text-gray-900">{step.contact}</div>
                          <div className="text-[10px] text-gray-500">{step.email}</div>
                          <div className="text-[10px] text-gray-500">{step.phone}</div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                            {step.timeframe}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove">
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add Escalation Level
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Define escalation path for issues during recovery</p>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <p className="text-xs text-blue-700">
                Identify critical resources, key personnel, and external dependencies required for recovery.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Critical Resources (Assets)
              </label>
              
              <div className="space-y-2">
                {formData.selectedAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-sm hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <BuildingOfficeIcon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{asset.name}</span>
                          <span className="text-[10px] text-gray-500">({asset.id})</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{asset.type} • {asset.location}</div>
                      </div>
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm bg-green-50 text-green-700 border border-green-200">
                        {asset.status}
                      </span>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add from Asset Library
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Select critical assets from the Asset Library (Equipment, Technology, Buildings, Vital Records)</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Key Personnel
              </label>
              
              <div className="space-y-2">
                {formData.selectedPeople.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-sm hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <UsersIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{person.name}</span>
                          <span className="text-[10px] text-gray-500">({person.id})</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{person.role} • {person.department}</div>
                        <div className="text-[10px] text-gray-500">{person.phone} • {person.email}</div>
                      </div>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add from People Library
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Select key personnel from the People Library</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                External Dependencies (Vendors)
              </label>
              
              <div className="space-y-2">
                {formData.selectedVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-sm hover:bg-orange-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <TruckIcon className="h-4 w-4 text-orange-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{vendor.name}</span>
                          <span className="text-[10px] text-gray-500">({vendor.id})</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{vendor.type} • {vendor.service}</div>
                        <div className="text-[10px] text-gray-500">{vendor.contact}</div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                        vendor.tier === 'Tier 1' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {vendor.tier}
                      </span>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add from Vendor Library
              </button>
              
              <p className="text-[10px] text-gray-500 mt-2">Select external vendors from the Vendor Library</p>
            </div>
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <p className="text-xs text-blue-700">
                Define testing schedule and validation procedures for this DR plan.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Test Frequency <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.testFrequency}
                onChange={(e) => setFormData({ ...formData, testFrequency: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select frequency...</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">How often should this plan be tested?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Last Test Date
                </label>
                <input
                  type="date"
                  value={formData.lastTestDate}
                  onChange={(e) => setFormData({ ...formData, lastTestDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <p className="text-[10px] text-gray-500 mt-1">When was the last test conducted?</p>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Next Scheduled Test
                </label>
                <input
                  type="date"
                  value={formData.nextTestDate}
                  onChange={(e) => setFormData({ ...formData, nextTestDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <p className="text-[10px] text-gray-500 mt-1">When is the next test scheduled?</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Test Objectives <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.testObjectives}
                onChange={(e) => setFormData({ ...formData, testObjectives: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Define test objectives and success criteria..."
              />
              <p className="text-[10px] text-gray-500 mt-1">What should be validated during testing?</p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-sm p-3">
              <p className="text-xs text-green-700">
                Review all information before submitting the DR plan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-sm p-3">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Basic Information</h3>
                <div className="space-y-1 text-[10px]">
                  <div><span className="text-gray-500">Plan Name:</span> <span className="text-gray-900 font-medium">{formData.planName}</span></div>
                  <div><span className="text-gray-500">Type:</span> <span className="text-gray-900">{formData.planType}</span></div>
                  <div><span className="text-gray-500">Owner:</span> <span className="text-gray-900">{formData.owner}</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-sm p-3">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Recovery Objectives</h3>
                <div className="space-y-1 text-[10px]">
                  <div><span className="text-gray-500">RTO:</span> <span className="text-gray-900 font-medium">{formData.rto} hours</span></div>
                  <div><span className="text-gray-500">RPO:</span> <span className="text-gray-900 font-medium">{formData.rpo} hours</span></div>
                  <div><span className="text-gray-500">MTD:</span> <span className="text-gray-900 font-medium">{formData.mtd} hours</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-sm p-3">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Scope</h3>
                <div className="space-y-1 text-[10px]">
                  <div><span className="text-gray-500">IT Systems:</span> <span className="text-gray-900 font-medium">{formData.selectedSystems.length}</span></div>
                  <div><span className="text-gray-500">Processes:</span> <span className="text-gray-900 font-medium">{formData.selectedProcesses.length}</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-sm p-3">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Resources</h3>
                <div className="space-y-1 text-[10px]">
                  <div><span className="text-gray-500">Assets:</span> <span className="text-gray-900 font-medium">{formData.selectedAssets.length}</span></div>
                  <div><span className="text-gray-500">Personnel:</span> <span className="text-gray-900 font-medium">{formData.selectedPeople.length}</span></div>
                  <div><span className="text-gray-500">Vendors:</span> <span className="text-gray-900 font-medium">{formData.selectedVendors.length}</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-sm p-3 col-span-2">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Testing</h3>
                <div className="space-y-1 text-[10px]">
                  <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-900 font-medium">{formData.testFrequency}</span></div>
                  <div><span className="text-gray-500">Last Test:</span> <span className="text-gray-900">{formData.lastTestDate}</span></div>
                  <div><span className="text-gray-500">Next Test:</span> <span className="text-gray-900">{formData.nextTestDate}</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/it-dr-plans"
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1.5" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">New BCP Plan</h1>
            <p className="text-xs text-gray-500 mt-0.5">Create a new business continuity plan with enabler-specific strategies</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-900">{steps[currentStep].name}</p>
              <p className="text-[10px] text-gray-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <span className="text-xs font-medium text-gray-900">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 mr-1.5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-gray-900'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
              Submit Plan
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Next
              <ChevronRightIcon className="h-3.5 w-3.5 ml-1.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
