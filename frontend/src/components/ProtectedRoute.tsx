import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // While auth provider is restoring, don't render protected content (avoids flash)
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Code block removed to allow Admins to access User Dashboard
  // Validation is now handled by Sidebar "Switch to Admin" logic

  return children;
}
