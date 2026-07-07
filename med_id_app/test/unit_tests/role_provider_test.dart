import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:med_id_app/core/providers/role_provider.dart';
import 'package:med_id_app/core/models/role_model.dart';
import 'package:flutter/material.dart';

void main() {
  group('RoleProvider', () {
    testWidgets('initial role is patient', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      expect(container.read(roleProvider), Role.patient);
    });

    testWidgets('switchRole changes to doctor', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.doctor);
      expect(container.read(roleProvider), Role.doctor);
    });

    testWidgets('switchRole changes to admin', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.admin);
      expect(container.read(roleProvider), Role.admin);
    });

    testWidgets('switchRole changes to clinic', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.clinic);
      expect(container.read(roleProvider), Role.clinic);
    });

    testWidgets('switchRole changes to emergencyStaff', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      container.read(roleProvider.notifier).switchRole(Role.emergencyStaff);
      expect(container.read(roleProvider), Role.emergencyStaff);
    });
  });
}
