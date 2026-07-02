class NotificationService {
  static final NotificationService _instance = NotificationService._();
  factory NotificationService() => _instance;
  NotificationService._();

  Future<void> initialize() async {}

  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    // Local notification simulation
  }

  Future<String?> getDeviceToken() async {
    return 'dummy_device_token';
  }
}
