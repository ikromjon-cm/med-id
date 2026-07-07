'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle, Search, ChevronDown, MessageCircle,
  Shield, AlertTriangle, FileText,
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

const categoryIcons: Record<string, React.ReactNode> = {
  General: <HelpCircle className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  Emergency: <AlertTriangle className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  General: 'bg-primary/10 text-primary border-primary/10',
  Security: 'bg-secondary/10 text-secondary border-secondary/10',
  Emergency: 'bg-emergency/10 text-emergency border-emergency/10',
};

export default function FAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(t('All'));
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    getFAQItems().then(setItems);
  }, []);

  const categories = [t('All'), ...new Set(items.map(i => i.category))];
  const filtered = items.filter(item => {
    const matchCat = activeCat === t('All') || item.category === activeCat;
    const matchSearch = item.question.toLowerCase().includes(search.toLowerCase()) ||
                        item.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
              <HelpCircle className="w-4 h-4" /> {t('FAQ')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('Frequently Asked')}{' '}
              <span className="text-primary">{t('Questions')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t("Everything you need to know about MED-ID. Can't find what you're looking for? Feel free to contact our support team.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & CATEGORIES */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search questions...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  activeCat === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'glass text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'
                )}
              >
                {cat !== t('All') && categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-8 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('No questions found.')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        categoryColors[item.category] || 'bg-gray-100 text-gray-500'
                      )}>
                        {categoryIcons[item.category] || <FileText className="w-4 h-4" />}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200',
                        openId === item.id && 'rotate-180'
                      )}
                    />
                  </button>
                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    openId === item.id ? 'max-h-96' : 'max-h-0'
                  )}>
                    <div className="px-5 pb-5 pl-16 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Still Have Questions?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('Our support team is ready to help you with any questions you may have.')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
            >
              {t('Contact Support')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
