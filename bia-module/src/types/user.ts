/**
 * User types for People Library
 */

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  contactNumber?: string;
  jobTitle?: string;
  userRole: UserRole;
  organizationalUnitId?: number;
  organizationalUnitName?: string;
  organizationalUnitCode?: string;
  hrmsEmployeeId?: string;
  lastSyncedAt?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  contactNumber?: string;
  jobTitle?: string;
  userRole?: UserRole;
  organizationalUnitId?: number;
  hrmsEmployeeId?: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  contactNumber?: string;
  role?: string;
  organizationalUnitId?: number;
  hrmsEmployeeId?: string;
  status?: UserStatus;
}

export interface UserStats {
  totalUsers: number;
  usersWithUnit: number;
  usersWithoutUnit: number;
}

export interface BulkUploadResult {
  fileName: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: string[];
  createdUsers: User[];
  errorReportUrl?: string;
}

export interface HrmsSyncResult {
  syncStatus: string;
  usersAdded: number;
  usersUpdated: number;
  usersFailed: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  triggeredBy: string;
}

