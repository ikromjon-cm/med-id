'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    router.push('/role-selection');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-[#0F0F15] p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.jpg" alt="MED-ID" className="w-20 h-20 rounded-2xl mb-4 shadow-xl" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MED-ID</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Biometric Medical Platform')}</p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                {t('Kirish')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('Bir tugma bilan tezkor kirish')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
