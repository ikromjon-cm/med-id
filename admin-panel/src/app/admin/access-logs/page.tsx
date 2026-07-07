'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { getAccessLogs } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import type { AccessLog } from '@/lib/types';
import { t } from '@/lib/i18n';

const ROLE_FILTERS = [t('All'), t('Admin'), t('Doctor'), t('Nurse'), t('Receptionist'), t('Patient')];

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAccessLogs({
      search: search || undefined,
      role: roleFilter !== 'All' ? roleFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setLogs(data);
    setLoading(false);
  }, [search, roleFilter, startDate, endDate]);

  useEffect(() => { queueMicrotask(() => load()); }, [load]);

  const handleExport = () => {
    const csv = [[t('User'), t('Role'), t('Action'), t('Resource'), t('Timestamp'), t('IP')].join(',')];
    logs.forEach(l => {
      csv.push([l.user, l.role, l.action, l.resource, l.timestamp, l.ip].join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `access-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'user', header: t('User'), sortable: true },
    { key: 'role', header: t('Role'), sortable: true },
    { key: 'action', header: t('Action'), sortable: true },
    { key: 'resource', header: t('Resource'), sortable: true },
    { key: 'timestamp', header: t('Timestamp'), sortable: true, render: (l: AccessLog) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(l.timestamp)}</span> },
    { key: 'ip', header: t('IP Address') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Access Logs')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Track all system access and activities')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-4 h-4" />
          {t('Export CSV')}
        </motion.button>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search logs...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {ROLE_FILTERS.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  roleFilter === r
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50"
          >
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Start Date')}</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('End Date')}</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {t('Clear')}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(l) => l.id}
        searchable={false}
        pageSize={15}
        loading={loading}
        emptyTitle={t('No access logs found')}
        emptyDescription={search || roleFilter !== 'All' || startDate ? t('Try adjusting your filters.') : t('No access logs recorded yet.')}
      />
    </div>
  );
}
