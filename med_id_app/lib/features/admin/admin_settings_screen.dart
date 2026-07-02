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
          appBar: AppBar(title: Text('System Settings', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    children: [
                      _settingTile('Maintenance Mode', 'System is operational', Icons.build, isDark, () => showSnack('Maintenance mode (demo)')),
                      const Divider(),
                      _settingTile('Emergency Mode', 'Disabled', Icons.warning, isDark, () => showSnack('Emergency mode (demo)')),
                      const Divider(),
                      _settingTile('Data Sync', 'Last synced: 5 min ago', Icons.sync, isDark, () => showSnack('Data sync (demo)')),
                      const Divider(),
                      _settingTile('Backup', 'Auto backup enabled', Icons.backup, isDark, () => showSnack('Backup (demo)')),
                      const Divider(),
                      SwitchListTile(
                        title: Text('Dark Mode', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: isDark,
                        onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(),
                        activeColor: ColorConstants.primary,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
                      _settingTile('System Version', 'v1.0.0 (Build 1)', Icons.info, isDark, null),
                      const Divider(),
                      _settingTile('API Endpoint', 'https://api.med-id.uz/v1', Icons.link, isDark, null),
                      const Divider(),
                      _settingTile('Database Status', 'Connected', Icons.storage, isDark, null),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => showSnack('Settings saved (demo)'),
                    icon: const Icon(Icons.save),
                    label: Text('Save Settings', style: GoogleFonts.inter(fontSize: 16)),
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
