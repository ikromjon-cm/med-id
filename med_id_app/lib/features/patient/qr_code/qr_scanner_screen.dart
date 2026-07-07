import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../core/constants/color_constants.dart';

class QrScannerScreen extends ConsumerStatefulWidget {
  const QrScannerScreen({super.key});

  @override
  ConsumerState<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends ConsumerState<QrScannerScreen> {
  MobileScannerController? _controller;
  bool _hasScanned = false;

  @override
  void initState() {
    super.initState();
    _controller = MobileScannerController();
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_hasScanned) return;
    final barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      if (barcode.rawValue != null) {
        _hasScanned = true;
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('QR Kod skanerlandi'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Favqulodda profilga kirildi:'),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: ColorConstants.emergency.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                  child: Text(barcode.rawValue!, style: GoogleFonts.inter(fontSize: 12)),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _hasScanned = false;
                },
                child: const Text('Qayta skanerlash'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _hasScanned = false;
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Favqulodda profil ochildi (demo)'),
                    backgroundColor: ColorConstants.emergency,
                  ));
                },
                child: const Text('Favqulodda profilni ochish'),
              ),
            ],
          ),
        );
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('QR Kodni skanerlash', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
        backgroundColor: isDark ? const Color(0xFF0D1117) : ColorConstants.background,
        iconTheme: IconThemeData(color: isDark ? Colors.white : Colors.black),
      ),
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                MobileScanner(
                  controller: _controller,
                  onDetect: _onDetect,
                ),
                Center(
                  child: Container(
                    width: 250,
                    height: 250,
                    decoration: BoxDecoration(
                      border: Border.all(color: ColorConstants.primary, width: 3),
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 30,
                  left: 0,
                  right: 0,
                  child: Text('Kamerani MED-ID QR kodga qarating', style: GoogleFonts.inter(fontSize: 14, color: Colors.white, fontWeight: FontWeight.w500), textAlign: TextAlign.center),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF161B22) : Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.info_outline, size: 16, color: isDark ? Colors.grey[400] : Colors.grey[500]),
                    const SizedBox(width: 8),
                    Text('Skanerlash favqulodda ma\'lumotlarga kirish imkonini beradi', style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.grey[400] : Colors.grey[500])),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity, height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () => _controller?.toggleTorch(),
                    icon: const Icon(Icons.flash_on),
                    label: Text('Chiroqni yoqish/o\'chirish', style: GoogleFonts.inter(fontSize: 14)),
                    style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
