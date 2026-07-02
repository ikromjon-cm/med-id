class MedicalProfileModel {
  final String id;
  final String patientId;
  final String fullName;
  final DateTime birthDate;
  final String gender;
  final String bloodType;
  final double height;
  final double weight;
  final List<String> allergies;
  final List<String> chronicDiseases;
  final List<String> currentMedications;
  final String? insuranceProvider;
  final String? insurancePolicyNumber;
  final DateTime? insuranceExpiry;
  final String? emergencyContactName;
  final String? emergencyContactPhone;
  final String? emergencyContactRelation;

  MedicalProfileModel({
    required this.id,
    required this.patientId,
    required this.fullName,
    required this.birthDate,
    required this.gender,
    required this.bloodType,
    this.height = 170,
    this.weight = 70,
    this.allergies = const [],
    this.chronicDiseases = const [],
    this.currentMedications = const [],
    this.insuranceProvider,
    this.insurancePolicyNumber,
    this.insuranceExpiry,
    this.emergencyContactName,
    this.emergencyContactPhone,
    this.emergencyContactRelation,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'patientId': patientId,
        'fullName': fullName,
        'birthDate': birthDate.toIso8601String(),
        'gender': gender,
        'bloodType': bloodType,
        'height': height,
        'weight': weight,
        'allergies': allergies,
        'chronicDiseases': chronicDiseases,
        'currentMedications': currentMedications,
        'insuranceProvider': insuranceProvider,
        'insurancePolicyNumber': insurancePolicyNumber,
        'insuranceExpiry': insuranceExpiry?.toIso8601String(),
        'emergencyContactName': emergencyContactName,
        'emergencyContactPhone': emergencyContactPhone,
        'emergencyContactRelation': emergencyContactRelation,
      };

  factory MedicalProfileModel.fromJson(Map<String, dynamic> json) => MedicalProfileModel(
        id: json['id'] as String,
        patientId: json['patientId'] as String,
        fullName: json['fullName'] as String,
        birthDate: DateTime.parse(json['birthDate'] as String),
        gender: json['gender'] as String,
        bloodType: json['bloodType'] as String,
        height: (json['height'] as num?)?.toDouble() ?? 170,
        weight: (json['weight'] as num?)?.toDouble() ?? 70,
        allergies: (json['allergies'] as List<dynamic>?)?.cast<String>() ?? [],
        chronicDiseases: (json['chronicDiseases'] as List<dynamic>?)?.cast<String>() ?? [],
        currentMedications: (json['currentMedications'] as List<dynamic>?)?.cast<String>() ?? [],
        insuranceProvider: json['insuranceProvider'] as String?,
        insurancePolicyNumber: json['insurancePolicyNumber'] as String?,
        insuranceExpiry: json['insuranceExpiry'] != null ? DateTime.parse(json['insuranceExpiry'] as String) : null,
        emergencyContactName: json['emergencyContactName'] as String?,
        emergencyContactPhone: json['emergencyContactPhone'] as String?,
        emergencyContactRelation: json['emergencyContactRelation'] as String?,
      );
}
