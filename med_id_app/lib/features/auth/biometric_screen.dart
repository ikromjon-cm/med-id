import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/utils/biometric_helper.dart';
import '../../core/utils/secure_storage_helper.dart';
import '../../core/widgets/glass_card.dart';

class BiometricScreen extends ConsumerStatefulWidget {
  const BiometricScreen({super.key});

  @override
  ConsumerState<BiometricScreen> createState() => _BiometricScreenState();
}

class _BiometricScreenState extends ConsumerState<BiometricScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500));
    _pulseAnimation = Tween<double>(begin: 1, end: 1.1).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _enableBiometric() async {
    final available = await BiometricHelper.isAvailable();
    if (!available) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biometriya qurilmada mavjud emas')));
      }
      return;
    }
    final authenticated = await BiometricHelper.authenticate();
    if (authenticated) {
      await SecureStorageHelper.setBiometricEnabled(true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biometriya yoqildi'), backgroundColor: Color(0xFF00C896)));
        context.go('/role-selection');
      }
    }
  }

  Future<void> _skip() async {
    await SecureStorageHelper.setBiometricEnabled(false);
    if (mounted) context.go('/role-selection');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isDark
                ? [const Color(0xFF0D1117), const Color(0xFF161B22)]
                : [const Color(0xFFF8FAFC), const Color(0xFFE8F0FE)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedBuilder(
                    animation: _pulseAnimation,
                    builder: (context, child) => Transform.scale(
                      scale: _pulseAnimation.value,
                      child: Container(
                        width: 120, height: 120,
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F6FFF).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: const Icon(Icons.fingerprint, size: 60, color: Color(0xFF0F6FFF)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text('Biometrik kirishni yoqing', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                  const SizedBox(height: 12),
                  Text('Barmoq izi yoki yuz tanish orqali profilingizga xavfsiz kiring', style: GoogleFonts.inter(fontSize: 16, color: isDark ? Colors.grey[400] : Colors.grey[500]), textAlign: TextAlign.center),
                  const SizedBox(height: 40),
                  GlassCard(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        _benefitRow(Icons.lock, 'Maxfiy ma\'lumotlaringiz himoyada'),
                        const SizedBox(height: 12),
                        _benefitRow(Icons.bolt, 'Bir zumda kirish'),
                        const SizedBox(height: 12),
                        _benefitRow(Icons.refresh, 'Har safar parol kiritmaysiz'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity, height: 52,
                    child: ElevatedButton.icon(
                      onPressed: _enableBiometric,
                      icon: const Icon(Icons.fingerprint),
                      label: Text('Biometriyani yoqish', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                      style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(onPressed: _skip, child: Text('Keyinroq sozlash', style: GoogleFonts.inter(fontSize: 16, color: isDark ? Colors.grey[400] : Colors.grey[500]))),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _benefitRow(IconData icon, String text) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: const Color(0xFF00C896).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 20, color: const Color(0xFF00C896)),
        ),
        const SizedBox(width: 12),
        Text(text, style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[300] : Colors.grey[700])),
      ],
    );
  }
}
