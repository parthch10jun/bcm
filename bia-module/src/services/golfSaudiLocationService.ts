const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface GolfSaudiLocation {
  id?: number;
  locationCode: string;
  locationName: string;
  locationType?: 'HEADQUARTERS' | 'GOLF_COURSE' | 'FACILITY' | 'OFFICE' | 'OTHER';
  address?: string;
  city?: string;
  region?: string;
  isActive?: boolean;
}

class GolfSaudiLocationService {
  /**
   * Get all Golf Saudi locations
   */
  async getAll(): Promise<GolfSaudiLocation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/golf-saudi-locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch Golf Saudi locations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Golf Saudi locations:', error);
      // Return mock data as fallback
      return this.getMockLocations();
    }
  }

  /**
   * Get active Golf Saudi locations only
   */
  async getActive(): Promise<GolfSaudiLocation[]> {
    const allLocations = await this.getAll();
    return allLocations.filter(loc => loc.isActive !== false);
  }

  /**
   * Get location by ID
   */
  async getById(id: number): Promise<GolfSaudiLocation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/golf-saudi-locations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  }

  /**
   * Create a new location
   */
  async create(location: Omit<GolfSaudiLocation, 'id'>): Promise<GolfSaudiLocation> {
    const response = await fetch(`${API_BASE_URL}/api/golf-saudi-locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to create location');
    }

    return await response.json();
  }

  /**
   * Update an existing location
   */
  async update(id: number, location: Partial<GolfSaudiLocation>): Promise<GolfSaudiLocation> {
    const response = await fetch(`${API_BASE_URL}/api/golf-saudi-locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to update location');
    }

    return await response.json();
  }

  /**
   * Delete a location
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/golf-saudi-locations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete location');
    }
  }

  /**
   * Mock data for development/fallback
   */
  private getMockLocations(): GolfSaudiLocation[] {
    return [
      {
        id: 1,
        locationCode: 'HQ-RYD',
        locationName: 'Golf Saudi Headquarters',
        locationType: 'HEADQUARTERS',
        city: 'Riyadh',
        region: 'Central',
        isActive: true
      },
      {
        id: 2,
        locationCode: 'GC-RYD-01',
        locationName: 'Riyadh Golf Club',
        locationType: 'GOLF_COURSE',
        city: 'Riyadh',
        region: 'Central',
        isActive: true
      },
      {
        id: 3,
        locationCode: 'GC-JED-01',
        locationName: 'Jeddah Golf Club',
        locationType: 'GOLF_COURSE',
        city: 'Jeddah',
        region: 'Western',
        isActive: true
      },
      {
        id: 4,
        locationCode: 'GC-DHR-01',
        locationName: 'Dhahran Golf Club',
        locationType: 'GOLF_COURSE',
        city: 'Dhahran',
        region: 'Eastern',
        isActive: true
      },
      {
        id: 5,
        locationCode: 'FAC-RYD-01',
        locationName: 'Riyadh Training Facility',
        locationType: 'FACILITY',
        city: 'Riyadh',
        region: 'Central',
        isActive: true
      },
      {
        id: 6,
        locationCode: 'OFF-JED-01',
        locationName: 'Jeddah Regional Office',
        locationType: 'OFFICE',
        city: 'Jeddah',
        region: 'Western',
        isActive: true
      }
    ];
  }
}

export const golfSaudiLocationService = new GolfSaudiLocationService();
export default golfSaudiLocationService;

