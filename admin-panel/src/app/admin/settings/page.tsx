'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Bell, Settings as SettingsIcon, Eye, Monitor, Smartphone, Users, Key, Check, Trash2 } from 'lucide-react';
import FormInput from '@/components/FormInput';
import { useTheme } from '@/components/ThemeProvider';
import { t } from '@/lib/i18n';

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) => (
  <div className="flex items-center gap-3">
    {label && <span className="text-sm text-gray-700 ">{label}</span>}
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-primary' : 'bg-gray-200 '}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

const SectionCard = ({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-2xl p-6"
  >
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 ">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 ">{title}</h3>
        <p className="text-xs text-gray-500 ">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [system, setSystem] = useState({
    appName: t('MED-ID Platform'),
    version: '3.2.1',
    maintenanceMode: false,
  });

  const [security, setSecurity] = useState({
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '12',
    twoFactorAuth: true,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    emergencyAlerts: true,
  });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 ">{t('Settings')}</h2>
          <p className="text-sm text-gray-500  mt-1">{t('Configure platform settings and preferences')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? t('Saved!') : t('Save Changes')}
        </motion.button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-[#00C896]/10 text-[#00C896] text-sm font-medium"
        >
          {t('Settings saved successfully.')}
        </motion.div>
      )}

      <SectionCard icon={<SettingsIcon className="w-5 h-5" />} title={t('System Configuration')} description={t('Manage general system settings')}>
        <div className="space-y-4">
          <FormInput label={t('Application Name')} value={system.appName} onChange={e => setSystem({ ...system, appName: e.target.value })} />
          <FormInput label={t('Version')} value={system.version} onChange={e => setSystem({ ...system, version: e.target.value })} />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 ">{t('Maintenance Mode')}</p>
              <p className="text-xs text-gray-500 ">{t('Disable user access during maintenance')}</p>
            </div>
            <ToggleSwitch checked={system.maintenanceMode} onChange={v => setSystem({ ...system, maintenanceMode: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Shield className="w-5 h-5" />} title={t('Security Settings')} description={t('Configure security and access policies')}>
        <div className="space-y-4">
          <FormInput label={t('Session Timeout (minutes)')} type="number" value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })} />
          <FormInput label={t('Max Login Attempts')} type="number" value={security.maxLoginAttempts} onChange={e => setSecurity({ ...security, maxLoginAttempts: e.target.value })} />
          <FormInput label={t('Minimum Password Length')} type="number" value={security.passwordMinLength} onChange={e => setSecurity({ ...security, passwordMinLength: e.target.value })} />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 ">{t('Two-Factor Authentication')}</p>
              <p className="text-xs text-gray-500 ">{t('Require 2FA for admin accounts')}</p>
            </div>
            <ToggleSwitch checked={security.twoFactorAuth} onChange={v => setSecurity({ ...security, twoFactorAuth: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Bell className="w-5 h-5" />} title={t('Notification Settings')} description={t('Configure notification channels')}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 ">{t('Email Notifications')}</p>
                <p className="text-xs text-gray-500 ">{t('Receive notifications via email')}</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.email} onChange={v => setNotifications({ ...notifications, email: v })} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00C896]/10 flex items-center justify-center text-[#00C896]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 ">{t('Push Notifications')}</p>
                <p className="text-xs text-gray-500 ">{t('Receive push notifications in-app')}</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.push} onChange={v => setNotifications({ ...notifications, push: v })} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50  flex items-center justify-center text-amber-500">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 ">{t('SMS Notifications')}</p>
                <p className="text-xs text-gray-500 ">{t('Receive critical alerts via SMS')}</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.sms} onChange={v => setNotifications({ ...notifications, sms: v })} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emergency/10 flex items-center justify-center text-emergency">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 ">{t('Emergency Alerts')}</p>
                <p className="text-xs text-gray-500 ">{t('Immediate alerts for critical events')}</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.emergencyAlerts} onChange={v => setNotifications({ ...notifications, emergencyAlerts: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Monitor className="w-5 h-5" />} title={t('Theme Settings')} description={t('Customize your display preferences')}>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700 ">{t('Dark Mode')}</p>
            <p className="text-xs text-gray-500 ">{t('Toggle between light and dark themes')}</p>
          </div>
          <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </SectionCard>

      {/* ROLES & PERMISSIONS */}
      <SectionCard icon={<Users className="w-5 h-5" />} title={t('Roles & Permissions')} description={t('Manage user roles and their permissions')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 ">
                <th className="text-left py-3 pr-4 text-xs font-medium text-gray-500  uppercase tracking-wider">{t('Role')}</th>
                {['View Patients', 'Edit Records', 'Emergency Access', 'Manage Users', 'Manage Clinic', 'View Analytics'].map(perm => (
                  <th key={perm} className="text-center py-3 px-2 text-xs font-medium text-gray-500  uppercase tracking-wider">{t(perm)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Admin', perms: [true, true, true, true, true, true] },
                { role: 'Doctor', perms: [true, true, true, false, false, true] },
                { role: 'Nurse', perms: [true, true, true, false, false, false] },
                { role: 'Receptionist', perms: [true, false, false, false, false, false] },
                { role: 'Patient', perms: [true, false, false, false, false, false] },
              ].map((row) => (
                <tr key={row.role} className="border-b border-gray-50  hover:bg-gray-50  transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-900 ">{t(row.role)}</td>
                  {row.perms.map((perm, ci) => (
                    <td key={ci} className="text-center py-3 px-2">
                      {perm ? <Check className="w-4 h-4 text-[#00C896] mx-auto" /> : <span className="w-4 h-4 block mx-auto text-gray-300 ">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all"
          >
            <Save className="w-4 h-4" /> {t('Save Changes')}
          </button>
        </div>
      </SectionCard>

      {/* API KEYS */}
      <SectionCard icon={<Key className="w-5 h-5" />} title={t('API Keys')} description={t('Manage API access keys')}>
        <div className="space-y-3">
          {[
            { name: t('Production API Key'), key: 'sk-prod-9f8a...7d3X', status: 'Active', created: '2026-01-15' },
            { name: t('Test API Key'), key: 'sk-test-2b4c...1e9Y', status: 'Inactive', created: '2026-03-22' },
          ].map((apiKey, i) => (
            <motion.div
              key={apiKey.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50  border border-gray-100 "
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 ">{apiKey.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <code className="text-xs font-mono text-gray-500 ">{apiKey.key}</code>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    apiKey.status === 'Active' ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-gray-100  text-gray-500'
                  }`}>{apiKey.status === 'Active' ? t('Active') : t('Inactive')}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{t('Created')}: {apiKey.created}</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-emergency hover:text-emergency-dark transition-colors shrink-0 ml-4">
                <Trash2 className="w-3 h-3" /> {t("O'chirish")}
              </button>
            </motion.div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all"
          >
            <Key className="w-4 h-4" /> {t('Yangi Kalit Yaratish')}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
