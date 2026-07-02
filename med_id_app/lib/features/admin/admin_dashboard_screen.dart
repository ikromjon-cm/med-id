import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/constants/color_constants.dart';

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => _loading = true);
    final stats = await MockApiService().getAdminStats();
    if (mounted) setState(() { _stats = stats; _loading = false; });
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
          appBar: AppBar(
            title: Text('Admin Dashboard', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 6)
              : RefreshIndicator(
                  onRefresh: _loadStats,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FadeInDown(
                          child: Text('Overview', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        ),
                        const SizedBox(height: 16),
                        FadeInLeft(
                          child: Row(
                            children: [
                              _statCard('Patients', '${_stats!['totalPatients']}', Icons.people, const Color(0xFF0F6FFF), isDark),
                              const SizedBox(width: 12),
                              _statCard('Doctors', '${_stats!['totalDoctors']}', Icons.medical_services, const Color(0xFF00C896), isDark),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        FadeInRight(
                          child: Row(
                            children: [
                              _statCard('Clinics', '${_stats!['totalClinics']}', Icons.local_hospital, const Color(0xFFFFB020), isDark),
                              const SizedBox(width: 12),
                              _statCard('Documents', '${_stats!['totalDocuments']}', Icons.description, const Color(0xFF7C3AED), isDark),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),
                        FadeInUp(
                          child: GlassCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Users Growth (Monthly)', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                const SizedBox(height: 16),
                                SizedBox(
                                  height: 180,
                                  child: BarChart(
                                    BarChartData(
                                      alignment: BarChartAlignment.spaceAround,
                                      maxY: 200,
                                      barGroups: List.generate(12, (i) => BarChartGroupData(
                                        x: i,
                                        barRods: [BarChartRodData(toY: (_stats!['monthlyGrowth'] as List)[i].toDouble(), color: ColorConstants.primary, width: 14, borderRadius: const BorderRadius.vertical(top: Radius.circular(4)))],
                                      )),
                                      titlesData: FlTitlesData(show: true, bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, _) => Text(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][v.toInt()], style: GoogleFonts.inter(fontSize: 9, color: isDark ? Colors.grey[400] : Colors.grey[500])))), leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30, getTitlesWidget: (v, _) => Text('${v.toInt()}', style: GoogleFonts.inter(fontSize: 10, color: isDark ? Colors.grey[500] : Colors.grey[400]))))),
                                      borderData: FlBorderData(show: false),
                                      gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 50, getDrawingHorizontalLine: (_) => FlLine(color: isDark ? Colors.white10 : Colors.grey[200]!, strokeWidth: 1)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        FadeInUp(
                          child: GlassCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Document Statistics', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                const SizedBox(height: 16),
                                SizedBox(
                                  height: 160,
                                  child: PieChart(
                                    PieChartData(
                                      sectionsSpace: 2,
                                      centerSpaceRadius: 35,
                                      sections: [
                                        _pieSection('Lab', (_stats!['documentStats'] as Map)['lab'], const Color(0xFF7C3AED)),
                                        _pieSection('Prescription', (_stats!['documentStats'] as Map)['prescription'], const Color(0xFF0F6FFF)),
                                        _pieSection('Vaccination', (_stats!['documentStats'] as Map)['vaccination'], const Color(0xFF00C896)),
                                        _pieSection('MRI', (_stats!['documentStats'] as Map)['mri'], const Color(0xFFFFB020)),
                                        _pieSection('CT', (_stats!['documentStats'] as Map)['ct'], const Color(0xFFFF4D4F)),
                                        _pieSection('Insurance', (_stats!['documentStats'] as Map)['insurance'], const Color(0xFF0891B2)),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        FadeInUp(
                          child: GlassCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Role Distribution', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                const SizedBox(height: 12),
                                _roleBar('Patients', (_stats!['roleStats'] as Map)['patient'], const Color(0xFF0F6FFF), isDark),
                                _roleBar('Doctors', (_stats!['roleStats'] as Map)['doctor'], const Color(0xFF00C896), isDark),
                                _roleBar('Clinics', (_stats!['roleStats'] as Map)['clinic'], const Color(0xFFFFB020), isDark),
                                _roleBar('Emergency', (_stats!['roleStats'] as Map)['emergency'], const Color(0xFFFF4D4F), isDark),
                                _roleBar('Admins', (_stats!['roleStats'] as Map)['admin'], const Color(0xFF7C3AED), isDark),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
        ),
      ),
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color, bool isDark) {
    return Expanded(
      child: GlassCard(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, size: 24, color: color),
            ),
            const SizedBox(height: 8),
            Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
          ],
        ),
      ),
    );
  }

  PieChartSectionData _pieSection(String title, dynamic value, Color color) {
    return PieChartSectionData(value: value?.toDouble() ?? 0, color: color, title: '$value', titleStyle: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white), radius: 40);
  }

  Widget _roleBar(String label, dynamic value, Color color, bool isDark) {
    final total = ((_stats!['roleStats'] as Map).values.fold(0, (a, b) => a + (b as int))).toDouble();
    final pct = (value / total * 100);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[300] : Colors.grey[600])),
              Text('${pct.toStringAsFixed(0)}%', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            ],
          ),
          const SizedBox(height: 4),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(value: pct / 100, backgroundColor: isDark ? Colors.white10 : Colors.grey[200], color: color, minHeight: 6),
          ),
        ],
      ),
    );
  }
}
