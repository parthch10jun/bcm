// Department BIA Types - Department Precedence Model
// Department BIA always takes precedence over aggregated process data

export interface ProcessRollupData {
  processCount: number;
  suggestedRTO: number; // Worst case RTO from constituent processes
  suggestedRPO: number; // Worst case RPO from constituent processes
  suggestedMTPD: number; // Calculated based on highest impact
  suggestedCriticality: {
    tier: string;
    score: number;
    reasoning: string;
  };
  
  // Aggregated dependencies for reference during Department BIA creation
  aggregatedDependencies: {
    criticalPeople: Array<{
      name: string;
      role: string;
      processSource: string;
      requiredRTO: number;
    }>;
    criticalAssets: Array<{
      name: string;
      type: string;
      processSource: string;
      requiredRTO: number;
    }>;
    criticalVendors: Array<{
      name: string;
      service: string;
      processSource: string;
      requiredRTO: number;
    }>;
  };
  
  // Process breakdown for transparency
  processBreakdown: Array<{
    processId: string;
    processName: string;
    rto: number;
    rpo: number;
    criticality: string;
    owner: string;
  }>;
}

export interface DepartmentBIAData {
  // Basic Information
  id: string;
  departmentNodeId: string;
  departmentName: string;
  departmentPath: string;
  
  // BIA Metadata
  status: 'draft' | 'under-review' | 'approved';
  owner: string; // Person conducting the Department BIA
  lastUpdated: Date;
  version: number;
  
  // Process Rollup (Reference Data Only - shown during BIA creation)
  processRollup?: ProcessRollupData;
  
  // Department BIA Assessment (AUTHORITATIVE - takes precedence)
  departmentAssessment: {
    // Impact Analysis (identical to process BIA methodology)
    impactAnalysis: {
      timeframes: {
        '1hr': { impact: 'none' | 'low' | 'medium' | 'high' | 'critical'; weight: number; };
        '4hr': { impact: 'none' | 'low' | 'medium' | 'high' | 'critical'; weight: number; };
        '24hr': { impact: 'none' | 'low' | 'medium' | 'high' | 'critical'; weight: number; };
        '3days': { impact: 'none' | 'low' | 'medium' | 'high' | 'critical'; weight: number; };
        '1week': { impact: 'none' | 'low' | 'medium' | 'high' | 'critical'; weight: number; };
      };
      calculatedScore: number;
      calculatedTier: string;
    };
    
    // Recovery Objectives (Department Decision - AUTHORITATIVE)
    recoveryObjectives: {
      rto: number; // Department's authoritative RTO
      mtpd: number; // Department's authoritative MTPD
      // Note: No RPO for department level
    };
    
    // Department-Level Dependencies (AUTHORITATIVE)
    departmentDependencies: {
      criticalPeople: Array<{
        name: string;
        role: string;
        requiredRTO: number;
        isKeyPersonnel: boolean;
      }>;
      criticalAssets: Array<{
        name: string;
        type: 'application' | 'infrastructure' | 'facility' | 'equipment';
        requiredRTO: number;
        isSharedResource: boolean;
      }>;
      criticalVendors: Array<{
        name: string;
        service: string;
        requiredRTO: number;
        contractualSLA?: number;
      }>;
      upstreamDepartments?: Array<{
        departmentId: string;
        departmentName: string;
        dependency: string;
        requiredRTO: number;
      }>;
      downstreamDepartments?: Array<{
        departmentId: string;
        departmentName: string;
        impact: string;
        tolerableDelay: number;
      }>;
    };
    
    // Additional Department Context
    departmentContext: {
      businessFunctions: string[]; // Key business functions this department performs
      peakOperatingPeriods?: string[]; // Times when department is most critical
      alternativeLocations?: string[]; // Other locations that could perform these functions
      crossTrainingLevel: 'none' | 'limited' | 'moderate' | 'extensive';
      documentationQuality: 'poor' | 'fair' | 'good' | 'excellent';
    };
  };
}

// Data Precedence Rules
export interface BIADataPrecedence {
  departmentNodeId: string;
  departmentName: string;
  
  // Data Sources
  hasDepartmentBIA: boolean;
  hasProcessBIAs: boolean;
  processCount: number;
  
  // Authoritative Values (what gets used in reports/consolidation)
  authoritativeData: {
    source: 'department-bia' | 'aggregated-processes' | 'none';
    rto: number;
    mtpd: number;
    criticality: string;
    lastUpdated: Date;
  };
  
  // Reference Data (for information only)
  referenceData?: {
    source: 'aggregated-processes' | 'department-bia';
    rto: number;
    mtpd: number;
    criticality: string;
    note: string;
  };
}

// Utility functions for Department BIA Precedence
export class DepartmentBIAPrecedence {
  
  /**
   * Determine authoritative data source for a department
   * Rule: Department BIA ALWAYS takes precedence if it exists
   */
  static getAuthoritativeData(
    departmentBIA: DepartmentBIAData | null,
    processBIAs: any[]
  ): BIADataPrecedence['authoritativeData'] {
    
    // Rule 1: If Department BIA exists and is approved, it's authoritative
    if (departmentBIA && departmentBIA.status === 'approved') {
      return {
        source: 'department-bia',
        rto: departmentBIA.departmentAssessment.recoveryObjectives.rto,
        mtpd: departmentBIA.departmentAssessment.recoveryObjectives.mtpd,
        criticality: departmentBIA.departmentAssessment.impactAnalysis.calculatedTier,
        lastUpdated: departmentBIA.lastUpdated
      };
    }
    
    // Rule 2: If Department BIA exists but is draft/under-review, still use it as authoritative
    if (departmentBIA) {
      return {
        source: 'department-bia',
        rto: departmentBIA.departmentAssessment.recoveryObjectives.rto,
        mtpd: departmentBIA.departmentAssessment.recoveryObjectives.mtpd,
        criticality: departmentBIA.departmentAssessment.impactAnalysis.calculatedTier,
        lastUpdated: departmentBIA.lastUpdated
      };
    }
    
    // Rule 3: If no Department BIA, fall back to aggregated process data
    if (processBIAs.length > 0) {
      const rollup = this.calculateProcessRollup(processBIAs);
      return {
        source: 'aggregated-processes',
        rto: rollup.suggestedRTO,
        mtpd: rollup.suggestedMTPD,
        criticality: rollup.suggestedCriticality.tier,
        lastUpdated: new Date(Math.max(...processBIAs.map(p => new Date(p.lastUpdated).getTime())))
      };
    }
    
    // Rule 4: No data available
    return {
      source: 'none',
      rto: 0,
      mtpd: 0,
      criticality: 'No Data',
      lastUpdated: new Date()
    };
  }
  
  /**
   * Calculate process rollup for reference
   */
  static calculateProcessRollup(processBIAs: any[]): ProcessRollupData {
    if (processBIAs.length === 0) {
      return {
        processCount: 0,
        suggestedRTO: 0,
        suggestedRPO: 0,
        suggestedMTPD: 0,
        suggestedCriticality: {
          tier: 'No Data',
          score: 0,
          reasoning: 'No processes found'
        },
        aggregatedDependencies: {
          criticalPeople: [],
          criticalAssets: [],
          criticalVendors: []
        },
        processBreakdown: []
      };
    }
    
    const rtos = processBIAs.map(p => p.rto);
    const rpos = processBIAs.map(p => p.rpo);
    const mtpds = processBIAs.map(p => p.mtpd || p.rto * 2);
    
    const suggestedRTO = Math.max(...rtos);
    const suggestedRPO = Math.max(...rpos);
    const suggestedMTPD = Math.max(...mtpds);
    
    // Find highest criticality
    const criticalityOrder = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
    const highestCriticality = processBIAs.reduce((highest, process) => {
      const currentTier = process.criticality.tier.split(' ')[0] + ' ' + process.criticality.tier.split(' ')[1];
      const highestTier = highest.split(' ')[0] + ' ' + highest.split(' ')[1];
      
      const currentIndex = criticalityOrder.indexOf(currentTier);
      const highestIndex = criticalityOrder.indexOf(highestTier);
      
      return currentIndex < highestIndex ? process.criticality.tier : highest;
    }, 'Tier 5 (Low)');
    
    const highestScore = Math.max(...processBIAs.map(p => p.criticality.score));
    
    return {
      processCount: processBIAs.length,
      suggestedRTO,
      suggestedRPO,
      suggestedMTPD,
      suggestedCriticality: {
        tier: highestCriticality,
        score: highestScore,
        reasoning: `Highest criticality among ${processBIAs.length} processes`
      },
      aggregatedDependencies: {
        criticalPeople: [],
        criticalAssets: [],
        criticalVendors: []
      },
      processBreakdown: processBIAs.map(p => ({
        processId: p.id,
        processName: p.processName,
        rto: p.rto,
        rpo: p.rpo,
        criticality: p.criticality.tier,
        owner: p.owner
      }))
    };
  }
  
  /**
   * Get complete precedence information for a department
   */
  static getDepartmentPrecedence(
    departmentNodeId: string,
    departmentName: string,
    departmentBIA: DepartmentBIAData | null,
    processBIAs: any[]
  ): BIADataPrecedence {
    
    const authoritativeData = this.getAuthoritativeData(departmentBIA, processBIAs);
    
    // Determine reference data (the non-authoritative source)
    let referenceData: BIADataPrecedence['referenceData'];
    
    if (authoritativeData.source === 'department-bia' && processBIAs.length > 0) {
      const rollup = this.calculateProcessRollup(processBIAs);
      referenceData = {
        source: 'aggregated-processes',
        rto: rollup.suggestedRTO,
        mtpd: rollup.suggestedMTPD,
        criticality: rollup.suggestedCriticality.tier,
        note: `Aggregated from ${processBIAs.length} constituent processes (reference only)`
      };
    } else if (authoritativeData.source === 'aggregated-processes' && departmentBIA) {
      referenceData = {
        source: 'department-bia',
        rto: departmentBIA.departmentAssessment.recoveryObjectives.rto,
        mtpd: departmentBIA.departmentAssessment.recoveryObjectives.mtpd,
        criticality: departmentBIA.departmentAssessment.impactAnalysis.calculatedTier,
        note: 'Department BIA exists but process data is being used as authoritative'
      };
    }
    
    return {
      departmentNodeId,
      departmentName,
      hasDepartmentBIA: !!departmentBIA,
      hasProcessBIAs: processBIAs.length > 0,
      processCount: processBIAs.length,
      authoritativeData,
      referenceData
    };
  }
}

// Simple precedence rule summary
export const PRECEDENCE_RULES = {
  primary: 'Department BIA always takes precedence when it exists',
  fallback: 'Aggregated process data used only when no Department BIA exists',
  display: 'Process rollup shown as reference during Department BIA creation',
  reporting: 'All reports and consolidation use authoritative data only'
} as const;
