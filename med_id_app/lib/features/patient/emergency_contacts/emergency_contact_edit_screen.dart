import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/providers/emergency_contact_provider.dart';
import '../../../core/models/emergency_contact_model.dart';
import '../../../core/widgets/animated_button.dart';
import '../../../core/constants/color_constants.dart';

class EmergencyContactEditScreen extends ConsumerStatefulWidget {
  final String? contactId;
  const EmergencyContactEditScreen({super.key, this.contactId});

  @override
  ConsumerState<EmergencyContactEditScreen> createState() => _EmergencyContactEditScreenState();
}

class _EmergencyContactEditScreenState extends ConsumerState<EmergencyContactEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  String _relation = 'Relative';
  bool _isPrimary = false;
  bool _isEditing = false;

  final _relations = ['Relative', 'Spouse', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Doctor', 'Other'];

  @override
  void initState() {
    super.initState();
    if (widget.contactId != null) {
      _isEditing = true;
      final state = ref.read(emergencyContactProvider);
      final contact = state.contacts.where((c) => c.id == widget.contactId).firstOrNull;
      if (contact != null) {
        _nameCtrl.text = contact.fullName;
        _phoneCtrl.text = contact.phone;
        _emailCtrl.text = contact.email ?? '';
        _relation = contact.relation;
        _isPrimary = contact.isPrimary;
      }
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      final contact = EmergencyContactModel(
        id: widget.contactId ?? 'ec${DateTime.now().millisecondsSinceEpoch}',
        patientId: 'user1',
        fullName: _nameCtrl.text.trim(),
        phone: _phoneCtrl.text.trim(),
        relation: _relation,
        email: _emailCtrl.text.isNotEmpty ? _emailCtrl.text.trim() : null,
        isPrimary: _isPrimary,
      );

      if (_isEditing) {
        ref.read(emergencyContactProvider.notifier).updateContact(contact);
      } else {
        ref.read(emergencyContactProvider.notifier).addContact(contact);
      }

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(_isEditing ? 'Contact updated' : 'Contact added'),
        backgroundColor: const Color(0xFF00C896),
      ));
      context.pop();
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
            title: Text(_isEditing ? 'Edit Contact' : 'Add Contact', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextFormField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person)), validator: (v) => v == null || v.trim().isEmpty ? 'Name required' : null),
                  const SizedBox(height: 16),
                  TextFormField(controller: _phoneCtrl, decoration: const InputDecoration(labelText: 'Phone', prefixIcon: Icon(Icons.phone)), keyboardType: TextInputType.phone, validator: (v) => v == null || v.trim().isEmpty ? 'Phone required' : null),
                  const SizedBox(height: 16),
                  TextFormField(controller: _emailCtrl, decoration: const InputDecoration(labelText: 'Email (optional)', prefixIcon: Icon(Icons.email))),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _relation,
                    decoration: const InputDecoration(labelText: 'Relation', prefixIcon: Icon(Icons.people)),
                    items: _relations.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
                    onChanged: (v) => setState(() => _relation = v!),
                  ),
                  const SizedBox(height: 16),
                  SwitchListTile(
                    title: Text('Primary Contact', style: GoogleFonts.inter(fontSize: 14)),
                    subtitle: Text('Primary contact is shown first in emergencies', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                    value: _isPrimary,
                    onChanged: (v) => setState(() => _isPrimary = v),
                    activeColor: ColorConstants.primary,
                  ),
                  const SizedBox(height: 32),
                  AnimatedButton(label: _isEditing ? 'Update Contact' : 'Add Contact', onPressed: _save),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
