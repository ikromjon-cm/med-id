'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Fingerprint, FileText, Bell, Wifi,
  ArrowRight, Play, Star, ChevronLeft, ChevronRight,
  Smartphone, QrCode, ScanLine, HeartPulse, Users,
  Stethoscope, Building2, Ambulance, FileSpreadsheet, Globe,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  getTestimonials, getPartners, getBlogPosts,
  getFeatures, getSiteStats,
} from '@/lib/mockData';
import type { Testimonial, Partner, BlogPost, Feature } from '@/lib/types';
import { t } from '@/lib/i18n';

const featureIcons: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  alert: <AlertTriangle className="w-6 h-6" />,
  id: <Fingerprint className="w-6 h-6" />,
  file: <FileText className="w-6 h-6" />,
  bell: <Bell className="w-6 h-6" />,
  wifi: <Wifi className="w-6 h-6" />,
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, staggerChildren: 0.1 },
};

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeDoctors: 0, partnerClinics: 0, emergencyAccesses: 0, documentsStored: 0, countriesReached: 0 });
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
    getPartners().then(setPartners);
    getBlogPosts().then(setBlogPosts);
    getFeatures().then(setFeatures);
    getSiteStats().then(s => {
      setStats(s);
      const keys = ['totalUsers', 'activeDoctors', 'partnerClinics', 'emergencyAccesses', 'documentsStored', 'countriesReached'];
      const initial: Record<string, number> = {};
      keys.forEach(k => { initial[k] = 0; });
      setCounts(initial);

      const durations: Record<string, number> = { totalUsers: 2000, activeDoctors: 1500, partnerClinics: 1500, emergencyAccesses: 1800, documentsStored: 2000, countriesReached: 1000 };
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            keys.forEach(key => {
              const target = (s as any)[key] as number;
              const duration = durations[key] || 1500;
              const steps = 60;
              const increment = target / steps;
              let current = 0;
              let step = 0;
              const timer = setInterval(() => {
                step++;
                current += increment;
                if (step >= steps) {
                  clearInterval(timer);
                  setCounts(prev => ({ ...prev, [key]: target }));
                } else {
                  setCounts(prev => ({ ...prev, [key]: Math.round(current) }));
                }
              }, duration / steps);
            });
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      if (statsRef.current) observer.observe(statsRef.current);
      return () => observer.disconnect();
    });
  }, []);

  const formatCount = (key: string, val: number) => {
    if (key === 'totalUsers') return `${(val / 1000000).toFixed(1)}M+`;
    if (key === 'activeDoctors') return `${(val / 1000).toFixed(1)}K+`;
    if (key === 'partnerClinics') return `${(val / 1000).toFixed(1)}K+`;
    if (key === 'emergencyAccesses') return `${(val / 1000).toFixed(1)}K+`;
    if (key === 'documentsStored') return `${(val / 1000000).toFixed(1)}M+`;
    if (key === 'countriesReached') return `${val}+`;
    return val;
  };

  return (
    <div className="bg-bg-main dark:bg-[#0F0F15]">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6"
              >
                <HeartPulse className="w-4 h-4" />
                {t('Trusted by 8,600+ Medical Professionals')}
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {t('Your Medical Identity,')}{' '}
                <span className="text-primary">{t('Secured by Biometrics')}</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                {t('MED-ID gives you instant, secure access to your complete medical history. One identity that works everywhere — from your local clinic to emergency rooms worldwide.')}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                >
                  {t('Get Started Free')} <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo-video"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all glass"
                >
                  <Play className="w-4 h-4" /> {t('Watch Demo')}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-72 h-[500px] sm:w-80 sm:h-[560px] rounded-[2.5rem] border-4 border-gray-800 dark:border-gray-600 bg-gradient-to-b from-primary/10 via-secondary/5 to-primary/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 dark:bg-gray-600 rounded-b-xl" />
                <div className="absolute top-8 left-4 right-4">
                  <div className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Fingerprint className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-white">{t('Biometric Auth')}</div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-1/2" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <ScanLine key={i} className="w-4 h-4 text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-4 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emergency/10 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-emergency" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800 dark:text-white">{t('Emergency Ready')}</div>
                        <div className="text-[10px] text-gray-500">{t('QR accessible')}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-4 right-4 glass rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-gray-800 dark:text-white">{t('Medical ID')}</div>
                    <QrCode className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {['A+', t('No allergies'), t('No meds')].map(label => (
                      <span key={label} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PLATFORM DEMO VIDEO */}
      <section id="demo-video" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("Platformani Demo Videosini Ko'ring")}
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {t('See how MED-ID works in 2 minutes')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="relative w-20 h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-emergency animate-pulse" />
                  {t('Demo')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATISTICS */}
      <section ref={statsRef} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { key: 'totalUsers', icon: <Users className="w-5 h-5" />, label: t('Users') },
              { key: 'activeDoctors', icon: <Stethoscope className="w-5 h-5" />, label: t('Doctors') },
              { key: 'partnerClinics', icon: <Building2 className="w-5 h-5" />, label: t('Clinics') },
              { key: 'emergencyAccesses', icon: <Ambulance className="w-5 h-5" />, label: t('Emergency Accesses') },
              { key: 'documentsStored', icon: <FileSpreadsheet className="w-5 h-5" />, label: t('Documents') },
              { key: 'countriesReached', icon: <Globe className="w-5 h-5" />, label: t('Countries') },
            ].map(stat => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl p-5 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {counts[stat.key] !== undefined ? formatCount(stat.key, counts[stat.key]) : '0'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Everything You Need for')}{' '}
              <span className="text-primary">{t('Medical Identity')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('Secure, fast, and universally accessible medical identity management.')}
            </p>
          </motion.div>
          <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <motion.div
                key={feature.id}
                variants={stagger}
                className="glass-card rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {featureIcons[feature.icon]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EMERGENCY ACCESS WORKFLOW */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/5 border border-emergency/10 text-emergency text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" /> {t('Emergency Protocol')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('How Emergency Access Works')}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('When every second counts, MED-ID provides instant access to critical medical information.')}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { step: 1, icon: <ScanLine className="w-6 h-6" />, title: t('QR Scan'), desc: t('First responder scans your MED-ID QR code from phone or wristband') },
              { step: 2, icon: <Shield className="w-6 h-6" />, title: t('Instant Access'), desc: t('Critical info - blood type, allergies, medications - unlocked instantly') },
              { step: 3, icon: <HeartPulse className="w-6 h-6" />, title: t('Emergency Treatment'), desc: t('Medical team provides informed care with complete patient history') },
              { step: 4, icon: <Bell className="w-6 h-6" />, title: t('Profile Update'), desc: t('You receive immediate notification of access with full audit trail') },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-emergency/10 flex items-center justify-center mx-auto mb-4 text-emergency">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emergency text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 text-primary/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE PREVIEW */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Your Medical Profile,')}{' '}
                <span className="text-primary">{t('Always in Your Pocket')}</span>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('Access your complete medical profile from your smartphone. Manage documents, share with healthcare providers, and stay in control of your health data.')}
              </p>
              <div className="mt-8 space-y-5">
                {[
                  { icon: <Fingerprint className="w-5 h-5" />, title: t('Biometric Login'), desc: t('Face ID and fingerprint authentication keep your data secure') },
                  { icon: <FileText className="w-5 h-5" />, title: t('Digital Records'), desc: t('All your medical documents organized in one secure place') },
                  { icon: <Bell className="w-5 h-5" />, title: t('Instant Alerts'), desc: t('Real-time notifications when your profile is accessed') },
                  { icon: <Wifi className="w-5 h-5" />, title: t('Works Offline'), desc: t('Critical medical info available even without internet') },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
              <div className="relative">
                <div className="w-64 h-[480px] sm:w-72 sm:h-[520px] rounded-[2.5rem] border-4 border-gray-300 dark:border-gray-600 bg-gradient-to-b from-primary/5 via-secondary/5 to-primary/5 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-300 dark:bg-gray-600 rounded-b-xl" />
                  <div className="absolute top-8 left-3 right-3 space-y-3">
                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20" />
                        <div className="text-[10px] font-semibold">{t('John Anderson')}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary">O+</span>
                        <span className="px-2 py-1 rounded bg-secondary/10 text-secondary">68 kg</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10">{t('Male')}</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10">180 cm</span>
                      </div>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <div className="text-[10px] font-semibold mb-2">{t('Documents')}</div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full w-full" />
                        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full w-3/4" />
                        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full w-5/6" />
                      </div>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <div className="text-[10px] font-semibold mb-2">{t('Emergency Contacts')}</div>
                      <div className="text-[10px] text-gray-500">{t('Mary Anderson - Spouse')}</div>
                      <div className="text-[10px] text-gray-500">{t('Robert Anderson - Brother')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Trusted by')}{' '}
              <span className="text-primary">{t('Healthcare Professionals')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('See what medical professionals and patients say about MED-ID.')}
            </p>
          </motion.div>
          {testimonials.length > 0 && (
            <div className="relative max-w-3xl mx-auto">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-2xl p-8 md:p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold flex items-center justify-center mx-auto mb-6">
                  {testimonials[testimonialIdx].avatar}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn('w-5 h-5', i < testimonials[testimonialIdx].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600')}
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                  &ldquo;{testimonials[testimonialIdx].content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonials[testimonialIdx].name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[testimonialIdx].role}</div>
                </div>
              </motion.div>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setTestimonialIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      i === testimonialIdx ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  />
                ))}
                <button
                  onClick={() => setTestimonialIdx(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 lg:py-20 bg-white/50 dark:bg-white/[0.02] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('Our')} <span className="text-primary">{t('Partner Network')}</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('Trusted by leading healthcare institutions worldwide.')}
            </p>
          </motion.div>
          <div className="relative">
            <div className="flex gap-8 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]" style={{ width: 'fit-content' }}>
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.id}-${i}`}
                  className="glass-card rounded-xl px-6 py-4 flex items-center gap-3 shrink-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {partner.logo.slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Ready to Get Started?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Join millions of users who trust MED-ID with their medical identity.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex glass rounded-xl p-1.5 max-w-md mx-auto sm:mx-0">
                <input
                  type="email"
                  placeholder={t('Enter your email')}
                  className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors shrink-0">
                  {t('Get Started Free')}
                </button>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <Smartphone className="w-4 h-4" /> {t('Download the App')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Latest from')}{' '}
                <span className="text-primary">{t('Our Blog')}</span>
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('Insights and updates from the MED-ID team.')}</p>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              {t('View All')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.id}`} className="block glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
                  <div className="h-40 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary/30" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 group-hover:gap-2 transition-all">
                      {t('Read More')} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t('View All Posts')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
