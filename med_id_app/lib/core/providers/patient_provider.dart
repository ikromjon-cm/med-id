import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../models/medical_profile_model.dart';
import '../utils/mock_api_service.dart';

class PatientState {
  final bool isLoading;
  final String? error;
  final UserModel? user;
  final MedicalProfileModel? profile;

  const PatientState({this.isLoading = false, this.error, this.user, this.profile});

  PatientState copyWith({bool? isLoading, String? error, UserModel? user, MedicalProfileModel? profile}) {
    return PatientState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      user: user ?? this.user,
      profile: profile ?? this.profile,
    );
  }
}

class PatientNotifier extends StateNotifier<PatientState> {
  final MockApiService _api = MockApiService();

  PatientNotifier() : super(const PatientState());

  Future<void> loadPatient(String userId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await _api.getUser(userId);
      MedicalProfileModel? profile;
      try {
        profile = await _api.getMedicalProfile(userId);
      } catch (_) {}
      state = PatientState(isLoading: false, user: user, profile: profile);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> updateProfile(MedicalProfileModel profile) async {
    state = state.copyWith(isLoading: true);
    try {
      final updated = await _api.updateMedicalProfile(profile.patientId, profile);
      state = state.copyWith(isLoading: false, profile: updated);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final patientProvider = StateNotifierProvider<PatientNotifier, PatientState>((ref) => PatientNotifier());
