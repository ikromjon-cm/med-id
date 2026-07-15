'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarDays, Stethoscope,
  Pill, Search, LogOut, X, Menu, Activity,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import NotificationBell from '@/components/NotificationBell';
import ProfileDropdown from '@/components/ProfileDropdown';
import { t } from '@/lib/i18n';

const navItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/patients', label: 'My Patients', icon: Users },
  { path: '/doctor/appointments', label: 'Appointments', icon: CalendarDays },
  { path: '/doctor/diagnoses', label: 'Diagnoses', icon: Stethoscope },
  { path: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
  { path: '/doctor/search', label: 'Patient Search', icon: Search },
];

const pageTitles: Record<string, string> = {
  '/doctor/dashboard': 'Dashboard',
  '/doctor/patients': 'My Patients',
  '/doctor/appointments': 'Appointments',
  '/doctor/diagnoses': 'Diagnoses',
  '/doctor/prescriptions': 'Prescriptions',
  '/doctor/search': 'Patient Search',
};

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const title = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || 'Doctor Panel';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 ">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900  tracking-tight">{t('MED-ID')}</h1>
            <p className="text-[10px] text-gray-500  font-medium tracking-wider uppercase">{t('Doctor Panel')}</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600  hover:bg-gray-100  transition-colors">
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
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                    : 'text-gray-600  hover:bg-gray-100  hover:text-gray-900 '
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.label)}</span>
                {isActive && <motion.div layoutId="doctorActiveTab" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="px-3 py-4 border-t border-gray-100 ">
        <button onClick={() => window.location.href='/login'} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600  hover:bg-emergency/10 hover:text-emergency transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span>{t('Logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main ">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 glass-card rounded-none border-r border-gray-200/50 ">
          {sidebarContent}
        </div>
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 250 }} className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
              <div className="flex-1 flex flex-col min-h-0 h-full glass-card rounded-none border-r border-gray-200/50 ">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 glass-card rounded-none border-b border-gray-200/50 ">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500  hover:bg-gray-100  hover:text-gray-700  transition-all">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 ">{t(title)}</h1>
                <p className="text-xs text-gray-500  hidden sm:block">{t('Doctor Panel')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500  hover:bg-gray-100  hover:text-gray-700  transition-all">
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
