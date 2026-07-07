import 'dart:collection';
import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class OfflineManager {
  static final Connectivity _connectivity = Connectivity();
  static final Map<String, dynamic> _cache = HashMap();

  static Future<bool> isOnline() async {
    final result = await _connectivity.checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }

  static Stream<List<ConnectivityResult>> get connectivityStream =>
      _connectivity.onConnectivityChanged;

  static Future<void> cacheProfileData(WidgetRef ref, String key, dynamic data) async {
    _cache[key] = data;
    debugPrint('[OfflineManager] cached $key');
  }

  static Future<void> syncQueue(WidgetRef ref, String clinicId) async {
    debugPrint('[OfflineManager] syncQueue for clinic $clinicId');
    if (await isOnline()) {
      debugPrint('[OfflineManager] Online — would sync now');
    } else {
      debugPrint('[OfflineManager] Offline — queued for later');
    }
  }

  static Future<void> recoverFromOffline(WidgetRef ref) async {
    debugPrint('[OfflineManager] recoverFromOffline — ${_cache.length} cached entries');
    for (final entry in _cache.entries) {
      debugPrint('[OfflineManager] recovering ${entry.key}');
    }
  }
}
