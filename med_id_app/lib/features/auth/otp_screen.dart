import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/widgets/animated_button.dart';

class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({super.key});

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final _phoneController = TextEditingController(text: '+998901234567');
  final _otpController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _showOtp = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _sendOtp() {
    if (_formKey.currentState!.validate()) {
      setState(() => _showOtp = true);
    }
  }

  void _verifyOtp() async {
    if (_formKey.currentState!.validate()) {
      await ref.read(authProvider.notifier).loginWithOTP(_phoneController.text, _otpController.text);
      final authState = ref.read(authProvider);
      if (authState.status == AuthStatus.authenticated && mounted) {
        context.go('/biometric');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);
    final isLoading = authState.status == AuthStatus.loading;

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
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80, height: 80,
                      decoration: BoxDecoration(color: const Color(0xFF0F6FFF).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                      child: const Icon(Icons.phone_android, size: 40, color: Color(0xFF0F6FFF)),
                    ),
                    const SizedBox(height: 24),
                    Text('Telefon raqam orqali kirish', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF1A1D21))),
                    const SizedBox(height: 8),
                    Text('Demo: istalgan raqam, kod: 123456', style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                    const SizedBox(height: 32),
                    if (!_showOtp) ...[
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(labelText: 'Telefon raqam', prefixIcon: Icon(Icons.phone)),
                        validator: (v) => v == null || v.isEmpty ? 'Telefon raqam kiriting' : null,
                      ),
                      const SizedBox(height: 24),
                      AnimatedButton(label: 'Kodni yuborish', onPressed: _sendOtp, isLoading: isLoading),
                    ] else ...[
                      TextFormField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 8),
                        decoration: const InputDecoration(counterText: '', labelText: 'Tasdiqlash kodi', hintText: '123456'),
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Kodni kiriting';
                          if (v.length != 6) return '6 xonali kod kiriting';
                          return null;
                        },
                        onChanged: (v) {
                          if (v.length == 6) _verifyOtp();
                        },
                      ),
                      const SizedBox(height: 24),
                      AnimatedButton(label: 'Tasdiqlash', onPressed: _verifyOtp, isLoading: isLoading),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () => setState(() => _showOtp = false),
                        child: Text('Raqamni o\'zgartirish', style: GoogleFonts.inter(color: const Color(0xFF0F6FFF))),
                      ),
                    ],
                    if (authState.error != null) ...[
                      const SizedBox(height: 16),
                      Text(authState.error!, style: GoogleFonts.inter(color: const Color(0xFFFF4D4F), fontSize: 14)),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
