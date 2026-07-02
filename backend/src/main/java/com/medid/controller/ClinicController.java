package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.model.*;
import com.medid.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinic")
public class ClinicController {

    private final ClinicQueueService queueService;
    private final ClinicStaffService staffService;
    private final ClinicFinanceService financeService;
    private final AppointmentService appointmentService;

    public ClinicController(ClinicQueueService queueService,
                            ClinicStaffService staffService,
                            ClinicFinanceService financeService,
                            AppointmentService appointmentService) {
        this.queueService = queueService;
        this.staffService = staffService;
        this.financeService = financeService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(@PathVariable String id) {
        var queue = queueService.getQueueByClinic(id);
        var waitingCount = queue.stream().filter(q -> q.getStatus() == ClinicQueue.Status.WAITING).count();
        var withDoctorCount = queue.stream().filter(q -> q.getStatus() == ClinicQueue.Status.WITH_DOCTOR).count();
        var staffCount = staffService.findByClinicId(id).size();
        var doctorCount = staffService.findDoctorsByClinic(id).size();
        var appointments = appointmentService.findByClinicId(id);
        var upcomingCount = appointments.stream().filter(a -> a.getStatus() == Appointment.Status.UPCOMING).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("queueWaiting", waitingCount);
        stats.put("queueWithDoctor", withDoctorCount);
        stats.put("totalStaff", staffCount);
        stats.put("totalDoctors", doctorCount);
        stats.put("upcomingAppointments", upcomingCount);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/{id}/queue")
    public ResponseEntity<ApiResponse<List<ClinicQueue>>> getQueue(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.getQueueByClinic(id)));
    }

    @PostMapping("/{id}/queue")
    public ResponseEntity<ApiResponse<ClinicQueue>> addToQueue(@PathVariable String id, @RequestBody ClinicQueue entry) {
        entry.setClinicId(id);
        return ResponseEntity.ok(ApiResponse.ok(queueService.addToQueue(entry), "Added to queue"));
    }

    @PostMapping("/{id}/queue/next")
    public ResponseEntity<ApiResponse<ClinicQueue>> callNext(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.callNext(id), "Next patient called"));
    }

    @GetMapping("/{id}/doctors")
    public ResponseEntity<ApiResponse<List<ClinicStaff>>> getDoctors(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.findDoctorsByClinic(id)));
    }

    @PutMapping("/doctor-schedule")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateDoctorSchedule(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Schedule updated (simulated)"), "Schedule updated"));
    }

    @GetMapping("/{id}/staff")
    public ResponseEntity<ApiResponse<List<ClinicStaff>>> getStaff(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.findByClinicId(id)));
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<ClinicStaff>> addStaff(@RequestBody ClinicStaff staff) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.create(staff), "Staff added"));
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<ClinicStaff>> updateStaff(@PathVariable String id, @RequestBody ClinicStaff staff) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.update(id, staff), "Staff updated"));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable String id) {
        staffService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Staff deleted"));
    }

    @GetMapping("/{id}/finance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinance(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(financeService.getClinicFinanceSummary(id)));
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.findByClinicId(id)));
    }

    @PostMapping("/appointment")
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.create(appointment), "Appointment created"));
    }
}
