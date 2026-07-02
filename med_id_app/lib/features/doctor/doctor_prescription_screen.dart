import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class DoctorPrescriptionScreen extends ConsumerStatefulWidget {
  const DoctorPrescriptionScreen({super.key});

  @override
  ConsumerState<DoctorPrescriptionScreen> createState() => _DoctorPrescriptionScreenState();
}

class _DoctorPrescriptionScreenState extends ConsumerState<DoctorPrescriptionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _patientIdController = TextEditingController();
  final _medicationController = TextEditingController();
  final _dosageController = TextEditingController();
  final _durationController = TextEditingController();
  final _notesController = TextEditingController();
  bool _saving = false;
  final _api = MockApiService();

  @override
  void dispose() {
    _patientIdController.dispose();
    _medicationController.dispose();
    _dosageController.dispose();
    _durationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      final prescription = {
        'id': 'rx_${DateTime.now().millisecondsSinceEpoch}',
        'patientId': _patientIdController.text.trim(),
        'medicationName': _medicationController.text.trim(),
        'dosage': _dosageController.text.trim(),
        'duration': _durationController.text.trim(),
        'notes': _notesController.text.trim(),
        'date': '${DateTime.now().year}-${DateTime.now().month.toString().padLeft(2, '0')}-${DateTime.now().day.toString().padLeft(2, '0')}',
        'doctorName': 'Dr. Alisher Tursunov',
      };
      await _api.addPrescription(prescription);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Prescription saved successfully'), backgroundColor: ColorConstants.success));
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: ColorConstants.error));
      }
    } finally {
      if (mounted) setState(() => _saving = false);
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
            title: Text('New Prescription', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Prescription Details', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _patientIdController,
                          decoration: const InputDecoration(labelText: 'Patient ID', prefixIcon: Icon(Icons.person)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Patient ID is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _medicationController,
                          decoration: const InputDecoration(labelText: 'Medication Name', prefixIcon: Icon(Icons.medication)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Medication name is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _dosageController,
                          decoration: const InputDecoration(labelText: 'Dosage', prefixIcon: Icon(Icons.speed)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Dosage is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _durationController,
                          decoration: const InputDecoration(labelText: 'Duration', prefixIcon: Icon(Icons.timer)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Duration is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _notesController,
                          decoration: const InputDecoration(labelText: 'Notes (optional)', prefixIcon: Icon(Icons.notes)),
                          maxLines: 3,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _saving ? null : _save,
                      icon: _saving ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.save),
                      label: Text(_saving ? 'Saving...' : 'Save Prescription'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
