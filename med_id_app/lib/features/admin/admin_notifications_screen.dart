import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/mock_api_service.dart';
import '../../core/models/notification_model.dart';
import '../../core/widgets/animated_button.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class AdminNotificationsScreen extends ConsumerStatefulWidget {
  const AdminNotificationsScreen({super.key});

  @override
  ConsumerState<AdminNotificationsScreen> createState() => _AdminNotificationsScreenState();
}

class _AdminNotificationsScreenState extends ConsumerState<AdminNotificationsScreen> {
  final _titleCtrl = TextEditingController();
  final _bodyCtrl = TextEditingController();
  String _type = NotificationType.system;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _bodyCtrl.dispose();
    super.dispose();
  }

  void _send() {
    if (_titleCtrl.text.trim().isEmpty || _bodyCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields'), backgroundColor: ColorConstants.emergency));
      return;
    }
    MockApiService().addNotification(NotificationModel(
      id: 'n${DateTime.now().millisecondsSinceEpoch}',
      userId: 'user1',
      title: _titleCtrl.text.trim(),
      body: _bodyCtrl.text.trim(),
      type: _type,
    ));
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Notification sent (demo)'), backgroundColor: ColorConstants.success));
    _titleCtrl.clear();
    _bodyCtrl.clear();
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
          appBar: AppBar(title: Text('Send Notification', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)), backgroundColor: Colors.transparent, elevation: 0),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Compose Notification', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                  const SizedBox(height: 20),
                  TextField(controller: _titleCtrl, decoration: const InputDecoration(labelText: 'Title', prefixIcon: Icon(Icons.title))),
                  const SizedBox(height: 16),
                  TextField(controller: _bodyCtrl, maxLines: 4, decoration: const InputDecoration(labelText: 'Body', prefixIcon: Icon(Icons.message), alignLabelWithHint: true)),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _type,
                    decoration: const InputDecoration(labelText: 'Type', prefixIcon: Icon(Icons.category)),
                    items: ['appointment', 'emergency', 'insurance', 'document', 'system'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                    onChanged: (v) => setState(() => _type = v!),
                  ),
                  const SizedBox(height: 24),
                  AnimatedButton(label: 'Send Notification', onPressed: _send),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
