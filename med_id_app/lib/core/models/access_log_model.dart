class AccessLogModel {
  final String id;
  final String patientId;
  final String accessedBy;
  final String accessorRole;
  final String action;
  final String dataType;
  final DateTime timestamp;
  final String? ipAddress;
  final String? location;

  AccessLogModel({
    required this.id,
    required this.patientId,
    required this.accessedBy,
    required this.accessorRole,
    required this.action,
    required this.dataType,
    DateTime? timestamp,
    this.ipAddress,
    this.location,
  }) : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toJson() => {
        'id': id,
        'patientId': patientId,
        'accessedBy': accessedBy,
        'accessorRole': accessorRole,
        'action': action,
        'dataType': dataType,
        'timestamp': timestamp.toIso8601String(),
        'ipAddress': ipAddress,
        'location': location,
      };

  factory AccessLogModel.fromJson(Map<String, dynamic> json) => AccessLogModel(
        id: json['id'] as String,
        patientId: json['patientId'] as String,
        accessedBy: json['accessedBy'] as String,
        accessorRole: json['accessorRole'] as String,
        action: json['action'] as String,
        dataType: json['dataType'] as String,
        timestamp: DateTime.parse(json['timestamp'] as String),
        ipAddress: json['ipAddress'] as String?,
        location: json['location'] as String?,
      );
}

class AccessAction {
  static const String view = 'viewed';
  static const String edit = 'edited';
  static const String upload = 'uploaded';
  static const String delete = 'deleted';
  static const String share = 'shared';
}
