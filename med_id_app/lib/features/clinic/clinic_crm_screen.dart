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

class ClinicCrmScreen extends ConsumerStatefulWidget {
  const ClinicCrmScreen({super.key});

  @override
  ConsumerState<ClinicCrmScreen> createState() => _ClinicCrmScreenState();
}

class _ClinicCrmScreenState extends ConsumerState<ClinicCrmScreen> {
  final _api = MockApiService();
  List<Map<String, dynamic>> _patients = [];
  List<Map<String, dynamic>> _filtered = [];
  bool _loading = true;
  final _searchController = TextEditingController();
  final _noteController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final userId = ref.read(authProvider).user?.id ?? 'doc1';
    final patients = await _api.getDoctorPatients(userId);
    setState(() {
      _patients = patients.map((p) => Map<String, dynamic>.from(p)..['lastVisit'] = '2026-06-${(patients.indexOf(p) + 1).toString().padLeft(2, '0')}'..['notes'] = <String>[]).toList();
      _filtered = List.from(_patients);
      _loading = false;
    });
  }

  void _search(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filtered = List.from(_patients);
      } else {
        _filtered = _patients.where((p) =>
          (p['fullName'] as String).toLowerCase().contains(query.toLowerCase()) ||
          (p['phone'] as String).contains(query)
        ).toList();
      }
    });
  }

  void _addNote(int index) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Izoh qo\'shish'),
        content: TextField(
          controller: _noteController,
          decoration: const InputDecoration(labelText: 'Izoh'),
          maxLines: 3,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Bekor qilish')),
          ElevatedButton(onPressed: () {
            if (_noteController.text.trim().isNotEmpty) {
              (_filtered[index]['notes'] as List).add(_noteController.text.trim());
              _noteController.clear();
              setState(() {});
              Navigator.of(ctx).pop();
            }
          }, child: const Text('Qo\'shish')),
        ],
      ),
    );
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
            title: Text('Bemor CRM', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
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
                      hintText: 'Bemorlarni qidirish...',
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
                        ? const EmptyStateWidget(icon: Icons.people, title: 'Bemorlar topilmadi')
                        : ListView.builder(
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
                                            width: 48, height: 48,
                                            decoration: BoxDecoration(color: ColorConstants.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)),
                                            child: Center(
                                              child: Text(
                                                (_filtered[i]['fullName'] as String).split(' ').map((e) => e[0]).take(2).join(),
                                                style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: ColorConstants.primary),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 14),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(_filtered[i]['fullName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                const SizedBox(height: 2),
                                                Row(children: [
                                                  Icon(Icons.phone, size: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                                                  const SizedBox(width: 4),
                                                  Text(_filtered[i]['phone'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                ]),
                                              ],
                                            ),
                                          ),
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.end,
                                            children: [
                                              Text('Oxirgi tashrif:', style: GoogleFonts.inter(fontSize: 10, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                              Text(_filtered[i]['lastVisit'], style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                            ],
                                          ),
                                        ],
                                      ),
                                      if ((_filtered[i]['notes'] as List).isNotEmpty) ...[
                                        const SizedBox(height: 8),
                                        const Divider(height: 1),
                                        ...(_filtered[i]['notes'] as List).map((n) => Padding(
                                          padding: const EdgeInsets.symmetric(vertical: 4),
                                          child: Row(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Icon(Icons.note, size: 14, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                                              const SizedBox(width: 8),
                                              Expanded(child: Text(n, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500]))),
                                            ],
                                          ),
                                        )),
                                      ],
                                      const SizedBox(height: 8),
                                      Align(
                                        alignment: Alignment.centerRight,
                                        child: TextButton.icon(
                                          onPressed: () => _addNote(i),
                                          icon: const Icon(Icons.add, size: 16),
                                          label: const Text('Izoh qo\'shish', style: TextStyle(fontSize: 12)),
                                        ),
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
}
