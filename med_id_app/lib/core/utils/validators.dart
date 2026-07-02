class Validators {
  static String? required(String? value) {
    if (value == null || value.trim().isEmpty) return 'This field is required';
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    final phoneRegExp = RegExp(r'^\+?[\d\s\-\(\)]{7,15}$');
    if (!phoneRegExp.hasMatch(value)) return 'Enter a valid phone number';
    return null;
  }

  static String? otp(String? value) {
    if (value == null || value.isEmpty) return 'OTP code is required';
    if (value.length != 6) return 'OTP must be 6 digits';
    if (!RegExp(r'^\d{6}$').hasMatch(value)) return 'OTP must be digits only';
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.isEmpty) return null;
    final emailRegExp = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegExp.hasMatch(value)) return 'Enter a valid email';
    return null;
  }

  static String? name(String? value) {
    if (value == null || value.trim().isEmpty) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  }

  static String? policyNumber(String? value) {
    if (value == null || value.trim().isEmpty) return 'Policy number is required';
    if (value.trim().length < 5) return 'Enter a valid policy number';
    return null;
  }
}
