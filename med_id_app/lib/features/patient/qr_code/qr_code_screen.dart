import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/constants/color_constants.dart';

class QrCodeScreen extends ConsumerWidget {
  const QrCodeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = ref.watch(authProvider).user;
    final qrData = 'MED-ID:${user?.id ?? 'user1'}:${user?.fullName ?? 'Unknown'}:${user?.bloodType ?? 'N/A'}';

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
            title: Text('My QR Code', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
            actions: [
              IconButton(
                icon: const Icon(Icons.camera_alt_outlined),
                onPressed: () => context.go('/patient/qr-scanner'),
                tooltip: 'Scan QR',
              ),
            ],
          ),
          body: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GlassCard(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        QrImageView(
                          data: qrData,
                          version: QrVersions.auto,
                          size: 220,
                          eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: ColorConstants.primary),
                          dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: ColorConstants.primary),
                        ),
                        const SizedBox(height: 20),
                        Text('Scan to view Medical Profile', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (user != null)
                    GlassCard(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Column(
                          children: [
                            _qrInfo('Name', user.fullName, isDark),
                            _qrInfo('Blood Type', user.bloodType ?? 'N/A', isDark),
                            _qrInfo('ID', user.id, isDark),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity, height: 52,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Share.share(qrData, subject: 'MED-ID Profile');
                      },
                      icon: const Icon(Icons.share),
                      label: Text('Share QR Code', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                      style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _qrInfo(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
          Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
        ],
      ),
    );
  }
}
