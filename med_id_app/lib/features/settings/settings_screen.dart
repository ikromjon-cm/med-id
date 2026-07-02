import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/theme_provider.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final auth = ref.watch(authProvider);

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
            title: Text('Settings', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    children: [
                      ListTile(
                        leading: CircleAvatar(
                          backgroundColor: const Color(0xFF0F6FFF).withValues(alpha: 0.1),
                          child: Text(auth.user?.fullName[0] ?? 'U', style: GoogleFonts.inter(color: const Color(0xFF0F6FFF))),
                        ),
                        title: Text(auth.user?.fullName ?? 'User', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text(auth.user?.phone ?? '', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
                      SwitchListTile(
                        title: Text('Dark Mode', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Toggle dark/light theme', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        value: isDark,
                        onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(),
                        activeColor: ColorConstants.primary,
                        secondary: Icon(isDark ? Icons.dark_mode : Icons.light_mode, color: ColorConstants.primary),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.language, color: ColorConstants.primary),
                        title: Text('Language', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('English', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Language settings (demo)'))),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.security, color: ColorConstants.primary),
                        title: Text('Security', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Biometric, PIN, Password', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Security settings (demo)'))),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Offline Mode', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Cache data for offline access', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        value: false,
                        onChanged: (_) => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Offline mode (demo)'))),
                        activeColor: ColorConstants.primary,
                        secondary: const Icon(Icons.wifi_off, color: ColorConstants.primary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text('Notification Preferences', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      ),
                      SwitchListTile(
                        title: Text('Appointments', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: true, onChanged: (_) {},
                        activeColor: ColorConstants.primary,
                        secondary: const Icon(Icons.calendar_today, size: 20, color: ColorConstants.primary),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Emergency Alerts', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: true, onChanged: (_) {},
                        activeColor: ColorConstants.emergency,
                        secondary: const Icon(Icons.warning, size: 20, color: ColorConstants.emergency),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Insurance Reminders', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: true, onChanged: (_) {},
                        activeColor: ColorConstants.warning,
                        secondary: const Icon(Icons.verified_user, size: 20, color: ColorConstants.warning),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Document Updates', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: false, onChanged: (_) {},
                        activeColor: ColorConstants.primary,
                        secondary: const Icon(Icons.description, size: 20, color: ColorConstants.primary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text('Coming Soon', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      ),
                      ...() {
                        final features = _comingSoonFeatures(context, isDark);
                        return features.map((f) => Column(
                          children: [
                            ListTile(
                              leading: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(color: f.color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                child: Icon(f.icon, color: f.color, size: 22),
                              ),
                              title: Text(f.title, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              subtitle: Text(f.subtitle, style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(color: ColorConstants.warning.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
                                child: Text('Soon', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: ColorConstants.warning)),
                              ),
                              onTap: () => context.go(f.route),
                            ),
                            if (f != features.last) const Divider(height: 1),
                          ],
                        ));
                      }(),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.cleaning_services, color: ColorConstants.primary),
                        title: Text('Cache Management', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Clear cached data: 12.5 MB', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => showDialog(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Clear Cache'),
                            content: const Text('Are you sure you want to clear all cached data?'),
                            actions: [
                              TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Cancel')),
                              ElevatedButton(onPressed: () { Navigator.of(ctx).pop(); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Cache cleared'))); }, child: const Text('Clear')),
                            ],
                          ),
                        ),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.info_outline, color: ColorConstants.primary),
                        title: Text('About', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Version 1.0.0', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => showAboutDialog(context: context, applicationName: 'MED-ID', applicationVersion: '1.0.0', children: [const Text('Biometric Medical Platform')]),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.help_outline, color: ColorConstants.primary),
                        title: Text('Help & Support', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Help & Support (demo)'))),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      await ref.read(authProvider.notifier).logout();
                      if (context.mounted) context.go('/otp');
                    },
                    icon: const Icon(Icons.logout, color: ColorConstants.emergency),
                    label: Text('Logout', style: GoogleFonts.inter(fontSize: 16, color: ColorConstants.emergency)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: ColorConstants.emergency),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<_ComingSoonFeature> _comingSoonFeatures(BuildContext context, bool isDark) {
    return [
      _ComingSoonFeature(Icons.auto_awesome, 'AI Health Summary', 'Intelligent health insights', const Color(0xFF7C3AED), '/coming-soon/ai-health'),
      _ComingSoonFeature(Icons.fingerprint, 'OneID Integration', 'Unified digital identity', const Color(0xFF0F6FFF), '/coming-soon/oneid'),
      _ComingSoonFeature(Icons.description, 'Digital Prescription', 'QR-verified prescriptions', const Color(0xFF00C896), '/coming-soon/digital-prescription'),
      _ComingSoonFeature(Icons.nfc, 'NFC MED-ID', 'Contactless data sharing', const Color(0xFF0891B2), '/coming-soon/nfc'),
    ];
  }
}

class _ComingSoonFeature {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final String route;
  _ComingSoonFeature(this.icon, this.title, this.subtitle, this.color, this.route);
}
