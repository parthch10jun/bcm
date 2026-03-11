'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  isManager: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      // For development: auto-login as admin if no user is stored
      loginAsAdmin();
    }
  }, []);

  const loginAsAdmin = async () => {
    // For development: fetch admin user from backend
    try {
      const response = await fetch('http://localhost:8080/api/users?search=admin@golfsaudi.com');
      if (response.ok) {
        const users = await response.json();
        if (users && users.length > 0) {
          const adminUser = users[0];
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin user:', error);
      // Fallback: create mock admin user
      const mockAdmin: User = {
        id: 1,
        fullName: 'System Administrator',
        email: 'admin@golfsaudi.com',
        jobTitle: 'System Administrator',
        userRole: UserRole.ADMIN,
        status: 'ACTIVE' as any,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(mockAdmin);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mockAdmin));
    }
  };

  const login = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users?search=${email}`);
      if (response.ok) {
        const users = await response.json();
        if (users && users.length > 0) {
          const user = users[0];
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (role: UserRole): boolean => {
    return currentUser?.userRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return currentUser ? roles.includes(currentUser.userRole) : false;
  };

  const isAdmin = currentUser?.userRole === UserRole.ADMIN;
  const isCoordinator = currentUser?.userRole === UserRole.COORDINATOR;
  const isManager = currentUser?.userRole === UserRole.MANAGER;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isCoordinator,
        isManager,
        login,
        logout,
        hasRole,
        hasAnyRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

