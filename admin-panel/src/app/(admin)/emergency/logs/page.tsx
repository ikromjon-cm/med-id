'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { emergencyAccessLogs } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import type { EmergencyAccessLog } from '@/lib/types';

const STATUS_FILTERS = ['All', 'GRANTED', 'DENIED', 'PENDING'];

export default function EmergencyLogsPage() {
  const [logs, setLogs] = useState<EmergencyAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      let filtered = [...emergencyAccessLogs];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(l => l.patientName.toLowerCase().includes(s) || l.accessedBy.toLowerCase().includes(s) || l.accessType.toLowerCase().includes(s));
      }
      if (statusFilter !== 'All') {
        filtered = filtered.filter(l => l.status === statusFilter);
      }
      if (startDate) {
        filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(startDate));
      }
      if (endDate) {
        filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(endDate + 'T23:59:59'));
      }
      setLogs(filtered);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/emergency" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Access Logs</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-9">Track all emergency access to patient records</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or staff..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === s
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {s}
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
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { setStartDate(''); setEndDate(''); }}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Clear</button>
            </div>
          </motion.div>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No logs found"
          description={search || statusFilter !== 'All' || startDate ? 'Try adjusting your filters.' : 'No emergency access logs recorded yet.'}
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  {['Patient', 'Accessed By', 'Access Type', 'Timestamp', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                {logs.map((log, idx) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-white">{log.patientName}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{log.accessedBy}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{log.accessType}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(log.timestamp)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        log.status === 'GRANTED' ? 'bg-[#00C896]/10 text-[#00C896]' :
                        log.status === 'DENIED' ? 'bg-emergency/10 text-emergency' :
                        'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                      }`}>{log.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800/50 text-sm text-gray-500 dark:text-gray-400">
            {logs.length} result{logs.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
