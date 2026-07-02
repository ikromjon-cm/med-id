'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import StatusBadge from '@/components/StatusBadge';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, getClinics } from '@/lib/mockData';
import type { Doctor, Clinic } from '@/lib/types';

const SPECIALIZATIONS = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Oncology', 'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'Internal Medicine', 'Obstetrics', 'Ophthalmology', 'Pathology', 'Psychiatry', 'Surgery', 'Urology', 'Endocrinology', 'Gastroenterology', 'Pulmonology'];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on-leave', label: 'On Leave' },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);
  const [form, setForm] = useState({ name: '', specialization: '', clinic: '', status: 'active' as Doctor['status'], patients: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [d, c] = await Promise.all([getDoctors(), getClinics()]);
    setDoctors(d);
    setClinics(c);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', specialization: SPECIALIZATIONS[0], clinic: clinics[0]?.name || '', status: 'active', patients: 0 });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (d: Doctor) => {
    setEditing(d);
    setForm({ name: d.name, specialization: d.specialization, clinic: d.clinic, status: d.status, patients: d.patients });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.specialization) errors.specialization = 'Specialization is required';
    if (!form.clinic) errors.clinic = 'Clinic is required';
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      if (editing) {
        await updateDoctor(editing.id, form);
      } else {
        await createDoctor(form);
      }
      await load();
      setModalOpen(false);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    await deleteDoctor(deleting.id);
    await load();
    setDeleteModalOpen(false);
    setDeleting(null);
    setSaving(false);
  };

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'specialization', header: 'Specialization', sortable: true,
      render: (d: Doctor) => <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">{d.specialization}</span>
    },
    { key: 'clinic', header: 'Clinic', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (d: Doctor) => <StatusBadge status={d.status} /> },
    { key: 'patients', header: 'Patients', sortable: true, render: (d: Doctor) => <span className="font-medium">{d.patients}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Doctors Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered doctors</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </motion.button>
      </div>

      <DataTable
        data={doctors}
        columns={columns}
        keyExtractor={(d) => d.id}
        onEdit={openEdit}
        onDelete={(d) => { setDeleting(d); setDeleteModalOpen(true); }}
        searchPlaceholder="Search doctors..."
        loading={loading}
        emptyTitle="No doctors found"
        onEmptyAction={{ label: 'Add Doctor', onClick: openCreate }}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Doctor' : 'Add Doctor'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={formErrors.name} placeholder="Dr. John Doe" />
          <FormInput
            label="Specialization"
            as="select"
            value={form.specialization}
            onChange={e => setForm({ ...form, specialization: e.target.value })}
            options={SPECIALIZATIONS.map(s => ({ value: s, label: s }))}
            error={formErrors.specialization}
          />
          <FormInput
            label="Clinic"
            as="select"
            value={form.clinic}
            onChange={e => setForm({ ...form, clinic: e.target.value })}
            options={clinics.map(c => ({ value: c.name, label: c.name }))}
            error={formErrors.clinic}
          />
          <FormInput label="Status" as="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Doctor['status'] })} options={STATUS_OPTIONS} />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Doctor"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="px-5 py-2 text-sm font-medium bg-emergency text-white rounded-xl hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/20 disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleting?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
