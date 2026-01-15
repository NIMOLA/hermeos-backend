import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: If not provided, defaults to basic admin check
}

export default function AdminRoute({ children, allowedRoles }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While auth provider is restoring, don't render content
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role (matches backend UserRole enum)
  // Logic: Must be at least MODERATOR, ADMIN, or SUPER_ADMIN to enter admin area at all.
  const isStaff = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  if (!isStaff) {
    // Redirect non-staff to login (or 403 page)
    return <Navigate to="/admin/login" replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role || '')) {
      // Role mismatch -> Redirect to Dashboard (or 403)
      // Preventing "upward visibility" by strictly booting them out.
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
