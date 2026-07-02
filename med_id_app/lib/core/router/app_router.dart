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
import '../../features/settings/settings_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _patientNavigatorKey = GlobalKey<NavigatorState>();
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

      if (loggedIn && (location == '/splash' || location == '/onboarding' || location == '/otp' || location == '/biometric')) {
        if (role == Role.admin) return '/admin/dashboard';
        return '/patient/dashboard';
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
