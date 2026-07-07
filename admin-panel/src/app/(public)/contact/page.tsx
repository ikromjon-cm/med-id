'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, CheckCircle, AlertCircle,
  MessageSquare, Clock,
} from 'lucide-react';
import { submitContactForm } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = t('Name is required');
    if (!form.email.trim()) errs.email = t('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('Invalid email address');
    if (!form.subject.trim()) errs.subject = t('Subject is required');
    if (!form.message.trim()) errs.message = t('Message is required');
    else if (form.message.trim().length < 10) errs.message = t('Message must be at least 10 characters');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await submitContactForm(form);
      setSubmitted(true);
    } catch {
      setErrors({ message: t('Failed to send message. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('Get in')}{' '}
              <span className="text-primary">{t('Touch')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t("Have a question, suggestion, or want to become a partner? We'd love to hear from you. Our team typically responds within 24 hours.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-8 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* FORM */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('Message Sent!')}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('Thank you for reaching out. Our team will get back to you within 24 hours.')}
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all"
                  >
                    {t('Send Another Message')}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card rounded-2xl p-6 sm:p-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('Send Us a Message')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Full Name')}</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="John Doe"
                          className={cn(
                            'w-full px-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-white/5 border outline-none transition-all',
                            errors.name
                              ? 'border-emergency focus:ring-2 focus:ring-emergency/20'
                              : 'border-gray-200 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                          )}
                        />
                        {errors.name && <p className="text-xs text-emergency mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Email Address')}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="john@example.com"
                          className={cn(
                            'w-full px-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-white/5 border outline-none transition-all',
                            errors.email
                              ? 'border-emergency focus:ring-2 focus:ring-emergency/20'
                              : 'border-gray-200 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                          )}
                        />
                        {errors.email && <p className="text-xs text-emergency mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Subject')}</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        placeholder="How can we help you?"
                        className={cn(
                          'w-full px-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-white/5 border outline-none transition-all',
                          errors.subject
                            ? 'border-emergency focus:ring-2 focus:ring-emergency/20'
                            : 'border-gray-200 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        )}
                      />
                      {errors.subject && <p className="text-xs text-emergency mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Message')}</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Tell us more about your inquiry..."
                        className={cn(
                          'w-full px-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-white/5 border outline-none resize-none transition-all',
                          errors.message
                            ? 'border-emergency focus:ring-2 focus:ring-emergency/20'
                            : 'border-gray-200 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        )}
                      />
                      {errors.message && <p className="text-xs text-emergency mt-1">{errors.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> {t('Send Message')}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  icon: <Mail className="w-5 h-5" />,
                  title: t('Email Us'),
                  content: 'hello@med-id.com',
                  sub: t('We respond within 24 hours'),
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  title: t('Call Us'),
                  content: '+1 (800) 555-1234',
                  sub: t('Mon-Fri, 9AM-6PM EST'),
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  title: t('Visit Us'),
                  content: '123 Healthcare Ave, Suite 200',
                  sub: 'San Francisco, CA 94105',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('Response Time')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('General Inquiries')}</span>
                    <span className="text-gray-900 dark:text-white font-medium">&lt; 4 {t('hours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Technical Support')}</span>
                    <span className="text-gray-900 dark:text-white font-medium">&lt; 2 {t('hours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Emergency Issues')}</span>
                    <span className="text-emergency font-medium">&lt; 30 {t('minutes')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('Partnership')}</span>
                    <span className="text-gray-900 dark:text-white font-medium">&lt; 24 {t('hours')}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
