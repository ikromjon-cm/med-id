import 'package:flutter/material.dart';
import '../constants/color_constants.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;
  final List<Color>? colors;
  final Alignment begin;
  final Alignment end;

  const GradientBackground({
    super.key,
    required this.child,
    this.colors,
    this.begin = Alignment.topLeft,
    this.end = Alignment.bottomRight,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final gradientColors = colors ?? [
      isDark ? ColorConstants.darkBackground : ColorConstants.background,
      isDark ? const Color(0xFF0D1B2A) : const Color(0xFFE8F0FE),
    ];

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: begin,
          end: end,
        ),
      ),
      child: child,
    );
  }
}
