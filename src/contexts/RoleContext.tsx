"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'risk_analyst' | 'vendor_manager' | 'compliance_officer' | 'executive' | 'readonly';
}

interface RoleContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  sessionStatus: 'authenticated' | 'unauthenticated' | 'loading';
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS = {
  admin: [
    'view_dashboard',
    'manage_vendors',
    'manage_users',
    'view_analytics',
    'system_config',
    'manage_billing',
    'view_reports',
    'assess_vendors',
    'view_findings',
    'generate_reports',
    'manage_vendor_profile',
    'upload_documents',
    'share_passport',
    'view_vendor_analytics',
    'view_compliance',
    'audit_logs',
    'manage_integrations'
  ],
  risk_analyst: [
    'view_dashboard',
    'assess_vendors',
    'view_findings',
    'generate_reports',
    'view_analytics',
    'view_compliance',
    'upload_documents',
    'manage_integrations'
  ],
  vendor_manager: [
    'view_dashboard',
    'manage_vendor_profile',
    'upload_documents',
    'share_passport',
    'view_vendor_analytics',
    'view_analytics'
  ],
  compliance_officer: [
    'view_dashboard',
    'view_compliance',
    'generate_reports',
    'audit_logs',
    'view_analytics',
    'view_reports'
  ],
  executive: [
    'view_dashboard',
    'view_reports',
    'view_analytics'
  ],
  readonly: [
    'view_dashboard',
    'view_reports'
  ]
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: session.user.role as User['role']
      });
    } else {
      setUser(null);
    }
    setIsLoading(status === 'loading');
  }, [session, status]);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value: RoleContextType = {
    user,
    login,
    logout,
    hasPermission,
    isLoading,
    sessionStatus: status
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

// Higher-order component for route protection
export function withRoleProtection(
  Component: React.ComponentType<any>,
  requiredRoles: string[] = []
) {
  return function ProtectedComponent(props: any) {
    const { user, isLoading, sessionStatus } = useRole();

    if (isLoading || sessionStatus === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user || sessionStatus === 'unauthenticated') {
      // Redirect to login if not authenticated
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      );
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      // Redirect to unauthorized if role doesn't match
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}