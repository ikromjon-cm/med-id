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

class DoctorDashboardScreen extends ConsumerStatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  ConsumerState<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends ConsumerState<DoctorDashboardScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;
  final _api = MockApiService();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final userId = ref.read(authProvider).user?.id ?? 'doc1';
    final patients = await _api.getDoctorPatients(userId);
    final appointments = await _api.getDoctorAppointments(userId);
    setState(() {
      _stats = {
        'totalPatients': patients.length,
        'todayAppointments': appointments.where((a) => a['status'] == 'upcoming').length,
        'pendingRequests': appointments.where((a) => a['status'] == 'pending').length,
        'recentDiagnoses': 12,
        'recentActivity': [
          {'action': 'Aziz Karimov uchun tashxis qo\'shildi', 'time': '2 hours ago'},
          {'action': 'Dilnoza Rahimova uchun retsept yozildi', 'time': '4 hours ago'},
          {'action': 'Uchrashuv yakunlandi - Botir Tursunov', 'time': 'Yesterday'},
          {'action': 'Bemor #P-1004 uchun favqulodda ogohlantirish', 'time': 'Yesterday'},
          {'action': 'Malika Azimova uchun laboratoriya natijalari ko\'rib chiqildi', 'time': '2 days ago'},
        ],
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
            title: Text('Shifokor Panel', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                        FadeInDown(child: Text('Umumiy', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)))),
                        const SizedBox(height: 16),
                        FadeInLeft(child: Row(children: [
                          _statCard('Bemorlar', '${(_stats ?? {})['totalPatients'] ?? 0}', Icons.people, const Color(0xFF0F6FFF), isDark),
                          const SizedBox(width: 12),
                          _statCard('Uchrashuvlar', '${(_stats ?? {})['todayAppointments'] ?? 0}', Icons.calendar_today, const Color(0xFF00C896), isDark),
                        ])),
                        const SizedBox(height: 12),
                        FadeInRight(child: Row(children: [
                          _statCard('Kutilmoqda', '${(_stats ?? {})['pendingRequests'] ?? 0}', Icons.pending_actions, const Color(0xFFFFB020), isDark),
                          const SizedBox(width: 12),
                          _statCard('Tashxislar', '${(_stats ?? {})['recentDiagnoses'] ?? 0}', Icons.biotech, const Color(0xFF7C3AED), isDark),
                        ])),
                        const SizedBox(height: 20),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Tezkor amallar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              const SizedBox(height: 16),
                              _buildQuickActions(context, isDark),
                            ],
                          ),
                        )),
                        const SizedBox(height: 16),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Oxirgi faoliyat', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              const SizedBox(height: 12),
                              ...((_stats ?? {})['recentActivity'] as List? ?? []).map((a) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                child: Row(children: [
                                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: ColorConstants.primary, shape: BoxShape.circle)),
                                  const SizedBox(width: 12),
                                  Expanded(child: Text(a['action'], style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[300] : Colors.grey[600]))),
                                  Text(a['time'], style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                ]),
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

  Widget _buildQuickActions(BuildContext context, bool isDark) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 0.8,
      children: [
        _actionItem(Icons.search, 'Bemor qidirish', const Color(0xFF0F6FFF), () => context.go('/doctor/patient-search'), isDark),
        _actionItem(Icons.biotech, 'Tashxis yozish', const Color(0xFF7C3AED), () => context.go('/doctor/diagnosis'), isDark),
        _actionItem(Icons.calendar_month, 'Uchrashuvlar', const Color(0xFF00C896), () => context.go('/doctor/appointments'), isDark),
        _actionItem(Icons.warning, 'Favqulodda', ColorConstants.emergency, () => context.go('/emergency/dashboard'), isDark),
      ],
    );
  }

  Widget _actionItem(IconData icon, String label, Color color, VoidCallback onTap, bool isDark) {
    return GestureDetector(
      onTap: onTap,
      child: Column(children: [
        Container(padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)), child: Icon(icon, size: 28, color: color)),
        const SizedBox(height: 6),
        Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w500, color: isDark ? Colors.grey[300] : Colors.grey[600]), textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis),
      ]),
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color, bool isDark) {
    return Expanded(
      child: GlassCard(
        child: Column(children: [
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 24, color: color)),
          const SizedBox(height: 8),
          Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
          Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
        ]),
      ),
    );
  }
}
