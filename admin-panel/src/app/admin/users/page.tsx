'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import type { User } from '@/lib/types';
import { t } from '@/lib/i18n';

const ROLE_OPTIONS = [
  { value: 'admin', label: t('Admin') },
  { value: 'doctor', label: t('Doctor') },
  { value: 'nurse', label: t('Nurse') },
  { value: 'receptionist', label: t('Receptionist') },
  { value: 'patient', label: t('Patient') },
];

const STATUS_OPTIONS = [
  { value: 'active', label: t('Active') },
  { value: 'inactive', label: t('Inactive') },
  { value: 'suspended', label: t('Suspended') },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'doctor' as User['role'], status: 'active' as User['status'] });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { queueMicrotask(() => loadUsers()); }, [loadUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'doctor', status: 'active' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setFormErrors({});
    setModalOpen(true);
  };

  const openDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = t('Name is required');
    if (!form.email.trim()) errors.email = t('Email is required');
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = t('Invalid email');
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
      } else {
        await createUser(form);
      }
      await loadUsers();
      setModalOpen(false);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    await deleteUser(deletingUser.id);
    await loadUsers();
    setDeleteModalOpen(false);
    setDeletingUser(null);
    setSaving(false);
  };

  const columns = [
    { key: 'id', header: t('ID'), sortable: true },
    { key: 'name', header: t('Name'), sortable: true },
    { key: 'email', header: t('Email'), sortable: true },
    {
      key: 'role',
      header: t('Role'),
      sortable: true,
      render: (u: User) => <RoleBadge role={u.role} />,
    },
    {
      key: 'status',
      header: t('Status'),
      sortable: true,
      render: (u: User) => <StatusBadge status={u.status} />,
    },
    {
      key: 'createdAt',
      header: t('Created'),
      sortable: true,
      render: (u: User) => <span className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(u.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Users Management')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Manage all platform users')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {t('Add User')}
        </motion.button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        onEdit={openEdit}
        onDelete={openDelete}
        searchPlaceholder={t('Search by name or email...')}
        loading={loading}
        emptyTitle={t('No users found')}
        emptyDescription={t('Try adjusting your search or add a new user.')}
        onEmptyAction={{ label: t('Add User'), onClick: openCreate }}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? t('Edit User') : t('Create User')}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">{t('Cancel')}</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingUser ? t('Update') : t('Create')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label={t('Full Name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={formErrors.name} placeholder="John Doe" />
          <FormInput label={t('Email')} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={formErrors.email} placeholder="john@medid.com" />
          <FormInput label={t('Role')} as="select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} options={ROLE_OPTIONS} />
          <FormInput label={t('Status')} as="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as User['status'] })} options={STATUS_OPTIONS} />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('Delete User')}
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">{t('Cancel')}</button>
            <button onClick={handleDelete} disabled={saving} className="px-5 py-2 text-sm font-medium bg-emergency text-white rounded-xl hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/20 disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {t('Delete')}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('Are you sure you want to delete')} <strong className="text-gray-900 dark:text-white">{deletingUser?.name}</strong>? {t('This action cannot be undone.')}
        </p>
      </Modal>
    </div>
  );
}
