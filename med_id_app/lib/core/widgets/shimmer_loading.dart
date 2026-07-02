import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/color_constants.dart';

class ShimmerLoading extends StatelessWidget {
  final int itemCount;
  final double itemHeight;
  final double itemWidth;

  const ShimmerLoading({
    super.key,
    this.itemCount = 5,
    this.itemHeight = 80,
    this.itemWidth = double.infinity,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Shimmer.fromColors(
      baseColor: isDark ? Colors.grey[800]! : ColorConstants.shimmerBase,
      highlightColor: isDark ? Colors.grey[700]! : ColorConstants.shimmerHighlight,
      child: Column(
        children: List.generate(
          itemCount,
          (i) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
            child: Container(
              height: itemHeight,
              width: itemWidth,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
