import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/access_log_model.dart';
import '../utils/mock_api_service.dart';

class AccessLogState {
  final bool isLoading;
  final String? error;
  final List<AccessLogModel> logs;

  const AccessLogState({this.isLoading = false, this.error, this.logs = const []});

  AccessLogState copyWith({bool? isLoading, String? error, List<AccessLogModel>? logs}) {
    return AccessLogState(isLoading: isLoading ?? this.isLoading, error: error, logs: logs ?? this.logs);
  }
}

class AccessLogNotifier extends StateNotifier<AccessLogState> {
  final MockApiService _api = MockApiService();

  AccessLogNotifier() : super(const AccessLogState());

  Future<void> loadLogs(String patientId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final logs = await _api.getAccessLogs(patientId);
      state = AccessLogState(isLoading: false, logs: logs);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadAllLogs() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final logs = await _api.getAllAccessLogs();
      state = AccessLogState(isLoading: false, logs: logs);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final accessLogProvider = StateNotifierProvider<AccessLogNotifier, AccessLogState>((ref) => AccessLogNotifier());
