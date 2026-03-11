'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { biaService } from '@/services/biaService';
import {
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  InformationCircleIcon,
  CalculatorIcon,
  ArrowsRightLeftIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CogIcon,
  LinkIcon,
  ShieldCheckIcon,
  ServerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon as ExclamationTriangleSolid } from '@heroicons/react/24/solid';

// Comprehensive Demo BIA data for demo mode
const DEMO_BIA_DATA: any = {
  demo: {
    id: 'demo',
    biaName: 'Q4 2024 Financial Operations BIA',
    biaTargetType: 'PROCESS',
    biaTargetId: 'demo-proc-001',
    description: 'Comprehensive Business Impact Analysis for critical financial operations processes including payroll, accounts payable, and financial reporting.',
    biaCoordinator: 'Sarah Johnson',
    biaSecondaryCoordinator: 'Michael Chen',
    businessContinuityAnalyst: 'David Williams',
    champion: 'Sarah Johnson',
    sme: 'Rajesh Kumar',
    status: 'APPROVED',
    finalCriticality: 'CRITICAL',
    finalRtoHours: 24,
    finalRpoHours: 4,
    mtpdHours: 72,
    createdAt: '2024-11-15',
    updatedAt: '2024-11-27',
    fiscalYear: 'FY2025',
    version: 1,
    versionLabel: 'FY2025-1',
    isLatestVersion: true,
    purpose: 'To identify critical financial processes, assess potential impacts of disruptions, and establish recovery time objectives to ensure business continuity.',
    scope: 'This BIA covers all financial operations processes within the Finance department, including payroll processing, accounts payable/receivable, and regulatory reporting.',
    department: 'Finance Department',
    location: 'Headquarters - Building A',
    numberOfEmployees: 45,
    // Processes covered
    processes: [
      { id: 'demo-proc-001', name: 'Payroll Processing', owner: 'Jane Smith', rto: 24, rpo: 4, criticality: 'Critical', mtpd: 72 },
      { id: 'demo-proc-002', name: 'Accounts Payable Processing', owner: 'Michael Chen', rto: 48, rpo: 8, criticality: 'High', mtpd: 168 }
    ],
    // Impact Analysis Matrix
    impactAnalysis: {
      categories: ['Financial', 'Reputational', 'Regulatory', 'Operational', 'Customer'],
      timeframes: ['<4 Hours', '4-24 Hours', '1-3 Days', '4-7 Days', '1-4 Weeks', '>1 Month'],
      matrix: [
        { category: 'Financial', ratings: [2, 3, 4, 5, 5, 5] },
        { category: 'Reputational', ratings: [1, 2, 3, 4, 5, 5] },
        { category: 'Regulatory', ratings: [2, 3, 4, 5, 5, 5] },
        { category: 'Operational', ratings: [2, 3, 4, 5, 5, 5] },
        { category: 'Customer', ratings: [1, 2, 3, 4, 4, 5] }
      ],
      criticalTimeframe: '1-3 Days',
      criticalCategory: 'Regulatory'
    },
    // BETH3V Dependencies
    dependencies: {
      upstreamProcesses: [
        { id: 'up-001', name: 'Time & Attendance', department: 'HR', owner: 'Lisa Chen', rto: 2, isCritical: true },
        { id: 'up-002', name: 'Employee Data Management', department: 'HR', owner: 'Lisa Chen', rto: 4, isCritical: false }
      ],
      downstreamProcesses: [
        { id: 'down-001', name: 'General Ledger Posting', department: 'Finance', owner: 'Mike Johnson', rto: 8, isCritical: true },
        { id: 'down-002', name: 'Financial Reporting', department: 'Finance', owner: 'Mike Johnson', rto: 24, isCritical: false }
      ],
      criticalPeople: [
        { id: 'person-001', name: 'Sarah Johnson', role: 'Finance Manager', department: 'Finance', rto: 4, isCritical: true, isSpof: true },
        { id: 'person-002', name: 'Rajesh Kumar', role: 'IT Manager', department: 'Technology', rto: 2, isCritical: true, isSpof: false }
      ],
      criticalAssets: [
        { id: 'asset-001', name: 'SAP Production Server', type: 'Application', category: 'Technology', rto: 2, isCritical: true, isSpof: true },
        { id: 'asset-002', name: 'Primary Database Server', type: 'Equipment', category: 'Equipment', rto: 1, isCritical: true, isSpof: false },
        { id: 'asset-003', name: 'Banking Portal Access', type: 'Application', category: 'Technology', rto: 4, isCritical: true, isSpof: false }
      ],
      criticalVendors: [
        { id: 'vendor-001', name: 'Payroll Services Inc.', service: 'Payroll Processing Support', sla: '4hr response', rto: 4, isCritical: true },
        { id: 'vendor-002', name: 'First National Bank', service: 'Banking Services', sla: '99.9% uptime', rto: 2, isCritical: true }
      ],
      criticalTechnology: [
        { id: 'tech-001', name: 'SAP ERP System', type: 'Enterprise Application', rto: 2, isCritical: true, isSpof: true }
      ],
      vitalRecords: [
        { id: 'record-001', name: 'Employee Payroll Records', type: 'Digital', status: 'Active', rto: 4, isCritical: true },
        { id: 'record-002', name: 'Tax Filing Documents', type: 'Digital', status: 'Active', rto: 8, isCritical: false }
      ]
    },
    // Staff
    staffList: [
      { id: 'staff-001', name: 'Sarah Johnson', role: 'Finance Manager', department: 'Finance', isKeyPerson: true },
      { id: 'staff-002', name: 'Michael Chen', role: 'Senior Accountant', department: 'Finance', isKeyPerson: true },
      { id: 'staff-003', name: 'Emily Davis', role: 'Payroll Specialist', department: 'Finance', isKeyPerson: false }
    ],
    recoveryStaff: [
      { id: 'recovery-001', name: 'Sarah Johnson', recoveryRole: 'Recovery Team Lead', availabilityHours: 2 },
      { id: 'recovery-002', name: 'Rajesh Kumar', recoveryRole: 'Technical Recovery Lead', availabilityHours: 1 },
      { id: 'recovery-003', name: 'Lisa Chen', recoveryRole: 'HR Liaison', availabilityHours: 4 }
    ],
    // Peak Times
    peakTimes: [
      { id: 1, name: 'Month-End Payroll Processing', rto: 2, rpo: 1, recurrence: 'Monthly', type: 'REGULATORY', isCritical: true },
      { id: 2, name: 'Quarterly Tax Filing', rto: 4, rpo: 2, recurrence: 'Quarterly', type: 'REGULATORY', isCritical: true },
      { id: 3, name: 'Year-End Financial Close', rto: 1, rpo: 0.5, recurrence: 'Yearly', type: 'FINANCIAL', isCritical: true }
    ],
    // SPOF Analysis
    spofAnalysis: {
      people: [{ name: 'Sarah Johnson', risk: 'Only person with SAP payroll module access', mitigation: 'Cross-training Michael Chen' }],
      technology: [{ name: 'SAP Production Server', risk: 'Single point of failure for payroll', mitigation: 'DR site in Dubai' }],
      vendors: []
    },
    // Additional Info
    additionalInfo: {
      businessContext: 'Financial Operations is the backbone of the organization, processing over 5,000 transactions monthly.',
      regulatoryRequirements: 'SOX compliance, Tax regulations, Labor laws, Data protection regulations',
      minimumStaffRequired: 12,
      alternateLocation: 'Building B - Floor 3 / Remote VPN / Dubai DR site'
    },
    // Linked Plans
    linkedPlans: {
      irps: [
        { id: 'IRP-001', name: 'Ransomware Attack Response', type: 'Ransomware', severity: 'Critical', status: 'Approved' },
        { id: 'IRP-002', name: 'Data Breach Containment', type: 'Data Breach', severity: 'Critical', status: 'Approved' }
      ],
      drPlans: [
        { id: 'DR-001', name: 'SAP ERP System Recovery', siteType: 'HOT', rto: '4 Hours', status: 'Approved' }
      ],
      crisisPlaybooks: [
        { id: 'CPB-001', name: 'Trading System Outage Response', severity: 'Critical', status: 'Active' }
      ]
    }
  },
  1: {
    id: 1,
    biaName: 'IT Project Management - Business Impact Analysis',
    biaTargetType: 'PROCESS',
    biaTargetId: 101,
    biaCoordinator: 'John Smith',
    biaSecondaryCoordinator: 'Jane Doe',
    status: 'APPROVED',
    finalCriticality: 'HIGH',
    finalRtoHours: 4,
    finalRpoHours: 2,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
    fiscalYear: 'FY2025',
    version: 3,
    versionLabel: 'FY2025-3',
    isLatestVersion: true
  }
};

export default function BIARecordView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [biaRecord, setBiaRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({ rto: 0, rpo: 0, deps: 0, spof: 0 });

  useEffect(() => {
    loadBIAData();
  }, [params.id]);

  // Animate stats on load
  useEffect(() => {
    if (biaRecord) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setAnimatedStats({
          rto: Math.round(eased * (biaRecord.finalRtoHours || 0)),
          rpo: Math.round(eased * (biaRecord.finalRpoHours || 0)),
          deps: Math.round(eased * getTotalDependencies()),
          spof: Math.round(eased * getSpofCount())
        });

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [biaRecord]);

  const getTotalDependencies = () => {
    if (!biaRecord?.dependencies) return 0;
    const d = biaRecord.dependencies;
    return (d.upstreamProcesses?.length || 0) + (d.downstreamProcesses?.length || 0) +
           (d.criticalPeople?.length || 0) + (d.criticalAssets?.length || 0) +
           (d.criticalVendors?.length || 0) + (d.criticalTechnology?.length || 0) +
           (d.vitalRecords?.length || 0);
  };

  const getSpofCount = () => {
    if (!biaRecord?.dependencies) return 0;
    let count = 0;
    const d = biaRecord.dependencies;
    d.criticalPeople?.forEach((p: any) => { if (p.isSpof) count++; });
    d.criticalAssets?.forEach((a: any) => { if (a.isSpof) count++; });
    d.criticalTechnology?.forEach((t: any) => { if (t.isSpof) count++; });
    return count;
  };

  const loadBIAData = async () => {
    try {
      setLoading(true);
      const id = params.id;

      // Check for demo mode
      if (id === 'demo' || DEMO_BIA_DATA[id]) {
        console.log('🎬 Loading demo BIA data for ID:', id);
        setBiaRecord(DEMO_BIA_DATA[id] || DEMO_BIA_DATA['demo']);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch BIA record from backend
      const bia = await biaService.getById(parseInt(id));
      setBiaRecord(bia);
      setError(null);
    } catch (err) {
      console.error('Error loading BIA data:', err);
      setError('Failed to load BIA record');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading BIA record...</p>
        </div>
      </div>
    );
  }

  if (error || !biaRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Error Loading BIA</p>
          <p className="mt-2 text-sm text-gray-600">{error || 'BIA record not found'}</p>
          <button
            onClick={() => router.push('/bia-records')}
            className="mt-4 px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800"
          >
            Back to BIA Records
          </button>
        </div>
      </div>
    );
  }

  // Impact rating color helper
  const getImpactColor = (rating: number) => {
    if (rating >= 4) return 'bg-red-500';
    if (rating >= 3) return 'bg-orange-400';
    if (rating >= 2) return 'bg-amber-300';
    return 'bg-green-300';
  };

  return (
    <div className="px-6 py-6 space-y-4">
      {/* Clean Header - Matching App Style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/bia-records')}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back
          </button>
          <div className="border-l border-gray-300 h-6"></div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{biaRecord.biaName}</h1>
            <p className="mt-0.5 text-xs text-gray-500">{biaRecord.description || 'Business Impact Analysis Record'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {biaRecord.versionLabel && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{biaRecord.versionLabel}</span>
          )}
          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
            biaRecord.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
            biaRecord.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {biaRecord.status.replace('_', ' ')}
          </span>
          {biaRecord.finalCriticality && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
              biaRecord.finalCriticality === 'Critical' ? 'bg-red-100 text-red-700' :
              biaRecord.finalCriticality === 'High' ? 'bg-orange-100 text-orange-700' :
              biaRecord.finalCriticality === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {biaRecord.finalCriticality}
            </span>
          )}
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-3.5 w-3.5 mr-1" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <UsersIcon className="h-3.5 w-3.5" />
          <span>{biaRecord.biaCoordinator}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BuildingOfficeIcon className="h-3.5 w-3.5" />
          <span>{biaRecord.department || biaRecord.biaTargetType}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>Updated: {biaRecord.updatedAt}</span>
        </div>
      </div>

      {/* KPI Cards - Clean Style */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">RTO</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold text-gray-900">{animatedStats.rto || biaRecord.finalRtoHours || 0}</p>
            <span className="text-xs text-gray-500">hours</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">RPO</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold text-gray-900">{animatedStats.rpo || biaRecord.finalRpoHours || 0}</p>
            <span className="text-xs text-gray-500">hours</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">MTPD</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold text-gray-900">{biaRecord.mtpdHours || 72}</p>
            <span className="text-xs text-gray-500">hours</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Dependencies</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold text-gray-900">{animatedStats.deps || getTotalDependencies()}</p>
            <span className="text-xs text-gray-500">total</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">SPOF Risks</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold text-red-600">{animatedStats.spof || getSpofCount()}</p>
            <span className="text-xs text-gray-500">identified</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 px-2">
            {[
              { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
              { id: 'dependency-graph', name: 'Dependency Graph', icon: ArrowsRightLeftIcon },
              { id: 'dependencies', name: 'BETH3V Details', icon: CogIcon },
              { id: 'impact', name: 'Impact Analysis', icon: CalculatorIcon },
              { id: 'peak-times', name: 'Peak Times', icon: ClockIcon },
              { id: 'staff', name: 'Staff & Recovery', icon: UserGroupIcon },
              { id: 'additional', name: 'Additional Info', icon: DocumentTextIcon },
              { id: 'linked-plans', name: 'Linked Plans', icon: LinkIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                } whitespace-nowrap py-3 px-4 font-medium text-xs flex items-center`}
              >
                <tab.icon className="h-3.5 w-3.5 mr-1.5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{biaRecord.description || biaRecord.purpose || 'This Business Impact Analysis identifies critical processes, assesses potential impacts of disruptions, and establishes recovery objectives to ensure business continuity.'}</p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Basic Info Card */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h4 className="text-xs font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Target Type</span>
                      <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{biaRecord.biaTargetType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Department</span>
                      <span className="text-xs font-medium text-gray-900">{biaRecord.department || 'Finance'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Location</span>
                      <span className="text-xs font-medium text-gray-900">{biaRecord.location || 'Headquarters'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-gray-500">Employees</span>
                      <span className="text-xs font-medium text-gray-900">{biaRecord.numberOfEmployees || 45}</span>
                    </div>
                  </div>
                </div>

                {/* Team Card */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h4 className="text-xs font-semibold text-gray-900 mb-3">BIA Team</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-600">{(biaRecord.biaCoordinator || 'SJ').split(' ').map((n: string) => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{biaRecord.biaCoordinator}</p>
                        <p className="text-[10px] text-gray-500">Primary Coordinator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-600">{(biaRecord.biaSecondaryCoordinator || 'MC').split(' ').map((n: string) => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{biaRecord.biaSecondaryCoordinator}</p>
                        <p className="text-[10px] text-gray-500">Secondary Coordinator</p>
                      </div>
                    </div>
                    {biaRecord.champion && (
                      <div className="flex items-center gap-2 py-1.5">
                        <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-medium text-gray-600">{biaRecord.champion.split(' ').map((n: string) => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{biaRecord.champion}</p>
                          <p className="text-[10px] text-gray-500">Champion</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recovery Objectives Card */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h4 className="text-xs font-semibold text-gray-900 mb-3">Recovery Objectives</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-medium text-gray-700">RTO</span>
                        <p className="text-[10px] text-gray-500">Recovery Time Objective</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{biaRecord.finalRtoHours}h</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-medium text-gray-700">RPO</span>
                        <p className="text-[10px] text-gray-500">Recovery Point Objective</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{biaRecord.finalRpoHours}h</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">MTPD</span>
                        <p className="text-[10px] text-gray-500">Max Tolerable Period</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{biaRecord.mtpdHours || 72}h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processes Covered */}
              {biaRecord.processes && biaRecord.processes.length > 0 && (
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Processes Covered</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.processes.length} processes</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[30%]">Process</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[20%]">Owner</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[14%]">Criticality</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[12%]">RTO</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[12%]">RPO</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[12%]">MTPD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {biaRecord.processes.map((proc: any, idx: number) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-xs font-medium text-gray-900">{proc.name}</td>
                            <td className="px-2 py-2 text-xs text-gray-600">{proc.owner}</td>
                            <td className="px-2 py-2 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded ${proc.criticality === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                {proc.criticality}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-center text-xs font-medium text-gray-900">{proc.rto}h</td>
                            <td className="px-2 py-2 text-center text-xs font-medium text-gray-900">{proc.rpo}h</td>
                            <td className="px-2 py-2 text-center text-xs font-medium text-gray-900">{proc.mtpd}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dependency Graph Tab - Clean Flow-Based Design */}
          {activeTab === 'dependency-graph' && biaRecord.dependencies && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Process Dependency Flow</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Dependencies that feed into and depend on this process</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> SPOF
                  </span>
                </div>
              </div>

              {/* Flow Chart - SVG Graph with Connecting Lines */}
              <div className="border border-gray-200 rounded-sm bg-white p-6 overflow-x-auto">
                <div className="relative min-w-[800px]">
                  {/* SVG Layer for connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '400px' }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                      </marker>
                      <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
                      </marker>
                    </defs>
                    {/* Upstream to Center lines */}
                    {biaRecord.dependencies.upstreamProcesses?.map((p: any, i: number) => {
                      const upstreamCount = biaRecord.dependencies.upstreamProcesses?.length || 1;
                      const startY = 80 + i * 70;
                      const endY = 80 + ((upstreamCount - 1) / 2) * 70;
                      return (
                        <path
                          key={`line-up-${i}`}
                          d={`M 200 ${startY} C 280 ${startY}, 320 ${endY}, 400 ${endY}`}
                          fill="none"
                          stroke={p.isCritical ? '#EF4444' : '#D1D5DB'}
                          strokeWidth={p.isCritical ? 2 : 1.5}
                          markerEnd={p.isCritical ? 'url(#arrowhead-critical)' : 'url(#arrowhead)'}
                        />
                      );
                    })}
                    {/* Center to Downstream lines */}
                    {biaRecord.dependencies.downstreamProcesses?.map((p: any, i: number) => {
                      const upstreamCount = biaRecord.dependencies.upstreamProcesses?.length || 1;
                      const startY = 80 + ((upstreamCount - 1) / 2) * 70;
                      const endY = 80 + i * 70;
                      return (
                        <path
                          key={`line-down-${i}`}
                          d={`M 600 ${startY} C 680 ${startY}, 720 ${endY}, 800 ${endY}`}
                          fill="none"
                          stroke={p.isCritical ? '#EF4444' : '#D1D5DB'}
                          strokeWidth={p.isCritical ? 2 : 1.5}
                          markerEnd={p.isCritical ? 'url(#arrowhead-critical)' : 'url(#arrowhead)'}
                        />
                      );
                    })}
                  </svg>

                  {/* Node Layer */}
                  <div className="relative flex items-start justify-between" style={{ minHeight: '400px' }}>
                    {/* UPSTREAM COLUMN */}
                    <div className="w-[200px] flex-shrink-0">
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-medium rounded">
                          ← UPSTREAM
                        </span>
                        <p className="text-[9px] text-gray-400 mt-1">Feeds into this process</p>
                      </div>
                      <div className="space-y-3">
                        {biaRecord.dependencies.upstreamProcesses?.map((p: any, i: number) => (
                          <div
                            key={`up-${i}`}
                            className={`border rounded-sm p-3 shadow-sm transition-all hover:shadow-md ${p.isCritical ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{p.department}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-medium text-gray-600 whitespace-nowrap">RTO: {p.rto}h</span>
                                {p.isCritical && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                              </div>
                            </div>
                          </div>
                        )) || <p className="text-xs text-gray-400 text-center py-8">No upstream</p>}
                      </div>
                    </div>

                    {/* CENTER - THE PROCESS */}
                    <div className="w-[200px] flex-shrink-0 flex flex-col items-center justify-center">
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-900 text-white text-[10px] font-medium rounded">
                          THIS PROCESS
                        </span>
                      </div>
                      <div className="w-full border-2 border-gray-900 rounded-sm p-4 bg-gray-50 shadow-lg">
                        <p className="text-sm font-semibold text-gray-900 text-center leading-tight">{biaRecord.biaName.split(' ').slice(0, 3).join(' ')}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                          <div className="bg-white rounded p-2 border border-gray-200">
                            <p className="text-lg font-bold text-gray-900">{biaRecord.finalRtoHours || 24}h</p>
                            <p className="text-[10px] text-gray-500">RTO</p>
                          </div>
                          <div className="bg-white rounded p-2 border border-gray-200">
                            <p className="text-lg font-bold text-gray-900">{biaRecord.finalRpoHours || 4}h</p>
                            <p className="text-[10px] text-gray-500">RPO</p>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${
                            biaRecord.criticality === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            biaRecord.criticality === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {biaRecord.criticality || 'HIGH'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DOWNSTREAM COLUMN */}
                    <div className="w-[200px] flex-shrink-0">
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-medium rounded">
                          DOWNSTREAM →
                        </span>
                        <p className="text-[9px] text-gray-400 mt-1">Depends on this process</p>
                      </div>
                      <div className="space-y-3">
                        {biaRecord.dependencies.downstreamProcesses?.map((p: any, i: number) => (
                          <div
                            key={`down-${i}`}
                            className={`border rounded-sm p-3 shadow-sm transition-all hover:shadow-md ${p.isCritical ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{p.department}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-medium text-gray-600 whitespace-nowrap">RTO: {p.rto}h</span>
                                {p.isCritical && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                              </div>
                            </div>
                          </div>
                        )) || <p className="text-xs text-gray-400 text-center py-8">No downstream</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Dependencies - Grid Layout */}
              <div className="grid grid-cols-4 gap-3">
                {/* People */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-700 uppercase">Human Resources</span>
                      <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalPeople?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {biaRecord.dependencies.criticalPeople?.map((p: any, i: number) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded ${p.isSpof ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{p.role}</p>
                        </div>
                        {p.isSpof && <span className="text-[9px] font-medium text-amber-600 ml-1">SPOF</span>}
                      </div>
                    )) || <p className="text-[10px] text-gray-400 text-center py-2">None</p>}
                  </div>
                </div>

                {/* Assets */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-700 uppercase">Equipment & Assets</span>
                      <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalAssets?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {biaRecord.dependencies.criticalAssets?.map((a: any, i: number) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded ${a.isSpof ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 truncate">{a.name}</p>
                          <p className="text-[10px] text-gray-500">RTO: {a.rto}h</p>
                        </div>
                        {a.isSpof && <span className="text-[9px] font-medium text-amber-600 ml-1">SPOF</span>}
                      </div>
                    )) || <p className="text-[10px] text-gray-400 text-center py-2">None</p>}
                  </div>
                </div>

                {/* Vendors */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-700 uppercase">3rd Party / Vendors</span>
                      <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalVendors?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {biaRecord.dependencies.criticalVendors?.map((v: any, i: number) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded ${v.isCritical ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 truncate">{v.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{v.sla}</p>
                        </div>
                        {v.isCritical && <span className="w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
                      </div>
                    )) || <p className="text-[10px] text-gray-400 text-center py-2">None</p>}
                  </div>
                </div>

                {/* Vital Records */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-700 uppercase">Vital Records</span>
                      <span className="text-[10px] text-gray-500">{biaRecord.dependencies.vitalRecords?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {biaRecord.dependencies.vitalRecords?.map((r: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 truncate">{r.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{r.type}</p>
                        </div>
                      </div>
                    )) || <p className="text-[10px] text-gray-400 text-center py-2">None</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BETH3V Details Tab */}
          {activeTab === 'dependencies' && biaRecord.dependencies && (
            <div className="space-y-4">
              {/* Process Dependencies */}
              <div className="grid grid-cols-2 gap-4">
                {/* Upstream */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Upstream Processes</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.upstreamProcesses?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.upstreamProcesses?.map((p: any, i: number) => (
                      <div key={i} className={`border rounded-sm p-2.5 ${p.isCritical ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900">{p.name}</p>
                          <span className="text-[10px] text-gray-500">RTO: {p.rto}h</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{p.department}</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
                {/* Downstream */}
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Downstream Processes</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.downstreamProcesses?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.downstreamProcesses?.map((p: any, i: number) => (
                      <div key={i} className={`border rounded-sm p-2.5 ${p.isCritical ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900">{p.name}</p>
                          <span className="text-[10px] text-gray-500">RTO: {p.rto}h</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{p.department}</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
              </div>

              {/* People */}
              <div className="border border-gray-200 rounded-sm bg-white">
                <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Critical People</span>
                  <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalPeople?.length || 0}</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {biaRecord.dependencies.criticalPeople?.map((p: any, i: number) => (
                      <div key={i} className={`border rounded-sm p-2.5 ${p.isSpof ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-medium text-gray-600">{p.name.split(' ').map((n: string) => n[0]).join('')}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{p.role}</p>
                          </div>
                          {p.isSpof && <span className="text-[9px] font-medium text-amber-600">SPOF</span>}
                        </div>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4 col-span-3">None</p>}
                  </div>
                </div>
              </div>

              {/* Assets & Technology */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Critical Assets</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalAssets?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.criticalAssets?.map((a: any, i: number) => (
                      <div key={i} className={`border rounded-sm p-2.5 ${a.isSpof ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900">{a.name}</p>
                          {a.isSpof && <span className="text-[9px] font-medium text-amber-600">SPOF</span>}
                        </div>
                        <p className="text-[10px] text-gray-500">{a.type} • RTO: {a.rto}h</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Critical Technology</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalTechnology?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.criticalTechnology?.map((t: any, i: number) => (
                      <div key={i} className={`border rounded-sm p-2.5 ${t.isSpof ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900">{t.name}</p>
                          {t.isSpof && <span className="text-[9px] font-medium text-amber-600">SPOF</span>}
                        </div>
                        <p className="text-[10px] text-gray-500">{t.type} • RTO: {t.rto}h</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
              </div>

              {/* Vendors & Vital Records */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Critical Vendors</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.criticalVendors?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.criticalVendors?.map((v: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-sm p-2.5">
                        <p className="text-xs font-medium text-gray-900">{v.name}</p>
                        <p className="text-[10px] text-gray-500">{v.service} • SLA: {v.sla}</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Vital Records</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.dependencies.vitalRecords?.length || 0}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {biaRecord.dependencies.vitalRecords?.map((r: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-sm p-2.5">
                        <p className="text-xs font-medium text-gray-900">{r.name}</p>
                        <p className="text-[10px] text-gray-500">{r.type} • {r.status}</p>
                      </div>
                    )) || <p className="text-xs text-gray-400 text-center py-4">None</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Impact Analysis Tab */}
          {activeTab === 'impact' && biaRecord.impactAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Impact Analysis Matrix</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Impact ratings across categories and timeframes</p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400"></span> Low</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400"></span> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> High</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> Critical</span>
                </div>
              </div>

              {/* Impact Matrix Table */}
              <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-700 uppercase">Category</th>
                      {biaRecord.impactAnalysis.timeframes.map((tf: string, i: number) => (
                        <th key={i} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700">{tf}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {biaRecord.impactAnalysis.matrix.map((row: any, i: number) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-xs font-medium text-gray-900">{row.category}</td>
                        {row.ratings.map((rating: number, j: number) => (
                          <td key={j} className="px-2 py-2 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-semibold text-white ${getImpactColor(rating)}`}>
                              {rating}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Critical Threshold */}
              <div className="border border-red-200 rounded-sm bg-red-50 p-3 flex items-center gap-3">
                <ExclamationTriangleSolid className="h-5 w-5 text-red-600 flex-shrink-0"/>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Critical threshold reached at <span className="text-red-600">{biaRecord.impactAnalysis.criticalTimeframe}</span> for <span className="text-red-600">{biaRecord.impactAnalysis.criticalCategory}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">This determines the MTPD for this process.</p>
                </div>
              </div>
            </div>
          )}

          {/* Peak Times Tab */}
          {activeTab === 'peak-times' && biaRecord.peakTimes && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Peak Times & Critical Deadlines</h3>
              <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-700 uppercase w-[30%]">Name</th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700 uppercase w-[12%]">RTO</th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700 uppercase w-[12%]">RPO</th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700 uppercase w-[18%]">Recurrence</th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700 uppercase w-[14%]">Type</th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-700 uppercase w-[14%]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biaRecord.peakTimes.map((pt: any, i: number) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-xs font-medium text-gray-900">{pt.name}</td>
                        <td className="px-2 py-2 text-center text-xs text-gray-700">{pt.rto}h</td>
                        <td className="px-2 py-2 text-center text-xs text-gray-700">{pt.rpo}h</td>
                        <td className="px-2 py-2 text-center text-xs text-gray-500">{pt.recurrence}</td>
                        <td className="px-2 py-2 text-center">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded ${pt.type === 'REGULATORY' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {pt.type}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          {pt.isCritical ? (
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-red-100 text-red-700">Critical</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-gray-100 text-gray-600">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Staff & Recovery Tab */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              {/* Staff List */}
              {biaRecord.staffList && (
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Staff List</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.staffList.length} members</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[25%]">Name</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[20%]">Role</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[18%]">Department</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[12%]">Key Person</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[25%]">Responsibilities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {biaRecord.staffList.map((s: any, i: number) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-xs font-medium text-gray-900">{s.name}</td>
                            <td className="px-2 py-2 text-xs text-gray-600">{s.role}</td>
                            <td className="px-2 py-2 text-xs text-gray-500">{s.department}</td>
                            <td className="px-2 py-2 text-center">
                              {s.isKeyPerson && <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700">Yes</span>}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-500 truncate">{s.responsibilities || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recovery Staff */}
              {biaRecord.recoveryStaff && (
                <div className="border border-gray-200 rounded-sm bg-white">
                  <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Recovery Team</span>
                    <span className="text-[10px] text-gray-500">{biaRecord.recoveryStaff.length} members</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[25%]">Name</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[25%]">Recovery Role</th>
                          <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase w-[15%]">Availability</th>
                          <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase w-[35%]">Skills</th>
                        </tr>
                      </thead>
                      <tbody>
                        {biaRecord.recoveryStaff.map((s: any, i: number) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-xs font-medium text-gray-900">{s.name}</td>
                            <td className="px-2 py-2 text-xs text-gray-600">{s.recoveryRole}</td>
                            <td className="px-2 py-2 text-center text-xs text-gray-700">{s.availabilityHours}h</td>
                            <td className="px-2 py-2 text-xs text-gray-500 truncate">{s.skills || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Info Tab */}
          {activeTab === 'additional' && biaRecord.additionalInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-sm bg-white p-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Business Context</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{biaRecord.additionalInfo.businessContext}</p>
                </div>
                <div className="border border-gray-200 rounded-sm bg-white p-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Regulatory Requirements</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{biaRecord.additionalInfo.regulatoryRequirements}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-sm bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{biaRecord.additionalInfo.minimumStaffRequired}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Minimum Staff Required</p>
                </div>
                <div className="border border-gray-200 rounded-sm bg-white p-4 col-span-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Alternate Work Location</h4>
                  <p className="text-xs text-gray-600">{biaRecord.additionalInfo.alternateLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Linked Plans Tab */}
          {activeTab === 'linked-plans' && (
            <div className="space-y-4">
              {/* Summary Banner */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Cross-Module Linkages</h3>
                      <p className="text-xs text-gray-600">Plans and playbooks that reference this BIA record</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-gray-600">IRP Module</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">IT DR Module</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-gray-600">Crisis Management</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incident Response Plans */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Incident Response Plans</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                      IRP Module
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{biaRecord.linkedPlans?.irps?.length || 0} plans</span>
                </div>
                {biaRecord.linkedPlans?.irps?.length > 0 ? (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">ID</th>
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Name</th>
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Type</th>
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Severity</th>
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                            <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {biaRecord.linkedPlans.irps.map((irp: any) => (
                            <tr key={irp.id} className="hover:bg-gray-50">
                              <td className="py-2 px-3 text-xs font-medium text-blue-600">{irp.id}</td>
                              <td className="py-2 px-3 text-xs text-gray-900">{irp.name}</td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                  {irp.type}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                  {irp.severity}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                  {irp.status}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <a href={`/bcp/scenarios/${irp.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                  View IRP →
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ShieldCheckIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-xs text-gray-500">No IRPs reference this BIA record</p>
                  </div>
                )}
              </div>

              {/* IT DR Plans */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ServerIcon className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">IT DR Plans</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      IT DR Module
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{biaRecord.linkedPlans?.drPlans?.length || 0} plans</span>
                </div>
                {biaRecord.linkedPlans?.drPlans?.length > 0 ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {biaRecord.linkedPlans.drPlans.map((dr: any) => (
                        <div key={dr.id} className="p-3 bg-gray-50 rounded-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-blue-600">{dr.id}</span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-sm ${
                              dr.siteType === 'HOT' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                            }`}>{dr.siteType}</span>
                          </div>
                          <p className="text-xs text-gray-900 font-medium mb-1">{dr.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">RTO: {dr.rto}</span>
                            <a href={`/it-dr-plans/${dr.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              View Plan →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ServerIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-xs text-gray-500">No IT DR Plans reference this BIA record</p>
                  </div>
                )}
              </div>

              {/* Crisis Playbooks */}
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BoltIcon className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Crisis Playbooks</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Crisis Management
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{biaRecord.linkedPlans?.crisisPlaybooks?.length || 0} playbooks</span>
                </div>
                {biaRecord.linkedPlans?.crisisPlaybooks?.length > 0 ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {biaRecord.linkedPlans.crisisPlaybooks.map((pb: any) => (
                        <div key={pb.id} className="p-3 bg-gray-50 rounded-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-amber-600">{pb.id}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                              {pb.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-900 font-medium mb-2">{pb.name}</p>
                          <a href={`/crisis-management/playbooks/${pb.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            View Playbook →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <BoltIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-xs text-gray-500">No Crisis Playbooks reference this BIA record</p>
                  </div>
                )}
              </div>

              {/* Linkage Flow */}
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">How This BIA Connects</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex flex-col items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                      <span className="text-[10px] font-medium text-gray-600 mt-1">BIA</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">This Record</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="text-gray-400">→</div>
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                      <span className="text-[10px] font-medium text-red-600 mt-1">IRP</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">{biaRecord.linkedPlans?.irps?.length || 0} plans</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="text-gray-400">→</div>
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex flex-col items-center justify-center">
                      <ServerIcon className="h-6 w-6 text-blue-600" />
                      <span className="text-[10px] font-medium text-blue-600 mt-1">IT DR</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">{biaRecord.linkedPlans?.drPlans?.length || 0} plans</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="text-gray-400">→</div>
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex flex-col items-center justify-center">
                      <BoltIcon className="h-6 w-6 text-amber-600" />
                      <span className="text-[10px] font-medium text-amber-600 mt-1">Crisis</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">{biaRecord.linkedPlans?.crisisPlaybooks?.length || 0} playbooks</span>
                  </div>
                </div>
                <p className="text-center text-[10px] text-gray-500 mt-4">
                  BIA provides RTO/RPO/Criticality → IRP uses for response prioritization → IT DR for system recovery → Crisis for organization-level response
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
