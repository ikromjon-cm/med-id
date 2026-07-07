'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Lock, Fingerprint, Eye, Server, Key, CheckCircle,
  ArrowRight, FileCheck, AlertTriangle, Database, Globe,
  ChevronDown, Search,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getFAQItems } from '@/lib/mockData';
import type { FAQItem } from '@/lib/types';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const securityFeatures = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: t('End-to-End Encryption'),
    desc: t('All medical data is encrypted using AES-256 both in transit and at rest. Your information is scrambled into unreadable code that can only be decrypted by authorized parties with the correct keys.'),
  },
  {
    icon: <Fingerprint className="w-6 h-6" />,
    title: t('Biometric Authentication'),
    desc: t('Your fingerprint and facial recognition data never leave your device. MED-ID uses your phone\'s secure enclave to process biometric verification locally, ensuring your unique biometric markers remain private.'),
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: t('Zero-Knowledge Architecture'),
    desc: t('MED-ID operates on a zero-knowledge principle. We cannot access or view your medical data. Only you and authorized healthcare providers can decrypt and view your information.'),
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: t('Complete Audit Trail'),
    desc: t('Every access to your medical profile is logged with timestamp, location, and staff ID. You receive instant notifications and can review the complete access history at any time.'),
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: t('Secure Cloud Storage'),
    desc: t('Your data is stored across redundant, geographically distributed data centers with multiple layers of physical and digital security. Regular security audits ensure compliance.'),
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: t('Access Control'),
    desc: t('You have granular control over who can access your data and what they can see. Set permissions, time limits, and revoke access at any time. Emergency access has automatic safeguards.'),
  },
];

const standards = [
  { name: 'HIPAA', full: t('Health Insurance Portability and Accountability Act'), desc: t('Full compliance with US healthcare privacy and security standards for protecting patient medical information.') },
  { name: 'GDPR', full: t('General Data Protection Regulation'), desc: t('Compliance with EU data protection requirements ensuring user rights over personal data.') },
  { name: 'SOC 2', full: t('System and Organization Controls 2'), desc: t('Audited for security, availability, processing integrity, confidentiality, and privacy.') },
  { name: 'ISO 27001', full: t('Information Security Management'), desc: t('International standard for information security management systems and practices.') },
  { name: 'AES-256', full: t('Advanced Encryption Standard 256-bit'), desc: t('Military-grade encryption standard used by governments and financial institutions worldwide.') },
  { name: 'TLS 1.3', full: t('Transport Layer Security 1.3'), desc: t('Latest protocol for encrypted communications between devices and servers.') },
];

export default function SecurityPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getFAQItems().then(items => setFaqItems(items.filter(i => i.category === 'Security')));
  }, []);

  const filteredFaq = faqItems.filter(
    item => item.question.toLowerCase().includes(search.toLowerCase()) ||
            item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-bg-main dark:bg-[#0F0F15]">
      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> {t('Enterprise-Grade Security')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('Your Security Is Our')}{' '}
              <span className="text-primary">{t('Top Priority')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('We employ the highest standards of data protection, encryption, and security practices to ensure your medical information remains private, secure, and under your control.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECURITY FEATURES */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('How We Protect')}{' '}
              <span className="text-primary">{t('Your Data')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('Multiple layers of security working together to keep your medical information safe.')}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE BADGES */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Certifications &')}{' '}
              <span className="text-primary">{t('Compliance')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('We meet and exceed global healthcare data protection standards.')}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{s.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.full}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENCRYPTION EXPLANATION */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Military-Grade')}{' '}
                <span className="text-primary">{t('Encryption')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('MED-ID uses AES-256 encryption, the same standard trusted by banks, governments, and military organizations worldwide. Your medical data is encrypted before it leaves your device and remains encrypted until you or an authorized healthcare provider accesses it.')}
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Lock className="w-5 h-5" />, title: t('Encryption in Transit'), desc: t('All data transmitted between your device and our servers is protected by TLS 1.3') },
                  { icon: <Server className="w-5 h-5" />, title: t('Encryption at Rest'), desc: t('Data stored on our servers is encrypted with AES-256 with separate key management') },
                  { icon: <Key className="w-5 h-5" />, title: t('End-to-End Encryption'), desc: t('Only you and explicitly authorized parties can decrypt your medical information') },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/80 dark:bg-white/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('AES-256 Encrypted')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('Military-grade protection')}</div>
                  <div className="mt-4 flex justify-center gap-3">
                    <Globe className="w-5 h-5 text-primary/40" />
                    <Lock className="w-5 h-5 text-secondary/40" />
                    <Shield className="w-5 h-5 text-primary/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECURITY FAQ */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Security')}{' '}
              <span className="text-primary">{t('FAQs')}</span>
            </h2>
          </motion.div>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search security questions...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-3">
            {filteredFaq.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200',
                      openFaq === item.id && 'rotate-180'
                    )}
                  />
                </button>
                <div className={cn(
                  'overflow-hidden transition-all duration-300',
                  openFaq === item.id ? 'max-h-96' : 'max-h-0'
                )}>
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Ready to Experience True Security?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Your medical data deserves the best protection. Get started with MED-ID today.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                {t('Get Started Free')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all"
              >
                {t('Contact Security Team')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
