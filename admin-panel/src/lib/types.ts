export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';
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
