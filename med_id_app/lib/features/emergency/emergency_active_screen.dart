import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';

class EmergencyActiveScreen extends ConsumerStatefulWidget {
  const EmergencyActiveScreen({super.key});

  @override
  ConsumerState<EmergencyActiveScreen> createState() => _EmergencyActiveScreenState();
}

class _EmergencyActiveScreenState extends ConsumerState<EmergencyActiveScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _emergencies = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final emergencies = await _api.getActiveEmergencies();
    setState(() { _emergencies = emergencies; _loading = false; });
  }

  Future<void> _markResolved(int index) async {
    setState(() => _emergencies.removeAt(index));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Emergency marked as resolved'), backgroundColor: ColorConstants.success));
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
            title: Text('Active Emergencies', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 5)
              : _emergencies.isEmpty
                  ? const EmptyStateWidget(icon: Icons.check_circle, title: 'No active emergencies', subtitle: 'All emergencies have been resolved')
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _emergencies.length,
                        itemBuilder: (_, i) => FadeInUp(
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: GlassCard(
                              tint: ColorConstants.emergency.withValues(alpha: 0.05),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width: 8, height: 8,
                                        decoration: const BoxDecoration(color: ColorConstants.emergency, shape: BoxShape.circle),
                                      ),
                                      const SizedBox(width: 8),
                                      Text('Code ${_emergencies[i]['priority'] ?? 'EMERGENCY'}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: ColorConstants.emergency)),
                                      const Spacer(),
                                      Text(_emergencies[i]['time'] ?? '', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Container(
                                        width: 52, height: 52,
                                        decoration: BoxDecoration(color: ColorConstants.emergency.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)),
                                        child: Center(
                                          child: Text(
                                            (_emergencies[i]['patientName'] as String? ?? 'UN').split(' ').map((e) => e[0]).take(2).join(),
                                            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: ColorConstants.emergency),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(_emergencies[i]['patientName'] ?? 'Unknown Patient', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                            const SizedBox(height: 4),
                                            Row(children: [
                                              _emergencyTag('Blood: ${_emergencies[i]['bloodType'] ?? 'N/A'}', ColorConstants.emergency),
                                              const SizedBox(width: 6),
                                              _emergencyTag('${_emergencies[i]['allergies'] ?? 'No allergies'}', ColorConstants.warning),
                                            ]),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (_emergencies[i]['medications'] != null) ...[
                                    const SizedBox(height: 8),
                                    Text('Medications: ${_emergencies[i]['medications']}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                  ],
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () => context.go('/emergency/profile/${_emergencies[i]['patientId']}'),
                                          icon: const Icon(Icons.visibility, size: 18),
                                          label: const Text('View Profile'),
                                          style: OutlinedButton.styleFrom(foregroundColor: ColorConstants.primary),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: () => _markResolved(i),
                                          icon: const Icon(Icons.check, size: 18),
                                          label: const Text('Resolved'),
                                          style: ElevatedButton.styleFrom(backgroundColor: ColorConstants.success),
                                        ),
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
        ),
      ),
    );
  }

  Widget _emergencyTag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
      child: Text(text, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: color)),
    );
  }
}
