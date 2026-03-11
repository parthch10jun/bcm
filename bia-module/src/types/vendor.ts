/**
 * Type definitions for Vendor Library
 */

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum ServiceType {
  CLOUD_PROVIDER = 'CLOUD_PROVIDER',
  SAAS = 'SAAS',
  MANAGED_SERVICE = 'MANAGED_SERVICE',
  SUPPLIER = 'SUPPLIER',
  CONSULTING = 'CONSULTING',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SOFTWARE_LICENSE = 'SOFTWARE_LICENSE',
  HARDWARE_VENDOR = 'HARDWARE_VENDOR',
  TELECOM = 'TELECOM',
  UTILITIES = 'UTILITIES',
  LOGISTICS = 'LOGISTICS',
  OTHER = 'OTHER'
}

export interface Vendor {
  id: number;
  vendorName: string;
  status: VendorStatus;
  serviceType?: ServiceType;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  recoveryTimeCapability?: number; // RTO-C in hours
  contractStartDate?: string;
  contractEndDate?: string;
  website?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  processCount: number;
  assetCount: number;
}

export interface CreateVendorRequest {
  vendorName: string;
  status?: VendorStatus;
  serviceType?: ServiceType;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  recoveryTimeCapability?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface UpdateVendorRequest extends CreateVendorRequest {
  id: number;
}

// Helper functions for display names
export const getVendorStatusLabel = (status: VendorStatus): string => {
  const labels: Record<VendorStatus, string> = {
    [VendorStatus.ACTIVE]: 'Active',
    [VendorStatus.INACTIVE]: 'Inactive',
    [VendorStatus.UNDER_REVIEW]: 'Under Review'
  };
  return labels[status];
};

export const getServiceTypeLabel = (type: ServiceType): string => {
  const labels: Record<ServiceType, string> = {
    [ServiceType.CLOUD_PROVIDER]: 'Cloud Provider',
    [ServiceType.SAAS]: 'SaaS',
    [ServiceType.MANAGED_SERVICE]: 'Managed Service',
    [ServiceType.SUPPLIER]: 'Supplier',
    [ServiceType.CONSULTING]: 'Consulting',
    [ServiceType.INFRASTRUCTURE]: 'Infrastructure',
    [ServiceType.SOFTWARE_LICENSE]: 'Software License',
    [ServiceType.HARDWARE_VENDOR]: 'Hardware Vendor',
    [ServiceType.TELECOM]: 'Telecom',
    [ServiceType.UTILITIES]: 'Utilities',
    [ServiceType.LOGISTICS]: 'Logistics',
    [ServiceType.OTHER]: 'Other'
  };
  return labels[type];
};

// Helper function to format RTO-C
export const formatRecoveryTime = (hours?: number): string => {
  if (!hours) return 'Not specified';
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`;
  return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
};

