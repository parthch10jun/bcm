'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrganizationSettings {
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  website: string;
  industry?: string;
  size?: string;
}

export interface BIAConfigSettings {
  timeFrames: Array<{
    id: string;
    label: string;
    valueInHours: number;
  }>;
  impactCategories: Array<{
    id: string;
    name: string;
    severityDefinitions: {
      [key: number]: string;
    };
  }>;
  criticalityThreshold: number;
  rtoOptions: string[];
  rpoOptions: string[];
}

interface OrganizationContextType {
  settings: OrganizationSettings;
  biaConfig: BIAConfigSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => Promise<void>;
  updateBIAConfig: (newConfig: Partial<BIAConfigSettings>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const DEFAULT_SETTINGS: OrganizationSettings = {
  name: 'BSE',
  logo: '/Bombay_Stock_Exchange__BSE__Logo_PNG_Vector_-_Logobase-removebg-preview.png',
  primaryColor: '#e31837',
  secondaryColor: '#c41230',
  contactEmail: '',
  website: '',
  industry: '',
  size: ''
};

const DEFAULT_BIA_CONFIG: BIAConfigSettings = {
  timeFrames: [
    { id: '1', label: '1 Hour', valueInHours: 1 },
    { id: '2', label: '4 Hours', valueInHours: 4 },
    { id: '3', label: '24 Hours', valueInHours: 24 },
    { id: '4', label: '3 Days', valueInHours: 72 },
    { id: '5', label: '1 Week', valueInHours: 168 }
  ],
  impactCategories: [
    {
      id: '1',
      name: 'Financial',
      severityDefinitions: {
        0: 'No financial impact',
        1: 'Less than $10,000 impact',
        2: '$10,000 - $100,000 impact',
        3: '$100,000 - $1,000,000 impact',
        4: '>$1,000,000 or threat to business viability'
      }
    },
    {
      id: '2',
      name: 'Operational',
      severityDefinitions: {
        0: 'No operational impact',
        1: 'Minimal operational disruption',
        2: 'Minor delays in non-critical functions',
        3: 'Moderate impact on core operations',
        4: 'Complete operational shutdown'
      }
    },
    {
      id: '3',
      name: 'Reputational',
      severityDefinitions: {
        0: 'No reputational impact',
        1: 'No public awareness or concern',
        2: 'Limited local media attention',
        3: 'Regional media coverage, customer complaints',
        4: 'International coverage, permanent brand damage'
      }
    },
    {
      id: '4',
      name: 'Legal/Regulatory',
      severityDefinitions: {
        0: 'No legal or regulatory implications',
        1: 'Minor compliance issues, easily resolved',
        2: 'Moderate regulatory scrutiny or fines',
        3: 'Significant legal action or regulatory penalties',
        4: 'Criminal liability or license revocation'
      }
    }
  ],
  criticalityThreshold: 3,
  rtoOptions: ['15 minutes', '1 hour', '4 hours', '8 hours', '1 day', '3 days', '1 week'],
  rpoOptions: ['0 minutes', '15 minutes', '1 hour', '4 hours', '8 hours', '1 day']
};

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OrganizationSettings>(DEFAULT_SETTINGS);
  const [biaConfig, setBiaConfig] = useState<BIAConfigSettings>(DEFAULT_BIA_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from backend API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch organization settings
        const orgResponse = await fetch('http://localhost:8080/api/system-config/organization');
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          // Ensure logo has a valid fallback (handle null, empty, or old logos)
          if (!orgData.logo || orgData.logo === '' || orgData.logo.includes('golf-saudi') || orgData.logo.includes('ascent') || orgData.logo.includes('adnoc')) {
            orgData.logo = '/Bombay_Stock_Exchange__BSE__Logo_PNG_Vector_-_Logobase-removebg-preview.png';
          }
          setSettings(orgData);
          localStorage.setItem('bcm-organization-settings', JSON.stringify(orgData));
        } else {
          // Fallback to localStorage
          const savedSettings = localStorage.getItem('bcm-organization-settings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }

        // Fetch BIA configuration
        const biaResponse = await fetch('http://localhost:8080/api/system-config/bia-config');
        if (biaResponse.ok) {
          const biaData = await biaResponse.json();
          setBiaConfig(biaData);
          localStorage.setItem('bcm-bia-config', JSON.stringify(biaData));
        } else {
          // Fallback to localStorage
          const savedBiaConfig = localStorage.getItem('bcm-bia-config');
          if (savedBiaConfig) {
            setBiaConfig(JSON.parse(savedBiaConfig));
          }
        }
      } catch (err) {
        console.error('Error loading settings from backend:', err);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('bcm-organization-settings');
        const savedBiaConfig = localStorage.getItem('bcm-bia-config');

        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedBiaConfig) setBiaConfig(JSON.parse(savedBiaConfig));

        setError('Failed to load settings from server, using cached data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<OrganizationSettings>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedSettings = { ...settings, ...newSettings };

      // Save to backend API
      const response = await fetch('http://localhost:8080/api/system-config/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings to server');
      }

      const savedSettings = await response.json();

      // Save to localStorage as backup
      localStorage.setItem('bcm-organization-settings', JSON.stringify(savedSettings));

      setSettings(savedSettings);
    } catch (err) {
      console.error('Error updating organization settings:', err);
      setError('Failed to update organization settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBIAConfig = async (newConfig: Partial<BIAConfigSettings>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedConfig = { ...biaConfig, ...newConfig };

      // Save to backend API
      const response = await fetch('http://localhost:8080/api/system-config/bia-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to save BIA config to server');
      }

      const savedConfig = await response.json();

      // Save to localStorage as backup
      localStorage.setItem('bcm-bia-config', JSON.stringify(savedConfig));

      setBiaConfig(savedConfig);
    } catch (err) {
      console.error('Error updating BIA configuration:', err);
      setError('Failed to update BIA configuration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        settings,
        biaConfig,
        updateSettings,
        updateBIAConfig,
        isLoading,
        error
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

