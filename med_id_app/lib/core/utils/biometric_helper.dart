import 'package:local_auth/local_auth.dart';

class BiometricHelper {
  static final LocalAuthentication _auth = LocalAuthentication();

  static Future<bool> isAvailable() async {
    try {
      return await _auth.canCheckBiometrics || await _auth.isDeviceSupported();
    } catch (e) {
      return false;
    }
  }

  static Future<bool> authenticate() async {
    try {
      if (!await isAvailable()) return false;
      final result = await _auth.authenticate(
        localizedReason: 'MED-ID ga kirish uchun biometriyani tasdiqlang',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
        ),
      );
      return result;
    } catch (e) {
      return false;
    }
  }

  static Future<BiometricType?> getBiometricType() async {
    try {
      final available = await _auth.getAvailableBiometrics();
      if (available.contains(BiometricType.face)) return BiometricType.face;
      if (available.contains(BiometricType.fingerprint)) return BiometricType.fingerprint;
      if (available.contains(BiometricType.iris)) return BiometricType.iris;
      return null;
    } catch (e) {
      return null;
    }
  }
}
