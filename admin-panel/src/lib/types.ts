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
