package com.medid.service;

import com.medid.config.JwtUtil;
import com.medid.dto.LoginRequest;
import com.medid.dto.LoginResponse;
import com.medid.dto.UserDto;
import com.medid.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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
}
