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

class ClinicQueueScreen extends ConsumerStatefulWidget {
  const ClinicQueueScreen({super.key});

  @override
  ConsumerState<ClinicQueueScreen> createState() => _ClinicQueueScreenState();
}

class _ClinicQueueScreenState extends ConsumerState<ClinicQueueScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _queue = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  final _searchController = TextEditingController();

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priorityController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadQueue();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _priorityController.dispose();
    super.dispose();
  }

  Future<void> _loadQueue() async {
    setState(() => _loading = true);
    final clinicId = ref.read(authProvider).user?.id ?? 'clinic1';
    final queue = await _api.getClinicQueue(clinicId);
    setState(() { _queue = queue; _filtered = queue; _loading = false; });
  }

  void _search(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filtered = List.from(_queue);
      } else {
        _filtered = _queue.where((q) =>
          (q['patientName'] as String).toLowerCase().contains(query.toLowerCase()) ||
          (q['patientId'] as String).toLowerCase().contains(query.toLowerCase())
        ).toList();
      }
    });
  }

  Future<void> _callNext() async {
    if (_queue.isEmpty) return;
    final next = _queue.removeAt(0);
    _filtered = List.from(_queue);
    setState(() {});
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Chaqirilmoqda: ${next['patientName']}'), backgroundColor: ColorConstants.success));
    }
  }

  Future<void> _addToQueue() async {
    if (!_formKey.currentState!.validate()) return;
    final entry = {
      'patientId': 'P-${DateTime.now().millisecondsSinceEpoch}',
      'patientName': _nameController.text.trim(),
      'priority': _priorityController.text.trim().toLowerCase(),
      'waitTime': '0 min',
    };
    await _api.addToQueue(entry);
    _queue.add(entry);
    _filtered = List.from(_queue);
    setState(() {});
    _nameController.clear();
    _priorityController.clear();
    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Navbatga qo\'shildi'), backgroundColor: ColorConstants.success));
    }
  }

  Color _priorityColor(String priority) {
    switch (priority) {
      case 'critical': return ColorConstants.emergency;
      case 'high': return const Color(0xFFFFB020);
      case 'medium': return const Color(0xFF0F6FFF);
      default: return ColorConstants.success;
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
            title: Text('Navbat boshqaruvi', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
            actions: [
              IconButton(icon: const Icon(Icons.person_add), onPressed: () => _showAddDialog(context, isDark)),
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
                      hintText: 'Navbatni qidirish...',
                      prefixIcon: const Icon(Icons.search, color: ColorConstants.primary),
                      border: InputBorder.none,
                      hintStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                    ),
                    style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _queue.isEmpty ? null : _callNext,
                    icon: const Icon(Icons.skip_next),
                    label: const Text('Keyingi bemorni chaqirish'),
                    style: ElevatedButton.styleFrom(backgroundColor: ColorConstants.success),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : _filtered.isEmpty
                        ? const EmptyStateWidget(icon: Icons.queue, title: 'Navbat bo\'sh', subtitle: 'Kutayotgan bemorlar yo\'q')
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
                                        width: 44, height: 44,
                                        decoration: BoxDecoration(
                                          color: _priorityColor(_filtered[i]['priority']).withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Center(
                                          child: Text('${i + 1}', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: _priorityColor(_filtered[i]['priority']))),
                                        ),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(_filtered[i]['patientName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                            const SizedBox(height: 2),
                                            Row(children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(color: _priorityColor(_filtered[i]['priority']).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                                                child: Text(_filtered[i]['priority'], style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: _priorityColor(_filtered[i]['priority']))),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(_filtered[i]['waitTime'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                            ]),
                                          ],
                                        ),
                                      ),
                                      Text(_filtered[i]['patientId'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400])),
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

  void _showAddDialog(BuildContext context, bool isDark) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Navbatga qo\'shish', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
        content: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Bemor ismi'),
                validator: (v) => v == null || v.trim().isEmpty ? 'Majburiy' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _priorityController,
                decoration: const InputDecoration(labelText: 'Prioritet (past/o\'rta/yuqori/kritik)'),
                validator: (v) => v == null || v.trim().isEmpty ? 'Majburiy' : null,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Bekor qilish')),
          ElevatedButton(onPressed: _addToQueue, child: const Text('Qo\'shish')),
        ],
      ),
    );
  }
}
