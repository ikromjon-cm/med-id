import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/business_logic.dart';

class EmergencyProfileViewScreen extends ConsumerStatefulWidget {
  final String patientId;
  const EmergencyProfileViewScreen({super.key, required this.patientId});

  @override
  ConsumerState<EmergencyProfileViewScreen> createState() => _EmergencyProfileViewScreenState();
}

class _EmergencyProfileViewScreenState extends ConsumerState<EmergencyProfileViewScreen> {
  final _api = MockApiService();
  Map<String, dynamic>? _patient;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() { _loading = true; _error = null; });
    try {
      final userId = ref.read(authProvider).user?.id ?? 'doc1';
      final patients = await _api.getDoctorPatients(userId);
      _patient = patients.firstWhere((p) => p['id'] == widget.patientId);
      setState(() => _loading = false);
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  Future<void> _logAccess() async {
    final staffId = ref.read(authProvider).user?.id ?? 'staff1';
    await _api.logEmergencyAccess(widget.patientId, staffId);
    await MedicalBusinessLogic.notifyRelativesOnEmergencyAccess(widget.patientId);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Favqulodda kirish muvaffaqiyatli qayd etildi'),
        backgroundColor: ColorConstants.success,
      ));
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
            title: Text('Favqulodda profil', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 6)
              : _error != null
                  ? ErrorStateWidget(message: _error, onRetry: _loadProfile)
                  : RefreshIndicator(
                      onRefresh: _loadProfile,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            FadeInDown(
                              child: GlassCard(
                                tint: ColorConstants.emergency.withValues(alpha: 0.1),
                                child: Column(
                                  children: [
                                    Container(
                                      width: 80, height: 80,
                                      decoration: BoxDecoration(
                                        color: ColorConstants.emergency.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(color: ColorConstants.emergency, width: 2),
                                      ),
                                      child: Center(
                                        child: Text(
                                          (_patient!['fullName'] as String).split(' ').map((e) => e[0]).take(2).join(),
                                          style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.bold, color: ColorConstants.emergency),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(_patient!['fullName'], style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                    const SizedBox(height: 4),
                                    Text(_patient!['phone'], style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                    const SizedBox(height: 16),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: ColorConstants.emergency.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(color: ColorConstants.emergency.withValues(alpha: 0.3)),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.bloodtype, size: 20, color: ColorConstants.emergency),
                                          const SizedBox(width: 8),
                                          Text('QON GURUHI: ${_patient!['bloodType'] ?? 'Mavjud emas'}', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: ColorConstants.emergency, letterSpacing: 2)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            FadeInLeft(
                              child: GlassCard(
                                tint: ColorConstants.emergency.withValues(alpha: 0.05),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(children: [
                                      const Icon(Icons.warning, size: 18, color: ColorConstants.emergency),
                                      const SizedBox(width: 8),
                                      Text('Allergiyalar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                    ]),
                                    const SizedBox(height: 8),
                                    _chipList(_patient!['allergies'] as List? ?? ['Hech narsa qayd etilmagan'], ColorConstants.emergency),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            FadeInRight(
                              child: GlassCard(
                                tint: ColorConstants.warning.withValues(alpha: 0.05),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(children: [
                                      const Icon(Icons.medication, size: 18, color: ColorConstants.warning),
                                      const SizedBox(width: 8),
                                      Text('Joriy dorilar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                    ]),
                                    const SizedBox(height: 8),
                                    _chipList(_patient!['currentMedications'] as List? ?? ['Hech narsa qayd etilmagan'], ColorConstants.warning),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            FadeInUp(
                              child: GlassCard(
                                tint: const Color(0xFFFFB020).withValues(alpha: 0.05),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(children: [
                                      const Icon(Icons.medical_services, size: 18, color: Color(0xFFFFB020)),
                                      const SizedBox(width: 8),
                                      Text('Surunkali kasalliklar', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                    ]),
                                    const SizedBox(height: 8),
                                    _chipList(_patient!['chronicDiseases'] as List? ?? ['Hech narsa qayd etilmagan'], const Color(0xFFFFB020)),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            FadeInUp(
                              child: SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: _logAccess,
                                  icon: const Icon(Icons.login),
                                  label: const Text('Favqulodda kirishni qayd etish'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: ColorConstants.emergency,
                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            FadeInUp(
                              child: Text('Bu kirish bemorning kirish jurnalida qayd etiladi', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]), textAlign: TextAlign.center),
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

  Widget _chipList(List list, Color color) {
    if (list.isEmpty || (list.length == 1 && list[0] == 'None recorded')) {
      return Text('Hech narsa qayd etilmagan', style: GoogleFonts.inter(fontSize: 14, color: Colors.grey));
    }
    return Wrap(
      spacing: 8, runSpacing: 4,
      children: list.map((item) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: color.withValues(alpha: 0.3))),
        child: Text(item, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: color)),
      )).toList(),
    );
  }
}
