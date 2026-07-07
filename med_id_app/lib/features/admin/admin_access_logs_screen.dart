import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../core/providers/access_log_provider.dart';
import '../../core/widgets/shimmer_loading.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/error_state_widget.dart';

class AdminAccessLogsScreen extends ConsumerStatefulWidget {
  const AdminAccessLogsScreen({super.key});

  @override
  ConsumerState<AdminAccessLogsScreen> createState() => _AdminAccessLogsScreenState();
}

class _AdminAccessLogsScreenState extends ConsumerState<AdminAccessLogsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(accessLogProvider.notifier).loadAllLogs();
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(accessLogProvider);

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark ? [const Color(0xFF0D1117), const Color(0xFF161B22)] : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
        ),
      ),
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(title: Text('Kirish jurnallari', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: state.isLoading
              ? const ShimmerLoading(itemCount: 5)
              : state.error != null
                  ? ErrorStateWidget(message: state.error, onRetry: () => ref.read(accessLogProvider.notifier).loadAllLogs())
                  : state.logs.isEmpty
                      ? const EmptyStateWidget(icon: Icons.security, title: 'Jurnallar yo\'q')
                      : RefreshIndicator(
                          onRefresh: () => ref.read(accessLogProvider.notifier).loadAllLogs(),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: state.logs.length,
                            itemBuilder: (_, i) {
                              final log = state.logs[i];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF21262D) : Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: isDark ? Colors.white12 : Colors.grey[200]!),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text('${log.accessedBy} - ${log.accessorRole}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                            const SizedBox(height: 2),
                                            Text('${log.action} ${log.dataType}', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                          ],
                                        ),
                                      ),
                                      Text(DateFormat('dd MMM HH:mm').format(log.timestamp), style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                    ],
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
