import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/notification_provider.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/constants/color_constants.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(notificationProvider.notifier).loadNotifications(ref.read(authProvider).user?.id ?? 'user1');
    });
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'appointment': return Icons.calendar_today;
      case 'emergency': return Icons.warning;
      case 'insurance': return Icons.health_and_safety;
      case 'document': return Icons.description;
      default: return Icons.notifications;
    }
  }

  Color _typeColor(String type) {
    switch (type) {
      case 'appointment': return ColorConstants.primary;
      case 'emergency': return ColorConstants.emergency;
      case 'insurance': return const Color(0xFFFFB020);
      case 'document': return const Color(0xFF00C896);
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(notificationProvider);

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
            title: Text('Bildirishnomalar', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: state.isLoading
              ? const ShimmerLoading(itemCount: 5, itemHeight: 90)
              : state.error != null
                  ? ErrorStateWidget(message: state.error, onRetry: () => ref.read(notificationProvider.notifier).loadNotifications(ref.read(authProvider).user?.id ?? 'user1'))
                  : state.notifications.isEmpty
                      ? EmptyStateWidget(icon: Icons.notifications_off, title: 'Bildirishnomalar yo\'q', subtitle: 'Barcha bildirishnomalar ko\'rilgan')
                      : RefreshIndicator(
                          onRefresh: () => ref.read(notificationProvider.notifier).loadNotifications(ref.read(authProvider).user?.id ?? 'user1'),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: state.notifications.length,
                            itemBuilder: (_, i) {
                              final n = state.notifications[i];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: InkWell(
                                  onTap: () {
                                    if (!n.isRead) ref.read(notificationProvider.notifier).markAsRead(n.id);
                                  },
                                  borderRadius: BorderRadius.circular(12),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 300),
                                    padding: const EdgeInsets.all(14),
                                    decoration: BoxDecoration(
                                      color: n.isRead
                                          ? (isDark ? const Color(0xFF21262D).withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.7))
                                          : (isDark ? const Color(0xFF21262D) : Colors.white),
                                      borderRadius: BorderRadius.circular(12),
                                      border: !n.isRead
                                          ? Border.all(color: _typeColor(n.type).withValues(alpha: 0.3))
                                          : null,
                                      boxShadow: n.isRead
                                          ? []
                                          : [BoxShadow(color: _typeColor(n.type).withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, 2))],
                                    ),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          decoration: BoxDecoration(color: _typeColor(n.type).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                                          child: Icon(_typeIcon(n.type), size: 20, color: _typeColor(n.type)),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(n.title, style: GoogleFonts.inter(fontSize: 14, fontWeight: n.isRead ? FontWeight.w400 : FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                              const SizedBox(height: 4),
                                              Text(n.body, style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500]), maxLines: 2, overflow: TextOverflow.ellipsis),
                                              const SizedBox(height: 4),
                                              Text(DateFormat('dd MMM HH:mm').format(n.timestamp), style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[600] : Colors.grey[400])),
                                            ],
                                          ),
                                        ),
                                        if (!n.isRead)
                                          Container(
                                            width: 8, height: 8,
                                            decoration: BoxDecoration(color: _typeColor(n.type), shape: BoxShape.circle),
                                          ),
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
