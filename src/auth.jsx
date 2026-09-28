import { createContext, useContext, useState, useCallback } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

const ROLES = {
  PATIENT: 'patient',
  PROVIDER: 'provider',
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
};

const ROLE_PERMISSIONS = {
  [ROLES.PATIENT]: [
    'view:own_records',
    'manage:own_consents',
    'request:emergency_access',
    'view:audit_log',
  ],
  [ROLES.PROVIDER]: [
    'scan:patient_qr',
    'view:patient_records',
    'view:audit_log',
  ],
  [ROLES.ADMIN]: [
    'view:all_users',
    'manage:users',
    'view:system_audit',
    'view:all_records',
    'manage:system_settings',
  ],
  [ROLES.RECEPTIONIST]: [
    'add:patient_reports',
    'view:patient_records',
  ],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const result = await api.auth.login(email, password);
      if (result.success) {
        localStorage.setItem('hp_user', JSON.stringify(result.user));
        setUser(result.user);
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const result = await api.auth.register(data);
      if (result.success) {
        localStorage.setItem('hp_user', JSON.stringify(result.user));
        setUser(result.user);
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hp_user');
    setUser(null);
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasPermission, hasRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLES, ROLE_PERMISSIONS };
