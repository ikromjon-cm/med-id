import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:med_id_app/core/providers/auth_provider.dart';
import 'package:med_id_app/core/utils/mock_api_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    MockApiService().initMockData();
  });

  group('AuthProvider', () {
    testWidgets('initial state is uninitialized', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      final state = container.read(authProvider);
      expect(state.status, AuthStatus.uninitialized);
      expect(state.user, isNull);
    });

    testWidgets('loginWithOTP succeeds with code 123456', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await container.read(authProvider.notifier).loginWithOTP('998901234567', '123456');
      final state = container.read(authProvider);
      expect(state.status, AuthStatus.authenticated);
      expect(state.user, isNotNull);
    });

    testWidgets('loginWithOTP fails with wrong code', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await container.read(authProvider.notifier).loginWithOTP('998901234567', '000000');
      final state = container.read(authProvider);
      expect(state.status, AuthStatus.unauthenticated);
      expect(state.error, isNotNull);
    });

    testWidgets('logout resets state', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await container.read(authProvider.notifier).loginWithOTP('998901234567', '123456');
      expect(container.read(authProvider).status, AuthStatus.authenticated);

      await container.read(authProvider.notifier).logout();
      final state = container.read(authProvider);
      expect(state.status, AuthStatus.unauthenticated);
      expect(state.user, isNull);
    });
  });
}
