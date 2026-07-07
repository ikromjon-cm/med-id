import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'onboarding_page.dart';
import '../../core/utils/secure_storage_helper.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  final _pages = const [
    OnboardingPage(
      image: 'security',
      title: "Ma'lumotlaringiz doimo xavfsiz",
      description: "MED-ID platformasi eng so'nggi shifrlash texnologiyalari bilan tibbiy ma'lumotlaringizni himoya qiladi.",
      iconData: Icons.security,
    ),
    OnboardingPage(
      image: 'biometric',
      title: 'Biometrik tezkor kirish',
      description: "Barmoq izi yoki yuz tanish orqali bir zumda profilingizga kiring. Xavfsiz va qulay.",
      iconData: Icons.fingerprint,
    ),
    OnboardingPage(
      image: 'emergency',
      title: "Shoshilinch vaziyatda hayotni saqlab qoling",
      description: "Favqulodda vaziyatlarda shifokorlar sizning muhim tibbiy ma'lumotlaringizga tezda kirishlari mumkin.",
      iconData: Icons.emergency,
    ),
  ];

  void _onSkip() async {
    await SecureStorageHelper.setOnboardingDone();
    if (mounted) context.go('/otp');
  }

  void _onNext() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    } else {
      _onSkip();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
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
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Align(
                alignment: Alignment.topRight,
                child: TextButton(onPressed: _onSkip, child: Text('O\'tkazib yuborish', style: GoogleFonts.inter(fontSize: 16, color: const Color(0xFF0F6FFF)))),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (i) => setState(() => _currentPage = i),
                  itemCount: _pages.length,
                  itemBuilder: (_, i) => _pages[i],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _currentPage > 0
                        ? TextButton(
                            onPressed: () => _pageController.previousPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut),
                            child: Text('Orqaga', style: GoogleFonts.inter(fontSize: 16, color: const Color(0xFF0F6FFF))),
                          )
                        : const SizedBox(width: 60),
                    Row(
                      children: List.generate(_pages.length, (i) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _currentPage == i ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(4),
                          color: _currentPage == i ? const Color(0xFF0F6FFF) : (isDark ? Colors.grey[600] : Colors.grey[300]),
                        ),
                      )),
                    ),
                    ElevatedButton(
                      onPressed: _onNext,
                      style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: Text(_currentPage == _pages.length - 1 ? 'Boshlash' : 'Keyingi'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
