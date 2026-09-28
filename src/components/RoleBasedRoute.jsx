import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function RoleBasedRoute({ children, allowedRoles, fallbackPath = '/' }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export function PatientRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'patient') return <Navigate to="/" replace />;
  return children;
}

export function ProviderRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'provider') return <Navigate to="/" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export function ReceptionistRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'receptionist') return <Navigate to="/" replace />;
  return children;
}
