'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import type { ClinicFinance } from '@/lib/types';

interface ClinicFinanceChartProps {
  data: ClinicFinance[];
  className?: string;
}

export default function ClinicFinanceChart({ data, className }: ClinicFinanceChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const totalAppointments = data.reduce((sum, d) => sum + d.appointments, 0);
  const profit = totalRevenue - totalExpenses;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
          <p className="text-lg font-bold text-primary">${(totalRevenue / 1000).toFixed(1)}k</p>
        </div>
        <div className="rounded-xl bg-emergency/10 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
          <p className="text-lg font-bold text-emergency">${(totalExpenses / 1000).toFixed(1)}k</p>
        </div>
        <div className={cn('rounded-xl p-3 text-center', profit >= 0 ? 'bg-[#00C896]/10' : 'bg-emergency/10')}>
          <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
          <p className={cn('text-lg font-bold', profit >= 0 ? 'text-[#00C896]' : 'text-emergency')}>
            ${(profit / 1000).toFixed(1)}k
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Total Appointments</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalAppointments.toLocaleString()}</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={(v) => {
            const parts = v.split('-');
            return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(parts[1]) - 1]}`;
          }} />
          <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, undefined]}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#0F6FFF" radius={[4, 4, 0, 0]} maxBarSize={30} />
          <Bar dataKey="expenses" name="Expenses" fill="#FF4D4F" radius={[4, 4, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
