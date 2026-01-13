import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While auth provider is restoring, don't render content
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role (matches backend UserRole enum)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    // Redirect non-admins to login to force credential verification
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
