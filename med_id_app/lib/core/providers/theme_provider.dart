import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/secure_storage_helper.dart';

class ThemeNotifier extends StateNotifier<bool> {
  ThemeNotifier() : super(false) {
    _init();
  }

  Future<void> _init() async {
    final isDark = await SecureStorageHelper.getThemeMode();
    state = isDark;
  }

  Future<void> toggleTheme() async {
    state = !state;
    await SecureStorageHelper.setThemeMode(state);
  }

  Future<void> setTheme(bool isDark) async {
    state = isDark;
    await SecureStorageHelper.setThemeMode(isDark);
  }
}

final themeProvider = StateNotifierProvider<ThemeNotifier, bool>((ref) => ThemeNotifier());
