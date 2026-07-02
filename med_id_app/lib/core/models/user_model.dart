class UserModel {
  final String id;
  final String fullName;
  final String phone;
  final String? email;
  final String? avatarUrl;
  final String? bloodType;
  final String? gender;
  final DateTime? birthDate;
  final String? insuranceProvider;
  final String? insurancePolicyNumber;
  final DateTime? insuranceExpiry;
  final List<String> allergies;
  final List<String> chronicDiseases;
  final List<String> currentMedications;

  UserModel({
    required this.id,
    required this.fullName,
    required this.phone,
    this.email,
    this.avatarUrl,
    this.bloodType,
    this.gender,
    this.birthDate,
    this.insuranceProvider,
    this.insurancePolicyNumber,
    this.insuranceExpiry,
    this.allergies = const [],
    this.chronicDiseases = const [],
    this.currentMedications = const [],
  });

  UserModel copyWith({
    String? id,
    String? fullName,
    String? phone,
    String? email,
    String? avatarUrl,
    String? bloodType,
    String? gender,
    DateTime? birthDate,
    String? insuranceProvider,
    String? insurancePolicyNumber,
    DateTime? insuranceExpiry,
    List<String>? allergies,
    List<String>? chronicDiseases,
    List<String>? currentMedications,
  }) {
    return UserModel(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bloodType: bloodType ?? this.bloodType,
      gender: gender ?? this.gender,
      birthDate: birthDate ?? this.birthDate,
      insuranceProvider: insuranceProvider ?? this.insuranceProvider,
      insurancePolicyNumber: insurancePolicyNumber ?? this.insurancePolicyNumber,
      insuranceExpiry: insuranceExpiry ?? this.insuranceExpiry,
      allergies: allergies ?? this.allergies,
      chronicDiseases: chronicDiseases ?? this.chronicDiseases,
      currentMedications: currentMedications ?? this.currentMedications,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'fullName': fullName,
        'phone': phone,
        'email': email,
        'avatarUrl': avatarUrl,
        'bloodType': bloodType,
        'gender': gender,
        'birthDate': birthDate?.toIso8601String(),
        'insuranceProvider': insuranceProvider,
        'insurancePolicyNumber': insurancePolicyNumber,
        'insuranceExpiry': insuranceExpiry?.toIso8601String(),
        'allergies': allergies,
        'chronicDiseases': chronicDiseases,
        'currentMedications': currentMedications,
      };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'] as String,
        fullName: json['fullName'] as String,
        phone: json['phone'] as String,
        email: json['email'] as String?,
        avatarUrl: json['avatarUrl'] as String?,
        bloodType: json['bloodType'] as String?,
        gender: json['gender'] as String?,
        birthDate: json['birthDate'] != null ? DateTime.parse(json['birthDate'] as String) : null,
        insuranceProvider: json['insuranceProvider'] as String?,
        insurancePolicyNumber: json['insurancePolicyNumber'] as String?,
        insuranceExpiry: json['insuranceExpiry'] != null ? DateTime.parse(json['insuranceExpiry'] as String) : null,
        allergies: (json['allergies'] as List<dynamic>?)?.cast<String>() ?? [],
        chronicDiseases: (json['chronicDiseases'] as List<dynamic>?)?.cast<String>() ?? [],
        currentMedications: (json['currentMedications'] as List<dynamic>?)?.cast<String>() ?? [],
      );
}
