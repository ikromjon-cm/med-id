'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { TableColumn, SortDirection } from '@/lib/types';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: { label: string; onClick: () => void };
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  loading = false,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let items = data;
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(item =>
        columns.some(col => {
          const val = item[col.key];
          return val != null && String(val).toLowerCase().includes(s);
        })
      );
    }
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === 'string'
          ? aVal.localeCompare(bVal)
          : aVal - bVal;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return items;
  }, [data, search, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  if (loading) {
    return <LoadingSkeleton type="table" className={className} />;
  }

  return (
    <div className={cn('glass-card rounded-2xl', className)}>
      {(searchable || onEdit || onDelete) && (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={emptyTitle || 'No results found'}
          description={emptyDescription || (search ? 'Try adjusting your search or filters.' : 'No data available yet.')}
          action={onEmptyAction ? { label: onEmptyAction.label, onClick: onEmptyAction.onClick } : undefined}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                        col.sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.header}
                        {col.sortable && sortKey === col.key && (
                          sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                {paginated.map((item, idx) => (
                  <motion.tr
                    key={keyExtractor(item)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emergency hover:bg-emergency/10 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800/50">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                      p === page
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
