import { motion } from 'framer-motion';
import {
  User, Calendar, Droplets, Phone, Shield,
  CheckCircle2, AlertTriangle, ChevronRight, Zap
} from 'lucide-react';
import QRIdentity from '../components/QRIdentity';
import { useStore } from '../store';
import { useAuth } from '../auth';

export default function PatientDashboard() {
  const { allergies, prescriptions, consents } = useStore();
  const { user } = useAuth();
  const activeConsents = consents.filter(c => c.status === 'active').length;

  const patient = {
    name: user?.name || 'Patient',
    phone: user?.phone || '',
    emergencyContact: user?.emergencyContact
      ? `${user.emergencyContact.name} — ${user.emergencyContact.phone}`
      : 'Not set',
    id: 'HP-2026-' + String(user?.id || 0).slice(-4),
    dob: '1992-03-14',
    bloodGroup: 'B+',
    abhaLinked: true,
    abhaId: 'abha-demo-' + String(user?.id || 0).slice(-8),
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-brand p-[1px]"
      >
        <div className="bg-white/95 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/30">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(patient.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {patient.bloodGroup}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono text-slate-400">{patient.id}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ABHA Linking Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-100 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ABHA (Ayushman Bharat)</h3>
              <p className="text-[10px] text-slate-400">Simulated integration — prototype only</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            patient.abhaLinked
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {patient.abhaLinked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Linked
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Not Linked
              </>
            )}
          </div>
        </div>
        {patient.abhaLinked && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 font-mono">
            ABHA ID: {patient.abhaId}
          </div>
        )}
      </motion.div>

      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <QRIdentity />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Allergies', value: allergies.length, icon: AlertTriangle, color: 'rose' },
          { label: 'Medications', value: prescriptions.filter(p => p.status === 'active').length, icon: Shield, color: 'brand' },
          { label: 'Consents', value: activeConsents, icon: Shield, color: 'emerald' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 p-3 text-center"
          >
            <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
              stat.color === 'rose' ? 'bg-rose-50 text-rose-500'
              : stat.color === 'brand' ? 'bg-brand-50 text-brand-500'
              : 'bg-emerald-50 text-emerald-500'
            }`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-slate-100 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Phone className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Emergency Contact</h3>
            <p className="text-xs text-slate-600">{patient.emergencyContact}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </motion.div>
    </div>
  );
}
