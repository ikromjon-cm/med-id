class EmergencyContactModel {
  final String id;
  final String patientId;
  final String fullName;
  final String phone;
  final String relation;
  final String? email;
  final bool isPrimary;

  EmergencyContactModel({
    required this.id,
    required this.patientId,
    required this.fullName,
    required this.phone,
    required this.relation,
    this.email,
    this.isPrimary = false,
  });

  EmergencyContactModel copyWith({
    String? fullName,
    String? phone,
    String? relation,
    String? email,
    bool? isPrimary,
  }) {
    return EmergencyContactModel(
      id: id,
      patientId: patientId,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      relation: relation ?? this.relation,
      email: email ?? this.email,
      isPrimary: isPrimary ?? this.isPrimary,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'patientId': patientId,
        'fullName': fullName,
        'phone': phone,
        'relation': relation,
        'email': email,
        'isPrimary': isPrimary,
      };

  factory EmergencyContactModel.fromJson(Map<String, dynamic> json) => EmergencyContactModel(
        id: json['id'] as String,
        patientId: json['patientId'] as String,
        fullName: json['fullName'] as String,
        phone: json['phone'] as String,
        relation: json['relation'] as String,
        email: json['email'] as String?,
        isPrimary: json['isPrimary'] as bool? ?? false,
      );
}
