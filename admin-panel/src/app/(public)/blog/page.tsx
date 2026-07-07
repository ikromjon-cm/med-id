'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ArrowRight, Calendar, Clock, Search, Tag,
} from 'lucide-react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/mockData';
import type { BlogPost } from '@/lib/types';
import { t } from '@/lib/i18n';

const gradients: Record<string, string> = {
  Technology: 'from-blue-400/20 to-purple-400/20',
  'Emergency Care': 'from-emergency/20 to-orange-400/20',
  Product: 'from-secondary/20 to-teal-400/20',
  Security: 'from-primary/20 to-indigo-400/20',
  Features: 'from-purple-400/20 to-pink-400/20',
  Partners: 'from-secondary/20 to-green-400/20',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(t('All'));

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  const categories = [t('All'), ...new Set(posts.map(p => p.category))];
  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                       p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === t('All') || p.category === category;
    return matchSearch && matchCat;
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              MED-ID{' '}
              <span className="text-primary">{t('Blog')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('Insights, updates, and stories from the intersection of healthcare, technology, and medical identity management.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search articles...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'glass text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('No articles found.')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="block glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full"
                  >
                    <div className={`h-44 bg-gradient-to-br ${gradients[post.category] || 'from-primary/10 to-primary/5'} flex items-center justify-center`}>
                      <FileText className="w-12 h-12 text-gray-400/30" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          <Tag className="w-3 h-3" /> {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                        {t('Read More')} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
