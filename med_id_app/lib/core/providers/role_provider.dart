import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/role_model.dart';
import '../utils/secure_storage_helper.dart';

class RoleNotifier extends StateNotifier<Role> {
  RoleNotifier() : super(Role.patient) {
    _loadSavedRole();
  }

  Future<void> _loadSavedRole() async {
    final savedRole = await SecureStorageHelper.getRole();
    if (savedRole != null) {
      state = savedRole;
    }
  }

  void switchRole(Role role) {
    state = role;
    SecureStorageHelper.saveRole(role);
  }
}

final roleProvider = StateNotifierProvider<RoleNotifier, Role>((ref) => RoleNotifier());
