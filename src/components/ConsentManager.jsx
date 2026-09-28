import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, CheckCircle2, XCircle, Eye, Plus } from 'lucide-react';
import { useStore } from '../store';
import { useState } from 'react';

function ConsentCard({ consent, onRevoke }) {
  const isActive = consent.status === 'active';
  const expiryDate = new Date(consent.expiresAt);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = daysLeft <= 7 && isActive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-4 transition-all ${
        isActive
          ? 'bg-white border-slate-200 hover:border-brand-200 hover:shadow-md'
          : 'bg-slate-50 border-slate-200 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {isActive ? <Shield className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-800">{consent.providerName}</h4>
            <p className="text-xs text-slate-500">{consent.facility}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isActive
            ? isExpiringSoon
              ? 'bg-amber-50 text-amber-700'
              : 'bg-emerald-50 text-emerald-700'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {isActive ? (isExpiringSoon ? `${daysLeft}d left` : 'Active') : 'Revoked'}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{consent.purpose}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {consent.dataTypes.map(type => (
            <span key={type} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
              {type}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>
            Expires {expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {isActive && (
        <button
          onClick={() => onRevoke(consent.id)}
          className="w-full py-2 rounded-xl border-2 border-dashed border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-[0.98]"
        >
          Revoke Access
        </button>
      )}
    </motion.div>
  );
}

function NewConsentModal({ onClose, onGrant }) {
  const [form, setForm] = useState({
    providerName: '',
    facility: '',
    purpose: '',
    dataTypes: [],
    duration: '30',
  });

  const dataTypeOptions = ['Allergies', 'Prescriptions', 'Vitals', 'Lab Results', 'Prior Records', 'Imaging'];

  const toggleDataType = (dt) => {
    setForm(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dt)
        ? prev.dataTypes.filter(d => d !== dt)
        : [...prev.dataTypes, dt],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.providerName || !form.purpose || form.dataTypes.length === 0) return;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(form.duration));
    onGrant({
      providerName: form.providerName,
      facility: form.facility || 'Independent Practice',
      purpose: form.purpose,
      dataTypes: form.dataTypes,
      expiresAt: expiresAt.toISOString(),
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Grant New Consent</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Provider Name *</label>
            <input
              type="text"
              value={form.providerName}
              onChange={e => setForm(p => ({ ...p, providerName: e.target.value }))}
              placeholder="e.g. Dr. Smith"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Facility</label>
            <input
              type="text"
              value={form.facility}
              onChange={e => setForm(p => ({ ...p, facility: e.target.value }))}
              placeholder="e.g. City Hospital"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Purpose *</label>
            <input
              type="text"
              value={form.purpose}
              onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
              placeholder="e.g. Consultation for chest pain"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '1', label: '1 day' },
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, duration: opt.value }))}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    form.duration === opt.value
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data to Share *</label>
            <div className="flex flex-wrap gap-2">
              {dataTypeOptions.map(dt => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => toggleDataType(dt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.dataTypes.includes(dt)
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Grant Consent
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ConsentManager() {
  const { consents, grantConsent, revokeConsent } = useStore();
  const [showModal, setShowModal] = useState(false);
  const activeCount = consents.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consent Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeCount} active consent{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          New Consent
        </button>
      </div>

      <div className="space-y-3">
        {consents.map(consent => (
          <ConsentCard key={consent.id} consent={consent} onRevoke={revokeConsent} />
        ))}
        {consents.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No consents granted yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <NewConsentModal
          onClose={() => setShowModal(false)}
          onGrant={grantConsent}
        />
      )}
    </div>
  );
}
