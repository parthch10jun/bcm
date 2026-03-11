// BIA Reconciliation Architecture Types

export interface BIARecord {
  id: string;
  name: string;
  type: 'process' | 'department' | 'location';
  
  // Core BIA Data
  rto: number;
  rpo: number;
  mtpd: number;
  criticality: {
    tier: string;
    score: number;
    color: string;
  };
  
  // Organizational Context
  department?: string;
  location?: string;
  orgNodeId?: string; // Links to organizational chart node
  
  // Process-specific fields
  processName?: string;
  processOwner?: string;
  
  // Department-specific fields
  departmentScope?: {
    nodeId: string;
    nodeName: string;
    nodeType: 'location' | 'department' | 'subdepartment';
    fullPath: string;
    includesChildren: boolean;
    includedProcesses?: string[]; // Process IDs included in this department BIA
  };
  
  // Metadata
  status: 'draft' | 'under-review' | 'approved';
  lastUpdated: Date;
  owner: string;
  
  // Dependencies
  dependencies: {
    upstreamProcesses: any[];
    downstreamProcesses: any[];
    criticalPeople: any[];
    criticalAssets: any[];
    criticalVendors: any[];
  };
}

export interface BIAReconciliationResult {
  departmentNodeId: string;
  departmentName: string;
  departmentPath: string;
  
  // Data Sources
  directDepartmentBIA?: BIARecord; // Department Level BIA if exists
  aggregatedFromProcesses: {
    processCount: number;
    processes: BIARecord[];
    aggregatedMetrics: {
      worstCaseRTO: number;
      averageRTO: number;
      worstCaseRPO: number;
      averageRPO: number;
      highestCriticality: string;
      criticalityDistribution: Record<string, number>;
    };
  };
  
  // Reconciliation Analysis
  reconciliation: {
    hasConflict: boolean;
    conflictType?: 'rto-mismatch' | 'criticality-mismatch' | 'scope-mismatch' | 'missing-processes';
    conflictDetails?: string[];
    recommendations?: string[];
    confidenceLevel: 'high' | 'medium' | 'low';
    lastAnalyzed: Date;
  };
  
  // Authoritative Source
  authoritativeSource: 'department-bia' | 'aggregated-processes' | 'hybrid';
  effectiveMetrics: {
    rto: number;
    rpo: number;
    criticality: string;
    justification: string;
  };
}

export interface BIAHierarchyValidation {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  
  // Validation Results
  isValid: boolean;
  issues: BIAValidationIssue[];
  
  // Child Validation
  children: BIAHierarchyValidation[];
  
  // Summary
  totalProcesses: number;
  totalDepartmentBIAs: number;
  conflictCount: number;
  coveragePercentage: number; // % of processes covered by BIA
}

export interface BIAValidationIssue {
  type: 'missing-bia' | 'rto-conflict' | 'criticality-mismatch' | 'orphaned-process' | 'scope-gap';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedItems: string[];
  recommendation: string;
  autoFixable: boolean;
}

// BIA Reconciliation Engine
export class BIAReconciliationEngine {
  
  /**
   * Reconcile Department BIA with aggregated Process BIAs
   */
  static reconcileDepartmentBIA(
    departmentNodeId: string,
    departmentBIA: BIARecord | null,
    processBIAs: BIARecord[],
    orgStructure: any
  ): BIAReconciliationResult {
    
    const departmentNode = this.findNodeInStructure(departmentNodeId, orgStructure);
    if (!departmentNode) {
      throw new Error(`Department node ${departmentNodeId} not found`);
    }
    
    // Calculate aggregated metrics from processes
    const aggregatedMetrics = this.calculateAggregatedMetrics(processBIAs);
    
    // Analyze conflicts if both sources exist
    const reconciliation = departmentBIA 
      ? this.analyzeConflicts(departmentBIA, aggregatedMetrics, processBIAs)
      : { hasConflict: false, confidenceLevel: 'high' as const, lastAnalyzed: new Date() };
    
    // Determine authoritative source
    const authoritativeSource = this.determineAuthoritativeSource(
      departmentBIA, 
      processBIAs, 
      reconciliation
    );
    
    // Calculate effective metrics
    const effectiveMetrics = this.calculateEffectiveMetrics(
      departmentBIA,
      aggregatedMetrics,
      authoritativeSource
    );
    
    return {
      departmentNodeId,
      departmentName: departmentNode.label,
      departmentPath: this.getNodePath(departmentNodeId, orgStructure),
      directDepartmentBIA: departmentBIA || undefined,
      aggregatedFromProcesses: {
        processCount: processBIAs.length,
        processes: processBIAs,
        aggregatedMetrics
      },
      reconciliation,
      authoritativeSource,
      effectiveMetrics
    };
  }
  
  /**
   * Calculate aggregated metrics from process BIAs
   */
  static calculateAggregatedMetrics(processBIAs: BIARecord[]) {
    if (processBIAs.length === 0) {
      return {
        worstCaseRTO: 0,
        averageRTO: 0,
        worstCaseRPO: 0,
        averageRPO: 0,
        highestCriticality: 'Tier 5',
        criticalityDistribution: {}
      };
    }
    
    const rtos = processBIAs.map(p => p.rto);
    const rpos = processBIAs.map(p => p.rpo);
    
    // For department-level aggregation, we typically care about:
    // - Worst case RTO (longest recovery time needed)
    // - Average RTO (typical recovery expectation)
    // - Highest criticality (most critical process determines department criticality)
    
    const criticalityOrder = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
    const highestCriticality = processBIAs.reduce((highest, process) => {
      const currentIndex = criticalityOrder.indexOf(process.criticality.tier.split(' ')[0] + ' ' + process.criticality.tier.split(' ')[1]);
      const highestIndex = criticalityOrder.indexOf(highest.split(' ')[0] + ' ' + highest.split(' ')[1]);
      return currentIndex < highestIndex ? process.criticality.tier : highest;
    }, 'Tier 5');
    
    const criticalityDistribution = processBIAs.reduce((dist, process) => {
      const tier = process.criticality.tier.split(' ')[0] + ' ' + process.criticality.tier.split(' ')[1];
      dist[tier] = (dist[tier] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);
    
    return {
      worstCaseRTO: Math.max(...rtos),
      averageRTO: Math.round((rtos.reduce((sum, rto) => sum + rto, 0) / rtos.length) * 10) / 10,
      worstCaseRPO: Math.max(...rpos),
      averageRPO: Math.round((rpos.reduce((sum, rpo) => sum + rpo, 0) / rpos.length) * 10) / 10,
      highestCriticality,
      criticalityDistribution
    };
  }
  
  /**
   * Analyze conflicts between department BIA and aggregated process BIAs
   */
  static analyzeConflicts(
    departmentBIA: BIARecord,
    aggregatedMetrics: any,
    processBIAs: BIARecord[]
  ) {
    const conflicts: string[] = [];
    const recommendations: string[] = [];
    let conflictType: 'rto-mismatch' | 'criticality-mismatch' | 'scope-mismatch' | 'missing-processes' | undefined;
    
    // RTO Conflict Analysis
    if (departmentBIA.rto < aggregatedMetrics.worstCaseRTO) {
      conflicts.push(`Department RTO (${departmentBIA.rto}h) is faster than worst-case process RTO (${aggregatedMetrics.worstCaseRTO}h)`);
      recommendations.push('Consider adjusting department RTO to account for all constituent processes');
      conflictType = 'rto-mismatch';
    }
    
    // Criticality Conflict Analysis
    const deptCriticalityTier = departmentBIA.criticality.tier.split(' ')[0] + ' ' + departmentBIA.criticality.tier.split(' ')[1];
    const aggCriticalityTier = aggregatedMetrics.highestCriticality.split(' ')[0] + ' ' + aggregatedMetrics.highestCriticality.split(' ')[1];
    
    const criticalityOrder = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
    const deptIndex = criticalityOrder.indexOf(deptCriticalityTier);
    const aggIndex = criticalityOrder.indexOf(aggCriticalityTier);
    
    if (deptIndex > aggIndex) {
      conflicts.push(`Department criticality (${deptCriticalityTier}) is lower than highest process criticality (${aggCriticalityTier})`);
      recommendations.push('Department criticality should typically match or exceed the highest constituent process criticality');
      conflictType = conflictType || 'criticality-mismatch';
    }
    
    // Scope Analysis
    if (departmentBIA.departmentScope?.includedProcesses) {
      const includedProcessIds = new Set(departmentBIA.departmentScope.includedProcesses);
      const actualProcessIds = new Set(processBIAs.map(p => p.id));
      
      const missingProcesses = [...actualProcessIds].filter(id => !includedProcessIds.has(id));
      const extraProcesses = [...includedProcessIds].filter(id => !actualProcessIds.has(id));
      
      if (missingProcesses.length > 0 || extraProcesses.length > 0) {
        conflicts.push(`Scope mismatch: ${missingProcesses.length} processes not included in department BIA, ${extraProcesses.length} extra processes referenced`);
        recommendations.push('Update department BIA scope to match actual processes in the department');
        conflictType = conflictType || 'scope-mismatch';
      }
    }
    
    const confidenceLevel: 'high' | 'medium' | 'low' = conflicts.length === 0 ? 'high' :
                           conflicts.length <= 2 ? 'medium' : 'low';
    
    return {
      hasConflict: conflicts.length > 0,
      conflictType,
      conflictDetails: conflicts,
      recommendations,
      confidenceLevel,
      lastAnalyzed: new Date()
    };
  }
  
  /**
   * Determine which source should be considered authoritative
   */
  static determineAuthoritativeSource(
    departmentBIA: BIARecord | null,
    processBIAs: BIARecord[],
    reconciliation: any
  ): 'department-bia' | 'aggregated-processes' | 'hybrid' {
    
    // If no department BIA exists, use aggregated
    if (!departmentBIA) {
      return 'aggregated-processes';
    }
    
    // If no process BIAs exist, use department BIA
    if (processBIAs.length === 0) {
      return 'department-bia';
    }
    
    // If no conflicts, prefer department BIA (more holistic view)
    if (!reconciliation.hasConflict) {
      return 'department-bia';
    }
    
    // If conflicts exist, use hybrid approach
    return 'hybrid';
  }
  
  /**
   * Calculate effective metrics based on authoritative source
   */
  static calculateEffectiveMetrics(
    departmentBIA: BIARecord | null,
    aggregatedMetrics: any,
    authoritativeSource: string
  ) {
    switch (authoritativeSource) {
      case 'department-bia':
        return {
          rto: departmentBIA!.rto,
          rpo: departmentBIA!.rpo,
          criticality: departmentBIA!.criticality.tier,
          justification: 'Based on direct department-level BIA analysis'
        };
        
      case 'aggregated-processes':
        return {
          rto: aggregatedMetrics.worstCaseRTO,
          rpo: aggregatedMetrics.worstCaseRPO,
          criticality: aggregatedMetrics.highestCriticality,
          justification: 'Aggregated from constituent process BIAs'
        };
        
      case 'hybrid':
        // Use more conservative (worse) values
        const hybridRTO = Math.max(
          departmentBIA?.rto || 0,
          aggregatedMetrics.worstCaseRTO
        );
        
        const criticalityOrder = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
        const deptIndex = departmentBIA ? criticalityOrder.indexOf(departmentBIA.criticality.tier.split(' ')[0] + ' ' + departmentBIA.criticality.tier.split(' ')[1]) : 4;
        const aggIndex = criticalityOrder.indexOf(aggregatedMetrics.highestCriticality.split(' ')[0] + ' ' + aggregatedMetrics.highestCriticality.split(' ')[1]);
        
        const hybridCriticality = criticalityOrder[Math.min(deptIndex, aggIndex)];
        
        return {
          rto: hybridRTO,
          rpo: Math.max(departmentBIA?.rpo || 0, aggregatedMetrics.worstCaseRPO),
          criticality: hybridCriticality,
          justification: 'Hybrid approach using most conservative values from both sources'
        };
        
      default:
        throw new Error(`Unknown authoritative source: ${authoritativeSource}`);
    }
  }
  
  // Helper methods (simplified for brevity)
  static findNodeInStructure(nodeId: string, structure: any): any {
    // Implementation would search through org structure
    return { id: nodeId, label: 'Sample Department' };
  }
  
  static getNodePath(nodeId: string, structure: any): string {
    // Implementation would build full path
    return 'Organization > Department > Sub-Department';
  }
}

// Export utility functions
export const BIAReconciliationUtils = {
  
  /**
   * Get all BIA records for a department (including child departments)
   */
  getDepartmentBIARecords: (
    departmentNodeId: string,
    allBIARecords: BIARecord[],
    orgStructure: any,
    includeChildren: boolean = true
  ): { processBIAs: BIARecord[], departmentBIAs: BIARecord[] } => {
    
    const relevantNodeIds = includeChildren 
      ? [departmentNodeId, ...BIAReconciliationUtils.getChildNodeIds(departmentNodeId, orgStructure)]
      : [departmentNodeId];
    
    const processBIAs = allBIARecords.filter(bia => 
      bia.type === 'process' && 
      bia.orgNodeId && 
      relevantNodeIds.includes(bia.orgNodeId)
    );
    
    const departmentBIAs = allBIARecords.filter(bia => 
      bia.type === 'department' && 
      bia.departmentScope?.nodeId && 
      relevantNodeIds.includes(bia.departmentScope.nodeId)
    );
    
    return { processBIAs, departmentBIAs };
  },
  
  /**
   * Get all child node IDs for a given node
   */
  getChildNodeIds: (nodeId: string, orgStructure: any): string[] => {
    // Implementation would traverse org structure
    return [];
  },
  
  /**
   * Validate BIA hierarchy for consistency
   */
  validateBIAHierarchy: (
    orgStructure: any,
    allBIARecords: BIARecord[]
  ): BIAHierarchyValidation => {
    // Implementation would validate entire hierarchy
    return {
      nodeId: 'root',
      nodeName: 'Organization',
      nodeType: 'location',
      isValid: true,
      issues: [],
      children: [],
      totalProcesses: 0,
      totalDepartmentBIAs: 0,
      conflictCount: 0,
      coveragePercentage: 100
    };
  }
};
