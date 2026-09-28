import { motion } from 'framer-motion';
import {
  AlertTriangle, Pill, FileText, Activity,
  Heart, Thermometer, Droplets, Scale
} from 'lucide-react';
import { useStore } from '../store';

const SEVERITY_COLORS = {
  Severe: 'bg-rose-50 text-rose-700 border-rose-200',
  Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  Mild: 'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_COLORS = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-slate-100 text-slate-500',
};

export function AllergiesList() {
  const { allergies } = useStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Allergies</h3>
          <p className="text-[10px] text-slate-400">{allergies.length} documented</p>
        </div>
      </div>
      {allergies.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`rounded-xl border p-3 ${SEVERITY_COLORS[a.severity]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">{a.allergen}</h4>
              <p className="text-xs mt-0.5 opacity-80">{a.reaction}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{a.severity}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function PrescriptionsList() {
  const { prescriptions } = useStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <Pill className="w-4 h-4 text-brand-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Prescriptions</h3>
          <p className="text-[10px] text-slate-400">{prescriptions.filter(p => p.status === 'active').length} active</p>
        </div>
      </div>
      {prescriptions.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl border border-slate-100 p-3 hover:border-brand-100 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-sm text-slate-800">{p.medication}</h4>
              <p className="text-xs text-slate-500">{p.dosage}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>
              {p.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{p.prescribedBy}</span>
            <span>{p.condition}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function VitalsCard() {
  const { vitals } = useStore();

  const vitalsData = [
    { label: 'Blood Pressure', value: vitals.bloodPressure, unit: 'mmHg', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Heart Rate', value: vitals.heartRate, unit: 'bpm', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Temperature', value: vitals.temperature, unit: '', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Blood Sugar', value: vitals.bloodSugar, unit: '', icon: Droplets, color: 'text-brand-500', bg: 'bg-brand-50' },
    { label: 'BMI', value: vitals.bmi, unit: '', icon: Scale, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Vital Signs</h3>
          <p className="text-[10px] text-slate-400">Last updated {vitals.lastUpdated}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {vitalsData.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-slate-100 p-3 text-center"
          >
            <div className={`w-8 h-8 rounded-lg ${v.bg} flex items-center justify-center mx-auto mb-2`}>
              <v.icon className={`w-4 h-4 ${v.color}`} />
            </div>
            <p className="text-lg font-bold text-slate-800">{v.value}</p>
            <p className="text-[10px] text-slate-400">{v.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PriorRecordsList() {
  const { priorRecords } = useStore();

  const TYPE_COLORS = {
    Surgery: 'bg-rose-50 text-rose-600',
    Checkup: 'bg-emerald-50 text-emerald-600',
    Imaging: 'bg-brand-50 text-brand-600',
    Vaccination: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Medical History</h3>
          <p className="text-[10px] text-slate-400">{priorRecords.length} records</p>
        </div>
      </div>
      {priorRecords.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl border border-slate-100 p-3 hover:border-slate-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-sm text-slate-800">{r.title}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_COLORS[r.type] || 'bg-slate-100 text-slate-500'}`}>
              {r.type}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-1.5">{r.summary}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{r.facility}</span>
            <span>{r.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
