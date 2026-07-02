class DocumentModel {
  final String id;
  final String patientId;
  final String name;
  final String type;
  final String? filePath;
  final String? notes;
  final DateTime uploadDate;
  final double fileSize;

  DocumentModel({
    required this.id,
    required this.patientId,
    required this.name,
    required this.type,
    this.filePath,
    this.notes,
    DateTime? uploadDate,
    this.fileSize = 0,
  }) : uploadDate = uploadDate ?? DateTime.now();

  Map<String, dynamic> toJson() => {
        'id': id,
        'patientId': patientId,
        'name': name,
        'type': type,
        'filePath': filePath,
        'notes': notes,
        'uploadDate': uploadDate.toIso8601String(),
        'fileSize': fileSize,
      };

  factory DocumentModel.fromJson(Map<String, dynamic> json) => DocumentModel(
        id: json['id'] as String,
        patientId: json['patientId'] as String,
        name: json['name'] as String,
        type: json['type'] as String,
        filePath: json['filePath'] as String?,
        notes: json['notes'] as String?,
        uploadDate: DateTime.parse(json['uploadDate'] as String),
        fileSize: (json['fileSize'] as num?)?.toDouble() ?? 0,
      );
}
