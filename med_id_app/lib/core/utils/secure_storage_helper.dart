import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/role_model.dart';

class SecureStorageHelper {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';
  static const String _themeKey = 'theme_mode';
  static const String _onboardingKey = 'onboarding_done';
  static const String _biometricKey = 'biometric_enabled';
  static const String _roleKey = 'user_role';

  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  static Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  static Future<void> setThemeMode(bool isDark) async {
    await _storage.write(key: _themeKey, value: isDark.toString());
  }

  static Future<bool> getThemeMode() async {
    final value = await _storage.read(key: _themeKey);
    return value == 'true';
  }

  static Future<void> setOnboardingDone() async {
    await _storage.write(key: _onboardingKey, value: 'true');
  }

  static Future<bool> isOnboardingDone() async {
    final value = await _storage.read(key: _onboardingKey);
    return value == 'true';
  }

  static Future<void> setBiometricEnabled(bool value) async {
    await _storage.write(key: _biometricKey, value: value.toString());
  }

  static Future<bool> isBiometricEnabled() async {
    final value = await _storage.read(key: _biometricKey);
    return value == 'true';
  }

  static Future<void> saveRole(Role role) async {
    await _storage.write(key: _roleKey, value: role.name);
  }

  static Future<Role?> getRole() async {
    final value = await _storage.read(key: _roleKey);
    if (value == null) return null;
    return Role.values.firstWhere((r) => r.name == value, orElse: () => Role.patient);
  }

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
