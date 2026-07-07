import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/theme_provider.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class AdminSettingsScreen extends ConsumerWidget {
  const AdminSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final showSnack = (String msg) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark ? [const Color(0xFF0D1117), const Color(0xFF161B22)] : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
        ),
      ),
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(title: Text('Tizim sozlamalari', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    children: [
                      _settingTile('Texnik xizmat rejimi', 'Tizim ishlamoqda', Icons.build, isDark, () => showSnack('Texnik xizmat rejimi (demo)')),
                      const Divider(),
                      _settingTile('Favqulodda rejim', 'O\'chirilgan', Icons.warning, isDark, () => showSnack('Favqulodda rejim (demo)')),
                      const Divider(),
                      _settingTile('Ma\'lumot sinxronizatsiyasi', 'Oxirgi sinxronlash: 5 daqiqa oldin', Icons.sync, isDark, () => showSnack('Ma\'lumot sinxronizatsiyasi (demo)')),
                      const Divider(),
                      _settingTile('Zaxira nusxa', 'Avtomatik zaxira yoqilgan', Icons.backup, isDark, () => showSnack('Zaxira nusxa (demo)')),
                      const Divider(),
                      SwitchListTile(
                        title: Text('Dark Mode', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: isDark,
                        onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(),
                        activeThumbColor: ColorConstants.primary,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
                      _settingTile('Tizim versiyasi', 'v1.0.0 (Build 1)', Icons.info, isDark, null),
                      const Divider(),
                      _settingTile('API manzili', 'https://api.med-id.uz/v1', Icons.link, isDark, null),
                      const Divider(),
                      _settingTile('Ma\'lumotlar bazasi holati', 'Ulangan', Icons.storage, isDark, null),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => showSnack('Sozlamalar saqlandi (demo)'),
                    icon: const Icon(Icons.save),
                    label: Text('Sozlamalarni saqlash', style: GoogleFonts.inter(fontSize: 16)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: ColorConstants.primary,
                      side: const BorderSide(color: ColorConstants.primary),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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

  Widget _settingTile(String title, String subtitle, IconData icon, bool isDark, VoidCallback? onTap) {
    return ListTile(
      leading: Icon(icon, color: ColorConstants.primary),
      title: Text(title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
      subtitle: Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}
