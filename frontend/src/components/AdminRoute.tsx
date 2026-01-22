import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminDomain } from '../utils/subdomain';

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AdminRoute({ children, allowedRoles }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const isSubdomain = isAdminDomain();

  // While auth provider is restoring, don't render content
  if (isLoading) return null;

  // Fallback: Check localStorage directly to handle race condition after login
  // React state (isAuthenticated) may not be updated yet when navigate triggers
  const storedToken = localStorage.getItem('token');
  const storedUserRaw = localStorage.getItem('user');
  let storedUser: { role?: string } | null = null;
  try {
    storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  } catch {
    storedUser = null;
  }

  const hasValidSession = isAuthenticated || (!!storedToken && !!storedUser);

  if (!hasValidSession) {
    // On subdomain, login is at / or /login. On main, it's /portal-access
    return <Navigate to={isSubdomain ? "/login" : "/portal-access"} replace />;
  }

  // Check if user has admin role (matches backend UserRole enum)
  // Use stored user as fallback if React state not yet updated
  const effectiveRole = user?.role || storedUser?.role || '';
  const isStaff = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(effectiveRole);

  if (!isStaff) {
    // Redirect non-staff to login
    return <Navigate to={isSubdomain ? "/login" : "/portal-access"} replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role || '')) {
      // Role mismatch -> Redirect to Dashboard
      // Preventing "upward visibility" by strictly booting them out.
      return <Navigate to={isSubdomain ? "/" : "/admin"} replace />;
    }
  }

  return <>{children}</>;
}
