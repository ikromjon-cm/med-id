import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';

class ClinicAppointmentsScreen extends ConsumerStatefulWidget {
  const ClinicAppointmentsScreen({super.key});

  @override
  ConsumerState<ClinicAppointmentsScreen> createState() => _ClinicAppointmentsScreenState();
}

class _ClinicAppointmentsScreenState extends ConsumerState<ClinicAppointmentsScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _appointments = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  String _statusFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final apps = await _api.getDoctorAppointments('doc1');
    setState(() {
      _appointments = apps.map((a) => Map<String, dynamic>.from(a)..['doctorName'] = 'Dr. Alisher Tursunov').toList();
      _filtered = List.from(_appointments);
      _loading = false;
    });
  }

  void _filterByStatus(String status) {
    setState(() {
      _statusFilter = status;
      if (status == 'all') {
        _filtered = List.from(_appointments);
      } else {
        _filtered = _appointments.where((a) => a['status'] == status).toList();
      }
    });
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'upcoming': return ColorConstants.primary;
      case 'completed': return ColorConstants.success;
      case 'cancelled': return ColorConstants.emergency;
      default: return Colors.grey;
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
            title: Text('Appointments', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['all', 'upcoming', 'completed', 'cancelled'].map((s) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(s[0].toUpperCase() + s.substring(1), style: GoogleFonts.inter(fontSize: 13)),
                        selected: _statusFilter == s,
                        onSelected: (_) => _filterByStatus(s),
                        selectedColor: ColorConstants.primary,
                        labelStyle: GoogleFonts.inter(color: _statusFilter == s ? Colors.white : null),
                      ),
                    )).toList(),
                  ),
                ),
              ),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : _filtered.isEmpty
                        ? EmptyStateWidget(icon: Icons.calendar_today, title: 'No appointments')
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _filtered.length,
                            itemBuilder: (_, i) => FadeInUp(
                              child: Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: GlassCard(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(10),
                                            decoration: BoxDecoration(color: _statusColor(_filtered[i]['status']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                                            child: Icon(
                                              _filtered[i]['status'] == 'upcoming' ? Icons.schedule : _filtered[i]['status'] == 'completed' ? Icons.check_circle : Icons.cancel,
                                              size: 24, color: _statusColor(_filtered[i]['status']),
                                            ),
                                          ),
                                          const SizedBox(width: 14),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(_filtered[i]['patientName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                const SizedBox(height: 2),
                                                Text('${_filtered[i]['date']} at ${_filtered[i]['time']}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                if (_filtered[i]['doctorName'] != null)
                                                  Text(_filtered[i]['doctorName'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                              ],
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                            decoration: BoxDecoration(color: _statusColor(_filtered[i]['status']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                                            child: Text(_filtered[i]['status'], style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor(_filtered[i]['status']))),
                                          ),
                                        ],
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
