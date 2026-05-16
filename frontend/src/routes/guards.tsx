import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../lib/api/client';
import { useAuth } from '../lib/auth/AuthContext';
import type { Role } from '../types/domain';
import { Card } from '../components/ui';

export function AuthenticatedRoute() {
  const location = useLocation();
  if (!getToken()) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  if (!getToken()) return <Navigate to="/login" replace />;
  if (!user || !roles.includes(user.role)) {
    return <Card><h1 className="text-xl font-bold text-ink">403 · Sin permiso</h1><p className="mt-2 text-muted">Tu rol no permite acceder a esta seccion.</p></Card>;
  }
  return <Outlet />;
}

