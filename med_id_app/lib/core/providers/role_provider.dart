import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/role_model.dart';

class RoleNotifier extends StateNotifier<Role> {
  RoleNotifier() : super(Role.patient);

  void switchRole(Role role) {
    state = role;
  }
}

final roleProvider = StateNotifierProvider<RoleNotifier, Role>((ref) => RoleNotifier());
