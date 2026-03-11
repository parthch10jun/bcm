/**
 * Audit Trail Service
 * Handles all audit logging and retrieval operations
 */

import { AuditEntry, AuditFilter, AuditStats, AuditActionType, AuditModule } from '@/types/audit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mock data for development
const generateMockAuditEntries = (): AuditEntry[] => {
  const entries: AuditEntry[] = [];
  const now = new Date();
  
  // Sample audit entries
  const samples = [
    { module: 'BIA' as AuditModule, action: 'CREATE' as AuditActionType, record: 'BIA-001', name: 'Payroll Processing BIA', user: 'John Smith' },
    { module: 'BIA' as AuditModule, action: 'SUBMIT' as AuditActionType, record: 'BIA-001', name: 'Payroll Processing BIA', user: 'Sarah Johnson' },
    { module: 'BIA' as AuditModule, action: 'REVIEW' as AuditActionType, record: 'BIA-001', name: 'Payroll Processing BIA', user: 'Mike Chen' },
    { module: 'BIA' as AuditModule, action: 'APPROVE' as AuditActionType, record: 'BIA-001', name: 'Payroll Processing BIA', user: 'David Wilson' },
    { module: 'RISK_ASSESSMENT' as AuditModule, action: 'CREATE' as AuditActionType, record: 'RA-021', name: 'Cybersecurity Risk Assessment', user: 'John Smith' },
    { module: 'RISK_ASSESSMENT' as AuditModule, action: 'UPDATE' as AuditActionType, record: 'RA-021', name: 'Cybersecurity Risk Assessment', user: 'John Smith', field: 'Residual Risk', oldVal: 'Medium', newVal: 'High' },
    { module: 'TREATMENT_PLAN' as AuditModule, action: 'CREATE' as AuditActionType, record: 'TP-045', name: 'Cyber Attack Mitigation', user: 'Sarah Johnson' },
    { module: 'TREATMENT_PLAN' as AuditModule, action: 'ASSIGN' as AuditActionType, record: 'TP-045', name: 'Cyber Attack Mitigation', user: 'Mike Chen' },
    { module: 'CONTROL_LIBRARY' as AuditModule, action: 'UPDATE' as AuditActionType, record: 'CTL-003', name: 'Incident Response Plan', user: 'David Wilson', field: 'Effectiveness', oldVal: 'Effective', newVal: 'Not Tested' },
    { module: 'RISK_REGISTER' as AuditModule, action: 'ESCALATE' as AuditActionType, record: 'RR-012', name: 'Data Breach Risk', user: 'System', field: 'Status', oldVal: 'Under Review', newVal: 'Escalated' },
    { module: 'BCP_TEST' as AuditModule, action: 'COMPLETE' as AuditActionType, record: 'TEST-001', name: 'DR Test Q3 2024', user: 'Sarah Johnson' },
    { module: 'ISSUE_TRACKER' as AuditModule, action: 'CREATE' as AuditActionType, record: 'ISS-015', name: 'Backup System Failure', user: 'Mike Chen' },
  ];

  samples.forEach((sample, idx) => {
    const timestamp = new Date(now.getTime() - (idx * 3600000)); // 1 hour apart
    entries.push({
      id: `audit-${idx + 1}`,
      actionType: sample.action,
      module: sample.module,
      recordId: sample.record,
      recordName: sample.name,
      fieldName: sample.field,
      oldValue: sample.oldVal,
      newValue: sample.newVal,
      performedBy: {
        userId: `user-${idx}`,
        userName: sample.user,
        userEmail: `${sample.user.toLowerCase().replace(' ', '.')}@company.com`
      },
      timestamp: timestamp.toISOString(),
      ipAddress: `192.168.1.${100 + idx}`,
      description: `${sample.user} ${sample.action.toLowerCase()}d ${sample.name}`
    });
  });

  return entries;
};

export const auditService = {
  /**
   * Log an audit entry
   */
  logEntry: async (entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<AuditEntry> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error('Failed to log audit entry');
      }

      return response.json();
    } catch (error) {
      console.error('Error logging audit entry:', error);
      // Return mock entry for development
      return {
        ...entry,
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Get audit entries with filtering
   */
  getEntries: async (filter?: AuditFilter): Promise<AuditEntry[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filter?.module) queryParams.append('module', filter.module);
      if (filter?.actionType) queryParams.append('actionType', filter.actionType);
      if (filter?.recordId) queryParams.append('recordId', filter.recordId);
      if (filter?.userId) queryParams.append('userId', filter.userId);
      if (filter?.dateFrom) queryParams.append('dateFrom', filter.dateFrom);
      if (filter?.dateTo) queryParams.append('dateTo', filter.dateTo);

      const url = `${API_BASE_URL}/api/audit/entries${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit entries');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching audit entries:', error);
      // Return mock data for development
      let entries = generateMockAuditEntries();
      
      // Apply filters
      if (filter?.module) {
        entries = entries.filter(e => e.module === filter.module);
      }
      if (filter?.recordId) {
        entries = entries.filter(e => e.recordId === filter.recordId);
      }
      if (filter?.actionType) {
        entries = entries.filter(e => e.actionType === filter.actionType);
      }
      
      return entries;
    }
  },

  /**
   * Get audit entries for a specific record
   */
  getRecordAudit: async (module: AuditModule, recordId: string): Promise<AuditEntry[]> => {
    return auditService.getEntries({ module, recordId });
  },

  /**
   * Get audit statistics
   */
  getStats: async (): Promise<AuditStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit stats');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching audit stats:', error);
      // Return mock stats for development
      const entries = generateMockAuditEntries();
      return {
        totalEntries: entries.length,
        entriesByModule: {} as any,
        entriesByAction: {} as any,
        recentActivity: entries.slice(0, 10),
        topUsers: []
      };
    }
  }
};

