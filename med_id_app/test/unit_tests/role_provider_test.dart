import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:med_id_app/core/providers/role_provider.dart';
import 'package:med_id_app/core/models/role_model.dart';

void main() {
  group('RoleProvider', () {
    test('initial role is patient', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      expect(container.read(roleProvider), Role.patient);
    });

    test('switchRole changes to doctor', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.doctor);
      expect(container.read(roleProvider), Role.doctor);
    });

    test('switchRole changes to admin', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.admin);
      expect(container.read(roleProvider), Role.admin);
    });

    test('switchRole changes to clinic', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.clinic);
      expect(container.read(roleProvider), Role.clinic);
    });

    test('switchRole changes to emergencyStaff', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.emergencyStaff);
      expect(container.read(roleProvider), Role.emergencyStaff);
    });
  });
}
