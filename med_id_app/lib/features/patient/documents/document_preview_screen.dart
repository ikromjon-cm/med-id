import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/document_provider.dart';

class DocumentPreviewScreen extends ConsumerWidget {
  final String docId;
  const DocumentPreviewScreen({super.key, required this.docId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final docs = ref.watch(documentProvider).documents;
    final doc = docs.where((d) => d.id == docId).firstOrNull;

    if (doc == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Document')),
        body: const Center(child: Text('Document not found')),
      );
    }

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
            title: Text('Preview', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  height: 300,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF21262D) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? Colors.white12 : Colors.grey[200]!),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.description, size: 80, color: isDark ? Colors.grey[600] : Colors.grey[300]),
                        const SizedBox(height: 16),
                        Text('File Preview', style: GoogleFonts.inter(fontSize: 16, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                        Text('(Demo preview)', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[600] : Colors.grey[400])),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                _infoRow('Name', doc.name, isDark),
                _infoRow('Type', doc.type, isDark),
                _infoRow('Uploaded', DateFormat('dd MMM yyyy, HH:mm').format(doc.uploadDate), isDark),
                _infoRow('Size', '${doc.fileSize.toStringAsFixed(1)} MB', isDark),
                if (doc.notes != null) _infoRow('Notes', doc.notes!, isDark),
                const Spacer(),
                SizedBox(
                  width: double.infinity, height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('File downloaded (demo)')));
                    },
                    icon: const Icon(Icons.download),
                    label: Text('Download', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
          Expanded(child: Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? Colors.white : const Color(0xFF1A1D21)), textAlign: TextAlign.right)),
        ],
      ),
    );
  }
}
