'use client';

import { motion } from 'framer-motion';
import {
  UserPlus, Fingerprint, Share2, Shield, Smartphone,
  QrCode, Bell, CheckCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const steps = [
  {
    step: 1,
    icon: <UserPlus className="w-8 h-8" />,
    title: t('Create Your Profile'),
    subtitle: t('Set up in under 5 minutes'),
    desc: t('Download the MED-ID app and create your medical profile. Add your personal information, medical history, allergies, medications, and emergency contacts. Everything is encrypted from the moment you type it.'),
    details: [
      t('Download from App Store or Google Play'),
      t('Create account with email and phone'),
      t('Fill in your medical information'),
      t('Add emergency contacts'),
      t('Upload medical documents (optional)'),
    ],
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    step: 2,
    icon: <Fingerprint className="w-8 h-8" />,
    title: t('Secure with Biometrics'),
    subtitle: t('Your identity, your fingerprint'),
    desc: t('Link your biometric data — fingerprint or facial recognition — to your MED-ID profile. This ensures that only you can access your medical information. Your biometric data never leaves your device.'),
    details: [
      t('Enable fingerprint or Face ID'),
      t('Biometric data stored locally on device'),
      t('End-to-end encryption activated'),
      t('Set recovery options'),
      t('Emergency PIN backup (optional)'),
    ],
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    step: 3,
    icon: <Share2 className="w-8 h-8" />,
    title: t('Share Instantly'),
    subtitle: t('Your data, your control'),
    desc: t('Share your MED-ID with healthcare providers via QR code. In emergencies, first responders can scan your code to access critical information instantly. You control exactly what is shared and when.'),
    details: [
      t('Generate your unique MED-ID QR code'),
      t('Share with clinics and hospitals'),
      t('Emergency access for first responders'),
      t('Real-time access notifications'),
      t('Full audit trail of all accesses'),
    ],
    gradient: 'from-primary/20 to-secondary/5',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-20 bg-bg-main dark:bg-[#0F0F15]">
      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('How')}{' '}
              <span className="text-primary">MED-ID</span> {t('Works')}
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('Three simple steps to secure your medical identity. Get started in minutes and gain peace of mind knowing your medical information is always available when needed.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STEPS */}
      {steps.map((step, i) => (
        <section
          key={step.step}
          className={`py-16 lg:py-20 ${i % 2 === 1 ? 'bg-white/50 dark:bg-white/[0.02]' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={i % 2 === 1 ? 'lg:order-2' : ''}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium mb-4">
                  {t('Step')} {step.step} {t('of')} 3
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-primary mb-6">
                  {step.icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h2>
                <p className="text-primary font-medium text-sm mb-4">{step.subtitle}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{step.desc}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, j) => (
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
                className={`flex justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div className={`w-72 h-80 sm:w-80 sm:h-96 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-xl`}>
                  <div className="text-center p-8">
                    <div className="text-6xl font-bold text-primary/20 mb-2">0{step.step}</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</div>
                    <div className="mt-4 space-y-2">
                      <Smartphone className="w-8 h-8 text-primary/40 mx-auto" />
                      <Shield className="w-8 h-8 text-secondary/40 mx-auto" />
                      <QrCode className="w-8 h-8 text-primary/40 mx-auto" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* BENEFITS */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Why Choose')} <span className="text-primary">MED-ID</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('Benefits that make a difference in your healthcare journey.')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: t('Military-Grade Encryption'), desc: t('Your data is protected with AES-256 encryption, the same standard used by financial institutions.') },
              { icon: <Bell className="w-6 h-6" />, title: t('Real-Time Monitoring'), desc: t('Instant notifications whenever your medical profile is accessed, with full activity logs.') },
              { icon: <QrCode className="w-6 h-6" />, title: t('QR Code Access'), desc: t('Simple QR-based sharing system that works with any smartphone. No special equipment needed.') },
              { icon: <Fingerprint className="w-6 h-6" />, title: t('Biometric Security'), desc: t('Your fingerprint or face is your password. Biometric data never leaves your device.') },
              { icon: <Share2 className="w-6 h-6" />, title: t('Controlled Sharing'), desc: t('You decide exactly what information to share and with whom, with time-limited access.') },
              { icon: <UserPlus className="w-6 h-6" />, title: t('Family Management'), desc: t('Manage medical profiles for your entire family under one secure account.') },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{b.desc}</p>
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
              {t('Ready to Secure Your Medical Identity?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Join 1.2 million+ users who trust MED-ID. Get started in under 5 minutes.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                {t('Get Started Now')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all"
              >
                {t('View FAQ')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
