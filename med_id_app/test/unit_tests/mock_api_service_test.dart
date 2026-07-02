import 'package:flutter_test/flutter_test.dart';
import 'package:med_id_app/core/utils/mock_api_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late MockApiService service;

  setUp(() {
    service = MockApiService();
    service.initMockData();
  });

  group('MockApiService', () {
    testWidgets('getAdminStats returns valid stats', (tester) async {
      final stats = await service.getAdminStats();
      expect(stats['totalPatients'], 13);
      expect(stats['totalDoctors'], 3);
      expect(stats['totalClinics'], 5);
      expect(stats['totalDocuments'], greaterThan(0));
    });

    testWidgets('getDocuments returns list', (tester) async {
      final docs = await service.getDocuments('user1');
      expect(docs, isA<List>());
    });

    testWidgets('getEmergencyContacts returns list', (tester) async {
      final contacts = await service.getEmergencyContacts('user1');
      expect(contacts, isA<List>());
    });

    testWidgets('getNotifications returns list', (tester) async {
      final notifications = await service.getNotifications('user1');
      expect(notifications, isA<List>());
    });

    testWidgets('getAccessLogs returns list', (tester) async {
      final logs = await service.getAccessLogs('user1');
      expect(logs, isA<List>());
    });

    testWidgets('addDocument adds to list', (tester) async {
      final before = await service.getDocuments('user1');
      await service.addDocument({
        'id': 'test_doc',
        'patientId': 'user1',
        'name': 'Test Document',
        'type': 'Lab Results',
        'fileSize': 1.5,
      });
      final after = await service.getDocuments('user1');
      expect(after.length, before.length + 1);
    });

    testWidgets('deleteDocument removes from list', (tester) async {
      final docs = await service.getDocuments('user1');
      if (docs.isNotEmpty) {
        await service.deleteDocument(docs.first['id']);
        final after = await service.getDocuments('user1');
        expect(after.length, docs.length - 1);
      }
    });
  });
}
