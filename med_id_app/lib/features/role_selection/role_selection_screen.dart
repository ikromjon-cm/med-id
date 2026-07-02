import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/role_provider.dart';
import '../../core/models/role_model.dart';
import '../../core/widgets/glass_card.dart';

class RoleSelectionScreen extends ConsumerWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentRole = ref.watch(roleProvider);

    final roles = [
      _RoleData(Role.patient, Icons.person, 'Patient', 'Bemor', 'Tibbiy profilingizni boshqaring'),
      _RoleData(Role.doctor, Icons.medical_services, 'Doctor', 'Shifokor', 'Bemor ma\'lumotlarini ko\'ring'),
      _RoleData(Role.emergencyStaff, Icons.emergency, 'Emergency', 'Tez yordam', 'Favqulodda ma\'lumotlarga kirish'),
      _RoleData(Role.clinic, Icons.local_hospital, 'Clinic', 'Klinika', 'Klinika boshqaruvi'),
      _RoleData(Role.admin, Icons.admin_panel_settings, 'Admin', 'Administrator', 'To\'liq tizim boshqaruvi'),
    ];

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isDark
                ? [const Color(0xFF0D1117), const Color(0xFF161B22)]
                : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(color: const Color(0xFF0F6FFF).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.swap_horiz, size: 40, color: Color(0xFF0F6FFF)),
                  ),
                  const SizedBox(height: 16),
                  Text('Rolingizni tanlang', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                  const SizedBox(height: 8),
                  Text('Sizga mos interfeysni tanlang', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                  const SizedBox(height: 32),
                  ...roles.map((role) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      onTap: () {
                        ref.read(roleProvider.notifier).switchRole(role.role);
                        switch (role.role) {
                          case Role.admin: context.go('/admin/dashboard');
                          case Role.doctor: context.go('/doctor/dashboard');
                          case Role.clinic: context.go('/clinic/dashboard');
                          case Role.emergencyStaff: context.go('/emergency/dashboard');
                          case Role.patient: context.go('/patient/dashboard');
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: currentRole == role.role
                              ? Border.all(color: const Color(0xFF0F6FFF), width: 2)
                              : null,
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: currentRole == role.role
                                    ? const Color(0xFF0F6FFF).withValues(alpha: 0.1)
                                    : (isDark ? Colors.white12 : const Color(0xFFF0F4F8)),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(role.icon, size: 28, color: currentRole == role.role ? const Color(0xFF0F6FFF) : (isDark ? Colors.grey[400] : Colors.grey[600])),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(role.title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                  const SizedBox(height: 2),
                                  Text(role.subtitle, style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                ],
                              ),
                            ),
                            if (currentRole == role.role)
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: const BoxDecoration(color: Color(0xFF0F6FFF), shape: BoxShape.circle),
                                child: const Icon(Icons.check, size: 16, color: Colors.white),
                              ),
                          ],
                        ),
                      ),
                    ),
                  )),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleData {
  final Role role;
  final IconData icon;
  final String title;
  final String titleUz;
  final String subtitle;
  _RoleData(this.role, this.icon, this.title, this.titleUz, this.subtitle);
}
