'use client';

import { motion } from 'framer-motion';
import {
  Smartphone, Monitor, CheckCircle,
  Apple, QrCode, Shield, Star, Download,
} from 'lucide-react';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const features = [
  { icon: <Shield className="w-5 h-5" />, title: t('Biometric Login'), desc: t('Face ID and fingerprint authentication') },
  { icon: <Smartphone className="w-5 h-5" />, title: t('Offline Access'), desc: t('Critical data available without internet') },
  { icon: <Star className="w-5 h-5" />, title: t('Family Accounts'), desc: t('Manage whole family under one profile') },
  { icon: <QrCode className="w-5 h-5" />, title: t('QR Sharing'), desc: t('Instant medical data sharing') },
];

export default function DownloadPage() {
  return (
    <div className="pt-20 bg-bg-main dark:bg-[#0F0F15]">
      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('Download')}{' '}
                <span className="text-primary">MED-ID</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                {t('Get the MED-ID app and secure your medical identity today. Available on iOS, Android, and coming soon to desktop.')}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg">
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-70">{t('Download on the')}</div>
                    <div className="text-sm -mt-0.5">{t('App Store')}</div>
                  </div>
                </button>
                <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 3.75c-.297 0-.583.11-.801.308a1.125 1.125 0 00-.342.924l1.416 8.204c.101.586.607 1.002 1.202 1.002h1.714a2.25 2.25 0 01-2.25 2.25H3a.75.75 0 000 1.5h.439a3.75 3.75 0 003.697-3h11.228a3.75 3.75 0 003.697 3h.439a.75.75 0 000-1.5h-.439a2.25 2.25 0 01-2.25-2.25h1.714c.595 0 1.101-.416 1.202-1.002l1.416-8.204a1.125 1.125 0 00-.342-.924A1.125 1.125 0 0022.5 3.75H1.5zm0 1.5h21l-1.354 7.848a.375.375 0 01-.371.312H3.225a.375.375 0 01-.371-.312L1.5 5.25zM6 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm12 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-70">{t('Get it on')}</div>
                    <div className="text-sm -mt-0.5">{t('Google Play')}</div>
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>4.8</span>
                </div>
                <span>·</span>
                <span>{t('1.2M+ Downloads')}</span>
                <span>·</span>
                <span>{t('Free')}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex items-center justify-center border border-gray-200/50 dark:border-white/10 shadow-xl">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-primary/40 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('Scan to Download')}</div>
                  <div className="text-xs text-gray-400 mt-1">{t('Available on iOS & Android')}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-secondary" /> {t('Secure')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-secondary" /> {t('Free')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-secondary" /> {t('HIPAA Compliant')}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AVAILABLE ON ALL PLATFORMS */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Available on')}{' '}
              <span className="text-primary">{t('All Platforms')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('MED-ID works seamlessly across all your devices. Your medical identity travels with you.')}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Smartphone className="w-10 h-10" />,
                title: t('iPhone & iPad'),
                desc: t('iOS 15.0 or later. Optimized for iPhone 14 Pro and newer. Full Face ID integration.'),
                badge: t('App Store'),
              },
              {
                icon: <Smartphone className="w-10 h-10" />,
                title: t('Android Phones'),
                desc: t('Android 8.0 or later. Optimized for Samsung, Pixel, and all major Android devices.'),
                badge: t('Google Play'),
              },
              {
                icon: <Monitor className="w-10 h-10" />,
                title: t('Web Dashboard'),
                desc: t('Access your MED-ID profile from any browser. Full functionality on desktop and tablet.'),
                badge: t('Coming Soon'),
              },
            ].map((platform, i) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                  {platform.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{platform.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{platform.desc}</p>
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {platform.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APP FEATURES */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Everything in the')}{' '}
              <span className="text-primary">{t('App')}</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
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
              {t('Ready to Take Control of Your Medical Identity?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Download MED-ID today and join millions who trust us with their medical data.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                <Apple className="w-5 h-5" /> {t('App Store')}
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg">
                <Download className="w-5 h-5" /> {t('Google Play')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
