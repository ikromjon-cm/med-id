import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/patient_provider.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/animated_button.dart';
import '../../../core/constants/color_constants.dart';

class MedicalProfileEditScreen extends ConsumerStatefulWidget {
  const MedicalProfileEditScreen({super.key});

  @override
  ConsumerState<MedicalProfileEditScreen> createState() => _MedicalProfileEditScreenState();
}

class _MedicalProfileEditScreenState extends ConsumerState<MedicalProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _emailCtrl;
  late TextEditingController _insuranceCtrl;
  late TextEditingController _policyCtrl;
  String _bloodType = 'A+';
  String _gender = 'Male';
  DateTime? _birthDate;
  DateTime? _insuranceExpiry;
  List<String> _allergies = [];
  List<String> _diseases = [];
  List<String> _medications = [];
  final _allergyCtrl = TextEditingController();
  final _diseaseCtrl = TextEditingController();
  final _medicationCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _nameCtrl = TextEditingController(text: user?.fullName ?? '');
    _phoneCtrl = TextEditingController(text: user?.phone ?? '');
    _emailCtrl = TextEditingController(text: user?.email ?? '');
    _insuranceCtrl = TextEditingController(text: user?.insuranceProvider ?? '');
    _policyCtrl = TextEditingController(text: user?.insurancePolicyNumber ?? '');
    _bloodType = user?.bloodType ?? 'A+';
    _gender = user?.gender ?? 'Male';
    _birthDate = user?.birthDate;
    _insuranceExpiry = user?.insuranceExpiry;
    _allergies = List.from(user?.allergies ?? []);
    _diseases = List.from(user?.chronicDiseases ?? []);
    _medications = List.from(user?.currentMedications ?? []);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _insuranceCtrl.dispose();
    _policyCtrl.dispose();
    _allergyCtrl.dispose();
    _diseaseCtrl.dispose();
    _medicationCtrl.dispose();
    super.dispose();
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      final currentUser = ref.read(authProvider).user!;
      currentUser.copyWith(
        fullName: _nameCtrl.text,
        bloodType: _bloodType,
        gender: _gender,
        birthDate: _birthDate,
        insuranceProvider: _insuranceCtrl.text.isNotEmpty ? _insuranceCtrl.text : null,
        insurancePolicyNumber: _policyCtrl.text.isNotEmpty ? _policyCtrl.text : null,
        insuranceExpiry: _insuranceExpiry,
        allergies: _allergies,
        chronicDiseases: _diseases,
        currentMedications: _medications,
      );
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Color(0xFF00C896)));
      context.pop();
    }
  }

  Future<void> _pickDate(bool isBirth) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isBirth ? (_birthDate ?? DateTime(1990)) : (_insuranceExpiry ?? DateTime.now()),
      firstDate: isBirth ? DateTime(1950) : DateTime.now(),
      lastDate: isBirth ? DateTime.now() : DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        if (isBirth) _birthDate = picked;
        else _insuranceExpiry = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isLoading = ref.watch(patientProvider).isLoading;

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
            title: Text('Edit Profile', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextFormField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person)), validator: Validators.name),
                  const SizedBox(height: 16),
                  TextFormField(controller: _phoneCtrl, decoration: const InputDecoration(labelText: 'Phone', prefixIcon: Icon(Icons.phone)), validator: Validators.phone),
                  const SizedBox(height: 16),
                  TextFormField(controller: _emailCtrl, decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email)), validator: Validators.email),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _gender,
                    decoration: const InputDecoration(labelText: 'Gender', prefixIcon: Icon(Icons.wc)),
                    items: AppConstants.genders.map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(),
                    onChanged: (v) => setState(() => _gender = v!),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _bloodType,
                    decoration: const InputDecoration(labelText: 'Blood Type', prefixIcon: Icon(Icons.dangerous)),
                    items: AppConstants.bloodTypes.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
                    onChanged: (v) => setState(() => _bloodType = v!),
                  ),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () => _pickDate(true),
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Birth Date', prefixIcon: Icon(Icons.cake)),
                      child: Text(_birthDate != null ? DateFormat('dd MMM yyyy').format(_birthDate!) : 'Select date'),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _listEditor('Allergies', _allergies, _allergyCtrl, ColorConstants.emergency, isDark),
                  const SizedBox(height: 16),
                  _listEditor('Chronic Diseases', _diseases, _diseaseCtrl, const Color(0xFFFFB020), isDark),
                  const SizedBox(height: 16),
                  _listEditor('Current Medications', _medications, _medicationCtrl, ColorConstants.primary, isDark),
                  const SizedBox(height: 24),
                  TextFormField(controller: _insuranceCtrl, decoration: const InputDecoration(labelText: 'Insurance Provider', prefixIcon: Icon(Icons.business))),
                  const SizedBox(height: 16),
                  TextFormField(controller: _policyCtrl, decoration: const InputDecoration(labelText: 'Policy Number', prefixIcon: Icon(Icons.numbers)), validator: Validators.policyNumber),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () => _pickDate(false),
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Insurance Expiry', prefixIcon: Icon(Icons.calendar_today)),
                      child: Text(_insuranceExpiry != null ? DateFormat('dd MMM yyyy').format(_insuranceExpiry!) : 'Select date'),
                    ),
                  ),
                  const SizedBox(height: 32),
                  AnimatedButton(label: 'Save Changes', onPressed: _save, isLoading: isLoading),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _listEditor(String label, List<String> items, TextEditingController ctrl, Color color, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8, runSpacing: 6,
          children: [
            ...items.map((item) => Chip(
              label: Text(item, style: GoogleFonts.inter(fontSize: 12)),
              deleteIcon: const Icon(Icons.close, size: 16),
              onDeleted: () => setState(() => items.remove(item)),
              backgroundColor: color.withValues(alpha: 0.1),
              side: BorderSide.none,
            )),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: ctrl,
                decoration: InputDecoration(hintText: 'Add ${label.toLowerCase()}', isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10)),
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(Icons.add_circle, color: ColorConstants.primary),
              onPressed: () {
                if (ctrl.text.trim().isNotEmpty) {
                  setState(() {
                    items.add(ctrl.text.trim());
                    ctrl.clear();
                  });
                }
              },
            ),
          ],
        ),
      ],
    );
  }
}
