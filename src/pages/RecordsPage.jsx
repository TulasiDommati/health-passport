import { motion } from 'framer-motion';
import { AllergiesList, PrescriptionsList, VitalsCard, PriorRecordsList } from '../components/MedicalRecords';

export default function RecordsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Medical Records</h2>
        <p className="text-xs text-slate-500 mt-0.5">Your complete health summary</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <VitalsCard />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <AllergiesList />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <PrescriptionsList />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <PriorRecordsList />
      </motion.div>
    </div>
  );
}
