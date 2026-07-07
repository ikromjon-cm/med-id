import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/access_log_provider.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/constants/color_constants.dart';

class AccessLogsScreen extends ConsumerStatefulWidget {
  const AccessLogsScreen({super.key});

  @override
  ConsumerState<AccessLogsScreen> createState() => _AccessLogsScreenState();
}

class _AccessLogsScreenState extends ConsumerState<AccessLogsScreen> {
  String _filter = 'All';
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(accessLogProvider.notifier).loadLogs(ref.read(authProvider).user?.id ?? 'user1');
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Color _actionColor(String action) {
    switch (action) {
      case 'viewed': return ColorConstants.primary;
      case 'edited': return const Color(0xFFFFB020);
      case 'uploaded': return const Color(0xFF00C896);
      case 'deleted': return ColorConstants.emergency;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(accessLogProvider);

    var logs = state.logs;
    if (_filter != 'All') logs = logs.where((l) => l.action == _filter.toLowerCase()).toList();
    if (_searchCtrl.text.isNotEmpty) logs = logs.where((l) => l.accessedBy.toLowerCase().contains(_searchCtrl.text.toLowerCase()) || l.dataType.toLowerCase().contains(_searchCtrl.text.toLowerCase())).toList();

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
            title: Text('Kirish jurnallari', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: TextField(
                  controller: _searchCtrl,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Ism yoki ma\'lumot turi bo\'yicha qidirish...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchCtrl.text.isNotEmpty ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchCtrl.clear(); setState(() {}); }) : null,
                  ),
                ),
              ),
              SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: ['Barchasi', 'Ko\'rilgan', 'Tahrirlangan', 'Yuklangan', 'O\'chirilgan'].map((f) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(f, style: GoogleFonts.inter(fontSize: 12)),
                      selected: _filter == f,
                      onSelected: (_) => setState(() => _filter = f),
                      selectedColor: ColorConstants.primary,
                      labelStyle: TextStyle(color: _filter == f ? Colors.white : null),
                    ),
                  )).toList(),
                ),
              ),
              Expanded(
                child: state.isLoading
                    ? const ShimmerLoading(itemCount: 5, itemHeight: 80)
                    : state.error != null
                        ? ErrorStateWidget(message: state.error, onRetry: () => ref.read(accessLogProvider.notifier).loadLogs(ref.read(authProvider).user?.id ?? 'user1'))
                        : logs.isEmpty
                            ? EmptyStateWidget(icon: Icons.security, title: 'Kirish jurnallari yo\'q', subtitle: 'Kirish jurnallari bu yerda ko\'rinadi')
                            : RefreshIndicator(
                                onRefresh: () => ref.read(accessLogProvider.notifier).loadLogs(ref.read(authProvider).user?.id ?? 'user1'),
                                child: ListView.builder(
                                  padding: const EdgeInsets.all(16),
                                  itemCount: logs.length,
                                  itemBuilder: (_, i) {
                                    final log = logs[i];
                                    return Padding(
                                      padding: const EdgeInsets.only(bottom: 10),
                                      child: Container(
                                        padding: const EdgeInsets.all(14),
                                        decoration: BoxDecoration(
                                          color: isDark ? const Color(0xFF21262D) : Colors.white,
                                          borderRadius: BorderRadius.circular(12),
                                          border: Border.all(color: isDark ? Colors.white12 : Colors.grey[200]!),
                                        ),
                                        child: Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: BoxDecoration(color: _actionColor(log.action).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                              child: Icon(_actionIcon(log.action), size: 20, color: _actionColor(log.action)),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text('${log.accessedBy} (${log.accessorRole})', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                  const SizedBox(height: 2),
                                                  Row(
                                                    children: [
                                                      Container(
                                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                                        decoration: BoxDecoration(color: _actionColor(log.action).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(4)),
                                                        child: Text(log.action.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, color: _actionColor(log.action), fontWeight: FontWeight.w600)),
                                                      ),
                                                      const SizedBox(width: 6),
                                                      Text(log.dataType, style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 2),
                                                  Text(DateFormat('dd MMM yyyy, HH:mm').format(log.timestamp), style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[600] : Colors.grey[400])),
                                                ],
                                              ),
                                            ),
                                          ],
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

  IconData _actionIcon(String action) {
    switch (action) {
      case 'viewed': return Icons.visibility;
      case 'edited': return Icons.edit;
      case 'uploaded': return Icons.upload_file;
      case 'deleted': return Icons.delete;
      default: return Icons.info;
    }
  }
}
