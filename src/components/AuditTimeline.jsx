import { motion } from 'framer-motion';
import { CheckCircle2, Eye, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useStore } from '../store';

const ICON_MAP = {
  check: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  eye: { icon: Eye, color: 'text-brand-500', bg: 'bg-brand-50' },
  alert: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  x: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
};

export default function AuditTimeline() {
  const { auditLog } = useStore();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Audit Trail</h2>
        <p className="text-xs text-slate-500 mt-0.5">Complete history of consent and access events</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-200 via-slate-200 to-transparent" />

        <div className="space-y-4">
          {auditLog.map((entry, i) => {
            const { icon: Icon, color, bg } = ICON_MAP[entry.icon] || ICON_MAP.eye;
            const time = new Date(entry.timestamp);
            const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const dateStr = time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative pl-12"
              >
                <div className={`absolute left-2.5 w-5 h-5 rounded-full ${bg} flex items-center justify-center ring-4 ring-slate-50`}>
                  <Icon className={`w-3 h-3 ${color}`} />
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-3 hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-semibold text-slate-800">{entry.action}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {timeStr}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">{entry.actor}</span>
                    {' — '}
                    <span>{entry.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{dateStr}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
