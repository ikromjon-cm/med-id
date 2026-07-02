import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';

class ClinicDoctorScheduleScreen extends ConsumerStatefulWidget {
  const ClinicDoctorScheduleScreen({super.key});

  @override
  ConsumerState<ClinicDoctorScheduleScreen> createState() => _ClinicDoctorScheduleScreenState();
}

class _ClinicDoctorScheduleScreenState extends ConsumerState<ClinicDoctorScheduleScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _schedules = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  String _selectedDoctor = 'all';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    await _api.getClinicStaff('clinic1');
    setState(() {
      _schedules = [
        {'doctor': 'Dr. Alisher Tursunov', 'specialty': 'Cardiology', 'time': '09:00', 'patientName': 'Aziz Karimov', 'status': 'completed'},
        {'doctor': 'Dr. Alisher Tursunov', 'specialty': 'Cardiology', 'time': '10:00', 'patientName': 'Botir Tursunov', 'status': 'in-progress'},
        {'doctor': 'Dr. Alisher Tursunov', 'specialty': 'Cardiology', 'time': '11:00', 'patientName': 'Dilnoza Rahimova', 'status': 'waiting'},
        {'doctor': 'Dr. Malika Azimova', 'specialty': 'Pediatrics', 'time': '09:30', 'patientName': 'Sobir Juraev', 'status': 'completed'},
        {'doctor': 'Dr. Malika Azimova', 'specialty': 'Pediatrics', 'time': '10:30', 'patientName': 'Gulnora Karimova', 'status': 'waiting'},
        {'doctor': 'Dr. Jahongir Sodiqov', 'specialty': 'Neurology', 'time': '14:00', 'patientName': 'Ravshan Xodjayev', 'status': 'cancelled'},
      ];
      _filtered = List.from(_schedules);
      _loading = false;
    });
  }

  void _filterByDoctor(String doctor) {
    setState(() {
      _selectedDoctor = doctor;
      if (doctor == 'all') {
        _filtered = List.from(_schedules);
      } else {
        _filtered = _schedules.where((s) => s['doctor'] == doctor).toList();
      }
    });
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'completed': return ColorConstants.success;
      case 'in-progress': return const Color(0xFF0F6FFF);
      case 'waiting': return const Color(0xFFFFB020);
      case 'cancelled': return ColorConstants.emergency;
      default: return Colors.grey;
    }
  }

  Set<String> get _doctors => _schedules.map((s) => s['doctor'] as String).toSet();

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
            title: Text('Doctor Schedule', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 5)
              : Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: SizedBox(
                        height: 40,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: ['all', ..._doctors].map((d) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ChoiceChip(
                              label: Text(d == 'all' ? 'All Doctors' : d.split(' ').sublist(0, 2).join(' '), style: GoogleFonts.inter(fontSize: 12)),
                              selected: _selectedDoctor == d,
                              onSelected: (_) => _filterByDoctor(d),
                              selectedColor: ColorConstants.primary,
                              labelStyle: GoogleFonts.inter(color: _selectedDoctor == d ? Colors.white : null),
                            ),
                          )).toList(),
                        ),
                      ),
                    ),
                    Expanded(
                      child: _filtered.isEmpty
                          ? const EmptyStateWidget(icon: Icons.schedule, title: 'No schedules found')
                          : ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _filtered.length,
                              itemBuilder: (_, i) => FadeInUp(
                                child: Padding(
                                  padding: const EdgeInsets.only(bottom: 12),
                                  child: GlassCard(
                                    child: Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(12),
                                          decoration: BoxDecoration(color: _statusColor(_filtered[i]['status']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                                          child: Column(children: [
                                            Text(_filtered[i]['time'].toString().split(':')[0], style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: _statusColor(_filtered[i]['status']))),
                                            Text(_filtered[i]['time'].toString().split(':')[1], style: GoogleFonts.inter(fontSize: 12, color: _statusColor(_filtered[i]['status']))),
                                          ]),
                                        ),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(_filtered[i]['patientName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                              const SizedBox(height: 2),
                                              Text('${_filtered[i]['doctor']} - ${_filtered[i]['specialty']}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(color: _statusColor(_filtered[i]['status']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                          child: Text(_filtered[i]['status'], style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: _statusColor(_filtered[i]['status']))),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
