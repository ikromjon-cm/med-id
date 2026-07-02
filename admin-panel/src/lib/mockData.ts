import { User, Clinic, Doctor, AccessLog, Notification, DashboardStats, ChartDataPoint } from './types';
import { delay, generateId } from './utils';

const SPECIALIZATIONS = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Oncology', 'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'Internal Medicine', 'Obstetrics', 'Ophthalmology', 'Pathology', 'Psychiatry', 'Surgery', 'Urology', 'Endocrinology', 'Gastroenterology', 'Pulmonology'];

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley', 'Andrew', 'Kimberly', 'Paul', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle'];

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const CLINIC_NAMES = ['Med-ID Central Hospital', 'Green Valley Medical Center', 'Pinecrest Health Clinic', 'Riverside Medical Group', 'Sunset Diagnostic Center', 'Harbor Health Partners', 'Maple Grove Pediatrics', 'Cedar Ridge Cardiology', 'Oakwood Surgical Center', 'Silver Lake Family Health', 'Bay Area Medical Associates', 'Crystal Run Healthcare', 'North Star Medical Clinic', 'Pacific Health Alliance', 'Summit Medical Group'];

const CLINIC_ADDRESSES = ['742 Evergreen Terrace', '123 Main Street', '456 Oak Avenue', '789 Pine Road', '321 Maple Drive', '654 Elm Street', '987 Birch Lane', '147 Cedar Court', '258 Walnut Way', '369 Spruce Boulevard', '159 Lake View Drive', '753 Park Avenue', '951 Broadway', '357 Madison Avenue', '852 Sunset Boulevard'];

const ACTIONS = ['View', 'Create', 'Update', 'Delete', 'Export', 'Login', 'Logout', 'Search', 'Download', 'Print'];
const RESOURCES = ['Patient Record', 'Doctor Profile', 'Clinic Info', 'Document', 'Report', 'Settings', 'Notification', 'Analytics', 'User Account', 'Access Log'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

function randomPhone(): string {
  return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function randomIP(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

const now = new Date();
const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

export let users: User[] = Array.from({ length: 48 }, (_, i) => ({
  id: `USR-${String(i + 1).padStart(4, '0')}`,
  name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  email: `user${i + 1}@medid.com`,
  role: randomFrom(['admin', 'doctor', 'nurse', 'receptionist', 'patient'] as const),
  status: randomFrom(['active', 'active', 'active', 'inactive', 'suspended'] as const),
  createdAt: randomDate(sixMonthsAgo, now),
}));
users[0] = { ...users[0], name: 'Admin User', email: 'admin@medid.com', role: 'admin', status: 'active' };

export let clinics: Clinic[] = CLINIC_NAMES.map((name, i) => ({
  id: `CLN-${String(i + 1).padStart(3, '0')}`,
  name,
  address: CLINIC_ADDRESSES[i] || `${Math.floor(Math.random() * 999) + 1} Medical Plaza`,
  phone: randomPhone(),
  status: randomFrom(['active', 'active', 'active', 'inactive'] as const),
  doctorsCount: Math.floor(Math.random() * 15) + 3,
}));

export let doctors: Doctor[] = Array.from({ length: 36 }, (_, i) => ({
  id: `DOC-${String(i + 1).padStart(3, '0')}`,
  name: `Dr. ${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  specialization: randomFrom(SPECIALIZATIONS),
  clinic: randomFrom(CLINIC_NAMES),
  status: randomFrom(['active', 'active', 'active', 'inactive', 'on-leave'] as const),
  patients: Math.floor(Math.random() * 200) + 20,
}));

export let accessLogs: AccessLog[] = Array.from({ length: 100 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(4, '0')}`,
  user: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  role: randomFrom(['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient']),
  action: randomFrom(ACTIONS),
  resource: randomFrom(RESOURCES),
  timestamp: randomDate(sixMonthsAgo, now),
  ip: randomIP(),
}));

export let notifications: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'Emergency',
    title: 'Critical System Alert',
    message: 'Unauthorized access attempt detected from IP 192.168.1.45. Immediate investigation required.',
    recipients: ['admin@medid.com', 'security@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-002',
    type: 'Alert',
    title: 'Database Backup Completed',
    message: 'Scheduled database backup completed successfully. Total size: 4.2 GB.',
    recipients: ['admin@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-003',
    type: 'Update',
    title: 'System Update Available',
    message: 'Version 3.2.1 is now available. New features include enhanced encryption and improved performance.',
    recipients: ['all'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-004',
    type: 'Reminder',
    title: 'License Renewal',
    message: 'Your MED-ID platform license will expire in 30 days. Please renew to continue uninterrupted service.',
    recipients: ['admin@medid.com', 'billing@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-005',
    type: 'Emergency',
    title: 'Server Performance Warning',
    message: 'CPU usage has exceeded 90% on primary server. Consider scaling resources.',
    recipients: ['admin@medid.com', 'devops@medid.com'],
    status: 'Pending',
    createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-006',
    type: 'Alert',
    title: 'New User Registration Spike',
    message: 'Over 50 new patient registrations in the last hour. Verify system capacity.',
    recipients: ['admin@medid.com'],
    status: 'Failed',
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-007',
    type: 'Update',
    title: 'Compliance Update',
    message: 'HIPAA compliance checklist has been updated. Review new requirements in the compliance dashboard.',
    recipients: ['admin@medid.com', 'compliance@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-008',
    type: 'Reminder',
    title: 'Staff Meeting',
    message: 'Monthly staff meeting scheduled for Friday at 10:00 AM. Mandatory attendance for all department heads.',
    recipients: ['all'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-009',
    type: 'Emergency',
    title: 'Security Patch Required',
    message: 'Critical vulnerability identified in authentication module. Patch must be applied within 24 hours.',
    recipients: ['admin@medid.com', 'security@medid.com', 'devops@medid.com'],
    status: 'Pending',
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-010',
    type: 'Alert',
    title: 'Storage Alert',
    message: 'System storage is at 85% capacity. Archive old records to free up space.',
    recipients: ['admin@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-011',
    type: 'Update',
    title: 'API Deprecation Notice',
    message: 'Legacy API v1 will be deprecated on June 30. Migrate to API v2 to avoid service disruption.',
    recipients: ['developers@medid.com', 'admin@medid.com'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF-012',
    type: 'Reminder',
    title: 'Password Policy Update',
    message: 'All users must update their passwords by next month. New policy requires 12+ characters with special symbols.',
    recipients: ['all'],
    status: 'Sent',
    createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(600);
  return {
    totalPatients: 1250,
    totalDoctors: 268,
    totalClinics: 108,
    totalDocuments: 5420,
  };
}

export async function getUserGrowthData(): Promise<ChartDataPoint[]> {
  await delay(400);
  return [
    { name: 'Jan', users: 400, doctors: 120, patients: 280 },
    { name: 'Feb', users: 450, doctors: 135, patients: 315 },
    { name: 'Mar', users: 520, doctors: 148, patients: 372 },
    { name: 'Apr', users: 580, doctors: 160, patients: 420 },
    { name: 'May', users: 650, doctors: 175, patients: 475 },
    { name: 'Jun', users: 720, doctors: 190, patients: 530 },
    { name: 'Jul', users: 800, doctors: 205, patients: 595 },
    { name: 'Aug', users: 850, doctors: 218, patients: 632 },
    { name: 'Sep', users: 920, doctors: 230, patients: 690 },
    { name: 'Oct', users: 1020, doctors: 245, patients: 775 },
    { name: 'Nov', users: 1130, doctors: 258, patients: 872 },
    { name: 'Dec', users: 1250, doctors: 268, patients: 982 },
  ];
}

export async function getEmergencyAccessData(): Promise<ChartDataPoint[]> {
  await delay(400);
  return [
    { name: 'Jan', emergency: 45, routine: 320 },
    { name: 'Feb', emergency: 52, routine: 340 },
    { name: 'Mar', emergency: 38, routine: 310 },
    { name: 'Apr', emergency: 65, routine: 380 },
    { name: 'May', emergency: 58, routine: 360 },
    { name: 'Jun', emergency: 72, routine: 400 },
    { name: 'Jul', emergency: 85, routine: 430 },
    { name: 'Aug', emergency: 68, routine: 390 },
    { name: 'Sep', emergency: 55, routine: 370 },
    { name: 'Oct', emergency: 78, routine: 410 },
    { name: 'Nov', emergency: 90, routine: 450 },
    { name: 'Dec', emergency: 95, routine: 470 },
  ];
}

export async function getDocumentStats(): Promise<ChartDataPoint[]> {
  await delay(400);
  return [
    { name: 'Lab Reports', value: 1850 },
    { name: 'Prescriptions', value: 1200 },
    { name: 'Medical Records', value: 980 },
    { name: 'Imaging', value: 670 },
    { name: 'Insurance', value: 420 },
    { name: 'Consent Forms', value: 300 },
  ];
}

export async function getRoleDistribution(): Promise<ChartDataPoint[]> {
  await delay(400);
  return [
    { name: 'Patients', value: 982 },
    { name: 'Doctors', value: 268 },
    { name: 'Nurses', value: 145 },
    { name: 'Receptionists', value: 38 },
    { name: 'Admins', value: 12 },
  ];
}

export async function getMonthlyActiveUsers(): Promise<ChartDataPoint[]> {
  await delay(400);
  return [
    { name: 'Jan', active: 520 },
    { name: 'Feb', active: 580 },
    { name: 'Mar', active: 610 },
    { name: 'Apr', active: 680 },
    { name: 'May', active: 720 },
    { name: 'Jun', active: 790 },
    { name: 'Jul', active: 850 },
    { name: 'Aug', active: 820 },
    { name: 'Sep', active: 890 },
    { name: 'Oct', active: 950 },
    { name: 'Nov', active: 1010 },
    { name: 'Dec', active: 1080 },
  ];
}

export async function getRecentActivity(): Promise<{ action: string; user: string; time: string }[]> {
  await delay(300);
  return [
    { action: 'New patient registration', user: 'Sarah Johnson', time: '2 minutes ago' },
    { action: 'Medical record updated', user: 'Dr. James Wilson', time: '5 minutes ago' },
    { action: 'Emergency access granted', user: 'Dr. Emily Chen', time: '12 minutes ago' },
    { action: 'New clinic added', user: 'Admin User', time: '18 minutes ago' },
    { action: 'Document uploaded', user: 'Lisa Anderson', time: '25 minutes ago' },
    { action: 'User role changed', user: 'Admin User', time: '32 minutes ago' },
    { action: 'Report exported', user: 'Robert Martinez', time: '45 minutes ago' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago' },
    { action: 'Password reset requested', user: 'Michael Brown', time: '1 hour ago' },
    { action: 'New doctor onboarded', user: 'Admin User', time: '2 hours ago' },
  ];
}

export async function getUsers(): Promise<User[]> {
  await delay(500);
  return [...users];
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  await delay(400);
  const newUser: User = {
    id: `USR-${String(users.length + 1).padStart(4, '0')}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  users.unshift(newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  await delay(400);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  await delay(300);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

export async function getClinics(): Promise<Clinic[]> {
  await delay(500);
  return [...clinics];
}

export async function createClinic(data: Omit<Clinic, 'id'>): Promise<Clinic> {
  await delay(400);
  const newClinic: Clinic = {
    id: `CLN-${String(clinics.length + 1).padStart(3, '0')}`,
    ...data,
  };
  clinics.unshift(newClinic);
  return newClinic;
}

export async function updateClinic(id: string, data: Partial<Clinic>): Promise<Clinic | null> {
  await delay(400);
  const index = clinics.findIndex(c => c.id === id);
  if (index === -1) return null;
  clinics[index] = { ...clinics[index], ...data };
  return clinics[index];
}

export async function deleteClinic(id: string): Promise<boolean> {
  await delay(300);
  const index = clinics.findIndex(c => c.id === id);
  if (index === -1) return false;
  clinics.splice(index, 1);
  return true;
}

export async function getDoctors(): Promise<Doctor[]> {
  await delay(500);
  return [...doctors];
}

export async function createDoctor(data: Omit<Doctor, 'id'>): Promise<Doctor> {
  await delay(400);
  const newDoctor: Doctor = {
    id: `DOC-${String(doctors.length + 1).padStart(3, '0')}`,
    ...data,
  };
  doctors.unshift(newDoctor);
  return newDoctor;
}

export async function updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
  await delay(400);
  const index = doctors.findIndex(d => d.id === id);
  if (index === -1) return null;
  doctors[index] = { ...doctors[index], ...data };
  return doctors[index];
}

export async function deleteDoctor(id: string): Promise<boolean> {
  await delay(300);
  const index = doctors.findIndex(d => d.id === id);
  if (index === -1) return false;
  doctors.splice(index, 1);
  return true;
}

export async function getAccessLogs(filters?: {
  search?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AccessLog[]> {
  await delay(500);
  let filtered = [...accessLogs];
  if (filters) {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(l => l.user.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.resource.toLowerCase().includes(s));
    }
    if (filters.role) {
      filtered = filtered.filter(l => l.role.toLowerCase() === filters.role!.toLowerCase());
    }
    if (filters.startDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(filters.endDate!));
    }
  }
  return filtered;
}

export async function getNotifications(): Promise<Notification[]> {
  await delay(500);
  return [...notifications];
}

export async function createNotification(data: { type: Notification['type']; title: string; message: string; recipients: string[] }): Promise<Notification> {
  await delay(400);
  const newNotif: Notification = {
    id: `NOTIF-${String(notifications.length + 1).padStart(3, '0')}`,
    ...data,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotif);
  return newNotif;
}
