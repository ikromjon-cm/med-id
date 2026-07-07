import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';

class DoctorAppointmentsScreen extends ConsumerStatefulWidget {
  const DoctorAppointmentsScreen({super.key});

  @override
  ConsumerState<DoctorAppointmentsScreen> createState() => _DoctorAppointmentsScreenState();
}

class _DoctorAppointmentsScreenState extends ConsumerState<DoctorAppointmentsScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _appointments = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  String _filter = 'all';
  final List<String> _filters = ['all', 'upcoming', 'completed', 'cancelled'];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final userId = ref.read(authProvider).user?.id ?? 'doc1';
    final appointments = await _api.getDoctorAppointments(userId);
    setState(() {
      _appointments = appointments;
      _applyFilter();
      _loading = false;
    });
  }

  void _applyFilter() {
    if (_filter == 'all') {
      _filtered = List.from(_appointments);
    } else {
      _filtered = _appointments.where((a) => a['status'] == _filter).toList();
    }
  }

  Future<void> _updateStatus(int index, String newStatus) async {
    setState(() => _filtered[index]['status'] = newStatus);
    final idx = _appointments.indexWhere((a) => a['id'] == _filtered[index]['id']);
    if (idx != -1) _appointments[idx]['status'] = newStatus;
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
            title: Text('Uchrashuvlar', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _filters.map((f) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(f[0].toUpperCase() + f.substring(1), style: GoogleFonts.inter(fontSize: 13)),
                        selected: _filter == f,
                        onSelected: (_) { setState(() { _filter = f; _applyFilter(); }); },
                        selectedColor: ColorConstants.primary,
                        labelStyle: GoogleFonts.inter(color: _filter == f ? Colors.white : null),
                      ),
                    )).toList(),
                  ),
                ),
              ),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : _filtered.isEmpty
                        ? EmptyStateWidget(icon: Icons.calendar_today, title: 'Uchrashuvlar topilmadi', subtitle: 'No ${_filter == 'all' ? '' : _filter} appointments')
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.builder(
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
                                              decoration: BoxDecoration(
                                                color: _filtered[i]['status'] == 'upcoming'
                                                    ? ColorConstants.primary.withValues(alpha: 0.1)
                                                    : _filtered[i]['status'] == 'completed'
                                                        ? ColorConstants.success.withValues(alpha: 0.1)
                                                        : ColorConstants.emergency.withValues(alpha: 0.1),
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                              child: Icon(
                                                _filtered[i]['status'] == 'upcoming' ? Icons.schedule : _filtered[i]['status'] == 'completed' ? Icons.check_circle : Icons.cancel,
                                                size: 24,
                                                color: _filtered[i]['status'] == 'upcoming'
                                                    ? ColorConstants.primary
                                                    : _filtered[i]['status'] == 'completed'
                                                        ? ColorConstants.success
                                                        : ColorConstants.emergency,
                                              ),
                                            ),
                                            const SizedBox(width: 14),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(_filtered[i]['patientName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                  const SizedBox(height: 4),
                                                  Text('${_filtered[i]['date']} at ${_filtered[i]['time']}', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                ],
                                              ),
                                            ),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                              decoration: BoxDecoration(
                                                color: _filtered[i]['status'] == 'upcoming'
                                                    ? ColorConstants.primary.withValues(alpha: 0.1)
                                                    : _filtered[i]['status'] == 'completed'
                                                        ? ColorConstants.success.withValues(alpha: 0.1)
                                                        : ColorConstants.emergency.withValues(alpha: 0.1),
                                                borderRadius: BorderRadius.circular(20),
                                              ),
                                              child: Text(_filtered[i]['status'], style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600,
                                                color: _filtered[i]['status'] == 'upcoming' ? ColorConstants.primary : _filtered[i]['status'] == 'completed' ? ColorConstants.success : ColorConstants.emergency,
                                              )),
                                            ),
                                          ],
                                        ),
                                        if (_filtered[i]['status'] == 'upcoming') ...[
                                          const SizedBox(height: 12),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.end,
                                            children: [
                                              OutlinedButton(
                                                onPressed: () => _updateStatus(i, 'cancelled'),
                                                style: OutlinedButton.styleFrom(foregroundColor: ColorConstants.emergency, side: const BorderSide(color: ColorConstants.emergency)),
                                                child: const Text('Rad etish'),
                                              ),
                                              const SizedBox(width: 8),
                                              ElevatedButton(
                                                onPressed: () => _updateStatus(i, 'completed'),
                                                style: ElevatedButton.styleFrom(backgroundColor: ColorConstants.success),
                                                child: const Text('Qabul qilish'),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ],
                                    ),
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
