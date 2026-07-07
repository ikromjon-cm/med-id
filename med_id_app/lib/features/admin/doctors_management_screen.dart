import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';

class DoctorsManagementScreen extends ConsumerStatefulWidget {
  const DoctorsManagementScreen({super.key});

  @override
  ConsumerState<DoctorsManagementScreen> createState() => _DoctorsManagementScreenState();
}

class _DoctorsManagementScreenState extends ConsumerState<DoctorsManagementScreen> {
  List<Map<String, dynamic>> _doctors = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    setState(() => _loading = true);
    final doctors = await MockApiService().getDoctors();
    if (mounted) setState(() { _doctors = doctors; _loading = false; });
  }

  void _confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Shifokorni o\'chirish'),
        content: const Text('Ishonchingiz komilmi?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Bekor qilish')),
          TextButton(onPressed: () {
            MockApiService().deleteDoctor(id);
            _loadDoctors();
            Navigator.pop(ctx);
          }, child: const Text('O\'chirish', style: TextStyle(color: Colors.red))),
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
            title: Text('Shifokorlar boshqaruvi', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: _loading
              ? const ShimmerLoading(itemCount: 5)
              : _doctors.isEmpty
                  ? const EmptyStateWidget(icon: Icons.medical_services, title: 'Shifokorlar yo\'q')
                  : RefreshIndicator(
                      onRefresh: _loadDoctors,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _doctors.length,
                        itemBuilder: (_, i) {
                          final d = _doctors[i];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: GlassCard(
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: const Color(0xFF00C896).withValues(alpha: 0.1),
                                  child: Text(d['fullName'].toString().split(' ').skip(1).join(' ')[0], style: GoogleFonts.inter(color: const Color(0xFF00C896), fontWeight: FontWeight.bold)),
                                ),
                                title: Text(d['fullName'], style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                subtitle: Text('${d['specialty']} | ${d['phone']}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: d['status'] == 'active' ? const Color(0xFF00C896).withValues(alpha: 0.15) : const Color(0xFFFF4D4F).withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(d['status'], style: GoogleFonts.inter(fontSize: 11, color: d['status'] == 'active' ? const Color(0xFF00C896) : const Color(0xFFFF4D4F))),
                                    ),
                                    const SizedBox(width: 4),
                                    IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFFF4D4F)), onPressed: () => _confirmDelete(d['id'])),
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
