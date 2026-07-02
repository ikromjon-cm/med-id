import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/coming_soon_widget.dart';

class NfcMedIdScreen extends StatelessWidget {
  const NfcMedIdScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
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
            title: Text('NFC MED-ID', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: const ComingSoonWidget(
            featureName: 'NFC MED-ID',
            icon: Icons.nfc,
            description: 'Tap your phone to share medical data via NFC. Quick access for emergencies with secure contactless data transfer.',
          ),
        ),
      ),
    );
  }
}
