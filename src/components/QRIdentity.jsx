import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth';

export default function QRIdentity() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const qrData = JSON.stringify({
    type: 'health-passport',
    id: 'HP-2026-' + String(user?.id || 0).slice(-4),
    name: user?.name,
    ts: Date.now(),
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl gradient-brand p-[1px]"
    >
      <div className="bg-white rounded-3xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your Health QR</h3>
          <p className="text-xs text-slate-400 mt-1">Show this to providers for secure access</p>
        </div>

        <div className="flex justify-center py-4">
          <motion.div
            className="relative"
            animate={refreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, ease: 'linear' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 rounded-2xl bg-brand-50 flex items-center justify-center opacity-0">
              <RefreshCw className="w-8 h-8 text-brand-300" />
              </div>
            </div>
            <QRCodeSVG
              value={qrData}
              size={144}
              bgColor="transparent"
              fgColor="#1e293b"
              level="M"
              includeMargin={false}
              imageSettings={{
                src: '',
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </motion.div>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active — Live QR
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium transition-all active:scale-95 shadow-md shadow-brand-500/25">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
