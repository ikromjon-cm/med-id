'use client';

import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/lib/i18n';

const adminPaths = ['/dashboard', '/clinics', '/clinic', '/doctors', '/doctor', '/users', '/access-logs', '/analytics', '/settings', '/notifications', '/emergency', '/login'];

export default function PublicFooter() {
  const pathname = usePathname();
  const isAdmin = adminPaths.some(p => pathname.startsWith(p));

  if (isAdmin) return null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="MED-ID" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold">{t('MED-ID')}</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('Your Medical Identity, Secured by Biometrics. MED-ID provides instant, secure access to your medical history when it matters most.')}
            </p>
            <div className="flex gap-3 pt-2">
              {['Security', 'Privacy', 'HIPAA'].map(badge => (
                <span key={badge} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  {t(badge)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('Quick Links')}</h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t('About Us') },
                { href: '/features', label: t('Features') },
                { href: '/how-it-works', label: t('How It Works') },
                { href: '/security', label: t('Security') },
                { href: '/partners', label: t('Partners') },
                { href: '/blog', label: t('Blog') },
                { href: '/faq', label: t('FAQ') },
                { href: '/contact', label: t('Contact') },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('Legal')}</h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: t('Privacy Policy') },
                { href: '#', label: t('Terms of Service') },
                { href: '#', label: t('Cookie Policy') },
                { href: '#', label: t('HIPAA Compliance') },
                { href: '#', label: t('GDPR Compliance') },
                { href: '#', label: t('Data Processing') },
                { href: '#', label: t('EULA') },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('Contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-gray-400">{t('123 Healthcare Ave, Suite 200, San Francisco, CA 94105')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+18005551234" className="text-sm text-gray-400 hover:text-white transition-colors">+1 (800) 555-1234</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:hello@med-id.com" className="text-sm text-gray-400 hover:text-white transition-colors">hello@med-id.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white text-xs uppercase tracking-wider mb-3">{t('Download App')}</h4>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400">{t('App Store')}</span>
                <span className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400">{t('Google Play')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {t('MED-ID')}. {t('All rights reserved.')}
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">{t('Privacy')}</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">{t('Terms')}</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">{t('Cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
