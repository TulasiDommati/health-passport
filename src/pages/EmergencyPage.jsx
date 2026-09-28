import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren, ShieldAlert, AlertTriangle, CheckCircle2,
  XCircle, Clock, Pill, Activity, Phone, Heart,
  Lock, Eye, Timer, MessageSquare, Send, ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../auth';

function EmergencyAccessPanel() {
  const [status, setStatus] = useState('idle'); // idle, requesting, granted, denied
  const [countdown, setCountdown] = useState(30);
  const { allergies, vitals, simulateEmergencyAccess, denyEmergencyAccess, revokeEmergencyAccess, smsLog } = useStore();
  const { user } = useAuth();
  const emergencyContact = user?.emergencyContact || { name: 'Not set', phone: '', relation: '' };

  const patient = {
    name: user?.name || 'Patient',
    bloodGroup: 'B+',
    dob: '1992-03-14',
  };

  const handleRequestAccess = () => {
    setStatus('requesting');
    simulateEmergencyAccess(emergencyContact);

    setTimeout(() => {
      setStatus('granted');
      let count = 30;
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          setStatus('idle');
          setCountdown(30);
        }
      }, 1000);
    }, 2000);
  };

  const handleRevokeAccess = () => {
    revokeEmergencyAccess(emergencyContact);
    setStatus('idle');
    setCountdown(30);
  };

  const handleDenyAccess = () => {
    setStatus('denied');
    denyEmergencyAccess();
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleCallEmergency = () => {
    if (emergencyContact?.phone) {
      window.location.href = `tel:${emergencyContact.phone.replace(/\s/g, '')}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Emergency Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900">Emergency Contact</h3>
        </div>
        {emergencyContact ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">{emergencyContact.name}</p>
              <p className="text-xs text-slate-500">{emergencyContact.relation || 'Emergency Contact'}</p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{emergencyContact.phone}</p>
            </div>
            <button
              onClick={handleCallEmergency}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No emergency contact configured</p>
        )}
      </motion.div>

      {/* Emergency Access Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
          status === 'granted'
            ? 'bg-rose-50 border-rose-300'
            : status === 'denied'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-white border-slate-200'
        }`}
      >
        {status === 'granted' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-rose-500"
          />
        )}

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              status === 'granted' ? 'bg-rose-500' : 'bg-rose-50'
            }`}>
              <Siren className={`w-6 h-6 ${status === 'granted' ? 'text-white' : 'text-rose-500'}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Emergency Access</h3>
              <p className="text-xs text-slate-500">Break-glass protocol for critical situations</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-sm text-slate-600 mb-4">
                  Emergency access allows healthcare providers to view critical information
                  (allergies, blood group, current medications) during life-threatening situations.
                  <span className="text-rose-600 font-semibold"> All access is logged and auditable.</span>
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  Your emergency contact <span className="font-semibold">{emergencyContact?.name}</span> will be notified via SMS.
                </p>
                <button
                  onClick={handleRequestAccess}
                  className="w-full py-3 rounded-xl gradient-urgent text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4" />
                  Request Emergency Access
                </button>
              </motion.div>
            )}

            {status === 'requesting' && (
              <motion.div key="requesting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 mx-auto mb-3"
                />
                <p className="text-sm font-medium text-slate-700">Verifying emergency access request...</p>
                <p className="text-xs text-slate-400 mt-1">Sending SMS to {emergencyContact?.name}</p>
              </motion.div>
            )}

            {status === 'granted' && (
              <motion.div key="granted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-center gap-2 bg-rose-100 rounded-xl p-3">
                  <Timer className="w-4 h-4 text-rose-600" />
                  <span className="text-lg font-bold text-rose-700 font-mono">{countdown}s</span>
                  <span className="text-xs text-rose-600">until auto-revoke</span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-rose-100">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Patient</p>
                      <p className="font-semibold text-slate-900">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Blood Group</p>
                      <p className="font-bold text-lg text-rose-600">{patient.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">DOB</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(patient.dob).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Emergency Contact</p>
                      <p className="font-semibold text-slate-900 text-xs">{emergencyContact?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-rose-100">
                  <h5 className="text-xs font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    CRITICAL ALLERGIES
                  </h5>
                  {allergies.filter(a => a.severity === 'Severe' || a.severity === 'Moderate').map(a => (
                    <div key={a.id} className="flex items-center gap-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-sm font-medium text-slate-800">{a.allergen}</span>
                      <span className="text-[10px] text-slate-400">— {a.reaction}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-3 border border-rose-100">
                  <h5 className="text-xs font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                    <Pill className="w-3 h-3" />
                    CURRENT MEDICATIONS
                  </h5>
                  <p className="text-sm text-slate-700">Metformin 500mg, Amlodipine 5mg</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCallEmergency}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Emergency
                  </button>
                  <button
                    onClick={handleRevokeAccess}
                    className="flex-1 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all"
                  >
                    Revoke Access
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'denied' && (
              <motion.div key="denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-900">Access Denied</p>
                <p className="text-sm text-slate-500 mt-1">Emergency access has been revoked</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* SMS Log */}
      {smsLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900">SMS Notifications Sent</h3>
          </div>
          <div className="space-y-2">
            {smsLog.map(sms => (
              <div key={sms.id} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">To: {sms.contactName}</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <Send className="w-3 h-3" />
                    {sms.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{sms.to}</p>
                <p className="text-xs text-slate-600 mt-1.5 bg-white rounded-lg p-2 border border-slate-100">
                  {sms.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(sms.timestamp).toLocaleTimeString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
        <h4 className="text-sm font-bold text-slate-800">How it works</h4>
        <div className="space-y-2">
          {[
            { icon: ShieldAlert, text: 'Emergency providers can request instant access to critical info', color: 'text-rose-500' },
            { icon: Clock, text: 'Access is time-limited (30 seconds in this demo)', color: 'text-amber-500' },
            { icon: MessageSquare, text: 'Emergency contact is notified via SMS when access is granted or revoked', color: 'text-brand-500' },
            { icon: Phone, text: 'One-tap calling to your emergency contact during a crisis', color: 'text-emerald-500' },
            { icon: Eye, text: 'Only allergy, blood group, and medication data is shared', color: 'text-purple-500' },
            { icon: Activity, text: 'All emergency access is logged in the audit trail', color: 'text-emerald-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <p className="text-xs text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Emergency Access</h2>
        <p className="text-xs text-slate-500 mt-0.5">Break-glass protocol — fully audited</p>
      </div>
      <EmergencyAccessPanel />
    </div>
  );
}
