import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/constants/color_constants.dart';

class ClinicFinanceScreen extends ConsumerStatefulWidget {
  const ClinicFinanceScreen({super.key});

  @override
  ConsumerState<ClinicFinanceScreen> createState() => _ClinicFinanceScreenState();
}

class _ClinicFinanceScreenState extends ConsumerState<ClinicFinanceScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _transactions = [];
  Map<String, dynamic>? _finance;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final clinicId = ref.read(authProvider).user?.id ?? 'clinic1';
    final transactions = await _api.getClinicFinance(clinicId);
    setState(() {
      _transactions = transactions;
      _finance = {
        'todayRevenue': 12500000,
        'monthlyRevenue': 245000000,
        'pendingPayments': 32000000,
      };
      _loading = false;
    });
  }

  String _formatMoney(int amount) {
    if (amount >= 1000000) return '${(amount / 1000000).toStringAsFixed(1)}M';
    if (amount >= 1000) return '${(amount / 1000).toStringAsFixed(0)}K';
    return '$amount';
  }

  String _formatCurrency(int amount) {
    return '${_formatMoney(amount)} UZS';
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
            title: Text('Moliya', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 6)
              : RefreshIndicator(
                  onRefresh: _loadData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FadeInDown(child: Text('Moliya sharhi', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)))),
                        const SizedBox(height: 16),
                        FadeInLeft(child: Row(children: [
                          _statCard('Bugun', _formatCurrency((_finance ?? {})['todayRevenue'] ?? 0), Icons.today, const Color(0xFF0F6FFF), isDark),
                          const SizedBox(width: 12),
                          _statCard('Bu oy', _formatCurrency((_finance ?? {})['monthlyRevenue'] ?? 0), Icons.date_range, const Color(0xFF00C896), isDark),
                        ])),
                        const SizedBox(height: 12),
                        FadeInRight(child: _statCard('Kutilayotgan to\'lovlar', _formatCurrency((_finance ?? {})['pendingPayments'] ?? 0), Icons.pending, const Color(0xFFFFB020), isDark)),
                        const SizedBox(height: 20),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Daromad diagrammasi', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              const SizedBox(height: 16),
                              SizedBox(
                                height: 180,
                                child: LineChart(
                                  LineChartData(
                                    gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 20, getDrawingHorizontalLine: (_) => FlLine(color: isDark ? Colors.white10 : Colors.grey[200]!, strokeWidth: 1)),
                                    titlesData: FlTitlesData(
                                      bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, _) => Text(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][v.toInt()], style: GoogleFonts.inter(fontSize: 9, color: isDark ? Colors.grey[400] : Colors.grey[500])))),
                                      leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 35, getTitlesWidget: (v, _) => Text(_formatMoney(v.toInt()), style: GoogleFonts.inter(fontSize: 9, color: isDark ? Colors.grey[500] : Colors.grey[400])))),
                                    ),
                                    borderData: FlBorderData(show: false),
                                    lineBarsData: [
                                      LineChartBarData(
                                        spots: List.generate(7, (i) => FlSpot(i.toDouble(), (8000000 + i * 1500000 + (i % 3) * 2000000).toDouble())),
                                        isCurved: true,
                                        color: ColorConstants.primary,
                                        barWidth: 3,
                                        dotData: const FlDotData(show: true),
                                        belowBarData: BarAreaData(show: true, color: ColorConstants.primary.withValues(alpha: 0.1)),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )),
                        const SizedBox(height: 16),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Oxirgi tranzaksiyalar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              const SizedBox(height: 12),
                              if (_transactions.isEmpty)
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 24),
                                  child: Center(child: Text('Ma\'lumot yo\'q', style: TextStyle(color: Colors.grey))),
                                )
                              else
                                ..._transactions.map((t) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 6),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: (t['type'] == 'payment' ? ColorConstants.success : ColorConstants.emergency).withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Icon(
                                        t['type'] == 'payment' ? Icons.arrow_upward : Icons.arrow_downward,
                                        size: 16,
                                        color: t['type'] == 'payment' ? ColorConstants.success : ColorConstants.emergency,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(t['description'], style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                          Text(t['date'], style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                        ],
                                      ),
                                    ),
                                    Text('${t['type'] == 'payment' ? '+' : '-'}${t['amount']} UZS', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600,
                                      color: t['type'] == 'payment' ? ColorConstants.success : ColorConstants.emergency,
                                    )),
                                  ],
                                ),
                              )),
                            ],
                          ),
                        )),
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
        child: Column(children: [
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 24, color: color)),
          const SizedBox(height: 8),
          Text(value, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
          Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
        ]),
      ),
    );
  }
}
