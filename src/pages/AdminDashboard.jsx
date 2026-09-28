import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Shield, Activity, Settings, ChevronRight,
  CheckCircle2, AlertTriangle, Eye, BarChart3, Lock
} from 'lucide-react';
import { useAuth, ROLES, ROLE_PERMISSIONS } from '../auth';
import { useStore } from '../store';

const MOCK_USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', role: 'patient', status: 'active', lastLogin: '2026-09-16T10:30:00Z' },
  { id: 2, name: 'Dr. Amit Patel', email: 'doctor@example.com', role: 'provider', status: 'active', lastLogin: '2026-09-16T09:15:00Z' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: '2026-09-16T08:00:00Z' },
  { id: 4, name: 'Rahul Kumar', email: 'rahul@example.com', role: 'patient', status: 'inactive', lastLogin: '2026-09-14T14:20:00Z' },
  { id: 5, name: 'Dr. Sneha Gupta', email: 'sneha@example.com', role: 'provider', status: 'active', lastLogin: '2026-09-15T16:45:00Z' },
];

function UserManagement() {
  const [users] = useState(MOCK_USERS);
  const { user: currentUser } = useAuth();

  const getRoleBadge = (role) => {
    const styles = {
      patient: 'bg-emerald-100 text-emerald-700',
      provider: 'bg-blue-100 text-blue-700',
      admin: 'bg-purple-100 text-purple-700',
    };
    return styles[role] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">User Management</h3>
          <span className="text-xs text-slate-500">{users.length} users</span>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {users.map(u => (
          <div key={u.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  u.role === 'admin' ? 'bg-purple-500' :
                  u.role === 'provider' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}>
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
                <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 ml-13">
              Last login: {new Date(u.lastLogin).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemStats() {
  const { auditLog, consents } = useStore();
  const activeConsents = consents.filter(c => c.status === 'active').length;

  const stats = [
    { label: 'Total Users', value: MOCK_USERS.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Consents', value: activeConsents, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Audit Events', value: auditLog.length, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'System Uptime', value: '99.9%', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 p-4"
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-xl font-bold text-slate-900">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function PermissionsMatrix() {
  const roles = Object.values(ROLES);

  const allPermissions = [
    'view:own_records',
    'manage:own_consents',
    'request:emergency_access',
    'scan:patient_qr',
    'view:patient_records',
    'view:all_users',
    'manage:users',
    'view:system_audit',
    'view:all_records',
    'manage:system_settings',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Permissions Matrix</h3>
        <p className="text-xs text-slate-500 mt-0.5">Role-based access control overview</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left p-3 font-semibold text-slate-600">Permission</th>
              {roles.map(role => (
                <th key={role} className="p-3 font-semibold text-slate-600 text-center capitalize">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPermissions.map(perm => (
              <tr key={perm} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-3 font-mono text-slate-700">{perm}</td>
                {roles.map(role => (
                  <td key={role} className="p-3 text-center">
                    {ROLE_PERMISSIONS[role]?.includes(perm) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="w-4 h-4 block mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { auditLog } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 p-5 text-white"
      >
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-white/70">System management & oversight</p>
            </div>
          </div>
          <p className="text-xs text-white/60">Welcome back, {user?.name}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <SystemStats />

      {/* User Management */}
      <UserManagement />

      {/* Permissions Matrix */}
      <PermissionsMatrix />

      {/* Recent Audit Events */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent System Activity</h3>
            <span className="text-xs text-slate-500">Last 5 events</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {auditLog.slice(0, 5).map((entry) => (
            <div key={entry.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  entry.icon === 'check' ? 'bg-emerald-50 text-emerald-500' :
                  entry.icon === 'x' ? 'bg-rose-50 text-rose-500' :
                  entry.icon === 'alert' ? 'bg-amber-50 text-amber-500' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {entry.icon === 'check' ? <CheckCircle2 className="w-4 h-4" /> :
                   entry.icon === 'x' ? <AlertTriangle className="w-4 h-4" /> :
                   entry.icon === 'alert' ? <AlertTriangle className="w-4 h-4" /> :
                   <Eye className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                  <p className="text-xs text-slate-500">{entry.actor} — {entry.target}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(entry.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
