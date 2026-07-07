export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient' | 'emergency_staff';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  doctorsCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinic: string;
  status: 'active' | 'inactive' | 'on-leave';
  patients: number;
}

export interface AccessLog {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
}

export interface Notification {
  id: string;
  type: 'Alert' | 'Reminder' | 'Update' | 'Emergency';
  title: string;
  message: string;
  recipients: string[];
  status: 'Sent' | 'Pending' | 'Failed';
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalClinics: number;
  totalDocuments: number;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Diagnosis {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  condition: string;
  notes: string;
  date: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface DoctorDetail extends Omit<Doctor, 'patients'> {
  patients: Patient[];
  appointments: Appointment[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  patientName: string;
  triggeredBy: string;
  status: 'ACTIVE' | 'RESOLVED';
  accessedAt: string;
  resolvedAt?: string;
  staffId?: string;
  bloodType: string;
  allergies: string[];
}

export interface QueueEntry {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED';
  waitTimeMinutes: number;
  joinedAt: string;
}

export interface ClinicFinance {
  date: string;
  revenue: number;
  expenses: number;
  appointments: number;
}

export interface EmergencyAccessLog {
  id: string;
  patientName: string;
  accessedBy: string;
  accessType: string;
  timestamp: string;
  status: 'GRANTED' | 'DENIED' | 'PENDING';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface EmergencyStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'paramedic' | 'emergency_doctor' | 'emergency_nurse' | 'dispatcher';
  status: 'available' | 'on_duty' | 'off_duty';
  clinic: string;
  createdAt: string;
}

export interface ClinicEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'receptionist' | 'nurse' | 'administrator' | 'technician';
  status: 'active' | 'inactive';
  clinicId: string;
  createdAt: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: 'Lab Report' | 'MRI' | 'CT' | 'X-Ray' | 'Prescription' | 'Medical Record' | 'Other';
  size: string;
  date: string;
  url: string;
}

export interface EmergencyContact {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  chronicDiseases: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  documents: PatientDocument[];
  sessions: SecuritySession[];
  biometricEnabled: boolean;
}

export interface ClinicDashboardStats {
  todayAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  queueStatus: { waiting: number; withDoctor: number; completed: number };
  todayRevenue: number;
}

export interface DoctorDashboardStats {
  todayPatients: number;
  upcomingAppointments: number;
  pendingDiagnoses: number;
  activePrescriptions: number;
}
