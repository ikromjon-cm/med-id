import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/document_provider.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/shimmer_loading.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/constants/color_constants.dart';

class DocumentsScreen extends ConsumerStatefulWidget {
  const DocumentsScreen({super.key});

  @override
  ConsumerState<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends ConsumerState<DocumentsScreen> {
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(documentProvider.notifier).loadDocuments('user1');
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Color _typeColor(String type) {
    switch (type) {
      case 'Lab Results': return const Color(0xFF7C3AED);
      case 'Prescription': return const Color(0xFF0F6FFF);
      case 'Vaccination': return const Color(0xFF00C896);
      case 'MRI': return const Color(0xFFFFB020);
      case 'CT': return const Color(0xFFFF4D4F);
      case 'Insurance Documents': return const Color(0xFF0891B2);
      default: return ColorConstants.primary;
    }
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'Lab Results': return Icons.science;
      case 'Prescription': return Icons.medical_services;
      case 'Vaccination': return Icons.vaccines;
      case 'MRI': return Icons.biotech;
      case 'CT': return Icons.emergency;
      case 'Insurance Documents': return Icons.description;
      default: return Icons.description;
    }
  }

  void _confirmDelete(String docId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Document'),
        content: const Text('Are you sure you want to delete this document?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () {
            ref.read(documentProvider.notifier).deleteDocument(docId);
            Navigator.pop(ctx);
          }, child: const Text('Delete', style: TextStyle(color: ColorConstants.emergency))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final docState = ref.watch(documentProvider);
    final docs = docState.documents.where((d) => _searchCtrl.text.isEmpty || d.name.toLowerCase().contains(_searchCtrl.text.toLowerCase()) || d.type.toLowerCase().contains(_searchCtrl.text.toLowerCase())).toList();

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
            title: Text('Documents', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
            actions: [
              IconButton(icon: const Icon(Icons.add), onPressed: () => context.go('/patient/documents/upload')),
            ],
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: TextField(
                  controller: _searchCtrl,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Search documents...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchCtrl.text.isNotEmpty ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchCtrl.clear(); setState(() {}); }) : null,
                  ),
                ),
              ),
              Expanded(
                child: docState.isLoading
                    ? const ShimmerLoading(itemCount: 5, itemHeight: 100)
                    : docState.error != null
                        ? ErrorStateWidget(message: docState.error, onRetry: () => ref.read(documentProvider.notifier).loadDocuments('user1'))
                        : docs.isEmpty
                            ? EmptyStateWidget(icon: Icons.description, title: 'No documents yet', subtitle: 'Upload your medical documents', actionLabel: 'Upload Document', onAction: () => context.go('/patient/documents/upload'))
                            : RefreshIndicator(
                                onRefresh: () => ref.read(documentProvider.notifier).loadDocuments('user1'),
                                child: ListView.builder(
                                  padding: const EdgeInsets.all(16),
                                  itemCount: docs.length,
                                  itemBuilder: (_, i) {
                                    final doc = docs[i];
                                    return Padding(
                                      padding: const EdgeInsets.only(bottom: 12),
                                      child: GlassCard(
                                        onTap: () => context.go('/patient/documents/preview?id=${doc.id}'),
                                        child: Padding(
                                          padding: const EdgeInsets.all(16),
                                          child: Row(
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.all(10),
                                                decoration: BoxDecoration(color: _typeColor(doc.type).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                                                child: Icon(_typeIcon(doc.type), size: 24, color: _typeColor(doc.type)),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(doc.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21)), maxLines: 1, overflow: TextOverflow.ellipsis),
                                                    const SizedBox(height: 4),
                                                    Row(
                                                      children: [
                                                        Container(
                                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                          decoration: BoxDecoration(color: _typeColor(doc.type).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                                                          child: Text(doc.type, style: GoogleFonts.inter(fontSize: 11, color: _typeColor(doc.type))),
                                                        ),
                                                        const SizedBox(width: 8),
                                                        Text(DateFormat('dd MMM yyyy').format(doc.uploadDate), style: GoogleFonts.inter(fontSize: 11, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                              ),
                                              IconButton(
                                                icon: const Icon(Icons.delete_outline, size: 20),
                                                color: ColorConstants.emergency,
                                                onPressed: () => _confirmDelete(doc.id),
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
            ],
          ),
        ),
      ),
    );
  }
}
