import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/constants/color_constants.dart';

class MedicalProfileScreen extends ConsumerWidget {
  const MedicalProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final auth = ref.watch(authProvider);
    final user = auth.user;

    if (user == null) return const ShimmerLoading();
    final dateFormat = DateFormat('dd MMM yyyy');

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark ? [const Color(0xFF0D1117), const Color(0xFF161B22)] : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
        ),
      ),
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            title: Text('Tibbiy profil', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            centerTitle: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => context.go('/patient/medical-profile/edit'),
              ),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildSection('Shaxsiy ma\'lumotlar', [
                  _infoRow('To\'liq ism', user.fullName, Icons.person, isDark),
                  _infoRow('Jins', user.gender ?? 'Ko\'rsatilmagan', Icons.wc, isDark),
                  _infoRow('Tug\'ilgan sana', user.birthDate != null ? dateFormat.format(user.birthDate!) : 'Ko\'rsatilmagan', Icons.cake, isDark),
                  _infoRow('Qon guruhi', user.bloodType ?? 'Ko\'rsatilmagan', Icons.dangerous, isDark),
                  _infoRow('Telefon', user.phone, Icons.phone, isDark),
                  _infoRow('Email', user.email ?? 'Ko\'rsatilmagan', Icons.email, isDark),
                ], isDark),
                const SizedBox(height: 16),
                _buildSection('Allergiyalar', user.allergies.isEmpty
                    ? [_emptyItem('Allergiyalar qayd etilmagan', isDark)]
                    : user.allergies.map((a) => _chipItem(a, ColorConstants.emergency, isDark)).toList(), isDark),
                const SizedBox(height: 16),
                _buildSection('Surunkali kasalliklar', user.chronicDiseases.isEmpty
                    ? [_emptyItem('Surunkali kasalliklar yo\'q', isDark)]
                    : user.chronicDiseases.map((d) => _chipItem(d, const Color(0xFFFFB020), isDark)).toList(), isDark),
                const SizedBox(height: 16),
                _buildSection('Joriy dorilar', user.currentMedications.isEmpty
                    ? [_emptyItem('Dorilar yo\'q', isDark)]
                    : user.currentMedications.map((m) => _chipItem(m, ColorConstants.primary, isDark)).toList(), isDark),
                const SizedBox(height: 16),
                _buildSection('Sug\'urta ma\'lumotlari', [
                  _infoRow('Provayder', user.insuranceProvider ?? 'Ko\'rsatilmagan', Icons.business, isDark),
                  _infoRow('Polis raqami', user.insurancePolicyNumber ?? 'Ko\'rsatilmagan', Icons.numbers, isDark),
                  _infoRow('Amal qilish muddati', user.insuranceExpiry != null ? dateFormat.format(user.insuranceExpiry!) : 'Ko\'rsatilmagan', Icons.calendar_today, isDark),
                ], isDark),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children, bool isDark) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value, IconData icon, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 18, color: isDark ? Colors.grey[400] : Colors.grey[500]),
          const SizedBox(width: 10),
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(label, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _chipItem(String text, Color color, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
        child: Text(text, style: GoogleFonts.inter(fontSize: 14, color: color, fontWeight: FontWeight.w500)),
      ),
    );
  }

  Widget _emptyItem(String text, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(text, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[500] : Colors.grey[400], fontStyle: FontStyle.italic)),
    );
  }
}
