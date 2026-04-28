'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ServerIcon,
  ClockIcon,
  ShieldCheckIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LibrarySelectionModal from '@/components/LibrarySelectionModal';

export default function NewDRPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // All useState hooks must be at top level - not inside conditional blocks
  const [selectedType, setSelectedType] = useState('arp');
  const [selectedOwner, setSelectedOwner] = useState('usr-001');
  const [selectedSecondary, setSelectedSecondary] = useState('usr-002');
  const [selectedBIA, setSelectedBIA] = useState('BIA-001');
  const [selectedTriggers, setSelectedTriggers] = useState<number[]>([1, 2, 5]);
  const [runbookSteps, setRunbookSteps] = useState([
    { id: 1, title: 'Assess & Confirm Disaster', owner: 'IT Manager', duration: '15 min', status: 'configured' },
    { id: 2, title: 'Activate DR Team', owner: 'IT Manager', duration: '30 min', status: 'configured' },
    { id: 3, title: 'Initiate Failover', owner: 'Infrastructure Lead', duration: '1 hour', status: 'configured' }
  ]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['AST-001', 'AST-002']);
  const [selectedPeople, setSelectedPeople] = useState<string[]>(['USR-001', 'USR-002']);
  const [selectedVendors, setSelectedVendors] = useState<string[]>(['VND-001', 'VND-002']);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'owner' | 'secondary' | 'bia' | 'assets' | 'people' | 'vendors' | null>(null);

  // Mock Library Data
  const mockOwners = [
    { id: 'usr-001', name: 'Sarah Johnson', role: 'IT Manager', department: 'IT Operations', email: 'sarah.j@company.com' },
    { id: 'usr-002', name: 'Michael Chen', role: 'Infrastructure Lead', department: 'IT Infrastructure', email: 'michael.c@company.com' },
    { id: 'usr-003', name: 'David Rodriguez', role: 'Application Lead', department: 'IT Applications', email: 'david.r@company.com' },
    { id: 'usr-004', name: 'Jennifer Martinez', role: 'Security Lead', department: 'IT Security', email: 'jennifer.m@company.com' },
    { id: 'usr-005', name: 'Robert Taylor', role: 'Data Lead', department: 'Data Management', email: 'robert.t@company.com' }
  ];

  const mockBIARecords = [
    { id: 'BIA-001', name: 'Core Banking Operations', rto: '2h', rpo: '15min', mtd: '4h', impact: '€100K/hour', tier: 'Tier 1' },
    { id: 'BIA-002', name: 'Customer Service Platform', rto: '4h', rpo: '1h', mtd: '8h', impact: '€50K/hour', tier: 'Tier 1' },
    { id: 'BIA-003', name: 'Internal IT Services', rto: '8h', rpo: '4h', mtd: '24h', impact: '€20K/hour', tier: 'Tier 2' },
    { id: 'BIA-004', name: 'Payment Processing', rto: '1h', rpo: '5min', mtd: '2h', impact: '€200K/hour', tier: 'Tier 1' },
    { id: 'BIA-005', name: 'Email & Collaboration', rto: '12h', rpo: '8h', mtd: '48h', impact: '€10K/hour', tier: 'Tier 3' }
  ];

  const mockAssets = [
    { id: 'AST-001', name: 'Dell PowerEdge R750 Server Cluster', type: 'Equipment', location: 'Newark DC', status: 'Active' },
    { id: 'AST-002', name: 'NetApp AFF A400 Storage Array', type: 'Equipment', location: 'Newark DC', status: 'Active' },
    { id: 'AST-003', name: 'VMware vSphere 8.0 Enterprise', type: 'Technology', location: 'Virtual', status: 'Active' },
    { id: 'AST-004', name: 'Backup Generator (250kVA)', type: 'Equipment', location: 'Newark DC', status: 'Active' },
    { id: 'AST-005', name: 'Cisco Nexus 9000 Switch', type: 'Equipment', location: 'Newark DC', status: 'Active' }
  ];

  const mockPeople = [
    { id: 'USR-001', name: 'Sarah Johnson', role: 'IT Operations Manager', department: 'IT Operations', phone: '+1-555-0100' },
    { id: 'USR-002', name: 'Michael Chen', role: 'Database Administrator', department: 'IT Infrastructure', phone: '+1-555-0101' },
    { id: 'USR-003', name: 'David Rodriguez', role: 'Network Engineer', department: 'IT Infrastructure', phone: '+1-555-0102' },
    { id: 'USR-004', name: 'Jennifer Martinez', role: 'Security Analyst', department: 'IT Security', phone: '+1-555-0103' },
    { id: 'USR-005', name: 'Robert Taylor', role: 'Application Developer', department: 'IT Applications', phone: '+1-555-0104' }
  ];

  const mockVendors = [
    { id: 'VND-001', name: 'Verizon Business', type: 'Telecommunications', service: 'Primary Network Provider', sla: '99.9%' },
    { id: 'VND-002', name: 'AWS', type: 'Cloud Services', service: 'Cloud Infrastructure & DR Site', sla: '99.99%' },
    { id: 'VND-003', name: 'Dell Technologies', type: 'Hardware', service: 'Server Hardware & Support', sla: '4-hour onsite' },
    { id: 'VND-004', name: 'Commvault', type: 'Software', service: 'Backup & Recovery Software', sla: '24/7' },
    { id: 'VND-005', name: 'Zerto', type: 'Software', service: 'Disaster Recovery Replication', sla: '99.9%' }
  ];

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    planName: 'Primary Data Center Failover Plan',
    planType: 'datacenter-failure',
    description: 'Comprehensive disaster recovery plan for primary data center failure scenarios, including complete site loss, extended power outages, and catastrophic infrastructure failures. This plan ensures business continuity through failover to our secondary data center in New Jersey.',
    owner: 'Sarah Johnson (sarah.johnson@company.com)',
    secondaryOwner: 'Michael Chen (michael.chen@company.com)',

    // Step 2: Scope
    affectedSystems: [] as string[],
    criticalProcesses: [] as string[],
    businessUnits: 'IT Operations, Finance, Customer Service, Sales, HR',
    geographicScope: 'Primary Data Center - New York (Manhattan), Backup Site - New Jersey (Newark)',

    // Step 3: Recovery Objectives
    rto: '4',
    rpo: '1',
    mtd: '24',
    rtoJustification: 'Based on business impact analysis, critical financial systems must be restored within 4 hours to prevent regulatory violations and significant revenue loss. Customer-facing applications require similar recovery times to maintain service level agreements.',

    // Step 4: Recovery Procedures
    procedures: `1. INITIAL ASSESSMENT (0-15 minutes)
   - Confirm nature and extent of data center failure
   - Activate DR team via emergency notification system
   - Establish command center at backup location

2. DECLARE DISASTER (15-30 minutes)
   - Obtain executive approval for DR plan activation
   - Notify all stakeholders and affected business units
   - Initiate communication protocols

3. NETWORK FAILOVER (30-60 minutes)
   - Redirect DNS to backup data center
   - Activate backup network circuits
   - Verify network connectivity and bandwidth

4. STORAGE SYSTEMS RECOVERY (1-2 hours)
   - Mount replicated storage volumes
   - Verify data integrity and consistency
   - Activate backup storage arrays

5. APPLICATION RECOVERY (2-3 hours)
   - Start critical applications in priority order
   - Verify application functionality
   - Restore database connections

6. VALIDATION & TESTING (3-4 hours)
   - Conduct end-to-end testing
   - Verify all critical systems operational
   - Confirm data accuracy and completeness

7. BUSINESS RESUMPTION (4+ hours)
   - Notify users of system availability
   - Monitor system performance
   - Document recovery actions taken`,
    activationCriteria: `This DR plan should be activated when any of the following conditions occur:

1. Complete loss of primary data center facility (fire, flood, structural damage)
2. Extended power outage exceeding 2 hours with no estimated restoration time
3. Critical infrastructure failure affecting 50% or more of production systems
4. Natural disaster rendering primary site inaccessible
5. Cyber attack causing widespread system compromise requiring full rebuild
6. Any event preventing access to primary data center for more than 4 hours`,
    escalationProcedure: `Level 1: IT Operations Manager (0-30 minutes)
   - Initial assessment and team activation
   - Contact: ops.manager@company.com / +1-555-0100

Level 2: VP of IT (30-60 minutes)
   - Approval for DR plan activation
   - Resource allocation decisions
   - Contact: vp.it@company.com / +1-555-0101

Level 3: CIO (1+ hours)
   - Executive decision-making for extended outages
   - External communications approval
   - Contact: cio@company.com / +1-555-0102

Level 4: CEO (Critical situations)
   - Major business decisions
   - Public relations and stakeholder communications
   - Contact: ceo@company.com / +1-555-0103`,

    // Step 5: Resources & Dependencies
    criticalResources: `HARDWARE:
- Dell PowerEdge R750 servers (20 units at backup site)
- NetApp AFF A400 storage arrays (2 units, 500TB capacity)
- Cisco Nexus 9000 network switches (4 units)
- Fortinet FortiGate 3000D firewalls (2 units)
- APC Symmetra PX UPS systems (2 units, 250kVA each)

SOFTWARE:
- VMware vSphere 8.0 Enterprise Plus
- Microsoft SQL Server 2022 Enterprise
- Oracle Database 19c Enterprise Edition
- Red Hat Enterprise Linux 8.6
- Windows Server 2022 Datacenter

FACILITIES:
- Backup data center (Newark, NJ) - 5,000 sq ft
- Emergency operations center with 24/7 access
- Redundant cooling systems (N+1 configuration)
- Dual power feeds from separate substations`,
    keyPersonnel: `DR TEAM LEAD:
- Sarah Johnson, IT Operations Manager
- Role: Overall coordination and decision-making
- Contact: +1-555-0100 (mobile), sarah.johnson@company.com

INFRASTRUCTURE TEAM:
- Michael Chen, Senior Systems Engineer
- David Rodriguez, Network Architect
- Contact: infrastructure-team@company.com

DATABASE TEAM:
- Lisa Wang, Database Administrator
- James Patterson, Senior DBA
- Contact: dba-team@company.com

APPLICATION TEAM:
- Robert Taylor, Application Services Manager
- Jennifer Martinez, Senior Developer
- Contact: app-team@company.com

SECURITY TEAM:
- Amanda Foster, Information Security Manager
- Contact: security-team@company.com`,
    externalDependencies: `TELECOMMUNICATIONS:
- Verizon Business - Primary network provider
- AT&T - Secondary network provider
- Contact: Enterprise support 24/7 hotline

CLOUD SERVICES:
- AWS - Cloud infrastructure and backup storage
- Microsoft Azure - Hybrid cloud services
- Contact: Enterprise support portals

MANAGED SERVICES:
- IBM Global Services - Hardware maintenance
- Accenture - Application support
- Contact: Account managers on-call

VENDORS:
- Dell Technologies - Server hardware support
- NetApp - Storage system support
- Cisco - Network equipment support
- Contact: Enterprise support contracts`,

    // Step 6: Testing & Validation
    testFrequency: 'quarterly',
    lastTested: '2024-09-15',
    nextTest: '2024-12-15',
    testObjectives: `PRIMARY OBJECTIVES:
1. Verify all critical systems can be recovered within RTO targets
2. Validate data integrity and RPO compliance
3. Test communication and escalation procedures
4. Confirm backup site readiness and capacity
5. Verify vendor support and SLA compliance

SUCCESS CRITERIA:
- All Tier 1 applications restored within 4 hours
- Data loss limited to less than 1 hour (RPO compliance)
- All DR team members successfully contacted and mobilized
- Network failover completed within 1 hour
- End-to-end transaction testing successful
- Documentation updated with lessons learned

TESTING APPROACH:
- Quarterly tabletop exercises for all team members
- Semi-annual partial failover tests (non-production systems)
- Annual full DR test with complete failover to backup site`
  });

  const steps = [
    {
      name: 'Basic Information',
      description: 'Define plan name, type, and ownership',
      fieldType: 'basic-info'
    },
    {
      name: 'Scope & Coverage',
      description: 'Identify affected systems and processes',
      fieldType: 'scope'
    },
    {
      name: 'Recovery Objectives',
      description: 'Set RTO, RPO, and MTD targets',
      fieldType: 'recovery-objectives'
    },
    {
      name: 'Recovery Procedures',
      description: 'Document step-by-step recovery actions',
      fieldType: 'procedures'
    },
    {
      name: 'Resources & Dependencies',
      description: 'Identify critical resources and dependencies',
      fieldType: 'resources'
    },
    {
      name: 'Testing & Validation',
      description: 'Define testing schedule and objectives',
      fieldType: 'testing'
    },
    {
      name: 'Review & Submit',
      description: 'Review all information and submit plan',
      fieldType: 'review'
    }
  ];

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.planName.trim()) {
        alert('Please enter a plan name');
        return;
      }
      if (!formData.owner.trim()) {
        alert('Please enter a plan owner');
        return;
      }
    }
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
    alert('DR Plan created successfully!');
    router.push('/it-dr-plans');
  };

  const handleModalSelect = (id: string) => {
    if (modalType === 'owner') {
      setSelectedOwner(id);
      const owner = mockOwners.find(o => o.id === id);
      if (owner) setFormData({ ...formData, owner: owner.name });
    } else if (modalType === 'secondary') {
      setSelectedSecondary(id);
      const owner = mockOwners.find(o => o.id === id);
      if (owner) setFormData({ ...formData, secondaryOwner: owner.name });
    } else if (modalType === 'bia') {
      setSelectedBIA(id);
      const bia = mockBIARecords.find(b => b.id === id);
      if (bia) setFormData({ ...formData, rto: bia.rto, rpo: bia.rpo, mtd: bia.mtd });
    } else if (modalType === 'assets') {
      setSelectedAssets(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (modalType === 'people') {
      setSelectedPeople(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (modalType === 'vendors') {
      setSelectedVendors(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.fieldType === 'basic-info') {
      const planTypes = [
        { id: 'arp', name: 'Application Recovery Plan (ARP)', icon: '📱', desc: 'Single application or application suite' },
        { id: 'irp', name: 'Infrastructure Recovery Plan (IRP)', icon: '🏢', desc: 'Data centers, networks, infrastructure' },
        { id: 'drp', name: 'Data Recovery Plan (DRP)', icon: '💾', desc: 'Databases and data recovery' },
        { id: 'cirp', name: 'Cyber Incident Response Plan (CIRP)', icon: '🛡️', desc: 'Cyber attacks and incidents' }
      ];

      const mockOwners = [
        { id: 'usr-001', name: 'Sarah Johnson', role: 'IT Manager', department: 'IT Operations' },
        { id: 'usr-002', name: 'Michael Chen', role: 'Infrastructure Lead', department: 'IT Infrastructure' },
        { id: 'usr-003', name: 'David Rodriguez', role: 'Application Lead', department: 'IT Applications' }
      ];

      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              <strong>Plan Classification:</strong> Select plan type and assign ownership from your organization
            </p>
          </div>

          {/* Plan Name - Keep as input since it's unique */}
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="e.g., Core Banking System DR Plan"
            />
          </div>

          {/* Plan Type - Interactive Cards */}
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Plan Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {planTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setFormData({ ...formData, planType: type.id });
                  }}
                  className={`p-4 border-2 rounded-sm text-left transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900">{type.name}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{type.desc}</div>
                    </div>
                    {selectedType === type.id && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Owner - Select from Library Modal */}
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Plan Owner <span className="text-red-500">*</span>
            </label>
            {selectedOwner ? (
              <div className="flex items-center gap-3 p-4 border-2 border-green-500 bg-green-50 rounded-sm">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">
                    {mockOwners.find(o => o.id === selectedOwner)?.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {mockOwners.find(o => o.id === selectedOwner)?.role} • {mockOwners.find(o => o.id === selectedOwner)?.department}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalType('owner');
                    setModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setModalType('owner');
                  setModalOpen(true);
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">Select Plan Owner from Library</span>
              </button>
            )}
          </div>

          {/* Secondary Owner */}
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Secondary Owner
            </label>
            <div className="space-y-2">
              {mockOwners.filter(o => o.id !== selectedOwner).map(owner => (
                <button
                  key={owner.id}
                  onClick={() => {
                    setSelectedSecondary(owner.id);
                    setFormData({ ...formData, secondaryOwner: owner.name });
                  }}
                  className={`w-full p-3 border-2 rounded-sm text-left transition-all ${
                    selectedSecondary === owner.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{owner.name}</div>
                      <div className="text-[10px] text-gray-500">{owner.role}</div>
                    </div>
                    {selectedSecondary === owner.id && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step.fieldType === 'scope') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              Define which systems, processes, and business units are covered by this DR plan.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Business Units Affected
            </label>
            <input
              type="text"
              value={formData.businessUnits}
              onChange={(e) => setFormData({ ...formData, businessUnits: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="e.g., Finance, IT Operations, Customer Service"
            />
            <p className="text-[10px] text-gray-500 mt-1">Comma-separated list of affected business units</p>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Geographic Scope
            </label>
            <input
              type="text"
              value={formData.geographicScope}
              onChange={(e) => setFormData({ ...formData, geographicScope: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="e.g., Primary Data Center - New York, Backup Site - New Jersey"
            />
            <p className="text-[10px] text-gray-500 mt-1">Locations and facilities covered by this plan</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h4 className="text-xs font-semibold text-gray-900 mb-3">Critical Systems & Processes</h4>
            <p className="text-[10px] text-gray-600 mb-3">
              List the critical IT systems and business processes that require recovery under this plan.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Selected IT Systems (5)
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'SYS-001', name: 'Active Directory', type: 'Authentication', criticality: 'Tier 1', rto: '2h' },
                    { id: 'SYS-002', name: 'Email Server (Exchange)', type: 'Communication', criticality: 'Tier 1', rto: '4h' },
                    { id: 'SYS-003', name: 'File Server (Primary)', type: 'Storage', criticality: 'Tier 1', rto: '4h' },
                    { id: 'SYS-004', name: 'Database Server (SQL)', type: 'Database', criticality: 'Tier 1', rto: '2h' },
                    { id: 'SYS-005', name: 'Web Application Server', type: 'Application', criticality: 'Tier 2', rto: '8h' }
                  ].map((system) => (
                    <div key={system.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <ServerIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{system.name}</span>
                            <span className="text-[10px] text-gray-500">({system.id})</span>
                          </div>
                          <div className="text-[10px] text-gray-500">{system.type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                            system.criticality === 'Tier 1'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {system.criticality}
                          </span>
                          <span className="text-[10px] text-gray-500">RTO: {system.rto}</span>
                        </div>
                      </div>
                      <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Selected Business Processes (3)
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'PROC-001', name: 'Financial Reporting', department: 'Finance', criticality: 'Tier 1', mtpd: '4h' },
                    { id: 'PROC-002', name: 'Customer Order Processing', department: 'Sales', criticality: 'Tier 1', mtpd: '8h' },
                    { id: 'PROC-003', name: 'Payroll Processing', department: 'HR', criticality: 'Tier 2', mtpd: '24h' }
                  ].map((process) => (
                    <div key={process.id} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <svg className="h-4 w-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{process.name}</span>
                            <span className="text-[10px] text-gray-500">({process.id})</span>
                          </div>
                          <div className="text-[10px] text-gray-500">{process.department}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                            process.criticality === 'Tier 1'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {process.criticality}
                          </span>
                          <span className="text-[10px] text-gray-500">MTPD: {process.mtpd}</span>
                        </div>
                      </div>
                      <button className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add IT Systems
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Business Processes
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mt-3">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-[10px] text-blue-700 font-medium">System and Process Selection</p>
                    <p className="text-[10px] text-blue-600 mt-1">
                      In production, this will integrate with the IT Systems Library and BIA Records to allow selection of critical systems and processes. RTO/MTPD values are inherited from the selected items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step.fieldType === 'recovery-objectives') {
      const mockBIARecords = [
        { id: 'BIA-001', name: 'Core Banking Operations', rto: '2h', rpo: '15min', mtd: '4h', impact: '€100K/hour', tier: 'Tier 1' },
        { id: 'BIA-002', name: 'Customer Service Platform', rto: '4h', rpo: '1h', mtd: '8h', impact: '€50K/hour', tier: 'Tier 1' },
        { id: 'BIA-003', name: 'Internal IT Services', rto: '8h', rpo: '4h', mtd: '24h', impact: '€20K/hour', tier: 'Tier 2' }
      ];

      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              <strong>Link to BIA:</strong> Select existing Business Impact Analysis to inherit RTO/RPO/MTD objectives
            </p>
          </div>

          {/* BIA Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Link to BIA Record <span className="text-red-500">*</span>
              </label>
              <Link href="/bia-records" className="text-xs text-blue-600 hover:text-blue-700">
                Browse BIA Records →
              </Link>
            </div>

            <div className="space-y-2">
              {mockBIARecords.map(bia => (
                <button
                  key={bia.id}
                  onClick={() => {
                    setSelectedBIA(bia.id);
                    setFormData({ ...formData, rto: bia.rto, rpo: bia.rpo, mtd: bia.mtd });
                  }}
                  className={`w-full p-4 border-2 rounded-sm text-left transition-all ${
                    selectedBIA === bia.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-900">{bia.name}</span>
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                          bia.tier === 'Tier 1' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {bia.tier}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-[10px]">
                        <div>
                          <span className="text-gray-500">RTO:</span>
                          <span className="ml-1 font-semibold text-gray-900">{bia.rto}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">RPO:</span>
                          <span className="ml-1 font-semibold text-gray-900">{bia.rpo}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">MTD:</span>
                          <span className="ml-1 font-semibold text-gray-900">{bia.mtd}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <span className="ml-1 font-semibold text-red-600">{bia.impact}</span>
                        </div>
                      </div>
                    </div>
                    {selectedBIA === bia.id && (
                      <CheckCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recovery Objectives - Auto-populated from BIA */}
          {selectedBIA && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-xs font-semibold text-gray-900">Recovery Objectives (Auto-populated from BIA)</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {mockBIARecords.find(b => b.id === selectedBIA) && (
                  <>
                    <div className="bg-white border border-green-200 rounded-sm p-3">
                      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">RTO</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {mockBIARecords.find(b => b.id === selectedBIA)?.rto}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">Recovery Time Objective</div>
                    </div>
                    <div className="bg-white border border-green-200 rounded-sm p-3">
                      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">RPO</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {mockBIARecords.find(b => b.id === selectedBIA)?.rpo}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">Recovery Point Objective</div>
                    </div>
                    <div className="bg-white border border-green-200 rounded-sm p-3">
                      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">MTD</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {mockBIARecords.find(b => b.id === selectedBIA)?.mtd}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">Maximum Tolerable Downtime</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (step.fieldType === 'procedures') {
      const activationTriggers = [
        { id: 1, name: 'Complete Data Center Loss', severity: 'Critical', icon: '🔥' },
        { id: 2, name: 'Natural Disaster', severity: 'Critical', icon: '🌪️' },
        { id: 3, name: 'Extended Power Outage (>2h)', severity: 'High', icon: '⚡' },
        { id: 4, name: 'Critical Infrastructure Failure', severity: 'High', icon: '🔧' },
        { id: 5, name: 'Cyber Attack / Ransomware', severity: 'Critical', icon: '🛡️' },
        { id: 6, name: 'Government Evacuation Order', severity: 'Medium', icon: '🚨' }
      ];

      const addRunbookStep = () => {
        const newStep = {
          id: runbookSteps.length + 1,
          title: 'New Recovery Step',
          owner: 'Unassigned',
          duration: '30 min',
          status: 'pending'
        };
        setRunbookSteps([...runbookSteps, newStep]);
      };

      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              <strong>Build DR Runbook:</strong> Define activation triggers and recovery procedures using interactive components
            </p>
          </div>

          {/* Activation Triggers */}
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
              Activation Triggers <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activationTriggers.map(trigger => (
                <button
                  key={trigger.id}
                  onClick={() => {
                    setSelectedTriggers(prev =>
                      prev.includes(trigger.id)
                        ? prev.filter(id => id !== trigger.id)
                        : [...prev, trigger.id]
                    );
                  }}
                  className={`p-3 border-2 rounded-sm text-left transition-all ${
                    selectedTriggers.includes(trigger.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{trigger.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{trigger.name}</div>
                      <div className={`text-[10px] mt-0.5 ${
                        trigger.severity === 'Critical' ? 'text-red-600' :
                        trigger.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        {trigger.severity} Severity
                      </div>
                    </div>
                    {selectedTriggers.includes(trigger.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              Selected {selectedTriggers.length} of {activationTriggers.length} triggers
            </p>
          </div>

          {/* Recovery Runbook */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Recovery Runbook <span className="text-red-500">*</span>
              </label>
              <button
                onClick={addRunbookStep}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
              >
                <PlusIcon className="h-3.5 w-3.5 mr-1" />
                Add Step
              </button>
            </div>

            <div className="space-y-2">
              {runbookSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...runbookSteps];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setRunbookSteps(updated);
                      }}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-sm"
                      placeholder="Step description"
                    />
                    <input
                      type="text"
                      value={step.owner}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-sm"
                      placeholder="Owner"
                    />
                    <input
                      type="text"
                      value={step.duration}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-sm"
                      placeholder="Duration"
                    />
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              {runbookSteps.length} recovery steps defined • Click step to edit details
            </p>
          </div>

          {/* Escalation Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Escalation Matrix
              </label>
              <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                <PlusIcon className="h-3.5 w-3.5 mr-1" />
                Add Level
              </button>
            </div>
            <div className="border border-gray-200 rounded-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { level: 1, role: 'IT Operations Manager', contact: 'Sarah Johnson', timeframe: '0-30 min' },
                    { level: 2, role: 'VP of IT', contact: 'Michael Chen', timeframe: '30-60 min' },
                    { level: 3, role: 'CIO', contact: 'David Rodriguez', timeframe: '1+ hours' },
                    { level: 4, role: 'CEO', contact: 'Jennifer Martinez', timeframe: 'Critical' }
                  ].map((escalation, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                          {escalation.level}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">{escalation.role}</td>
                      <td className="px-3 py-2 text-xs text-gray-700">{escalation.contact}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                          {escalation.timeframe}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (step.fieldType === 'resources') {
      const mockAssets = [
        { id: 'AST-001', name: 'Dell PowerEdge R750 Server Cluster', type: 'Equipment', location: 'Newark DC' },
        { id: 'AST-002', name: 'NetApp AFF A400 Storage Array', type: 'Equipment', location: 'Newark DC' },
        { id: 'AST-003', name: 'VMware vSphere 8.0 Enterprise', type: 'Technology', location: 'Virtual' },
        { id: 'AST-004', name: 'Backup Generator (250kVA)', type: 'Equipment', location: 'Newark DC' }
      ];

      const mockPeople = [
        { id: 'USR-001', name: 'Sarah Johnson', role: 'IT Operations Manager', department: 'IT Operations' },
        { id: 'USR-002', name: 'Michael Chen', role: 'Database Administrator', department: 'IT Infrastructure' },
        { id: 'USR-003', name: 'David Rodriguez', role: 'Network Engineer', department: 'IT Infrastructure' },
        { id: 'USR-004', name: 'Jennifer Martinez', role: 'Security Analyst', department: 'IT Security' }
      ];

      const mockVendors = [
        { id: 'VND-001', name: 'Verizon Business', type: 'Telecommunications', service: 'Primary Network Provider' },
        { id: 'VND-002', name: 'AWS', type: 'Cloud Services', service: 'Cloud Infrastructure & DR Site' },
        { id: 'VND-003', name: 'Dell Technologies', type: 'Hardware', service: 'Server Hardware & Support' },
        { id: 'VND-004', name: 'Commvault', type: 'Software', service: 'Backup & Recovery Software' }
      ];

      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              <strong>Link to Libraries:</strong> Select resources from existing libraries instead of manual entry
            </p>
          </div>

          {/* Critical Assets & Equipment */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Assets & Equipment ({selectedAssets.length} selected)
              </label>
              <Link
                href="/libraries"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse Asset Library →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockAssets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssets(prev =>
                      prev.includes(asset.id)
                        ? prev.filter(id => id !== asset.id)
                        : [...prev, asset.id]
                    );
                  }}
                  className={`p-3 border-2 rounded-sm text-left transition-all ${
                    selectedAssets.includes(asset.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{asset.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{asset.type} • {asset.location}</div>
                    </div>
                    {selectedAssets.includes(asset.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Personnel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Key Personnel ({selectedPeople.length} selected)
              </label>
              <Link
                href="/libraries"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse People Library →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockPeople.map(person => (
                <button
                  key={person.id}
                  onClick={() => {
                    setSelectedPeople(prev =>
                      prev.includes(person.id)
                        ? prev.filter(id => id !== person.id)
                        : [...prev, person.id]
                    );
                  }}
                  className={`p-3 border-2 rounded-sm text-left transition-all ${
                    selectedPeople.includes(person.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{person.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{person.role}</div>
                    </div>
                    {selectedPeople.includes(person.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vendor Dependencies */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Vendor Dependencies ({selectedVendors.length} selected)
              </label>
              <Link
                href="/libraries"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse Vendor Library →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockVendors.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => {
                    setSelectedVendors(prev =>
                      prev.includes(vendor.id)
                        ? prev.filter(id => id !== vendor.id)
                        : [...prev, vendor.id]
                    );
                  }}
                  className={`p-3 border-2 rounded-sm text-left transition-all ${
                    selectedVendors.includes(vendor.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{vendor.service}</div>
                    </div>
                    {selectedVendors.includes(vendor.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step.fieldType === 'testing') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <p className="text-xs text-blue-700">
              Define testing schedule, objectives, and validation criteria for this DR plan.
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
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi-annual">Semi-Annual</option>
              <option value="annual">Annual</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">How often this plan should be tested</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Last Tested
              </label>
              <input
                type="date"
                value={formData.lastTested}
                onChange={(e) => setFormData({ ...formData, lastTested: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">Date of last test execution</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Next Test Scheduled
              </label>
              <input
                type="date"
                value={formData.nextTest}
                onChange={(e) => setFormData({ ...formData, nextTest: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">Date of next scheduled test</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Test Objectives
            </label>
            <textarea
              value={formData.testObjectives}
              onChange={(e) => setFormData({ ...formData, testObjectives: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Define what should be validated during testing..."
            />
            <p className="text-[10px] text-gray-500 mt-1">Goals and success criteria for testing</p>
          </div>
        </div>
      );
    }

    if (step.fieldType === 'review') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Review & Submit</h3>
              <p className="text-[10px] text-gray-600">Review your DR plan and submit for approval</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-3 w-3 mr-1" />
              Export PDF
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">Basic Information</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-700">Plan Name:</span>
                <span className="ml-2 text-gray-900">{formData.planName || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Plan Type:</span>
                <span className="ml-2 text-gray-900 capitalize">{formData.planType.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Owner:</span>
                <span className="ml-2 text-gray-900">{formData.owner || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Secondary Owner:</span>
                <span className="ml-2 text-gray-900">{formData.secondaryOwner || 'Not set'}</span>
              </div>
              {formData.description && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="ml-2 text-gray-900">{formData.description}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">Recovery Objectives</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-sm p-2 border border-gray-200">
                <div className="text-[10px] font-medium text-gray-700">RTO</div>
                <div className="text-sm font-bold text-gray-900">
                  {formData.rto || 'Not Set'} {formData.rto && 'h'}
                </div>
              </div>
              <div className="bg-white rounded-sm p-2 border border-gray-200">
                <div className="text-[10px] font-medium text-gray-700">RPO</div>
                <div className="text-sm font-bold text-gray-900">
                  {formData.rpo || 'Not Set'} {formData.rpo && 'h'}
                </div>
              </div>
              <div className="bg-white rounded-sm p-2 border border-gray-200">
                <div className="text-[10px] font-medium text-gray-700">MTD</div>
                <div className="text-sm font-bold text-gray-900">
                  {formData.mtd || 'Not Set'} {formData.mtd && 'h'}
                </div>
              </div>
            </div>
          </div>

          {(formData.businessUnits || formData.geographicScope) && (
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Scope & Coverage</h4>
              <div className="space-y-2 text-xs">
                {formData.businessUnits && (
                  <div>
                    <span className="font-medium text-gray-700">Business Units:</span>
                    <span className="ml-2 text-gray-900">{formData.businessUnits}</span>
                  </div>
                )}
                {formData.geographicScope && (
                  <div>
                    <span className="font-medium text-gray-700">Geographic Scope:</span>
                    <span className="ml-2 text-gray-900">{formData.geographicScope}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">Testing & Validation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-700">Test Frequency:</span>
                <span className="ml-2 text-gray-900 capitalize">{formData.testFrequency}</span>
              </div>
              {formData.lastTested && (
                <div>
                  <span className="font-medium text-gray-700">Last Tested:</span>
                  <span className="ml-2 text-gray-900">{formData.lastTested}</span>
                </div>
              )}
              {formData.nextTest && (
                <div>
                  <span className="font-medium text-gray-700">Next Test:</span>
                  <span className="ml-2 text-gray-900">{formData.nextTest}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-sm p-4 mt-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h5 className="text-xs font-semibold text-green-900 mb-1">Ready to Submit</h5>
                <p className="text-[10px] text-green-700">
                  Your DR plan is ready for submission. Click the button below to create the plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div>Unknown step</div>;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/it-dr-plans')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back
            </button>
            <div className="border-l border-gray-300 h-6"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New DR Plan</h1>
              <p className="mt-0.5 text-xs text-gray-500">Define disaster recovery procedures and objectives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">{steps[currentStep].name}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">{steps[currentStep].description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm font-semibold text-gray-900">{Math.round(((currentStep + 1) / steps.length) * 100)}%</div>
              <div className="text-[10px] text-gray-500">Complete</div>
            </div>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-5"></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              Create DR Plan
            </button>
          )}
        </div>
      </div>

      {/* Library Selection Modal */}
      <LibrarySelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'owner' ? 'Select Plan Owner' :
          modalType === 'secondary' ? 'Select Secondary Owner' :
          modalType === 'bia' ? 'Select BIA Record' :
          modalType === 'assets' ? 'Select Assets & Equipment' :
          modalType === 'people' ? 'Select Team Members' :
          modalType === 'vendors' ? 'Select Vendors' :
          'Select from Library'
        }
        description={
          modalType === 'owner' ? 'Choose the primary owner from your organization' :
          modalType === 'secondary' ? 'Choose a backup owner' :
          modalType === 'bia' ? 'Link to existing Business Impact Analysis to inherit RTO/RPO/MTD' :
          modalType === 'assets' ? 'Select critical assets and equipment from your library' :
          modalType === 'people' ? 'Select key personnel for the recovery team' :
          modalType === 'vendors' ? 'Select vendors and service providers' :
          undefined
        }
        items={
          modalType === 'owner' || modalType === 'secondary' ? mockOwners :
          modalType === 'bia' ? mockBIARecords :
          modalType === 'assets' ? mockAssets :
          modalType === 'people' ? mockPeople :
          modalType === 'vendors' ? mockVendors :
          []
        }
        selectedIds={
          modalType === 'owner' ? [selectedOwner] :
          modalType === 'secondary' ? [selectedSecondary] :
          modalType === 'bia' ? [selectedBIA] :
          modalType === 'assets' ? selectedAssets :
          modalType === 'people' ? selectedPeople :
          modalType === 'vendors' ? selectedVendors :
          []
        }
        onSelect={handleModalSelect}
        multiSelect={modalType === 'assets' || modalType === 'people' || modalType === 'vendors'}
        renderItem={(item, isSelected) => {
          if (modalType === 'owner' || modalType === 'secondary') {
            const owner = item as typeof mockOwners[0];
            return (
              <div className={`p-3 border-2 rounded-sm transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{owner.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{owner.role} • {owner.department}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{owner.email}</div>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            );
          } else if (modalType === 'bia') {
            const bia = item as typeof mockBIARecords[0];
            return (
              <div className={`p-4 border-2 rounded-sm transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-900">{bia.name}</span>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                        bia.tier === 'Tier 1' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {bia.tier}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[10px]">
                      <div><span className="text-gray-500">RTO:</span> <span className="font-semibold">{bia.rto}</span></div>
                      <div><span className="text-gray-500">RPO:</span> <span className="font-semibold">{bia.rpo}</span></div>
                      <div><span className="text-gray-500">MTD:</span> <span className="font-semibold">{bia.mtd}</span></div>
                      <div><span className="text-gray-500">Impact:</span> <span className="font-semibold text-red-600">{bia.impact}</span></div>
                    </div>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-6 w-6 text-blue-600 ml-3" />}
                </div>
              </div>
            );
          } else if (modalType === 'assets') {
            const asset = item as typeof mockAssets[0];
            return (
              <div className={`p-3 border-2 rounded-sm transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{asset.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{asset.type} • {asset.location}</div>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            );
          } else if (modalType === 'people') {
            const person = item as typeof mockPeople[0];
            return (
              <div className={`p-3 border-2 rounded-sm transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{person.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{person.role} • {person.phone}</div>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            );
          } else if (modalType === 'vendors') {
            const vendor = item as typeof mockVendors[0];
            return (
              <div className={`p-3 border-2 rounded-sm transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{vendor.service} • SLA: {vendor.sla}</div>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
}