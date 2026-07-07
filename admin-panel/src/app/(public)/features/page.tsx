'use client';

import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Fingerprint, FileText, Bell, Wifi,
  CheckCircle, ArrowRight, Sparkles, Lock, Eye, Share2,
} from 'lucide-react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};


const pageFeatures = [
  {
    title: t('Biometric Security'),
    desc: t('Advanced biometric authentication ensures that only you can access your medical profile. Using fingerprint and facial recognition technology, MED-ID provides security that passwords simply cannot match.'),
    gradient: 'from-primary/20 to-primary/5',
    icon: <Shield className="w-6 h-6" />,
    details: [
      t('Fingerprint and facial recognition authentication'),
      t('Biometric data stored in secure device enclave'),
      t('Anti-spoofing technology prevents unauthorized access'),
      t('Multi-factor authentication option'),
      t('Instant verification under 0.5 seconds'),
    ],
  },
  {
    title: t('Emergency Access'),
    desc: t('When every second counts, MED-ID provides emergency responders with instant access to your critical medical information through a simple QR code scan.'),
    gradient: 'from-emergency/20 to-emergency/5',
    icon: <AlertTriangle className="w-6 h-6" />,
    details: [
      t('One QR scan grants access to critical medical data'),
      t('First responders get blood type, allergies, medications instantly'),
      t('Time-limited emergency access with automatic revocation'),
      t('Real-time SMS and push notification to patient'),
      t('Complete audit trail with timestamp and staff ID'),
    ],
  },
  {
    title: t('Universal Medical ID'),
    desc: t('Your MED-ID works everywhere. One identity that connects you with healthcare providers across clinics, hospitals, and countries.'),
    gradient: 'from-secondary/20 to-secondary/5',
    icon: <Fingerprint className="w-6 h-6" />,
    details: [
      t('Universal medical ID works across all providers'),
      t('No need to fill forms at every new clinic'),
      t('Recognized in 45+ countries worldwide'),
      t('Seamless integration with existing systems'),
      t('OneID technology for consistent identity verification'),
    ],
  },
  {
    title: t('Digital Records'),
    desc: t('Store, organize, and share your medical documents securely. From lab reports to prescriptions, everything is encrypted and accessible when you need it.'),
    gradient: 'from-primary/20 to-primary/5',
    icon: <FileText className="w-6 h-6" />,
    details: [
      t('Secure storage for lab reports and prescriptions'),
      t('Organized document management with categories'),
      t('Share specific documents with providers'),
      t('Cloud backup with end-to-end encryption'),
      t('Access history from any device'),
    ],
  },
  {
    title: t('Real-time Notifications'),
    desc: t('Stay informed with instant alerts about your medical profile activity, emergency access, health reminders, and more.'),
    gradient: 'from-secondary/20 to-secondary/5',
    icon: <Bell className="w-6 h-6" />,
    details: [
      t('Instant alerts when profile is accessed'),
      t('Emergency access notifications with location'),
      t('Daily health reminders and medication alerts'),
      t('Appointment and follow-up notifications'),
      t('Family account activity monitoring'),
    ],
  },
  {
    title: t('Offline Access'),
    desc: t('Critical medical information is always available, even without an internet connection. Perfect for remote areas or situations with limited connectivity.'),
    gradient: 'from-primary/20 to-primary/5',
    icon: <Wifi className="w-6 h-6" />,
    details: [
      t('Critical medical data cached on device'),
      t('Access blood type and allergies offline'),
      t('Auto-syncs when connection restored'),
      t('QR code generation works offline'),
      t('Available even in remote areas'),
    ],
  },
];

export default function FeaturesPage() {
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
              <Sparkles className="w-4 h-4" /> {t('All Features')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('Powerful Features for')}{' '}
              <span className="text-primary">{t('Better Healthcare')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('Discover how MED-ID transforms medical identity management with cutting-edge technology designed to protect, inform, and empower.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      {pageFeatures.map((f, i) => (
        <section
          key={f.title}
          className={`py-16 lg:py-20 ${i % 2 === 1 ? 'bg-white/50 dark:bg-white/[0.02]' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-primary mb-5">
                  {f.icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{f.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{f.desc}</p>
                <ul className="space-y-3">
                  {f.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <div className={`w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-gradient-to-br ${f.gradient} flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-xl`}>
                  <div className="text-center p-8">
                    <div className="text-6xl opacity-20 mb-4">
                      {f.icon}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</div>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <Shield className="w-5 h-5 text-primary/40" />
                      <Lock className="w-5 h-5 text-secondary/40" />
                      <Eye className="w-5 h-5 text-primary/40" />
                      <Share2 className="w-5 h-5 text-secondary/40" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Experience the Power of MED-ID')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Join millions who already trust MED-ID with their medical identity.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                {t('Get Started Free')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all"
              >
                {t('Learn About Security')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
