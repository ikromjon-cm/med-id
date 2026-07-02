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
                      ListTile(
                        leading: const Icon(Icons.notifications, color: ColorConstants.primary),
                        title: Text('Notifications', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Manage notification preferences', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Notification settings (demo)'))),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
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
}
