import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/models/user_model.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';

class UsersManagementScreen extends ConsumerStatefulWidget {
  const UsersManagementScreen({super.key});

  @override
  ConsumerState<UsersManagementScreen> createState() => _UsersManagementScreenState();
}

class _UsersManagementScreenState extends ConsumerState<UsersManagementScreen> {
  List<UserModel> _users = [];
  bool _loading = true;
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadUsers() async {
    setState(() => _loading = true);
    final users = await MockApiService().getUsers();
    if (mounted) setState(() { _users = users; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final filtered = _users.where((u) => _searchCtrl.text.isEmpty || u.fullName.toLowerCase().contains(_searchCtrl.text.toLowerCase()) || u.phone.contains(_searchCtrl.text)).toList();

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark ? [const Color(0xFF0D1117), const Color(0xFF161B22)] : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
        ),
      ),
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(title: Text('Foydalanuvchilar boshqaruvi', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  controller: _searchCtrl,
                  onChanged: (_) => setState(() {}),
                  decoration: const InputDecoration(hintText: 'Foydalanuvchilarni qidirish...', prefixIcon: Icon(Icons.search)),
                ),
              ),
              Expanded(
                child: _loading
                    ? const ShimmerLoading(itemCount: 5)
                    : filtered.isEmpty
                        ? const EmptyStateWidget(icon: Icons.people, title: 'Foydalanuvchilar topilmadi')
                        : RefreshIndicator(
                            onRefresh: _loadUsers,
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: filtered.length,
                              itemBuilder: (_, i) {
                                final u = filtered[i];
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 10),
                                  child: GlassCard(
                                    child: ListTile(
                                      leading: CircleAvatar(
                                        backgroundColor: const Color(0xFF0F6FFF).withValues(alpha: 0.1),
                                        child: Text(u.fullName[0], style: GoogleFonts.inter(color: const Color(0xFF0F6FFF), fontWeight: FontWeight.bold)),
                                      ),
                                      title: Text(u.fullName, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                      subtitle: Text('${u.phone} | ${u.email ?? "Email yoq"}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                      trailing: Chip(label: Text(u.bloodType ?? 'Mavjud emas', style: GoogleFonts.inter(fontSize: 11)), backgroundColor: const Color(0xFF0F6FFF).withValues(alpha: 0.1)),
                                    ),
                                  ),
                                );
                              },
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
