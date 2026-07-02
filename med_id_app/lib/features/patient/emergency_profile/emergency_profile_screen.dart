import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/constants/color_constants.dart';

class EmergencyProfileScreen extends ConsumerWidget {
  const EmergencyProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = ref.watch(authProvider).user;

    if (user == null) return const SizedBox();

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark
              ? [const Color(0xFF1A0A0A), const Color(0xFF0D1117)]
              : [const Color(0xFFFFF0F0), const Color(0xFFF8FAFC)],
        ),
      ),
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            title: Text('Emergency Profile', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: ColorConstants.emergency)),
            centerTitle: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: ColorConstants.emergency.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: ColorConstants.emergency.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 60, height: 60,
                        decoration: BoxDecoration(color: ColorConstants.emergency, borderRadius: BorderRadius.circular(16)),
                        child: const Icon(Icons.warning, size: 32, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('EMERGENCY MODE', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: ColorConstants.emergency)),
                            Text('Shoshilinch tibbiy ma\'lumot', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[600])),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Patient Information', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      const SizedBox(height: 12),
                      _eRow('Full Name', user.fullName, isDark),
                      _eRow('Blood Type', user.bloodType ?? 'Not set', isDark),
                      _eRow('Phone', user.phone, isDark),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Medical Alerts', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      const SizedBox(height: 12),
                      if (user.allergies.isEmpty)
                        _eRow('Allergies', 'None recorded', isDark)
                      else
                        ...user.allergies.map((a) => _chipRow('Allergy', a, ColorConstants.emergency, isDark)),
                      if (user.chronicDiseases.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        ...user.chronicDiseases.map((d) => _chipRow('Condition', d, const Color(0xFFFFB020), isDark)),
                      ],
                      if (user.currentMedications.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        ...user.currentMedications.map((m) => _chipRow('Medication', m, ColorConstants.primary, isDark)),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Emergency Contacts', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      const SizedBox(height: 12),
                      Text('View full contacts in Emergency Contacts section', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Emergency profile link copied')));
                    },
                    icon: const Icon(Icons.share),
                    label: Text('OPEN EMERGENCY PROFILE', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ColorConstants.emergency,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _eRow(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
          Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
        ],
      ),
    );
  }

  Widget _chipRow(String label, String value, Color color, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
            child: Text(label, style: GoogleFonts.inter(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(width: 8),
          Text(value, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
        ],
      ),
    );
  }
}
