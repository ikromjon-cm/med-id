import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'glass_card.dart';
import '../constants/color_constants.dart';

class ComingSoonWidget extends StatelessWidget {
  final String featureName;
  final IconData icon;
  final String description;

  const ComingSoonWidget({
    super.key,
    required this.featureName,
    required this.icon,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GlassCard(
              child: Container(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: ColorConstants.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Stack(
                        children: [
                          Icon(icon, size: 64, color: ColorConstants.primary),
                          Positioned(
                            top: 0, right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: ColorConstants.warning,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.lock, size: 16, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: ColorConstants.warning.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('Coming Soon',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: ColorConstants.warning),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(featureName,
                      style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(description,
                      style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500]),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    Icon(Icons.construction, size: 40, color: isDark ? Colors.grey[600] : Colors.grey[300]),
                    const SizedBox(height: 12),
                    Text('We\'re working on this feature',
                      style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
