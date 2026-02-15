import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Protects routes that require authentication.
 * Optionally restricts by allowedRoles (e.g. ['ADMIN', 'OUTLET']).
 * If not authenticated, redirects to /login with return URL in state.
 */
export function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && user?.role) {
    const userRole = typeof user.role === 'string' ? user.role : user.role;
    const hasRole = allowedRoles.some((r) => r.toUpperCase() === userRole.toUpperCase());
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
