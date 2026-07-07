import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/utils/business_logic.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/color_constants.dart';

class EmergencyBiometricScreen extends ConsumerStatefulWidget {
  const EmergencyBiometricScreen({super.key});

  @override
  ConsumerState<EmergencyBiometricScreen> createState() => _EmergencyBiometricScreenState();
}

class _EmergencyBiometricScreenState extends ConsumerState<EmergencyBiometricScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _pulseAnim;
  bool _authenticating = false;
  bool _success = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500));
    _pulseAnim = Tween<double>(begin: 1.0, end: 1.15).animate(CurvedAnimation(parent: _animController, curve: Curves.easeInOut));
    _animController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _authenticate() async {
    setState(() => _authenticating = true);
    final success = await MedicalBusinessLogic.handleBiometricAccess(ref);
    if (success) {
      setState(() { _authenticating = false; _success = true; });
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) context.go('/emergency/profile/user1');
    } else {
      setState(() => _authenticating = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biometrik tekshirish muvaffaqiyatsiz'), backgroundColor: ColorConstants.emergency));
      }
    }
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
            title: Text('Biometrik kirish', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
            backgroundColor: Colors.transparent, elevation: 0,
          ),
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FadeInDown(
                    child: GlassCard(
                      child: Container(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          children: [
                            AnimatedBuilder(
                              animation: _pulseAnim,
                              builder: (_, child) => Transform.scale(
                                scale: _pulseAnim.value,
                                child: Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: _success ? ColorConstants.success.withValues(alpha: 0.1) : ColorConstants.emergency.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(24),
                                    border: Border.all(
                                      color: _success ? ColorConstants.success : ColorConstants.emergency.withValues(alpha: 0.3),
                                      width: 2,
                                    ),
                                  ),
                                  child: Icon(
                                    _success ? Icons.fingerprint : Icons.fingerprint,
                                    size: 80,
                                    color: _success ? ColorConstants.success : ColorConstants.emergency,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              _success ? 'Kirish ruxsat berildi!' : 'Favqulodda biometrik kirish',
                              style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21)),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _success ? 'Favqulodda profilga yo\'naltirilmoqda...' : 'Favqulodda tibbiy ma\'lumotlarga kirish uchun biometrik tekshiruvdan foydalaning',
                              style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500]),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: _authenticating ? null : _authenticate,
                                icon: _authenticating
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                    : const Icon(Icons.fingerprint),
                                label: Text(_authenticating ? 'Tekshirilmoqda...' : 'Tasdiqlash'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _success ? ColorConstants.success : ColorConstants.emergency,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
