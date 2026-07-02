package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.LoginRequest;
import com.medid.dto.LoginResponse;
import com.medid.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        var response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/biometric")
    public ResponseEntity<ApiResponse<LoginResponse>> biometric(@RequestBody Map<String, String> body) {
        var response = authService.biometricLogin(body.getOrDefault("biometricData", "mock"));
        return ResponseEntity.ok(ApiResponse.ok(response, "Biometric login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@RequestBody Map<String, String> body) {
        var response = authService.refreshToken(body.get("token"));
        return ResponseEntity.ok(ApiResponse.ok(response, "Token refreshed"));
    }
}
