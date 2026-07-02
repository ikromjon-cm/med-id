package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.model.*;
import com.medid.repository.UserRepository;
import com.medid.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final UserRepository userRepository;
    private final AppointmentService appointmentService;
    private final DiagnosisService diagnosisService;
    private final PrescriptionService prescriptionService;

    public DoctorController(UserRepository userRepository,
                            AppointmentService appointmentService,
                            DiagnosisService diagnosisService,
                            PrescriptionService prescriptionService) {
        this.userRepository = userRepository;
        this.appointmentService = appointmentService;
        this.diagnosisService = diagnosisService;
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/{id}/patients")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPatients(@PathVariable String id) {
        var patients = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.PATIENT)
            .map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("phone", u.getPhone());
                m.put("bloodType", u.getBloodType());
                return m;
            })
            .toList();
        return ResponseEntity.ok(ApiResponse.ok(patients));
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.findByDoctorId(id)));
    }

    @PostMapping("/diagnosis")
    public ResponseEntity<ApiResponse<Diagnosis>> addDiagnosis(@RequestBody Diagnosis diagnosis) {
        return ResponseEntity.ok(ApiResponse.ok(diagnosisService.create(diagnosis), "Diagnosis added"));
    }

    @GetMapping("/diagnosis/{patientId}")
    public ResponseEntity<ApiResponse<List<Diagnosis>>> getPatientDiagnoses(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(diagnosisService.findByPatientId(patientId)));
    }

    @PostMapping("/prescription")
    public ResponseEntity<ApiResponse<Prescription>> addPrescription(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(ApiResponse.ok(prescriptionService.create(prescription), "Prescription added"));
    }

    @GetMapping("/prescription/{patientId}")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPatientPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(prescriptionService.findByPatientId(patientId)));
    }

    @PutMapping("/appointment/{id}/status")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointmentStatus(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        var status = Appointment.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.updateStatus(id, status), "Status updated"));
    }

    @PostMapping("/request-access/{patientId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestAccess(@PathVariable String patientId) {
        Map<String, Object> result = new HashMap<>();
        result.put("patientId", patientId);
        result.put("accessGranted", true);
        result.put("message", "Full patient access granted (simulated)");
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
