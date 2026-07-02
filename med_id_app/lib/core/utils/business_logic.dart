import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'biometric_helper.dart';
import 'mock_api_service.dart';
import '../models/notification_model.dart';

class MedicalBusinessLogic {
  static final MockApiService _api = MockApiService();

  static Future<bool> handleBiometricAccess(WidgetRef ref) async {
    return await BiometricHelper.authenticate();
  }

  static Future<void> handleEmergencyMode(String userId) async {
    await _api.addNotification(NotificationModel(
      id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
      userId: userId,
      title: 'Emergency Mode Activated',
      body: 'Emergency access mode has been activated for your profile',
      type: NotificationType.emergency,
    ));
  }

  static Future<bool> requestPatientPermission(String doctorId, String patientId) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  static Future<void> notifyRelativesOnEmergencyAccess(String patientId) async {
    await _api.addNotification(NotificationModel(
      id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
      userId: patientId,
      title: 'Emergency Access',
      body: 'Your medical profile was accessed in an emergency',
      type: NotificationType.emergency,
    ));
  }

  static Future<void> checkInsuranceExpiry(String patientId) async {
    try {
      final user = await _api.getUser(patientId);
      if (user.insuranceExpiry != null) {
        final daysLeft = user.insuranceExpiry!.difference(DateTime.now()).inDays;
        if (daysLeft <= 15 && daysLeft >= 0) {
          await _api.addNotification(NotificationModel(
            id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
            userId: patientId,
            title: 'Insurance Expiry Reminder',
            body: 'Your insurance will expire in $daysLeft days',
            type: NotificationType.insurance,
          ));
        }
      }
    } catch (_) {}
  }
}
