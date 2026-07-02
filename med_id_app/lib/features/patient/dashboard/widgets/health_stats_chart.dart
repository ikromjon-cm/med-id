import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/widgets/glass_card.dart';

class HealthStatsChart extends StatelessWidget {
  final List<String> allergies;
  final List<String> medications;
  final List<String> diseases;

  const HealthStatsChart({
    super.key,
    required this.allergies,
    required this.medications,
    required this.diseases,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final hasData = allergies.isNotEmpty || medications.isNotEmpty || diseases.isNotEmpty;

    if (!hasData) {
      return GlassCard(
        child: Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(Icons.bar_chart, size: 40, color: isDark ? Colors.grey[600] : Colors.grey[300]),
              const SizedBox(height: 8),
              Text('No health data yet', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
            ],
          ),
        ),
      );
    }

    final spots = [
      PieChartSectionData(value: allergies.length.toDouble(), color: const Color(0xFFFF4D4F), title: '${allergies.length}', radius: 40),
      PieChartSectionData(value: medications.length.toDouble(), color: const Color(0xFF0F6FFF), title: '${medications.length}', radius: 40),
      PieChartSectionData(value: diseases.length.toDouble(), color: const Color(0xFFFFB020), title: '${diseases.length}', radius: 40),
    ];

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Health Overview', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
          const SizedBox(height: 16),
          SizedBox(
            height: 140,
            child: Row(
              children: [
                Expanded(
                  child: PieChart(
                    PieChartData(sections: spots, centerSpaceRadius: 30, sectionsSpace: 2),
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _legendItem('Allergies', allergies.length, const Color(0xFFFF4D4F), isDark),
                    const SizedBox(height: 8),
                    _legendItem('Medications', medications.length, const Color(0xFF0F6FFF), isDark),
                    const SizedBox(height: 8),
                    _legendItem('Diseases', diseases.length, const Color(0xFFFFB020), isDark),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _legendItem(String label, int count, Color color, bool isDark) {
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3))),
        const SizedBox(width: 8),
        Text('$label ($count)', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[300] : Colors.grey[600])),
      ],
    );
  }
}
