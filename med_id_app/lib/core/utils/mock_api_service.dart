import 'dart:math';
import '../models/user_model.dart';
import '../models/medical_profile_model.dart';
import '../models/document_model.dart';
import '../models/emergency_contact_model.dart';
import '../models/notification_model.dart';
import '../models/access_log_model.dart';

class MockApiService {
  static final MockApiService _instance = MockApiService._();
  factory MockApiService() => _instance;
  MockApiService._();

  final Random _random = Random();

  List<UserModel> _users = [];
  List<MedicalProfileModel> _profiles = [];
  List<DocumentModel> _documents = [];
  List<EmergencyContactModel> _contacts = [];
  List<NotificationModel> _notifications = [];
  List<AccessLogModel> _accessLogs = [];
  List<Map<String, dynamic>> _clinics = [];
  List<Map<String, dynamic>> _doctors = [];

  Future<void> _delay() => Future.delayed(Duration(milliseconds: 300 + _random.nextInt(500)));

  void initMockData() {
    _users = [
      UserModel(id: 'user1', fullName: 'Aziz Karimov', phone: '+998901234567', email: 'aziz@mail.uz', bloodType: 'A+', gender: 'Male', birthDate: DateTime(1990, 5, 15), insuranceProvider: 'Sug\'urta Kompaniyasi', insurancePolicyNumber: 'POL123456', insuranceExpiry: DateTime(2026, 12, 31), allergies: ['Penicillin', 'Latex'], chronicDiseases: ['Asthma'], currentMedications: ['Salbutamol', 'Vitamin D']),
      UserModel(id: 'user2', fullName: 'Dilnoza Rahimova', phone: '+998907654321', bloodType: 'O-', gender: 'Female', allergies: ['Sulfa'], currentMedications: []),
    ];
    _profiles = [
      MedicalProfileModel(id: 'prof1', patientId: 'user1', fullName: 'Aziz Karimov', birthDate: DateTime(1990, 5, 15), gender: 'Male', bloodType: 'A+', height: 178, weight: 75, allergies: ['Penicillin', 'Latex'], chronicDiseases: ['Asthma'], currentMedications: ['Salbutamol', 'Vitamin D'], insuranceProvider: 'Sug\'urta Kompaniyasi', insurancePolicyNumber: 'POL123456', insuranceExpiry: DateTime(2026, 12, 31), emergencyContactName: 'Gulnora Karimova', emergencyContactPhone: '+998935551122', emergencyContactRelation: 'Wife'),
    ];
    _documents = [
      DocumentModel(id: 'doc1', patientId: 'user1', name: 'Blood Analysis March 2026', type: 'Lab Results', notes: 'Routine checkup results', uploadDate: DateTime(2026, 3, 10), fileSize: 1.2),
      DocumentModel(id: 'doc2', patientId: 'user1', name: 'Chest X-Ray', type: 'MRI', uploadDate: DateTime(2026, 2, 20), fileSize: 3.5),
      DocumentModel(id: 'doc3', patientId: 'user1', name: 'Vaccination Card', type: 'Vaccination', uploadDate: DateTime(2026, 1, 15), fileSize: 0.5),
    ];
    _contacts = [
      EmergencyContactModel(id: 'ec1', patientId: 'user1', fullName: 'Gulnora Karimova', phone: '+998935551122', relation: 'Wife', isPrimary: true),
      EmergencyContactModel(id: 'ec2', patientId: 'user1', fullName: 'Botir Karimov', phone: '+998933331122', relation: 'Brother', email: 'botir@mail.uz'),
    ];
    _notifications = [
      NotificationModel(id: 'n1', userId: 'user1', title: 'Shifokor qabuli eslatmasi', body: 'Ertaga soat 10:00 da shifokor qabuli bor', type: NotificationType.appointment, timestamp: DateTime.now().subtract(const Duration(hours: 2)), isRead: false),
      NotificationModel(id: 'n2', userId: 'user1', title: 'Favqulodda kirish', body: 'Doktor Rahimov tibbiy ma\'lumotlaringizni ko\'rdi', type: NotificationType.emergency, timestamp: DateTime.now().subtract(const Duration(days: 1)), isRead: true),
      NotificationModel(id: 'n3', userId: 'user1', title: 'Sug\'urta muddati tugashi', body: 'Sug\'urta polisingiz 3 oydan keyin tugaydi', type: NotificationType.insurance, timestamp: DateTime.now().subtract(const Duration(days: 3)), isRead: false),
      NotificationModel(id: 'n4', userId: 'user1', title: 'Yangi hujjat yuklandi', body: 'Qon tahlili natijalari yuklandi', type: NotificationType.document, timestamp: DateTime.now().subtract(const Duration(days: 5)), isRead: true),
    ];
    _accessLogs = [
      AccessLogModel(id: 'al1', patientId: 'user1', accessedBy: 'Doktor Rahimov', accessorRole: 'Doctor', action: AccessAction.view, dataType: 'Medical Profile', timestamp: DateTime.now().subtract(const Duration(hours: 1))),
      AccessLogModel(id: 'al2', patientId: 'user1', accessedBy: 'Shifoxona 1 klinikasi', accessorRole: 'Clinic', action: AccessAction.edit, dataType: 'Documents', timestamp: DateTime.now().subtract(const Duration(days: 1))),
      AccessLogModel(id: 'al3', patientId: 'user1', accessedBy: 'Tez yordam brigadasi', accessorRole: 'Emergency Staff', action: AccessAction.view, dataType: 'Emergency Profile', timestamp: DateTime.now().subtract(const Duration(days: 2))),
      AccessLogModel(id: 'al4', patientId: 'user1', accessedBy: 'Aziz Karimov', accessorRole: 'Patient', action: AccessAction.view, dataType: 'Profile', timestamp: DateTime.now().subtract(const Duration(days: 3))),
      AccessLogModel(id: 'al5', patientId: 'user1', accessedBy: 'Admin Tizim', accessorRole: 'Admin', action: AccessAction.view, dataType: 'System Logs', timestamp: DateTime.now().subtract(const Duration(days: 7))),
    ];
    _clinics = List.generate(5, (i) => {
      'id': 'clinic${i + 1}',
      'name': ['Central Clinic', 'City Hospital', 'Family Health Center', 'Med+ Clinic', 'Health Pro'][i],
      'address': 'Tashkent, Uzbekistan',
      'phone': '+99890123456${i}',
      'doctorsCount': 5 + i * 3,
      'status': i % 3 == 0 ? 'inactive' : 'active',
    });
    _doctors = List.generate(8, (i) => {
      'id': 'doc${i + 1}',
      'fullName': ['Dr. Alisher Tursunov', 'Dr. Malika Azimova', 'Dr. Jahongir Sodiqov', 'Dr. Nilufar Yusupova', 'Dr. Ravshan Xodjayev', 'Dr. Zarnigor Ismoilova', 'Dr. Farrux Rahimov', 'Dr. Sabina Komilova'][i],
      'specialty': ['Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Orthopedics', 'Ophthalmology', 'General Surgery', 'Psychiatry'][i],
      'phone': '+99890987654${i}',
      'email': 'doctor${i + 1}@med.uz',
      'clinicId': 'clinic${(i % 5) + 1}',
      'status': i < 6 ? 'active' : 'inactive',
    });
  }

  // Auth
  Future<Map<String, dynamic>> login(String phone, String code) async {
    await _delay();
    if (code == '123456') {
      return {'success': true, 'token': _generateDummyJWT(), 'user': _users[0].toJson()};
    }
    return {'success': false, 'error': 'Invalid OTP code'};
  }

  String _generateDummyJWT() {
    return 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsIm5hbWUiOiJBeml6IEthcmltb3YiLCJpYXQiOjE3MTIzNDU2Nzh9.dummy_signature';
  }

  // User / Profile
  Future<UserModel> getUser(String userId) async {
    await _delay();
    return _users.firstWhere((u) => u.id == userId);
  }

  Future<UserModel> updateUser(String userId, UserModel updatedUser) async {
    await _delay();
    final index = _users.indexWhere((u) => u.id == userId);
    if (index == -1) throw Exception('User not found');
    _users[index] = updatedUser;
    return updatedUser;
  }

  Future<MedicalProfileModel> getMedicalProfile(String patientId) async {
    await _delay();
    return _profiles.firstWhere((p) => p.patientId == patientId);
  }

  Future<MedicalProfileModel> updateMedicalProfile(String patientId, MedicalProfileModel profile) async {
    await _delay();
    final index = _profiles.indexWhere((p) => p.patientId == patientId);
    if (index == -1) {
      _profiles.add(profile);
      return profile;
    }
    _profiles[index] = profile;
    return profile;
  }

  // Documents
  Future<List<DocumentModel>> getDocuments(String patientId) async {
    await _delay();
    return _documents.where((d) => d.patientId == patientId).toList();
  }

  Future<DocumentModel> addDocument(DocumentModel doc) async {
    await _delay();
    _documents.add(doc);
    return doc;
  }

  Future<void> deleteDocument(String docId) async {
    await _delay();
    _documents.removeWhere((d) => d.id == docId);
  }

  // Emergency Contacts
  Future<List<EmergencyContactModel>> getEmergencyContacts(String patientId) async {
    await _delay();
    return _contacts.where((c) => c.patientId == patientId).toList();
  }

  Future<EmergencyContactModel> addEmergencyContact(EmergencyContactModel contact) async {
    await _delay();
    if (contact.isPrimary) {
      _contacts = _contacts.map((c) => EmergencyContactModel(id: c.id, patientId: c.patientId, fullName: c.fullName, phone: c.phone, relation: c.relation, email: c.email, isPrimary: false)).toList();
    }
    _contacts.add(contact);
    return contact;
  }

  Future<EmergencyContactModel> updateEmergencyContact(EmergencyContactModel contact) async {
    await _delay();
    final index = _contacts.indexWhere((c) => c.id == contact.id);
    if (index == -1) throw Exception('Contact not found');
    if (contact.isPrimary) {
      _contacts = _contacts.map((c) => EmergencyContactModel(id: c.id, patientId: c.patientId, fullName: c.fullName, phone: c.phone, relation: c.relation, email: c.email, isPrimary: false)).toList();
    }
    _contacts[index] = contact;
    return contact;
  }

  Future<void> deleteEmergencyContact(String contactId) async {
    await _delay();
    _contacts.removeWhere((c) => c.id == contactId);
  }

  // Notifications
  Future<List<NotificationModel>> getNotifications(String userId) async {
    await _delay();
    return _notifications.where((n) => n.userId == userId).toList();
  }

  Future<void> markNotificationRead(String notificationId) async {
    await _delay();
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) _notifications[index] = _notifications[index].copyWith(isRead: true);
  }

  Future<void> addNotification(NotificationModel notification) async {
    await _delay();
    _notifications.insert(0, notification);
  }

  // Access Logs
  Future<List<AccessLogModel>> getAccessLogs(String patientId) async {
    await _delay();
    return _accessLogs.where((l) => l.patientId == patientId).toList();
  }

  // Admin
  Future<List<Map<String, dynamic>>> getClinics() async {
    await _delay();
    return _clinics;
  }

  Future<Map<String, dynamic>> addClinic(Map<String, dynamic> clinic) async {
    await _delay();
    clinic['id'] = 'clinic${_clinics.length + 1}';
    _clinics.add(clinic);
    return clinic;
  }

  Future<void> deleteClinic(String clinicId) async {
    await _delay();
    _clinics.removeWhere((c) => c['id'] == clinicId);
  }

  Future<List<Map<String, dynamic>>> getDoctors() async {
    await _delay();
    return _doctors;
  }

  Future<Map<String, dynamic>> addDoctor(Map<String, dynamic> doctor) async {
    await _delay();
    doctor['id'] = 'doc${_doctors.length + 1}';
    _doctors.add(doctor);
    return doctor;
  }

  Future<void> deleteDoctor(String doctorId) async {
    await _delay();
    _doctors.removeWhere((d) => d['id'] == doctorId);
  }

  Future<List<UserModel>> getUsers() async {
    await _delay();
    return _users;
  }

  Future<Map<String, dynamic>> getAdminStats() async {
    await _delay();
    return {
      'totalPatients': 1047,
      'totalDoctors': 258,
      'totalClinics': 112,
      'totalDocuments': 5432,
      'monthlyGrowth': [65, 78, 82, 95, 88, 102, 110, 120, 135, 145, 160, 175],
      'emergencyAccessCount': [12, 15, 8, 20, 18, 25, 22, 30, 28, 35, 40, 45],
      'documentStats': {'lab': 45, 'prescription': 30, 'vaccination': 15, 'mri': 5, 'ct': 3, 'insurance': 2},
      'roleStats': {'patient': 60, 'doctor': 20, 'clinic': 10, 'emergency': 8, 'admin': 2},
    };
  }

  Future<List<AccessLogModel>> getAllAccessLogs() async {
    await _delay();
    return _accessLogs;
  }
}
