import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/patient_provider.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/constants/color_constants.dart';
import 'widgets/profile_card.dart';
import 'widgets/quick_actions_card.dart';
import 'widgets/health_stats_chart.dart';

class PatientDashboardScreen extends ConsumerStatefulWidget {
  const PatientDashboardScreen({super.key});

  @override
  ConsumerState<PatientDashboardScreen> createState() => _PatientDashboardScreenState();
}

class _PatientDashboardScreenState extends ConsumerState<PatientDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(patientProvider.notifier).loadPatient('user1');
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final auth = ref.watch(authProvider);
    final patientState = ref.watch(patientProvider);

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark
              ? [const Color(0xFF0D1117), const Color(0xFF161B22)]
              : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
        ),
      ),
      child: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.read(patientProvider.notifier).loadPatient('user1'),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Assalomu alaykum', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                          Text(auth.user?.fullName ?? 'Aziz Karimov', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.notifications_outlined),
                            onPressed: () => context.go('/patient/notifications'),
                            color: isDark ? Colors.grey[400] : ColorConstants.textSecondary,
                          ),
                          IconButton(
                            icon: const Icon(Icons.settings_outlined),
                            onPressed: () => context.go('/settings'),
                            color: isDark ? Colors.grey[400] : ColorConstants.textSecondary,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                if (patientState.isLoading)
                  const ShimmerLoading(itemCount: 4)
                else if (patientState.error != null)
                  ErrorStateWidget(message: patientState.error, onRetry: () => ref.read(patientProvider.notifier).loadPatient('user1'))
                else ...[
                  FadeInLeft(
                    child: ProfileCard(
                      user: auth.user!,
                      onTap: () => context.go('/patient/medical-profile'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  FadeInRight(
                    child: HealthStatsChart(
                      allergies: auth.user?.allergies ?? [],
                      medications: auth.user?.currentMedications ?? [],
                      diseases: auth.user?.chronicDiseases ?? [],
                    ),
                  ),
                  const SizedBox(height: 16),
                      FadeInUp(
                        child: QuickActionsCard(
                          actions: [
                            QuickAction(icon: Icons.upload_file, label: 'Upload Document', color: ColorConstants.primary, onTap: () => context.go('/patient/documents/upload')),
                            QuickAction(icon: Icons.contacts, label: 'Emergency Contacts', color: ColorConstants.emergency, onTap: () => context.go('/patient/emergency-contacts')),
                            QuickAction(icon: Icons.qr_code, label: 'QR Code', color: const Color(0xFF00C896), onTap: () => context.go('/patient/qr-code')),
                            QuickAction(icon: Icons.history, label: 'Medical History', color: const Color(0xFFFFB020), onTap: () => context.go('/patient/medical-profile')),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      FadeInUp(
                        child: QuickActionsCard(
                          actions: [
                            QuickAction(icon: Icons.security, label: 'Access Logs', color: const Color(0xFF7C3AED), onTap: () => context.go('/patient/access-logs')),
                            QuickAction(icon: Icons.warning, label: 'Emergency Profile', color: ColorConstants.emergency, onTap: () => context.go('/patient/emergency-profile')),
                            QuickAction(icon: Icons.camera_alt, label: 'Scan QR', color: const Color(0xFF0891B2), onTap: () => context.go('/patient/qr-scanner')),
                            QuickAction(icon: Icons.description, label: 'Documents', color: const Color(0xFF0F6FFF), onTap: () => context.go('/patient/documents')),
                          ],
                        ),
                      ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

