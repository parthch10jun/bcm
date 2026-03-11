'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  PlayIcon,
  BeakerIcon,
  ArrowDownTrayIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type Tab = 'overview' | 'scope' | 'dependencies' | 'team' | 'response' | 'testing';

interface CrisisPlanDetail {
  id: string;
  name: string;
  scenario: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Active' | 'Archived';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  createdDate: string;
  lastUpdated: string;
  nextReview: string;
  description: string;
  
  // Scope
  affectedLocations: string[];
  affectedDepartments: string[];
  affectedProcesses: string[];
  
  // Dependencies
  dependencies: {
    buildings: string[];
    equipment: string[];
    technology: string[];
    humanResources: string[];
    thirdPartyVendors: string[];
    vitalRecords: string[];
  };
  
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
  
  // Testing
  testHistory: Array<{
    date: string;
    type: string;
    result: 'Pass' | 'Partial' | 'Fail';
    findings: string;
  }>;
}

const mockPlanData: CrisisPlanDetail = {
  id: 'CMP-001',
  name: 'Water Treatment Plant Failure - Jeddah',
  scenario: 'Complete loss of Jeddah Water Treatment Plant',
  status: 'Approved',
  severity: 'Critical',
  owner: 'Ahmed Al-Rashid',
  createdDate: '2024-10-15',
  lastUpdated: '2025-01-15',
  nextReview: '2025-04-15',
  description: 'Comprehensive crisis response plan for complete loss of Jeddah Water Treatment Plant, including water quality monitoring failure, distribution rerouting, emergency water supply activation, and public communication procedures.',

  affectedLocations: ['Jeddah Water Treatment Plant', 'Riyadh Operations Center', 'Dammam Distribution Hub'],
  affectedDepartments: ['Plant Operations', 'Quality Control', 'Distribution Management', 'Emergency Response', 'Customer Service'],
  affectedProcesses: ['Water Quality Testing', 'Water Distribution Control', 'Emergency Response', 'Customer Billing'],

  dependencies: {
    buildings: ['Main Treatment Facility', 'SCADA Control Center', 'Pumping Station', 'Customer Service Building'],
    equipment: ['Water Filtration Systems (8 units)', 'Chlorination Equipment (6 units)', 'Distribution Pumps (12 units)', 'SCADA Servers (4 units)', 'Network Infrastructure'],
    technology: ['Water Quality Monitoring System', 'SCADA Control System', 'Distribution Management System', 'Customer Billing Platform'],
    humanResources: ['Plant Operators (45)', 'Control Room Operators (35)', 'Field Technicians (25)', 'Quality Control Team (15)', 'IT Operations (20)'],
    thirdPartyVendors: ['Chemical Supplier (Chlorine)', 'Lab Testing Services', 'Equipment Maintenance Contractor', 'Emergency Water Tanker Services'],
    vitalRecords: ['Water Quality Reports', 'Customer Database', 'Regulatory Compliance Documents', 'Asset Maintenance Logs', 'Emergency Contact Lists']
  },

  crisisTeam: [
    { role: 'Crisis Commander', primary: 'Ahmed Al-Rashid', alternate: 'Khalid Al-Otaibi', contact: '+966 50 123 4567' },
    { role: 'Operations Lead', primary: 'Fatima Al-Zahrani', alternate: 'Mohammed Al-Ghamdi', contact: '+966 50 123 4568' },
    { role: 'Quality Control Lead', primary: 'Dr. Nasser Al-Harbi', alternate: 'Dr. Sara Al-Mutairi', contact: '+966 50 123 4569' },
    { role: 'Communications Lead', primary: 'Layla Al-Dosari', alternate: 'Omar Al-Qahtani', contact: '+966 50 123 4570' },
    { role: 'Technical Lead', primary: 'Yousef Al-Shehri', alternate: 'Reem Al-Mansour', contact: '+966 50 123 4571' },
    { role: 'Customer Service Lead', primary: 'Hanan Al-Juhani', alternate: 'Abdullah Al-Malki', contact: '+966 50 123 4572' }
  ],

  activationCriteria: [
    'Complete loss of water treatment capability',
    'Water quality failure below regulatory standards',
    'Fire or natural disaster at treatment plant',
    'Extended power outage affecting treatment operations (>2 hours)',
    'Critical equipment failure affecting >50% treatment capacity',
    'Chemical supply contamination or shortage'
  ],

  responsePhases: [
    {
      name: 'Detection & Assessment',
      duration: '0-15 min',
      actions: [
        'Confirm incident and assess water quality impact',
        'Notify Crisis Commander and Operations Lead',
        'Activate crisis management team',
        'Establish emergency communication channels',
        'Assess affected customer zones and population',
        'Initiate water quality testing protocols'
      ]
    },
    {
      name: 'Immediate Response',
      duration: '15 min - 1 hour',
      actions: [
        'Implement immediate water distribution shutdown if required',
        'Activate backup treatment systems and alternative water sources',
        'Notify Ministry of Environment, Water and Agriculture',
        'Set up crisis command center at Riyadh Operations',
        'Deploy emergency water tankers to critical facilities (hospitals, schools)',
        'Issue public advisory through media and SMS alerts'
      ]
    },
    {
      name: 'Stabilization',
      duration: '1-6 hours',
      actions: [
        'Reroute water distribution from alternative treatment plants',
        'Execute emergency chlorination and quality monitoring',
        'Coordinate with chemical suppliers for emergency deliveries',
        'Provide regular status updates to regulatory authorities',
        'Establish customer hotline and information center',
        'Monitor water quality at distribution points continuously'
      ]
    },
    {
      name: 'Recovery & Resumption',
      duration: '6-48 hours',
      actions: [
        'Restore treatment plant operations or establish long-term alternatives',
        'Validate water quality meets all regulatory standards',
        'Gradually restore normal distribution operations',
        'Debrief crisis team and regulatory authorities',
        'Conduct public communication on water safety restoration',
        'Document lessons learned and update crisis procedures'
      ]
    }
  ],

  testHistory: [
    { date: '2024-12-10', type: 'Tabletop Exercise', result: 'Pass', findings: 'All team members responded within target timeframes. Emergency water tanker deployment successful.' },
    { date: '2024-09-15', type: 'Full Simulation Test', result: 'Partial', findings: 'Water rerouting successful but communication with some customer zones delayed. Improved SMS alert system needed.' },
    { date: '2024-06-20', type: 'Communication Drill', result: 'Pass', findings: 'Regulatory notification and public advisory procedures executed effectively.' }
  ]
};

export default function CrisisPlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activating, setActivating] = useState(false);
  const plan = mockPlanData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Active': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleActivatePlan = () => {
    setActivating(true);
    // Simulate activation process
    setTimeout(() => {
      setActivating(false);
      setShowActivateModal(false);
      // In production, this would update the plan status to 'Active' and notify the crisis team
      alert('Crisis Plan Activated!\n\nNotifications sent to:\n' +
            plan.crisisTeam.map(member => `- ${member.role}: ${member.primary}`).join('\n'));
    }, 2000);
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/crisis-plans')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{plan.name}</h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${getSeverityColor(plan.severity)}`}>
                  {plan.severity}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{plan.id} • {plan.scenario}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <BeakerIcon className="h-4 w-4" />
              Test Plan
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setShowActivateModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700"
            >
              <PlayIcon className="h-4 w-4" />
              Activate Plan
            </button>
            <button
              onClick={() => router.push(`/crisis-plans/${params.id}/edit`)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-6 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: ShieldExclamationIcon },
                { id: 'scope', label: 'Scope', icon: MapPinIcon },
                { id: 'dependencies', label: 'Dependencies', icon: BuildingOfficeIcon },
                { id: 'team', label: 'Team', icon: UsersIcon },
                { id: 'response', label: 'Response', icon: ClockIcon },
                { id: 'testing', label: 'Testing', icon: BeakerIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      <p className="text-xs font-medium text-blue-900">Affected Locations</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{plan.affectedLocations.length}</p>
                    <p className="text-xs text-blue-700 mt-1">Across Saudi Arabia</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
                      <p className="text-xs font-medium text-green-900">Departments</p>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{plan.affectedDepartments.length}</p>
                    <p className="text-xs text-green-700 mt-1">Operational units</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <UsersIcon className="h-5 w-5 text-purple-600" />
                      <p className="text-xs font-medium text-purple-900">Crisis Team</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{plan.crisisTeam.length}</p>
                    <p className="text-xs text-purple-700 mt-1">Key responders</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-orange-600" />
                      <p className="text-xs font-medium text-orange-900">Response Time</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">15</p>
                    <p className="text-xs text-orange-700 mt-1">Minutes to activate</p>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-sm p-4 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Plan Owner</p>
                    <p className="text-sm font-bold text-gray-900">{plan.owner}</p>
                    <p className="text-xs text-gray-500 mt-2">Crisis Commander</p>
                  </div>
                  <div className="border border-gray-200 rounded-sm p-4 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-bold text-gray-900">{plan.lastUpdated}</p>
                    <p className="text-xs text-gray-500 mt-2">Created: {plan.createdDate}</p>
                  </div>
                  <div className="border border-gray-200 rounded-sm p-4 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Next Review</p>
                    <p className="text-sm font-bold text-gray-900">{plan.nextReview}</p>
                    <p className="text-xs text-gray-500 mt-2">Quarterly review cycle</p>
                  </div>
                </div>

                {/* Description */}
                <div className="border border-gray-200 rounded-sm p-4 bg-white">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Crisis Scenario Description</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{plan.description}</p>
                </div>

                {/* Response Timeline Visual */}
                <div className="border border-gray-200 rounded-sm p-4 bg-white">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Response Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4">
                      {plan.responsePhases.map((phase, index) => (
                        <div key={index} className="relative pl-10">
                          <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-red-100 border-2 border-red-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-600">{index + 1}</span>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-gray-900">{phase.name}</p>
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-sm">
                                {phase.duration}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{phase.actions.length} critical actions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activation Criteria */}
                <div className="border border-red-200 rounded-sm p-4 bg-red-50">
                  <h3 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Activation Criteria
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.activationCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white border border-red-200 rounded-sm">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">{index + 1}</span>
                        </div>
                        <p className="text-xs text-gray-700">{criteria}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="border border-gray-200 rounded-sm p-4 bg-white">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Impact Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-xs text-red-600 font-medium mb-1">Critical Processes</p>
                      <p className="text-2xl font-bold text-red-700">{plan.affectedProcesses.length}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-sm">
                      <p className="text-xs text-orange-600 font-medium mb-1">BETH3V Dependencies</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {plan.dependencies.buildings.length + plan.dependencies.equipment.length +
                         plan.dependencies.technology.length + plan.dependencies.humanResources.length +
                         plan.dependencies.thirdPartyVendors.length + plan.dependencies.vitalRecords.length}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-sm">
                      <p className="text-xs text-blue-600 font-medium mb-1">Total Tests Conducted</p>
                      <p className="text-2xl font-bold text-blue-700">{plan.testHistory.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scope Tab */}
            {activeTab === 'scope' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Affected Locations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {plan.affectedLocations.map((location) => (
                      <div key={location} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm">
                        <MapPinIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-gray-700">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Affected Departments</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {plan.affectedDepartments.map((dept) => (
                      <div key={dept} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm">
                        <BuildingOfficeIcon className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-gray-700">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Affected Critical Processes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.affectedProcesses.map((process) => (
                      <div key={process} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm">
                        <CheckCircleIcon className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-gray-700">{process}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dependencies Tab - BETH3V */}
            {activeTab === 'dependencies' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">BETH3V Dependency Map</h3>
                  <p className="text-xs text-gray-500 mb-4">Resources and enablers affected by this crisis scenario</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buildings */}
                  <div className="border border-blue-200 rounded-sm p-4 bg-blue-50">
                    <h4 className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <BuildingOfficeIcon className="h-5 w-5" />
                      Buildings ({plan.dependencies.buildings.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.buildings.map((item, index) => (
                        <div key={index} className="text-xs text-blue-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="border border-green-200 rounded-sm p-4 bg-green-50">
                    <h4 className="text-xs font-bold text-green-900 mb-3 flex items-center gap-2">
                      <ShieldExclamationIcon className="h-5 w-5" />
                      Equipment ({plan.dependencies.equipment.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.equipment.map((item, index) => (
                        <div key={index} className="text-xs text-green-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Technology */}
                  <div className="border border-purple-200 rounded-sm p-4 bg-purple-50">
                    <h4 className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <ShieldExclamationIcon className="h-5 w-5" />
                      Technology / IT Systems ({plan.dependencies.technology.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.technology.map((item, index) => (
                        <div key={index} className="text-xs text-purple-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Human Resources */}
                  <div className="border border-orange-200 rounded-sm p-4 bg-orange-50">
                    <h4 className="text-xs font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <UsersIcon className="h-5 w-5" />
                      Human Resources ({plan.dependencies.humanResources.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.humanResources.map((item, index) => (
                        <div key={index} className="text-xs text-orange-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Third-party Vendors */}
                  <div className="border border-red-200 rounded-sm p-4 bg-red-50">
                    <h4 className="text-xs font-bold text-red-900 mb-3 flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5" />
                      Third-party Vendors ({plan.dependencies.thirdPartyVendors.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.thirdPartyVendors.map((item, index) => (
                        <div key={index} className="text-xs text-red-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Vital Records */}
                  <div className="border border-yellow-200 rounded-sm p-4 bg-yellow-50">
                    <h4 className="text-xs font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <ShieldExclamationIcon className="h-5 w-5" />
                      Vital Records ({plan.dependencies.vitalRecords.length})
                    </h4>
                    <div className="space-y-1">
                      {plan.dependencies.vitalRecords.map((item, index) => (
                        <div key={index} className="text-xs text-yellow-800 bg-white p-2 rounded-sm">{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Crisis Management Team</h3>
                  <p className="text-xs text-gray-500 mb-4">Team structure with primary and alternate contacts</p>
                </div>

                {plan.crisisTeam.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-sm p-4">
                    <h4 className="text-xs font-bold text-gray-900 mb-3">{member.role}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">Primary Contact</p>
                        <p className="text-xs font-medium text-gray-900">{member.primary}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">Alternate Contact</p>
                        <p className="text-xs font-medium text-gray-900">{member.alternate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">Contact Number</p>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-xs font-medium text-gray-900">{member.contact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Response Tab */}
            {activeTab === 'response' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Response Phases</h3>
                  <p className="text-xs text-gray-500 mb-4">Structured response procedures with timelines</p>
                </div>

                <div className="space-y-4">
                  {plan.responsePhases.map((phase, index) => (
                    <div key={index} className="border border-gray-200 rounded-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-gray-900">Phase {index + 1}: {phase.name}</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-sm">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {phase.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-700">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testing Tab */}
            {activeTab === 'testing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Test History</h3>
                  <p className="text-xs text-gray-500 mb-4">Previous tests and exercises for this crisis plan</p>
                </div>

                <div className="space-y-3">
                  {plan.testHistory.map((test, index) => (
                    <div key={index} className="border border-gray-200 rounded-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <BeakerIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-gray-900">{test.type}</p>
                            <p className="text-xs text-gray-500">{test.date}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${
                          test.result === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' :
                          test.result === 'Partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {test.result}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{test.findings}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100">
                  <BeakerIcon className="h-4 w-4" />
                  Schedule New Test
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activate Plan Modal */}
        {showActivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-xl max-w-lg w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Activate Crisis Plan</h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-sm p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900 mb-1">Warning: Crisis Plan Activation</p>
                      <p className="text-xs text-red-700">
                        You are about to activate the crisis management plan for: <strong>{plan.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900 mb-2">This will trigger the following actions:</p>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Notify all {plan.crisisTeam.length} crisis team members via SMS and email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Activate emergency communication channels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Initiate Phase 1: {plan.responsePhases[0].name}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Log activation in crisis management system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Notify regulatory authorities (Ministry of Environment, Water and Agriculture)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-sm p-3 bg-gray-50">
                    <p className="text-xs font-bold text-gray-900 mb-2">Crisis Team to be Notified:</p>
                    <div className="space-y-1">
                      {plan.crisisTeam.slice(0, 3).map((member, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-700">
                          <UsersIcon className="h-3 w-3 text-gray-500" />
                          <span className="font-medium">{member.role}:</span>
                          <span>{member.primary}</span>
                        </div>
                      ))}
                      {plan.crisisTeam.length > 3 && (
                        <p className="text-xs text-gray-500 italic">+ {plan.crisisTeam.length - 3} more team members</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowActivateModal(false)}
                  disabled={activating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivatePlan}
                  disabled={activating}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {activating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Activating...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4" />
                      Confirm Activation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

