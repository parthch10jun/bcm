'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImpactAnalysisMatrix, MTDPCalculation, RTODetermination } from '@/types/bia';
import { OrgChartSelection } from '@/types/organizational-chart';
import DepartmentSelector from '@/components/DepartmentSelector';
import ProcessRollupReference from '@/components/ProcessRollupReference';
import { DepartmentBIAPrecedence, ProcessRollupData } from '@/types/department-bia';
import { BIATemplate, BIACreationContext, OrganizationalLevel } from '@/types/biaTemplate';
import biaTemplateService from '@/services/biaTemplateService';
import { peakTimeService, PeakTime } from '@/services/peakTimeService';
import { processService } from '@/services/processService';
import { userService } from '@/services/userService';
import { assetService } from '@/services/assetService';
import { vendorService } from '@/services/vendorService';
import { vitalRecordService } from '@/services/vitalRecordService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { golfSaudiLocationService, GolfSaudiLocation } from '@/services/golfSaudiLocationService';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { getBIAPermissions, getActionDescription, canAccessBIAWizard } from '@/utils/biaPermissions';
import { Process } from '@/types/process';
import { User } from '@/types/user';
import { Asset } from '@/types/asset';
import { Vendor } from '@/types/vendor';
import { VitalRecord } from '@/types/vitalRecord';
import { OrganizationalUnit } from '@/types/organizationalUnit';
import { useBIAAutoSave } from '@/hooks/useBIAAutoSave';
import BIASaveIndicator from '@/components/BIASaveIndicator';
import { biaService } from '@/services/biaService';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  TrashIcon,
  CalculatorIcon,
  CheckCircleIcon,
  CogIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ServerIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PencilIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Mock library data for BETH3V framework
const mockProcessLibrary = [
  { id: 'proc-001', name: 'Payroll Processing', department: 'Finance', owner: 'Jane Smith', approvedRTO: 4 },
  { id: 'proc-002', name: 'Customer Support', department: 'Operations', owner: 'John Doe', approvedRTO: 2 },
  { id: 'proc-003', name: 'Financial Reporting', department: 'Finance', owner: 'Mike Johnson', approvedRTO: 8 },
  { id: 'proc-004', name: 'Order Processing', department: 'Sales', owner: 'Sarah Wilson', approvedRTO: 1 },
  { id: 'proc-005', name: 'Inventory Management', department: 'Operations', owner: 'David Brown', approvedRTO: 6 },
  { id: 'proc-006', name: 'Employee Data Management', department: 'HR', owner: 'Lisa Chen', approvedRTO: 12 },
  { id: 'proc-007', name: 'Network Infrastructure', department: 'IT', owner: 'Mark Rodriguez', approvedRTO: 0.5 },
  { id: 'proc-008', name: 'Database Backup', department: 'IT', owner: 'Alex Kumar', approvedRTO: 24 }
];

const mockPeopleLibrary = [
  { id: 'person-001', name: 'Sarah Johnson', role: 'Finance Manager', department: 'Finance', email: 'sarah.johnson@company.com' },
  { id: 'person-002', name: 'Rajesh Kumar', role: 'IT Manager', department: 'Technology', email: 'rajesh.kumar@company.com' },
  { id: 'person-003', name: 'Priya Sharma', role: 'Operations Manager', department: 'Operations', email: 'priya.sharma@company.com' },
  { id: 'person-004', name: 'Amit Singh', role: 'Security Officer', department: 'Security', email: 'amit.singh@company.com' },
  { id: 'person-005', name: 'Neha Patel', role: 'HR Manager', department: 'Human Resources', email: 'neha.patel@company.com' }
];

const mockAssetLibrary = [
  { id: 'asset-001', name: 'SAP Production Server', type: 'Application', category: 'Technology', criticality: 'Critical' },
  { id: 'asset-002', name: 'Primary Database Server', type: 'Equipment', category: 'Equipment', criticality: 'Critical' },
  { id: 'asset-003', name: 'Gurugram Head Office', type: 'Building', category: 'Buildings', criticality: 'High' },
  { id: 'asset-004', name: 'Customer Database', type: 'Vital Records', category: 'Vital Records', criticality: 'Critical' },
  { id: 'asset-005', name: 'Network Infrastructure', type: 'Equipment', category: 'Equipment', criticality: 'High' },
  { id: 'asset-006', name: 'Salesforce CRM', type: 'Application', category: 'Technology', criticality: 'High' }
];

const mockVendorLibrary = [
  { id: 'vendor-001', name: 'Salesforce', service: 'CRM Platform', sla: 'Yes - 99.9% uptime', criticality: 'High' },
  { id: 'vendor-002', name: 'AWS', service: 'Cloud Infrastructure', sla: 'Yes - 99.99% uptime', criticality: 'Critical' },
  { id: 'vendor-003', name: 'Microsoft', service: 'Office 365', sla: 'Yes - 99.9% uptime', criticality: 'Medium' },
  { id: 'vendor-004', name: 'SecureGuard Services', service: 'Physical Security', sla: 'Yes - 24/7 response', criticality: 'High' },
  { id: 'vendor-005', name: 'TechCorp Solutions', service: 'IT Support', sla: 'Yes - 4hr response', criticality: 'Medium' }
];

// Mock configuration data (would come from settings)
const impactCategories = ['Financial', 'Reputational', 'Regulatory', 'Operational', 'Customer'];
const timeframes = ['<4 Hours', '4-24 Hours', '1-3 Days', '4-7 Days', '1-4 Weeks', '>1 Month'];
const criticalityThreshold = 4; // Rating of 4 or higher triggers MTPD calculation

// RTO Calculation Configuration
const RTO_CALCULATION_METHODS = {
  T_MINUS_1: 'T-1 Template',
  PERCENTAGE: 'Percentage Template'
};

// Default percentage for RTO calculation (configurable in settings)
const DEFAULT_RTO_PERCENTAGE = 50; // 50% of MTPD

// Timeframe mapping for T-1 calculation (in hours)
const TIMEFRAME_HOURS = {
  '<4 Hours': 4,
  '4-24 Hours': 24,
  '1-3 Days': 72,
  '4-7 Days': 168,
  '1-4 Weeks': 672,
  '>1 Month': 720
};

const mockProcesses = [
  { id: 'proc-001', name: 'Payroll Processing', owner: 'Jane Smith' },
  { id: 'proc-002', name: 'Customer Support', owner: 'John Doe' },
  { id: 'proc-003', name: 'Order Processing', owner: 'Mike Johnson' }
];

function NewBIARecordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editRecordId = searchParams.get('edit');
  const processId = searchParams.get('process');
  const { currentUser } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0); // Start with step 0 for BIA type selection

  // BIA Record ID (for draft saving)
  const [biaRecordId, setBiaRecordId] = useState<number | null>(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // BIA Type Selection
  const [biaType, setBiaType] = useState<'process' | 'location' | 'department' | 'asset' | 'service' | 'vendor' | 'vital-record' | ''>('');

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<BIATemplate | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<BIATemplate[]>([]);
  const [biaCreationContext, setBiaCreationContext] = useState<BIACreationContext | null>(null);

  // Library Data from Backend
  const [processesLibrary, setProcessesLibrary] = useState<Process[]>([]);
  const [usersLibrary, setUsersLibrary] = useState<User[]>([]);
  const [assetsLibrary, setAssetsLibrary] = useState<Asset[]>([]);
  const [vendorsLibrary, setVendorsLibrary] = useState<Vendor[]>([]);
  const [vitalRecordsLibrary, setVitalRecordsLibrary] = useState<VitalRecord[]>([]);
  const [departmentsLibrary, setDepartmentsLibrary] = useState<OrganizationalUnit[]>([]);
  const [golfSaudiLocations, setGolfSaudiLocations] = useState<GolfSaudiLocation[]>([]);
  const [librariesLoading, setLibrariesLoading] = useState(false);

  // Basic Information (Golf Saudi Enhanced)
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    businessCoordinator: '',
    secondaryCoordinator: '',
    businessContinuityAnalyst: '',
    purpose: '',
    scope: '',
    analysisJustification: '',
    owner: '',
    // Golf Saudi Workflow Fields
    championId: '',
    championName: '',
    smeId: '',
    smeName: '',
    // Department/Division Profile Fields (for Initiate stage)
    departmentDescription: '',
    departmentLocation: '',
    numberOfEmployees: 0
  });

  // Golf Saudi Workflow State Management
  type WorkflowStage = 'INITIATE' | 'COMPLETE' | 'REVIEW' | 'VERIFICATION' | 'APPROVAL' | 'APPROVED';
  type WorkflowStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'IN_VERIFICATION' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('INITIATE');
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('DRAFT');
  const [workflowComments, setWorkflowComments] = useState<Array<{
    id: string;
    commentText: string;
    commentType: 'GENERAL' | 'CHANGE_REQUEST' | 'APPROVAL' | 'REJECTION';
    isChangeRequest: boolean;
    changeRequestStatus?: 'PENDING' | 'ADDRESSED' | 'REJECTED';
    commentedBy: string;
    commentedAt: string;
  }>>([]);

  // Get current user role from context
  const currentUserRole = currentUser?.role || 'CHAMPION';

  // Selected Processes (Multi-Process BIA Support - V9 Migration)
  // All processes contribute equally - no primary designation
  const [selectedProcesses, setSelectedProcesses] = useState<Array<{
    processId: string;
    processName: string;
    processOwner: string;
    selectionReason: string;
  }>>([]);

  // Active process for multi-process impact analysis (which process tab is currently active)
  const [activeProcessIndex, setActiveProcessIndex] = useState<number>(0);

  // Selected Department (For Department Level BIA)
  const [selectedDepartment, setSelectedDepartment] = useState<OrgChartSelection | null>(null);
  const [processRollupData, setProcessRollupData] = useState<ProcessRollupData | null>(null);

  // Handler for department selection with rollup calculation
  const handleDepartmentSelection = (selection: OrgChartSelection | null) => {
    setSelectedDepartment(selection);

    // Calculate process rollup data for the selected department
    if (selection) {
      // Mock process data for the selected department
      const mockProcessBIAs = [
        {
          id: 'proc-1',
          processName: 'Sample Process 1',
          rto: 4,
          rpo: 2,
          mtpd: 24,
          criticality: { tier: 'Tier 1 (Critical)', score: 32 },
          owner: 'Process Owner 1',
          lastUpdated: new Date(),
          dependencies: {
            criticalPeople: [{ name: 'John Doe', role: 'Manager', requiredRTO: 4 }],
            criticalAssets: [{ name: 'System A', type: 'Application', requiredRTO: 4 }],
            criticalVendors: [{ name: 'Vendor X', service: 'Service Y', requiredRTO: 4 }]
          }
        },
        {
          id: 'proc-2',
          processName: 'Sample Process 2',
          rto: 8,
          rpo: 4,
          mtpd: 48,
          criticality: { tier: 'Tier 2 (High)', score: 24 },
          owner: 'Process Owner 2',
          lastUpdated: new Date(),
          dependencies: {
            criticalPeople: [{ name: 'Jane Smith', role: 'Analyst', requiredRTO: 8 }],
            criticalAssets: [{ name: 'System B', type: 'Database', requiredRTO: 8 }],
            criticalVendors: [{ name: 'Vendor Y', service: 'Service Z', requiredRTO: 8 }]
          }
        }
      ];

      const rollupData = DepartmentBIAPrecedence.calculateProcessRollup(mockProcessBIAs);
      setProcessRollupData(rollupData);
    } else {
      setProcessRollupData(null);
    }
  };

  // Impact Analysis (Multi-Process Support - V9 Migration + Golf Saudi Enhancements)
  // For multi-process BIA: each process has its own impact analysis
  // For single-process BIA: array contains one entry
  const [processImpactAnalyses, setProcessImpactAnalyses] = useState<Array<{
    processId: string;
    processName: string;
    analysisMatrix: ImpactAnalysisMatrix[];
    mtpdCalculation?: MTDPCalculation;
    rtoRpoDetermination?: RTODetermination;
    rtoValue?: number;
    rpoValue?: number; // NOTE: RPO removed from process level per Golf Saudi requirements
    isRTOOverride?: boolean;
    rtoJustification?: string;
    rpoJustification?: string;
    keyDependencies: string[];
    recoveryPriority: 'Critical' | 'High' | 'Medium' | 'Low';
    // Golf Saudi Process-Level Fields
    processLocation?: string; // Selected from Golf Saudi locations
    assignedSmeId?: string; // SME assigned to this specific process
    assignedSmeName?: string;
    // BETH3V Dependencies (per process)
    dependencies?: {
      upstreamProcesses: any[];
      downstreamProcesses: any[];
      criticalPeople: any[];
      criticalAssets: any[];
      criticalVendors: any[];
      criticalTechnology: any[];
      criticalVitalRecords: any[];
    };
    // SPOF Analysis (per process)
    spofAnalysis?: {
      singlePersonDependency: boolean;
      singlePersonDetails?: string;
      singleTechnologyDependency: boolean;
      singleTechnologyDetails?: string;
      singleVendorDependency: boolean;
      singleVendorDetails?: string;
    };
  }>>([]);

  // Legacy single impact analysis for backward compatibility (department BIA)
  const [impactAnalysis, setImpactAnalysis] = useState<{
    analysisMatrix: ImpactAnalysisMatrix[];
    mtpdCalculation?: MTDPCalculation;
    rtoRpoDetermination?: RTODetermination;
    rtoValue?: number;
    rpoValue?: number;
    isRTOOverride?: boolean;
    rtoOverrideJustification?: string;
    keyDependencies: string[];
    recoveryPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  } | null>(null);

  // Dependencies (BETH3V Framework)
  const [dependencies, setDependencies] = useState({
    upstreamProcesses: [] as any[],
    downstreamProcesses: [] as any[],
    criticalPeople: [] as any[],
    criticalAssets: [] as any[],
    criticalVendors: [] as any[]
  });

  // Dependencies modal state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLibrary, setActiveLibrary] = useState<'processes' | 'people' | 'assets' | 'vendors' | 'vitalRecords' | null>(null);
  const [dependencyType, setDependencyType] = useState<'upstream' | 'downstream' | null>(null);

  // Handle edit mode and process pre-selection
  useEffect(() => {
    const loadDraftBIA = async () => {
      if (editRecordId) {
        try {
          // Load existing BIA record data for editing/resuming
          console.log('Loading BIA record for editing:', editRecordId);
          const biaData = await biaService.getById(parseInt(editRecordId));

          // Set BIA record ID
          if (biaData.id) {
            setBiaRecordId(biaData.id);
          }

          // Populate form fields from loaded data
          if (biaData.biaName) {
            setBasicInfo(prev => ({
              ...prev,
              name: biaData.biaName,
              description: (biaData as any).purpose || '',
              businessCoordinator: biaData.biaCoordinator || '',
              purpose: (biaData as any).purpose || '',
              scope: (biaData as any).scope || ''
            }));
          }

          // Set BIA type
          if (biaData.biaType) {
            setBiaType(biaData.biaType.toLowerCase() as any);
          }

          // Skip to step 1 (Basic Information) since type is already selected
          setCurrentStep(1);

          document.title = `Resume BIA - ${biaData.biaName || editRecordId}`;
        } catch (error) {
          console.error('Failed to load BIA record:', error);
          alert('Failed to load BIA record. Starting a new one instead.');
        }
      }
    };

    loadDraftBIA();

    if (processId) {
      // Pre-select process and set BIA type
      const process = mockProcessLibrary.find(p => p.id === processId);
      if (process) {
        setBiaType('process');
        setSelectedProcesses([{
          processId: process.id,
          processName: process.name,
          processOwner: process.owner,
          selectionReason: 'Pre-selected from process library'
        }]);
        setCurrentStep(1); // Skip BIA type selection (no template selection step anymore)
      }
    }
  }, [editRecordId, processId]);

  // Process criticality state
  const [processCriticality, setProcessCriticality] = useState<{tier: string, score: number, color: string} | null>(null);

  // SPOF Analysis state
  const [spofAnalysis, setSpofAnalysis] = useState({
    singlePersonDependency: null as boolean | null,
    singlePersonDetails: '',
    singleTechnologyDependency: null as boolean | null,
    singleTechnologyDetails: '',
    singleVendorDependency: null as boolean | null,
    singleVendorDetails: ''
  });

  // RTO/RPO Values
  const [rtoValue, setRtoValue] = useState<number | ''>('');
  const [rpoValue, setRpoValue] = useState<number | ''>('');
  const [rtoJustification, setRtoJustification] = useState('');
  const [resourceRequirements, setResourceRequirements] = useState('');
  const [technologyDependencies, setTechnologyDependencies] = useState('');

  // RTO Calculation Configuration
  const [rtoCalculationMethod, setRtoCalculationMethod] = useState<'T_MINUS_1' | 'PERCENTAGE'>('PERCENTAGE');
  const [rtoPercentage, setRtoPercentage] = useState(DEFAULT_RTO_PERCENTAGE);
  const [calculatedRtoInfo, setCalculatedRtoInfo] = useState<{
    method: string;
    calculation: string;
    originalMtpd: number;
  } | null>(null);

  // Peak Times State
  const [peakTimes, setPeakTimes] = useState<PeakTime[]>([]);
  const [showPeakTimeModal, setShowPeakTimeModal] = useState(false);
  const [editingPeakTime, setEditingPeakTime] = useState<PeakTime | null>(null);
  const [peakTimeFormData, setPeakTimeFormData] = useState<Partial<PeakTime>>({
    peakTimeName: '',
    description: '',
    peakRtoHours: 0,
    peakRpoHours: 0,
    recurrenceType: 'MONTHLY',
    isCriticalDeadline: false,
    deadlineType: undefined,
    businessJustification: '',
    impactIfMissed: '',
    priority: 1,
    isActive: true
  });

  // Staff List State
  interface StaffMember {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone?: string;
    isKeyPerson: boolean;
    responsibilities: string;
  }
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffFormData, setStaffFormData] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    isKeyPerson: false,
    responsibilities: ''
  });

  // Recovery Staff State
  interface RecoveryStaffMember {
    id: string;
    name: string;
    role: string;
    recoveryRole: string;
    department: string;
    email: string;
    phone?: string;
    availabilityHours: number;
    alternateContact?: string;
    skills: string;
  }
  const [recoveryStaff, setRecoveryStaff] = useState<RecoveryStaffMember[]>([]);
  const [showRecoveryStaffModal, setShowRecoveryStaffModal] = useState(false);
  const [editingRecoveryStaff, setEditingRecoveryStaff] = useState<RecoveryStaffMember | null>(null);
  const [recoveryStaffFormData, setRecoveryStaffFormData] = useState<Partial<RecoveryStaffMember>>({
    name: '',
    role: '',
    recoveryRole: '',
    department: '',
    email: '',
    phone: '',
    availabilityHours: 4,
    alternateContact: '',
    skills: ''
  });

  // Additional Information State
  interface AdditionalInfo {
    businessContext: string;
    regulatoryRequirements: string;
    insuranceConsiderations: string;
    communicationPlan: string;
    escalationProcedures: string;
    alternateWorkLocation: string;
    minimumStaffRequired: number;
    specialEquipmentNeeded: string;
    externalDependencies: string;
    additionalNotes: string;
  }
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    businessContext: '',
    regulatoryRequirements: '',
    insuranceConsiderations: '',
    communicationPlan: '',
    escalationProcedures: '',
    alternateWorkLocation: '',
    minimumStaffRequired: 0,
    specialEquipmentNeeded: '',
    externalDependencies: '',
    additionalNotes: ''
  });

  // Auto-select process if processId is provided in URL (but stay on step 1)
  useEffect(() => {
    const processId = searchParams.get('processId');
    if (processId && selectedProcesses.length === 0) {
      selectProcess(processId);
      // Stay on step 1 - user still needs to fill BIA record details
    }
  }, [searchParams, selectedProcesses]);

  // Load all library data from backend on component mount
  useEffect(() => {
    const loadLibraries = async () => {
      setLibrariesLoading(true);
      try {
        const [processes, users, assets, vendors, vitalRecords, departments, locations] = await Promise.all([
          processService.getAll(),
          userService.getAll(),
          assetService.getAll(),
          vendorService.getAll(),
          vitalRecordService.getAll(),
          organizationalUnitService.getAll(),
          golfSaudiLocationService.getActive()
        ]);

        setProcessesLibrary(processes);
        setUsersLibrary(users);
        setAssetsLibrary(assets);
        setVendorsLibrary(vendors);
        setVitalRecordsLibrary(vitalRecords);
        setDepartmentsLibrary(departments);
        setGolfSaudiLocations(locations);
      } catch (error) {
        console.error('Error loading libraries:', error);
      } finally {
        setLibrariesLoading(false);
      }
    };

    loadLibraries();
  }, []);

  // Demo Mode Initialization - Pre-fill all wizard data when ?demo=true
  useEffect(() => {
    const isDemo = searchParams.get('demo') === 'true';
    if (!isDemo) return;

    // Set BIA type to 'process' and skip step 0
    setBiaType('process');
    setCurrentStep(1);

    // Pre-fill Basic Information (Step 1)
    setBasicInfo({
      name: 'Q4 2024 Financial Operations BIA',
      description: 'Comprehensive Business Impact Analysis for critical financial operations processes including payroll, accounts payable, and financial reporting. This BIA assesses the impact of disruptions and establishes recovery priorities.',
      businessCoordinator: 'Sarah Johnson',
      secondaryCoordinator: 'Michael Chen',
      businessContinuityAnalyst: 'David Williams',
      purpose: 'To identify critical financial processes, assess potential impacts of disruptions, and establish recovery time objectives to ensure business continuity.',
      scope: 'This BIA covers all financial operations processes within the Finance department, including payroll processing, accounts payable/receivable, and regulatory reporting.',
      analysisJustification: 'Annual BIA review required by corporate policy and regulatory compliance requirements.',
      owner: 'Finance Department',
      championId: 'user-001',
      championName: 'Sarah Johnson',
      smeId: 'user-002',
      smeName: 'Rajesh Kumar',
      departmentDescription: 'Finance Department - Corporate Financial Operations',
      departmentLocation: 'Headquarters - Building A',
      numberOfEmployees: 45
    });

    // Pre-fill Selected Processes (Step 2) - Two dummy processes
    const demoProcesses = [
      {
        processId: 'demo-proc-001',
        processName: 'Payroll Processing',
        processOwner: 'Jane Smith',
        selectionReason: 'Critical process for employee compensation - regulatory and contractual obligations'
      },
      {
        processId: 'demo-proc-002',
        processName: 'Accounts Payable Processing',
        processOwner: 'Michael Chen',
        selectionReason: 'Essential for vendor payments and maintaining supplier relationships'
      }
    ];
    setSelectedProcesses(demoProcesses);

    // Pre-fill Impact Analyses for both processes (Step 3)
    const demoImpactAnalyses = demoProcesses.map((process, idx) => {
      // Create impact matrix with varying ratings - START LOW, increase over time
      // Critical threshold is 4, so we should only hit 4 in later timeframes (4-24 Hours or later)
      const matrix = impactCategories.map((category) => ({
        impactCategory: category,
        timeframes: timeframes.map((timeframe, tfIdx) => {
          // Base ratings for first timeframe (<4 Hours) - ALL below critical threshold
          let baseRating = 1;
          if (category === 'Financial') baseRating = idx === 0 ? 2 : 1;
          if (category === 'Reputational') baseRating = 1;
          if (category === 'Regulatory') baseRating = idx === 0 ? 2 : 1; // Start at 2, not 4
          if (category === 'Operational') baseRating = 2;
          if (category === 'Customer') baseRating = 1;

          // Gradual increase over time (waterfall effect) - hit critical at 1-3 Days (tfIdx=2)
          // tfIdx: 0=<4H, 1=4-24H, 2=1-3D, 3=4-7D, 4=1-4W, 5=>1M
          let rating = baseRating;
          if (tfIdx >= 1) rating = Math.min(baseRating + 1, 5); // 4-24 Hours
          if (tfIdx >= 2) rating = Math.min(baseRating + 2, 5); // 1-3 Days - this is where we hit critical
          if (tfIdx >= 3) rating = Math.min(baseRating + 3, 5); // 4-7 Days
          if (tfIdx >= 4) rating = Math.min(rating, 5); // 1-4 Weeks (same as previous or capped)
          if (tfIdx >= 5) rating = Math.min(rating, 5); // >1 Month (same as previous or capped)

          return {
            timeframe,
            impactRating: rating,
            impactDescription: `${category} impact at ${timeframe} - ${rating >= 4 ? 'Critical' : rating >= 3 ? 'High' : rating >= 2 ? 'Medium' : 'Low'} severity`,
            quantitativeValue: category === 'Financial' ? (rating * 50000) : undefined
          };
        })
      }));

      return {
        processId: process.processId,
        processName: process.processName,
        analysisMatrix: matrix,
        mtpdCalculation: {
          calculatedMTPD: idx === 0 ? 72 : 168, // 1-3 Days (72h) for Payroll, 4-7 Days (168h) for AP
          triggeringCategory: idx === 0 ? 'Regulatory' : 'Operational',
          triggeringTimeframe: idx === 0 ? '1-3 Days' : '4-7 Days', // Critical hit at 1-3 Days, not <4 Hours
          triggeringRating: 4,
          thresholdUsed: 4, // Critical threshold
          calculationDate: new Date()
        },
        rtoValue: idx === 0 ? 24 : 48, // RTO based on MTPD (50% of MTPD)
        rpoValue: idx === 0 ? 4 : 8,
        isRTOOverride: false,
        rtoJustification: '',
        rpoJustification: '',
        keyDependencies: ['SAP System', 'Banking Portal', 'Employee Database'],
        recoveryPriority: idx === 0 ? 'Critical' as const : 'High' as const,
        processLocation: 'Headquarters',
        assignedSmeId: 'user-002',
        assignedSmeName: 'Rajesh Kumar',
        // Pre-filled BETH3V Dependencies
        dependencies: {
          upstreamProcesses: [
            { id: 'up-001', name: 'Time & Attendance', department: 'HR', owner: 'Lisa Chen', approvedRTO: 2, requiredRTO: 2, isRTOOverridden: false, rtoJustification: '' },
            { id: 'up-002', name: 'Employee Data Management', department: 'HR', owner: 'Lisa Chen', approvedRTO: 4, requiredRTO: 4, isRTOOverridden: false, rtoJustification: '' }
          ],
          downstreamProcesses: [
            { id: 'down-001', name: 'General Ledger Posting', department: 'Finance', owner: 'Mike Johnson', approvedRTO: 8, requiredRTO: 8, isRTOOverridden: false, rtoJustification: '' },
            { id: 'down-002', name: 'Financial Reporting', department: 'Finance', owner: 'Mike Johnson', approvedRTO: 24, requiredRTO: 24, isRTOOverridden: false, rtoJustification: '' }
          ],
          criticalPeople: [
            { id: 'person-001', name: 'Sarah Johnson', role: 'Finance Manager', department: 'Finance', email: 'sarah.johnson@company.com', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '', competenciesRequired: 'Financial management, SAP expertise, Regulatory compliance', backupResourceId: 'person-002', backupResourceName: 'Rajesh Kumar', criticalAvailabilityTimeframe: 2 },
            { id: 'person-002', name: 'Rajesh Kumar', role: 'IT Manager', department: 'Technology', email: 'rajesh.kumar@company.com', requiredRTO: 2, isRTOOverridden: false, rtoJustification: '', competenciesRequired: 'System administration, Database management', backupResourceId: '', backupResourceName: '', criticalAvailabilityTimeframe: 1 }
          ],
          criticalAssets: [
            { id: 'asset-001', name: 'SAP Production Server', type: 'Application', category: 'Technology', criticality: 'Critical', requiredRTO: 2, isRTOOverridden: false, rtoJustification: '', rpo: 1 },
            { id: 'asset-002', name: 'Primary Database Server', type: 'Equipment', category: 'Equipment', criticality: 'Critical', requiredRTO: 1, isRTOOverridden: false, rtoJustification: '' },
            { id: 'asset-003', name: 'Banking Portal Access', type: 'Application', category: 'Technology', criticality: 'High', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '', rpo: 2 }
          ],
          criticalVendors: [
            { id: 'vendor-001', name: 'Payroll Services Inc.', service: 'Payroll Processing Support', sla: 'Yes - 4hr response', criticality: 'Critical', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '' },
            { id: 'vendor-002', name: 'First National Bank', service: 'Banking Services', sla: 'Yes - 99.9% uptime', criticality: 'Critical', requiredRTO: 2, isRTOOverridden: false, rtoJustification: '' }
          ],
          criticalTechnology: [
            { id: 'tech-001', name: 'SAP ERP System', type: 'Enterprise Application', category: 'Technology', criticality: 'Critical', requiredRTO: 2, isRTOOverridden: false, rtoJustification: '' }
          ],
          criticalVitalRecords: [
            { id: 'record-001', name: 'Employee Payroll Records', type: 'Digital', status: 'Active', criticality: 'Critical', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '' },
            { id: 'record-002', name: 'Tax Filing Documents', type: 'Digital', status: 'Active', criticality: 'High', requiredRTO: 8, isRTOOverridden: false, rtoJustification: '' }
          ]
        },
        // SPOF Analysis
        spofAnalysis: {
          singlePersonDependency: true,
          singlePersonDetails: 'Sarah Johnson is the only person with full SAP payroll module access and regulatory filing authority',
          singleTechnologyDependency: true,
          singleTechnologyDetails: 'SAP Production Server is the single point of failure for all payroll processing',
          singleVendorDependency: false,
          singleVendorDetails: ''
        }
      };
    });
    setProcessImpactAnalyses(demoImpactAnalyses);

    // Pre-fill Peak Times and Critical Deadlines
    const demoPeakTimes: PeakTime[] = [
      {
        id: 1,
        biaId: 0,
        peakTimeName: 'Month-End Payroll Processing',
        description: 'Critical payroll processing window for monthly salary disbursement',
        peakRtoHours: 2,
        peakRpoHours: 1,
        recurrenceType: 'MONTHLY',
        isCriticalDeadline: true,
        deadlineType: 'PAYROLL',
        businessJustification: 'Employees must receive salaries by the last working day of each month per employment contracts',
        impactIfMissed: 'Employee dissatisfaction, potential legal issues, regulatory penalties',
        priority: 1,
        isActive: true
      },
      {
        id: 2,
        biaId: 0,
        peakTimeName: 'Quarterly Tax Filing',
        description: 'Quarterly tax submission deadline to regulatory authorities',
        peakRtoHours: 4,
        peakRpoHours: 2,
        recurrenceType: 'YEARLY', // Quarterly recurrence represented as yearly with specific details
        recurrenceDetails: '{"months": [3, 6, 9, 12], "dayOfMonth": 15}',
        isCriticalDeadline: true,
        deadlineType: 'REGULATORY_FILING',
        businessJustification: 'Regulatory requirement for quarterly tax submissions',
        impactIfMissed: 'Regulatory penalties, potential audit triggers, reputational damage',
        priority: 2,
        isActive: true
      },
      {
        id: 3,
        biaId: 0,
        peakTimeName: 'Year-End Financial Close',
        description: 'Annual financial closing and reporting period',
        peakRtoHours: 1,
        peakRpoHours: 1,
        recurrenceType: 'YEARLY',
        isCriticalDeadline: true,
        deadlineType: 'YEAR_END',
        businessJustification: 'Annual financial statements must be prepared for audit and regulatory submission',
        impactIfMissed: 'Delayed annual report, regulatory non-compliance, investor concerns',
        priority: 1,
        isActive: true
      }
    ];
    setPeakTimes(demoPeakTimes);

    // Pre-fill Staff List
    const demoStaffList: StaffMember[] = [
      {
        id: 'staff-001',
        name: 'Sarah Johnson',
        role: 'Finance Manager',
        department: 'Finance',
        email: 'sarah.johnson@company.com',
        phone: '+1 555-0101',
        isKeyPerson: true,
        responsibilities: 'Oversees all payroll processing, approves salary disbursements, manages regulatory filings'
      },
      {
        id: 'staff-002',
        name: 'Michael Chen',
        role: 'Senior Accountant',
        department: 'Finance',
        email: 'michael.chen@company.com',
        phone: '+1 555-0102',
        isKeyPerson: true,
        responsibilities: 'Processes payroll transactions, reconciles accounts, prepares reports'
      },
      {
        id: 'staff-003',
        name: 'Emily Davis',
        role: 'Payroll Specialist',
        department: 'Finance',
        email: 'emily.davis@company.com',
        phone: '+1 555-0103',
        isKeyPerson: false,
        responsibilities: 'Handles payroll data entry, employee queries, timesheet verification'
      }
    ];
    setStaffList(demoStaffList);

    // Pre-fill Recovery Staff
    const demoRecoveryStaff: RecoveryStaffMember[] = [
      {
        id: 'recovery-001',
        name: 'Sarah Johnson',
        role: 'Finance Manager',
        recoveryRole: 'Recovery Team Lead',
        department: 'Finance',
        email: 'sarah.johnson@company.com',
        phone: '+1 555-0101',
        availabilityHours: 2,
        alternateContact: 'Michael Chen - michael.chen@company.com',
        skills: 'SAP Payroll Module, Banking Systems, Regulatory Compliance, Team Leadership'
      },
      {
        id: 'recovery-002',
        name: 'Rajesh Kumar',
        role: 'IT Manager',
        recoveryRole: 'Technical Recovery Lead',
        department: 'Technology',
        email: 'rajesh.kumar@company.com',
        phone: '+1 555-0201',
        availabilityHours: 1,
        alternateContact: 'IT Help Desk - helpdesk@company.com',
        skills: 'SAP Basis, Database Recovery, System Restoration, Network Infrastructure'
      },
      {
        id: 'recovery-003',
        name: 'Lisa Chen',
        role: 'HR Manager',
        recoveryRole: 'HR Liaison',
        department: 'Human Resources',
        email: 'lisa.chen@company.com',
        phone: '+1 555-0301',
        availabilityHours: 4,
        alternateContact: 'HR General - hr@company.com',
        skills: 'Employee Communications, Time & Attendance, Benefits Administration'
      }
    ];
    setRecoveryStaff(demoRecoveryStaff);

    // Pre-fill Additional Information
    setAdditionalInfo({
      businessContext: 'Financial Operations is the backbone of the organization, processing over 5,000 transactions monthly. Any disruption directly impacts employee welfare, vendor relationships, and regulatory compliance. The department operates on strict deadlines aligned with payroll cycles and regulatory reporting schedules.',
      regulatoryRequirements: 'SOX compliance for financial reporting, Tax regulations requiring timely filing, Labor laws mandating on-time salary payments, Data protection regulations (GDPR, local privacy laws) for employee financial data',
      insuranceConsiderations: 'Business interruption insurance covers up to 30 days of disruption. Cyber liability insurance covers data breach incidents. Professional liability coverage for regulatory penalties up to $1M.',
      communicationPlan: 'Tier 1 (0-1hr): Department heads notified via SMS and email. Tier 2 (1-4hr): Executive team briefing via emergency hotline. Tier 3 (4-24hr): All-hands communication via corporate intranet and email blast.',
      escalationProcedures: 'Level 1: Department Manager (Sarah Johnson) - First response and initial assessment. Level 2: Finance Director - Resource allocation and budget approval. Level 3: CFO - Executive decisions and external communications. Level 4: CEO - Crisis management and board notification.',
      alternateWorkLocation: 'Primary: Building B - Floor 3 (pre-configured workstations). Secondary: Remote work via VPN with access to cloud-based SAP. Tertiary: Disaster Recovery site in Dubai (full system replica).',
      minimumStaffRequired: 12,
      specialEquipmentNeeded: 'Secure laptops with SAP client installed, Hardware security tokens for banking access, Encrypted USB drives for data transfer, Dedicated phone lines for vendor communication',
      externalDependencies: 'Central Bank systems for fund transfers, Tax authority portal for filing, Payroll service provider API, Banking partner secure connections',
      additionalNotes: 'This process has been identified as Tier 1 critical in the corporate risk register. Annual disaster recovery testing is mandatory. Cross-training program in place for key positions to reduce single points of failure.'
    });

    // Pre-fill legacy dependencies (for department BIA compatibility)
    setDependencies({
      upstreamProcesses: [
        { id: 'up-001', name: 'Time & Attendance', department: 'HR', owner: 'Lisa Chen', approvedRTO: 2, requiredRTO: 2, isRTOOverridden: false, rtoJustification: '' }
      ],
      downstreamProcesses: [
        { id: 'down-001', name: 'General Ledger Posting', department: 'Finance', owner: 'Mike Johnson', approvedRTO: 8, requiredRTO: 8, isRTOOverridden: false, rtoJustification: '' }
      ],
      criticalPeople: [
        { id: 'person-001', name: 'Sarah Johnson', role: 'Finance Manager', department: 'Finance', email: 'sarah.johnson@company.com', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '' }
      ],
      criticalAssets: [
        { id: 'asset-001', name: 'SAP Production Server', type: 'Application', category: 'Technology', criticality: 'Critical', requiredRTO: 2, isRTOOverridden: false, rtoJustification: '' }
      ],
      criticalVendors: [
        { id: 'vendor-001', name: 'Payroll Services Inc.', service: 'Payroll Processing Support', sla: 'Yes - 4hr response', criticality: 'Critical', requiredRTO: 4, isRTOOverridden: false, rtoJustification: '' }
      ]
    });

  }, [searchParams]);

  // Load active template when BIA type is selected (from system settings)
  useEffect(() => {
    if (biaType) {
      const organizationalLevel = biaType as OrganizationalLevel;

      // Get the active template from system settings (default template for this level)
      const activeTemplate = biaTemplateService.getDefaultTemplate(organizationalLevel);
      if (activeTemplate) {
        setSelectedTemplate(activeTemplate);
      } else {
        // Fallback to first available template if no default is set
        const templates = biaTemplateService.getTemplatesByLevel(organizationalLevel);
        if (templates.length > 0) {
          setSelectedTemplate(templates[0]);
        }
      }
    }
  }, [biaType]);

  // Create draft BIA record when user starts the wizard (after BIA type is selected)
  useEffect(() => {
    const createDraftBIA = async () => {
      // Only create draft if:
      // 1. BIA type is selected
      // 2. Not in edit mode
      // 3. No BIA record ID exists yet
      // 4. Not already creating
      // 5. User has moved past step 0 (BIA type selection)
      if (biaType && !editRecordId && !biaRecordId && !isCreatingDraft && currentStep > 0) {
        setIsCreatingDraft(true);
        try {
          const draftBIA = await biaService.create({
            biaName: basicInfo.name || `Draft ${biaType.charAt(0).toUpperCase() + biaType.slice(1)} BIA - ${new Date().toLocaleDateString()}`,
            biaType: biaType.toUpperCase(),
            // Don't set biaTargetType and biaTargetId yet - they will be set after process/department selection
            // This avoids backend validation error: "BIA target ID must be specified when target type is set"
            biaTargetType: null,
            biaTargetId: null,
            status: 'DRAFT',
            biaCoordinator: currentUser?.fullName || '',
            analysisDate: new Date().toISOString().split('T')[0],
            templateUsed: selectedTemplate?.name || 'Default Template'
          } as any);

          if (draftBIA.id) {
            setBiaRecordId(draftBIA.id);
            console.log('✅ Draft BIA created with ID:', draftBIA.id);
          }
        } catch (error) {
          console.error('❌ Failed to create draft BIA:', error);
        } finally {
          setIsCreatingDraft(false);
        }
      }
    };

    createDraftBIA();
  }, [biaType, editRecordId, biaRecordId, isCreatingDraft, currentStep, basicInfo.name, selectedTemplate, currentUser]);

  // Prepare form data for auto-save
  const formDataForSave = {
    biaName: basicInfo.name || `Draft ${biaType.charAt(0).toUpperCase() + biaType.slice(1)} BIA`,
    biaType: biaType.toUpperCase(),
    biaTargetType: biaType.toUpperCase(),
    biaCoordinator: basicInfo.businessCoordinator || currentUser?.fullName || '',
    analysisDate: new Date().toISOString().split('T')[0],
    templateUsed: selectedTemplate?.name || 'Default Template',
    purpose: basicInfo.purpose,
    scope: basicInfo.scope,
    // Add more fields as needed
    status: 'DRAFT'
  };

  // Auto-save hook
  const { saveStatus, lastSavedAt, saveNow, error: saveError } = useBIAAutoSave({
    biaId: biaRecordId,
    formData: formDataForSave,
    enabled: !!biaRecordId && !editRecordId, // Enable auto-save only for new drafts
    autoSaveInterval: 30000, // 30 seconds
    onSaveSuccess: (id) => {
      console.log('BIA auto-saved successfully:', id);
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
    }
  });

  const selectProcess = (processId: string) => {
    const process = processesLibrary.find(p => p.id.toString() === processId);
    if (process) {
      // Check if process is already selected
      const isAlreadySelected = selectedProcesses.some(p => p.processId === process.id.toString());
      if (!isAlreadySelected) {
        setSelectedProcesses([...selectedProcesses, {
          processId: process.id.toString(),
          processName: process.processName,
          processOwner: process.processOwner || 'Not assigned',
          selectionReason: `Selected from Process Library for impact analysis`
        }]);
      }
    }
  };

  const removeProcess = (processId: string) => {
    const updatedProcesses = selectedProcesses.filter(p => p.processId !== processId);
    setSelectedProcesses(updatedProcesses);
  };

  const updateProcessReason = (processId: string, reason: string) => {
    setSelectedProcesses(selectedProcesses.map(p =>
      p.processId === processId ? { ...p, selectionReason: reason } : p
    ));
  };

  // Update BIA record with selected processes
  useEffect(() => {
    const updateBIAWithProcesses = async () => {
      // Only update if:
      // 1. BIA record exists
      // 2. Processes are selected
      // 3. BIA type is 'process'
      if (biaRecordId && selectedProcesses.length > 0 && biaType === 'process') {
        try {
          // Link the selected processes to the BIA using the target-processes endpoint
          // Mark the first process as primary
          const targetProcesses = selectedProcesses.map((p, index) => ({
            processId: parseInt(p.processId),
            isPrimary: index === 0, // First process is primary
            selectionReason: p.selectionReason
          }));

          await biaService.addTargetProcesses(biaRecordId, targetProcesses);
          console.log('✅ BIA updated with selected processes');
        } catch (error) {
          console.error('❌ Failed to update BIA with processes:', error);
        }
      }
    };

    updateBIAWithProcesses();
  }, [biaRecordId, selectedProcesses, biaType]);

  // RTO Calculation Functions
  const calculateRTOFromMTPD = (mtpdHours: number, method: 'T_MINUS_1' | 'PERCENTAGE'): {
    rto: number;
    method: string;
    calculation: string;
  } => {
    if (method === 'T_MINUS_1') {
      // Find the timeframe that matches MTPD and get the previous one
      const timeframeEntries = Object.entries(TIMEFRAME_HOURS).sort((a, b) => a[1] - b[1]);

      for (let i = 0; i < timeframeEntries.length; i++) {
        if (timeframeEntries[i][1] >= mtpdHours) {
          // Found the MTPD timeframe, get the previous one
          const previousTimeframe = i > 0 ? timeframeEntries[i - 1] : timeframeEntries[0];
          return {
            rto: previousTimeframe[1],
            method: 'T-1 Template',
            calculation: `MTPD timeframe: ${timeframeEntries[i][0]}, RTO timeframe: ${previousTimeframe[0]} (${previousTimeframe[1]} hours)`
          };
        }
      }

      // Fallback to first timeframe if no match found
      return {
        rto: timeframeEntries[0][1],
        method: 'T-1 Template',
        calculation: `Fallback to minimum timeframe: ${timeframeEntries[0][0]} (${timeframeEntries[0][1]} hours)`
      };
    } else {
      // Percentage method
      const calculatedRto = Math.round((mtpdHours * rtoPercentage) / 100);
      return {
        rto: Math.max(1, calculatedRto), // Minimum 1 hour
        method: 'Percentage Template',
        calculation: `RTO = ${rtoPercentage}% of MTPD (${mtpdHours} hours) = ${calculatedRto} hours`
      };
    }
  };

  // Helper to get just the RTO value
  const getSuggestedRTO = (mtpdHours: number, method: 'T_MINUS_1' | 'PERCENTAGE'): number => {
    return calculateRTOFromMTPD(mtpdHours, method).rto;
  };

  const calculateMTPD = (matrix: ImpactAnalysisMatrix[]): MTDPCalculation | null => {
    let earliestCriticalImpact: {
      hours: number;
      category: string;
      timeframe: string;
      rating: number;
    } | null = null;

    // Check each timeframe across all categories to find the earliest critical impact
    for (const timeframeName of timeframes) {
      for (const category of matrix) {
        const timeframe = category.timeframes.find(tf => tf.timeframe === timeframeName);
        if (timeframe && timeframe.impactRating >= criticalityThreshold) {
          // Convert timeframe to hours for calculation
          let hours = 0;
          if (timeframeName === '<4 Hours') hours = 4;
          else if (timeframeName === '4-24 Hours') hours = 24;
          else if (timeframeName === '1-3 Days') hours = 72;
          else if (timeframeName === '4-7 Days') hours = 168;
          else if (timeframeName === '1-4 Weeks') hours = 672;
          else hours = 720; // >1 Month

          // This is the earliest timeframe with critical impact
          return {
            calculatedMTPD: hours,
            triggeringCategory: category.impactCategory,
            triggeringTimeframe: timeframeName,
            triggeringRating: timeframe.impactRating,
            thresholdUsed: criticalityThreshold,
            calculationDate: new Date()
          };
        }
      }
    }
    return null;
  };

  const startImpactAnalysis = () => {
    if (biaType === 'process') {
      // Multi-Process BIA: Initialize impact analysis for each selected process
      if (selectedProcesses.length === 0) return;

      const analyses = selectedProcesses.map(process => {
        const matrix: ImpactAnalysisMatrix[] = impactCategories.map(category => ({
          impactCategory: category,
          timeframes: timeframes.map(timeframe => ({
            timeframe,
            impactRating: 1,
            impactDescription: '',
            quantitativeValue: category === 'Financial' ? 0 : undefined
          }))
        }));

        return {
          processId: process.processId,
          processName: process.processName,
          analysisMatrix: matrix,
          keyDependencies: [],
          recoveryPriority: 'Medium' as const
        };
      });

      setProcessImpactAnalyses(analyses);
    } else {
      // Department BIA: Single impact analysis
      const matrix: ImpactAnalysisMatrix[] = impactCategories.map(category => ({
        impactCategory: category,
        timeframes: timeframes.map(timeframe => ({
          timeframe,
          impactRating: 1,
          impactDescription: '',
          quantitativeValue: category === 'Financial' ? 0 : undefined
        }))
      }));

      const newAnalysis = {
        analysisMatrix: matrix,
        keyDependencies: [],
        recoveryPriority: 'Medium' as const
      };

      setImpactAnalysis(newAnalysis);
    }
  };

  const updateImpactRating = (categoryIndex: number, timeframeIndex: number, rating: number, processIndex?: number) => {
    if (biaType === 'process' && processImpactAnalyses.length > 0) {
      // Multi-Process BIA: Update specific process analysis
      const targetIndex = processIndex !== undefined ? processIndex : activeProcessIndex;
      const targetAnalysis = processImpactAnalyses[targetIndex];
      if (!targetAnalysis) return;

      const newMatrix = [...targetAnalysis.analysisMatrix];

      // Update the selected cell
      newMatrix[categoryIndex].timeframes[timeframeIndex].impactRating = rating;

      // BIDIRECTIONAL WATERFALL LOGIC:
      // Forward cascade: all subsequent timeframes must be >= this rating (impacts increase over time)
      for (let i = timeframeIndex + 1; i < newMatrix[categoryIndex].timeframes.length; i++) {
        if (newMatrix[categoryIndex].timeframes[i].impactRating < rating) {
          newMatrix[categoryIndex].timeframes[i].impactRating = rating;
        }
      }

      // Backward cascade: all previous timeframes must be <= this rating (impacts cannot decrease)
      for (let i = timeframeIndex - 1; i >= 0; i--) {
        if (newMatrix[categoryIndex].timeframes[i].impactRating > rating) {
          newMatrix[categoryIndex].timeframes[i].impactRating = rating;
        }
      }

      // Recalculate MTPD
      const mtpd = calculateMTPD(newMatrix);

      // Update the specific process analysis
      const updatedAnalyses = [...processImpactAnalyses];
      updatedAnalyses[targetIndex] = {
        ...targetAnalysis,
        analysisMatrix: newMatrix,
        mtpdCalculation: mtpd || undefined
      };

      setProcessImpactAnalyses(updatedAnalyses);
    } else if (impactAnalysis) {
      // Department BIA: Single impact analysis
      const newMatrix = [...impactAnalysis.analysisMatrix];

      // Update the selected cell
      newMatrix[categoryIndex].timeframes[timeframeIndex].impactRating = rating;

      // BIDIRECTIONAL WATERFALL LOGIC:
      // Forward cascade: all subsequent timeframes must be >= this rating (impacts increase over time)
      for (let i = timeframeIndex + 1; i < newMatrix[categoryIndex].timeframes.length; i++) {
        if (newMatrix[categoryIndex].timeframes[i].impactRating < rating) {
          newMatrix[categoryIndex].timeframes[i].impactRating = rating;
        }
      }

      // Backward cascade: all previous timeframes must be <= this rating (impacts cannot decrease)
      for (let i = timeframeIndex - 1; i >= 0; i--) {
        if (newMatrix[categoryIndex].timeframes[i].impactRating > rating) {
          newMatrix[categoryIndex].timeframes[i].impactRating = rating;
        }
      }

      // Recalculate MTPD
      const mtpd = calculateMTPD(newMatrix);

      setImpactAnalysis({
        ...impactAnalysis,
        analysisMatrix: newMatrix,
        mtpdCalculation: mtpd || undefined
      });
    }
  };

  // Build dynamic steps based on selected template
  const buildSteps = () => {
    const baseSteps = [
      { id: 0, name: 'BIA Type Selection', description: 'Choose BIA type', fieldType: null },
      { id: 1, name: 'Basic Information', description: 'BIA record details', fieldType: null },
      { id: 2, name: biaType === 'department' ? 'Department Selection' : 'Process Selection', description: biaType === 'department' ? 'Choose a department to analyze' : 'Choose a process to analyze', fieldType: null }
    ];

    if (!selectedTemplate) {
      // Default steps if no template is loaded yet
      return [
        ...baseSteps,
        { id: 3, name: 'Review & Submit', description: 'Final review', fieldType: null }
      ];
    }

    // Add steps based on enabled template fields
    const enabledFields = selectedTemplate.fields
      .filter(field => field.isEnabled)
      .sort((a, b) => a.order - b.order);

    const dynamicSteps = enabledFields.map((field, index) => ({
      id: baseSteps.length + index,
      name: field.name,
      description: field.description || `Configure ${field.name}`,
      fieldType: field.type
    }));

    return [
      ...baseSteps,
      ...dynamicSteps,
      { id: baseSteps.length + dynamicSteps.length, name: 'Review & Submit', description: 'Final review', fieldType: null }
    ];
  };

  const steps = buildSteps();

  const renderBIATypeSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose BIA Type</h2>
        <p className="text-xs text-gray-600 mb-4">Select the scope of analysis: process, organizational unit, location, IT asset, service, or vendor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Process BIA */}
        <div
          onClick={() => setBiaType('process')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'process'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <CogIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'process' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Process BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze business process disruption impact
            </p>
          </div>
        </div>

        {/* Organizational Unit BIA */}
        <div
          onClick={() => setBiaType('department')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'department'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <UsersIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'department' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Organizational Unit BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze organizational unit disruption impact
            </p>
          </div>
        </div>

        {/* Location BIA */}
        <div
          onClick={() => setBiaType('location')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'location'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <BuildingOfficeIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'location' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Location BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze physical location disruption impact
            </p>
          </div>
        </div>

        {/* IT Asset BIA */}
        <div
          onClick={() => setBiaType('asset')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'asset'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <ServerIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'asset' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">IT Asset BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze IT asset/technology disruption impact
            </p>
          </div>
        </div>

        {/* Service BIA */}
        <div
          onClick={() => setBiaType('service')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'service'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <ClipboardDocumentListIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'service' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Service BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze business service disruption impact
            </p>
          </div>
        </div>

        {/* Vendor BIA */}
        <div
          onClick={() => setBiaType('vendor')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'vendor'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <TruckIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'vendor' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Vendor BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze third-party vendor disruption impact
            </p>
          </div>
        </div>

        {/* Vital Record BIA */}
        <div
          onClick={() => setBiaType('vital-record')}
          className={`cursor-pointer p-3 border rounded-sm transition-all ${
            biaType === 'vital-record'
              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <DocumentTextIcon className={`h-8 w-8 mx-auto mb-2 ${biaType === 'vital-record' ? 'text-gray-900' : 'text-gray-600'}`} />
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Vital Record BIA</h4>
            <p className="text-[10px] text-gray-600">
              Analyze vital record/data disruption impact
            </p>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {biaType && (
        <div className="text-center p-3 bg-gray-50 rounded-sm border border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Selected:</span> {
              biaType === 'process' ? 'Process BIA' :
              biaType === 'department' ? 'Organizational Unit BIA' :
              biaType === 'location' ? 'Location BIA' :
              biaType === 'asset' ? 'IT Asset BIA' :
              biaType === 'service' ? 'Service BIA' :
              biaType === 'vendor' ? 'Vendor BIA' :
              biaType === 'vital-record' ? 'Vital Record BIA' :
              'Unknown'
            }
          </p>
        </div>
      )}
    </div>
  );

  // Template is now loaded automatically from system settings, no manual selection needed

  // Dynamic step renderer based on template field type
  const renderDynamicStep = (step: any) => {
    if (!step.fieldType) {
      return null;
    }

    switch (step.fieldType) {
      case 'impact-analysis':
        return renderImpactAnalysis();
      case 'dependencies':
        return renderDependencies();
      case 'resources':
        return renderDependencies(); // Resources are part of dependencies (BETH3V)
      case 'spof-analysis':
        return renderDependencies(); // SPOF is part of dependencies step
      case 'staff-list':
        return renderStaffList();
      case 'recovery-staff':
        return renderRecoveryStaff();
      case 'peak-times':
        return renderPeakTimes();
      case 'additional-information':
        return renderAdditionalInformation();
      default:
        return renderRTODetermination(); // Default to RTO determination
    }
  };

  // Peak Times handlers
  const handleAddPeakTime = () => {
    setEditingPeakTime(null);
    setPeakTimeFormData({
      peakTimeName: '',
      description: '',
      peakRtoHours: 0,
      peakRpoHours: 0,
      recurrenceType: 'MONTHLY',
      isCriticalDeadline: false,
      deadlineType: undefined,
      businessJustification: '',
      impactIfMissed: '',
      priority: 1,
      isActive: true
    });
    setShowPeakTimeModal(true);
  };

  const handleEditPeakTime = (peakTime: PeakTime) => {
    setEditingPeakTime(peakTime);
    setPeakTimeFormData(peakTime);
    setShowPeakTimeModal(true);
  };

  const handleSavePeakTime = () => {
    if (editingPeakTime) {
      // Update existing peak time
      setPeakTimes(peakTimes.map(pt =>
        pt.id === editingPeakTime.id ? { ...peakTimeFormData, id: editingPeakTime.id } as PeakTime : pt
      ));
    } else {
      // Add new peak time
      const newPeakTime: PeakTime = {
        ...peakTimeFormData,
        id: Date.now(), // Temporary ID for frontend
        biaId: 0 // Will be set when BIA is created
      } as PeakTime;
      setPeakTimes([...peakTimes, newPeakTime]);
    }
    setShowPeakTimeModal(false);
  };

  const handleDeletePeakTime = (id: number) => {
    setPeakTimes(peakTimes.filter(pt => pt.id !== id));
  };

  // Placeholder renderer for fields not yet implemented
  const renderPlaceholder = (title: string, description: string) => (
    <div className="text-center py-12">
      <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 max-w-md mx-auto">
        <p className="text-sm text-blue-800 mb-2">
          This field is configured in your BIA template. Full implementation coming soon.
        </p>
        <p className="text-xs text-blue-600">
          Click "Next" to continue to the next step.
        </p>
      </div>
    </div>
  );

  const renderBasicInformation = () => (
    <div className="space-y-4">
      {/* Golf Saudi Workflow Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
        <h4 className="text-xs font-semibold text-blue-900 mb-1">Workflow Stage: Initiate BIA</h4>
        <p className="text-[10px] text-blue-700">
          Complete department/division-level profile information before starting process-level entries.
          The Champion may complete process-level information directly or assign specific processes to SMEs.
        </p>
      </div>

      {/* Champion & SME Assignment */}
      <div className="bg-white border border-gray-200 rounded-sm p-3">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Champion & SME Assignment</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Champion <span className="text-red-500">*</span>
            </label>
            <select
              value={basicInfo.championId}
              onChange={(e) => {
                const selectedUser = usersLibrary.find(u => u.id?.toString() === e.target.value);
                setBasicInfo({
                  ...basicInfo,
                  championId: e.target.value,
                  championName: selectedUser ? selectedUser.fullName : ''
                });
              }}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Select Champion...</option>
              {usersLibrary.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {(user as any).role || 'No Role'}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-1">Initiates and owns the BIA</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subject Matter Expert (SME) <span className="text-gray-400">(Optional)</span>
            </label>
            <select
              value={basicInfo.smeId}
              onChange={(e) => {
                const selectedUser = usersLibrary.find(u => u.id?.toString() === e.target.value);
                setBasicInfo({
                  ...basicInfo,
                  smeId: e.target.value,
                  smeName: selectedUser ? selectedUser.fullName : ''
                });
              }}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Assign to SME...</option>
              {usersLibrary.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {(user as any).role || 'No Role'}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-1">Assigned to complete process-level data</p>
          </div>
        </div>
      </div>

      {/* Department/Division Profile */}
      {biaType === 'department' && (
        <div className="bg-white border border-gray-200 rounded-sm p-3">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Department/Division Profile</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department Description</label>
              <textarea
                value={basicInfo.departmentDescription}
                onChange={(e) => setBasicInfo({...basicInfo, departmentDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Describe the department's role and responsibilities..."
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department Location</label>
                <input
                  type="text"
                  value={basicInfo.departmentLocation}
                  onChange={(e) => setBasicInfo({...basicInfo, departmentLocation: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="e.g., Riyadh Headquarters"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Number of Employees</label>
                <input
                  type="number"
                  value={basicInfo.numberOfEmployees || ''}
                  onChange={(e) => setBasicInfo({...basicInfo, numberOfEmployees: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic BIA Information */}
      <div className="bg-white border border-gray-200 rounded-sm p-3">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">BIA Record Information</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">BIA Record Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="e.g., Q1 2024 Finance Department BIA"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Business Continuity Analyst</label>
              <input
                type="text"
                value={basicInfo.businessContinuityAnalyst}
                onChange={(e) => setBasicInfo({...basicInfo, businessContinuityAnalyst: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="BCM team member conducting analysis"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
              <input
                type="text"
                value={basicInfo.owner}
                onChange={(e) => setBasicInfo({...basicInfo, owner: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Process/Department owner"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Analysis Justification</label>
              <input
                type="text"
                value={basicInfo.analysisJustification}
                onChange={(e) => setBasicInfo({...basicInfo, analysisJustification: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Why is this analysis needed?"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={basicInfo.description}
              onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Describe the scope and objectives of this BIA..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Purpose</label>
            <textarea
              value={basicInfo.purpose}
              onChange={(e) => setBasicInfo({...basicInfo, purpose: e.target.value})}
              rows={2}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Why is this BIA being conducted?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scope</label>
            <textarea
              value={basicInfo.scope}
              onChange={(e) => setBasicInfo({...basicInfo, scope: e.target.value})}
              rows={2}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="What processes, departments, or areas are included?"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessSelection = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">Select Process(es) for Analysis</h3>
        <p className="text-xs text-blue-700">
          Select one or more processes to analyze in this BIA. You can analyze a single process in detail,
          or group multiple related processes together for a comprehensive analysis.
        </p>
        <div className="mt-2 text-[10px] text-blue-600">
          • Single-process BIA: Detailed analysis of one specific process<br/>
          • Multi-process BIA: Analyze multiple related processes together (e.g., all finance processes)
        </div>
      </div>

      {/* Process Selection Dropdown */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Add Process from Library</label>
        {librariesLoading ? (
          <div className="text-xs text-gray-500 py-2">Loading processes...</div>
        ) : (
          <>
            <select
              value=""
              onChange={(e) => e.target.value && selectProcess(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Select a process to add...</option>
              {processesLibrary
                .filter(proc => !selectedProcesses.some(sp => sp.processId === proc.id.toString()))
                .map(proc => (
                  <option key={proc.id} value={proc.id}>
                    {proc.processName} - {proc.processOwner || 'No owner'} ({proc.organizationalUnitName || 'No unit'})
                  </option>
                ))}
            </select>
            <p className="mt-1 text-[10px] text-gray-500">
              {selectedProcesses.length === 0
                ? 'Select at least one process to analyze'
                : `${selectedProcesses.length} process(es) selected • ${processesLibrary.length} available in library`}
            </p>
          </>
        )}
      </div>

      {/* Selected Processes List */}
      {selectedProcesses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <h4 className="text-xs font-semibold text-gray-900 mb-3">
            Selected Processes ({selectedProcesses.length})
          </h4>
          <div className="space-y-3">
            {selectedProcesses.map((process) => (
              <div
                key={process.processId}
                className="border border-gray-200 rounded-sm p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-medium text-gray-900">{process.processName}</h5>
                    <p className="text-[10px] text-gray-600 mt-0.5">Owner: {process.processOwner}</p>
                  </div>
                  <button
                    onClick={() => removeProcess(process.processId)}
                    className="text-red-600 hover:text-red-800 ml-2"
                    title="Remove process"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Selection Reason */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">
                    Selection Reason
                  </label>
                  <textarea
                    value={process.selectionReason}
                    onChange={(e) => updateProcessReason(process.processId, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Why is this process included in this BIA?"
                  />
                </div>
              </div>
            ))}
          </div>

          {selectedProcesses.length > 1 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
              <p className="text-[10px] text-yellow-800">
                <strong>Multi-Process BIA:</strong> You are analyzing {selectedProcesses.length} processes together.
                All processes contribute equally to the analysis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDepartmentSelection = () => {
    // Filter only BIA-eligible organizational units
    const biaEligibleDepartments = departmentsLibrary.filter(dept => dept.isBiaEligible);

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Select Department for Analysis</h3>
          <p className="text-xs text-blue-700">
            Select an organizational unit to analyze in this Department-level BIA. Only BIA-eligible units are shown.
          </p>
          <div className="mt-2 text-[10px] text-blue-600">
            • Department BIA analyzes the impact of disruption to an entire organizational unit<br/>
            • Includes aggregated data from all processes within the department
          </div>
        </div>

        {/* Department Selection Dropdown */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Select Organizational Unit</label>
          {librariesLoading ? (
            <div className="text-xs text-gray-500 py-2">Loading departments...</div>
          ) : (
            <>
              <select
                value={selectedDepartment?.nodeId || ''}
                onChange={(e) => {
                  const deptId = e.target.value;
                  if (deptId) {
                    const dept = departmentsLibrary.find(d => d.id === deptId);
                    if (dept) {
                      const selection: OrgChartSelection = {
                        nodeId: dept.id,
                        nodeName: dept.unitName,
                        nodeType: 'department',
                        fullPath: dept.fullPath || dept.unitName,
                        manager: dept.unitHead,
                        employeeCount: dept.employeeCount
                      };
                      handleDepartmentSelection(selection);
                    }
                  } else {
                    handleDepartmentSelection(null);
                  }
                }}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select a department...</option>
                {biaEligibleDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.unitName} ({dept.unitType}) - {dept.unitHead || 'No head'} - {dept.employeeCount || 0} employees
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-gray-500">
                {selectedDepartment
                  ? `Selected: ${selectedDepartment.nodeName}`
                  : `${biaEligibleDepartments.length} BIA-eligible departments available`}
              </p>
            </>
          )}
        </div>

        {/* Selected Department Details */}
        {selectedDepartment && (
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h4 className="text-xs font-semibold text-gray-900 mb-3">Selected Department Details</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-gray-700">Department:</span>
                <span className="ml-2 text-gray-900">{selectedDepartment.nodeName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-900 capitalize">{selectedDepartment.nodeType}</span>
              </div>
              {selectedDepartment.manager && (
                <div>
                  <span className="font-medium text-gray-700">Manager:</span>
                  <span className="ml-2 text-gray-900">{selectedDepartment.manager}</span>
                </div>
              )}
              {selectedDepartment.employeeCount && (
                <div>
                  <span className="font-medium text-gray-700">Employees:</span>
                  <span className="ml-2 text-gray-900">{selectedDepartment.employeeCount}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Full Path:</span>
                <span className="ml-2 text-gray-900">{selectedDepartment.fullPath}</span>
              </div>
            </div>
          </div>
        )}

        {/* Show process rollup reference data */}
        {processRollupData && selectedDepartment && (
          <div className="mt-6">
            <ProcessRollupReference
              rollupData={processRollupData}
              departmentName={selectedDepartment.nodeName}
              onUseReference={(field, value) => {
                // Handle using reference values in the BIA form
                console.log(`Using reference ${field}:`, value);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderImpactAnalysis = () => {
    if (biaType === 'process' && selectedProcesses.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Please select at least one process first before conducting impact analysis.
        </div>
      );
    }

    if (biaType === 'department' && !selectedDepartment) {
      return (
        <div className="text-center py-8 text-gray-500">
          Please select a department first before conducting impact analysis.
        </div>
      );
    }

    // Multi-Process BIA Rendering
    if (biaType === 'process') {
      const hasStartedAnalysis = processImpactAnalyses.length > 0;
      const currentAnalysis = processImpactAnalyses[activeProcessIndex];

      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Impact Analysis</h3>
            <p className="text-xs text-blue-700">
              Evaluate disruption impact for each process across categories and timeframes. MTPD is automatically calculated when any impact reaches the criticality threshold of {criticalityThreshold}.
            </p>
            {selectedProcesses.length > 1 && (
              <p className="text-[10px] text-blue-600 mt-2">
                <strong>Multi-Process BIA:</strong> You are analyzing {selectedProcesses.length} processes.
                Complete the impact analysis for each process using the tabs below.
              </p>
            )}
          </div>

          {/* Start Analysis Button */}
          {!hasStartedAnalysis && (
            <div className="bg-white border border-gray-200 rounded-sm p-4 text-center">
              <button
                onClick={startImpactAnalysis}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
              >
                <CalculatorIcon className="h-3.5 w-3.5 mr-1" />
                Start Impact Analysis for All Processes
              </button>
            </div>
          )}

          {/* Process Tabs (Multi-Process) - Elegant Center-Aligned Switcher */}
          {hasStartedAnalysis && selectedProcesses.length > 1 && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                {selectedProcesses.map((process, index) => {
                  const analysis = processImpactAnalyses[index];
                  const isComplete = analysis?.mtpdCalculation !== undefined;
                  const isActive = index === activeProcessIndex;

                  return (
                    <button
                      key={process.processId}
                      onClick={() => setActiveProcessIndex(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {process.processName}
                      {isComplete && (
                        <CheckCircleIcon className={`h-3.5 w-3.5 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Impact Analysis Matrix for Current Process */}
          {hasStartedAnalysis && currentAnalysis && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {selectedProcesses[activeProcessIndex].processName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Owner: {selectedProcesses[activeProcessIndex].processOwner}
                  </p>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Analysis in Progress</span>
                </div>
              </div>

              {/* Golf Saudi Process-Level Fields */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 mb-4">
                <h5 className="text-xs font-semibold text-gray-900 mb-2">Process Information</h5>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Process Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentAnalysis.processLocation || ''}
                      onChange={(e) => {
                        const updatedAnalyses = [...processImpactAnalyses];
                        updatedAnalyses[activeProcessIndex] = {
                          ...updatedAnalyses[activeProcessIndex],
                          processLocation: e.target.value
                        };
                        setProcessImpactAnalyses(updatedAnalyses);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select location...</option>
                      {golfSaudiLocations.map(location => (
                        <option key={location.id} value={location.locationName}>
                          {location.locationName} ({location.locationCode}) - {location.city}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">Where is this process performed?</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Assigned SME <span className="text-gray-400">(Optional)</span>
                    </label>
                    <select
                      value={currentAnalysis.assignedSmeId || ''}
                      onChange={(e) => {
                        const selectedUser = usersLibrary.find(u => u.id?.toString() === e.target.value);
                        const updatedAnalyses = [...processImpactAnalyses];
                        updatedAnalyses[activeProcessIndex] = {
                          ...updatedAnalyses[activeProcessIndex],
                          assignedSmeId: e.target.value,
                          assignedSmeName: selectedUser ? selectedUser.fullName : ''
                        };
                        setProcessImpactAnalyses(updatedAnalyses);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Assign to SME...</option>
                      {usersLibrary.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} - {(user as any).role || 'No Role'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">SME responsible for this process data</p>
                  </div>
                </div>
              </div>

              {/* Impact Analysis Matrix for Current Process */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-900 mb-2">Impact Analysis Matrix</h5>
                  <p className="text-xs text-gray-600 mb-3">
                    Rate the impact on a scale of 1-5 (1=Minimal, 2=Minor, 3=Moderate, 4=Major, 5=Severe)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase border-r border-gray-200">
                            Impact Category
                          </th>
                          {timeframes.map(timeframe => (
                            <th key={timeframe} className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase border-r border-gray-200">
                              {timeframe}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentAnalysis.analysisMatrix.map((category, categoryIndex) => (
                          <tr key={category.impactCategory}>
                            <td className="px-3 py-2 text-xs font-medium text-gray-900 border-r border-gray-200">
                              {category.impactCategory}
                            </td>
                            {category.timeframes.map((timeframe, timeframeIndex) => (
                              <td key={timeframe.timeframe} className="px-3 py-2 text-center border-r border-gray-200">
                                <select
                                  value={timeframe.impactRating}
                                  onChange={(e) => updateImpactRating(categoryIndex, timeframeIndex, parseInt(e.target.value), activeProcessIndex)}
                                  className={`w-28 text-center border-2 rounded-sm font-medium text-xs px-2 py-1 ${
                                    timeframe.impactRating >= criticalityThreshold
                                      ? 'border-red-500 bg-red-50 text-red-800'
                                      : timeframe.impactRating >= 3
                                      ? 'border-orange-500 bg-orange-50 text-orange-800'
                                      : timeframe.impactRating >= 2
                                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                                      : 'border-green-500 bg-green-50 text-green-800'
                                  }`}
                                  style={{
                                    backgroundColor: timeframe.impactRating >= criticalityThreshold ? '#fef2f2' :
                                                    timeframe.impactRating >= 3 ? '#fff7ed' :
                                                    timeframe.impactRating >= 2 ? '#fefce8' : '#f0fdf4'
                                  }}
                                >
                                  <option value={1} style={{color: '#166534', backgroundColor: '#f0fdf4'}}>1 - Low</option>
                                  <option value={2} style={{color: '#a16207', backgroundColor: '#fefce8'}}>2 - Minor</option>
                                  <option value={3} style={{color: '#c2410c', backgroundColor: '#fff7ed'}}>3 - Moderate</option>
                                  <option value={4} style={{color: '#dc2626', backgroundColor: '#fef2f2'}}>4 - Major</option>
                                  <option value={5} style={{color: '#dc2626', backgroundColor: '#fef2f2'}}>5 - Severe</option>
                                </select>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MTPD & RTO - SCORE CARD DESIGN */}
                {currentAnalysis.mtpdCalculation && (
                  <div className="grid grid-cols-3 gap-3">
                    {/* MTPD Card */}
                    <div className="bg-white border border-gray-200 rounded-sm p-3">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">MTPD Calculated</p>
                      <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{currentAnalysis.mtpdCalculation.calculatedMTPD}</p>
                        <span className="ml-1 text-xs text-gray-500">hours</span>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Category</span>
                          <span className="font-medium text-gray-900">{currentAnalysis.mtpdCalculation.triggeringCategory}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Timeframe</span>
                          <span className="font-medium text-gray-900">{currentAnalysis.mtpdCalculation.triggeringTimeframe}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Impact Rating</span>
                          <span className="font-medium text-gray-900">{currentAnalysis.mtpdCalculation.triggeringRating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* System Suggested RTO Card */}
                    <div className="bg-white border border-gray-200 rounded-sm p-3">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">System Suggested RTO</p>
                      <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{getSuggestedRTO(currentAnalysis.mtpdCalculation.calculatedMTPD, rtoCalculationMethod)}</p>
                        <span className="ml-1 text-xs text-gray-500">hours</span>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Method</span>
                          <span className="font-medium text-gray-900">
                            {rtoCalculationMethod === 'T_MINUS_1' ? 'T-1' : `${rtoPercentage}%`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Based on MTPD</span>
                          <span className="font-medium text-gray-900">{currentAnalysis.mtpdCalculation.calculatedMTPD}h</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600">Status</span>
                          <span className="font-medium text-blue-600">Auto-calculated</span>
                        </div>
                      </div>
                    </div>

                    {/* Final RTO Input Card */}
                    <div className="bg-white border border-gray-200 rounded-sm p-3">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Final RTO <span className="text-red-500">*</span></p>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={currentAnalysis.mtpdCalculation.calculatedMTPD - 1}
                          value={currentAnalysis.rtoValue || ''}
                          onChange={(e) => {
                            const newRTO = parseInt(e.target.value);
                            const mtpd = currentAnalysis.mtpdCalculation!.calculatedMTPD;
                            const suggestedRTO = getSuggestedRTO(mtpd, rtoCalculationMethod);

                            // Validation: RTO must be less than MTPD
                            if (newRTO >= mtpd) {
                              alert(`⚠️ RTO Validation Error\n\nRTO (${newRTO}h) must be less than MTPD (${mtpd}h).\n\nRecovery Time Objective cannot exceed Maximum Tolerable Period of Disruption.`);
                              return;
                            }

                            setProcessImpactAnalyses(prev => prev.map((p, i) =>
                              i === activeProcessIndex
                                ? {
                                    ...p,
                                    rtoValue: newRTO,
                                    isRTOOverride: newRTO !== suggestedRTO
                                  }
                                : p
                            ));
                          }}
                          className={`w-20 px-2 py-1 text-sm font-semibold border rounded-sm focus:ring-1 ${
                            currentAnalysis.rtoValue && currentAnalysis.rtoValue >= currentAnalysis.mtpdCalculation.calculatedMTPD
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
                          }`}
                          placeholder="RTO"
                        />
                        <span className="text-xs text-gray-500">hours</span>
                      </div>

                      {/* Enhanced Validation Messages */}
                      {currentAnalysis.rtoValue && currentAnalysis.rtoValue >= currentAnalysis.mtpdCalculation.calculatedMTPD && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-sm p-2">
                          <div className="flex items-start">
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] font-semibold text-red-900">RTO Exceeds MTPD</p>
                              <p className="text-[10px] text-red-700 mt-0.5">
                                RTO ({currentAnalysis.rtoValue}h) must be less than MTPD ({currentAnalysis.mtpdCalculation.calculatedMTPD}h).
                                The recovery time cannot exceed the maximum tolerable disruption period.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentAnalysis.rtoValue && currentAnalysis.rtoValue < currentAnalysis.mtpdCalculation.calculatedMTPD && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-sm p-2">
                          <div className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] font-semibold text-green-900">Valid RTO</p>
                              <p className="text-[10px] text-green-700 mt-0.5">
                                RTO ({currentAnalysis.rtoValue}h) is within acceptable range (less than MTPD of {currentAnalysis.mtpdCalculation.calculatedMTPD}h).
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-2">
                        {!currentAnalysis.rtoValue ? (
                          <button
                            onClick={() => {
                              const suggestedRTO = getSuggestedRTO(currentAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod);
                              setProcessImpactAnalyses(prev => prev.map((p, i) =>
                                i === activeProcessIndex
                                  ? { ...p, rtoValue: suggestedRTO, isRTOOverride: false }
                                  : p
                              ));
                            }}
                            className="w-full px-2 py-1 text-[10px] font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm"
                          >
                            Use Suggested ({getSuggestedRTO(currentAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod)}h)
                          </button>
                        ) : currentAnalysis.rtoValue !== getSuggestedRTO(currentAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod) ? (
                          <div className="space-y-1">
                            <div className="flex items-center text-[10px] text-amber-600">
                              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              <span>Override: {currentAnalysis.rtoValue}h vs {getSuggestedRTO(currentAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod)}h</span>
                            </div>
                            <textarea
                              value={currentAnalysis.rtoJustification || ''}
                              onChange={(e) => {
                                setProcessImpactAnalyses(prev => prev.map((p, i) =>
                                  i === activeProcessIndex
                                    ? { ...p, rtoJustification: e.target.value }
                                    : p
                                ));
                              }}
                              className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded-sm focus:ring-gray-900 focus:border-gray-900"
                              rows={2}
                              placeholder="Justification..."
                            />
                          </div>
                        ) : (
                          <div className="flex items-center text-[10px] text-green-600">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            <span>Matches suggestion</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Golf Saudi Note: RPO Not Captured at Process Level */}
                {currentAnalysis.mtpdCalculation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                    <div className="flex items-start">
                      <svg className="h-4 w-4 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h6 className="text-xs font-semibold text-blue-900">Process-Level Analysis</h6>
                        <p className="text-[10px] text-blue-700 mt-1">
                          <strong>RPO (Recovery Point Objective) is not captured at the process level.</strong> RPO applies to technology/applications and department-level BIA. Process-level analysis focuses on RTO (Recovery Time Objective) based on MTPD.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Department BIA Rendering (Legacy single analysis)
    return (
      <div className="space-y-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Impact Analysis</h3>
          <p className="text-sm text-blue-700">
            Evaluate disruption impact to <strong>{selectedDepartment?.nodeName}</strong> across categories and timeframes. MTPD is automatically calculated when any impact reaches the criticality threshold of {criticalityThreshold}.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{selectedDepartment?.nodeName}</h4>
              <p className="text-sm text-gray-500">
                Manager: {selectedDepartment?.manager || 'Not specified'} | Type: {selectedDepartment?.nodeType}
              </p>
            </div>

            {!impactAnalysis ? (
              <button
                onClick={startImpactAnalysis}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CalculatorIcon className="h-4 w-4 mr-2" />
                Start Analysis
              </button>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Analysis in Progress</span>
              </div>
            )}
          </div>

          {impactAnalysis && (
            <div className="space-y-6">
              {/* Impact Analysis Matrix */}
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-4">Impact Analysis Matrix</h5>
                <p className="text-sm text-gray-600 mb-4">
                  Rate the impact on a scale of 1-5 (1=Minimal, 2=Minor, 3=Moderate, 4=Major, 5=Severe)
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                          Impact Category
                        </th>
                        {timeframes.map(timeframe => (
                          <th key={timeframe} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                            {timeframe}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {impactAnalysis.analysisMatrix.map((category, categoryIndex) => (
                        <tr key={category.impactCategory}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r border-gray-200">
                            {category.impactCategory}
                          </td>
                          {category.timeframes.map((timeframe, timeframeIndex) => (
                            <td key={timeframe.timeframe} className="px-4 py-2 text-center border-r border-gray-200">
                              <select
                                value={timeframe.impactRating}
                                onChange={(e) => updateImpactRating(categoryIndex, timeframeIndex, parseInt(e.target.value))}
                                className={`w-24 text-center border-2 rounded font-medium text-sm ${
                                  timeframe.impactRating >= criticalityThreshold
                                    ? 'border-red-500 bg-red-50 text-red-800'
                                    : timeframe.impactRating >= 3
                                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                                    : timeframe.impactRating >= 2
                                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                                    : 'border-green-500 bg-green-50 text-green-800'
                                }`}
                                style={{
                                  backgroundColor: timeframe.impactRating >= criticalityThreshold ? '#fef2f2' :
                                                  timeframe.impactRating >= 3 ? '#fff7ed' :
                                                  timeframe.impactRating >= 2 ? '#fefce8' : '#f0fdf4'
                                }}
                              >
                                <option value={1} style={{color: '#166534', backgroundColor: '#f0fdf4'}}>1 - Low</option>
                                <option value={2} style={{color: '#a16207', backgroundColor: '#fefce8'}}>2 - Minor</option>
                                <option value={3} style={{color: '#c2410c', backgroundColor: '#fff7ed'}}>3 - Moderate</option>
                                <option value={4} style={{color: '#dc2626', backgroundColor: '#fef2f2'}}>4 - Major</option>
                                <option value={5} style={{color: '#dc2626', backgroundColor: '#fef2f2'}}>5 - Severe</option>
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MTPD & RTO - SCORE CARD DESIGN */}
              {impactAnalysis.mtpdCalculation && (
                <div className="grid grid-cols-4 gap-3">
                  {/* MTPD Card */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">MTPD Calculated</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{impactAnalysis.mtpdCalculation.calculatedMTPD}</p>
                      <span className="ml-1 text-xs text-gray-500">hours</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium text-gray-900">{impactAnalysis.mtpdCalculation.triggeringCategory}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Timeframe</span>
                        <span className="font-medium text-gray-900">{impactAnalysis.mtpdCalculation.triggeringTimeframe}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Impact Rating</span>
                        <span className="font-medium text-gray-900">{impactAnalysis.mtpdCalculation.triggeringRating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* System Suggested RTO Card */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">System Suggested RTO</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{getSuggestedRTO(impactAnalysis.mtpdCalculation.calculatedMTPD, rtoCalculationMethod)}</p>
                      <span className="ml-1 text-xs text-gray-500">hours</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Method</span>
                        <span className="font-medium text-gray-900">
                          {rtoCalculationMethod === 'T_MINUS_1' ? 'T-1' : `${rtoPercentage}%`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Based on MTPD</span>
                        <span className="font-medium text-gray-900">{impactAnalysis.mtpdCalculation.calculatedMTPD}h</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-blue-600">Auto-calculated</span>
                      </div>
                    </div>
                  </div>

                  {/* Final RTO Input Card */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Final RTO <span className="text-red-500">*</span></p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={impactAnalysis.mtpdCalculation.calculatedMTPD - 1}
                        value={impactAnalysis.rtoValue || ''}
                        onChange={(e) => {
                          const newRTO = parseInt(e.target.value);
                          const suggestedRTO = getSuggestedRTO(impactAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod);

                          setImpactAnalysis(prev => ({
                            ...prev!,
                            rtoValue: newRTO,
                            isRTOOverride: newRTO !== suggestedRTO
                          }));
                        }}
                        className="w-20 px-2 py-1 text-sm font-semibold border border-gray-300 rounded-sm focus:ring-gray-900 focus:border-gray-900"
                        placeholder="RTO"
                      />
                      <span className="text-xs text-gray-500">hours</span>
                    </div>
                    <div className="mt-2">
                      {!impactAnalysis.rtoValue ? (
                        <button
                          onClick={() => {
                            const suggestedRTO = getSuggestedRTO(impactAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod);
                            setImpactAnalysis(prev => ({
                              ...prev!,
                              rtoValue: suggestedRTO,
                              isRTOOverride: false
                            }));
                          }}
                          className="w-full px-2 py-1 text-[10px] font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm"
                        >
                          Use Suggested ({getSuggestedRTO(impactAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod)}h)
                        </button>
                      ) : impactAnalysis.rtoValue !== getSuggestedRTO(impactAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod) ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-[10px] text-amber-600">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            <span>Override: {impactAnalysis.rtoValue}h vs {getSuggestedRTO(impactAnalysis.mtpdCalculation!.calculatedMTPD, rtoCalculationMethod)}h</span>
                          </div>
                          <textarea
                            value={impactAnalysis.rtoOverrideJustification || ''}
                            onChange={(e) => {
                              setImpactAnalysis(prev => ({
                                ...prev!,
                                rtoOverrideJustification: e.target.value
                              }));
                            }}
                            className="w-full px-2 py-1 text-[10px] border border-gray-300 rounded-sm focus:ring-gray-900 focus:border-gray-900"
                            rows={2}
                            placeholder="Justification..."
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-[10px] text-green-600">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          <span>Matches suggestion</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RPO Card */}
                  <div className="bg-white border border-gray-200 rounded-sm p-3">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recovery Point Objective</p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={impactAnalysis.rpoValue || ''}
                        onChange={(e) => {
                          setImpactAnalysis(prev => ({
                            ...prev!,
                            rpoValue: parseInt(e.target.value)
                          }));
                        }}
                        className="w-20 px-2 py-1 text-sm font-semibold border border-gray-300 rounded-sm focus:ring-gray-900 focus:border-gray-900"
                        placeholder="RPO"
                      />
                      <span className="text-xs text-gray-500">hours</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Data Loss Tolerance</span>
                        <span className="font-medium text-gray-900">{impactAnalysis.rpoValue || 0}h</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Backup Frequency</span>
                        <span className="font-medium text-gray-900">
                          {impactAnalysis.rpoValue ? `Every ${impactAnalysis.rpoValue}h` : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-gray-600">Manual entry</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // RTO Validation for upstream dependencies
  const validateRTO = (upstreamRTO: number, currentRTO: number) => {
    return currentRTO >= upstreamRTO;
  };

  // Criticality calculation settings - using numeric values to match the rating system
  const impactValues = [0, 1, 2, 3, 4, 5]; // Index corresponds to rating (0=None, 1=Low, 2=Medium, 3=High, 4=Critical, 5=Severe)

  const timeWeights = {
    '<4 Hours': 10,
    '4-24 Hours': 8,
    '1-3 Days': 6,
    '4-7 Days': 4,
    '1-4 Weeks': 2,
    '>1 Month': 1
  };

  // Calculate process criticality based on impact analysis
  const calculateProcessCriticality = (impactMatrix: ImpactAnalysisMatrix[]) => {
    let maxScore = 0;

    impactMatrix.forEach(category => {
      category.timeframes.forEach(timeframe => {
        if (timeframe.impactRating && timeframe.impactRating > 0) {
          const impactValue = impactValues[timeframe.impactRating] || 0;
          const timeWeight = timeWeights[timeframe.timeframe as keyof typeof timeWeights] || 1;
          const score = impactValue * timeWeight;
          maxScore = Math.max(maxScore, score);
        }
      });
    });

    // Map score to criticality tier
    if (maxScore >= 32) return { tier: 'Tier 1 (Critical)', score: maxScore, color: 'red' };
    if (maxScore >= 24) return { tier: 'Tier 2 (High)', score: maxScore, color: 'orange' };
    if (maxScore >= 16) return { tier: 'Tier 3 (Medium)', score: maxScore, color: 'yellow' };
    if (maxScore >= 8) return { tier: 'Tier 4 (Low)', score: maxScore, color: 'green' };
    return { tier: 'Tier 5 (Minimal)', score: maxScore, color: 'gray' };
  };

  // Generate SPOF findings for risk assessment and BCP
  const generateSPOFFindings = () => {
    const findings = [];

    if (spofAnalysis.singlePersonDependency === true && spofAnalysis.singlePersonDetails) {
      findings.push({
        type: 'Single Point of Failure - Person',
        description: spofAnalysis.singlePersonDetails,
        recommendation: 'Implement cross-training, document procedures, and establish backup authorization processes',
        severity: 'High',
        riskCategory: 'Key Person Risk',
        bcpRequirement: 'Must include staff redundancy and knowledge transfer strategies'
      });
    }

    if (spofAnalysis.singleTechnologyDependency === true && spofAnalysis.singleTechnologyDetails) {
      findings.push({
        type: 'Single Point of Failure - Technology',
        description: spofAnalysis.singleTechnologyDetails,
        recommendation: 'Implement redundant systems, backup solutions, or alternative processing methods',
        severity: 'High',
        riskCategory: 'Technology Risk',
        bcpRequirement: 'Must include system redundancy and alternative processing procedures'
      });
    }

    if (spofAnalysis.singleVendorDependency === true && spofAnalysis.singleVendorDetails) {
      findings.push({
        type: 'Single Point of Failure - Vendor',
        description: spofAnalysis.singleVendorDetails,
        recommendation: 'Establish alternative vendors, negotiate backup service agreements, or develop in-house capabilities',
        severity: 'Medium',
        riskCategory: 'Vendor Risk',
        bcpRequirement: 'Must include vendor contingency plans and alternative service arrangements'
      });
    }

    return findings;
  };

  // CriticalityBadge component
  const CriticalityBadge = ({ tier, score, color }: { tier: string, score: number, color: string }) => {
    const colorClasses = {
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : color === 'yellow' ? 'bg-yellow-500' : color === 'green' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        {tier} <span className="ml-1 text-gray-600">(Score: {score})</span>
      </div>
    );
  };

  const addDependency = (item: any, type: string, customRTO?: number, rpo?: number) => {
    // For multi-process BIA: Add dependency to the active process
    if (biaType === 'process' && processImpactAnalyses.length > 0) {
      const currentAnalysis = processImpactAnalyses[activeProcessIndex];
      const defaultRTO = currentAnalysis.rtoValue || 0;
      const finalRTO = customRTO !== undefined ? customRTO : defaultRTO;

      const newDependency = {
        ...item,
        requiredRTO: finalRTO,
        rpo,
        isRTOOverridden: customRTO !== undefined,
        rtoJustification: ''
      };

      const currentDeps = currentAnalysis.dependencies || {
        upstreamProcesses: [],
        downstreamProcesses: [],
        criticalPeople: [],
        criticalAssets: [],
        criticalVendors: [],
        criticalTechnology: [],
        criticalVitalRecords: []
      };

      const updatedAnalyses = [...processImpactAnalyses];
      updatedAnalyses[activeProcessIndex] = {
        ...currentAnalysis,
        dependencies: {
          ...currentDeps,
          [type]: [...(currentDeps[type as keyof typeof currentDeps] as any[]), newDependency]
        }
      };
      setProcessImpactAnalyses(updatedAnalyses);
    } else {
      // Department BIA: Use legacy dependencies state
      const defaultRTO = rtoValue || 0;
      const finalRTO = customRTO !== undefined ? customRTO : defaultRTO;

      const newDependency = {
        ...item,
        requiredRTO: finalRTO,
        rpo,
        isRTOOverridden: customRTO !== undefined,
        rtoJustification: ''
      };

      setDependencies(prev => ({
        ...prev,
        [type]: [...prev[type as keyof typeof prev], newDependency]
      }));
    }

    setActiveLibrary(null);
    setSearchTerm('');
    setDependencyType(null);
  };

  const removeDependency = (itemId: string, type: string) => {
    // For multi-process BIA: Remove from active process
    if (biaType === 'process' && processImpactAnalyses.length > 0) {
      const currentAnalysis = processImpactAnalyses[activeProcessIndex];
      const currentDeps = currentAnalysis.dependencies || {
        upstreamProcesses: [],
        downstreamProcesses: [],
        criticalPeople: [],
        criticalAssets: [],
        criticalVendors: [],
        criticalTechnology: [],
        criticalVitalRecords: []
      };

      const updatedAnalyses = [...processImpactAnalyses];
      updatedAnalyses[activeProcessIndex] = {
        ...currentAnalysis,
        dependencies: {
          ...currentDeps,
          [type]: (currentDeps[type as keyof typeof currentDeps] as any[]).filter((item: any) => item.id !== itemId)
        }
      };
      setProcessImpactAnalyses(updatedAnalyses);
    } else {
      // Department BIA: Use legacy dependencies state
      setDependencies(prev => ({
        ...prev,
        [type]: prev[type as keyof typeof prev].filter((item: any) => item.id !== itemId)
      }));
    }
  };

  const toggleRTOOverride = (itemId: string, type: string) => {
    setDependencies(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map((item: any) =>
        item.id === itemId
          ? { ...item, isRTOOverridden: !item.isRTOOverridden, rtoJustification: item.isRTOOverridden ? '' : item.rtoJustification }
          : item
      )
    }));
  };

  const updateDependencyRTO = (itemId: string, type: string, newRTO: number) => {
    setDependencies(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map((item: any) =>
        item.id === itemId
          ? { ...item, requiredRTO: newRTO }
          : item
      )
    }));
  };

  const updateDependencyJustification = (itemId: string, type: string, justification: string) => {
    setDependencies(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map((item: any) =>
        item.id === itemId
          ? { ...item, rtoJustification: justification }
          : item
      )
    }));
  };

  const getFilteredLibrary = () => {
    if (!activeLibrary || !searchTerm) return [];

    let items: any[] = [];

    // Get items from real backend libraries
    if (activeLibrary === 'processes') {
      items = processesLibrary.map(proc => ({
        id: proc.id.toString(),
        name: proc.processName,
        department: proc.organizationalUnitName || 'No unit',
        owner: proc.processOwner || 'No owner',
        approvedRTO: 0 // RTO will come from BIA records, not process entity
      }));
    } else if (activeLibrary === 'people') {
      // Filter people by department if a process is selected
      let filteredUsers = usersLibrary;

      // If we're in multi-process BIA mode, filter by the current process's department
      if (biaType === 'process' && processImpactAnalyses.length > 0) {
        const currentProcess = selectedProcesses[activeProcessIndex];
        if (currentProcess) {
          // Get the process details to find its department
          const processDetails = processesLibrary.find(p => p.id.toString() === currentProcess.processId);
          if (processDetails && processDetails.organizationalUnitId) {
            // Filter users by the same organizational unit
            filteredUsers = usersLibrary.filter(user =>
              user.organizationalUnitId === processDetails.organizationalUnitId
            );
          }
        }
      }

      items = filteredUsers.map(user => ({
        id: user.id.toString(),
        name: user.fullName,
        role: (user as any).role || 'No role',
        department: user.organizationalUnitName || 'No unit',
        email: user.email
      }));
    } else if (activeLibrary === 'assets') {
      items = assetsLibrary.map(asset => ({
        id: asset.id.toString(),
        name: asset.assetName,
        type: asset.assetTypeName || 'Unknown',
        category: asset.categoryName || 'Unknown',
        criticality: 'Inherited' // Asset criticality is inherited from processes
      }));
    } else if (activeLibrary === 'vendors') {
      items = vendorsLibrary.map(vendor => ({
        id: vendor.id.toString(),
        name: vendor.vendorName,
        service: vendor.serviceType || 'No service type',
        sla: vendor.recoveryTimeCapability ? `RTO-C: ${vendor.recoveryTimeCapability}h` : 'No RTO-C'
      }));
    } else if (activeLibrary === 'vitalRecords') {
      items = vitalRecordsLibrary.map(record => ({
        id: record.id.toString(),
        name: record.recordName,
        type: record.recordType || 'Unknown',
        status: record.status || 'Active'
      }));
    }

    // Apply search filter
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const openLibraryModal = (library: 'processes' | 'people' | 'assets' | 'vendors' | 'vitalRecords', depType?: 'upstream' | 'downstream') => {
    setActiveLibrary(library);
    setDependencyType(depType || null);
    setSearchTerm('');
  };

  const renderDependencies = () => {
    // Multi-Process BIA: Use per-process dependencies
    if (biaType === 'process' && processImpactAnalyses.length > 0) {
      const currentAnalysis = processImpactAnalyses[activeProcessIndex];
      const currentDeps = currentAnalysis?.dependencies || {
        upstreamProcesses: [],
        downstreamProcesses: [],
        criticalPeople: [],
        criticalAssets: [],
        criticalVendors: [],
        criticalTechnology: [],
        criticalVitalRecords: []
      };

      return (
        <div className="space-y-8">
          {/* Process Tabs (Multi-Process) - Elegant Center-Aligned Switcher */}
          {selectedProcesses.length > 1 && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                {selectedProcesses.map((process, index) => {
                  const analysis = processImpactAnalyses[index];
                  const hasDeps = analysis?.dependencies && Object.values(analysis.dependencies).some((arr: any) => arr.length > 0);
                  const isActive = index === activeProcessIndex;

                  return (
                    <button
                      key={process.processId}
                      onClick={() => setActiveProcessIndex(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {process.processName}
                      {hasDeps && (
                        <CheckCircleIcon className={`h-3.5 w-3.5 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Dependencies & Resources (BETH3V){selectedProcesses.length > 1 ? ` - ${currentAnalysis.processName}` : ''}
            </h3>
            <p className="text-xs text-gray-600">Map critical dependencies using the BETH3V framework</p>
          </div>

          {/* RTO Context Card */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
            <h4 className="text-xs font-semibold text-gray-900 mb-3">Established Recovery Objectives</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Process RTO</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-xl font-semibold text-gray-900">{currentAnalysis.rtoValue || 'Not Set'}</p>
                  {currentAnalysis.rtoValue && <span className="ml-1 text-xs text-gray-500">hours</span>}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Process RPO</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-xl font-semibold text-gray-900">{currentAnalysis.rpoValue || 'Not Set'}</p>
                  {currentAnalysis.rpoValue && <span className="ml-1 text-xs text-gray-500">hours</span>}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">MTPD</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-xl font-semibold text-gray-900">{currentAnalysis.mtpdCalculation?.calculatedMTPD || 'Not Calculated'}</p>
                  {currentAnalysis.mtpdCalculation?.calculatedMTPD && <span className="ml-1 text-xs text-gray-500">hours</span>}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 mt-3">
              <strong>Note:</strong> Dependencies will inherit the process RTO ({currentAnalysis.rtoValue || 0}h) by default. You can override individual dependency RTOs with proper justification.
            </p>
          </div>

        {/* Process Dependencies */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CogIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h4 className="text-xs font-semibold text-gray-900">Process Dependencies</h4>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mb-4">
            Map upstream and downstream process relationships to understand recovery sequencing.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Upstream Dependencies */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="text-xs font-semibold text-gray-900">Upstream Dependencies</h5>
                  <p className="text-[10px] text-gray-600">Processes this process depends on</p>
                </div>
                <button
                  onClick={() => {
                    setActiveLibrary('processes');
                    setDependencyType('upstream');
                  }}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {currentDeps.upstreamProcesses.map((process: any) => {
                  const currentProcessRTO = currentAnalysis.rtoValue || 0;
                  const hasRTOConflict = currentProcessRTO > 0 && currentProcessRTO < process.approvedRTO;

                  return (
                    <div key={process.id} className="bg-gray-50 border border-gray-200 rounded-sm p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-900">{process.name}</span>
                          <div className="text-[10px] text-gray-600">
                            {process.department} • RTO: {process.approvedRTO}h
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const updatedDeps = currentDeps.upstreamProcesses.filter((p: any) => p.id !== process.id);
                            const updatedAnalyses = [...processImpactAnalyses];
                            updatedAnalyses[activeProcessIndex] = {
                              ...currentAnalysis,
                              dependencies: { ...currentDeps, upstreamProcesses: updatedDeps }
                            };
                            setProcessImpactAnalyses(updatedAnalyses);
                          }}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>

                      {/* RTO Conflict Warning */}
                      {hasRTOConflict && (
                        <div className="flex items-start space-x-1 bg-red-50 border border-red-200 rounded-sm p-2 mt-2">
                          <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="text-[10px] text-red-800">
                            <strong>RTO CONFLICT:</strong> This process RTO ({currentProcessRTO}h) is faster than the dependency RTO ({process.approvedRTO}h).
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {currentDeps.upstreamProcesses.length === 0 && (
                  <div className="text-center py-3 text-gray-500 text-[10px]">
                    No upstream dependencies added yet
                  </div>
                )}
              </div>
            </div>

            {/* Downstream Dependencies */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="text-xs font-semibold text-gray-900">Downstream Dependencies</h5>
                  <p className="text-[10px] text-gray-600">Processes that depend on this process</p>
                </div>
                <button
                  onClick={() => {
                    setActiveLibrary('processes');
                    setDependencyType('downstream');
                  }}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {currentDeps.downstreamProcesses.map((process: any) => (
                  <div key={process.id} className="bg-gray-50 border border-gray-200 rounded-sm p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-900">{process.name}</span>
                        <div className="text-[10px] text-gray-600">
                          {process.department} • RTO: {process.approvedRTO}h
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updatedDeps = currentDeps.downstreamProcesses.filter((p: any) => p.id !== process.id);
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, downstreamProcesses: updatedDeps }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {currentDeps.downstreamProcesses.length === 0 && (
                  <div className="text-center py-3 text-gray-500 text-[10px]">
                    No downstream dependencies added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key People */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h4 className="text-xs font-semibold text-gray-900">Key People</h4>
            </div>
            <button
              onClick={() => setActiveLibrary('people')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {currentDeps.criticalPeople.map((person: any) => (
              <div key={person.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{person.name}</div>
                    <div className="text-[10px] text-gray-600">{person.role} • {person.department}</div>
                  </div>
                  <button
                    onClick={() => {
                      const updatedPeople = currentDeps.criticalPeople.filter((p: any) => p.id !== person.id);
                      const updatedAnalyses = [...processImpactAnalyses];
                      updatedAnalyses[activeProcessIndex] = {
                        ...currentAnalysis,
                        dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                      };
                      setProcessImpactAnalyses(updatedAnalyses);
                    }}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>

                {/* RTO Section */}
                <div className="bg-white border border-gray-200 rounded-sm p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-gray-700">Required RTO:</span>
                    {!person.isRTOOverridden ? (
                      <button
                        onClick={() => {
                          const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                            p.id === person.id ? { ...p, isRTOOverridden: true } : p
                          );
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800"
                      >
                        Override
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                            p.id === person.id ? { ...p, isRTOOverridden: false, requiredRTO: currentAnalysis.rtoValue || 0 } : p
                          );
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="text-[10px] text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!person.isRTOOverridden ? (
                    <div className="text-xs text-gray-900">
                      {person.requiredRTO}h <span className="text-[10px] text-gray-500">(Auto-defaulted)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Required RTO (hours)</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={person.requiredRTO}
                            onChange={(e) => {
                              const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                                p.id === person.id ? { ...p, requiredRTO: parseInt(e.target.value) || 0 } : p
                              );
                              const updatedAnalyses = [...processImpactAnalyses];
                              updatedAnalyses[activeProcessIndex] = {
                                ...currentAnalysis,
                                dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                              };
                              setProcessImpactAnalyses(updatedAnalyses);
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            placeholder="Hours"
                            min="0"
                          />
                          <span className="text-[10px] text-gray-500">hours</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Justification</label>
                        <textarea
                          value={person.rtoJustification}
                          onChange={(e) => {
                            const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                              p.id === person.id ? { ...p, rtoJustification: e.target.value } : p
                            );
                            const updatedAnalyses = [...processImpactAnalyses];
                            updatedAnalyses[activeProcessIndex] = {
                              ...currentAnalysis,
                              dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                            };
                            setProcessImpactAnalyses(updatedAnalyses);
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          rows={2}
                          placeholder="Explain why this RTO differs..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Golf Saudi HR Enabler Fields */}
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-sm p-2">
                  <h6 className="text-[10px] font-semibold text-blue-900 mb-2">HR Enabler Details</h6>
                  <div className="space-y-2">
                    {/* Competencies Required */}
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">Competencies Required</label>
                      <textarea
                        value={person.competenciesRequired || ''}
                        onChange={(e) => {
                          const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                            p.id === person.id ? { ...p, competenciesRequired: e.target.value } : p
                          );
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        rows={2}
                        placeholder="List required skills, certifications, knowledge areas..."
                      />
                    </div>

                    {/* Backup Resource */}
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">Backup Resource(s)</label>
                      <select
                        value={person.backupResourceId || ''}
                        onChange={(e) => {
                          const selectedBackup = usersLibrary.find(u => u.id?.toString() === e.target.value);
                          const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                            p.id === person.id ? {
                              ...p,
                              backupResourceId: e.target.value,
                              backupResourceName: selectedBackup ? selectedBackup.fullName : ''
                            } : p
                          );
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="">Select backup resource...</option>
                        {usersLibrary
                          .filter(u => u.id?.toString() !== person.id?.toString())
                          .map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} - {(user as any).role || 'No Role'}
                            </option>
                          ))}
                      </select>
                      {person.backupResourceName && (
                        <div className="mt-1 text-[10px] text-green-600">
                          ✓ Backup: {person.backupResourceName}
                        </div>
                      )}
                    </div>

                    {/* Timeframe for Critical Employee Availability */}
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Critical Availability Timeframe (hours)
                      </label>
                      <input
                        type="number"
                        value={person.criticalAvailabilityTimeframe || ''}
                        onChange={(e) => {
                          const updatedPeople = currentDeps.criticalPeople.map((p: any) =>
                            p.id === person.id ? { ...p, criticalAvailabilityTimeframe: parseInt(e.target.value) || 0 } : p
                          );
                          const updatedAnalyses = [...processImpactAnalyses];
                          updatedAnalyses[activeProcessIndex] = {
                            ...currentAnalysis,
                            dependencies: { ...currentDeps, criticalPeople: updatedPeople }
                          };
                          setProcessImpactAnalyses(updatedAnalyses);
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        placeholder="Hours"
                        min="0"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        How quickly must this person be available during recovery?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {currentDeps.criticalPeople.length === 0 && (
              <div className="text-center py-3 text-gray-500 text-[10px]">
                No key people added yet
              </div>
            )}
          </div>
        </div>

        {/* Assets & Technology */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <ServerIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h4 className="text-xs font-semibold text-gray-900">Assets & Technology</h4>
            </div>
            <button
              onClick={() => setActiveLibrary('assets')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {currentDeps.criticalAssets.map((asset: any) => (
              <div key={asset.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{asset.name}</div>
                    <div className="text-[10px] text-gray-600">{asset.type} • {asset.category}</div>
                  </div>
                  <button
                    onClick={() => removeDependency(asset.id, 'criticalAssets')}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>

                {/* RTO Section */}
                <div className="bg-white border border-gray-200 rounded-sm p-2 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-gray-700">Required RTO:</span>
                    {!asset.isRTOOverridden ? (
                      <button
                        onClick={() => toggleRTOOverride(asset.id, 'criticalAssets')}
                        className="text-[10px] text-blue-600 hover:text-blue-800"
                      >
                        Override
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleRTOOverride(asset.id, 'criticalAssets')}
                        className="text-[10px] text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!asset.isRTOOverridden ? (
                    <div className="text-xs text-gray-900">
                      {asset.requiredRTO}h <span className="text-[10px] text-gray-500">(Auto-defaulted)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Required RTO (hours)</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={asset.requiredRTO}
                            onChange={(e) => updateDependencyRTO(asset.id, 'criticalAssets', parseInt(e.target.value) || 0)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            placeholder="Hours"
                            min="0"
                          />
                          <span className="text-[10px] text-gray-500">hours</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Justification</label>
                        <textarea
                          value={asset.rtoJustification}
                          onChange={(e) => updateDependencyJustification(asset.id, 'criticalAssets', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          rows={2}
                          placeholder="Explain why this RTO differs..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* RPO Section for Technology Assets */}
                {(asset.type === 'Application' || asset.category === 'Technology') && asset.rpo && (
                  <div className="bg-white border border-gray-200 rounded-sm p-2">
                    <span className="text-[10px] font-medium text-gray-700">RPO: </span>
                    <span className="text-xs text-gray-900">{asset.rpo}h</span>
                  </div>
                )}
              </div>
            ))}

            {currentDeps.criticalAssets.length === 0 && (
              <div className="text-center py-3 text-gray-500 text-[10px]">
                No critical assets added yet
              </div>
            )}
          </div>
        </div>

        {/* Vendors & Third Parties */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <TruckIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h4 className="text-xs font-semibold text-gray-900">Vendors & Third Parties</h4>
            </div>
            <button
              onClick={() => setActiveLibrary('vendors')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {currentDeps.criticalVendors.map((vendor: any) => (
              <div key={vendor.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-[10px] text-gray-600">{vendor.service}</div>
                    {vendor.sla && <div className="text-[10px] text-green-600">{vendor.sla}</div>}
                  </div>
                  <button
                    onClick={() => removeDependency(vendor.id, 'criticalVendors')}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>

                {/* RTO Section */}
                <div className="bg-white border border-gray-200 rounded-sm p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-gray-700">Required RTO:</span>
                    {!vendor.isRTOOverridden ? (
                      <button
                        onClick={() => toggleRTOOverride(vendor.id, 'criticalVendors')}
                        className="text-[10px] text-blue-600 hover:text-blue-800"
                      >
                        Override
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleRTOOverride(vendor.id, 'criticalVendors')}
                        className="text-[10px] text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!vendor.isRTOOverridden ? (
                    <div className="text-xs text-gray-900">
                      {vendor.requiredRTO}h <span className="text-[10px] text-gray-500">(Auto-defaulted)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Required RTO (hours)</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={vendor.requiredRTO}
                            onChange={(e) => updateDependencyRTO(vendor.id, 'criticalVendors', parseInt(e.target.value) || 0)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            placeholder="Hours"
                            min="0"
                          />
                          <span className="text-[10px] text-gray-500">hours</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Justification</label>
                        <textarea
                          value={vendor.rtoJustification}
                          onChange={(e) => updateDependencyJustification(vendor.id, 'criticalVendors', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          rows={2}
                          placeholder="Explain why this RTO differs..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {currentDeps.criticalVendors.length === 0 && (
              <div className="text-center py-3 text-gray-500 text-[10px]">
                No critical vendors added yet
              </div>
            )}
          </div>
        </div>

        {/* Vital Records */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h4 className="text-xs font-semibold text-gray-900">Vital Records</h4>
            </div>
            <button
              onClick={() => setActiveLibrary('vitalRecords')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {currentDeps.criticalVitalRecords.map((record: any) => (
              <div key={record.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">{record.name}</div>
                    <div className="text-[10px] text-gray-600">{record.type}</div>
                    {record.status && <div className="text-[10px] text-green-600">{record.status}</div>}
                  </div>
                  <button
                    onClick={() => removeDependency(record.id, 'criticalVitalRecords')}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>

                {/* RTO Section */}
                <div className="bg-white border border-gray-200 rounded-sm p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-gray-700">Required RTO:</span>
                    {!record.isRTOOverridden ? (
                      <button
                        onClick={() => toggleRTOOverride(record.id, 'criticalVitalRecords')}
                        className="text-[10px] text-blue-600 hover:text-blue-800"
                      >
                        Override
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleRTOOverride(record.id, 'criticalVitalRecords')}
                        className="text-[10px] text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!record.isRTOOverridden ? (
                    <div className="text-xs text-gray-900">
                      {record.requiredRTO}h <span className="text-[10px] text-gray-500">(Auto-defaulted)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Required RTO (hours)</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={record.requiredRTO}
                            onChange={(e) => updateDependencyRTO(record.id, 'criticalVitalRecords', parseInt(e.target.value) || 0)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            placeholder="Hours"
                            min="0"
                          />
                          <span className="text-[10px] text-gray-500">hours</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">Justification</label>
                        <textarea
                          value={record.rtoJustification}
                          onChange={(e) => updateDependencyJustification(record.id, 'criticalVitalRecords', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          rows={2}
                          placeholder="Explain why this RTO differs..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {currentDeps.criticalVitalRecords.length === 0 && (
              <div className="text-center py-3 text-gray-500 text-[10px]">
                No vital records added yet
              </div>
            )}
          </div>
        </div>

        {/* SPOF Analysis */}
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center mb-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-700 mr-2" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900">Vulnerability Check (SPOF Analysis)</h4>
              <p className="text-[10px] text-gray-600">Identify single points of failure</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Single Person Dependency */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Does this process critically depend on a single person?
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singlePersonDependency"
                      value="yes"
                      checked={spofAnalysis.singlePersonDependency === true}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singlePersonDependency: true }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singlePersonDependency"
                      value="no"
                      checked={spofAnalysis.singlePersonDependency === false}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singlePersonDependency: false, singlePersonDetails: '' }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {spofAnalysis.singlePersonDependency === true && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">
                    Provide details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={spofAnalysis.singlePersonDetails}
                    onChange={(e) => setSpofAnalysis(prev => ({ ...prev, singlePersonDetails: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    rows={2}
                    placeholder="Describe the person, role, unique skills..."
                    required
                  />
                </div>
              )}
            </div>

            {/* Single Technology Dependency */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Does recovery depend on a single piece of technology?
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singleTechnologyDependency"
                      value="yes"
                      checked={spofAnalysis.singleTechnologyDependency === true}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singleTechnologyDependency: true }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singleTechnologyDependency"
                      value="no"
                      checked={spofAnalysis.singleTechnologyDependency === false}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singleTechnologyDependency: false, singleTechnologyDetails: '' }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {spofAnalysis.singleTechnologyDependency === true && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">
                    Provide details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={spofAnalysis.singleTechnologyDetails}
                    onChange={(e) => setSpofAnalysis(prev => ({ ...prev, singleTechnologyDetails: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    rows={2}
                    placeholder="Describe the technology, why it's critical..."
                    required
                  />
                </div>
              )}
            </div>

            {/* Single Vendor Dependency */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Is there a dependency on a sole-source vendor?
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singleVendorDependency"
                      value="yes"
                      checked={spofAnalysis.singleVendorDependency === true}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singleVendorDependency: true }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="singleVendorDependency"
                      value="no"
                      checked={spofAnalysis.singleVendorDependency === false}
                      onChange={() => setSpofAnalysis(prev => ({ ...prev, singleVendorDependency: false, singleVendorDetails: '' }))}
                      className="h-3 w-3 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <span className="ml-1 text-xs text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {spofAnalysis.singleVendorDependency === true && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">
                    Provide details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={spofAnalysis.singleVendorDetails}
                    onChange={(e) => setSpofAnalysis(prev => ({ ...prev, singleVendorDetails: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    rows={2}
                    placeholder="Describe the vendor, unique service..."
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* SPOF Summary */}
          {(spofAnalysis.singlePersonDependency === true || spofAnalysis.singleTechnologyDependency === true || spofAnalysis.singleVendorDependency === true) && (
            <div className="mt-3 bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 text-gray-700 mt-0.5 mr-2" />
                <div>
                  <h5 className="text-xs font-medium text-gray-900">Single Points of Failure Identified</h5>
                  <p className="text-[10px] text-gray-600 mt-1">
                    This process has identified vulnerabilities. Consider mitigation strategies such as cross-training, redundant systems, or alternative vendors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Modal */}
        {activeLibrary && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-4 w-full max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Add {activeLibrary === 'processes'
                    ? (dependencyType === 'upstream' ? 'Upstream' : 'Downstream') + ' Process'
                    : activeLibrary === 'people' ? 'Key Person'
                    : activeLibrary === 'assets' ? 'Critical Asset'
                    : activeLibrary === 'vendors' ? 'Critical Vendor'
                    : 'Vital Record'
                  }
                </h3>
                <button
                  onClick={() => setActiveLibrary(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-2 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeLibrary}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                {/* Department Filter Info for People */}
                {activeLibrary === 'people' && biaType === 'process' && processImpactAnalyses.length > 0 && (() => {
                  const currentProcess = selectedProcesses[activeProcessIndex];
                  const processDetails = processesLibrary.find(p => p.id.toString() === currentProcess?.processId);
                  return processDetails?.organizationalUnitId ? (
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-sm p-2">
                      <p className="text-[10px] text-blue-700">
                        <strong>Smart Filter Active:</strong> Showing only people from <strong>{processDetails.organizationalUnitName}</strong> department
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-sm">
                {getFilteredLibrary().map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (activeLibrary === 'processes') {
                        const targetArray = dependencyType === 'upstream' ? 'upstreamProcesses' : 'downstreamProcesses';
                        addDependency(item, targetArray);
                      } else if (activeLibrary === 'people') {
                        // Smart RTO defaulting - no prompt needed
                        addDependency(item, 'criticalPeople');
                      } else if (activeLibrary === 'assets') {
                        // Smart RTO defaulting with optional RPO for technology assets
                        let rpo;
                        if (item.type === 'Application' || item.category === 'Technology') {
                          rpo = prompt('Enter RPO (hours) for this technology asset (optional):');
                        }
                        addDependency(item, 'criticalAssets', undefined, rpo ? parseInt(rpo) : undefined);
                      } else if (activeLibrary === 'vendors') {
                        // Smart RTO defaulting - no prompt needed
                        addDependency(item, 'criticalVendors');
                      } else if (activeLibrary === 'vitalRecords') {
                        // Smart RTO defaulting - no prompt needed
                        addDependency(item, 'criticalVitalRecords');
                      }
                    }}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-xs font-medium text-gray-900">{item.name}</div>
                    <div className="text-[10px] text-gray-500">
                      {activeLibrary === 'people' ? `${item.role} • ${item.department}` :
                       activeLibrary === 'assets' ? `${item.type} • ${item.category}` :
                       activeLibrary === 'vendors' ? item.service :
                       activeLibrary === 'vitalRecords' ? `${item.type} • ${item.status}` :
                       activeLibrary === 'processes' ? `${item.department} • Owner: ${item.owner}` :
                       item.department}
                    </div>
                    {activeLibrary === 'processes' && (
                      <div className="text-[10px] text-blue-600 font-medium">Approved RTO: {item.approvedRTO}h</div>
                    )}
                    {activeLibrary === 'vendors' && item.sla && (
                      <div className="text-[10px] text-green-600">{item.sla}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      );
    }

    // Department BIA: Use legacy dependencies
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Dependencies & Resources (BETH3V)</h3>
          <p className="text-gray-600">Map critical dependencies using the BETH3V framework with established RTO context</p>
        </div>

        {/* RTO Context Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <h4 className="text-lg font-medium text-blue-900">Established Recovery Objectives</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-sm font-medium text-blue-900">Process RTO</div>
              <div className="text-xl font-bold text-blue-700">{rtoValue || 'Not Set'} hours</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-sm font-medium text-blue-900">Process RPO</div>
              <div className="text-xl font-bold text-blue-700">{rpoValue || 'Not Set'} hours</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-sm font-medium text-blue-900">MTPD</div>
              <div className="text-xl font-bold text-blue-700">{impactAnalysis?.mtpdCalculation?.calculatedMTPD || 'Not Calculated'} hours</div>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-3">
            <strong>Note:</strong> Dependencies will inherit the process RTO ({rtoValue}h) by default. You can override individual dependency RTOs with proper justification.
          </p>
        </div>

        {/* Simplified dependencies for department BIA - just show the existing dependencies state */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600">Department BIA dependencies management (legacy mode)</p>
        </div>
      </div>
    );
  };

  // Auto-suggest RTO when MTPD is calculated using configurable method
  useEffect(() => {
    if (impactAnalysis?.mtpdCalculation && !rtoValue) {
      const rtoCalculation = calculateRTOFromMTPD(
        impactAnalysis.mtpdCalculation.calculatedMTPD,
        rtoCalculationMethod
      );

      setRtoValue(rtoCalculation.rto);
      setRtoJustification(`Auto-calculated using ${rtoCalculation.method}: ${rtoCalculation.calculation}`);
      setCalculatedRtoInfo({
        method: rtoCalculation.method,
        calculation: rtoCalculation.calculation,
        originalMtpd: impactAnalysis.mtpdCalculation.calculatedMTPD
      });
    }
  }, [impactAnalysis?.mtpdCalculation, rtoValue, rtoCalculationMethod, rtoPercentage]);

  // Calculate process criticality when impact analysis changes
  useEffect(() => {
    if (impactAnalysis?.analysisMatrix) {
      const criticality = calculateProcessCriticality(impactAnalysis.analysisMatrix);
      setProcessCriticality(criticality);
    }
  }, [impactAnalysis?.analysisMatrix]);

  // Staff List Handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffFormData({ name: '', role: '', department: '', email: '', phone: '', isKeyPerson: false, responsibilities: '' });
    setShowStaffModal(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffFormData(staff);
    setShowStaffModal(true);
  };

  const handleSaveStaff = () => {
    if (editingStaff) {
      setStaffList(staffList.map(s => s.id === editingStaff.id ? { ...staffFormData, id: editingStaff.id } as StaffMember : s));
    } else {
      const newStaff: StaffMember = { ...staffFormData, id: `staff-${Date.now()}` } as StaffMember;
      setStaffList([...staffList, newStaff]);
    }
    setShowStaffModal(false);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  // Recovery Staff Handlers
  const handleAddRecoveryStaff = () => {
    setEditingRecoveryStaff(null);
    setRecoveryStaffFormData({ name: '', role: '', recoveryRole: '', department: '', email: '', phone: '', availabilityHours: 4, alternateContact: '', skills: '' });
    setShowRecoveryStaffModal(true);
  };

  const handleEditRecoveryStaff = (staff: RecoveryStaffMember) => {
    setEditingRecoveryStaff(staff);
    setRecoveryStaffFormData(staff);
    setShowRecoveryStaffModal(true);
  };

  const handleSaveRecoveryStaff = () => {
    if (editingRecoveryStaff) {
      setRecoveryStaff(recoveryStaff.map(s => s.id === editingRecoveryStaff.id ? { ...recoveryStaffFormData, id: editingRecoveryStaff.id } as RecoveryStaffMember : s));
    } else {
      const newStaff: RecoveryStaffMember = { ...recoveryStaffFormData, id: `recovery-${Date.now()}` } as RecoveryStaffMember;
      setRecoveryStaff([...recoveryStaff, newStaff]);
    }
    setShowRecoveryStaffModal(false);
  };

  const handleDeleteRecoveryStaff = (id: string) => {
    setRecoveryStaff(recoveryStaff.filter(s => s.id !== id));
  };

  // Render Staff List
  const renderStaffList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Staff List</h3>
          <p className="text-xs text-gray-500 mt-0.5">Staff members involved in this process</p>
        </div>
        <button onClick={handleAddStaff} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Staff
        </button>
      </div>

      {staffList.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '18%'}}>Name</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '14%'}}>Role</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '12%'}}>Department</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '10%'}}>Key Person</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '37%'}}>Responsibilities</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '9%'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-xs text-gray-900">
                    <div className="font-medium truncate">{staff.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{staff.email}</div>
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-center truncate">{staff.role}</td>
                  <td className="px-2 py-2 text-xs text-gray-500 text-center truncate">{staff.department}</td>
                  <td className="px-2 py-2 text-center">
                    {staff.isKeyPerson ? (
                      <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-medium bg-blue-100 text-blue-800">Yes</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-600">No</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-500 truncate">{staff.responsibilities}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={() => handleEditStaff(staff)} className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 text-center">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No Staff Members Added</h4>
          <p className="text-xs text-gray-500 mb-4">Add staff members involved in this process</p>
          <button onClick={handleAddStaff} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
            <PlusIcon className="h-3.5 w-3.5 mr-1" />Add First Staff Member
          </button>
        </div>
      )}
    </div>
  );

  // Render Recovery Staff
  const renderRecoveryStaff = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recovery Staff</h3>
          <p className="text-xs text-gray-500 mt-0.5">Team members responsible for recovery activities</p>
        </div>
        <button onClick={handleAddRecoveryStaff} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Recovery Staff
        </button>
      </div>

      {recoveryStaff.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '18%'}}>Name</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '15%'}}>Recovery Role</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '8%'}}>Avail.</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '25%'}}>Skills</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '25%'}}>Alternate Contact</th>
                <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider" style={{width: '9%'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recoveryStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-xs text-gray-900">
                    <div className="font-medium truncate">{staff.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{staff.role}</div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-medium bg-purple-100 text-purple-800 truncate max-w-full">{staff.recoveryRole}</span>
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-900 text-center">{staff.availabilityHours}h</td>
                  <td className="px-2 py-2 text-xs text-gray-500 truncate">{staff.skills}</td>
                  <td className="px-2 py-2 text-xs text-gray-500 truncate">{staff.alternateContact || '—'}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={() => handleEditRecoveryStaff(staff)} className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDeleteRecoveryStaff(staff.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 text-center">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No Recovery Staff Assigned</h4>
          <p className="text-xs text-gray-500 mb-4">Assign team members responsible for recovery activities</p>
          <button onClick={handleAddRecoveryStaff} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
            <PlusIcon className="h-3.5 w-3.5 mr-1" />Add First Recovery Staff
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-blue-800">
              <strong>Recovery Staff</strong> are team members who will be activated during a business continuity event. Ensure availability hours align with your RTO requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Additional Information
  const renderAdditionalInformation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Additional Business Information</h3>
        <p className="text-xs text-gray-500 mt-0.5">Provide supplementary information for comprehensive business continuity planning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Context */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Business Context</label>
          <textarea
            value={additionalInfo.businessContext}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, businessContext: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Describe the broader business context and importance of this process..."
          />
        </div>

        {/* Regulatory Requirements */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Regulatory Requirements</label>
          <textarea
            value={additionalInfo.regulatoryRequirements}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, regulatoryRequirements: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="List applicable regulations and compliance requirements..."
          />
        </div>

        {/* Insurance Considerations */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Insurance Considerations</label>
          <textarea
            value={additionalInfo.insuranceConsiderations}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, insuranceConsiderations: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Describe relevant insurance coverage and limitations..."
          />
        </div>

        {/* Communication Plan */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Communication Plan</label>
          <textarea
            value={additionalInfo.communicationPlan}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, communicationPlan: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Outline the communication plan during disruption..."
          />
        </div>

        {/* Escalation Procedures */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Escalation Procedures</label>
          <textarea
            value={additionalInfo.escalationProcedures}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, escalationProcedures: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Define escalation levels and procedures..."
          />
        </div>

        {/* Alternate Work Location */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Alternate Work Location</label>
          <textarea
            value={additionalInfo.alternateWorkLocation}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, alternateWorkLocation: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Identify alternate work locations..."
          />
        </div>

        {/* Minimum Staff Required */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Staff Required</label>
          <input
            type="number"
            value={additionalInfo.minimumStaffRequired || ''}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, minimumStaffRequired: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Number of staff needed for minimum operations"
          />
        </div>

        {/* Special Equipment Needed */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Special Equipment Needed</label>
          <textarea
            value={additionalInfo.specialEquipmentNeeded}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, specialEquipmentNeeded: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="List any special equipment required for operations..."
          />
        </div>

        {/* External Dependencies */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">External Dependencies</label>
          <textarea
            value={additionalInfo.externalDependencies}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, externalDependencies: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="List external systems or services the process depends on..."
          />
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            value={additionalInfo.additionalNotes}
            onChange={(e) => setAdditionalInfo({ ...additionalInfo, additionalNotes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="Any other relevant information for business continuity planning..."
          />
        </div>
      </div>
    </div>
  );

  const renderPeakTimes = () => (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Peak Times & Critical Deadlines</h3>
          <p className="text-xs text-gray-500 mt-0.5">Define peak operational times and critical deadlines that require faster recovery</p>
        </div>
        <button
          onClick={handleAddPeakTime}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
        >
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Peak Time
        </button>
      </div>

      {/* Peak Times Table */}
      {peakTimes.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[200px]">Name</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">Peak RTO</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">Peak RPO</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[100px]">Recurrence</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[120px]">Type</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">Status</th>
                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {peakTimes.map((peakTime) => (
                <tr key={peakTime.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-900 w-[200px]">
                    <div className="font-medium truncate">{peakTime.peakTimeName}</div>
                    {peakTime.description && (
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">{peakTime.description}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-900 text-center w-[80px]">
                    {peakTimeService.formatHours(peakTime.peakRtoHours)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 text-center w-[80px]">
                    {peakTimeService.formatHours(peakTime.peakRpoHours)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 text-center w-[100px]">
                    {peakTimeService.formatRecurrenceType(peakTime.recurrenceType)}
                  </td>
                  <td className="px-3 py-2 text-center w-[120px]">
                    {peakTime.isCriticalDeadline ? (
                      <span className="inline-flex items-center justify-center w-[100px] px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-100 text-red-800">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {peakTimeService.formatDeadlineType(peakTime.deadlineType)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-[100px] px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-500">
                        Peak Time
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center w-[80px]">
                    {peakTime.isActive ? (
                      <span className="inline-flex justify-center w-[60px] px-2 py-0.5 rounded-sm text-[10px] font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex justify-center w-[60px] px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 w-[80px]">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditPeakTime(peakTime)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePeakTime(peakTime.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 text-center">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No Peak Times Defined</h4>
          <p className="text-xs text-gray-500 mb-4">
            Add peak operational times or critical deadlines that require faster recovery objectives
          </p>
          <button
            onClick={handleAddPeakTime}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add First Peak Time
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-blue-800">
              <strong>Peak Times</strong> are periods when your processes require faster recovery (e.g., month-end, payroll).
              The system will use the most aggressive (lowest) Peak RTO to calculate your final RTO requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRTODetermination = () => {
    // Multi-Process BIA: Check if we have process impact analyses
    if (biaType === 'process') {
      if (processImpactAnalyses.length === 0) {
        return (
          <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-sm">
            <CalculatorIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">No Impact Analysis Available</h4>
            <p className="text-xs text-gray-500">
              Please complete the impact analysis first to determine RTO.
            </p>
          </div>
        );
      }

      const currentAnalysis = processImpactAnalyses[activeProcessIndex];

      // RELAXED VALIDATION: Allow RTO determination even if MTPD not calculated
      const hasMTPD = currentAnalysis?.mtpdCalculation;
      const maxRTO = hasMTPD ? currentAnalysis.mtpdCalculation!.calculatedMTPD - 1 : undefined;

      return (
        <div className="space-y-6">
          {/* Process Tabs (Multi-Process) - Elegant Center-Aligned Switcher */}
          {selectedProcesses.length > 1 && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                {selectedProcesses.map((process, index) => {
                  const analysis = processImpactAnalyses[index];
                  const hasRTO = analysis?.rtoValue !== undefined;
                  const isActive = index === activeProcessIndex;

                  return (
                    <button
                      key={process.processId}
                      onClick={() => setActiveProcessIndex(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {process.processName}
                      {hasRTO && (
                        <CheckCircleIcon className={`h-3.5 w-3.5 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Header - Different messaging based on MTPD availability */}
          {hasMTPD ? (
            <div className="bg-green-50 border border-green-200 rounded-sm p-3">
              <h3 className="text-sm font-semibold text-green-900 mb-1">
                Determine Recovery Objectives{selectedProcesses.length > 1 ? ` - ${currentAnalysis.processName}` : ''}
              </h3>
              <p className="text-xs text-green-700">
                Based on the MTPD of <strong>{currentAnalysis.mtpdCalculation!.calculatedMTPD} hours</strong>, set strategic
                Recovery Time Objective (RTO). Remember: <strong>RTO must be less than MTPD</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Set Recovery Objectives{selectedProcesses.length > 1 ? ` - ${currentAnalysis.processName}` : ''}
              </h3>
              <p className="text-xs text-blue-700">
                No critical impact threshold reached in the analysis. You can still define a strategic RTO based on business requirements.
              </p>
            </div>
          )}

        {/* RTO Calculation Method Selection - Only show if MTPD exists */}
        {hasMTPD && (
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">RTO Calculation Method</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="flex items-start space-x-2 p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="rtoMethod"
                    value="T_MINUS_1"
                    checked={rtoCalculationMethod === 'T_MINUS_1'}
                    onChange={(e) => setRtoCalculationMethod(e.target.value as 'T_MINUS_1')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-xs text-gray-900">T-1 Template</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      RTO is set to the immediate timeframe before MTPD timeframe
                    </div>
                    <div className="text-[10px] text-blue-600 mt-1">
                      Example: If MTPD is "4-24 Hours", RTO becomes "&lt;4 Hours"
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-start space-x-2 p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="rtoMethod"
                    value="PERCENTAGE"
                    checked={rtoCalculationMethod === 'PERCENTAGE'}
                    onChange={(e) => setRtoCalculationMethod(e.target.value as 'PERCENTAGE')}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-xs text-gray-900">Percentage Template</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      RTO is a configurable percentage of MTPD
                    </div>
                    {rtoCalculationMethod === 'PERCENTAGE' && (
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Percentage of MTPD:
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={rtoPercentage}
                            onChange={(e) => setRtoPercentage(parseInt(e.target.value) || DEFAULT_RTO_PERCENTAGE)}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                          />
                          <span className="text-xs text-gray-600">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

          {/* Auto-suggestion card - Only show if MTPD exists */}
          {hasMTPD && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-sm p-3">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Automated RTO Calculation</h4>
              <p className="text-xs text-yellow-800 mb-3">
                Based on your impact analysis, the first 'Major' impact occurs at <strong>{currentAnalysis.mtpdCalculation!.triggeringTimeframe}</strong>.
                We recommend an RTO using the selected calculation method.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Recalculate RTO with current method for this process
                    const rtoCalculation = calculateRTOFromMTPD(
                      currentAnalysis.mtpdCalculation?.calculatedMTPD || 0,
                      rtoCalculationMethod
                    );

                    // Update the specific process analysis
                    const updatedAnalyses = [...processImpactAnalyses];
                    updatedAnalyses[activeProcessIndex] = {
                      ...currentAnalysis,
                      rtoValue: rtoCalculation.rto,
                      rtoJustification: `Auto-calculated using ${rtoCalculation.method}: ${rtoCalculation.calculation}`
                    };
                    setProcessImpactAnalyses(updatedAnalyses);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  🔄 Calculate RTO
                </button>
                <button
                  onClick={() => {
                    // Clear RTO for this process
                    const updatedAnalyses = [...processImpactAnalyses];
                    updatedAnalyses[activeProcessIndex] = {
                      ...currentAnalysis,
                      rtoValue: undefined,
                      rtoJustification: undefined
                    };
                    setProcessImpactAnalyses(updatedAnalyses);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-yellow-400 text-xs font-medium rounded-sm text-yellow-800 bg-white hover:bg-yellow-50"
                >
                  ✏️ Override Manually
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="space-y-4">
              {/* RTO Section - PROCESS BIA: NO RPO */}
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                <label className="block text-xs font-semibold text-blue-900 mb-2">
                  🎯 Recovery Time Objective (RTO) - Hours
                </label>
                <input
                  type="number"
                  value={currentAnalysis.rtoValue || ''}
                  onChange={(e) => {
                    const updatedAnalyses = [...processImpactAnalyses];
                    updatedAnalyses[activeProcessIndex] = {
                      ...currentAnalysis,
                      rtoValue: e.target.value ? parseInt(e.target.value) : undefined
                    };
                    setProcessImpactAnalyses(updatedAnalyses);
                  }}
                  max={maxRTO}
                  min={1}
                  className="block w-full px-3 py-1.5 text-xs border-blue-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Enter RTO in hours"
                />
                {hasMTPD && (
                  <p className="text-xs text-blue-700 mt-2">
                    <strong>Maximum allowed:</strong> {maxRTO} hours (MTPD - 1)
                  </p>
                )}
                {hasMTPD && currentAnalysis.rtoValue && currentAnalysis.mtpdCalculation && currentAnalysis.rtoValue >= currentAnalysis.mtpdCalculation.calculatedMTPD && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-sm">
                    ⚠️ <strong>ERROR:</strong> RTO must be less than MTPD ({currentAnalysis.mtpdCalculation.calculatedMTPD} hours)
                  </p>
                )}
                {!hasMTPD && (
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Note:</strong> No MTPD calculated. Set RTO based on business requirements.
                  </p>
                )}
              </div>

              {/* Info Box - Process BIA does not have RPO */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <div className="flex items-start">
                  <svg className="h-4 w-4 text-gray-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-gray-700">
                    <strong>Process BIA:</strong> Recovery Point Objective (RPO) is not applicable to processes. RPO is typically defined at the technology/application level.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Justification</label>
              <textarea
                value={currentAnalysis.rtoJustification || ''}
                onChange={(e) => {
                  const updatedAnalyses = [...processImpactAnalyses];
                  updatedAnalyses[activeProcessIndex] = {
                    ...currentAnalysis,
                    rtoJustification: e.target.value
                  };
                  setProcessImpactAnalyses(updatedAnalyses);
                }}
                rows={3}
                className="block w-full px-3 py-1.5 text-xs border-gray-300 rounded-sm shadow-sm focus:ring-gray-900 focus:border-gray-900"
                placeholder="Explain the rationale for this RTO value considering cost, technology, and business requirements..."
              />
            </div>
          </div>
        </div>
      );
    }

    // Department BIA: Use legacy single impact analysis
    if (!impactAnalysis?.mtpdCalculation) {
      return (
        <div className="text-center py-8 text-gray-500">
          Please complete the impact analysis first to determine RTO/RPO.
        </div>
      );
    }

    const maxRTO = impactAnalysis.mtpdCalculation.calculatedMTPD - 1;

    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Determine Recovery Objectives</h3>
          <p className="text-sm text-green-700">
            Based on the MTPD of <strong>{impactAnalysis.mtpdCalculation.calculatedMTPD} hours</strong>, set strategic
            Recovery Time Objective (RTO) and Recovery Point Objective (RPO). Remember: <strong>RTO must be less than MTPD</strong>.
          </p>
        </div>

        {/* RTO Calculation Method Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">RTO Calculation Method</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="rtoMethod"
                  value="T_MINUS_1"
                  checked={rtoCalculationMethod === 'T_MINUS_1'}
                  onChange={(e) => setRtoCalculationMethod(e.target.value as 'T_MINUS_1')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">T-1 Template</div>
                  <div className="text-sm text-gray-600">
                    RTO is set to the immediate timeframe before MTPD timeframe
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Example: If MTPD is "4-24 Hours", RTO becomes "&lt;4 Hours"
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="rtoMethod"
                  value="PERCENTAGE"
                  checked={rtoCalculationMethod === 'PERCENTAGE'}
                  onChange={(e) => setRtoCalculationMethod(e.target.value as 'PERCENTAGE')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Percentage Template</div>
                  <div className="text-sm text-gray-600">
                    RTO is a configurable percentage of MTPD
                  </div>
                  {rtoCalculationMethod === 'PERCENTAGE' && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Percentage of MTPD:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={rtoPercentage}
                          onChange={(e) => setRtoPercentage(parseInt(e.target.value) || DEFAULT_RTO_PERCENTAGE)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Department BIA RTO/RPO inputs - same as before */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                🎯 Recovery Time Objective (RTO) - Hours
              </label>
              <input
                type="number"
                value={rtoValue}
                onChange={(e) => setRtoValue(e.target.value ? parseInt(e.target.value) : '')}
                max={maxRTO}
                min={1}
                className="block w-full border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Enter RTO in hours"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-900 mb-2">
                📊 Recovery Point Objective (RPO) - Hours
              </label>
              <input
                type="number"
                value={rpoValue}
                onChange={(e) => setRpoValue(e.target.value ? parseInt(e.target.value) : '')}
                min={0}
                className="block w-full border-green-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
                placeholder="Enter RPO in hours"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Matches Library Pattern */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/bia-records')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back
            </button>
            <div className="border-l border-gray-300 h-6"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New BIA</h1>
              <p className="mt-0.5 text-xs text-gray-500">Analyze disruption impact and define recovery objectives</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {biaRecordId && (
              <BIASaveIndicator
                saveStatus={saveStatus}
                lastSavedAt={lastSavedAt}
                error={saveError}
              />
            )}
            {processCriticality && (
              <CriticalityBadge
                tier={processCriticality.tier}
                score={processCriticality.score}
                color={processCriticality.color}
              />
            )}
          </div>
        </div>
      </div>
      {/* Content - Matches Library Pattern */}
      <div className="flex-1 overflow-auto px-6 py-4">



      {/* Visual Progress Bar - No Step Numbers */}
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
        {currentStep === 0 && renderBIATypeSelection()}
        {currentStep === 1 && renderBasicInformation()}
        {currentStep === 2 && (biaType === 'department' ? renderDepartmentSelection() : renderProcessSelection())}
        {/* Dynamic steps based on template */}
        {currentStep > 2 && currentStep < steps.length - 1 && renderDynamicStep(steps[currentStep])}
        {currentStep === steps.length - 1 && (
          <div className="space-y-3" id="bia-review-content">
            {/* Header with Export Button */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Review & Submit</h3>
                <p className="text-[10px] text-gray-600">Review your BIA record and submit for approval</p>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon className="h-3 w-3 mr-1" />
                Export PDF
              </button>
            </div>

            {/* Basic Information Summary */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-gray-700">BIA Type:</span>
                  <span className="ml-2 text-gray-900 capitalize">{biaType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{basicInfo.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Analyst:</span>
                  <span className="ml-2 text-gray-900">{basicInfo.businessContinuityAnalyst}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Owner:</span>
                  <span className="ml-2 text-gray-900">{basicInfo.owner}</span>
                </div>
                {basicInfo.description && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Description:</span>
                    <span className="ml-2 text-gray-900">{basicInfo.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Multi-Process Summary */}
            {biaType === 'process' && processImpactAnalyses.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">
                  Process Analysis Summary ({processImpactAnalyses.length} {processImpactAnalyses.length === 1 ? 'Process' : 'Processes'})
                </h4>
                <div className="space-y-2">
                  {processImpactAnalyses.map((analysis, index) => {
                    const process = selectedProcesses[index];
                    const criticality = analysis.mtpdCalculation ? calculateProcessCriticality(analysis.analysisMatrix) : null;

                    return (
                      <div key={analysis.processId} className="border border-gray-200 rounded-sm p-2 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="text-xs font-medium text-gray-900">{analysis.processName}</h5>
                            <p className="text-[10px] text-gray-600 mt-0.5">Owner: {process.processOwner}</p>
                          </div>
                          {criticality && (
                            <div className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
                              {criticality.tier}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white rounded-sm p-2 border border-gray-200">
                            <div className="text-[10px] font-medium text-gray-700">MTPD</div>
                            <div className="text-sm font-bold text-gray-900">
                              {analysis.mtpdCalculation?.calculatedMTPD || 'N/A'} {analysis.mtpdCalculation ? 'h' : ''}
                            </div>
                          </div>
                          <div className="bg-white rounded-sm p-2 border border-gray-200">
                            <div className="text-[10px] font-medium text-gray-700">RTO</div>
                            <div className="text-sm font-bold text-gray-900">
                              {analysis.rtoValue || 'Not Set'} {analysis.rtoValue ? 'h' : ''}
                            </div>
                          </div>
                          <div className="bg-white rounded-sm p-2 border border-gray-200">
                            <div className="text-[10px] font-medium text-gray-700">RPO</div>
                            <div className="text-sm font-bold text-gray-900">
                              {analysis.rpoValue || 'Not Set'} {analysis.rpoValue ? 'h' : ''}
                            </div>
                          </div>
                        </div>

                        {analysis.rtoJustification && (
                          <div className="mt-2 text-[10px] text-gray-600">
                            <span className="font-medium">RTO Justification:</span> {analysis.rtoJustification}
                          </div>
                        )}

                        {/* Impact Analysis Details */}
                        {analysis.analysisMatrix && analysis.analysisMatrix.length > 0 && (
                          <div className="mt-2 border-t border-gray-200 pt-2">
                            <h6 className="text-[10px] font-semibold text-gray-900 mb-1">Impact Analysis</h6>
                            <div className="space-y-1">
                              {analysis.analysisMatrix.map((impact, idx) => {
                                const highestImpact = impact.timeframes.reduce((max, tf) =>
                                  tf.impactRating > max.impactRating ? tf : max
                                , impact.timeframes[0]);
                                return (
                                  <div key={idx} className="flex justify-between text-[10px]">
                                    <span className="text-gray-600">{impact.impactCategory}:</span>
                                    <span className="font-medium text-gray-900">
                                      {highestImpact.impactRating === 0 ? 'None' :
                                       highestImpact.impactRating === 1 ? 'Low' :
                                       highestImpact.impactRating === 2 ? 'Medium' :
                                       highestImpact.impactRating === 3 ? 'High' : 'Critical'}
                                      {highestImpact.impactRating > 0 && ` (${highestImpact.timeframe})`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Dependencies for this process */}
                        {analysis.dependencies && (
                          <div className="mt-2 border-t border-gray-200 pt-2">
                            <h6 className="text-[10px] font-semibold text-gray-900 mb-1">Dependencies</h6>
                            <div className="space-y-1">
                              {analysis.dependencies.criticalPeople && analysis.dependencies.criticalPeople.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Key People ({analysis.dependencies.criticalPeople.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.criticalPeople.map((p: any) => p.name).join(', ')}</span>
                                </div>
                              )}
                              {analysis.dependencies.criticalAssets && analysis.dependencies.criticalAssets.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Critical Assets ({analysis.dependencies.criticalAssets.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.criticalAssets.map((a: any) => a.name).join(', ')}</span>
                                </div>
                              )}
                              {analysis.dependencies.criticalVendors && analysis.dependencies.criticalVendors.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Critical Vendors ({analysis.dependencies.criticalVendors.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.criticalVendors.map((v: any) => v.name).join(', ')}</span>
                                </div>
                              )}
                              {analysis.dependencies.criticalVitalRecords && analysis.dependencies.criticalVitalRecords.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Vital Records ({analysis.dependencies.criticalVitalRecords.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.criticalVitalRecords.map((r: any) => r.name).join(', ')}</span>
                                </div>
                              )}
                              {analysis.dependencies.upstreamProcesses && analysis.dependencies.upstreamProcesses.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Upstream Processes ({analysis.dependencies.upstreamProcesses.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.upstreamProcesses.map((p: any) => p.name).join(', ')}</span>
                                </div>
                              )}
                              {analysis.dependencies.downstreamProcesses && analysis.dependencies.downstreamProcesses.length > 0 && (
                                <div className="text-[10px]">
                                  <span className="font-medium text-gray-700">Downstream Processes ({analysis.dependencies.downstreamProcesses.length}):</span>
                                  <span className="ml-1 text-gray-600">{analysis.dependencies.downstreamProcesses.map((p: any) => p.name).join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Department BIA Summary */}
            {biaType === 'department' && impactAnalysis && (
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Department Analysis Summary</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded-sm p-2 border border-gray-200">
                    <div className="text-[10px] font-medium text-gray-700">MTPD</div>
                    <div className="text-sm font-bold text-gray-900">
                      {impactAnalysis.mtpdCalculation?.calculatedMTPD || 'N/A'} h
                    </div>
                  </div>
                  <div className="bg-white rounded-sm p-2 border border-gray-200">
                    <div className="text-[10px] font-medium text-gray-700">RTO</div>
                    <div className="text-sm font-bold text-gray-900">
                      {rtoValue || 'Not Set'} h
                    </div>
                  </div>
                  <div className="bg-white rounded-sm p-2 border border-gray-200">
                    <div className="text-[10px] font-medium text-gray-700">RPO</div>
                    <div className="text-sm font-bold text-gray-900">
                      {rpoValue || 'Not Set'} h
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Peak Times & Critical Deadlines */}
            {peakTimes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Peak Times & Critical Deadlines ({peakTimes.length})</h4>
                <div className="space-y-2">
                  {peakTimes.map((peakTime, index) => (
                    <div key={index} className="border border-gray-200 rounded-sm p-2 bg-gray-50">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h5 className="text-xs font-medium text-gray-900">{peakTime.peakTimeName}</h5>
                          {peakTime.description && (
                            <p className="text-[10px] text-gray-600 mt-0.5">{peakTime.description}</p>
                          )}
                        </div>
                        {peakTime.isCriticalDeadline && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                            Critical Deadline
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] mt-2">
                        <div>
                          <span className="font-medium text-gray-700">Peak RTO:</span>
                          <span className="ml-1 text-gray-900">{peakTime.peakRtoHours}h</span>
                        </div>
                        {peakTime.peakRpoHours && (
                          <div>
                            <span className="font-medium text-gray-700">Peak RPO:</span>
                            <span className="ml-1 text-gray-900">{peakTime.peakRpoHours}h</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Recurrence:</span>
                          <span className="ml-1 text-gray-900">{peakTime.recurrenceType}</span>
                        </div>
                      </div>
                      {peakTime.businessJustification && (
                        <div className="mt-2 text-[10px]">
                          <span className="font-medium text-gray-700">Justification:</span>
                          <span className="ml-1 text-gray-600">{peakTime.businessJustification}</span>
                        </div>
                      )}
                      {peakTime.impactIfMissed && (
                        <div className="mt-1 text-[10px]">
                          <span className="font-medium text-gray-700">Impact if Missed:</span>
                          <span className="ml-1 text-gray-600">{peakTime.impactIfMissed}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPOF Analysis */}
            {(spofAnalysis.singlePersonDependency || spofAnalysis.singleTechnologyDependency || spofAnalysis.singleVendorDependency) && (
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Single Point of Failure Analysis</h4>
                <div className="space-y-2">
                  {spofAnalysis.singlePersonDependency && spofAnalysis.singlePersonDetails && (
                    <div className="border border-yellow-200 rounded-sm p-2 bg-yellow-50">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <h6 className="text-xs font-medium text-yellow-900">Single Person Dependency</h6>
                          <p className="text-[10px] text-yellow-700 mt-1">{spofAnalysis.singlePersonDetails}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {spofAnalysis.singleTechnologyDependency && spofAnalysis.singleTechnologyDetails && (
                    <div className="border border-yellow-200 rounded-sm p-2 bg-yellow-50">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <h6 className="text-xs font-medium text-yellow-900">Single Technology Dependency</h6>
                          <p className="text-[10px] text-yellow-700 mt-1">{spofAnalysis.singleTechnologyDetails}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {spofAnalysis.singleVendorDependency && spofAnalysis.singleVendorDetails && (
                    <div className="border border-yellow-200 rounded-sm p-2 bg-yellow-50">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <h6 className="text-xs font-medium text-yellow-900">Single Vendor Dependency</h6>
                          <p className="text-[10px] text-yellow-700 mt-1">{spofAnalysis.singleVendorDetails}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Golf Saudi Comments & Change Requests Panel */}
            {workflowComments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
                <h4 className="text-xs font-semibold text-gray-900 mb-3">Comments & Change Requests</h4>
                <div className="space-y-3">
                  {workflowComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`border rounded-sm p-3 ${
                        comment.commentType === 'CHANGE_REQUEST'
                          ? 'border-orange-200 bg-orange-50'
                          : comment.commentType === 'REJECTION'
                          ? 'border-red-200 bg-red-50'
                          : comment.commentType === 'APPROVAL'
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                              comment.commentType === 'CHANGE_REQUEST'
                                ? 'bg-orange-100 text-orange-800'
                                : comment.commentType === 'REJECTION'
                                ? 'bg-red-100 text-red-800'
                                : comment.commentType === 'APPROVAL'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {comment.commentType.replace(/_/g, ' ')}
                          </span>
                          {comment.isChangeRequest && comment.changeRequestStatus && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                                comment.changeRequestStatus === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : comment.changeRequestStatus === 'ADDRESSED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {comment.changeRequestStatus}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {new Date(comment.commentedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-900">{comment.commentText}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-600">
                          By: <span className="font-medium">{comment.commentedBy}</span>
                        </span>
                        {comment.isChangeRequest && comment.changeRequestStatus === 'PENDING' && currentUserRole === 'CHAMPION' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const updatedComments = workflowComments.map((c) =>
                                  c.id === comment.id ? { ...c, changeRequestStatus: 'ADDRESSED' as const } : c
                                );
                                setWorkflowComments(updatedComments);
                                alert('Change request marked as addressed!');
                              }}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-[10px] font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-900"
                            >
                              Mark as Addressed
                            </button>
                            <button
                              onClick={() => {
                                const updatedComments = workflowComments.map((c) =>
                                  c.id === comment.id ? { ...c, changeRequestStatus: 'REJECTED' as const } : c
                                );
                                setWorkflowComments(updatedComments);
                                alert('Change request rejected!');
                              }}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-[10px] font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            >
                              Reject Request
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Golf Saudi Workflow Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h4 className="text-xs font-semibold text-gray-900 mb-3">Workflow Actions</h4>

              {/* Demo Mode - View Record Button */}
              {searchParams.get('demo') === 'true' && (
                <div className="space-y-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎬</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Demo Mode Active</p>
                        <p className="text-[10px] text-gray-600">View the completed BIA record with all demo data visualized</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => router.push('/bia-records/demo')}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <span className="mr-2">✨</span>
                      View Demo BIA Record
                      <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Initiate Stage Actions */}
              {workflowStage === 'INITIATE' && workflowStatus === 'DRAFT' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                    <p className="text-[10px] text-blue-700">
                      <strong>Next Step:</strong> Submit this BIA to move to the "Complete Data Entry" stage.
                      {basicInfo.smeId ? ' The assigned SME will be notified to complete process-level information.' : ' You can complete the process-level information yourself or assign it to an SME.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setWorkflowStage('COMPLETE');
                        setWorkflowStatus('SUBMITTED');
                        alert('BIA submitted for data entry completion!');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Submit for Data Entry
                    </button>
                  </div>
                </div>
              )}

              {/* Complete Stage Actions */}
              {workflowStage === 'COMPLETE' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                    <p className="text-[10px] text-blue-700">
                      <strong>Next Step:</strong> Submit this BIA for review by the Division Head. They will review the analysis and may request changes or approve it for verification.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setWorkflowStage('REVIEW');
                        setWorkflowStatus('IN_REVIEW');
                        alert('BIA submitted for Division Head review!');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Submit for Review
                    </button>
                  </div>
                </div>
              )}

              {/* Review Stage Actions (Division Head) */}
              {workflowStage === 'REVIEW' && currentUserRole === 'DIVISION_HEAD' && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3">
                    <p className="text-[10px] text-yellow-700">
                      <strong>Division Head Review:</strong> Review the BIA analysis and either approve it for BCM verification or request changes from the Champion/SME.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        const comment = prompt('Enter any comments or change requests:');
                        if (comment) {
                          setWorkflowStatus('CHANGES_REQUESTED');
                          setWorkflowComments([...workflowComments, {
                            id: Date.now().toString(),
                            commentText: comment,
                            commentType: 'CHANGE_REQUEST',
                            isChangeRequest: true,
                            changeRequestStatus: 'PENDING',
                            commentedBy: 'Division Head',
                            commentedAt: new Date().toISOString()
                          }]);
                          alert('Change request sent to Champion/SME!');
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => {
                        setWorkflowStage('VERIFICATION');
                        setWorkflowStatus('IN_VERIFICATION');
                        alert('BIA approved and sent for BCM verification!');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Approve for Verification
                    </button>
                  </div>
                </div>
              )}

              {/* Verification Stage Actions (BCM Department) */}
              {workflowStage === 'VERIFICATION' && currentUserRole === 'BCM_VERIFIER' && (
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-sm p-3">
                    <p className="text-[10px] text-purple-700">
                      <strong>BCM Verification:</strong> Verify completeness and compliance with BCM methodology. Approve to send for final approval by Chief of Department Head.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        const comment = prompt('Enter verification comments or issues:');
                        if (comment) {
                          setWorkflowStatus('CHANGES_REQUESTED');
                          setWorkflowStage('COMPLETE');
                          setWorkflowComments([...workflowComments, {
                            id: Date.now().toString(),
                            commentText: comment,
                            commentType: 'CHANGE_REQUEST',
                            isChangeRequest: true,
                            changeRequestStatus: 'PENDING',
                            commentedBy: 'BCM Verifier',
                            commentedAt: new Date().toISOString()
                          }]);
                          alert('BIA sent back for corrections!');
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Request Corrections
                    </button>
                    <button
                      onClick={() => {
                        setWorkflowStage('APPROVAL');
                        setWorkflowStatus('VERIFIED');
                        alert('BIA verified and sent for final approval!');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      Verify & Send for Approval
                    </button>
                  </div>
                </div>
              )}

              {/* Approval Stage Actions (Chief of Department Head) */}
              {workflowStage === 'APPROVAL' && currentUserRole === 'APPROVER' && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                    <p className="text-[10px] text-green-700">
                      <strong>Final Approval:</strong> Review and provide final approval for this BIA. Once approved, the record status will be updated to "Approved" with timestamp and audit trail.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        const comment = prompt('Enter reason for rejection:');
                        if (comment) {
                          setWorkflowStatus('REJECTED');
                          setWorkflowComments([...workflowComments, {
                            id: Date.now().toString(),
                            commentText: comment,
                            commentType: 'REJECTION',
                            isChangeRequest: false,
                            commentedBy: 'Chief of Department Head',
                            commentedAt: new Date().toISOString()
                          }]);
                          alert('BIA rejected!');
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-xs font-medium rounded-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-900"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setWorkflowStage('APPROVED');
                        setWorkflowStatus('APPROVED');
                        alert('BIA APPROVED! Record status updated with timestamp and audit trail.');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-900"
                    >
                      ✓ Approve BIA
                    </button>
                  </div>
                </div>
              )}

              {/* Approved State */}
              {workflowStage === 'APPROVED' && workflowStatus === 'APPROVED' && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h5 className="text-xs font-semibold text-green-900">BIA Approved</h5>
                      <p className="text-[10px] text-green-700 mt-0.5">
                        This BIA has been approved and is now part of the official BCM documentation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-3 flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-gray-900"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (currentStep === 0) {
              if (!biaType) {
                alert('Please select a BIA type');
                return;
              }
              if (biaType === 'location') {
                router.push('/locations');
                return;
              }
            }

            // Validate step 2 based on BIA type (Process/Department selection)
            if (currentStep === 2) {
              if (biaType === 'process' && selectedProcesses.length === 0) {
                alert('Please select at least one process before proceeding');
                return;
              }
              if (biaType === 'department' && !selectedDepartment) {
                alert('Please select a department before proceeding');
                return;
              }
            }

            // Dynamic validation based on current step's field type
            const currentStepData = steps[currentStep];

            // Validate Impact Analysis step (includes MTPD and RTO)
            if (currentStepData?.fieldType === 'impact-analysis') {
              // Multi-Process BIA Validation
              if (biaType === 'process') {
                if (processImpactAnalyses.length === 0) {
                  alert('Please complete the impact analysis for at least one process before proceeding.');
                  return;
                }

                // RELAXED VALIDATION: Allow proceeding even if MTPD not calculated (process never reached criticality)
                // Only validate RTO if MTPD exists
                const processesWithMTPD = processImpactAnalyses.filter(p => p.mtpdCalculation);

                if (processesWithMTPD.length > 0) {
                  // Check if processes with MTPD have RTO set
                  const processesWithMTPDButNoRTO = processesWithMTPD.filter(p => !p.rtoValue || p.rtoValue <= 0);
                  if (processesWithMTPDButNoRTO.length > 0) {
                    alert(`Please set a Recovery Time Objective (RTO) for processes that have MTPD calculated: ${processesWithMTPDButNoRTO.map(p => p.processName).join(', ')}`);
                    return;
                  }

                  // Check if RTO < MTPD for processes with MTPD
                  const processesWithInvalidRTO = processesWithMTPD.filter(p =>
                    p.rtoValue && p.mtpdCalculation && p.rtoValue >= p.mtpdCalculation.calculatedMTPD
                  );
                  if (processesWithInvalidRTO.length > 0) {
                    const firstInvalid = processesWithInvalidRTO[0];
                    alert(`RTO must be less than MTPD for all processes. Process "${firstInvalid.processName}" has RTO (${firstInvalid.rtoValue}h) >= MTPD (${firstInvalid.mtpdCalculation?.calculatedMTPD}h).`);
                    return;
                  }
                }
              } else {
                // Department BIA Validation - RELAXED: Allow proceeding without MTPD
                if (impactAnalysis?.mtpdCalculation) {
                  // Only validate RTO if MTPD exists
                  if (!rtoValue || rtoValue <= 0) {
                    alert('Please set a Recovery Time Objective (RTO) before proceeding.');
                    return;
                  }
                  if (rtoValue >= impactAnalysis.mtpdCalculation.calculatedMTPD) {
                    alert(`RTO must be less than MTPD (${impactAnalysis.mtpdCalculation.calculatedMTPD} hours). Please adjust your RTO.`);
                    return;
                  }
                }
              }
            }

            // Validate SPOF analysis on Dependencies & Resources step (if it exists in template)
            if (currentStepData?.fieldType === 'dependencies' || currentStepData?.fieldType === 'spof-analysis') {
              // Check if any SPOF questions are unanswered
              if (spofAnalysis.singlePersonDependency === null ||
                  spofAnalysis.singleTechnologyDependency === null ||
                  spofAnalysis.singleVendorDependency === null) {
                alert('Please complete the SPOF (Single Point of Failure) analysis by answering all vulnerability questions.');
                return;
              }

              // Check if details are provided for "Yes" answers
              if (spofAnalysis.singlePersonDependency === true && !spofAnalysis.singlePersonDetails.trim()) {
                alert('Please provide details about the single person dependency.');
                return;
              }
              if (spofAnalysis.singleTechnologyDependency === true && !spofAnalysis.singleTechnologyDetails.trim()) {
                alert('Please provide details about the single technology dependency.');
                return;
              }
              if (spofAnalysis.singleVendorDependency === true && !spofAnalysis.singleVendorDetails.trim()) {
                alert('Please provide details about the sole-source vendor dependency.');
                return;
              }
            }

            // For placeholder fields (not yet implemented), allow progression without validation
            // These include: staff-list, recovery-staff, additional-information
            const placeholderFields = ['staff-list', 'recovery-staff', 'additional-information'];
            const isPlaceholderField = currentStepData?.fieldType && placeholderFields.includes(currentStepData.fieldType);

            if (isPlaceholderField) {
              console.log(`Skipping validation for placeholder field: ${currentStepData.fieldType}`);
            }

            // Move to next step (dynamic based on total steps)
            setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
          }}
          disabled={currentStep === steps.length - 1}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-gray-900"
        >
          {currentStep === 0 && biaType === 'location' ? 'Go to Locations' : 'Next'}
        </button>
      </div>
      </div>

      {/* Peak Time Modal */}
      {showPeakTimeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPeakTime ? 'Edit Peak Time' : 'Add Peak Time'}
                </h3>
                <button
                  onClick={() => setShowPeakTimeModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Peak Time Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Peak Time Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={peakTimeFormData.peakTimeName || ''}
                  onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, peakTimeName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="e.g., Month-End Financial Close"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={peakTimeFormData.description || ''}
                  onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Brief description of this peak time period"
                />
              </div>

              {/* Peak RTO and RPO */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Peak RTO (hours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={peakTimeFormData.peakRtoHours || 0}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, peakRtoHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Peak RPO (hours)</label>
                  <input
                    type="number"
                    value={peakTimeFormData.peakRpoHours || 0}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, peakRpoHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    min="0"
                  />
                </div>
              </div>

              {/* Recurrence Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Recurrence Type</label>
                <select
                  value={peakTimeFormData.recurrenceType || 'MONTHLY'}
                  onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, recurrenceType: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="ONE_TIME">One-Time</option>
                </select>
              </div>

              {/* Critical Deadline */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={peakTimeFormData.isCriticalDeadline || false}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, isCriticalDeadline: e.target.checked })}
                    className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                </div>
                <div className="ml-2">
                  <label className="text-xs font-medium text-gray-700">Mark as Critical Deadline</label>
                  <p className="text-[10px] text-gray-500">This peak time represents a critical business deadline</p>
                </div>
              </div>

              {/* Deadline Type (conditional) */}
              {peakTimeFormData.isCriticalDeadline && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Deadline Type</label>
                  <select
                    value={peakTimeFormData.deadlineType || 'CUSTOM'}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, deadlineType: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="MONTH_END">Month End</option>
                    <option value="QUARTER_END">Quarter End</option>
                    <option value="YEAR_END">Year End</option>
                    <option value="PAYROLL">Payroll</option>
                    <option value="REGULATORY_FILING">Regulatory Filing</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              )}

              {/* Business Justification */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Justification</label>
                <textarea
                  value={peakTimeFormData.businessJustification || ''}
                  onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, businessJustification: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Why does this period require faster recovery?"
                />
              </div>

              {/* Impact If Missed */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Impact If Missed</label>
                <textarea
                  value={peakTimeFormData.impactIfMissed || ''}
                  onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, impactIfMissed: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="What happens if this deadline is not met?"
                />
              </div>

              {/* Priority and Active Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={peakTimeFormData.priority || 1}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    min="1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={peakTimeFormData.isActive !== false}
                    onChange={(e) => setPeakTimeFormData({ ...peakTimeFormData, isActive: e.target.checked })}
                    className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label className="ml-2 text-xs font-medium text-gray-700">Active</label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPeakTimeModal(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePeakTime}
                className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
              >
                {editingPeakTime ? 'Update' : 'Add'} Peak Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewBIARecordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <NewBIARecordPageContent />
    </Suspense>
  );
}
