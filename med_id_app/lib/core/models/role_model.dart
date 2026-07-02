enum Role {
  patient('Patient', 'Bemor'),
  doctor('Doctor', 'Shifokor'),
  emergencyStaff('Emergency Staff', 'Tez yordam'),
  clinic('Clinic', 'Klinika'),
  admin('Admin', 'Administrator');

  final String label;
  final String labelUz;
  const Role(this.label, this.labelUz);

  bool get canViewPatientData => this == doctor || this == emergencyStaff || this == admin;
  bool get canEditPatientData => this == patient || this == admin;
  bool get canManageUsers => this == admin;
  bool get canManageClinics => this == admin;
  bool get canAccessAdminPanel => this == admin;
  bool get isPatient => this == patient;
  bool get isDoctor => this == doctor;
  bool get isEmergency => this == emergencyStaff;
  bool get isClinic => this == clinic;
  bool get isAdmin => this == admin;
}
