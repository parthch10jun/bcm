import { BusinessProcess, Department, Service, ImpactLevel, BIAAnalysisResult } from '@/types/bia';

// Utility functions for BIA calculations and analysis

/**
 * Calculate criticality score for a process based on impact analysis
 * Higher score = more critical
 */
export function calculateCriticalityScore(process: BusinessProcess): number {
  // TODO: Update to work with BusinessProcess interface
  return 0;
  /*
  const { impactAnalysis } = process;
  let score = 0;
  
  // Weight factors for different impact types
  const weights = {
    financial: 0.4,
    operational: 0.3,
    reputational: 0.2,
    regulatory: 0.1
  };
  
  // Severity scoring
  const severityScores = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4
  };
  
  impactAnalysis.impactLevels.forEach((level, index) => {
    // Earlier timeframes get higher weight (more urgent)
    const timeWeight = Math.max(1, 5 - index);
    
    // Financial impact (normalized to 0-4 scale)
    const totalFinancial = level.financial.directCosts + level.financial.revenueLoss + level.financial.regulatoryFines;
    const financialScore = Math.min(4, Math.log10(totalFinancial + 1)); // Log scale for financial impact
    
    // Other impact scores
    const operationalScore = severityScores[level.operational.severity] || 0;
    const reputationalScore = severityScores[level.reputational.severity] || 0;
    const regulatoryScore = severityScores[level.regulatory.severity] || 0;
    
    // Weighted score for this timeframe
    const timeframeScore = (
      financialScore * weights.financial +
      operationalScore * weights.operational +
      reputationalScore * weights.reputational +
      regulatoryScore * weights.regulatory
    ) * timeWeight;
    
    score += timeframeScore;
  });
  
  return Math.round(score); // Round to nearest integer
  */
}

/**
 * Convert time string to minutes for comparison
 */
export function timeToMinutes(timeString: string): number {
  const time = timeString.toLowerCase();
  
  if (time.includes('minute')) {
    return parseInt(time) || 0;
  } else if (time.includes('hour')) {
    return (parseInt(time) || 0) * 60;
  } else if (time.includes('day')) {
    return (parseInt(time) || 0) * 24 * 60;
  } else if (time.includes('week')) {
    return (parseInt(time) || 0) * 7 * 24 * 60;
  } else if (time.includes('month')) {
    return (parseInt(time) || 0) * 30 * 24 * 60;
  }
  
  return 0;
}

/**
 * Validate that RTO is less than MTPD
 */
export function validateRTO(rto: string, mtpd: string): boolean {
  return timeToMinutes(rto) < timeToMinutes(mtpd);
}

/**
 * Calculate effective RTO for a department (longest RTO among critical processes)
 */
export function calculateDepartmentRTO(processes: BusinessProcess[]): string {
  if (processes.length === 0) return '0 minutes';

  const rtos = processes
    .map(p => ({ rto: p.rto, minutes: timeToMinutes(p.rto) }))
    .sort((a, b) => b.minutes - a.minutes);

  return rtos[0]?.rto || '0 minutes';
}

/**
 * Calculate effective MTPD for a department (shortest MTPD among critical processes)
 */
export function calculateDepartmentMTPD(processes: BusinessProcess[]): string {
  // TODO: Update to work with BusinessProcess interface
  return '0 minutes';
}

/**
 * Calculate effective RTO for a service (longest RTO among required processes)
 */
export function calculateServiceRTO(requiredProcesses: BusinessProcess[]): string {
  if (requiredProcesses.length === 0) return '0 minutes';
  
  const rtos = requiredProcesses
    .map(p => ({ rto: p.rto, minutes: timeToMinutes(p.rto) }))
    .sort((a, b) => b.minutes - a.minutes);
  
  return rtos[0]?.rto || '0 minutes';
}

/**
 * Calculate effective RPO for a service (longest RPO among required processes)
 */
export function calculateServiceRPO(requiredProcesses: BusinessProcess[]): string {
  if (requiredProcesses.length === 0) return '0 minutes';
  
  const rpos = requiredProcesses
    .map(p => ({ rpo: p.rpo, minutes: timeToMinutes(p.rpo) }))
    .sort((a, b) => b.minutes - a.minutes);
  
  return rpos[0]?.rpo || '0 minutes';
}

/**
 * Generate recovery priorities based on criticality and dependencies
 */
export function generateRecoveryPriorities(processes: BusinessProcess[]): Array<{
  priority: number;
  processId: string;
  processName: string;
  rto: string;
  dependencies: string[];
}> {
  // TODO: Update to work with BusinessProcess interface
  return [];
}

/**
 * Identify single points of failure across all processes
 */
export function identifySystemSPOFs(processes: BusinessProcess[]): Array<{
  category: string;
  description: string;
  affectedProcesses: string[];
  recommendedActions: string[];
}> {
  // TODO: Update to work with BusinessProcess interface
  return [];
}

/**
 * Generate comprehensive BIA analysis result
 */
export function generateBIAAnalysis(
  processes: BusinessProcess[],
  departments: Department[],
  services: Service[]
): BIAAnalysisResult {
  // TODO: Update to work with BusinessProcess interface
  return {
    generatedAt: new Date(),
    summary: {
      totalProcesses: processes.length,
      criticalProcesses: 0,
      totalDepartments: departments.length,
      totalServices: services.length,
      averageRTO: '0 minutes',
      averageMTD: '0 minutes'
    },
    criticalityRanking: [],
    recoveryPriorities: [],
    riskAreas: [],
    complianceGaps: []
  };
}
