package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.MedicalProfileDto;
import com.medid.dto.UserDto;
import com.medid.service.MedicalProfileService;
import com.medid.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrController {

    private final UserService userService;
    private final MedicalProfileService medicalProfileService;

    public QrController(UserService userService, MedicalProfileService medicalProfileService) {
        this.userService = userService;
        this.medicalProfileService = medicalProfileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQrData(@PathVariable String userId) {
        var user = userService.findById(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.id());
        data.put("name", user.name());
        data.put("phone", user.phone());
        data.put("bloodType", user.bloodType());
        data.put("qrCode", "MEDID-" + user.id() + "-" + System.currentTimeMillis());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/scan/{qrData}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scanQr(@PathVariable String qrData) {
        var parts = qrData.split("-");
        var userId = parts.length >= 2 ? parts[1] : "10";
        try {
            var user = userService.findById(userId);
            MedicalProfileDto profile;
            try {
                profile = medicalProfileService.findByUserId(userId);
            } catch (Exception e) {
                profile = null;
            }
            Map<String, Object> emergencyInfo = new HashMap<>();
            emergencyInfo.put("bloodType", user.bloodType());
            emergencyInfo.put("allergies", user.allergies());
            emergencyInfo.put("chronicConditions", user.chronicConditions());
            emergencyInfo.put("emergencyNotes", user.emergencyNotes());

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("medicalProfile", profile);
            data.put("emergencyInfo", emergencyInfo);
            return ResponseEntity.ok(ApiResponse.ok(data, "Emergency profile retrieved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid QR data"));
        }
    }
}
