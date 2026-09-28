import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store';
import { AuthProvider, useAuth, ROLES } from './auth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import RecordsPage from './pages/RecordsPage';
import ProviderPortal from './pages/ProviderPortal';
import EmergencyPage from './pages/EmergencyPage';
import ConsentManager from './components/ConsentManager';
import AuditTimeline from './components/AuditTimeline';
import AdminDashboard from './pages/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import { PatientRoute, ProviderRoute, AdminRoute, ReceptionistRoute } from './components/RoleBasedRoute';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case ROLES.PROVIDER:
      return <Navigate to="/scan" replace />;
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    case ROLES.RECEPTIONIST:
      return <Navigate to="/receptionist" replace />;
    case ROLES.PATIENT:
    default:
      return <PatientDashboard />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<RoleRedirect />} />

              {/* Patient Routes */}
              <Route path="/consents" element={
                <PatientRoute>
                  <div className="space-y-8">
                    <ConsentManager />
                    <AuditTimeline />
                  </div>
                </PatientRoute>
              } />
              <Route path="/records" element={
                <PatientRoute><RecordsPage /></PatientRoute>
              } />
              <Route path="/emergency" element={
                <PatientRoute><EmergencyPage /></PatientRoute>
              } />

              {/* Provider Routes */}
              <Route path="/scan" element={
                <ProviderRoute><ProviderPortal /></ProviderRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />

              {/* Receptionist Routes */}
              <Route path="/receptionist" element={
                <ReceptionistRoute><ReceptionistDashboard /></ReceptionistRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}
