import { BIAStatusSummary, ProcessBIASummary, calculateUnitBIAStatus, calculateCompletionPercentage } from '@/types/bia-status';

/**
 * Mock BIA Status Data
 * 
 * This file contains mock data for demonstrating the BIA status aggregation feature.
 * In production, this data will come from the backend API.
 * 
 * NOTE: This is temporary mock data for UI/UX demonstration purposes.
 * Will be replaced with real API calls when Process and BIA entities are implemented.
 */

// Mock processes for different organizational units
const mockProcesses: Record<string, ProcessBIASummary[]> = {
  // Customer Service Department (ID: 4)
  '4': [
    {
      id: 'proc-001',
      processName: 'Customer Onboarding',
      processOwner: 'Sarah Johnson',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-15T10:30:00Z',
      rto: 4,
      criticality: 'Tier 2'
    },
    {
      id: 'proc-002',
      processName: 'Customer Support Ticketing',
      processOwner: 'Mike Chen',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-18T14:20:00Z',
      rto: 2,
      criticality: 'Tier 1'
    },
    {
      id: 'proc-003',
      processName: 'Customer Feedback Management',
      processOwner: 'Sarah Johnson',
      biaStatus: 'IN_PROGRESS',
      lastUpdated: '2024-01-22T09:15:00Z',
      rto: 24,
      criticality: 'Tier 3'
    },
    {
      id: 'proc-004',
      processName: 'Customer Retention Programs',
      processOwner: 'Emily Davis',
      biaStatus: 'DRAFT',
      lastUpdated: '2024-01-20T16:45:00Z',
      rto: 48,
      criticality: 'Tier 3'
    },
    {
      id: 'proc-005',
      processName: 'Customer Data Management',
      processOwner: 'Mike Chen',
      biaStatus: 'NOT_STARTED',
      lastUpdated: '2024-01-10T08:00:00Z',
      rto: 8,
      criticality: 'Tier 2'
    }
  ],

  // Software Development Team (ID: 11)
  '11': [
    {
      id: 'proc-101',
      processName: 'Code Development & Review',
      processOwner: 'Alex Kumar',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-19T11:30:00Z',
      rto: 24,
      criticality: 'Tier 2'
    },
    {
      id: 'proc-102',
      processName: 'CI/CD Pipeline Management',
      processOwner: 'Alex Kumar',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-17T15:20:00Z',
      rto: 4,
      criticality: 'Tier 1'
    },
    {
      id: 'proc-103',
      processName: 'Production Deployment',
      processOwner: 'Jessica Lee',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-21T10:00:00Z',
      rto: 2,
      criticality: 'Tier 1'
    }
  ],

  // Finance Team (ID: 7)
  '7': [
    {
      id: 'proc-201',
      processName: 'Payroll Processing',
      processOwner: 'Robert Martinez',
      biaStatus: 'APPROVED',
      lastUpdated: '2024-01-16T09:00:00Z',
      rto: 4,
      criticality: 'Tier 1'
    },
    {
      id: 'proc-202',
      processName: 'Accounts Payable',
      processOwner: 'Linda Thompson',
      biaStatus: 'UNDER_REVIEW',
      lastUpdated: '2024-01-23T13:30:00Z',
      rto: 8,
      criticality: 'Tier 2'
    },
    {
      id: 'proc-203',
      processName: 'Accounts Receivable',
      processOwner: 'Robert Martinez',
      biaStatus: 'SUBMITTED',
      lastUpdated: '2024-01-22T11:15:00Z',
      rto: 8,
      criticality: 'Tier 2'
    },
    {
      id: 'proc-204',
      processName: 'Financial Reporting',
      processOwner: 'Linda Thompson',
      biaStatus: 'IN_PROGRESS',
      lastUpdated: '2024-01-24T08:45:00Z',
      rto: 24,
      criticality: 'Tier 2'
    },
    {
      id: 'proc-205',
      processName: 'Budget Planning',
      processOwner: 'Robert Martinez',
      biaStatus: 'NOT_STARTED',
      lastUpdated: '2024-01-12T10:00:00Z',
      rto: 72,
      criticality: 'Tier 3'
    },
    {
      id: 'proc-206',
      processName: 'Tax Compliance',
      processOwner: 'Linda Thompson',
      biaStatus: 'REJECTED',
      lastUpdated: '2024-01-21T14:20:00Z',
      rto: 48,
      criticality: 'Tier 2'
    }
  ],

  // HR Team (ID: 8)
  '8': [
    {
      id: 'proc-301',
      processName: 'Employee Recruitment',
      processOwner: 'Patricia Wilson',
      biaStatus: 'NOT_STARTED',
      lastUpdated: '2024-01-10T09:00:00Z',
      rto: 168,
      criticality: 'Tier 4'
    },
    {
      id: 'proc-302',
      processName: 'Employee Onboarding',
      processOwner: 'Patricia Wilson',
      biaStatus: 'NOT_STARTED',
      lastUpdated: '2024-01-11T10:30:00Z',
      rto: 72,
      criticality: 'Tier 3'
    },
    {
      id: 'proc-303',
      processName: 'Performance Management',
      processOwner: 'James Anderson',
      biaStatus: 'NOT_STARTED',
      lastUpdated: '2024-01-12T14:00:00Z',
      rto: 168,
      criticality: 'Tier 4'
    }
  ]
};

/**
 * Get BIA status summary for an organizational unit
 * 
 * @param unitId - The organizational unit ID
 * @returns BIA status summary with process breakdown
 */
export function getMockBIAStatus(unitId: string): BIAStatusSummary | null {
  const processes = mockProcesses[unitId];
  
  if (!processes || processes.length === 0) {
    return null;
  }

  // Calculate status breakdown
  const breakdown = {
    notStarted: processes.filter(p => p.biaStatus === 'NOT_STARTED').length,
    draft: processes.filter(p => p.biaStatus === 'DRAFT').length,
    inProgress: processes.filter(p => p.biaStatus === 'IN_PROGRESS').length,
    submitted: processes.filter(p => p.biaStatus === 'SUBMITTED').length,
    underReview: processes.filter(p => p.biaStatus === 'UNDER_REVIEW').length,
    approved: processes.filter(p => p.biaStatus === 'APPROVED').length,
    rejected: processes.filter(p => p.biaStatus === 'REJECTED').length,
    archived: processes.filter(p => p.biaStatus === 'ARCHIVED').length
  };

  const totalProcesses = processes.length;
  const overallStatus = calculateUnitBIAStatus(breakdown, totalProcesses);
  const completionPercentage = calculateCompletionPercentage(breakdown, totalProcesses);

  return {
    totalProcesses,
    statusBreakdown: breakdown,
    overallStatus,
    completionPercentage,
    processes
  };
}

/**
 * Check if a unit has BIA data
 */
export function hasMockBIAData(unitId: string): boolean {
  return !!mockProcesses[unitId] && mockProcesses[unitId].length > 0;
}

/**
 * Get all unit IDs that have mock BIA data
 */
export function getUnitsWithMockBIAData(): string[] {
  return Object.keys(mockProcesses);
}

