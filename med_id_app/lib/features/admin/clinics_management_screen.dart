import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';

class ClinicsManagementScreen extends ConsumerStatefulWidget {
  const ClinicsManagementScreen({super.key});

  @override
  ConsumerState<ClinicsManagementScreen> createState() => _ClinicsManagementScreenState();
}

class _ClinicsManagementScreenState extends ConsumerState<ClinicsManagementScreen> {
  List<Map<String, dynamic>> _clinics = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadClinics();
  }

  Future<void> _loadClinics() async {
    setState(() => _loading = true);
    final clinics = await MockApiService().getClinics();
    if (mounted) setState(() { _clinics = clinics; _loading = false; });
  }

  void _confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Clinic'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () {
            MockApiService().deleteClinic(id);
            _loadClinics();
            Navigator.pop(ctx);
          }, child: const Text('Delete', style: TextStyle(color: Colors.red))),
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
            title: Text('Clinics Management', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 5)
              : _clinics.isEmpty
                  ? const EmptyStateWidget(icon: Icons.local_hospital, title: 'No clinics')
                  : RefreshIndicator(
                      onRefresh: _loadClinics,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _clinics.length,
                        itemBuilder: (_, i) {
                          final c = _clinics[i];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: GlassCard(
                              child: ListTile(
                                leading: Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(color: const Color(0xFF0F6FFF).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                  child: const Icon(Icons.local_hospital, color: Color(0xFF0F6FFF)),
                                ),
                                title: Text(c['name'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                subtitle: Text('${c['address']} | ${c['phone']} | ${c['doctorsCount']} doctors', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: c['status'] == 'active' ? const Color(0xFF00C896).withValues(alpha: 0.15) : const Color(0xFFFF4D4F).withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(c['status'], style: GoogleFonts.inter(fontSize: 11, color: c['status'] == 'active' ? const Color(0xFF00C896) : const Color(0xFFFF4D4F))),
                                    ),
                                    const SizedBox(width: 4),
                                    IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFFF4D4F)), onPressed: () => _confirmDelete(c['id'])),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
        ),
      ),
    );
  }
}
