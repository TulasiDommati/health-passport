import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, User, CheckCircle2, Shield, Clock,
  AlertTriangle, Pill, FileText, Activity, Lock,
  Eye, EyeOff, QrCode, ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../auth';

function ScanSimulator({ onScan }) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScan();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <motion.div
        animate={scanning ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: scanning ? Infinity : 0, duration: 1 }}
        className="relative"
      >
        <div className="w-48 h-48 rounded-3xl border-2 border-dashed border-brand-300 flex items-center justify-center bg-brand-50/50">
          {scanning ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="w-full h-0.5 bg-brand-500 rounded-full"
                animate={{ y: [-96, 96] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            </motion.div>
          ) : null}
          <div className="text-center">
            <QrCode className={`w-12 h-12 mx-auto mb-2 ${scanning ? 'text-brand-500 animate-pulse' : 'text-brand-300'}`} />
            <p className="text-xs text-brand-400 font-medium">
              {scanning ? 'Scanning...' : 'Tap to simulate scan'}
            </p>
          </div>
        </div>

        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-500 rounded-br-lg" />
      </motion.div>

      <button
        onClick={handleScan}
        disabled={scanning}
        className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {scanning ? 'Scanning...' : 'Simulate QR Scan'}
      </button>
    </div>
  );
}

function ProviderAccessView({ consent, patient, onClose }) {
  const [activeTab, setActiveTab] = useState('allergies');
  const { allergies, prescriptions, vitals, priorRecords } = useStore();

  const tabs = [
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle, count: allergies.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: prescriptions.length },
    { id: 'vitals', label: 'Vitals', icon: Activity, count: null },
    { id: 'records', label: 'Records', icon: FileText, count: priorRecords.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Access Granted Banner */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-emerald-900">Access Granted</h3>
            <p className="text-xs text-emerald-700">Consent verified for: {consent.purpose}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {consent.dataTypes.map(dt => (
            <span key={dt} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
              {dt}
            </span>
          ))}
        </div>
      </div>

      {/* Patient Quick Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{patient.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{patient.bloodGroup}</span>
              <span>•</span>
              <span>{new Date(patient.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          {activeTab === 'allergies' && allergies.map((a, i) => (
            <div key={a.id} className="bg-white rounded-xl border border-rose-100 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">{a.allergen}</h4>
                  <p className="text-xs text-slate-500">{a.reaction}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  a.severity === 'Severe' ? 'bg-rose-100 text-rose-700' :
                  a.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{a.severity}</span>
              </div>
            </div>
          ))}

          {activeTab === 'prescriptions' && prescriptions.map((p, i) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-sm text-slate-800">{p.medication}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>{p.status}</span>
              </div>
              <p className="text-xs text-slate-500">{p.dosage}</p>
              <p className="text-[10px] text-slate-400 mt-1">{p.prescribedBy} — {p.condition}</p>
            </div>
          ))}

          {activeTab === 'vitals' && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'BP', value: vitals.bloodPressure, unit: 'mmHg' },
                { label: 'HR', value: vitals.heartRate, unit: 'bpm' },
                { label: 'Temp', value: vitals.temperature, unit: '' },
                { label: 'Sugar', value: vitals.bloodSugar, unit: '' },
                { label: 'BMI', value: vitals.bmi, unit: '' },
              ].map(v => (
                <div key={v.label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{v.value}</p>
                  <p className="text-[10px] text-slate-400">{v.label} {v.unit}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'records' && priorRecords.map((r, i) => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-sm text-slate-800">{r.title}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{r.type}</span>
              </div>
              <p className="text-xs text-slate-500">{r.summary}</p>
              <p className="text-[10px] text-slate-400 mt-1">{r.facility} — {r.date}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all"
      >
        End Session
      </button>
    </motion.div>
  );
}

export default function ProviderPortal() {
  const [scanned, setScanned] = useState(false);
  const [activeConsent, setActiveConsent] = useState(null);
  const { consents } = useStore();
  const { user } = useAuth();

  const patient = {
    name: user?.name || 'Patient',
    bloodGroup: 'B+',
    dob: '1992-03-14',
  };

  const handleScan = () => {
    setScanned(true);
    const active = consents.find(c => c.status === 'active');
    if (active) {
      setActiveConsent(active);
    }
  };

  const handleEndSession = () => {
    setScanned(false);
    setActiveConsent(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {scanned && (
          <button onClick={handleEndSession} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900">Provider Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {scanned ? 'Patient records accessed with consent' : 'Scan patient QR to access records'}
          </p>
        </div>
      </div>

      {!scanned ? (
        <ScanSimulator onScan={handleScan} />
      ) : activeConsent ? (
        <ProviderAccessView
          consent={activeConsent}
          patient={patient}
          onClose={handleEndSession}
        />
      ) : (
        <div className="text-center py-12 space-y-3">
          <Lock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900">No Active Consent</h3>
          <p className="text-sm text-slate-500">This patient has not granted consent for data access.</p>
          <button
            onClick={handleEndSession}
            className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-all"
          >
            Try Another QR
          </button>
        </div>
      )}
    </div>
  );
}
