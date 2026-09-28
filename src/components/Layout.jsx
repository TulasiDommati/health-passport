import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Shield, User, ScanLine, Siren, Settings,
  Menu, X, ChevronRight, LogOut, BadgeCheck, ClipboardCheck
} from 'lucide-react';
import { useStore } from '../store';
import { useAuth, ROLES } from '../auth';

const NAV_ITEMS_BY_ROLE = {
  [ROLES.PATIENT]: [
    { to: '/', label: 'My Passport', icon: Heart },
    { to: '/consents', label: 'Consents', icon: Shield },
    { to: '/records', label: 'Records', icon: User },
    { to: '/emergency', label: 'Emergency', icon: Siren },
  ],
  [ROLES.PROVIDER]: [
    { to: '/scan', label: 'Provider Scan', icon: ScanLine },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Admin Panel', icon: Settings },
  ],
  [ROLES.RECEPTIONIST]: [
    { to: '/receptionist', label: 'Dashboard', icon: ClipboardCheck },
  ],
};

const ROLE_STYLES = {
  [ROLES.PATIENT]: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: 'bg-emerald-500',
    label: 'Patient',
  },
  [ROLES.PROVIDER]: {
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: 'bg-blue-500',
    label: 'Provider',
  },
  [ROLES.ADMIN]: {
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: 'bg-purple-500',
    label: 'Admin',
  },
  [ROLES.RECEPTIONIST]: {
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: 'bg-orange-500',
    label: 'Receptionist',
  },
};

function RoleBadge({ role, showLabel = true }) {
  const style = ROLE_STYLES[role] || ROLE_STYLES[ROLES.PATIENT];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
      <BadgeCheck className="w-3 h-3" />
      {showLabel && style.label}
    </span>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { notifications } = useStore();
  const { user, logout } = useAuth();

  const navItems = NAV_ITEMS_BY_ROLE[user?.role] || NAV_ITEMS_BY_ROLE[ROLES.PATIENT];

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">HealthPassport</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            <RoleBadge role={user?.role} />
            <span className="text-xs text-slate-500">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out nav */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-14 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl p-4"
            >
              {/* User Info */}
              <div className="mb-4 p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${ROLE_STYLES[user?.role]?.icon || 'bg-slate-400'} flex items-center justify-center text-white font-bold text-sm`}>
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <RoleBadge role={user?.role} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-500 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </NavLink>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="fixed top-16 right-4 z-50 space-y-2 w-80">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-3 rounded-xl text-sm font-medium shadow-lg ${
                n.type === 'emergency'
                  ? 'bg-rose-500 text-white'
                  : n.type === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-slate-200/60 px-2 pb-safe">
        <div className="flex items-center justify-around py-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-brand-600' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-brand-50 shadow-sm shadow-brand-500/20' : ''}`}>
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}

export { RoleBadge };
