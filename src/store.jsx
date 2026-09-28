import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from './api';
import { useAuth } from './auth';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const [consents, setConsents] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [smsLog, setSmsLog] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientRecords, setPatientRecords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [patientsData, auditData] = await Promise.all([
          api.patients.getAll(),
          api.audit.getAll(),
        ]);
        setPatients(patientsData);
        setAuditLog(auditData);

        if (user?.role === 'patient') {
          const patient = patientsData.find(p => p.name === user.name);
          if (patient) {
            const [recordsData, consentsData] = await Promise.all([
              api.reports.getByPatient(patient.id),
              api.consents.getByPatient(patient.id),
            ]);
            setPatientRecords({ [patient.id]: recordsData });
            setConsents(consentsData);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const addAuditEntry = useCallback(async (action, actor, target) => {
    const icon = action.includes('Grant') || action.includes('Approved') ? 'check'
      : action.includes('Revoke') || action.includes('Denied') ? 'x'
      : action.includes('Emergency') ? 'alert'
      : 'eye';

    try {
      await api.audit.add({ action, actor, target, icon });
      const updated = await api.audit.getAll();
      setAuditLog(updated);
    } catch (err) {
      console.error('Failed to add audit entry:', err);
    }
  }, []);

  const grantConsent = useCallback(async (consentData) => {
    try {
      await api.consents.add(consentData.patientId, consentData);
      const updated = await api.consents.getByPatient(consentData.patientId);
      setConsents(updated);
      addAuditEntry('Consent Granted', consentData.providerName, consentData.purpose);
    } catch (err) {
      console.error('Failed to grant consent:', err);
    }
  }, [addAuditEntry]);

  const revokeConsent = useCallback(async (consentId, patientId) => {
    try {
      await api.consents.revoke(consentId);
      const updated = await api.consents.getByPatient(patientId);
      setConsents(updated);
      addAuditEntry('Consent Revoked', 'Patient', consentId);
    } catch (err) {
      console.error('Failed to revoke consent:', err);
    }
  }, [addAuditEntry]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const simulateEmergencyAccess = useCallback((emergencyContact) => {
    addAuditEntry('Emergency Access Requested', 'AIIMS Emergency Dept.', 'Critical Info Only');
    addNotification('Emergency access requested from AIIMS Emergency Dept.', 'emergency');

    if (emergencyContact?.phone) {
      const smsEntry = {
        id: Date.now(),
        to: emergencyContact.phone,
        contactName: emergencyContact.name,
        message: `EMERGENCY ALERT: Your health record was accessed by AIIMS Emergency Dept. at ${new Date().toLocaleTimeString('en-IN')}. If this wasn't you, contact support immediately.`,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      setSmsLog(prev => [smsEntry, ...prev]);
      addNotification(`SMS sent to ${emergencyContact.name} (${emergencyContact.phone})`, 'success');
    }
  }, [addAuditEntry, addNotification]);

  const denyEmergencyAccess = useCallback(() => {
    addAuditEntry('Emergency Access Denied', 'Patient', 'AIIMS Emergency Dept.');
    addNotification('Emergency access denied', 'info');
  }, [addAuditEntry, addNotification]);

  const revokeEmergencyAccess = useCallback((emergencyContact) => {
    addAuditEntry('Emergency Access Revoked', 'Patient', 'AIIMS Emergency Dept.');
    addNotification('Emergency access revoked', 'info');

    if (emergencyContact?.phone) {
      const smsEntry = {
        id: Date.now(),
        to: emergencyContact.phone,
        contactName: emergencyContact.name,
        message: `UPDATE: Emergency access to your health record has been REVOKED at ${new Date().toLocaleTimeString('en-IN')}.`,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      setSmsLog(prev => [smsEntry, ...prev]);
      addNotification(`Revoke notification sent to ${emergencyContact.name}`, 'success');
    }
  }, [addAuditEntry, addNotification]);

  const loadPatientRecords = useCallback(async (patientId) => {
    try {
      const records = await api.reports.getByPatient(patientId);
      setPatientRecords(prev => ({ ...prev, [patientId]: records }));
      return records;
    } catch (err) {
      console.error('Failed to load patient records:', err);
      return null;
    }
  }, []);

  const getPatientRecords = useCallback((patientId) => {
    return patientRecords[patientId] || { allergies: [], prescriptions: [], priorRecords: [], vitals: null };
  }, [patientRecords]);

  const addReport = useCallback(async (patientId, reportType, reportData, actorName) => {
    try {
      const data = { ...reportData, actor: actorName };

      switch (reportType) {
        case 'allergy':
          await api.reports.addAllergy(patientId, data);
          break;
        case 'prescription':
          await api.reports.addPrescription(patientId, data);
          break;
        case 'priorRecord':
          await api.reports.addPriorRecord(patientId, data);
          break;
        case 'vitals':
          await api.reports.addVitals(patientId, data);
          break;
        default:
          return null;
      }

      const records = await api.reports.getByPatient(patientId);
      setPatientRecords(prev => ({ ...prev, [patientId]: records }));

      const updatedAudit = await api.audit.getAll();
      setAuditLog(updatedAudit);

      const patient = patients.find(p => p.id === patientId);
      const typeName = reportType === 'priorRecord' ? 'Prior Record' : reportType.charAt(0).toUpperCase() + reportType.slice(1);
      addNotification(`${typeName} added successfully for ${patient?.name || patientId}`, 'success');

      return true;
    } catch (err) {
      console.error('Failed to add report:', err);
      addNotification('Failed to add report', 'error');
      return null;
    }
  }, [patients, addAuditEntry, addNotification]);

  return (
    <StoreContext.Provider value={{
      patient: patients[0],
      patients,
      patientRecords,
      allergies: patientRecords[patients[0]?.id]?.allergies || [],
      prescriptions: patientRecords[patients[0]?.id]?.prescriptions || [],
      priorRecords: patientRecords[patients[0]?.id]?.priorRecords || [],
      vitals: patientRecords[patients[0]?.id]?.vitals || null,
      consents,
      auditLog,
      notifications,
      smsLog,
      loading,
      grantConsent,
      revokeConsent,
      addAuditEntry,
      simulateEmergencyAccess,
      denyEmergencyAccess,
      revokeEmergencyAccess,
      addNotification,
      loadPatientRecords,
      getPatientRecords,
      addReport,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
