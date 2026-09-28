import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Phone, User, Eye, EyeOff, UserPlus, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../auth';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      emergencyContact: {
        name: form.emergencyName,
        phone: form.emergencyPhone,
        relation: form.emergencyRelation,
      },
    });
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30"
          >
            <Heart className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Set up your health passport</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6">
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
            {/* Personal Info */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+91 98765 43210"
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
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min 6 characters"
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

            {/* Emergency Contact Section */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-slate-800">Emergency Contact</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={form.emergencyName}
                    onChange={e => update('emergencyName', e.target.value)}
                    placeholder="Raj Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.emergencyPhone}
                      onChange={e => update('emergencyPhone', e.target.value)}
                      placeholder="+91 98765 11111"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Relation</label>
                    <input
                      type="text"
                      value={form.emergencyRelation}
                      onChange={e => update('emergencyRelation', e.target.value)}
                      placeholder="Spouse"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                  </div>
                </div>
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
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
