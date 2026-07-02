'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Bell, Settings as SettingsIcon, Eye, Monitor, Smartphone } from 'lucide-react';
import FormInput from '@/components/FormInput';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [system, setSystem] = useState({
    appName: 'MED-ID Platform',
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

  const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) => (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
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
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure platform settings and preferences</p>
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
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-[#00C896]/10 text-[#00C896] text-sm font-medium"
        >
          Settings saved successfully.
        </motion.div>
      )}

      <SectionCard icon={<SettingsIcon className="w-5 h-5" />} title="System Configuration" description="Manage general system settings">
        <div className="space-y-4">
          <FormInput label="Application Name" value={system.appName} onChange={e => setSystem({ ...system, appName: e.target.value })} />
          <FormInput label="Version" value={system.version} onChange={e => setSystem({ ...system, version: e.target.value })} />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Disable user access during maintenance</p>
            </div>
            <ToggleSwitch checked={system.maintenanceMode} onChange={v => setSystem({ ...system, maintenanceMode: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Shield className="w-5 h-5" />} title="Security Settings" description="Configure security and access policies">
        <div className="space-y-4">
          <FormInput label="Session Timeout (minutes)" type="number" value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })} />
          <FormInput label="Max Login Attempts" type="number" value={security.maxLoginAttempts} onChange={e => setSecurity({ ...security, maxLoginAttempts: e.target.value })} />
          <FormInput label="Minimum Password Length" type="number" value={security.passwordMinLength} onChange={e => setSecurity({ ...security, passwordMinLength: e.target.value })} />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for admin accounts</p>
            </div>
            <ToggleSwitch checked={security.twoFactorAuth} onChange={v => setSecurity({ ...security, twoFactorAuth: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Bell className="w-5 h-5" />} title="Notification Settings" description="Configure notification channels">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive push notifications in-app</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.push} onChange={v => setNotifications({ ...notifications, push: v })} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive critical alerts via SMS</p>
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Alerts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Immediate alerts for critical events</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications.emergencyAlerts} onChange={v => setNotifications({ ...notifications, emergencyAlerts: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<Monitor className="w-5 h-5" />} title="Theme Settings" description="Customize your display preferences">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
          </div>
          <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </SectionCard>
    </div>
  );
}
