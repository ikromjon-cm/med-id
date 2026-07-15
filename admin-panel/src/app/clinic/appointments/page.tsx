'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus, Clock,
  ChevronLeft, ChevronRight, CheckCircle
} from 'lucide-react';
import DataTable from '@/components/DataTable';
import ErrorState from '@/components/ErrorState';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import { getClinicDetail } from '@/lib/mockData';
import type { Appointment, TableColumn } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

const CLINIC_ID = 'CLN-001';

const DAY_LABELS = ['Du', 'Se', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

export default function ClinicAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', doctorName: '', date: '', time: '', type: '' });

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const detail = await getClinicDetail(CLINIC_ID);
      setAppointments(detail?.appointments || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (selectedDate && a.date !== selectedDate) return false;
    return true;
  });

  const handleOpenReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setRescheduleSuccess(false);
    setRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedAppt || !newDate || !newTime) return;
    setAppointments(prev => prev.map(a =>
      a.id === selectedAppt.id ? { ...a, date: newDate, time: newTime } : a
    ));
    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleModal(false);
      setRescheduleSuccess(false);
      setSelectedAppt(null);
    }, 1500);
  };

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const apptCountByDay: Record<number, number> = {};
  appointments.forEach(a => {
    const d = new Date(a.date + 'T00:00:00');
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      apptCountByDay[day] = (apptCountByDay[day] || 0) + 1;
    }
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
    setViewMode('list');
  };

  const columns: TableColumn<Appointment>[] = [
    { key: 'patientName', header: t('Patient'), sortable: true },
    { key: 'doctorName', header: t('Doctor'), sortable: true },
    {
      key: 'date', header: t('Date'), sortable: true,
      render: (a: Appointment) => <span className="text-gray-900 ">{formatDate(a.date)}</span>,
    },
    {
      key: 'time', header: t('Time'), sortable: true,
      render: (a: Appointment) => (
        <span className="flex items-center gap-1 text-gray-600 ">
          <Clock className="w-3.5 h-3.5" /> {a.time}
        </span>
      ),
    },
    { key: 'type', header: t('Type'), sortable: true },
    {
      key: 'status', header: t('Status'), sortable: true,
      render: (a: Appointment) => <StatusBadge status={a.status} />,
    },
    {
      key: 'actions', header: t('Actions'), sortable: false,
      render: (a: Appointment) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleOpenReschedule(a); }}
          className="px-3 py-1.5 rounded-lg bg-gray-100  text-xs font-medium text-gray-600  hover:bg-primary/10 hover:text-primary transition-all"
        >
          {t('Reschedule')}
        </button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 ">{t('Appointments')}</h2>
          <p className="text-sm text-gray-500  mt-1">{t('Manage clinic appointments')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {t('New Appointment')}
        </motion.button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setViewMode('list')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            viewMode === 'list'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white/70  text-gray-600  hover:bg-gray-100 '
          )}
        >
          {t('List')}
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            viewMode === 'calendar'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white/70  text-gray-600  hover:bg-gray-100 '
          )}
        >
          {t('Calendar')}
        </button>
        <div className="w-px h-6 bg-gray-200  mx-1" />
        {['ALL', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
              statusFilter === status
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/70  text-gray-600  hover:bg-gray-100 '
            )}
          >
            {status === 'ALL' ? t('All') : t(status)}
          </button>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600  hover:bg-gray-100  transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <h3 className="text-base font-semibold text-gray-900 ">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600  hover:bg-gray-100  transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500  py-2 uppercase tracking-wide">
                {d}
              </div>
            ))}
            {Array.from({ length: startOffset }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const count = apptCountByDay[day] || 0;
              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'relative rounded-xl p-2 text-sm transition-all flex flex-col items-center gap-0.5 min-h-[48px]',
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : isToday
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-700  hover:bg-gray-100 '
                  )}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span className={cn(
                      'text-[10px] font-bold leading-none',
                      isSelected ? 'text-white' : 'text-primary'
                    )}>
                      {count}
                    </span>
                  )}
                  {count > 0 && (
                    <div className={cn(
                      'w-1 h-1 rounded-full',
                      isSelected ? 'bg-white' : 'bg-primary'
                    )} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {selectedDate && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 ">
                {t('Showing appointments for')} {formatDate(selectedDate)}
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-primary hover:text-primary-dark underline"
              >
                {t('All Days')}
              </button>
            </div>
          )}

          <DataTable
            data={filtered}
            columns={columns}
            keyExtractor={(a) => a.id}
            searchable
            searchPlaceholder={t('Search appointments...')}
            loading={loading}
            emptyTitle={t('No appointments found')}
            emptyDescription={statusFilter !== 'ALL' ? t('No appointments with status "' + statusFilter + '".') : t('No appointments scheduled yet.')}
            onEmptyAction={!loading ? { label: t('Create Appointment'), onClick: () => setCreateModal(true) } : undefined}
          />
        </>
      )}

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title={t('New Appointment')} size="md"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600  hover:bg-gray-100  rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={() => { setCreateModal(false); setFormData({ patientName: '', doctorName: '', date: '', time: '', type: '' }); }} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">{t('Create')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">{t('Patient Name *')}</label>
            <input type="text" value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Enter patient name')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">{t('Doctor')}</label>
            <input type="text" value={formData.doctorName} onChange={e => setFormData(p => ({ ...p, doctorName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Doctor name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('Date *')}</label>
              <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('Time *')}</label>
              <input type="time" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">{t('Type')}</label>
            <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option value="">{t('Select type')}</option>
              <option value="Checkup">{t('Checkup')}</option>
              <option value="Follow-up">{t('Follow-up')}</option>
              <option value="Consultation">{t('Consultation')}</option>
              <option value="Emergency">{t('Emergency')}</option>
              <option value="Routine">{t('Routine')}</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={rescheduleModal} onClose={() => setRescheduleModal(false)} title={t('Reschedule')} size="sm"
        footer={
          rescheduleSuccess ? undefined : (
            <>
              <button onClick={() => setRescheduleModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600  hover:bg-gray-100  rounded-xl transition-all">{t('Cancel')}</button>
              <button onClick={handleConfirmReschedule} disabled={!newDate || !newTime} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Confirm')}</button>
            </>
          )
        }
      >
        {rescheduleSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
            <p className="text-sm font-medium text-gray-900 ">{t('Rescheduled successfully!')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedAppt && (
              <div className="rounded-xl bg-gray-50  p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 ">{t('Patient')}</span>
                  <span className="font-medium text-gray-900 ">{selectedAppt.patientName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 ">{t('Current Date')}</span>
                  <span className="font-medium text-gray-900 ">{formatDate(selectedAppt.date)} | {selectedAppt.time}</span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('New Date')}</label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('New Time')}</label>
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
