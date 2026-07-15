'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Calendar, Clock, Tag, User, Share2,
  ChevronRight, FileText,
} from 'lucide-react';
import Link from 'next/link';
import { getBlogPost, getBlogPosts } from '@/lib/mockData';
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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    getBlogPost(id).then(p => {
      setPost(p || null);
      setLoading(false);
    });
    getBlogPosts().then(all => {
      setRelated(all.filter(p => p.id !== id).slice(0, 3));
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-bg-main  flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-bg-main  flex flex-col items-center justify-center gap-4">
        <FileText className="w-16 h-16 text-gray-300 " />
        <h1 className="text-2xl font-bold text-gray-900 ">{t('Post Not Found')}</h1>
        <p className="text-gray-500 ">{t("The blog post you're looking for doesn't exist.")}</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> {t('Back to Blog')}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-bg-main ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {t('Back to Blog')}
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* MAIN CONTENT */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-full h-56 sm:h-72 lg:h-80 rounded-2xl bg-gradient-to-br ${gradients[post.category] || 'from-primary/10 to-primary/5'} flex items-center justify-center mb-8`}>
                <FileText className="w-20 h-20 text-gray-400/30" />
              </div>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" /> {post.date}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" /> {post.readTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900  leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 pb-6 mb-8 border-b border-gray-100 ">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900  text-sm">{post.author}</div>
                  <div className="text-xs text-gray-400">{t('Author')}</div>
                </div>
              </div>

              <div className="prose prose-gray  max-w-none">
                <p className="text-lg text-gray-700  leading-relaxed mb-6 font-medium">
                  {post.excerpt}
                </p>
                <div className="text-gray-600  leading-relaxed space-y-4">
                  <p>{post.content}</p>
                  <p>
                    Biometric authentication is rapidly becoming the gold standard for secure access control in healthcare systems worldwide. 
                    Unlike passwords or PINs that can be stolen, shared, or forgotten, biometric identifiers are intrinsically tied to the individual, 
                    providing a level of security that is both more convenient and substantially more robust.
                  </p>
                  <p>
                    The MED-ID platform leverages cutting-edge biometric technology including fingerprint scanning, 
                    facial recognition, and voice authentication to create a multi-layered security framework. 
                    Each biometric factor adds an additional barrier against unauthorized access while maintaining 
                    the speed and ease of use that medical professionals require in time-sensitive situations.
                  </p>
                  <p>
                    As we look to the future, the integration of behavioral biometrics and continuous authentication 
                    will further enhance security without disrupting clinical workflows. These advancements will 
                    make medical identity theft virtually impossible while ensuring that patients receive the right 
                    care from authorized providers every time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-10 pt-6 border-t border-gray-100 ">
                <span className="text-sm text-gray-500 ">{t('Share this article:')}</span>
                {['Twitter', 'LinkedIn', 'Facebook', 'Copy Link'].map(platform => (
                  <button
                    key={platform}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs text-gray-600  hover:bg-gray-100  transition-colors"
                  >
                    <Share2 className="w-3 h-3" /> {platform}
                  </button>
                ))}
              </div>
            </motion.div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900  mb-4">{t('About the Author')}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900  text-sm">{post.author}</div>
                    <div className="text-xs text-gray-400">{t('MED-ID Content Team')}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500  leading-relaxed">
                  {t('Writing about the intersection of healthcare technology, data security, and patient-centered innovation.')}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900  mb-4">{t('Related Articles')}</h3>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.id}`}
                      className="flex gap-3 group"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[r.category] || 'from-primary/10 to-primary/5'} flex items-center justify-center shrink-0`}>
                        <FileText className="w-5 h-5 text-gray-400/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-primary font-medium">{r.category}</div>
                        <div className="text-sm font-medium text-gray-900  group-hover:text-primary transition-colors line-clamp-2">
                          {r.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{r.date}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900  mb-2">{t('Get MED-ID')}</h3>
                <p className="text-sm text-gray-500  mb-4">
                  {t('Secure your medical identity today.')}
                </p>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  {t('Download Now')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
