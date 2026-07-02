import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class DoctorDiagnosisScreen extends ConsumerStatefulWidget {
  const DoctorDiagnosisScreen({super.key});

  @override
  ConsumerState<DoctorDiagnosisScreen> createState() => _DoctorDiagnosisScreenState();
}

class _DoctorDiagnosisScreenState extends ConsumerState<DoctorDiagnosisScreen> {
  final _formKey = GlobalKey<FormState>();
  final _patientIdController = TextEditingController();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _icdCodeController = TextEditingController();
  DateTime _selectedDate = DateTime.now();
  bool _saving = false;
  final _api = MockApiService();

  @override
  void dispose() {
    _patientIdController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    _icdCodeController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      final diagnosis = {
        'id': 'diag_${DateTime.now().millisecondsSinceEpoch}',
        'patientId': _patientIdController.text.trim(),
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'icdCode': _icdCodeController.text.trim(),
        'date': '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
        'doctorName': 'Dr. Alisher Tursunov',
      };
      await _api.addDiagnosis(diagnosis);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Diagnosis saved successfully'), backgroundColor: ColorConstants.success));
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
            title: Text('New Diagnosis', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                        Text('Diagnosis Details', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _patientIdController,
                          decoration: const InputDecoration(labelText: 'Patient ID', prefixIcon: Icon(Icons.person)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Patient ID is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _titleController,
                          decoration: const InputDecoration(labelText: 'Diagnosis Title', prefixIcon: Icon(Icons.biotech)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Title is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _descriptionController,
                          decoration: const InputDecoration(labelText: 'Description', prefixIcon: Icon(Icons.description), alignLabelWithHint: true),
                          maxLines: 3,
                          validator: (v) => v == null || v.trim().isEmpty ? 'Description is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _icdCodeController,
                          decoration: const InputDecoration(labelText: 'ICD Code', prefixIcon: Icon(Icons.code)),
                          validator: (v) => v == null || v.trim().isEmpty ? 'ICD Code is required' : null,
                          style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                        ),
                        const SizedBox(height: 12),
                        InkWell(
                          onTap: () async {
                            final picked = await showDatePicker(context: context, initialDate: _selectedDate, firstDate: DateTime(2020), lastDate: DateTime.now());
                            if (picked != null) setState(() => _selectedDate = picked);
                          },
                          child: InputDecorator(
                            decoration: const InputDecoration(labelText: 'Date', prefixIcon: Icon(Icons.calendar_today)),
                            child: Text('${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
                              style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                          ),
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
                      label: Text(_saving ? 'Saving...' : 'Save Diagnosis'),
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
