import 'package:flutter_test/flutter_test.dart';
import 'package:med_id_app/core/models/role_model.dart';

void main() {
  testWidgets('Role enum has correct labels', (WidgetTester tester) async {
    expect(Role.patient.label, 'Patient');
    expect(Role.doctor.label, 'Doctor');
    expect(Role.clinic.label, 'Clinic');
    expect(Role.emergencyStaff.label, 'Emergency Staff');
    expect(Role.admin.label, 'Admin');
  });

  testWidgets('Role RBAC functions work correctly', (WidgetTester tester) async {
    expect(Role.admin.canManageUsers, isTrue);
    expect(Role.patient.canManageUsers, isFalse);
    expect(Role.doctor.canViewPatientData, isTrue);
    expect(Role.patient.canViewPatientData, isFalse);
    expect(Role.patient.isPatient, isTrue);
    expect(Role.doctor.isDoctor, isTrue);
    expect(Role.admin.isAdmin, isTrue);
  });
}
