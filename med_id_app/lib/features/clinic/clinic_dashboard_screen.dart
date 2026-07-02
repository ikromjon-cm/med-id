import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/constants/color_constants.dart';

class ClinicDashboardScreen extends ConsumerStatefulWidget {
  const ClinicDashboardScreen({super.key});

  @override
  ConsumerState<ClinicDashboardScreen> createState() => _ClinicDashboardScreenState();
}

class _ClinicDashboardScreenState extends ConsumerState<ClinicDashboardScreen> {
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
    final queue = await _api.getClinicQueue('clinic1');
    final staff = await _api.getClinicStaff('clinic1');
    setState(() {
      _stats = {
        'patientsToday': 24,
        'doctorsAvailable': staff.where((s) => s['role'] == 'doctor').length,
        'queueLength': queue.length,
        'appointments': 18,
        'queue': queue,
      };
      _loading = false;
    });
  }

  Color _priorityColor(String priority) {
    switch (priority) {
      case 'critical': return ColorConstants.emergency;
      case 'high': return const Color(0xFFFFB020);
      case 'medium': return const Color(0xFF0F6FFF);
      default: return ColorConstants.success;
    }
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
            title: Text('Clinic Dashboard', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                        FadeInDown(child: Text('Overview', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)))),
                        const SizedBox(height: 16),
                        FadeInLeft(child: Row(children: [
                          _statCard('Patients Today', '${_stats!['patientsToday']}', Icons.people, const Color(0xFF0F6FFF), isDark),
                          const SizedBox(width: 12),
                          _statCard('Doctors', '${_stats!['doctorsAvailable']}', Icons.medical_services, const Color(0xFF00C896), isDark),
                        ])),
                        const SizedBox(height: 12),
                        FadeInRight(child: Row(children: [
                          _statCard('Queue', '${_stats!['queueLength']}', Icons.queue, const Color(0xFFFFB020), isDark),
                          const SizedBox(width: 12),
                          _statCard('Appointments', '${_stats!['appointments']}', Icons.calendar_month, const Color(0xFF7C3AED), isDark),
                        ])),
                        const SizedBox(height: 20),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Quick Actions', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                              const SizedBox(height: 16),
                              GridView.count(
                                shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
                                crossAxisCount: 4, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.8,
                                children: [
                                  _actionItem(Icons.person_add, 'Register Patient', const Color(0xFF0F6FFF), () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Register Patient (demo)'))), isDark),
                                  _actionItem(Icons.schedule, 'Schedule', const Color(0xFF00C896), () => context.go('/clinic/doctor-schedule'), isDark),
                                  _actionItem(Icons.people, 'Staff', const Color(0xFF7C3AED), () => context.go('/clinic/staff'), isDark),
                                  _actionItem(Icons.assessment, 'Reports', const Color(0xFFFFB020), () => context.go('/clinic/finance'), isDark),
                                ],
                              ),
                            ],
                          ),
                        )),
                        const SizedBox(height: 16),
                        FadeInUp(child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                Text('Queue', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                TextButton(onPressed: () => context.go('/clinic/queue'), child: const Text('View All')),
                              ]),
                              const SizedBox(height: 8),
                              ...(_stats!['queue'] as List).take(4).map((q) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 6),
                                child: Row(children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(color: _priorityColor(q['priority']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                                    child: Text(q['priority'], style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: _priorityColor(q['priority']))),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(child: Text(q['patientName'], style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)))),
                                  Text(q['waitTime'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
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

  Widget _statCard(String label, String value, IconData icon, Color color, bool isDark) {
    return Expanded(child: GlassCard(child: Column(children: [
      Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 24, color: color)),
      const SizedBox(height: 8),
      Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
      Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
    ])));
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
}
