'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  QrCode, Download, Share2, Shield, Info,
  Heart, AlertTriangle, CheckCircle2, Droplets,
  Activity, Smartphone, ScanLine, ExternalLink
} from 'lucide-react';
import { getPatientProfile } from '@/lib/mockData';
import type { PatientProfile } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function QRCodePage() {
  const [profile, setProfile] = useState<PatientProfile | undefined>();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const p = await getPatientProfile(patientId);
      setProfile(p);
      setLoading(false);
    }
    load();
  }, []);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, 400, 520, 24);
    ctx.fill();

    const grad = ctx.createLinearGradient(0, 0, 400, 0);
    grad.addColorStop(0, '#0F6FFF');
    grad.addColorStop(1, '#00C896');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 400, 90, 24);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('MED-ID'), 200, 45);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(t('Patient Medical Identity'), 200, 68);

    const qrSize = 200;
    const qrX = (400 - qrSize) / 2;
    const qrY = 110;
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 16);
    ctx.fill();

    const cells = 21;
    const cellSize = qrSize / cells;
    ctx.fillStyle = '#0F6FFF';
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        if ((row * 7 + col * 13 + row * col * 3) % 5 === 0 || (row + col) % 3 === 0) {
          ctx.fillRect(qrX + col * cellSize, qrY + row * cellSize, cellSize, cellSize);
        }
      }
    }

    const cx = qrX + qrSize / 2;
    const cy = qrY + qrSize / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy - 10, 20, 20, 4);
    ctx.fill();
    ctx.fillStyle = '#0F6FFF';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('M', cx, cy + 4);

    ctx.fillStyle = '#171717';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(profile?.name || t('Patient'), 200, 340);

    ctx.fillStyle = '#6B7280';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(`${t('Patient ID')}: ${patientId}`, 200, 362);

    ctx.fillStyle = '#F3F4F6';
    ctx.beginPath();
    ctx.roundRect(70, 380, 260, 1, 0);
    ctx.fill();

    ctx.fillStyle = '#6B7280';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('Scan this QR code in case of emergency to access'), 200, 405);
    ctx.fillText(t('critical medical information.'), 200, 420);

    ctx.fillStyle = 'rgba(15, 111, 255, 0.1)';
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillText(t('MED-ID Biometric Medical Platform'), 200, 450);

    const link = document.createElement('a');
    link.download = `med-id-qr-${patientId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'MED-ID ' + t('QR Code'),
      text: `MED-ID ${t('Patient')}: ${profile?.name} (${patientId})`,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(`MED-ID ${t('Patient')}: ${profile?.name} (${patientId})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-8 animate-pulse">
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700/50 rounded-2xl" />
          </div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto mb-2" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto mb-6" />
          <div className="flex justify-center gap-3">
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('My QR Code')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('Your medical identity card')}</p>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-64 h-64 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-3 h-3 rounded-sm',
                        (i * 7 + i * 13 + i * 3) % 5 === 0 || (Math.floor(i / 7) + (i % 7)) % 3 === 0
                          ? 'bg-primary'
                          : 'bg-transparent'
                      )}
                    />
                  ))}
                </div>
                <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">M</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{profile?.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('Patient ID')}: {patientId}</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10">
            <Droplets className="w-3 h-3 inline mr-1" />
            {profile?.bloodType}
          </span>
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            profile?.biometricEnabled
              ? 'bg-secondary/10 text-secondary border border-secondary/20'
              : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 border border-gray-200 dark:border-gray-700/50'
          )}>
            <Shield className="w-3 h-3 inline mr-1" />
            {profile?.biometricEnabled ? t('Biometric ON') : t('Biometric OFF')}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            {t('Download QR')}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                {t('Copied')}!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                {t('Share')}
              </>
            )}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Emergency Access Info')}</h3>
        </div>
        <div className="space-y-3">
          {[
            { icon: Heart, label: t('Blood Type'), desc: t('Your blood type is shared for transfusion emergencies') },
            { icon: AlertTriangle, label: t('Allergies'), desc: t('Critical allergies are visible to first responders') },
            { icon: Activity, label: t('Chronic Conditions'), desc: t('Pre-existing conditions for informed treatment') },
            { icon: Shield, label: t('Current Medications'), desc: t('Active prescriptions to prevent drug interactions') },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('Your Privacy is Protected')}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {t('Only vital medical information is shared during emergency scans. Full medical history access requires your explicit consent and biometric verification. All accesses are logged and you receive instant notifications.')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
