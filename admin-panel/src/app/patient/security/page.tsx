'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Smartphone, Monitor, Globe, MapPin,
  Clock, Fingerprint, LogOut, AlertTriangle,
  Laptop
} from 'lucide-react';
import {
  getSecuritySessions, revokeSession,
  getPatientProfile, updatePatientProfile
} from '@/lib/mockData';
import type { SecuritySession } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function SecurityPage() {
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const [s, p] = await Promise.all([
        getSecuritySessions(patientId),
        getPatientProfile(patientId),
      ]);
      setSessions(s);
      if (p) setBiometricEnabled(p.biometricEnabled);
      setLoading(false);
    }
    load();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    await revokeSession(patientId, sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setRevokeId(null);
  };

  const toggleBiometric = async () => {
    const newVal = !biometricEnabled;
    await updatePatientProfile(patientId, { biometricEnabled: newVal });
    setBiometricEnabled(newVal);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="h-5 w-40 bg-gray-200  rounded mb-4" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100  last:border-0">
              <div className="h-10 w-10 rounded-xl bg-gray-200 " />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200  rounded mb-2" />
                <div className="h-3 w-48 bg-gray-200  rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="h-5 w-40 bg-gray-200  rounded mb-4" />
          <div className="h-16 w-full bg-gray-200  rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Monitor className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-gray-900 ">{t('Active Sessions')}</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary ml-2">
            {sessions.length} {t('active')}
          </span>
        </div>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Monitor className="w-10 h-10 text-gray-300  mb-3" />
            <p className="text-sm text-gray-500 ">{t('No active sessions')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl transition-all duration-200',
                  session.isCurrent
                    ? 'bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10'
                    : 'bg-gray-50  border border-gray-100 '
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  session.isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-100  text-gray-500 '
                )}>
                  {session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('galaxy') || session.device.toLowerCase().includes('pixel')
                    ? <Smartphone className="w-5 h-5" />
                    : session.device.toLowerCase().includes('macbook')
                    ? <Laptop className="w-5 h-5" />
                    : <Monitor className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 ">{session.device}</p>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {t('Current Session')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500 ">
                      <Globe className="w-3 h-3" />
                      {session.browser}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 ">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 ">
                      <Clock className="w-3 h-3" />
                      {session.lastActive}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400  mt-1 font-mono">{t('IP')}: {session.ip}</p>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => setRevokeId(session.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-emergency bg-emergency/5 border border-emergency/20 hover:bg-emergency/10 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    {t('Revoke')}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Fingerprint className="w-4 h-4 text-secondary" />
          <h3 className="text-base font-semibold text-gray-900 ">{t('Biometric Authentication')}</h3>
        </div>
        <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50  border border-gray-100 ">
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              biometricEnabled ? 'bg-secondary/10' : 'bg-gray-100 '
            )}>
              <Fingerprint className={cn('w-6 h-6', biometricEnabled ? 'text-secondary' : 'text-gray-400')} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 ">{t('Biometric Login')}</p>
              <p className="text-xs text-gray-500  mt-0.5">
                {biometricEnabled
                  ? t('Use your fingerprint or face ID to securely access your account')
                  : t('Enable for faster and more secure access to your medical profile')}
              </p>
            </div>
          </div>
          <button
            onClick={toggleBiometric}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0',
              biometricEnabled ? 'bg-secondary' : 'bg-gray-300 '
            )}
          >
            <motion.div
              animate={{ x: biometricEnabled ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {revokeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setRevokeId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white  rounded-2xl shadow-2xl border border-gray-200  p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-emergency/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-emergency" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900  text-center mb-2">{t('Revoke Session')}</h3>
              <p className="text-sm text-gray-500  text-center mb-6">
                {t('This will sign out the device from your account. The user will need to re-authenticate.')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRevokeId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200  text-gray-700  hover:bg-gray-50  transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => handleRevoke(revokeId)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-emergency text-white hover:bg-emergency-dark transition-colors"
                >
                  {t('Revoke')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
