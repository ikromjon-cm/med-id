package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.model.*;
import com.medid.repository.AccessLogRepository;
import com.medid.repository.UserRepository;
import com.medid.service.EmergencyAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    private final EmergencyAlertService alertService;
    private final UserRepository userRepository;
    private final AccessLogRepository accessLogRepository;

    public EmergencyController(EmergencyAlertService alertService,
                                UserRepository userRepository,
                                AccessLogRepository accessLogRepository) {
        this.alertService = alertService;
        this.userRepository = userRepository;
        this.accessLogRepository = accessLogRepository;
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<Iterable<EmergencyAlert>>> getActiveAlerts() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getActiveAlerts()));
    }

    @PostMapping("/access")
    public ResponseEntity<ApiResponse<Map<String, Object>>> logEmergencyAccess(@RequestBody Map<String, String> body) {
        var patientId = body.get("patientId");
        var responderId = body.getOrDefault("responderId", "emergency-1");

        var log = new AccessLog();
        log.setUserId(patientId);
        log.setAccessedByUserId(responderId);
        log.setAction("EMERGENCY_ACCESS");
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress("emergency-session");
        accessLogRepository.save(log);

        var alert = new EmergencyAlert();
        alert.setPatientId(patientId);
        alert.setTriggeredBy(responderId);
        alert.setStatus(EmergencyAlert.Status.ACTIVE);
        alert.setAccessedAt(LocalDateTime.now());
        alertService.createAlert(alert);

        Map<String, Object> result = new HashMap<>();
        result.put("accessGranted", true);
        result.put("patientId", patientId);
        result.put("message", "Emergency access logged");
        return ResponseEntity.ok(ApiResponse.ok(result, "Emergency access granted"));
    }

    @GetMapping("/profile/{patientId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmergencyProfile(@PathVariable String patientId) {
        var user = userRepository.findById(patientId)
            .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));

        Map<String, Object> emergencyData = new HashMap<>();
        emergencyData.put("patientId", user.getId());
        emergencyData.put("name", user.getName());
        emergencyData.put("bloodType", user.getBloodType());
        emergencyData.put("allergies", user.getAllergies());
        emergencyData.put("chronicConditions", user.getChronicConditions());
        emergencyData.put("emergencyNotes", user.getEmergencyNotes());

        return ResponseEntity.ok(ApiResponse.ok(emergencyData, "Emergency profile retrieved"));
    }

    @PostMapping("/resolve/{id}")
    public ResponseEntity<ApiResponse<EmergencyAlert>> resolveAlert(
            @PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        var staffId = body != null ? body.getOrDefault("staffId", "emergency-admin") : "emergency-admin";
        var notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(ApiResponse.ok(alertService.resolveAlert(id, staffId, notes), "Alert resolved"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getStats()));
    }
}
