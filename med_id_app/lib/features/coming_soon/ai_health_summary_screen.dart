import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/coming_soon_widget.dart';

class AiHealthSummaryScreen extends StatelessWidget {
  const AiHealthSummaryScreen({super.key});

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
            title: Text('AI Salomatlik Xulosasi', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: const ComingSoonWidget(
            featureName: 'AI Salomatlik Xulosasi',
            icon: Icons.auto_awesome,
            description: 'Get intelligent health summaries powered by AI. Analyze your medical history, lab results, and get personalized health insights and recommendations.',
          ),
        ),
      ),
    );
  }
}
