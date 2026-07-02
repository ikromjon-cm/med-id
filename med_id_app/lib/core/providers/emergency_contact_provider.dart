import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/emergency_contact_model.dart';
import '../utils/mock_api_service.dart';

class EmergencyContactState {
  final bool isLoading;
  final String? error;
  final List<EmergencyContactModel> contacts;

  const EmergencyContactState({this.isLoading = false, this.error, this.contacts = const []});

  EmergencyContactState copyWith({bool? isLoading, String? error, List<EmergencyContactModel>? contacts}) {
    return EmergencyContactState(isLoading: isLoading ?? this.isLoading, error: error, contacts: contacts ?? this.contacts);
  }
}

class EmergencyContactNotifier extends StateNotifier<EmergencyContactState> {
  final MockApiService _api = MockApiService();

  EmergencyContactNotifier() : super(const EmergencyContactState());

  Future<void> loadContacts(String patientId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contacts = await _api.getEmergencyContacts(patientId);
      state = EmergencyContactState(isLoading: false, contacts: contacts);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> addContact(EmergencyContactModel contact) async {
    try {
      final added = await _api.addEmergencyContact(contact);
      state = state.copyWith(contacts: [...state.contacts, added]);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> updateContact(EmergencyContactModel contact) async {
    try {
      final updated = await _api.updateEmergencyContact(contact);
      state = state.copyWith(contacts: state.contacts.map((c) => c.id == updated.id ? updated : c).toList());
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> deleteContact(String contactId) async {
    try {
      await _api.deleteEmergencyContact(contactId);
      state = state.copyWith(contacts: state.contacts.where((c) => c.id != contactId).toList());
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

final emergencyContactProvider = StateNotifierProvider<EmergencyContactNotifier, EmergencyContactState>((ref) => EmergencyContactNotifier());
