import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/constants/color_constants.dart';

class ClinicStaffScreen extends ConsumerStatefulWidget {
  const ClinicStaffScreen({super.key});

  @override
  ConsumerState<ClinicStaffScreen> createState() => _ClinicStaffScreenState();
}

class _ClinicStaffScreenState extends ConsumerState<ClinicStaffScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _staff = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  final _searchController = TextEditingController();

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _roleController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _roleController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final staff = await _api.getClinicStaff('clinic1');
    setState(() { _staff = staff; _filtered = staff; _loading = false; });
  }

  void _search(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filtered = List.from(_staff);
      } else {
        _filtered = _staff.where((s) =>
          (s['fullName'] as String).toLowerCase().contains(query.toLowerCase()) ||
          (s['role'] as String).toLowerCase().contains(query.toLowerCase())
        ).toList();
      }
    });
  }

  Future<void> _addStaff() async {
    if (!_formKey.currentState!.validate()) return;
    final staff = {
      'id': 'stf_${DateTime.now().millisecondsSinceEpoch}',
      'fullName': _nameController.text.trim(),
      'role': _roleController.text.trim().toLowerCase(),
      'phone': _phoneController.text.trim(),
    };
    _staff.add(staff);
    _filtered = List.from(_staff);
    setState(() {});
    _nameController.clear();
    _roleController.clear();
    _phoneController.clear();
    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Staff added'), backgroundColor: ColorConstants.success));
    }
  }

  void _editStaff(int index) {
    final s = _filtered[index];
    _nameController.text = s['fullName'];
    _roleController.text = s['role'];
    _phoneController.text = s['phone'];
    showDialog(context: context, builder: (ctx) => _staffFormDialog(ctx, 'Edit Staff', () async {
      _filtered[index]['fullName'] = _nameController.text.trim();
      _filtered[index]['role'] = _roleController.text.trim();
      _filtered[index]['phone'] = _phoneController.text.trim();
      setState(() {});
      if (mounted) Navigator.of(ctx).pop();
    }));
  }

  void _deleteStaff(int index) {
    final removed = _filtered.removeAt(index);
    _staff.removeWhere((s) => s['id'] == removed['id']);
    setState(() {});
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Staff removed'), backgroundColor: ColorConstants.error));
  }

  IconData _roleIcon(String role) {
    switch (role) {
      case 'doctor': return Icons.medical_services;
      case 'nurse': return Icons.local_hospital;
      case 'receptionist': return Icons.assignment_ind;
      default: return Icons.person;
    }
  }

  Color _roleColor(String role) {
    switch (role) {
      case 'doctor': return const Color(0xFF0F6FFF);
      case 'nurse': return const Color(0xFF00C896);
      case 'receptionist': return const Color(0xFFFFB020);
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
            title: Text('Staff', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
            actions: [
              IconButton(icon: const Icon(Icons.person_add), onPressed: () => showDialog(context: context, builder: (ctx) => _staffFormDialog(ctx, 'Add Staff', _addStaff))),
            ],
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _search,
                    decoration: InputDecoration(
                      hintText: 'Search staff...',
                      prefixIcon: const Icon(Icons.search, color: ColorConstants.primary),
                      border: InputBorder.none,
                    ),
                    style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                  ),
                ),
              ),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : _filtered.isEmpty
                        ? const EmptyStateWidget(icon: Icons.people, title: 'No staff found')
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
                                        width: 48, height: 48,
                                        decoration: BoxDecoration(color: _roleColor(_filtered[i]['role']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)),
                                        child: Icon(_roleIcon(_filtered[i]['role']), size: 26, color: _roleColor(_filtered[i]['role'])),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(_filtered[i]['fullName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                            const SizedBox(height: 2),
                                            Row(children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(color: _roleColor(_filtered[i]['role']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                                                child: Text(_filtered[i]['role'], style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: _roleColor(_filtered[i]['role']))),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(_filtered[i]['phone'] ?? '', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                            ]),
                                          ],
                                        ),
                                      ),
                                      PopupMenuButton<String>(
                                        onSelected: (v) {
                                          if (v == 'edit') _editStaff(i);
                                          if (v == 'delete') _deleteStaff(i);
                                        },
                                        itemBuilder: (_) => [
                                          const PopupMenuItem(value: 'edit', child: Text('Edit')),
                                          const PopupMenuItem(value: 'delete', child: Text('Delete')),
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

  Widget _staffFormDialog(BuildContext ctx, String title, VoidCallback onSave) {
    return AlertDialog(
      title: Text(title, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full Name'),
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _roleController,
              decoration: const InputDecoration(labelText: 'Role (doctor/nurse/receptionist)'),
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _phoneController,
              decoration: const InputDecoration(labelText: 'Phone'),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Cancel')),
        ElevatedButton(onPressed: onSave, child: const Text('Save')),
      ],
    );
  }
}
