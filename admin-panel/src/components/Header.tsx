'use client';

import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon } from 'lucide-react';
import { t } from '@/lib/i18n';
import { useTheme } from './ThemeProvider';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/admin/dashboard': t('Dashboard'),
  '/admin/users': t('Users Management'),
  '/admin/doctors': t('Doctors Management'),
  '/admin/clinics': t('Clinics Management'),
  '/admin/doctor': t('Doctors'),
  '/admin/clinic': t('Clinics'),
  '/admin/analytics': t('Analytics'),
  '/admin/access-logs': t('Access Logs'),
  '/admin/notifications': t('Notifications'),
  '/admin/settings': t('Settings'),
  '/admin/emergency': t('Emergency Management'),
};

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const title = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || 'Dashboard';

  return (
    <header className="sticky top-0 z-20 glass-card rounded-none border-b border-gray-200/50 ">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500  hover:bg-gray-100  hover:text-gray-700  transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 ">{title}</h1>
            <p className="text-xs text-gray-500  hidden sm:block">
              {t('MED-ID Biometric Medical Platform')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500  hover:bg-gray-100  hover:text-gray-700  transition-all"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
