import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/providers/document_provider.dart';
import '../../../core/models/document_model.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/color_constants.dart';
import '../../../core/widgets/animated_button.dart';

class DocumentUploadScreen extends ConsumerStatefulWidget {
  const DocumentUploadScreen({super.key});

  @override
  ConsumerState<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends ConsumerState<DocumentUploadScreen> {
  final _nameCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();
  String _selectedType = AppConstants.documentTypes.first;
  String? _fileName;
  XFile? _selectedFile;
  final _picker = ImagePicker();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    final result = await _picker.pickImage(source: ImageSource.gallery, maxWidth: 1920);
    if (result != null) {
      setState(() {
        _selectedFile = result;
        _fileName = _selectedFile!.name;
        if (_nameCtrl.text.isEmpty) _nameCtrl.text = _fileName!.split('.').first;
      });
    }
  }

  void _upload() {
    if (_nameCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter document name'), backgroundColor: ColorConstants.emergency));
      return;
    }
    if (_selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a file'), backgroundColor: ColorConstants.emergency));
      return;
    }

    final doc = DocumentModel(
      id: 'doc${DateTime.now().millisecondsSinceEpoch}',
      patientId: 'user1',
      name: _nameCtrl.text.trim(),
      type: _selectedType,
      notes: _notesCtrl.text.isNotEmpty ? _notesCtrl.text.trim() : null,
      fileSize: 1.5,
    );

    ref.read(documentProvider.notifier).addDocument(doc);
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document uploaded successfully'), backgroundColor: Color(0xFF00C896)));
    context.pop();
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
            title: Text('Upload Document', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InkWell(
                  onTap: _pickFile,
                  child: Container(
                    width: double.infinity,
                    height: 180,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF21262D) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.white12 : Colors.grey[300]!, width: 2, strokeAlign: BorderSide.strokeAlignInside),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_selectedFile != null ? Icons.check_circle : Icons.cloud_upload_outlined, size: 48, color: _selectedFile != null ? const Color(0xFF00C896) : const Color(0xFF0F6FFF)),
                        const SizedBox(height: 12),
                        Text(_selectedFile != null ? _fileName! : 'Tap to select file', style: GoogleFonts.inter(fontSize: 16, color: isDark ? Colors.grey[300] : Colors.grey[600])),
                        Text('PDF, PNG, JPG supported', style: GoogleFonts.inter(fontSize: 12, color: isDark ? Colors.grey[500] : Colors.grey[400])),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(labelText: 'Document Name', prefixIcon: Icon(Icons.text_fields)),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedType,
                  decoration: const InputDecoration(labelText: 'Document Type', prefixIcon: Icon(Icons.category)),
                  items: AppConstants.documentTypes.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                  onChanged: (v) => setState(() => _selectedType = v!),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _notesCtrl,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Notes (optional)', prefixIcon: Icon(Icons.notes), alignLabelWithHint: true),
                ),
                const SizedBox(height: 32),
                AnimatedButton(label: 'Upload Document', onPressed: _upload),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
