'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import StatusBadge from '@/components/StatusBadge';
import { getClinics, createClinic, updateClinic, deleteClinic } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import type { Clinic } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [deleting, setDeleting] = useState<Clinic | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', status: 'active' as Clinic['status'], doctorsCount: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getClinics();
    setClinics(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', address: '', phone: '', status: 'active', doctorsCount: 0 });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (c: Clinic) => {
    setEditing(c);
    setForm({ name: c.name, address: c.address, phone: c.phone, status: c.status, doctorsCount: c.doctorsCount });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.address.trim()) errors.address = 'Address is required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      if (editing) {
        await updateClinic(editing.id, form);
      } else {
        await createClinic(form);
      }
      await load();
      setModalOpen(false);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    await deleteClinic(deleting.id);
    await load();
    setDeleteModalOpen(false);
    setDeleting(null);
    setSaving(false);
  };

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'address', header: 'Address', sortable: true },
    { key: 'phone', header: 'Phone' },
    { key: 'status', header: 'Status', sortable: true, render: (c: Clinic) => <StatusBadge status={c.status} /> },
    { key: 'doctorsCount', header: 'Doctors', sortable: true, render: (c: Clinic) => <span className="font-medium">{c.doctorsCount}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clinics Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered clinics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Clinic
        </motion.button>
      </div>

      <DataTable
        data={clinics}
        columns={columns}
        keyExtractor={(c) => c.id}
        onEdit={openEdit}
        onDelete={(c) => { setDeleting(c); setDeleteModalOpen(true); }}
        searchPlaceholder="Search clinics..."
        loading={loading}
        emptyTitle="No clinics found"
        onEmptyAction={{ label: 'Add Clinic', onClick: openCreate }}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Clinic' : 'Add Clinic'}
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
          <FormInput label="Clinic Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={formErrors.name} placeholder="Med-ID Central Hospital" />
          <FormInput label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} error={formErrors.address} placeholder="123 Main Street" />
          <FormInput label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={formErrors.phone} placeholder="+1 (555) 123-4567" />
          <FormInput label="Status" as="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Clinic['status'] })} options={STATUS_OPTIONS} />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Clinic"
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
