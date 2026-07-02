'use client';

import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users Management',
  '/clinics': 'Clinics Management',
  '/doctors': 'Doctors Management',
  '/analytics': 'Analytics',
  '/access-logs': 'Access Logs',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const title = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || 'Dashboard';

  return (
    <header className="sticky top-0 z-20 glass-card rounded-none border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              MED-ID Biometric Medical Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
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
