import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/providers/emergency_contact_provider.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/constants/color_constants.dart';

class EmergencyContactsScreen extends ConsumerStatefulWidget {
  const EmergencyContactsScreen({super.key});

  @override
  ConsumerState<EmergencyContactsScreen> createState() => _EmergencyContactsScreenState();
}

class _EmergencyContactsScreenState extends ConsumerState<EmergencyContactsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(emergencyContactProvider.notifier).loadContacts('user1');
    });
  }

  void _confirmDelete(String contactId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Contact'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () {
            ref.read(emergencyContactProvider.notifier).deleteContact(contactId);
            Navigator.pop(ctx);
          }, child: const Text('Delete', style: TextStyle(color: ColorConstants.emergency))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(emergencyContactProvider);

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
            title: Text('Emergency Contacts', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
            actions: [
              IconButton(icon: const Icon(Icons.add), onPressed: () => context.go('/patient/emergency-contacts/edit')),
            ],
          ),
          body: state.isLoading
              ? const ShimmerLoading(itemCount: 3, itemHeight: 100)
              : state.error != null
                  ? ErrorStateWidget(message: state.error, onRetry: () => ref.read(emergencyContactProvider.notifier).loadContacts('user1'))
                  : state.contacts.isEmpty
                      ? EmptyStateWidget(icon: Icons.contacts, title: 'No emergency contacts', subtitle: 'Add emergency contacts who can be reached in case of emergency', actionLabel: 'Add Contact', onAction: () => context.go('/patient/emergency-contacts/edit'))
                      : RefreshIndicator(
                          onRefresh: () => ref.read(emergencyContactProvider.notifier).loadContacts('user1'),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: state.contacts.length,
                            itemBuilder: (_, i) {
                              final c = state.contacts[i];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: GlassCard(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              width: 48, height: 48,
                                              decoration: BoxDecoration(color: c.isPrimary ? ColorConstants.emergency.withValues(alpha: 0.15) : const Color(0xFF0F6FFF).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)),
                                              child: Icon(Icons.person, size: 24, color: c.isPrimary ? ColorConstants.emergency : const Color(0xFF0F6FFF)),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Text(c.fullName, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                                                      if (c.isPrimary) ...[
                                                        const SizedBox(width: 8),
                                                        Container(
                                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                          decoration: BoxDecoration(color: ColorConstants.emergency.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(4)),
                                                          child: Text('Primary', style: GoogleFonts.inter(fontSize: 10, color: ColorConstants.emergency, fontWeight: FontWeight.w600)),
                                                        ),
                                                      ],
                                                    ],
                                                  ),
                                                  const SizedBox(height: 2),
                                                  Text('${c.relation} | ${c.phone}', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                                                ],
                                              ),
                                            ),
                                            PopupMenuButton<String>(
                                              onSelected: (v) {
                                                if (v == 'edit') context.go('/patient/emergency-contacts/edit?id=${c.id}');
                                                if (v == 'delete') _confirmDelete(c.id);
                                              },
                                              itemBuilder: (_) => [
                                                const PopupMenuItem(value: 'edit', child: Text('Edit')),
                                                const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: ColorConstants.emergency))),
                                              ],
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Row(
                                          children: [
                                            Expanded(
                                              child: OutlinedButton.icon(
                                                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Calling ${c.fullName}...'))),
                                                icon: const Icon(Icons.call, size: 16),
                                                label: Text('Call', style: GoogleFonts.inter(fontSize: 12)),
                                                style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFF00C896), side: const BorderSide(color: Color(0xFF00C896))),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Expanded(
                                              child: OutlinedButton.icon(
                                                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('SMS sent to ${c.fullName}'))),
                                                icon: const Icon(Icons.message, size: 16),
                                                label: Text('SMS', style: GoogleFonts.inter(fontSize: 12)),
                                                style: OutlinedButton.styleFrom(foregroundColor: ColorConstants.primary, side: const BorderSide(color: ColorConstants.primary)),
                                              ),
                                            ),
                                          ],
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
