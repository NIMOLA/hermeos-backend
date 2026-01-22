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

  if (!isAuthenticated) {
    // On subdomain, login is at / or /login. On main, it's /portal-access
    return <Navigate to={isSubdomain ? "/login" : "/portal-access"} replace />;
  }

  // Check if user has admin role (matches backend UserRole enum)
  const isStaff = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

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
