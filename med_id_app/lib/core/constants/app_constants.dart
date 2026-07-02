class AppConstants {
  static const String appName = 'MED-ID';
  static const String appTagline = 'Sog\'liq uchun yagona identifikator';
  static const double padding = 16.0;
  static const double radius = 16.0;
  static const double radiusSmall = 8.0;
  static const double radiusLarge = 24.0;
  static const String demoOtpCode = '123456';
  static const Duration splashDuration = Duration(seconds: 3);
  static const Duration networkDelay = Duration(milliseconds: 600);
  static const List<String> documentTypes = [
    'Lab Results',
    'Prescription',
    'Vaccination',
    'MRI',
    'CT',
    'Insurance Documents',
  ];
  static const List<String> bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  static const List<String> genders = ['Male', 'Female', 'Other'];
}
