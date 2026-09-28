import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, UserPlus, FileText, Pill, Activity, ClipboardList,
  ChevronRight, Check, AlertCircle, User
} from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../auth';

const REPORT_TABS = [
  { id: 'allergy', label: 'Allergy', icon: AlertCircle },
  { id: 'prescription', label: 'Prescription', icon: Pill },
  { id: 'priorRecord', label: 'Prior Record', icon: ClipboardList },
  { id: 'vitals', label: 'Vitals', icon: Activity },
];

function PatientSearch({ patients, onSelect, selectedPatient }) {
  const [query, setQuery] = useState('');

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.id.toLowerCase().includes(query.toLowerCase()) ||
    p.phone.includes(query)
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, ID, or phone..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map(patient => (
          <motion.button
            key={patient.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(patient)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              selectedPatient?.id === patient.id
                ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-500/10'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
              selectedPatient?.id === patient.id ? 'bg-brand-500' : 'bg-slate-400'
            }`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.id} • {patient.bloodGroup}</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${selectedPatient?.id === patient.id ? 'text-brand-500' : 'text-slate-300'}`} />
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-4">No patients found</p>
        )}
      </div>
    </div>
  );
}

function AllergyForm({ onSubmit }) {
  const [form, setForm] = useState({ allergen: '', severity: 'Moderate', reaction: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ allergen: '', severity: 'Moderate', reaction: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Allergen</label>
        <input
          type="text"
          value={form.allergen}
          onChange={e => setForm({ ...form, allergen: e.target.value })}
          placeholder="e.g., Penicillin, Peanuts"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Severity</label>
        <select
          value={form.severity}
          onChange={e => setForm({ ...form, severity: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
        >
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reaction</label>
        <input
          type="text"
          value={form.reaction}
          onChange={e => setForm({ ...form, reaction: e.target.value })}
          placeholder="e.g., Skin rash, Anaphylaxis"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
      >
        Add Allergy
      </button>
    </form>
  );
}

function PrescriptionForm({ onSubmit }) {
  const [form, setForm] = useState({
    medication: '', dosage: '', prescribedBy: '', date: '', condition: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ medication: '', dosage: '', prescribedBy: '', date: '', condition: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Medication</label>
        <input
          type="text"
          value={form.medication}
          onChange={e => setForm({ ...form, medication: e.target.value })}
          placeholder="e.g., Metformin 500mg"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dosage</label>
        <input
          type="text"
          value={form.dosage}
          onChange={e => setForm({ ...form, dosage: e.target.value })}
          placeholder="e.g., Twice daily with meals"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prescribed By</label>
          <input
            type="text"
            value={form.prescribedBy}
            onChange={e => setForm({ ...form, prescribedBy: e.target.value })}
            placeholder="Doctor name"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Condition</label>
        <input
          type="text"
          value={form.condition}
          onChange={e => setForm({ ...form, condition: e.target.value })}
          placeholder="e.g., Type 2 Diabetes"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
      >
        Add Prescription
      </button>
    </form>
  );
}

function PriorRecordForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '', facility: '', date: '', doctor: '', type: 'Checkup', summary: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', facility: '', date: '', doctor: '', type: 'Checkup', summary: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Annual Health Checkup"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Facility</label>
          <input
            type="text"
            value={form.facility}
            onChange={e => setForm({ ...form, facility: e.target.value })}
            placeholder="Hospital name"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Doctor</label>
          <input
            type="text"
            value={form.doctor}
            onChange={e => setForm({ ...form, doctor: e.target.value })}
            placeholder="Doctor name"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          >
            <option value="Checkup">Checkup</option>
            <option value="Surgery">Surgery</option>
            <option value="Imaging">Imaging</option>
            <option value="Vaccination">Vaccination</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Summary</label>
        <textarea
          value={form.summary}
          onChange={e => setForm({ ...form, summary: e.target.value })}
          placeholder="Brief summary of the record..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
      >
        Add Prior Record
      </button>
    </form>
  );
}

function VitalsForm({ onSubmit }) {
  const [form, setForm] = useState({
    bloodPressure: '', heartRate: '', temperature: '', bloodSugar: '', bmi: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      heartRate: Number(form.heartRate),
      bmi: Number(form.bmi),
    });
    setForm({ bloodPressure: '', heartRate: '', temperature: '', bloodSugar: '', bmi: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Blood Pressure</label>
          <input
            type="text"
            value={form.bloodPressure}
            onChange={e => setForm({ ...form, bloodPressure: e.target.value })}
            placeholder="e.g., 120/80"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Heart Rate (bpm)</label>
          <input
            type="number"
            value={form.heartRate}
            onChange={e => setForm({ ...form, heartRate: e.target.value })}
            placeholder="e.g., 72"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Temperature</label>
          <input
            type="text"
            value={form.temperature}
            onChange={e => setForm({ ...form, temperature: e.target.value })}
            placeholder="e.g., 98.6°F"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Blood Sugar</label>
          <input
            type="text"
            value={form.bloodSugar}
            onChange={e => setForm({ ...form, bloodSugar: e.target.value })}
            placeholder="e.g., 100 mg/dL"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">BMI</label>
        <input
          type="number"
          step="0.1"
          value={form.bmi}
          onChange={e => setForm({ ...form, bmi: e.target.value })}
          placeholder="e.g., 24.5"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all active:scale-[0.98]"
      >
        Add Vitals
      </button>
    </form>
  );
}

export default function ReceptionistDashboard() {
  const { patients, addReport } = useStore();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('allergy');
  const [success, setSuccess] = useState(false);

  const handleAddReport = async (reportType, data) => {
    if (!selectedPatient) return;
    await addReport(selectedPatient.id, reportType, data, user?.name);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Receptionist Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Search patients and add medical reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
              <p className="text-xs text-slate-500">Total Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">4</p>
              <p className="text-xs text-slate-500">Report Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{user?.name?.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">Logged in as</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              Select Patient
            </h2>
            <PatientSearch
              patients={patients}
              onSelect={setSelectedPatient}
              selectedPatient={selectedPatient}
            />
          </div>
        </div>

        {/* Report Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            {selectedPatient ? (
              <>
                {/* Selected Patient Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedPatient.name}</p>
                    <p className="text-xs text-slate-500">{selectedPatient.id} • {selectedPatient.bloodGroup} • {selectedPatient.gender}</p>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium mb-4"
                    >
                      <Check className="w-4 h-4" />
                      Report added successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {REPORT_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div className="p-4 rounded-xl border border-slate-200">
                  {activeTab === 'allergy' && <AllergyForm onSubmit={(data) => handleAddReport('allergy', data)} />}
                  {activeTab === 'prescription' && <PrescriptionForm onSubmit={(data) => handleAddReport('prescription', data)} />}
                  {activeTab === 'priorRecord' && <PriorRecordForm onSubmit={(data) => handleAddReport('priorRecord', data)} />}
                  {activeTab === 'vitals' && <VitalsForm onSubmit={(data) => handleAddReport('vitals', data)} />}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-900">No Patient Selected</p>
                <p className="text-xs text-slate-500 mt-1">Search and select a patient to add reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
