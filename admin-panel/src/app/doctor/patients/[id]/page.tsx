'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Droplets, Phone, Calendar, ArrowLeft, Stethoscope,
  Pill, FileText, Plus
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import { getPatientFullProfile, createDiagnosis, createPrescription, addPatientDocument } from '@/lib/mockData';
import type { Patient, Diagnosis, Prescription, Appointment, PatientDocument } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [diagnosisModal, setDiagnosisModal] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [diagForm, setDiagForm] = useState({ condition: '', notes: '' });
  const [preForm, setPreForm] = useState({ medication: '', dosage: '', frequency: '', startDate: '', endDate: '' });
  const [documentModal, setDocumentModal] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', type: 'Lab Report', size: '' });
  const [accessStatus] = useState<'full' | 'limited' | 'pending'>('limited');
  const [accessPending, setAccessPending] = useState(false);
  const [accessConfirmModal, setAccessConfirmModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const profile = await getPatientFullProfile(patientId);
      setPatient(profile.patient || null);
      setDiagnoses(profile.diagnoses);
      setPrescriptions(profile.prescriptions);
      setAppointments(profile.appointments);
      setDocuments(profile.documents);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const handleCreateDiagnosis = async () => {
    if (!diagForm.condition.trim()) return;
    const d = await createDiagnosis({
      patientId,
      patientName: patient?.name || '',
      doctorId: 'DOC-001',
      doctorName: 'Dr. James Wilson',
      condition: diagForm.condition,
      notes: diagForm.notes,
      date: new Date().toISOString(),
    });
    setDiagnoses(prev => [d, ...prev]);
    setDiagnosisModal(false);
    setDiagForm({ condition: '', notes: '' });
  };

  const handleAddDocument = async () => {
    if (!docForm.name.trim()) return;
    const size = docForm.size || `${(Math.random() * 10 + 0.5).toFixed(1)} MB`;
    const doc = await addPatientDocument(patientId, {
      patientId,
      name: docForm.name,
      type: docForm.type as PatientDocument['type'],
      size,
      date: new Date().toISOString().slice(0, 10),
      url: '#',
    });
    setDocuments(prev => [doc, ...prev]);
    setDocumentModal(false);
    setDocForm({ name: '', type: 'Lab Report', size: '' });
  };

  const handleCreatePrescription = async () => {
    if (!preForm.medication.trim() || !preForm.dosage.trim()) return;
    const p = await createPrescription({
      patientId,
      patientName: patient?.name || '',
      doctorId: 'DOC-001',
      medication: preForm.medication,
      dosage: preForm.dosage,
      frequency: preForm.frequency,
      startDate: preForm.startDate || new Date().toISOString(),
      endDate: preForm.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'active',
    });
    setPrescriptions(prev => [p, ...prev]);
    setPrescriptionModal(false);
    setPreForm({ medication: '', dosage: '', frequency: '', startDate: '', endDate: '' });
  };

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('Back to Patients')}
      </motion.button>

      {loading ? (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700/50 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>
          <LoadingSkeleton type="table" />
        </div>
      ) : !patient ? (
        <ErrorState title={t('Patient not found')} description={t("The patient you're looking for doesn't exist.")} />
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{patient.name}</h3>
                  <StatusBadge status={patient.status} />
                  <span className="text-xs text-gray-400 dark:text-gray-500">{patient.id}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span>{patient.age} yrs, {patient.gender}</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" />{patient.bloodType}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{patient.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{t('Last visit')}: {formatDate(patient.lastVisit)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDiagnosisModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  <Stethoscope className="w-4 h-4" /> {t('Diagnosis')}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPrescriptionModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20">
                  <Pill className="w-4 h-4" /> {t('Prescription')}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Access Request Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Kirish So&apos;rovi</h3>
              <span className={cn(
                'px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5',
                accessPending ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                accessStatus === 'full' ? 'bg-[#00C896]/10 text-[#00C896]' :
                'bg-gray-100 dark:bg-gray-800/50 text-gray-400'
              )}>
                {accessPending ? 'Kutilmoqda' : accessStatus === 'full' ? "To'liq Kirish" : 'Cheklangan'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {accessPending ? "So'rovingiz yuborildi. Bemor javobini kuting." : "Bemorning to'liq ma'lumotlariga kirish uchun ruxsat so'rang."}
            </p>
            {!accessPending && accessStatus !== 'full' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccessConfirmModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                <User className="w-4 h-4" /> To&apos;liq Kirish So&apos;rash
              </motion.button>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/30">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Ruxsatlar</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#00C896]">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">Asosiy Ma&apos;lumotlar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#00C896]">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">Tibbiy Tarix</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={accessPending ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}>
                    {accessPending ? '⏳' : '❌'}
                  </span>
                  <span className={cn(accessPending ? 'text-gray-500' : 'text-gray-400')}>To&apos;liq Yozuvlar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={accessPending ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}>
                    {accessPending ? '⏳' : '❌'}
                  </span>
                  <span className={cn(accessPending ? 'text-gray-500' : 'text-gray-400')}>Hujjatlar</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Medical History')}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{diagnoses.length} {t('records')}</span>
              </div>
              {diagnoses.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">{t('No diagnoses recorded yet.')}</p>
              ) : (
                <div className="space-y-3">
                  {diagnoses.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{d.condition}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(d.date)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{d.notes}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Diagnosed by')} {d.doctorName}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Prescriptions')}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{prescriptions.length} {t('active')}</span>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">{t('No prescriptions yet.')}</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{p.medication}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.dosage} • {p.frequency}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(p.startDate)} - {formatDate(p.endDate)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Documents')}</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { const s = `${(Math.random() * 10 + 0.5).toFixed(1)} MB`; setDocForm({ name: '', type: 'Lab Report', size: s }); setDocumentModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Hujjat Yuklash
                  </motion.button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{documents.length} {t('files')}</span>
                </div>
              </div>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">{t('No documents uploaded.')}</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <motion.div key={doc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type} • {doc.size} • {formatDate(doc.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Appointments Timeline')}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{appointments.length} {t('visits')}</span>
              </div>
              {appointments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">{t('No appointments yet.')}</p>
              ) : (
                <div className="space-y-2">
                  {appointments.sort((a, b) => b.date.localeCompare(a.date)).map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{a.date} at {a.time}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{a.type} with {a.doctorName}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}

      <Modal isOpen={diagnosisModal} onClose={() => setDiagnosisModal(false)} title={t('Create Diagnosis')} size="md"
        footer={
          <>
            <button onClick={() => setDiagnosisModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleCreateDiagnosis} disabled={!diagForm.condition.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Save Diagnosis')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Condition *')}</label>
            <input type="text" value={diagForm.condition} onChange={e => setDiagForm(p => ({ ...p, condition: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Diagnosed condition')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Notes')}</label>
            <textarea value={diagForm.notes} onChange={e => setDiagForm(p => ({ ...p, notes: e.target.value }))} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder={t('Additional notes...')} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={prescriptionModal} onClose={() => setPrescriptionModal(false)} title={t('Create Prescription')} size="md"
        footer={
          <>
            <button onClick={() => setPrescriptionModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleCreatePrescription} disabled={!preForm.medication.trim() || !preForm.dosage.trim()} className="px-4 py-2 text-sm font-medium bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Save Prescription')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Medication *')}</label>
            <input type="text" value={preForm.medication} onChange={e => setPreForm(p => ({ ...p, medication: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Medication name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Dosage *')}</label>
              <input type="text" value={preForm.dosage} onChange={e => setPreForm(p => ({ ...p, dosage: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('e.g. 500mg')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Frequency')}</label>
              <select value={preForm.frequency} onChange={e => setPreForm(p => ({ ...p, frequency: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option value="">{t('Select')}</option>
                <option value="Once daily">{t('Once daily')}</option>
                <option value="Twice daily">{t('Twice daily')}</option>
                <option value="Three times daily">{t('Three times daily')}</option>
                <option value="Every 6 hours">{t('Every 6 hours')}</option>
                <option value="As needed">{t('As needed')}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Start Date')}</label>
              <input type="date" value={preForm.startDate} onChange={e => setPreForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('End Date')}</label>
              <input type="date" value={preForm.endDate} onChange={e => setPreForm(p => ({ ...p, endDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={documentModal} onClose={() => setDocumentModal(false)} title="Hujjat Yuklash" size="md"
        footer={
          <>
            <button onClick={() => setDocumentModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleAddDocument} disabled={!docForm.name.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Upload')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Document Name')} *</label>
            <input type="text" value={docForm.name} onChange={e => setDocForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('e.g. Blood Test Results')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Document Type')}</label>
            <select value={docForm.type} onChange={e => setDocForm(p => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option value="Lab Report">{t('Lab Report')}</option>
              <option value="MRI">{t('MRI')}</option>
              <option value="CT">{t('CT')}</option>
              <option value="X-Ray">{t('X-Ray')}</option>
              <option value="Prescription">{t('Prescription')}</option>
              <option value="Medical Record">{t('Medical Record')}</option>
              <option value="Other">{t('Other')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('File Size')}</label>
            <input type="text" value={docForm.size} readOnly className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          </div>
        </div>
      </Modal>

      <Modal isOpen={accessConfirmModal} onClose={() => setAccessConfirmModal(false)} title="To'liq Kirish So'rash" size="sm"
        footer={
          <>
            <button onClick={() => setAccessConfirmModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={() => { setAccessPending(true); setAccessConfirmModal(false); }} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">{t('Confirm')}</button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          To&apos;liq kirish so&apos;rovi bemorga yuboriladi va uning tasdig&apos;idan so&apos;ng barcha ma&apos;lumotlarga kirish huquqiga ega bo&apos;lasiz.
        </p>
      </Modal>
    </div>
  );
}
