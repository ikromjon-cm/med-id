'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard, Users, Building2, Stethoscope,
  BarChart3, ScrollText, Bell, Settings, LogOut, X,
  AlertTriangle
} from 'lucide-react';

const navSections = [
  {
    title: t('Main'),
    items: [
      { path: '/admin/dashboard', label: t('Dashboard'), icon: LayoutDashboard },
    ],
  },
  {
    title: t('Management'),
    items: [
      { path: '/admin/users', label: t('Users'), icon: Users },
      { path: '/admin/doctors', label: t('Doctors'), icon: Stethoscope },
      { path: '/admin/clinics', label: t('Clinics'), icon: Building2 },
    ],
  },
  {
    title: t('Monitoring'),
    items: [
      { path: '/admin/analytics', label: t('Analytics'), icon: BarChart3 },
      { path: '/admin/access-logs', label: t('Access Logs'), icon: ScrollText },
      { path: '/admin/emergency', label: t('Emergency'), icon: AlertTriangle },
    ],
  },
  {
    title: t('Communication'),
    items: [
      { path: '/admin/notifications', label: t('Notifications'), icon: Bell },
    ],
  },
  {
    title: t('System'),
    items: [
      { path: '/admin/settings', label: t('Settings'), icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="MED-ID" width={36} height={36} className="rounded-xl" />
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">{t('MED-ID')}</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">{t('Admin Panel')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4 last:mb-0">
            <p className="px-4 mb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => { router.push(item.path); onClose(); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800/50">
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-emergency/10 hover:text-emergency transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('Logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 glass-card rounded-none border-r border-gray-200/50 dark:border-gray-800/50">
          {sidebarContent}
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <div className="flex-1 flex flex-col min-h-0 h-full glass-card rounded-none border-r border-gray-200/50 dark:border-gray-800/50">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
