import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/theme_provider.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  final Set<String> _notificationToggles = {'appointments', 'emergency', 'insurance'};

  @override
  Widget build(BuildContext context) {
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
            title: Text('Sozlamalar', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                        title: Text('Tungi rejim', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Tungi/kunduzgi temani almashtirish', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        value: isDark,
                        onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(),
                        activeThumbColor: ColorConstants.primary,
                        secondary: Icon(isDark ? Icons.dark_mode : Icons.light_mode, color: ColorConstants.primary),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.language, color: ColorConstants.primary),
                        title: Text('Til', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('O\'zbekcha', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Til sozlamalari (demo)'))),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.security, color: ColorConstants.primary),
                        title: Text('Xavfsizlik', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Biometriya, PIN, Parol', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Xavfsizlik sozlamalari (demo)'))),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Oflayn rejim', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Ma\'lumotlarni keshda saqlash', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        value: false,
                        onChanged: (_) => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Oflayn rejim (demo)'))),
                        activeThumbColor: ColorConstants.primary,
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
                        child: Text('Bildirishnoma sozlamalari', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      ),
                      SwitchListTile(
                        title: Text('Uchrashuvlar', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: _notificationToggles.contains('appointments'),
                        onChanged: (v) => setState(() => v ? _notificationToggles.add('appointments') : _notificationToggles.remove('appointments')),
                        activeThumbColor: ColorConstants.primary,
                        secondary: const Icon(Icons.calendar_today, size: 20, color: ColorConstants.primary),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Favqulodda ogohlantirishlar', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: _notificationToggles.contains('emergency'),
                        onChanged: (v) => setState(() => v ? _notificationToggles.add('emergency') : _notificationToggles.remove('emergency')),
                        activeThumbColor: ColorConstants.emergency,
                        secondary: const Icon(Icons.warning, size: 20, color: ColorConstants.emergency),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Sug\'urta eslatmalari', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: _notificationToggles.contains('insurance'),
                        onChanged: (v) => setState(() => v ? _notificationToggles.add('insurance') : _notificationToggles.remove('insurance')),
                        activeThumbColor: ColorConstants.warning,
                        secondary: const Icon(Icons.verified_user, size: 20, color: ColorConstants.warning),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        title: Text('Hujjat yangilanishlari', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        value: _notificationToggles.contains('documents'),
                        onChanged: (v) => setState(() => v ? _notificationToggles.add('documents') : _notificationToggles.remove('documents')),
                        activeThumbColor: ColorConstants.primary,
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
                        child: Text('Tez kunda', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
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
                                child: Text('Tez kunda', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: ColorConstants.warning)),
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
                        title: Text('Kesh boshqaruvi', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Keshni tozalash: 12.5 MB', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => showDialog(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Keshni tozalash'),
                            content: const Text('Barcha kesh ma\'lumotlarini tozalashga ishonchingiz komilmi?'),
                            actions: [
                              TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Bekor qilish')),
                              ElevatedButton(onPressed: () { Navigator.of(ctx).pop(); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Kesh tozalandi'))); }, child: const Text('Tozalash')),
                            ],
                          ),
                        ),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.info_outline, color: ColorConstants.primary),
                        title: Text('Ilova haqida', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        subtitle: Text('Versiya 1.0.0', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => showAboutDialog(context: context, applicationName: 'MED-ID', applicationVersion: '1.0.0', applicationIcon: const ClipRRect(borderRadius: BorderRadius.all(Radius.circular(8)), child: SizedBox(width: 48, height: 48, child: Image(image: AssetImage('assets/images/logo.jpg')))), children: [const Text('Biometrik Tibbiy Platforma')]),
                      ),
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.help_outline, color: ColorConstants.primary),
                        title: Text('Yordam va qo\'llab-quvvatlash', style: GoogleFonts.inter(fontSize: 15, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        trailing: const Icon(Icons.chevron_right, size: 20),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Yordam va qo\'llab-quvvatlash (demo)'))),
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
                      if (context.mounted) context.go('/splash');
                    },
                    icon: const Icon(Icons.logout, color: ColorConstants.emergency),
                    label: Text('Chiqish', style: GoogleFonts.inter(fontSize: 16, color: ColorConstants.emergency)),
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
      _ComingSoonFeature(Icons.auto_awesome, 'AI Salomatlik Xulosasi', 'Intellektual salomatlik tahlili', const Color(0xFF7C3AED), '/coming-soon/ai-health'),
      _ComingSoonFeature(Icons.fingerprint, 'OneID Integratsiyasi', 'Yagona raqamli identifikatsiya', const Color(0xFF0F6FFF), '/coming-soon/oneid'),
      _ComingSoonFeature(Icons.description, 'Raqamli Retsept', 'QR orqali tasdiqlangan retseptlar', const Color(0xFF00C896), '/coming-soon/digital-prescription'),
      _ComingSoonFeature(Icons.nfc, 'NFC MED-ID', 'Kontaktsiz ma\'lumot almashish', const Color(0xFF0891B2), '/coming-soon/nfc'),
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
