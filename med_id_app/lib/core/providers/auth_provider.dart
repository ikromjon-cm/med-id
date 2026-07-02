import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../utils/mock_api_service.dart';
import '../utils/secure_storage_helper.dart';

enum AuthStatus { uninitialized, authenticated, unauthenticated, loading }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? token;
  final String? error;

  const AuthState({this.status = AuthStatus.uninitialized, this.user, this.token, this.error});

  AuthState copyWith({AuthStatus? status, UserModel? user, String? token, String? error}) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      token: token ?? this.token,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final MockApiService _api = MockApiService();

  AuthNotifier() : super(const AuthState()) {
    _init();
  }

  Future<void> _init() async {
    final token = await SecureStorageHelper.getToken();
    if (token != null) {
      state = AuthState(status: AuthStatus.authenticated, token: token, user: _getDummyUser());
    } else {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  UserModel _getDummyUser() {
    return UserModel(
      id: 'user1',
      fullName: 'Aziz Karimov',
      phone: '+998901234567',
      email: 'aziz@mail.uz',
      bloodType: 'A+',
      gender: 'Male',
      birthDate: DateTime(1990, 5, 15),
      insuranceProvider: 'Sug\'urta Kompaniyasi',
      insurancePolicyNumber: 'POL123456',
      insuranceExpiry: DateTime(2026, 12, 31),
      allergies: ['Penicillin', 'Latex'],
      chronicDiseases: ['Asthma'],
      currentMedications: ['Salbutamol', 'Vitamin D'],
    );
  }

  Future<void> loginWithOTP(String phone, String code) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final result = await _api.login(phone, code);
      if (result['success'] == true) {
        final token = result['token'] as String;
        await SecureStorageHelper.saveToken(token);
        state = AuthState(
          status: AuthStatus.authenticated,
          token: token,
          user: result['user'] != null ? UserModel.fromJson(result['user'] as Map<String, dynamic>) : _getDummyUser(),
        );
      } else {
        state = state.copyWith(status: AuthStatus.unauthenticated, error: result['error'] as String? ?? 'Login failed');
      }
    } catch (e) {
      state = state.copyWith(status: AuthStatus.unauthenticated, error: e.toString());
    }
  }

  Future<void> simulateBiometricLogin() async {
    state = state.copyWith(status: AuthStatus.loading);
    await Future.delayed(const Duration(milliseconds: 800));
    final token = 'bio_dummy_jwt_token';
    await SecureStorageHelper.saveToken(token);
    state = AuthState(status: AuthStatus.authenticated, token: token, user: _getDummyUser());
  }

  Future<void> logout() async {
    await SecureStorageHelper.deleteToken();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());
