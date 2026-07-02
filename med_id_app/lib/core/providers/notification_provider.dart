import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/notification_model.dart';
import '../utils/mock_api_service.dart';

class NotificationState {
  final bool isLoading;
  final String? error;
  final List<NotificationModel> notifications;

  const NotificationState({this.isLoading = false, this.error, this.notifications = const []});

  NotificationState copyWith({bool? isLoading, String? error, List<NotificationModel>? notifications}) {
    return NotificationState(isLoading: isLoading ?? this.isLoading, error: error, notifications: notifications ?? this.notifications);
  }
}

class NotificationNotifier extends StateNotifier<NotificationState> {
  final MockApiService _api = MockApiService();

  NotificationNotifier() : super(const NotificationState());

  Future<void> loadNotifications(String userId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final notifs = await _api.getNotifications(userId);
      state = NotificationState(isLoading: false, notifications: notifs);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> markAsRead(String notificationId) async {
    await _api.markNotificationRead(notificationId);
    state = state.copyWith(
      notifications: state.notifications.map((n) => n.id == notificationId ? n.copyWith(isRead: true) : n).toList(),
    );
  }

  int get unreadCount => state.notifications.where((n) => !n.isRead).length;
}

final notificationProvider = StateNotifierProvider<NotificationNotifier, NotificationState>((ref) => NotificationNotifier());
