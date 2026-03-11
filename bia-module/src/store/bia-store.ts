import { BusinessProcess as Process, Department, Service, BIAConfiguration } from '@/types/bia';
import { calculateCriticalityScore, generateRecoveryPriorities } from '@/utils/bia-calculations';

// Simple in-memory store for BIA data
// In a real application, this would be connected to a database

class BIAStore {
  private processes: Map<string, Process> = new Map();
  private departments: Map<string, Department> = new Map();
  private services: Map<string, Service> = new Map();
  private configuration: BIAConfiguration;
  private isInitialized: boolean = false;

  constructor() {
    this.configuration = this.getDefaultConfiguration();
    this.initializeSampleData();
  }

  // Configuration Management
  getConfiguration(): BIAConfiguration {
    return this.configuration;
  }

  updateConfiguration(config: Partial<BIAConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
  }

  private getDefaultConfiguration(): BIAConfiguration {
    return {
      organization: {
        name: 'Sample Organization',
        industry: 'Financial Services',
        size: 'Medium (500-1000 employees)'
      },
      impactCategories: {
        financial: {
          thresholds: {
            low: 10000,
            medium: 50000,
            high: 250000,
            critical: 1000000
          },
          currency: 'USD'
        },
        timeframes: ['1 hour', '4 hours', '8 hours', '1 day', '3 days', '1 week', '1 month']
      },
      recoveryObjectives: {
        rtoOptions: ['15 minutes', '1 hour', '4 hours', '8 hours', '1 day', '3 days', '1 week'],
        rpoOptions: ['0 minutes', '15 minutes', '1 hour', '4 hours', '8 hours', '1 day']
      }
    };
  }

  // Process Management
  getAllProcesses(): Process[] {
    return Array.from(this.processes.values());
  }

  getProcess(id: string): Process | undefined {
    return this.processes.get(id);
  }

  getProcessesByDepartment(departmentId: string): Process[] {
    return Array.from(this.processes.values()).filter(p => p.processType === 'Core'); // TODO: Implement proper department filtering
  }

  createProcess(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'criticalityScore' | 'priorityRank'>): Process {
    const process: Process = {
      ...processData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      criticalityScore: 0,
      priorityRank: 0
    };

    // Calculate criticality score
    process.criticalityScore = calculateCriticalityScore(process);
    
    this.processes.set(process.id, process);
    this.updateProcessPriorities();
    // TODO: Implement department aggregates when department association is added
    // if (process.departmentId) {
    //   this.updateDepartmentAggregates(process.departmentId);
    // }

    return process;
  }

  updateProcess(id: string, updates: Partial<Process>): Process | null {
    const process = this.processes.get(id);
    if (!process) return null;

    const updatedProcess = {
      ...process,
      ...updates,
      updatedAt: new Date()
    };

    // Recalculate criticality score if impact analysis changed
    if (updates.impactAssessmentGrid) {
      updatedProcess.criticalityScore = calculateCriticalityScore(updatedProcess);
    }

    this.processes.set(id, updatedProcess);
    this.updateProcessPriorities();
    // TODO: Implement department aggregates when department association is added
    // if (updatedProcess.departmentId) {
    //   this.updateDepartmentAggregates(updatedProcess.departmentId);
    // }
    // // Also update old department if department changed
    // if (updates.departmentId && process.departmentId && process.departmentId !== updates.departmentId) {
    //   this.updateDepartmentAggregates(process.departmentId);
    // }

    return updatedProcess;
  }

  deleteProcess(id: string): boolean {
    const process = this.processes.get(id);
    const deleted = this.processes.delete(id);
    if (deleted) {
      this.updateProcessPriorities();
      // TODO: Implement department aggregates when department association is added
      // if (process?.departmentId) {
      //   this.updateDepartmentAggregates(process.departmentId);
      // }
    }
    return deleted;
  }

  // Department Management
  getAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  getDepartment(id: string): Department | undefined {
    return this.departments.get(id);
  }

  createDepartment(departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'processIds' | 'aggregatedResources' | 'effectiveRTO' | 'effectiveMTPD'>): Department {
    const department: Department = {
      ...departmentData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      processIds: [],
      aggregatedResources: {
        totalCriticalStaff: 0,
        keyApplications: [],
        criticalVendors: [],
        keyRoles: [],
        facilitiesRequired: []
      },
      effectiveRTO: '0 minutes',
      effectiveMTPD: '0 minutes'
    };

    this.departments.set(department.id, department);
    return department;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const department = this.departments.get(id);
    if (!department) return null;

    const updatedDepartment = {
      ...department,
      ...updates,
      updatedAt: new Date()
    };

    this.departments.set(id, updatedDepartment);
    this.updateDepartmentAggregates();
    return updatedDepartment;
  }



  // Service Management
  getAllServices(): Service[] {
    return Array.from(this.services.values());
  }

  getService(id: string): Service | undefined {
    return this.services.get(id);
  }

  createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'effectiveRTO' | 'effectiveRPO'>): Service {
    // Check if service with same name already exists
    const existingService = Array.from(this.services.values()).find(s => s.name === serviceData.name);
    if (existingService) {
      console.log(`Service "${serviceData.name}" already exists, skipping creation`);
      return existingService;
    }

    const service: Service = {
      ...serviceData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      effectiveRTO: '0 minutes',
      effectiveRPO: '0 minutes'
    };

    this.services.set(service.id, service);
    this.updateServiceObjectives(service.id);

    return service;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const service = this.services.get(id);
    if (!service) return null;

    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date()
    };

    this.services.set(id, updatedService);
    this.updateServiceObjectives(id);

    return updatedService;
  }

  // Public method to clean duplicates
  cleanDuplicateServices(): void {
    this.removeDuplicateServices();
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Utility methods for time calculations
  private parseTimeToMinutes(timeString: string): number | undefined {
    if (!timeString) return undefined;

    const timeStr = timeString.toLowerCase();
    const number = parseInt(timeStr);

    if (timeStr.includes('minute')) return number;
    if (timeStr.includes('hour')) return number * 60;
    if (timeStr.includes('day')) return number * 24 * 60;
    if (timeStr.includes('week')) return number * 7 * 24 * 60;
    if (timeStr.includes('month')) return number * 30 * 24 * 60;

    return undefined;
  }

  private formatMinutesToTime(minutes: number): string {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 24 * 60) return `${Math.round(minutes / 60)} hours`;
    if (minutes < 7 * 24 * 60) return `${Math.round(minutes / (24 * 60))} days`;
    if (minutes < 30 * 24 * 60) return `${Math.round(minutes / (7 * 24 * 60))} weeks`;
    return `${Math.round(minutes / (30 * 24 * 60))} months`;
  }

  private updateProcessPriorities(): void {
    const processes = Array.from(this.processes.values());
    const priorities = generateRecoveryPriorities(processes);
    
    priorities.forEach(priority => {
      const process = this.processes.get(priority.processId);
      if (process) {
        process.priorityRank = priority.priority;
        this.processes.set(process.id, process);
      }
    });
  }

  private updateDepartmentAggregates(): void {
    // TODO: Implement department aggregates when BusinessProcess has proper properties
    // this.departments.forEach(department => {
    //   const departmentProcesses = this.getProcessesByDepartment(department.id);
    //   // ... aggregation logic
    // });
    console.log('Private department aggregates update called');
  }

  private updateServiceObjectives(serviceId: string): void {
    const service = this.services.get(serviceId);
    if (!service) return;

    const requiredProcesses = service.requiredProcessIds
      .map(id => this.processes.get(id))
      .filter(p => p !== undefined) as Process[];

    if (requiredProcesses.length > 0) {
      // Effective RTO is the longest among required processes
      service.effectiveRTO = requiredProcesses
        .sort((a, b) => this.timeToMinutes(b.rto) - this.timeToMinutes(a.rto))[0].rto;
      
      // Effective RPO is the longest among required processes
      service.effectiveRPO = requiredProcesses
        .sort((a, b) => this.timeToMinutes(b.rpo) - this.timeToMinutes(a.rpo))[0].rpo;
    }

    this.services.set(serviceId, service);
  }

  private timeToMinutes(timeString: string): number {
    const time = timeString.toLowerCase();
    
    if (time.includes('minute')) {
      return parseInt(time) || 0;
    } else if (time.includes('hour')) {
      return (parseInt(time) || 0) * 60;
    } else if (time.includes('day')) {
      return (parseInt(time) || 0) * 24 * 60;
    } else if (time.includes('week')) {
      return (parseInt(time) || 0) * 7 * 24 * 60;
    }
    
    return 0;
  }

  // Clean up duplicate services
  private removeDuplicateServices(): void {
    const serviceNames = new Set<string>();
    const servicesToRemove: string[] = [];

    for (const [id, service] of this.services) {
      if (serviceNames.has(service.name)) {
        servicesToRemove.push(id);
      } else {
        serviceNames.add(service.name);
      }
    }

    servicesToRemove.forEach(id => this.services.delete(id));
    if (servicesToRemove.length > 0) {
      console.log(`Removed ${servicesToRemove.length} duplicate services`);
    }
  }

  // Initialize with sample data for demonstration
  initializeSampleData(): void {
    if (this.isInitialized) {
      console.log('Sample data already initialized, skipping...');
      return;
    }

    console.log('Initializing sample data...');
    this.isInitialized = true;

    // Clean up any existing duplicates first
    this.removeDuplicateServices();
    // Create sample departments
    const financeDept = this.createDepartment({
      name: 'Finance Department',
      description: 'Manages financial operations, accounting, and reporting',
      departmentHead: 'Jane Smith',
      bcmChampion: 'John Doe',
      departmentMission: 'Ensure accurate financial reporting and maintain fiscal responsibility',
      strategicImpact: 'Critical for regulatory compliance, investor relations, and operational funding'
    });

    const itDept = this.createDepartment({
      name: 'Information Technology',
      description: 'Manages IT infrastructure, applications, and digital services',
      departmentHead: 'Mike Johnson',
      bcmChampion: 'Sarah Wilson',
      departmentMission: 'Provide reliable and secure technology services to support business operations',
      strategicImpact: 'Essential for all digital operations and customer-facing services'
    });

    // Create sample processes
    this.createProcess({
      name: 'Payroll Processing',
      description: 'Monthly payroll calculation and payment processing for all employees',
      biaRecordId: '',
      processOwner: 'Jane Smith',
      processType: 'Core' as const,
      productServiceIds: [],
      impactAssessmentGrid: {} as any,
      peakTimes: [{
        name: 'Month-end Processing',
        description: 'End of month processing period',
        timeframe: 'Last 3 days of month',
        additionalImpact: 'Employee satisfaction and legal compliance at risk',
        frequency: 'Monthly' as const
      }],
      criticalDeadlines: [{
        name: 'Monthly Payroll Deadline',
        deadline: 'Last day of month',
        description: 'Payroll must be processed by month end',
        consequences: 'Legal violations, employee dissatisfaction, potential strikes',
        type: 'Regulatory' as const,
        isRecurring: true
      }],
      mtd: '1 day',
      rto: '4 hours',
      rpo: '1 hour',
      mbco: 'Process at least 80% of payroll within deadline',
      dependencies: [],
      staffRequirements: {
        minimumCount: 3,
        requiredSkills: ['Payroll Systems', 'Accounting', 'HR Compliance'],
        keyPersonnel: [{
          name: 'Alice Johnson',
          role: 'Payroll Manager',
          isEssential: true,
          backupPersonnel: ['Bob Smith', 'Carol Davis']
        }]
      } as any,
      applicationRequirements: [],
      itInfrastructureRequirements: [],
      vitalRecords: [],
      spofAssessment: {
        hasKeyPersonDependency: false,
        hasUndocumentedProcesses: false,
        hasSingleVendorDependency: false,
        hasUnprotectedData: false,
        hasHardwareSpof: false,
        otherSpofs: [],
        overallRiskLevel: 'Low' as const,
        mitigationPlan: ''
      },
      isComplete: false
    });

    // Create IT process
    this.createProcess({
      name: 'Network Infrastructure Management',
      description: 'Monitoring, maintenance, and support of core network infrastructure including servers, switches, and security systems',
      biaRecordId: '',
      processOwner: 'Mike Johnson',
      processType: 'Supporting' as const,
      productServiceIds: [],
      impactAssessmentGrid: {} as any,
      peakTimes: [{
        name: 'Business Hours',
        description: 'Business hours and system maintenance windows',
        timeframe: '8 AM - 6 PM weekdays',
        additionalImpact: 'All business operations dependent on network connectivity',
        frequency: 'Daily' as const
      }],
      criticalDeadlines: [{
        name: 'Network Outage Response',
        deadline: 'Immediate response to outages',
        description: 'Network outages must be addressed within 15 minutes',
        consequences: 'Complete business shutdown, customer service disruption, financial losses',
        type: 'Operational' as const,
        isRecurring: false
      }],
      mtd: '15 minutes',
      rto: '15 minutes',
      rpo: '0 minutes',
      mbco: 'Maintain 99.9% network uptime with maximum 15-minute response time to critical issues',
      dependencies: [],
      staffRequirements: {
        minimumCount: 2,
        requiredSkills: ['Network Administration', 'System Administration', 'Cybersecurity', 'Hardware Troubleshooting'],
        keyPersonnel: [{
          name: 'David Tech',
          role: 'Senior Network Administrator',
          isEssential: true,
          backupPersonnel: ['Lisa Network', 'Tom Systems']
        }]
      } as any,
      applicationRequirements: [],
      itInfrastructureRequirements: [],
      vitalRecords: [],
      spofAssessment: {
        hasKeyPersonDependency: true,
        hasUndocumentedProcesses: false,
        hasSingleVendorDependency: true,
        hasUnprotectedData: false,
        hasHardwareSpof: true,
        otherSpofs: [],
        overallRiskLevel: 'Medium' as const,
        mitigationPlan: 'Cross-train additional staff and implement redundant systems'
      },
      isComplete: false
    });

    // Create sample service
    this.createService({
      name: 'Online Banking Platform',
      description: 'Comprehensive digital banking service providing 24/7 customer access to accounts, transactions, and financial services',
      serviceOwner: 'David Chen',
      customerSegments: ['Retail Banking', 'Small Business', 'Premium Banking'],
      customerCount: 125000,
      revenueImpact: 15000000,
      requiredProcessIds: [], // Will be populated when processes are linked
      regulatoryRequirements: ['PCI DSS', 'SOX', 'GDPR', 'Basel III'],
      slas: [
        {
          metric: 'System Availability',
          target: '99.9% uptime',
          penalty: '$50,000 per hour of downtime'
        },
        {
          metric: 'Transaction Processing Time',
          target: 'Under 3 seconds',
          penalty: 'Customer compensation for delays'
        },
        {
          metric: 'Customer Support Response',
          target: 'Under 2 minutes',
          penalty: 'Service credit to affected customers'
        }
      ],
      communicationRequirements: {
        channels: ['Mobile App Notifications', 'Email Alerts', 'SMS Updates', 'Website Banner'],
        timeline: 'Immediate notification for service disruptions',
        keyMessages: [
          'Service disruption acknowledgment',
          'Expected resolution timeline',
          'Alternative service options',
          'Service restoration confirmation'
        ],
        escalationCriteria: 'Escalate to executive team if downtime exceeds 30 minutes'
      }
    });
  }
}

// Export singleton instance
export const biaStore = new BIAStore();
