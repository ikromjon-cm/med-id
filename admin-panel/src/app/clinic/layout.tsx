'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ListOrdered, CalendarDays, Stethoscope,
  Users, HeartHandshake, BarChart3, LogOut, X, Menu, Activity,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import NotificationBell from '@/components/NotificationBell';
import ProfileDropdown from '@/components/ProfileDropdown';
import { t } from '@/lib/i18n';

const navItems = [
  { path: '/clinic/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/clinic/queue', label: 'Queue', icon: ListOrdered },
  { path: '/clinic/appointments', label: 'Appointments', icon: CalendarDays },
  { path: '/clinic/doctors', label: 'Doctors', icon: Stethoscope },
  { path: '/clinic/staff', label: 'Staff', icon: Users },
  { path: '/clinic/crm', label: 'CRM', icon: HeartHandshake },
  { path: '/clinic/finance', label: 'Finance', icon: BarChart3 },
];

const pageTitles: Record<string, string> = {
  '/clinic/dashboard': 'Dashboard',
  '/clinic/queue': 'Queue Management',
  '/clinic/appointments': 'Appointments',
  '/clinic/doctors': 'Doctors',
  '/clinic/staff': 'Staff Management',
  '/clinic/crm': 'Patient CRM',
  '/clinic/finance': 'Finance',
};

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const title = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || 'Clinic Panel';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">MED-ID</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">{t('Clinic Panel')}</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { router.push(item.path); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.label)}</span>
                {isActive && <motion.div layoutId="clinicActiveTab" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800/50">
        <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-emergency/10 hover:text-emergency transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span>{t('Logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main dark:bg-[#0F0F15]">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 glass-card rounded-none border-r border-gray-200/50 dark:border-gray-800/50">
          {sidebarContent}
        </div>
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 250 }} className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
              <div className="flex-1 flex flex-col min-h-0 h-full glass-card rounded-none border-r border-gray-200/50 dark:border-gray-800/50">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 glass-card rounded-none border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t(title)}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{t('Clinic Management')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <NotificationBell />
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
