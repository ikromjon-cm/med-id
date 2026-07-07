import { User, Clinic, Doctor, AccessLog, Notification, DashboardStats, ChartDataPoint, Patient, Appointment, Diagnosis, Prescription, EmergencyAlert, QueueEntry, ClinicFinance, EmergencyAccessLog, DoctorDetail, Testimonial, Partner, BlogPost, FAQItem, Feature, ContactMessage, EmergencyStaff, ClinicEmployee, PatientDocument, EmergencyContact, SecuritySession, PatientProfile, ClinicDashboardStats, DoctorDashboardStats } from './types';
import { delay } from './utils';

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

export const users: User[] = Array.from({ length: 48 }, (_, i) => ({
  id: `USR-${String(i + 1).padStart(4, '0')}`,
  name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  email: `user${i + 1}@medid.com`,
  role: randomFrom(['admin', 'doctor', 'nurse', 'receptionist', 'patient'] as const),
  status: randomFrom(['active', 'active', 'active', 'inactive', 'suspended'] as const),
  createdAt: randomDate(sixMonthsAgo, now),
}));
users[0] = { ...users[0], name: 'Admin User', email: 'admin@medid.com', role: 'admin', status: 'active' };

export const clinics: Clinic[] = CLINIC_NAMES.map((name, i) => ({
  id: `CLN-${String(i + 1).padStart(3, '0')}`,
  name,
  address: CLINIC_ADDRESSES[i] || `${Math.floor(Math.random() * 999) + 1} Medical Plaza`,
  phone: randomPhone(),
  status: randomFrom(['active', 'active', 'active', 'inactive'] as const),
  doctorsCount: Math.floor(Math.random() * 15) + 3,
}));

export const doctors: Doctor[] = Array.from({ length: 36 }, (_, i) => ({
  id: `DOC-${String(i + 1).padStart(3, '0')}`,
  name: `Dr. ${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  specialization: randomFrom(SPECIALIZATIONS),
  clinic: randomFrom(CLINIC_NAMES),
  status: randomFrom(['active', 'active', 'active', 'inactive', 'on-leave'] as const),
  patients: Math.floor(Math.random() * 200) + 20,
}));

export const accessLogs: AccessLog[] = Array.from({ length: 100 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(4, '0')}`,
  user: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  role: randomFrom(['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient']),
  action: randomFrom(ACTIONS),
  resource: randomFrom(RESOURCES),
  timestamp: randomDate(sixMonthsAgo, now),
  ip: randomIP(),
}));

export const notifications: Notification[] = [
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

const PATIENT_FIRST_NAMES = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Amy', 'Brian'];
const PATIENT_LAST_NAMES = ['Anderson', 'Baker', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Hill', 'Irwin', 'Jenkins', 'King', 'Long', 'Miller', 'Nelson', 'Owen', 'Parker', 'Quinn', 'Reed', 'Stone', 'Taylor', 'Underwood', 'Vance', 'Wallace', 'Xu', 'Young', 'Zimmerman', 'Brooks', 'Carter', 'Dixon', 'Ellis'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female'];
const CONDITIONS = ['Hypertension', 'Type 2 Diabetes', 'Asthma', 'Lower Back Pain', 'Migraine', 'Anxiety Disorder', 'Hypothyroidism', 'GERD', 'Seasonal Allergies', 'Osteoarthritis', 'Depression', 'Insomnia', 'High Cholesterol', 'Sinusitis', 'Eczema', 'Anemia', 'UTI', 'Bronchitis', 'Gastritis', 'Tendonitis'];
const MEDICATIONS = ['Lisinopril', 'Metformin', 'Albuterol', 'Ibuprofen', 'Sumatriptan', 'Sertraline', 'Levothyroxine', 'Omeprazole', 'Cetirizine', 'Acetaminophen', 'Amoxicillin', 'Atorvastatin', 'Metoprolol', 'Losartan', 'Gabapentin'];
const APPOINTMENT_TYPES = ['Checkup', 'Follow-up', 'Consultation', 'Emergency', 'Routine', 'Surgery Prep', 'Test Results', 'Vaccination'];
const ACCESS_TYPES = ['Emergency Grant', 'Admin Override', 'Routine Access', 'System Access', 'Staff Access', 'Doctor Access'];

export const patients: Patient[] = Array.from({ length: 30 }, (_, i) => ({
  id: `PAT-${String(i + 1).padStart(3, '0')}`,
  name: `${randomFrom(PATIENT_FIRST_NAMES)} ${randomFrom(PATIENT_LAST_NAMES)}`,
  age: Math.floor(Math.random() * 60) + 18,
  gender: randomFrom(GENDERS),
  bloodType: randomFrom(BLOOD_TYPES),
  phone: randomPhone(),
  lastVisit: randomDate(sixMonthsAgo, now),
  status: randomFrom(['active', 'active', 'active', 'inactive'] as const),
}));

const nowDate = new Date();
const todayStr = nowDate.toISOString().slice(0, 10);

export const appointments: Appointment[] = Array.from({ length: 50 }, (_, i) => {
  const doc = randomFrom(doctors);
  const pat = randomFrom(patients);
  const clinicMatch = clinics.find(c => c.name === doc.clinic) || clinics[0];
  const daysOffset = Math.floor(Math.random() * 30) - 15;
  const apptDate = new Date(nowDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  return {
    id: `APT-${String(i + 1).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    doctorId: doc.id,
    doctorName: doc.name,
    clinicId: clinicMatch.id,
    clinicName: doc.clinic,
    date: apptDate.toISOString().slice(0, 10),
    time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    type: randomFrom(APPOINTMENT_TYPES),
    status: randomFrom(['scheduled', 'scheduled', 'completed', 'completed', 'in-progress', 'cancelled'] as const),
  };
});

export const diagnoses: Diagnosis[] = Array.from({ length: 40 }, (_, i) => {
  const doc = randomFrom(doctors);
  const pat = randomFrom(patients);
  return {
    id: `DIA-${String(i + 1).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    doctorId: doc.id,
    doctorName: doc.name,
    condition: randomFrom(CONDITIONS),
    notes: `Patient presents with symptoms consistent with ${randomFrom(CONDITIONS).toLowerCase()}. Recommended follow-up in ${Math.floor(Math.random() * 4) + 2} weeks.`,
    date: randomDate(sixMonthsAgo, now),
  };
});

export const prescriptions: Prescription[] = Array.from({ length: 40 }, (_, i) => {
  const doc = randomFrom(doctors);
  const pat = randomFrom(patients);
  const start = randomDate(sixMonthsAgo, now);
  const end = new Date(new Date(start).getTime() + (Math.floor(Math.random() * 90) + 30) * 24 * 60 * 60 * 1000);
  return {
    id: `PRE-${String(i + 1).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    doctorId: doc.id,
    medication: randomFrom(MEDICATIONS),
    dosage: `${Math.floor(Math.random() * 500) + 5}mg`,
    frequency: randomFrom(['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Every 6 hours']),
    startDate: start,
    endDate: end.toISOString(),
    status: randomFrom(['active', 'active', 'completed', 'completed', 'cancelled'] as const),
  };
});

export const emergencyAlerts: EmergencyAlert[] = [
  { id: 'EMG-001', patientId: 'PAT-001', patientName: 'John Anderson', triggeredBy: 'Dr. James Wilson', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), bloodType: 'O-', allergies: ['Penicillin', 'Sulfa'] },
  { id: 'EMG-002', patientId: 'PAT-005', patientName: 'Diana Foster', triggeredBy: 'Nurse Sarah Johnson', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), bloodType: 'A+', allergies: ['Latex'] },
  { id: 'EMG-003', patientId: 'PAT-012', patientName: 'Leo Quinn', triggeredBy: 'Dr. Robert Miller', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 32 * 60 * 1000).toISOString(), bloodType: 'B-', allergies: ['Aspirin', 'Ibuprofen'] },
  { id: 'EMG-004', patientId: 'PAT-008', patientName: 'Grace Garcia', triggeredBy: 'Dr. Emily Chen', status: 'RESOLVED', accessedAt: new Date(now.getTime() - 120 * 60 * 1000).toISOString(), resolvedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), staffId: 'USR-0002', bloodType: 'AB+', allergies: [] },
  { id: 'EMG-005', patientId: 'PAT-015', patientName: 'Mia Parker', triggeredBy: 'Dr. David Thompson', status: 'RESOLVED', accessedAt: new Date(now.getTime() - 240 * 60 * 1000).toISOString(), resolvedAt: new Date(now.getTime() - 180 * 60 * 1000).toISOString(), staffId: 'USR-0005', bloodType: 'O+', allergies: ['Codeine'] },
  { id: 'EMG-006', patientId: 'PAT-003', patientName: 'Alice Clark', triggeredBy: 'Dr. Mary Johnson', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 8 * 60 * 1000).toISOString(), bloodType: 'A-', allergies: ['Peanuts', 'Sulfa'] },
  { id: 'EMG-007', patientId: 'PAT-020', patientName: 'Amy Young', triggeredBy: 'Dr. William Brown', status: 'RESOLVED', accessedAt: new Date(now.getTime() - 360 * 60 * 1000).toISOString(), resolvedAt: new Date(now.getTime() - 300 * 60 * 1000).toISOString(), staffId: 'USR-0010', bloodType: 'B+', allergies: [] },
  { id: 'EMG-008', patientId: 'PAT-018', patientName: 'Wendy Underwood', triggeredBy: 'Nurse Linda Davis', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 3 * 60 * 1000).toISOString(), bloodType: 'AB-', allergies: ['Penicillin', 'Aspirin', 'Latex'] },
  { id: 'EMG-009', patientId: 'PAT-010', patientName: 'Jack Long', triggeredBy: 'Dr. Richard Taylor', status: 'ACTIVE', accessedAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString(), bloodType: 'O+', allergies: ['Sulfa'] },
  { id: 'EMG-010', patientId: 'PAT-025', patientName: 'Brian Ellis', triggeredBy: 'Dr. Kenneth Moore', status: 'RESOLVED', accessedAt: new Date(now.getTime() - 480 * 60 * 1000).toISOString(), resolvedAt: new Date(now.getTime() - 420 * 60 * 1000).toISOString(), staffId: 'USR-0015', bloodType: 'A+', allergies: [] },
];

export const queueEntries: QueueEntry[] = clinics.slice(0, 6).flatMap((clinic, ci) =>
  Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => {
    const pat = randomFrom(patients);
    return {
      id: `QUE-${String(ci * 10 + i + 1).padStart(3, '0')}`,
      clinicId: clinic.id,
      patientId: pat.id,
      patientName: pat.name,
      priority: randomFrom(['LOW', 'MEDIUM', 'MEDIUM', 'HIGH', 'CRITICAL'] as const),
      status: randomFrom(['WAITING', 'WAITING', 'WITH_DOCTOR', 'COMPLETED'] as const),
      waitTimeMinutes: Math.floor(Math.random() * 60) + 5,
      joinedAt: new Date(now.getTime() - Math.floor(Math.random() * 120) * 60 * 1000).toISOString(),
    };
  })
);

export const clinicFinance: Record<string, ClinicFinance[]> = {};
clinics.forEach(clinic => {
  clinicFinance[clinic.id] = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(now.getFullYear(), i, 1);
    const baseRevenue = Math.floor(Math.random() * 50000) + 30000;
    const baseExpenses = Math.floor(baseRevenue * (0.4 + Math.random() * 0.3));
    return {
      date: month.toISOString().slice(0, 7),
      revenue: baseRevenue,
      expenses: baseExpenses,
      appointments: Math.floor(Math.random() * 200) + 100 + i * 10,
    };
  });
});

export const emergencyAccessLogs: EmergencyAccessLog[] = Array.from({ length: 25 }, (_, i) => ({
  id: `EAL-${String(i + 1).padStart(3, '0')}`,
  patientName: `${randomFrom(PATIENT_FIRST_NAMES)} ${randomFrom(PATIENT_LAST_NAMES)}`,
  accessedBy: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
  accessType: randomFrom(ACCESS_TYPES),
  timestamp: randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now),
  status: randomFrom(['GRANTED', 'GRANTED', 'GRANTED', 'DENIED', 'PENDING'] as const),
}));

export const getDoctorById = (id: string): Doctor | undefined => doctors.find(d => d.id === id);
export const getClinicById = (id: string): Clinic | undefined => clinics.find(c => c.id === id);
export const getEmergencyAlerts = (): EmergencyAlert[] => [...emergencyAlerts];
export const resolveEmergencyAlert = (id: string): void => {
  const alert = emergencyAlerts.find(a => a.id === id);
  if (alert) { alert.status = 'RESOLVED'; alert.resolvedAt = new Date().toISOString(); }
};
export const getClinicQueue = (clinicId: string): QueueEntry[] => queueEntries.filter(q => q.clinicId === clinicId);
export const getDoctorPatients = (doctorId: string): Patient[] => {
  const doctorAppts = appointments.filter(a => a.doctorId === doctorId);
  return patients.filter(p => doctorAppts.some(a => a.patientId === p.id));
};
export const getDoctorAppointments = (doctorId: string): Appointment[] => appointments.filter(a => a.doctorId === doctorId);
export const getDoctorDiagnoses = (doctorId: string): Diagnosis[] => diagnoses.filter(d => d.doctorId === doctorId);
export const getDoctorPrescriptions = (doctorId: string): Prescription[] => prescriptions.filter(p => p.doctorId === doctorId);

export async function getDoctorDetail(id: string): Promise<DoctorDetail | null> {
  await delay(300);
  const doctor = doctors.find(d => d.id === id);
  if (!doctor) return null;
  const docAppts = appointments.filter(a => a.doctorId === id);
  const docPatients = patients.filter(p => docAppts.some(a => a.patientId === p.id));
  const docDiagnoses = diagnoses.filter(d => d.doctorId === id);
  const docPrescriptions = prescriptions.filter(p => p.doctorId === id);
  return { ...doctor, patients: docPatients, appointments: docAppts, diagnoses: docDiagnoses, prescriptions: docPrescriptions };
}

export async function getClinicDetail(id: string): Promise<{ clinic: Clinic; doctors: Doctor[]; queue: QueueEntry[]; appointments: Appointment[]; finance: ClinicFinance[] } | null> {
  await delay(300);
  const clinic = clinics.find(c => c.id === id);
  if (!clinic) return null;
  return {
    clinic,
    doctors: doctors.filter(d => d.clinic === clinic.name),
    queue: queueEntries.filter(q => q.clinicId === id),
    appointments: appointments.filter(a => a.clinicId === id),
    finance: clinicFinance[id] || [],
  };
}

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

// ========== LANDING PAGE DATA ==========

export const testimonials: Testimonial[] = [
  { id: 'TST-001', name: 'Dr. Sarah Chen', role: 'Cardiologist, Med-ID Central Hospital', avatar: 'SC', content: 'MED-ID has revolutionized how we access patient data. In emergency situations, every second counts, and this platform gives us instant access to critical medical information.', rating: 5 },
  { id: 'TST-002', name: 'James Rodriguez', role: 'Patient', avatar: 'JR', content: 'Having my entire medical history on my phone gives me peace of mind. The biometric security makes me feel confident that my data is safe.', rating: 5 },
  { id: 'TST-003', name: 'Dr. Emily Watson', role: 'Emergency Medicine Specialist', avatar: 'EW', content: 'The emergency access feature is a game-changer. When a patient comes in unconscious, we can immediately access blood type, allergies, and medications.', rating: 5 },
  { id: 'TST-004', name: 'Michael Park', role: 'Clinic Director, Green Valley Medical', avatar: 'MP', content: 'Implementing MED-ID across our network of 12 clinics has streamlined our operations and improved patient outcomes significantly.', rating: 4 },
  { id: 'TST-005', name: 'Lisa Thompson', role: 'Nurse, Riverside Medical Group', avatar: 'LT', content: 'The QR code system is incredibly intuitive. Patients love how easy it is to share their medical profiles securely.', rating: 5 },
];

export const partners: Partner[] = [
  { id: 'PTN-001', name: 'Med-ID Central Hospital', logo: 'MCH' },
  { id: 'PTN-002', name: 'Green Valley Medical', logo: 'GVM' },
  { id: 'PTN-003', name: 'Riverside Medical Group', logo: 'RMG' },
  { id: 'PTN-004', name: 'Pacific Health Alliance', logo: 'PHA' },
  { id: 'PTN-005', name: 'Summit Medical Group', logo: 'SMG' },
  { id: 'PTN-006', name: 'Crystal Run Healthcare', logo: 'CRH' },
  { id: 'PTN-007', name: 'North Star Medical', logo: 'NSM' },
  { id: 'PTN-008', name: 'Bay Area Medical Assoc.', logo: 'BAMA' },
];

export const blogPosts: BlogPost[] = [
  { id: 'BLG-001', title: 'The Future of Biometric Authentication in Healthcare', excerpt: 'How biometric technology is transforming patient data security and accessibility in modern healthcare systems.', content: 'Biometric authentication is rapidly becoming the gold standard for secure access control in healthcare...', author: 'Dr. Amanda Foster', category: 'Technology', image: '/blog/biometric.jpg', date: '2026-06-15', readTime: '5 min read' },
  { id: 'BLG-002', title: 'Emergency Medical Access: Why Every Second Matters', excerpt: 'In critical situations, immediate access to patient medical history can mean the difference between life and death.', content: 'Time is the most critical factor in emergency medicine. When a patient arrives at the ER unconscious...', author: 'Dr. Robert Kim', category: 'Emergency Care', image: '/blog/emergency.jpg', date: '2026-06-10', readTime: '4 min read' },
  { id: 'BLG-003', title: 'MED-ID OneID: Your Universal Medical Identity', excerpt: 'Introducing a unified medical identity system that works across all healthcare providers.', content: 'OneID is our latest innovation designed to create a seamless, universal medical identity...', author: 'Product Team', category: 'Product', image: '/blog/oneid.jpg', date: '2026-06-05', readTime: '6 min read' },
  { id: 'BLG-004', title: 'HIPAA Compliance in the Digital Age', excerpt: 'Understanding how MED-ID meets and exceeds HIPAA compliance requirements for patient data protection.', content: 'Data privacy and security are at the core of everything we build at MED-ID...', author: 'Sarah Mitchell', category: 'Security', image: '/blog/hipaa.jpg', date: '2026-05-28', readTime: '7 min read' },
  { id: 'BLG-005', title: 'Digital Prescriptions: The End of Paper Scripts', excerpt: 'How electronic prescribing is reducing errors and improving patient medication adherence.', content: 'The transition from paper prescriptions to digital formats is revolutionizing medication management...', author: 'Dr. James Wilson', category: 'Features', image: '/blog/prescriptions.jpg', date: '2026-05-20', readTime: '5 min read' },
  { id: 'BLG-006', title: 'Partner Spotlight: Med-ID Central Hospital', excerpt: 'How our flagship partner clinic is leveraging MED-ID to improve patient care across the board.', content: 'Med-ID Central Hospital has been at the forefront of adopting digital health solutions...', author: 'Editorial Team', category: 'Partners', image: '/blog/partner.jpg', date: '2026-05-15', readTime: '4 min read' },
];

export const faqItems: FAQItem[] = [
  { id: 'FAQ-001', question: 'What is MED-ID?', answer: 'MED-ID is a biometric medical identity platform that securely stores and provides instant access to your complete medical history. It uses advanced encryption and biometric authentication to ensure your data is always protected while being available when you need it most.', category: 'General' },
  { id: 'FAQ-002', question: 'How does biometric authentication work?', answer: 'MED-ID uses your unique biometric characteristics — fingerprint or facial recognition — to verify your identity. This ensures that only you can access your medical profile. The biometric data is stored locally on your device using secure enclave technology.', category: 'Security' },
  { id: 'FAQ-003', question: 'Is my medical data secure?', answer: 'Absolutely. MED-ID employs end-to-end encryption, biometric authentication, and complies with HIPAA and GDPR regulations. Your data is encrypted both in transit and at rest, and you have full control over who can access your information.', category: 'Security' },
  { id: 'FAQ-004', question: 'How does emergency access work?', answer: 'In an emergency, authorized medical staff can scan your MED-ID QR code or use your MED-ID number to access critical information like blood type, allergies, and chronic conditions. This access is logged and you receive an immediate notification.', category: 'Emergency' },
  { id: 'FAQ-005', question: 'Can I use MED-ID outside my country?', answer: 'Yes! MED-ID OneID is designed to work globally. Partner clinics and hospitals worldwide can access your medical information with your consent, making it ideal for travelers.', category: 'General' },
  { id: 'FAQ-006', question: 'What information is shared during emergency access?', answer: 'During emergency access, only vital information is shared: blood type, allergies, chronic diseases, current medications, and emergency contacts. Full medical history requires your explicit consent.', category: 'Emergency' },
  { id: 'FAQ-007', question: 'How do I get started?', answer: 'Simply download the MED-ID app from the App Store or Google Play, create your profile, and complete the biometric setup. The process takes less than 5 minutes. You can then share your MED-ID with your healthcare provider.', category: 'General' },
  { id: 'FAQ-008', question: 'Is MED-ID free?', answer: 'The basic MED-ID profile is free for all users. Premium features including expanded storage, family accounts, and advanced analytics are available through subscription plans.', category: 'General' },
  { id: 'FAQ-009', question: 'Can I add my family members?', answer: 'Yes, you can manage medical profiles for your children or elderly parents under your account. Each family member gets their own secure MED-ID profile.', category: 'General' },
  { id: 'FAQ-010', question: 'What happens if I lose my phone?', answer: 'Your MED-ID data is securely backed up in the cloud. You can restore your profile on a new device using your credentials and biometric verification. You can also remotely deactivate access from the web dashboard.', category: 'Security' },
];

export const features: Feature[] = [
  { id: 'FTR-001', title: 'Biometric Security', description: 'Fingerprint and facial recognition ensure only you can access your medical profile.', icon: 'shield' },
  { id: 'FTR-002', title: 'Emergency Access', description: 'First responders get vital info instantly via QR scan when every second counts.', icon: 'alert' },
  { id: 'FTR-003', title: 'Universal Medical ID', description: 'One identity that works across all healthcare providers and clinics.', icon: 'id' },
  { id: 'FTR-004', title: 'Digital Records', description: 'Store, manage, and share your medical documents securely from anywhere.', icon: 'file' },
  { id: 'FTR-005', title: 'Real-time Notifications', description: 'Instant alerts when your medical profile is accessed or updated.', icon: 'bell' },
  { id: 'FTR-006', title: 'Offline Access', description: 'Critical medical information available even without internet connection.', icon: 'wifi' },
];

export const siteStats = {
  totalUsers: 1250000,
  activeDoctors: 8600,
  partnerClinics: 3200,
  emergencyAccesses: 45800,
  documentsStored: 2500000,
  countriesReached: 45,
};

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(200); return [...testimonials];
}

export async function getPartners(): Promise<Partner[]> {
  await delay(200); return [...partners];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  await delay(300); return [...blogPosts];
}

export async function getBlogPost(id: string): Promise<BlogPost | undefined> {
  await delay(200); return blogPosts.find(p => p.id === id);
}

export async function getFAQItems(): Promise<FAQItem[]> {
  await delay(200); return [...faqItems];
}

export async function getFeatures(): Promise<Feature[]> {
  await delay(200); return [...features];
}

export async function getSiteStats(): Promise<typeof siteStats> {
  await delay(300); return { ...siteStats };
}

// ========== PATIENT WEB CABINET DATA ==========

export const patientProfiles: PatientProfile[] = [
  {
    id: 'PAT-001', name: 'John Anderson', email: 'john.anderson@email.com', phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15', gender: 'Male', bloodType: 'O+', height: '180 cm', weight: '78 kg',
    allergies: ['Penicillin', 'Sulfa'], chronicDiseases: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
    emergencyContacts: [
      { id: 'EC-001', patientId: 'PAT-001', name: 'Mary Anderson', relationship: 'Spouse', phone: '+1 (555) 234-5678', email: 'mary.anderson@email.com', isPrimary: true },
      { id: 'EC-002', patientId: 'PAT-001', name: 'Robert Anderson', relationship: 'Brother', phone: '+1 (555) 345-6789', email: 'robert.anderson@email.com', isPrimary: false },
    ],
    documents: [
      { id: 'DOC-001', patientId: 'PAT-001', name: 'Blood Test Results - Jun 2026', type: 'Lab Report', size: '2.4 MB', date: '2026-06-10', url: '#' },
      { id: 'DOC-002', patientId: 'PAT-001', name: 'Chest X-Ray - May 2026', type: 'X-Ray', size: '8.1 MB', date: '2026-05-22', url: '#' },
      { id: 'DOC-003', patientId: 'PAT-001', name: 'Cardiology Report - Apr 2026', type: 'Medical Record', size: '1.8 MB', date: '2026-04-15', url: '#' },
    ],
    sessions: [
      { id: 'SES-001', device: 'iPhone 15 Pro', browser: 'Safari', ip: '192.168.1.100', location: 'New York, US', lastActive: '2 minutes ago', isCurrent: true },
      { id: 'SES-002', device: 'MacBook Pro', browser: 'Chrome', ip: '192.168.1.101', location: 'New York, US', lastActive: '1 hour ago', isCurrent: false },
      { id: 'SES-003', device: 'Samsung Galaxy S24', browser: 'Chrome Mobile', ip: '10.0.0.45', location: 'Brooklyn, US', lastActive: '2 days ago', isCurrent: false },
    ],
    biometricEnabled: true,
  },
  {
    id: 'PAT-002', name: 'Diana Foster', email: 'diana.foster@email.com', phone: '+1 (555) 456-7890',
    dateOfBirth: '1992-07-22', gender: 'Female', bloodType: 'A+', height: '165 cm', weight: '62 kg',
    allergies: ['Latex'], chronicDiseases: ['Asthma'], medications: ['Albuterol inhaler as needed'],
    emergencyContacts: [
      { id: 'EC-003', patientId: 'PAT-002', name: 'David Foster', relationship: 'Husband', phone: '+1 (555) 567-8901', email: 'david.foster@email.com', isPrimary: true },
    ],
    documents: [
      { id: 'DOC-004', patientId: 'PAT-002', name: 'Pulmonary Function Test', type: 'Lab Report', size: '3.2 MB', date: '2026-06-05', url: '#' },
    ],
    sessions: [
      { id: 'SES-004', device: 'iPhone 14', browser: 'Safari', ip: '192.168.2.50', location: 'Los Angeles, US', lastActive: '5 minutes ago', isCurrent: true },
    ],
    biometricEnabled: true,
  },
  {
    id: 'PAT-003', name: 'Alice Clark', email: 'alice.clark@email.com', phone: '+1 (555) 678-9012',
    dateOfBirth: '1978-11-08', gender: 'Female', bloodType: 'A-', height: '170 cm', weight: '70 kg',
    allergies: ['Peanuts', 'Sulfa'], chronicDiseases: ['Hypothyroidism'], medications: ['Levothyroxine 75mcg daily'],
    emergencyContacts: [
      { id: 'EC-004', patientId: 'PAT-003', name: 'Tom Clark', relationship: 'Son', phone: '+1 (555) 789-0123', email: 'tom.clark@email.com', isPrimary: true },
    ],
    documents: [],
    sessions: [
      { id: 'SES-005', device: 'Pixel 8', browser: 'Chrome', ip: '172.16.0.10', location: 'Chicago, US', lastActive: '1 hour ago', isCurrent: true },
    ],
    biometricEnabled: false,
  },
];

export async function getPatientProfile(patientId: string): Promise<PatientProfile | undefined> {
  await delay(300); return patientProfiles.find(p => p.id === patientId);
}

export async function updatePatientProfile(patientId: string, data: Partial<PatientProfile>): Promise<PatientProfile | undefined> {
  await delay(400);
  const idx = patientProfiles.findIndex(p => p.id === patientId);
  if (idx === -1) return undefined;
  patientProfiles[idx] = { ...patientProfiles[idx], ...data };
  return patientProfiles[idx];
}

export async function getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  return profile?.documents || [];
}

export async function addPatientDocument(patientId: string, doc: Omit<PatientDocument, 'id'>): Promise<PatientDocument> {
  await delay(300);
  const newDoc: PatientDocument = { id: `DOC-${String(Math.floor(Math.random() * 9000) + 1000)}`, ...doc };
  const profile = patientProfiles.find(p => p.id === patientId);
  if (profile) profile.documents.unshift(newDoc);
  return newDoc;
}

export async function deletePatientDocument(patientId: string, docId: string): Promise<boolean> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  if (!profile) return false;
  const idx = profile.documents.findIndex(d => d.id === docId);
  if (idx === -1) return false;
  profile.documents.splice(idx, 1);
  return true;
}

export async function getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  return profile?.emergencyContacts || [];
}

export async function addEmergencyContact(patientId: string, contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
  await delay(300);
  const newContact: EmergencyContact = { id: `EC-${String(Math.floor(Math.random() * 9000) + 1000)}`, ...contact };
  const profile = patientProfiles.find(p => p.id === patientId);
  if (profile) {
    if (newContact.isPrimary) profile.emergencyContacts.forEach(c => c.isPrimary = false);
    profile.emergencyContacts.push(newContact);
  }
  return newContact;
}

export async function updateEmergencyContact(patientId: string, contactId: string, data: Partial<EmergencyContact>): Promise<EmergencyContact | undefined> {
  await delay(300);
  const profile = patientProfiles.find(p => p.id === patientId);
  if (!profile) return undefined;
  const idx = profile.emergencyContacts.findIndex(c => c.id === contactId);
  if (idx === -1) return undefined;
  if (data.isPrimary) profile.emergencyContacts.forEach(c => c.isPrimary = false);
  profile.emergencyContacts[idx] = { ...profile.emergencyContacts[idx], ...data };
  return profile.emergencyContacts[idx];
}

export async function deleteEmergencyContact(patientId: string, contactId: string): Promise<boolean> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  if (!profile) return false;
  const idx = profile.emergencyContacts.findIndex(c => c.id === contactId);
  if (idx === -1) return false;
  profile.emergencyContacts.splice(idx, 1);
  return true;
}

export async function getSecuritySessions(patientId: string): Promise<SecuritySession[]> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  return profile?.sessions || [];
}

export async function revokeSession(patientId: string, sessionId: string): Promise<boolean> {
  await delay(200);
  const profile = patientProfiles.find(p => p.id === patientId);
  if (!profile) return false;
  const idx = profile.sessions.findIndex(s => s.id === sessionId);
  if (idx === -1 || profile.sessions[idx].isCurrent) return false;
  profile.sessions.splice(idx, 1);
  return true;
}

// ========== EMERGENCY STAFF DATA ==========

export const emergencyStaffList: EmergencyStaff[] = [
  { id: 'ES-001', name: 'Dr. James Wilson', email: 'jwilson@emergency.medid.com', phone: '+1 (555) 111-0001', role: 'emergency_doctor', status: 'on_duty', clinic: 'Med-ID Central Hospital', createdAt: '2025-01-15' },
  { id: 'ES-002', name: 'Nurse Sarah Johnson', email: 'sjohnson@emergency.medid.com', phone: '+1 (555) 111-0002', role: 'emergency_nurse', status: 'on_duty', clinic: 'Med-ID Central Hospital', createdAt: '2025-03-20' },
  { id: 'ES-003', name: 'Paramedic Mike Torres', email: 'mtorres@emergency.medid.com', phone: '+1 (555) 111-0003', role: 'paramedic', status: 'available', clinic: 'Green Valley Medical Center', createdAt: '2025-02-10' },
  { id: 'ES-004', name: 'Dispatcher Lisa Park', email: 'lpark@emergency.medid.com', phone: '+1 (555) 111-0004', role: 'dispatcher', status: 'on_duty', clinic: 'Riverside Medical Group', createdAt: '2025-04-05' },
  { id: 'ES-005', name: 'Dr. Emily Chen', email: 'echen@emergency.medid.com', phone: '+1 (555) 111-0005', role: 'emergency_doctor', status: 'off_duty', clinic: 'Pinecrest Health Clinic', createdAt: '2025-01-01' },
  { id: 'ES-006', name: 'Nurse Robert Miller', email: 'rmiller@emergency.medid.com', phone: '+1 (555) 111-0006', role: 'emergency_nurse', status: 'available', clinic: 'Med-ID Central Hospital', createdAt: '2025-05-12' },
  { id: 'ES-007', name: 'Paramedic Jessica Lee', email: 'jlee@emergency.medid.com', phone: '+1 (555) 111-0007', role: 'paramedic', status: 'on_duty', clinic: 'Sunset Diagnostic Center', createdAt: '2025-06-01' },
  { id: 'ES-008', name: 'Dispatcher David Brown', email: 'dbrown@emergency.medid.com', phone: '+1 (555) 111-0008', role: 'dispatcher', status: 'available', clinic: 'Harbor Health Partners', createdAt: '2025-02-28' },
];

export async function getEmergencyStaffList(): Promise<EmergencyStaff[]> {
  await delay(300); return [...emergencyStaffList];
}

export async function getEmergencyStats(): Promise<{ totalAlerts: number; activeAlerts: number; resolvedToday: number; avgResponseTime: string }> {
  await delay(200);
  return { totalAlerts: emergencyAlerts.length, activeAlerts: emergencyAlerts.filter(a => a.status === 'ACTIVE').length, resolvedToday: 3, avgResponseTime: '4.5 min' };
}

export async function getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
  await delay(200); return emergencyAlerts.filter(a => a.status === 'ACTIVE');
}

// ========== CLINIC PANEL DATA ==========

export const clinicStaffList: Record<string, ClinicEmployee[]> = {};
clinics.slice(0, 6).forEach((clinic, ci) => {
  clinicStaffList[clinic.id] = Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => ({
    id: `EMP-${String(ci * 10 + i + 1).padStart(3, '0')}`,
    name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    email: `emp${ci * 10 + i + 1}@${clinic.name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: randomPhone(),
    role: randomFrom(['receptionist', 'nurse', 'administrator', 'technician'] as const),
    status: randomFrom(['active', 'active', 'active', 'inactive'] as const),
    clinicId: clinic.id,
    createdAt: randomDate(sixMonthsAgo, now),
  }));
});

export async function getClinicDashboardStats(clinicId: string): Promise<ClinicDashboardStats> {
  await delay(300);
  const q = queueEntries.filter(e => e.clinicId === clinicId);
  const appts = appointments.filter(a => a.clinicId === clinicId && a.date === todayStr);
  return {
    todayAppointments: appts.length,
    totalPatients: patients.length,
    totalDoctors: doctors.filter(d => d.clinic === clinics.find(c => c.id === clinicId)?.name).length,
    queueStatus: { waiting: q.filter(e => e.status === 'WAITING').length, withDoctor: q.filter(e => e.status === 'WITH_DOCTOR').length, completed: q.filter(e => e.status === 'COMPLETED').length },
    todayRevenue: Math.floor(Math.random() * 15000) + 5000,
  };
}

export async function getClinicStaff(clinicId: string): Promise<ClinicEmployee[]> {
  await delay(300); return clinicStaffList[clinicId] || [];
}

export async function addClinicStaff(clinicId: string, data: Omit<ClinicEmployee, 'id'>): Promise<ClinicEmployee> {
  await delay(300);
  const emp: ClinicEmployee = { id: `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`, ...data };
  if (!clinicStaffList[clinicId]) clinicStaffList[clinicId] = [];
  clinicStaffList[clinicId].unshift(emp);
  return emp;
}

export async function removeClinicStaff(clinicId: string, empId: string): Promise<boolean> {
  await delay(200);
  if (!clinicStaffList[clinicId]) return false;
  const idx = clinicStaffList[clinicId].findIndex(e => e.id === empId);
  if (idx === -1) return false;
  clinicStaffList[clinicId].splice(idx, 1);
  return true;
}

// ========== DOCTOR PANEL DATA ==========

export async function getDoctorDashboardStats(doctorId: string): Promise<DoctorDashboardStats> {
  await delay(300);
  const todayAppts = appointments.filter(a => a.doctorId === doctorId && a.date === todayStr);
  return {
    todayPatients: todayAppts.length,
    upcomingAppointments: appointments.filter(a => a.doctorId === doctorId && a.date >= todayStr && a.status === 'scheduled').length,
    pendingDiagnoses: Math.floor(Math.random() * 5) + 1,
    activePrescriptions: prescriptions.filter(p => p.doctorId === doctorId && p.status === 'active').length,
  };
}

export async function searchPatients(query: string): Promise<Patient[]> {
  await delay(300);
  const q = query.toLowerCase();
  return patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q));
}

export async function getPatientFullProfile(patientId: string): Promise<{
  patient: Patient | undefined;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  appointments: Appointment[];
  documents: PatientDocument[];
}> {
  await delay(400);
  const profile = patientProfiles.find(p => p.id === patientId);
  return {
    patient: patients.find(p => p.id === patientId),
    diagnoses: diagnoses.filter(d => d.patientId === patientId),
    prescriptions: prescriptions.filter(p => p.patientId === patientId),
    appointments: appointments.filter(a => a.patientId === patientId),
    documents: profile?.documents || [],
  };
}

export async function getTodayAppointments(doctorId: string): Promise<Appointment[]> {
  await delay(200);
  return appointments.filter(a => a.doctorId === doctorId && a.date === todayStr);
}

export async function getUpcomingAppointments(doctorId: string): Promise<Appointment[]> {
  await delay(200);
  return appointments.filter(a => a.doctorId === doctorId && a.date >= todayStr && a.status === 'scheduled').sort((a, b) => a.date.localeCompare(b.date));
}

export async function createDiagnosis(data: Omit<Diagnosis, 'id'>): Promise<Diagnosis> {
  await delay(300);
  const newDiag: Diagnosis = { id: `DIA-${String(diagnoses.length + 1).padStart(3, '0')}`, ...data };
  diagnoses.unshift(newDiag);
  return newDiag;
}

export async function createPrescription(data: Omit<Prescription, 'id'>): Promise<Prescription> {
  await delay(300);
  const newPre: Prescription = { id: `PRE-${String(prescriptions.length + 1).padStart(3, '0')}`, ...data };
  prescriptions.unshift(newPre);
  return newPre;
}

export async function getMyPatients(doctorId: string): Promise<Patient[]> {
  await delay(300);
  const docAppts = appointments.filter(a => a.doctorId === doctorId);
  return patients.filter(p => docAppts.some(a => a.patientId === p.id)).slice(0, 20);
}

// ========== QUEUE MANAGEMENT ==========

export async function updateQueueEntry(id: string, data: Partial<QueueEntry>): Promise<QueueEntry | null> {
  await delay(200);
  const idx = queueEntries.findIndex(q => q.id === id);
  if (idx === -1) return null;
  queueEntries[idx] = { ...queueEntries[idx], ...data };
  return queueEntries[idx];
}

export async function addToQueue(data: Omit<QueueEntry, 'id'>): Promise<QueueEntry> {
  await delay(200);
  const entry: QueueEntry = { id: `QUE-${String(queueEntries.length + 1).padStart(3, '0')}`, ...data };
  queueEntries.push(entry);
  return entry;
}

// ========== CONTACT MESSAGES ==========

export const contactMessages: ContactMessage[] = [];
export async function submitContactForm(data: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
  await delay(300);
  const msg: ContactMessage = { id: `MSG-${String(contactMessages.length + 1).padStart(3, '0')}`, ...data, createdAt: new Date().toISOString() };
  contactMessages.unshift(msg);
  return msg;
}
