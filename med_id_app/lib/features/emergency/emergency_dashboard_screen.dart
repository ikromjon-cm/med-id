import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/business_logic.dart';

class EmergencyDashboardScreen extends ConsumerStatefulWidget {
  const EmergencyDashboardScreen({super.key});

  @override
  ConsumerState<EmergencyDashboardScreen> createState() => _EmergencyDashboardScreenState();
}

class _EmergencyDashboardScreenState extends ConsumerState<EmergencyDashboardScreen> {
  final _api = MockApiService();
  Map<String, dynamic>? _stats;
  bool _loading = true;
  bool _emergencyMode = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final alerts = await _api.getEmergencyAlerts();
    final emergencies = await _api.getActiveEmergencies();
    setState(() {
      _stats = {
        'totalEmergencies': alerts.length + 10,
        'activeCases': emergencies.length,
        'responseTime': '4.2 min',
        'recentAccesses': alerts.take(5).toList(),
      };
      _loading = false;
    });
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
            title: Text('Favqulodda Panel', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                        FadeInDown(
                          child: GlassCard(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Favqulodda rejim', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                    Text(_emergencyMode ? 'Faol - Kirish ruxsat berilgan' : 'Faol emas', style: GoogleFonts.inter(fontSize: 13, color: _emergencyMode ? ColorConstants.emergency : Colors.grey)),
                                  ],
                                ),
                                Switch(
                                  value: _emergencyMode,
                                  activeThumbColor: ColorConstants.emergency,
                                  onChanged: (v) {
                                    setState(() => _emergencyMode = v);
                                    if (v) MedicalBusinessLogic.handleEmergencyMode(ref.read(authProvider).user?.id ?? 'user1');
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        FadeInLeft(child: Row(children: [
                          _statCard('Jami', '${(_stats ?? {})['totalEmergencies'] ?? 0}', Icons.warning, ColorConstants.emergency, isDark),
                          const SizedBox(width: 12),
                          _statCard('Faol', '${(_stats ?? {})['activeCases'] ?? 0}', Icons.emergency, const Color(0xFFFFB020), isDark),
                        ])),
                        const SizedBox(height: 12),
                        FadeInRight(child: Row(children: [
                          _statCard('Javob', '${(_stats ?? {})['responseTime'] ?? 0}', Icons.timer, const Color(0xFF0F6FFF), isDark),
                          const SizedBox(width: 12),
                          _quickActionCard('QR Skaner', Icons.qr_code_scanner, ColorConstants.primary, () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('QR Skaner (demo)'))), isDark),
                        ])),
                        const SizedBox(height: 20),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                Text('Oxirgi favqulodda kirishlar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                TextButton(onPressed: () => context.go('/emergency/active'), child: const Text('Barchasini ko\'rish')),
                              ]),
                              const SizedBox(height: 8),
                              if ((_stats!['recentAccesses'] as List).isEmpty)
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 24),
                                  child: Center(child: Text('Ma\'lumot yo\'q', style: TextStyle(color: Colors.grey))),
                                )
                              else
                                ...((_stats ?? {})['recentAccesses'] as List? ?? []).map((a) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 6),
                                child: Row(children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(color: ColorConstants.emergency.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                    child: const Icon(Icons.emergency, size: 18, color: ColorConstants.emergency),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(child: Text(a['patientName'] ?? a['patientId'] ?? 'Noma\'lum', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)))),
                                  Text(a['time'] ?? '', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                ]),
                              )),
                              const SizedBox(height: 8),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => context.go('/emergency/active'),
                                  icon: const Icon(Icons.emergency),
                                  label: const Text('Faol favqulodda vaziyatlarni ko\'rish'),
                                  style: ElevatedButton.styleFrom(backgroundColor: ColorConstants.emergency),
                                ),
                              ),
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
    return Expanded(child: GlassCard(child: Column(children: [
      Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 24, color: color)),
      const SizedBox(height: 8),
      Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
      Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
    ])));
  }

  Widget _quickActionCard(String label, IconData icon, Color color, VoidCallback onTap, bool isDark) {
    return Expanded(
      child: GlassCard(
        onTap: onTap,
        child: Column(children: [
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 24, color: color)),
          const SizedBox(height: 8),
          Text(label, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: isDark ? Colors.grey[300] : Colors.grey[600]), textAlign: TextAlign.center),
        ]),
      ),
    );
  }
}
