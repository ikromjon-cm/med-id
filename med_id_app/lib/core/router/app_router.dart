import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../providers/role_provider.dart';
import '../models/role_model.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/otp_screen.dart';
import '../../features/auth/biometric_screen.dart';
import '../../features/role_selection/role_selection_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/patient/dashboard/patient_dashboard_screen.dart';
import '../../features/patient/medical_profile/medical_profile_screen.dart';
import '../../features/patient/medical_profile/medical_profile_edit_screen.dart';
import '../../features/patient/documents/documents_screen.dart';
import '../../features/patient/documents/document_preview_screen.dart';
import '../../features/patient/documents/document_upload_screen.dart';
import '../../features/patient/emergency_profile/emergency_profile_screen.dart';
import '../../features/patient/emergency_contacts/emergency_contacts_screen.dart';
import '../../features/patient/emergency_contacts/emergency_contact_edit_screen.dart';
import '../../features/patient/notifications/notifications_screen.dart';
import '../../features/patient/access_logs/access_logs_screen.dart';
import '../../features/patient/qr_code/qr_code_screen.dart';
import '../../features/patient/qr_code/qr_scanner_screen.dart';
import '../../features/admin/admin_dashboard_screen.dart';
import '../../features/admin/users_management_screen.dart';
import '../../features/admin/clinics_management_screen.dart';
import '../../features/admin/doctors_management_screen.dart';
import '../../features/admin/admin_analytics_screen.dart';
import '../../features/admin/admin_access_logs_screen.dart';
import '../../features/admin/admin_notifications_screen.dart';
import '../../features/admin/admin_settings_screen.dart';
import '../../features/doctor/doctor_dashboard_screen.dart';
import '../../features/doctor/doctor_patient_search_screen.dart';
import '../../features/doctor/doctor_patient_detail_screen.dart';
import '../../features/doctor/doctor_diagnosis_screen.dart';
import '../../features/doctor/doctor_prescription_screen.dart';
import '../../features/doctor/doctor_appointments_screen.dart';
import '../../features/clinic/clinic_dashboard_screen.dart';
import '../../features/clinic/clinic_queue_screen.dart';
import '../../features/clinic/clinic_doctor_schedule_screen.dart';
import '../../features/clinic/clinic_staff_screen.dart';
import '../../features/clinic/clinic_crm_screen.dart';
import '../../features/clinic/clinic_finance_screen.dart';
import '../../features/clinic/clinic_appointments_screen.dart';
import '../../features/emergency/emergency_dashboard_screen.dart';
import '../../features/emergency/emergency_active_screen.dart';
import '../../features/emergency/emergency_biometric_screen.dart';
import '../../features/emergency/emergency_profile_view_screen.dart';
import '../../features/coming_soon/ai_health_summary_screen.dart';
import '../../features/coming_soon/oneid_integration_screen.dart';
import '../../features/coming_soon/digital_prescription_screen.dart';
import '../../features/coming_soon/nfc_medid_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _patientNavigatorKey = GlobalKey<NavigatorState>();
final _doctorNavigatorKey = GlobalKey<NavigatorState>();
final _clinicNavigatorKey = GlobalKey<NavigatorState>();
final _emergencyNavigatorKey = GlobalKey<NavigatorState>();
final _adminNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);
  final role = ref.watch(roleProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final loggedIn = auth.status == AuthStatus.authenticated;
      final location = state.uri.toString();

      if (!loggedIn && location != '/splash' && location != '/onboarding' && location != '/otp' && location != '/biometric') {
        return '/splash';
      }

      if (loggedIn && (location == '/splash' || location == '/onboarding' || location == '/otp' || location == '/biometric' || location == '/role-selection')) {
        switch (role) {
          case Role.admin: return '/admin/dashboard';
          case Role.doctor: return '/doctor/dashboard';
          case Role.clinic: return '/clinic/dashboard';
          case Role.emergencyStaff: return '/emergency/dashboard';
          case Role.patient: return '/patient/dashboard';
        }
      }

      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/otp', builder: (_, __) => const OtpScreen()),
      GoRoute(path: '/biometric', builder: (_, __) => const BiometricScreen()),
      GoRoute(path: '/role-selection', builder: (_, __) => const RoleSelectionScreen()),
      GoRoute(path: '/settings', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SettingsScreen()),

      ShellRoute(
        navigatorKey: _patientNavigatorKey,
        builder: (context, state, child) => PatientShell(child: child),
        routes: [
          GoRoute(path: '/patient/dashboard', builder: (_, __) => const PatientDashboardScreen()),
          GoRoute(path: '/patient/medical-profile', builder: (_, __) => const MedicalProfileScreen()),
          GoRoute(path: '/patient/medical-profile/edit', builder: (_, __) => const MedicalProfileEditScreen()),
          GoRoute(path: '/patient/documents', builder: (_, __) => const DocumentsScreen()),
          GoRoute(path: '/patient/documents/preview', builder: (_, state) => DocumentPreviewScreen(docId: state.uri.queryParameters['id'] ?? '')),
          GoRoute(path: '/patient/documents/upload', builder: (_, __) => const DocumentUploadScreen()),
          GoRoute(path: '/patient/emergency-profile', builder: (_, __) => const EmergencyProfileScreen()),
          GoRoute(path: '/patient/emergency-contacts', builder: (_, __) => const EmergencyContactsScreen()),
          GoRoute(path: '/patient/emergency-contacts/edit', builder: (_, state) => EmergencyContactEditScreen(contactId: state.uri.queryParameters['id'])),
          GoRoute(path: '/patient/notifications', builder: (_, __) => const NotificationsScreen()),
          GoRoute(path: '/patient/access-logs', builder: (_, __) => const AccessLogsScreen()),
          GoRoute(path: '/patient/qr-code', builder: (_, __) => const QrCodeScreen()),
          GoRoute(path: '/patient/qr-scanner', builder: (_, __) => const QrScannerScreen()),
        ],
      ),

      ShellRoute(
        navigatorKey: _adminNavigatorKey,
        builder: (context, state, child) => AdminShell(child: child),
        routes: [
          GoRoute(path: '/admin/dashboard', builder: (_, __) => const AdminDashboardScreen()),
          GoRoute(path: '/admin/users', builder: (_, __) => const UsersManagementScreen()),
          GoRoute(path: '/admin/clinics', builder: (_, __) => const ClinicsManagementScreen()),
          GoRoute(path: '/admin/doctors', builder: (_, __) => const DoctorsManagementScreen()),
          GoRoute(path: '/admin/analytics', builder: (_, __) => const AdminAnalyticsScreen()),
          GoRoute(path: '/admin/access-logs', builder: (_, __) => const AdminAccessLogsScreen()),
          GoRoute(path: '/admin/notifications', builder: (_, __) => const AdminNotificationsScreen()),
          GoRoute(path: '/admin/settings', builder: (_, __) => const AdminSettingsScreen()),
        ],
      ),

      ShellRoute(
        navigatorKey: _doctorNavigatorKey,
        builder: (context, state, child) => DoctorShell(child: child),
        routes: [
          GoRoute(path: '/doctor/dashboard', builder: (_, __) => const DoctorDashboardScreen()),
          GoRoute(path: '/doctor/patient-search', builder: (_, __) => const DoctorPatientSearchScreen()),
          GoRoute(path: '/doctor/patient-detail/:id', builder: (_, state) => DoctorPatientDetailScreen(patientId: state.pathParameters['id'] ?? '')),
          GoRoute(path: '/doctor/diagnosis', builder: (_, __) => const DoctorDiagnosisScreen()),
          GoRoute(path: '/doctor/prescription', builder: (_, __) => const DoctorPrescriptionScreen()),
          GoRoute(path: '/doctor/appointments', builder: (_, __) => const DoctorAppointmentsScreen()),
        ],
      ),

      ShellRoute(
        navigatorKey: _clinicNavigatorKey,
        builder: (context, state, child) => ClinicShell(child: child),
        routes: [
          GoRoute(path: '/clinic/dashboard', builder: (_, __) => const ClinicDashboardScreen()),
          GoRoute(path: '/clinic/queue', builder: (_, __) => const ClinicQueueScreen()),
          GoRoute(path: '/clinic/doctor-schedule', builder: (_, __) => const ClinicDoctorScheduleScreen()),
          GoRoute(path: '/clinic/staff', builder: (_, __) => const ClinicStaffScreen()),
          GoRoute(path: '/clinic/crm', builder: (_, __) => const ClinicCrmScreen()),
          GoRoute(path: '/clinic/finance', builder: (_, __) => const ClinicFinanceScreen()),
          GoRoute(path: '/clinic/appointments', builder: (_, __) => const ClinicAppointmentsScreen()),
        ],
      ),

      ShellRoute(
        navigatorKey: _emergencyNavigatorKey,
        builder: (context, state, child) => EmergencyShell(child: child),
        routes: [
          GoRoute(path: '/emergency/dashboard', builder: (_, __) => const EmergencyDashboardScreen()),
          GoRoute(path: '/emergency/active', builder: (_, __) => const EmergencyActiveScreen()),
          GoRoute(path: '/emergency/biometric', builder: (_, __) => const EmergencyBiometricScreen()),
          GoRoute(path: '/emergency/profile/:id', builder: (_, state) => EmergencyProfileViewScreen(patientId: state.pathParameters['id'] ?? '')),
        ],
      ),

      GoRoute(path: '/coming-soon/ai-health', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AiHealthSummaryScreen()),
      GoRoute(path: '/coming-soon/oneid', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const OneIdIntegrationScreen()),
      GoRoute(path: '/coming-soon/digital-prescription', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const DigitalPrescriptionScreen()),
      GoRoute(path: '/coming-soon/nfc', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const NfcMedIdScreen()),
    ],
  );
});

class PatientShell extends ConsumerWidget {
  final Widget child;
  const PatientShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.toString();
    int currentIndex = 0;
    if (location.startsWith('/patient/documents')) currentIndex = 1;
    else if (location.startsWith('/patient/emergency')) currentIndex = 2;
    else if (location.startsWith('/patient/notifications')) currentIndex = 3;
    else if (location.startsWith('/patient/qr') || location.startsWith('/patient/access') || location.startsWith('/patient/medical') || location.startsWith('/settings')) currentIndex = 4;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/patient/dashboard');
              case 1: context.go('/patient/documents');
              case 2: context.go('/patient/emergency-profile');
              case 3: context.go('/patient/notifications');
              case 4: context.go('/patient/qr-code');
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.description_outlined), activeIcon: Icon(Icons.description), label: 'Documents'),
            BottomNavigationBarItem(icon: Icon(Icons.warning_amber_outlined), activeIcon: Icon(Icons.warning_amber), label: 'Emergency'),
            BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Alerts'),
            BottomNavigationBarItem(icon: Icon(Icons.more_horiz), activeIcon: Icon(Icons.more_horiz), label: 'More'),
          ],
        ),
      ),
    );
  }
}

class AdminShell extends ConsumerWidget {
  final Widget child;
  const AdminShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.toString();
    int currentIndex = 0;
    if (location.startsWith('/admin/users') || location.startsWith('/admin/clinics') || location.startsWith('/admin/doctors')) currentIndex = 1;
    else if (location.startsWith('/admin/analytics')) currentIndex = 2;
    else if (location.startsWith('/admin/access-logs')) currentIndex = 3;
    else if (location.startsWith('/admin/notifications') || location.startsWith('/admin/settings')) currentIndex = 4;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/admin/dashboard');
              case 1: context.go('/admin/users');
              case 2: context.go('/admin/analytics');
              case 3: context.go('/admin/access-logs');
              case 4: context.go('/admin/notifications');
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.people_outline), activeIcon: Icon(Icons.people), label: 'Users'),
            BottomNavigationBarItem(icon: Icon(Icons.analytics_outlined), activeIcon: Icon(Icons.analytics), label: 'Analytics'),
            BottomNavigationBarItem(icon: Icon(Icons.security_outlined), activeIcon: Icon(Icons.security), label: 'Logs'),
            BottomNavigationBarItem(icon: Icon(Icons.settings_outlined), activeIcon: Icon(Icons.settings), label: 'More'),
          ],
        ),
      ),
    );
  }
}

class DoctorShell extends ConsumerWidget {
  final Widget child;
  const DoctorShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.toString();
    int currentIndex = 0;
    if (location.startsWith('/doctor/patient-search') || location.startsWith('/doctor/patient-detail') || location.startsWith('/doctor/diagnosis') || location.startsWith('/doctor/prescription')) currentIndex = 1;
    else if (location.startsWith('/doctor/appointments')) currentIndex = 2;
    else if (location.startsWith('/emergency')) currentIndex = 3;
    else if (location.startsWith('/settings')) currentIndex = 4;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/doctor/dashboard');
              case 1: context.go('/doctor/patient-search');
              case 2: context.go('/doctor/appointments');
              case 3: context.go('/emergency/dashboard');
              case 4: context.go('/settings');
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.people_outline), activeIcon: Icon(Icons.people), label: 'Patients'),
            BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), activeIcon: Icon(Icons.calendar_month), label: 'Appointments'),
            BottomNavigationBarItem(icon: Icon(Icons.warning_amber_outlined), activeIcon: Icon(Icons.warning_amber), label: 'Emergency'),
            BottomNavigationBarItem(icon: Icon(Icons.more_horiz), activeIcon: Icon(Icons.more_horiz), label: 'More'),
          ],
        ),
      ),
    );
  }
}

class ClinicShell extends ConsumerWidget {
  final Widget child;
  const ClinicShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.toString();
    int currentIndex = 0;
    if (location.startsWith('/clinic/queue')) currentIndex = 1;
    else if (location.startsWith('/clinic/doctor-schedule') || location.startsWith('/clinic/staff') || location.startsWith('/clinic/crm') || location.startsWith('/clinic/appointments')) currentIndex = 2;
    else if (location.startsWith('/clinic/finance')) currentIndex = 3;
    else if (location.startsWith('/settings')) currentIndex = 4;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/clinic/dashboard');
              case 1: context.go('/clinic/queue');
              case 2: context.go('/clinic/doctor-schedule');
              case 3: context.go('/clinic/finance');
              case 4: context.go('/settings');
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.queue_outlined), activeIcon: Icon(Icons.queue), label: 'Queue'),
            BottomNavigationBarItem(icon: Icon(Icons.schedule_outlined), activeIcon: Icon(Icons.schedule), label: 'Schedule'),
            BottomNavigationBarItem(icon: Icon(Icons.account_balance_outlined), activeIcon: Icon(Icons.account_balance), label: 'Finance'),
            BottomNavigationBarItem(icon: Icon(Icons.more_horiz), activeIcon: Icon(Icons.more_horiz), label: 'More'),
          ],
        ),
      ),
    );
  }
}

class EmergencyShell extends ConsumerWidget {
  final Widget child;
  const EmergencyShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.toString();
    int currentIndex = 0;
    if (location.startsWith('/emergency/active')) currentIndex = 1;
    else if (location.startsWith('/emergency/biometric') || location.startsWith('/emergency/profile')) currentIndex = 2;
    else if (location.startsWith('/patient/notifications') || location.startsWith('/settings')) currentIndex = 3;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/emergency/dashboard');
              case 1: context.go('/emergency/active');
              case 2: context.go('/emergency/biometric');
              case 3: context.go('/settings');
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.emergency_outlined), activeIcon: Icon(Icons.emergency), label: 'Active'),
            BottomNavigationBarItem(icon: Icon(Icons.fingerprint), activeIcon: Icon(Icons.fingerprint), label: 'Biometric'),
            BottomNavigationBarItem(icon: Icon(Icons.more_horiz), activeIcon: Icon(Icons.more_horiz), label: 'More'),
          ],
        ),
      ),
    );
  }
}
