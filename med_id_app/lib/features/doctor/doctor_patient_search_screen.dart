import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/constants/color_constants.dart';

class DoctorPatientSearchScreen extends ConsumerStatefulWidget {
  const DoctorPatientSearchScreen({super.key});

  @override
  ConsumerState<DoctorPatientSearchScreen> createState() => _DoctorPatientSearchScreenState();
}

class _DoctorPatientSearchScreenState extends ConsumerState<DoctorPatientSearchScreen> {
  final _searchController = TextEditingController();
  final _api = MockApiService();
  List<Map<String, dynamic>> _results = [];
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() { _results = []; _error = null; });
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final userId = ref.read(authProvider).user?.id ?? 'doc1';
      final patients = await _api.getDoctorPatients(userId);
      final filtered = patients.where((p) =>
        (p['fullName'] as String).toLowerCase().contains(query.toLowerCase()) ||
        (p['phone'] as String).contains(query) ||
        (p['id'] as String).toLowerCase().contains(query.toLowerCase())
      ).toList();
      setState(() { _results = filtered; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
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
            title: Text('Bemorlarni qidirish', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
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
                      hintText: 'Ism, telefon yoki ID bo\'yicha qidirish',
                      prefixIcon: const Icon(Icons.search, color: ColorConstants.primary),
                      border: InputBorder.none,
                      hintStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                    ),
                    style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                  ),
                ),
              ),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : _error != null
                        ? ErrorStateWidget(message: _error, onRetry: () => _search(_searchController.text))
                        : _results.isEmpty
                            ? EmptyStateWidget(
                                icon: Icons.person_search,
                                title: 'Bemorlar topilmadi',
                                subtitle: 'Ism, telefon raqami yoki bemor ID si bo\'yicha qidirish',
                              )
                            : RefreshIndicator(
                                onRefresh: () => _search(_searchController.text),
                                child: ListView.builder(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  itemCount: _results.length,
                                  itemBuilder: (_, i) => FadeInUp(
                                    child: Padding(
                                      padding: const EdgeInsets.only(bottom: 12),
                                      child: GlassCard(
                                        onTap: () => context.go('/doctor/patient-detail/${_results[i]['id']}'),
                                        child: Row(
                                          children: [
                                            Container(
                                              width: 52, height: 52,
                                              decoration: BoxDecoration(
                                                color: ColorConstants.primary.withValues(alpha: 0.1),
                                                borderRadius: BorderRadius.circular(14),
                                              ),
                                              child: Center(
                                                child: Text(
                                                  (_results[i]['fullName'] as String).split(' ').map((e) => e[0]).take(2).join(),
                                                  style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: ColorConstants.primary),
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 14),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(_results[i]['fullName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                  const SizedBox(height: 4),
                                                  Row(children: [
                                                    Icon(Icons.phone, size: 12, color: isDark ? Colors.grey[500] : Colors.grey[400]),
                                                    const SizedBox(width: 4),
                                                    Text(_results[i]['phone'], style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                    const SizedBox(width: 12),
                                                    Container(
                                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                      decoration: BoxDecoration(color: ColorConstants.success.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                                                      child: Text(_results[i]['bloodType'] ?? 'N/A', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: ColorConstants.success)),
                                                    ),
                                                  ]),
                                                ],
                                              ),
                                            ),
                                            const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
                                          ],
                                        ),
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
