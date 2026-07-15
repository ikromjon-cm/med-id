'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText, File, Upload, Trash2,
  X, AlertTriangle, Calendar, HardDrive,
  FileCheck, Stethoscope, Syringe,
  ScanLine, FileImage
} from 'lucide-react';
import {
  getPatientDocuments, addPatientDocument, deletePatientDocument
} from '@/lib/mockData';
import type { PatientDocument } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';

const documentIcons: Record<string, React.ReactNode> = {
  'Lab Report': <FileCheck className="w-5 h-5 text-blue-500" />,
  'MRI': <ScanLine className="w-5 h-5 text-purple-500" />,
  'CT': <ScanLine className="w-5 h-5 text-orange-500" />,
  'X-Ray': <FileImage className="w-5 h-5 text-amber-500" />,
  'Prescription': <Syringe className="w-5 h-5 text-secondary" />,
  'Medical Record': <Stethoscope className="w-5 h-5 text-primary" />,
  'Other': <File className="w-5 h-5 text-gray-500" />,
};

const docTypes = ['All', 'Lab Report', 'MRI', 'CT', 'X-Ray', 'Prescription', 'Medical Record', 'Other'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', type: 'Other' as PatientDocument['type'], size: '0 B' });
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const docs = await getPatientDocuments(patientId);
      setDocuments(docs);
      setLoading(false);
    }
    load();
  }, []);

  const filteredDocs = filter === 'All' ? documents : documents.filter(d => d.type === filter);

  const handleUpload = async () => {
    if (!uploadData.name.trim()) return;
    const newDoc = await addPatientDocument(patientId, {
      patientId,
      name: uploadData.name,
      type: uploadData.type,
      size: uploadData.size,
      date: new Date().toISOString().slice(0, 10),
      url: '#',
    });
    setDocuments(prev => [newDoc, ...prev]);
    setShowUpload(false);
    setUploadData({ name: '', type: 'Other', size: '0 B' });
  };

  const handleDelete = async (docId: string) => {
    await deletePatientDocument(patientId, docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setDeleteModal(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-200  rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200  rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-gray-200  mb-3" />
              <div className="h-4 w-32 bg-gray-200  rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200  rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900 ">{t('My Documents')}</h2>
          <p className="text-sm text-gray-500 ">
            {documents.length} {t('document')} {t('stored securely')}
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
        >
          <Upload className="w-4 h-4" />
          {t('Upload Document')}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 overflow-x-auto pb-2"
      >
        {docTypes.map(dt => (
          <button
            key={dt}
            onClick={() => setFilter(dt)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
              filter === dt
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white/70  text-gray-600  border border-gray-200  hover:border-primary/30'
            )}
          >
            {dt === 'All' ? t('All Types') : t(dt)} {dt !== 'All' && `(${documents.filter(d => d.type === dt).length})`}
          </button>
        ))}
      </motion.div>

      {filteredDocs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gray-100  flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-400 " />
            </div>
            <h3 className="text-lg font-semibold text-gray-900  mb-1">
              {filter === 'All' ? t('No documents yet') : `${t('No documents of type')} ${t(filter)}`}
            </h3>
            <p className="text-sm text-gray-500  text-center max-w-sm mb-6">
              {filter === 'All'
                ? t('Upload your medical documents to keep them organized and accessible.')
                : `${t('No documents of type')} "${t(filter)}" ${t('found')}.`}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20"
            >
              {t('Upload Document')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}
        >
          {filteredDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group',
                viewMode === 'list' && 'flex items-center gap-4'
              )}
            >
              <div className={cn(viewMode === 'list' ? 'flex items-center gap-4 w-full' : '')}>
                <div className={cn(
                  'w-12 h-12 rounded-xl bg-gray-50  flex items-center justify-center mb-3',
                  viewMode === 'list' && 'mb-0'
                )}>
                  {documentIcons[doc.type] || <File className="w-5 h-5 text-gray-400" />}
                </div>
                <div className={cn('flex-1', viewMode === 'list' && 'flex items-center justify-between')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-900  truncate max-w-[200px]">
                      {doc.name}
                    </p>
                    <div className={cn(
                      'flex items-center gap-3 mt-1.5',
                      viewMode === 'list' && 'mt-0.5'
                    )}>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(doc.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <HardDrive className="w-3 h-3" />
                        {doc.size}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    'flex items-center gap-2 mt-3',
                    viewMode === 'list' && 'mt-0'
                  )}>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-primary/5 text-primary border border-primary/10">
                      {t(doc.type)}
                    </span>
                    <button
                      onClick={() => setDeleteModal(doc.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-emergency hover:bg-emergency/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white  rounded-2xl shadow-2xl border border-gray-200  p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-emergency/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-emergency" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900  text-center mb-2">{t('Delete Document')}</h3>
              <p className="text-sm text-gray-500  text-center mb-6">
                {t('Are you sure you want to delete this document? This action cannot be undone.')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200  text-gray-700  hover:bg-gray-50  transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-emergency text-white hover:bg-emergency-dark transition-colors"
                >
                  {t('Delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowUpload(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white  rounded-2xl shadow-2xl border border-gray-200  p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 ">{t('Upload Document')}</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100  transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1.5">
                      {t('Document Name')}
                    </label>
                    <input
                      type="text"
                      value={uploadData.name}
                      onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                      placeholder={t('e.g. Blood Test Results')}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1.5">
                      {t('Document Type')}
                    </label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as PatientDocument['type'] })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {docTypes.filter(dt => dt !== 'All').map(dt => (
                      <option key={dt} value={dt}>{t(dt)}</option>
                    ))}
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1.5">
                      {t('File Size')}
                    </label>
                    <input
                      type="text"
                      value={uploadData.size}
                      onChange={(e) => setUploadData({ ...uploadData, size: e.target.value })}
                      placeholder={t('e.g. 2.4 MB')}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200  text-gray-700  hover:bg-gray-50  transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadData.name.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {t('Upload')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
