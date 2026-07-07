'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Search, MapPin, Phone, Users, ArrowRight,
  Star, ChevronRight, Handshake,
} from 'lucide-react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

const clinicData = [
  { id: 'CLN-001', name: 'Med-ID Central Hospital', address: '742 Evergreen Terrace, New York, NY', phone: '+1 (212) 555-0101', doctors: 45, patients: 12000, rating: 4.8 },
  { id: 'CLN-002', name: 'Green Valley Medical Center', address: '123 Main Street, Los Angeles, CA', phone: '+1 (310) 555-0202', doctors: 32, patients: 8500, rating: 4.6 },
  { id: 'CLN-003', name: 'Pinecrest Health Clinic', address: '456 Oak Avenue, Chicago, IL', phone: '+1 (312) 555-0303', doctors: 18, patients: 5200, rating: 4.7 },
  { id: 'CLN-004', name: 'Riverside Medical Group', address: '789 Pine Road, Houston, TX', phone: '+1 (713) 555-0404', doctors: 56, patients: 15000, rating: 4.9 },
  { id: 'CLN-005', name: 'Sunset Diagnostic Center', address: '321 Maple Drive, Phoenix, AZ', phone: '+1 (602) 555-0505', doctors: 12, patients: 3800, rating: 4.5 },
  { id: 'CLN-006', name: 'Harbor Health Partners', address: '654 Elm Street, Boston, MA', phone: '+1 (617) 555-0606', doctors: 28, patients: 7200, rating: 4.4 },
  { id: 'CLN-007', name: 'Maple Grove Pediatrics', address: '987 Birch Lane, Denver, CO', phone: '+1 (303) 555-0707', doctors: 15, patients: 4100, rating: 4.8 },
  { id: 'CLN-008', name: 'Cedar Ridge Cardiology', address: '147 Cedar Court, Seattle, WA', phone: '+1 (206) 555-0808', doctors: 22, patients: 6500, rating: 4.7 },
  { id: 'CLN-009', name: 'Oakwood Surgical Center', address: '258 Walnut Way, Miami, FL', phone: '+1 (305) 555-0909', doctors: 35, patients: 9800, rating: 4.6 },
  { id: 'CLN-010', name: 'Silver Lake Family Health', address: '369 Spruce Boulevard, Portland, OR', phone: '+1 (503) 555-1010', doctors: 20, patients: 5600, rating: 4.5 },
  { id: 'CLN-011', name: 'Bay Area Medical Associates', address: '159 Lake View Drive, San Francisco, CA', phone: '+1 (415) 555-1111', doctors: 40, patients: 11000, rating: 4.8 },
  { id: 'CLN-012', name: 'Crystal Run Healthcare', address: '753 Park Avenue, Dallas, TX', phone: '+1 (214) 555-1212', doctors: 30, patients: 8900, rating: 4.7 },
];

export default function PartnersPage() {
  const [search, setSearch] = useState('');
  const [clinics] = useState(clinicData);

  const filtered = clinics.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-bg-main dark:bg-[#0F0F15]">
      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" /> {t('Our Network')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('Our Partner')}{' '}
              <span className="text-primary">{t('Clinics & Hospitals')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('MED-ID is trusted by leading healthcare institutions worldwide. Find a partner clinic near you and experience the future of medical identity management.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search clinics or locations...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* CLINICS GRID */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((clinic, i) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{clinic.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{clinic.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    {clinic.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    {clinic.phone}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    {clinic.doctors} {t('doctors')}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    {clinic.patients.toLocaleString()} {t('patients')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('No clinics found matching your search.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* BECOME A PARTNER */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Become a')}{' '}
                <span className="text-primary">{t('Partner')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('Join our growing network of clinics, hospitals, and healthcare providers. Integrate MED-ID into your practice and offer your patients the gold standard in medical identity management.')}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t('Seamless integration with existing EHR systems'),
                  t('Dedicated account manager and support team'),
                  t('Marketing materials and patient education resources'),
                  t('Priority access to new features and updates'),
                  t('Volume-based pricing for healthcare networks'),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                {t('Become a Partner')} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-gradient-to-br from-secondary/20 via-primary/10 to-secondary/20 flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-xl">
                <div className="text-center p-8">
                  <Handshake className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{t('Join 3,200+ Partners')}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('Grow with MED-ID')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
