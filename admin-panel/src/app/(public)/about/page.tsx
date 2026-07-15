'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Eye, Heart, Users, Shield, Sparkles, Quote,
  CheckCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { getSiteStats } from '@/lib/mockData';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const timeline = [
  { year: '2023 Q1', title: t('The Idea'), desc: t('MED-ID was conceived by a team of healthcare professionals and security experts who recognized the critical need for instant medical data access in emergencies.') },
  { year: '2023 Q3', title: t('MVP Launch'), desc: t('Beta version launched with 5 partner clinics, featuring biometric authentication and basic medical profile management.') },
  { year: '2024 Q1', title: t('Emergency Access'), desc: t('Revolutionary emergency QR access system launched, allowing first responders to access critical patient data instantly.') },
  { year: '2024 Q3', title: t('Global Expansion'), desc: t('Expanded to 15 countries. HIPAA and GDPR compliance achieved. Partner network grew to 500+ clinics.') },
  { year: '2025 Q1', title: t('OneID Platform'), desc: t('Universal MED-ID OneID launched, enabling seamless medical identity across all healthcare providers worldwide.') },
  { year: '2025 Q3', title: t('AI Integration'), desc: t('AI-powered health insights and predictive analytics added. Emergency response time reduced by 60%.') },
  { year: '2026', title: t('Today'), desc: t('3,200+ clinics, 8,600+ doctors, 1.2M+ users across 45+ countries. Continuously innovating for better healthcare.') },
];

const values = [
  { icon: <Shield className="w-6 h-6" />, title: t('Security First'), desc: t('Every decision prioritizes patient data security and privacy above all else.') },
  { icon: <Heart className="w-6 h-6" />, title: t('Patient-Centric'), desc: t('We design every feature around the needs and well-being of patients.') },
  { icon: <Users className="w-6 h-6" />, title: t('Universal Access'), desc: t('Healthcare should be accessible to everyone, everywhere, regardless of circumstances.') },
  { icon: <Sparkles className="w-6 h-6" />, title: t('Continuous Innovation'), desc: t('We relentlessly push boundaries to make healthcare smarter and safer.') },
];

export default function AboutPage() {
  const [, setStats] = useState({ totalUsers: 0, activeDoctors: 0, partnerClinics: 0, countriesReached: 0 });
  const [counts, setCounts] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSiteStats().then(s => {
      setStats(s);
      const keys = ['totalUsers', 'activeDoctors', 'partnerClinics', 'countriesReached'];
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            keys.forEach(key => {
              const target = (s as Record<string, number>)[key];
              const steps = 60;
              const increment = target / steps;
              let step = 0;
              const timer = setInterval(() => {
                step++;
                if (step >= steps) {
                  clearInterval(timer);
                  setCounts(prev => ({ ...prev, [key]: target }));
                } else {
                  setCounts(prev => ({ ...prev, [key]: Math.round(step * increment) }));
                }
              }, 20);
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

  const fmt = (key: string, val: number) => {
    if (key === 'totalUsers') return `${(val / 1000000).toFixed(1)}M+`;
    if (key === 'activeDoctors') return `${(val / 1000).toFixed(1)}K+`;
    if (key === 'partnerClinics') return `${(val / 1000).toFixed(1)}+`;
    if (key === 'countriesReached') return `${val}+`;
    return val;
  };

  return (
    <div className="pt-20 bg-bg-main ">
      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6">
              <Quote className="w-4 h-4" /> {t('Our Story')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900  leading-tight">
              {t('Transforming Healthcare Through')}{' '}
              <span className="text-primary">{t('Medical Identity')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600  max-w-2xl mx-auto leading-relaxed">
              {t("MED-ID was born from a simple yet powerful idea: no one should ever be denied timely medical care because their medical history is inaccessible. We are building a world where your complete medical identity is always available, always secure, and always under your control.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 bg-white/50 .02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="glass-card rounded-2xl p-8">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-900  mb-3">{t('Our Mission')}</h2>
              <p className="text-gray-600  leading-relaxed">
              {t('To empower every individual with a secure, universal medical identity that ensures the right care at the right time — anywhere in the world. We believe that access to medical information should never be a barrier to receiving quality healthcare.')}
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="glass-card rounded-2xl p-8" transition={{ duration: 0.5, delay: 0.1 }}>
              <Eye className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-900  mb-3">{t('Our Vision')}</h2>
              <p className="text-gray-600  leading-relaxed">
              {t('A world where every healthcare provider has instant, secure access to patient medical histories, eliminating misdiagnosis, reducing medical errors, and saving lives through informed emergency care — all powered by a unified medical identity system.')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS COUNTER */}
      <section ref={statsRef} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'totalUsers', label: t('Users'), suffix: '' },
              { key: 'activeDoctors', label: t('Doctors'), suffix: '' },
              { key: 'partnerClinics', label: t('Clinics'), suffix: '' },
              { key: 'countriesReached', label: t('Countries'), suffix: '' },
            ].map(stat => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {counts[stat.key] !== undefined ? fmt(stat.key, counts[stat.key]) : '0'}
                </div>
                <div className="text-sm text-gray-500 ">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 lg:py-20 bg-white/50 .02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 ">
              {t('Our')} <span className="text-primary">{t('Core Values')}</span>
            </h2>
            <p className="mt-4 text-gray-600 ">{t('The principles that guide every decision we make.')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900  mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 ">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 ">
              {t('Our')} <span className="text-primary">{t('Journey')}</span>
            </h2>
            <p className="mt-4 text-gray-600 ">{t('From a bold idea to a global healthcare platform.')}</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary md:-translate-x-px" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-10 md:mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:flex w-1/2 items-center">
                  <div className={i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 w-full'}>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.year}</span>
                    <h3 className="text-lg font-semibold text-gray-900  mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-600  mt-1">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary border-4 border-white  shadow z-10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="md:hidden flex-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.year}</span>
                  <h3 className="text-lg font-semibold text-gray-900  mt-1">{item.title}</h3>
                  <p className="text-sm text-gray-600  mt-1">{item.desc}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900  mb-4">
              {t('Be Part of Our Story')}
            </h2>
            <p className="text-lg text-gray-600  mb-8">
              {t('Join us in building the future of medical identity management.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                {t('Contact Us')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-700  font-semibold rounded-xl hover:bg-white/50  transition-all"
              >
                {t('Get Started')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
