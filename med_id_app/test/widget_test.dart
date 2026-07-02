import 'package:flutter_test/flutter_test.dart';
import 'package:med_id_app/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MedIdApp());
    expect(find.text('MED-ID'), findsNothing);
  });
}
