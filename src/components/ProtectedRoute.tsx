import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleBasedAuth, UserRole } from '@/hooks/useRoleBasedAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireApproval?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireApproval = false,
  redirectTo = '/auth/login'
}) => {
  const { user, profile, loading, canAccessRoute } = useRoleBasedAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!profile) {
    return <Navigate to="/profile/complete" replace />;
  }

  if (requiredRole && !canAccessRoute(requiredRole, requireApproval)) {
    // Redirect based on actual role
    switch (profile.role) {
      case 'admin':
        return <Navigate to="/dashboard/admin" replace />;
      case 'provider':
        if (profile.approval_status === 'approved') {
          return <Navigate to="/dashboard/provider" replace />;
        } else {
          return <Navigate to="/dashboard/provider/pending" replace />;
        }
      case 'user':
        return <Navigate to="/dashboard/user" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};