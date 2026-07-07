'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

const navLinks = [
  { href: '/', label: t('Home') },
  { href: '/about', label: t('About') },
  { href: '/features', label: t('Features') },
  { href: '/security', label: t('Security') },
  { href: '/partners', label: t('Partners') },
  { href: '/blog', label: t('Blog') },
  { href: '/faq', label: t('FAQ') },
  { href: '/contact', label: t('Contact') },
  { href: '/download', label: t('Download') },
];

const adminPaths = ['/dashboard', '/clinics', '/clinic', '/doctors', '/doctor', '/users', '/access-logs', '/analytics', '/settings', '/notifications', '/emergency', '/login'];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = adminPaths.some(p => pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="MED-ID" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold tracking-tight text-primary">{t('MED-ID')}</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/25"
              >
                <LogIn className="w-4 h-4" />
                {t('Login')}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 lg:top-20 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
            <div className="relative glass border-t border-gray-200/50 dark:border-white/10 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 mt-3 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  {t('Login')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
