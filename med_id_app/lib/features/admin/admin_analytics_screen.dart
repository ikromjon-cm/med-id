import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';

class AdminAnalyticsScreen extends ConsumerStatefulWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  ConsumerState<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends ConsumerState<AdminAnalyticsScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    _stats = await MockApiService().getAdminStats();
    if (mounted) setState(() => _loading = false);
  }

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
          appBar: AppBar(title: Text('Analitika', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: _loading
              ? const ShimmerLoading(itemCount: 4)
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Favqulodda kirishlar soni', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                            const SizedBox(height: 16),
                            SizedBox(
                              height: 200,
                              child: LineChart(
                                LineChartData(
                                  gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 10, getDrawingHorizontalLine: (_) => FlLine(color: isDark ? Colors.white10 : Colors.grey[200]!, strokeWidth: 1)),
                                  titlesData: FlTitlesData(
                                    bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, _) => Text(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][v.toInt()], style: GoogleFonts.inter(fontSize: 9, color: isDark ? Colors.grey[400] : Colors.grey[500])))),
                                    leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30, getTitlesWidget: (v, _) => Text('${v.toInt()}', style: GoogleFonts.inter(fontSize: 10, color: isDark ? Colors.grey[500] : Colors.grey[400])))),
                                  ),
                                  borderData: FlBorderData(show: false),
                                  lineBarsData: [
                                    LineChartBarData(
                                      spots: List.generate(12, (i) => FlSpot(i.toDouble(), ((_stats ?? {})['emergencyAccessCount'] as List? ?? [])[i].toDouble())),
                                      isCurved: true,
                                      color: const Color(0xFFFF4D4F),
                                      barWidth: 3,
                                      dotData: FlDotData(show: false),
                                      belowBarData: BarAreaData(show: true, color: const Color(0xFFFF4D4F).withValues(alpha: 0.1)),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Oylik o\'sish', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                            const SizedBox(height: 16),
                            SizedBox(
                              height: 200,
                              child: BarChart(
                                BarChartData(
                                  alignment: BarChartAlignment.spaceAround,
                                  maxY: 200,
                                  barGroups: List.generate(12, (i) => BarChartGroupData(x: i, barRods: [BarChartRodData(toY: ((_stats ?? {})['monthlyGrowth'] as List? ?? [])[i].toDouble(), color: const Color(0xFF0F6FFF), width: 12, borderRadius: const BorderRadius.vertical(top: Radius.circular(4)))])),
                                  titlesData: FlTitlesData(show: true, bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, _) => Text(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][v.toInt()], style: GoogleFonts.inter(fontSize: 9, color: isDark ? Colors.grey[400] : Colors.grey[500])))), leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30, getTitlesWidget: (v, _) => Text('${v.toInt()}', style: GoogleFonts.inter(fontSize: 10, color: isDark ? Colors.grey[500] : Colors.grey[400]))))),
                                  borderData: FlBorderData(show: false),
                                  gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 50, getDrawingHorizontalLine: (_) => FlLine(color: isDark ? Colors.white10 : Colors.grey[200]!, strokeWidth: 1)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      GlassCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Hujjat taqsimoti', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                            const SizedBox(height: 16),
                            SizedBox(
                              height: 200,
                              child: PieChart(
                                PieChartData(
                                  sectionsSpace: 2,
                                  centerSpaceRadius: 40,
                                  sections: [
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['lab'] ?? 0).toDouble(), color: const Color(0xFF7C3AED), title: 'Lab', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['prescription'] ?? 0).toDouble(), color: const Color(0xFF0F6FFF), title: 'Rx', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['vaccination'] ?? 0).toDouble(), color: const Color(0xFF00C896), title: 'Vax', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['mri'] ?? 0).toDouble(), color: const Color(0xFFFFB020), title: 'MRI', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['ct'] ?? 0).toDouble(), color: const Color(0xFFFF4D4F), title: 'CT', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                    PieChartSectionData(value: (((_stats ?? {})['documentStats'] as Map? ?? {})['insurance'] ?? 0).toDouble(), color: const Color(0xFF0891B2), title: 'Ins', titleStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white), radius: 45),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}
