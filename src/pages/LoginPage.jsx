import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, User, Stethoscope, Shield, ClipboardCheck } from 'lucide-react';
import { useAuth, ROLES } from '../auth';

const DEMO_CREDENTIALS = [
  {
    role: ROLES.PATIENT,
    email: 'priya@example.com',
    password: 'demo123',
    label: 'Patient',
    icon: User,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    role: ROLES.PROVIDER,
    email: 'doctor@example.com',
    password: 'doctor123',
    label: 'Provider',
    icon: Stethoscope,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    role: ROLES.ADMIN,
    email: 'admin@example.com',
    password: 'admin123',
    label: 'Admin',
    icon: Shield,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    role: ROLES.RECEPTIONIST,
    email: 'receptionist@example.com',
    password: 'reception123',
    label: 'Receptionist',
    icon: ClipboardCheck,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30"
          >
            <Heart className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900">HealthPassport</h1>
          <p className="text-sm text-slate-500 mt-1">Your consent-driven health record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-xs text-slate-500 mb-5">Sign in to access your health passport</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium mb-4"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
        >
          <p className="text-[11px] text-amber-700 font-bold mb-3 text-center">Demo Credentials</p>
          <div className="space-y-2">
            {DEMO_CREDENTIALS.map(demo => (
              <button
                key={demo.role}
                onClick={() => fillDemo(demo)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg ${demo.bg} hover:opacity-80 transition-all text-left`}
              >
                <div className={`w-8 h-8 rounded-lg ${demo.bg} flex items-center justify-center`}>
                  <demo.icon className={`w-4 h-4 ${demo.color}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${demo.color}`}>{demo.label}</p>
                  <p className="text-[10px] text-slate-600">{demo.email} / {demo.password}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
