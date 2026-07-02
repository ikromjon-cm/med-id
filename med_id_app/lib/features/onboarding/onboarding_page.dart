import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OnboardingPage extends StatelessWidget {
  final String image;
  final String title;
  final String description;

  const OnboardingPage({
    super.key,
    required this.image,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: isDark ? Colors.white12 : const Color(0xFFE8F0FE),
              borderRadius: BorderRadius.circular(40),
            ),
            child: Icon(getIconForImage(), size: 80, color: const Color(0xFF0F6FFF)),
          ),
          const SizedBox(height: 48),
          Text(title, style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          Text(description, style: GoogleFonts.inter(fontSize: 16, color: isDark ? Colors.grey[400] : const Color(0xFF6B7280), height: 1.5), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  IconData getIconForImage() {
    if (title.contains('xavfsiz')) return Icons.security;
    if (title.contains('Biometrik')) return Icons.fingerprint;
    return Icons.emergency;
  }
}
