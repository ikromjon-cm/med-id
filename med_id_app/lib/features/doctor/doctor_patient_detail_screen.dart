import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/business_logic.dart';

class DoctorPatientDetailScreen extends ConsumerStatefulWidget {
  final String patientId;
  const DoctorPatientDetailScreen({super.key, required this.patientId});

  @override
  ConsumerState<DoctorPatientDetailScreen> createState() => _DoctorPatientDetailScreenState();
}

class _DoctorPatientDetailScreenState extends ConsumerState<DoctorPatientDetailScreen> {
  final _api = MockApiService();
  Map<String, dynamic>? _patient;
  List<Map<String, dynamic>> _diagnoses = [];
  List<Map<String, dynamic>> _prescriptions = [];
  bool _loading = true;
  bool _hasFullAccess = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() { _loading = true; _error = null; });
    try {
      final patients = await _api.getDoctorPatients('doc1');
      _patient = patients.firstWhere((p) => p['id'] == widget.patientId);
      _diagnoses = List.from(_patient!['diagnoses'] ?? []);
      _prescriptions = List.from(_patient!['prescriptions'] ?? []);
      setState(() => _loading = false);
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  Future<void> _requestFullAccess() async {
    final granted = await MedicalBusinessLogic.requestPatientPermission('doc1', widget.patientId);
    if (granted) {
      setState(() => _hasFullAccess = true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Full access granted')));
      }
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
            title: Text('Patient Detail', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 6)
              : _error != null
                  ? ErrorStateWidget(message: _error, onRetry: _loadData)
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildPatientHeader(isDark),
                            const SizedBox(height: 16),
                            if (!_hasFullAccess) _buildAccessRequest(isDark),
                            if (_hasFullAccess) ...[
                              _buildProfileInfo(isDark),
                              const SizedBox(height: 16),
                              _buildDiagnosesSection(isDark),
                              const SizedBox(height: 16),
                              _buildPrescriptionsSection(isDark),
                            ],
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ),
        ),
      ),
    );
  }

  Widget _buildPatientHeader(bool isDark) {
    return FadeInDown(
      child: GlassCard(
        child: Row(
          children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(color: ColorConstants.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
              child: Center(
                child: Text(
                  (_patient!['fullName'] as String).split(' ').map((e) => e[0]).take(2).join(),
                  style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: ColorConstants.primary),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_patient!['fullName'], style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                  const SizedBox(height: 4),
                  Row(children: [
                    Icon(Icons.phone, size: 14, color: isDark ? Colors.grey[400] : Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(_patient!['phone'], style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                  ]),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: ColorConstants.emergency.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                    child: Text('Blood: ${_patient!['bloodType']}', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: ColorConstants.emergency)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccessRequest(bool isDark) {
    return FadeInUp(
      child: GlassCard(
        tint: ColorConstants.emergency.withValues(alpha: 0.05),
        child: Column(
          children: [
            const Icon(Icons.lock, size: 48, color: ColorConstants.emergency),
            const SizedBox(height: 12),
            Text('Limited Access', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            const SizedBox(height: 8),
            Text('Request full access to view medical history, diagnoses, and prescriptions', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500]), textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _requestFullAccess,
              icon: const Icon(Icons.vpn_key),
              label: const Text('Request Full Access'),
              style: ElevatedButton.styleFrom(backgroundColor: ColorConstants.primary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileInfo(bool isDark) {
    final allergies = _patient!['allergies'] as List? ?? [];
    final diseases = _patient!['chronicDiseases'] as List? ?? [];
    final medications = _patient!['currentMedications'] as List? ?? [];
    return FadeInLeft(
      child: GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Medical Information', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            const SizedBox(height: 12),
            _infoChip(Icons.warning, 'Allergies', allergies.join(', '), ColorConstants.emergency, isDark),
            const SizedBox(height: 8),
            _infoChip(Icons.medical_services, 'Chronic Diseases', diseases.join(', '), const Color(0xFFFFB020), isDark),
            const SizedBox(height: 8),
            _infoChip(Icons.medication, 'Medications', medications.join(', '), const Color(0xFF0F6FFF), isDark),
          ],
        ),
      ),
    );
  }

  Widget _infoChip(IconData icon, String label, String value, Color color, bool isDark) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)), child: Icon(icon, size: 18, color: color)),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
              const SizedBox(height: 2),
              Text(value.isEmpty ? 'None' : value, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDiagnosesSection(bool isDark) {
    return FadeInRight(
      child: GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('Diagnoses', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
              TextButton.icon(
                onPressed: () => context.go('/doctor/diagnosis'),
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Add'),
              ),
            ]),
            const SizedBox(height: 8),
            _diagnoses.isEmpty
                ? EmptyStateWidget(icon: Icons.biotech, title: 'No diagnoses yet', subtitle: 'Add a diagnosis for this patient')
                : ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _diagnoses.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (_, i) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: const Color(0xFF7C3AED).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.biotech, size: 20, color: Color(0xFF7C3AED)),
                      ),
                      title: Text(_diagnoses[i]['title'], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      subtitle: Text(_diagnoses[i]['date'], style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrescriptionsSection(bool isDark) {
    return FadeInUp(
      child: GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('Prescriptions', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
              TextButton.icon(
                onPressed: () => context.go('/doctor/prescription'),
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Add'),
              ),
            ]),
            const SizedBox(height: 8),
            _prescriptions.isEmpty
                ? EmptyStateWidget(icon: Icons.medication, title: 'No prescriptions yet', subtitle: 'Add a prescription for this patient')
                : ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _prescriptions.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (_, i) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: ColorConstants.success.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.medication, size: 20, color: ColorConstants.success),
                      ),
                      title: Text(_prescriptions[i]['medicationName'], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                      subtitle: Text('${_prescriptions[i]['dosage']} - ${_prescriptions[i]['duration']}', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
