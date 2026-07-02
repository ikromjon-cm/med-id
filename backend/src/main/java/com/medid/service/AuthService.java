package com.medid.service;

import com.medid.config.JwtUtil;
import com.medid.dto.LoginRequest;
import com.medid.dto.LoginResponse;
import com.medid.dto.UserDto;
import com.medid.model.AccessLog;
import com.medid.model.Role;
import com.medid.repository.AccessLogRepository;
import com.medid.repository.MedicalProfileRepository;
import com.medid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AccessLogRepository accessLogRepository;
    private final MedicalProfileRepository medicalProfileRepository;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil,
                       AccessLogRepository accessLogRepository,
                       MedicalProfileRepository medicalProfileRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.accessLogRepository = accessLogRepository;
        this.medicalProfileRepository = medicalProfileRepository;
    }

    public LoginResponse login(LoginRequest request) {
        var userOpt = userRepository.findByPhone(request.phone());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with phone: " + request.phone());
        }
        if (!"123456".equals(request.code())) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        var user = userOpt.get();
        var token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return new LoginResponse(token, UserDto.from(user));
    }

    public LoginResponse biometricLogin(String biometricData) {
        var user = userRepository.findAll().stream()
            .filter(u -> u.getRole() == com.medid.model.Role.PATIENT)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Biometric verification failed"));
        var token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return new LoginResponse(token, UserDto.from(user));
    }

    public LoginResponse refreshToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
        var userId = jwtUtil.extractUserId(token);
        var role = jwtUtil.extractRole(token);
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var newToken = jwtUtil.generateToken(user.getId(), role);
        return new LoginResponse(newToken, UserDto.from(user));
    }

    public void handleBiometricSuccess(String userId) {
        var log = new AccessLog();
        log.setUserId(userId);
        log.setAccessedByUserId(userId);
        log.setAction("BIOMETRIC_LOGIN");
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress("biometric-device");
        accessLogRepository.save(log);
    }

    public long checkInsuranceExpiry(String userId) {
        var profile = medicalProfileRepository.findByUserId(userId);
        if (profile.isEmpty() || profile.get().getInsuranceNumber() == null) {
            return -1;
        }
        return 30;
    }

    public List<UserDto> getUserByRole(Role role) {
        return userRepository.findByRole(role).stream()
            .map(UserDto::from)
            .toList();
    }
}
