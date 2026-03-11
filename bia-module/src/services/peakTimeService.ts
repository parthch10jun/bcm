const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface PeakTime {
  id?: number;
  biaId: number;
  peakTimeName: string;
  description?: string;
  peakRtoHours: number;
  peakRpoHours?: number;
  recurrenceType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  recurrenceDetails?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isCriticalDeadline?: boolean;
  deadlineType?: 'MONTH_END' | 'QUARTER_END' | 'YEAR_END' | 'PAYROLL' | 'REGULATORY_FILING' | 'CUSTOM';
  businessJustification?: string;
  impactIfMissed?: string;
  priority?: number;
  isActive?: boolean;
}

export interface MostAggressiveRtoResponse {
  mostAggressivePeakRtoHours: number | null;
}

class PeakTimeService {
  /**
   * Create a new peak time for a BIA
   */
  async createPeakTime(biaId: number, peakTime: Omit<PeakTime, 'id' | 'biaId'>): Promise<PeakTime> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...peakTime,
        biaId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create peak time: ${error}`);
    }

    return response.json();
  }

  /**
   * Get all peak times for a BIA
   */
  async getPeakTimes(biaId: number): Promise<PeakTime[]> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times`);

    if (!response.ok) {
      throw new Error('Failed to fetch peak times');
    }

    return response.json();
  }

  /**
   * Get a specific peak time by ID
   */
  async getPeakTimeById(biaId: number, peakTimeId: number): Promise<PeakTime> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times/${peakTimeId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch peak time');
    }

    return response.json();
  }

  /**
   * Update an existing peak time
   */
  async updatePeakTime(biaId: number, peakTimeId: number, peakTime: Omit<PeakTime, 'id' | 'biaId'>): Promise<PeakTime> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times/${peakTimeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...peakTime,
        biaId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update peak time: ${error}`);
    }

    return response.json();
  }

  /**
   * Delete a peak time
   */
  async deletePeakTime(biaId: number, peakTimeId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times/${peakTimeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete peak time');
    }
  }

  /**
   * Get the most aggressive (lowest) peak RTO for a BIA
   */
  async getMostAggressivePeakRto(biaId: number): Promise<number | null> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times/most-aggressive-rto`);

    if (!response.ok) {
      throw new Error('Failed to fetch most aggressive peak RTO');
    }

    const data: MostAggressiveRtoResponse = await response.json();
    return data.mostAggressivePeakRtoHours;
  }

  /**
   * Get all critical deadlines for a BIA
   */
  async getCriticalDeadlines(biaId: number): Promise<PeakTime[]> {
    const response = await fetch(`${API_BASE_URL}/api/bias/${biaId}/peak-times/critical-deadlines`);

    if (!response.ok) {
      throw new Error('Failed to fetch critical deadlines');
    }

    return response.json();
  }

  /**
   * Helper: Format recurrence type for display
   */
  formatRecurrenceType(type?: string): string {
    if (!type) return 'N/A';
    
    const map: Record<string, string> = {
      'DAILY': 'Daily',
      'WEEKLY': 'Weekly',
      'MONTHLY': 'Monthly',
      'YEARLY': 'Yearly',
      'ONE_TIME': 'One-Time',
    };
    
    return map[type] || type;
  }

  /**
   * Helper: Format deadline type for display
   */
  formatDeadlineType(type?: string): string {
    if (!type) return 'N/A';
    
    const map: Record<string, string> = {
      'MONTH_END': 'Month End',
      'QUARTER_END': 'Quarter End',
      'YEAR_END': 'Year End',
      'PAYROLL': 'Payroll',
      'REGULATORY_FILING': 'Regulatory Filing',
      'CUSTOM': 'Custom',
    };
    
    return map[type] || type;
  }

  /**
   * Helper: Format hours to human-readable string
   */
  formatHours(hours?: number): string {
    if (hours === undefined || hours === null) return 'N/A';
    
    if (hours < 1) {
      return `${hours * 60} minutes`;
    } else if (hours === 1) {
      return '1 hour';
    } else if (hours < 24) {
      return `${hours} hours`;
    } else if (hours === 24) {
      return '1 day';
    } else if (hours < 168) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours === 0) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
      return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`;
    } else {
      const weeks = Math.floor(hours / 168);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
  }
}

export const peakTimeService = new PeakTimeService();

