import 'package:flutter_test/flutter_test.dart';
import 'package:med_id_app/core/utils/validators.dart';

void main() {
  group('Validators', () {
    test('phone accepts valid phone', () {
      final result = Validators.phone('+998901234567');
      expect(result, isNull);
    });

    test('phone rejects empty phone', () {
      final result = Validators.phone('');
      expect(result, isNotNull);
    });

    test('otp accepts 6-digit code', () {
      final result = Validators.otp('123456');
      expect(result, isNull);
    });

    test('otp rejects short code', () {
      final result = Validators.otp('123');
      expect(result, isNotNull);
    });

    test('otp rejects empty code', () {
      final result = Validators.otp('');
      expect(result, isNotNull);
    });

    test('name accepts valid name', () {
      final result = Validators.name('Aziz Karimov');
      expect(result, isNull);
    });

    test('name rejects empty name', () {
      final result = Validators.name('');
      expect(result, isNotNull);
    });

    test('email accepts valid email', () {
      final result = Validators.email('test@medid.uz');
      expect(result, isNull);
    });

    test('email rejects invalid email', () {
      final result = Validators.email('invalid');
      expect(result, isNotNull);
    });

    test('required rejects null', () {
      final result = Validators.required(null);
      expect(result, isNotNull);
    });

    test('required accepts non-empty', () {
      final result = Validators.required('text');
      expect(result, isNull);
    });
  });
}
